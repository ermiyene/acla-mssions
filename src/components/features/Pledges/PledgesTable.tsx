// import LHeader from "../../common/LHeader";
// import { Button } from "../../ui/button";
// import { PlusIcon } from "@heroicons/react/20/solid";
// import { Input } from "../../ui/input";
// import { useEffect, useRef, useState } from "react";
// import LoadingSpinner from "../../common/LoadingSpinner";
// import LTable from "../../common/LTable/LTable";
// import { ClosedSalesFormPopup } from "./ClosedSalesFormPopup";
// import { useGetPledges } from "./hooks/hooks";
// import ClosedSalesCard from "./ClosedSalesCard";
// import FAB from "../../common/FAB";
// import { formatSalesReportTableData, pledgesTableColumns } from "./config";
// import { useFilteredTableData } from "@/components/common/LTable/utils";

// export function PledgesTable() {
//   const { data: pledges, isLoading, isFetching } = useGetPledges();
//   const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const [lastUpdatedId, setLastUpdatedId] = useState<number>();
//   // const { mutateAsync: onAdd } = useAddDailySalesReport();
//   // const { mutateAsync: onEdit } = useEditDailySalesReport();
//   const tableData = formatSalesReportTableData(pledges?.data);
//   const { setSearch, filteredTableData } = useFilteredTableData(
//     pledgesTableColumns,
//     tableData
//   );

//   // async function handleAdd(values: { salesDate: Date; total: number }) {
//   //   const res = await onAdd(values);
//   //   if (res) {
//   //     setLastUpdatedId(res?.data?.id);
//   //   }
//   // }

//   // async function handleEdit(values: {
//   //   id: number;
//   //   salesDate: Date;
//   //   total: number;
//   // }) {
//   //   const res = await onEdit({
//   //     id: values.id,
//   //     salesDate: values.salesDate,
//   //     total: values.total,
//   //   });
//   //   if (res) {
//   //     setLastUpdatedId(res?.data?.id);
//   //   }
//   // }

//   function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
//     setSearch(e.target.value);
//   }

//   useEffect(() => {
//     if (!lastUpdatedId) {
//       return;
//     }

//     const index = filteredTableData.findIndex(
//       (row) => row.id.value === lastUpdatedId
//     );
//     if (index === -1) {
//       return;
//     }

//     itemRefs.current[index]?.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });

//     itemRefs.current[index]?.classList.add(
//       "border",
//       "rounded-lg",
//       "border-secondary"
//     );

//     const timeout = setTimeout(() => {
//       itemRefs.current[index]?.classList.remove(
//         "border",
//         "rounded-lg",
//         "border-secondary"
//       );
//       setLastUpdatedId(undefined);
//     }, 2000);

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [lastUpdatedId, filteredTableData]);

//   return (
//     <div className="flex flex-col gap-6 relative max-sm:pb-20">
//       <LHeader
//         title={"Closed Sales"}
//         subTitle="Sum of all sales made by cashiers on a given day. This is recorded at the end of the day."
//       />
//       <div className="w-full flex gap-4 items-end sm:items-center justify-between flex-col-reverse sm:flex-row">
//         <Input
//           onChange={handleSearch}
//           placeholder="Search using dates or cashier"
//           className="w-full sm:max-w-[300px]"
//           disabled={isLoading}
//         />
//         {/* <SalesReportFormPopup
//           mode="add"
//           onAdd={handleAdd}
//           trigger={
//             <div>
//               <Button disabled={isLoading} className="max-sm:hidden">
//                 <PlusIcon
//                   className="-ml-0.5 mr-1.5 h-5 w-5"
//                   aria-hidden="true"
//                 />
//                 Add Report
//               </Button>
//               <FAB label="Add Report" className="sm:hidden" />
//             </div>
//           }
//         /> */}
//       </div>
//       <div className="sm:hidden flex flex-col gap-6 relative min-h-[50svh] max-w-content overflow-hidden">
//         {isLoading && (
//           <LoadingSpinner className="absolute top-0 right-0 h-full bg-background/55 backdrop-blur-md z-10 rounded border-none" />
//         )}
//         {isFetching && (
//           <div className="loading-bar !fixed bottom-20 w-full left-0 z-20" />
//         )}
//         {filteredTableData?.map((report, key) => (
//           <div key={key} ref={(el) => (itemRefs.current[key] = el as any)}>
//             <ClosedSalesCard report={report} />
//           </div>
//         ))}
//       </div>
//       <div className="hidden sm:block border rounded-lg min-h-[200px] relative max-w-content overflow-hidden">
//         {isLoading && (
//           <LoadingSpinner className="absolute top-0 right-0 h-full bg-background/55 backdrop-blur-md z-10 rounded" />
//         )}
//         {isFetching && <div className="loading-bar" />}
//         <LTable columns={pledgesTableColumns} data={filteredTableData} />
//       </div>
//     </div>
//   );
// }
