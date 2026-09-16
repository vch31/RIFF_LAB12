/**
 * Standalone replacement for `@higgsfield/quanta/card` — a `card()` class recipe.
 */
import { cn } from "@/lib/utils";

export interface CardOptions {
  surface?: "solid" | "glass";
  elevation?: "flat" | "raised" | "raised-sm";
}

export function card(
  opts?: CardOptions,
  ...classes: Array<string | undefined | false | null>
): string {
  return cn(
    "q-card",
    opts?.surface === "glass" && "q-card-glass",
    opts?.elevation != null && `q-card-${opts.elevation}`,
    ...classes,
  );
}