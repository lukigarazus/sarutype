import { CharPerformanceHistory } from "../CharPerformance";
import { Options, defaultOptions } from "../Options";

import {
  optionsToPersistedOptions,
  persistedOptionsToOptions,
  PersistedOptions,
} from "./OptionsPersistence";

export type Persistence = {
  getOptions: () => Promise<Options>;
  setOptions: (options: Options) => Promise<void>;
  getCharPerformanceHistory: () => Promise<CharPerformanceHistory>;
  setCharPerformanceHistory: (
    charPerformanceHistory: CharPerformanceHistory,
  ) => Promise<void>;
};

type PersistedCharPerformanceHistory = CharPerformanceHistory;

export const localStoragePersistence: Persistence = {
  getOptions: async () => {
    const optionsFromStorage = localStorage.getItem("options");
    if (optionsFromStorage) {
      const options: PersistedOptions = JSON.parse(optionsFromStorage);
      const res = persistedOptionsToOptions(options);
      return res;
    }
    return defaultOptions;
  },
  setOptions: async (options) => {
    localStorage.setItem(
      "options",
      JSON.stringify(optionsToPersistedOptions(options)),
    );
  },
  getCharPerformanceHistory: async () => {
    const charPerformanceHistoryFromStorage = localStorage.getItem(
      "charPerformanceHistory",
    );
    if (charPerformanceHistoryFromStorage) {
      const charPerformanceHistory: PersistedCharPerformanceHistory =
        JSON.parse(charPerformanceHistoryFromStorage);
      return charPerformanceHistory;
    }
    return { hiragana: {}, roman: {} };
  },
  setCharPerformanceHistory: async (charPerformanceHistory) => {
    localStorage.setItem(
      "charPerformanceHistory",
      JSON.stringify(charPerformanceHistory),
    );
  },
};
