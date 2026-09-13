import type { MenuItem } from "@/types/menu";
import {
  SHOP_LABELS,
  STATUS_BADGES,
  STATUS_LABELS,
  STOP_REASON_LABELS,
  formatDateTime,
} from "./stopList.config";

interface IProps {
  item: MenuItem;
}

export default function StopListItem({ item }: IProps) {
  const status = item.status;
  const isStopped = status.kind === "stopped";
  const reason = status.kind === "stopped" ? STOP_REASON_LABELS[status.reason] : null;
  const until =
    status.kind === "stopped" && status.until ? formatDateTime(status.until) : null;

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/80">
            {SHOP_LABELS[item.shop]}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/80">
            Осталось: {item.stock} шт.
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/80">
            Обновлено: {formatDateTime(item.updatedAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_BADGES[status.kind]}`}
        >
          {STATUS_LABELS[status.kind]}
        </span>
        {isStopped && (
          <p className="text-sm text-accent">
            {reason}
            {until ? ` · до ${until}` : " · до конца смены"}
          </p>
        )}
      </div>
    </article>
  );
}