import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section Skeleton */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary-dark via-primary to-emerald-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="h-6 w-48 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 sm:h-12 w-3/4 max-w-2xl bg-white/30 rounded-2xl mx-auto animate-pulse" />
          <div className="h-5 w-1/2 max-w-md bg-white/20 rounded-xl mx-auto animate-pulse" />
        </div>
      </section>

      {/* Main Content Skeleton */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-7 w-48 bg-border-light rounded-xl animate-pulse" />
          <div className="h-5 w-24 bg-border-light rounded-lg animate-pulse" />
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs space-y-4">
              <div className="aspect-[4/3] bg-border-light animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-40 bg-border-light rounded-lg animate-pulse" />
                <div className="h-3 w-28 bg-border-light rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-border-light rounded-lg animate-pulse pt-2" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
