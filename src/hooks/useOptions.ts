import { useContext } from "react";
import { OptionsContext } from "../components//OptionsContext";

export const useOptions = () => {
  const value = useContext(OptionsContext);
  return value;
};
