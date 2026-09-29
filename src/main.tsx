import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { Presentation } from "./presentation/Presentation";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="h-screen w-screen overflow-hidden">
      <h1 className="sr-only">Inven2 Connect – guidet presentasjon</h1>
      <Presentation />
    </main>
  </StrictMode>,
);
