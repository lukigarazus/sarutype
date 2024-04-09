import { toHiragana, toRomaji } from "wanakana";

import { Word } from "../../SignModels/Word";

export const wordFromRomaji = (romaji: string): Word => {
  const hiragana = toHiragana(romaji);
  return wordFromHiragana(hiragana);
};

/**
 * this is not reliable
 */
export const wordFromHiragana = (hiragana: string): Word => {
  return {
    chars: hiragana.split("").map((hiragana) => {
      return {
        display: hiragana,
        underlyingRepresentation: toRomaji(hiragana),
      };
    }),
  };
};
