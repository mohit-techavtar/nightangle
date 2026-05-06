import React from "react";

interface GaugeChartProps {
  value: number; // 0-100
  label: string;
  size?: number;
  color?: string;
}

export function GaugeChart({ value, label, size = 120, color = "#1565C0" }: GaugeChartProps) {
  const radius = size / 2 - 10;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  // Color based on value
  const getColor = () => {
    if (value >= 80) return "#2E7D32"; // Green
    if (value >= 60) return "#43A047"; // Light Green
    if (value >= 40) return "#F57F17"; // Yellow
    if (value >= 20) return "#EF6C00"; // Orange
    return "#D32F2F"; // Red
  };

  const gaugeColor = color || getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="8"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="8"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#212121]">{value}</div>
            <div className="text-xs text-[#9E9E9E]">/ 100</div>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-[#616161] mt-2 text-center">{label}</p>
    </div>
  );
}
