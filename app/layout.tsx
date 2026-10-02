import type { Metadata, Viewport } from "next";
import { Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KyuFlorist - Fresh and Beautiful Flower Bouquet",
  description: "Toko bunga premium spesialis bouquet segar, bloom box, dan vas bunga estetik dengan pengiriman Same Day di Jabodetabek.",
  keywords: ["toko bunga", "kyuflorist", "bouquet bunga", "fresh flowers", "same day delivery florist", "hadiah wisuda", "bunga mawar"],
  icons: {
    icon: "/kyuflorist-logo.png",
    apple: "/kyuflorist-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B8B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${greatVibes.variable} font-poppins h-full`}>
      <body className="min-h-full bg-slate-50 text-slate-800 antialiased selection:bg-pink-100 selection:text-pink-600">
        {children}
      </body>
    </html>
  );
}
