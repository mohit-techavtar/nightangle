import React from "react";
import { Check } from "lucide-react";

// ============================================================
// LeadStageTabs — gradient pipeline tabs for the Lead module.
// Each stage gets a distinct gradient; completed stages are
// filled, the active stage glows, future stages are muted.
// Renders as a connected "chevron" pipeline (Salesforce Path).
// ============================================================

export interface StageDef {
  key: string;
  label: string;
  /** tailwind gradient stops, e.g. "from-[#42A5F5] to-[#1565C0]" */
  gradient: string;
  count?: number;
}

export const DEFAULT_LEAD_STAGES: StageDef[] = [
  { key: "New",          label: "New",          gradient: "from-[#90CAF9] to-[#42A5F5]" },
  { key: "Contacted",    label: "Contacted",    gradient: "from-[#4FC3F7] to-[#0288D1]" },
  { key: "Qualified",    label: "Qualified",    gradient: "from-[#26C6DA] to-[#00897B]" },
  { key: "Proposal",     label: "Proposal",     gradient: "from-[#66BB6A] to-[#2E7D32]" },
  { key: "Negotiation",  label: "Negotiation",  gradient: "from-[#FFB74D] to-[#F57C00]" },
  { key: "Converted",    label: "Converted",    gradient: "from-[#AB47BC] to-[#6A1B9A]" },
];

interface LeadStageTabsProps {
  stages?: StageDef[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: "path" | "tabs";
}

export function LeadStageTabs({ stages = DEFAULT_LEAD_STAGES, activeKey, onChange, variant = "path" }: LeadStageTabsProps) {
  const activeIndex = stages.findIndex((s) => s.key === activeKey);

  if (variant === "tabs") {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {stages.map((s) => {
          const active = s.key === activeKey;
          return (
            <button key={s.key} onClick={() => onChange(s.key)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                active
                  ? `bg-gradient-to-r ${s.gradient} text-white shadow-md shadow-black/10 scale-[1.02]`
                  : "bg-white text-[#616161] border border-[#E0E0E0] hover:bg-[#F5F5F5]"
              }`}>
              {s.label}
              {s.count !== undefined && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${active ? "bg-white/25" : "bg-[#F5F5F5] text-[#616161]"}`}>{s.count}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // "path" — connected gradient chevrons
  return (
    <div className="flex items-stretch w-full overflow-x-auto rounded-xl shadow-sm">
      {stages.map((s, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        const filled = isDone || isActive;
        return (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            style={{
              clipPath: i === stages.length - 1
                ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%)"
                : i === 0
                ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
                : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)",
              marginLeft: i === 0 ? 0 : -10,
            }}
            className={`relative flex-1 min-w-[120px] px-5 py-3 text-sm font-semibold transition-all ${
              filled
                ? `bg-gradient-to-r ${s.gradient} text-white`
                : "bg-[#F5F5F5] text-[#9E9E9E] hover:bg-[#EEEEEE]"
            } ${isActive ? "ring-2 ring-inset ring-white/40" : ""}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              {isDone && <Check size={14} className="shrink-0" />}
              <span className="truncate">{s.label}</span>
              {s.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${filled ? "bg-white/25" : "bg-white text-[#9E9E9E]"}`}>{s.count}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
