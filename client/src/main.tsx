import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ApplicationState } from "./Store.tsx";

createRoot(document.getElementById("root")!).render(
  <ApplicationState>
    <App />
  </ApplicationState>,
);
