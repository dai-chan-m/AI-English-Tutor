/**
 * チャット関連の型定義
 */

export type Character = {
  id: string;
  name: string;
  prompt: string;
  icon: string;
  voice: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};