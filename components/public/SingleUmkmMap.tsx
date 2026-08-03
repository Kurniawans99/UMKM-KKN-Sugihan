"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import type { Umkm } from "@/lib/types";
import { DUSUN_COORDINATES, SUGIHAN_CENTER } from "@/lib/constants";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Satellite,
  Map,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ─── Category Colors ────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Kuliner: "#ef4444",
  Kerajinan: "#f59e0b",
  Jasa: "#3b82f6",
  Pertanian: "#22c55e",
  Peternakan: "#a855f7",
  Agribisnis: "#14b8a6",
  Fashion: "#ec4899",
  Manufaktur: "#6366f1",
  Toko: "#f97316",
  Lainnya: "#64748b",
};

// ─── Tile Layers ─────────────────────────────────────────────────────────────
const TILE_LAYERS = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    label: "Peta",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    label: "Satelit",
  },
};

// ─── Pulse Marker Icon ────────────────────────────────────────────────────────
function createPulseIcon(kategori: string) {
  const color = CATEGORY_COLORS[kategori] || "#059669";
  return L.divIcon({
    className: "pulse-marker-wrapper",
    html: `
      <div class="pulse-marker-container" style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;">
        <!-- Pulse rings -->
        <div class="pulse-ring" style="
          position:absolute;
          width:48px;height:48px;
          border-radius:50%;
          background:${color};
          opacity:0.15;
          animation:markerPulse 2s ease-out infinite;
        "></div>
        <div class="pulse-ring" style="
          position:absolute;
          width:36px;height:36px;
          border-radius:50%;
          background:${color};
          opacity:0.25;
          animation:markerPulse 2s ease-out infinite 0.5s;
        "></div>
        <!-- Main pin -->
        <div style="
          position:relative;
          width:28px;height:28px;
          background:${color};
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 14px rgba(0,0,0,0.4);
          z-index:2;
        ">
          <div style="
            width:9px;height:9px;
            background:white;border-radius:50%;
            transform:rotate(45deg);
            margin:auto;margin-top:5px;
          "></div>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 42],
    popupAnchor: [0, -44],
  });
}

// ─── Dark-mode hook ────────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface SingleUmkmMapProps {
  umkm: Umkm;
}

export default function SingleUmkmMap({ umkm }: SingleUmkmMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [tileMode, setTileMode] = useState<"standard" | "satellite">("standard");
  const isDark = useDarkMode();

  useEffect(() => { setIsMounted(true); }, []);

  const dusunDefault = DUSUN_COORDINATES[umkm.dusun] || SUGIHAN_CENTER;
  const lat = umkm.latitude ?? dusunDefault.lat;
  const lng = umkm.longitude ?? dusunDefault.lng;
  const isExactLocation = Boolean(umkm.latitude && umkm.longitude);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  // For dark mode, switch standard → CartoDB dark
  const darkTile = {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  };

  const tile = tileMode === "satellite"
    ? TILE_LAYERS.satellite
    : isDark
      ? { ...TILE_LAYERS.standard, url: darkTile.url, attribution: darkTile.attribution }
      : TILE_LAYERS.standard;

  const markerIcon = createPulseIcon(umkm.kategori_usaha);

  if (!isMounted) {
    return <SingleMapSkeleton />;
  }

  return (
    <section className="mb-10 animate-fade-in-up" id="lokasi-umkm">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 text-primary" />
          </div>
          Lokasi Usaha
        </h2>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:shadow-md transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          Buka di Google Maps
        </a>
      </div>

      {/* ── Map Card ── */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-md">
        {/* Map */}
        <div className="relative" style={{ height: "420px" }}>
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            attributionControl={true}
            zoomControl={false}
          >
            <TileLayer attribution={tile.attribution} url={tile.url} />
            <ZoomControl position="bottomright" />
            <Marker position={[lat, lng]} icon={markerIcon}>
              <Popup>
                <div className="p-2.5 text-center min-w-[190px]">
                  <h4
                    className="font-bold text-sm mb-1"
                    style={{ color: "#0f172a" }}
                  >
                    {umkm.nama_usaha}
                  </h4>
                  <p
                    className="text-xs mb-3"
                    style={{ color: "#64748b" }}
                  >
                    Dusun {umkm.dusun}
                    {umkm.alamat_detail ? ` — ${umkm.alamat_detail}` : ""}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors w-full"
                    style={{ backgroundColor: "#059669", color: "white" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#047857"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#059669"; }}
                  >
                    <Navigation className="w-3 h-3" style={{ color: "white" }} />
                    <span style={{ color: "white" }}>Petunjuk Arah</span>
                  </a>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* ── Tile Toggle Button ── */}
          <div className="absolute top-3 left-3 z-[1000] flex rounded-xl overflow-hidden border border-border shadow-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
            <button
              onClick={() => setTileMode("standard")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                tileMode === "standard"
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-border-light"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Peta
            </button>
            <button
              onClick={() => setTileMode("satellite")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                tileMode === "satellite"
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-border-light"
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              Satelit
            </button>
          </div>
        </div>

        {/* ── Info Footer ── */}
        <div className="px-4 py-3.5 bg-border-light/60 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Address */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Dusun {umkm.dusun}
                  {umkm.alamat_detail && `, ${umkm.alamat_detail}`}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
                  {isExactLocation ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      Lokasi tepat telah dikonfirmasi
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      Lokasi umum dusun (belum dikonfirmasi)
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Coordinates */}
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted bg-surface border border-border rounded-lg px-2.5 py-1.5">
              <Info className="w-3 h-3 shrink-0" />
              <span className="font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function SingleMapSkeleton() {
  return (
    <section className="mb-10" id="lokasi-umkm">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
          <Navigation className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Lokasi Usaha</h2>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border shadow-md">
        <div className="h-[420px] bg-border-light animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <Navigation className="w-8 h-8 animate-spin" style={{ animationDuration: "2s" }} />
            <span className="text-sm">Memuat peta lokasi...</span>
          </div>
        </div>
        <div className="h-16 bg-border-light/60 border-t border-border animate-pulse" />
      </div>
    </section>
  );
}
