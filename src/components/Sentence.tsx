import {
  CharDisplay,
  SentenceDisplay,
  WordDisplay,
} from "../models/SentenceDisplay";

const CharComponent = ({
  char: { char, isActive: showCursor, isWrong, isCorrect, showRomaji },
}: {
  char: CharDisplay;
}) => {
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
          color: isWrong ? "red" : isCorrect ? "green" : "white",
        }}
      >
        {char.hiragana}
      </span>
      {showRomaji && <span>{char.romaji}</span>}
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
