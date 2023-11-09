type Ok<T> = {
  kind: "ok";
  value: T;
};

type Error<E> = {
  kind: "error";
  error: E;
};

export type Result<T, E> = Ok<T> | Error<E>;

export const catResult = <T, E>(results: Result<T, E>[]): Result<T[], E> => {
  const errors = results.filter((r) => r.kind === "error");
  if (errors.length > 0) {
    return {
      kind: "error",
      error: (errors[0] as Error<E>).error,
    };
  }
  return {
    kind: "ok",
    value: (results as Ok<T>[]).map((r) => r.value),
  };
};

export const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => {
  if (result.kind === "error") return result;

  return {
    kind: "ok",
    value: fn(result.value),
  };
};

export const resultUnsafeUnwrap = <T, E>(result: Result<T, E>): T => {
  if (result.kind === "error") {
    throw result.error;
  }
  return result.value;
};
