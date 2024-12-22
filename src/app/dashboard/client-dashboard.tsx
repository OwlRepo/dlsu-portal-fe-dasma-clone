'use client';

import { Building2, ArrowRightLeft, LogOut } from 'lucide-react';
import { StatisticsCard } from '@/components/statistics-card';
import { GateAccessStats } from '@/components/gate-access-stats';
import { LiveDataTable } from '@/components/live-data-table';

export function ClientDashboard() {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-medium">Access Counts Overview</h2>

      <div className="mb-6 grid grid-cols-12 gap-4">
        {/* Stats and Gate Access in same row */}
        <div className="col-span-8 grid grid-cols-3 gap-4">
          <StatisticsCard
            icon={<Building2 className="h-6 w-6 text-[#00C853]" />}
            count={15482}
            label="On Premise"
          />
          <StatisticsCard
            icon={<ArrowRightLeft className="h-6 w-6 text-[#00C853]" />}
            count={20000}
            label="Entry"
          />
          <StatisticsCard
            icon={<LogOut className="h-6 w-6 text-[#00C853]" />}
            count={4518}
            label="Exit"
          />
        </div>

        {/* Gate Access Stats */}
        <div className="col-span-4 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Gate Access Stats</h2>
          <GateAccessStats />
        </div>
      </div>

      {/* Live Data Table */}
      <LiveDataTable />
    </div>
  );
}
