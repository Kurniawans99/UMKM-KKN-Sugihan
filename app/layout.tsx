import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Direktori UMKM Desa Sugihan",
    template: "%s | UMKM Desa Sugihan",
  },
  description:
    "Temukan berbagai produk dan jasa UMKM di Desa Sugihan. Katalog digital lengkap dengan kategori usaha dan lokasi dusun untuk mendukung perekonomian lokal.",
  keywords: [
    "UMKM",
    "Desa Sugihan",
    "direktori usaha",
    "produk lokal",
    "kuliner",
    "kerajinan",
    "jasa",
  ],
  authors: [{ name: "KKN Desa Sugihan" }],
  openGraph: {
    title: "Direktori UMKM Desa Sugihan",
    description:
      "Temukan berbagai produk dan jasa UMKM di Desa Sugihan. Katalog digital lengkap untuk mendukung perekonomian lokal.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
