import { SentenceConsumer } from "./SignConsumerModels";
import { Char } from "./SignModels/Char";
import { Sentence } from "./SignModels/Sentence";

export type CharDisplay = {
  char: Char;
  isCorrect: boolean;
  isWrong: boolean;
  isActive: boolean;
  isAdditional: boolean;
  underlying?: string;
  showUnderlying?: boolean;
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

export const sentenceDisplayFromSentenceModel = (
  sentenceModel: Sentence,
): SentenceDisplay => {
  return {
    words: sentenceModel.words.map((word) => {
      return {
        chars: word.chars.map((char) => {
          return {
            char,
            isWrong: false,
            isCorrect: false,
            isActive: false,
            isAdditional: false,
            underlying: undefined,
            showUnderlying: false,
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

export const sentenceDisplayFromSentenceConsumer = (
  sentenceConsumer: SentenceConsumer,
): SentenceDisplay => {
  return {
    words: sentenceConsumer.wordConsumers.map((wordConsumer) => {
      const wordState = wordConsumer.state;
      return {
        chars: wordConsumer.charConsumers.map((charConsumer) => {
          const charState = charConsumer.state;
          return {
            char: charConsumer.char,
            isWrong:
              charState.kind === "finished" && charState.type === "incorrect",
            isCorrect:
              charState.kind === "finished" && charState.type === "correct",
            isActive: charState.kind === "active",
            isAdditional: false,
            underlying: charConsumer.toString(),
            showUnderlying: false,
          };
        }),
        isActive: wordState.kind === "active",
        isWrong:
          wordState.kind === "finished" && wordState.type === "incorrect",
        isCorrect:
          wordState.kind === "finished" && wordState.type === "correct",
      };
    }),
    finished: sentenceConsumer.state.kind === "finished",
  };
};
