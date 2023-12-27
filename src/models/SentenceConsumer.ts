import { Char } from "./Char";
import { Sentence, sentenceToStringUnderlyingRepresentation } from "./Sentence";
import { Word, wordToStringUnderlyingRepresentation } from "./Word";

type ConsumtionResult =
  | {
      kind: "success";
      value: StringEntityConsumerState;
    }
  | {
      kind: "go forward";
    }
  | {
      kind: "error";
      error: string;
    };

export type StringEntityChangeEvent =
  | {
      kind: "add";
      char: string;
      timestamp: number;
    }
  | {
      kind: "remove";
      timestamp: number;
    }
  | {
      kind: "focus";
      timestamp: number;
    };

export type StringEntityConsumerState =
  | {
      kind: "inactive";
    }
  | {
      kind: "active";
    }
  | {
      kind: "finished";
      type: "correct" | "incorrect";
    };

export const stringEntityChangeEventsToString = (
  events: StringEntityChangeEvent[],
) => {
  const stringArray: string[] = [];

  for (const event of events) {
    if (event.kind === "add") stringArray.push(event.char);
    else if (event.kind === "remove") stringArray.pop();
  }

  return stringArray.join("");
};

export abstract class StringEntityConsumer {
  protected events: StringEntityChangeEvent[] = [];

  public time(): number {
    return (
      (this.events[this.events.length - 1]?.timestamp ?? 0) -
      (this.events[0]?.timestamp ?? 0)
    );
  }
  public state: StringEntityConsumerState = { kind: "inactive" };
  public toString() {
    return stringEntityChangeEventsToString(this.events);
  }
  public focus() {
    console.log("CharConsumer focus");
    this.state = { kind: "active" };
    this.events.push({
      kind: "focus",
      timestamp: Date.now(),
    });
  }
  public blur() {
    this.state = { kind: "inactive" };
  }
  public reset = () => {
    this.events = [];
    this.state = { kind: "inactive" };
  };
  protected shouldGoBack(event: StringEntityChangeEvent): boolean {
    return event.kind === "remove" && this.toString() === "";
  }

  abstract checkState(): StringEntityConsumerState;

  consumeChangeEvent(event: StringEntityChangeEvent): ConsumtionResult {
    console.log("CharConsumer consumeChangeEvent", event);
    switch (event.kind) {
      case "add": {
        if (this.state.kind === "finished") {
          throw new Error("cannot consume event on finished consumer");
        }
        this.events.push(event);
        const satisfactionState = this.checkState();
        this.state = satisfactionState;

        return this.state.kind === "finished"
          ? { kind: "go forward" }
          : { kind: "success", value: this.state };
      }
      case "remove": {
        if (this.toString() === "") {
          return { kind: "success", value: this.state };
        }
        this.events.push(event);
        const satisfactionState = this.checkState();
        this.state = satisfactionState;

        return { kind: "success", value: this.state };
      }
    }
    return { kind: "error", error: "unhandled event kind" };
  }
}

export class CharConsumer extends StringEntityConsumer {
  constructor(public char: Char) {
    super();
  }

  checkState(): StringEntityConsumerState {
    const stringFromEvents = stringEntityChangeEventsToString(this.events);
    return stringFromEvents === this.char.underlyingRepresentation
      ? { kind: "finished", type: "correct" }
      : stringFromEvents.length >= this.char.underlyingRepresentation.length
      ? { kind: "finished", type: "incorrect" }
      : { kind: "active" };
  }
}

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

  consumeChangeEvent(event: StringEntityChangeEvent): ConsumtionResult {
    console.log("WordConsumer consumeChangeEvent", event);
    const wordString = stringEntityChangeEventsToString(this.events);
    switch (event.kind) {
      case "add":
        switch (event.char) {
          case " ":
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

export class SentenceConsumer extends StringEntityConsumer {
  public wordConsumers: WordConsumer[] = [];

  constructor(public sentence: Sentence) {
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
      lastWordConsumer.consumeChangeEvent({
        kind: "add",
        char: " ",
        timestamp: Date.now(),
      });
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
    console.log("SentenceConsumer pipeEventToWordConsumers");
    const currentWordConsumerIndex = this.getCurrentWordConsumerIndex();
    const currentWordConsumer = this.wordConsumers[currentWordConsumerIndex];
    console.log("currentWordConsumer", currentWordConsumer);

    if (!currentWordConsumer) return { kind: "go forward" };

    const result = currentWordConsumer.consumeChangeEvent(event);
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
    console.log("SentenceConsumer consumeChangeEvent", event);
    switch (event.kind) {
      case "add": {
        console.log("SentenceConsumer consumeChangeEvent add");
        this.events.push(event);
        const result = this.pipeEventToWordConsumers(event);
        switch (result.kind) {
          case "success": {
            const lastWordConsumer =
              this.wordConsumers[this.wordConsumers.length - 1];
            console.log(
              "lastWordConsumer",
              lastWordConsumer,
              lastWordConsumer.checkState(),
            );
            if (lastWordConsumer.checkState().kind === "finished") {
              console.log("last word is finished", lastWordConsumer);
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
