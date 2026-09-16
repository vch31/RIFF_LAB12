/**
 * Local stub for `@higgsfield/fnf/media` — a lightweight media reference.
 * In the standalone build a `MediaRef` is just `{ id, url, kind }`; nothing
 * platform-bound is attached to it.
 */
export interface MediaRef {
  /** Stable identifier (any string — UUID, upload id, etc.). */
  id?: string;
  /** Public URL of the media. */
  url?: string;
  kind?: "image" | "video" | "audio" | (string & {});
  contentType?: string;
  [key: string]: unknown;
}