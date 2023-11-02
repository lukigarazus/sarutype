import {
  CharStreamTokenizer,
  CharStreamTokenizerCombinator,
  DelimiterCharStreamTokenizer,
  StringFragmentCharStreamTokenizer,
  WhitespacesCharStreamTokenizer,
} from "../utils/CharStreamTokenizer";
import { Word, wordToStringHiragana, wordToStringRomaji } from "./Word";

export type Sentence = {
  words: Word[];
};

export const makeSentence = (words: Word[]): Sentence => ({
  words,
});

export const sentenceToStringHiragana = (sentence: Sentence): string => {
  return sentence.words.map((word) => wordToStringHiragana(word)).join("  ");
};

export const sentenceToStringRomaji = (sentence: Sentence): string => {
  return sentence.words.map((word) => wordToStringRomaji(word)).join(" ");
};

export const charStreamTokenizerFromSentence = (sentence: Sentence) => {
  const wordTokenizers = sentence.words.map((word) => {
    const charTokenizers: CharStreamTokenizer[] = word.chars.map((char) => {
      return new StringFragmentCharStreamTokenizer(char.romaji);
    });
    charTokenizers.push(new WhitespacesCharStreamTokenizer());
    charTokenizers.push(new DelimiterCharStreamTokenizer(" "));
    return new CharStreamTokenizerCombinator(charTokenizers);
  });
  return new CharStreamTokenizerCombinator(wordTokenizers);
};
