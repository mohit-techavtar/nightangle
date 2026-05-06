import React from "react";
import { useDrag } from "react-dnd";
import { Phone, TrendingUp } from "lucide-react";

interface LeadKanbanCardProps {
  lead: {
    id: string;
    name: string;
    company: string;
    phone: string;
    source: string;
    sourceColor: string;
    score: number;
    owner: {
      name: string;
      avatar?: string;
      initials: string;
    };
    lastActivity: string;
  };
  onCardClick?: (leadId: string) => void;
}

const ITEM_TYPE = "LEAD_CARD";

export function LeadKanbanCard({ lead, onCardClick }: LeadKanbanCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: lead.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#2E7D32"; // Green
    if (score >= 60) return "#F57F17"; // Yellow
    if (score >= 40) return "#EF6C00"; // Orange
    return "#D32F2F"; // Red
  };

  return (
    <div
      ref={drag}
      onClick={() => onCardClick?.(lead.id)}
      className={`bg-white rounded-md border border-[#E0E0E0] p-3 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? "opacity-50 rotate-2 scale-95" : "opacity-100"
      }`}
    >
      {/* Lead Name & Company */}
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-[#212121] mb-0.5 line-clamp-1">
          {lead.name}
        </h4>
        <p className="text-xs text-[#9E9E9E] line-clamp-1">{lead.company}</p>
      </div>

      {/* Phone Number */}
      <div className="flex items-center gap-1.5 text-[#616161] mb-2">
        <Phone size={12} />
        <span className="text-xs">{lead.phone}</span>
      </div>

      {/* Footer: Source, Score, Owner, Last Activity */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Source Badge */}
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: lead.sourceColor }}
          >
            {lead.source}
          </span>

          {/* Lead Score */}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ backgroundColor: getScoreColor(lead.score) }}
            title={`Score: ${lead.score}`}
          >
            {lead.score}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Last Activity */}
          <span className="text-[10px] text-[#9E9E9E]">{lead.lastActivity}</span>

          {/* Owner Avatar */}
          {lead.owner.avatar ? (
            <img
              src={lead.owner.avatar}
              alt={lead.owner.name}
              className="w-6 h-6 rounded-full border border-[#E0E0E0]"
              title={lead.owner.name}
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center text-white text-[9px] font-semibold border border-[#E0E0E0]"
              title={lead.owner.name}
            >
              {lead.owner.initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
