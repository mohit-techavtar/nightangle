import React, { useState } from "react";
import { Clock, X, Phone, CalendarClock } from "lucide-react";

interface GrantGraceExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantName: string;
  onConfirm: (data: {
    graceType: "minutes" | "date";
    additionalMinutes?: number;
    graceEndDate?: string;
    reason: string;
  }) => void;
}

export function GrantGraceExtensionModal({
  isOpen,
  onClose,
  tenantName,
  onConfirm,
}: GrantGraceExtensionModalProps) {
  const [graceType, setGraceType] = useState<"minutes" | "date">("minutes");
  const [additionalMinutes, setAdditionalMinutes] = useState(500);
  const [graceEndDate, setGraceEndDate] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    onConfirm({
      graceType,
      additionalMinutes: graceType === "minutes" ? additionalMinutes : undefined,
      graceEndDate: graceType === "date" ? graceEndDate : undefined,
      reason,
    });
  };

  // Calculate max date (72 hours from now)
  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() + 72);
  const maxDateString = maxDate.toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-4"
        style={{ maxWidth: "560px", fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E0E0E0]">
          <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center">
            <Clock size={20} className="text-[#FF6F00]" />
          </div>
          <h2 className="flex-1 text-lg font-semibold text-[#212121]">Grant Grace Extension</h2>
          <button
            onClick={onClose}
            className="text-[#9E9E9E] hover:text-[#616161] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          {/* Tenant Name */}
          <div className="mb-5">
            <p className="text-sm text-[#616161] mb-1">Tenant</p>
            <p className="font-semibold text-[#212121]">{tenantName}</p>
          </div>

          {/* Grace Type */}
          <div className="mb-5">
            <label className="block mb-3 text-xs font-semibold text-[#212121]">
              Grace Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Additional Minutes Card */}
              <button
                type="button"
                onClick={() => setGraceType("minutes")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  graceType === "minutes"
                    ? "border-[#1565C0] bg-[#E3F2FD]"
                    : "border-[#E0E0E0] bg-white hover:border-[#BDBDBD]"
                }`}
              >
                <Phone
                  size={20}
                  className={graceType === "minutes" ? "text-[#1565C0]" : "text-[#9E9E9E]"}
                />
                <p className="mt-2 text-sm font-semibold text-[#212121]">Additional Minutes</p>
              </button>

              {/* Date Extension Card */}
              <button
                type="button"
                onClick={() => setGraceType("date")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  graceType === "date"
                    ? "border-[#1565C0] bg-[#E3F2FD]"
                    : "border-[#E0E0E0] bg-white hover:border-[#BDBDBD]"
                }`}
              >
                <CalendarClock
                  size={20}
                  className={graceType === "date" ? "text-[#1565C0]" : "text-[#9E9E9E]"}
                />
                <p className="mt-2 text-sm font-semibold text-[#212121]">Date Extension</p>
              </button>
            </div>
          </div>

          {/* Conditional Input - Additional Minutes */}
          {graceType === "minutes" && (
            <div className="mb-5">
              <label className="block mb-1 text-xs font-semibold text-[#212121]">
                Additional AI Minutes
              </label>
              <input
                type="number"
                value={additionalMinutes}
                onChange={(e) => setAdditionalMinutes(Number(e.target.value))}
                min="1"
                step="1"
                className="w-full h-10 px-3 text-sm border border-[#E0E0E0] rounded-[6px] bg-white text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              />
            </div>
          )}

          {/* Conditional Input - Grace End Date */}
          {graceType === "date" && (
            <div className="mb-5">
              <label className="block mb-1 text-xs font-semibold text-[#212121]">
                Grace End Date
              </label>
              <input
                type="datetime-local"
                value={graceEndDate}
                onChange={(e) => setGraceEndDate(e.target.value)}
                max={maxDateString}
                required
                className="w-full h-10 px-3 text-sm border border-[#E0E0E0] rounded-[6px] bg-white text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              />
              <p className="mt-1 text-xs text-[#616161]">Maximum 72 hours from now</p>
            </div>
          )}

          {/* Info Banner */}
          {graceType === "minutes" && (
            <div className="mb-5 p-3 rounded-lg bg-[#E3F2FD] border-l-4 border-[#1565C0]">
              <p className="text-sm text-[#212121]">
                Grace minutes are billed at overage rates (NPR 5.00/min).
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="mb-5">
            <label className="block mb-1 text-xs font-semibold text-[#212121]">
              Reason <span className="text-[#C62828]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why grace is being granted..."
              required
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-9 rounded-[6px] bg-white border border-[#E0E0E0] text-[#212121] text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!reason}
            className="px-4 h-9 rounded-[6px] bg-[#FF6F00] text-white text-sm font-medium hover:bg-[#E65100] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Grant Grace
          </button>
        </div>
      </div>
    </div>
  );
}