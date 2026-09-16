/**
 * Standalone replacement for `@higgsfield/quanta/sidebar` — the app-shell
 * navigation sidebar compound.
 */
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SidebarRootProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function SidebarRoot({ className, style, children }: SidebarRootProps) {
  return (
    <aside className={cn("q-sidebar", className)} style={style}>
      {children}
    </aside>
  );
}

function SidebarHeader({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("q-sidebar-header", className)}>{children}</div>;
}

function SidebarSwitcher({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("q-sidebar-switcher", className)}>{children}</div>;
}

function SidebarLogo({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("q-sidebar-logo", className)}>{children}</div>;
}

function SidebarTitle({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("q-sidebar-title", className)}>{children}</div>;
}

function SidebarToggle({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <button type="button" className={cn("q-sidebar-toggle", className)} aria-label="Toggle sidebar">
      {children}
    </button>
  );
}

function SidebarBody({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("q-sidebar-body", className)}>{children}</div>;
}

function SidebarSection({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("q-sidebar-section", className)}>{children}</div>;
}

function SidebarSectionItems({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <nav className={cn("q-sidebar-section-items", className)}>{children}</nav>;
}

export interface SidebarItemProps {
  selected?: boolean;
  onClick?: () => void;
  start?: ReactNode;
  title?: ReactNode;
  className?: string;
  children?: ReactNode;
}

function SidebarItem({ selected = false, onClick, start, title, className, children }: SidebarItemProps) {
  return (
    <button
      type="button"
      aria-current={selected ? "page" : undefined}
      data-selected={selected || undefined}
      className={cn("q-sidebar-item", selected && "q-sidebar-item-selected", className)}
      onClick={onClick}
    >
      {start != null ? <span className="q-sidebar-item-start">{start}</span> : null}
      {title != null ? <span className="q-sidebar-item-title">{title}</span> : children}
    </button>
  );
}

function SidebarFooter({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn("q-sidebar-footer", className)}>{children}</div>;
}

export const Sidebar = Object.assign(SidebarRoot, {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Switcher: SidebarSwitcher,
  Logo: SidebarLogo,
  Title: SidebarTitle,
  Toggle: SidebarToggle,
  Body: SidebarBody,
  Section: SidebarSection,
  SectionItems: SidebarSectionItems,
  Item: SidebarItem,
  Footer: SidebarFooter,
});