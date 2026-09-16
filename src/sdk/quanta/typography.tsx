/**
 * Standalone replacement for `@higgsfield/quanta/typography`.
 *
 * A single `<Tag>` renderer that applies a type style (`.q-type-<variant>`,
 * defined in `src/sdk/quanta-shim.css`) plus an optional semantic text color
 * (`.text-q-text-<color>`).
 */
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TypographyColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverse"
  | "brand"
  | "danger"
  | (string & {});

export interface TypographyProps {
  /** Host element — default `<span>`. */
  as?: ElementType;
  /**
   * Type style variant, e.g. `"title-lg-semi-bold"`, `"body-sm-regular"`,
   * `"caption-xs-medium"`, `"label-md-semi-bold"`. Anything matching
   * `title|body|caption|label|display|overline|code|quote` maps to the
   * `.q-type-*` scale; anything else is used verbatim as a class name.
   */
  variant?: string;
  color?: TypographyColor;
  /** Single-line ellipsis via Tailwind's `truncate`. */
  truncate?: boolean;
  className?: string;
  children?: ReactNode;
}

const TYPE_STYLE_PREFIXES = [
  "title",
  "body",
  "caption",
  "label",
  "display",
  "overline",
  "code",
  "quote",
];

export function Typography({
  as: Tag = "span",
  variant = "body-sm-regular",
  color,
  truncate = false,
  className,
  children,
  ...props
}: TypographyProps) {
  const isTypeStyle = TYPE_STYLE_PREFIXES.some((p) => variant.startsWith(p));
  return (
    <Tag
      className={cn(
        isTypeStyle ? `q-type-${variant}` : variant,
        color != null && `text-q-text-${color}`,
        truncate && "truncate",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}