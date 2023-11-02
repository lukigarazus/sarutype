import {
  CharStreamTokenizerCombinator,
  StringFragmentCharStreamTokenizer,
} from "../utils/CharStreamTokenizer";
import { Char } from "./Char";
import { Sentence } from "./Sentence";

export type CharDisplay = {
  char: Char;
  isCorrect: boolean;
  isWrong: boolean;
  isActive: boolean;
  showRomaji: boolean;
  isAdditional: boolean;
};

export type WordDisplay = {
  chars: CharDisplay[];
  isWrong: boolean;
  isCorrect: boolean;
  isActive: boolean;
};

export type SentenceDisplay = {
  words: WordDisplay[];
  finished: boolean;
};

export const sentenceDisplayFromSentenceModel = (sentenceModel: Sentence) => {
  return {
    words: sentenceModel.words.map((word) => {
      return {
        chars: word.chars.map((char) => {
          return {
            char,
            isWrong: false,
            isCorrect: false,
            isActive: false,
            showRomaji: false,
            isAdditional: false,
          };
        }),
        isActive: false,
        isWrong: false,
        isCorrect: false,
      };
    }),
    finished: false,
  };
};

export const sentenceDisplayFromSentenceCharStreamTokenizerAndSentenceModel = (
  sentenceTokenizer: CharStreamTokenizerCombinator,
  sentence: Sentence,
): SentenceDisplay => {
  return {
    words: sentence.words.map((word, i) => {
      const wordTokenizer = sentenceTokenizer.getTokenizer(
        i,
      ) as CharStreamTokenizerCombinator;
      return {
        chars: word.chars.map((char, j) => {
          const charTokenizer = wordTokenizer.getTokenizer(
            j,
          ) as StringFragmentCharStreamTokenizer;
          return {
            char,
            isWrong: charTokenizer.satisfied === "satisfied with error",
            isCorrect: charTokenizer.satisfied === "satisfied",
            isActive:
              charTokenizer === wordTokenizer.getFirstUnsatisfiedTokenizer(),
            showRomaji: false,
            isAdditional: false,
          };
        }),
        isActive:
          sentenceTokenizer.getFirstUnsatisfiedTokenizer() === wordTokenizer,
        isWrong: wordTokenizer.satisfied === "satisfied with error",
        isCorrect: wordTokenizer.satisfied === "satisfied",
      };
    }),
    finished: sentenceTokenizer.satisfied !== "unsatisfied",
  };
};
