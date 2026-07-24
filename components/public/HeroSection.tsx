import { Building2, MapPin, Tag, MessageCircle, ShieldCheck } from "lucide-react";

export interface HeroStats {
  totalUmkm: number;
  totalDusun: number;
  totalKategori: number;
  totalWhatsApp: number;
}

export default function HeroSection({ stats }: { stats?: HeroStats }) {
  const displayTotalUmkm = stats?.totalUmkm || 0;
  const displayTotalDusun = stats?.totalDusun || 5;
  const displayTotalKategori = stats?.totalKategori || 10;
  const displayTotalWhatsApp = stats?.totalWhatsApp || 0;

  return (
    <section className="hero-gradient text-white py-14 sm:py-20 lg:py-24 relative shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-in mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/30 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              Desa Sugihan • Kec. Tengaran, Kab. Semarang
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 text-white animate-fade-in-up drop-shadow-sm">
            Direktori UMKM
            <br />
            <span className="text-amber-300">Desa Sugihan</span>
          </h1>

          {/* Description */}
          <p className="text-white/95 text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-200">
            Temukan berbagai produk dan jasa unggulan dari para pelaku UMKM di Desa Sugihan.
            Dukung perekonomian lokal dengan mengenal lebih dekat produk-produk berkualitas
            di sekitar kita.
          </p>

          {/* Dynamic Realtime Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up delay-300 pt-2 border-t border-white/20">
            {/* Stat 1: Total UMKM */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/15">
              <div className="flex items-center gap-2 text-amber-300 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {displayTotalUmkm > 0 ? displayTotalUmkm : "200+"}
                </span>
              </div>
              <div className="text-emerald-100 text-xs sm:text-sm font-medium">
                Total UMKM Terdaftar
              </div>
            </div>

            {/* Stat 2: Dusun */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/15">
              <div className="flex items-center gap-2 text-amber-300 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {displayTotalDusun}
                </span>
              </div>
              <div className="text-emerald-100 text-xs sm:text-sm font-medium">
                Dusun Tercakup
              </div>
            </div>

            {/* Stat 3: Kategori Usaha */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/15">
              <div className="flex items-center gap-2 text-amber-300 mb-1">
                <Tag className="w-4 h-4" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {displayTotalKategori}
                </span>
              </div>
              <div className="text-emerald-100 text-xs sm:text-sm font-medium">
                Kategori Usaha
              </div>
            </div>

            {/* Stat 4: Fast Response WA / Verifikasi */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/15">
              <div className="flex items-center gap-2 text-amber-300 mb-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {displayTotalWhatsApp > 0 ? displayTotalWhatsApp : "100%"}
                </span>
              </div>
              <div className="text-emerald-100 text-xs sm:text-sm font-medium">
                Kontak WA Langsung
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full border border-white/20 animate-float opacity-40 hidden lg:block" />
      <div className="absolute bottom-10 right-32 w-20 h-20 rounded-full border border-white/20 animate-float delay-500 opacity-30 hidden lg:block" />
    </section>
  );
}
