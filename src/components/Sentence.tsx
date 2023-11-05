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
}: {
  char: CharDisplay;
}) => {
  const elementRef = useRef<HTMLSpanElement | null>(null);

  const {
    options: { showTransliterationTimeout },
  } = useOptions();

  const [bottomSlotState, setBottomSlotState] = useState<BottomSlotState>({
    kind: "empty",
  });

  useEffect(() => {
    if (isActive)
      setTimeout(() => {
        setBottomSlotState((state) => {
          if (state.kind === "empty") return { kind: "hint" };
          return state;
        });
      }, showTransliterationTimeout);
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

  return (
    <span
      ref={elementRef}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        padding: "0.3em",
        position: "relative",
        width: "calc(26px - 0.6em)",
      }}
    >
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
        {char.hiragana}
      </span>
      {bottomSlotState.kind === "error" && (
        <span
          style={{
            color: "red",
          }}
        >
          {char.romaji}
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
          {char.romaji}
        </span>
      )}
      {bottomSlotState.kind === "correct" && (
        <span
          style={{
            color: "white",
          }}
        >
          {char.romaji}
        </span>
      )}
    </span>
  );
};

const WordComponent = ({ word }: { word: WordDisplay }) => {
  return (
    <span
      style={{
        marginRight: "1em",
        display: "inline-flex",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
    >
      {word.chars.map((char) => (
        <CharComponent char={char} />
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
      {sentence.words.map((word) => (
        <WordComponent word={word} />
      ))}
    </>
  );
};
