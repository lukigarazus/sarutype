import { HiraganaSign, hiraganaSigns } from "../utils/language/hiragana";
import { AvailableDisplaySignSystems } from "./Options";
import { SentenceConsumer } from "./SentenceConsumer";

export type CharPerformanceState =
  | { kind: "not finished" }
  | { kind: "finished"; time: number }
  | { kind: "error" };

export type CharPerformance = {
  char: string;
  state: CharPerformanceState;
  timestamp: number;
  signSystem: AvailableDisplaySignSystems;
};

export const sentenceConsumerToCharPerformance = (
  sentenceConsumer: SentenceConsumer,
  displaySignSystem: AvailableDisplaySignSystems,
): CharPerformance[] => {
  const timestamp = Date.now();
  const charPerformanceObjects = sentenceConsumer.wordConsumers.flatMap(
    (wordConsumer) => {
      return wordConsumer.charConsumers.map((charConsumer): CharPerformance => {
        const charState =
          charConsumer.state.kind === "finished"
            ? charConsumer.state.type === "correct"
              ? { kind: "finished" as const, time: charConsumer.time() }
              : { kind: "error" as const }
            : { kind: "not finished" as const };
        return {
          char: charConsumer.char.hiragana,
          state: charState,
          timestamp,
          signSystem: displaySignSystem,
        };
      });
    },
  );

  return charPerformanceObjects;
};

export type CharPerformanceHistory = {
  hiragana: Record<number, Record<HiraganaSign, CharPerformanceState[]>>;
};

export const charPerformanceToCharPerformanceHistory = (
  charPerformances: CharPerformance[],
  history: CharPerformanceHistory = {
    hiragana: {},
  },
): CharPerformanceHistory => {
  charPerformances.forEach((charPerformance) => {
    if (!history[charPerformance.signSystem][charPerformance.timestamp]) {
      history[charPerformance.signSystem][charPerformance.timestamp] =
        hiraganaSigns.reduce(
          (acc, sign) => {
            acc[sign] = [];
            return acc;
          },
          {} as Record<HiraganaSign, CharPerformanceState[]>,
        );
    }
    history[charPerformance.signSystem][charPerformance.timestamp][
      charPerformance.char as HiraganaSign
    ].push(charPerformance.state);
  });
  return history;
};
