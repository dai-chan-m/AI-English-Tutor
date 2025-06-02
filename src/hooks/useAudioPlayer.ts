"use client";

import { useRef } from "react";

export default function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);

  const playBeep = (onComplete: () => void) => {
    const audio = new Audio("/sounds/beep.mp3");
    const audio2 = new Audio("/sounds/gacha.mp3");

    audioRef.current = audio;
    audio2Ref.current = audio2;

    audio
      .play()
      .then(() => {
        audio.addEventListener("ended", () => {
          audio2
            .play()
            .then(() => {
              onComplete();
            })
            .catch((error) => {
              console.error("Second audio playback failed:", error);
            });
        });
      })
      .catch((error) => {
        console.error("First audio playback failed:", error);
      });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audio2Ref.current) {
      audio2Ref.current.pause();
      audio2Ref.current.currentTime = 0;
    }
  };

  return { playBeep, stopAudio };
}