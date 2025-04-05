import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrandProvider } from "./context/brand-context";

createRoot(document.getElementById("root")!).render(
  <BrandProvider>
    <App />
  </BrandProvider>
);
