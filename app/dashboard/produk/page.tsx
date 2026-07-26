import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UmkmProduct } from "@/lib/types";
import type { Metadata } from "next";
import ProductManager from "@/components/seller/ProductManager";
import UmkmSelector from "@/components/seller/UmkmSelector";

export const metadata: Metadata = { title: "Kelola Produk" };

export default async function DashboardProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ umkm_id?: string }>;
}) {
  const { umkm_id } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all seller's UMKMs
  const { data: umkmsData } = await supabase
    .from("umkm")
    .select("id, nama_usaha, status")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const umkms = (umkmsData || []) as { id: string; nama_usaha: string; status: string }[];

  if (umkms.length === 0) {
    redirect("/dashboard/umkm?action=new");
  }

  // Determine active UMKM
  const activeUmkm = umkm_id ? umkms.find((u) => u.id === umkm_id) || umkms[0] : umkms[0];

  const { data: products } = await supabase
    .from("umkm_products")
    .select("*")
    .eq("umkm_id", activeUmkm.id)
    .order("urutan", { ascending: true });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Produk & Layanan</h1>
        <p className="text-text-muted text-sm mt-1">
          Kelola katalog produk yang ditampilkan di halaman publik UMKM &quot;{activeUmkm.nama_usaha}&quot;
        </p>
      </div>

      {/* UMKM Selector if user has multiple UMKMs */}
      <UmkmSelector umkms={umkms} selectedId={activeUmkm.id} baseUrl="/dashboard/produk" />

      <ProductManager key={activeUmkm.id} umkmId={activeUmkm.id} products={(products || []) as UmkmProduct[]} />
    </div>
  );
}
