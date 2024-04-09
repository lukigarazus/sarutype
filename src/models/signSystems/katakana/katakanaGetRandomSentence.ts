import { toKatakana, toHiragana } from "wanakana";
import { getRandomSentence } from "../hiragana/hiraganaRandomSentence";
import { mapResult } from "../../../types/Result";
import { HiraganaSign } from "../hiragana/hiraganaSigns";

type FunctionArgs = Parameters<typeof getRandomSentence>;

const katakanaSetToHiraganaSet = (set: Set<string>) => {
  const hiraganaSet = new Set<string>();
  for (const katakanaSign of set) {
    hiraganaSet.add(toHiragana(katakanaSign));
  }
  return hiraganaSet;
};

export const getRandomSentenceKatakana = (...args: FunctionArgs) => {
  const [length, set, ...rest] = args;
  const randomSentence = getRandomSentence(
    length,
    katakanaSetToHiraganaSet(set) as Set<HiraganaSign>,
    ...rest,
  );
  return mapResult(randomSentence, (sentence) => ({
    ...sentence,
    words: sentence.words.map((word) => {
      return {
        ...word,
        chars: word.chars.map((char) => {
          return { ...char, display: toKatakana(char.display) };
        }),
      };
    }),
  }));
};
