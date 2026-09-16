/**
 * Standalone replacement for `@higgsfield/quanta/input` — a labelled input
 * with optional leading/trailing affix slots. Styling in `quanta-shim.css`.
 */
import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Caption label rendered above the control. */
  label?: ReactNode;
  /** Leading slot — typically an icon. */
  start?: ReactNode;
  /** Trailing slot — typically a unit or a chevron. */
  end?: ReactNode;
  /** Error message rendered under the control. */
  error?: ReactNode;
}

export function Input({ label, start, end, error, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="q-field" data-invalid={error != null ? "true" : undefined}>
      {label != null ? (
        <label className="q-field-label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="q-field-control">
        {start != null ? <span className="q-field-affix q-field-affix-start">{start}</span> : null}
        <input id={inputId} className={cn("q-field-input", className)} {...props} />
        {end != null ? <span className="q-field-affix q-field-affix-end">{end}</span> : null}
      </div>
      {error != null ? <span className="q-field-message">{error}</span> : null}
    </div>
  );
}