import { useMemo } from "react";
import { useCharPerformanceHistory } from "./CharPerformanceHistoryContext";
import { useOptions } from "../hooks/useOptions";
import { PerformanceBarChart } from "./charts/PerformanceBarChart";
import { AsyncResult, mapAsyncResult } from "../types/AsyncResult";
import { charPerformanceHistoryToChronologicalCharPerformanceHistory } from "../models/CharPerformance";

export const StatsPanel = () => {
  const { options } = useOptions();
  const { status } = useCharPerformanceHistory();
  const chronologicalCharPerformanceHistories = useMemo<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AsyncResult<any, "empty" | string>
  >(() => {
    return mapAsyncResult(status, (value) =>
      charPerformanceHistoryToChronologicalCharPerformanceHistory(
        value,
        options.displaySignSystem.kind,
      ),
    );
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
