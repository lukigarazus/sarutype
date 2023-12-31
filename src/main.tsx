import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { OptionsProvider } from "./components/OptionsContext.tsx";
import { PersistenceProvider } from "./components/PersistenceContext.tsx";

import "react-tooltip/dist/react-tooltip.css";

import "./index.css";
import { CharPerformanceHistoryProvider } from "./components/CharPerformanceHistoryContext.tsx";
import { LogProvider } from "./components/LogContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistenceProvider>
      <OptionsProvider>
        <CharPerformanceHistoryProvider>
          <LogProvider>
            <App />
          </LogProvider>
        </CharPerformanceHistoryProvider>
      </OptionsProvider>
    </PersistenceProvider>
  </React.StrictMode>,
);
