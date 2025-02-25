"use client";
import { checkExpiry } from "@/lib/checkExpiry";
import { ScanDetailStatus, ScanProps } from "@/lib/types";
import { useGateStatsStore } from "@/store/gateStats";
import React, { useEffect, useState } from "react";

interface GateAccessStatProps {
  label: string;
  percentage: number;
  color: string;
}

interface AccessProps {
  data: ScanProps[];
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

export function GateAccessStats({ data }: AccessProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { setStats, allowed, allowedWithRemarks, notAllowed } = useGateStatsStore();

  // Handle hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsHydrated(true);
    }
  }, []);

  // Calculate percentages only when new data arrives
  useEffect(() => {
    if (!isHydrated || !data.length) return;

    let allowedCount = 0;
    let allowedWithRemarksCount = 0;
    let notAllowedCount = 0;

    data.forEach((scanDetail) => {
      const isExpired = checkExpiry(scanDetail.expiryDate);
      const isDisabled = scanDetail.disabled === "true";
      const hasRemarks = scanDetail.remarks !== "No remarks" && scanDetail.remarks !== null;

      if (isExpired || isDisabled) {
        notAllowedCount++;
      } else if (!isExpired && scanDetail.disabled === "false" && hasRemarks) {
        allowedWithRemarksCount++;
      } else if (scanDetail.remarks === "No remarks" || scanDetail.remarks === null) {
        allowedCount++;
      }
    });

    const total = data.length;
    if (total > 0) {
      setStats(
        Math.round((allowedCount / total) * 100),
        Math.round((allowedWithRemarksCount / total) * 100),
        Math.round((notAllowedCount / total) * 100)
      );
    }
  }, [data, setStats, isHydrated]);

  // Don't render until hydrated
  if (!isHydrated) {
    return null;
  }

  return (
    <div className="space-y-4 w-full">
      <GateAccessStat
        label="Allowed"
        percentage={isHydrated ? allowed : 0}
        color="bg-[#00C853]"
      />
      <GateAccessStat
        label="Allowed with Remarks"
        percentage={isHydrated ? allowedWithRemarks : 0}
        color="bg-[#FFB300]"
      />
      <GateAccessStat
        label="Not Allowed"
        percentage={isHydrated ? notAllowed : 0}
        color="bg-[#F44336]"
      />
    </div>
  );
}
