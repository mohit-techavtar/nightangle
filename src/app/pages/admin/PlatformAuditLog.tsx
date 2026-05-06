import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Shield, Search, Filter, Download, Eye, RefreshCw, Clock, User,
  Bot, Cpu, AlertTriangle, CheckCircle2, XCircle, ChevronRight,
  Building2, Database, Lock, Unlock, Zap, FileText, Users,
  CreditCard, Key, Globe, Calendar
} from "lucide-react";
import { useOmniStore } from "../../store/index";

type ActorType = "human" | "ai" | "system";
type ActionSeverity = "critical" | "high" | "medium" | "info";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorId: string;
  actorType: ActorType;
  tenantId: string | null;
  tenantName?: string;
  agentId?: string;
  campaignId?: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  ipAddress?: string;
  severity: ActionSeverity;
  tags: string[];
}

const enriched: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2025-04-27T09:15:00Z", actor: "Rajesh Sharma", actorId: "USR-001", actorType: "human", tenantId: "TNT-001", tenantName: "TechAvtar India", action: "create", entity: "Lead", entityId: "LD-0001", after: { fullName: "Arjun Sharma", status: "New" }, ipAddress: "103.21.56.78", severity: "info", tags: ["CRM", "Lead"] },
  { id: "AUD-002", timestamp: "2025-04-27T08:30:00Z", actor: "Sarah-Sales (AI)", actorId: "AGT-001", actorType: "ai", tenantId: "TNT-001", tenantName: "TechAvtar India", agentId: "AGT-001", campaignId: "CMP-001", action: "ai_qualify", entity: "Lead", entityId: "LD-0002", before: { status: "New" }, after: { status: "Qualified", aiScore: 87 }, severity: "info", tags: ["AI", "Lead"] },
  { id: "AUD-003", timestamp: "2025-04-27T08:00:00Z", actor: "Super Admin (SA-01)", actorId: "USR-SA-001", actorType: "human", tenantId: null, action: "impersonate_tenant", entity: "Tenant", entityId: "TNT-001", reason: "Support ticket SUPP-1234", ipAddress: "10.0.0.1", severity: "critical", tags: ["Security", "Impersonation"] },
  { id: "AUD-004", timestamp: "2025-04-26T16:30:00Z", actor: "Priya Mehta", actorId: "USR-002", actorType: "human", tenantId: "TNT-001", tenantName: "TechAvtar India", action: "deactivate", entity: "User", entityId: "USR-007", before: { status: "Active" }, after: { status: "Inactive" }, reason: "Employee resignation", ipAddress: "103.21.56.79", severity: "high", tags: ["IAM", "User"] },
  { id: "AUD-005", timestamp: "2025-04-26T14:00:00Z", actor: "Super Admin (SA-01)", actorId: "USR-SA-001", actorType: "human", tenantId: null, action: "create_override", entity: "Override", entityId: "OVR-002", after: { type: "credit_limit", value: "₹75,000", tenantId: "TNT-001" }, reason: "Q2 campaign approval", ipAddress: "10.0.0.1", severity: "critical", tags: ["Override", "Financial"] },
  { id: "AUD-006", timestamp: "2025-04-26T12:00:00Z", actor: "System", actorId: "system", actorType: "system", tenantId: "TNT-011", tenantName: "Pinnacle Mfg", action: "hard_stop_triggered", entity: "Tenant", entityId: "TNT-011", after: { hardStop: true, reason: "Credit exhausted" }, severity: "critical", tags: ["Billing", "HardStop"], tags2: [] },
  { id: "AUD-007", timestamp: "2025-04-26T11:00:00Z", actor: "Super Admin (SA-02)", actorId: "USR-SA-002", actorType: "human", tenantId: null, action: "approve_license", entity: "License", entityId: "LIC-001", reason: "Checker approval for TechAvtar renewal", ipAddress: "10.0.0.2", severity: "high", tags: ["License", "Approval"] },
  { id: "AUD-008", timestamp: "2025-04-26T10:00:00Z", actor: "System", actorId: "system", actorType: "system", tenantId: "TNT-001", tenantName: "TechAvtar India", action: "credit_deduction", entity: "Billing", entityId: "TNT-001", before: { balance: 19000 }, after: { balance: 18500 }, reason: "AI Call campaign CMP-004 — 50 calls × ₹10", severity: "medium", tags: ["Billing", "Credits"] },
  { id: "AUD-009", timestamp: "2025-04-25T15:00:00Z", actor: "Rajesh Sharma", actorId: "USR-001", actorType: "human", tenantId: "TNT-001", tenantName: "TechAvtar India", action: "export_leads", entity: "Lead", entityId: "*", reason: "Quarterly export for backup", ipAddress: "103.21.56.78", severity: "high", tags: ["Data Export", "DPDP"] },
  { id: "AUD-010", timestamp: "2025-04-25T14:00:00Z", actor: "Ananya-Collections (AI)", actorId: "AGT-003", actorType: "ai", tenantId: "TNT-001", tenantName: "TechAvtar India", agentId: "AGT-003", campaignId: "CMP-004", action: "consent_capture", entity: "Lead", entityId: "LD-0015", after: { consentGiven: true, timestamp: "2025-04-25T14:01:00Z" }, severity: "info", tags: ["AI", "Consent", "DPDP"] },
  { id: "AUD-011", timestamp: "2025-04-25T09:00:00Z", actor: "System", actorId: "system", actorType: "system", tenantId: null, action: "kyc_verification_auto", entity: "Tenant", entityId: "TNT-003", after: { kycStatus: "Verified", method: "GSTIN_API" }, severity: "info", tags: ["KYC", "Onboarding"] },
  { id: "AUD-012", timestamp: "2025-04-24T18:00:00Z", actor: "Super Admin (SA-01)", actorId: "USR-SA-001", actorType: "human", tenantId: "TNT-006", tenantName: "Nexus Healthcare", action: "suspend_tenant", entity: "Tenant", entityId: "TNT-006", before: { status: "Active" }, after: { status: "Suspended" }, reason: "Payment overdue 30+ days. Auto-suspend triggered after 3 payment failures.", ipAddress: "10.0.0.1", severity: "critical", tags: ["Tenant", "Suspension"] },
];

const severityConfig: Record<ActionSeverity, { label: string; color: string; bg: string; dotColor: string }> = {
  critical: { label: "Critical", color: "text-red-700", bg: "bg-red-50", dotColor: "bg-red-500" },
  high: { label: "High", color: "text-orange-700", bg: "bg-orange-50", dotColor: "bg-orange-500" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-50", dotColor: "bg-amber-500" },
  info: { label: "Info", color: "text-blue-700", bg: "bg-blue-50", dotColor: "bg-blue-400" },
};

const actorTypeConfig: Record<ActorType, { icon: React.ElementType; color: string; label: string }> = {
  human: { icon: User, color: "text-gray-600", label: "Human" },
  ai: { icon: Bot, color: "text-purple-600", label: "AI Agent" },
  system: { icon: Cpu, color: "text-blue-600", label: "System" },
};

const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function PlatformAuditLog() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [actorFilter, setActorFilter] = useState<string>("All");
  const [entityFilter, setEntityFilter] = useState<string>("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("2025-04-24");
  const [dateTo, setDateTo] = useState("2025-04-27");

  const filtered = enriched.filter(e => {
    const matchSearch = e.actor.toLowerCase().includes(search.toLowerCase()) || e.action.toLowerCase().includes(search.toLowerCase()) || e.entity.toLowerCase().includes(search.toLowerCase()) || (e.tenantName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchSev = severityFilter === "All" || e.severity === severityFilter;
    const matchActor = actorFilter === "All" || e.actorType === actorFilter;
    const matchEntity = entityFilter === "All" || e.entity === entityFilter;
    return matchSearch && matchSev && matchActor && matchEntity;
  });

  const entities = [...new Set(enriched.map(e => e.entity))];
  const criticalCount = enriched.filter(e => e.severity === "critical").length;

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Admin" }, { label: "Controls", path: "/admin/controls" }, { label: "Platform Audit Log" }]}
        companyName="Hitech Solutions"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Platform Audit Log</h1>
              <p className="text-sm text-gray-500 mt-1">Immutable audit trail · All actors: human, AI agent, system · Every privileged action</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Critical Alert */}
          {criticalCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800 font-medium">{criticalCount} critical events in the selected period — review required</p>
              <button className="ml-auto text-xs text-red-700 underline hover:no-underline" onClick={() => setSeverityFilter("critical")}>View Critical Only</button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Total Events", value: enriched.length, icon: FileText, color: "text-gray-600" },
              { label: "Critical", value: enriched.filter(e => e.severity === "critical").length, icon: AlertTriangle, color: "text-red-600" },
              { label: "Human Actions", value: enriched.filter(e => e.actorType === "human").length, icon: User, color: "text-blue-600" },
              { label: "AI Actions", value: enriched.filter(e => e.actorType === "ai").length, icon: Bot, color: "text-purple-600" },
              { label: "System Events", value: enriched.filter(e => e.actorType === "system").length, icon: Cpu, color: "text-gray-500" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <div>
                    <p className="text-lg font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search actor, action, entity, tenant..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72" />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-400 text-sm">to</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="info">Info</option>
            </select>
            <select value={actorFilter} onChange={e => setActorFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Actors</option>
              <option value="human">Human</option>
              <option value="ai">AI Agent</option>
              <option value="system">System</option>
            </select>
            <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Entities</option>
              {entities.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <span className="ml-auto text-xs text-gray-500">{filtered.length} of {enriched.length} events</span>
          </div>

          {/* Audit Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Timestamp</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Actor</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Tenant</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Entity</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Severity</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Tags</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => {
                  const sev = severityConfig[entry.severity];
                  const actor = actorTypeConfig[entry.actorType];
                  const isExpanded = expanded === entry.id;

                  return (
                    <React.Fragment key={entry.id}>
                      <tr className={`${i < filtered.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 ${sev.severity === "critical" ? "bg-red-50/20" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sev.dotColor}`} />
                            <p className="text-xs text-gray-700 font-mono whitespace-nowrap">{fmtDate(entry.timestamp)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <actor.icon className={`w-3.5 h-3.5 ${actor.color} flex-shrink-0`} />
                            <div>
                              <p className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{entry.actor}</p>
                              <p className="text-xs text-gray-400">{actor.label}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-700 truncate max-w-[120px]">{entry.tenantName ?? <span className="text-gray-400 italic">Platform</span>}</p>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">{entry.action}</code>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-700">{entry.entity}</p>
                          <p className="text-xs text-gray-400 font-mono">{entry.entityId}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sev.bg} ${sev.color}`}>{sev.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {entry.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setExpanded(isExpanded ? null : entry.id)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline ml-auto">
                            <Eye className="w-3.5 h-3.5" />
                            {isExpanded ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b border-gray-100 bg-gray-50/80">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              {entry.ipAddress && (
                                <div>
                                  <p className="font-medium text-gray-500 mb-1">IP Address</p>
                                  <code className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{entry.ipAddress}</code>
                                </div>
                              )}
                              {entry.reason && (
                                <div className="col-span-2">
                                  <p className="font-medium text-gray-500 mb-1">Reason / Context</p>
                                  <p className="text-gray-700 bg-gray-100 rounded px-2 py-1">{entry.reason}</p>
                                </div>
                              )}
                              {(entry.before || entry.after) && (
                                <div className="col-span-3">
                                  <p className="font-medium text-gray-500 mb-1">State Change</p>
                                  <div className="grid grid-cols-2 gap-3">
                                    {entry.before && (
                                      <div className="bg-red-50 rounded-lg p-2">
                                        <p className="text-xs text-red-600 font-medium mb-1">Before</p>
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{JSON.stringify(entry.before, null, 2)}</pre>
                                      </div>
                                    )}
                                    {entry.after && (
                                      <div className="bg-green-50 rounded-lg p-2">
                                        <p className="text-xs text-green-600 font-medium mb-1">After</p>
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{JSON.stringify(entry.after, null, 2)}</pre>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {(entry.agentId || entry.campaignId) && (
                                <div>
                                  <p className="font-medium text-gray-500 mb-1">AI Context</p>
                                  <div className="space-y-0.5">
                                    {entry.agentId && <p className="text-gray-700">Agent: <code className="bg-gray-100 px-1 rounded">{entry.agentId}</code></p>}
                                    {entry.campaignId && <p className="text-gray-700">Campaign: <code className="bg-gray-100 px-1 rounded">{entry.campaignId}</code></p>}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
