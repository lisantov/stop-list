"use client";

import { create } from "zustand";

interface StopModalState {
  itemId: string | null;
  open: (itemId: string) => void;
  close: () => void;
}

export const useStopModalStore = create<StopModalState>((set) => ({
  itemId: null,
  open: (itemId) => set({ itemId }),
  close: () => set({ itemId: null }),
}));