import { z } from "zod";
import { validateUntil } from "@/shared";

export const stopReasons = [
  "out_of_stock",
  "equipment",
  "quality",
  "menu_change",
] as const;

const IS_DATETIME_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const IS_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export function toISO(value: string): string {
  return new Date(value).toISOString();
}

export function normalizeUntil(value: string | null | undefined): string | null {
  if (value == null || value === "") return null;
  if (IS_ISO.test(value)) return value;
  if (IS_DATETIME_LOCAL.test(value)) return toISO(value);
  return value;
}

export const stopItemSchema = z.object({
  reason: z.enum(stopReasons, { message: "Выберите причину" }),
  until: z
    .string()
    .trim()
    .refine(
      (value) => {
        if (value === "") return true;
        const iso = normalizeUntil(value);
        if (iso === null) return false;
        return validateUntil(iso) === null;
      },
      { message: "Некорректное время окончания" },
    )
    .nullable()
    .optional(),
});