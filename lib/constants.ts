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
