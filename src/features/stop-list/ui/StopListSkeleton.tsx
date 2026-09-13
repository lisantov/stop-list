interface IProps {
  count?: number;
}

export default function StopListSkeleton({ count = 3 }: IProps) {
  return (
    <article className="w-full overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
        <div className="h-5 w-32 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-20 animate-pulse rounded bg-primary/5" />
      </div>
      <ul className="divide-y divide-black/10">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div className="flex min-w-0 flex-col gap-2">
                <div className="h-5 w-44 animate-pulse rounded bg-primary/10" />
                <div className="h-4 w-64 animate-pulse rounded bg-primary/5" />
              </div>
              <div className="h-8 w-28 animate-pulse rounded bg-primary/10" />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}