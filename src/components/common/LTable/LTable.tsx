import { cn } from "@cn";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../ui/table";
import { Button } from "../../ui/button";

interface LTableProps<
  Key extends string,
  RowData extends Record<Key, { value: React.ReactNode }>
> {
  columns: readonly {
    readonly key: Key;
    readonly title: string;
    readonly sortable?: boolean;
    readonly filter?: (search: string, row: RowData) => boolean;
  }[];
  data: RowData[];
}
export default function LTable<
  Key extends string,
  RowData extends Record<Key, { value: React.ReactNode }>
>({ columns, data }: LTableProps<Key, RowData>) {
  const [sortColumn, setSortColumn] = useState<Key>(columns[0].key);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  function handleSortChange(column: typeof sortColumn) {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  const sortedData = data.sort((a, b) => {
    const aVal = a[sortColumn].value;
    const bVal = b[sortColumn].value;
    if (
      (aVal instanceof Date && bVal instanceof Date) ||
      (typeof aVal === "string" &&
        typeof bVal === "string" &&
        new Date(aVal).getTime() &&
        new Date(bVal).getTime())
    ) {
      return sortDirection === "asc"
        ? new Date(aVal).getTime() - new Date(bVal).getTime()
        : new Date(bVal).getTime() - new Date(aVal).getTime();
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "boolean" && typeof bVal === "boolean") {
      return sortDirection === "asc" ? (aVal ? -1 : 1) : bVal ? -1 : 1;
    }

    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted-background">
          {columns.map((column, index, { length }) => (
            <TableHead
              key={column.key}
              className={cn("font-light", {
                "pl-8 box-content": index === 0,
                "pr-8 box-content": index === length - 1,
              })}
            >
              <Button
                onClick={() => handleSortChange(column.key)}
                variant="link"
                className={"p-0 flex gap-2 items-center"}
              >
                {column.title}
                {column?.sortable && (
                  <ArrowDownIcon
                    className={cn("text-muted-foreground", {
                      "text-foreground": sortColumn === column.key,
                      "transform rotate-180":
                        sortDirection === "desc" && sortColumn === column.key,
                    })}
                  />
                )}
              </Button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((data, index) => (
          <TableRow key={index}>
            {columns.map((column, index, { length }) => (
              <TableCell
                key={column.key}
                className={cn("font-light", {
                  "pl-8 box-content": index === 0,
                  "pr-8 box-content": index === length - 1,
                })}
              >
                {data[column.key].value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
