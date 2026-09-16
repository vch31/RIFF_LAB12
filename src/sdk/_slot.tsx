/**
 * Minimal `render`-prop helper (Base-UI-Slot semantics) used by the local
 * sdk components: wraps a child element and merges our props onto it.
 * Event handlers are chained so both the child's and ours run.
 */
import { Children, cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";

type AnyProps = Record<string, unknown>;

function chain(parent: unknown, child: unknown): unknown {
  if (typeof parent !== "function") return child;
  if (typeof child !== "function") return parent;
  return (event: unknown) => {
    (child as (event: unknown) => void)(event);
    (parent as (event: unknown) => void)(event);
  };
}

export interface SlotProps {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

/** Merge `props` onto the single child; the child keeps its own className/handlers. */
export function Slot({ children, ...props }: SlotProps) {
  const child = Children.only(children);
  if (!isValidElement(child)) return child;

  const childProps = (child.props as AnyProps) ?? {};
  const merged: AnyProps = { ...childProps };

  for (const key of Object.keys(props)) {
    const value = props[key];
    if (typeof value === "function" && /^on[A-Z]/.test(key)) {
      merged[key] = chain(value, childProps[key]);
    } else {
      merged[key] = value;
    }
  }

  if (typeof props.className === "string") {
    merged.className = [childProps.className, props.className].filter(Boolean).join(" ");
  }

  return cloneElement(child as ReactElement<AnyProps>, merged);
}