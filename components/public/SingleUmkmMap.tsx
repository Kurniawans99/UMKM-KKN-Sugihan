"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Umkm } from "@/lib/types";
import { DUSUN_COORDINATES, SUGIHAN_CENTER } from "@/lib/constants";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

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
        width: 36px; height: 36px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          width: 12px; height: 12px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

interface SingleUmkmMapProps {
  umkm: Umkm;
}

export default function SingleUmkmMap({ umkm }: SingleUmkmMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dusunDefault = DUSUN_COORDINATES[umkm.dusun] || SUGIHAN_CENTER;
  const lat = umkm.latitude ?? dusunDefault.lat;
  const lng = umkm.longitude ?? dusunDefault.lng;

  const isExactLocation = Boolean(umkm.latitude && umkm.longitude);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  if (!isMounted) {
    return (
      <section className="mb-10" id="lokasi-umkm">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-5 flex items-center gap-2">
          <Navigation className="w-6 h-6 text-primary" />
          Lokasi Usaha
        </h2>
        <div className="h-[350px] sm:h-[400px] rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
          <span className="text-slate-400 text-sm">Memuat peta lokasi...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10 animate-fade-in-up" id="lokasi-umkm">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
          <Navigation className="w-6 h-6 text-primary" />
          Lokasi Usaha
        </h2>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Buka di Google Maps
        </a>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Map Container */}
        <div className="relative h-[320px] sm:h-[380px] w-full">
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            attributionControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={createCategoryIcon(umkm.kategori_usaha)}>
              <Popup>
                <div className="p-2 text-center min-w-[180px]">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{umkm.nama_usaha}</h4>
                  <p className="text-slate-500 text-xs mb-2">
                    Dusun {umkm.dusun}
                    {umkm.alamat_detail ? ` (${umkm.alamat_detail})` : ""}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors w-full"
                  >
                    Petunjuk Arah
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-50/80 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Alamat:</strong> Dusun {umkm.dusun}
              {umkm.alamat_detail ? `, ${umkm.alamat_detail}` : ""}
              {!isExactLocation && (
                <span className="text-text-muted italic ml-1">(Lokasi umum dusun)</span>
              )}
            </span>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
          >
            Petunjuk Arah Rute Google Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
