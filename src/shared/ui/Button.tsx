import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "outline-accent";
  size?: "sm" | "md";
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANTS = {
  primary:
    "bg-accent text-white hover:bg-accent/90 active:bg-accent/80 active:scale-[0.98]",
  outline:
    "border border-black/10 text-primary hover:border-black/25 hover:bg-primary/5 active:bg-primary/10 active:scale-[0.98]",
  "outline-accent":
    "border border-accent/40 text-accent hover:border-accent/60 hover:bg-accent/5 active:bg-accent/10 active:scale-[0.98]",
} as const;

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  children,
  ...rest
}: IProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && <Spinner className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />}
        {children}
      </span>
    </button>
  );
}