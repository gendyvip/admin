import React, { Suspense, useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { dashboardService } from "@/api/dashboard";
import { IconRefresh } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Enhanced skeleton loader for dashboard
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Skeleton cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 lg:px-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-40 w-full rounded-xl bg-card p-4 flex flex-col justify-between shadow-xs border">
          <div>
            <Skeleton className="h-4 w-32 mb-3 rounded" /> {/* CardDescription */}
            <Skeleton className="h-8 w-40 mb-2 rounded" /> {/* CardTitle */}
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2 rounded" /> {/* Badge/Action */}
            <Skeleton className="h-3 w-48 mb-1 rounded" /> {/* Footer line 1 */}
            <Skeleton className="h-3 w-36 rounded" /> {/* Footer line 2 */}
          </div>
        </div>
      ))}
    </div>
    {/* Skeleton chart area */}
    <div className="px-4 lg:px-6">
      <div className="rounded-xl bg-card shadow-xs border p-6 flex flex-col gap-4">
        <Skeleton className="h-5 w-40 mb-2 rounded" /> {/* Chart title */}
        <Skeleton className="h-4 w-32 mb-4 rounded" /> {/* Chart description */}
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-40 w-full rounded" /> {/* Chart area */}
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    dashboardService
      .getFintechInsights()
      .then((res) => {
        setData(res.data || res); // handle both {data: ...} and direct object
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching dashboard data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          className="ml-4 px-3 py-1 bg-primary text-white rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end px-4 lg:px-6">
        <Button
          onClick={fetchData}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <IconRefresh className={`h-4 w-4 mr-2${loading ? ' animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      {/* Section Cards - Load immediately */}
      <Suspense fallback={<DashboardSkeleton />}>
        <SectionCards data={data} />
      </Suspense>

      {/* Chart Area - Load with suspense */}
      <div className="px-4 lg:px-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <ChartAreaInteractive data={data} />
        </Suspense>
      </div>
    </div>
  );
}
