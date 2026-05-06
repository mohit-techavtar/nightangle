import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { Coins, Save, RotateCcw, TrendingUp, DollarSign, Package } from "lucide-react";

const defaultPlanCredits = [
  { plan: "Starter", monthlyCredits: 100, rollover: false, price: 25 },
  { plan: "Growth", monthlyCredits: 500, rollover: true, price: 22.50 },
  { plan: "Enterprise", monthlyCredits: 2000, rollover: true, price: 20 },
];

const creditPackages = [
  { id: 1, credits: 100, price: 2500, discount: 0, enabled: true },
  { id: 2, credits: 500, price: 11250, discount: 10, enabled: true },
  { id: 3, credits: 1000, price: 20000, discount: 20, enabled: true },
  { id: 4, credits: 2500, price: 43750, discount: 30, enabled: true },
];

export function CreditConfiguration() {
  const [planCredits, setPlanCredits] = useState(defaultPlanCredits);
  const [packages, setPackages] = useState(creditPackages);
  const [baseCreditPrice, setBaseCreditPrice] = useState(25);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    setHasChanges(false);
    // Save logic here
    console.log("Saved credit configuration");
  };

  const handleReset = () => {
    setPlanCredits(defaultPlanCredits);
    setPackages(creditPackages);
    setBaseCreditPrice(25);
    setHasChanges(false);
  };

  const updatePlanCredit = (index: number, field: string, value: any) => {
    const updated = [...planCredits];
    updated[index] = { ...updated[index], [field]: value };
    setPlanCredits(updated);
    setHasChanges(true);
  };

  const updatePackage = (index: number, field: string, value: any) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    setPackages(updated);
    setHasChanges(true);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Credit Configuration" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 max-md:mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 max-md:w-10 max-md:h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                <Coins className="text-[#1565C0]" size={24} />
              </div>
              <div>
                <h1 className="text-2xl max-md:text-xl font-bold text-[#212121]">Credit Configuration</h1>
                <p className="text-sm text-[#616161]">Manage credit allocations and pricing</p>
              </div>
            </div>
          </div>

          {/* Save Bar */}
          {hasChanges && (
            <div className="mb-6 p-4 rounded-lg bg-[#FFF8E1] border border-[#FFE082] flex items-center justify-between max-md:flex-col max-md:gap-3">
              <span className="text-sm text-[#F57F17]">⚠️ You have unsaved changes</span>
              <div className="flex gap-3 max-md:w-full">
                <button
                  onClick={handleReset}
                  className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1"
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2 max-md:flex-1"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Base Price Configuration */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4 mb-6 max-md:mb-4">
            <div className="flex items-center gap-2 mb-4 max-md:mb-3">
              <DollarSign size={20} className="text-[#1565C0]" />
              <h2 className="text-lg max-md:text-base font-semibold text-[#212121]">Base Credit Pricing</h2>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#212121]">
                  Price per Credit (NPR)
                </label>
                <input
                  type="number"
                  value={baseCreditPrice}
                  onChange={(e) => {
                    setBaseCreditPrice(Number(e.target.value));
                    setHasChanges(true);
                  }}
                  className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                />
              </div>
              <div className="bg-[#F5F5F5] rounded-md p-3 flex items-center justify-between">
                <span className="text-sm text-[#616161]">100 Credits</span>
                <span className="text-lg font-bold text-[#1565C0]">NPR {(baseCreditPrice * 100).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Plan-Based Credits */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4 mb-6 max-md:mb-4">
            <div className="flex items-center gap-2 mb-4 max-md:mb-3">
              <Package size={20} className="text-[#1565C0]" />
              <h2 className="text-lg max-md:text-base font-semibold text-[#212121]">Plan-Based Credit Allocation</h2>
            </div>
            <p className="text-sm text-[#616161] mb-4 max-md:mb-3">
              Configure monthly credit allocation for each subscription plan
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E0E0E0]">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Plan</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Monthly Credits</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Price/Credit</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Rollover</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {planCredits.map((plan, index) => (
                    <tr key={plan.plan} className="border-b border-[#EEEEEE] last:border-0">
                      <td className="py-4 px-2">
                        <span className="font-semibold text-[#212121]">{plan.plan}</span>
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="number"
                          value={plan.monthlyCredits}
                          onChange={(e) => updatePlanCredit(index, 'monthlyCredits', Number(e.target.value))}
                          className="w-32 max-md:w-24 h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="number"
                          step="0.01"
                          value={plan.price}
                          onChange={(e) => updatePlanCredit(index, 'price', Number(e.target.value))}
                          className="w-32 max-md:w-24 h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.rollover}
                            onChange={(e) => updatePlanCredit(index, 'rollover', e.target.checked)}
                            className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0] cursor-pointer"
                          />
                          <span className="text-sm text-[#616161]">Enabled</span>
                        </label>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-semibold text-[#1565C0]">
                          NPR {(plan.monthlyCredits * plan.price).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Credit Packages */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
            <div className="flex items-center gap-2 mb-4 max-md:mb-3">
              <TrendingUp size={20} className="text-[#1565C0]" />
              <h2 className="text-lg max-md:text-base font-semibold text-[#212121]">One-Time Credit Packages</h2>
            </div>
            <p className="text-sm text-[#616161] mb-4 max-md:mb-3">
              Configure credit packages available for purchase
            </p>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="border border-[#E0E0E0] rounded-lg p-4 max-md:p-3">
                  <div className="flex items-center justify-between mb-3 max-md:mb-2">
                    <span className="text-xl font-bold text-[#212121]">{pkg.credits.toLocaleString()}</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pkg.enabled}
                        onChange={(e) => updatePackage(index, 'enabled', e.target.checked)}
                        className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0]"
                      />
                      <span className="text-xs text-[#616161]">Enabled</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block mb-1 text-xs font-semibold text-[#616161]">Price (NPR)</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => updatePackage(index, 'price', Number(e.target.value))}
                        className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-semibold text-[#616161]">Discount (%)</label>
                      <input
                        type="number"
                        value={pkg.discount}
                        onChange={(e) => updatePackage(index, 'discount', Number(e.target.value))}
                        className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                      />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#E0E0E0] flex justify-between text-xs">
                    <span className="text-[#616161]">Per credit:</span>
                    <span className="font-semibold text-[#212121]">NPR {(pkg.price / pkg.credits).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 max-md:mt-4 p-4 max-md:p-3 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
            <p className="text-sm text-[#1565C0]">
              ℹ️ <strong>Credit Logic:</strong> 1 Credit = 1 AI Query in Business Playground. Credits are deducted before query execution. Unused credits roll over based on plan settings.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
