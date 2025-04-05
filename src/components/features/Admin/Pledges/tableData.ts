import dayjs from "dayjs";
import { Donation } from "../../../../lib/client/helpers/hooks/admin.hooks";
import { CURRENCY } from "@prisma/client";

type DataEntry = {
  id: string;
  name: string | null;
  contact: string | null;
  phoneVerificationCount: number;
  monetaryAmount: number;
  screenshots?: string[];
  currency?: string;
  transferMethodId: string | null;
  inKindContributions?: string;
  date: string;
};

type Summary = {
  totalEntries: number;
  totalMonetaryContributionInUSD: number;
  totalMonetaryContributionInETB: number;
};

export type ProcessOptions = {
  filterByCurrency?: CURRENCY;
  filterByContact?: string;
  filterByTransferMethod?: string;
  filterByAmountGreaterThan?: number;
  filterByAmountLessThan?: number;
  filterByInKindItem?: string;
  filterByStatus?: "contributed" | "screenshot-uploaded";
  filterByDateFrom?: string;
  filterByDateTo?: string;
  sortBy?:
    | "name"
    | "contact"
    | "date"
    | "monetaryAmount"
    | "inKindContributions"
    | "transferMethodId"
    | null;
  sortOrder?: "asc" | "desc";
};

export function processData(
  data: Donation[],
  options: ProcessOptions = {}
): { tableData: DataEntry[]; summary: Summary } {
  let tableData: DataEntry[] = data.map((entry) => ({
    id: entry.id,
    name: entry.name || null,
    date: entry.createdAt,
    contact: entry.phone || entry.email || null,
    phoneVerificationCount: entry.phoneVerifications
      ? entry.phoneVerifications.length
      : 0,
    monetaryAmount: entry.monetaryContribution
      ? entry.monetaryContribution.amount || 0
      : 0,
    screenshots: entry.monetaryContribution?.transferConfirmations?.map(
      (s) => s?.screenShotUrl
    ),
    currency: entry.monetaryContribution?.currency,
    transferMethodId: entry.monetaryContribution
      ? entry.monetaryContribution.transferMethodId || null
      : null,
    inKindContributions: entry.inKindContribution?.inKindItemSelections
      ?.map(
        (selection) =>
          `${selection.inKindItem?.name} (${selection.amount}${selection.inKindItem?.unit})`
      )
      ?.join(", "),
  }));

  // Apply filtering
  if (options.filterByStatus === "contributed") {
    tableData = tableData.filter(
      (entry) => !!entry.monetaryAmount || !!entry.inKindContributions
    );
  }

  if (options.filterByDateFrom) {
    tableData = tableData.filter((entry) =>
      dayjs(entry.date).isAfter(dayjs(options.filterByDateFrom))
    );
  }

  if (options.filterByDateTo) {
    tableData = tableData.filter((entry) =>
      dayjs(entry.date).isBefore(dayjs(options.filterByDateTo))
    );
  }

  if (options.filterByStatus === "screenshot-uploaded") {
    tableData = tableData.filter((entry) => !!entry.screenshots?.length);
  }

  if (options.filterByCurrency) {
    tableData = tableData.filter(
      (entry) => entry.currency && entry.currency === options?.filterByCurrency
    );
  }

  if (options.filterByContact) {
    tableData = tableData.filter(
      (entry) =>
        entry.contact && entry.contact.includes(options.filterByContact || "")
    );
  }
  if (options.filterByTransferMethod) {
    tableData = tableData.filter(
      (entry) =>
        entry.transferMethodId &&
        entry.transferMethodId.includes(options.filterByTransferMethod || "")
    );
  }
  if (options.filterByAmountGreaterThan !== undefined) {
    tableData = tableData.filter(
      (entry) =>
        (entry?.currency === "USD" ? 124 : 1 * entry.monetaryAmount) >
        (options.filterByAmountGreaterThan || -1)
    );
  }
  if (options.filterByAmountLessThan !== undefined) {
    tableData = tableData.filter(
      (entry) =>
        (entry?.currency === "USD" ? 124 : 1 * entry.monetaryAmount) <
        (options.filterByAmountLessThan || Infinity)
    );
  }
  if (options.filterByInKindItem) {
    tableData = tableData.filter((entry) =>
      entry.inKindContributions?.includes(options.filterByInKindItem || "")
    );
  }

  // Apply sorting
  if (options.sortBy) {
    tableData = [...tableData].toSorted((a, b) => {
      const valueA = a[options.sortBy!];
      const valueB = b[options.sortBy!];
      if (options?.sortBy === "monetaryAmount") {
        const amountA =
          ((valueA as number) || 0) * (a.currency === "USD" ? 124 : 1);
        const amountB =
          ((valueB as number) || 0) * (b.currency === "USD" ? 124 : 1);
        return options.sortOrder === "desc"
          ? amountB - amountA
          : amountA - amountB;
      }
      if (dayjs(valueA).isValid() && dayjs(valueB).isValid()) {
        console.log("DATE");
        return options.sortOrder === "desc"
          ? dayjs(valueB).diff(dayjs(valueA))
          : dayjs(valueA).diff(dayjs(valueB));
      }
      if (typeof valueA === "string" && typeof valueB === "string") {
        return options.sortOrder === "desc"
          ? valueB.localeCompare(valueA)
          : valueA.localeCompare(valueB);
      } else {
        return options.sortOrder === "desc"
          ? (valueB as number) - (valueA as number)
          : (valueA as number) - (valueB as number);
      }
    });
  }

  // Compute summary
  const summary: Summary = {
    totalEntries: tableData.length,
    totalMonetaryContributionInUSD: tableData
      ?.filter((d) => d?.currency === "USD")
      .reduce((sum, entry) => sum + entry.monetaryAmount, 0),
    totalMonetaryContributionInETB: tableData
      ?.filter((d) => d?.currency === "ETB")
      .reduce((sum, entry) => sum + entry.monetaryAmount, 0),
  };

  return { tableData, summary };
}
