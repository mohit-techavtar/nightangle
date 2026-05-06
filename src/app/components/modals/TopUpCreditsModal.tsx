import React, { useState } from "react";
import { X, Coins, Check, CreditCard, Building2 } from "lucide-react";

interface TopUpCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  onPurchase: (credits: number, amount: number) => void;
}

const creditPackages = [
  { credits: 100, price: 2500, popular: false, discount: 0 },
  { credits: 500, price: 11250, popular: true, discount: 10 },
  { credits: 1000, price: 20000, popular: false, discount: 20 },
  { credits: 2500, price: 43750, popular: false, discount: 30 },
];

export function TopUpCreditsModal({ isOpen, onClose, currentCredits, onPurchase }: TopUpCreditsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(creditPackages[1]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");

  if (!isOpen) return null;

  const handlePurchase = () => {
    onPurchase(selectedPackage.credits, selectedPackage.price);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center">
              <Coins className="text-[#1565C0]" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#212121]">Purchase Credits</h3>
              <p className="text-xs text-[#616161]">Current Balance: {currentCredits.toLocaleString()} Credits</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9E9E9E] hover:text-[#616161] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Credit Packages */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#212121] mb-3">Select Credit Package</h4>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              {creditPackages.map((pkg) => (
                <button
                  key={pkg.credits}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPackage.credits === pkg.credits
                      ? 'border-[#1565C0] bg-[#E3F2FD]'
                      : 'border-[#E0E0E0] hover:border-[#90CAF9]'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-[#4CAF50] text-white text-xs font-semibold">
                      Popular
                    </div>
                  )}
                  {pkg.discount > 0 && (
                    <div className="absolute -top-2 left-3 px-2 py-0.5 rounded-full bg-[#F57F17] text-white text-xs font-semibold">
                      Save {pkg.discount}%
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-[#212121]">{pkg.credits.toLocaleString()}</div>
                    {selectedPackage.credits === pkg.credits && (
                      <div className="w-6 h-6 rounded-full bg-[#1565C0] flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[#616161] mb-2">Credits</div>
                  <div className="text-lg font-semibold text-[#1565C0]">NPR {pkg.price.toLocaleString()}</div>
                  <div className="text-xs text-[#9E9E9E] mt-1">NPR {(pkg.price / pkg.credits).toFixed(2)} per credit</div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 rounded-lg bg-[#F5F5F5] border border-[#E0E0E0]">
            <h4 className="text-sm font-semibold text-[#212121] mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#616161]">Credits</span>
                <span className="font-semibold text-[#212121]">{selectedPackage.credits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#616161]">Price per credit</span>
                <span className="text-[#212121]">NPR {(selectedPackage.price / selectedPackage.credits).toFixed(2)}</span>
              </div>
              {selectedPackage.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#4CAF50]">Discount ({selectedPackage.discount}%)</span>
                  <span className="text-[#4CAF50]">- NPR {((selectedPackage.credits * 25) - selectedPackage.price).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E0E0E0] flex justify-between">
                <span className="font-semibold text-[#212121]">Total</span>
                <span className="text-xl font-bold text-[#1565C0]">NPR {selectedPackage.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#616161]">New Balance</span>
                <span className="font-semibold text-[#212121]">{(currentCredits + selectedPackage.credits).toLocaleString()} Credits</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#212121] mb-3">Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === "card"
                    ? 'border-[#1565C0] bg-[#E3F2FD]'
                    : 'border-[#E0E0E0] hover:border-[#90CAF9]'
                }`}
              >
                <CreditCard size={20} className={paymentMethod === "card" ? "text-[#1565C0]" : "text-[#616161]"} />
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#212121]">Credit Card</div>
                  <div className="text-xs text-[#616161]">Instant</div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("bank")}
                className={`p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === "bank"
                    ? 'border-[#1565C0] bg-[#E3F2FD]'
                    : 'border-[#E0E0E0] hover:border-[#90CAF9]'
                }`}
              >
                <Building2 size={20} className={paymentMethod === "bank" ? "text-[#1565C0]" : "text-[#616161]"} />
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#212121]">Bank Transfer</div>
                  <div className="text-xs text-[#616161]">1-2 days</div>
                </div>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
            <p className="text-xs text-[#1565C0]">
              ℹ️ Credits are valid for 12 months from purchase date. 1 Credit = 1 AI Query in Business Playground.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5]">
          <button
            onClick={onClose}
            className="px-5 h-10 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            className="px-6 h-10 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
