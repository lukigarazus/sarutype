const convertFrequenciesToRelative = (frequencies: Record<string, number>) => {
  const total = Object.values(frequencies).reduce((acc, value) => acc + value);
  return Object.keys(frequencies).reduce(
    (acc, key) => ({
      ...acc,
      [key]: frequencies[key] / total,
    }),
    {},
  );
};

const convertPercentToReverseExponential = (percent: number) =>
  Math.pow(1 - percent, 2);

const getRelativeFrequencyBasedWeightReverseExponential = (
  char: string,
  relativeFrequencies: Record<string, number>,
) => {
  const relativeFrequency = relativeFrequencies[char] || 0;
  return convertPercentToReverseExponential(relativeFrequency);
};

export const learningWordWeightSum = (
  word: string,
  relativeFrequencies: Record<string, number>,
) =>
  word
    .split("")
    .reduce(
      (acc, char) =>
        acc +
        (getRelativeFrequencyBasedWeightReverseExponential(
          char,
          relativeFrequencies,
        ) || 0),
      0,
    );

export const learningWordWeightAverage = (
  word: string,
  relativeFrequencies: Record<string, number>,
) =>
  word
    .split("")
    .reduce(
      (acc, char) =>
        acc +
        (getRelativeFrequencyBasedWeightReverseExponential(
          char,
          relativeFrequencies,
        ) || 0),
      0,
    ) / word.length;

export const learningWordWeightMax = (
  word: string,
  relativeFrequencies: Record<string, number>,
) =>
  word.split("").reduce((acc, char) => {
    const charWeight =
      getRelativeFrequencyBasedWeightReverseExponential(
        char,
        relativeFrequencies,
      ) || 0;
    return acc > charWeight ? acc : charWeight;
  }, 0);

export const sortWordsByWeight = (
  words: string[],
  frequencies: Record<string, number>,
  weightFunction: (word: string, frequencies: Record<string, number>) => number,
) => {
  const relativeFrequencies = convertFrequenciesToRelative(frequencies);
  return words.sort((word1, word2) => {
    const weight1 = weightFunction(word1, relativeFrequencies);
    const weight2 = weightFunction(word2, relativeFrequencies);
    if (weight1 < weight2) {
      return 1;
    }
    if (weight1 > weight2) {
      return -1;
    }
    return Math.random() - 0.5;
  });
};
