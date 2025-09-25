import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "David Leer | Terminal Portfolio",
  description: "Terminal-inspired portfolio showcasing expertise in DeFi, token economics, and Neo4j knowledge graphs for AI/LLM applications.",
  keywords: ["DeFi", "Token Economics", "Neo4j", "AI", "Knowledge Graphs", "Blockchain", "Solidity", "Smart Contracts"],
  authors: [{ name: "David Leer" }],
  openGraph: {
    title: "David Leer - DeFi Architect",
    description: "Terminal-inspired portfolio showcasing DeFi and blockchain expertise",
    type: "website",
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