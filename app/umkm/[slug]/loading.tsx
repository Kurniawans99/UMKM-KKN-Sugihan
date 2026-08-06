import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function UmkmSlugLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Banner Skeleton */}
      <section className="relative h-48 sm:h-64 lg:h-80 bg-slate-200 animate-pulse">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-3">
            <div className="h-4 w-36 bg-white/30 rounded-lg animate-pulse" />
            <div className="h-8 sm:h-10 w-64 sm:w-96 bg-white/40 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-white/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Main Info Section Skeleton */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
            {/* Main Photo Skeleton */}
            <div className="aspect-square rounded-2xl bg-border-light animate-pulse shadow-md" />

            {/* Details Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-surface border border-border rounded-2xl p-5 sm:p-7 h-full space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-border-light rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-border-light rounded-full animate-pulse" />
                </div>
                <div className="h-8 w-64 bg-border-light rounded-xl animate-pulse" />
                <div className="h-4 w-40 bg-border-light rounded-lg animate-pulse" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full bg-border-light rounded-lg animate-pulse" />
                  <div className="h-4 w-5/6 bg-border-light rounded-lg animate-pulse" />
                  <div className="h-4 w-4/6 bg-border-light rounded-lg animate-pulse" />
                </div>
                {/* Buttons Skeleton */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="h-11 w-44 bg-border-light rounded-xl animate-pulse" />
                  <div className="h-11 w-36 bg-border-light rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          {/* Map Skeleton */}
          <section className="bg-surface border border-border rounded-2xl p-5 sm:p-7 mb-10 space-y-4">
            <div className="h-6 w-48 bg-border-light rounded-lg animate-pulse" />
            <div className="h-[280px] bg-border-light rounded-xl animate-pulse" />
          </section>

          {/* Products Skeleton */}
          <section className="space-y-4">
            <div className="h-6 w-48 bg-border-light rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface border border-border rounded-2xl p-4 space-y-3">
                  <div className="aspect-square bg-border-light rounded-xl animate-pulse" />
                  <div className="h-5 w-32 bg-border-light rounded-lg animate-pulse" />
                  <div className="h-4 w-20 bg-border-light rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
