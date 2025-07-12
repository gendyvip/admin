import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Ensure the DOM is ready before rendering
const rootElement = document.getElementById("root");

if (rootElement) {
  // Remove the fallback content once React is ready
  const fallbackContent = rootElement.querySelector(".loading-container");
  if (fallbackContent) {
    fallbackContent.remove();
  }

  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
