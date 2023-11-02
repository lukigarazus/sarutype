import { ChangeEvent } from "react";
import { resultUnsafeUnwrap } from "./types/Result";
import { getRandomSentence } from "./utils/language/words";
/*<SentenceComponent
          onFocus={() => {
            console.log("focus");
          }}
          sentence={sentence}
        />*/
function App() {
  const sentence = resultUnsafeUnwrap(getRandomSentence(10));
  return (
    <>
      <h1>Sarutype</h1>
      <main>
        <input
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            switch (ev.nativeEvent.type) {
              case "input": {
                const nativeEvent = ev.nativeEvent as InputEvent;
                console.log({
                  key: nativeEvent.data,
                  timestamp: nativeEvent.timeStamp,
                });
              }
            }
          }}
        />
      </main>
    </>
  );
}

export default App;
