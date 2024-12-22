import React from 'react';
// import { Building2, ArrowRightLeft, LogOut } from 'lucide-react';

interface StatisticsCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
}

export function StatisticsCard({ icon, count, label }: StatisticsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4">{icon}</div>
      <div className="text-3xl font-bold">{count}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
