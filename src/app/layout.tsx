import type { Metadata } from "next";
import { Syne, Syncopate } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Chessiro Capsule | Your Chess Year Wrapped",
  description: "Discover your chess journey with beautiful shareable cards. View your 2025 chess stats, ratings, achievements, and more.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "Chessiro Capsule",
    description: "Your Chess Year Wrapped",
    siteName: "Chessiro",
    type: "website",
    images: [
      {
        url: "/Chessiro-light.png",
        width: 512,
        height: 512,
        alt: "Chessiro Capsule",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chessiro Capsule",
    description: "Your Chess Year Wrapped",
    images: ["/Chessiro-light.png"],
  },
  other: {
    "theme-color": "#0a0908",
    "msapplication-TileColor": "#0a0908",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${syncopate.variable} antialiased bg-black text-white font-syne`}
        style={{
          ['--font-syne' as any]: syne.style.fontFamily,
          ['--font-syncopate' as any]: syncopate.style.fontFamily,
        }}
      >
        {children}
      </body>
    </html>
  );
}
