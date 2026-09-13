import type { NextRequest } from "next/server";
import { getItems } from "@/server/menu-store";
import type { Shop } from "@/types/menu";

const SHOPS = ["kitchen", "bar", "pastry"] as readonly string[];
const STATUSES = ["available", "stopped"] as readonly string[];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const shop = searchParams.get("shop");
  const status = searchParams.get("status");

  if (shop && !SHOPS.includes(shop))
    return Response.json(
      { error: `Некорректный магазин: ${shop}` },
      { status: 400 },
    );

  if (status && !STATUSES.includes(status))
    return Response.json(
      { error: `Некорректный статус: ${status}` },
      { status: 400 },
    );

  const items = getItems({
    shop: (shop as Shop) ?? undefined,
    status: (status as "available" | "stopped") ?? undefined,
  });

  return Response.json(items);
}
