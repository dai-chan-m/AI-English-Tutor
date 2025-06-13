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
    console.error("Google TTS発話エラー:", error);
    setSpeakingIndex(null);
  }
};
