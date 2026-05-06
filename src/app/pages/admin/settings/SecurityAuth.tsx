import React, { useState } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { Save, Shield, Lock, Key, Clock, AlertTriangle, CheckCircle2, AlertCircle, Smartphone, Mail } from "lucide-react";

export function SecurityAuth() {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: "8",
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: "90",
    preventReuse: "5",
  });

  const [sessionConfig, setSessionConfig] = useState({
    sessionTimeout: "60",
    maxConcurrentSessions: "3",
    rememberMeDays: "30",
    forceLogoutInactive: true,
  });

  const [mfaConfig, setMfaConfig] = useState({
    enableMFA: true,
    enforceMFA: false,
    allowedMethods: ["authenticator", "sms", "email"],
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Saving security settings");
      setIsSaving(false);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const toggleMFAMethod = (method: string) => {
    const newMethods = mfaConfig.allowedMethods.includes(method)
      ? mfaConfig.allowedMethods.filter(m => m !== method)
      : [...mfaConfig.allowedMethods, method];
    setMfaConfig({ ...mfaConfig, allowedMethods: newMethods });
    handleChange();
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Security & Authentication" }]} mode="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2">Security & Authentication</h2>
              <p className="text-sm text-[#616161]">Configure password policies, MFA, and session management</p>
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

          {/* Password Policy */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Password Policy</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Minimum Length
                </label>
                <input
                  type="number"
                  value={passwordPolicy.minLength}
                  onChange={(e) => { setPasswordPolicy({ ...passwordPolicy, minLength: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                  min="6"
                  max="32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={passwordPolicy.expiryDays}
                  onChange={(e) => { setPasswordPolicy({ ...passwordPolicy, expiryDays: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Prevent Password Reuse (last N passwords)
                </label>
                <input
                  type="number"
                  value={passwordPolicy.preventReuse}
                  onChange={(e) => { setPasswordPolicy({ ...passwordPolicy, preventReuse: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-[#EEEEEE] pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passwordPolicy.requireUppercase}
                  onChange={(e) => { setPasswordPolicy({ ...passwordPolicy, requireUppercase: e.target.checked }); handleChange(); }}
                  className="rounded border-[#E0E0E0] text-[#1565C0]"
                />
                <span className="text-sm text-[#212121]">Require uppercase letters</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passwordPolicy.requireLowercase}
                  onChange={(e) => { setPasswordPolicy({ ...passwordPolicy, requireLowercase: e.target.checked }); handleChange(); }}
                  className="rounded border-[#E0E0E0] text-[#1565C0]"
                />
                <span className="text-sm text-[#212121]">Require lowercase letters</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passwordPolicy.requireNumbers}
                  onChange={(e) => { setPasswordPolicy({ ...passwordPolicy, requireNumbers: e.target.checked }); handleChange(); }}
                  className="rounded border-[#E0E0E0] text-[#1565C0]"
                />
                <span className="text-sm text-[#212121]">Require numbers</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passwordPolicy.requireSpecialChars}
                  onChange={(e) => { setPasswordPolicy({ ...passwordPolicy, requireSpecialChars: e.target.checked }); handleChange(); }}
                  className="rounded border-[#E0E0E0] text-[#1565C0]"
                />
                <span className="text-sm text-[#212121]">Require special characters</span>
              </label>
            </div>
          </div>

          {/* Multi-Factor Authentication */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Multi-Factor Authentication (MFA)</h3>
            </div>

            <div className="space-y-3 mb-4">
              <label className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md hover:bg-[#F5F5F5] cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-[#212121] block mb-0.5">Enable MFA</span>
                  <span className="text-xs text-[#616161]">Allow users to set up two-factor authentication</span>
                </div>
                <input
                  type="checkbox"
                  checked={mfaConfig.enableMFA}
                  onChange={(e) => { setMfaConfig({ ...mfaConfig, enableMFA: e.target.checked }); handleChange(); }}
                  className="rounded border-[#E0E0E0] text-[#1565C0]"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md hover:bg-[#F5F5F5] cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-[#212121] block mb-0.5">Enforce MFA</span>
                  <span className="text-xs text-[#616161]">Require all users to enable MFA</span>
                </div>
                <input
                  type="checkbox"
                  checked={mfaConfig.enforceMFA}
                  onChange={(e) => { setMfaConfig({ ...mfaConfig, enforceMFA: e.target.checked }); handleChange(); }}
                  className="rounded border-[#E0E0E0] text-[#1565C0]"
                  disabled={!mfaConfig.enableMFA}
                />
              </label>
            </div>

            {mfaConfig.enableMFA && (
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">Allowed MFA Methods</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "authenticator", label: "Authenticator App", icon: Smartphone },
                    { id: "sms", label: "SMS", icon: Smartphone },
                    { id: "email", label: "Email", icon: Mail }
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => toggleMFAMethod(method.id)}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        mfaConfig.allowedMethods.includes(method.id)
                          ? "border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]"
                          : "border-[#E0E0E0] text-[#616161] hover:border-[#BDBDBD]"
                      }`}
                    >
                      <method.icon size={20} className="mx-auto mb-1" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Session Management */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Session Management</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={sessionConfig.sessionTimeout}
                  onChange={(e) => { setSessionConfig({ ...sessionConfig, sessionTimeout: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Max Concurrent Sessions
                </label>
                <input
                  type="number"
                  value={sessionConfig.maxConcurrentSessions}
                  onChange={(e) => { setSessionConfig({ ...sessionConfig, maxConcurrentSessions: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#212121] mb-1">
                  Remember Me Duration (days)
                </label>
                <input
                  type="number"
                  value={sessionConfig.rememberMeDays}
                  onChange={(e) => { setSessionConfig({ ...sessionConfig, rememberMeDays: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sessionConfig.forceLogoutInactive}
                onChange={(e) => { setSessionConfig({ ...sessionConfig, forceLogoutInactive: e.target.checked }); handleChange(); }}
                className="rounded border-[#E0E0E0] text-[#1565C0]"
              />
              <span className="text-sm text-[#212121]">Force logout on inactivity</span>
            </label>
          </div>

          {/* Security Alerts */}
          <div className="bg-[#FFF3E0] border border-[#FFE082] rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-[#F57F17] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#212121] mb-1">Security Best Practices</h4>
              <ul className="text-xs text-[#616161] space-y-1">
                <li>• Enable MFA for all admin accounts</li>
                <li>• Set password expiry to 90 days or less</li>
                <li>• Keep session timeout under 60 minutes for sensitive operations</li>
                <li>• Regularly review and revoke unused sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
