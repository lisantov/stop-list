import { resume } from "@/server/menu-store";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;

  const item = resume(id);
  if (!item)
    return Response.json(
      { error: `Позиция в меню не найдена: ${id}` },
      { status: 404 },
    );

  return Response.json(item);
}
