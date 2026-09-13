import { stop } from "@/server/menu-store";
import { isSimulatedFailure } from "@/server/network-sim";
import type { StopItemPayload } from "@/types/menu";
import { normalizeUntil, stopItemSchema } from "@/shared";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  const { id } = await params;

  if (isSimulatedFailure()) {
    return Response.json(
      { error: "Сервер временно недоступен, попробуйте ещё раз" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = stopItemSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Некорректные данные";
    return Response.json({ error: message }, { status: 400 });
  }

  const payload: StopItemPayload = {
    reason: parsed.data.reason,
    until: normalizeUntil(parsed.data.until),
  };

  const result = stop(id, payload);
  if (!result.ok) {
    return Response.json({ error: "Позиция в меню не найдена" }, { status: 404 });
  }

  return Response.json(result.item);
}