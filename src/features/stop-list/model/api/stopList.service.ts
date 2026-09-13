import { fetcher } from "@/shared";
import type { MenuItem, StopItemPayload } from "@/types/menu";
import type { IGetItemsParams } from "../types";

export const stopListService = {
  getItems: (params?: IGetItemsParams) =>
    fetcher<MenuItem[], IGetItemsParams>("/api/menu-items", { query: params }),
  stop: (id: string, body: StopItemPayload) =>
    fetcher<MenuItem>(`/api/menu-items/${id}/stop`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  resume: (id: string) =>
    fetcher<MenuItem>(`/api/menu-items/${id}/resume`, {
      method: "POST",
    }),
  update: (id: string, body: StopItemPayload) =>
    fetcher<MenuItem>(`/api/menu-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
