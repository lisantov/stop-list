"use client";

import { Button, Spinner } from "@/shared";
import type { MenuItem } from "@/types/menu";
import { useResumeItem } from "../model/query";
import { useSavingStore } from "../model/savingStore";
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

const RESUME_BLOCKED_TIP = "Нулевой остаток — вернуть в продажу нельзя";

export default function StopListItem({ item }: IProps) {
  const status = item.status;
  const isStopped = status.kind === "stopped";
  const isSaving = useSavingStore((state) => state.ids.includes(item.id));
  const openModal = useStopModalStore((state) => state.open);
  const resume = useResumeItem();

  const canResume = item.stock > 0;
  const reason = isStopped ? STOP_REASON_LABELS[status.reason] : null;
  const until = isStopped && status.until ? formatDateTime(status.until) : null;
  const chipClass = isStopped
    ? "bg-primary/5 text-primary/50"
    : "bg-primary/10 text-primary/80";

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div className={`flex min-w-0 flex-col gap-2 ${isStopped ? "opacity-70" : ""}`}>
        <h3 className="truncate text-xl font-semibold text-primary">
          {item.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-sm ${chipClass}`}>
            {SHOP_LABELS[item.shop]}
          </span>
          <span className={`rounded-full px-3 py-1 text-sm ${chipClass}`}>
            Осталось: {item.stock} шт.
          </span>
          <span className={`rounded-full px-3 py-1 text-sm ${chipClass}`}>
            Обновлено: {formatDateTime(item.updatedAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_BADGES[status.kind]}`}
          >
            {STATUS_LABELS[status.kind]}
          </span>
          {isSaving && (
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/70">
              <Spinner className="h-3.5 w-3.5" />
              Сохраняется…
            </span>
          )}
        </div>

        {isStopped && (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-sm text-accent">
            {reason}
            {until ? ` · до ${until}` : " · до конца смены"}
          </span>
        )}

        <div className="mt-1 flex items-center gap-2">
          {isStopped ? (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={isSaving}
                onClick={() => openModal(item.id)}
              >
                Изменить
              </Button>
              <span
                title={canResume ? undefined : RESUME_BLOCKED_TIP}
                className={canResume ? undefined : "cursor-not-allowed"}
              >
                <Button
                  size="sm"
                  isLoading={resume.isPending}
                  disabled={!canResume || resume.isPending}
                  onClick={() => {
                    if (!resume.isPending) resume.mutate(item.id);
                  }}
                >
                  Вернуть в продажу
                </Button>
              </span>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline-accent"
              disabled={isSaving}
              onClick={() => openModal(item.id)}
            >
              В стоп-лист
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}