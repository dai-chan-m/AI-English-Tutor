import { ChatMessage } from "@/types/chat";

/**
 * チャットメッセージ送信処理
 */
export const sendChatMessage = async (
  name: string,
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> => {
  const res = await fetch("/api/ai-chat", {
    method: "POST",
    body: JSON.stringify({
      name,
      messages,
      systemPrompt,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  return data.reply;
};
