/**
 * Standalone replacement for `@higgsfield/quanta/icon`.
 *
 * The original shipped a glyph system driven by the private `@higgsfield-ai/icons`
 * registry. This stub is fully local: it renders any React SVG component
 * (`lucide-react` icons, custom SVGs) sized and colored through the project's
 * own CSS tokens (see `src/sdk/quanta-shim.css`).
 */
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

export type IconSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
export type IconColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverse"
  | "brand"
  | "danger"
  | "success"
  | "warning";

/** Any component that renders an `<svg>` (lucide icons fit this shape). */
export type IconGlyph = ComponentType<SVGProps<SVGSVGElement>>;

export interface IconOptions {
  size?: IconSize;
  color?: IconColor;
}

/**
 * Class recipe for icon glyphs — `icon({ size: "sm" })` returns the token
 * classes that size (`.q-icon-sm`) and color (`.q-icon-color-primary`) the svg.
 */
export function icon(
  opts?: IconOptions,
  ...classes: Array<string | undefined | false | null>
): string {
  return cn(
    opts?.size != null && `q-icon-${opts.size}`,
    opts?.color != null && `q-icon-color-${opts.color}`,
    ...classes,
  );
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** The glyph component (e.g. a lucide icon). Required. */
  as?: IconGlyph;
  size?: IconSize;
  color?: IconColor;
}

export function Icon({ as: Glyph, size = "sm", color, className, ...props }: IconProps) {
  if (Glyph == null) return null;
  return <Glyph aria-hidden="true" focusable="false" className={icon({ size, color }, className)} {...props} />;
}