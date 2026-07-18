export default function HeroSection() {
  return (
    <section className="hero-gradient text-white py-16 sm:py-20 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-in mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-sm font-medium backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Desa Sugihan
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 animate-fade-in-up">
            Direktori UMKM
            <br />
            <span className="text-emerald-200">Desa Sugihan</span>
          </h1>

          {/* Description */}
          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-200 opacity-0">
            Temukan berbagai produk dan jasa dari pelaku UMKM di Desa Sugihan.
            Dukung perekonomian lokal dengan mengenal lebih dekat usaha-usaha
            unggulan di lingkungan kita.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 sm:gap-10 animate-fade-in-up delay-300 opacity-0">
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold">5</div>
              <div className="text-emerald-200 text-xs sm:text-sm font-medium">
                Dusun Tercakup
              </div>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold">6</div>
              <div className="text-emerald-200 text-xs sm:text-sm font-medium">
                Kategori Usaha
              </div>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold">100%</div>
              <div className="text-emerald-200 text-xs sm:text-sm font-medium">
                Gratis Akses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full border-2 border-white/10 animate-float opacity-50 hidden lg:block" />
      <div className="absolute bottom-10 right-32 w-16 h-16 rounded-full border-2 border-white/10 animate-float delay-500 opacity-30 hidden lg:block" />
      <div className="absolute top-1/2 right-20 w-8 h-8 rounded-full bg-secondary/20 animate-float delay-300 hidden lg:block" />
    </section>
  );
}
