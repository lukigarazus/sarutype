import { useContext } from "react";
import { LogContext } from "../components/LogContext";

export const useLog = () => {
  const value = useContext(LogContext);
  return value;
};
