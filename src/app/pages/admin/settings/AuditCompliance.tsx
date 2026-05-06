import React, { useState } from "react";
import { Save, FileText, Database, Shield, Download } from "lucide-react";

export function AuditCompliance() {
  const [config, setConfig] = useState({
    enableAuditLog: true,
    retentionDays: "365",
    logLevel: "detailed",
    exportFormat: "json",
    gdprCompliant: true,
    dataRetentionDays: "730",
    allowDataExport: true,
    requireConsentTracking: true,
  });

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#212121] mb-1">Audit & Compliance</h2>
            <p className="text-sm text-[#616161]">Configure audit logs, data retention, and compliance settings</p>
          </div>
          <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white hover:bg-[#0D47A1] flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>

        {/* Audit Logging */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Audit Logging</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
              <div>
                <span className="text-sm font-medium text-[#212121] block mb-0.5">Enable Audit Logging</span>
                <span className="text-xs text-[#616161]">Track all system activities and changes</span>
              </div>
              <input
                type="checkbox"
                checked={config.enableAuditLog}
                onChange={(e) => setConfig({ ...config, enableAuditLog: e.target.checked })}
                className="rounded border-[#E0E0E0] text-[#1565C0]"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Log Retention (days)</label>
                <input
                  type="number"
                  value={config.retentionDays}
                  onChange={(e) => setConfig({ ...config, retentionDays: e.target.value })}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Log Detail Level</label>
                <select
                  value={config.logLevel}
                  onChange={(e) => setConfig({ ...config, logLevel: e.target.value })}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="minimal">Minimal</option>
                  <option value="standard">Standard</option>
                  <option value="detailed">Detailed</option>
                  <option value="verbose">Verbose</option>
                </select>
              </div>
            </div>

            <div className="bg-[#F5F5F5] rounded-md p-3">
              <h4 className="text-sm font-medium text-[#212121] mb-2">Logged Events</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-[#616161]">
                <div>✓ User login/logout</div>
                <div>✓ Tenant creation/deletion</div>
                <div>✓ License changes</div>
                <div>✓ Plan modifications</div>
                <div>✓ Permission changes</div>
                <div>✓ Payment transactions</div>
                <div>✓ Data exports</div>
                <div>✓ Settings modifications</div>
              </div>
            </div>

            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2">
              <Download size={16} /> Export Audit Logs
            </button>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Database size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Data Retention Policy</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1">
                User Data Retention (days)
              </label>
              <input
                type="number"
                value={config.dataRetentionDays}
                onChange={(e) => setConfig({ ...config, dataRetentionDays: e.target.value })}
                className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
              />
              <p className="text-xs text-[#616161] mt-1">Days to retain data after tenant deletion</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowDataExport}
                onChange={(e) => setConfig({ ...config, allowDataExport: e.target.checked })}
                className="rounded border-[#E0E0E0] text-[#1565C0]"
              />
              <span className="text-sm text-[#212121]">Allow users to export their data</span>
            </label>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Compliance</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
              <div>
                <span className="text-sm font-medium text-[#212121] block mb-0.5">GDPR Compliance</span>
                <span className="text-xs text-[#616161]">Enable GDPR-compliant data handling</span>
              </div>
              <input
                type="checkbox"
                checked={config.gdprCompliant}
                onChange={(e) => setConfig({ ...config, gdprCompliant: e.target.checked })}
                className="rounded border-[#E0E0E0] text-[#1565C0]"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
              <div>
                <span className="text-sm font-medium text-[#212121] block mb-0.5">Consent Tracking</span>
                <span className="text-xs text-[#616161]">Track and manage user consent for data processing</span>
              </div>
              <input
                type="checkbox"
                checked={config.requireConsentTracking}
                onChange={(e) => setConfig({ ...config, requireConsentTracking: e.target.checked })}
                className="rounded border-[#E0E0E0] text-[#1565C0]"
              />
            </label>

            <div className="bg-[#E8F5E9] rounded-md p-4 mt-4">
              <h4 className="text-sm font-semibold text-[#2E7D32] mb-2">Compliance Standards</h4>
              <div className="space-y-1 text-sm text-[#2E7D32]">
                <div>✓ GDPR (General Data Protection Regulation)</div>
                <div>✓ SOC 2 Type II (In Progress)</div>
                <div>✓ ISO 27001 (Planned)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
