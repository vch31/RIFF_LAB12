/**
 * Standalone replacement for `@higgsfield/quanta/glass` — a `glass()` class recipe
 * for frosted-glass surfaces.
 */
import { cn } from "@/lib/utils";

export interface GlassOptions {
  blur?: "sm" | "md" | "lg";
  /** Quanta radius token number (e.g. `"400"`) → `rounded-q-400`. */
  rounded?: string;
}

export function glass(
  opts?: GlassOptions,
  ...classes: Array<string | undefined | false | null>
): string {
  return cn(
    "q-glass",
    `q-glass-blur-${opts?.blur ?? "md"}`,
    opts?.rounded != null && `rounded-q-${opts.rounded}`,
    ...classes,
  );
}