import type { MenuItem } from "@/types/menu";
import StopListItem from "./StopListItem";
import { pluralPositions } from "./stopList.config";

interface IProps {
  items: MenuItem[];
}

export default function StopListTable({ items }: IProps) {
  return (
    <article className="w-full overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-primary">Стоп-лист</h2>
        <span className="text-sm text-primary/50">
          {items.length} {pluralPositions(items.length)}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="px-6 py-10 text-center text-primary/50">
          Все позиции доступны
        </p>
      ) : (
        <ul className="divide-y divide-black/10">
          {items.map((item) => (
            <li key={item.id}>
              <StopListItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
