import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface SuspendTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantName: string;
  tenantId: string;
  onConfirm: (data: {
    reasonCode: string;
    reasonDetail: string;
    effectTiming: "immediate" | "billing-cycle";
  }) => void;
}

export function SuspendTenantModal({
  isOpen,
  onClose,
  tenantName,
  tenantId,
  onConfirm,
}: SuspendTenantModalProps) {
  const [reasonCode, setReasonCode] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [effectTiming, setEffectTiming] = useState<"immediate" | "billing-cycle">("immediate");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonCode) return;
    onConfirm({ reasonCode, reasonDetail, effectTiming });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-4 max-md:mx-0"
        style={{ maxWidth: "560px", fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 max-md:px-4 py-4 max-md:py-3 border-b border-[#E0E0E0]">
          <div className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full bg-[#FFF3E0] flex items-center justify-center">
            <AlertTriangle size={20} className="text-[#FF6F00] max-md:w-4 max-md:h-4" />
          </div>
          <h2 className="flex-1 text-lg max-md:text-base font-semibold text-[#212121]">Suspend Tenant</h2>
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
          <div className="mb-5 max-md:mb-4 p-3 max-md:p-2.5 rounded-lg bg-[#FFF3E0] border-l-4 border-[#FF6F00]">
            <p className="text-sm max-md:text-[13px] text-[#212121]">
              Suspending this tenant will immediately block all outbound calls, pause active campaigns, and restrict UI access to data export only.
            </p>
          </div>

          {/* Tenant Name */}
          <div className="mb-5 max-md:mb-4">
            <p className="text-sm max-md:text-xs text-[#616161] mb-1">Tenant</p>
            <p className="font-semibold text-[#212121] max-md:text-sm">
              {tenantName} ({tenantId})
            </p>
          </div>

          {/* Reason Code */}
          <div className="mb-5 max-md:mb-4">
            <label className="block mb-1 text-xs font-semibold text-[#212121]">
              Reason Code <span className="text-[#C62828]">*</span>
            </label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              required
              className="w-full h-10 px-3 text-sm border border-[#E0E0E0] rounded-[6px] bg-white text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            >
              <option value="">Select a reason</option>
              <option value="payment-default">Payment Default</option>
              <option value="policy-violation">Policy Violation</option>
              <option value="customer-request">Customer Request</option>
              <option value="compliance-issue">Compliance Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Reason Detail */}
          <div className="mb-5 max-md:mb-4">
            <label className="block mb-1 text-xs font-semibold text-[#212121]">
              Reason Detail <span className="text-[#9E9E9E] font-normal">(Optional)</span>
            </label>
            <textarea
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              placeholder="Provide additional context..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
            />
          </div>

          {/* Effect Timing */}
          <div className="mb-5 max-md:mb-4">
            <label className="block mb-2 text-xs font-semibold text-[#212121]">
              Effect Timing
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="effectTiming"
                  value="immediate"
                  checked={effectTiming === "immediate"}
                  onChange={() => setEffectTiming("immediate")}
                  className="w-4 h-4 accent-[#C62828] cursor-pointer"
                />
                <span className="text-sm text-[#212121]">Immediate</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="effectTiming"
                  value="billing-cycle"
                  checked={effectTiming === "billing-cycle"}
                  onChange={() => setEffectTiming("billing-cycle")}
                  className="w-4 h-4 accent-[#FF6F00] cursor-pointer"
                />
                <span className="text-sm text-[#212121]">End of Current Billing Cycle</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 max-md:gap-2 px-6 max-md:px-4 py-4 max-md:py-3 border-t border-[#E0E0E0] bg-[#F5F5F5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 max-md:px-3 h-9 max-md:h-8 rounded-[6px] bg-white border border-[#E0E0E0] text-[#212121] text-sm max-md:text-[13px] font-medium hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!reasonCode}
            className="px-4 max-md:px-3 h-9 max-md:h-8 rounded-[6px] bg-[#C62828] text-white text-sm max-md:text-[13px] font-medium hover:bg-[#B71C1C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Suspend Tenant
          </button>
        </div>
      </div>
    </div>
  );
}