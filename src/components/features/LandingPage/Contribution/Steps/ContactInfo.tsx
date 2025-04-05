"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/client/helpers/cn";
import { usePledgeStore } from "@/lib/client/store/pledgeStore";
import { StepProps } from "./types";
import {
  useCreatePledgeId,
  useUpdatePledge,
} from "@/lib/client/helpers/hooks/pledge.hooks";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { formatErrorMessage } from "@/lib/common/utils/error";
import {
  useSendVerification,
  useVerify,
} from "@/lib/client/helpers/hooks/notification.hooks";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { CURRENCY } from "@prisma/client";
import { useStringQueryParams } from "@/lib/client/helpers/useQueryParams";
import posthog from "posthog-js";

export default function ContactInfo({
  goBack,
  goNext,
  canGoBack,
  canGoNext,
}: StepProps) {
  const {
    name,
    setName,
    phone,
    setPhone,

    email,
    setEmail,
    pledgeId,
    pledgeAmount,
    transferMethod,
    selectedItems,
    verified,
    currency,
    setVerified,
    verificationCodeSent,
    setVerificationCodeSent,
    contributionType,
    canResend,
    setCanResend,
  } = usePledgeStore();
  const {
    updatePledge,
    loading: updateLoading,
    error: updateError,
  } = useUpdatePledge();
  useCreatePledgeId();

  const {
    sendVerification,
    loading: sendCodeLoading,
    error: sendCodeError,
  } = useSendVerification();
  const [code, setCode] = useState("");
  const { verify, loading: verifyLoading, error: verifyError } = useVerify();
  const [codeFromUrl, setCodeFromUrl] = useStringQueryParams("code");
  const [phoneError, setPhoneError] = useState<boolean>(false);

  useEffect(() => {
    if (codeFromUrl && !code) {
      setCode(codeFromUrl);
      setCodeFromUrl("");
    }
  }, [code, codeFromUrl, setCodeFromUrl]);

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    try {
      if (!pledgeId) {
        toast.error("Pledge id is missing. Please start over.");
        return;
      }

      const res = await updatePledge({
        name: name || undefined,
        phone:
          (phone?.startsWith("0") ? "+251" + phone.slice(1) : phone) ||
          undefined,
        email: email || undefined,
        pledgeId,
        pledgeAmount: contributionType !== "in-kind" ? pledgeAmount : null,
        currency: currency,
        transferMethod: contributionType !== "in-kind" ? transferMethod : null,
        items: contributionType !== "money" ? selectedItems : undefined,
      });

      posthog.identify(
        pledgeId, // Required. Replace 'distinct_id' with your user's unique identifier
        {
          email: email || undefined,
          name,
          phone:
            (phone?.startsWith("0") ? "+251" + phone.slice(1) : phone) ||
            undefined,
          pledgeAmount: contributionType !== "in-kind" ? pledgeAmount : null,
          currency: currency,
          transferMethod:
            contributionType !== "in-kind" ? transferMethod : null,
          items: contributionType !== "money" ? selectedItems : undefined,
        },
        {
          pledgeId,
        }
      );

      setVerified(true);
      goNext();

      return;
      // Removed phone/email verification
      // const verified =
      //   (!!res?.data?.phoneVerifications?.[0]?.verificationDate &&
      //     res.data?.phone === phone) ||
      //   (!!res?.data?.emailVerifications?.[0]?.verificationDate &&
      //     res.data?.email === email);
      // setVerified(verified);
      // if (verified) {
      //   return;
      // }
      // const sentAtRes = await sendVerification();
      // if (sentAtRes?.data?.sentAt) {
      //   setVerificationCodeSent(true);
      //   setCanResend(false);
      //   setTimeout(() => {
      //     setCanResend(true);
      //   }, 60 * 1000);
      //   toast.success("Verification code sent successfully");
      // }
    } catch (error) {
      posthog.capture("error_updating_pledge", {
        error,
      });

      if (
        formatErrorMessage(error, "An error occurred while updating pledge") ===
        "phone must be a valid phone number"
      ) {
        setPhoneError(true);
      }
      toast.error(
        formatErrorMessage(error, "An error occurred while updating pledge")
      );
    }
  };

  async function handleVerificationCode() {
    try {
      if (code?.length !== 6) {
        toast.error("Invalid verification code");
        return;
      }
      const res = await verify(code);
      const verified = !!res?.data?.verification?.verificationDate;
      if (verified) {
        setVerified(verified);
        toast.success("Verified successfully!");
      }
    } catch (error) {
      toast.error(
        formatErrorMessage(
          error,
          `An error occurred while verifying your ${
            currency === CURRENCY.ETB ? "phone" : "email"
          } number`
        )
      );
    }
  }

  async function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    await handleUpdate();
  }

  return (
    <div className="container mx-auto px-0 md:px-8">
      <form onSubmit={handleFinish} className="max-w-md mx-auto space-y-6">
        <div>
          <Label className="mb-2.5 block" htmlFor="name">
            Name <span className="text-secondary/60">(Optional)</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setVerificationCodeSent(false);
              setVerified(false);
              setCode("");
            }}
          />
        </div>

        <div>
          {currency === CURRENCY.USD ? (
            <>
              <Label className="mb-2.5 block" htmlFor="email">
                <TooltipProvider>
                  <Tooltip delayDuration={450}>
                    <TooltipTrigger
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      Email <InfoIcon className="inline ml-1 w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">
                      We will use this email to send you confirmation messages
                      and reminders.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setVerificationCodeSent(false);
                  setVerified(false);
                  setCode("");
                }}
                required
                type="email"
                placeholder="Your email"
                className={cn("peer inline w-[calc(65%_-_0.5rem)]", {
                  // "w-full": (verificationCodeSent && !canResend) || verified,
                  "w-full": true,
                })}
              />
            </>
          ) : (
            <>
              <Label className="mb-2.5 block" htmlFor="phone">
                <TooltipProvider>
                  <Tooltip delayDuration={450}>
                    <TooltipTrigger
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      Phone number <InfoIcon className="inline ml-1 w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">
                      We will use this number to send you confirmation messages
                      and reminders.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setVerificationCodeSent(false);
                  setVerified(false);
                  setCode("");
                }}
                required
                type="tel"
                // pattern="(\+2519\d{8}|09\d{8})"
                placeholder="+251XXXXXXXXX or 0XXXXXXXXX"
                className={cn("peer inline w-[calc(65%_-_0.5rem)]", {
                  // "w-full": (verificationCodeSent && !canResend) || verified,
                  "w-full": true,
                })}
              />
            </>
          )}
          <Button
            className={cn("inline-flex w-[35%] ml-[0.5rem]", {
              // hidden: (verificationCodeSent && !canResend) || verified,
              hidden: true,
            })}
            loading={sendCodeLoading || updateLoading}
            type="button"
            onClick={handleUpdate}
          >
            Send code
          </Button>
          <span
            className={cn(
              "hidden mt-1 text-sm text-destructive peer-invalid:block peer-placeholder-shown:!hidden w-full"
            )}
          >
            Invalid {currency === CURRENCY.USD ? "email" : "phone"} number
          </span>
          <span
            className={cn(
              "hidden mt-1 text-sm peer-invalid:block peer-placeholder-shown:!hidden w-full",
              {
                block: verificationCodeSent && !canResend && !verified,
              }
            )}
          >
            You can resend verification code in 1 minute.
          </span>
        </div>

        <div
          className={cn("max-h-fit opacity-100", {
            "max-h-0 overflow-hidden opacity-0 transition-all !my-0": !(
              verificationCodeSent && !verified
            ),
          })}
          aria-hidden={!(verificationCodeSent && !verified)}
        >
          <Label className="mb-2.5 block" htmlFor="code">
            Verification code
          </Label>
          <Input
            id="code"
            className="peer inline max-w-[calc(65%_-_0.5rem)]"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={verifyLoading}
            maxLength={6}
            minLength={6}
            pattern="\d{6}"
            placeholder="Enter the 6-digit code"
          />
          <Button
            className="inline-flex w-fit min-w-[35%] ml-[0.5rem]"
            loading={verifyLoading}
            disabled={code?.length !== 6}
            type="button"
            onClick={handleVerificationCode}
          >
            Verify
          </Button>

          <span
            className={cn(
              "hidden mt-1 text-sm text-destructive peer-invalid:block peer-placeholder-shown:!hidden w-full"
            )}
          >
            Invalid verification code
          </span>
          <span
            className={cn("hidden mt-1 text-sm text-destructive w-full", {
              block: verifyError,
            })}
          >
            {formatErrorMessage(
              verifyError,
              `An error occurred while verifying ${
                currency === CURRENCY.USD ? "email" : "phone"
              }`
            )}
          </span>
        </div>
        {updateError && (
          <p className={cn("mt-1 text-sm text-destructive")}>
            {formatErrorMessage(
              updateError,
              "An error occurred wile updating pledge."
            )}
          </p>
        )}
        {sendCodeError && (
          <p className={cn("mt-1 text-sm text-destructive")}>
            {formatErrorMessage(
              sendCodeError,
              "An error occurred while sending code."
            )}
          </p>
        )}
        {phoneError && (
          <p className={cn("mt-1 text-sm text-destructive")} role="alert">
            Invalid phone number format. Please use one of the following
            formats:
            <br />
            • +251XXXXXXXXX or 0XXXXXXXXX (Ethiopia)
            <br />
            • +1 (XXX) XXX-XXXX or +1-XXX-XXX-XXXX (US)
            <br />
            • +44 XXXX XXXXXX (UK)
            <br />• +[CountryCode] [LocalNumber] for other regions
          </p>
        )}
        <div className="flex flex-row gap-2">
          <Button
            disabled={
              !canGoBack() || updateLoading || sendCodeLoading || verifyLoading
            }
            variant={"outline"}
            onClick={goBack}
          >
            Go back
          </Button>
          <Button
            loading={updateLoading && verificationCodeSent}
            disabled={
              !canGoNext() || updateLoading
              // sendCodeLoading ||
              // !verified ||
              // verifyLoading
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


