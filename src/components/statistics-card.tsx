import React from 'react';
// import { Building2, ArrowRightLeft, LogOut } from 'lucide-react';

interface StatisticsCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
}

export function StatisticsCard({ icon, count, label }: StatisticsCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md">
      <div className="text-3xl font-bold">{count}</div>
      <div>
        <div>{icon}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
