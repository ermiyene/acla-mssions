import { useMemo, useState } from "react";

export function useFilteredTableData<
  Key extends string,
  RowData extends Record<Key, { value: React.ReactNode }>
>(
  columns: readonly {
    readonly key: Key;
    readonly title: string;
    readonly sortable?: boolean;
    readonly filter?: (search: string, row: RowData) => boolean;
  }[],
  tableData: RowData[]
) {
  const [search, setSearch] = useState("");

  const filteredTableData = useMemo(
    () =>
      tableData?.filter((row) =>
        Object.entries(row)?.some(([key, data]) => {
          const filter = columns?.find((f) => f?.key === key)?.filter;
          return filter && filter(search, row);
        })
      ),
    [tableData, columns, search]
  );

  return {
    search,
    setSearch,
    filteredTableData,
  };
}
