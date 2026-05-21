import React, { useMemo, useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useNavigate } from "react-router";
import {
  Bot, Plus, Search, Phone, MessageCircle, Mail, MessageSquare, Star,
  Clock, Edit, Copy, Power, MoreVertical, Rocket, TrendingUp, Zap,
  CheckCircle2, Sparkles, Globe, ChevronRight,
} from "lucide-react";

// ============================================================
// Task 4 — AI Agents revamped to support multiple channels:
// Voice Call, WhatsApp, Email, SMS (extensible). Channel-aware
// filtering, badges, capabilities, and templates.
// ============================================================

type Channel = "call" | "whatsapp" | "email" | "sms";
type Purpose = "Sales" | "Support" | "Collections" | "Survey" | "Onboarding" | "Retention";

interface Agent {
  id: number;
  name: string;
  initials: string;
  channel: Channel;
  purpose: Purpose;
  status: "active" | "inactive" | "draft";
  description: string;
  languages: string[];
  rating: number;
  interactions: number;
  successRate: number;
  avgHandle: string;
  campaignCount: number;
}

const CHANNEL_META: Record<Channel, { label: string; icon: React.ComponentType<{ size?: number }>; grad: string; soft: string; text: string }> = {
  call: { label: "Voice Call", icon: Phone, grad: "from-[#42A5F5] to-[#1565C0]", soft: "bg-[#E3F2FD]", text: "text-[#1565C0]" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, grad: "from-[#4CD964] to-[#1FA855]", soft: "bg-[#E8F5E9]", text: "text-[#1FA855]" },
  email: { label: "Email", icon: Mail, grad: "from-[#AB47BC] to-[#6A1B9A]", soft: "bg-[#F3E5F5]", text: "text-[#7B1FA2]" },
  sms: { label: "SMS", icon: MessageSquare, grad: "from-[#FFB74D] to-[#F57C00]", soft: "bg-[#FFF3E0]", text: "text-[#E65100]" },
};

const agents: Agent[] = [
  { id: 1, name: "Aria — Sales Closer", initials: "AR", channel: "call", purpose: "Sales", status: "active", description: "Qualifies inbound leads and books demos with a warm, consultative tone.", languages: ["English", "Hindi"], rating: 4.8, interactions: 3240, successRate: 38, avgHandle: "4m 12s", campaignCount: 6 },
  { id: 2, name: "Nova — WhatsApp Concierge", initials: "NO", channel: "whatsapp", purpose: "Support", status: "active", description: "Answers FAQs, shares catalogs and routes complex chats to humans.", languages: ["English", "Nepali"], rating: 4.6, interactions: 8900, successRate: 71, avgHandle: "1m 30s", campaignCount: 4 },
  { id: 3, name: "Quill — Email Nurturer", initials: "QU", channel: "email", purpose: "Retention", status: "active", description: "Writes and sends personalised nurture sequences based on lead stage.", languages: ["English"], rating: 4.5, interactions: 15400, successRate: 24, avgHandle: "—", campaignCount: 9 },
  { id: 4, name: "Pulse — SMS Reminders", initials: "PU", channel: "sms", purpose: "Collections", status: "active", description: "Sends payment reminders and confirmations with DLT-compliant templates.", languages: ["English", "Hindi"], rating: 4.4, interactions: 22100, successRate: 55, avgHandle: "—", campaignCount: 3 },
  { id: 5, name: "Echo — Survey Caller", initials: "EC", channel: "call", purpose: "Survey", status: "inactive", description: "Runs post-sale CSAT surveys and captures structured feedback.", languages: ["English"], rating: 4.2, interactions: 1200, successRate: 62, avgHandle: "2m 50s", campaignCount: 1 },
  { id: 6, name: "Sage — Onboarding Bot", initials: "SA", channel: "whatsapp", purpose: "Onboarding", status: "draft", description: "Guides new customers through setup with interactive checklists.", languages: ["English", "Nepali"], rating: 0, interactions: 0, successRate: 0, avgHandle: "—", campaignCount: 0 },
];

const templates = [
  { name: "Outbound SDR", channel: "call" as Channel, desc: "Cold-call qualifier" },
  { name: "Lead Reactivation", channel: "whatsapp" as Channel, desc: "Re-engage stale leads" },
  { name: "Drip Nurture", channel: "email" as Channel, desc: "5-step email journey" },
  { name: "Payment Recovery", channel: "sms" as Channel, desc: "Dunning reminders" },
];

export function AIAgents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<Channel | "all">("all");

  const filtered = useMemo(() => agents.filter((a) => {
    const matchSearch = `${a.name} ${a.purpose}`.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === "all" || a.channel === channelFilter;
    return matchSearch && matchChannel;
  }), [search, channelFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: agents.length };
    (Object.keys(CHANNEL_META) as Channel[]).forEach((ch) => { c[ch] = agents.filter((a) => a.channel === ch).length; });
    return c;
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "Communication" }, { label: "AI Agents" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] flex items-center gap-2"><Bot size={24} className="text-[#1565C0]" /> AI Agents</h1>
            <p className="text-sm text-[#616161] mt-1">Build agents for every channel — voice, WhatsApp, email and SMS.</p>
          </div>
          <button onClick={() => navigate("/tenant/ai-agents/create")} className="px-4 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5"><Plus size={16} /> New Agent</button>
        </div>

        {/* Channel stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {(Object.keys(CHANNEL_META) as Channel[]).map((ch) => {
            const m = CHANNEL_META[ch]; const Icon = m.icon;
            const active = agents.filter((a) => a.channel === ch && a.status === "active").length;
            return (
              <button key={ch} onClick={() => setChannelFilter(channelFilter === ch ? "all" : ch)}
                className={`text-left bg-white border rounded-xl p-4 transition-all ${channelFilter === ch ? "border-[#1565C0] ring-2 ring-[#1565C0]/15" : "border-[#E0E0E0] hover:border-[#1565C0]/40"}`}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.grad} text-white flex items-center justify-center mb-2`}><Icon size={18} /></div>
                <div className="text-2xl font-semibold text-[#212121]">{counts[ch]}</div>
                <div className="text-xs text-[#9E9E9E]">{m.label} · {active} active</div>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents…"
              className="w-full h-10 pl-10 pr-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <ChannelChip label={`All (${counts.all})`} active={channelFilter === "all"} onClick={() => setChannelFilter("all")} />
            {(Object.keys(CHANNEL_META) as Channel[]).map((ch) => (
              <ChannelChip key={ch} label={CHANNEL_META[ch].label} active={channelFilter === ch} onClick={() => setChannelFilter(ch)} icon={CHANNEL_META[ch].icon} />
            ))}
          </div>
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {filtered.map((a) => {
            const m = CHANNEL_META[a.channel]; const Icon = m.icon;
            return (
              <div key={a.id} className="bg-white border border-[#E0E0E0] rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.grad} text-white flex items-center justify-center font-semibold`}>{a.initials}</div>
                    <div>
                      <div className="font-semibold text-[#212121] leading-tight">{a.name}</div>
                      <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${m.soft} ${m.text}`}><Icon size={11} /> {m.label}</div>
                    </div>
                  </div>
                  <button className="p-1 text-[#9E9E9E] hover:text-[#212121]"><MoreVertical size={18} /></button>
                </div>

                <p className="text-sm text-[#616161] mb-3 line-clamp-2 min-h-[40px]">{a.description}</p>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF2FF] text-[#3730A3]">{a.purpose}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F5F5] text-[#616161] flex items-center gap-1"><Globe size={10} /> {a.languages.join(", ")}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${a.status === "active" ? "bg-[#E8F5E9] text-[#2E7D32]" : a.status === "draft" ? "bg-[#FFF8E1] text-[#F57F17]" : "bg-[#F5F5F5] text-[#9E9E9E]"}`}>{a.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#F0F0F0] text-center">
                  <Metric label="Interactions" value={a.interactions ? a.interactions.toLocaleString("en-IN") : "—"} />
                  <Metric label="Success" value={a.successRate ? `${a.successRate}%` : "—"} />
                  <Metric label={a.channel === "call" ? "Avg Handle" : "Rating"} value={a.channel === "call" ? a.avgHandle : (a.rating ? a.rating.toFixed(1) : "—")} />
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#F0F0F0]">
                  <button onClick={() => navigate("/tenant/ai-agents/edit")} className="flex-1 h-9 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] flex items-center justify-center gap-1.5"><Edit size={14} /> Edit</button>
                  <button className="h-9 px-3 rounded-lg border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]" title="Duplicate"><Copy size={14} /></button>
                  <button className={`h-9 px-3 rounded-lg border ${a.status === "active" ? "border-[#C62828] text-[#C62828] hover:bg-[#FFEBEE]" : "border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"}`} title="Toggle"><Power size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-lg font-semibold text-[#212121] mb-3 flex items-center gap-2"><Sparkles size={18} className="text-[#7B1FA2]" /> Start from a template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {templates.map((t) => {
              const m = CHANNEL_META[t.channel]; const Icon = m.icon;
              return (
                <button key={t.name} onClick={() => navigate("/tenant/ai-agents/create")} className="text-left bg-white border border-[#E0E0E0] rounded-xl p-4 hover:border-[#1565C0]/40 hover:shadow-sm transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.grad} text-white flex items-center justify-center`}><Icon size={16} /></div>
                    <ChevronRight size={16} className="text-[#BDBDBD] group-hover:text-[#1565C0]" />
                  </div>
                  <div className="font-medium text-[#212121]">{t.name}</div>
                  <div className="text-xs text-[#9E9E9E]">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelChip({ label, active, onClick, icon: Icon }: { label: string; active: boolean; onClick: () => void; icon?: React.ComponentType<{ size?: number }> }) {
  return (
    <button onClick={onClick} className={`h-9 px-3 rounded-lg text-sm font-medium flex items-center gap-1.5 border transition-colors ${active ? "bg-[#1565C0] text-white border-[#1565C0]" : "bg-white text-[#616161] border-[#E0E0E0] hover:bg-[#F5F5F5]"}`}>
      {Icon && <Icon size={14} />} {label}
    </button>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return <div><div className="text-sm font-semibold text-[#212121]">{value}</div><div className="text-[11px] text-[#9E9E9E]">{label}</div></div>;
}
