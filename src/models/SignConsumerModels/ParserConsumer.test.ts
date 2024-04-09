import { describe, test, expect } from "vitest";
import * as FC from "fast-check";
import * as P from "parsimmon";
import {
  Sentence,
  sentenceToStringUnderlyingRepresentation,
} from "../SignModels/Sentence";
import { Word, wordToStringUnderlyingRepresentation } from "../SignModels/Word";
import { Char } from "../SignModels/Char";

const chainOfConditionalParsers = <T>(
  parsers: P.Parser<T>[],
): P.Parser<T[]> => {
  if (parsers.length === 0) throw new Error("No parsers provided");
  const result: T[] = [];
  const res = parsers.slice(1).reduce(
    (acc, parser, i) => {
      return acc
        .map((res) => {
          result.push(...res);
          return [res];
        })
        .chain(
          (res) =>
            res &&
            parser.map((res) =>
              i === parsers.length - 1 ? [...result, res] : [res],
            ),
        );
    },
    parsers[0].map((res) => [res]) as P.Parser<T[]>,
  );

  return res;
};

const getParsedStatusFromActualAndExpected = (
  actual: string,
  expected: string,
): ParsedStatus => {
  const areEqual = actual === expected;
  if (areEqual) return { kind: "finished", type: "correct" };

  const isLengthTheSame = actual.length === expected.length;
  if (isLengthTheSame) return { kind: "finished", type: "incorrect" };

  return { kind: "active" };
};

const charToParser = (char: Char): P.Parser<ParsedChar> => {
  return P.seq(
    ...char.underlyingRepresentation
      .split("")
      .map((char) => P.alt(P.string(char), P.any, P.eof)),
  )
    .map((res) => res.join(""))
    .map((res) => ({
      char,
      parsedValue: res,
      status: getParsedStatusFromActualAndExpected(
        res,
        char.underlyingRepresentation,
      ),
    }));
};

const wordToParser = (word: Word): P.Parser<ParsedWord | undefined> => {
  return P.seq(...word.chars.map(charToParser)).map((res) => {
    const parsedValue = res.map((r) => r.parsedValue).join("");
    return {
      word,
      parsedValue,
      status: getParsedStatusFromActualAndExpected(
        parsedValue,
        wordToStringUnderlyingRepresentation(word),
      ),
    };
  });
};

const sentenceToParser = (sentence: Sentence): P.Parser<ParsedSentence> => {
  return chainOfConditionalParsers(
    sentence.words.map(wordToParser).map((wordParser, i, arr) => {
      if (i === arr.length - 1) return wordParser;
      return P.seq(wordParser, P.alt(P.whitespace, P.eof)).map((res) => res[0]);
    }),
  ).map((res: (ParsedWord | undefined | string)[]) => {
    const words = res.filter((r) => r && typeof r !== "string") as ParsedWord[];
    const parsedValue = words.map((w) => w.parsedValue).join(" ");

    return {
      sentence,
      parsedValue,
      status: getParsedStatusFromActualAndExpected(
        parsedValue,
        sentenceToStringUnderlyingRepresentation(sentence),
      ),
    };
  });
};

type ParsedStatus =
  | { kind: "inavtive" }
  | { kind: "active" }
  | { kind: "finished"; type: "correct" | "incorrect" };

type ParsedChar = {
  char: Char;
  parsedValue: string | undefined;
  status: ParsedStatus;
};

type ParsedWord = {
  word: Word;
  parsedValue: string | undefined;
  status: ParsedStatus;
};

type ParsedSentence = {
  sentence: Sentence;
  parsedValue: string;
  status: ParsedStatus;
};

// eslint-disable-next-line no-useless-escape
const randomSentenceStatic = `{\"kind\":\"ok\",\"value\":{\"words\":[{\"chars\":[{\"display\":\"お\",\"underlyingRepresentation\":\"o\"},{\"display\":\"ど\",\"underlyingRepresentation\":\"do\"},{\"display\":\"る\",\"underlyingRepresentation\":\"ru\"}]},{\"chars\":[{\"display\":\"く\",\"underlyingRepresentation\":\"ku\"},{\"display\":\"さ\",\"underlyingRepresentation\":\"sa\"}]},{\"chars\":[{\"display\":\"ひ\",\"underlyingRepresentation\":\"hi\"},{\"display\":\"み\",\"underlyingRepresentation\":\"mi\"},{\"display\":\"つ\",\"underlyingRepresentation\":\"tsu\"}]},{\"chars\":[{\"display\":\"き\",\"underlyingRepresentation\":\"ki\"},{\"display\":\"ん\",\"underlyingRepresentation\":\"n\"},{\"display\":\"に\",\"underlyingRepresentation\":\"ni\"},{\"display\":\"く\",\"underlyingRepresentation\":\"ku\"}]},{\"chars\":[{\"display\":\"ひ\",\"underlyingRepresentation\":\"hi\"},{\"display\":\"つ\",\"underlyingRepresentation\":\"tsu\"},{\"display\":\"じ\",\"underlyingRepresentation\":\"ji\"}]},{\"chars\":[{\"display\":\"み\",\"underlyingRepresentation\":\"mi\"},{\"display\":\"ら\",\"underlyingRepresentation\":\"ra\"},{\"display\":\"い\",\"underlyingRepresentation\":\"i\"}]},{\"chars\":[{\"display\":\"ふ\",\"underlyingRepresentation\":\"fu\"},{\"display\":\"え\",\"underlyingRepresentation\":\"e\"},{\"display\":\"る\",\"underlyingRepresentation\":\"ru\"}]},{\"chars\":[{\"display\":\"あ\",\"underlyingRepresentation\":\"a\"},{\"display\":\"お\",\"underlyingRepresentation\":\"o\"}]},{\"chars\":[{\"display\":\"な\",\"underlyingRepresentation\":\"na\"},{\"display\":\"わ\",\"underlyingRepresentation\":\"wa\"}]},{\"chars\":[{\"display\":\"み\",\"underlyingRepresentation\":\"mi\"},{\"display\":\"だ\",\"underlyingRepresentation\":\"da\"},{\"display\":\"れ\",\"underlyingRepresentation\":\"re\"},{\"display\":\"る\",\"underlyingRepresentation\":\"ru\"}]}]}}`;
const randomSentenceParsed = JSON.parse(randomSentenceStatic).value as Sentence;
const stringSentence =
  sentenceToStringUnderlyingRepresentation(randomSentenceParsed);

const parser = sentenceToParser(randomSentenceParsed);
describe("ParserConsumer", () => {
  test("should work with break in the middle of a char", () => {
    const result = parser.parse(stringSentence.slice(0, 1));
    if (result.status === false) {
      console.log(result);
      expect.fail("Parser failed");
    }
    expect(result.value.parsedValue).toEqual(stringSentence.slice(0, 1));
  });

  test.skip("should parse all variantions of the input sentence", () => {
    FC.assert(
      FC.property(FC.integer({ min: 0, max: stringSentence.length }), (end) => {
        const result = parser.parse(stringSentence.slice(0, end));
        if (result.status === false) {
          console.log(stringSentence);
          console.log(stringSentence.slice(0, end));
          console.log(result);
          expect.fail("Parser failed");
        } else {
          expect(result.value.parsedValue).toEqual(
            stringSentence.slice(0, end),
          );
        }
      }),
    );
  });
});
