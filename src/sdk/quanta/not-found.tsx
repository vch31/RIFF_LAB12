/**
 * Standalone replacement for `@higgsfield/quanta/not-found` — the 404 panel.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface NotFoundProps {
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

export function NotFound({ className, icon, title, subtitle, children }: NotFoundProps) {
  return (
    <div className={cn("q-not-found", className)}>
      <div className="q-not-found-icon">{icon ?? <span className="q-not-found-code">404</span>}</div>
      <div className="q-not-found-title">{title ?? "Page not found"}</div>
      {subtitle != null ? <div className="q-not-found-subtitle">{subtitle}</div> : null}
      {children != null ? <div className="q-not-found-actions">{children}</div> : null}
    </div>
  );
}