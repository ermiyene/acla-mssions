"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/client/helpers/cn";
import { CircleCheck, CircleIcon } from "lucide-react";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { StepProps } from "./types";
import { useTransferMethods } from "@/lib/client/helpers/hooks/pledge.hooks";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { SelectVanilla } from "@/components/ui/select-vanilla";
import { CURRENCY } from "@prisma/client";

export default function TransferMethod({
  goBack,
  goNext,
  canGoBack,
  canGoNext,
}: StepProps) {
  const {
    pledgeAmount,
    setPledgeAmount,
    transferMethod,
    setTransferMethod,
    currency,
    setCurrency,
    setVerified,
    setVerificationCodeSent,
  } = usePledgeStore();

  const { data: transferMethods, isLoading } = useTransferMethods();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goNext();
  };

  const filteredTransferMethod = transferMethods?.data?.filter(
    (t) => t?.currency === currency
  );

  return (
    <div className="container mx-auto px-0 md:px-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div className="relative">
          <Label className="mb-2.5 block" htmlFor="amount">
            Pledge Amount
          </Label>
          <Input
            id="amount"
            value={pledgeAmount ?? 0}
            onChange={(e) => setPledgeAmount(Number(e.target.value))}
            required
            type="number"
            min={10}
            className="peer"
          />

          <span
            className={cn(
              "hidden mt-1 text-sm text-destructive peer-invalid:block peer-placeholder-shown:!hidden"
            )}
          >
            Minimum allowed amount is 10 {currency}
          </span>
        </div>
        <div className="relative">
          <Label className="mb-2.5 block" htmlFor="amount">
            Currency
          </Label>
          <SelectVanilla
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value as CURRENCY);
              setVerificationCodeSent(false);
              setVerified(false);
            }}
          >
            <option disabled>Currency</option>
            <option value={"ETB"}>ETB</option>
            <option value={"USD"}>USD </option>
          </SelectVanilla>
        </div>
        <div>
          <Label className="mb-2.5 block">Transfer Method</Label>
          {isLoading ? (
            <LoadingSpinner className="w-8 h-8 bg-transparent" />
          ) : (
            <RadioGroup
              className="flex flex-wrap gap-2"
              value={transferMethod ?? undefined}
              onValueChange={setTransferMethod}
              name="transfer-method"
            >
              {filteredTransferMethod?.map((method) => (
                <Button
                  type="button"
                  variant="outline"
                  key={method.id}
                  className={
                    "items-center relative has-[:checked]:bg-accent group"
                  }
                >
                  <RadioGroupItem
                    className="opacity-0 absolute w-full h-full top-0 left-0"
                    value={method.id}
                    id={method.id}
                  />
                  <Label className="flex gap-2" htmlFor={method.id}>
                    <CircleCheck className="hidden group-has-[:checked]:block" />
                    <CircleIcon className="block group-has-[:checked]:hidden" />
                    <span>{method.name}</span>
                  </Label>
                </Button>
              ))}
            </RadioGroup>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Button disabled={!canGoBack()} variant={"outline"} onClick={goBack}>
            Go back
          </Button>
          <Button
            loading={isLoading}
            disabled={
              !canGoNext() ||
              !filteredTransferMethod?.some((t) => t?.id === transferMethod)
            }
            type="submit"
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
