import { AuthUser } from "@/lib/server/dtos/auth.dto";
import { create } from "zustand";

type State = {
  currentUser: AuthUser | null;
};

type Action = {
  setAuthUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<State & Action>((set) => ({
  currentUser: null,
  setAuthUser: (user) => {
    set({ currentUser: user });
  },
}));
