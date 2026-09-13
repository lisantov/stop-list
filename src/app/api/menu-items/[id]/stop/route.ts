import { stop } from "@/server/menu-store";
import type { StopItemPayload, StopReason } from "@/types/menu";
import { validateUntil } from "@/shared";

type Props = {
  params: Promise<{ id: string }>;
};

const REASONS: StopReason[] = [
  "out_of_stock",
  "equipment",
  "quality",
  "menu_change",
] as const;

export async function POST(request: Request, { params }: Props) {
  const { id } = await params;

  const body = (await request.json()) as Partial<StopItemPayload>;

  const reason = body.reason;
  if (!reason || !REASONS.includes(reason))
    return Response.json(
      { error: `Некорректная причина: ${reason}` },
      { status: 400 },
    );

  const until = typeof body.until === "string" ? body.until : null;
  const isUntilValid = validateUntil(until);

  if (typeof isUntilValid === "string")
    return Response.json({ error: isUntilValid }, { status: 404 });

  const item = stop(id, { reason, until });
  if (!item)
    return Response.json(
      { error: `Позиция в меню не найдена: ${id}` },
      { status: 404 },
    );

  return Response.json(item);
}
