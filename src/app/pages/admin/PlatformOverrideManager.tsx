import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Unlock, Plus, Trash2, CheckCircle2, AlertTriangle, Clock,
  Shield, Search, Filter, User, Building2, Zap, CreditCard,
  ToggleRight, Calendar, ChevronDown, X, Loader2, AlertCircle, Eye
} from "lucide-react";
import { toast } from "sonner";

type OverrideType = "credit_limit" | "feature_flag" | "suspension_bypass" | "hard_stop_override" | "usage_cap" | "temp_license" | "kyc_bypass" | "custom";
type OverrideStatus = "Active" | "Expired" | "Revoked";

interface Override {
  id: string;
  tenantId: string;
  tenantName: string;
  type: OverrideType;
  label: string;
  value: string;
  originalValue?: string;
  reason: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  expiresAt: string | null;
  status: OverrideStatus;
  isPermanent: boolean;
}

const overrideTypeConfig: Record<OverrideType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  credit_limit: { label: "Credit Limit Override", icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
  feature_flag: { label: "Feature Flag", icon: ToggleRight, color: "text-blue-600", bg: "bg-blue-50" },
  suspension_bypass: { label: "Suspension Bypass", icon: Unlock, color: "text-orange-600", bg: "bg-orange-50" },
  hard_stop_override: { label: "Hard Stop Override", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  usage_cap: { label: "Usage Cap Override", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
  temp_license: { label: "Temporary License", icon: Calendar, color: "text-cyan-600", bg: "bg-cyan-50" },
  kyc_bypass: { label: "KYC Verification Bypass", icon: Shield, color: "text-yellow-600", bg: "bg-yellow-50" },
  custom: { label: "Custom Override", icon: CheckCircle2, color: "text-gray-600", bg: "bg-gray-50" },
};

const seedOverrides: Override[] = [
  { id: "OVR-001", tenantId: "TNT-006", tenantName: "Nexus Healthcare India", type: "suspension_bypass", label: "Grace period — payment pending", value: "Bypass active", originalValue: "Suspended", reason: "Customer confirmed EFT initiated. CEO called directly. Granting 72-hour grace period to clear dues.", createdBy: "Super Admin (SA-01)", approvedBy: "Super Admin (SA-02)", createdAt: "2025-04-25T10:00:00Z", expiresAt: "2025-04-28T10:00:00Z", status: "Active", isPermanent: false },
  { id: "OVR-002", tenantId: "TNT-001", tenantName: "TechAvtar India Pvt Ltd", type: "credit_limit", label: "Credit limit increase — Q2 campaign", value: "₹75,000", originalValue: "₹50,000", reason: "Customer running large Q2 campaign. Approved by account manager. Standard credit check passed.", createdBy: "Super Admin (SA-01)", approvedBy: "Super Admin (SA-02)", createdAt: "2025-04-20T14:00:00Z", expiresAt: "2025-06-30T23:59:59Z", status: "Active", isPermanent: false },
  { id: "OVR-003", tenantId: "TNT-008", tenantName: "CloudStack Technologies", type: "temp_license", label: "Trial extension — evaluation", value: "15 days extra trial", originalValue: "Standard 14-day trial", reason: "Customer is evaluating for team of 50. CTO requested technical evaluation time. Extended with Enterprise features enabled.", createdBy: "Super Admin (SA-02)", approvedBy: "Super Admin (SA-01)", createdAt: "2025-04-22T09:00:00Z", expiresAt: "2025-05-05T23:59:59Z", status: "Active", isPermanent: false },
  { id: "OVR-004", tenantId: "TNT-007", tenantName: "Indus Agri Solutions", type: "feature_flag", label: "Custom Objects module enabled", value: "Enabled", originalValue: "Disabled", reason: "Pre-release access for design partner. Signed NDA. Will be part of next quarterly release.", createdBy: "Super Admin (SA-01)", approvedBy: "Super Admin (SA-02)", createdAt: "2025-03-01T09:00:00Z", expiresAt: null, status: "Active", isPermanent: true },
  { id: "OVR-005", tenantId: "TNT-011", tenantName: "Pinnacle Manufacturing", type: "hard_stop_override", label: "Hard stop bypass — 24h", value: "Bypass active", originalValue: "Hard stop active", reason: "Payment gateway failure on their side. Bank holiday prevented clearing. One-time 24-hour bypass.", createdBy: "Super Admin (SA-02)", approvedBy: "Super Admin (SA-01)", createdAt: "2025-04-01T08:00:00Z", expiresAt: "2025-04-02T08:00:00Z", status: "Expired", isPermanent: false },
  { id: "OVR-006", tenantId: "TNT-003", tenantName: "Sunrise Realty Ltd", type: "kyc_bypass", label: "KYC bypass — pending verification", value: "Bypass: 30 days", originalValue: "KYC required", reason: "GST registration in process. Company submitted PAN and bank statement. KYC bypass while GSTIN is being issued.", createdBy: "Super Admin (SA-01)", createdAt: "2025-04-10T11:00:00Z", expiresAt: "2025-05-10T23:59:59Z", status: "Revoked", isPermanent: false },
];

const overrideTypes: Array<{ value: OverrideType; label: string }> = [
  { value: "credit_limit", label: "Credit Limit" },
  { value: "feature_flag", label: "Feature Flag" },
  { value: "suspension_bypass", label: "Suspension Bypass" },
  { value: "hard_stop_override", label: "Hard Stop Override" },
  { value: "usage_cap", label: "Usage Cap" },
  { value: "temp_license", label: "Temp License" },
  { value: "kyc_bypass", label: "KYC Bypass" },
  { value: "custom", label: "Custom" },
];

const fmtDate = (iso: string | null) => iso
  ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  : "Never";

const isExpiringSoon = (iso: string | null) => {
  if (!iso) return false;
  return (new Date(iso).getTime() - Date.now()) < 24 * 60 * 60 * 1000;
};

export function PlatformOverrideManager() {
  const [overrides, setOverrides] = useState(seedOverrides);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OverrideStatus>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [newOverride, setNewOverride] = useState({ tenantId: "TNT-001", type: "credit_limit" as OverrideType, value: "", reason: "", expiresAt: "", isPermanent: false });

  const filtered = overrides.filter(o => {
    const matchSearch = o.tenantName.toLowerCase().includes(search.toLowerCase()) || o.label.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchType = typeFilter === "All" || o.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleRevoke = async (id: string) => {
    if (!revokeReason.trim()) { toast.error("Revocation reason is required"); return; }
    setProcessing(id);
    await new Promise(r => setTimeout(r, 800));
    setOverrides(prev => prev.map(o => o.id === id ? { ...o, status: "Revoked" as OverrideStatus } : o));
    setShowRevokeModal(null);
    setRevokeReason("");
    setProcessing(null);
    toast.success("Override revoked. Audit log updated.");
  };

  const handleCreate = async () => {
    if (!newOverride.value.trim() || !newOverride.reason.trim()) {
      toast.error("Value and reason are required");
      return;
    }
    setProcessing("create");
    await new Promise(r => setTimeout(r, 1000));
    const typeConf = overrideTypeConfig[newOverride.type];
    const created: Override = {
      id: `OVR-${String(overrides.length + 1).padStart(3, "0")}`,
      tenantId: newOverride.tenantId,
      tenantName: seedOverrides.find(o => o.tenantId === newOverride.tenantId)?.tenantName ?? "Unknown Tenant",
      type: newOverride.type,
      label: typeConf.label,
      value: newOverride.value,
      reason: newOverride.reason,
      createdBy: "Super Admin (SA-01)",
      createdAt: new Date().toISOString(),
      expiresAt: newOverride.isPermanent ? null : (newOverride.expiresAt || null),
      status: "Active",
      isPermanent: newOverride.isPermanent,
    };
    setOverrides(prev => [created, ...prev]);
    setShowCreateModal(false);
    setProcessing(null);
    toast.success("Override created. Dual approval verified. Audit logged.");
  };

  const activeCount = overrides.filter(o => o.status === "Active").length;
  const expiringSoonCount = overrides.filter(o => o.status === "Active" && isExpiringSoon(o.expiresAt)).length;

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Admin" }, { label: "Controls", path: "/admin/controls" }, { label: "Override Manager" }]}
        companyName="Hitech Solutions"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Platform Override Manager</h1>
              <p className="text-sm text-gray-500 mt-1">Controlled overrides with dual-admin approval, reason enforcement, and full audit trail</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Override
            </button>
          </div>

          {/* Risk Banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">High-Risk Zone — Dual Approval Enforced</p>
              <p className="text-xs text-red-700 mt-0.5">All overrides require two distinct super-admins. Maker ≠ Checker. Every action is permanently logged to the immutable audit trail. Overrides are time-limited unless explicitly marked permanent.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Active Overrides", value: activeCount, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
              { label: "Expiring in 24h", value: expiringSoonCount, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Expired", value: overrides.filter(o => o.status === "Expired").length, icon: X, color: "text-gray-500", bg: "bg-gray-50" },
              { label: "Revoked", value: overrides.filter(o => o.status === "Revoked").length, icon: Trash2, color: "text-red-600", bg: "bg-red-50" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search overrides..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            </div>
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              {(["All", "Active", "Expired", "Revoked"] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 text-sm font-medium transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>{s}</button>
              ))}
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Types</option>
              {overrideTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Override Cards */}
          <div className="space-y-3">
            {filtered.map(override => {
              const typeConf = overrideTypeConfig[override.type];
              const expiring = override.status === "Active" && isExpiringSoon(override.expiresAt);
              return (
                <div key={override.id} className={`bg-white rounded-xl border ${expiring ? "border-orange-200" : "border-gray-200"} p-5`}>
                  <div className="flex items-start gap-4">
                    {/* Type icon */}
                    <div className={`w-10 h-10 ${typeConf.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <typeConf.icon className={`w-5 h-5 ${typeConf.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">{typeConf.label}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              override.status === "Active" ? "bg-green-50 text-green-700" :
                              override.status === "Expired" ? "bg-gray-100 text-gray-600" :
                              "bg-red-50 text-red-700"
                            }`}>{override.status}</span>
                            {override.isPermanent && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Permanent</span>}
                            {expiring && <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Expiring soon</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">{override.tenantName}</span>
                            <span className="text-xs text-gray-400">{override.tenantId}</span>
                          </div>
                        </div>
                        {override.status === "Active" && (
                          <button
                            onClick={() => setShowRevokeModal(override.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                            Revoke
                          </button>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Override Value</p>
                          <div className="flex items-center gap-1">
                            {override.originalValue && (
                              <><span className="text-xs text-gray-400 line-through">{override.originalValue}</span><span className="text-xs text-gray-400">→</span></>
                            )}
                            <span className={`text-sm font-semibold ${typeConf.color}`}>{override.value}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Expires At</p>
                          <p className="text-xs font-medium text-gray-700">{override.isPermanent ? "Never (Permanent)" : fmtDate(override.expiresAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Approval Chain</p>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{override.createdBy}</span>
                            {override.approvedBy && (
                              <><span className="text-gray-400">+</span><span>{override.approvedBy}</span></>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Reason:</span> {override.reason}</p>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">Created {fmtDate(override.createdAt)} · ID: {override.id}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
              <Unlock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No overrides found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Override Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Create Platform Override</h3>
              <p className="text-xs text-gray-500 mt-0.5">Requires dual admin approval. Will be permanently logged.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tenant *</label>
                  <select value={newOverride.tenantId} onChange={e => setNewOverride(p => ({ ...p, tenantId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="TNT-001">TechAvtar India</option>
                    <option value="TNT-002">Everest Digital</option>
                    <option value="TNT-004">Global Fintech</option>
                    <option value="TNT-006">Nexus Healthcare</option>
                    <option value="TNT-008">CloudStack</option>
                    <option value="TNT-011">Pinnacle Mfg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Override Type *</label>
                  <select value={newOverride.type} onChange={e => setNewOverride(p => ({ ...p, type: e.target.value as OverrideType }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {overrideTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Override Value *</label>
                <input type="text" value={newOverride.value} onChange={e => setNewOverride(p => ({ ...p, value: e.target.value }))} placeholder="e.g., ₹1,00,000 or Enabled or Bypass: 72h" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Justification *</label>
                <textarea value={newOverride.reason} onChange={e => setNewOverride(p => ({ ...p, reason: e.target.value }))} placeholder="Detailed reason for this override. Will be permanently stored in audit log." rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="datetime-local" value={newOverride.expiresAt} onChange={e => setNewOverride(p => ({ ...p, expiresAt: e.target.value }))} disabled={newOverride.isPermanent} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pb-2">
                  <input type="checkbox" checked={newOverride.isPermanent} onChange={e => setNewOverride(p => ({ ...p, isPermanent: e.target.checked }))} className="rounded" />
                  Permanent (no expiry)
                </label>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">A second admin must approve this override. This action will be permanently logged with your credentials, timestamp, and IP address.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 text-sm text-gray-600 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!!processing} className="flex-1 text-sm bg-blue-600 text-white rounded-lg py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-60 font-medium">
                {processing === "create" ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create & Submit for Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Revoke Override</h3>
            </div>
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">Revoking this override will immediately restore original system settings for the tenant. This action is irreversible and logged.</p>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Revocation Reason *</label>
              <textarea value={revokeReason} onChange={e => setRevokeReason(e.target.value)} placeholder="Why is this override being revoked?" rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setShowRevokeModal(null); setRevokeReason(""); }} className="flex-1 text-sm text-gray-600 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleRevoke(showRevokeModal)} disabled={!revokeReason.trim() || !!processing} className="flex-1 text-sm bg-red-600 text-white rounded-lg py-2.5 hover:bg-red-700 transition-colors disabled:opacity-60 font-medium">
                {processing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Revoke Override"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
