// src/app/api/ocr/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";

// 認証設定（jsonファイルのパスを指定）
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  process.cwd(),
  process.env.GOOGLE_APPLICATION_CREDENTIALS!
);

// Visionライブラリ読み込み
import vision from "@google-cloud/vision";
const client = new vision.ImageAnnotatorClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "画像ファイルが必要です" },
        { status: 400 }
      );
    }

    // 一時ファイルとして保存
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(tmpdir(), `ocr-${Date.now()}.png`);
    await writeFile(filePath, buffer);

    // OCR実行
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations ?? [];

    const text = detections[0]?.description ?? "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("OCR API Error:", error);
    return NextResponse.json({ error: "OCRに失敗しました" }, { status: 500 });
  }
}
