"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/client/helpers/cn";
import { Calendar } from "./calendar";

interface DatePickerWithRangeProps {
  value: DateRange;
  onChange?: (value?: DateRange) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
  disabled = false,
  placeholder = "Pick a date",
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex h-9 w-full border border-input bg-transparent px-3 py-1 text-base transition-colors gap-2 items-center justify-between",
              "data-[state=open]:ring-ring data-[state=open]:ring-1",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="w-4 h-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 shadow-none border-primary rounded-none"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
