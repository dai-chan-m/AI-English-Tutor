"use client";

import { useState, useEffect } from "react";
import useAudioPlayer from "./useAudioPlayer";
import { ChatMessage } from "@/types/chat";

export default function useVideoCall(
  currentMessages: ChatMessage[],
  speakingIndex: number | null,
  startRecording: () => void,
  stopRecording: () => void,
  setInput: (value: string) => void
) {
  const [isVideoChat, setIsVideoChat] = useState(false);
  const { playBeep, stopAudio } = useAudioPlayer();

  // ビデオチャット中に音声認識を自動開始する
  useEffect(() => {
    if (speakingIndex == null && isVideoChat && currentMessages.length > 0) {
      startRecording();
    }
  }, [speakingIndex, isVideoChat, currentMessages]);

  const handleEndCall = () => {
    setIsVideoChat(false);
    stopRecording();
    stopAudio();
  };

  const handleStartCall = () => {
    playBeep(() => setInput("hi"));
    setIsVideoChat(true);
  };

  return {
    isVideoChat,
    setIsVideoChat,
    handleEndCall,
    handleStartCall,
  };
}
