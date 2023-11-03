import { CharConsumer, WordConsumer } from "../models/SentenceConsumer";

describe("CharConsumer", () => {
  it("should consume a character and be finished", () => {
    const consumer = new CharConsumer({
      romaji: "a",
      hiragana: "",
    });
    consumer.consumeChangeEvent({
      char: "a",
      timestamp: 0,
      kind: "add",
    });
    expect(consumer.state).toEqual({
      kind: "finished",
      type: "correct",
    });
  });
  it("should consume a wrong character and be finished", () => {
    const consumer = new CharConsumer({
      romaji: "a",
      hiragana: "",
    });
    consumer.consumeChangeEvent({
      char: "b",
      timestamp: 0,
      kind: "add",
    });
    expect(consumer.state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
  });
  it("should throw error on additional character", () => {
    const consumer = new CharConsumer({
      romaji: "a",
      hiragana: "",
    });
    const consumeResult = consumer.consumeChangeEvent({
      char: "a",
      timestamp: 0,
      kind: "add",
    });
    expect(() =>
      consumer.consumeChangeEvent({
        char: "b",
        timestamp: 0,
        kind: "add",
      }),
    ).toThrow();
    expect(consumeResult).toEqual({
      kind: "go forward",
    });
  });
  it("should handle remove on finished", () => {
    const consumer = new CharConsumer({
      romaji: "a",
      hiragana: "",
    });
    const res = consumer.consumeChangeEvent({
      char: "a",
      timestamp: 0,
      kind: "add",
    });
    expect(res).toEqual({ kind: "go forward" });
    expect(consumer.state).toEqual({
      kind: "finished",
      type: "correct",
    });
    consumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    expect(consumer.state).toEqual({
      kind: "active",
    });
  });
  it("should handle remove from empty", () => {
    const consumer = new CharConsumer({
      romaji: "a",
      hiragana: "",
    });
    consumer.focus();
    expect(
      consumer.consumeChangeEvent({
        timestamp: 0,
        kind: "remove",
      }),
    ).toEqual({
      kind: "success",
      value: {
        kind: "active",
      },
    });
  });
  it("should handle remove on active", () => {
    const consumer = new CharConsumer({
      romaji: "aa",
      hiragana: "",
    });
    consumer.focus();
    consumer.consumeChangeEvent({
      char: "a",
      timestamp: 0,
      kind: "add",
    });
    const res = consumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    expect(res).toEqual({
      kind: "success",
      value: {
        kind: "active",
      },
    });
    expect(consumer.toString()).toEqual("");
  });
});

describe("WordConsumer", () => {
  const char1 = {
    romaji: "re",
    hiragana: "",
  };
  const char2 = {
    romaji: "su",
    hiragana: "",
  };
  const wordConsumer = new WordConsumer({
    chars: [char1, char2],
  });
  beforeEach(() => {
    wordConsumer.reset();
  });
  it("should consume a word and not be finished without space", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    expect(wordConsumer.state).toEqual({
      kind: "active",
    });
    const consumeResult = wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(consumeResult).toEqual({
      kind: "go forward",
    });
    expect(wordConsumer.state).toEqual({
      kind: "finished",
      type: "correct",
    });
    expect(wordConsumer.toString()).toEqual("resu");
  });
  it("should consume a word with a typo and be finished", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "t",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(wordConsumer.state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
    expect(wordConsumer.toString()).toEqual("tesu");
  });
  it("should consume a word with additional characters and be finished", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "p",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(wordConsumer.state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
    expect(wordConsumer.toString()).toEqual("resup");
  });
  it("should ignore whitespace at the beginning of a word", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(wordConsumer.state).toEqual({
      kind: "finished",
      type: "correct",
    });
  });
  it("should consume incomplete word and not be done", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    expect(wordConsumer.state).toEqual({
      kind: "active",
    });
    expect(wordConsumer.toString()).toEqual("re");
  });
  it("should consume incomplete word, space and be done", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(wordConsumer.state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
  });
  it("should handle remove on finished", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    const res = wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(res).toEqual({ kind: "go forward" });
    expect(wordConsumer.state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    expect(wordConsumer.state).toEqual({
      kind: "active",
    });
    expect(wordConsumer.toString()).toEqual("r");
  });
  it("should handle remove between chars", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    wordConsumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    wordConsumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    expect(wordConsumer.state).toEqual({
      kind: "active",
    });
    expect(wordConsumer.toString()).toEqual("re");
  });
  it("should handle space in mid char", () => {
    wordConsumer.focus();
    wordConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    const res = wordConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(res).toEqual({ kind: "go forward" });
    expect(wordConsumer.state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
    expect(wordConsumer.toString()).toEqual("r");
    expect(wordConsumer.charConsumers[0].state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
    expect(wordConsumer.charConsumers[1].state).toEqual({
      kind: "inactive",
    });
  });
});

/*describe("SentenceConsumer", () => {
  const char1 = {
    romaji: "re",
    hiragana: "",
  };
  const char2 = {
    romaji: "su",
    hiragana: "",
  };
  const char3 = {
    romaji: "ma",
    hiragana: "",
  };
  const char4 = {
    romaji: "ki",
    hiragana: "",
  };
  const word1 = {
    chars: [char1, char2],
  };
  const word2 = {
    chars: [char3, char4],
  };
  const sentenceConsumer = new SentenceConsumer({
    words: [word1, word2],
  });

  beforeEach(() => {
    sentenceConsumer.reset();
  });

  it("should consume a sentence and be finished", () => {
    sentenceConsumer.focus();
    sentenceConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    expect(sentenceConsumer.state).toEqual({
      kind: "active",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "m",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "a",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "k",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "i",
      timestamp: 0,
      kind: "add",
    });
    expect(sentenceConsumer.state).toEqual({
      kind: "finished",
      type: "correct",
    });
  });
  it("should consume a sentence with a typo and be finished", () => {
    sentenceConsumer.focus();
    sentenceConsumer.consumeChangeEvent({
      char: "t",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "m",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "a",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "k",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "i",
      timestamp: 0,
      kind: "add",
    });
    expect(sentenceConsumer.state).toEqual({
      kind: "finished",
      type: "incorrect",
    });
  });
  it("should handle remove between words", () => {
    sentenceConsumer.focus();
    sentenceConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    expect(sentenceConsumer.state).toEqual({
      kind: "active",
    });
    expect(sentenceConsumer.toString()).toEqual("resu");
    sentenceConsumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    expect(sentenceConsumer.toString()).toEqual("res");
  });

  it("should handle whitespace between words", () => {
    sentenceConsumer.focus();
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: " ",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "m",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "a",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "k",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "i",
      timestamp: 0,
      kind: "add",
    });
    expect(sentenceConsumer.state).toEqual({
      kind: "finished",
      type: "correct",
    });
    expect(sentenceConsumer.toString()).toEqual("  resu   maki");
  });

  it.skip("should handle remove on word end without a space", () => {
    sentenceConsumer.focus();
    sentenceConsumer.consumeChangeEvent({
      char: "r",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "e",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "s",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      char: "u",
      timestamp: 0,
      kind: "add",
    });
    sentenceConsumer.consumeChangeEvent({
      timestamp: 0,
      kind: "remove",
    });
    expect(sentenceConsumer.state).toEqual({
      kind: "active",
    });
    expect(sentenceConsumer.wordConsumers[0].charConsumers[1].state).toEqual({
      kind: "active",
    });
  });
}); */
