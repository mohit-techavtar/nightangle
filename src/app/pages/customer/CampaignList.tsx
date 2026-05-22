import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useCampaigns, type Campaign } from "../../hooks/useCampaigns";
import {
  Plus, Search, Edit, Trash2, Copy, Play, Pause, Eye, MoreVertical,
  Phone, MessageCircle, MessageSquare, Mail, Megaphone, Users, TrendingUp,
  Target, CheckCircle2, Clock, X, LayoutGrid, List as ListIcon, IndianRupee,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Task 3 — Campaign module redesigned as a Salesforce Lightning
// style console: KPI strip, list-view tabs, search/filter, and a
// records table with full CRUD row actions.
// ============================================================

const CHANNEL_META: Record<string, { label: string; icon: React.ComponentType<{ size?: number }>; color: string }> = {
  "ai-calling": { label: "AI Call", icon: Phone, color: "text-[#0176D3]" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "text-[#1FA855]" },
  sms: { label: "SMS", icon: MessageSquare, color: "text-[#E65100]" },
  email: { label: "Email", icon: Mail, color: "text-[#6A1B9A]" },
};
const STATUS_STYLE: Record<string, string> = {
  draft: "bg-[#F3F3F3] text-[#747474]",
  active: "bg-[#EBF7EE] text-[#2E844A]",
  scheduled: "bg-[#FEF9E7] text-[#A86403]",
  paused: "bg-[#FEF1EE] text-[#BA0517]",
  completed: "bg-[#EEF4FF] text-[#0176D3]",
  archived: "bg-[#F3F3F3] text-[#747474]",
};
const TYPE_LABEL: Record<string, string> = {
  "sales-outreach": "Sales Outreach", "lead-qualification": "Lead Qualification",
  "follow-up-nurture": "Follow-up Nurture", "support-notification": "Support",
  collections: "Collections", "surveys-feedback": "Surveys", "transactional-alerts": "Transactional",
};
const VIEWS = ["all", "active", "scheduled", "paused", "draft", "completed"] as const;

export function CampaignList() {
  const navigate = useNavigate();
  const { campaigns, deleteCampaign, duplicateCampaign, startCampaign, pauseCampaign } = useCampaigns();
  const [view, setView] = useState<(typeof VIEWS)[number]>("all");
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("all");
  const [layout, setLayout] = useState<"table" | "grid">("table");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const kpis = useMemo(() => {
    const totalReach = campaigns.reduce((s, c) => s + (c.audienceSize || 0), 0);
    const sent = campaigns.reduce((s, c) => s + (c.progress?.sent || 0), 0);
    const converted = campaigns.reduce((s, c) => s + (c.progress?.converted || 0), 0);
    const spent = campaigns.reduce((s, c) => s + (c.budget?.spent || 0), 0);
    return {
      active: campaigns.filter((c) => c.status === "active").length,
      reach: totalReach,
      convRate: sent > 0 ? ((converted / sent) * 100).toFixed(1) : "0",
      spent,
    };
  }, [campaigns]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: campaigns.length };
    VIEWS.forEach((v) => { if (v !== "all") c[v] = campaigns.filter((x) => x.status === v).length; });
    return c;
  }, [campaigns]);

  const filtered = useMemo(() => campaigns.filter((c) => {
    const mView = view === "all" || c.status === view;
    const mSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const mChannel = channel === "all" || c.primaryChannel === channel || c.fallbackChannels?.includes(channel as any);
    return mView && mSearch && mChannel;
  }), [campaigns, view, search, channel]);

  const remove = (id: string) => { deleteCampaign(id); setConfirmId(null); toast.success("Campaign deleted"); };
  const dup = (id: string) => { duplicateCampaign(id); setMenuId(null); toast.success("Campaign duplicated"); };
  const toggleRun = (c: Campaign) => { c.status === "active" ? pauseCampaign(c.id) : startCampaign(c.id); setMenuId(null); toast.success(c.status === "active" ? "Campaign paused" : "Campaign resumed"); };

  return (
    <div className="flex flex-col h-full bg-[#F3F3F3]">
      <TopBar breadcrumbs={[{ label: "Communication" }, { label: "Campaigns" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#0176D3] text-white flex items-center justify-center"><Megaphone size={17} /></div>
          <div>
            <h1 className="text-base font-semibold text-[#181818] leading-tight">Campaigns</h1>
            <p className="text-xs text-[#747474]">{campaigns.length} records</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/tenant/campaigns/dashboard")} className="px-3 h-9 rounded border border-[#C9C9C9] text-sm font-medium text-[#444] hover:bg-[#F3F3F3]">Dashboard</button>
          <button onClick={() => navigate("/tenant/campaigns/create")} className="px-4 h-9 rounded bg-[#0176D3] text-white text-sm font-semibold hover:bg-[#014486] flex items-center gap-1.5"><Plus size={16} /> New Campaign</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Active Campaigns", value: kpis.active, icon: Play, grad: "from-[#66BB6A] to-[#2E844A]" },
            { label: "Total Reach", value: kpis.reach.toLocaleString("en-IN"), icon: Users, grad: "from-[#42A5F5] to-[#0176D3]" },
            { label: "Avg Conversion", value: `${kpis.convRate}%`, icon: TrendingUp, grad: "from-[#AB47BC] to-[#6A1B9A]" },
            { label: "Spend", value: `₹${kpis.spent.toLocaleString("en-IN")}`, icon: IndianRupee, grad: "from-[#FFB74D] to-[#F57C00]" },
          ].map((k) => { const Icon = k.icon; return (
            <div key={k.label} className="bg-white border border-[#E5E5E5] rounded-lg p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${k.grad} text-white flex items-center justify-center`}><Icon size={18} /></div>
              <div><div className="text-xl font-semibold text-[#181818]">{k.value}</div><div className="text-xs text-[#747474]">{k.label}</div></div>
            </div>); })}
        </div>

        {/* List-view tabs */}
        <div className="flex items-center gap-1 mb-4 border-b border-[#E5E5E5] overflow-x-auto">
          {VIEWS.map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px whitespace-nowrap transition-colors ${view === v ? "border-[#0176D3] text-[#0176D3]" : "border-transparent text-[#747474] hover:text-[#181818]"}`}>
              {v} {counts[v] !== undefined && <span className="ml-1 text-xs text-[#A0A0A0]">({counts[v]})</span>}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={17} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns…" className="w-full h-9 pl-10 pr-3 border border-[#C9C9C9] rounded text-sm outline-none focus:border-[#0176D3] focus:ring-2 focus:ring-[#0176D3]/20" />
          </div>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className="h-9 px-3 border border-[#C9C9C9] rounded text-sm bg-white outline-none focus:border-[#0176D3]">
            <option value="all">All channels</option>
            {Object.entries(CHANNEL_META).map(([id, m]) => <option key={id} value={id}>{m.label}</option>)}
          </select>
          <div className="flex items-center rounded border border-[#C9C9C9] overflow-hidden h-9">
            <button onClick={() => setLayout("table")} className={`h-full px-2.5 ${layout === "table" ? "bg-[#0176D3] text-white" : "bg-white text-[#747474]"}`}><ListIcon size={16} /></button>
            <button onClick={() => setLayout("grid")} className={`h-full px-2.5 ${layout === "grid" ? "bg-[#0176D3] text-white" : "bg-white text-[#747474]"}`}><LayoutGrid size={16} /></button>
          </div>
        </div>

        {/* Table */}
        {layout === "table" ? (
          <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-left text-[#747474]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Campaign</th>
                    <th className="px-4 py-2.5 font-medium">Channel</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Reach</th>
                    <th className="px-4 py-2.5 font-medium">Progress</th>
                    <th className="px-4 py-2.5 font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const m = CHANNEL_META[c.primaryChannel]; const Icon = m?.icon || Mail;
                    const sent = c.progress?.sent || 0; const pct = c.audienceSize ? Math.min(100, Math.round((sent / c.audienceSize) * 100)) : 0;
                    return (
                      <tr key={c.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FBFF]">
                        <td className="px-4 py-3">
                          <button onClick={() => navigate(`/tenant/campaigns/${c.id}`)} className="font-medium text-[#0176D3] hover:underline text-left">{c.name}</button>
                          <div className="text-xs text-[#A0A0A0]">{c.priority ? `${c.priority} priority` : ""}{c.tags?.length ? ` · ${c.tags.slice(0, 2).join(", ")}` : ""}</div>
                        </td>
                        <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 text-sm ${m?.color || "text-[#747474]"}`}><Icon size={15} /> {m?.label || c.primaryChannel}</span></td>
                        <td className="px-4 py-3 text-[#444]">{TYPE_LABEL[c.type] || c.type}</td>
                        <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[c.status]}`}>{c.status}</span></td>
                        <td className="px-4 py-3 text-[#444]">{(c.audienceSize || 0).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-[#EEE] rounded-full overflow-hidden"><div className="h-full bg-[#0176D3]" style={{ width: `${pct}%` }} /></div>
                            <span className="text-xs text-[#747474]">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 relative">
                          <button onClick={() => setMenuId(menuId === c.id ? null : c.id)} className="p-1.5 rounded hover:bg-[#F0F0F0] text-[#747474]"><MoreVertical size={17} /></button>
                          {menuId === c.id && (
                            <div className="absolute right-4 top-12 z-20 w-44 bg-white rounded-lg border border-[#E5E5E5] shadow-lg py-1">
                              <MenuItem icon={Eye} label="View" onClick={() => navigate(`/tenant/campaigns/${c.id}`)} />
                              <MenuItem icon={Edit} label="Edit" onClick={() => navigate(`/tenant/campaigns/${c.id}/edit`)} />
                              <MenuItem icon={Copy} label="Duplicate" onClick={() => dup(c.id)} />
                              <MenuItem icon={c.status === "active" ? Pause : Play} label={c.status === "active" ? "Pause" : "Resume"} onClick={() => toggleRun(c)} />
                              <div className="h-px bg-[#F0F0F0] my-1" />
                              <MenuItem icon={Trash2} label="Delete" danger onClick={() => { setConfirmId(c.id); setMenuId(null); }} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-[#A0A0A0]">No campaigns match this view.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => {
              const m = CHANNEL_META[c.primaryChannel]; const Icon = m?.icon || Mail;
              return (
                <div key={c.id} className="bg-white border border-[#E5E5E5] rounded-lg p-4 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <button onClick={() => navigate(`/tenant/campaigns/${c.id}`)} className="font-semibold text-[#0176D3] hover:underline text-left">{c.name}</button>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#747474] mb-3"><span className={`inline-flex items-center gap-1 ${m?.color}`}><Icon size={14} /> {m?.label}</span> · {TYPE_LABEL[c.type]}</div>
                  <div className="grid grid-cols-2 gap-2 text-center mb-3">
                    <div className="bg-[#FAFAFA] rounded p-2"><div className="text-base font-semibold text-[#181818]">{(c.audienceSize || 0).toLocaleString("en-IN")}</div><div className="text-[11px] text-[#A0A0A0]">Reach</div></div>
                    <div className="bg-[#FAFAFA] rounded p-2"><div className="text-base font-semibold text-[#181818]">{c.progress?.converted || 0}</div><div className="text-[11px] text-[#A0A0A0]">Converted</div></div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-3 border-t border-[#F0F0F0]">
                    <button onClick={() => navigate(`/tenant/campaigns/${c.id}/edit`)} className="flex-1 h-8 rounded border border-[#C9C9C9] text-sm text-[#444] hover:bg-[#F3F3F3] flex items-center justify-center gap-1"><Edit size={13} /> Edit</button>
                    <button onClick={() => dup(c.id)} className="h-8 px-2.5 rounded border border-[#C9C9C9] text-[#747474] hover:bg-[#F3F3F3]"><Copy size={14} /></button>
                    <button onClick={() => toggleRun(c)} className="h-8 px-2.5 rounded border border-[#C9C9C9] text-[#747474] hover:bg-[#F3F3F3]">{c.status === "active" ? <Pause size={14} /> : <Play size={14} />}</button>
                    <button onClick={() => setConfirmId(c.id)} className="h-8 px-2.5 rounded border border-[#C9C9C9] text-[#BA0517] hover:bg-[#FEF1EE]"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div className="col-span-full text-center text-[#A0A0A0] py-12">No campaigns match this view.</div>}
          </div>
        )}
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#181818] mb-1">Delete campaign?</h3>
            <p className="text-sm text-[#747474] mb-5">This permanently removes the campaign and its configuration.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-4 h-10 rounded border border-[#C9C9C9] text-sm font-medium text-[#444] hover:bg-[#F3F3F3]">Cancel</button>
              <button onClick={() => remove(confirmId)} className="px-4 h-10 rounded bg-[#BA0517] text-white text-sm font-semibold hover:bg-[#8E0411]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }: { icon: React.ComponentType<{ size?: number }>; label: string; onClick: () => void; danger?: boolean }) {
  return <button onClick={onClick} className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[#F3F3F3] ${danger ? "text-[#BA0517]" : "text-[#181818]"}`}><Icon size={15} /> {label}</button>;
}
