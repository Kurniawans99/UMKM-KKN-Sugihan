"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { DUSUN_COORDINATES, SUGIHAN_CENTER } from "@/lib/constants";
import { MapPin, Crosshair, RotateCcw } from "lucide-react";

// Fix Leaflet default marker icon issue in Next.js
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerProps {
  defaultLat?: number | null;
  defaultLng?: number | null;
  dusun?: string;
}

// Sub-component: listen to click events on the map
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Sub-component: fly to new position when dusun changes
function FlyToHandler({ center }: { center: [number, number] }) {
  const map = useMap();
  const prevCenter = useRef(center);

  useEffect(() => {
    if (prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]) {
      map.flyTo(center, 16, { duration: 0.8 });
      prevCenter.current = center;
    }
  }, [center, map]);

  return null;
}

export default function LocationPicker({ defaultLat, defaultLng, dusun }: LocationPickerProps) {
  // Determine initial position: saved coords → dusun default → village center
  const getDusunCoords = (d?: string): [number, number] => {
    if (d && DUSUN_COORDINATES[d]) {
      return [DUSUN_COORDINATES[d].lat, DUSUN_COORDINATES[d].lng];
    }
    return [SUGIHAN_CENTER.lat, SUGIHAN_CENTER.lng];
  };

  const initialPos: [number, number] =
    defaultLat && defaultLng
      ? [defaultLat, defaultLng]
      : getDusunCoords(dusun);

  const [position, setPosition] = useState<[number, number]>(initialPos);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const hasUserPlaced = useRef(!!defaultLat);

  // When dusun changes and user hasn't manually placed a marker, move to dusun coords
  useEffect(() => {
    if (!hasUserPlaced.current && dusun) {
      const coords = getDusunCoords(dusun);
      setPosition(coords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dusun]);

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    hasUserPlaced.current = true;
    setGeoError(null);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Browser tidak mendukung geolocation");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        hasUserPlaced.current = true;
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(
          err.code === 1
            ? "Izin lokasi ditolak. Aktifkan izin lokasi di browser Anda."
            : "Gagal mendapatkan lokasi. Coba lagi."
        );
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleReset = () => {
    const coords = getDusunCoords(dusun);
    setPosition(coords);
    hasUserPlaced.current = false;
    setGeoError(null);
  };

  return (
    <div>
      <label className="form-label flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-emerald-600" />
        Lokasi di Peta
      </label>
      <p className="text-text-muted text-xs mb-3">
        Klik pada peta atau gunakan tombol &quot;Lokasi Saya&quot; untuk menentukan titik UMKM.
      </p>

      {/* Map Container */}
      <div className="rounded-xl overflow-hidden border-2 border-border shadow-sm">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={true}
          style={{ height: "280px", width: "100%" }}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={markerIcon} />
          <ClickHandler onMapClick={handleMapClick} />
          <FlyToHandler center={position} />
        </MapContainer>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={geoLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          <Crosshair className={`w-3.5 h-3.5 ${geoLoading ? "animate-spin" : ""}`} />
          {geoLoading ? "Mencari..." : "Lokasi Saya"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset ke Dusun
        </button>
        <span className="text-xs text-text-muted ml-auto">
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </span>
      </div>

      {/* Error */}
      {geoError && (
        <p className="text-danger text-xs mt-2">{geoError}</p>
      )}

      {/* Hidden Inputs for Form Submission */}
      <input type="hidden" name="latitude" value={position[0]} />
      <input type="hidden" name="longitude" value={position[1]} />
    </div>
  );
}
