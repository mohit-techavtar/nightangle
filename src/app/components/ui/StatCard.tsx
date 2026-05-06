import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "error" | "info" | "purple";
  subtitle?: string;
  trend?: { value: string; up: boolean };
}

const colorMap = {
  primary: { bg: "bg-[#E3F2FD]", icon: "text-[#1565C0]" },
  success: { bg: "bg-[#E8F5E9]", icon: "text-[#2E7D32]" },
  warning: { bg: "bg-[#FFF8E1]", icon: "text-[#F57F17]" },
  error: { bg: "bg-[#FFEBEE]", icon: "text-[#C62828]" },
  info: { bg: "bg-[#E3F2FD]", icon: "text-[#0277BD]" },
  purple: { bg: "bg-[#F3E5F5]", icon: "text-[#6A1B9A]" },
};

export function StatCard({ title, value, icon: Icon, color, subtitle, trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow min-h-[120px] flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.up ? "text-[#2E7D32]" : "text-[#C62828]"}`}>
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className="text-[28px] font-bold text-[#212121] leading-tight">{value}</div>
      <div className="text-xs text-[#616161] mt-1">{title}</div>
      {subtitle && <div className="text-[11px] text-[#9E9E9E] mt-0.5">{subtitle}</div>}
    </div>
  );
}
