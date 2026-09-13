import { StopListContainer } from "@/features/stop-list";
import { isShop, isStatusKind } from "@/types/menu";

export default async function Home({ searchParams }: PageProps<"/">) {
  const raw = await searchParams;

  const shop = isShop(raw.shop) ? raw.shop : undefined;
  const status = isStatusKind(raw.status) ? raw.status : undefined;

  return (
    <>
      <header className="px-20 py-4 bg-accent">
        <h1 className="text-[48px] text-white uppercase font-mono font-semibold tracking-tight">
          stop-list
        </h1>
      </header>

      <main className="flex flex-1 flex-col bg-background gap-4 px-20 py-4">
        <StopListContainer shop={shop} status={status} />
      </main>
    </>
  );
}
