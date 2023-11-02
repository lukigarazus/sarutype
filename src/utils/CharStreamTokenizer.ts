import { Result } from "../types/Result";

export type CharStreamEvent =
  | {
      kind: "add";
      char: string;
      timestamp: number;
    }
  | {
      kind: "remove";
      timestamp: number;
    };

type SatisfactionState = "satisfied" | "unsatisfied" | "satisfied with error";

export const charStreamEventsToString = (events: CharStreamEvent[]) => {
  const stringArray: string[] = [];

  for (const event of events) {
    if (event.kind === "add") stringArray.push(event.char);
    else stringArray.pop();
  }

  return stringArray.join("");
};

export abstract class CharStreamTokenizer {
  abstract checkSatisfaction(): SatisfactionState;

  protected events: CharStreamEvent[] = [];

  public satisfied: SatisfactionState = "unsatisfied";
  public toString = () => charStreamEventsToString(this.events);

  consumeEvent(event: CharStreamEvent): Result<void, string> {
    if (this.satisfied === "satisfied" && event.kind !== "remove")
      return { kind: "error", error: "this tokenizer is already satisfied" };

    this.events.push(event);

    if (event.kind === "remove" && this.events.length === 0)
      return { kind: "error", error: "no events to remove" };

    const satisfactionState = this.checkSatisfaction();
    this.satisfied = satisfactionState;

    return { kind: "ok", value: undefined };
  }
}

export class StringFragmentCharStreamTokenizer extends CharStreamTokenizer {
  constructor(private stringFragment: string) {
    super();
  }

  checkSatisfaction() {
    const stringFromEvents = charStreamEventsToString(this.events);
    return stringFromEvents === this.stringFragment
      ? "satisfied"
      : stringFromEvents.length === this.stringFragment.length
      ? "satisfied with error"
      : "unsatisfied";
  }
}

export class DelimiterCharStreamTokenizer extends CharStreamTokenizer {
  constructor(private delimiter: string) {
    super();
  }

  checkSatisfaction() {
    const lastEvent = this.events[this.events.length - 1];
    if (
      lastEvent &&
      lastEvent.kind === "add" &&
      lastEvent.char === this.delimiter
    )
      return "satisfied";
    return "unsatisfied";
  }
}

export class WhitespacesCharStreamTokenizer extends CharStreamTokenizer {
  consumeEvent(event: CharStreamEvent) {
    if (event.kind === "add" && event.char !== " ") {
      this.satisfied = "satisfied";
      return { kind: "ok" as const, value: undefined };
    }
    this.satisfied = "unsatisfied";
    return super.consumeEvent(event);
  }

  checkSatisfaction(): SatisfactionState {
    return this.satisfied;
  }
}

export class CharStreamTokenizerCombinator extends CharStreamTokenizer {
  constructor(private tokenizers: CharStreamTokenizer[]) {
    super();
  }

  getTokenizer = (index: number) => this.tokenizers[index];
  getFirstUnsatisfiedTokenizer = () =>
    this.tokenizers.find((tokenizer) => tokenizer.satisfied === "unsatisfied");

  checkSatisfaction() {
    const satisfiedChildren = this.tokenizers.filter(
      (tokenizer) => tokenizer.satisfied === "satisfied",
    );
    const unsatisfiedChildren = this.tokenizers.filter(
      (tokenizer) => tokenizer.satisfied === "unsatisfied",
    );

    if (unsatisfiedChildren.length > 0) return "unsatisfied";
    else if (satisfiedChildren.length === this.tokenizers.length)
      return "satisfied";
    return "satisfied with error";
  }

  consumeEvent(event: CharStreamEvent): Result<void, string> {
    if (this.satisfied === "satisfied" && event.kind !== "remove")
      return { kind: "error", error: "this tokenizer is already satisfied" };

    this.events.push(event);

    if (event.kind === "remove") {
      if (this.events.length > 0) {
        this.events.pop();

        for (let i = this.tokenizers.length - 1; i >= 0; i--) {
          const tokenizer = this.tokenizers[i];
          const result = tokenizer.consumeEvent(event);
          if (result.kind === "ok") {
            this.satisfied = this.checkSatisfaction();
            return { kind: "ok", value: undefined };
          }
        }

        return { kind: "error", error: "no events to remove" };
      } else return { kind: "error", error: "no events to remove" };
    }

    const unsatisfiedChild = this.tokenizers.find(
      (tokenizer) => tokenizer.satisfied === "unsatisfied",
    );

    if (unsatisfiedChild) {
      unsatisfiedChild.consumeEvent(event);
      this.satisfied = this.checkSatisfaction();
      return { kind: "ok", value: undefined };
    }

    return { kind: "error", error: "all children are satisfied" };
  }
}

/*export class RecursiveCharStreamTokenizer {
  private events: CharStreamEvent[] = [];
  private tokenizers: RecursiveCharStreamTokenizer[] = [];

  constructor(private satisfactionPredicate: (tokens: string[]) => boolean) {}

  public addTokenizer(tokenizer: RecursiveCharStreamTokenizer) {
    this.tokenizers.push(tokenizer);
  }

  consumeEvent = (event: CharStreamEvent) => {
    this.events.push(event);
  };
}*/
