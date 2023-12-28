/* eslint-disable @typescript-eslint/no-explicit-any */

import { hiraganaDisplay } from "./signSystems/hiragana/hiraganaDisplay";
import { AllSignSystems, allSignSystems } from "./signSystems/types";

export const defaultOptions = {
  showTransliterationTimeout: 5000,
  numberOfWordsPerTest: 10,

  inputSignSystem: "roman" as AllSignSystems,

  displaySignSystem: hiraganaDisplay,

  reverseSignSystems: false,

  showLog: false,
};

export type Options = typeof defaultOptions;

export const pickInputSignSystem = (signSystem: string, options: Options) => {
  const newOptions = { ...options };
  if (allSignSystems.includes(signSystem as any)) {
    newOptions.inputSignSystem = signSystem as AllSignSystems;
  }
  return newOptions;
};

export const pickDisplaySignSystem = (signSystem: string, options: Options) => {
  const newOptions = { ...options };
  if (signSystem === "hiragana") {
    newOptions.displaySignSystem = hiraganaDisplay;
  }
  return newOptions;
};

export const pickDisplaySign = (
  event: { sign: string; kind: "add" | "remove" },
  options: Options,
): Options => {
  const newOptions = { ...options };
  switch (event.kind) {
    case "add":
      newOptions.displaySignSystem.allowedDisplaySigns.add(event.sign as any);
      break;
    case "remove":
      newOptions.displaySignSystem.allowedDisplaySigns.delete(
        event.sign as any,
      );
      break;
  }
  return newOptions;
};

export const switchReverseSignSystems = (options: Options) => {
  const newOptions = { ...options };
  newOptions.reverseSignSystems = !newOptions.reverseSignSystems;
  return newOptions;
};
