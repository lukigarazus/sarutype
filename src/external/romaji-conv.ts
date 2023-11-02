declare module "@koozaki/romaji-conv" {
  type RomajiConv = {
    toHiragana: () => string;
    toKatakana: () => string;
  };
  export default function romajiConv(romaji: string): RomajiConv;
}
