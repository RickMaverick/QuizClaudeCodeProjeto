import { ImageResponse } from "next/og";

export const alt = "Quiz Claude Code — Verdadeiro ou Falso";
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
          justifyContent: "center",
          padding: 80,
          background: "#f8f5ee",
          color: "#1f1d1a",
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: "#b4532a", letterSpacing: 2 }}>
          VERDADEIRO OU FALSO
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 16 }}>Quiz Claude Code</div>
        <div style={{ fontSize: 40, marginTop: 24, color: "#5c574f" }}>
          15 perguntas · do básico às integrações avançadas
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 56 }}>
          {["Iniciante", "Intermediário", "Avançado"].map((level) => (
            <div
              key={level}
              style={{
                fontSize: 30,
                padding: "12px 28px",
                borderRadius: 999,
                background: "#b4532a",
                color: "#ffffff",
              }}
            >
              {level}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
