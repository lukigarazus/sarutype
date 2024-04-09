import {
  StringEntityChangeEvent,
  stringEntityChangeEventsToString,
  StringEntityConsumerState,
  ConsumtionResult,
} from "./types";

export abstract class StringEntityConsumer {
  protected events: StringEntityChangeEvent[] = [];

  public time(): number {
    return (
      (this.events[this.events.length - 1]?.timestamp ?? 0) -
      (this.events[0]?.timestamp ?? 0)
    );
  }

  public consumptionDuration(): number {
    if (this.state.kind === "finished")
      return (
        (this.events[this.events.length - 1]?.timestamp ?? 0) -
        (this.events[0]?.timestamp ?? 0)
      );

    return 0;
  }
  public state: StringEntityConsumerState = { kind: "inactive" };
  public toString() {
    return stringEntityChangeEventsToString(this.events);
  }
  public focus() {
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

  consumeChangeEvent(
    event: StringEntityChangeEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _delimiter?: string,
  ): ConsumtionResult {
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
