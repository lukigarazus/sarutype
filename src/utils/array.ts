export const arrayOfLength = <T>(length: number, value: T): T[] =>
  Array(length).fill(value);

export const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const nRandomElements = <T>(array: T[], n: number): T[] => {
  return arrayOfLength(n, 0).map(() => randomElement(array));
};
