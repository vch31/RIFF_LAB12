/**
 * Standalone replacement for `@higgsfield/quanta/avatar`.
 *
 * Renders a round image, or a colored initial chip when `src` is missing.
 */
import { cn } from "@/lib/utils";

export type AvatarColor =
  | "mint"
  | "moss"
  | "blue"
  | "indigo"
  | "purple"
  | "violet"
  | "pink"
  | "red"
  | "orange"
  | "amber"
  | "lime"
  | "teal"
  | "cyan"
  | "slate"
  | (string & {});

export type AvatarSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  color?: AvatarColor;
  className?: string;
}

const AVATAR_COLORS: Record<string, string> = {
  mint: "#34d399",
  moss: "#a3c34a",
  lime: "#a3e635",
  teal: "#2dd4bf",
  cyan: "#22d3ee",
  blue: "#60a5fa",
  indigo: "#818cf8",
  violet: "#8b5cf6",
  purple: "#a78bfa",
  pink: "#f472b6",
  red: "#f87171",
  orange: "#fb923c",
  amber: "#fbbf24",
  slate: "#94a3b8",
};

function initialsOf(alt: string | undefined): string {
  const parts = (alt ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ size = "sm", src, alt, color, className }: AvatarProps) {
  const classes = cn("q-avatar", `q-avatar-${size}`, className);
  if (src) {
    return <img src={src} alt={alt ?? ""} className={classes} />;
  }
  return (
    <span
      className={classes}
      role="img"
      aria-label={alt ?? undefined}
      style={color != null ? { backgroundColor: AVATAR_COLORS[color] ?? "#7c6bff" } : undefined}
    >
      {initialsOf(alt)}
    </span>
  );
}