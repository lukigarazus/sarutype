export type DisplaySignSystem = {
  kind: string;
  allowedDisplaySigns: Set<string>;
  possibleDisplaySigns: string[];
  getRandomSentence: () => string;
  convertToInputSigns: (input: string) => string;
  reversedWordDelimiter: string;
  wordDelimiter: string;
};
