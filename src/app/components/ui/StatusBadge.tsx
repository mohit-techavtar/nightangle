import React from "react";

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Active: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", dot: "bg-[#2E7D32]" },
  Suspended: { bg: "bg-[#FFF3E0]", text: "text-[#E65100]", border: "border-[#FFCC80]", dot: "bg-[#E65100]" },
  Expired: { bg: "bg-[#FFEBEE]", text: "text-[#C62828]", border: "border-[#EF9A9A]", dot: "bg-[#C62828]" },
  Locked: { bg: "bg-[#F3E5F5]", text: "text-[#6A1B9A]", border: "border-[#CE93D8]", dot: "bg-[#6A1B9A]" },
  "Soft Deleted": { bg: "bg-[#ECEFF1]", text: "text-[#455A64]", border: "border-[#B0BEC5]", dot: "border border-[#455A64] bg-transparent" },
  "Pending Renewal": { bg: "bg-[#FFF8E1]", text: "text-[#F57F17]", border: "border-[#FFE082]", dot: "bg-[#F57F17] animate-pulse" },
  Trial: { bg: "bg-[#E3F2FD]", text: "text-[#1565C0]", border: "border-[#90CAF9]", dot: "border border-[#1565C0] bg-transparent" },
  Draft: { bg: "bg-[#F5F5F5]", text: "text-[#616161]", border: "border-[#E0E0E0]", dot: "" },
  Published: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", dot: "bg-[#2E7D32]" },
  Archived: { bg: "bg-[#ECEFF1]", text: "text-[#455A64]", border: "border-[#B0BEC5]", dot: "bg-[#455A64]" },
  Enabled: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", dot: "bg-[#2E7D32]" },
  Disabled: { bg: "bg-[#F5F5F5]", text: "text-[#616161]", border: "border-[#E0E0E0]", dot: "bg-[#9E9E9E]" },
  Assigned: { bg: "bg-[#E3F2FD]", text: "text-[#1565C0]", border: "border-[#90CAF9]", dot: "bg-[#1565C0]" },
  Terminated: { bg: "bg-[#FFEBEE]", text: "text-[#C62828]", border: "border-[#EF9A9A]", dot: "bg-[#C62828]" },
  Paid: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", dot: "bg-[#2E7D32]" },
  Pending: { bg: "bg-[#FFF8E1]", text: "text-[#F57F17]", border: "border-[#FFE082]", dot: "bg-[#F57F17]" },
  Failed: { bg: "bg-[#FFEBEE]", text: "text-[#C62828]", border: "border-[#EF9A9A]", dot: "bg-[#C62828]" },
  Monthly: { bg: "bg-[#E3F2FD]", text: "text-[#1565C0]", border: "border-[#90CAF9]", dot: "bg-[#1565C0]" },
  Yearly: { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]", dot: "bg-[#2E7D32]" },
  Custom: { bg: "bg-[#F3E5F5]", text: "text-[#6A1B9A]", border: "border-[#CE93D8]", dot: "bg-[#6A1B9A]" },
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles["Draft"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${size === "sm" ? "text-[11px]" : "text-[13px]"} font-semibold tracking-wider uppercase whitespace-nowrap`}>
      {style.dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />}
      {status}
    </span>
  );
}
