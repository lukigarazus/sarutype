import { hiraganaToRomajiMap } from "../hiragana/hiraganaToRomaji";
import { romanSigns } from "./romanSigns";

export const romanToHiraganaMap = Object.fromEntries(
  Object.entries(hiraganaToRomajiMap).map(([hiragana, romaji]) => [
    romaji,
    hiragana,
  ]),
);

export const romanToHiragana = (roman: string) => {
  const allRoman =
    roman
      .split("")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((char) => romanSigns.includes(char as any))
      .join("") === roman;
  if (!allRoman) return "";
  return romanToHiraganaMap[roman] ?? "";
};
