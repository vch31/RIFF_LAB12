import { useSearchParams } from "react-router-dom";

import { CustomTemplate } from "@/layouts/custom";

/**
 * Studio route — the app shell at `/app`. `?preview=1` renders the shell in
 * inert preview mode (used by inline previews).
 */
export default function Studio() {
  const [searchParams] = useSearchParams();
  const preview = searchParams.get("preview") === "1";
  return <CustomTemplate previewMode={preview} />;
}