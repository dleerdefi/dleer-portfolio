import type { Metadata } from "next";
import "./globals.css";
import { getPortfolioConfig } from "@/config/portfolio.config";

// Get configuration at build time
const config = getPortfolioConfig();

export const metadata: Metadata = {
  title: config.seo.title,
  description: config.seo.description,
  keywords: config.seo.keywords,
  authors: [{ name: config.seo.author }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    title: config.seo.title,
    description: config.seo.description,
    type: "website",
    images: config.seo.ogImage ? [config.seo.ogImage] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    creator: config.seo.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono antialiased bg-term-bg text-term-text min-h-screen">
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}