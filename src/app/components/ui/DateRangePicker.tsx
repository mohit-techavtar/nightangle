import React, { useState } from "react";
import { Calendar, X } from "lucide-react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClose?: () => void;
  showQuickSelects?: boolean;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClose,
  showQuickSelects = true,
}: DateRangePickerProps) {
  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onEndDateChange(end.toISOString().split('T')[0]);
    onStartDateChange(start.toISOString().split('T')[0]);
  };

  const handleThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  const handleLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#1565C0]" />
          <h4 className="font-semibold text-[#212121]">Custom Date Range</h4>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="w-6 h-6 rounded-md hover:bg-[#F5F5F5] flex items-center justify-center text-[#9E9E9E]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#616161] mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#616161] mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none"
          />
        </div>

        {showQuickSelects && (
          <>
            <div className="pt-2 border-t border-[#EEEEEE]">
              <label className="block text-xs font-medium text-[#616161] mb-2">Quick Select</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickSelect(7)}
                  className="h-8 px-3 rounded-md border border-[#E0E0E0] text-xs text-[#616161] hover:bg-[#F5F5F5] transition-colors"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => handleQuickSelect(30)}
                  className="h-8 px-3 rounded-md border border-[#E0E0E0] text-xs text-[#616161] hover:bg-[#F5F5F5] transition-colors"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => handleQuickSelect(90)}
                  className="h-8 px-3 rounded-md border border-[#E0E0E0] text-xs text-[#616161] hover:bg-[#F5F5F5] transition-colors"
                >
                  Last 90 days
                </button>
                <button
                  onClick={handleThisMonth}
                  className="h-8 px-3 rounded-md border border-[#E0E0E0] text-xs text-[#616161] hover:bg-[#F5F5F5] transition-colors"
                >
                  This month
                </button>
                <button
                  onClick={handleLastMonth}
                  className="h-8 px-3 rounded-md border border-[#E0E0E0] text-xs text-[#616161] hover:bg-[#F5F5F5] transition-colors"
                >
                  Last month
                </button>
                <button
                  onClick={() => handleQuickSelect(365)}
                  className="h-8 px-3 rounded-md border border-[#E0E0E0] text-xs text-[#616161] hover:bg-[#F5F5F5] transition-colors"
                >
                  Last year
                </button>
              </div>
            </div>
          </>
        )}

        {startDate && endDate && (
          <div className="bg-[#E3F2FD] rounded-md p-2 text-xs">
            <span className="text-[#1565C0] font-medium">
              {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' → '}
              {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[#616161] ml-2">
              ({Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
