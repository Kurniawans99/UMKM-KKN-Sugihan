import { createClient } from "@/lib/supabase/server";
import type { Umkm } from "@/lib/types";
import type { Metadata } from "next";
import ApprovalTable from "@/components/admin/ApprovalTable";

export const metadata: Metadata = { title: "Approval UMKM" };

export default async function AdminApprovalPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const statusFilter = params.status || "pending";

  let query = supabase
    .from("umkm")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data } = await query;

  const umkmList = (data || []) as Umkm[];

  // Counts per status
  const { count: pendingCount } = await supabase
    .from("umkm")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: approvedCount } = await supabase
    .from("umkm")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  const { count: rejectedCount } = await supabase
    .from("umkm")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected");

  const tabs = [
    { key: "pending", label: "Pending", count: pendingCount || 0, color: "badge-warning" },
    { key: "approved", label: "Disetujui", count: approvedCount || 0, color: "badge-success" },
    { key: "rejected", label: "Ditolak", count: rejectedCount || 0, color: "badge-danger" },
    { key: "all", label: "Semua", count: (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0), color: "bg-border-light text-text-secondary" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Approval UMKM</h1>
        <p className="text-text-muted text-sm mt-1">Review dan setujui pendaftaran UMKM baru</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href={`/admin/approval?status=${tab.key}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              statusFilter === tab.key
                ? "bg-primary text-white shadow-sm"
                : "bg-surface border border-border text-text-secondary hover:bg-border-light"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === tab.key ? "bg-white/20 text-white" : tab.color}`}>
              {tab.count}
            </span>
          </a>
        ))}
      </div>

      <ApprovalTable data={umkmList} />
    </div>
  );
}
