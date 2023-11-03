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

export const CharPerformanceHistoryContext = createContext<{
  charPerformanceHistory: CharPerformanceHistory;
  setCharPerformanceHistory: (
    charPerformanceHistory: CharPerformanceHistory,
  ) => void;
  loading: boolean;
}>({
  charPerformanceHistory: { hiragana: {} },
  setCharPerformanceHistory: () => {},
  loading: true,
});

export const CharPerformanceHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { persistence } = usePersistence();

  const [loading, setLoadings] = useState(true);
  const [charPerformanceHistory, _setCharPerformanceHistory] = useState({
    hiragana: {},
  });
  const setCharPerformanceHistory = useCallback(
    (charPerformanceHistory: CharPerformanceHistory) => {
      console.log("setCharPerformanceHistory");
      persistence.setCharPerformanceHistory(charPerformanceHistory);
      _setCharPerformanceHistory(charPerformanceHistory);
    },
    [persistence],
  );
  useEffect(() => {
    setLoadings(true);
    const load = async () => {
      const charPerformanceHistory =
        await persistence.getCharPerformanceHistory();
      _setCharPerformanceHistory(charPerformanceHistory);
      setLoadings(false);
    };
    load();
  }, [persistence]);

  useEffect(() => {}, [charPerformanceHistory, persistence]);
  const value = useMemo(
    () => ({ charPerformanceHistory, setCharPerformanceHistory, loading }),
    [charPerformanceHistory, setCharPerformanceHistory, loading],
  );

  return (
    <CharPerformanceHistoryContext.Provider value={value}>
      {children}
    </CharPerformanceHistoryContext.Provider>
  );
};

export const useCharPerformanceHistory = () =>
  useContext(CharPerformanceHistoryContext);
