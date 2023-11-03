import { Sentence, makeSentence } from "../../models/Sentence";
import { Word, wordFromRomaji, wordToStringHiragana } from "../../models/Word";
import { Result, catResult } from "../../types/Result";
import { randomElement, arrayOfLength } from "../array";
import { hiraganaToRomanji } from "./hiragana";

export const getRandomSentence = (
  length: number,
  allowedChars?: Set<string>,
): Result<Sentence, string> => {
  const result = catResult(
    arrayOfLength(length, 0).map(() => getRandomWord(allowedChars)),
  );
  switch (result.kind) {
    case "ok":
      return {
        kind: "ok",
        value: makeSentence(result.value),
      };
    case "error":
      return { kind: "error", error: result.error };
  }
};

export const getRandomWord = (
  allowedChars?: Set<string>,
): Result<Word, string> => {
  const allowedWords = DBWords.filter((word) => {
    if (!allowedChars) return true;
    const chars = word.hiragana.split("");
    const isAllowed = chars.every((char) => allowedChars.has(char));
    return isAllowed;
  });
  const element = randomElement(allowedWords);
  if (!element) return { kind: "error", error: "No words found" };
  return { kind: "ok", value: DBWordToWord(element) };
};

const isDBWordValid = (dbWord: DBWord) => {
  const word = DBWordToWord(dbWord);
  const hiraganaString = wordToStringHiragana(word);
  return hiraganaString === dbWord.hiragana;
};

type DBWord = {
  hiragana: string;
  romaji: string;
  wholeText: string;
};

const DBWordToWord = (dbWord: DBWord): Word => {
  return wordFromRomaji(dbWord.romaji);
};

const DBWords: DBWord[] = [
  {
    hiragana: "にんげん",
    romaji: "ningen",
    wholeText: "にんげん、人間 – human (ningen)",
  },
  {
    hiragana: "じんるい",
    romaji: "jinrui",
    wholeText: "じんるい、人類 – humanity (jinrui)",
  },
  {
    hiragana: "ひと",
    romaji: "hito",
    wholeText: "ひと、人 – person (hito)",
  },
  {
    hiragana: "おとこ",
    romaji: "otoko",
    wholeText: "おとこ、男 – male (otoko)",
  },
  {
    hiragana: "おとこのひと",
    romaji: "otokonohito",
    wholeText: "おとこのひと、男の人 – man (otokonohito)",
  },
  {
    hiragana: "おとこのこ",
    romaji: "otokonoko",
    wholeText: "おとこのこ、男の子 – boy (otokonoko)",
  },
  {
    hiragana: "おんな",
    romaji: "onna",
    wholeText: "おんな、女 – female (onna)",
  },
  {
    hiragana: "おんなのひと",
    romaji: "onnanohito",
    wholeText: "おんなのひと、女の人 – woman (onnanohito)",
  },
  {
    hiragana: "おんなのこ",
    romaji: "onnanoko",
    wholeText: "おんなのこ、女の子 – girl (onnanoko)",
  },
  {
    hiragana: "あかちゃん",
    romaji: "akachan",
    wholeText: "あかちゃん、赤ちゃん – baby (akachan)",
  },
  {
    hiragana: "わかもの",
    romaji: "wakamono",
    wholeText: "わかもの、若者 – youth, young person (wakamono)",
  },
  {
    hiragana: "わたし",
    romaji: "watashi",
    wholeText: "わたし、私 – I, myself (watashi)",
  },
  {
    hiragana: "わたくし",
    romaji: "watakushi",
    wholeText: "わたくし、私 – I, myself (watakushi [most formal])",
  },
  {
    hiragana: "ぼく",
    romaji: "boku",
    wholeText: "ぼく、僕 – I, myself (boku, mainly used by males)",
  },
  {
    hiragana: "おれ",
    romaji: "ore",
    wholeText: "おれ、俺 – I, myself (ore, mainly used by males [informal])",
  },
  {
    hiragana: "あたし",
    romaji: "atashi",
    wholeText:
      "あたし、私 – I, myself (atashi, mainly used by females [softer sounding])",
  },
  {
    hiragana: "しょうじょ",
    romaji: "shoujo",
    wholeText: "しょうじょ、少女 – girl (shoujo)",
  },
  {
    hiragana: "しょうねん",
    romaji: "shounen",
    wholeText: "しょうねん、少年 – boy (shounen)",
  },
  {
    hiragana: "いしゃ",
    romaji: "isha",
    wholeText: "いしゃ、医者 – doctor (isha)",
  },
  {
    hiragana: "かんごし",
    romaji: "kangoshi",
    wholeText: "かんごし、看護師 – nurse (kangoshi)",
  },
  {
    hiragana: "かんごふ",
    romaji: "kangofu",
    wholeText: "かんごふ、看護婦 – female nurse (kangofu)",
  },
  {
    hiragana: "しかい",
    romaji: "shikai, ha-isha",
    wholeText: "しかい、歯科医、はいしゃ、歯医者 – dentist (shikai, ha-isha)",
  },
  {
    hiragana: "せいじか",
    romaji: "seijika",
    wholeText: "せいじか、政治家 – politician (seijika)",
  },
  {
    hiragana: "べんごし",
    romaji: "bengoshi",
    wholeText: "べんごし、弁護士 – lawyer (bengoshi)",
  },
  {
    hiragana: "しょうぼうし",
    romaji: "shouboushi",
    wholeText: "しょうぼうし、消防士 – firefighter (shouboushi)",
  },
  {
    hiragana: "けいさつかん",
    romaji: "keisatsukan",
    wholeText: "けいさつかん、警察官 – police officer (keisatsukan)",
  },
  {
    hiragana: "へいし",
    romaji: "heishi",
    wholeText: "へいし、兵士 – soldier (heishi)",
  },
  {
    hiragana: "けんちくか",
    romaji: "kenchikuka",
    wholeText: "けんちくか、建築家 – architect (kenchikuka)",
  },
  {
    hiragana: "せんせい",
    romaji: "sensei",
    wholeText: "せんせい、先生 – teacher (sensei)",
  },
  {
    hiragana: "きょうし",
    romaji: "kyoushi",
    wholeText: "きょうし、教師 – (academic) teacher (kyoushi)",
  },
  {
    hiragana: "かしゅ",
    romaji: "kashu",
    wholeText: "かしゅ、歌手 – singer (kashu)",
  },
  {
    hiragana: "エンジニア",
    romaji: "enjinia",
    wholeText: "エンジニア – engineer(enjinia)",
  },
  {
    hiragana: "あし",
    romaji: "ashi",
    wholeText: "あし、足、脚 – foot, leg (ashi)",
  },
  {
    hiragana: "かかと",
    romaji: "kakato",
    wholeText: "かかと、踵 – heel (kakato)",
  },
  {
    hiragana: "すね",
    romaji: "sune",
    wholeText: "すね、脛 – shin (sune)",
  },
  {
    hiragana: "ひざ",
    romaji: "hiza",
    wholeText: "ひざ、膝 – knee (hiza)",
  },
  {
    hiragana: "もも",
    romaji: "momo",
    wholeText: "もも、腿 – thigh (momo)",
  },
  {
    hiragana: "あたま",
    romaji: "atama",
    wholeText: "あたま、頭 – head (atama)",
  },
  {
    hiragana: "かお",
    romaji: "kao",
    wholeText: "かお、顔 – face (kao)",
  },
  {
    hiragana: "くち",
    romaji: "kuchi",
    wholeText: "くち、口 – mouth (kuchi)",
  },
  {
    hiragana: "くちびる",
    romaji: "kuchibiru",
    wholeText: "くちびる、唇 – lips (kuchibiru)",
  },
  {
    hiragana: "は",
    romaji: "ha",
    wholeText: "は、歯 – tooth (ha)",
  },
  {
    hiragana: "はな",
    romaji: "hana",
    wholeText: "はな、鼻 – nose (hana)",
  },
  {
    hiragana: "め",
    romaji: "me",
    wholeText: "め、目 – eye (me)",
  },
  {
    hiragana: "ひげ",
    romaji: "hige",
    wholeText: "ひげ、髭、鬚、髯 – moustache, beard (hige)",
  },
  {
    hiragana: "かみ",
    romaji: "kami",
    wholeText: "かみ、髪 – hair (kami)",
  },
  {
    hiragana: "みみ",
    romaji: "mimi",
    wholeText: "みみ、耳 – ear (mimi)",
  },
  {
    hiragana: "おなか",
    romaji: "onaka",
    wholeText: "おなか、御腹 – stomach (onaka)",
  },
  {
    hiragana: "うで",
    romaji: "ude",
    wholeText: "うで、腕 – arm (ude)",
  },
  {
    hiragana: "ひじ",
    romaji: "hiji",
    wholeText: "ひじ、肘 – elbow (hiji)",
  },
  {
    hiragana: "かた",
    romaji: "kata",
    wholeText: "かた、肩 – shoulder (kata)",
  },
  {
    hiragana: "つめ",
    romaji: "tsume",
    wholeText: "つめ、爪 – nail (tsume)",
  },
  {
    hiragana: "て",
    romaji: "te",
    wholeText: "て、手 – hand (te)",
  },
  {
    hiragana: "てくび",
    romaji: "tekubi",
    wholeText: "てくび、手首 – wrist (tekubi)",
  },
  {
    hiragana: "てのひら",
    romaji: "te-no-hira",
    wholeText: "てのひら、掌、手の平 – palm of hand (te-no-hira)",
  },
  {
    hiragana: "ゆび",
    romaji: "yubi",
    wholeText: "ゆび、指 – finger, toe (yubi)",
  },
  {
    hiragana: "しり",
    romaji: "shiri",
    wholeText: "しり、尻 – buttocks (shiri)",
  },
  {
    hiragana: "おなか",
    romaji: "o-naka",
    wholeText: "おなか、お腹 （はら、腹） – abdomen (o-naka)",
  },
  {
    hiragana: "かんぞう",
    romaji: "kanzō",
    wholeText: "かんぞう、肝臓 – liver (kanzō)",
  },
  {
    hiragana: "きも",
    romaji: "kimo",
    wholeText: "きも、肝 – liver (kimo)",
  },
  {
    hiragana: "きんにく",
    romaji: "kin'niku",
    wholeText: "きんにく、筋肉 – muscle (kin'niku)",
  },
  {
    hiragana: "くび",
    romaji: "kubi",
    wholeText: "くび、首 – neck (kubi)",
  },
  {
    hiragana: "こころ",
    romaji: "kokoro",
    wholeText: "こころ、心 – heart [as in feelings] (kokoro)",
  },
  {
    hiragana: "こし",
    romaji: "koshi",
    wholeText: "こし、腰 – waist, hip (koshi)",
  },
  {
    hiragana: "しんぞう",
    romaji: "shinzō",
    wholeText: "しんぞう、心臓 – heart (shinzō)",
  },
  {
    hiragana: "せなか",
    romaji: "senaka",
    wholeText: "せなか、背中 – back (senaka)",
  },
  {
    hiragana: "ち",
    romaji: "chi",
    wholeText: "ち、血 – blood (chi)",
  },
  {
    hiragana: "にく",
    romaji: "niku",
    wholeText: "にく、肉 – meat (niku)",
  },
  {
    hiragana: "はだ",
    romaji: "hada",
    wholeText: "はだ、肌、膚 – skin (hada)",
  },
  {
    hiragana: "ひふ",
    romaji: "hifu",
    wholeText: "ひふ、皮膚 – skin (hifu)",
  },
  {
    hiragana: "ほね",
    romaji: "hone",
    wholeText: "ほね、骨 – bone (hone)",
  },
  {
    hiragana: "むね",
    romaji: "mune",
    wholeText: "むね、胸 – chest (mune)",
  },
  {
    hiragana: "かぜ",
    romaji: "kaze",
    wholeText: "かぜ、風邪 – cold [illness] (kaze)",
  },
  {
    hiragana: "げり",
    romaji: "geri",
    wholeText: "げり、下痢 – diarrhea (geri)",
  },
  {
    hiragana: "びょうき",
    romaji: "byōki",
    wholeText: "びょうき、病気 – illness (byōki)",
  },
  {
    hiragana: "かぞく",
    romaji: "kazoku",
    wholeText: "かぞく、家族 – family (kazoku)",
  },
  {
    hiragana: "りょうしん",
    romaji: "ryoushin",
    wholeText: "りょうしん、両親 – parents (ryoushin)",
  },
  {
    hiragana: "こども",
    romaji: "kodomo",
    wholeText: "こども、子供 – children, child (kodomo)",
  },
  {
    hiragana: "ちち",
    romaji: "chichi",
    wholeText: 'ちち、父 – father (chichi)("otou-san")',
  },
  {
    hiragana: "はは",
    romaji: "haha",
    wholeText: 'はは、母 – mother (haha)("okaa-san")',
  },
  {
    hiragana: "つま",
    romaji: "tsuma",
    wholeText: "つま、妻 – wife (tsuma)",
  },
  {
    hiragana: "おっと",
    romaji: "otto",
    wholeText: "おっと、夫 – husband (otto)",
  },
  {
    hiragana: "あに",
    romaji: "ani",
    wholeText: "あに、兄 – older brother (ani) (onī-san)",
  },
  {
    hiragana: "あね",
    romaji: "ane",
    wholeText: "あね、姉 – older sister (ane) (onē-san)",
  },
  {
    hiragana: "おとうと",
    romaji: "otōto",
    wholeText: "おとうと、弟 – younger brother (otōto)",
  },
  {
    hiragana: "いもうと",
    romaji: "imōto",
    wholeText: "いもうと、妹 – younger sister (imōto)",
  },
  {
    hiragana: "きょうだい",
    romaji: "kyōdai",
    wholeText: "きょうだい、兄弟 – brothers, siblings (kyōdai)",
  },
  {
    hiragana: "しまい",
    romaji: "shimai",
    wholeText: "しまい、姉妹 – sisters (shimai)",
  },
  {
    hiragana: "そふ",
    romaji: "sofu",
    wholeText: "そふ、祖父 – grandfather (sofu) (ojii-san)",
  },
  {
    hiragana: "そぼ",
    romaji: "sobo",
    wholeText: "そぼ、祖母 – grandmother (sobo) (obaa-san)",
  },
  {
    hiragana: "まご",
    romaji: "mago",
    wholeText: "まご、孫 – grandchild (mago)",
  },
  {
    hiragana: "おじ",
    romaji: "oji",
    wholeText: "おじ、伯父、叔父 – uncle (oji) (oji-san)",
  },
  {
    hiragana: "おば",
    romaji: "oba",
    wholeText: "おば、伯母、叔母 – aunt (oba) (oba-san)",
  },
  {
    hiragana: "いとこ",
    romaji: "itoko",
    wholeText:
      "いとこ、従兄弟、従姉妹、従兄、従弟、従姉、従妹 – cousin (itoko)",
  },
  {
    hiragana: "めい",
    romaji: "mei",
    wholeText: "めい、姪 – niece (mei)",
  },
  {
    hiragana: "おい",
    romaji: "oi",
    wholeText: "おい、甥 – nephew (oi)",
  },
  {
    hiragana: "いきもの",
    romaji: "ikimono",
    wholeText: "いきもの、生き物 – living creatures (ikimono)",
  },
  {
    hiragana: "ばけもの",
    romaji: "bakemono",
    wholeText: "ばけもの、化け物 – monster (bakemono)",
  },
  {
    hiragana: "どうぶつ",
    romaji: "dōbutsu",
    wholeText: "どうぶつ、動物 – animal (dōbutsu)",
  },
  {
    hiragana: "チーター",
    romaji: "chītā",
    wholeText: "チーター – cheetah (chītā)",
  },
  {
    hiragana: "いぬ",
    romaji: "inu",
    wholeText: "いぬ、犬 – dog (inu)",
  },
  {
    hiragana: "ねこ",
    romaji: "neko",
    wholeText: "ねこ、猫 – cat (neko)",
  },
  {
    hiragana: "うし",
    romaji: "ushi",
    wholeText: "うし、牛 – cow (ushi)",
  },
  {
    hiragana: "ぶた",
    romaji: "buta",
    wholeText: "ぶた、豚 – pig (buta)",
  },
  {
    hiragana: "うま",
    romaji: "uma",
    wholeText: "うま、馬 – horse (uma)",
  },
  {
    hiragana: "ひつじ",
    romaji: "hitsuji",
    wholeText: "ひつじ、羊 – sheep (hitsuji)",
  },
  {
    hiragana: "さる",
    romaji: "saru",
    wholeText: "さる、猿 – monkey (saru)",
  },
  {
    hiragana: "ねずみ",
    romaji: "nezumi",
    wholeText: "ねずみ、鼠 – mouse, rat (nezumi)",
  },
  {
    hiragana: "とら",
    romaji: "tora",
    wholeText: "とら、虎 – tiger (tora)",
  },
  {
    hiragana: "オオカミ",
    romaji: "ōkami",
    wholeText: "オオカミ、狼 – wolf (ōkami)",
  },
  {
    hiragana: "うさぎ",
    romaji: "usagi",
    wholeText: "うさぎ、兎 – rabbit (usagi)",
  },
  {
    hiragana: "りゅう",
    romaji: "ryū",
    wholeText: "りゅう、たつ、竜 – dragon (ryū, tatsu)",
  },
  {
    hiragana: "しか",
    romaji: "shika",
    wholeText: "しか、鹿 – deer (shika)",
  },
  {
    hiragana: "かえる",
    romaji: "kaeru",
    wholeText: "かえる、蛙 – frog (kaeru)",
  },
  {
    hiragana: "がま",
    romaji: "gama",
    wholeText: "がま、蟇 – toad (gama)",
  },
  {
    hiragana: "しし",
    romaji: "shishi",
    wholeText: "しし、獅子 – lion (shishi)",
  },
  {
    hiragana: "キリン",
    romaji: "kirin",
    wholeText: "キリン、麒麟 – giraffe (kirin)",
  },
  {
    hiragana: "ぞう",
    romaji: "zō",
    wholeText: "ぞう、象 – elephant (zō)",
  },
  {
    hiragana: "とり",
    romaji: "tori",
    wholeText: "とり、鳥 – bird (tori)",
  },
  {
    hiragana: "にわとり",
    romaji: "niwatori",
    wholeText: "にわとり、鶏 – chicken (niwatori)",
  },
  {
    hiragana: "すずめ",
    romaji: "suzume",
    wholeText: "すずめ、雀 – sparrow (suzume)",
  },
  {
    hiragana: "からす",
    romaji: "karasu",
    wholeText: "からす、烏 – crow, raven (karasu)",
  },
  {
    hiragana: "わし",
    romaji: "washi",
    wholeText: "わし、鷲 – eagle (washi)",
  },
  {
    hiragana: "たか",
    romaji: "taka",
    wholeText: "たか、鷹 – hawk, falcon (taka)",
  },
  {
    hiragana: "さかな",
    romaji: "sakana",
    wholeText: "さかな、魚 – fish (sakana)",
  },
  {
    hiragana: "たい",
    romaji: "tai",
    wholeText: "たい、鯛 – red snapper (tai)",
  },
  {
    hiragana: "えび",
    romaji: "ebi",
    wholeText: "えび、海老 – shrimp, lobster (ebi)",
  },
  {
    hiragana: "いわし",
    romaji: "iwashi",
    wholeText: "いわし、鰯 – sardine (iwashi)",
  },
  {
    hiragana: "まぐろ",
    romaji: "maguro",
    wholeText: "まぐろ、鮪 – tuna (maguro)",
  },
  {
    hiragana: "かつお",
    romaji: "katsuo",
    wholeText: "かつお、鰹 – bonito (katsuo)",
  },
  {
    hiragana: "さんま",
    romaji: "sanma",
    wholeText: "さんま、秋刀魚 – pike (sanma)",
  },
  {
    hiragana: "あじ",
    romaji: "aji",
    wholeText: "あじ、鰺 – horse mackerel (aji)",
  },
  {
    hiragana: "さば",
    romaji: "saba",
    wholeText: "さば、鯖 – mackerel (saba)",
  },
  {
    hiragana: "イカ",
    romaji: "ika",
    wholeText: "イカ、烏賊 – squid (ika)",
  },
  {
    hiragana: "タコ",
    romaji: "tako",
    wholeText: "タコ、蛸、章魚 – octopus (tako)",
  },
  {
    hiragana: "むし",
    romaji: "mushi",
    wholeText: "むし、虫 – insect (mushi)",
  },
  {
    hiragana: "ちょう",
    romaji: "chō",
    wholeText: "ちょう、蝶 – butterfly (chō)",
  },
  {
    hiragana: "ガ",
    romaji: "ga",
    wholeText: "ガ、蛾 – moth (ga)",
  },
  {
    hiragana: "せみ",
    romaji: "semi",
    wholeText: "せみ、蝉 – cicada (semi)",
  },
  {
    hiragana: "トンボ",
    romaji: "tonbo",
    wholeText: "トンボ、蜻蛉 – dragonfly (tonbo)",
  },
  {
    hiragana: "バッタ",
    romaji: "batta",
    wholeText: "バッタ、飛蝗 – grasshopper (batta)",
  },
  {
    hiragana: "クモ",
    romaji: "kumo",
    wholeText: "クモ、蜘蛛 – spider (kumo)",
  },
  {
    hiragana: "ホタル",
    romaji: "hotaru",
    wholeText: "ホタル、蛍 – firefly (hotaru)",
  },
  {
    hiragana: "ハエ",
    romaji: "hae",
    wholeText: "ハエ、蝿、蠅 – housefly (hae)",
  },
  {
    hiragana: "カ",
    romaji: "ka",
    wholeText: "カ、蚊 – mosquito, gnat (ka)",
  },
  {
    hiragana: "ゴキブリ",
    romaji: "gokiburi",
    wholeText: "ゴキブリ、蜚蠊 – cockroach (gokiburi)",
  },
  {
    hiragana: "カタツムリ",
    romaji: "katatsumuri",
    wholeText: "カタツムリ、蝸牛 – snail (katatsumuri)",
  },
  {
    hiragana: "ナメクジ",
    romaji: "namekuji",
    wholeText: "ナメクジ、蛞蝓 – slug (namekuji)",
  },
  {
    hiragana: "ミミズ",
    romaji: "mimizu",
    wholeText: "ミミズ、蚯蚓 – earthworm (mimizu)",
  },
  {
    hiragana: "かい",
    romaji: "kai",
    wholeText: "かい、貝 – shellfish (kai)",
  },
  {
    hiragana: "かいがら",
    romaji: "kaigara",
    wholeText: "かいがら、貝殻 – shell (kaigara)",
  },
  {
    hiragana: "トカゲ",
    romaji: "tokage",
    wholeText: "トカゲ、蜥蜴 – lizard (tokage)",
  },
  {
    hiragana: "へび",
    romaji: "hebi",
    wholeText: "へび、蛇 – snake (hebi)",
  },
  {
    hiragana: "くま",
    romaji: "kuma",
    wholeText: "くま、熊 – bear(kuma)",
  },
  {
    hiragana: "しょくぶつ",
    romaji: "shokubutsu",
    wholeText: "しょくぶつ、植物 - plants (shokubutsu)",
  },
  {
    hiragana: "くさ",
    romaji: "kusa",
    wholeText: "くさ、草 - grass (kusa)",
  },
  {
    hiragana: "はな",
    romaji: "hana",
    wholeText: "はな、花 - flower (hana)",
  },
  {
    hiragana: "み",
    romaji: "mi",
    wholeText: "み、実 - fruit (mi)",
  },
  {
    hiragana: "き",
    romaji: "ki",
    wholeText: "き、木 - tree (ki)",
  },
  {
    hiragana: "は",
    romaji: "ha",
    wholeText: "は、葉 (はっぱ、葉っぱ) - leaf (ha, happa)",
  },
  {
    hiragana: "ね",
    romaji: "ne",
    wholeText: "ね、根 (ねっこ、根っ子) - root (ne, nekko)",
  },
  {
    hiragana: "くき",
    romaji: "kuki",
    wholeText: "くき、茎 - stem (kuki)",
  },
  {
    hiragana: "きのこ",
    romaji: "kinoko",
    wholeText: "きのこ、茸 - mushroom (kinoko)",
  },
  {
    hiragana: "きく",
    romaji: "kiku",
    wholeText: "きく、菊 - chrysanthemum (kiku)",
  },
  {
    hiragana: "さくら",
    romaji: "sakura",
    wholeText: "さくら、桜 - cherry blossom (sakura)",
  },
  {
    hiragana: "まつ",
    romaji: "matsu",
    wholeText: "まつ、松 - pine tree (matsu)",
  },
  {
    hiragana: "うめ",
    romaji: "ume",
    wholeText: "うめ、梅 - japanese plum or apricot (ume)",
  },
  {
    hiragana: "こめ",
    romaji: "kome",
    wholeText: "こめ、米 – uncooked rice (kome)",
  },
  {
    hiragana: "いね",
    romaji: "ine",
    wholeText: "いね、稲 – rice growing in a field (ine)",
  },
  {
    hiragana: "むぎ",
    romaji: "mugi",
    wholeText: "むぎ、麦 – wheat, barley, oats (mugi)",
  },
  {
    hiragana: "やさい",
    romaji: "yasai",
    wholeText: "やさい、野菜 – vegetable (yasai)",
  },
  {
    hiragana: "くだもの",
    romaji: "kudamono",
    wholeText: "くだもの、果物 – fruit for eating (kudamono)",
  },
  {
    hiragana: "いも",
    romaji: "imo",
    wholeText: "いも、芋 – yam, potato, taro (imo)",
  },
  {
    hiragana: "まめ",
    romaji: "mame",
    wholeText: "まめ、豆 – beans, peas (mame)",
  },
  {
    hiragana: "だいこん",
    romaji: "daikon",
    wholeText: "だいこん、大根 – Japanese white radish (daikon)",
  },
  {
    hiragana: "にんじん",
    romaji: "ninjin",
    wholeText: "にんじん、人参 – carrot (ninjin)",
  },
  {
    hiragana: "リンゴ",
    romaji: "ringo",
    wholeText: "リンゴ、林檎 – apple (ringo)",
  },
  {
    hiragana: "ミカン",
    romaji: "mikan",
    wholeText: "ミカン、蜜柑 – mandarin orange (mikan)",
  },
  {
    hiragana: "バナナ",
    romaji: "banana",
    wholeText: "バナナ、かんしょう、甘蕉 – banana (banana, kanshō)",
  },
  {
    hiragana: "ナシ",
    romaji: "nashi",
    wholeText: "ナシ、梨 – pear (nashi)",
  },
  {
    hiragana: "クリ",
    romaji: "kuri",
    wholeText: "クリ、栗 – chestnut tree (kuri)",
  },
  {
    hiragana: "モモ",
    romaji: "momo",
    wholeText: "モモ、桃 – peach (momo)",
  },
  {
    hiragana: "トマト",
    romaji: "tomato",
    wholeText: "トマト、ばんか、蕃茄 – tomato (tomato, banka)",
  },
  {
    hiragana: "スイカ",
    romaji: "suika",
    wholeText: "スイカ、西瓜 – watermelon (suika)",
  },
  {
    hiragana: "たべもの",
    romaji: "tabemono",
    wholeText: "たべもの、食べ物 - food (tabemono)",
  },
  {
    hiragana: "ちょうしょく",
    romaji: "chōshoku",
    wholeText: "ちょうしょく、朝食 - breakfast (chōshoku, asagohan)",
  },
  {
    hiragana: "ひるごはん",
    romaji: "hirugohan",
    wholeText: "ひるごはん、昼御飯 - lunch (hirugohan)",
  },
  {
    hiragana: "ばんごはん",
    romaji: "bangohan",
    wholeText: "ばんごはん、晩御飯 - dinner (bangohan)",
  },
  {
    hiragana: "ごはん",
    romaji: "gohan",
    wholeText: "ごはん、御飯 - cooked rice or meal (gohan)",
  },
  {
    hiragana: "みそ",
    romaji: "miso",
    wholeText: "みそ、味噌 - miso (miso)",
  },
  {
    hiragana: "りょうり",
    romaji: "ryōri",
    wholeText: "りょうり、料理 - cooking (ryōri)",
  },
  {
    hiragana: "サラダ",
    romaji: "sarada",
    wholeText: "サラダ - salad (sarada)",
  },
  {
    hiragana: "デザート",
    romaji: "dezāto",
    wholeText: "デザート - dessert (dezāto)",
  },
  {
    hiragana: "パン",
    romaji: "pan",
    wholeText: "パン - bread (pan)",
  },
  {
    hiragana: "サンドイッチ",
    romaji: "sandoitchi",
    wholeText: "サンドイッチ - sandwich (sandoitchi)",
  },
  {
    hiragana: "おやつ",
    romaji: "oyatsu",
    wholeText: "おやつ、間食 - snack (oyatsu, kanshoku)",
  },
  {
    hiragana: "アイスクリーム",
    romaji: "aisukurīmu",
    wholeText: "アイスクリーム - ice cream (aisukurīmu)",
  },
  {
    hiragana: "たこやき",
    romaji: "takoyaki",
    wholeText: "たこやき、たこ焼き - octopus dumpling (takoyaki)",
  },
  {
    hiragana: "のみもの",
    romaji: "nomimono",
    wholeText: "のみもの、飲み物 - drink/beverage (nomimono)",
  },
  {
    hiragana: "ちゃ",
    romaji: "cha",
    wholeText: "ちゃ、茶 - tea (cha)",
  },
  {
    hiragana: "おちゃ",
    romaji: "ocha",
    wholeText: "おちゃ、お茶 - green tea (ocha)",
  },
  {
    hiragana: "コーヒー",
    romaji: "kōhī",
    wholeText: "コーヒー、珈琲 - coffee (kōhī)",
  },
  {
    hiragana: "ぎゅうにゅう",
    romaji: "gyūnyū",
    wholeText: "ぎゅうにゅう、牛乳 - milk (gyūnyū)",
  },
  {
    hiragana: "みず",
    romaji: "mizu",
    wholeText: "みず、水 - water (mizu)",
  },
  {
    hiragana: "ビール",
    romaji: "bīru",
    wholeText: "ビール - beer (bīru)",
  },
  {
    hiragana: "ワイン",
    romaji: "wain",
    wholeText: "ワイン - wine (wain)",
  },
  {
    hiragana: "さとう",
    romaji: "satō",
    wholeText: "さとう、砂糖 - sugar (satō)",
  },
  {
    hiragana: "しお",
    romaji: "shio",
    wholeText: "しお、塩 - salt (shio)",
  },
  {
    hiragana: "しょうゆ",
    romaji: "shōyu",
    wholeText: "しょうゆ、醤油 - soy sauce (shōyu)",
  },
  {
    hiragana: "じかん",
    romaji: "jikan",
    wholeText: "じかん、時間 – time (jikan)",
  },
  {
    hiragana: "とき",
    romaji: "toki",
    wholeText: "とき、じ、時 – ~hours (toki, ji)",
  },
  {
    hiragana: "こよみ",
    romaji: "koyomi",
    wholeText: "こよみ、カレンダー、暦 – calendar (koyomi, karendā)",
  },
  {
    hiragana: "ふん",
    romaji: "fun",
    wholeText: "ふん、分 – minute (fun)",
  },
  {
    hiragana: "びょう",
    romaji: "byō",
    wholeText: "びょう、秒 – second (byō)",
  },
  {
    hiragana: "ひ",
    romaji: "hi",
    wholeText: "ひ、にち、日 – day (hi, nichi)",
  },
  {
    hiragana: "つき",
    romaji: "tsuki",
    wholeText: "つき、がつ、月 – month (tsuki, gatsu)",
  },
  {
    hiragana: "とし",
    romaji: "toshi",
    wholeText: "とし、ねん、年 – year (toshi, nen)",
  },
  {
    hiragana: "きのう",
    romaji: "kinō",
    wholeText: "きのう、さくじつ、昨日 – yesterday (kinō, sakujitsu)",
  },
  {
    hiragana: "きょう",
    romaji: "kyō",
    wholeText: "きょう、今日 – today (kyō)",
  },
  {
    hiragana: "あした",
    romaji: "ashita",
    wholeText:
      "あした、あす、みょうにち、明日 – tomorrow (ashita, asu, myōnichi)",
  },
  {
    hiragana: "あさ",
    romaji: "asa",
    wholeText: "あさ、朝 – morning (asa)",
  },
  {
    hiragana: "ひる",
    romaji: "hiru",
    wholeText: "ひる、昼 – afternoon (hiru)",
  },
  {
    hiragana: "ゆうがた",
    romaji: "yūgata",
    wholeText: "ゆうがた、夕方 – evening (yūgata)",
  },
  {
    hiragana: "ばん",
    romaji: "ban",
    wholeText: "ばん、晩 – evening (ban)",
  },
  {
    hiragana: "よる",
    romaji: "yoru",
    wholeText: "よる、夜 – evening, night (yoru)",
  },
  {
    hiragana: "ようび",
    romaji: "yōbi",
    wholeText: "ようび、曜日 – ~day (yōbi)",
  },
  {
    hiragana: "しゅう",
    romaji: "shū",
    wholeText: "しゅう、週 – week (shū)",
  },
  {
    hiragana: "いっしゅうかん",
    romaji: "isshūkan",
    wholeText: "いっしゅうかん、一週間 – one week (isshūkan)",
  },
  {
    hiragana: "にちようび",
    romaji: "nichi-yōbi",
    wholeText: "にちようび、日曜日 – Sunday (nichi-yōbi)",
  },
  {
    hiragana: "げつようび",
    romaji: "getsu-yōbi",
    wholeText: "げつようび、月曜日 – Monday (getsu-yōbi)",
  },
  {
    hiragana: "かようび",
    romaji: "ka-yōbi",
    wholeText: "かようび、火曜日 – Tuesday (ka-yōbi)",
  },
  {
    hiragana: "すいようび",
    romaji: "sui-yōbi",
    wholeText: "すいようび、水曜日 – Wednesday (sui-yōbi)",
  },
  {
    hiragana: "もくようび",
    romaji: "moku-yōbi",
    wholeText: "もくようび、木曜日 – Thursday (moku-yōbi)",
  },
  {
    hiragana: "きんようび",
    romaji: "kin-yōbi",
    wholeText: "きんようび、金曜日 – Friday (kin-yōbi)",
  },
  {
    hiragana: "どようび",
    romaji: "do-yōbi",
    wholeText: "どようび、土曜日 – Saturday (do-yōbi)",
  },
  {
    hiragana: "たいよう",
    romaji: "taiyō",
    wholeText: "たいよう、太陽 – sun (taiyō)",
  },
  {
    hiragana: "つき",
    romaji: "tsuki",
    wholeText: "つき、月 – moon (tsuki)",
  },
  {
    hiragana: "ほし",
    romaji: "hoshi",
    wholeText: "ほし、星 – star (hoshi)",
  },
  {
    hiragana: "てんき",
    romaji: "tenki",
    wholeText: "てんき、天気 – weather (tenki)",
  },
  {
    hiragana: "はれ",
    romaji: "hare",
    wholeText: "はれ、晴れ – clear weather (hare)",
  },
  {
    hiragana: "あめ",
    romaji: "ame",
    wholeText: "あめ、雨 – rain (ame)",
  },
  {
    hiragana: "くもり",
    romaji: "kumori",
    wholeText: "くもり、曇り – cloudy (kumori)",
  },
  {
    hiragana: "ゆき",
    romaji: "yuki",
    wholeText: "ゆき、雪 – snow (yuki)",
  },
  {
    hiragana: "かぜ",
    romaji: "kaze",
    wholeText: "かぜ、風 – wind (kaze)",
  },
  {
    hiragana: "かみなり",
    romaji: "kaminari",
    wholeText: "かみなり、雷 – thunder, lightning (kaminari)",
  },
  {
    hiragana: "たいふう",
    romaji: "taifū",
    wholeText: "たいふう、台風 – typhoon (taifū)",
  },
  {
    hiragana: "あらし",
    romaji: "arashi",
    wholeText: "あらし、嵐 – storm (arashi)",
  },
  {
    hiragana: "そら",
    romaji: "sora",
    wholeText: "そら、空 – sky (sora)",
  },
  {
    hiragana: "きた",
    romaji: "kita",
    wholeText: "きた、北 – north (kita)",
  },
  {
    hiragana: "ひがし",
    romaji: "higashi",
    wholeText: "ひがし、東 – east (higashi)",
  },
  {
    hiragana: "みなみ",
    romaji: "minami",
    wholeText: "みなみ、南 – south (minami)",
  },
  {
    hiragana: "にし",
    romaji: "nishi",
    wholeText: "にし、西 – west (nishi)",
  },
  {
    hiragana: "ここ",
    romaji: "koko",
    wholeText: "ここ – here (koko)",
  },
  {
    hiragana: "そこ",
    romaji: "soko",
    wholeText: "そこ – there (soko)",
  },
  {
    hiragana: "あそこ",
    romaji: "asoko",
    wholeText: "あそこ – over there (asoko)",
  },
  {
    hiragana: "みぎ",
    romaji: "migi",
    wholeText: "みぎ、右 – right (migi)",
  },
  {
    hiragana: "ひだり",
    romaji: "hidari",
    wholeText: "ひだり、左 – left (hidari)",
  },
  {
    hiragana: "うえ",
    romaji: "ue",
    wholeText: "うえ、上 – above, up (ue)",
  },
  {
    hiragana: "した",
    romaji: "shita",
    wholeText: "した、下 – below, down (shita)",
  },
  {
    hiragana: "まえ",
    romaji: "mae",
    wholeText: "まえ、前 – front (mae)",
  },
  {
    hiragana: "うしろ",
    romaji: "ushiro",
    wholeText: "うしろ、後 – behind (ushiro)",
  },
  {
    hiragana: "むこう",
    romaji: "mukō",
    wholeText: "むこう、向こう – the other side, opposite side (mukō)",
  },
  {
    hiragana: "ななめ",
    romaji: "naname",
    wholeText: "ななめ、斜め – diagonal (naname)",
  },
  {
    hiragana: "てまえ",
    romaji: "temae",
    wholeText: "てまえ、手前 – nearer, more in front (temae)",
  },
  {
    hiragana: "とおい",
    romaji: "tooi",
    wholeText: "とおい、遠い – far (tooi)",
  },
  {
    hiragana: "ちかい",
    romaji: "chikai",
    wholeText: "ちかい、近い – near, close (chikai)",
  },
  {
    hiragana: "みず",
    romaji: "mizu",
    wholeText: "みず、水 – water (mizu)",
  },
  {
    hiragana: "ゆ",
    romaji: "yu",
    wholeText: "ゆ、湯 – hot water (yu)",
  },
  {
    hiragana: "こおり",
    romaji: "kōri",
    wholeText: "こおり、氷 – ice (kōri)",
  },
  {
    hiragana: "ゆげ",
    romaji: "yuge",
    wholeText: "ゆげ、湯気 – steam (yuge)",
  },
  {
    hiragana: "ひ",
    romaji: "hi",
    wholeText: "ひ、火 – fire (hi)",
  },
  {
    hiragana: "ガス",
    romaji: "gasu",
    wholeText: "ガス – gas (gasu)",
  },
  {
    hiragana: "くうき",
    romaji: "kūki",
    wholeText: "くうき、空気 – air, atmosphere (kūki)",
  },
  {
    hiragana: "つち",
    romaji: "tsuchi",
    wholeText: "つち、土 – earth, ground (tsuchi)",
  },
  {
    hiragana: "きんぞく",
    romaji: "kinzoku",
    wholeText: "きんぞく、金属 – metal, metallic (kinzoku)",
  },
  {
    hiragana: "どろ",
    romaji: "doro",
    wholeText: "どろ、泥 – mud, mire, clay, plaster (doro)",
  },
  {
    hiragana: "けむり",
    romaji: "kemuri",
    wholeText: "けむり、煙 – smoke, tobacco, opium (kemuri)",
  },
  {
    hiragana: "てつ",
    romaji: "tetsu",
    wholeText: "てつ、鉄 – iron [Fe] (tetsu)",
  },
  {
    hiragana: "どう",
    romaji: "dō",
    wholeText: "どう、銅 – copper [Cu] (dō)",
  },
  {
    hiragana: "きん",
    romaji: "kin",
    wholeText: "きん、金 – gold [Au]; money (kin)",
  },
  {
    hiragana: "ぎん",
    romaji: "gin",
    wholeText: "ぎん、銀 – silver [Ag]; wealth (gin)",
  },
  {
    hiragana: "なまり",
    romaji: "namari",
    wholeText: "なまり、鉛 – lead [Pb] (namari)",
  },
  {
    hiragana: "しお",
    romaji: "shio",
    wholeText: "しお、塩 – salt [NaCl] (shio)",
  },
  {
    hiragana: "メートル",
    romaji: "mētoru",
    wholeText: "メートル – meter (mētoru)",
  },
  {
    hiragana: "リットル",
    romaji: "rittoru",
    wholeText: "リットル – litre (rittoru)",
  },
  {
    hiragana: "グラム",
    romaji: "guramu",
    wholeText: "グラム – gram (guramu)",
  },
  {
    hiragana: "キロ",
    romaji: "kiro",
    wholeText: "キロ – kilo- (kiro)",
  },
  {
    hiragana: "ミリ",
    romaji: "miri",
    wholeText: "ミリ – milli- (miri)",
  },
  {
    hiragana: "センチメートル",
    romaji: "senchi",
    wholeText: "センチメートル、センチ – centimeter (senchi)",
  },
  {
    hiragana: "インチ",
    romaji: "inchi",
    wholeText: "インチ – inch (inchi)",
  },
  {
    hiragana: "しゃかい",
    romaji: "shakai",
    wholeText: "しゃかい、社会 – society (shakai)",
  },
  {
    hiragana: "けいざい",
    romaji: "keizai",
    wholeText: "けいざい、経済 – economy, economics (keizai)",
  },
  {
    hiragana: "かいしゃ",
    romaji: "kaisha",
    wholeText: "かいしゃ、会社 – company (kaisha)",
  },
  {
    hiragana: "かいぎ",
    romaji: "kaigi",
    wholeText: "かいぎ、会議 – meeting (kaigi)",
  },
  {
    hiragana: "がっこう",
    romaji: "gakkō",
    wholeText: "がっこう、学校 – school (gakkō)",
  },
  {
    hiragana: "やくしょ",
    romaji: "yakusho",
    wholeText: "やくしょ、役所 – local government office (yakusho)",
  },
  {
    hiragana: "みせ",
    romaji: "mise",
    wholeText: "みせ、店 – store (mise)",
  },
  {
    hiragana: "ホテル",
    romaji: "hoteru",
    wholeText: "ホテル – hotel (hoteru)",
  },
  {
    hiragana: "こうじょう",
    romaji: "kōjō",
    wholeText: "こうじょう、工場 – factory (kōjō)",
  },
  {
    hiragana: "かね",
    romaji: "kane",
    wholeText: "かね、金 – money (kane, most commonly o-kane)",
  },
  {
    hiragana: "さつ",
    romaji: "satsu",
    wholeText: "さつ、札 – bill [of money, e.g., a thousand-yen bill] (satsu)",
  },
  {
    hiragana: "こぜに",
    romaji: "kozeni",
    wholeText: "こぜに、小銭 – small change (kozeni)",
  },
  {
    hiragana: "つりせん",
    romaji: "tsurisen",
    wholeText:
      "つりせん、釣り銭、おつり、お釣り – change (tsurisen), change (o-tsuri)",
  },
  {
    hiragana: "じどうはんばいき",
    romaji: "jidōhanbaiki",
    wholeText:
      "じどうはんばいき、自動販売機 – vending machine, slot machine (jidōhanbaiki)",
  },
  {
    hiragana: "きっぷ",
    romaji: "public transport, fine",
    wholeText: "きっぷ、切符 – ticket (public transport, fine) (kippu)",
  },
  {
    hiragana: "きって",
    romaji: "kitte",
    wholeText: "きって、切手 – stamp (kitte)",
  },
  {
    hiragana: "つくえ",
    romaji: "tsukue",
    wholeText: "つくえ、机 – desk (tsukue)",
  },
  {
    hiragana: "いす",
    romaji: "isu",
    wholeText: "いす、椅子 – chair, position (isu)",
  },
  {
    hiragana: "たたみ",
    romaji: "tatami",
    wholeText: "たたみ、畳 – a tatami mat (tatami)",
  },
  {
    hiragana: "と",
    romaji: "to",
    wholeText: "と、戸 – door, family (to)",
  },
  {
    hiragana: "とびら",
    romaji: "tobira",
    wholeText: "とびら、扉 – door panel (tobira)",
  },
  {
    hiragana: "ドア",
    romaji: "doa",
    wholeText: "ドア – door (doa)",
  },
  {
    hiragana: "まど",
    romaji: "mado",
    wholeText: "まど、窓 – window (mado)",
  },
  {
    hiragana: "ふとん",
    romaji: "futon",
    wholeText: "ふとん、布団 – futon (futon)",
  },
  {
    hiragana: "げんかん",
    romaji: "genkan",
    wholeText: "げんかん、玄関 – entrance (genkan)",
  },
  {
    hiragana: "いえ",
    romaji: "ie",
    wholeText: "いえ、家 – house, home (ie)",
  },
  {
    hiragana: "エレベーター",
    romaji: "erebētā",
    wholeText: "エレベーター – elevator (erebētā)",
  },
  {
    hiragana: "エスカレーター",
    romaji: "esukarētā",
    wholeText: "エスカレーター – escalator (esukarētā)",
  },
  {
    hiragana: "でんき",
    romaji: "denki",
    wholeText: "でんき、電気 – electricity (denki)",
  },
  {
    hiragana: "くぎ",
    romaji: "kugi",
    wholeText: "くぎ、釘 – nail, spike (kugi)",
  },
  {
    hiragana: "ひも",
    romaji: "himo",
    wholeText: "ひも、紐 – string, cord (himo)",
  },
  {
    hiragana: "なわ",
    romaji: "nawa",
    wholeText: "なわ、縄 – rope, string (nawa)",
  },
  {
    hiragana: "ふくろ",
    romaji: "fukuro",
    wholeText: "ふくろ、袋 – pocket, bag (fukuro)",
  },
  {
    hiragana: "かばん",
    romaji: "kaban",
    wholeText: "かばん、鞄 – leather bag (kaban)",
  },
  {
    hiragana: "かさ",
    romaji: "kasa",
    wholeText: "かさ、傘 – umbrella, parasol (kasa)",
  },
  {
    hiragana: "かぎ",
    romaji: "kagi",
    wholeText: "かぎ、鍵 – door bolt, key (kagi)",
  },
  {
    hiragana: "ちょうこく",
    romaji: "chōkoku",
    wholeText: "ちょうこく、彫刻 – sculpture, engraving (chōkoku)",
  },
  {
    hiragana: "ぶんぼうぐ",
    romaji: "bunbōgu",
    wholeText: "ぶんぼうぐ、文房具 – stationery ​(bunbōgu)",
  },
  {
    hiragana: "インク",
    romaji: "inku",
    wholeText: "インク – ink (inku)",
  },
  {
    hiragana: "ペン",
    romaji: "pen",
    wholeText: "ペン – pen (pen)",
  },
  {
    hiragana: "ボールペン",
    romaji: "bōrupen",
    wholeText: "ボールペン – ball-point pen (bōrupen)",
  },
  {
    hiragana: "まんねんひつ",
    romaji: "mannenhitsu",
    wholeText: "まんねんひつ、万年筆 – fountain pen (mannenhitsu)",
  },
  {
    hiragana: "えんぴつ",
    romaji: "enpitsu",
    wholeText: "えんぴつ、鉛筆 – pencil (enpitsu)",
  },
  {
    hiragana: "ふで",
    romaji: "fude",
    wholeText: "ふで、筆 – brush for writing or painting (fude)",
  },
  {
    hiragana: "チョーク",
    romaji: "chōku",
    wholeText: "チョーク – chalk (chōku)",
  },
  {
    hiragana: "けしゴム",
    romaji: "keshigomu",
    wholeText: "けしゴム、消しゴム – eraser (keshigomu)",
  },
  {
    hiragana: "えんぴつけずり",
    romaji: "enpitsu-kezuri",
    wholeText: "えんぴつけずり、鉛筆削り – pencil sharpener (enpitsu-kezuri)",
  },
  {
    hiragana: "じょうぎ",
    romaji: "jōgi",
    wholeText: "じょうぎ、定規 – ruler (jōgi)",
  },
  {
    hiragana: "ノート",
    romaji: "nōto",
    wholeText: "ノート – notebook (nōto)",
  },
  {
    hiragana: "にっき",
    romaji: "nikki",
    wholeText: "にっき、日記 – diary (nikki)",
  },
  {
    hiragana: "カバー",
    romaji: "kabā",
    wholeText: "カバー – book cover (kabā)",
  },
  {
    hiragana: "ふうとう",
    romaji: "fūtō",
    wholeText: "ふうとう、封筒 – envelope (fūtō)",
  },
  {
    hiragana: "はさみ",
    romaji: "hasami",
    wholeText: "はさみ、鋏 – scissors (hasami)",
  },
  {
    hiragana: "ホッチキス",
    romaji: "hotchikisu",
    wholeText: "ホッチキス – stapler (hotchikisu)",
  },
  {
    hiragana: "ふく",
    romaji: "fuku",
    wholeText: "ふく、服 – clothes (fuku)",
  },
  {
    hiragana: "ようふく",
    romaji: "yōfuku",
    wholeText: "ようふく、洋服 – western clothing (yōfuku)",
  },
  {
    hiragana: "きもの",
    romaji: "kimono",
    wholeText: "きもの、着物 – kimono (kimono)",
  },
  {
    hiragana: "わふく",
    romaji: "wafuku",
    wholeText: "わふく、和服 – Japanese clothing (wafuku)",
  },
  {
    hiragana: "そで",
    romaji: "sode",
    wholeText: "そで、袖 – sleeve (sode)",
  },
  {
    hiragana: "えり",
    romaji: "eri",
    wholeText: "えり、襟 – lapel, collar (eri)",
  },
  {
    hiragana: "ボタン",
    romaji: "botan",
    wholeText: "ボタン – button (botan)",
  },
  {
    hiragana: "チャック",
    romaji: "chakku, fasunā, jippā",
    wholeText:
      "チャック、ファスナー、ジッパー – zipper, zipper fastener (chakku, fasunā, jippā)",
  },
  {
    hiragana: "ベルト",
    romaji: "beruto",
    wholeText: "ベルト – belt (beruto)",
  },
  {
    hiragana: "くつ",
    romaji: "kutsu",
    wholeText: "くつ、靴 – shoe (kutsu)",
  },
  {
    hiragana: "くつした",
    romaji: "kutsushita",
    wholeText: "くつした、靴下 – sock (kutsushita)",
  },
  {
    hiragana: "めがね",
    romaji: "megane",
    wholeText: "めがね、眼鏡 – glasses (megane)",
  },
  {
    hiragana: "てつどう",
    romaji: "tetsudō",
    wholeText: "てつどう、鉄道 – railway (tetsudō)",
  },
  {
    hiragana: "えき",
    romaji: "eki",
    wholeText: "えき、駅 – station (eki)",
  },
  {
    hiragana: "ひこうき",
    romaji: "hikōki",
    wholeText: "ひこうき、飛行機 – airplane (hikōki)",
  },
  {
    hiragana: "くうこう",
    romaji: "kūkō",
    wholeText:
      "くうこう、空港 （ひこうじょう、飛行場） – airport (kūkō, hikōjō)",
  },
  {
    hiragana: "みち",
    romaji: "michi",
    wholeText: "みち、道 – street, way, road (michi)",
  },
  {
    hiragana: "どうろ",
    romaji: "dōro",
    wholeText: "どうろ、道路 – road (dōro)",
  },
  {
    hiragana: "バスてい",
    romaji: "basutei",
    wholeText: "バスてい、バス停 – bus-stop (basutei)",
  },
  {
    hiragana: "とおり",
    romaji: "tōri",
    wholeText: "とおり、通り – avenue (tōri)",
  },
  {
    hiragana: "でんしゃ",
    romaji: "densha",
    wholeText: "でんしゃ、電車 – train (densha)",
  },
  {
    hiragana: "くるま",
    romaji: "kuruma",
    wholeText: "くるま、車 (じどうしゃ、自動車) – car (kuruma, jidōsha)",
  },
  {
    hiragana: "じてんしゃ",
    romaji: "Jitensha",
    wholeText: "じてんしゃ、自転車 –　bicycle (Jitensha)",
  },
  {
    hiragana: "もじ",
    romaji: "moji",
    wholeText: "もじ、文字 – letter, character, script (moji)",
  },
  {
    hiragana: "じ",
    romaji: "ji",
    wholeText: "じ、字 – a letter, character (ji)",
  },
  {
    hiragana: "かんじ",
    romaji: "kanji",
    wholeText: "かんじ、漢字 – Chinese character (kanji)",
  },
  {
    hiragana: "ひらがな",
    romaji: "hiragana",
    wholeText: "ひらがな、平仮名 – hiragana syllabary characters (hiragana)",
  },
  {
    hiragana: "カタカナ",
    romaji: "katakana",
    wholeText: "カタカナ、片仮名 – katakana syllabary characters (katakana)",
  },
  {
    hiragana: "すうじ",
    romaji: "sūji",
    wholeText: "すうじ、数字 – numbers (sūji)",
  },
  {
    hiragana: "アルファベット",
    romaji: "arufabetto",
    wholeText: "アルファベット – alphabet (arufabetto)",
  },
  {
    hiragana: "ローマ字",
    romaji: "rōmaji",
    wholeText: "ローマ字 – Roman characters, Latin script (rōmaji)",
  },
  {
    hiragana: "がいこくご",
    romaji: "gaikokugo",
    wholeText: "がいこくご、外国語 – foreign language (gaikokugo)",
  },
  {
    hiragana: "にほんご",
    romaji: "nihongo",
    wholeText:
      "にほんご、日本語 （こくご、国語） – Japanese [language] (nihongo)",
  },
  {
    hiragana: "えいご",
    romaji: "eigo",
    wholeText: "えいご、英語 – English [language] (eigo)",
  },
  {
    hiragana: "ちゅうごくご",
    romaji: "chūgokugo",
    wholeText: "ちゅうごくご、中国語 – Chinese [language] (chūgokugo)",
  },
  {
    hiragana: "どいつご",
    romaji: "doitsugo",
    wholeText: "どいつご、ドイツ語 – German [language] (doitsugo)",
  },
  {
    hiragana: "すぺいんご",
    romaji: "supeingo",
    wholeText: "すぺいんご、スペイン語 – Spanish [language] (supeingo)",
  },
  {
    hiragana: "ふらんすご",
    romaji: "furansugo",
    wholeText: "ふらんすご、フランス語 – French [language] (furansugo)",
  },
  {
    hiragana: "ちょうせんご",
    romaji: "chōsengo",
    wholeText:
      "ちょうせんご、朝鮮語、かんこくご、韓国語 – Korean [language], South Korean [language] (chōsengo, kankokugo)",
  },
  {
    hiragana: "ほん",
    romaji: "hon",
    wholeText: "ほん、本 – book (hon)",
  },
  {
    hiragana: "かみ",
    romaji: "kami",
    wholeText: "かみ、紙 – paper (kami)",
  },
  {
    hiragana: "てがみ",
    romaji: "tegami",
    wholeText: "てがみ、手紙 – letter (tegami)",
  },
  {
    hiragana: "しんぶん",
    romaji: "shinbun",
    wholeText: "しんぶん、新聞 – newspaper (shinbun)",
  },
  {
    hiragana: "じしょ",
    romaji: "jisho",
    wholeText: "じしょ、辞書 – dictionary (jisho)",
  },
  {
    hiragana: "パソコン",
    romaji: "pasokon",
    wholeText: "パソコン – personal computer (pasokon)",
  },
  {
    hiragana: "いろ",
    romaji: "iro",
    wholeText: "いろ、色 – color (iro, shikisai)",
  },
  {
    hiragana: "あか",
    romaji: "aka",
    wholeText: "あか、赤 – red (aka)",
  },
  {
    hiragana: "きいろ",
    romaji: "kiiro",
    wholeText: "きいろ、黄色 – yellow (kiiro)",
  },
  {
    hiragana: "みどり",
    romaji: "midori",
    wholeText: "みどり、緑 – green (midori)",
  },
  {
    hiragana: "あお",
    romaji: "ao",
    wholeText: "あお、青 – blue (ao)",
  },
  {
    hiragana: "むらさき",
    romaji: "murasaki",
    wholeText: "むらさき、紫 – purple (murasaki, murasakiiro)",
  },
  {
    hiragana: "しろ",
    romaji: "shiro",
    wholeText: "しろ、白 – white (shiro)",
  },
  {
    hiragana: "くろ",
    romaji: "kuro",
    wholeText: "くろ、黒 – black (kuro)",
  },
  {
    hiragana: "ピンク",
    romaji: "pinku",
    wholeText: "ピンク – pink (pinku)",
  },
  {
    hiragana: "ちゃいろ",
    romaji: "chairo",
    wholeText: "ちゃいろ、茶色 – brown (chairo)",
  },
  {
    hiragana: "はいいろ",
    romaji: "haiiro",
    wholeText: "はいいろ、灰色、ねずみいろ、鼠色 – grey (haiiro, nezumiiro)",
  },
  {
    hiragana: "オレンジ",
    romaji: "orenji",
    wholeText: "オレンジ – orange (orenji)",
  },
  {
    hiragana: "え",
    romaji: "e",
    wholeText: "え、絵 – picture (e)",
  },
  {
    hiragana: "おんがく",
    romaji: "ongaku",
    wholeText: "おんがく、音楽 – music (ongaku)",
  },
  {
    hiragana: "りか",
    romaji: "rika",
    wholeText: "りか、理科 – science (rika)",
  },
  {
    hiragana: "さんすう",
    romaji: "sansū",
    wholeText: "さんすう、算数 – arithmetic (sansū)",
  },
  {
    hiragana: "れきし",
    romaji: "rekishi",
    wholeText: "れきし、歴史 – history (rekishi)",
  },
  {
    hiragana: "ちり",
    romaji: "chiri",
    wholeText: "ちり、地理 – geography (chiri)",
  },
  {
    hiragana: "たいいく",
    romaji: "taiiku",
    wholeText: "たいいく、体育 – physical education (taiiku)",
  },
  {
    hiragana: "スポーツ",
    romaji: "supōtsu",
    wholeText: "スポーツ – sport (supōtsu)",
  },
  {
    hiragana: "システム",
    romaji: "shisutemu",
    wholeText: "システム – system (shisutemu)",
  },
  {
    hiragana: "じょうほう",
    romaji: "jōhō",
    wholeText: "じょうほう、情報 – information, news (jōhō)",
  },
  {
    hiragana: "ひつよう",
    romaji: "hitsuyō",
    wholeText: "ひつよう、必要 – necessity (hitsuyō)",
  },
  {
    hiragana: "べんきょう",
    romaji: "benkyō",
    wholeText: "べんきょう、勉強 – study (benkyō)",
  },
  {
    hiragana: "いらい",
    romaji: "irai",
    wholeText: "いらい、依頼 – request (irai)",
  },
  {
    hiragana: "れい",
    romaji: "rei, zero",
    wholeText: "れい、ゼロ、零 – zero (rei, zero)",
  },
  {
    hiragana: "いち",
    romaji: "ichi",
    wholeText: "いち、一 – one (ichi)",
  },
  {
    hiragana: "に",
    romaji: "ni",
    wholeText: "に、二 – two (ni)",
  },
  {
    hiragana: "さん",
    romaji: "san",
    wholeText: "さん、三 – three (san)",
  },
  {
    hiragana: "よん",
    romaji: "yon",
    wholeText: "よん、し、四 – four (yon, shi)",
  },
  {
    hiragana: "ご",
    romaji: "go",
    wholeText: "ご、五 – five (go)",
  },
  {
    hiragana: "ろく",
    romaji: "roku",
    wholeText: "ろく、六 – six (roku)",
  },
  {
    hiragana: "なな",
    romaji: "nana",
    wholeText: "なな、しち、七 – seven (nana, shichi)",
  },
  {
    hiragana: "はち",
    romaji: "hachi",
    wholeText: "はち、八 – eight (hachi)",
  },
  {
    hiragana: "きゅう",
    romaji: "kyū",
    wholeText: "きゅう、く、九 – nine (kyū, ku)",
  },
  {
    hiragana: "じゅう",
    romaji: "jū",
    wholeText: "じゅう、十 – ten (jū)",
  },
  {
    hiragana: "ひゃく",
    romaji: "hyaku",
    wholeText: "ひゃく、百 – hundred (hyaku)",
  },
  {
    hiragana: "せん",
    romaji: "sen",
    wholeText: "せん、千 – thousand (sen)",
  },
  {
    hiragana: "まん",
    romaji: "man",
    wholeText: "まん、万 – ten thousand (man)",
  },
  {
    hiragana: "おく",
    romaji: "oku",
    wholeText: "おく、億 – one hundred million (oku)",
  },
  {
    hiragana: "ひとつ",
    romaji: "hitotsu",
    wholeText: "ひとつ、一つ – one, one thing (hitotsu)",
  },
  {
    hiragana: "ふたつ",
    romaji: "futatsu",
    wholeText: "ふたつ、二つ – two, two things (futatsu)",
  },
  {
    hiragana: "みっつ",
    romaji: "mittsu",
    wholeText: "みっつ、三つ – three, three things (mittsu)",
  },
  {
    hiragana: "よっつ",
    romaji: "yottsu",
    wholeText: "よっつ、四つ – four, four things (yottsu)",
  },
  {
    hiragana: "いつつ",
    romaji: "itsutsu",
    wholeText: "いつつ、五つ – five, five things (itsutsu)",
  },
  {
    hiragana: "むっつ",
    romaji: "muttsu",
    wholeText: "むっつ、六つ – six, six things (muttsu)",
  },
  {
    hiragana: "ななつ",
    romaji: "nanatsu",
    wholeText: "ななつ、七つ – seven, seven things (nanatsu)",
  },
  {
    hiragana: "やっつ",
    romaji: "yattsu",
    wholeText: "やっつ、八つ – eight, eight things (yattsu)",
  },
  {
    hiragana: "ここのつ",
    romaji: "kokonotsu",
    wholeText: "ここのつ、九つ – nine, nine things (kokonotsu)",
  },
  {
    hiragana: "とお",
    romaji: "tō",
    wholeText: "とお、十 – ten, ten things (tō)",
  },
  {
    hiragana: "これ",
    romaji: "kore",
    wholeText: "これ – this, it (kore)",
  },
  {
    hiragana: "それ",
    romaji: "sore",
    wholeText: "それ – that (sore)",
  },
  {
    hiragana: "あれ",
    romaji: "are",
    wholeText: "あれ – that over there (are)",
  },
  {
    hiragana: "どれ",
    romaji: "dore",
    wholeText: "どれ – which (dore)",
  },
  {
    hiragana: "こちら",
    romaji: "kochira",
    wholeText:
      "こちら、こっち – this direction, thing, person, or place (kochira, kocchi)",
  },
  {
    hiragana: "そちら",
    romaji: "sochira",
    wholeText:
      "そちら、そっち – that direction, thing, person, or place (sochira, socchi)",
  },
  {
    hiragana: "あちら",
    romaji: "achira",
    wholeText:
      "あちら、あっち – that direction, thing, person, or place over there (achira, acchi)",
  },
  {
    hiragana: "どちら",
    romaji: "dochira",
    wholeText:
      "どちら、どっち – which direction, thing, person, or place (dochira, docchi)",
  },
  {
    hiragana: "ひみつ",
    romaji: "himitsu",
    wholeText: "ひみつ、秘密 – secret (himitsu)",
  },
  {
    hiragana: "じどう",
    romaji: "jidō",
    wholeText: "じどう、自動 – automatic (jidō)",
  },
  {
    hiragana: "ないよう",
    romaji: "naiyō",
    wholeText: "ないよう、内容 – content (naiyō)",
  },
  {
    hiragana: "はば",
    romaji: "haba",
    wholeText:
      "はば、幅 – width, breadth, free room, difference (between two substances) (haba)",
  },
  {
    hiragana: "せいしき",
    romaji: "seishiki",
    wholeText: "せいしき、正式 – formality (seishiki)",
  },
  {
    hiragana: "けっこん",
    romaji: "kekkon",
    wholeText: "けっこん、結婚 – marriage (kekkon)",
  },
  {
    hiragana: "げんざい",
    romaji: "genzai",
    wholeText: "げんざい、現在 – now (genzai)",
  },
  {
    hiragana: "いま",
    romaji: "ima",
    wholeText: "いま、今 – now (ima)",
  },
  {
    hiragana: "かこ",
    romaji: "kako",
    wholeText: "かこ、過去 – past (kako)",
  },
  {
    hiragana: "みらい",
    romaji: "mirai",
    wholeText: "みらい、未来 – future (mirai)",
  },
  {
    hiragana: "いい",
    romaji: "ii",
    wholeText: "いい、よい、良い – good (ii, yoi)",
  },
  {
    hiragana: "すごい",
    romaji: "sugoi",
    wholeText: "すごい、凄い – amazing (sugoi)",
  },
  {
    hiragana: "すばらしい",
    romaji: "subarashii",
    wholeText: "すばらしい、素晴らしい – wonderful (subarashii)",
  },
  {
    hiragana: "わるい",
    romaji: "warui",
    wholeText: "わるい、悪い – bad, inferior (warui)",
  },
  {
    hiragana: "たかい",
    romaji: "takai",
    wholeText: "たかい、高い – expensive, high (takai)",
  },
  {
    hiragana: "ひくい",
    romaji: "hikui",
    wholeText: "ひくい、低い – low (hikui)",
  },
  {
    hiragana: "やすい",
    romaji: "yasui",
    wholeText: "やすい、安い – cheap (yasui)",
  },
  {
    hiragana: "おおきい",
    romaji: "ōkii",
    wholeText: "おおきい、大きい – big (ōkii)",
  },
  {
    hiragana: "ちいさい",
    romaji: "chiisai",
    wholeText: "ちいさい、小さい – small (chiisai)",
  },
  {
    hiragana: "ほそい",
    romaji: "hosoi",
    wholeText: "ほそい、細い – thin (hosoi)",
  },
  {
    hiragana: "ふとい",
    romaji: "futoi",
    wholeText: "ふとい、太い – thick (futoi)",
  },
  {
    hiragana: "ふるい",
    romaji: "furui",
    wholeText: "ふるい、古い – old (furui)",
  },
  {
    hiragana: "あたらしい",
    romaji: "atarashii",
    wholeText: "あたらしい、新しい – new (atarashii)",
  },
  {
    hiragana: "わかい",
    romaji: "wakai",
    wholeText: "わかい、若い – young (wakai)",
  },
  {
    hiragana: "かるい",
    romaji: "karui",
    wholeText: "かるい、軽い – light, easy (karui)",
  },
  {
    hiragana: "おもい",
    romaji: "omoi",
    wholeText: "おもい、重い – heavy (omoi)",
  },
  {
    hiragana: "やさしい",
    romaji: "yasashii",
    wholeText: "やさしい、易しい – easy, simple (yasashii)",
  },
  {
    hiragana: "むずかしい",
    romaji: "muzukashii",
    wholeText: "むずかしい、難しい – difficult (muzukashii)",
  },
  {
    hiragana: "やわらかい",
    romaji: "yawarakai",
    wholeText: "やわらかい、柔らかい – soft (yawarakai)",
  },
  {
    hiragana: "かたい",
    romaji: "katai",
    wholeText: "かたい、硬い、堅い – hard (katai)",
  },
  {
    hiragana: "あつい",
    romaji: "atsui",
    wholeText: "あつい、熱い、暑い – hot (atsui)",
  },
  {
    hiragana: "つめたい",
    romaji: "tsumetai",
    wholeText: "つめたい、冷たい – cold (tsumetai)",
  },
  {
    hiragana: "さむい",
    romaji: "samui",
    wholeText: "さむい、寒い – cold (samui) as in cold weather",
  },
  {
    hiragana: "おいしい",
    romaji: "oishii",
    wholeText: "おいしい、美味しい – delicious (oishii)",
  },
  {
    hiragana: "うまい",
    romaji: "umai",
    wholeText: "うまい、美味い、旨い – delicious, appetizing (umai)",
  },
  {
    hiragana: "まずい",
    romaji: "mazui",
    wholeText: "まずい、不味い – tastes awful (mazui)",
  },
  {
    hiragana: "あまい",
    romaji: "amai",
    wholeText: "あまい、甘い – sweet (amai)",
  },
  {
    hiragana: "からい",
    romaji: "karai",
    wholeText: "からい、辛い – hot [spicy] (karai)",
  },
  {
    hiragana: "しょっぱい",
    romaji: "shoppai",
    wholeText: "しょっぱい、塩っぱい – salty (shoppai)",
  },
  {
    hiragana: "にがい",
    romaji: "nigai",
    wholeText: "にがい、苦い – bitter (nigai)",
  },
  {
    hiragana: "うつくしい",
    romaji: "utsukushii",
    wholeText: "うつくしい、美しい – beautiful (utsukushii)",
  },
  {
    hiragana: "うれしい",
    romaji: "ureshii",
    wholeText: "うれしい、嬉しい – happy (ureshii)",
  },
  {
    hiragana: "たのしい",
    romaji: "tanoshii",
    wholeText: "たのしい、楽しい – fun (tanoshii)",
  },
  {
    hiragana: "かなしい",
    romaji: "kanashii",
    wholeText: "かなしい、悲しい – sad (kanashii)",
  },
  {
    hiragana: "さびしい",
    romaji: "sabishii",
    wholeText: "さびしい、寂しい、淋しい – lonely (sabishii)",
  },
  {
    hiragana: "さみしい",
    romaji: "samishii",
    wholeText: "さみしい、寂しい、淋しい - sad, lonely (samishii)",
  },
  {
    hiragana: "こわい",
    romaji: "kowai",
    wholeText: "こわい、怖い、恐い – scary (kowai)",
  },
  {
    hiragana: "いたい",
    romaji: "itai",
    wholeText: "いたい、痛い – painful (itai)",
  },
  {
    hiragana: "かゆい",
    romaji: "kayui",
    wholeText: "かゆい、痒い – itchy (kayui)",
  },
  {
    hiragana: "くさい",
    romaji: "kusai",
    wholeText: "くさい、臭い – stinky (kusai)",
  },
  {
    hiragana: "つらい",
    romaji: "tsurai",
    wholeText: "つらい、辛い – painful, heart-breaking (tsurai)",
  },
  {
    hiragana: "する",
    romaji: "suru",
    wholeText: "する – to do (suru)",
  },
  {
    hiragana: "やる",
    romaji: "yaru",
    wholeText: "やる – to do (yaru)",
  },
  {
    hiragana: "いる",
    romaji: "iru",
    wholeText: "いる – to exist [for animate objects] (iru)",
  },
  {
    hiragana: "ある",
    romaji: "aru",
    wholeText: "ある – to exist [for inanimate objects] (aru)",
  },
  {
    hiragana: "なる",
    romaji: "naru",
    wholeText: "なる – to become (naru)",
  },
  {
    hiragana: "おこる",
    romaji: "okoru",
    wholeText: "おこる、起こる、興る – to occur (okoru)",
  },
  {
    hiragana: "あらわれる",
    romaji: "arawareru",
    wholeText: "あらわれる、現れる – to appear (arawareru)",
  },
  {
    hiragana: "いきる",
    romaji: "ikiru",
    wholeText: "いきる、生きる – to live (ikiru)",
  },
  {
    hiragana: "うむ",
    romaji: "umu",
    wholeText: "うむ、生む、産む – to give birth (umu)",
  },
  {
    hiragana: "しぬ",
    romaji: "shinu",
    wholeText: "しぬ、死ぬ – to die (shinu)",
  },
  {
    hiragana: "こわれる",
    romaji: "kowareru",
    wholeText: "こわれる、壊れる – to breakin (kowareru)",
  },
  {
    hiragana: "いく",
    romaji: "iku",
    wholeText: "いく、行く – to go (iku)",
  },
  {
    hiragana: "くる",
    romaji: "kuru",
    wholeText: "くる、来る – to come (kuru)",
  },
  {
    hiragana: "かえる",
    romaji: "kaeru",
    wholeText: "かえる、帰る、返る – to return (kaeru)",
  },
  {
    hiragana: "あるく",
    romaji: "aruku",
    wholeText: "あるく、歩く – to walk (aruku)",
  },
  {
    hiragana: "とぶ",
    romaji: "tobu",
    wholeText: "とぶ、飛ぶ – to jump, to fly (tobu)",
  },
  {
    hiragana: "およぐ",
    romaji: "oyogu",
    wholeText: "およぐ、泳ぐ – to swim (oyogu)",
  },
  {
    hiragana: "うごく",
    romaji: "ugoku",
    wholeText: "うごく、動く – to movein (ugoku)",
  },
  {
    hiragana: "おどる",
    romaji: "odoru",
    wholeText: "おどる、踊る – to dance (odoru)",
  },
  {
    hiragana: "ねる",
    romaji: "neru",
    wholeText: "ねる、寝る – to sleep (neru)",
  },
  {
    hiragana: "うたう",
    romaji: "utau",
    wholeText: "うたう、歌う – to sing (utau)",
  },
  {
    hiragana: "かむ",
    romaji: "kamu",
    wholeText: "かむ、噛む – to bite (kamu)",
  },
  {
    hiragana: "たべる",
    romaji: "taberu",
    wholeText: "たべる、食べる – to eat (taberu)",
  },
  {
    hiragana: "のむ",
    romaji: "nomu",
    wholeText: "のむ、飲む – to drink (nomu)",
  },
  {
    hiragana: "さわる",
    romaji: "sawaru",
    wholeText: "さわる、触る – to touch (sawaru)",
  },
  {
    hiragana: "なげる",
    romaji: "nageru",
    wholeText: "なげる、投げる – to throw (nageru)",
  },
  {
    hiragana: "もつ",
    romaji: "motsu",
    wholeText: "もつ、持つ – to hold (motsu)",
  },
  {
    hiragana: "うつ",
    romaji: "utsu",
    wholeText: "うつ、打つ – to hit, to strike (utsu)",
  },
  {
    hiragana: "なぐる",
    romaji: "naguru",
    wholeText: "なぐる、殴る – to hit, to strike (naguru)",
  },
  {
    hiragana: "さす",
    romaji: "sasu",
    wholeText: "さす、指す – to point (sasu)",
  },
  {
    hiragana: "さす",
    romaji: "sasu",
    wholeText: "さす、刺す – to stab (sasu)",
  },
  {
    hiragana: "さす",
    romaji: "sasu",
    wholeText: "さす、差す – to raise or extend one's hands (sasu)",
  },
  {
    hiragana: "ける",
    romaji: "keru",
    wholeText: "ける、蹴る – to kick (keru)",
  },
  {
    hiragana: "すわる",
    romaji: "suwaru",
    wholeText: "すわる、座る – to sit (suwaru)",
  },
  {
    hiragana: "たつ",
    romaji: "tatsu",
    wholeText: "たつ、立つ – to stand (tatsu)",
  },
  {
    hiragana: "はしる",
    romaji: "hashiru",
    wholeText: "はしる、走る – to run (hashiru)",
  },
  {
    hiragana: "あく",
    romaji: "aku",
    wholeText: "あく、空く – to become unoccupied (aku)",
  },
  {
    hiragana: "こむ",
    romaji: "komu",
    wholeText: "こむ、込む – to be crowded (komu)",
  },
  {
    hiragana: "いる",
    romaji: "iru",
    wholeText: "いる、要る – to need (iru)",
  },
  {
    hiragana: "かわく",
    romaji: "kawaku",
    wholeText: "かわく、乾く – to become dry (kawaku)",
  },
  {
    hiragana: "みだす",
    romaji: "midasu",
    wholeText: "みだす、乱す - to disturb, to disarrange (midasu)",
  },
  {
    hiragana: "みだれる",
    romaji: "midareru",
    wholeText:
      "みだれる、乱れる - to be disturbed, to become confused (midareru)",
  },
  {
    hiragana: "つかえる",
    romaji: "tsukaeru",
    wholeText: "つかえる、仕える - to serve, to work for (tsukaeru)",
  },
  {
    hiragana: "そなわる",
    romaji: "sonawaru",
    wholeText: "そなわる、備わる - to be furnished with (sonawaru)",
  },
  {
    hiragana: "すぐれる",
    romaji: "sugureru",
    wholeText: "すぐれる、優れる - to excel, to surpass (sugureru)",
  },
  {
    hiragana: "ひえる",
    romaji: "hieru",
    wholeText:
      "ひえる、冷える - to grow cold, to get chilly, to cool down (hieru)",
  },
  {
    hiragana: "さめる",
    romaji: "sameru",
    wholeText:
      "さめる、覚める - to wake, to become sober, to be disillusioned (sameru)",
  },
  {
    hiragana: "さめる",
    romaji: "sameru",
    wholeText: "さめる、冷める - to cool down (sameru)",
  },
  {
    hiragana: "むく",
    romaji: "muku",
    wholeText: "むく、向く - to face, to turn toward (muku)",
  },
  {
    hiragana: "たおれる",
    romaji: "taoreru",
    wholeText: "たおれる、倒れる - to fall, to collapse (taoreru)",
  },
  {
    hiragana: "かたまる",
    romaji: "katamaru",
    wholeText:
      "かたまる、固まる - to harden, to solidify, to become firm (katamaru)",
  },
  {
    hiragana: "うまる",
    romaji: "umaru",
    wholeText:
      "うまる、埋まる - to be filled, to be surrounded, to overflow (umaru)",
  },
  {
    hiragana: "うもれる",
    romaji: "umoreru",
    wholeText: "うもれる、埋もれる - to be buried, to be covered (umoreru)",
  },
  {
    hiragana: "ます",
    romaji: "masu",
    wholeText: "ます、増す - to increase, to grow (masu)",
  },
  {
    hiragana: "ふえる",
    romaji: "fueru",
    wholeText: "ふえる、増える - to increase, to multiply (fueru)",
  },
  {
    hiragana: "へる",
    romaji: "heru",
    wholeText: "へる、減る - to decrease (heru)",
  },
  {
    hiragana: "はずれる",
    romaji: "hazureru",
    wholeText: "はずれる、外れる - to deviate (hazureru)",
  },
  {
    hiragana: "ふとる",
    romaji: "futoru",
    wholeText: "ふとる、太る - to grow fat (futoru)",
  },
  {
    hiragana: "はじまる",
    romaji: "hajimaru",
    wholeText: "はじまる、始まる - to begin (hajimaru)",
  },
  {
    hiragana: "おわる",
    romaji: "owaru",
    wholeText: "おわる、終わる - to finish, to close (owaru)",
  },
  {
    hiragana: "きめる",
    romaji: "kimeru",
    wholeText: "きめる、決める - to decide (kimeru)",
  },
  {
    hiragana: "みる",
    romaji: "miru",
    wholeText: "みる、見る – to see (miru)",
  },
  {
    hiragana: "きく",
    romaji: "kiku",
    wholeText: "きく、聞く、聴く – to hear, to listen (kiku)",
  },
  {
    hiragana: "さわる",
    romaji: "sawaru",
    wholeText: "さわる、触る – to touch, to feel (sawaru)",
  },
  {
    hiragana: "かぐ",
    romaji: "kagu",
    wholeText: "かぐ、嗅ぐ – to smell (kagu)",
  },
  {
    hiragana: "いう",
    romaji: "iu",
    wholeText: "いう、言う – to say (iu)",
  },
  {
    hiragana: "はなす",
    romaji: "hanasu",
    wholeText: "はなす、話す – to speak (hanasu)",
  },
  {
    hiragana: "かたる",
    romaji: "kataru",
    wholeText: "かたる、語る – to tell (kataru)",
  },
  {
    hiragana: "かく",
    romaji: "kaku",
    wholeText: "かく、書く – to write (kaku)",
  },
  {
    hiragana: "よむ",
    romaji: "yomu",
    wholeText: "よむ、読む – to read (yomu)",
  },
  {
    hiragana: "つかう",
    romaji: "tsukau",
    wholeText: "つかう、使う – to use (tsukau)",
  },
  {
    hiragana: "つくる",
    romaji: "tsukuru",
    wholeText: "つくる、作る、造る、創る – to make (tsukuru)",
  },
  {
    hiragana: "なおす",
    romaji: "naosu",
    wholeText: "なおす、直す、治す – to fix, repair (naosu)",
  },
  {
    hiragana: "すてる",
    romaji: "suteru",
    wholeText: "すてる、捨てる – to discard, throw away (suteru)",
  },
  {
    hiragana: "とる",
    romaji: "toru",
    wholeText: "とる、取る、撮る、採る – to take (toru)",
  },
  {
    hiragana: "おく",
    romaji: "oku",
    wholeText: "おく、置く – to put (oku)",
  },
  {
    hiragana: "かなしむ",
    romaji: "kanashimu",
    wholeText: "かなしむ、悲しむ、哀しむ – to be sad (kanashimu)",
  },
  {
    hiragana: "なく",
    romaji: "naku",
    wholeText: "なく、泣く – to cry (naku)",
  },
  {
    hiragana: "わらう",
    romaji: "warau",
    wholeText: "わらう、笑う – to laugh (warau)",
  },
  {
    hiragana: "おこる",
    romaji: "okoru",
    wholeText: "おこる、怒る – to be angry (okoru)",
  },
  {
    hiragana: "ほめる",
    romaji: "homeru",
    wholeText: "ほめる、褒める – to encourage (homeru)",
  },
  {
    hiragana: "しかる",
    romaji: "shikaru",
    wholeText: "しかる、叱る – to scold (shikaru)",
  },
  {
    hiragana: "よろこぶ",
    romaji: "yorokobu",
    wholeText:
      "よろこぶ、喜ぶ – to celebrate, to be jubilant, to have joy, to have delight, to have rapture (yorokobu)",
  },
  {
    hiragana: "よろこび",
    romaji: "yorokobi",
    wholeText: "よろこび、喜び – joy, delight, rapture (yorokobi)",
  },
  {
    hiragana: "なぐさめる",
    romaji: "nagusameru",
    wholeText:
      "なぐさめる、慰める – to console, to consolate, to provide empathy (nagusameru)",
  },
  {
    hiragana: "あきる",
    romaji: "akiru",
    wholeText:
      "あきる、飽きる – to be disinterested, to be bored, to be tired of, to be weary (akiru)",
  },
  {
    hiragana: "おどろく",
    romaji: "odoroku",
    wholeText:
      "おどろく、驚く – to be astonished, to be surprised, to be scared (odoroku)",
  },
  {
    hiragana: "あう",
    romaji: "au",
    wholeText: "あう、会う – to meet, to interview (au)",
  },
  {
    hiragana: "あける",
    romaji: "akeru",
    wholeText: "あける、開ける – to opentr, to unwraptr (akeru)",
  },
  {
    hiragana: "あそぶ",
    romaji: "asobu",
    wholeText: "あそぶ、遊ぶ – to play (asobu)",
  },
  {
    hiragana: "あつまる",
    romaji: "atsumaru",
    wholeText: "あつまる、集まる – to gatherin (atsumaru)",
  },
  {
    hiragana: "うる",
    romaji: "uru",
    wholeText: "うる、売る – to sell (uru)",
  },
  {
    hiragana: "える",
    romaji: "eru",
    wholeText: "える、得る – to obtain [some benefit or knowledge] (eru)",
  },
  {
    hiragana: "おる",
    romaji: "oru",
    wholeText: "おる、折る – to breaktr, to foldtr (oru)",
  },
  {
    hiragana: "かう",
    romaji: "kau",
    wholeText: "かう、買う – to buy (kau)",
  },
  {
    hiragana: "きる",
    romaji: "kiru",
    wholeText: "きる、切る – to cut (kiru)†",
  },
  {
    hiragana: "きる",
    romaji: "kiru",
    wholeText: "きる、着る – to wear [on the upper body] (kiru)",
  },
  {
    hiragana: "はく",
    romaji: "haku",
    wholeText: "はく、履く – to wear [on the lower body] (haku)",
  },
  {
    hiragana: "かえる",
    romaji: "kaeru",
    wholeText: "かえる、変える – to changetr (kaeru)",
  },
  {
    hiragana: "かえる",
    romaji: "kaeru",
    wholeText:
      "かえる、代える – to exchange, to substitute, to replace (kaeru)",
  },
  {
    hiragana: "しめる",
    romaji: "shimeru",
    wholeText: "しめる、閉める – to closetr (shimeru)",
  },
  {
    hiragana: "しめる",
    romaji: "shimeru",
    wholeText: "しめる、締める – to tie, to fasten (shimeru)",
  },
  {
    hiragana: "しめる",
    romaji: "shimeru",
    wholeText: "しめる、占める – to comprise, to account for (shimeru)",
  },
  {
    hiragana: "しる",
    romaji: "shiru",
    wholeText: "しる、知る – to know (shiru)†",
  },
  {
    hiragana: "つかれる",
    romaji: "tsukareru",
    wholeText: "つかれる、疲れる – to get tired (tsukareru)",
  },
  {
    hiragana: "でかける",
    romaji: "dekakeru",
    wholeText: "でかける、出掛ける – to go out, to depart (dekakeru)",
  },
  {
    hiragana: "はたらく",
    romaji: "hataraku",
    wholeText: "はたらく、働く – to work [e.g., at a job] (hataraku)",
  },
  {
    hiragana: "はなす",
    romaji: "hanasu",
    wholeText: "はなす、放す、離す – to let go of (hanasu)",
  },
  {
    hiragana: "やすむ",
    romaji: "yasumu",
    wholeText: "やすむ、休む – to rest, to take a break, to go to bed (yasumu)",
  },
  {
    hiragana: "わかれる",
    romaji: "wakareru",
    wholeText: "わかれる、分かれる – to split intoin, to be divided (wakareru)",
  },
  {
    hiragana: "わかれる",
    romaji: "wakareru",
    wholeText:
      "わかれる、別れる – to partin, to separatein, to break upin (wakareru)",
  },
  {
    hiragana: "もう",
    romaji: "mō",
    wholeText: "もう – already (mō)",
  },
  {
    hiragana: "まだ",
    romaji: "mada",
    wholeText: "まだ – still, yet (mada)",
  },
  {
    hiragana: "ずっと",
    romaji: "zutto",
    wholeText: "ずっと – always (zutto)",
  },
  {
    hiragana: "とても",
    romaji: "totemo",
    wholeText: "とても – very (totemo)",
  },
  {
    hiragana: "こう",
    romaji: "kō",
    wholeText: "こう – like this (kō)",
  },
  {
    hiragana: "そう",
    romaji: "sō",
    wholeText: "そう – like that (sō)",
  },
  {
    hiragana: "ああ",
    romaji: "ā",
    wholeText: "ああ – in that other way (ā)",
  },
  {
    hiragana: "どう",
    romaji: "dō",
    wholeText: "どう – how (dō)",
  },
  {
    hiragana: "しばしば",
    romaji: "shibashiba",
    wholeText: "しばしば – often (shibashiba)",
  },
  {
    hiragana: "この",
    romaji: "kono",
    wholeText: "この – this (kono)",
  },
  {
    hiragana: "その",
    romaji: "sono",
    wholeText: "その – that (sono)",
  },
  {
    hiragana: "あの",
    romaji: "ano",
    wholeText: "あの – that (ano)",
  },
  {
    hiragana: "どの",
    romaji: "dono",
    wholeText: "どの – which (dono)",
  },
  {
    hiragana: "はい",
    romaji: "hai",
    wholeText: "はい – yes (hai)",
  },
  {
    hiragana: "いいえ",
    romaji: "iie",
    wholeText: "いいえ – no (iie)",
  },
  {
    hiragana: "でも",
    romaji: "demo",
    wholeText: "でも - but (demo)",
  },
  {
    hiragana: "しかし",
    romaji: "shikashi",
    wholeText: "しかし – but, however (shikashi)",
  },
  {
    hiragana: "そして",
    romaji: "soshite",
    wholeText: "そして – and then, Then… (soshite)",
  },
  {
    hiragana: "それに",
    romaji: "soreni",
    wholeText: "それに – besides (soreni)",
  },
  {
    hiragana: "なぜなら",
    romaji: "nazenara",
    wholeText: "なぜなら – that is because, being because (nazenara)",
  },
  {
    hiragana: "う",
    romaji: "u",
    wholeText:
      'う、よう – volitional ending [う for u-verbs, よう for ru-verbs]: "Let\'s…" or "I will" (u, yō)',
  },
  {
    hiragana: "せる",
    romaji: "u",
    wholeText:
      "せる、させる – causative ending [せる for u-verbs, させる for ru-verbs]: to make [someone do something], to allow (seru, saseru)",
  },
  {
    hiragana: "れる",
    romaji: "u",
    wholeText:
      'れる、られる – passive verb ending [れる for u-verbs, られる for ru-verbs]: to be <verbed> [e.g., 食べられる, "to be eaten"] (reru, rareru)',
  },
  {
    hiragana: "そうだ",
    romaji: "seems",
    wholeText:
      'そうだ – indicates that it seems the verb occurs [e.g., "It seems he ate"] (sōda)',
  },
  {
    hiragana: "た",
    romaji: "ta",
    wholeText: "た – informal past-tense (ta)",
  },
  {
    hiragana: "たい",
    romaji: "tai",
    wholeText: "たい – indicates desire to perform verb (tai)",
  },
  {
    hiragana: "だろう",
    romaji: "seems",
    wholeText:
      "だろう – indicates that it seems the verb occurs; also used to ask whether the verb occurs (darō)",
  },
  {
    hiragana: "ない",
    romaji: "nai",
    wholeText:
      "ない、ん – informal negative (nai, n) [ん is a slurred version and sounds a little masculine]",
  },
  {
    hiragana: "ぬ",
    romaji: "nu",
    wholeText:
      'ぬ – archaic informal negative ["he hath", "thou didst", etc.] (nu)',
  },
  {
    hiragana: "ます",
    romaji: "masu",
    wholeText: "ます – formal non-past ending (masu)",
  },
  {
    hiragana: "が",
    romaji: "ga",
    wholeText: "が – subject marker, but (ga)",
  },
  {
    hiragana: "で",
    romaji: "de",
    wholeText: "で – at, by (de)",
  },
  {
    hiragana: "と",
    romaji: "to",
    wholeText: "と – and, with (to)",
  },
  {
    hiragana: "に",
    romaji: "ni",
    wholeText: "に – indirect object marker (ni)",
  },
  {
    hiragana: "の",
    romaji: "no",
    wholeText: "の – possession marker, of (no)",
  },
  {
    hiragana: "へ",
    romaji: "e",
    wholeText:
      "へ – to (e) [Note: へ is normally read he, but when used as this particle its reading changes to e]",
  },
  {
    hiragana: "まで",
    romaji: "made",
    wholeText: "まで – to (made)",
  },
  {
    hiragana: "から",
    romaji: "kara",
    wholeText: "から – from (kara)",
  },
  {
    hiragana: "より",
    romaji: "yori",
    wholeText: "より – than (yori)",
  },
  {
    hiragana: "を",
    romaji: "o",
    wholeText: "を – direct object marker (o)",
  },
  {
    hiragana: "および",
    romaji: "oyobi",
    wholeText: "および、及び – and; as well as (oyobi)",
  },
  {
    hiragana: "か",
    romaji: "ka",
    wholeText: "か – whether (ka)",
  },
  {
    hiragana: "かも",
    romaji: "kamo",
    wholeText: "かも – might be, possible that (kamo)",
  },
  {
    hiragana: "そして",
    romaji: "soshite",
    wholeText: "そして – and then (soshite)",
  },
  {
    hiragana: "それとも",
    romaji: "soretomo",
    wholeText: "それとも – or (soretomo)",
  },
  {
    hiragana: "だの",
    romaji: "dano",
    wholeText:
      "だの – things like <list of things>, including, such things as (dano)",
  },
  {
    hiragana: "つつ",
    romaji: "tsutsu",
    wholeText:
      "つつ – ongoing occurrence (tsutsu) [similar to ながら but has different tone, and both actions have equal weight]",
  },
  {
    hiragana: "て",
    romaji: "te",
    wholeText: "て – te form of verb or adjective [see explanation]",
  },
  {
    hiragana: "と",
    romaji: "to",
    wholeText: "と – when, if, that (to)",
  },
  {
    hiragana: "ながら",
    romaji: "nagara",
    wholeText: "ながら – while, though, both (nagara)",
  },
  {
    hiragana: "ならびに",
    romaji: "narabini",
    wholeText: "ならびに – as well as (narabini)",
  },
  {
    hiragana: "なり",
    romaji: "nari",
    wholeText: "なり – whether or not (nari)",
  },
  {
    hiragana: "に",
    romaji: "ni",
    wholeText: "に – to <somewhere>, by <someone> (ni)",
  },
  {
    hiragana: "の",
    romaji: "no",
    wholeText: "の – possession (no)",
  },
  {
    hiragana: "ので",
    romaji: "node",
    wholeText: "ので – so (node)",
  },
  {
    hiragana: "また",
    romaji: "mata",
    wholeText: "また、又 – also, again (mata)",
  },
  {
    hiragana: "または",
    romaji: "matawa",
    wholeText: "または、又は – or alternatively (matawa)",
  },
  {
    hiragana: "も",
    romaji: "mo",
    wholeText: "も – also, too (mo)",
  },
  {
    hiragana: "や",
    romaji: "ya",
    wholeText: "や – and (ya)",
  },
  {
    hiragana: "ね",
    romaji: "ne",
    wholeText: 'ね – emphasis and question marker, equivalent to "right?" (ne)',
  },
  {
    hiragana: "か",
    romaji: "ka",
    wholeText: "か – question marker (ka)",
  },
  {
    hiragana: "な",
    romaji: "na",
    wholeText: "な – the copula particle used after quasi-adjectives (na)",
  },
  {
    hiragana: "かしら",
    romaji: "kashira",
    wholeText: "かしら – I wonder (kashira)",
  },
  {
    hiragana: "さ",
    romaji: "sa",
    wholeText: "さ – -ness (sa)",
  },
  {
    hiragana: "っけ",
    romaji: "-kke",
    wholeText:
      'っけ – particle indicating that the speaker is trying to recall some information ["What class is next -kke?"] (-kke)',
  },
  {
    hiragana: "こそ",
    romaji: "koso",
    wholeText: "こそ – emphasis (koso)",
  },
  {
    hiragana: "さえ",
    romaji: "sae",
    wholeText: "さえ – even (sae)",
  },
  {
    hiragana: "しか",
    romaji: "shika",
    wholeText: "しか – only (shika)",
  },
  {
    hiragana: "すら",
    romaji: "sura",
    wholeText: "すら – even (sura)",
  },
  {
    hiragana: "くらい",
    romaji: "kurai",
    wholeText: "くらい、ぐらい – approximately, about (kurai)",
  },
  {
    hiragana: "だけ",
    romaji: "dake",
    wholeText: "だけ – only, as much as (dake)",
  },
  {
    hiragana: "だって",
    romaji: "datte",
    wholeText: "だって – however (datte)",
  },
  {
    hiragana: "ったら",
    romaji: "ttara",
    wholeText:
      "ったら – casual topic marker (ttara) [colloquial form of to ittara (if you refer to ~; as for ~)",
  },
  {
    hiragana: "って",
    romaji: "tte",
    wholeText: "って – said that (tte)",
  },
  {
    hiragana: "でも",
    romaji: "demo",
    wholeText: "でも – also, or (demo)",
  },
  {
    hiragana: "どころ",
    romaji: "dokoro",
    wholeText:
      "どころ – (particle used to indicate that what precedes it is an extreme example and strongly negates it) (dokoro)",
  },
  {
    hiragana: "など",
    romaji: "nado",
    wholeText: "など – for example (nado)",
  },
  {
    hiragana: "なら",
    romaji: "nara",
    wholeText: "なら – if [for verbs]; subject marker [for nouns] (nara)",
  },
  {
    hiragana: "なんか",
    romaji: "nanka",
    wholeText: "なんか – casual undervalue, dislike, lack (nanka)",
  },
  {
    hiragana: "なんて",
    romaji: "nante",
    wholeText: "なんて – casual undervalue, dislike, lack (nante)",
  },
  {
    hiragana: "は",
    romaji: "wa",
    wholeText:
      "は – topic marker (wa) [although ha is the hiragana used, wa is the pronunciation)",
  },
  {
    hiragana: "ばかり",
    romaji: "bakari",
    wholeText: "ばかり、ばっかり – just, full of, only (bakari)",
  },
  {
    hiragana: "まで",
    romaji: "made",
    wholeText: "まで – until (made)",
  },
  {
    hiragana: "も",
    romaji: "mo",
    wholeText: "も – too, also (mo)",
  },
]
  .concat(
    Object.entries(hiraganaToRomanji).map(([hiragana, romaji]) => ({
      hiragana,
      romaji,
      wholeText: `${hiragana}、${romaji} - ${romaji} - ${hiragana}`,
    })),
  )
  .filter(isDBWordValid);
