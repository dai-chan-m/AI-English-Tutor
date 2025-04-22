/**
 * チャット関連の型定義
 */

export type Character = {
  id: string;
  name: string;
  prompt: string;
  icon: string;
  voice: string;
  isCustom?: boolean;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CustomCharacter = Omit<Character, "id"> & {
  id?: string;
};