import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/converter/header";
import { Footer } from "@/components/converter/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixora — Bulk Image to WebP Converter",
  description:
    "Convert multiple images (PNG, JPEG, WebP, SVG, GIF, BMP, TIFF, AVIF, ICO) to WebP in bulk. 100% private in-browser optimization with ZIP downloads.",
  openGraph: {
    title: "Pixora — Bulk Image to WebP Converter",
    description:
      "Batch convert PNG, JPG, WebP, SVG, GIF, BMP, TIFF, AVIF, and ICO files to WebP directly in your browser. 100% client-side privacy with batch ZIP export.",
    type: "website",
    siteName: "Pixora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixora — Bulk Image to WebP Converter",
    description:
      "Batch convert images to WebP directly in your browser with zero server uploads.",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/pixora-symbol.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  keywords: [
    "pixora",
    "webp converter",
    "bulk image converter",
    "image to webp",
    "batch webp optimizer",
    "png to webp",
    "jpg to webp",
    "svg to webp",
    "client-side image converter",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F3E9] text-[#25221E] selection:bg-[#E6D8C5] selection:text-[#25221E]">
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
