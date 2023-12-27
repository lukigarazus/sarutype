const roman = "roman";
const hiragana = "hiragana";

export const allSignSystems = [roman, hiragana] as const;
export type AllSignSystems = (typeof allSignSystems)[number];

export const availableSignSystemPairs: {
  input: AllSignSystems;
  display: AllSignSystems;
}[] = [
  { input: "roman", display: "hiragana" },
  //{ input: "roman", display: "hebrew" },
  //{ input: "hebrew", display: "roman" },
  { input: "hiragana", display: "roman" },
];
