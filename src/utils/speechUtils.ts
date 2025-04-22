/**
 * 音声関連のユーティリティ関数
 */

/**
 * テキストから絵文字を削除する
 */
export const removeEmojis = (text: string): string => {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uFE0F|\u200D)/g,
    ""
  );
};

/**
 * テキストを音声で読み上げる
 */
export const speakMessage = (
  text: string,
  index: number,
  selectedVoice: string,
  availableVoices: SpeechSynthesisVoice[],
  setSpeakingIndex: (index: number | null) => void
): void => {
  const cleanedText = removeEmojis(text);

  // ピリオド、疑問符、感嘆符で分割
  const sentences = cleanedText.match(/[^.!?]+[.!?]?/g) || [cleanedText];

  // 発話中の場合はキャンセル
  window.speechSynthesis.cancel();
  setSpeakingIndex(index);

  let current = 0;

  const speakNext = () => {
    if (current >= sentences.length) {
      setSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentences[current].trim());

    // ボイスを設定する
    if (availableVoices.length > 0) {
      const matchedVoice = availableVoices.find(
        (voice) => voice.name === selectedVoice
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      } else {
        const langVoice = availableVoices.find((voice) =>
          voice.lang.startsWith(utterance.lang)
        );
        if (langVoice) {
          utterance.voice = langVoice;
        }
      }
    }

    // 話し終わったらインデックスをクリア
    utterance.onend = () => {
      current++;
      speakNext();
    };

    // エラー時も進める
    utterance.onerror = () => {
      current++;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();
};

/**
 * 使用可能な音声リストを取得する
 */
export const loadVoices = (): SpeechSynthesisVoice[] => {
  return window.speechSynthesis.getVoices();
};
