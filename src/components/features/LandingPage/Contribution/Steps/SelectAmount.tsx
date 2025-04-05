"use client";
import { Button } from "@/components/ui/button";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { StepProps } from "./types";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { SelectVanilla } from "@/components/ui/select-vanilla";
import { CURRENCY } from "@prisma/client";

const min = 10;
const max = 5000000000000;

const exponentialGrowth = (x: number) => {
  const normalizedX = x / 10000; // Normalize max value
  return Math.round(min * Math.exp(normalizedX * Math.log(max / min)));
};

export default function SelectAmount({
  goBack,
  canGoNext,
  canGoBack,
  goNext,
}: StepProps) {
  const { pledgeAmount, setPledgeAmount, currency, setCurrency } =
    usePledgeStore();
  const nonNullPledgeAmount = pledgeAmount ?? 0;

  function focusInput() {
    document.getElementById("amount")?.focus();
  }
  useEffect(() => {
    focusInput();
  }, []);
  return (
    <div className="container mx-auto px-0 md:px-8">
      <div className="max-w-lg mx-auto">
        <h4 className="text-xl text-center mb-8">
          How much would you like to give?
        </h4>
        {/* <Slider
          value={[
            (Math.log(nonNullPledgeAmount / min) / Math.log(max / min)) * 10000,
          ]}
          max={10000}
          step={10}
          draggable
          onValueChange={(value) => {
            const newValue = exponentialGrowth(value[0]);
            setPledgeAmount(newValue);
            focusInput();
          }}
        /> */}
        <div className="mx-auto max-w-md flex gap-3 border border-primary/30 p-4 mt-4 justify-end sm:justify-center items-center">
          <div className="text-right text-3xl font-bold min-w-[100px]">
            <Input
              id="amount"
              value={pledgeAmount?.toLocaleString()}
              onChange={(e) =>
                setPledgeAmount(
                  Number(e.currentTarget.value.replace(/[^0-9]/g, ""))
                )
              }
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  setPledgeAmount(nonNullPledgeAmount + 1);
                }
                if (e.key === "ArrowDown") {
                  setPledgeAmount(nonNullPledgeAmount - 1);
                }
              }}
              required
              min={10}
              className="border-none text-right text-3xl font-bold focus-visible:ring-0 w-[18px] inline p-0 max-w-full"
              style={{
                width: nonNullPledgeAmount?.toLocaleString()?.length * 18,
              }}
            />
            {/* <span className="ml-1">Birr</span> */}
            {/* <hr className="w-[50%] mx-auto blink border-b border-primary/10 mt-2" /> */}
          </div>
          <div className="flex flex-col border-l pl-3 border-primary/30 max-w-[30%]">
            <SelectVanilla
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CURRENCY)}
              wrapperClassName="w-[80px]"
              className="w-full border-none focus-visible:ring-0 p-0 text-xl"
            >
              <option disabled>Currency</option>
              <option value={"ETB"}>ETB</option>
              <option value={"USD"}>USD </option>
            </SelectVanilla>
          </div>
        </div>

        {/* <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {[1000, 5000, 10000, 500000].map((value) => (
            <Button
              variant="outline"
              className="rounded-none "
              key={value}
              onClick={() => {
                setPledgeAmount(value);
                focusInput();
              }}
            >
              {value?.toLocaleString()} Birr
            </Button>
          ))}
        </div> */}
        <div className="flex flex-row gap-2 mt-12 w-full max-w-md mx-auto">
          <Button disabled={!canGoBack()} variant={"outline"} onClick={goBack}>
            Go back
          </Button>
          <Button
            disabled={!canGoNext() || nonNullPledgeAmount < min}
            onClick={goNext}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
