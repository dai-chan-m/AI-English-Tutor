"use client";

import { useEffect, useState } from "react";
import { RiVolumeUpFill } from "react-icons/ri";
import { speak, ttsSupported, warmupVoices } from "@/lib/tts";

interface Props {
  text: string;
  size?: "sm" | "lg";
  label?: string;
}

export default function SpeakButton({ text, size = "sm", label }: Props) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(ttsSupported());
    warmupVoices();
  }, []);

  if (!supported) return null;

  const sizeClass =
    size === "lg"
      ? "h-14 w-14 text-2xl"
      : "h-9 w-9 text-base";

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={label ?? `${text}を発音する`}
      className={`grid shrink-0 place-items-center rounded-full bg-indigo-100 text-indigo-600 transition hover:bg-indigo-200 active:scale-95 ${sizeClass}`}
    >
      <RiVolumeUpFill aria-hidden />
    </button>
  );
}
