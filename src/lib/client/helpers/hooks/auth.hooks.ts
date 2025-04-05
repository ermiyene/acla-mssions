import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { AuthUser, LoginDto } from "@/lib/server/dtos/auth.dto";
import { useEffect } from "react";
import { formatErrorMessage } from "@/lib/common/utils/error";

export function useLogin() {
  const endpoint = "/api/auth/login";
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const mutation = useMutation({
    mutationKey: [endpoint],
    mutationFn: async (loginData: LoginDto) =>
      await axios.post<{ user: AuthUser }>(endpoint, loginData),
    onSuccess: (res) => {
      const user = res.data.user;
      setAuthUser(user);
    },
  });

  return {
    login: mutation.mutateAsync,
    loading: mutation.isPending,
    error:
      mutation.isError &&
      formatErrorMessage(mutation.error, "An error occurred while logging in"),
  };
}

export function useGetCurrentUser({ onError }: { onError?: () => void } = {}) {
  const endpoint = "/api/auth/me";
  const { currentUser, setAuthUser } = useAuthStore((state) => state);
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      return await axios.get<AuthUser>(endpoint, {
        withCredentials: true,
      });
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!currentUser && query.isSuccess && query.data) {
      setAuthUser(query.data.data);
    }

    if (query.isError) {
      onError?.();
    }
  }, [query, currentUser, setAuthUser, onError]);

  return {
    loading: query.isPending,
    error: query.isError,
    success: query.isSuccess,
  };
}

export function useLogout() {
  const endpoint = "/api/auth/logout";
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const mutation = useMutation({
    mutationKey: [endpoint],
    mutationFn: async () => {
      try {
        return await axios.post(endpoint);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    },
    onSuccess: () => {
      setAuthUser(null);
    },
  });

  return {
    logout: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.isError,
    success: mutation.isSuccess,
  };
}
