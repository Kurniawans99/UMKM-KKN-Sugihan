import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg text-text-primary leading-tight block">
                UMKM Sugihan
              </span>
              <span className="text-[0.65rem] text-text-muted font-medium tracking-wide uppercase leading-tight block -mt-0.5">
                Direktori Digital
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-primary-50"
            >
              Beranda
            </Link>
            <Link
              href="/daftar"
              className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-primary-50 hidden sm:block"
            >
              Daftar UMKM
            </Link>
            <Link
              href="/login"
              className="btn-primary text-sm !px-4 !py-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
