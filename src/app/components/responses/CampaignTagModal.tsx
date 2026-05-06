import React, { useState } from "react";
import { X, Tag, Plus, Check } from "lucide-react";

interface CampaignTagModalProps {
  selectedCount: number;
  existingTags: string[];
  onApply: (tag: string) => void;
  onCancel: () => void;
}

const popularTags = [
  "Q1 2026 Campaign",
  "Product Launch",
  "Market Research",
  "Competitive Analysis",
  "Lead Generation",
  "Content Strategy",
  "Partner Outreach",
  "Sales Enablement",
];

export function CampaignTagModal({ selectedCount, existingTags, onApply, onCancel }: CampaignTagModalProps) {
  const [selectedTag, setSelectedTag] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleApply = () => {
    const finalTag = showCustom ? customTag : selectedTag;
    if (finalTag.trim()) {
      onApply(finalTag.trim());
    }
  };

  const allTags = Array.from(new Set([...popularTags, ...existingTags]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div>
            <h3 className="text-lg font-semibold text-white">Add Campaign Tag</h3>
            <p className="text-sm text-white/80">Tag {selectedCount} selected {selectedCount === 1 ? 'response' : 'responses'}</p>
          </div>
          <button onClick={onCancel} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Popular Tags */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#212121] mb-3">Popular Tags</h4>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    setShowCustom(false);
                  }}
                  className={`px-4 py-3 rounded-lg border text-left transition-all ${
                    selectedTag === tag && !showCustom
                      ? "border-[#1565C0] bg-[#E3F2FD]"
                      : "border-[#E0E0E0] hover:bg-[#F5F5F5]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className={selectedTag === tag && !showCustom ? "text-[#1565C0]" : "text-[#9E9E9E]"} />
                      <span className={`text-sm font-medium ${selectedTag === tag && !showCustom ? "text-[#1565C0]" : "text-[#212121]"}`}>
                        {tag}
                      </span>
                    </div>
                    {selectedTag === tag && !showCustom && (
                      <Check size={16} className="text-[#1565C0]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tag */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[#212121]">Custom Tag</h4>
              {!showCustom && (
                <button
                  onClick={() => setShowCustom(true)}
                  className="text-sm text-[#1565C0] hover:underline flex items-center gap-1"
                >
                  <Plus size={14} />
                  Create Custom
                </button>
              )}
            </div>
            
            {showCustom && (
              <div className="p-4 rounded-lg border border-[#1565C0] bg-[#E3F2FD]/30">
                <label className="text-xs font-semibold text-[#616161] mb-2 block">
                  Enter Custom Tag Name
                </label>
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="e.g., Summer 2026 Campaign"
                  autoFocus
                  className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                />
                <p className="text-xs text-[#616161] mt-2">
                  Create a custom tag to organize and track your query responses
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-3 rounded-lg bg-[#F5F5F5] border border-[#E0E0E0]">
            <div className="flex items-start gap-2">
              <Tag className="text-[#616161] shrink-0 mt-0.5" size={16} />
              <div className="text-xs text-[#616161]">
                Campaign tags help you organize query responses and track them across different initiatives. 
                You can filter and group responses by tags in the history view.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
          <div className="text-sm text-[#616161]">
            {showCustom ? (
              customTag.trim() ? (
                <>Will tag as: <strong className="text-[#212121]">"{customTag}"</strong></>
              ) : (
                "Enter a tag name"
              )
            ) : selectedTag ? (
              <>Will tag as: <strong className="text-[#212121]">"{selectedTag}"</strong></>
            ) : (
              "Select a tag to apply"
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedTag && !customTag.trim()}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Tag size={16} />
              Apply Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
