import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  CharPerformanceHistory,
  CharPerformanceState,
} from "../../models/CharPerformance";
import { AvailableDisplaySignSystems } from "../../models/Options";
import { scan } from "../../utils/array";
import { BiPause, BiPlay } from "react-icons/bi";

type PerformanceObject = {
  total: number;
  correct: number;
  wrong: number;
  times: number[];
};
type CharPerformanceObject = {
  char: string;
  averageTime: number;
  errorRate: number;
} & PerformanceObject;

export const PerformanceBarChart = ({
  chronologicalCharPerformanceHistories,
}: {
  chronologicalCharPerformanceHistories: CharPerformanceHistory[AvailableDisplaySignSystems][number][];
}) => {
  const [currentHistoryPoint, setCurrentHistoryPoint] = useState(
    chronologicalCharPerformanceHistories.length,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const [charPerformanceObjectsArray, yDomain] = useMemo(() => {
    let yDomain = 0;

    return [
      scan(
        chronologicalCharPerformanceHistories,
        (acc, el) => {
          const newAcc = { ...acc };
          Object.keys(el).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            newAcc[key] = [...(acc[key] || []), ...el[key]];
          });
          return newAcc;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as any,
      ).map((mergedCharPerformanceHistory) => {
        const performanceObjects: Record<string, PerformanceObject> =
          Object.fromEntries(
            Object.entries(mergedCharPerformanceHistory).map(
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
          console.log(averageTime, yDomain);
          if (averageTime > yDomain) yDomain = averageTime;

          return {
            char,
            averageTime,
            errorRate: (performance.wrong / performance.total) * 100,
            ...performance,
          };
        }) as CharPerformanceObject[];
      }),
      yDomain,
    ];
  }, [chronologicalCharPerformanceHistories]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentHistoryPoint(charPerformanceObjectsArray.length);
  }, [charPerformanceObjectsArray]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentHistoryPoint((currentHistoryPoint) => {
          const newValue = currentHistoryPoint + 1;
          return newValue > charPerformanceObjectsArray.length ? 1 : newValue;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, setCurrentHistoryPoint, charPerformanceObjectsArray]);

  return (
    <div>
      <div>
        <span
          onClick={() => {
            setIsPlaying((isPlaying) => !isPlaying);
          }}
          style={{
            cursor: "pointer",
            width: "1.5rem",
            fontSize: "1rem",
          }}
        >
          {isPlaying ? <BiPause /> : <BiPlay />}
        </span>
        <input
          style={{
            width: "calc(100% - 1.5rem)",
          }}
          type="range"
          min={1}
          step={1}
          value={currentHistoryPoint}
          max={charPerformanceObjectsArray.length}
          onChange={(ev) => {
            const value = parseInt(ev.target.value);
            setCurrentHistoryPoint(value);
          }}
        />
      </div>
      <BarChart
        height={500}
        width={
          Object.keys(chronologicalCharPerformanceHistories[0]).length * 25
        }
        data={charPerformanceObjectsArray[currentHistoryPoint - 1]}
      >
        <XAxis
          domain={Object.keys(chronologicalCharPerformanceHistories[0])}
          dataKey="char"
        />
        <YAxis
          domain={[0, 100]}
          unit="%"
          yAxisId="errorRate"
          orientation="right"
        />
        <YAxis
          domain={[0, yDomain]}
          unit="ms"
          yAxisId="averageTime"
          orientation="left"
        />
        <Tooltip />
        <Legend />
        <Bar yAxisId="averageTime" dataKey="averageTime" fill="blue" />
        <Bar yAxisId="errorRate" dataKey="errorRate" fill="red" />
      </BarChart>
    </div>
  );
};
