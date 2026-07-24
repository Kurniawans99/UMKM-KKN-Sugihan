import Image from "next/image";
import { DAFTAR_DUSUN } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/logo-kab-semarang.png"
                  alt="Logo Kabupaten Semarang"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-white text-base block">
                  UMKM Desa Sugihan
                </span>
                <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase block">
                  Kab. Semarang
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Direktori digital UMKM Desa Sugihan, Kecamatan Tengaran,
              Kabupaten Semarang. Mendukung promosi dan penataan data pelaku
              usaha lokal.
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Informasi
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">📍</span> Desa Sugihan, Kec. Tengaran
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">🏛️</span> Program KKN
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">📊</span> Kategorisasi Data UMKM
              </li>
            </ul>
          </div>

          {/* Dusun */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Dusun Tercakup
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-400">
              {DAFTAR_DUSUN.map((dusun) => (
                <li key={dusun} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {dusun}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Direktori UMKM Desa Sugihan, Kab.
            Semarang — Program Kerja KKN
          </p>
        </div>
      </div>
    </footer>
  );
}

