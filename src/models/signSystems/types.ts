import { hiraganaDisplay } from "./hiragana/hiraganaDisplay";
import { katakanaDisplay } from "./katakana/katakanaDisplay";

const roman = "roman";
const hiragana = "hiragana";
const katakana = "katakana";

export const allSignSystems = [roman, hiragana, katakana] as const;
export type AllSignSystems = (typeof allSignSystems)[number];

export const availableSignSystemPairs: {
  input: AllSignSystems;
  display: AllSignSystems;
}[] = [
  { input: "roman", display: "hiragana" },
  { input: "roman", display: "katakana" },
];

export type AllSignSystemDisplays =
  | typeof hiraganaDisplay
  | typeof katakanaDisplay;
