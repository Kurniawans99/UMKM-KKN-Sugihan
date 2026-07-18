import { createClient } from "@/lib/supabase/server";
import UmkmTable from "@/components/admin/UmkmTable";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola UMKM",
};

export default async function AdminUmkmPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("umkm")
    .select("*")
    .order("created_at", { ascending: false });

  const umkmList = (data || []) as Umkm[];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Data UMKM
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Kelola data UMKM Desa Sugihan ({umkmList.length} total)
          </p>
        </div>
        <Link href="/admin/umkm/tambah" className="btn-primary shrink-0" id="add-umkm-btn">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah UMKM
        </Link>
      </div>

      {/* Table */}
      <UmkmTable data={umkmList} />
    </div>
  );
}
