import {
  learningWordWeightMax,
  sortWordsByWeight,
} from "../../../utils/learningSort";
import { Result } from "../../../types/Result";
import { shuffle } from "../../../utils/array";
import { Sentence, makeSentence } from "../../SignModels/Sentence";

import {
  DBWord,
  DBWords,
  DBWordToWord,
} from "./hiraganaWordsWithRomajiTransliteration";

export const getRandomSentence = (
  length: number,
  allowedChars: Set<string>,
  frequencies: Record<string, number>,
): Result<Sentence, string> => {
  const localFrequencies = { ...frequencies };

  const allowedWords: DBWord[] = shuffle(
    DBWords.filter((word) => {
      if (!allowedChars) return true;
      const chars = word.hiragana.split("");
      const isAllowed = chars.every((char) => allowedChars.has(char));
      return isAllowed;
    }),
  );

  const sortedWords = sortWordsByWeight(
    allowedWords.map((word) => word.hiragana),
    localFrequencies,
    learningWordWeightMax,
  );

  const result: DBWord[] = [];

  while (result.length < length) {
    const word = sortedWords[0];

    if (!word) {
      return {
        kind: "error",
        error: "No words found",
      };
    }

    const wordObject = allowedWords.find((w) => w.hiragana === word);
    if (!wordObject) {
      return {
        kind: "error",
        error: "No word object found",
      };
    }
    const chars = wordObject.hiragana.split("");
    chars.forEach((char) => {
      localFrequencies[char] = localFrequencies[char] || 0;
      localFrequencies[char] += 1;
    });
    result.push(wordObject);
    sortWordsByWeight(sortedWords, localFrequencies, learningWordWeightMax);
  }

  const shuffledResult = shuffle(result);

  const sentence = makeSentence(
    shuffledResult.map((word) => DBWordToWord(word)),
  );

  return { kind: "ok", value: sentence };
};
