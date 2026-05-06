import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCycleEndDate: string;
  onConfirm: (data: {
    cancellationType: "immediate" | "end-of-cycle";
    reason: string;
    feedback: string;
  }) => void;
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  currentCycleEndDate,
  onConfirm,
}: CancelSubscriptionModalProps) {
  const [cancellationType, setCancellationType] = useState<"immediate" | "end-of-cycle">("end-of-cycle");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    onConfirm({ cancellationType, reason, feedback });
  };

  const featuresLost = [
    "AI-powered calling and voice automation",
    "WhatsApp campaign management",
    "Active deals and pipeline tracking",
    "Call logs and conversation history",
    "Custom reports and analytics",
    "Team collaboration features",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-4 max-md:mx-0 max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: "560px", fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 max-md:px-4 py-4 max-md:py-3 border-b border-[#E0E0E0]">
          <div className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full bg-[#FFEBEE] flex items-center justify-center">
            <AlertCircle size={20} className="text-[#C62828] max-md:w-4 max-md:h-4" />
          </div>
          <h2 className="flex-1 text-lg max-md:text-base font-semibold text-[#212121]">Cancel Subscription</h2>
          <button
            onClick={onClose}
            className="text-[#9E9E9E] hover:text-[#616161] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 max-md:px-4 py-5 max-md:py-4">
          {/* Warning Text */}
          <div className="mb-5">
            <p className="text-sm text-[#616161]">
              We're sorry to see you go. Please let us know why you're canceling so we can improve our service.
            </p>
          </div>

          {/* Cancellation Type */}
          <div className="mb-5">
            <label className="block mb-3 text-xs font-semibold text-[#212121]">
              Cancellation Type
            </label>
            <div className="space-y-3">
              {/* Immediate */}
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-[#E0E0E0] hover:border-[#BDBDBD] transition-colors">
                <input
                  type="radio"
                  name="cancellationType"
                  value="immediate"
                  checked={cancellationType === "immediate"}
                  onChange={() => setCancellationType("immediate")}
                  className="w-4 h-4 mt-0.5 accent-[#C62828] cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#212121]">Immediate</p>
                  <p className="text-xs text-[#C62828] mt-1">
                    ⚠️ Your access will be restricted immediately
                  </p>
                </div>
              </label>

              {/* End of Cycle */}
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-[#E0E0E0] hover:border-[#BDBDBD] transition-colors">
                <input
                  type="radio"
                  name="cancellationType"
                  value="end-of-cycle"
                  checked={cancellationType === "end-of-cycle"}
                  onChange={() => setCancellationType("end-of-cycle")}
                  className="w-4 h-4 mt-0.5 accent-[#1565C0] cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#212121]">
                    End of Current Cycle ({currentCycleEndDate})
                  </p>
                  <p className="text-xs text-[#616161] mt-1">
                    You retain full access until expiry
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-5">
            <label className="block mb-1 text-xs font-semibold text-[#212121]">
              Reason <span className="text-[#C62828]">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full h-10 px-3 text-sm border border-[#E0E0E0] rounded-[6px] bg-white text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            >
              <option value="">Select a reason</option>
              <option value="not-using">Not Using</option>
              <option value="too-expensive">Too Expensive</option>
              <option value="switching-provider">Switching Provider</option>
              <option value="missing-features">Missing Features</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Feedback */}
          <div className="mb-5">
            <label className="block mb-1 text-xs font-semibold text-[#212121]">
              Feedback <span className="text-[#9E9E9E] font-normal">(Optional)</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
            />
          </div>

          {/* What You Will Lose */}
          <div className="mb-5 p-4 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]">
            <h3 className="text-sm font-semibold text-[#212121] mb-3">What you will lose:</h3>
            <ul className="space-y-2">
              {featuresLost.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#C62828]">
                  <X size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 max-md:gap-2 px-6 max-md:px-4 py-4 max-md:py-3 border-t border-[#E0E0E0] bg-[#F5F5F5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 max-md:px-3 h-9 max-md:h-8 rounded-[6px] bg-[#1565C0] text-white text-sm max-md:text-[13px] font-medium hover:bg-[#0D47A1] transition-colors"
          >
            Keep My Plan
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!reason}
            className="px-4 max-md:px-3 h-9 max-md:h-8 rounded-[6px] bg-white border-2 border-[#C62828] text-[#C62828] text-sm max-md:text-[13px] font-medium hover:bg-[#FFEBEE] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}