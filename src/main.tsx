import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { OptionsProvider } from "./components/OptionsContext.tsx";
import { PersistenceProvider } from "./components/PersistenceContext.tsx";

import "./index.css";
import { CharPerformanceHistoryProvider } from "./components/CharPerformanceHistoryContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistenceProvider>
      <OptionsProvider>
        <App />
      </OptionsProvider>
    </PersistenceProvider>
  </React.StrictMode>,
);
