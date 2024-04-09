export type ConsumtionResult =
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
