// import { FieldTypeMap } from "@/components/common/FormPopup/types";
// import dayjs from "dayjs";
// import { z } from "zod";
// import { ClosedSalesFormPopup } from "./ClosedSalesFormPopup";
// import { Button } from "@/components/ui/button";
// import { GetPledgesResponse } from "./hooks/hooks";
// import Link from "next/link";

// export const salesReportFormConfig = {
//   title: "Closed Sales",
//   fields: [
//     {
//       name: "salesDate",
//       label: "Sales Date",
//       type: FieldTypeMap.date,
//       validation: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
//       defaultValue: new Date(),
//     },
//     {
//       name: "total",
//       label: "Total",
//       type: FieldTypeMap.number,
//       validation: z.string().regex(/^\d+(\.\d{1,2})?$/),
//     },
//     {
//       name: "id",
//       label: "ID",
//       type: FieldTypeMap.number,
//       hidden: true,
//     },
//   ],
// } as const;

// export const pledgesTableColumns = [
//   {
//     key: "date",
//     title: "Sales Date",
//     sortable: true,
//     filter: (search: string, row: Record<string, any>) =>
//       dayjs(row.date?.value)
//         .format("ddd, MMM D, YYYY")
//         ?.toLowerCase()
//         .includes(search?.toLowerCase()),
//   },
//   {
//     key: "cashier",
//     title: "Cashier",
//     sortable: true,
//     filter: (search: string, row: Record<string, any>) =>
//       row.cashier?.value.toLowerCase().includes(search.toLowerCase()),
//   },
//   { key: "total", title: "Sales Total", sortable: true },
//   { key: "action", title: "Action" },
// ];

// export function formatSalesReportTableData<T>(
//   data: GetPledgesResponse = [],
//   handleEdit?: (values: {
//     id: number;
//     salesDate: Date;
//     total: number;
//   }) => Promise<void>
// ) {
//   return data.map((report) => ({
//     id: { value: report.id },
//     date: {
//       value: dayjs(report.salesDate).format("ddd, MMM D, YYYY"),
//     },
//     cashier: {
//       value: report.cashier.name,
//     },
//     total: {
//       value: `${report.total?.toLocaleString(undefined, {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       })} Birr`,
//     },

//     action: {
//       value: (
//         <Link
//           href={`/cashier?tab=by-date&date=${new Date(
//             report.salesDate
//           )?.toISOString()}`}
//         >
//           <Button variant="link">View sales</Button>,
//         </Link>
//       ),
//     },
//   }));
// }
