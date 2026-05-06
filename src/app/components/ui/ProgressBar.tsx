import React from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({ value, max, showLabel = true, size = "sm" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const color = pct > 90 ? "bg-[#C62828]" : pct > 70 ? "bg-[#F57F17]" : "bg-[#2E7D32]";

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex-1 ${size === "sm" ? "h-1.5" : "h-2.5"} bg-[#EEEEEE] rounded-full overflow-hidden`}>
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <span className="text-xs text-[#616161] whitespace-nowrap font-mono">
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  label?: string;
}

export function CircularProgress({ value, max, size = 80, label }: CircularProgressProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct > 90 ? "#C62828" : pct > 70 ? "#F57F17" : "#2E7D32";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEEEEE" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-bold text-[#212121]">{Math.round(pct)}%</span>
      </div>
      {label && <span className="text-xs text-[#616161] mt-1">{label}</span>}
    </div>
  );
}
