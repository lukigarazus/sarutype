import {
  ComponentType,
  PropsWithChildren,
  createContext,
  useState,
  useContext,
} from "react";

import { Persistence, localStoragePersistence } from "../models/Persistence";

const PersistenceContext = createContext({
  persistence: localStoragePersistence,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPersistence: (_persistence: Persistence) => {},
});

export const PersistenceProvider: ComponentType<PropsWithChildren> = ({
  children,
}) => {
  const [persistence, setPersistence] = useState<Persistence>(
    localStoragePersistence,
  );

  return (
    <PersistenceContext.Provider value={{ persistence, setPersistence }}>
      {children}
    </PersistenceContext.Provider>
  );
};

export const usePersistence = () => {
  const { persistence, setPersistence } = useContext(PersistenceContext);
  return { persistence, setPersistence };
};
