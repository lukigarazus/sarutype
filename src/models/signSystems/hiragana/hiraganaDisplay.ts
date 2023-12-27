import { HiraganaSign, hiraganaSigns } from "./hiraganaSigns";
import { getRandomSentence, hiraganaCharToRomaji } from "./hiraganaToRomaji";

export const hiraganaDisplay = {
  kind: "hiragana" as const,
  allowedDisplaySigns: new Set<HiraganaSign>(),
  possibleDisplaySigns: hiraganaSigns,
  getRandomSentence: getRandomSentence,
  convertToInputSigns: hiraganaCharToRomaji,
  reversedDelimiter: "\n",
  delimiter: " ",
};
