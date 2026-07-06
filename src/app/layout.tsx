import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "AgriPulse — The Heartbeat of Smarter Farming",
    template: "%s | AgriPulse",
  },
  description:
    "From Farm to Market, Fair Prices for Every Farmer. Connect directly with Filipino farmers for fresh, affordable produce.",
  manifest: "/manifest.json",
  keywords: [
    "agricultural marketplace",
    "Filipino farmers",
    "fresh produce",
    "farm to table",
    "Philippines agriculture",
  ],
  authors: [{ name: "AgriPulse" }],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://agripulse.ph",
    title: "AgriPulse — The Heartbeat of Smarter Farming",
    description: "From Farm to Market, Fair Prices for Every Farmer.",
    siteName: "AgriPulse",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2E7D32",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
