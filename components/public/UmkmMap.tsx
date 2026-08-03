"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { DUSUN_COORDINATES, SUGIHAN_CENTER } from "@/lib/constants";
import {
  Navigation,
  MapPin,
  Tag,
  ArrowUpRight,
  Layers,
  Eye,
  LayoutGrid,
  Building2,
  Map as MapIcon,
  Satellite,
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
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

// ─── Create category-colored pin icon ────────────────────────────────────────
function createCategoryIcon(kategori: string, size: number = 32) {
  const color = CATEGORY_COLORS[kategori] || "#64748b";
  const inner = Math.round(size * 0.3);
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:3px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 3px 10px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="
          width:${inner}px;height:${inner}px;
          background:white;border-radius:50%;
          transform:rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// ─── Custom cluster icon with "UMKM" label ────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any): L.DivIcon {
  const count: number = cluster.getChildCount();
  // Color scale: green < 10, amber 10–99, red ≥ 100
  const color = count < 10 ? "#059669" : count < 100 ? "#f59e0b" : "#ef4444";
  const ringColor =
    count < 10
      ? "rgba(5,150,105,0.18)"
      : count < 100
        ? "rgba(245,158,11,0.18)"
        : "rgba(239,68,68,0.18)";
  const fontSize = count >= 100 ? "11px" : count >= 10 ? "13px" : "15px";

  return L.divIcon({
    html: [
      `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;">`,
      `  <div style="position:relative;width:54px;height:54px;display:flex;align-items:center;justify-content:center;">`,
      `    <div style="position:absolute;inset:0;border-radius:50%;background:${ringColor};border:2.5px solid ${color};"></div>`,
      `    <div style="width:42px;height:42px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">`,
      `      <span style="color:white;font-weight:800;font-size:${fontSize};font-family:Inter,system-ui,sans-serif;line-height:1;">${count}</span>`,
      `    </div>`,
      `  </div>`,
      `  <div style="background:white;color:${color};font-size:9px;font-weight:800;font-family:Inter,system-ui,sans-serif;padding:2px 8px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.14);border:1.5px solid ${color};white-space:nowrap;letter-spacing:0.06em;">UMKM</div>`,
      `</div>`,
    ].join(""),
    className: "custom-cluster-icon",
    iconSize: [54, 76],
    iconAnchor: [27, 76],
  });
}

// ─── Jitter coords to avoid stacking ─────────────────────────────────────────
function getJitteredCoords(umkm: Umkm): [number, number] {
  if (umkm.latitude && umkm.longitude) return [umkm.latitude, umkm.longitude];
  const base = DUSUN_COORDINATES[umkm.dusun] ?? SUGIHAN_CENTER;
  const hash = umkm.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = 0.0003 + (hash % 10) * 0.00005;
  return [base.lat + radius * Math.cos(angle), base.lng + radius * Math.sin(angle)];
}

// ─── Fit bounds sub-component ─────────────────────────────────────────────────
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    }
  }, [positions, map]);
  return null;
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

// ─── Main Component ────────────────────────────────────────────────────────────
interface UmkmMapProps {
  umkmList: Umkm[];
}

export default function UmkmMap({ umkmList }: UmkmMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [tileMode, setTileMode] = useState<"standard" | "satellite">("standard");
  const isDark = useDarkMode();

  useEffect(() => { setIsMounted(true); }, []);

  // Reset activeCategory if it no longer matches any items in the updated umkmList
  useEffect(() => {
    if (activeCategory && !umkmList.some((u) => u.kategori_usaha === activeCategory)) {
      setActiveCategory(null);
    }
  }, [umkmList, activeCategory]);

  if (!isMounted) {
    return <MapLoadingPlaceholder />;
  }

  // Filter markers by category
  const markersData = umkmList
    .filter((u) => !activeCategory || u.kategori_usaha === activeCategory)
    .map((umkm) => ({ umkm, position: getJitteredCoords(umkm) }));

  const allPositions = markersData.map((m) => m.position);
  const visibleCount = markersData.length;
  const dusunSet = new Set(markersData.map((m) => m.umkm.dusun));

  // Unique categories for filter chips
  const categories = [...new Set(umkmList.map((u) => u.kategori_usaha))].sort();

  const tile = tileMode === "satellite"
    ? TILE_LAYERS.satellite
    : isDark
      ? TILE_LAYERS.dark
      : TILE_LAYERS.standard;

  return (
    <section className="mb-12" id="peta-umkm">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-[var(--font-montserrat)]">
              Peta UMKM Desa Sugihan
            </h2>
            <p className="text-sm text-text-muted">
              Temukan lokasi {umkmList.length} UMKM di sekitar Anda
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary font-semibold">
            <Eye className="w-3.5 h-3.5" />
            {visibleCount} UMKM
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-text-secondary font-medium">
            <Building2 className="w-3.5 h-3.5" />
            {dusunSet.size} Dusun
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-text-secondary font-medium">
            <LayoutGrid className="w-3.5 h-3.5" />
            {categories.length} Kategori
          </div>
        </div>
      </div>

      {/* ── Category Filter Chips ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            activeCategory === null
              ? "bg-primary text-white border-primary shadow-sm"
              : "bg-surface text-text-secondary border-border hover:border-primary hover:text-primary"
          }`}
        >
          <Layers className="w-3 h-3" />
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeCategory === cat
                ? "text-white border-transparent shadow-sm"
                : "bg-surface text-text-secondary border-border hover:text-text-primary"
            }`}
            style={
              activeCategory === cat
                ? { backgroundColor: CATEGORY_COLORS[cat] || "#64748b", borderColor: CATEGORY_COLORS[cat] }
                : {}
            }
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: activeCategory === cat ? "white" : (CATEGORY_COLORS[cat] || "#64748b") }}
            />
            {cat}
          </button>
        ))}
      </div>

      {/* ── Map Container ── */}
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg">
        {/* Tile Toggle */}
        <div className="absolute top-3 left-3 z-[1000] flex rounded-xl overflow-hidden border border-border shadow-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <button
            onClick={() => setTileMode("standard")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              tileMode === "standard"
                ? "bg-primary text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-border-light"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
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

        <MapContainer
          center={[SUGIHAN_CENTER.lat, SUGIHAN_CENTER.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: "520px", width: "100%" }}
          attributionControl={true}
          zoomControl={true}
        >
          <TileLayer attribution={tile.attribution} url={tile.url} />
          {allPositions.length > 0 && <FitBounds positions={allPositions} />}

          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={60}
            spiderfyOnMaxZoom
            showCoverageOnHover={false}
            iconCreateFunction={createClusterIcon}
          >
            {markersData.map(({ umkm, position }) => (
              <Marker
                key={umkm.id}
                position={position}
                icon={createCategoryIcon(umkm.kategori_usaha, 32)}
              >
                <Popup minWidth={260} maxWidth={280}>
                  <div className="w-[260px] overflow-hidden rounded-xl">
                    {/* Image */}
                    <div className="relative h-32 w-full">
                      <Image
                        src={umkm.foto_url}
                        alt={umkm.nama_usaha}
                        fill
                        className="object-cover"
                        sizes="260px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Category badge */}
                      <span
                        className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
                        style={{ backgroundColor: CATEGORY_COLORS[umkm.kategori_usaha] || "#64748b" }}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {umkm.kategori_usaha}
                      </span>
                    </div>

                    {/* Content — use inline styles: Tailwind colors are overridden by Leaflet popup CSS */}
                    <div className="p-3.5">
                      <h3
                        className="font-bold text-sm leading-tight mb-1 line-clamp-1"
                        style={{ color: "#0f172a" }}
                      >
                        {umkm.nama_usaha}
                      </h3>
                      <p
                        className="text-[11px] mb-1 flex items-center gap-1"
                        style={{ color: "#64748b" }}
                      >
                        <MapPin className="w-3 h-3 shrink-0" style={{ color: "#059669" }} />
                        Dusun {umkm.dusun}
                      </p>
                      <p
                        className="text-xs leading-relaxed mb-3 line-clamp-2"
                        style={{ color: "#475569" }}
                      >
                        {umkm.deskripsi}
                      </p>
                      <Link
                        href={`/umkm/${umkm.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold w-full justify-center transition-colors"
                        style={{ backgroundColor: "#059669", color: "white" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#047857"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#059669"; }}
                      >
                        <span style={{ color: "white" }}>Lihat Detail</span>
                        <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "white" }} />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* ── Legend ── */}
      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-text-muted font-medium mr-1">Legenda:</span>
          {categories.map((cat) => (
            <div
              key={cat}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-xs font-medium text-text-primary shadow-sm"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] || "#64748b" }}
              />
              {cat}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function MapLoadingPlaceholder() {
  return (
    <section className="mb-12" id="peta-umkm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-[var(--font-montserrat)]">
            Peta UMKM Desa Sugihan
          </h2>
          <p className="text-sm text-text-muted">Temukan lokasi UMKM terdekat di sekitar Anda</p>
        </div>
      </div>
      <div className="h-[520px] rounded-2xl bg-border-light border border-border animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <Navigation className="w-8 h-8 animate-spin" style={{ animationDuration: "2s" }} />
          <span className="text-sm">Memuat peta...</span>
        </div>
      </div>
    </section>
  );
}
