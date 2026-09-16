/**
 * Standalone replacement for `@higgsfield/quanta/modal` — a dependency-free
 * compound dialog rendered through a portal with backdrop, Escape-to-close and
 * click-outside handling.
 *
 * API mirrors the original: `Modal.Root / Trigger / Content / Header / Title /
 * CloseButton / Body / Footer / FooterActions / FooterCaption / Close`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { createPortal } from "react-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@/sdk/_slot";

type ModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ModalContext = createContext<ModalContextValue>({ open: false, setOpen: () => {} });

export const useModalContext = () => useContext(ModalContext);

export interface ModalRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children?: ReactNode;
}

function ModalRoot({ open, onOpenChange, defaultOpen = false, children }: ModalRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  return (
    <ModalContext.Provider value={{ open: isOpen, setOpen }}>{children}</ModalContext.Provider>
  );
}

export interface ModalTriggerProps {
  /** The trigger element — when set, its props are merged onto it (Base-UI `render` semantics). */
  render?: ReactElement;
  asChild?: boolean;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

function ModalTrigger({ render, asChild, children, ...props }: ModalTriggerProps) {
  const { setOpen } = useModalContext();
  const openHandler = () => setOpen(true);
  if (render != null || asChild) {
    return (
      <Slot {...props} onClick={openHandler}>
        {render ?? children}
      </Slot>
    );
  }
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <button type="button" onClick={openHandler} {...(props as any)}>
      {children}
    </button>
  );
}

export type ModalContentSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ModalContentProps {
  /** Width preset: sm / md / lg / xl / 2xl. */
  size?: ModalContentSize;
  className?: string;
  children?: ReactNode;
}

function ModalContent({ size = "md", className, children }: ModalContentProps) {
  const { open, setOpen } = useModalContext();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, setOpen]);

  if (!open) return null;

  return createPortal(
    <div className="q-modal-backdrop" onMouseDown={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn("q-modal", `q-modal-${size}`, className)}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalTitleContext.Provider value={titleId}>{children}</ModalTitleContext.Provider>
      </div>
    </div>,
    document.body,
  );
}

const ModalTitleContext = createContext<string | undefined>(undefined);

export interface ModalHeaderProps {
  /** Removes the default padding (for flush tab headers etc.). */
  flush?: boolean;
  className?: string;
  children?: ReactNode;
}

function ModalHeader({ flush = false, className, children }: ModalHeaderProps) {
  return (
    <div className={cn("q-modal-header", flush && "q-modal-header-flush", className)}>
      {children}
    </div>
  );
}

export interface ModalTitleProps {
  children?: ReactNode;
  className?: string;
}

function ModalTitle({ children, className }: ModalTitleProps) {
  const id = useContext(ModalTitleContext);
  return (
    <h2 id={id} className={cn("q-modal-title", className)}>
      {children}
    </h2>
  );
}

function ModalDescription({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <p className={cn("q-modal-description", className)}>{children}</p>;
}

function ModalCloseButton({ className }: { className?: string }) {
  const { setOpen } = useModalContext();
  return (
    <button
      type="button"
      aria-label="Close"
      className={cn("q-modal-close", className)}
      onClick={() => setOpen(false)}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function ModalBody({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("q-modal-body", className)}>{children}</div>;
}

function ModalFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("q-modal-footer", className)}>{children}</div>;
}

function ModalFooterActions({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cn("q-modal-footer-actions", className)}>{children}</div>;
}

function ModalFooterCaption({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cn("q-modal-footer-caption", className)}>{children}</div>;
}

export interface ModalCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Swap the host element (renders `children` through `Slot`). */
  render?: ReactElement;
  asChild?: boolean;
}

const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(function ModalClose(
  { render, asChild, children, onClick, ...props },
  ref,
) {
  const { setOpen } = useModalContext();
  const closeHandler = () => setOpen(false);
  if (render != null || asChild) {
    return (
      <Slot ref={ref} {...props} onClick={closeHandler}>
        {render ?? children}
      </Slot>
    );
  }
  return (
    <button
      ref={ref}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
});

export const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseButton: ModalCloseButton,
  Body: ModalBody,
  Footer: ModalFooter,
  FooterActions: ModalFooterActions,
  FooterCaption: ModalFooterCaption,
  Close: ModalClose,
});