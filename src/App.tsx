/**
 * Application shell: routing (react-router), page meta, error boundary and the
 * 404 page. The document head lives in `index.html`; per-page <title> is set
 * here so it always matches the current route.
 */
import { Component, useEffect } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import { NotFound } from "@/sdk/quanta/not-found";
import { button } from "@/sdk/quanta/button";
import Landing from "@/pages/Landing";
import Studio from "@/pages/Studio";

import appMetaJson from "./app-meta.json";

const appMeta = appMetaJson as {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
};

const STUDIO_TITLE = "RIFF LAB — Студия";

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info);
  }

  render() {
    if (this.state.error != null) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-q-background-primary px-4">
          <div className="max-w-md text-center text-q-text-primary">
            <h1 className="q-type-title-lg-semi-bold text-q-text-primary">
              This page didn&apos;t load
            </h1>
            <p className="q-type-body-sm-regular mt-2 text-q-text-secondary">
              Something went wrong on our end. You can try refreshing, or head back home.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a href="/" className={button({ variant: "primary", size: "md" })}>
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFoundPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-q-background-primary px-4">
      <NotFound
        className="mx-auto max-w-md"
        icon={<span className="q-type-title-md-semi-bold text-q-text-primary">404</span>}
        title="Page not found"
        subtitle="The page you're looking for doesn't exist or has been moved."
      >
        <Link to="/" className={button({ variant: "primary", size: "md" }, "mt-3")}>
          Go home
        </Link>
      </NotFound>
    </div>
  );
}

export function App() {
  const location = useLocation();

  useEffect(() => {
    document.title = location.pathname.startsWith("/app")
      ? STUDIO_TITLE
      : (appMeta.og_title ?? "RIFF LAB");
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Studio />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}