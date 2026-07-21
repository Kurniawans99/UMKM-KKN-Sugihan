import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Umkm, UmkmProduct } from "@/lib/types";
import type { Metadata } from "next";
import ProductManager from "@/components/seller/ProductManager";

export const metadata: Metadata = { title: "Kelola Produk" };

export default async function DashboardProdukPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: umkmData } = await supabase
    .from("umkm")
    .select("id, nama_usaha")
    .eq("user_id", user?.id)
    .maybeSingle();

  if (!umkmData) redirect("/dashboard/umkm");

  const umkm = umkmData as Pick<Umkm, "id" | "nama_usaha">;

  const { data: products } = await supabase
    .from("umkm_products")
    .select("*")
    .eq("umkm_id", umkm.id)
    .order("urutan", { ascending: true });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Produk & Layanan</h1>
        <p className="text-text-muted text-sm mt-1">Kelola produk yang ditampilkan di halaman UMKM Anda</p>
      </div>
      <ProductManager umkmId={umkm.id} products={(products || []) as UmkmProduct[]} />
    </div>
  );
}
