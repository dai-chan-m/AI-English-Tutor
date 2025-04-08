// utils/apiErrorHandler.ts
import { NextResponse } from "next/server";

/**
 * 統一的なAPIエラーハンドリング
 * @param error エラーオブジェクト
 * @param customMessage カスタムエラーメッセージ（オプション）
 * @returns NextResponse形式のエラーレスポンス
 */
export function handleAPIError(error: unknown, customMessage?: string) {
  console.error("API Error:", error);
  const message = customMessage || (error instanceof Error ? error.message : "Unknown error");
  
  return NextResponse.json(
    { error: "Error occurred", message },
    { status: 500 }
  );
}

/**
 * ストリーミングレスポンス用のユーティリティ
 * @param streamHandler ストリームコントローラーを制御する関数
 * @returns ストリーミング用のResponseオブジェクト
 */
export function createStreamResponse(
  streamHandler: (controller: ReadableStreamDefaultController) => Promise<void>
) {
  return new Response(
    new ReadableStream({
      start: streamHandler
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      }
    }
  );
}