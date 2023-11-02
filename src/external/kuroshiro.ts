declare module "kuroshiro" {
  type Target = "hiragana" | "katakana" | "kanji" | "romaji";

  export default class Kuroshiro {
    constructor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init(analyzer: any): Promise<void>;
    convert(text: string, options: { to: Target }): Promise<string>;
  }
}

declare module "kuroshiro-analyzer-kuromoji" {
  export default class KuromojiAnalyzer {
    constructor(opts: { dictPath: string });
  }
}
