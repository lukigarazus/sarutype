//import { CharPerformanceHistory } from "../models/CharPerformance";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useCharPerformanceHistory } from "./CharPerformanceHistoryContext";
import { useOptions } from "../hooks/useOptions";
import { CharPerformanceState } from "../models/CharPerformance";

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

const PerformanceChartWithCharOnXAxisAndTimeAndErrorRateOnYAxis = ({
  charPerformanceObjects,
}: {
  charPerformanceObjects: CharPerformanceObject[];
}) => {
  console.log(charPerformanceObjects);
  return (
    <div>
      <BarChart
        height={500}
        width={charPerformanceObjects.length * 25}
        data={charPerformanceObjects}
      >
        <XAxis dataKey="char" />
        <YAxis
          domain={[0, 100]}
          unit="%"
          yAxisId="errorRate"
          orientation="right"
        />
        <YAxis unit="ms" yAxisId="averageTime" orientation="left" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="averageTime" dataKey="averageTime" fill="blue" />
        <Bar yAxisId="errorRate" dataKey="errorRate" fill="red" />
      </BarChart>
    </div>
  );
};

export const StatsPanel = () => {
  const { options } = useOptions();
  const { status } = useCharPerformanceHistory();
  const basicChartData = useMemo(() => {
    if (status.kind === "loading") {
      return { kind: "loading" as const };
    }
    if (status.kind === "error") {
      return {
        kind: "error" as const,
        error: "Can't load performance history",
      };
    }
    const displaySignSystemData = status.value[options.displaySignSystem.kind];
    const charPerformanceHistories = Object.values(displaySignSystemData);
    if (!charPerformanceHistories.length) return { kind: "empty" as const };
    const mergedCharPerformanceHistory = charPerformanceHistories.reduce(
      (acc, el) => {
        Object.keys(el).forEach((key) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[key] = [...(acc[key] || []), ...el[key]];
        });
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as any,
    );
    console.log(mergedCharPerformanceHistory);
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
    console.log(performanceObjects);
    return { kind: "loaded" as const, value: performanceObjects };
  }, [status, options.displaySignSystem.kind]);
  return (
    <div>
      <h2>Stats</h2>
      <div>
        <h3>Char Performance History</h3>
        {status.kind === "loading" && <div>Loading</div>}
        {status.kind === "error" && <div>Error: {status.error.message}</div>}
        {status.kind === "loaded" && (
          <>
            <div>
              {basicChartData.kind === "loaded" && (
                <div>
                  <PerformanceChartWithCharOnXAxisAndTimeAndErrorRateOnYAxis
                    charPerformanceObjects={Object.entries(
                      basicChartData.value,
                    ).map(([char, performance]) => ({
                      char,
                      averageTime:
                        performance.times.reduce((acc, el) => acc + el, 0) /
                        performance.times.length,
                      errorRate: (performance.wrong / performance.total) * 100,
                      ...performance,
                    }))}
                  />
                </div>
              )}
              {basicChartData.kind === "error" && (
                <div>{basicChartData.error}</div>
              )}
              {basicChartData.kind === "empty" && <div>No data</div>}
              {basicChartData.kind === "loading" && <div>Loading</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
