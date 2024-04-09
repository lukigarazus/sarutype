import { HiraganaSign, hiraganaSigns } from "./hiraganaSigns";
import { hiraganaCharToRomaji } from "./hiraganaToRomaji";
import { getRandomSentence } from "./hiraganaRandomSentence";

export const hiraganaDisplay = {
  kind: "hiragana" as const,
  allowedDisplaySigns: new Set<HiraganaSign>(),
  possibleDisplaySigns: hiraganaSigns,
  getRandomSentence: getRandomSentence,
  convertToInputSigns: hiraganaCharToRomaji,
  reversedWordDelimiter: "\n",
  wordDelimiter: " ",
};
