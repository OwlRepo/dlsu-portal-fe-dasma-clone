'use client';

import { Building2, ArrowRightLeft, LogOut } from 'lucide-react';
import { StatisticsCard } from '@/components/dashboard/statistics-card';
import { GateAccessStats } from '@/components/dashboard/gate-access-stats';
import { LiveDataTable } from '@/components/dashboard/live-data-table';
import useUserToken from '@/lib/useUserToken';

export function Dashboard() {
  const { role } = useUserToken();

  console.log(role);
  return (
    <div className="p-6">
      <div>
        <h2 className="mb-4 text-lg font-medium">Access Counts Overview</h2>

        <div className="mb-6 grid grid-cols-12 gap-4">
          {/* Stats and Gate Access in same row */}
          <div className="col-span-6 grid grid-cols-3 gap-4">
            <StatisticsCard
              icon={<Building2 className="h-10 w-10 text-[#00bc65]" />}
              count={15482}
              label="On Premise"
            />
            <StatisticsCard
              icon={<ArrowRightLeft className="h-10 w-10 text-[#4fd1c5]" />}
              count={20000}
              label="Entry"
            />
            <StatisticsCard
              icon={<LogOut className="h-10 w-10 text-[#ee5f62]" />}
              count={4518}
              label="Exit"
            />
          </div>

          {/* Gate Access Stats */}
          <div className="col-span-6 rounded-lg p-6">
            <h2 className="mb-4 text-lg font-medium">Gate Access Stats</h2>
            <GateAccessStats />
          </div>
        </div>

        {/* Live Data Table */}
        <LiveDataTable />
      </div>
    </div>
  );
}
