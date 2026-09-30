import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "open-growth-agent — SEO + AI UGC that runs overnight",
  description:
    "Free open-source automated growth reactor. Not a research app. Connect a RankReactor API key and let SEO → content → AI UGC run while you sleep.",
  metadataBase: new URL("https://github.com/rankreactorai/open-growth-agent"),
  openGraph: {
    title: "open-growth-agent",
    description: "Free OSS SEO + AI UGC automated growth reactor. The agent works while you sleep.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${geist.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
