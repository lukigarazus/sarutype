import { useOptions } from "../hooks/useOptions";
//import { CharPerformanceHistory } from "../models/CharPerformance";
import { useCharPerformanceHistory } from "./CharPerformanceHistoryContext";

export const StatsPanel = () => {
  const { loading: perfLoading } = useCharPerformanceHistory();
  const { loading: optionsLoading } = useOptions();

  return (
    <div>
      <h2>Stats</h2>
      <div>
        <h3>Char Performance History</h3>
        {!perfLoading && !optionsLoading ? (
          <div>Loading</div>
        ) : (
          <div>Stats</div>
        )}
      </div>
    </div>
  );
};
