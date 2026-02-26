import type { Metadata } from "next";
import { anton, oswald, dmSans, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glory Glory Man United — Unbeaten Streak Tracker",
  description:
    "Vote on whether Manchester United will win their next match. Track the unbeaten streak. Glory Glory.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  other: {
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${oswald.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body className="font-body bg-bg text-text-primary antialiased">
        <a
          href="#vote"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-red focus:px-4 focus:py-2 focus:text-text-primary"
        >
          Skip to vote
        </a>
        <main>{children}</main>
      </body>
    </html>
  );
}
