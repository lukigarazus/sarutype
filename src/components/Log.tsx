import { useLog } from "../hooks/useLog";

export const LogComponent = () => {
  const { log } = useLog();

  return (
    <div
      style={{
        width: Math.min(window.innerWidth, 700),
        height: 500,
        overflow: "auto",
        background: "rgba(0, 0, 0, 0.5)",
        color: "white",
        padding: "1rem",
        fontFamily: "monospace",
        fontSize: "1rem",
      }}
    >
      <ul>
        {log.map((logItem) => (
          <li key={logItem.event}>
            {logItem.event}: {JSON.stringify(logItem.context, null, 5)}
          </li>
        ))}
      </ul>
    </div>
  );
};
