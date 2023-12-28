import {
  ComponentType,
  createContext,
  PropsWithChildren,
  useState,
  useMemo,
} from "react";

export const LogContext = createContext({
  log: [] as { event: string; context: Record<string, unknown> }[],
  push: (() => {}) as (event: string, context: Record<string, unknown>) => void,
});

export const LogProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const [log, setLog] = useState<
    { event: string; context: Record<string, unknown> }[]
  >([]);

  const value = useMemo(
    () => ({
      log,
      push: (event: string, context: Record<string, unknown>) => {
        setLog((log) => [...log, { event, context }]);
      },
    }),
    [log],
  );

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};
