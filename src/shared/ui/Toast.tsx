"use client";

import { create } from "zustand";

type ToastKind = "error" | "success";

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, kind?: ToastKind) => void;
  remove: (id: number) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (message, kind = "error") => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, kind }] }));
    setTimeout(() => get().remove(id), 4000);
  },
  remove: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

const KIND_STYLES: Record<ToastKind, string> = {
  error: "border-accent text-accent",
  success: "border-status-available text-status-available",
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-80 flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`animate-[toast-in_160ms_ease-out] rounded-xl border bg-surface px-4 py-3 text-sm shadow-lg pointer-events-auto ${KIND_STYLES[toast.kind]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}