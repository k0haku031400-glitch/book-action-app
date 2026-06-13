"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export function DashboardClient() {
  const [data, setData] = useState<Awaited<
    ReturnType<typeof fetchDashboard>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchDashboard();
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <DashboardContent
      stats={data.stats}
      overallProgress={data.overallProgress}
      bookProgress={data.bookProgress}
      todayTasks={data.todayTasks}
      totalBooks={data.totalBooks}
    />
  );
}

async function fetchDashboard() {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
}
