import { Button } from "@/shared";

interface IProps {
  message?: string;
  onRetry: () => void;
}

export default function StopListError({ message, onRetry }: IProps) {
  return (
    <article className="flex w-full flex-col items-center gap-4 rounded-2xl border border-accent/30 bg-surface px-6 py-10 text-center shadow-sm">
      <p className="text-accent">
        {message || "Не удалось загрузить список позиций"}
      </p>
      <Button variant="outline" onClick={onRetry}>
        Повторить
      </Button>
    </article>
  );
}