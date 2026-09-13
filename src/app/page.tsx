import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const shopParam = searchParams.get("shop");
  const statusParam = searchParams.get("status");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-semibold tracking-tight">stop-list</h1>
    </main>
  );
}
