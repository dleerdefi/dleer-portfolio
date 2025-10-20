import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getPortfolioConfig } from "@/config/portfolio.config";
import { SubtleBlobBackground } from "@/components/SubtleBlobBackground";
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
        <SubtleBlobBackground />
        <Providers>
          <main className="relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}