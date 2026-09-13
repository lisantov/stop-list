"use client";

import type { MenuItem } from "@/types/menu";
import { useResumeItem } from "../model/query";
import { useStopModalStore } from "../model/stopModalStore";
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
  const reason = isStopped ? STOP_REASON_LABELS[status.reason] : null;
  const until = isStopped && status.until ? formatDateTime(status.until) : null;
  const openModal = useStopModalStore((s) => s.open);
  const resume = useResumeItem();

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="truncate text-xl font-semibold text-primary">
          {item.title}
        </h3>
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

      <div className="flex flex-col items-end gap-2">
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

        <div className="mt-1 flex items-center gap-2">
          {isStopped ? (
            <>
              <button
                type="button"
                onClick={() => openModal(item.id)}
                className="rounded-lg border border-black/10 px-3 py-1.5 text-sm text-primary"
              >
                Изменить
              </button>
              <button
                type="button"
                onClick={() => resume.mutate(item.id)}
                disabled={resume.isPending}
                className="rounded-lg bg-accent px-3 py-1.5 text-sm text-white disabled:opacity-50"
              >
                Вывести
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => openModal(item.id)}
              className="rounded-lg border border-accent/40 px-3 py-1.5 text-sm text-accent"
            >
              В стоп-лист
            </button>
          )}
        </div>
      </div>
    </article>
  );
}