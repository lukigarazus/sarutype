import { Char } from "../SignModels/Char";

import { StringEntityConsumer } from "./StringEntityConsumer";
import {
  StringEntityConsumerState,
  stringEntityChangeEventsToString,
} from "./types";

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
