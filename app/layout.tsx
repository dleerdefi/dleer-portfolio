import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getPortfolioConfig } from "@/config/portfolio.config";
import { Providers } from "@/components/providers/Providers";

// Get configuration at build time
const config = getPortfolioConfig();

// Next.js 15: viewport must be separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: config.seo.title,
  description: config.seo.description,
  keywords: config.seo.keywords,
  authors: [{ name: config.seo.author }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: config.seo.title,
    description: config.seo.description,
    type: "website",
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
  // Get CDN URL from env for dynamic preconnect
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

  return (
    <html lang="en">
      <head>
        {/* Preconnect to CDN for faster image loading (only if CDN configured) */}
        {cdnUrl && (
          <>
            <link rel="preconnect" href={new URL(cdnUrl).origin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={new URL(cdnUrl).origin} />
          </>
        )}

        {/* Preload the Regular subset only (33 KB): it sets nearly every line on first paint.
            Bold (19 KB) and the full fonts load on use (app/styles/03-fonts.css). */}
        <link
          rel="preload"
          href="/fonts/JetBrainsMono-Regular.subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-mono antialiased bg-term-bg text-term-text min-h-screen">
        <Providers>
          <main className="relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}