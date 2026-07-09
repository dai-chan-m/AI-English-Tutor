let cachedVoice: SpeechSynthesisVoice | null = null;

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!ttsSupported()) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const preferred = [
    (v: SpeechSynthesisVoice) => v.lang === "en-US" && /Samantha/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang === "en-US" && /Google/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang === "en-US",
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
  ];
  for (const test of preferred) {
    const found = voices.find(test);
    if (found) {
      cachedVoice = found;
      return found;
    }
  }
  return null;
}

export function speak(text: string, rate = 0.92): void {
  if (!ttsSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = rate;
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  synth.speak(utter);
}

/** 一部ブラウザはvoicesが遅延ロードのため、先読みしてキャッシュを温める */
export function warmupVoices(): void {
  if (!ttsSupported()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}
