import React, { Suspense } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

const data = [];

// Loading component for dashboard sections
const DashboardLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Section Cards - Load immediately */}
      <Suspense fallback={<DashboardLoader />}>
        <SectionCards />
      </Suspense>

      {/* Chart Area - Load with suspense */}
      <div className="px-4 lg:px-6">
        <Suspense fallback={<DashboardLoader />}>
          <ChartAreaInteractive />
        </Suspense>
      </div>

      {/* Data Table - Load with suspense */}
      <Suspense fallback={<DashboardLoader />}>
        <DataTable data={data} />
      </Suspense>
    </div>
  );
}
