import { ImageResponse } from "next/og";

// Favicon mirroring the gem-cut "O" mark (components/layout/Logo.tsx).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fb923c 0%, #f43f5e 52%, #8b5cf6 100%)",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: 9999,
            border: "3.5px solid #ffffff",
          }}
        />
      </div>
    ),
    size
  );
}
