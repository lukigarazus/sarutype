import { toHiragana, toRomaji } from "wanakana";
import { Char } from "./Char";

export type Word = {
  chars: Char[];
};

export const wordToStringHiragana = (word: Word): string => {
  return word.chars.map((char) => char.hiragana).join("");
};

export const wordToStringRomaji = (word: Word): string => {
  return word.chars.map((char) => char.romaji).join("");
};

// this is not reliable
export const wordFromHiragana = (hiragana: string): Word => {
  return {
    chars: hiragana.split("").map((hiragana) => {
      return {
        hiragana,
        romaji: toRomaji(hiragana),
      };
    }),
  };
};

export const wordFromRomaji = (romaji: string): Word => {
  const hiragana = toHiragana(romaji);
  return wordFromHiragana(hiragana);
};
