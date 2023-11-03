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
    } else {
      setShowRomajiLocal(false);
      if (timeout.current !== null) {
        window.clearTimeout(timeout.current);
        timeout.current = null;
      }
    }
  }, [isActive, showTransliterationTimeout]);
  return (
    <div
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
        }}
      >
        {char.hiragana}
      </span>
      {(showRomaji || showRomajiLocal) && <span>{char.romaji}</span>}
    </div>
  );
};

const WordComponent = ({ word }: { word: WordDisplay }) => {
  return (
    <span
      style={{
        marginRight: "1em",
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
  width = 700,
  height = 300,
  onFocus,
  onBlur,
}: {
  sentence: SentenceDisplay;
  width?: number;
  height?: number;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  return (
    <div
      style={{
        width,
        height,
        display: "inline-block",
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {sentence.words.map((word) => (
        <WordComponent word={word} />
      ))}
    </div>
  );
};
