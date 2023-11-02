import {
  StringFragmentCharStreamTokenizer,
  CharStreamTokenizerCombinator,
  DelimiterCharStreamTokenizer,
  WhitespacesCharStreamTokenizer,
} from "../utils/CharStreamTokenizer";

describe("CharStreamTokenizer", () => {
  describe("StringFragmentCharStreamTokenizer", () => {
    test("should not be satisfied on incomplete string", () => {
      const tokenizer = new StringFragmentCharStreamTokenizer("abc");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("unsatisfied");
    });
    test("should be satisfied on complete string", () => {
      const tokenizer = new StringFragmentCharStreamTokenizer("abc");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
    });
    test("should handle overflow", () => {
      const tokenizer = new StringFragmentCharStreamTokenizer("abc");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      const response = tokenizer.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
      expect(response.kind).toBe("error");
    });
    test("should be satisfied with error on complete string with typo", () => {
      const tokenizer = new StringFragmentCharStreamTokenizer("abc");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied with error");
    });
    test("should handle remove when satisfied", () => {
      const tokenizer = new StringFragmentCharStreamTokenizer("abc");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
      tokenizer.consumeEvent({
        kind: "remove",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
    });
  });

  describe("CharStreamTokenizerCombinator", () => {
    test("should be satisfied on complete strings", () => {
      const tokenizer1 = new StringFragmentCharStreamTokenizer("abc");
      const tokenizer2 = new StringFragmentCharStreamTokenizer("def");
      const combinator = new CharStreamTokenizerCombinator([
        tokenizer1,
        tokenizer2,
      ]);

      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "e",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "f",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("satisfied");
    });
    test("should handle overflow", () => {
      const tokenizer1 = new StringFragmentCharStreamTokenizer("abc");
      const tokenizer2 = new StringFragmentCharStreamTokenizer("def");
      const combinator = new CharStreamTokenizerCombinator([
        tokenizer1,
        tokenizer2,
      ]);

      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "e",
        timestamp: 0,
      });
      const response1 = combinator.consumeEvent({
        kind: "add",
        char: "f",
        timestamp: 0,
      });
      const response2 = combinator.consumeEvent({
        kind: "add",
        char: "g",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("satisfied");
      expect(response1.kind).toBe("ok");
      expect(response2.kind).toBe("error");
    });
    test("should be satisfied with error on complete strings with typo in one", () => {
      const tokenizer1 = new StringFragmentCharStreamTokenizer("abc");
      const tokenizer2 = new StringFragmentCharStreamTokenizer("def");
      const combinator = new CharStreamTokenizerCombinator([
        tokenizer1,
        tokenizer2,
      ]);

      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "q",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "e",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "f",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("satisfied with error");
    });
    test("should handle remove when satisfied", () => {
      const tokenizer1 = new StringFragmentCharStreamTokenizer("abc");
      const tokenizer2 = new StringFragmentCharStreamTokenizer("def");
      const combinator = new CharStreamTokenizerCombinator([
        tokenizer1,
        tokenizer2,
      ]);

      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "e",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "f",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("satisfied");
      combinator.consumeEvent({
        kind: "remove",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "remove",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "remove",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "e",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "f",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("satisfied");
    });
  });
  describe("DelimiterCharStreamTokenizer", () => {
    test("should be satisfied on complete string", () => {
      const tokenizer = new DelimiterCharStreamTokenizer(" ");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: " ",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
    });
    test("should not be satisfied on incomplete string", () => {
      const tokenizer = new DelimiterCharStreamTokenizer(" ");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      tokenizer.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("unsatisfied");
    });
    test("should handle remove when satisfied", () => {
      const tokenizer = new DelimiterCharStreamTokenizer(" ");
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: " ",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
      tokenizer.consumeEvent({
        kind: "remove",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: " ",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
    });
  });
  describe("CharStreamTokenizerCombinator with DelimiterCharStreamTokenizer", () => {
    test("should be satisfied on complete strings", () => {
      const tokenizer1 = new StringFragmentCharStreamTokenizer("abc");
      const tokenizer2 = new DelimiterCharStreamTokenizer(" ");
      const tokenizer3 = new StringFragmentCharStreamTokenizer("def");
      const combinator = new CharStreamTokenizerCombinator([
        tokenizer1,
        tokenizer2,
        tokenizer3,
      ]);
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "b",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "c",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "e",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "f",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: " ",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("unsatisfied");
      combinator.consumeEvent({
        kind: "add",
        char: "d",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "e",
        timestamp: 0,
      });
      combinator.consumeEvent({
        kind: "add",
        char: "f",
        timestamp: 0,
      });
      expect(combinator.satisfied).toBe("satisfied");
      expect(combinator.toString()).toBe("abcdef def");
    });
  });

  describe("WhitespaceCharStreamTokenizer", () => {
    test("should be satisfied on first non-whitespace", () => {
      const tokenizer = new WhitespacesCharStreamTokenizer();
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: " ",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
      expect(tokenizer.toString()).toBe(" ");
    });

    test("should handle remove when satisfied", () => {
      const tokenizer = new WhitespacesCharStreamTokenizer();
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: " ",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
      tokenizer.consumeEvent({
        kind: "remove",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("unsatisfied");
      tokenizer.consumeEvent({
        kind: "add",
        char: "a",
        timestamp: 0,
      });
      expect(tokenizer.satisfied).toBe("satisfied");
    });
  });
});
