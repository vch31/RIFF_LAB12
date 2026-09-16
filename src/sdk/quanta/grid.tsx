/**
 * Standalone replacement for `@higgsfield/quanta/grid` — `VirtualGrid`.
 *
 * This stub renders the same CSS-grid interface as the original but is not
 * window-virtualized: it lays out all items lazily and uses an
 * IntersectionObserver sentinel to fire `onEndReached`. Swapping in a real
 * virtualization library (e.g. `@tanstack/react-virtual`) is a drop-in change
 * — the prop contract is unchanged.
 */
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface VirtualGridProps<T> {
  items: readonly T[];
  cols?: number;
  /** Fixed row height in px. */
  rowHeight?: number;
  /** Gap between cells in px. */
  gap?: number;
  /** Accepted for API compatibility (ignored by this simple layout). */
  overscan?: number;
  /** Viewport height — a number (px) or a CSS string like "100%". */
  height?: number | string;
  viewportClassName?: string;
  className?: string;
  getKey?: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  onEndReached?: () => void;
  endReachedThresholdPx?: number;
}

export function VirtualGrid<T>({
  items,
  cols = 5,
  rowHeight = 148,
  gap = 3,
  height,
  viewportClassName,
  className,
  getKey,
  renderItem,
  onEndReached,
  endReachedThresholdPx = 240,
}: VirtualGridProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onEndReachedRef = useRef(onEndReached);
  onEndReachedRef.current = onEndReached;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || onEndReachedRef.current == null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onEndReachedRef.current?.();
      },
      { rootMargin: `${endReachedThresholdPx}px 0px 0px 0px` },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length, endReachedThresholdPx]);

  const style: CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap,
  };

  return (
    <div
      className={cn("q-virtual-grid q-virtual-grid-viewport", viewportClassName, className)}
      style={height != null ? { height: typeof height === "number" ? `${height}px` : height } : undefined}
    >
      <div className="q-virtual-grid-inner" style={style}>
        {items.map((item, index) => (
          <div
            key={getKey != null ? getKey(item, index) : index}
            style={{ height: rowHeight }}
            className="q-virtual-grid-cell"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" className="q-virtual-grid-sentinel" />
    </div>
  );
}