import React, { useState } from "react";
import { X, Calendar, Tag as TagIcon, Save, RotateCcw, Check } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface FilterState {
  pipeline: string;
  stages: string[];
  scoreRange: [number, number];
  dateRange: { start: string; end: string };
  assignedUsers: string[];
  tags: string[];
}

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  onSaveAsView: () => void;
  onClose: () => void;
}

const pipelines = [
  { value: "all", label: "All Pipelines" },
  { value: "sales", label: "Sales Pipeline" },
  { value: "support", label: "Support Pipeline" },
  { value: "collections", label: "Collections Pipeline" },
];

const stages = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const users: User[] = [
  { id: "1", name: "Rajesh Sharma", initials: "RS", color: "#1565C0" },
  { id: "2", name: "Priya Patel", initials: "PP", color: "#E91E63" },
  { id: "3", name: "Amit Kumar", initials: "AK", color: "#4CAF50" },
  { id: "4", name: "Neha Singh", initials: "NS", color: "#FF9800" },
  { id: "5", name: "Vikram Reddy", initials: "VR", color: "#9C27B0" },
];

const tags: Tag[] = [
  { id: "1", name: "Hot Lead", color: "#C62828" },
  { id: "2", name: "Follow Up", color: "#F57F17" },
  { id: "3", name: "High Value", color: "#1565C0" },
  { id: "4", name: "Enterprise", color: "#6A1B9A" },
  { id: "5", name: "SMB", color: "#00897B" },
  { id: "6", name: "Partner", color: "#5E35B1" },
  { id: "7", name: "Referral", color: "#D84315" },
];

export function AdvancedFilterPanel({
  isOpen,
  filters,
  onFiltersChange,
  onApply,
  onClear,
  onSaveAsView,
  onClose,
}: AdvancedFilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const toggleStage = (stage: string) => {
    const newStages = localFilters.stages.includes(stage)
      ? localFilters.stages.filter(s => s !== stage)
      : [...localFilters.stages, stage];
    updateFilter("stages", newStages);
  };

  const toggleUser = (userId: string) => {
    const newUsers = localFilters.assignedUsers.includes(userId)
      ? localFilters.assignedUsers.filter(u => u !== userId)
      : [...localFilters.assignedUsers, userId];
    updateFilter("assignedUsers", newUsers);
  };

  const toggleTag = (tagId: string) => {
    const newTags = localFilters.tags.includes(tagId)
      ? localFilters.tags.filter(t => t !== tagId)
      : [...localFilters.tags, tagId];
    updateFilter("tags", newTags);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      pipeline: "all",
      stages: [],
      scoreRange: [0, 100],
      dateRange: { start: "", end: "" },
      assignedUsers: [],
      tags: [],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear();
  };

  const activeFiltersCount = 
    (localFilters.pipeline !== "all" ? 1 : 0) +
    localFilters.stages.length +
    (localFilters.scoreRange[0] !== 0 || localFilters.scoreRange[1] !== 100 ? 1 : 0) +
    (localFilters.dateRange.start || localFilters.dateRange.end ? 1 : 0) +
    localFilters.assignedUsers.length +
    localFilters.tags.length;

  if (!isOpen) return null;

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-lg shadow-lg animate-slideDown overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E0E0E0] bg-gradient-to-r from-[#F5F5F5] to-white">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-[#212121]">Advanced Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#1565C0] text-white text-xs font-semibold">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#E0E0E0] transition-colors text-[#616161]"
        >
          <X size={16} />
        </button>
      </div>

      {/* Filter Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pipeline */}
        <div>
          <label className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-2 block">
            Pipeline
          </label>
          <select
            value={localFilters.pipeline}
            onChange={(e) => updateFilter("pipeline", e.target.value)}
            className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
          >
            {pipelines.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Stage - Multi-select with checkboxes */}
        <div>
          <label className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-2 block">
            Stage ({localFilters.stages.length} selected)
          </label>
          <div className="border border-[#E0E0E0] rounded-md p-3 max-h-[120px] overflow-y-auto bg-[#FAFAFA]">
            <div className="space-y-2">
              {stages.map(stage => (
                <label
                  key={stage.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.stages.includes(stage.value)}
                    onChange={() => toggleStage(stage.value)}
                    className="w-4 h-4 rounded border-[#BDBDBD] text-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                  />
                  <span className="text-sm text-[#212121]">{stage.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Score Range - Dual Slider */}
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-2 block">
            Lead Score Range: {localFilters.scoreRange[0]} - {localFilters.scoreRange[1]}
          </label>
          <div className="px-2">
            <div className="relative h-2 bg-[#E0E0E0] rounded-full">
              {/* Active range bar */}
              <div
                className="absolute h-2 bg-gradient-to-r from-[#1565C0] to-[#0D47A1] rounded-full"
                style={{
                  left: `${localFilters.scoreRange[0]}%`,
                  width: `${localFilters.scoreRange[1] - localFilters.scoreRange[0]}%`,
                }}
              />
            </div>
            <div className="relative -mt-1">
              {/* Min slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={localFilters.scoreRange[0]}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  if (newMin < localFilters.scoreRange[1]) {
                    updateFilter("scoreRange", [newMin, localFilters.scoreRange[1]]);
                  }
                }}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1565C0] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1565C0] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />
              {/* Max slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={localFilters.scoreRange[1]}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  if (newMax > localFilters.scoreRange[0]) {
                    updateFilter("scoreRange", [localFilters.scoreRange[0], newMax]);
                  }
                }}
                className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1565C0] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#1565C0] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />
            </div>
            {/* Score labels */}
            <div className="flex justify-between mt-3 px-1">
              <span className="text-xs text-[#9E9E9E]">0</span>
              <span className="text-xs text-[#9E9E9E]">25</span>
              <span className="text-xs text-[#9E9E9E]">50</span>
              <span className="text-xs text-[#9E9E9E]">75</span>
              <span className="text-xs text-[#9E9E9E]">100</span>
            </div>
          </div>
        </div>

        {/* Last Activity - Date Range */}
        <div>
          <label className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-2 block">
            Last Activity From
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="date"
              value={localFilters.dateRange.start}
              onChange={(e) => updateFilter("dateRange", { ...localFilters.dateRange, start: e.target.value })}
              className="w-full h-10 pl-10 pr-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-2 block">
            Last Activity To
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="date"
              value={localFilters.dateRange.end}
              onChange={(e) => updateFilter("dateRange", { ...localFilters.dateRange, end: e.target.value })}
              className="w-full h-10 pl-10 pr-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            />
          </div>
        </div>

        {/* Assigned Users - Multi-select with avatars */}
        <div>
          <label className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-2 block">
            Assigned User ({localFilters.assignedUsers.length} selected)
          </label>
          <div className="border border-[#E0E0E0] rounded-md p-3 max-h-[180px] overflow-y-auto bg-[#FAFAFA]">
            <div className="space-y-2">
              {users.map(user => {
                const isSelected = localFilters.assignedUsers.includes(user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md transition-all ${
                      isSelected ? "bg-[#E3F2FD] border border-[#1565C0]" : "hover:bg-white border border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.initials}
                    </div>
                    {/* Name */}
                    <span className={`text-sm flex-1 text-left ${isSelected ? "font-semibold text-[#1565C0]" : "text-[#212121]"}`}>
                      {user.name}
                    </span>
                    {/* Checkmark */}
                    {isSelected && (
                      <Check size={16} className="text-[#1565C0]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tags - Multi-select with colored chips */}
        <div>
          <label className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-2 block">
            Tags ({localFilters.tags.length} selected)
          </label>
          <div className="border border-[#E0E0E0] rounded-md p-3 max-h-[180px] overflow-y-auto bg-[#FAFAFA]">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const isSelected = localFilters.tags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border-2 ${
                      isSelected
                        ? "text-white border-transparent"
                        : "bg-white text-[#616161] border-[#E0E0E0] hover:border-[#BDBDBD]"
                    }`}
                    style={isSelected ? { backgroundColor: tag.color } : {}}
                  >
                    <TagIcon size={12} />
                    {tag.name}
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={handleClear}
          className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#FAFAFA] text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <RotateCcw size={14} />
          Clear All
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveAsView}
            className="px-4 h-9 rounded-md border-2 border-[#1565C0] bg-white text-[#1565C0] hover:bg-[#E3F2FD] text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Save size={14} />
            Save as View
          </button>
          <button
            onClick={handleApply}
            className="px-6 h-9 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-sm font-semibold hover:shadow-lg hover:scale-105 flex items-center gap-2 transition-all"
          >
            <Check size={16} />
            Apply Filters
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
