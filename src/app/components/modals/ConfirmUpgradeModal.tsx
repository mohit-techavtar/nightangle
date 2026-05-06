import React, { useState } from "react";
import { X, ArrowRight, TrendingUp } from "lucide-react";

interface UpgradePlan {
  name: string;
  color: string;
}

interface ComparisonRow {
  label: string;
  current: string;
  new: string;
}

interface ConfirmUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: UpgradePlan;
  newPlan: UpgradePlan;
  comparisonRows: ComparisonRow[];
  proratedCredit: string;
  remainingDays: number;
  onConfirm: (note: string) => void;
}

export function ConfirmUpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  newPlan,
  comparisonRows,
  proratedCredit,
  remainingDays,
  onConfirm,
}: ConfirmUpgradeModalProps) {
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: "640px", fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#212121]">Confirm Upgrade Request</h2>
          <button
            onClick={onClose}
            className="text-[#9E9E9E] hover:text-[#616161] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          {/* Plan Cards Visual */}
          <div className="mb-6 flex items-center justify-center gap-4">
            {/* Current Plan Card */}
            <div className="flex-1 p-4 rounded-lg border-2 border-[#1565C0] bg-[#E3F2FD]">
              <p className="text-xs text-[#616161] mb-1">Current Plan</p>
              <p className="font-semibold text-[#1565C0]">{currentPlan.name}</p>
            </div>

            {/* Arrow */}
            <ArrowRight size={24} className="text-[#9E9E9E] flex-shrink-0" />

            {/* New Plan Card */}
            <div className="flex-1 p-4 rounded-lg border-2 border-[#FF6F00] bg-[#FFF8E1]">
              <p className="text-xs text-[#616161] mb-1">New Plan</p>
              <p className="font-semibold text-[#FF6F00]">{newPlan.name}</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#212121] mb-3">Key Differences</h3>
            <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#616161]">Feature</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-[#616161]">Current</th>
                    <th className="px-4 py-2 w-12"></th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-[#616161]">New</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className={idx !== comparisonRows.length - 1 ? "border-b border-[#E0E0E0]" : ""}>
                      <td className="px-4 py-3 text-sm text-[#212121]">{row.label}</td>
                      <td className="px-4 py-3 text-sm text-[#616161] text-right">{row.current}</td>
                      <td className="px-4 py-3 text-center">
                        <TrendingUp size={16} className="text-[#2E7D32]" />
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#2E7D32] text-right">{row.new}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prorated Credit */}
          <div className="mb-6 p-3 rounded-lg bg-[#E8F5E9] border border-[#A5D6A7]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#212121]">Credit for remaining {remainingDays} days:</span>
              <span className="text-sm font-semibold text-[#2E7D32]">{proratedCredit}</span>
            </div>
          </div>

          {/* Effective Notice */}
          <div className="mb-6 p-3 rounded-lg bg-[#E3F2FD] border-l-4 border-[#1565C0]">
            <p className="text-sm text-[#212121]">
              <strong>Effective:</strong> Upgrade takes effect immediately upon admin approval.
            </p>
          </div>

          {/* Note */}
          <div className="mb-5">
            <label className="block mb-1 text-xs font-semibold text-[#212121]">
              Note <span className="text-[#9E9E9E] font-normal">(Optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional information for the admin..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] sticky bottom-0">
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
            className="px-4 h-9 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
