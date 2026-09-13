import { getItem, resume } from "@/server/menu-store";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;

  const item = getItem(id);
  if (!item)
    return Response.json(
      { error: "Позиция в меню не найдена" },
      { status: 404 },
    );

  if (item.stock === 0)
    return Response.json(
      { error: "Нельзя вернуть позицию с нулевым остатком" },
      { status: 409 },
    );

  const updated = resume(id);
  return Response.json(updated);
}