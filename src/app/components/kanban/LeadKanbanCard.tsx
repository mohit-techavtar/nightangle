import React from "react";
import { useDrag } from "react-dnd";
import { Phone, Mail, Building2, Clock, IndianRupee } from "lucide-react";

export interface KanbanLead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  source: string;
  sourceColor: string;
  score: number;
  value?: number;
  owner: { name: string; avatar?: string; initials: string };
  lastActivity: string;
  tags?: string[];
}

/** Which fields the user has chosen to show on cards (field management — task 7). */
export type KanbanField = "company" | "phone" | "email" | "source" | "score" | "value" | "owner" | "lastActivity" | "tags";

interface LeadKanbanCardProps {
  lead: KanbanLead;
  onCardClick?: (leadId: string) => void;
  visibleFields: Set<KanbanField>;
  variant: "simple" | "gradient";
  stageColor: string;
}

const ITEM_TYPE = "LEAD_CARD";

function getScoreColor(score: number) {
  if (score >= 80) return "#2E7D32";
  if (score >= 60) return "#F57F17";
  if (score >= 40) return "#EF6C00";
  return "#D32F2F";
}

export function LeadKanbanCard({ lead, onCardClick, visibleFields, variant, stageColor }: LeadKanbanCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: lead.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [lead.id]);

  const show = (f: KanbanField) => visibleFields.has(f);

  return (
    <div
      ref={drag}
      onClick={() => onCardClick?.(lead.id)}
      className={`relative bg-white rounded-lg border border-[#E0E0E0] p-3 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? "opacity-50 rotate-2 scale-95" : "opacity-100"
      }`}
      style={variant === "gradient" ? { borderLeft: `3px solid ${stageColor}` } : undefined}
    >
      {/* Name & Company */}
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-[#212121] mb-0.5 line-clamp-1">{lead.name}</h4>
        {show("company") && (
          <p className="text-xs text-[#9E9E9E] line-clamp-1 flex items-center gap-1">
            <Building2 size={11} /> {lead.company}
          </p>
        )}
      </div>

      {show("phone") && (
        <div className="flex items-center gap-1.5 text-[#616161] mb-1.5">
          <Phone size={12} /> <span className="text-xs">{lead.phone}</span>
        </div>
      )}
      {show("email") && lead.email && (
        <div className="flex items-center gap-1.5 text-[#616161] mb-1.5">
          <Mail size={12} /> <span className="text-xs line-clamp-1">{lead.email}</span>
        </div>
      )}
      {show("value") && lead.value !== undefined && (
        <div className="flex items-center gap-1 text-[#2E7D32] mb-1.5 font-medium">
          <IndianRupee size={12} /> <span className="text-xs">{lead.value.toLocaleString("en-IN")}</span>
        </div>
      )}

      {show("tags") && lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {lead.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-[#F5F5F5] text-[#616161]">{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {show("source") && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: lead.sourceColor }}>
              {lead.source}
            </span>
          )}
          {show("score") && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
              style={{ backgroundColor: getScoreColor(lead.score) }} title={`Score: ${lead.score}`}>
              {lead.score}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {show("lastActivity") && (
            <span className="text-[10px] text-[#9E9E9E] flex items-center gap-1"><Clock size={10} /> {lead.lastActivity}</span>
          )}
          {show("owner") && (
            lead.owner.avatar ? (
              <img src={lead.owner.avatar} alt={lead.owner.name} className="w-6 h-6 rounded-full border border-[#E0E0E0]" title={lead.owner.name} />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center text-white text-[9px] font-semibold border border-[#E0E0E0]" title={lead.owner.name}>
                {lead.owner.initials}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
