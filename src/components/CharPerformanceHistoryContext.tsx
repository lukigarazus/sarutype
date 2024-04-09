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
import {
  AsyncResult,
  mapAsyncResult,
  okAsyncResult,
} from "../types/AsyncResult";

type Status = AsyncResult<CharPerformanceHistory, string>;

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
        setStatus((prev) =>
          mapAsyncResult(prev, (prevValue) => {
            const newValue = charPerformanceHistoryHandler(prevValue);
            persistence.setCharPerformanceHistory(newValue);
            return okAsyncResult(newValue);
          }),
        );
      } else {
        charPerformanceHistory = charPerformanceHistoryHandler;
      }

      if (!charPerformanceHistory) return;

      persistence.setCharPerformanceHistory(charPerformanceHistory);
      setStatus(okAsyncResult(charPerformanceHistory));
    },
    [persistence],
  );

  useEffect(() => {
    setStatus({ kind: "loading" });
    const load = async () => {
      const charPerformanceHistory =
        (await persistence.getCharPerformanceHistory()) || { hiragana: {} };
      setStatus(okAsyncResult(charPerformanceHistory));
    };
    load().catch((err) => setStatus({ kind: "error", error: err }));
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
