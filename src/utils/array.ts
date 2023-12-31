export const arrayOfLength = <T>(length: number, value: T): T[] =>
  Array(length).fill(value);

export const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const nRandomElements = <T>(array: T[], n: number): T[] => {
  return arrayOfLength(n, 0).map(() => randomElement(array));
};

export function scan<T, U>(
  arr: T[],
  fn: (accumulator: U, current: T) => U,
  initial: U,
): U[] {
  const result: U[] = [];
  arr.reduce((acc, current) => {
    const nextAcc = fn(acc, current);
    result.push(nextAcc);
    return nextAcc;
  }, initial);
  return result;
}

export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
