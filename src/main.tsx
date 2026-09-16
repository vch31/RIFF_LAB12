import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles.css";
import { App } from "./App";

const container = document.getElementById("root");
if (container == null) {
  throw new Error("Missing #root element — check index.html");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);