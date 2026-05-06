import React, { useState } from "react";
import { X, Calendar, DollarSign, TrendingUp, Users } from "lucide-react";

interface FilterOptions {
  sources: string[];
  stages: string[];
  owners: string[];
  scoreRange: [number, number];
  valueRange: [number, number];
  dateRange: { start: Date | null; end: Date | null };
}

interface LeadFilterPanelProps {
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onClose: () => void;
}

export function LeadFilterPanel({ filters, onApplyFilters, onClose }: LeadFilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const sources = ["Website", "Referral", "Cold Call", "Social Media", "Email Campaign", "Trade Show", "Partner"];
  const stages = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
  const owners = ["Akash Sharma", "Priya Thapa", "Rohit Gurung", "Sita Rai", "Ramesh KC"];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      sources: [],
      stages: [],
      owners: [],
      scoreRange: [0, 100],
      valueRange: [0, 1000000],
      dateRange: { start: null, end: null },
    };
    setLocalFilters(resetFilters);
  };

  const toggleSource = (source: string) => {
    setLocalFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source],
    }));
  };

  const toggleStage = (stage: string) => {
    setLocalFilters(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter(s => s !== stage)
        : [...prev.stages, stage],
    }));
  };

  const toggleOwner = (owner: string) => {
    setLocalFilters(prev => ({
      ...prev,
      owners: prev.owners.includes(owner)
        ? prev.owners.filter(o => o !== owner)
        : [...prev.owners, owner],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div>
            <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
            <p className="text-sm text-white/80">Refine your lead search with multiple criteria</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
            {/* Source Filter */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-3 block">
                Lead Source
              </label>
              <div className="space-y-2">
                {sources.map(source => (
                  <label key={source} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.sources.includes(source)}
                      onChange={() => toggleSource(source)}
                      className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
                    />
                    <span className="text-sm text-[#212121]">{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stage Filter */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-3 block">
                Lead Stage
              </label>
              <div className="space-y-2">
                {stages.map(stage => (
                  <label key={stage} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.stages.includes(stage)}
                      onChange={() => toggleStage(stage)}
                      className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
                    />
                    <span className="text-sm text-[#212121]">{stage}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-3 block flex items-center gap-2">
                <Users size={16} />
                Lead Owner
              </label>
              <div className="space-y-2">
                {owners.map(owner => (
                  <label key={owner} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.owners.includes(owner)}
                      onChange={() => toggleOwner(owner)}
                      className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
                    />
                    <span className="text-sm text-[#212121]">{owner}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Score Range */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-3 block flex items-center gap-2">
                <TrendingUp size={16} />
                Lead Score Range
              </label>
              <div className="space-y-3">
                <div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localFilters.scoreRange[0]}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      scoreRange: [parseInt(e.target.value), prev.scoreRange[1]],
                    }))}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-[#616161] mt-1">
                    <span>Min: {localFilters.scoreRange[0]}</span>
                    <span>Max: {localFilters.scoreRange[1]}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localFilters.scoreRange[1]}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    scoreRange: [prev.scoreRange[0], parseInt(e.target.value)],
                  }))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Value Range */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-3 block flex items-center gap-2">
                <DollarSign size={16} />
                Deal Value (NPR)
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#616161] mb-1 block">Minimum</label>
                  <input
                    type="number"
                    value={localFilters.valueRange[0]}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      valueRange: [parseInt(e.target.value) || 0, prev.valueRange[1]],
                    }))}
                    className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#616161] mb-1 block">Maximum</label>
                  <input
                    type="number"
                    value={localFilters.valueRange[1]}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      valueRange: [prev.valueRange[0], parseInt(e.target.value) || 1000000],
                    }))}
                    className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                    placeholder="1000000"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-3 block flex items-center gap-2">
                <Calendar size={16} />
                Activity Date Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#616161] mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={localFilters.dateRange.start?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value ? new Date(e.target.value) : null },
                    }))}
                    className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#616161] mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={localFilters.dateRange.end?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value ? new Date(e.target.value) : null },
                    }))}
                    className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 h-9 rounded-md text-[#616161] hover:bg-[#E0E0E0] text-sm font-medium"
          >
            Reset All
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
