import { useEffect, useRef, useState } from "react";
import {
  CharDisplay,
  SentenceDisplay,
  WordDisplay,
} from "../models/SentenceDisplay";
import { useOptions } from "../hooks/useOptions";

const CharComponent = ({
  char: { char, isActive, isWrong, isCorrect, showRomaji },
}: {
  char: CharDisplay;
}) => {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const {
    options: { showTransliterationTimeout },
  } = useOptions();
  const [showRomajiLocal, setShowRomajiLocal] = useState(false);
  const timeout = useRef<number | null>(null);
  useEffect(() => {
    if (isActive) {
      timeout.current = window.setTimeout(() => {
        setShowRomajiLocal(true);
      }, showTransliterationTimeout);
      elementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      setShowRomajiLocal(false);
      if (timeout.current !== null) {
        window.clearTimeout(timeout.current);
        timeout.current = null;
      }
    }
  }, [isActive, showTransliterationTimeout]);
  return (
    <span
      ref={elementRef}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        padding: "0.3em",
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
          marginBottom: showRomaji || showRomajiLocal ? 0 : 24,
        }}
      >
        {char.hiragana}
      </span>
      {(showRomaji || showRomajiLocal) && <span>{char.romaji}</span>}
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
