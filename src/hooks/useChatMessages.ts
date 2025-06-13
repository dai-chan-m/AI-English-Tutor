"use client";

import { useState } from "react";
import { ChatMessage, Character } from "@/types/chat";
import { sendChatMessage } from "@/utils/chatUtils";
import { removeEmojis, speakWithTTS } from "@/utils/speechUtils";

export default function useChatMessages(selectedChar: Character | null) {
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(
    {}
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const currentMessages = selectedChar
    ? messagesMap[selectedChar.id] || []
    : [];

  // メッセージ読み上げ処理
  const handleSpeakMessage = (
    text: string,
    index: number,
    stopRecording: () => void
  ) => {
    // 音声認識を確実に停止
    stopRecording();

    if (!selectedChar) return;

    // AIが話し始める前に録音を停止することを確実に
    speakWithTTS(
      removeEmojis(text),
      index,
      selectedChar.voice,
      setSpeakingIndex
    );
  };

  const handleSend = async (stopRecording: () => void) => {
    if (!input.trim() || !selectedChar) return;

    const newUserMessage: ChatMessage = { role: "user", content: input };
    const newMessages: ChatMessage[] = [...currentMessages, newUserMessage];
    const newMessagesMap: Record<string, ChatMessage[]> = {
      ...messagesMap,
      [selectedChar.id]: newMessages,
    };
    setMessagesMap(newMessagesMap);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(
        selectedChar.name,
        newMessages,
        selectedChar.prompt
      );
      const newAssistantMessage: ChatMessage = {
        role: "assistant",
        content: reply,
      };
      const updatedMessages: ChatMessage[] = [
        ...newMessages,
        newAssistantMessage,
      ];
      const newMessagesMap: Record<string, ChatMessage[]> = {
        ...messagesMap,
        [selectedChar.id]: updatedMessages,
      };
      setMessagesMap(newMessagesMap);
      handleSpeakMessage(reply, newMessages.length, stopRecording);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    messagesMap,
    setMessagesMap,
    currentMessages,
    input,
    setInput,
    loading,
    speakingIndex,
    setSpeakingIndex,
    handleSpeakMessage,
    handleSend,
  };
}
