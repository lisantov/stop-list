"use client";

import { create } from "zustand";

interface SavingState {
  ids: string[];
  start: (id: string) => void;
  stop: (id: string) => void;
}

export const useSavingStore = create<SavingState>((set) => ({
  ids: [],
  start: (id) => set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
  stop: (id) => set((state) => ({ ids: state.ids.filter((itemId) => itemId !== id) })),
}));