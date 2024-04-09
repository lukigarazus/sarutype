import { KatakanaSign, katakanaSigns } from "./katakanaSigns";
import { katakanaCharToRomaji } from "./katakanaToRomaji";
import { getRandomSentenceKatakana } from "./katakanaGetRandomSentence";

export const katakanaDisplay = {
  kind: "katakana" as const,
  allowedDisplaySigns: new Set<KatakanaSign>(),
  possibleDisplaySigns: katakanaSigns,
  getRandomSentence: getRandomSentenceKatakana,
  convertToInputSigns: katakanaCharToRomaji,
  reversedWordDelimiter: "\n",
  wordDelimiter: " ",
};
