import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";

import { CharPerformanceHistory } from "../models/CharPerformance";
import { usePersistence } from "./PersistenceContext";

type Status =
  | { kind: "loading" }
  | { kind: "loaded"; value: CharPerformanceHistory }
  | { kind: "error"; error: Error };

export const CharPerformanceHistoryContext = createContext<{
  setCharPerformanceHistory: (
    charPerformanceHistory:
      | CharPerformanceHistory
      | ((prev: CharPerformanceHistory) => CharPerformanceHistory),
  ) => void;
  status: Status;
}>({
  setCharPerformanceHistory: () => {},
  status: { kind: "loading" },
});

export const CharPerformanceHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { persistence } = usePersistence();

  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const setCharPerformanceHistory = useCallback(
    (
      charPerformanceHistoryHandler:
        | CharPerformanceHistory
        | ((prev: CharPerformanceHistory) => CharPerformanceHistory),
    ) => {
      let charPerformanceHistory: CharPerformanceHistory | undefined;

      if (typeof charPerformanceHistoryHandler === "function") {
        setStatus((prev) => {
          if (prev.kind !== "loaded") return prev;
          const newValue = charPerformanceHistoryHandler(prev.value);
          console.log("setting char performance history", newValue);
          persistence.setCharPerformanceHistory(newValue);
          return {
            kind: "loaded",
            value: newValue,
          };
        });
      } else {
        charPerformanceHistory = charPerformanceHistoryHandler;
      }

      if (!charPerformanceHistory) return;

      console.log("setting char performance history", charPerformanceHistory);
      persistence.setCharPerformanceHistory(charPerformanceHistory);
      setStatus({ kind: "loaded", value: charPerformanceHistory });
    },
    [persistence],
  );
  useEffect(() => {
    setStatus({ kind: "loading" });
    const load = async () => {
      const charPerformanceHistory =
        (await persistence.getCharPerformanceHistory()) || { hiragana: {} };
      setStatus({ kind: "loaded", value: charPerformanceHistory });
    };
    load()
      .then(console.log)
      .catch((err) => setStatus({ kind: "error", error: err }));
  }, [persistence]);

  const value = useMemo(
    () => ({
      setCharPerformanceHistory,
      status,
    }),
    [setCharPerformanceHistory, status],
  );

  return (
    <CharPerformanceHistoryContext.Provider value={value}>
      {children}
    </CharPerformanceHistoryContext.Provider>
  );
};

export const useCharPerformanceHistory = () =>
  useContext(CharPerformanceHistoryContext);
