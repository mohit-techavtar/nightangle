import React from "react";
import { Check, ChevronRight, Trophy, X } from "lucide-react";

export interface PathStage {
  id: string;
  name: string;
  probability?: number;
  category?: "open" | "won" | "lost";
}

interface DealStagePathProps {
  stages: PathStage[];
  currentStageId: string;
  status?: "open" | "won" | "lost";
  onStageClick?: (stageId: string) => void;
  onMarkComplete?: () => void;
}

/**
 * Salesforce-style "Sales Path" component.
 * Renders a chevron-shaped stage progression bar with current stage highlighted,
 * completed stages in green, and a "Mark Stage as Complete" action at the end.
 */
export function DealStagePath({
  stages,
  currentStageId,
  status = "open",
  onStageClick,
  onMarkComplete,
}: DealStagePathProps) {
  const currentIndex = stages.findIndex(s => s.id === currentStageId);
  const isClosed = status === "won" || status === "lost";

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
      <div className="flex items-center gap-0 flex-wrap">
        <div className="flex items-center flex-1 min-w-0">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentIndex || (status === "won" && stage.category === "won");
            const isCurrent = idx === currentIndex;
            const isLost = status === "lost" && stage.category === "lost";
            const isFuture = idx > currentIndex && !isLost;

            let bgColor = "bg-[#F5F5F5]";
            let textColor = "text-[#616161]";
            let borderColor = "border-[#E0E0E0]";

            if (isCompleted) {
              bgColor = "bg-[#E8F5E9]";
              textColor = "text-[#2E7D32]";
              borderColor = "border-[#A5D6A7]";
            } else if (isCurrent) {
              bgColor = "bg-[#1565C0]";
              textColor = "text-white";
              borderColor = "border-[#1565C0]";
            } else if (isLost) {
              bgColor = "bg-[#FFEBEE]";
              textColor = "text-[#C62828]";
              borderColor = "border-[#FFCDD2]";
            }

            return (
              <button
                key={stage.id}
                onClick={() => onStageClick?.(stage.id)}
                disabled={isClosed}
                className={`relative flex items-center justify-center px-4 py-3 text-xs font-medium border-y border-l first:rounded-l-md last:rounded-r-md min-w-[110px] flex-1 transition-colors ${bgColor} ${textColor} ${borderColor} ${!isClosed ? "hover:brightness-95 cursor-pointer" : "cursor-default"}`}
                style={{
                  clipPath: idx === stages.length - 1
                    ? undefined
                    : "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)",
                  paddingLeft: idx === 0 ? "16px" : "22px",
                  paddingRight: idx === stages.length - 1 ? "16px" : "22px",
                  marginRight: idx === stages.length - 1 ? "0" : "-6px",
                }}
              >
                {isCompleted && <Check size={12} className="mr-1 shrink-0" />}
                {status === "won" && stage.category === "won" && <Trophy size={12} className="mr-1 shrink-0" />}
                {status === "lost" && stage.category === "lost" && <X size={12} className="mr-1 shrink-0" />}
                <span className="truncate">{stage.name}</span>
              </button>
            );
          })}
        </div>

        {!isClosed && onMarkComplete && (
          <button
            onClick={onMarkComplete}
            className="ml-3 px-4 h-10 rounded-md bg-[#2E7D32] text-white text-sm font-medium hover:bg-[#1B5E20] inline-flex items-center gap-2 shrink-0"
          >
            <Check size={14} />
            Mark Stage as Complete
          </button>
        )}
      </div>

      {/* Probability indicator below */}
      {!isClosed && currentIndex >= 0 && (
        <div className="mt-3 flex items-center gap-3 text-xs">
          <div className="text-[#616161]">
            Current stage: <span className="font-medium text-[#212121]">{stages[currentIndex]?.name}</span>
          </div>
          {stages[currentIndex]?.probability !== undefined && (
            <div className="text-[#616161]">
              Probability: <span className="font-medium text-[#1565C0]">{stages[currentIndex].probability}%</span>
            </div>
          )}
        </div>
      )}

      {status === "won" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[#2E7D32] font-medium">
          <Trophy size={14} /> Deal Won — Congratulations!
        </div>
      )}
      {status === "lost" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[#C62828] font-medium">
          <X size={14} /> Deal Lost
        </div>
      )}
    </div>
  );
}
