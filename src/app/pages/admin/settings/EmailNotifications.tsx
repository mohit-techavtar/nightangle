import React, { useState } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { Save, Mail, Server, Bell, Eye, Code, AlertCircle, CheckCircle2, Send, TestTube } from "lucide-react";

export function EmailNotifications() {
  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.gmail.com",
    port: "587",
    username: "noreply@omnicrm.com",
    password: "••••••••••••",
    encryption: "TLS",
    fromEmail: "noreply@omnicrm.com",
    fromName: "OmniCRM",
  });

  const [notifications, setNotifications] = useState({
    tenantCreated: true,
    licenseExpiring: true,
    usageThreshold: true,
    paymentFailed: true,
    systemAlerts: true,
    weeklyReports: false,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Saving email settings");
      setIsSaving(false);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      alert("✅ SMTP connection successful!");
    }, 2000);
  };

  const handleSendTestEmail = () => {
    setSendingTestEmail(true);
    setTimeout(() => {
      setSendingTestEmail(false);
      alert("✅ Test email sent successfully!");
    }, 2000);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Email & Notifications" }]} mode="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2">Email & Notifications</h2>
              <p className="text-sm text-[#616161]">Configure SMTP settings and notification preferences</p>
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

          {/* SMTP Configuration */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Server size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">SMTP Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={smtpConfig.host}
                  onChange={(e) => { setSmtpConfig({ ...smtpConfig, host: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Port</label>
                <input
                  type="text"
                  value={smtpConfig.port}
                  onChange={(e) => { setSmtpConfig({ ...smtpConfig, port: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Username</label>
                <input
                  type="text"
                  value={smtpConfig.username}
                  onChange={(e) => { setSmtpConfig({ ...smtpConfig, username: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Password</label>
                <input
                  type="password"
                  value={smtpConfig.password}
                  onChange={(e) => { setSmtpConfig({ ...smtpConfig, password: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Encryption</label>
                <select
                  value={smtpConfig.encryption}
                  onChange={(e) => { setSmtpConfig({ ...smtpConfig, encryption: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="NONE">None</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">From Email</label>
                <input
                  type="email"
                  value={smtpConfig.fromEmail}
                  onChange={(e) => { setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#212121] mb-1">From Name</label>
                <input
                  type="text"
                  value={smtpConfig.fromName}
                  onChange={(e) => { setSmtpConfig({ ...smtpConfig, fromName: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="h-9 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {testingConnection ? "Testing..." : "Test Connection"}
              </button>
              <button
                onClick={handleSendTestEmail}
                disabled={sendingTestEmail}
                className="h-9 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sendingTestEmail ? "Sending..." : "Send Test Email"}
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Notification Preferences</h3>
            </div>

            <div className="space-y-3">
              {[
                { key: "tenantCreated", label: "New Tenant Created", description: "Notify when a new tenant signs up" },
                { key: "licenseExpiring", label: "License Expiring", description: "Alert 7 days before license expiration" },
                { key: "usageThreshold", label: "Usage Threshold Exceeded", description: "Notify when tenant exceeds 80% of limits" },
                { key: "paymentFailed", label: "Payment Failed", description: "Alert on failed payment transactions" },
                { key: "systemAlerts", label: "System Alerts", description: "Critical system errors and issues" },
                { key: "weeklyReports", label: "Weekly Reports", description: "Send weekly usage and analytics reports" },
              ].map((item) => (
                <label 
                  key={item.key}
                  className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md hover:bg-[#F5F5F5] cursor-pointer"
                >
                  <div>
                    <span className="text-sm font-medium text-[#212121] block mb-0.5">{item.label}</span>
                    <span className="text-xs text-[#616161]">{item.description}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => { setNotifications({ ...notifications, [item.key]: e.target.checked }); handleChange(); }}
                    className="rounded border-[#E0E0E0] text-[#1565C0]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-[#1565C0]" />
                <h3 className="font-semibold text-[#212121]">Email Templates</h3>
              </div>
              <button className="text-sm text-[#1565C0] hover:underline">Manage Templates</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Welcome Email", "Password Reset", "License Expiry", 
                "Payment Receipt", "Trial Ending", "System Alert"
              ].map((template) => (
                <div key={template} className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
                  <span className="text-sm text-[#212121]">{template}</span>
                  <button className="text-xs text-[#1565C0] hover:underline flex items-center gap-1">
                    <Eye size={12} /> Preview
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}