export interface Umkm {
  id: string;
  nama_usaha: string;
  nama_pemilik: string;
  deskripsi: string;
  kategori_usaha: string;
  dusun: string;
  alamat_detail: string | null;
  no_whatsapp: string;
  foto_url: string;
  link_eksternal: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UmkmInsert = Omit<Umkm, "id" | "created_at" | "updated_at">;
export type UmkmUpdate = Partial<UmkmInsert>;
