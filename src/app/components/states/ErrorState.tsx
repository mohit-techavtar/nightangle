import React from "react";
import { LucideIcon } from "lucide-react";

interface ErrorStateProps {
  illustration?: React.ReactNode;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  heading: string;
  subtext: string;
  primaryButton?: {
    label: string;
    onClick: () => void;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
  };
  textLink?: {
    label: string;
    onClick: () => void;
  };
  errorReference?: string;
}

export function ErrorState({
  illustration,
  icon: Icon,
  iconBgColor,
  iconColor,
  heading,
  subtext,
  primaryButton,
  secondaryButton,
  textLink,
  errorReference,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] py-12">
      <div className="flex flex-col items-center text-center gap-6" style={{ maxWidth: "480px" }}>
        {/* Illustration or Icon */}
        {illustration && <div className="mb-2">{illustration}</div>}
        
        {Icon && !illustration && (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: iconBgColor }}
          >
            <Icon size={28} style={{ color: iconColor }} />
          </div>
        )}

        {/* Heading */}
        <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#212121", lineHeight: "28px" }}>
          {heading}
        </h3>

        {/* Subtext */}
        <p className="text-sm text-[#616161] leading-relaxed" style={{ marginTop: "-8px" }}>
          {subtext}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {primaryButton && (
            <button
              onClick={primaryButton.onClick}
              className="px-4 h-10 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              {primaryButton.label}
            </button>
          )}
          
          {secondaryButton && (
            <button
              onClick={secondaryButton.onClick}
              className="px-4 h-10 rounded-[6px] bg-white border border-[#E0E0E0] text-[#212121] text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
            >
              {secondaryButton.label}
            </button>
          )}
        </div>

        {/* Text Link */}
        {textLink && (
          <button
            onClick={textLink.onClick}
            className="text-sm text-[#1565C0] hover:text-[#0D47A1] transition-colors font-medium"
            style={{ marginTop: "-8px" }}
          >
            {textLink.label}
          </button>
        )}

        {/* Error Reference */}
        {errorReference && (
          <p className="text-xs text-[#9E9E9E]" style={{ fontFamily: "monospace", marginTop: "-8px" }}>
            Error Ref: {errorReference}
          </p>
        )}
      </div>
    </div>
  );
}
