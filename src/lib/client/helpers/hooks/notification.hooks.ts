import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { usePledgeStore } from "../../store/pledgeStore";
import { CURRENCY, EmailVerification, PhoneVerification } from "@prisma/client";
import { formatErrorMessage } from "@/lib/common/utils/error";

export function useSendVerification() {
  const phoneEndpoint = "/api/notification/send-phone-verification-code";
  const emailEndpoint = "/api/notification/send-email-verification-code";
  const { pledgeId, phone, email, currency } = usePledgeStore((state) => state);
  const endpoint = currency === CURRENCY.ETB ? phoneEndpoint : emailEndpoint;
  const contact =
    currency === CURRENCY.ETB
      ? {
          phone,
        }
      : {
          email,
        };

  const mutation = useMutation({
    mutationKey: [endpoint],
    mutationFn: async () =>
      await axios.post<{ sentAt: string }>(endpoint, { pledgeId, ...contact }),
  });

  return {
    sendVerification: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.isError
      ? formatErrorMessage(
          mutation.error,
          `An error occurred while sending ${
            currency === CURRENCY.ETB ? "phone" : "email"
          } verification`
        )
      : null,
  };
}

export function useVerify() {
  const phoneEndpoint = "/api/notification/verify-phone";
  const emailEndpoint = "/api/notification/verify-email";
  const { pledgeId, currency } = usePledgeStore((state) => state);
  const endpoint = currency === CURRENCY.ETB ? phoneEndpoint : emailEndpoint;

  const mutation = useMutation({
    mutationKey: [endpoint],
    mutationFn: async (code: string) =>
      await axios.post<{ verification: PhoneVerification | EmailVerification }>(
        endpoint,
        {
          pledgeId,
          code,
        }
      ),
  });

  return {
    verify: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.isError
      ? formatErrorMessage(
          mutation.error,
          `An error occurred while verifying ${
            currency === CURRENCY.ETB ? "phone" : "email"
          }`
        )
      : null,
  };
}

export function useSendPledgeLink() {
  const endpoint = "/api/notification/pledge-link";
  const { pledgeId } = usePledgeStore((state) => state);

  const mutation = useMutation({
    mutationKey: [endpoint],
    mutationFn: async () =>
      await axios.post<{ sentAt: string }>(endpoint, { pledgeId }),
  });

  return {
    sendPledgeLink: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.isError
      ? formatErrorMessage(
          mutation.error,
          "An error occurred while sending pledge link"
        )
      : null,
  };
}

export function useSendThankYou() {
  const endpoint = "/api/notification/thank-you";
  const { pledgeId } = usePledgeStore((state) => state);

  const mutation = useMutation({
    mutationKey: [endpoint],
    mutationFn: async () =>
      await axios.post<{ sentAt: string }>(endpoint, { pledgeId }),
  });

  return {
    sendThankYou: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.isError
      ? formatErrorMessage(
          mutation.error,
          "An error occurred while sending message"
        )
      : null,
  };
}
