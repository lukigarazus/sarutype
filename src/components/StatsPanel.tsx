import { useMemo } from "react";
import { useCharPerformanceHistory } from "./CharPerformanceHistoryContext";
import { useOptions } from "../hooks/useOptions";
import { PerformanceBarChart } from "./charts/PerformanceBarChart";
import {
  AsyncResult,
  mapAsyncResult,
  okAsyncResult,
} from "../types/AsyncResult";

export const StatsPanel = () => {
  const { options } = useOptions();
  const { status } = useCharPerformanceHistory();
  const chronologicalCharPerformanceHistories = useMemo<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AsyncResult<any, "empty" | string>
  >(() => {
    return mapAsyncResult(status, (value) => {
      const displaySignSystemData = value[options.displaySignSystem.kind];
      const chronologicalCharPerformanceHistories = Object.entries(
        displaySignSystemData,
      )
        .sort(([timestamp1], [timestamp2]) => +timestamp1 - +timestamp2)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, history]) => history);
      if (!chronologicalCharPerformanceHistories.length)
        return { kind: "error", error: "empty" };
      return okAsyncResult(chronologicalCharPerformanceHistories);
    });
  }, [status, options.displaySignSystem.kind]);

  return (
    <div>
      <h2>Stats</h2>
      <div>
        <h3>Char Performance History</h3>
        {status.kind === "loading" && <div>Loading</div>}
        {status.kind === "error" && <div>Error: {status.error}</div>}
        {status.kind === "ok" && (
          <>
            <div>
              {chronologicalCharPerformanceHistories.kind === "ok" && (
                <div>
                  <PerformanceBarChart
                    chronologicalCharPerformanceHistories={
                      chronologicalCharPerformanceHistories.value
                    }
                  />
                </div>
              )}
              {chronologicalCharPerformanceHistories.kind === "error" &&
                (chronologicalCharPerformanceHistories.error === "empty" ? (
                  <div>No data</div>
                ) : (
                  <div>{chronologicalCharPerformanceHistories.error}</div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
