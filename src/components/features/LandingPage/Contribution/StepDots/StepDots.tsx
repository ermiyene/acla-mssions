import { cn } from "@/lib/client/helpers/cn";
import { FC } from "react";

interface StepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const Steps: FC<StepsProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("flex justify-center gap-1", className)}>
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col justify-start items-center gap-2 flex-1"
        >
          <div
            className={cn(
              "h-1 w-full rounded-full border",
              index <= currentStep ? "bg-primary" : "bg-muted"
            )}
          />
          <span
            className={cn("text-secondary/70 text-sm text-center", {
              "text-primary": index <= currentStep,
            })}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Steps;
