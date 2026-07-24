export const KATEGORI_USAHA = [
  "Kuliner",
  "Kerajinan",
  "Jasa",
  "Pertanian",
  "Peternakan",
  "Agribisnis",
  "Fashion",
  "Manufaktur",
  "Toko",
  "Lainnya",
] as const;

export const DAFTAR_DUSUN = [
  "Dukuhan",
  "Kalikendel",
  "Kwagean",
  "Kliwonan",
  "Krajan",
  "Rekesan",
  "Buyaran",
  "Gatak",
  "Pidikan"
] as const;

export type KategoriUsaha = (typeof KATEGORI_USAHA)[number];
export type Dusun = (typeof DAFTAR_DUSUN)[number];

// Koordinat pusat Desa Sugihan, Kec. Tengaran, Kab. Semarang
export const SUGIHAN_CENTER = { lat: -7.4354825, lng: 110.5543202 };

// Koordinat default per dusun (fallback jika UMKM belum set lokasi)
export const DUSUN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Dukuhan":    { lat: -7.43765506412718,  lng: 110.54943118420279 },
  "Kalikendel": { lat: -7.43049004049013,  lng: 110.55172744186235 },
  "Kwagean":    { lat: -7.437339677197299, lng: 110.55765904847864 },
  "Kliwonan":   { lat: -7.439093835319835, lng: 110.55427438983175 },
  "Krajan":     { lat: SUGIHAN_CENTER.lat, lng: SUGIHAN_CENTER.lng },
  "Rekesan":    { lat: SUGIHAN_CENTER.lat, lng: SUGIHAN_CENTER.lng },
  "Buyaran":    { lat: SUGIHAN_CENTER.lat, lng: SUGIHAN_CENTER.lng },
  "Gatak":      { lat: -7.448721800079765, lng: 110.55396863378975 },
  "Pidikan":    { lat: SUGIHAN_CENTER.lat, lng: SUGIHAN_CENTER.lng },
};
