import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

export function Skeleton({ width, height, rounded = "md", className = "" }: SkeletonProps) {
  const roundedClass = {
    sm: "rounded-[4px]",
    md: "rounded-[6px]",
    lg: "rounded-[8px]",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      className={`bg-gradient-to-r from-[#F5F5F5] via-[#EEEEEE] to-[#F5F5F5] animate-pulse ${roundedClass} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="16px" width={i === lines - 1 ? "80%" : "100%"} rounded="sm" />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-[#E0E0E0] p-5 ${className}`}>
      <Skeleton height="24px" width="60%" className="mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      {/* Header */}
      <div className="grid gap-4 px-6 py-4 border-b border-[#E0E0E0]" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="20px" width="80%" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 px-6 py-4 border-b border-[#E0E0E0] last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} height="16px" width={colIdx === 0 ? "60%" : "40%"} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
      <div className="flex items-start justify-between mb-3">
        <Skeleton height="40px" width="40px" rounded="full" />
      </div>
      <Skeleton height="32px" width="70%" className="mb-2" />
      <Skeleton height="16px" width="50%" />
    </div>
  );
}

export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  return <Skeleton className={sizeMap[size]} rounded="full" />;
}

export function SkeletonBadge() {
  return <Skeleton height="24px" width="80px" rounded="full" />;
}
