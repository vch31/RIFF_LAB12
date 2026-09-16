/**
 * Standalone replacement for `@higgsfield/quanta/button`.
 *
 * A plain styled `<button>` + a `button()` class recipe, so callers can also
 * apply the same look to links (`<a className={button({ ... })} />`) and other
 * elements. Styling lives in `src/sdk/quanta-shim.css` (`.q-btn-*`).
 */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "outline"
  | "danger"
  | "marketingPrimary"
  | "marketingSecondary"
  | "marketingTertiary";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon-xs" | "icon-sm" | "icon-md";

export interface ButtonOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Class recipe — returns the styled-button token classes. */
export function button(
  opts?: ButtonOptions,
  ...classes: Array<string | undefined | false | null>
): string {
  return cn(
    "q-btn",
    `q-btn-${opts?.variant ?? "primary"}`,
    `q-btn-${opts?.size ?? "md"}`,
    ...classes,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading slot — an icon or other node rendered before the label. */
  start?: ReactNode;
  /** Trailing slot — rendered after the label. */
  end?: ReactNode;
  /** Square glyph-only button (label hidden, zero horizontal padding). */
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, start, end, iconOnly = false, className, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(button({ variant, size }, className), iconOnly && "q-btn-icon-only")}
      {...props}
    >
      {start != null ? <span className="q-btn-start">{start}</span> : null}
      {!iconOnly && children != null ? <span className="q-btn-label">{children}</span> : null}
      {!iconOnly && end != null ? <span className="q-btn-end">{end}</span> : null}
    </button>
  );
});