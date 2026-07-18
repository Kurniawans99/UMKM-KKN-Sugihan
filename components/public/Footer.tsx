export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              <span className="font-bold text-text-primary">
                UMKM Desa Sugihan
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Direktori digital UMKM Desa Sugihan untuk menguatkan promosi dan
              penataan data pelaku usaha lokal.
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-text-primary mb-3 text-sm">
              Informasi
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>📍 Desa Sugihan</li>
              <li>🏛️ Program KKN</li>
              <li>📊 Kategorisasi Data UMKM</li>
            </ul>
          </div>

          {/* Dusun */}
          <div>
            <h4 className="font-semibold text-text-primary mb-3 text-sm">
              Dusun Tercakup
            </h4>
            <ul className="space-y-1.5 text-sm text-text-muted">
              <li>Dukuhan</li>
              <li>Kalikendel</li>
              <li>Kwagean</li>
              <li>Kliwonan</li>
              <li>Krajan</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-xs text-text-muted">
            © {new Date().getFullYear()} Direktori UMKM Desa Sugihan — Program
            Kerja KKN
          </p>
        </div>
      </div>
    </footer>
  );
}
