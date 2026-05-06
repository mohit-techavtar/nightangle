import React from "react";
import { Coins, AlertTriangle, TrendingDown } from "lucide-react";

interface CreditDisplayProps {
  credits: number;
  className?: string;
  showWarning?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CreditDisplay({ credits, className = "", showWarning = true, size = "md" }: CreditDisplayProps) {
  const isLow = credits < 50;
  const isCritical = credits < 10;
  
  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-base gap-2",
    lg: "text-lg gap-2",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} ${className}`}>
      <Coins 
        size={iconSizes[size]} 
        className={`${isCritical ? 'text-[#C62828]' : isLow ? 'text-[#F57F17]' : 'text-[#1565C0]'}`} 
      />
      <span className={`font-semibold ${isCritical ? 'text-[#C62828]' : isLow && showWarning ? 'text-[#F57F17]' : 'text-[#212121]'}`}>
        {credits.toLocaleString()} Credits
      </span>
      {showWarning && isCritical && (
        <span className="ml-1 px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] text-xs font-medium">
          Low
        </span>
      )}
    </div>
  );
}

export function CreditCard({ credits, onTopUp }: { credits: number; onTopUp: () => void }) {
  const isLow = credits < 50;
  const isCritical = credits < 10;
  
  return (
    <div className={`bg-white rounded-lg border-2 p-4 ${isCritical ? 'border-[#C62828] bg-[#FFEBEE]/30' : isLow ? 'border-[#F57F17] bg-[#FFF8E1]/30' : 'border-[#E0E0E0]'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs text-[#616161] uppercase font-semibold block mb-2">Available Credits</span>
          <div className="flex items-center gap-2">
            <Coins size={24} className={`${isCritical ? 'text-[#C62828]' : isLow ? 'text-[#F57F17]' : 'text-[#1565C0]'}`} />
            <span className="text-3xl font-bold text-[#212121]">{credits.toLocaleString()}</span>
          </div>
        </div>
        {isCritical && (
          <div className="w-10 h-10 rounded-full bg-[#C62828] flex items-center justify-center">
            <AlertTriangle className="text-white" size={20} />
          </div>
        )}
        {isLow && !isCritical && (
          <div className="w-10 h-10 rounded-full bg-[#F57F17] flex items-center justify-center">
            <TrendingDown className="text-white" size={20} />
          </div>
        )}
      </div>
      
      {(isLow || isCritical) && (
        <div className={`mb-3 p-2 rounded text-xs ${isCritical ? 'bg-[#FFEBEE] text-[#C62828]' : 'bg-[#FFF8E1] text-[#F57F17]'}`}>
          {isCritical ? '⚠️ Critical: You have less than 10 credits remaining' : '⚡ Low: Consider topping up your credits'}
        </div>
      )}
      
      <button
        onClick={onTopUp}
        className={`w-full h-9 rounded-md text-sm font-medium transition-colors ${
          isCritical 
            ? 'bg-[#C62828] text-white hover:bg-[#B71C1C]'
            : 'bg-[#1565C0] text-white hover:bg-[#0D47A1]'
        }`}
      >
        {isCritical ? 'Top Up Now' : 'Purchase Credits'}
      </button>
      
      <p className="text-xs text-[#9E9E9E] mt-2 text-center">
        1 Credit = 1 AI Query
      </p>
    </div>
  );
}
