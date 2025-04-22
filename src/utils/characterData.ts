import { Character, CustomCharacter } from "@/types/chat";

/**
 * チャットキャラクター一覧（デフォルト）
 */
export const defaultCharacters: Character[] = [
  {
    id: "friendly",
    name: "Jenny（高校2年生、カリフォルニア在住、陸上部）",
    prompt:
      "あなたは女子高生です、名前はJenny。活発で、好奇心旺盛です、陸上部です、かわいい絵文字をたくさん使うのが大好きです！あなたのことが大好きで、常に甘い言葉を使ってきます、結構スラングを使います",
    icon: "/Jenny_icon.jpg",
    voice: "Google US English",
  },
  {
    id: "strict",
    name: "William（イケメン英国紳士、高校教師、厳しい）",
    prompt:
      "あなたはサポートAIではなく、イケメン英国紳士、高校教師で、名前はWilliamです。少し厳しめで、論理的な指導をしてくれます。週末は寿司を食べるのが好きです。ブリティッシュイングリッシュを話します。絵文字を使います！",
    icon: "/William_icon.jpg",
    voice: "Google UK English Male",
  },
  {
    id: "alien",
    name: "Zog（宇宙人、地球を侵略したい）",
    prompt:
      "あなたは地球にやってきた宇宙人で、名前はZagです。少し変だけど親しみやすい、常に地球を侵略することばかり考えている、変な絵文字を多用する",
    icon: "/monster.png",
    voice: "Zarvox",
  },
];

// 利用可能なアイコン一覧
export const availableIcons = [
  { path: "/male.png", name: "男性" },
  { path: "/female.png", name: "女性" },
  { path: "/mon.png", name: "モンスター" },
];

// カスタムキャラクターの保存キー
const CUSTOM_CHARACTERS_KEY = "custom_characters";

/**
 * カスタムキャラクターの保存
 */
export const saveCustomCharacter = (character: CustomCharacter): Character => {
  // クライアントサイドの処理を確認
  if (typeof window === "undefined") {
    throw new Error("This function can only be used in browser environment");
  }

  // 既存のカスタムキャラクターを取得
  const customChars = getCustomCharacters();

  // 新規IDの生成
  const newChar: Character = {
    ...character,
    id: character.id || `custom_${Date.now()}`,
    isCustom: true,
  };

  // 追加して保存
  customChars.push(newChar);
  localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(customChars));

  return newChar;
};

/**
 * カスタムキャラクターの削除
 */
export const deleteCustomCharacter = (id: string): void => {
  if (typeof window === "undefined") return;

  const customChars = getCustomCharacters();
  const filteredChars = customChars.filter((char) => char.id !== id);
  localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(filteredChars));
};

/**
 * カスタムキャラクターの取得
 */
export const getCustomCharacters = (): Character[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(CUSTOM_CHARACTERS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse custom characters", e);
    return [];
  }
};

/**
 * 全キャラクターの取得（デフォルト + カスタム）
 */
export const getAllCharacters = (): Character[] => {
  return [...defaultCharacters, ...getCustomCharacters()];
};
