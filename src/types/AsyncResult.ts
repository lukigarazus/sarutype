export type AsyncResult<T, E> =
  | { kind: "loading" }
  | { kind: "error"; error: E }
  | { kind: "ok"; value: T };

export const okAsyncResult = <T, E>(value: T): AsyncResult<T, E> => ({
  kind: "ok",
  value,
});

export const mapAsyncResult = <T, U, E>(
  result: AsyncResult<T, E>,
  fn: (value: T) => AsyncResult<U, E>,
): AsyncResult<U, E> => {
  switch (result.kind) {
    case "loading":
    case "error":
      return result;
    case "ok":
      return fn(result.value);
  }
};

export const catAsyncResult = <T, E>(
  results: AsyncResult<T, E>[],
): AsyncResult<T[], E> => {
  const error = results.find((r) => r.kind === "error");
  if (error)
    return {
      kind: "error",
      error: (error as { kind: "error"; error: E }).error,
    };

  const loadings = results.find((r) => r.kind === "loading");
  if (loadings) return { kind: "loading" };

  return {
    kind: "ok",
    value: (results as AsyncResult<T, E>[]).map((r) =>
      r.kind === "ok"
        ? r.value
        : (() => {
            throw new Error("Unexpected error");
          })(),
    ),
  };
};
