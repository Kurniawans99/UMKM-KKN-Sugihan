"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { DUSUN_COORDINATES, SUGIHAN_CENTER } from "@/lib/constants";
import { MapPin, Tag, ArrowUpRight, Navigation } from "lucide-react";

// Category-based marker colors
const CATEGORY_COLORS: Record<string, string> = {
  "Kuliner": "#ef4444",
  "Kerajinan": "#f59e0b",
  "Jasa": "#3b82f6",
  "Pertanian": "#22c55e",
  "Peternakan": "#a855f7",
  "Agribisnis": "#14b8a6",
  "Fashion": "#ec4899",
  "Manufaktur": "#6366f1",
  "Toko": "#f97316",
  "Lainnya": "#64748b",
};

function createCategoryIcon(kategori: string) {
  const color = CATEGORY_COLORS[kategori] || "#64748b";
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 32px; height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          width: 10px; height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

// Add a tiny offset to prevent markers from stacking exactly on dusun center
function getJitteredCoords(umkm: Umkm): [number, number] {
  if (umkm.latitude && umkm.longitude) {
    return [umkm.latitude, umkm.longitude];
  }
  const dusunCoords = DUSUN_COORDINATES[umkm.dusun];
  const base = dusunCoords
    ? { lat: dusunCoords.lat, lng: dusunCoords.lng }
    : { lat: SUGIHAN_CENTER.lat, lng: SUGIHAN_CENTER.lng };

  // Deterministic jitter based on UMKM id to prevent overlap
  const hash = umkm.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = 0.0003 + (hash % 10) * 0.00005;

  return [
    base.lat + radius * Math.cos(angle),
    base.lng + radius * Math.sin(angle),
  ];
}

// Sub-component: Fit map bounds to show all markers
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }, [positions, map]);

  return null;
}

interface UmkmMapProps {
  umkmList: Umkm[];
}

export default function UmkmMap({ umkmList }: UmkmMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // SSR placeholder
    return (
      <section className="mb-12" id="peta-umkm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Peta UMKM Desa Sugihan
            </h2>
            <p className="text-sm text-slate-500">
              Temukan lokasi UMKM terdekat di sekitar Anda
            </p>
          </div>
        </div>
        <div className="h-[400px] sm:h-[480px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
          <span className="text-slate-400 text-sm">Memuat peta...</span>
        </div>
      </section>
    );
  }

  const markersData = umkmList.map((umkm) => ({
    umkm,
    position: getJitteredCoords(umkm),
  }));

  const allPositions = markersData.map((m) => m.position);

  // Unique categories for the legend
  const categories = [...new Set(umkmList.map((u) => u.kategori_usaha))].sort();

  return (
    <section className="mb-12" id="peta-umkm">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Peta UMKM Desa Sugihan
          </h2>
          <p className="text-sm text-slate-500">
            Temukan lokasi {umkmList.length} UMKM terdekat di sekitar Anda
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
        <MapContainer
          center={[SUGIHAN_CENTER.lat, SUGIHAN_CENTER.lng]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "480px", width: "100%" }}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {allPositions.length > 0 && <FitBounds positions={allPositions} />}

          {markersData.map(({ umkm, position }) => (
            <Marker
              key={umkm.id}
              position={position}
              icon={createCategoryIcon(umkm.kategori_usaha)}
            >
              <Popup>
                <div className="w-[240px]">
                  {/* Popup Image */}
                  <div className="relative h-28 w-full">
                    <Image
                      src={umkm.foto_url}
                      alt={umkm.nama_usaha}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold backdrop-blur-sm"
                        style={{ backgroundColor: CATEGORY_COLORS[umkm.kategori_usaha] || "#64748b" }}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {umkm.kategori_usaha}
                      </span>
                    </div>
                  </div>

                  {/* Popup Content */}
                  <div className="p-3">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1 line-clamp-1">
                      {umkm.nama_usaha}
                    </h3>
                    <p className="text-slate-500 text-[11px] mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      Dusun {umkm.dusun}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed mb-3 line-clamp-2">
                      {umkm.deskripsi}
                    </p>
                    <Link
                      href={`/umkm/${umkm.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors w-full justify-center"
                    >
                      Lihat Detail
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm"
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
