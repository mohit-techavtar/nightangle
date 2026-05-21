import React, { useMemo, useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useOrgHierarchy, type OrgNode, type OrgUser } from "../../hooks/useOrgHierarchy";
import { useCompanies } from "../../hooks/useCompanies";
import {
  seedDistributionRules, type DistributionRule, type DistributionStrategy,
  simulateDistribution, eligibleAssignees,
} from "../../lib/leadDistribution";
import {
  Network, Users, ChevronRight, ChevronDown, Building2, Shuffle, Scale,
  MapPin, Play, UserCheck, Layers, Plus, GitBranch,
} from "lucide-react";

const STRATEGY_META: Record<DistributionStrategy, { label: string; icon: React.ComponentType<{ size?: number }>; color: string }> = {
  round_robin:  { label: "Round Robin",   icon: Shuffle, color: "text-[#1565C0] bg-[#E3F2FD]" },
  load_balanced:{ label: "Load Balanced", icon: Scale,   color: "text-[#2E7D32] bg-[#E8F5E9]" },
  territory:    { label: "Territory",     icon: MapPin,  color: "text-[#7B1FA2] bg-[#F3E5F5]" },
  manual:       { label: "Manual",        icon: UserCheck, color: "text-[#616161] bg-[#F5F5F5]" },
};

export function OrgHierarchy() {
  const { users, buildTree, getDescendants, usersByBranch } = useOrgHierarchy();
  const { companies } = useCompanies();
  const [activeTab, setActiveTab] = useState<"hierarchy" | "distribution">("hierarchy");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(users.map((u) => u.id)));
  const [rules, setRules] = useState<DistributionRule[]>(seedDistributionRules);

  const branchName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  const tree = useMemo<OrgNode[]>(
    () => (branchFilter === "all" ? buildTree() : buildTree(branchFilter)),
    [branchFilter, users]
  );

  const toggle = (id: string) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const renderNode = (node: OrgNode): React.ReactNode => {
    const reportCount = getDescendants(node.user.id).length;
    const hasChildren = node.children.length > 0;
    const isOpen = expanded.has(node.user.id);
    return (
      <div key={node.user.id}>
        <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#F9FAFB] group" style={{ marginLeft: node.depth * 28 }}>
          {hasChildren ? (
            <button onClick={() => toggle(node.user.id)} className="text-[#9E9E9E] hover:text-[#212121]">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : <span className="w-4 inline-block" />}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#42A5F5] to-[#1565C0] text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {node.user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#212121] truncate">{node.user.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#3730A3] font-medium">{node.user.title}</span>
            </div>
            <span className="text-xs text-[#9E9E9E] flex items-center gap-1.5">
              <Building2 size={11} /> {branchName(node.user.branchId)}
              {reportCount > 0 && <><span>·</span><Users size={11} /> {reportCount} report{reportCount > 1 ? "s" : ""}</>}
            </span>
          </div>
          {node.user.capacity > 0 && (
            <div className="text-right shrink-0">
              <div className="text-xs font-medium text-[#212121]">{node.user.openLeads}/{node.user.capacity}</div>
              <div className="w-20 h-1.5 rounded-full bg-[#EEEEEE] mt-1 overflow-hidden">
                <div className={`h-full rounded-full ${node.user.openLeads / node.user.capacity > 0.8 ? "bg-[#C62828]" : "bg-[#2E7D32]"}`}
                  style={{ width: `${Math.min(100, (node.user.openLeads / node.user.capacity) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
        {hasChildren && isOpen && node.children.map(renderNode)}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "Team" }, { label: "Org Hierarchy" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto p-6 max-w-6xl w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] flex items-center gap-2"><Network size={24} className="text-[#1565C0]" /> Organisation Hierarchy</h1>
            <p className="text-sm text-[#616161] mt-1">Multi-level reporting across branches, with branch-level lead distribution.</p>
          </div>
          <button className="px-4 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5"><Plus size={16} /> Add User</button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Users", value: users.length, icon: Users, grad: "from-[#42A5F5] to-[#1565C0]" },
            { label: "Branches", value: companies.length, icon: Building2, grad: "from-[#26C6DA] to-[#00897B]" },
            { label: "Managers", value: users.filter((u) => users.some((c) => c.reportsTo === u.id)).length, icon: Layers, grad: "from-[#66BB6A] to-[#2E7D32]" },
            { label: "Active Rules", value: rules.filter((r) => r.enabled).length, icon: GitBranch, grad: "from-[#AB47BC] to-[#6A1B9A]" },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white border border-[#E0E0E0] rounded-xl p-4">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${k.grad} text-white flex items-center justify-center mb-2`}><Icon size={18} /></div>
                <div className="text-2xl font-semibold text-[#212121]">{k.value}</div>
                <div className="text-xs text-[#9E9E9E]">{k.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(["hierarchy", "distribution"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 h-10 rounded-lg text-sm font-semibold capitalize transition-colors ${activeTab === t ? "bg-[#1565C0] text-white" : "bg-white border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>
              {t === "hierarchy" ? "Reporting Hierarchy" : "Lead Distribution"}
            </button>
          ))}
        </div>

        {activeTab === "hierarchy" ? (
          <div className="bg-white border border-[#E0E0E0] rounded-xl">
            <div className="flex items-center justify-between p-3 border-b border-[#E0E0E0]">
              <span className="text-sm font-medium text-[#212121]">Reporting structure</span>
              <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="h-9 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]">
                <option value="all">All branches</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="p-2">{tree.map(renderNode)}</div>
          </div>
        ) : (
          <DistributionPanel rules={rules} setRules={setRules} branchName={branchName} usersByBranch={usersByBranch} companies={companies} />
        )}
      </div>
    </div>
  );
}

function DistributionPanel({
  rules, setRules, branchName, usersByBranch, companies,
}: {
  rules: DistributionRule[]; setRules: React.Dispatch<React.SetStateAction<DistributionRule[]>>;
  branchName: (id: string) => string; usersByBranch: (id: string) => OrgUser[]; companies: { id: string; name: string }[];
}) {
  const [simulating, setSimulating] = useState<string | null>(null);

  const sampleLeads = [
    { fullName: "Lead A", state: "Bagmati" }, { fullName: "Lead B", state: "Maharashtra" },
    { fullName: "Lead C", state: "Gandaki" }, { fullName: "Lead D", state: "Karnataka" },
    { fullName: "Lead E", state: "Bagmati" }, { fullName: "Lead F", state: "Texas" },
  ];

  const runSim = (rule: DistributionRule) => {
    setSimulating(rule.id === simulating ? null : rule.id);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4 flex items-start gap-3">
        <Shuffle size={18} className="text-[#F57F17] mt-0.5" />
        <p className="text-sm text-[#5D4037]">
          When a lead is captured (web form, import, AI call), the matching branch rule decides the assignee — by round-robin, current load, or territory. Visibility then rolls up the reporting chain automatically.
        </p>
      </div>

      {rules.map((rule) => {
        const meta = STRATEGY_META[rule.strategy];
        const Icon = meta.icon;
        const pool = usersByBranch(rule.branchId);
        const eligible = eligibleAssignees(pool);
        const sim = simulating === rule.id ? simulateDistribution(rule, sampleLeads, pool) : null;
        return (
          <div key={rule.id} className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.color}`}><Icon size={20} /></div>
                <div>
                  <div className="text-sm font-semibold text-[#212121]">{rule.name}</div>
                  <div className="text-xs text-[#9E9E9E] flex items-center gap-1.5">
                    <Building2 size={11} /> {branchName(rule.branchId)} · {eligible.length} eligible assignee{eligible.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${meta.color}`}>{meta.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={rule.enabled} onChange={() => setRules((p) => p.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))} className="sr-only peer" />
                  <div className="w-10 h-5 bg-[#E0E0E0] rounded-full peer peer-checked:bg-[#2E7D32] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <button onClick={() => runSim(rule)} className="px-3 h-9 rounded-lg border border-[#1565C0] text-[#1565C0] text-sm font-medium flex items-center gap-1.5 hover:bg-[#E3F2FD]">
                  <Play size={14} /> {simulating === rule.id ? "Hide" : "Simulate"}
                </button>
              </div>
            </div>

            {rule.territory && (
              <div className="px-4 pb-3 -mt-1">
                <span className="text-xs text-[#616161]">Territory: <span className="font-medium text-[#212121]">{rule.territory.field}</span> ∈ {rule.territory.values.join(", ")}</span>
              </div>
            )}

            {sim && (
              <div className="border-t border-[#E0E0E0] bg-[#FAFAFA] p-4">
                <div className="text-xs font-semibold text-[#616161] uppercase mb-2">Simulation — 6 sample leads</div>
                <div className="space-y-1.5">
                  {sim.map((s, i) => {
                    const assignee = pool.find((u) => u.id === s.result.assigneeId);
                    return (
                      <div key={i} className="flex items-center justify-between text-sm bg-white border border-[#E0E0E0] rounded-lg px-3 py-2">
                        <span className="text-[#212121]">{(s.record as any).fullName} <span className="text-[#9E9E9E]">· {(s.record as any).state}</span></span>
                        <span className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-[#9E9E9E]" />
                          <span className="font-medium text-[#1565C0]">{assignee?.name ?? "Unassigned"}</span>
                          <span className="text-xs text-[#9E9E9E] hidden md:inline">({s.result.reason})</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
