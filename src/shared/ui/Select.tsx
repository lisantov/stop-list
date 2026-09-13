import type { ReactNode, SelectHTMLAttributes } from "react";

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, id, error, className = "", children, ...rest }: IProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-primary/80">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        className={`rounded-lg border bg-white px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 ${className} ${
          error ? "border-accent" : "border-black/10"
        }`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-sm text-accent">{error}</p>}
    </div>
  );
}