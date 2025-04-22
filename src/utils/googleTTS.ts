import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { GoogleTTSVoice } from "@/types/tts";

// Google Cloud クライアントの初期化
let ttsClient: TextToSpeechClient;

try {
  // 環境変数から認証情報を取得
  const credentials = process.env.GOOGLE_CREDENTIALS2;

  if (!credentials) {
    throw new Error("GOOGLE_CREDENTIALS2 環境変数が設定されていません");
  }

  // 環境変数から直接クレデンシャルを読み込む
  ttsClient = new TextToSpeechClient({
    credentials: JSON.parse(credentials),
  });
} catch (error) {
  console.error("Google TTS クライアントの初期化に失敗しました:", error);
}

/**
 * Google Text-to-Speech APIを使用してテキストを音声に変換する
 * @param text 変換するテキスト
 * @param voiceName 音声名（例: "en-US-Neural2-F"）
 * @returns 音声データのBase64エンコード文字列
 */
export const synthesizeSpeech = async (
  text: string,
  languageCode: string = "en-US",
  voiceName: string = "en-US-Neural2-F"
): Promise<string> => {
  try {
    // リクエストの設定
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
      },
    };

    // 音声合成のリクエスト
    const [response] = await ttsClient.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error("音声データが取得できませんでした");
    }

    // 音声データをBase64エンコードして返す
    return Buffer.from(response.audioContent as Buffer).toString("base64");
  } catch (error) {
    console.error("音声合成エラー:", error);
    throw error;
  }
};

/**
 * Google Cloud TTSで利用可能な音声一覧を取得する
 * @returns Google TTS音声一覧
 */
export const listGoogleVoices = async (
  languageCode: string = "en-US"
): Promise<GoogleTTSVoice[]> => {
  try {
    const [result] = await ttsClient.listVoices({ languageCode });
    return (result.voices as GoogleTTSVoice[]) || [];
  } catch (error) {
    console.error("音声一覧の取得に失敗しました:", error);
    return [];
  }
};
