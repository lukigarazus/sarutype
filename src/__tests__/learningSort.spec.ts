import {
  sortWordsByWeight,
  learningWordWeightAverage,
  learningWordWeightMax,
  learningWordWeightSum,
} from "../utils/learningSort";

const simpleWords = ["a", "b", "c", "d", "e"];
const simpleWordsFrequencies = { a: 1, b: 2, c: 3, d: 4, e: 5 };
const simpleWordsExpectedResult = ["a", "b", "c", "d", "e"];

const shortWordWithLowFrequencyAndLongWordWithHighFrequency = ["abaced", "v"];
const shortWordWithLowFrequencyAndLongWordWithHighFrequencyFrequencies = {
  a: 10,
  b: 20,
  c: 30,
  d: 40,
  e: 50,
  v: 1,
};
describe("sortWordsByWeight", () => {
  describe("simple words", () => {
    it("sorts words by weight - sum", () => {
      expect(
        sortWordsByWeight(
          simpleWords,
          simpleWordsFrequencies,
          learningWordWeightSum,
        ),
      ).toEqual(simpleWordsExpectedResult);
    });

    it("sorts words by weight - average", () => {
      expect(
        sortWordsByWeight(
          simpleWords,
          simpleWordsFrequencies,
          learningWordWeightAverage,
        ),
      ).toEqual(simpleWordsExpectedResult);
    });

    it("sorts words by weight - max", () => {
      expect(
        sortWordsByWeight(
          simpleWords,
          simpleWordsFrequencies,
          learningWordWeightMax,
        ),
      ).toEqual(simpleWordsExpectedResult);
    });
  });

  describe("short word with low frequency and long word with high frequency", () => {
    it("sorts words by weight - sum", () => {
      expect(
        sortWordsByWeight(
          shortWordWithLowFrequencyAndLongWordWithHighFrequency,
          shortWordWithLowFrequencyAndLongWordWithHighFrequencyFrequencies,
          learningWordWeightSum,
        ),
      ).toEqual(["abaced", "v"]);
    });

    it("sorts words by weight - average", () => {
      expect(
        sortWordsByWeight(
          shortWordWithLowFrequencyAndLongWordWithHighFrequency,
          shortWordWithLowFrequencyAndLongWordWithHighFrequencyFrequencies,
          learningWordWeightAverage,
        ),
      ).toEqual(["v", "abaced"]);
    });

    it("sorts words by weight - max", () => {
      expect(
        sortWordsByWeight(
          shortWordWithLowFrequencyAndLongWordWithHighFrequency,
          shortWordWithLowFrequencyAndLongWordWithHighFrequencyFrequencies,
          learningWordWeightMax,
        ),
      ).toEqual(["v", "abaced"]);
    });
  });
});
