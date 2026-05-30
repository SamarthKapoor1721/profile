import { ImageResponse } from "next/og";

export const alt = "Samarth Kapoor — AI Product Manager · Data Science · Fintech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#080B10",
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(16,185,129,0.25), transparent 45%), radial-gradient(circle at 90% 100%, rgba(16,185,129,0.12), transparent 40%)",
          color: "#E6EDF3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.4)",
              color: "#34D399",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 22, color: "#8B949E", letterSpacing: 2 }}>
            PORTFOLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
            Samarth Kapoor
          </div>
          <div style={{ fontSize: 38, color: "#10B981", marginTop: 16 }}>
            AI Product Manager · Data Science &amp; Fintech
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#8B949E", display: "flex", gap: 24 }}>
          <span>Agentic ML</span>
          <span style={{ color: "#30363D" }}>/</span>
          <span>Payments &amp; markets</span>
          <span style={{ color: "#30363D" }}>/</span>
          <span>Data products</span>
        </div>
      </div>
    ),
    size,
  );
}
