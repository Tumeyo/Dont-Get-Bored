import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "../src/styles.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "nomin-erdene-date-request.ard2024.chatgpt.site";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "Wanna go on a date with me? I’ll bring the cheesy jokes—you bring that cute smile.",
    description: "Dinner at Terrazza, a walk, and a date invitation.",
    openGraph: {
      title: "Wanna go on a date with me? I’ll bring the cheesy jokes—you bring that cute smile.",
      description: "Dinner at Terrazza, a walk, and a date invitation.",
      type: "website",
      images: [{ url: imageUrl, width: 1731, height: 909, alt: "POV: you said you were bored, so I made a whole website" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Wanna go on a date with me? I’ll bring the cheesy jokes—you bring that cute smile.",
      description: "Dinner at Terrazza, a walk, and a date invitation.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
