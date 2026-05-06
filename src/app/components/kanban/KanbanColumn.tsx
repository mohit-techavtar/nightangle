import React from "react";
import { useDrop } from "react-dnd";
import { LeadKanbanCard } from "./LeadKanbanCard";

interface Lead {
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
}

interface KanbanColumnProps {
  stage: {
    id: string;
    name: string;
    color: string;
    bgColor?: string;
  };
  leads: Lead[];
  onDrop: (leadId: string, targetStage: string) => void;
  onCardClick?: (leadId: string) => void;
}

const ITEM_TYPE = "LEAD_CARD";

export function KanbanColumn({ stage, leads, onDrop, onCardClick }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => onDrop(item.id, stage.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      className="flex-shrink-0 w-80 bg-[#FAFAFA] rounded-lg overflow-hidden"
      style={{ borderTop: `4px solid ${stage.color}` }}
    >
      {/* Column Header */}
      <div className="px-4 py-3 bg-white border-b border-[#E0E0E0]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#212121]">{stage.name}</h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: stage.color }}
          >
            {leads.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={drop}
        className={`p-3 min-h-[calc(100vh-240px)] max-h-[calc(100vh-240px)] overflow-y-auto transition-colors ${
          isOver ? "bg-[#E3F2FD]" : stage.bgColor || "bg-[#FAFAFA]"
        }`}
      >
        {leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[#9E9E9E] text-sm">
            No leads
          </div>
        ) : (
          leads.map((lead) => (
            <LeadKanbanCard key={lead.id} lead={lead} onCardClick={onCardClick} />
          ))
        )}
      </div>
    </div>
  );
}
