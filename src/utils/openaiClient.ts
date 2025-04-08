import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

export async function streamOpenAIResponse(response: Response) {
  // ストリーミングレスポンスを処理するためのTransformStream
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // レスポンスのボディをストリームとして読み込む
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is null");
  }

  // 非同期処理でストリームを読み込む
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          await writer.close();
          break;
        }

        // 受け取ったデータをデコードしてクライアントに送信
        const chunk = decoder.decode(value);
        await writer.write(encoder.encode(chunk));
      }
    } catch (error) {
      console.error("Error reading stream:", error);
      await writer.abort(error);
    }
  })();

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// 注意: このメソッドは後方互換性のために残しています
// 新しいコードでは @/utils/apiErrorHandler からインポートしてください
export function handleAPIError(error: unknown) {
  console.error("API error:", error);
  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}