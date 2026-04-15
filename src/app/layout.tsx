import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Focus Dashboard",
  description: "Minimal dark dashboard with timer, notes, and music."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
