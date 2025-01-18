import React from 'react';

interface GateAccessStatProps {
  label: string;
  percentage: number;
  color: string;
}

const GateAccessStat: React.FC<GateAccessStatProps> = ({
  label,
  percentage,
  color,
}) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${color}`} />
        <span>{label}</span>
      </div>
      <span>{percentage}%</span>
    </div>
    <div className="h-2 rounded-full bg-gray-100">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export function GateAccessStats() {
  return (
    <div className="space-y-4 w-full">
      <GateAccessStat label="Allowed" percentage={82} color="bg-[#00C853]" />
      <GateAccessStat
        label="Allowed with Remarks"
        percentage={61}
        color="bg-[#FFB300]"
      />
      <GateAccessStat
        label="Not Allowed"
        percentage={44}
        color="bg-[#F44336]"
      />
    </div>
  );
}
