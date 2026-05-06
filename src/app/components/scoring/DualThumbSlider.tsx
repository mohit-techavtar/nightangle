import React, { useState, useRef, useEffect } from "react";

interface DualThumbSliderProps {
  leftValue: number; // 0-100
  onChange: (leftValue: number, rightValue: number) => void;
  leftLabel: string;
  rightLabel: string;
}

export function DualThumbSlider({ leftValue, onChange, leftLabel, rightLabel }: DualThumbSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const rightValue = 100 - leftValue;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 100);
    const newLeftValue = Math.max(0, Math.min(100, percentage));
    const newRightValue = 100 - newLeftValue;
    
    onChange(newLeftValue, newRightValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove as any);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove as any);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1565C0]">{leftLabel}</span>
          <span className="text-[#212121] font-bold">{leftValue}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#212121] font-bold">{rightValue}%</span>
          <span className="font-semibold text-[#7C4DFF]">{rightLabel}</span>
        </div>
      </div>
      
      <div
        ref={sliderRef}
        className="relative h-8 rounded-full cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Background track */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-gradient-to-r from-[#1565C0] to-[#1976D2] transition-all duration-150"
              style={{ width: `${leftValue}%` }}
            />
            <div
              className="bg-gradient-to-r from-[#7C4DFF] to-[#9575CD] transition-all duration-150"
              style={{ width: `${rightValue}%` }}
            />
          </div>
        </div>

        {/* Divider thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-[#1565C0] cursor-grab active:cursor-grabbing z-10 transition-transform hover:scale-110"
          style={{ left: `calc(${leftValue}% - 12px)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-3 bg-[#9E9E9E] rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#9E9E9E]">
        <span>Rule-based weight</span>
        <span>AI-based weight</span>
      </div>
    </div>
  );
}
