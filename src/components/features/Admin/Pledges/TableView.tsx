import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { processData, ProcessOptions } from "./tableData";
import { useGetPledges } from "@/lib/client/helpers/hooks/admin.hooks";
import {
  ArrowUpDown,
  InfoIcon,
  ListCollapseIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  SortAscIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransferMethods } from "@/lib/client/helpers/hooks/pledge.hooks";
import dayjs from "dayjs";
import { SelectVanilla } from "@/components/ui/select-vanilla";
import { CURRENCY } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/client/helpers/cn";
import Link from "next/link";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { exportCSV } from "./exportCSV";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const InteractiveTable = () => {
  const query = useGetPledges();
  const [processOptions, setProcessOptions] = useState<ProcessOptions>({
    filterByStatus: "contributed",
  });
  const { data: transferMethods, isLoading } = useTransferMethods();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const filteredSortedData = useMemo(() => {
    return processData(query.data?.data || [], processOptions);
  }, [query, processOptions]);

  const handleSort = (key: ProcessOptions["sortBy"]) => {
    setProcessOptions((prev) => ({
      ...prev,
      sortBy: key,
      sortOrder:
        prev?.sortBy === key && prev?.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleClearFilters = () => {
    setProcessOptions({
      filterByStatus: "contributed",
    });
  };

  const handleExportCSV = () => {
    const csvData =
      filteredSortedData?.tableData.map((row) => ({
        ...row,
        screenshots: row.screenshots?.join(", ") || "",
      })) || [];
    exportCSV(csvData, "pledges.csv");
  };

  console.log({
    processOptions: Object.values(processOptions).filter(Boolean).length,
  });

  const filterApplied =
    processOptions.filterByStatus === "contributed" &&
    Object.values(processOptions)?.filter(Boolean).length === 1;

  return (
    <div className="pb-16">
      <div className="flex justify-between items-center mb-4 border-b border-border p-4">
        <h1 className="text-2xl font-semibold">Pledges</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Export CSV</Button>
          </DialogTrigger>
          <DialogContent className="rounded-none max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Export CSV</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {filterApplied ? (
                <p>
                  This will export all pledges that have reached the thank you
                  step.
                </p>
              ) : (
                <p>
                  Filters are applied, so the CSV will include only the visible
                  data. To export everything, clear all filters first.
                </p>
              )}
            </DialogDescription>
            <DialogFooter className="flex sm:flex-col gap-2">
              <Button onClick={handleExportCSV}>Export CSV</Button>
              {!filterApplied && (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    handleClearFilters();
                    handleExportCSV();
                  }}
                >
                  Clear filters and Export CSV
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex ">
        <div
          className={cn(
            "flex flex-col gap-4 mb-4 border-r border-border p-4 w-[300px] min-w-[300px] transition-all",
            {
              "p-2 md:p-4 w-[52px] min-w-[52px] md:w-[68px] md:min-w-[68px]":
                !isSidebarOpen,
            }
          )}
        >
          <div
            className={cn(
              "flex justify-between items-center gap-4 cursor-pointer",
              {
                "flex-col-reverse": !isSidebarOpen,
              }
            )}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <h4
              className={cn("text-base md:text-lg font-semibold", {
                "rotate-90": !isSidebarOpen,
              })}
            >
              Filters
            </h4>

            <Button variant={"ghost"} size={"icon"}>
              {isSidebarOpen ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
            </Button>
          </div>
          <div
            className={cn("flex flex-col gap-4", { hidden: !isSidebarOpen })}
          >
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <SelectVanilla
                id="status"
                value={processOptions?.filterByStatus}
                onChange={(e) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByStatus: e.target.value as
                      | "contributed"
                      | "screenshot-uploaded",
                  })
                }
              >
                <option value={""}>All</option>
                <option value={"contributed"}>Contributed</option>
                <option value={"screenshot-uploaded"}>
                  Screenshot uploaded{" "}
                </option>
              </SelectVanilla>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                placeholder="Filter by Contact"
                onChange={(e) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByContact: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferMethod">Transfer Method</Label>
              <Input
                id="transferMethod"
                placeholder="Transfer Method"
                onChange={(e) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByTransferMethod: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <SelectVanilla
                id="currency"
                onChange={(e) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByCurrency: e.target.value as CURRENCY,
                  })
                }
              >
                <option value={""}>All Currencies</option>
                <option value={"ETB"}>ETB</option>
                <option value={"USD"}>USD </option>
              </SelectVanilla>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minAmount">Minimum Amount (ETB)</Label>
              <Input
                id="minAmount"
                placeholder="Min Amount (ETB)"
                type="number"
                onChange={(e) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByAmountGreaterThan: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAmount">Maximum Amount (ETB)</Label>
              <Input
                id="maxAmount"
                placeholder="Max Amount (ETB)"
                type="number"
                onChange={(e) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByAmountLessThan: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inKindItem">In-Kind Item</Label>
              <Input
                id="inKindItem"
                placeholder="In-Kind Item"
                onChange={(e) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByInKindItem: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange
                placeholder="Filter by date"
                value={{
                  from: processOptions.filterByDateFrom
                    ? new Date(processOptions.filterByDateFrom)
                    : undefined,
                  to: processOptions.filterByDateTo
                    ? new Date(processOptions.filterByDateTo)
                    : undefined,
                }}
                onChange={(date) =>
                  setProcessOptions({
                    ...processOptions,
                    filterByDateFrom: date?.from
                      ? date.from.toISOString()
                      : undefined,
                    filterByDateTo: date?.to
                      ? date.to.toISOString()
                      : undefined,
                  })
                }
              />
            </div>

            <Button
              variant={"outline"}
              onClick={handleClearFilters}
              className="mt-4"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="flex-1 ml-4 w-[calc(100%_-_300px)] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>
                  <Button variant={"link"} onClick={() => handleSort("date")}>
                    Date
                    <ArrowUpDown />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant={"link"} onClick={() => handleSort("name")}>
                    Name
                    <ArrowUpDown />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant={"link"}
                    onClick={() => handleSort("contact")}
                  >
                    Contact
                    <ArrowUpDown />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant={"link"}
                    onClick={() => handleSort("monetaryAmount")}
                  >
                    Amount
                    <ArrowUpDown />
                  </Button>
                </TableHead>
                <TableHead>
                  {" "}
                  <Button variant={"link"}>Screenshot</Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant={"link"}
                    onClick={() => handleSort("transferMethodId")}
                  >
                    Transfer Method
                    <ArrowUpDown />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant={"link"}>In-Kind Items</Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSortedData?.tableData?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id || "--"}</TableCell>
                  <TableCell>
                    {dayjs(row.date)?.format("MMM DD, h:mm A") || "--"}
                  </TableCell>
                  <TableCell>{row.name || "--"}</TableCell>
                  <TableCell>{row.contact || "--"}</TableCell>
                  <TableCell>
                    {(row.monetaryAmount || 0)?.toLocaleString()}{" "}
                    {!!row?.currency && row?.currency}
                  </TableCell>
                  <TableCell>
                    {row?.screenshots?.length ? (
                      <Button
                        size="sm"
                        className="text-[14px] p-0 font-normal"
                        variant={"link"}
                      >
                        <Link target="_blank" href={row?.screenshots?.[0]}>
                          See screenshot
                        </Link>
                      </Button>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell>
                    {row.transferMethodId
                      ? transferMethods?.data?.find(
                          (t) => t.id === row.transferMethodId
                        )?.name
                      : "--"}
                  </TableCell>
                  <TableCell>{row.inKindContributions || "--"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSortedData?.summary && (
            <div className="mt-4 p-4 border rounded shadow-sm w-full flex justify-center md:justify-end">
              <div>
                <p>Total Pledges: {filteredSortedData.summary.totalEntries}</p>
                <p>
                  Total Contributed in ETB:{" "}
                  {filteredSortedData.summary.totalMonetaryContributionInETB?.toLocaleString()}{" "}
                  ETB
                </p>
                <p>
                  Total Contributed in USD:{" "}
                  {filteredSortedData.summary.totalMonetaryContributionInUSD?.toLocaleString()}{" "}
                  USD
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTable;
