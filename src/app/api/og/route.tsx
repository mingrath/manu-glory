import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const vote = searchParams.get("vote") || "yes";
  const streak = searchParams.get("streak") || "0";
  const opponent = searchParams.get("opponent") || "their next opponent";
  const pct = searchParams.get("pct") || "50";

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
          backgroundColor: "#0A0A0F",
          backgroundImage:
            "radial-gradient(ellipse at 50% 30%, rgba(227,27,35,0.08) 0%, transparent 70%)",
          fontFamily: "sans-serif",
          color: "#F0EDE6",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "#6B6B7B",
            marginBottom: 8,
          }}
        >
          Unbeaten Streak
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 8,
            textShadow: "0 0 80px rgba(227,27,35,0.3)",
          }}
        >
          {streak}
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "#6B6B7B",
            marginBottom: 32,
          }}
        >
          Matches
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#D4A843",
            marginBottom: 8,
          }}
        >
          I voted {vote === "yes" ? "YES" : "NO"} &mdash;
        </div>
        <div
          style={{
            fontSize: 28,
          }}
        >
          United will {vote === "yes" ? "beat" : "not beat"} {opponent}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#6B6B7B",
            marginTop: 24,
          }}
        >
          {pct}% of fans agree
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
