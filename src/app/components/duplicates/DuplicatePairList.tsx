import React from "react";
import { Mail, Phone, User, AlertCircle } from "lucide-react";

export interface DuplicatePair {
  id: string;
  leadA: {
    id: string;
    name: string;
    company: string;
  };
  leadB: {
    id: string;
    name: string;
    company: string;
  };
  confidence: number;
  matchType: "phone" | "email" | "name" | "multiple";
  matchedFields: string[];
}

interface DuplicatePairListProps {
  pairs: DuplicatePair[];
  selectedPairId: string | null;
  onSelectPair: (pairId: string) => void;
}

export function DuplicatePairList({ pairs, selectedPairId, onSelectPair }: DuplicatePairListProps) {
  const getMatchIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone size={14} />;
      case "email":
        return <Mail size={14} />;
      case "name":
        return <User size={14} />;
      case "multiple":
        return <AlertCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getMatchBadgeColor = (type: string) => {
    switch (type) {
      case "phone":
        return "bg-[#E3F2FD] text-[#1565C0] border-[#1565C0]/20";
      case "email":
        return "bg-[#F3E5F5] text-[#7C4DFF] border-[#7C4DFF]/20";
      case "name":
        return "bg-[#FFF8E1] text-[#F57F17] border-[#F57F17]/20";
      case "multiple":
        return "bg-[#FFEBEE] text-[#D32F2F] border-[#D32F2F]/20";
      default:
        return "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]";
    }
  };

  const getMatchLabel = (type: string) => {
    switch (type) {
      case "phone":
        return "Phone Match";
      case "email":
        return "Email Match";
      case "name":
        return "Name Match";
      case "multiple":
        return "Multiple Matches";
      default:
        return "Unknown";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-[#D32F2F]";
    if (confidence >= 70) return "text-[#F57F17]";
    return "text-[#1565C0]";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#E0E0E0]">
        <h2 className="text-lg font-semibold text-[#212121] mb-1">Duplicate Pairs</h2>
        <p className="text-xs text-[#9E9E9E]">
          {pairs.length} pair{pairs.length !== 1 ? "s" : ""} pending review
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {pairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-3">
              <AlertCircle size={32} className="text-[#2E7D32]" />
            </div>
            <p className="text-sm font-medium text-[#212121] mb-1">No duplicates found</p>
            <p className="text-xs text-[#9E9E9E]">All leads are unique</p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {pairs.map((pair) => (
              <button
                key={pair.id}
                onClick={() => onSelectPair(pair.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedPairId === pair.id
                    ? "border-[#1565C0] bg-[#E3F2FD] shadow-md"
                    : "border-[#E0E0E0] bg-white hover:border-[#1565C0]/50 hover:bg-[#FAFAFA]"
                }`}
              >
                {/* Lead Names */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#212121] truncate">
                      {pair.leadA.name}
                    </p>
                    <p className="text-xs text-[#9E9E9E] truncate">{pair.leadA.company}</p>
                  </div>
                  <div className="flex-shrink-0 text-[#9E9E9E] mx-2 mt-1">
                    <span className="text-xs font-medium">vs</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#212121] truncate">
                      {pair.leadB.name}
                    </p>
                    <p className="text-xs text-[#9E9E9E] truncate">{pair.leadB.company}</p>
                  </div>
                </div>

                {/* Match Info */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${getMatchBadgeColor(
                      pair.matchType
                    )}`}
                  >
                    {getMatchIcon(pair.matchType)}
                    <span>{getMatchLabel(pair.matchType)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#9E9E9E]">Match:</span>
                    <span className={`text-sm font-bold ${getConfidenceColor(pair.confidence)}`}>
                      {pair.confidence}%
                    </span>
                  </div>
                </div>

                {/* Matched Fields */}
                {pair.matchedFields.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#E0E0E0]">
                    <p className="text-xs text-[#9E9E9E] mb-1">Matched fields:</p>
                    <div className="flex flex-wrap gap-1">
                      {pair.matchedFields.map((field, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded text-xs bg-[#FFF9C4] text-[#616161]"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
