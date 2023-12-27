import { SentenceConsumer } from "./SentenceConsumer";
import {
  Word,
  reverseWord,
  wordToStringUnderlyingRepresentation,
} from "./Word";

export type Sentence = {
  words: Word[];
};

export const makeSentence = (words: Word[]): Sentence => ({
  words,
});

export const sentenceToStringUnderlyingRepresentation = (
  sentence: Sentence,
): string => {
  return sentence.words
    .map((word) => wordToStringUnderlyingRepresentation(word))
    .join(" ");
};

export const sentenceConsumerFromSentence = (sentence: Sentence) => {
  return new SentenceConsumer(sentence);
};

export const reverseSentence = (sentence: Sentence): Sentence => {
  return {
    words: sentence.words.map((word) => reverseWord(word)),
  };
};
