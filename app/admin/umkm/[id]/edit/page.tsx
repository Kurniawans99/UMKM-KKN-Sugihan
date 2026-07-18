import UmkmForm from "@/components/admin/UmkmForm";
import { updateUmkm } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Umkm } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit UMKM",
};

export default async function EditUmkmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const umkm = data as Umkm;

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateUmkm(id, formData);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/umkm"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Data UMKM
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Edit UMKM
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Edit data &quot;{umkm.nama_usaha}&quot;
        </p>
      </div>

      {/* Form */}
      <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 max-w-3xl">
        <UmkmForm umkm={umkm} action={handleUpdate} submitLabel="Update UMKM" />
      </div>
    </div>
  );
}
