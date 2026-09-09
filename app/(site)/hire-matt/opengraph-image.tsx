import { ImageResponse } from "next/og";

export const alt = "Matt McLennan — Web Developer and Growth Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background:
            "radial-gradient(circle at 82% 22%, #123f7d 0%, #0b0f1a 45%, #060912 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px 84px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(61,151,255,.45)",
            borderRadius: 999,
            color: "#8ec5ff",
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
            padding: "12px 22px",
            textTransform: "uppercase",
          }}
        >
          Web Developer · Growth Engineer
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1.02,
            marginTop: 34,
          }}
        >
          <span>Matt McLennan</span>
          <span style={{ color: "#3d97ff" }}>Developer. Marketer.</span>
          <span style={{ color: "#3d97ff" }}>Business Problem Solver.</span>
        </div>
        <div
          style={{
            color: "#aebed0",
            display: "flex",
            fontSize: 25,
            marginTop: 34,
          }}
        >
          Next.js · Technical SEO · Analytics · CRM · Automation
        </div>
      </div>
    ),
    size,
  );
}
