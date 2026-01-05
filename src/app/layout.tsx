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
  description: "Discover your chess journey with beautiful shareable cards",
  icons: {
    icon: "/Chessiro-light.png",
    apple: "/Chessiro-light.png",
  },
  openGraph: {
    title: "Chessiro Capsule",
    description: "Your Chess Year Wrapped",
    siteName: "Chessiro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chessiro Capsule",
    description: "Your Chess Year Wrapped",
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
