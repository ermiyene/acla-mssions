/* eslint-disable @next/next/no-img-element */
"use client";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { StepProps } from "./types";
import { UploadButton } from "@/components/common/Upload/UploadButton";
import { formatErrorMessage } from "@/lib/common/utils/error";
import { cn } from "@/lib/client/helpers/cn";
import {
  useGetPledge,
  useSaveTransferConfirmation,
} from "@/lib/client/helpers/hooks/pledge.hooks";
import { toast } from "sonner";
import { useSendThankYou } from "@/lib/client/helpers/hooks/notification.hooks";
import posthog from "posthog-js";

export default function Confirmation({
  goBack,
  canGoNext,
  canGoBack,
  goNext,
}: StepProps) {
  const {
    pledgeAmount,
    currency,
    pledgeId,
    screenshot,
    setScreenshot,
    screenshotUploaded,
    setScreenshotUploaded,
  } = usePledgeStore();

  const { getPledgeAsync, isLoading, error } = useGetPledge();

  useEffect(() => {
    if (!pledgeId) {
      return;
    }
    getPledgeAsync(pledgeId).then((res) => {
      if (
        res?.data?.monetaryContribution?.transferConfirmations?.some(
          (t) => !!t?.screenShotUrl
        )
      ) {
        goNext();
      }
    });
  }, []);

  const mutation = useSaveTransferConfirmation();
  const thankYouMutation = useSendThankYou();

  async function handleConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (
        !pledgeId ||
        !screenshot?.key ||
        !screenshot?.url ||
        !screenshot?.raw
      ) {
        toast.error("Please upload a screenshot of your transfer.");
        return;
      }
      await mutation.saveTransferConfirmation({
        pledgeId,
        screenShotKey: screenshot.key,
        screenShotRaw: JSON.stringify(screenshot.raw),
        screenShotUrl: screenshot.url,
      });
      posthog.capture("confirmed_payment");
      setScreenshotUploaded(true);
      await thankYouMutation?.sendThankYou();
      goNext();
    } catch (error) {
      posthog.capture("error_confirming_payment", {
        error,
      });
      toast.error(
        formatErrorMessage(
          error,
          "An error occurred while saving confirmation."
        )
      );
    }
  }
  const [uploadError, setUploadError] = useState<string | null>();

  return (
    <div className="container mx-auto px-0 md:px-8">
      <form onSubmit={handleConfirm} className="max-w-md mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-primary">
          Confirm Your Payment
        </h3>
        <div>
          <Label className="mb-2.5 block" htmlFor="pledgeId">
            Pledge ID
          </Label>
          <Input disabled id="pledgeId" value={pledgeId} />
        </div>
        <div>
          <Label className="mb-2.5 block" htmlFor="amount">
            Amount
          </Label>
          <Input disabled id="amount" value={pledgeAmount?.toLocaleString()} />
        </div>
        <div>
          <Label className="mb-2.5 block" htmlFor="currency">
            Currency
          </Label>
          <Input disabled id="currency" value={currency} />
        </div>
        <div>
          <Label className="mb-2.5 block" htmlFor="screenshot">
            Upload Transfer Screenshot
          </Label>
          <UploadButton
            disabled={mutation?.isLoading}
            file={screenshot}
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setScreenshot({
                url: res?.[0]?.url,
                key: res?.[0]?.key,
                raw: res?.[0],
              });
              setUploadError(null);
            }}
            onUploadError={(error: Error) => {
              setUploadError(error.message);
              posthog.capture("error_upload_screenshot", {
                error,
              });
            }}
            onRemove={() => {
              setScreenshot(null);
              setUploadError(null);
            }}
          />
          {uploadError && (
            <p className={cn("mt-1 text-sm text-destructive")}>
              {formatErrorMessage(
                uploadError,
                "An error occurred while uploading photo."
              )}
            </p>
          )}
        </div>

        <div className="flex flex-row gap-2 mt-12 w-full max-w-md mx-auto">
          <Button disabled={!canGoBack()} variant={"outline"} onClick={goBack}>
            Go back
          </Button>
          <Button
            type="submit"
            disabled={!canGoNext() || !screenshot?.url}
            className="flex-1"
            loading={mutation.isLoading || thankYouMutation?.loading}
          >
            Finish
          </Button>
        </div>
      </form>
    </div>
  );
}
