declare module "wanakana" {
  export const toHiragana: (input: string) => string;
  export const toKatakana: (input: string) => string;
  export const toRomaji: (input: string) => string;
}
declare module "diff" {
  export const diffChars: (
    a: string,
    b: string,
  ) => { value: string; added?: boolean; removed?: boolean }[];
}
