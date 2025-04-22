import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/utils/googleTTS";

export async function POST(request: NextRequest) {
  try {
    const { text, voiceName, languageCode } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "テキストが指定されていません" },
        { status: 400 }
      );
    }

    // Google TTSを使用して音声を生成
    const audioContent = await synthesizeSpeech(text, languageCode, voiceName);

    // Base64エンコードされた音声データを返す
    return NextResponse.json({ audioContent });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "音声生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
