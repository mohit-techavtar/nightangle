import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { HardDrive, Save, RotateCcw, Package, TrendingUp, AlertTriangle } from "lucide-react";

const planStorage = [
  { plan: "Starter", storage: 5120, price: 0, included: true }, // 5 GB
  { plan: "Growth", storage: 10240, price: 0, included: true }, // 10 GB
  { plan: "Enterprise", storage: 51200, price: 0, included: true }, // 50 GB
];

const storageAddOns = [
  { id: 1, storage: 10240, price: 1500, enabled: true }, // 10 GB
  { id: 2, storage: 25600, price: 3000, enabled: true }, // 25 GB
  { id: 3, storage: 51200, price: 5000, enabled: true }, // 50 GB
  { id: 4, storage: 102400, price: 8500, enabled: true }, // 100 GB
];

const mockTenants = [
  { id: "1", name: "Everest Digital Solutions", plan: "Growth", used: 8460, total: 10240, status: "warning" },
  { id: "2", name: "Himalayan Ventures", plan: "Enterprise", used: 12340, total: 51200, status: "normal" },
  { id: "3", name: "Kathmandu Tech Hub", plan: "Starter", used: 4890, total: 5120, status: "critical" },
  { id: "4", name: "Nepal Innovations", plan: "Growth", used: 5670, total: 10240, status: "normal" },
];

export function StorageConfiguration() {
  const [plans, setPlans] = useState(planStorage);
  const [addOns, setAddOns] = useState(storageAddOns);
  const [hasChanges, setHasChanges] = useState(false);

  const formatSize = (mb: number) => {
    if (mb < 1024) return `${mb} MB`;
    return `${(mb / 1024).toFixed(0)} GB`;
  };

  const handleSave = () => {
    setHasChanges(false);
    console.log("Saved storage configuration");
  };

  const handleReset = () => {
    setPlans(planStorage);
    setAddOns(storageAddOns);
    setHasChanges(false);
  };

  const updatePlan = (index: number, field: string, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
    setHasChanges(true);
  };

  const updateAddOn = (index: number, field: string, value: any) => {
    const updated = [...addOns];
    updated[index] = { ...updated[index], [field]: value };
    setAddOns(updated);
    setHasChanges(true);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Storage Configuration" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 max-md:mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 max-md:w-10 max-md:h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                <HardDrive className="text-[#1565C0]" size={24} />
              </div>
              <div>
                <h1 className="text-2xl max-md:text-xl font-bold text-[#212121]">Storage Configuration</h1>
                <p className="text-sm text-[#616161]">Manage storage allocations and monitor tenant usage</p>
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

          {/* Plan-Based Storage */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4 mb-6 max-md:mb-4">
            <div className="flex items-center gap-2 mb-4 max-md:mb-3">
              <Package size={20} className="text-[#1565C0]" />
              <h2 className="text-lg max-md:text-base font-semibold text-[#212121]">Plan-Based Storage Allocation</h2>
            </div>
            <p className="text-sm text-[#616161] mb-4 max-md:mb-3">
              Configure default storage quota for each subscription plan
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E0E0E0]">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Plan</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Storage (MB)</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Storage (GB)</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Additional Cost</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Included</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => (
                    <tr key={plan.plan} className="border-b border-[#EEEEEE] last:border-0">
                      <td className="py-4 px-2">
                        <span className="font-semibold text-[#212121]">{plan.plan}</span>
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="number"
                          value={plan.storage}
                          onChange={(e) => updatePlan(index, 'storage', Number(e.target.value))}
                          className="w-32 max-md:w-24 h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-[#616161]">{formatSize(plan.storage)}</span>
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => updatePlan(index, 'price', Number(e.target.value))}
                          className="w-32 max-md:w-24 h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                          placeholder="NPR"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.included}
                            onChange={(e) => updatePlan(index, 'included', e.target.checked)}
                            className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0] cursor-pointer"
                          />
                          <span className="text-sm text-[#616161]">In Plan</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Storage Add-Ons */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4 mb-6 max-md:mb-4">
            <div className="flex items-center gap-2 mb-4 max-md:mb-3">
              <TrendingUp size={20} className="text-[#1565C0]" />
              <h2 className="text-lg max-md:text-base font-semibold text-[#212121]">Storage Add-On Packages</h2>
            </div>
            <p className="text-sm text-[#616161] mb-4 max-md:mb-3">
              Configure additional storage packages available for purchase
            </p>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              {addOns.map((addOn, index) => (
                <div key={addOn.id} className="border border-[#E0E0E0] rounded-lg p-4 max-md:p-3">
                  <div className="flex items-center justify-between mb-3 max-md:mb-2">
                    <span className="text-xl font-bold text-[#212121]">{formatSize(addOn.storage)}</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addOn.enabled}
                        onChange={(e) => updateAddOn(index, 'enabled', e.target.checked)}
                        className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0]"
                      />
                      <span className="text-xs text-[#616161]">Enabled</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block mb-1 text-xs font-semibold text-[#616161]">Storage (MB)</label>
                      <input
                        type="number"
                        value={addOn.storage}
                        onChange={(e) => updateAddOn(index, 'storage', Number(e.target.value))}
                        className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-semibold text-[#616161]">Price (NPR/month)</label>
                      <input
                        type="number"
                        value={addOn.price}
                        onChange={(e) => updateAddOn(index, 'price', Number(e.target.value))}
                        className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
                      />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#E0E0E0] flex justify-between text-xs">
                    <span className="text-[#616161]">Per GB/month:</span>
                    <span className="font-semibold text-[#212121]">
                      NPR {(addOn.price / (addOn.storage / 1024)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tenant Usage Monitoring */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
            <div className="flex items-center gap-2 mb-4 max-md:mb-3">
              <AlertTriangle size={20} className="text-[#F57F17]" />
              <h2 className="text-lg max-md:text-base font-semibold text-[#212121]">Tenant Storage Monitoring</h2>
            </div>
            <p className="text-sm text-[#616161] mb-4 max-md:mb-3">
              Monitor storage usage across all tenants
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E0E0E0]">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Tenant</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Plan</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Used</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Total</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Usage</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTenants.map(tenant => {
                    const percentage = (tenant.used / tenant.total) * 100;
                    return (
                      <tr key={tenant.id} className="border-b border-[#EEEEEE] last:border-0">
                        <td className="py-4 px-2">
                          <span className="font-medium text-[#212121]">{tenant.name}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-sm text-[#616161]">{tenant.plan}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-sm text-[#212121]">{formatSize(tenant.used)}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-sm text-[#616161]">{formatSize(tenant.total)}</span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="w-32">
                            <div className="w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  tenant.status === "critical" ? "bg-[#C62828]" :
                                  tenant.status === "warning" ? "bg-[#F57F17]" :
                                  "bg-[#1565C0]"
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#616161] mt-1 block">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tenant.status === "critical" ? "bg-[#FFEBEE] text-[#C62828]" :
                            tenant.status === "warning" ? "bg-[#FFF8E1] text-[#F57F17]" :
                            "bg-[#E8F5E9] text-[#2E7D32]"
                          }`}>
                            {tenant.status === "critical" ? "Critical" :
                             tenant.status === "warning" ? "Warning" :
                             "Normal"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 max-md:mt-4 p-4 max-md:p-3 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
            <p className="text-sm text-[#1565C0]">
              ℹ️ <strong>Storage Logic:</strong> Each tenant receives base storage based on their plan. Additional storage can be purchased as add-ons. Tenants exceeding 95% usage receive critical alerts.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
