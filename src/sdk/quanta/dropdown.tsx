/**
 * Standalone replacement for `@higgsfield/quanta/dropdown` — a lightweight
 * menu rendered in a portal next to its trigger, with outside-click/Escape
 * dismissal and per-item actions.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Slot } from "@/sdk/_slot";

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLElement | null;
  setAnchor: (el: HTMLElement | null) => void;
};

const DropdownContext = createContext<DropdownContextValue>({
  open: false,
  setOpen: () => {},
  anchor: null,
  setAnchor: () => {},
});

function DropdownRoot({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const closeOnOutside = useCallback(
    (event: PointerEvent) => {
      const target = event.target as Node;
      if (anchor != null && !anchor.contains(target)) setOpen(false);
    },
    [anchor],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", closeOnOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", closeOnOutside);
    };
  }, [open, closeOnOutside]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, anchor, setAnchor }}>
      {children}
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Swap the host element (Base-UI-style `render`). */
  render?: React.ReactElement;
  asChild?: boolean;
}

function DropdownTrigger({
  render,
  asChild,
  children,
  onClick,
  onPointerDown,
  ...props
}: DropdownTriggerProps) {
  const { open, setOpen, setAnchor } = useContext(DropdownContext);
  const ref = useRef<HTMLElement | null>(null);

  const mergedRef = (el: HTMLElement | null) => {
    ref.current = el;
    setAnchor(el);
  };

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setOpen(!open);
  };

  if (render != null || asChild) {
    return (
      <Slot ref={mergedRef} {...props} onClick={toggle} onPointerDown={onPointerDown}>
        {render ?? children}
      </Slot>
    );
  }

  return (
    <button
      ref={mergedRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggle}
      onPointerDown={onPointerDown}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownContentProps {
  surface?: "solid" | "glass";
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  children?: ReactNode;
}

function DropdownContent({
  surface = "solid",
  side = "bottom",
  align = "end",
  sideOffset = 6,
  className,
  children,
}: DropdownContentProps) {
  const { open, anchor } = useContext(DropdownContext);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !anchor) {
      setPosition(null);
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const measured = contentRef.current?.getBoundingClientRect();
    let left = rect.left;
    if (align === "end" && measured) left = rect.right - measured.width;
    if (align === "center" && measured) left = rect.left + (rect.width - measured.width) / 2;
    let top = side === "bottom" ? rect.bottom + sideOffset : rect.top - sideOffset - (measured?.height ?? 0);
    if (measured) {
      left = Math.max(8, Math.min(left, window.innerWidth - measured.width - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - measured.height - 8));
    }
    setPosition({ top, left });
  }, [open, anchor, side, align, sideOffset]);

  if (!open || !anchor) return null;

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      data-state="open"
      className={cn("q-dropdown", `q-dropdown-${surface}`, className)}
      style={
        position != null
          ? { position: "fixed", top: position.top, left: position.left, zIndex: 60 }
          : undefined
      }
    >
      {children}
    </div>,
    document.body,
  );
}

export interface DropdownItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  value?: string;
  danger?: boolean;
  start?: ReactNode;
  title?: ReactNode;
  onSelect?: () => void;
}

function DropdownItem({
  danger = false,
  start,
  title,
  onSelect,
  onClick,
  children,
  className,
  ...props
}: DropdownItemProps) {
  const { setOpen } = useContext(DropdownContext);
  return (
    <button
      type="button"
      role="menuitem"
      className={cn("q-dropdown-item", danger && "q-dropdown-item-danger", className)}
      onClick={(event) => {
        onClick?.(event);
        onSelect?.();
        setOpen(false);
      }}
      {...props}
    >
      {start != null ? <span className="q-dropdown-item-start">{start}</span> : null}
      {title != null ? <span className="q-dropdown-item-title">{title}</span> : children}
    </button>
  );
}

export const Dropdown = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
});