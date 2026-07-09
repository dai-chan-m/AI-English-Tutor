import { ImageResponse } from "next/og";

export const alt = "TanRen - TOEIC Vocabulary Drill";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #312e81 0%, #4f46e5 60%, #6366f1 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "#ffffff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 800,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>
            TANREN
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 40,
            fontWeight: 700,
            color: "#c7d2fe",
            letterSpacing: 6,
          }}
        >
          TOEIC® VOCABULARY DRILL
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              padding: "10px 28px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
            }}
          >
            300 WORDS
          </div>
          <div
            style={{
              padding: "10px 28px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
            }}
          >
            FREE
          </div>
          <div
            style={{
              padding: "10px 28px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
            }}
          >
            NO SIGNUP
          </div>
        </div>
      </div>
    ),
    size
  );
}
