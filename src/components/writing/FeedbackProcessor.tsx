import React, { useState } from "react";

interface FeedbackProcessorProps {
  text: string;
  tone: string;
  promptTopic?: string;
  promptLevel?: string;
  onFeedbackReceived: (feedback: string) => void;
  children: React.ReactNode;
}

export const FeedbackProcessor = ({
  text,
  tone,
  promptTopic,
  promptLevel,
  onFeedbackReceived,
  children,
}: FeedbackProcessorProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          tone,
          promptTopic: promptTopic || undefined,
          promptLevel: promptLevel || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      if (res.headers.get("Content-Type")?.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("Response body is empty");

        // EventSourceの代わりにReadableStreamを手動で処理
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Server-Sent Events形式でパース
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || ""; // 最後の不完全な部分を保持

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6); // "data: "の後ろの部分
                const parsedData = JSON.parse(jsonStr);
                onFeedbackReceived(parsedData.feedback || "");
              } catch (e) {
                console.error("Failed to parse stream chunk", e);
              }
            }
          }
        }
      } else {
        const data = await res.json();
        onFeedbackReceived(data.feedback || "");
      }
    } catch (error) {
      console.error("Error:", error);
      onFeedbackReceived("エラーが発生しました。もう一度試してください。");
    } finally {
      setLoading(false);
    }
  };

  // childrenに props を渡す
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onSubmit: handleSubmit, loading } as any);
        }
        return child;
      })}
    </>
  );
};