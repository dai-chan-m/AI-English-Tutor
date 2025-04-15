import { useState, useRef } from "react";

export const useSpeechRecognition = (onTranscriptUpdate: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const normalizeSentence = (text: string): string => {
    const trimmed = text.trim();
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const endsWithPunctuation = /[.!?]$/.test(capitalized);
    return endsWithPunctuation ? capitalized : capitalized + ".";
  };

  const handleStart = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const spoken = event.results[0][0].transcript;
      onTranscriptUpdate(normalizeSentence(spoken));
      recognitionRef.current?.stop();
      recognitionRef.current?.abort();
    };

    recognition.onend = () => {
      recognitionRef.current?.stop();
      recognitionRef.current?.abort();
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    recognitionRef.current?.abort();
    setIsRecording(false);
  };

  return {
    isRecording,
    handleStart,
    handleStop
  };
};

export default useSpeechRecognition;