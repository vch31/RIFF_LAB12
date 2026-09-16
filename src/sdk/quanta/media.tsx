/**
 * Standalone replacement for `@higgsfield/quanta/media`.
 *
 * A composition of a framed media container (`<Media>`) with `Image` / `Video` /
 * `Overlay` / `Fallback` parts. Autoplays videos when scrolled into view
 * (`autoPlayInView`), mirroring the original hover/scroll play behaviour.
 */
import { useEffect, useRef } from "react";
import type { ImgHTMLAttributes, ReactNode, VideoHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type MediaRatio = "auto" | "square" | "video" | "landscape" | "portrait";

export interface MediaProps {
  /** Preset ratio, or a numeric aspect ratio (width / height). */
  ratio?: MediaRatio | string | number;
  rounded?: "none" | "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}

const ROUNDED_MAP: Record<NonNullable<MediaProps["rounded"]>, string> = {
  none: "",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
};

export function MediaRoot({
  ratio = "auto",
  rounded = "none",
  className,
  children,
  ...props
}: MediaProps) {
  const ratioStyle =
    typeof ratio === "number" ? ({ aspectRatio: String(ratio) } as const) : undefined;
  return (
    <div
      className={cn(
        "q-media",
        typeof ratio === "string" && (ratio === "auto" ? "q-media-auto" : `q-media-${ratio}`),
        ROUNDED_MAP[rounded ?? "none"],
        className,
      )}
      style={ratioStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MediaImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fit?: "cover" | "contain";
}

export function MediaImage({ fit = "cover", className, ...props }: MediaImageProps) {
  return (
    <img
      className={cn("q-media-image", fit === "cover" ? "object-cover" : "object-contain", className)}
      {...props}
    />
  );
}

export interface MediaVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  fit?: "cover" | "contain";
  /** Play when visible, pause when scrolled out (requires `muted` + `playsInline`). */
  autoPlayInView?: boolean;
}

export function MediaVideo({ fit = "cover", autoPlayInView, className, ...props }: MediaVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!autoPlayInView || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => {
            /* autoplay blocked — the poster/controls still render */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlayInView]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      loop
      preload="metadata"
      className={cn("q-media-video", fit === "cover" ? "object-cover" : "object-contain", className)}
      {...props}
    />
  );
}

export type MediaOverlayPlacement = "center" | "top" | "bottom";

export interface MediaOverlayProps {
  placement?: MediaOverlayPlacement;
  className?: string;
  children?: ReactNode;
}

export function MediaOverlay({ placement = "bottom", className, children }: MediaOverlayProps) {
  return (
    <div
      className={cn(
        "q-media-overlay",
        placement === "center"
          ? "q-media-overlay-center"
          : placement === "top"
            ? "q-media-overlay-top"
            : "q-media-overlay-bottom",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface MediaFallbackProps {
  className?: string;
  children?: ReactNode;
}

export function MediaFallback({ className, children }: MediaFallbackProps) {
  return <div className={cn("q-media-fallback", className)}>{children}</div>;
}

export const Media = Object.assign(MediaRoot, {
  Image: MediaImage,
  Video: MediaVideo,
  Overlay: MediaOverlay,
  Fallback: MediaFallback,
});