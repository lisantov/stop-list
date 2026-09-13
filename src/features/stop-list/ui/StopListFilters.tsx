"use client";

import { usePathname, useRouter } from "next/navigation";
import { Select } from "@/shared";
import type { MenuItemStatusKind, Shop } from "@/types/menu";
import type { IGetItemsParams } from "../model/types";
import { SHOP_LABELS, STATUS_LABELS } from "./stopList.config";

type IProps = IGetItemsParams;

const SHOPS = Object.keys(SHOP_LABELS) as Shop[];
const STATUSES = Object.keys(STATUS_LABELS) as MenuItemStatusKind[];

export default function StopListFilters({ shop, status }: IProps) {
  const router = useRouter();
  const pathname = usePathname();

  const apply = (key: "shop" | "status", value: string) => {
    const params = new URLSearchParams();
    if (shop && !(key === "shop" && value === "all")) params.set("shop", shop);
    if (status && !(key === "status" && value === "all"))
      params.set("status", status);
    if (key === "shop" && value !== "all") params.set("shop", value);
    if (key === "status" && value !== "all") params.set("status", value);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      <Select
        id="filter-shop"
        label="Цех"
        value={shop ?? "all"}
        onChange={(event) => apply("shop", event.target.value)}
      >
        <option value="all">Все цеха</option>
        {SHOPS.map((shopId) => (
          <option key={shopId} value={shopId}>
            {SHOP_LABELS[shopId]}
          </option>
        ))}
      </Select>

      <Select
        id="filter-status"
        label="Статус"
        value={status ?? "all"}
        onChange={(event) => apply("status", event.target.value)}
      >
        <option value="all">Все позиции</option>
        {STATUSES.map((statusId) => (
          <option key={statusId} value={statusId}>
            {STATUS_LABELS[statusId]}
          </option>
        ))}
      </Select>
    </div>
  );
}