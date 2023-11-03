import {
  ComponentType,
  createContext,
  PropsWithChildren,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import { defaultOptions, Options } from "../models/Options";
import { usePersistence } from "./PersistenceContext";

export const OptionsContext = createContext({
  options: defaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOptions: (_options: Options) => {},
  loading: true,
});

export const OptionsProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const { persistence } = usePersistence();
  const [options, _setOptions] = useState<Options>(defaultOptions);

  const setOptions = useCallback(
    (options: Options) => {
      _setOptions(options);
      persistence.setOptions(options);
    },
    [_setOptions, persistence],
  );

  useEffect(() => {
    setLoading(true);
    persistence
      .getOptions()
      .then((options) => {
        console.log("options", options);
        _setOptions(options);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [persistence]);

  const value = useMemo(
    () => ({
      options,
      setOptions,
      loading,
    }),
    [options, setOptions, loading],
  );
  console.log("value", value);

  return (
    <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>
  );
};
