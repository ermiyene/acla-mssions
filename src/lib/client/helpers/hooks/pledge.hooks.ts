import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePledgeStore } from "../../store/pledgeStore";
import {
  CURRENCY,
  EmailVerification,
  InKindContribution,
  InKindItemSelection,
  MonetaryContribution,
  PhoneVerification,
  Pledge,
  TransferConfirmation,
  TransferMethod,
} from "@prisma/client";
import { formatErrorMessage } from "@/lib/common/utils/error";
import { useCallback, useEffect } from "react";
import { useInKindItems } from "./in-kind-items.hooks";
import posthog from "posthog-js";

export function useTransferMethods() {
  const endpoint = "/api/pledge/transfer-methods";
  return useQuery({
    queryKey: [endpoint],
    queryFn: async () =>
      await axios.get<
        {
          name: string;
          id: string;
          accountNumber: string;
          currency: CURRENCY;
          accountHolderName?: string;
          swiftCode?: string;
        }[]
      >(endpoint),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useAddTransferMethod() {
  const endpoint = "/api/pledge/transfer-methods";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: {
      name: string;
      accountNumber: string;
      currency: CURRENCY;
      accountHolderName?: string;
      swiftCode?: string;
    }) => await axios.post<TransferMethod>(endpoint, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
}

export function useEditTransferMethod() {
  const endpoint = "/api/pledge/transfer-methods";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: {
      id: string;
      name: string;
      accountNumber: string;
      currency: CURRENCY;
      accountHolderName?: string;
      swiftCode?: string;
    }) => await axios.put<TransferMethod>(endpoint, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
}

export function useDeleteTransferMethod() {
  const endpoint = "/api/pledge/transfer-methods";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: { id: string }) =>
      await axios.delete<TransferMethod>(endpoint, { data: dto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
}

export function useProgress() {
  const endpoint = "/api/pledge/progress";

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () =>
      await axios.get<{
        progress: number;
      }>(endpoint),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useCreatePledgeId() {
  const endpoint = "/api/pledge/id";
  const { pledgeId, setPledgeId } = usePledgeStore((state) => state);
  const hydrated = usePledgeStore.persist?.hasHydrated();

  const query = useQuery({
    queryKey: [endpoint, hydrated],
    enabled: !pledgeId && hydrated,
    queryFn: async () => {
      return (await axios.post<{ id: string }>(endpoint))?.data;
    },
  });

  useEffect(() => {
    if (pledgeId) {
      return;
    }
    const id = query?.data?.id;
    if (!id) {
      return;
    }

    posthog.identify(
      id // Required. Replace 'distinct_id' with your user's unique identifier
    );
    setPledgeId(id);
  }, [pledgeId, query?.data?.id, setPledgeId]);

  return query;
}

export function useUpdatePledge() {
  const endpoint = "/api/pledge/update";
  const { updatePledge } = usePledgeStore((state) => state);

  const mutation = useMutation({
    mutationKey: [endpoint],
    mutationFn: async (
      dto: Omit<Parameters<typeof updatePledge>[0], "selectedItems"> & {
        pledgeId: string;
        items?: {
          id: string;
          amount: number;
        }[];
      }
    ) =>
      await axios.put<
        Pledge & {
          monetaryContribution: MonetaryContribution;
          phoneVerifications: PhoneVerification[];
          emailVerifications: EmailVerification[];
        }
      >(endpoint, dto),
    onSuccess: (res) => {
      if (!res) {
        return;
      }
      const pledge = res.data;
      updatePledge({
        name: pledge.name || undefined,
        phone: pledge.phone || undefined,
        email: pledge.email || undefined,
        transferMethod: pledge.monetaryContribution?.transferMethodId,
        pledgeAmount: pledge.monetaryContribution?.amount,
        // selectedItems: pledge.selectedItems,
      });
    },
  });

  return {
    updatePledge: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.isError
      ? formatErrorMessage(
          mutation.error,
          "An error occurred while updating pledge"
        )
      : null,
  };
}

export function useGetPledge() {
  const endpoint = "/api/pledge/get";
  const pledgeStore = usePledgeStore((state) => state);
  const inKindItems = useInKindItems();

  const handleSuccess = useCallback(
    (
      data: AxiosResponse<
        {
          phone: string | null;
          email: string | null;
          name: string | null;
          id: string;
          createdAt: Date;
          updatedAt: Date;
          deletedAt: Date | null;
        } & {
          monetaryContribution: MonetaryContribution & {
            transferConfirmations: TransferConfirmation[];
          };
          phoneVerification: PhoneVerification;
          emailVerification: EmailVerification;
          inKindContribution: InKindContribution & {
            inKindItemSelections: InKindItemSelection[];
          };
        }
      >
    ) => {
      pledgeStore.updatePledge({
        name: data?.data?.name || pledgeStore?.name,
        phone: data?.data?.phone || pledgeStore?.phone,
        email: data?.data?.email || pledgeStore?.email,
        transferMethod:
          data?.data?.monetaryContribution?.transferMethodId ||
          pledgeStore?.transferMethod,
        pledgeAmount:
          data?.data?.monetaryContribution?.amount || pledgeStore?.pledgeAmount,
        currency:
          data?.data?.monetaryContribution?.currency || pledgeStore?.currency,
        selectedItems: data?.data?.inKindContribution?.inKindItemSelections
          ? data?.data?.inKindContribution?.inKindItemSelections.map(
              (item) => ({
                id: item.inKindItemId,
                amount: item.amount,
                name:
                  inKindItems?.data?.data?.find(
                    (i) => i.id === item.inKindItemId
                  )?.name || "",
                unit:
                  inKindItems?.data?.data?.find(
                    (i) => i.id === item.inKindItemId
                  )?.unit || "",
              })
            )
          : pledgeStore?.selectedItems,
      });

      if (
        data?.data?.phoneVerification?.verificationDate ||
        data?.data?.emailVerification?.verificationDate
      ) {
        pledgeStore.setVerified(true);
        pledgeStore.setVerificationCodeSent(true);
      } else if (
        data?.data?.phoneVerification ||
        data?.data?.emailVerification
      ) {
        pledgeStore.setVerificationCodeSent(true);
        pledgeStore.setVerified(false);
      }

      if (data?.data?.monetaryContribution?.transferConfirmations?.length) {
        const confirmation =
          data?.data?.monetaryContribution?.transferConfirmations[0];
        if (confirmation.screenShotUrl && confirmation.screenShotKey) {
          pledgeStore.setScreenshot({
            key: confirmation.screenShotKey,
            url: confirmation.screenShotUrl,
            raw: confirmation,
          });
          pledgeStore.setScreenshotUploaded(true);
        }
      }
    },
    [inKindItems?.data?.data, pledgeStore]
  );

  const mutation = useMutation({
    mutationFn: async (pledgeId: string) =>
      await axios.post<
        Pledge & {
          monetaryContribution: MonetaryContribution & {
            transferConfirmations: TransferConfirmation[];
          };
          phoneVerification: PhoneVerification;
          emailVerification: EmailVerification;
          inKindContribution: InKindContribution & {
            inKindItemSelections: InKindItemSelection[];
          };
        }
      >(endpoint, {
        pledgeId,
      }),
    onSuccess: handleSuccess,
  });

  return {
    getPledge: mutation.mutate,
    getPledgeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.isError
      ? formatErrorMessage(
          mutation.error,
          "An error occurred while fetching pledge"
        )
      : null,
  };
}

export function useSaveTransferConfirmation() {
  const endpoint = "/api/pledge/transfer-confirmation";
  const pledgeStore = usePledgeStore((state) => state);

  const mutation = useMutation({
    mutationFn: async (data: {
      pledgeId: string;
      screenShotKey: string;
      screenShotUrl: string;
      screenShotRaw: string;
    }) =>
      await axios.post<
        Pick<TransferConfirmation, "screenShotKey" | "screenShotUrl">
      >(endpoint, data),
  });

  return {
    saveTransferConfirmation: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.isError
      ? formatErrorMessage(
          mutation.error,
          "An error occurred while saving confirmation"
        )
      : null,
  };
}
