import Papa from "papaparse";

export function exportCSV(
  data: Record<string, string | number | boolean | null | undefined>[],
  filename = "data.csv"
) {
  const csv = Papa.unparse(data); // Convert JSON to CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
