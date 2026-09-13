import type { MenuItemStatusKind, Shop, StopReason } from "@/types/menu";

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: "Кухня",
  bar: "Бар",
  pastry: "Кондитерская",
};

export const STATUS_LABELS: Record<MenuItemStatusKind, string> = {
  available: "Доступно",
  stopped: "Остановлено",
};

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: "Закончились продукты",
  equipment: "Поломка оборудования",
  quality: "Вопросы к качеству партии",
  menu_change: "Выведено из меню",
};

export const STATUS_BADGES: Record<MenuItemStatusKind, string> = {
  available: "bg-status-available/15 text-status-available",
  stopped: "bg-accent/15 text-accent",
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function isoToLocalInput(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function pluralPositions(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "позиция";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "позиции";
  return "позиций";
}