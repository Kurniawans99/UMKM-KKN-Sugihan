import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Direktori UMKM Desa Sugihan — Kab. Semarang",
    template: "%s | UMKM Desa Sugihan",
  },
  description:
    "Temukan berbagai produk dan jasa UMKM di Desa Sugihan, Kec. Tengaran, Kab. Semarang. Katalog digital lengkap dengan kategori usaha dan lokasi dusun untuk mendukung perekonomian lokal.",
  keywords: [
    "UMKM",
    "Desa Sugihan",
    "Kabupaten Semarang",
    "Tengaran",
    "direktori usaha",
    "produk lokal",
    "kuliner",
    "kerajinan",
    "jasa",
  ],
  authors: [{ name: "KKN Desa Sugihan" }],
  openGraph: {
    title: "Direktori UMKM Desa Sugihan — Kab. Semarang",
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
    <html lang="id" className={`${inter.variable} ${montserrat.variable} h-full antialiased`} style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}

