import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "weekly"; // daily | weekly | monthly

    const supabase = await createClient();

    // 1. Determine time threshold
    let hoursAgo = 24;
    if (timeframe === "weekly") hoursAgo = 24 * 7;
    if (timeframe === "monthly") hoursAgo = 24 * 30;

    const thresholdDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

    // 2. Query view logs within timeframe
    const { data: viewLogs } = await supabase
      .from("umkm_views")
      .select("umkm_id")
      .gte("created_at", thresholdDate);

    // Aggregate count per UMKM ID
    const countMap: Record<string, number> = {};
    if (viewLogs) {
      viewLogs.forEach((log) => {
        if (log.umkm_id) {
          countMap[log.umkm_id] = (countMap[log.umkm_id] || 0) + 1;
        }
      });
    }

    // 3. Fetch all active approved UMKM
    const { data: umkmList, error: umkmError } = await supabase
      .from("umkm")
      .select("*")
      .eq("status", "approved")
      .eq("is_active", true);

    if (umkmError || !umkmList) {
      return NextResponse.json({ error: "Failed to fetch UMKM" }, { status: 500 });
    }

    // Attach real view counts from database
    const mapped = umkmList.map((umkm) => {
      const timeframeViews = countMap[umkm.id] || 0;
      const totalViews = typeof umkm.views_count === "number" ? umkm.views_count : 0;
      const realViews = timeframeViews > 0 ? timeframeViews : totalViews;

      return {
        ...umkm,
        view_count: realViews,
        is_real: true,
      };
    });

    // Sort descending by view count
    mapped.sort((a, b) => b.view_count - a.view_count);

    return NextResponse.json({ popular: mapped.slice(0, 6) });
  } catch (err) {
    console.error("API error fetching popular UMKM:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
