"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { Button, Input, Modal, Select } from "@/shared";
import type { MenuItem, StopItemPayload, StopReason } from "@/types/menu";
import { stopItemSchema, stopReasons, toISO } from "@/shared";
import { useStopItem } from "../model/query";
import { STOP_REASON_LABELS, isoToLocalInput } from "./stopList.config";

interface IProps {
  item: MenuItem;
  onClose: () => void;
}

interface FormValues {
  reason: StopReason | "";
  until: string;
}

export default function StopFormModal({ item, onClose }: IProps) {
  const status = item.status;
  const isEdit = status.kind === "stopped";

  const form = useForm<FormValues>({
    resolver: zodResolver(stopItemSchema) as Resolver<FormValues>,
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      reason: status.kind === "stopped" ? status.reason : "",
      until:
        status.kind === "stopped" && status.until
          ? isoToLocalInput(status.until)
          : "",
    },
  });

  const stopItem = useStopItem();
  const errorMessage = stopItem.error?.message;

  const submit = (values: FormValues) => {
    if (!values.reason) return;
    const body: StopItemPayload = {
      reason: values.reason,
      until: values.until === "" ? null : toISO(values.until),
    };
    stopItem.mutate(
      { id: item.id, body },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <Modal
      title={isEdit ? "Редактирование стоп-листа" : "Добавить в стоп-лист"}
      onClose={onClose}
    >
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
        <Select
          id="reason"
          label="Причина"
          error={form.formState.errors.reason?.message}
          {...form.register("reason")}
        >
          <option value="" disabled>
            Выберите причину
          </option>
          {stopReasons.map((reason) => (
            <option key={reason} value={reason}>
              {STOP_REASON_LABELS[reason]}
            </option>
          ))}
        </Select>

        <Input
          id="until"
          label="До"
          hint="Пусто — до конца смены"
          type="datetime-local"
          step={900}
          error={form.formState.errors.until?.message}
          {...form.register("until")}
        />

        {errorMessage && <p className="text-sm text-accent">{errorMessage}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" isLoading={stopItem.isPending}>
            {isEdit ? "Сохранить" : "Остановить"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}