/**
 * Standalone replacement for `@higgsfield/quanta/loader` — an accessible
 * progress indicator (spinner ring by default).
 */
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type LoaderVariant = "circle" | "dots" | "bars" | "lines";
export type LoaderSize = "xxs" | "xs" | "sm" | "md" | "lg";
export type LoaderColor = "neutral" | "brand" | "primary" | "secondary";

export interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: LoaderColor;
}

export function Loader({
  variant = "circle",
  size = "sm",
  color = "brand",
  className,
  ...props
}: LoaderProps) {
  return (
    <span
      role="status"
      className={cn("q-loader", `q-loader-${variant}`, `q-loader-${size}`, `q-loader-${color}`, className)}
      {...props}
    >
      <span className="q-loader-spinner" aria-hidden="true" />
    </span>
  );
}