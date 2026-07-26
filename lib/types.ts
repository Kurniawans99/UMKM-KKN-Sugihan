export interface Profile {
  id: string;
  nama_lengkap: string;
  no_whatsapp: string | null;
  role: "admin" | "seller";
  created_at: string;
}

export interface Umkm {
  id: string;
  user_id: string | null;
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
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  slug: string | null;
  banner_url: string | null;
  tagline: string | null;
  latitude: number | null;
  longitude: number | null;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

export interface UmkmProduct {
  id: string;
  umkm_id: string;
  nama_produk: string;
  deskripsi: string | null;
  harga: number | null;
  foto_url: string;
  is_available: boolean;
  urutan: number;
  created_at: string;
}

export interface UmkmGallery {
  id: string;
  umkm_id: string;
  foto_url: string;
  caption: string | null;
  urutan: number;
  created_at: string;
}

export type UmkmInsert = Omit<Umkm, "id" | "created_at" | "updated_at">;
export type UmkmUpdate = Partial<UmkmInsert>;
