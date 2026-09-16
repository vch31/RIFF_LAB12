/**
 * Standalone replacement for `@higgsfield/quanta/slider` — a styled range
 * input. `steps` may be an array of snap values or a count of notches
 * (0..n-1 levels), matching the original API.
 */
import { cn } from "@/lib/utils";

export interface SliderProps {
  /** Either discrete values to snap to, or a count of notches. */
  steps?: number[] | number;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

function useSteps(steps: number[] | number | undefined) {
  if (Array.isArray(steps) && steps.length > 0) {
    return { values: steps, count: steps.length };
  }
  if (typeof steps === "number" && steps > 0) {
    return { values: null, count: steps };
  }
  return { values: null, count: 0 };
}

export function Slider({
  steps,
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
  className,
  ...props
}: SliderProps) {
  const { values, count } = useSteps(steps);

  if (count > 0) {
    const notch = Math.max(0, Math.min(count - 1, Math.round(value ?? 0)));
    return (
      <input
        type="range"
        className={cn("q-slider", className)}
        min={0}
        max={count - 1}
        step={1}
        value={notch}
        disabled={disabled}
        onChange={(event) => {
          const index = Number(event.target.value);
          onChange?.(values != null ? (values[index] ?? values[values.length - 1]!) : index);
        }}
        {...props}
      />
    );
  }

  return (
    <input
      type="range"
      className={cn("q-slider", className)}
      min={min}
      max={max}
      step="any"
      value={value ?? min}
      disabled={disabled}
      onChange={(event) => onChange?.(Number(event.target.value))}
      {...props}
    />
  );
}