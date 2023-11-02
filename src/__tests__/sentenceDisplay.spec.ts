import { sentenceDisplayFromSentenceCharStreamTokenizerAndSentenceModel } from "../models/SentenceDisplay.ts";
import {
  Sentence,
  charStreamTokenizerFromSentence,
} from "../models/Sentence.ts";
import { SentenceDisplay } from "../models/SentenceDisplay.ts";
import { CharStreamEvent } from "../utils/CharStreamTokenizer.ts";

/*const testCases: Dupa[] = [
      ,
      ,
      ,
      {
        omit: true,
        wholeString: "nikete  omana reta",
        currentString: "nikete omana ret ",
        wholeStringModel: {
          words: [
            {
              chars: [
                { hiragana: "", romaji: "ni" },
                { hiragana: "", romaji: "ke" },
                { hiragana: "", romaji: "te" },
              ],
            },
            {
              chars: [
                { hiragana: "", romaji: "o" },
                { hiragana: "", romaji: "ma" },
                { hiragana: "", romaji: "na" },
              ],
            },
            {
              chars: [
                { hiragana: "", romaji: "re" },
                { hiragana: "", romaji: "ta" },
              ],
            },
          ],
        },
        expected: {
          words: [
            {
              chars: [
                {
                  char: { hiragana: "", romaji: "ni" },
                  isCorrect: true,
                  isWrong: false,
                  showCursor: false,
                  showRomaji: false,
                  isAdditional: false,
                },
                {
                  char: { hiragana: "", romaji: "ke" },
                  isCorrect: true,
                  isWrong: false,
                  showCursor: false,
                  showRomaji: false,
                  isAdditional: false,
                },
                {
                  char: { hiragana: "", romaji: "te" },
                  isCorrect: true,
                  isWrong: false,
                  showCursor: false,
                  showRomaji: false,
                  isAdditional: false,
                },
              ],
              isWrong: false,
              isCorrect: true,
            },
            {
              chars: [
                {
                  char: { hiragana: "", romaji: "o" },
                  isCorrect: false,
                  isWrong: false,
                  showCursor: false,
                  showRomaji: false,
                  isAdditional: false,
                },
                {
                  char: { hiragana: "", romaji: "ma" },
                  isCorrect: false,
                  isWrong: false,
                  showCursor: false,
                  showRomaji: false,
                  isAdditional: false,
                },
                {
                  char: { hiragana: "", romaji: "na" },
                  isCorrect: false,
                  isWrong: false,
                  showCursor: false,
                  showRomaji: false,
                  isAdditional: false,
                },
              ],
              isWrong: false,
              isCorrect: false,
            },
            {
              chars: [
                {
                  char: { hiragana: "", romaji: "re" },
                  isCorrect: false,
                  isWrong: false,
                  showCursor: false,
                  showRomaji: false,
                  isAdditional: false,
                },
              ],
              isWrong: true,
              isCorrect: false,
            },
          ],
          finished: true,
        },
      },
    ];*/

type TestCase = {
  wholeString: string;
  currentString: string;
  wholeStringModel: Sentence;
  expected: SentenceDisplay;
  omit?: boolean;
};

describe("SentenceDisplay", () => {
  describe("tokenizer to SentenceDisplay", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const partialWord: TestCase = {
      wholeString: "nikete",
      currentString: "ni",
      wholeStringModel: {
        words: [
          {
            chars: [
              { hiragana: "", romaji: "ni" },
              { hiragana: "", romaji: "ke" },
              { hiragana: "", romaji: "te" },
            ],
          },
        ],
      },
      expected: {
        words: [
          {
            chars: [
              {
                char: { hiragana: "", romaji: "ni" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ke" },
                isCorrect: false,
                isWrong: false,
                isActive: true,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "te" },
                isCorrect: false,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
            ],
            isActive: true,
            isCorrect: false,
            isWrong: false,
          },
        ],
        finished: false,
      },
    };

    const partialWordTrailingWhitespace: TestCase = {
      wholeString: "nikete",
      currentString: "ni ",
      wholeStringModel: {
        words: [
          {
            chars: [
              { hiragana: "", romaji: "ni" },
              { hiragana: "", romaji: "ke" },
              { hiragana: "", romaji: "te" },
            ],
          },
        ],
      },
      expected: {
        words: [
          {
            chars: [
              {
                char: { hiragana: "", romaji: "ni" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ke" },
                isCorrect: false,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "te" },
                isCorrect: false,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
            ],
            isActive: false,
            isCorrect: false,
            isWrong: true,
          },
        ],
        finished: true,
      },
    };

    const fullWord: TestCase = {
      omit: true,
      wholeString: "nikete",
      currentString: "nikete",
      wholeStringModel: {
        words: [
          {
            chars: [
              { hiragana: "", romaji: "ni" },
              { hiragana: "", romaji: "ke" },
              { hiragana: "", romaji: "te" },
            ],
          },
        ],
      },
      expected: {
        words: [
          {
            chars: [
              {
                char: { hiragana: "", romaji: "ni" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ke" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "te" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
            ],
            isActive: false,
            isWrong: false,
            isCorrect: true,
          },
        ],
        finished: true,
      },
    };

    const fullWordWithAdditional: TestCase = {
      omit: true,
      wholeString: "nikete",
      currentString: "niketea",
      wholeStringModel: {
        words: [
          {
            chars: [
              { hiragana: "", romaji: "ni" },
              { hiragana: "", romaji: "ke" },
              { hiragana: "", romaji: "te" },
            ],
          },
        ],
      },
      expected: {
        words: [
          {
            chars: [
              {
                char: { hiragana: "", romaji: "ni" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ke" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "te" },
                isCorrect: true,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "a", romaji: "a" },
                isCorrect: false,
                isWrong: false,
                isActive: false,
                showRomaji: false,
                isAdditional: true,
              },
            ],
            isActive: false,
            isWrong: true,
            isCorrect: false,
          },
        ],
        finished: false,
      },
    };

    /*const fullWordWithWhitespace = {
      omit: true,
      wholeString: "nikete",
      currentString: "   nikete   ",
      wholeStringModel: {
        words: [
          {
            chars: [
              { hiragana: "", romaji: "ni" },
              { hiragana: "", romaji: "ke" },
              { hiragana: "", romaji: "te" },
            ],
          },
        ],
      },
      expected: {
        words: [
          {
            chars: [
              {
                char: { hiragana: "", romaji: "ni" },
                isCorrect: true,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ke" },
                isCorrect: true,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "te" },
                isCorrect: true,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
            ],
            isWrong: false,
            isCorrect: true,
          },
        ],
        finished: true,
      },
    };*/

    /* const multiWordPartialWhitespace = {
      omit: true,
      wholeString: "nikete  omana reta",
      currentString: "   nikete   ",
      wholeStringModel: {
        words: [
          {
            chars: [
              { hiragana: "", romaji: "ni" },
              { hiragana: "", romaji: "ke" },
              { hiragana: "", romaji: "te" },
            ],
          },
          {
            chars: [
              { hiragana: "", romaji: "o" },
              { hiragana: "", romaji: "ma" },
              { hiragana: "", romaji: "na" },
            ],
          },
          {
            chars: [
              { hiragana: "", romaji: "re" },
              { hiragana: "", romaji: "ta" },
            ],
          },
        ],
      },
      expected: {
        words: [
          {
            chars: [
              {
                char: { hiragana: "", romaji: "ni" },
                isCorrect: true,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ke" },
                isCorrect: true,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "te" },
                isCorrect: true,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
            ],
            isWrong: false,
            isCorrect: true,
          },
          {
            chars: [
              {
                char: { hiragana: "", romaji: "o" },
                isCorrect: false,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ma" },
                isCorrect: false,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "na" },
                isCorrect: false,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
            ],
            isWrong: false,
            isCorrect: false,
          },
          {
            chars: [
              {
                char: { hiragana: "", romaji: "re" },
                isCorrect: false,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
              {
                char: { hiragana: "", romaji: "ta" },
                isCorrect: false,
                isWrong: false,
                showCursor: false,
                showRomaji: false,
                isAdditional: false,
              },
            ],
            isWrong: false,
            isCorrect: false,
          },
        ],
        finished: true,
      },
    };*/

    [
      ["partial word", partialWord, false] as const,
      [
        "partial word with trailing whitespace",
        partialWordTrailingWhitespace,
        true,
      ] as const,
      ["full word", fullWord, false] as const,
      ["full word with additional", fullWordWithAdditional, false] as const,
      /* ["full word with whitespace", fullWordWithWhitespace, false] as const,
      [
        "multi word partial whitespace",
        multiWordPartialWhitespace,
        false,
      ] as const,*/
    ].forEach(([name, testCase, only]) => {
      (only ? test.only : test)(name, () => {
        const sentenceTokenizer = charStreamTokenizerFromSentence(
          testCase.wholeStringModel,
        );
        const events: CharStreamEvent[] = testCase.currentString
          .split("")
          .map((char: string) => {
            return { kind: "add", char, timestamp: 0 };
          });

        events.forEach((event) => {
          sentenceTokenizer.consumeEvent(event);
        });

        expect(
          sentenceDisplayFromSentenceCharStreamTokenizerAndSentenceModel(
            sentenceTokenizer,
            testCase.wholeStringModel,
          ),
        ).toEqual(testCase.expected);
      });
    });
  });
});
