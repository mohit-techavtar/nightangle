import React, { useState } from "react";
import { ShieldX, X } from "lucide-react";

interface TerminateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenseId: string;
  tenantName: string;
  onConfirm: (reason: string) => void;
}

export function TerminateLicenseModal({
  isOpen,
  onClose,
  licenseId,
  tenantName,
  onConfirm,
}: TerminateLicenseModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const isConfirmed = confirmText === "TERMINATE";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed || !reason) return;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-4 max-md:mx-0"
        style={{ maxWidth: "560px", fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 max-md:px-4 py-4 max-md:py-3 border-b border-[#E0E0E0]">
          <div className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full bg-[#FFEBEE] flex items-center justify-center">
            <ShieldX size={20} className="text-[#C62828] max-md:w-4 max-md:h-4" />
          </div>
          <h2 className="flex-1 text-lg max-md:text-base font-semibold text-[#212121]">Terminate License</h2>
          <button
            onClick={onClose}
            className="text-[#9E9E9E] hover:text-[#616161] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 max-md:px-4 py-5 max-md:py-4">
          {/* Warning Banner */}
          <div className="mb-5 p-3 rounded-lg bg-[#FFEBEE] border-l-4 border-[#C62828]">
            <p className="text-sm text-[#212121] font-medium">
              This action is irreversible. The license will be permanently terminated and cannot be reactivated. A new license must be issued.
            </p>
          </div>

          {/* License Info */}
          <div className="mb-5">
            <p className="text-sm text-[#616161] mb-1">License</p>
            <p className="font-semibold text-[#212121]">
              {licenseId} | {tenantName}
            </p>
          </div>

          {/* Type to Confirm */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-bold text-[#212121]">
              Type <span className="text-[#C62828]">TERMINATE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="TERMINATE"
              className="w-full h-10 px-3 text-sm border-2 border-[#C62828] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#B71C1C] focus:ring-2 focus:ring-[#C62828]/20"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            />
          </div>

          {/* Reason */}
          <div className="mb-5">
            <label className="block mb-1 text-xs font-semibold text-[#212121]">
              Reason <span className="text-[#C62828]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this license is being terminated..."
              required
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 max-md:gap-2 px-6 max-md:px-4 py-4 max-md:py-3 border-t border-[#E0E0E0] bg-[#F5F5F5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 max-md:px-3 h-9 max-md:h-8 rounded-[6px] bg-[#1565C0] text-white text-sm max-md:text-[13px] font-medium hover:bg-[#0D47A1] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isConfirmed || !reason}
            className="px-4 max-md:px-3 h-9 max-md:h-8 rounded-[6px] bg-[#C62828] text-white text-sm max-md:text-[13px] font-medium hover:bg-[#B71C1C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Terminate License
          </button>
        </div>
      </div>
    </div>
  );
}