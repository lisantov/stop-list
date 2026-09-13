import type { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
}

export function Input({ label, id, error, hint, className = "", ...rest }: IProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-primary/80">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={`rounded-lg border bg-white px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 ${className} ${
          error ? "border-accent" : "border-black/10"
        }`}
        {...rest}
      />
      {error ? (
        <p className="text-sm text-accent">{error}</p>
      ) : hint ? (
        <p className="text-sm text-primary/50">{hint}</p>
      ) : null}
    </div>
  );
}