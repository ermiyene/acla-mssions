"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/client/helpers/cn";
import { ArrowRight, ArrowRightIcon, InfoIcon } from "lucide-react";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { StepProps } from "./types";
import { useSendPledgeLink } from "@/lib/client/helpers/hooks/notification.hooks";
import { toast } from "sonner";
import { formatErrorMessage } from "@/lib/common/utils/error";
import { useTransferMethods } from "@/lib/client/helpers/hooks/pledge.hooks";
import { CopyButton } from "@/components/ui/copy-button";

export default function Summary({
  goBack,
  canGoNext,
  canGoBack,
  goNext,
}: StepProps) {
  const {
    pledgeAmount,
    name,
    email,
    currency,
    phone,
    transferMethod,
    pledgeId,
    selectedItems,
    contributionType,
  } = usePledgeStore();

  const mutation = useSendPledgeLink();
  const { data: transferMethods } = useTransferMethods();

  async function handleGo() {
    try {
      await mutation.sendPledgeLink();
      goNext();
    } catch (error) {
      toast.error(
        formatErrorMessage(
          error,
          `An error occurred while send you your pledge details. Please try again. If it persists please contact us on ${process.env.NEXT_PUBLIC_OFFICE_NUMBER}.`
        )
      );
    }
  }

  const selectedTransferMethod = transferMethods?.data?.find(
    (m) => m.id === transferMethod
  );

  return (
    <div className="container mx-auto px-0 md:px-8">
      <div className="max-w-md mx-auto flex flex-col gap-2">
        <div className="bg-accent/30 border-accent border p-4">
          <div
            className={cn("space-y-2", {
              hidden: contributionType === "in-kind",
            })}
          >
            <h4 className="text-lg font-bold text-primary mb-3">
              Payment Instructions:
            </h4>
            <ul className="list-disc pl-4">
              <li>
                Send <b>{pledgeAmount?.toLocaleString()}</b> {currency} to{" "}
                <b className="font-bold uppercase">
                  {selectedTransferMethod?.name}
                </b>{" "}
                using the following details:
                <p className="space-y-1 my-4 font-mono ml-2 text-[15px]">
                  {!!selectedTransferMethod?.accountHolderName && (
                    <p>
                      <ArrowRight className="w-4 h-4 inline mr-1" />
                      <b>Account holder name:</b>{" "}
                      {selectedTransferMethod?.accountHolderName}
                    </p>
                  )}
                  {!!selectedTransferMethod?.accountNumber && (
                    <p>
                      <ArrowRight className="w-4 h-4 inline mr-1" />
                      <b>Account number:</b>{" "}
                      {selectedTransferMethod?.accountNumber}{" "}
                      <CopyButton
                        text={selectedTransferMethod?.accountNumber}
                      />
                    </p>
                  )}
                  {!!selectedTransferMethod?.swiftCode && (
                    <p>
                      <ArrowRight className="w-4 h-4 inline mr-1" />
                      <b>Swift Code:</b> {selectedTransferMethod?.swiftCode}
                      <CopyButton text={selectedTransferMethod?.swiftCode} />
                    </p>
                  )}
                </p>
              </li>
              <li>
                Include your Pledge ID{" "}
                <b>
                  (
                  <u className="font-mono text-sm font-bold uppercase">
                    {pledgeId}
                  </u>
                  ){!!pledgeId && <CopyButton text={pledgeId} />}
                </b>{" "}
                in the transfer notes
              </li>
              <li className="underline">
                Return here to upload a screenshot of your transfer.
              </li>
            </ul>
          </div>
          <hr
            className={cn(
              "border-t border-primary/50 border-dashed w-full my-6",
              {
                hidden: contributionType !== "both",
              }
            )}
          />

          <div
            className={cn("space-y-2", {
              hidden: contributionType === "money",
            })}
          >
            <h4 className="text-lg font-bold text-primary mb-3">Hand over:</h4>
            <p>
              Please contact{" "}
              <a
                href={`tel:${process.env.NEXT_PUBLIC_OFFICE_NUMBER}`}
                className="underline font-bold"
              >
                {process.env.NEXT_PUBLIC_OFFICE_NUMBER}
              </a>{" "}
              {!!process.env.NEXT_PUBLIC_OFFICE_NUMBER && (
                <CopyButton text={process.env.NEXT_PUBLIC_OFFICE_NUMBER} />
              )}{" "}
              to arrange the handover of your contributions. We will ask you for
              your pledge ID{" "}
              <b>
                (
                <u className="font-mono text-[15px] font-bold uppercase">
                  {pledgeId}
                </u>
                ) {!!pledgeId && <CopyButton text={pledgeId} />}
              </b>{" "}
              so please make sure to have it at hand until you hand off all of
              your contributions.
            </p>
          </div>
        </div>
        <hr className="border-t w-full my-6" />

        <h4 className="text-xl font-bold text-primary mb-3">Pledge Summary</h4>

        <p>
          <strong>Name:</strong> {name || "Anonyms"}
        </p>
        <p>
          <strong>Contact:</strong> {phone || email}
        </p>
        <p className={cn({ hidden: contributionType === "money" })}>
          <strong>Your commitments:</strong>{" "}
          {selectedItems
            ?.map((i) => `${i?.name} (${i?.amount} ${i?.unit})`)
            ?.join(", ")}
        </p>
        <p className={cn({ hidden: contributionType === "in-kind" })}>
          <strong>Amount:</strong> {pledgeAmount?.toLocaleString()} {currency}
        </p>
        <p className={cn({ hidden: contributionType === "in-kind" })}>
          <strong>Payment Method:</strong> {selectedTransferMethod?.name}
        </p>

        <p>
          <strong>Pledge ID:</strong>{" "}
          <u className={"font-mono text-[15px] font-bold uppercase"}>
            {pledgeId}
          </u>{" "}
          {!!pledgeId && <CopyButton text={pledgeId} />}
          {/* <i className="block text-destructive mt-2">
            <InfoIcon className="inline w-4 h-4 mr-1" />
            Please save this somewhere safe or take a screenshot of this page.
            You&apos;ll need it when confirming your pledge later!
          </i> */}
        </p>

        <div className="flex flex-row gap-2 mt-8">
          <Button disabled={!canGoBack()} variant={"outline"} onClick={goBack}>
            Go back
          </Button>
          <Button
            loading={mutation?.loading}
            disabled={!canGoNext()}
            onClick={handleGo}
            className="flex-1"
          >
            {contributionType === "in-kind" ? "Finish" : "Confirm Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
