export const hiraganaSigns = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
  "た",
  "ち",
  "つ",
  "て",
  "と",
  "な",
  "に",
  "ぬ",
  "ね",
  "の",
  "は",
  "ひ",
  "ふ",
  "へ",
  "ほ",
  "ま",
  "み",
  "む",
  "め",
  "も",
  "や",
  "ゆ",
  "よ",
  "ら",
  "り",
  "る",
  "れ",
  "ろ",
  "わ",
  "を",
  "ん",
  // with diacritics
  "が",
  "ぎ",
  "ぐ",
  "げ",
  "ご",
  "ざ",
  "じ",
  "ず",
  "ぜ",
  "ぞ",
  "だ",
  "ぢ",
  "づ",
  "で",
  "ど",
  "ば",
  "び",
  "ぶ",
  "べ",
  "ぼ",
  "ぱ",
  "ぴ",
  "ぷ",
  "ぺ",
  "ぽ",
  // compound
  "きゃ",
  "きゅ",
  "きょ",
  "しゃ",
  "しゅ",
  "しょ",
  "ちゃ",
  "ちゅ",
  "ちょ",
  "にゃ",
  "にゅ",
  "にょ",
  "ひゃ",
  "ひゅ",
  "ひょ",
  "みゃ",
  "みゅ",
  "みょ",
  "りゃ",
  "りゅ",
  "りょ",
  "ぎゃ",
  "ぎゅ",
  "ぎょ",
  "じゃ",
  "じゅ",
  "じょ",
  "びゃ",
  "びゅ",
  "びょ",
  "ぴゃ",
  "ぴゅ",
  "ぴょ",
] as const;

export type HiraganaSign = (typeof hiraganaSigns)[number];
