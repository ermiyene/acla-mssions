import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CURRENCY } from "@prisma/client";
import { formatErrorMessage } from "@/lib/common/utils/error";

export type Donation = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  phoneVerifications: Array<{
    verificationDate?: string;
  }>;
  emailVerifications: Array<{
    verificationDate?: string;
  }>;
  monetaryContribution?: {
    amount: number;
    transferMethodId: string;
    currency: CURRENCY;
    transferConfirmations: Array<{
      screenShotUrl: string;
      screenShotKey: string;
    }>;
  };
  inKindContribution?: {
    inKindItemSelections: Array<{
      amount: number;
      inKindItemId: string;
      handOverDate: Date | null;
      inKindItem: {
        name: string;
        unit: string;
      };
    }>;
  };
};

export function useGetPledges() {
  const endpoint = "/api/admin/pledge";

  const query = useQuery({
    queryFn: async () =>
      await axios
        .get<Donation[]>(endpoint, { withCredentials: true })
        .catch((error) => {
          toast.error(formatErrorMessage(error));
          return { data: [] };
        }),
    queryKey: [endpoint],
    refetchOnWindowFocus: false,
  });

  return query;
}
