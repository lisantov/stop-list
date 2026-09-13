import { readFileSync } from "node:fs";
import path from "node:path";
import type { MenuItem, Shop, StopItemPayload } from "@/types/menu";

const seedPath = path.join(process.cwd(), "src/server/seed.json");
const seed = JSON.parse(readFileSync(seedPath, "utf-8")) as MenuItem[];

const items: MenuItem[] = seed;

export interface MenuItemsFilter {
  shop?: Shop;
  status?: "available" | "stopped";
}

export function getItems(filter: MenuItemsFilter = {}): MenuItem[] {
  return items.filter((item) => {
    if (filter.shop && item.shop !== filter.shop) return false;
    if (filter.status && item.status.kind !== filter.status) return false;
    return true;
  });
}

export function getItem(id: string): MenuItem | undefined {
  return items.find((item) => item.id === id);
}

export function resume(id: string): MenuItem | undefined {
  const item = getItem(id);
  if (!item) return undefined;
  if (item.status.kind === "stopped") {
    item.status = { kind: "available" };
    item.updatedAt = new Date().toISOString();
  }
  return item;
}

export function stop(id: string, payload: StopItemPayload): MenuItem | undefined {
  const item = getItem(id);
  if (!item) return undefined;
  if (item.status.kind === "available") {
    item.status = { kind: "stopped", ...payload };
    item.updatedAt = new Date().toISOString();
  }
  return item;
}

export type UpdateResult =
  | { ok: true; item: MenuItem }
  | { ok: false; reason: "not_found" | "not_stopped" };

export function update(id: string, payload: StopItemPayload): UpdateResult {
  const item = getItem(id);
  if (!item) return { ok: false, reason: "not_found" };
  if (item.status.kind !== "stopped") return { ok: false, reason: "not_stopped" };
  item.status = { kind: "stopped", ...payload };
  item.updatedAt = new Date().toISOString();
  return { ok: true, item };
}