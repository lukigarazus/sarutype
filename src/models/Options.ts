import { Result } from "../types/Result";
import {
  HiraganaSet,
  HiraganaSign,
  HiraganaSigns,
  hiraganaSigns,
} from "../utils/language/hiragana";
import { getRandomSentence } from "../utils/language/words";
import { Sentence } from "./Sentence";

type Roman = "roman";
type Hiragana = "hiragana";
//type Hebrew = "hebrew";

export type AvailableDisplaySignSystems = Hiragana;
export const availableDisplaySignSystems: [Hiragana] = ["hiragana"];
export type AvailableInputSignsystems = Roman;
export const availableInputSignsystems: [Roman] = ["roman"];

type HiraganaDisplay = {
  kind: Hiragana;
  allowedDisplaySigns: HiraganaSet;
  possibleDisplaySigns: HiraganaSigns;
  getRandomSentence: (
    count: number,
    allowedChars: HiraganaSet,
  ) => Result<Sentence, string>;
};

export type Options = {
  showTransliterationTimeout: number;

  inputSignSystem: AvailableInputSignsystems;

  displaySignSystem: HiraganaDisplay;
};

export const defaultOptions: Options = {
  showTransliterationTimeout: 5000,

  inputSignSystem: "roman",

  displaySignSystem: {
    kind: "hiragana",
    allowedDisplaySigns: new Set(),
    possibleDisplaySigns: hiraganaSigns,
    getRandomSentence,
  },
};

export const pickInputSignSystem = (signSystem: string, options: Options) => {
  const newOptions = { ...options };
  if (availableInputSignsystems.includes(signSystem as Roman)) {
    newOptions.inputSignSystem = signSystem as Roman;
  }
  return newOptions;
};

export const pickDisplaySignSystem = (signSystem: string, options: Options) => {
  const newOptions = { ...options };
  if (signSystem === "hiragana") {
    newOptions.displaySignSystem = {
      kind: "hiragana",
      allowedDisplaySigns: new Set(),
      possibleDisplaySigns: hiraganaSigns,
      getRandomSentence,
    };
  }
  return newOptions;
};

export const pickDisplaySign = (
  event: { sign: string; kind: "add" | "remove" },
  options: Options,
): Options => {
  const newOptions = { ...options };
  if (newOptions.displaySignSystem.kind === "hiragana") {
    if (hiraganaSigns.includes(event.sign as HiraganaSign))
      switch (event.kind) {
        case "add":
          newOptions.displaySignSystem.allowedDisplaySigns.add(
            event.sign as HiraganaSign,
          );
          break;
        case "remove":
          newOptions.displaySignSystem.allowedDisplaySigns.delete(
            event.sign as HiraganaSign,
          );
          break;
      }
  }
  return newOptions;
};
