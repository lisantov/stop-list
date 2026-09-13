"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { MenuItem, StopItemPayload } from "@/types/menu";
import { normalizeUntil, stopItemSchema, stopReasons } from "@/shared";
import { useStopItem, useUpdateItem } from "../model/query";
import { STOP_REASON_LABELS, isoToLocalInput } from "./stopList.config";

interface IProps {
  item: MenuItem;
  onClose: () => void;
}

type FormValues = z.input<typeof stopItemSchema>;

export default function StopFormModal({ item, onClose }: IProps) {
  const status = item.status;
  const isEdit = status.kind === "stopped";

  const form = useForm<FormValues>({
    resolver: zodResolver(stopItemSchema),
    defaultValues: {
      reason: status.kind === "stopped" ? status.reason : "out_of_stock",
      until:
        status.kind === "stopped" && status.until
          ? isoToLocalInput(status.until)
          : "",
    },
  });

  const stopItem = useStopItem();
  const updateItem = useUpdateItem();
  const isPending = stopItem.isPending || updateItem.isPending;
  const errorMessage = stopItem.error?.message ?? updateItem.error?.message;

  const submit = (values: FormValues) => {
    const body: StopItemPayload = {
      reason: values.reason,
      until: normalizeUntil(values.until),
    };
    const options = { onSuccess: () => onClose() };
    if (isEdit) updateItem.mutate({ id: item.id, body }, options);
    else stopItem.mutate({ id: item.id, body }, options);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-primary">
          {isEdit ? "Редактирование стоп-листа" : "Добавить в стоп-лист"}
        </h2>

        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reason" className="mb-1 block text-sm text-primary/80">
              Причина
            </label>
            <select
              id="reason"
              {...form.register("reason")}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-primary"
            >
              {stopReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {STOP_REASON_LABELS[reason]}
                </option>
              ))}
            </select>
            {form.formState.errors.reason && (
              <p className="mt-1 text-sm text-accent">
                {form.formState.errors.reason.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="until" className="mb-1 block text-sm text-primary/80">
              До (пусто — до конца смены)
            </label>
            <input
              id="until"
              type="datetime-local"
              {...form.register("until")}
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-primary"
            />
            {form.formState.errors.until && (
              <p className="mt-1 text-sm text-accent">
                {form.formState.errors.until.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-accent">{errorMessage}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-black/10 px-4 py-2 text-primary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-accent px-4 py-2 text-white disabled:opacity-50"
            >
              {isEdit ? "Сохранить" : "Остановить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}