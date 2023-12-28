import { useEffect, useRef, useState } from "react";
import {
  CharDisplay,
  SentenceDisplay,
  WordDisplay,
} from "../models/SentenceDisplay";
import { useOptions } from "../hooks/useOptions";

type BottomSlotState =
  | { kind: "empty" }
  | { kind: "error" }
  | { kind: "active" }
  | { kind: "hint" }
  | { kind: "correct" }
  | { kind: "finished" };

const CharComponent = ({
  char: { char, isActive, isWrong, isCorrect, underlying },
  isLast,
}: {
  char: CharDisplay;
  isLast: boolean;
}) => {
  const elementRef = useRef<HTMLSpanElement | null>(null);

  const {
    options: { showTransliterationTimeout },
  } = useOptions();

  const [bottomSlotState, setBottomSlotState] = useState<BottomSlotState>({
    kind: "empty",
  });

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        setBottomSlotState((state) => {
          if (state.kind === "empty") return { kind: "hint" };
          return state;
        });
      }, showTransliterationTimeout);
      elementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isActive, showTransliterationTimeout]);

  useEffect(() => {
    if (isWrong) setBottomSlotState({ kind: "error" });
    else if (isCorrect) setBottomSlotState({ kind: "correct" });
    else if (underlying) setBottomSlotState({ kind: "active" });
    else setBottomSlotState({ kind: "empty" });
  }, [underlying, isWrong, isCorrect]);

  useEffect(() => {
    if (isCorrect || isWrong)
      setTimeout(() => {
        setBottomSlotState({ kind: "finished" });
      }, 2000);
  }, [isCorrect, isWrong]);
  const charWidth = 26;
  const charPadding = 0.3;
  const baseCharStyle = {
    display: "inline-flex",
    flexDirection: "column",
    padding: `${charPadding}em`,
    position: "relative",
    width: `calc(${charWidth}px - ${charPadding * 2}em)`,
  } as const;
  return (
    <>
      <span ref={elementRef} style={baseCharStyle}>
        <span
          style={{
            color: isWrong
              ? "red"
              : isCorrect
              ? "white"
              : isActive
              ? "yellow"
              : "grey",
            marginBottom:
              bottomSlotState.kind !== "empty" &&
              bottomSlotState.kind !== "finished"
                ? 0
                : 24,
          }}
        >
          {char.display}
        </span>
        {bottomSlotState.kind === "error" && (
          <span
            style={{
              color: "red",
            }}
          >
            {char.underlyingRepresentation}
          </span>
        )}
        {bottomSlotState.kind === "active" && (
          <span
            style={{
              color: "yellow",
            }}
          >
            {underlying}
          </span>
        )}
        {bottomSlotState.kind === "hint" && (
          <span
            style={{
              color: "grey",
            }}
          >
            {char.underlyingRepresentation}
          </span>
        )}
        {bottomSlotState.kind === "correct" && (
          <span
            style={{
              color: "white",
            }}
          >
            {char.underlyingRepresentation}
          </span>
        )}
      </span>
      {isLast && (
        <span
          style={{
            ...baseCharStyle,
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "grey",
            }}
          >
            •
          </span>
        </span>
      )}
    </>
  );
};

const WordComponent = ({
  word,
  isLast,
}: {
  word: WordDisplay;
  isLast: boolean;
}) => {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
    >
      {word.chars.map((char, i) => (
        <CharComponent
          char={char}
          isLast={!isLast && i === word.chars.length - 1}
        />
      ))}
    </span>
  );
};
export const SentenceComponent = ({
  sentence,
}: {
  sentence: SentenceDisplay;
}) => {
  return (
    <>
      {sentence.words.map((word, i) => (
        <WordComponent word={word} isLast={i === sentence.words.length - 1} />
      ))}
    </>
  );
};
