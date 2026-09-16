/**
 * Local stub for the Higgsfield generation-data model (`@higgsfield/fnf/client`).
 *
 * The original client talked to the Higgsfield platform API. In this
 * standalone build nothing fetches from the platform: the types below match
 * the shape the UI code reads, and the helpers are pure functions over that
 * shape, so generation results can come from any local source (demo data,
 * your own backend, etc.).
 */

export type OutputType = "image" | "video" | "audio" | "text" | (string & {});

export type JobPhase = "pending" | "running" | "succeeded" | "failed" | "cancelled";

export type GenerationStatus =
  | "queued"
  | "running"
  | "processing_models"
  | "video_post_processing"
  | "completed"
  | "failed"
  | "cancelled"
  | (string & {});

export interface GenerationInput {
  prompt?: { instruction?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export interface GenerationResults {
  /** Raw output media URL (image or video). */
  url?: string;
  /** Lower-resolution preview / poster frame. */
  thumbnailUrl?: string;
  previewUrl?: string;
  [key: string]: unknown;
}

export interface Generation {
  id: string;
  status: GenerationStatus;
  type: OutputType;
  input: GenerationInput;
  results: GenerationResults;
  /** Unix seconds (or ms). */
  createdAt?: number;
  failReason?: string;
  [key: string]: unknown;
}

/** Map a raw job status to the coarse phase the UI cares about. */
export function getJobPhase(generation: Pick<Generation, "status">): JobPhase {
  const status = generation.status;
  if (status === "completed") return "succeeded";
  if (status === "failed") return "failed";
  if (status === "cancelled") return "cancelled";
  return "running";
}

/**
 * Resolve the media type of a generation, or of a URL (image/video by
 * extension). Returns `undefined` when it can't be determined.
 */
export function getMediaType(
  value: Pick<Generation, "type"> | string | undefined,
): OutputType | undefined {
  if (value == null) return undefined;
  if (typeof value !== "string") return value.type;
  const normalized = value.toLowerCase().split("?")[0] ?? "";
  if (/\.(png|jpe?g|webp|gif|avif|svg|heic)$/.test(normalized)) return "image";
  if (/\.(mp4|webm|mov|m4v|avi|mkv)$/.test(normalized)) return "video";
  return undefined;
}

/** The generation produced a usable result (URL present). */
export function hasResult(generation: Generation): boolean {
  const results = generation.results;
  return results != null && Boolean(results.url || results.thumbnailUrl);
}

export function getRawUrl(generation: Generation): string | undefined {
  return generation.results?.url;
}

export function getPreviewUrl(generation: Generation): string | undefined {
  return generation.results?.previewUrl ?? generation.results?.thumbnailUrl ?? generation.results?.url;
}

const TERMINAL_STATUSES: ReadonlySet<string> = new Set(["completed", "failed", "cancelled"]);

export function isTerminalJobStatus(status: string): boolean {
  return TERMINAL_STATUSES.has(status);
}