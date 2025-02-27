import React from 'react';
// import { Building2, ArrowRightLeft, LogOut } from 'lucide-react';

interface StatisticsCardProps {
  icon: React.ReactNode;
  count: number | null | undefined;
  label: string;
}

export function StatisticsCard({ icon, count, label }: StatisticsCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md">
      <div className="text-3xl font-bold">{count ?? 0}</div>
      <div>
        <div>{icon}</div>
        <div className="mt-1 text-lg">{label}</div>
      </div>
    </div>
  );
}
