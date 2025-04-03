export const startSpeechRecognition = (onResult: (text: string) => void) => {
  // 柔軟に拡張（anyはここだけ！）
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("このブラウザは音声認識に対応していません。");
    return;
  }

  const recognition = new SpeechRecognition() as SpeechRecognition;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    alert("音声認識中にエラーが発生しました");
  };

  recognition.start();
};
