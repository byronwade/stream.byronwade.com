import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stream — Live Platform Concept",
    template: "%s | Stream",
  },
  description:
    "Stream is a frontend-only streaming platform concept with mocked backend flows. Discovery, watch, clips, and creator studio.",
  openGraph: {
    title: "Stream — Live Platform Concept",
    description: "A frontend-only streaming platform concept with mocked backend flows.",
    type: "website",
    siteName: "Stream",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stream — Live Platform Concept",
    description: "A frontend-only streaming platform concept with mocked backend flows.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
