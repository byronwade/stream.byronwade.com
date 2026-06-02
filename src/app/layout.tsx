import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL("https://stream.byronwade.com"),
  title: {
    default: "Stream — Live Platform Concept",
    template: "%s | Stream",
  },
  description:
    "Stream is a frontend-only streaming platform concept with mocked backend flows. Discovery, watch, clips, and creator studio.",
  applicationName: "Stream",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    title: "Stream — Live Platform Concept",
    description: "A frontend-only streaming platform concept with mocked backend flows.",
    type: "website",
    siteName: "Stream",
    url: "/",
    images: [{ url: "/og/default.svg", width: 1200, height: 630, type: "image/svg+xml" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stream — Live Platform Concept",
    description: "A frontend-only streaming platform concept with mocked backend flows.",
    images: ["/og/default.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070a12" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
  ],
};

// No-flash theme: runs before paint to set <html data-theme> from the stored
// preference (or the OS preference for "system"). Kept tiny and dependency-free.
const themeScript = `(function(){try{var s=localStorage.getItem('stream:v1:theme');var m=s?(JSON.parse(s).mode||'system'):'system';var d=m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;document.documentElement.setAttribute('data-theme',d);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
