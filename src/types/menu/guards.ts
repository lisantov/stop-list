import { MenuItemStatusKind, Shop } from "./types";

export const isShop = (value: unknown): value is Shop => {
  return (
    typeof value === "string" &&
    (value === "kitchen" || value === "bar" || value === "pastry")
  );
};

export const isStatusKind = (value: unknown): value is MenuItemStatusKind => {
  return (
    typeof value === "string" && (value === "available" || value === "stopped")
  );
};
