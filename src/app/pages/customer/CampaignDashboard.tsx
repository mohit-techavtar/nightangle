import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useCampaigns } from "../../hooks/useCampaigns";
import {
  Plus, TrendingUp, Users, Target, Phone, MessageCircle, MessageSquare, Mail,
  Play, CheckCircle2, IndianRupee, Megaphone, ArrowRight, Activity,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Task 3 — Salesforce-style campaign dashboard, data-driven from useCampaigns.
const CH = { "ai-calling": { label: "AI Call", color: "#0176D3", icon: Phone }, whatsapp: { label: "WhatsApp", color: "#1FA855", icon: MessageCircle }, sms: { label: "SMS", color: "#F57C00", icon: MessageSquare }, email: { label: "Email", color: "#6A1B9A", icon: Mail } } as const;

export function CampaignDashboard() {
  const navigate = useNavigate();
  const { campaigns } = useCampaigns();

  const stats = useMemo(() => {
    const sent = campaigns.reduce((s, c) => s + (c.progress?.sent || 0), 0);
    const delivered = campaigns.reduce((s, c) => s + (c.progress?.delivered || 0), 0);
    const converted = campaigns.reduce((s, c) => s + (c.progress?.converted || 0), 0);
    const reach = campaigns.reduce((s, c) => s + (c.audienceSize || 0), 0);
    const spent = campaigns.reduce((s, c) => s + (c.budget?.spent || 0), 0);
    return {
      active: campaigns.filter((c) => c.status === "active").length,
      reach, sent, converted, spent,
      convRate: sent ? ((converted / sent) * 100).toFixed(1) : "0",
      delRate: sent ? ((delivered / sent) * 100).toFixed(1) : "0",
    };
  }, [campaigns]);

  const byChannel = useMemo(() => {
    const map: Record<string, number> = {};
    campaigns.forEach((c) => { map[c.primaryChannel] = (map[c.primaryChannel] || 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ name: CH[k as keyof typeof CH]?.label || k, value: v, color: CH[k as keyof typeof CH]?.color || "#999" }));
  }, [campaigns]);

  const perfData = useMemo(() => campaigns.slice(0, 6).map((c) => ({ name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name, Sent: c.progress?.sent || 0, Converted: c.progress?.converted || 0 })), [campaigns]);

  const kpis = [
    { label: "Active Campaigns", value: stats.active, icon: Play, grad: "from-[#66BB6A] to-[#2E844A]" },
    { label: "Total Reach", value: stats.reach.toLocaleString("en-IN"), icon: Users, grad: "from-[#42A5F5] to-[#0176D3]" },
    { label: "Conversion Rate", value: `${stats.convRate}%`, icon: TrendingUp, grad: "from-[#AB47BC] to-[#6A1B9A]" },
    { label: "Total Spend", value: `₹${stats.spent.toLocaleString("en-IN")}`, icon: IndianRupee, grad: "from-[#FFB74D] to-[#F57C00]" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F3F3F3]">
      <TopBar breadcrumbs={[{ label: "Communication" }, { label: "Campaigns", path: "/tenant/campaigns" }, { label: "Dashboard" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="bg-white border-b border-[#E5E5E5] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#0176D3] text-white flex items-center justify-center"><Activity size={17} /></div>
          <h1 className="text-base font-semibold text-[#181818]">Campaign Performance</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/tenant/campaigns")} className="px-3 h-9 rounded border border-[#C9C9C9] text-sm font-medium text-[#444] hover:bg-[#F3F3F3]">All Campaigns</button>
          <button onClick={() => navigate("/tenant/campaigns/create")} className="px-4 h-9 rounded bg-[#0176D3] text-white text-sm font-semibold hover:bg-[#014486] flex items-center gap-1.5"><Plus size={16} /> New Campaign</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {kpis.map((k) => { const Icon = k.icon; return (
            <div key={k.label} className="bg-white border border-[#E5E5E5] rounded-lg p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${k.grad} text-white flex items-center justify-center mb-2`}><Icon size={18} /></div>
              <div className="text-2xl font-semibold text-[#181818]">{k.value}</div>
              <div className="text-xs text-[#747474]">{k.label}</div>
            </div>); })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-5">
            <h3 className="font-semibold text-[#181818] mb-4">Campaigns by Channel</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={byChannel} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {byChannel.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {byChannel.map((e) => <span key={e.name} className="text-xs text-[#747474] flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} /> {e.name} ({e.value})</span>)}
            </div>
          </div>
          <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 lg:col-span-2">
            <h3 className="font-semibold text-[#181818] mb-4">Sent vs Converted</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#747474" }} />
                <YAxis tick={{ fontSize: 11, fill: "#747474" }} />
                <Tooltip />
                <Bar dataKey="Sent" fill="#0176D3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Converted" fill="#2E844A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent campaigns */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
            <h3 className="font-semibold text-[#181818]">Recent Campaigns</h3>
            <button onClick={() => navigate("/tenant/campaigns")} className="text-sm text-[#0176D3] hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></button>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            {campaigns.slice(0, 5).map((c) => { const m = CH[c.primaryChannel as keyof typeof CH]; const Icon = m?.icon || Megaphone; return (
              <button key={c.id} onClick={() => navigate(`/tenant/campaigns/${c.id}`)} className="w-full px-5 py-3 flex items-center justify-between hover:bg-[#F9FBFF] text-left">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m?.color || "#999"}1A`, color: m?.color || "#999" }}><Icon size={15} /></span>
                  <div><div className="text-sm font-medium text-[#181818]">{c.name}</div><div className="text-xs text-[#A0A0A0] capitalize">{c.status} · {(c.audienceSize || 0).toLocaleString("en-IN")} reach</div></div>
                </div>
                <CheckCircle2 size={16} className="text-[#A0A0A0]" />
              </button>); })}
            {campaigns.length === 0 && <div className="px-5 py-10 text-center text-[#A0A0A0] text-sm">No campaigns yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
