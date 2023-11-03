import {
  Options,
  defaultOptions,
  pickDisplaySign,
  pickInputSignSystem,
  pickDisplaySignSystem,
} from "./Options";

export type Persistence = {
  getOptions: () => Promise<Options>;
  setOptions: (options: Options) => Promise<void>;
};

type PersistedOptions = {
  showTransliterationTimeout: number;
  numberOfWordsPerTest: number;
  inputSignSystem: string;
  displaySignSystem: {
    kind: string;
    allowedDisplaySigns: string[];
  };
};

const optionsToPersistedOptions = (options: Options): PersistedOptions => {
  return {
    showTransliterationTimeout: options.showTransliterationTimeout,
    numberOfWordsPerTest: options.numberOfWordsPerTest,
    inputSignSystem: options.inputSignSystem,
    displaySignSystem: {
      kind: options.displaySignSystem.kind,
      allowedDisplaySigns: Array.from(
        options.displaySignSystem.allowedDisplaySigns,
      ),
    },
  };
};

const persistedOptionsToOptions = (options: PersistedOptions): Options => {
  const withInput = pickInputSignSystem(
    options.inputSignSystem,
    defaultOptions,
  );
  const withDisplay = pickDisplaySignSystem(
    options.displaySignSystem.kind,
    withInput,
  );
  const withDisplaySigns = options.displaySignSystem.allowedDisplaySigns.reduce(
    (acc, sign) => {
      return pickDisplaySign({ kind: "add", sign }, acc);
    },
    withDisplay,
  );
  const withTimeout = {
    ...withDisplaySigns,
    showTransliterationTimeout: options.showTransliterationTimeout,
  };
  const withNumberOfWords = {
    ...withTimeout,
    numberOfWordsPerTest:
      options.numberOfWordsPerTest ?? defaultOptions.numberOfWordsPerTest,
  };
  return withNumberOfWords;
};

export const localStoragePersistence: Persistence = {
  getOptions: async () => {
    const optionsFromStorage = localStorage.getItem("options");
    if (optionsFromStorage) {
      const options: PersistedOptions = JSON.parse(optionsFromStorage);
      const res = persistedOptionsToOptions(options);
      console.log("getOptions", res);
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
};
