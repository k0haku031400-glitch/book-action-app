"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

type DashboardData = Awaited<ReturnType<typeof fetchDashboard>>;

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboard()
      .then((result) => {
        setData(result);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [retryCount]);

  function retry() {
    setLoading(true);
    setRetryCount((c) => c + 1);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">データの取得に失敗しました</p>
        <button
          onClick={retry}
          className="text-sm underline text-muted-foreground hover:text-foreground"
        >
          再試行
        </button>
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
