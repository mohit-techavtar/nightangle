import React from "react";
import { useDrop } from "react-dnd";
import { LeadKanbanCard, KanbanLead, KanbanField } from "./LeadKanbanCard";

interface KanbanColumnProps {
  stage: { id: string; name: string; color: string; bgColor?: string };
  leads: KanbanLead[];
  onDrop: (leadId: string, targetStage: string) => void;
  onCardClick?: (leadId: string) => void;
  visibleFields: Set<KanbanField>;
  variant: "simple" | "gradient";
  totalValue?: number;
}

const ITEM_TYPE = "LEAD_CARD";

/** Hex (#RRGGBB) + alpha (00-FF) → 8-digit hex. */
const withAlpha = (hex: string, alpha: string) => `${hex}${alpha}`;

export function KanbanColumn({ stage, leads, onDrop, onCardClick, visibleFields, variant, totalValue }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => onDrop(item.id, stage.id),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [stage.id]);

  // Gradient (top → bottom): tinted stage color fading to white.
  const gradientStyle: React.CSSProperties =
    variant === "gradient"
      ? { background: `linear-gradient(180deg, ${withAlpha(stage.color, "26")} 0%, ${withAlpha(stage.color, "0D")} 22%, #FFFFFF 55%)` }
      : { background: stage.bgColor || "#FAFAFA" };

  return (
    <div className="flex-shrink-0 w-80 rounded-xl overflow-hidden border border-[#E0E0E0] bg-white flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-[#E0E0E0]"
        style={variant === "gradient"
          ? { background: `linear-gradient(180deg, ${withAlpha(stage.color, "26")} 0%, #FFFFFF 100%)`, borderTop: `4px solid ${stage.color}` }
          : { background: "#FFFFFF", borderTop: `4px solid ${stage.color}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
            <h3 className="text-sm font-semibold text-[#212121]">{stage.name}</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: stage.color }}>
            {leads.length}
          </span>
        </div>
        {totalValue !== undefined && totalValue > 0 && (
          <div className="text-xs text-[#616161] mt-1">₹{totalValue.toLocaleString("en-IN")}</div>
        )}
      </div>

      {/* Cards */}
      <div
        ref={drop}
        className="p-3 flex-1 min-h-[calc(100vh-260px)] max-h-[calc(100vh-260px)] overflow-y-auto transition-colors"
        style={isOver ? { background: "#E3F2FD" } : gradientStyle}
      >
        {leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[#9E9E9E] text-sm border-2 border-dashed border-[#E0E0E0] rounded-lg">
            Drop leads here
          </div>
        ) : (
          leads.map((lead) => (
            <LeadKanbanCard
              key={lead.id}
              lead={lead}
              onCardClick={onCardClick}
              visibleFields={visibleFields}
              variant={variant}
              stageColor={stage.color}
            />
          ))
        )}
      </div>
    </div>
  );
}
