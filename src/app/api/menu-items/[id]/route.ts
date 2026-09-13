import { update } from "@/server/menu-store";
import type { StopItemPayload } from "@/types/menu";
import { normalizeUntil, stopItemSchema } from "@/shared";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = stopItemSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  const payload: StopItemPayload = {
    reason: parsed.data.reason,
    until: normalizeUntil(parsed.data.until),
  };

  const result = update(id, payload);
  if (!result.ok) {
    const status = result.reason === "not_found" ? 404 : 409;
    return Response.json({ error: result.reason }, { status });
  }

  return Response.json(result.item);
}