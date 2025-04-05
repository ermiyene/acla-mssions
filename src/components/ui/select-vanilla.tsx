import * as React from "react";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/client/helpers/cn";

export interface SelectVanillaProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

const SelectVanilla = React.forwardRef<HTMLSelectElement, SelectVanillaProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full h-fit", wrapperClassName)}>
        <select
          className={cn(
            "flex h-9 w-full border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          ref={ref}
          {...props}
        />
        <ChevronDown className="w-4 h-4 absolute top-3 right-3 pointer-events-none" />
      </div>
    );
  }
);
SelectVanilla.displayName = "SelectVanilla";

export { SelectVanilla };
