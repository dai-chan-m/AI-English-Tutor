/**
 * 音声関連のユーティリティ関数
 */

/**
 * テキストから絵文字を削除する
 */
export const removeEmojis = (text: string): string => {
  return text.replace(/\p{Extended_Pictographic}/gu, "");
};

/**
 * ブラウザ音声名から女性声かどうかを判定する
 */
const isFemaleVoice = (name: string): boolean => {
  return /samantha|victoria|karen|kate|fiona|moira|tessa|female|woman/i.test(name);
};

/**
 * ブラウザの音声一覧を取得する（非同期読み込み対応）
 */
const getVoicesAsync = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      resolve(speechSynthesis.getVoices());
    };
  });
};

/**
 * Google TTSを使ってテキストを音声で読み上げる
 */
export const speakWithTTS = async (
  text: string,
  index: number,
  voiceName: string,
  setSpeakingIndex: (index: number | null) => void
): Promise<void> => {
  try {
    // AIが話し始める前に発話中であることを確実に通知
    setSpeakingIndex(index);

    // テキストをクリーニング
    const cleanedText = removeEmojis(text);

    if (!cleanedText.trim()) {
      setSpeakingIndex(null);
      return;
    }

    // APIリクエスト - テキスト全体を一度に処理
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: cleanedText.trim(),
        voiceName: voiceName,
        // UK系の音声の場合は言語コードをen-GBに
        languageCode: voiceName.includes("GB") ? "en-GB" : "en-US",
      }),
    });

    if (!response.ok) {
      throw new Error("TTS API request failed");
    }

    const data = await response.json();

    // Base64エンコードされた音声データからBlobを作成
    const audioContent = data.audioContent;
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
      { type: "audio/mp3" }
    );

    // Blobから音声を再生
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // 音声再生中は確実にspeakingIndexがnullでないことを保証
    const checkInterval = setInterval(() => {
      setSpeakingIndex(index);
    }, 100);

    // 音声再生後の処理
    audio.onended = () => {
      clearInterval(checkInterval);
      URL.revokeObjectURL(audioUrl);

      // 少し遅延させて確実に音声が完全に終わった後にnullに設定
      setTimeout(() => {
        setSpeakingIndex(null);
      }, 300);
    };

    // エラー処理
    audio.onerror = () => {
      clearInterval(checkInterval);
      console.error("再生エラー");
      URL.revokeObjectURL(audioUrl);
      setSpeakingIndex(null);
    };

    // 再生開始
    audio.play().catch((err) => {
      clearInterval(checkInterval);
      console.error("再生開始エラー:", err);
      setSpeakingIndex(null);
    });
  } catch (error) {
    console.error("Google TTS発話エラー、ブラウザTTSにフォールバック:", error);
    // ブラウザのSpeechSynthesis APIにフォールバック
    try {
      const cleanedText = removeEmojis(text);
      if (!cleanedText.trim()) {
        setSpeakingIndex(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(cleanedText.trim());
      const voices = await getVoicesAsync();

      // デバッグ: 利用可能な英語音声を表示
      console.log("利用可能な英語音声:", voices.filter(v => v.lang.startsWith("en")).map(v => `${v.name} (${v.lang})`));

      // Google TTS音声名からキャラクター特性を判定してブラウザ音声を選択
      const isBritish = voiceName.includes("GB");
      const isAlien = voiceName.includes("IN");
      const isFemale = voiceName.endsWith("-F") || voiceName.includes("Neural2-F");

      if (isAlien) {
        // Zog: インド英語の声
        utterance.lang = "en-IN";
        const indianVoice = voices.find(
          (v) => v.lang.startsWith("en-IN") || /rishi/i.test(v.name)
        ) || voices.find((v) => v.lang.startsWith("en"));
        if (indianVoice) utterance.voice = indianVoice;
      } else if (isBritish) {
        // William: イギリス英語の男性声
        utterance.lang = "en-GB";
        const britishVoice = voices.find(
          (v) => v.lang.startsWith("en-GB") && !isFemaleVoice(v.name)
        ) || voices.find((v) => v.lang.startsWith("en-GB"));
        if (britishVoice) utterance.voice = britishVoice;
      } else if (isFemale) {
        // Jenny: スタンダードな女性声（Samanthaなど）
        utterance.lang = "en-US";
        const femaleVoice = voices.find(
          (v) => v.lang.startsWith("en-US") && /samantha/i.test(v.name)
        ) || voices.find(
          (v) => v.lang.startsWith("en-US") && isFemaleVoice(v.name)
        ) || voices.find((v) => v.lang.startsWith("en-US"));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        utterance.lang = "en-US";
        const defaultVoice = voices.find((v) => v.lang.startsWith("en-US"));
        if (defaultVoice) utterance.voice = defaultVoice;
      }

      utterance.onend = () => {
        setTimeout(() => setSpeakingIndex(null), 300);
      };
      utterance.onerror = () => {
        console.error("ブラウザTTSも失敗しました");
        setSpeakingIndex(null);
      };
      speechSynthesis.speak(utterance);
    } catch (fallbackError) {
      console.error("フォールバックTTSエラー:", fallbackError);
      setSpeakingIndex(null);
    }
  }
};
