import { Char, reverseChar } from "./Char";

export type Word = {
  chars: Char[];
};

export const wordToStringUnderlyingRepresentation = (word: Word): string => {
  return word.chars.map((char) => char.underlyingRepresentation).join("");
};

export const reverseWord = (word: Word): Word => {
  return {
    chars: word.chars.map(reverseChar),
  };
};
