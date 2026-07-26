"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ umkmId }: { umkmId: string }) {
  const isTracked = useRef(false);

  useEffect(() => {
    if (!umkmId || isTracked.current) return;
    isTracked.current = true;

    fetch("/api/umkm/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ umkmId }),
    }).catch((err) => {
      console.error("View tracking error:", err);
    });
  }, [umkmId]);

  return null;
}
