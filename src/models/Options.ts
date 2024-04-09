/* eslint-disable @typescript-eslint/no-explicit-any */

import { hiraganaDisplay } from "./signSystems/hiragana/hiraganaDisplay";
import { katakanaDisplay } from "./signSystems/katakana/katakanaDisplay";
import {
  AllSignSystems,
  allSignSystems,
  AllSignSystemDisplays,
} from "./signSystems/types";

export const defaultOptions = {
  showTransliterationTimeout: 5000,
  numberOfWordsPerTest: 10,

  inputSignSystem: "roman" as AllSignSystems,

  displaySignSystem: hiraganaDisplay as AllSignSystemDisplays,

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
  if (signSystem === "katakana") {
    newOptions.displaySignSystem = katakanaDisplay;
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
      newOptions.displaySignSystem.allowedDisplaySigns.add(event.sign);
      break;
    case "remove":
      newOptions.displaySignSystem.allowedDisplaySigns.delete(event.sign);
      break;
  }
  return newOptions;
};

export const switchReverseSignSystems = (options: Options) => {
  const newOptions = { ...options };
  newOptions.reverseSignSystems = !newOptions.reverseSignSystems;
  return newOptions;
};
