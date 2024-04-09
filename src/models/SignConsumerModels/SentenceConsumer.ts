import {
  Sentence,
  sentenceToStringUnderlyingRepresentation,
} from "../SignModels/Sentence";

import { StringEntityConsumer } from "./StringEntityConsumer";
import { WordConsumer } from "./WordConsumer";
import {
  StringEntityConsumerState,
  stringEntityChangeEventsToString,
  StringEntityChangeEvent,
  ConsumtionResult,
} from "./types";

export class SentenceConsumer extends StringEntityConsumer {
  public wordConsumers: WordConsumer[] = [];

  constructor(
    public sentence: Sentence,
    public delimiter: string = " ",
  ) {
    super();
    this.wordConsumers = sentence.words.map((word) => new WordConsumer(word));
  }

  focus() {
    const firstWordConsumer = this.wordConsumers[0];
    firstWordConsumer.focus();
    this.state = { kind: "active" };
  }

  blur() {
    const firstWordConsumer = this.wordConsumers[0];
    firstWordConsumer.blur();
    this.state = { kind: "inactive" };
  }

  // this should only be called when the sentence is considered complete
  checkState(): StringEntityConsumerState {
    const stringFromEvents = stringEntityChangeEventsToString(this.events);
    return stringFromEvents ===
      sentenceToStringUnderlyingRepresentation(this.sentence)
      ? { kind: "finished", type: "correct" }
      : { kind: "finished", type: "incorrect" };
  }

  reset = () => {
    this.events = [];
    this.wordConsumers.forEach((wordConsumer) => wordConsumer.reset());
  };

  toString() {
    return this.wordConsumers
      .map((wordConsumer) => wordConsumer.toString())
      .join(" ");
  }

  finalize(sendSpace = true): void {
    const lastWordConsumer = this.wordConsumers[this.wordConsumers.length - 1];
    if (sendSpace)
      lastWordConsumer.consumeChangeEvent(
        {
          kind: "add",
          char: " ",
          timestamp: Date.now(),
        },
        this.delimiter,
      );
    const isIncorrect = this.wordConsumers.some((wordConsumer) => {
      const state = wordConsumer.state;
      return state.kind === "finished" && state.type === "incorrect";
    });

    if (isIncorrect) {
      this.state = { kind: "finished", type: "incorrect" };
    } else {
      this.state = { kind: "finished", type: "correct" };
    }
  }

  private getCurrentWordConsumerIndex(): number {
    return this.wordConsumers.findIndex((wordConsumer) => {
      return wordConsumer.state.kind === "active";
    });
  }

  private pipeEventToWordConsumers(
    event: StringEntityChangeEvent,
  ): ConsumtionResult {
    const currentWordConsumerIndex = this.getCurrentWordConsumerIndex();
    const currentWordConsumer = this.wordConsumers[currentWordConsumerIndex];

    if (!currentWordConsumer) return { kind: "go forward" };

    const result = currentWordConsumer.consumeChangeEvent(
      event,
      this.delimiter,
    );
    switch (result.kind) {
      case "success":
        return { kind: "success", value: this.state };
      case "go forward":
        if (currentWordConsumerIndex === this.wordConsumers.length - 1) {
          this.finalize(false);
          return { kind: "go forward" };
        } else {
          const nextWordConsumer =
            this.wordConsumers[currentWordConsumerIndex + 1];
          nextWordConsumer.focus();
          return {
            kind: "success",
            value: this.state,
          };
        }
      case "error":
        return { kind: "error", error: "error in word consumer" };
    }
  }

  consumeChangeEvent(event: StringEntityChangeEvent): ConsumtionResult {
    switch (event.kind) {
      case "add": {
        this.events.push(event);
        const result = this.pipeEventToWordConsumers(event);
        switch (result.kind) {
          case "success": {
            const lastWordConsumer =
              this.wordConsumers[this.wordConsumers.length - 1];
            if (lastWordConsumer.checkState().kind === "finished") {
              this.finalize();
              // end sentence when the last word is finished
              // without a space
              return { kind: "go forward" };
            }
            return { kind: "success", value: this.state };
          }
          case "go forward":
            return { kind: "go forward" };
          case "error":
            return { kind: "error", error: "error in word consumer" };
        }
      }
      // eslint-disable-next-line no-fallthrough
      case "remove": {
        const pipeResult = this.pipeEventToWordConsumers(event);
        switch (pipeResult.kind) {
          case "success":
            this.events.push(event);
            return { kind: "success", value: this.state };
          case "go forward":
            throw new Error("[unreachable] go forward on remove");
          case "error":
            return { kind: "error", error: "error in word consumer" };
        }
      }
    }
    throw new Error("[unreachable] unhandled event kind");
  }
}
