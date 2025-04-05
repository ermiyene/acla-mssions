import { ClientUploadedFileData } from "uploadthing/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CURRENCY } from "@prisma/client";

type State = {
  pledgeAmount?: number | null;
  name?: string;
  phone?: string;
  email?: string;
  transferMethod?: string | null;
  pledgeId?: string;
  currency?: CURRENCY;
  screenshot?: {
    key: string;
    url: string;
    raw?: object;
  } | null;
  targetAmount: number;
  contributedAmount: number;
  selectedItems: {
    id: string;
    name: string;
    amount: number;
    unit: string;
  }[];
  contributionType?: "money" | "in-kind" | "both" | null;
  step: number;
  verified?: boolean;
  verificationCodeSent?: boolean;
  canResend?: boolean;
  screenshotUploaded?: boolean;
};

type Action = {
  setPledgeAmount: (amount: number) => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setEmail: (email: string) => void;
  setTransferMethod: (method: string) => void;
  setPledgeId: (id: string) => void;
  setCurrency: (currency: CURRENCY) => void;
  setScreenshot: (
    file: {
      key: string;
      url: string;
      raw?: object;
    } | null
  ) => void;
  setTargetAmount: (targetAmount: number) => void;
  setContributedAmount: (targetAmount: number) => void;
  setSelectedItems: (
    items: {
      id: string;
      name: string;
      amount: number;
      unit: string;
    }[]
  ) => void;
  removeSelectedItem: (id: string) => void;
  addSelectedItem: (item: { id: string; name: string; unit: string }) => void;
  changeAmountOfSelectedItem: (id: string, amount: number) => void;
  setContributionType: (type: "money" | "in-kind" | "both" | null) => void;
  setStep: (step: number) => void;
  updatePledge: (pledge: {
    pledgeAmount?: number | null;
    name?: string;
    phone?: string;
    email?: string;
    currency?: CURRENCY;
    transferMethod?: string | null;
    selectedItems?: {
      id: string;
      name: string;
      amount: number;
      unit: string;
    }[];
  }) => void;
  setVerified: (phoneVerified: boolean) => void;
  setVerificationCodeSent: (isSent: boolean) => void;
  resetPledgeForm: () => void;
  setCanResend: (canResend: boolean) => void;
  setScreenshotUploaded: (uploaded: boolean) => void;
};

export const usePledgeStore = create(
  persist<State & Action>(
    (set, get) => ({
      pledgeAmount: 0,
      name: "",
      phone: "",
      email: "",
      currency: CURRENCY.ETB,
      transferMethod: undefined,
      pledgeId: "",
      screenshot: undefined,
      targetAmount: 3000000,
      contributedAmount: 1500000,
      selectedItems: [],
      step: 0,
      setCurrency: (currency) => {
        set({ currency });
      },
      setPledgeAmount: (amount) => {
        set({ pledgeAmount: amount });
      },
      setName: (name) => {
        set({ name });
      },
      setPhone: (phone) => {
        set({ phone });
      },
      setEmail: (email) => {
        set({ email });
      },
      setTransferMethod: (method) => {
        set({ transferMethod: method });
      },
      setPledgeId: (id) => {
        set({ pledgeId: id });
      },
      setScreenshot: (file) => {
        set({ screenshot: file });
      },
      setTargetAmount: (progress) => {
        set({ targetAmount: progress });
      },
      setContributedAmount: (progress) => {
        set({ contributedAmount: progress });
      },
      setSelectedItems: (items) => {
        set({ selectedItems: items });
      },
      removeSelectedItem: (id: string) => {
        const prev = get().selectedItems || [];
        const existingItem = prev.find((i) => i.id === id);
        if (existingItem) {
          set({ selectedItems: prev.filter((i) => i.id !== id) });
        }
      },
      addSelectedItem: (item: { id: string; name: string; unit: string }) => {
        const prev = get().selectedItems || [];
        const existingItem = prev.find((i) => i.id === item.id);
        if (!existingItem) {
          set({ selectedItems: [...prev, { ...item, amount: 1 }] });
        }
      },
      changeAmountOfSelectedItem: (id: string, amount: number) => {
        const prev = get().selectedItems || [];
        set({
          selectedItems: prev.map((i) =>
            i.id === id ? { ...i, amount: Math.max(1, amount) } : i
          ),
        });
      },
      setContributionType: (type) => {
        set({ contributionType: type });
      },
      setStep: (step) => {
        set({ step });
      },
      updatePledge: (pledge) => {
        set({ ...pledge });
      },
      setVerified: (phoneVerified) => {
        set({ verified: phoneVerified });
      },
      setVerificationCodeSent: (isSent) => {
        set({ verificationCodeSent: isSent });
      },
      resetPledgeForm: () => {
        set({
          pledgeAmount: 0,
          name: "",
          phone: "",
          transferMethod: null,
          pledgeId: "",
          screenshot: null,
          selectedItems: [],
          step: 0,
          verificationCodeSent: false,
          verified: false,
          canResend: false,
          contributionType: null,
          currency: "ETB",
          email: "",
          screenshotUploaded: false,
        });
      },
      setCanResend: (canResend) => {
        set({
          canResend,
        });
      },
      setScreenshotUploaded: (uploaded) => {
        set({
          screenshotUploaded: uploaded,
        });
      },
    }),
    {
      name: "pledge-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
