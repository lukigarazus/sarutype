import {
  Options,
  defaultOptions,
  pickDisplaySign,
  pickInputSignSystem,
  pickDisplaySignSystem,
} from "../Options";

export type PersistedOptions = {
  showTransliterationTimeout: number;
  numberOfWordsPerTest: number;
  inputSignSystem: string;
  displaySignSystem: {
    kind: string;
    allowedDisplaySigns: string[];
  };
  reverseSignSystems: boolean;
  showLog: boolean;
};

export const optionsToPersistedOptions = (
  options: Options,
): PersistedOptions => {
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
    reverseSignSystems: options.reverseSignSystems,
    showLog: options.showLog,
  };
};

export const persistedOptionsToOptions = (
  options: PersistedOptions,
): Options => {
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
  const withReverse = {
    ...withNumberOfWords,
    reverseSignSystems: options.reverseSignSystems,
  };
  const withLog = {
    ...withReverse,
    showLog: options.showLog,
  };
  return withLog;
};
