import { MenuItemStatusKind, Shop } from "@/types/menu";

export interface IGetItemsParams {
  shop?: Shop;
  status?: MenuItemStatusKind;
}
