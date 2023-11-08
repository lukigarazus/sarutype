import {
  useMemo,
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  Sentence,
  sentenceConsumerFromSentence,
  sentenceToStringRomaji,
} from "../models/Sentence";
import { SentenceComponent } from "./Sentence";
import { sentenceDisplayFromSentenceConsumer } from "../models/SentenceDisplay";
import { useOptions } from "../hooks/useOptions";
import {
  charPerformanceToCharPerformanceHistory,
  sentenceConsumerToCharPerformance,
} from "../models/CharPerformance";
import { useCharPerformanceHistory } from "./CharPerformanceHistoryContext";

const TestSentenceComponent = ({
  sentence,
  reset,
}: {
  sentence: Sentence;
  reset: () => void;
}) => {
  const { options } = useOptions();
  const { setCharPerformanceHistory } = useCharPerformanceHistory();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resetRef = useRef<HTMLButtonElement | null>(null);

  useHotkeys("tab", () => {
    resetRef.current?.focus();
  });

  const sentenceConsumer = useMemo(
    () => sentenceConsumerFromSentence(sentence),
    [sentence],
  );
  const [sentenceDisplay, setSentenceDisplay] = useState(
    sentenceDisplayFromSentenceConsumer(sentenceConsumer),
  );
  const refresh = () => {
    setSentenceDisplay(sentenceDisplayFromSentenceConsumer(sentenceConsumer));
  };
  const startTest = () => {
    if (
      sentenceConsumer.state.kind === "finished" ||
      sentenceConsumer.state.kind === "active"
    )
      return;
    sentenceConsumer.focus();
    inputRef.current?.focus();
    refresh();
  };
  const checkTestEnd = useCallback(() => {
    if (inputRef.current && sentenceConsumer.state.kind === "finished") {
      inputRef.current.blur();
      inputRef.current.value = "";

      setCharPerformanceHistory((old) =>
        charPerformanceToCharPerformanceHistory(
          sentenceConsumerToCharPerformance(
            sentenceConsumer,
            options.displaySignSystem.kind,
            // this is a hack, the first one is always a lot slower and messes up the stats
          ).slice(1),
          JSON.parse(JSON.stringify(old)),
        ),
      );
    }
  }, [
    options.displaySignSystem.kind,
    sentenceConsumer,
    setCharPerformanceHistory,
  ]);

  const sentenceKey = useMemo(
    () => sentenceToStringRomaji(sentence),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sentenceDisplay],
  );

  useEffect(() => {
    setSentenceDisplay(sentenceDisplayFromSentenceConsumer(sentenceConsumer));
  }, [sentenceConsumer]);

  useEffect(() => {
    checkTestEnd();
  }, [sentenceDisplay, checkTestEnd]);
  return (
    <div>
      <input
        style={{
          border: "none",
          cursor: "default",
          outline: "none",
          opacity: 0,
          padding: 0,
          resize: "none",
          zIndex: -1,
          margin: "0 auto",
          position: "absolute",
        }}
        tabIndex={1}
        ref={inputRef}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onFocus={startTest}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          switch (ev.nativeEvent.type) {
            case "input": {
              const nativeEvent = ev.nativeEvent as InputEvent;
              const event =
                nativeEvent.data === null
                  ? ({
                      kind: "remove",
                      timestamp: Date.now(),
                    } as const)
                  : ({
                      kind: "add",
                      char: nativeEvent.data,
                      timestamp: Date.now(),
                    } as const);
              if (sentenceConsumer.state.kind !== "finished") {
                sentenceConsumer.consumeChangeEvent(event);
                refresh();
              }
            }
          }
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 700,
            height: 300,
            overflowY: "auto",
            border: "1px solid black",
            borderRadius: "0.5em",
            padding: "0.5em",
          }}
          onClick={startTest}
        >
          {sentenceConsumer.state.kind === "finished" && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              Finished
            </div>
          )}
          <SentenceComponent key={sentenceKey} sentence={sentenceDisplay} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "1em",
        }}
      >
        <button
          ref={resetRef}
          style={{
            background: "none",
            border: "none",
          }}
          onClick={reset}
          tabIndex={1}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export const TestComponent = () => {
  const { options } = useOptions();
  console.log(options);

  const [sentence, setSentence] = useState(
    options.displaySignSystem.getRandomSentence(
      options.numberOfWordsPerTest,
      options.displaySignSystem.allowedDisplaySigns,
    ),
  );

  const reset = () => {
    setSentence(
      options.displaySignSystem.getRandomSentence(
        options.numberOfWordsPerTest,
        options.displaySignSystem.allowedDisplaySigns,
      ),
    );
  };

  return sentence.kind === "error" ? (
    <div>Error while getting a sentence: {sentence.error}</div>
  ) : (
    <TestSentenceComponent sentence={sentence.value} reset={reset} />
  );
};
