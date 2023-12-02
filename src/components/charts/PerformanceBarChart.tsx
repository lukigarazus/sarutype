import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  CharPerformanceHistory,
  charPerformanceHistoryChronologicalToCharPerformanceObject,
} from "../../models/CharPerformance";
import { AvailableDisplaySignSystems } from "../../models/Options";
import { scan } from "../../utils/array";
import { BiPause, BiPlay } from "react-icons/bi";

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
    let topTotal = 0;

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
        const results =
          charPerformanceHistoryChronologicalToCharPerformanceObject(
            mergedCharPerformanceHistory,
          );
        results.forEach((result) => {
          if (result.averageTime > yDomain) yDomain = result.averageTime;
          if (result.total > topTotal) topTotal = result.total;
        });

        return results;
      }),
      yDomain,
      topTotal,
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
