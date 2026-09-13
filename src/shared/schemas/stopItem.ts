import { z } from "zod";
import { validateUntil } from "@/shared";

export const stopReasons = [
  "out_of_stock",
  "equipment",
  "quality",
  "menu_change",
] as const;

const IS_DATETIME_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export function toISO(value: string): string {
  return new Date(value).toISOString();
}

export function normalizeUntil(value: string | null | undefined): string | null {
  if (value == null || value === "") return null;
  return IS_DATETIME_LOCAL.test(value) ? toISO(value) : value;
}

export const stopItemSchema = z.object({
  reason: z.enum(stopReasons, { message: "Выберите причину" }),
  until: z
    .string()
    .trim()
    .refine(
      (value) => {
        if (value === "") return true;
        return validateUntil(normalizeUntil(value)) === null;
      },
      { message: "Некорректное время окончания" },
    )
    .nullable()
    .optional(),
});