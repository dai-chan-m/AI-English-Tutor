export {};

type SpeechRecognitionResultCallback = (event: SpeechRecognitionEvent) => void;

interface SpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: SpeechRecognitionResultCallback | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: () => void;
  onstop: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
  dispatchEvent: (event: Event) => boolean;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
