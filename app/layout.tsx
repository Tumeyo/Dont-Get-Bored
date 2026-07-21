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
    title: "An unnecessarily elaborate question",
    description: "One question I clearly put more effort into than necessary.",
    openGraph: {
      title: "An unnecessarily elaborate question",
      description: "One question I clearly put more effort into than necessary.",
      type: "website",
      images: [{ url: imageUrl, width: 1731, height: 909, alt: "POV: you said you were bored, so I made a whole website" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "An unnecessarily elaborate question",
      description: "One question I clearly put more effort into than necessary.",
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
