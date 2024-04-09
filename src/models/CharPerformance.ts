import { Result } from "../types/Result";
import {
  hiraganaSigns,
  HiraganaSign,
} from "./signSystems/hiragana/hiraganaSigns";
import { SentenceConsumer } from "./SignConsumerModels";
import { AllSignSystems } from "./signSystems/types";

export type CharPerformanceState =
  | { kind: "not finished" }
  | { kind: "finished"; time: number }
  | { kind: "error" };

export type CharPerformance = {
  char: string;
  state: CharPerformanceState;
  timestamp: number;
  signSystem: AllSignSystems;
};

export type CharPerformanceHistory = {
  hiragana: Record<number, Record<HiraganaSign, CharPerformanceState[]>>;
  roman: Record<number, Record<string, CharPerformanceState[]>>;
};

export type PerformanceObject = {
  total: number;
  correct: number;
  wrong: number;
  times: number[];
};

export type CharPerformanceObject = {
  char: string;
  averageTime: number;
  errorRate: number;
} & PerformanceObject;

export const sentenceConsumerToCharPerformance = (
  sentenceConsumer: SentenceConsumer,
  displaySignSystem: AllSignSystems,
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
          char: charConsumer.char.display,
          state: charState,
          timestamp,
          signSystem: displaySignSystem,
        };
      });
    },
  );

  return charPerformanceObjects;
};

export const charPerformanceToCharPerformanceHistory = (
  charPerformances: CharPerformance[],
  history: CharPerformanceHistory = {
    hiragana: {},
    roman: {},
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

export const charPerformanceHistoryToChronologicalCharPerformanceHistory = (
  value: CharPerformanceHistory,
  displaySignSystem: AllSignSystems,
): Result<CharPerformanceHistory[AllSignSystems][number][], "empty"> => {
  const displaySignSystemData = value[displaySignSystem];
  const chronologicalCharPerformanceHistories = Object.entries(
    displaySignSystemData,
  )
    .sort(([timestamp1], [timestamp2]) => +timestamp1 - +timestamp2)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, history]) => history);
  if (!chronologicalCharPerformanceHistories.length)
    return { kind: "error", error: "empty" };
  return {
    kind: "ok",
    value: chronologicalCharPerformanceHistories,
  };
};

export const charPerformanceHistoryChronologicalToCharPerformanceObject = (
  charPerformanceHistoryEntry: CharPerformanceHistory[AllSignSystems],
) => {
  const performanceObjects: Record<string, PerformanceObject> =
    Object.fromEntries(
      Object.entries(charPerformanceHistoryEntry).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([sign, performances]: [string, any]) => {
          const performanceObject = performances.reduce(
            (acc: PerformanceObject, el: CharPerformanceState) => {
              acc.total++;
              if (el.kind === "finished") {
                acc.correct++;
                acc.times.push(el.time);
              } else if (el.kind === "error") acc.wrong++;
              return acc;
            },
            { total: 0, correct: 0, wrong: 0, times: [] as number[] },
          );
          return [sign, performanceObject];
        },
      ),
    );
  return Object.entries(performanceObjects).map(([char, performance]) => {
    const averageTime =
      performance.times.reduce((acc, el) => acc + el, 0) /
      performance.times.length;

    return {
      char,
      averageTime,
      errorRate: (performance.wrong / performance.total) * 100,
      ...performance,
    };
  }) as CharPerformanceObject[];
};

export const charPerformanceHistoryChronologicalToFrequencyObject = (
  charPerformanceHistoryChronological: CharPerformanceHistory[AllSignSystems][number][],
) => {
  return charPerformanceHistoryChronological.reduce(
    (acc, performance) => {
      Object.entries(performance).forEach(([sign, performances]) => {
        acc[sign] = acc[sign] || 0;
        performances.forEach(() => {
          acc[sign]++;
        });
      });
      return acc;
    },
    {} as Record<string, number>,
  );
};
