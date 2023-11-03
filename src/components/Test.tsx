import { useMemo, useState, ChangeEvent, useEffect } from "react";
import { Sentence, sentenceConsumerFromSentence } from "../models/Sentence";
import { SentenceComponent } from "./Sentence";
import { sentenceDisplayFromSentenceConsumer } from "../models/SentenceDisplay";
import { useOptions } from "../hooks/useOptions";

const TestSentenceComponent = ({ sentence }: { sentence: Sentence }) => {
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

  useEffect(() => {
    setSentenceDisplay(sentenceDisplayFromSentenceConsumer(sentenceConsumer));
  }, [sentenceConsumer]);
  return (
    <div>
      <input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onFocus={() => {
          sentenceConsumer.focus();
          refresh();
        }}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          switch (ev.nativeEvent.type) {
            case "input": {
              const nativeEvent = ev.nativeEvent as InputEvent;
              const event =
                nativeEvent.data === null
                  ? ({
                      kind: "remove",
                      timestamp: nativeEvent.timeStamp,
                    } as const)
                  : ({
                      kind: "add",
                      char: nativeEvent.data,
                      timestamp: nativeEvent.timeStamp,
                    } as const);
              sentenceConsumer.consumeChangeEvent(event);
              refresh();
            }
          }
        }}
      />
      <SentenceComponent sentence={sentenceDisplay} />
    </div>
  );
};

export const TestComponent = () => {
  const { options } = useOptions();

  const sentence = options.displaySignSystem.getRandomSentence(
    10,
    options.displaySignSystem.allowedDisplaySigns,
  );

  return sentence.kind === "error" ? (
    <div>Error while getting a sentence: {sentence.error}</div>
  ) : (
    <TestSentenceComponent sentence={sentence.value} />
  );
};
