import { SentenceConsumer } from "./SentenceConsumer";
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

export const sentenceConsumerFromSentence = (sentence: Sentence) => {
  return new SentenceConsumer(sentence);
};
