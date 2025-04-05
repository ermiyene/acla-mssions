// import { FormPopup } from "../../common/FormPopup/FormPopup";
// import { salesReportFormConfig } from "./config";

// type ClosedSalesFormPopupProps = {
//   trigger: React.ReactNode;
// } & (
//   | {
//       mode: "edit";
//       onEdit: (values: {
//         id: number;
//         salesDate: Date;
//         total: number;
//       }) => Promise<void>;
//       initialValues: { id: number; salesDate: Date; total: number };
//       onAdd?: never;
//     }
//   | {
//       mode: "add";
//       onAdd: (values: { salesDate: Date; total: number }) => Promise<void>;
//       onEdit?: never;
//       initialValues?: never;
//     }
// );

// export function ClosedSalesFormPopup({
//   onAdd,
//   onEdit,
//   initialValues,
//   trigger,
//   mode,
// }: ClosedSalesFormPopupProps) {
//   return mode === "add" ? (
//     <FormPopup
//       trigger={trigger}
//       mode={"add"}
//       config={salesReportFormConfig}
//       onAdd={onAdd}
//     />
//   ) : (
//     <FormPopup
//       trigger={trigger}
//       mode={"edit"}
//       config={salesReportFormConfig}
//       initialValues={initialValues}
//       onEdit={onEdit}
//     />
//   );
// }
