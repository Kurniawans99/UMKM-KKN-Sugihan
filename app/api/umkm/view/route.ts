import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { umkmId } = await request.json();

    if (!umkmId) {
      return NextResponse.json({ error: "Missing umkmId" }, { status: 400 });
    }

    const supabase = await createClient();

    // Execute SECURITY DEFINER RPC to bypass RLS and update umkm.views_count & umkm_views atomically
    const { error: rpcError } = await supabase.rpc("increment_umkm_views", {
      target_umkm_id: umkmId,
    });

    if (rpcError) {
      console.error("RPC increment_umkm_views error:", rpcError);
      // Fallback: direct insert
      await supabase.from("umkm_views").insert({ umkm_id: umkmId });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error logging view:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
