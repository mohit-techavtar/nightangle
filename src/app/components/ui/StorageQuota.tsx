import React from "react";
import { HardDrive, AlertTriangle, TrendingUp } from "lucide-react";

interface StorageQuotaProps {
  used: number; // in MB
  total: number; // in MB
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export function StorageQuota({ used, total, size = "md", showDetails = true }: StorageQuotaProps) {
  const percentage = (used / total) * 100;
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;

  const formatSize = (mb: number) => {
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive size={16} className={`${isCritical ? 'text-[#C62828]' : isWarning ? 'text-[#F57F17]' : 'text-[#1565C0]'}`} />
          <span className="text-sm font-semibold text-[#212121]">Storage Usage</span>
        </div>
        {showDetails && (
          <span className="text-sm text-[#616161]">
            {formatSize(used)} / {formatSize(total)}
          </span>
        )}
      </div>
      
      <div className={`w-full bg-[#E0E0E0] rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all ${
            isCritical ? 'bg-[#C62828]' : isWarning ? 'bg-[#F57F17]' : 'bg-[#1565C0]'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${isCritical ? 'text-[#C62828]' : isWarning ? 'text-[#F57F17]' : 'text-[#616161]'}`}>
          {percentage.toFixed(1)}% used
        </span>
        {(isWarning || isCritical) && (
          <span className={`flex items-center gap-1 ${isCritical ? 'text-[#C62828]' : 'text-[#F57F17]'}`}>
            <AlertTriangle size={12} />
            {isCritical ? 'Critical' : 'Warning'}
          </span>
        )}
      </div>
    </div>
  );
}

export function StorageCard({ used, total, planName, onUpgrade }: { 
  used: number; 
  total: number; 
  planName: string;
  onUpgrade: () => void;
}) {
  const percentage = (used / total) * 100;
  const isCritical = percentage >= 95;
  const isWarning = percentage >= 80;

  const formatSize = (mb: number) => {
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-4 ${
      isCritical ? 'border-[#C62828] bg-[#FFEBEE]/30' : 
      isWarning ? 'border-[#F57F17] bg-[#FFF8E1]/30' : 
      'border-[#E0E0E0]'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs text-[#616161] uppercase font-semibold block mb-2">Storage Quota</span>
          <div className="flex items-center gap-2">
            <HardDrive size={24} className={`${isCritical ? 'text-[#C62828]' : isWarning ? 'text-[#F57F17]' : 'text-[#1565C0]'}`} />
            <div>
              <div className="text-lg font-bold text-[#212121]">{formatSize(used)}</div>
              <div className="text-xs text-[#616161]">of {formatSize(total)}</div>
            </div>
          </div>
        </div>
        {isCritical && (
          <div className="w-10 h-10 rounded-full bg-[#C62828] flex items-center justify-center">
            <AlertTriangle className="text-white" size={20} />
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${
              isCritical ? 'bg-[#C62828]' : isWarning ? 'bg-[#F57F17]' : 'bg-[#1565C0]'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[#616161]">{percentage.toFixed(1)}% used</span>
          <span className="text-xs text-[#616161]">{planName} Plan</span>
        </div>
      </div>

      {(isWarning || isCritical) && (
        <div className={`mb-3 p-2 rounded text-xs ${
          isCritical ? 'bg-[#FFEBEE] text-[#C62828]' : 'bg-[#FFF8E1] text-[#F57F17]'
        }`}>
          {isCritical ? '⚠️ Critical: Storage almost full' : '⚡ Warning: Storage running low'}
        </div>
      )}

      <button
        onClick={onUpgrade}
        className={`w-full h-9 rounded-md text-sm font-medium transition-colors ${
          isCritical 
            ? 'bg-[#C62828] text-white hover:bg-[#B71C1C]'
            : 'bg-[#1565C0] text-white hover:bg-[#0D47A1]'
        }`}
      >
        {isCritical ? 'Upgrade Now' : 'Upgrade Storage'}
      </button>
    </div>
  );
}
