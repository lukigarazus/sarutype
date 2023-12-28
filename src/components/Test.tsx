import {
  useMemo,
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  useCallback,
  ComponentType,
  ReactElement,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  Sentence,
  reverseSentence,
  sentenceConsumerFromSentence,
  sentenceToStringUnderlyingRepresentation,
} from "../models/Sentence";
import { SentenceComponent } from "./Sentence";
import { sentenceDisplayFromSentenceConsumer } from "../models/SentenceDisplay";
import { useOptions } from "../hooks/useOptions";
import {
  charPerformanceHistoryChronologicalToFrequencyObject,
  charPerformanceHistoryToChronologicalCharPerformanceHistory,
  charPerformanceToCharPerformanceHistory,
  sentenceConsumerToCharPerformance,
} from "../models/CharPerformance";
import { useCharPerformanceHistory } from "./CharPerformanceHistoryContext";
import { mapResult } from "../types/Result";
import { useLog } from "../hooks/useLog";

const TestSentenceComponent = ({
  sentence,
  reset,
}: {
  sentence: Sentence;
  reset: () => void;
}) => {
  const { options } = useOptions();
  const { push: pushToLog } = useLog();
  const { setCharPerformanceHistory } = useCharPerformanceHistory();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const resetRef = useRef<HTMLButtonElement | null>(null);

  useHotkeys("tab", () => {
    resetRef.current?.focus();
  });

  const sentenceConsumer = useMemo(
    () =>
      sentenceConsumerFromSentence(
        sentence,
        options.reverseSignSystems
          ? options.displaySignSystem.reversedDelimiter
          : options.displaySignSystem.delimiter,
      ),
    [sentence, options],
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

      if (!options.reverseSignSystems) {
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
    }
  }, [
    options.displaySignSystem.kind,
    options.reverseSignSystems,
    sentenceConsumer,
    setCharPerformanceHistory,
  ]);

  const sentenceKey = useMemo(
    () => sentenceToStringUnderlyingRepresentation(sentence),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sentenceDisplay],
  );

  useEffect(() => {
    setSentenceDisplay(sentenceDisplayFromSentenceConsumer(sentenceConsumer));
  }, [sentenceConsumer]);

  useEffect(() => {
    checkTestEnd();
  }, [sentenceDisplay, checkTestEnd]);

  const containerHeight = 300;
  const containerWidth = Math.min(window.innerWidth - 20, 700);
  const containerPadding = "0.5em";
  const containerBorderRadius = "0.5em";
  const containerBorder = "1px solid black";
  return (
    <div>
      <textarea
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
        onChange={(ev: ChangeEvent<HTMLTextAreaElement>) => {
          pushToLog("on test input change", {
            nativeEventType: ev.nativeEvent.type,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nativeEventInputType: (ev.nativeEvent as any).inputType,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nativeEventInputData: (ev.nativeEvent as any).data,
          });
          switch (ev.nativeEvent.type) {
            case "input": {
              const nativeEvent = ev.nativeEvent as InputEvent;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let event: any;
              switch (nativeEvent.inputType) {
                case "deleteContentBackward":
                  event = {
                    kind: "remove",
                    timestamp: Date.now(),
                  };
                  break;
                case "insertText":
                case "insertFromComposition" /* japanese handwritten input */:
                  event = {
                    kind: "add",
                    char: nativeEvent.data,
                    timestamp: Date.now(),
                  };
                  break;
                case "insertLineBreak":
                  event = {
                    kind: "add",
                    char: "\n",
                    timestamp: Date.now(),
                  };
                  break;
              }
              if (event && sentenceConsumer.state.kind !== "finished") {
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
          position: "relative",
        }}
      >
        {sentenceConsumer.state.kind === "finished" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: containerWidth,
              height: containerHeight,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              padding: containerPadding,
              borderRadius: containerBorderRadius,
              border: containerBorder,
            }}
          >
            Finished
          </div>
        )}

        <div
          style={{
            position: "relative",
            width: containerWidth,
            height: containerHeight,
            overflowY: "auto",
            border: containerBorder,
            borderRadius: containerBorderRadius,
            padding: containerPadding,
          }}
          onClick={startTest}
        >
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

const FrequenciesWrapper: ComponentType<{
  children: (frequencies: Record<string, number>) => ReactElement;
}> = ({ children }) => {
  const { status } = useCharPerformanceHistory();
  const { options } = useOptions();

  const frequencies = useMemo(() => {
    if (status.kind === "ok") {
      const chronological =
        charPerformanceHistoryToChronologicalCharPerformanceHistory(
          status.value,
          options.displaySignSystem.kind,
        );
      if (chronological.kind === "ok") {
        return charPerformanceHistoryChronologicalToFrequencyObject(
          chronological.value,
        );
      }
      return {};
    }
  }, [status, options.displaySignSystem.kind]);
  console.log(frequencies);

  return <>{frequencies ? children(frequencies) : null}</>;
};

const TestComponentInner = ({
  frequencies,
}: {
  frequencies: Record<string, number>;
}) => {
  const { options } = useOptions();

  const getNewSentence = useCallback(() => {
    let newSentence = options.displaySignSystem.getRandomSentence(
      options.numberOfWordsPerTest,
      options.displaySignSystem.allowedDisplaySigns,
      frequencies,
    );

    if (options.reverseSignSystems) {
      newSentence = mapResult(newSentence, reverseSentence);
    }

    return newSentence;
  }, [
    options.displaySignSystem,
    options.numberOfWordsPerTest,
    options.reverseSignSystems,
    frequencies,
  ]);

  const [sentence, setSentence] = useState(getNewSentence());

  const reset = () => {
    const newSentence = getNewSentence();
    setSentence(newSentence);
  };

  return sentence.kind === "error" ? (
    <div>Error while getting a sentence: {sentence.error}</div>
  ) : (
    <TestSentenceComponent sentence={sentence.value} reset={reset} />
  );
};

export const TestComponent = () => {
  return (
    <FrequenciesWrapper>
      {(frequencies) => <TestComponentInner frequencies={frequencies} />}
    </FrequenciesWrapper>
  );
};
