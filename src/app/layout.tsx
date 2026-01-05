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
      { url: "/favicon.ico" },
      { url: "/Chessiro-light.png", sizes: "any", type: "image/png" }
    ],
    apple: "/Chessiro-light.png",
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
        className={`${syne.variable} ${syncopate.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
