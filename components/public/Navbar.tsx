import Link from "next/link";
import Image from "next/image";
import { LogIn, Store } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/logo-kab-semarang.png"
                alt="Logo Kabupaten Semarang"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight block group-hover:text-emerald-700 transition-colors">
                UMKM Sugihan
              </span>
              <span className="text-[0.68rem] text-emerald-700 font-bold tracking-wider uppercase leading-tight block">
                Kab. Semarang
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors rounded-xl hover:bg-emerald-50"
            >
              Beranda
            </Link>
            <Link
              href="/daftar"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors rounded-xl hover:bg-emerald-50 hidden sm:flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Daftar UMKM</span>
            </Link>
            <Link
              href="/login"
              className="btn-primary text-sm !px-4 !py-2 shadow-sm hover:shadow-md rounded-xl flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
