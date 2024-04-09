export type Char = {
  display: string;
  underlyingRepresentation: string;
};

export const reverseChar = (char: Char): Char => {
  return {
    display: char.underlyingRepresentation,
    underlyingRepresentation: char.display,
  };
};
