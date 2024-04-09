import { Word, wordToStringUnderlyingRepresentation } from "../SignModels/Word";

import { StringEntityConsumer } from "./StringEntityConsumer";
import { CharConsumer } from "./CharConsumer";
import {
  StringEntityConsumerState,
  stringEntityChangeEventsToString,
  StringEntityChangeEvent,
  ConsumtionResult,
} from "./types";

export class WordConsumer extends StringEntityConsumer {
  public charConsumers: CharConsumer[] = [];

  constructor(public word: Word) {
    super();
    this.charConsumers = word.chars.map((char) => new CharConsumer(char));
  }

  focus() {
    const firstCharConsumer = this.charConsumers[0];
    firstCharConsumer.focus();
    this.state = { kind: "active" };
  }
  blur() {
    const firstCharConsumer = this.charConsumers[0];
    firstCharConsumer.blur();
    this.state = { kind: "inactive" };
  }
  reset = () => {
    this.events = [];
    this.charConsumers.forEach((charConsumer) => charConsumer.reset());
  };

  toString() {
    return this.charConsumers
      .map((charConsumer) => charConsumer.toString())
      .join("");
  }

  // this should only be called when the word is considered complete
  checkState(): StringEntityConsumerState {
    const stringFromEvents = stringEntityChangeEventsToString(this.events);
    return stringFromEvents === wordToStringUnderlyingRepresentation(this.word)
      ? { kind: "finished", type: "correct" }
      : stringFromEvents.length ===
        wordToStringUnderlyingRepresentation(this.word).length
      ? { kind: "finished", type: "incorrect" }
      : this.state.kind === "inactive"
      ? { kind: "inactive" }
      : { kind: "active" };
  }

  finalize(): StringEntityConsumerState {
    this.charConsumers.forEach((charConsumer) =>
      charConsumer.state.kind === "finished"
        ? undefined
        : charConsumer.state.kind === "active"
        ? (charConsumer.state = { kind: "finished", type: "incorrect" })
        : undefined,
    );
    const stringFromEvents = stringEntityChangeEventsToString(this.events);
    return stringFromEvents === wordToStringUnderlyingRepresentation(this.word)
      ? { kind: "finished", type: "correct" }
      : { kind: "finished", type: "incorrect" };
  }

  private getCurrentCharConsumerIndex(): number {
    return this.charConsumers.findIndex((charConsumer) => {
      return charConsumer.state.kind === "active";
    });
  }

  private pipeEventToCharConsumers(
    event: StringEntityChangeEvent,
  ): ConsumtionResult {
    const currentCharConsumerIndex = this.getCurrentCharConsumerIndex();
    const currentCharConsumer = this.charConsumers[currentCharConsumerIndex];

    if (!currentCharConsumer) return { kind: "go forward" };

    const result = currentCharConsumer.consumeChangeEvent(event);
    switch (result.kind) {
      case "success":
        return { kind: "success", value: this.state };
      case "go forward":
        if (currentCharConsumerIndex === this.charConsumers.length - 1)
          return { kind: "go forward" };
        else {
          const nextCharConsumer =
            this.charConsumers[currentCharConsumerIndex + 1];
          nextCharConsumer.focus();
          return {
            kind: "success",
            value: this.state,
          };
        }
      case "error":
        return { kind: "error", error: "error in char consumer" };
    }
  }

  consumeChangeEvent(
    event: StringEntityChangeEvent,
    delimiter: string = " ",
  ): ConsumtionResult {
    const wordString = stringEntityChangeEventsToString(this.events);
    switch (event.kind) {
      case "add":
        switch (event.char) {
          case delimiter:
            switch (wordString) {
              // ignore leading spaces
              case "":
                return { kind: "success", value: this.state };
              default:
                this.state = this.finalize();
                return { kind: "go forward" };
            }
          default: {
            this.events.push(event);
            const result = this.pipeEventToCharConsumers(event);
            switch (result.kind) {
              case "success":
                return { kind: "success", value: this.state };
              case "go forward":
                // adding additional characters to a word that has all chars consumed
                return { kind: "success", value: this.state };
              case "error":
                return { kind: "error", error: "error in char consumer" };
            }
          }
        }
      // eslint-disable-next-line no-fallthrough
      case "remove": {
        const pipeResult = this.pipeEventToCharConsumers(event);
        switch (pipeResult.kind) {
          case "success":
            this.events.push(event);
            return { kind: "success", value: this.state };
          case "go forward":
            throw new Error("[unreachable] go forward on remove");
          case "error":
            return { kind: "error", error: "error in char consumer" };
        }
      }
    }
    throw new Error("[unreachable] unhandled event kind");
  }
}
