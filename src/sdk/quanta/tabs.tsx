/**
 * Standalone replacement for `@higgsfield/quanta/tabs` — a compact
 * controlled/uncontrolled tab row with optional content panels.
 */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string | undefined;
  setValue: (value: string) => void;
  variant: "pill" | "segmented" | "plain";
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs parts must be used inside <Tabs.Root>");
  return ctx;
}

export type TabsVariant = "pill" | "segmented" | "plain";

export interface TabsRootProps {
  variant?: TabsVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

function TabsRoot({
  variant = "pill",
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsRootProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;
  const setValue = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };
  return (
    <TabsContext.Provider value={{ value: current, setValue, variant }}>
      <div className={cn("q-tabs", `q-tabs-${variant}`, className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  /** Buttons to render: `{ value, label, disabled? }`. */
  items?: Array<{ value: string; label: ReactNode; disabled?: boolean }>;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
}

function TabsList({ items, className, children, ...props }: TabsListProps) {
  const { value, setValue, variant } = useTabsContext();
  return (
    <div role="tablist" className={cn("q-tabs-list", `q-tabs-list-${variant}`, className)} {...props}>
      {items != null
        ? items.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={value === item.value}
              disabled={item.disabled}
              className={cn("q-tabs-tab", value === item.value && "q-tabs-tab-active")}
              onClick={() => setValue(item.value)}
            >
              {item.label}
            </button>
          ))
        : children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

function TabsTrigger({ value, disabled, className, children }: TabsTriggerProps) {
  const { value: current, setValue } = useTabsContext();
  return (
    <button
      type="button"
      role="tab"
      aria-selected={current === value}
      disabled={disabled}
      className={cn("q-tabs-tab", current === value && "q-tabs-tab-active", className)}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children?: ReactNode;
}

function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: current } = useTabsContext();
  if (current !== value) return null;
  return <div className={cn("q-tabs-content", className)}>{children}</div>;
}

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});