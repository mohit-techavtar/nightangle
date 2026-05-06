import React, { useState } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { Save, Globe, MapPin, Clock, DollarSign, Users, Building2, AlertCircle, CheckCircle2 } from "lucide-react";

export function PlatformSettings() {
  const [formData, setFormData] = useState({
    platformName: "OmniCRM",
    platformUrl: "https://omnicrm.example.com",
    supportEmail: "support@omnicrm.com",
    timezone: "Asia/Kathmandu",
    currency: "NPR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "en",
    defaultPlan: "STARTER",
    maxTenantsPerInstance: "1000",
    enableSignups: true,
    enableTrialPeriod: true,
    trialDays: "14",
    maintenanceMode: false,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Saving platform settings:", formData);
      setIsSaving(false);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Platform Settings" }]} mode="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2">Platform Settings</h2>
              <p className="text-sm text-[#616161]">Configure general platform-wide settings and defaults</p>
            </div>
            <div className="flex items-center gap-3">
              {showSuccess && (
                <div className="flex items-center gap-2 text-sm text-[#2E7D32] bg-[#E8F5E9] px-4 py-2 rounded-md">
                  <CheckCircle2 size={16} />
                  Changes saved
                </div>
              )}
              <button 
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="h-10 px-5 rounded-md bg-[#1565C0] text-white hover:bg-[#0D47A1] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {hasChanges && !showSuccess && (
            <div className="mb-4 p-3 bg-[#FFF8E1] border border-[#FFE082] rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-[#F57F17]" />
              <span className="text-[#616161]">You have unsaved changes</span>
            </div>
          )}

          {/* Platform Identity */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Platform Identity</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={formData.platformName}
                  onChange={(e) => handleChange("platformName", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Platform URL
                </label>
                <input
                  type="url"
                  value={formData.platformUrl}
                  onChange={(e) => handleChange("platformUrl", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Localization</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Default Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="Asia/Kathmandu">Asia/Kathmandu (GMT+5:45)</option>
                  <option value="UTC">UTC (GMT+0:00)</option>
                  <option value="America/New_York">America/New York (GMT-5:00)</option>
                  <option value="Europe/London">Europe/London (GMT+0:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="NPR">NPR - Nepalese Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Date Format
                </label>
                <select
                  value={formData.dateFormat}
                  onChange={(e) => handleChange("dateFormat", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Time Format
                </label>
                <select
                  value={formData.timeFormat}
                  onChange={(e) => handleChange("timeFormat", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="24h">24-hour (14:30)</option>
                  <option value="12h">12-hour (2:30 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tenant Defaults */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Tenant Defaults</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Default Subscription Plan
                </label>
                <select
                  value={formData.defaultPlan}
                  onChange={(e) => handleChange("defaultPlan", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="STARTER">Starter Plan</option>
                  <option value="GROWTH">Growth Plan</option>
                  <option value="ENTERPRISE">Enterprise Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Max Tenants Per Instance
                </label>
                <input
                  type="number"
                  value={formData.maxTenantsPerInstance}
                  onChange={(e) => handleChange("maxTenantsPerInstance", e.target.value)}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableSignups}
                    onChange={(e) => handleChange("enableSignups", e.target.checked)}
                    className="rounded border-[#E0E0E0] text-[#1565C0]"
                  />
                  <span className="text-sm text-[#212121]">Enable new tenant signups</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.enableTrialPeriod}
                    onChange={(e) => handleChange("enableTrialPeriod", e.target.checked)}
                    className="rounded border-[#E0E0E0] text-[#1565C0]"
                  />
                  <span className="text-sm text-[#212121]">Enable trial period</span>
                </label>
                {formData.enableTrialPeriod && (
                  <input
                    type="number"
                    value={formData.trialDays}
                    onChange={(e) => handleChange("trialDays", e.target.value)}
                    className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                    placeholder="Trial days"
                  />
                )}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">System Status</h3>
            </div>

            <div>
              <label className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
                <div>
                  <span className="text-sm font-medium text-[#212121] block mb-0.5">Maintenance Mode</span>
                  <span className="text-xs text-[#616161]">Disable access for all users except super admins</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  className="rounded border-[#E0E0E0] text-[#C62828]"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}