import { PlusIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@cn";

interface FABProps {
  label: string;
  className?: string;
}
export default function FAB({ label, className }: FABProps) {
  const [isHoverTap, setIsHoverTap] = useState(true);

  return (
    <Button
      className={cn(
        "w-12 h-12 z-20 fixed bottom-24 right-6 overflow-hidden rounded-full hover:w-fit justify-start px-3 hover:px-6 gap-3 transition-all hover:bg-primary",
        className
      )}
      variant="default"
      onClick={(e) => {
        if (isHoverTap) {
          e.stopPropagation();
          setIsHoverTap(false);
          return;
        }
        setIsHoverTap(true);
      }}
    >
      <PlusIcon className="h-6 w-6 min-h-6 min-w-6" />
      <span className="text-base">{label}</span>
    </Button>
  );
}
