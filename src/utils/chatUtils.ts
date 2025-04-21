import { ChatMessage } from "@/types/chat";

/**
 * チャットメッセージ送信処理
 */
export const sendChatMessage = async (
  messages: ChatMessage[], 
  systemPrompt: string
): Promise<string> => {
  const res = await fetch("/api/ai-chat", {
    method: "POST",
    body: JSON.stringify({
      messages,
      systemPrompt,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  return data.reply;
};