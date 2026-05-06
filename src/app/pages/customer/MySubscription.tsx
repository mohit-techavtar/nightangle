import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Check, Lock, Download, ChevronDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const usageData = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  minutes: Math.floor(100 + Math.random() * 200),
}));

const usageHistory = [
  { date: "2026-03-25 14:30", type: "Call", duration: "4m 32s", minutes: 5, ref: "CALL-00892" },
  { date: "2026-03-25 11:15", type: "Campaign", duration: "142 calls", minutes: 284, ref: "CAMP-00034" },
  { date: "2026-03-24 16:00", type: "Call", duration: "2m 15s", minutes: 3, ref: "CALL-00891" },
  { date: "2026-03-24 10:00", type: "Agent", duration: "8 conversations", minutes: 16, ref: "AGT-00012" },
  { date: "2026-03-23 14:45", type: "Campaign", duration: "89 calls", minutes: 178, ref: "CAMP-00033" },
];

const invoices = [
  { id: "INV-2026-0042", date: "Mar 1, 2026", amount: "NPR 35,000", status: "Paid", plan: "Growth" },
  { id: "INV-2026-0028", date: "Feb 1, 2026", amount: "NPR 35,000", status: "Paid", plan: "Growth" },
  { id: "INV-2026-0015", date: "Jan 1, 2026", amount: "NPR 35,000", status: "Paid", plan: "Growth" },
  { id: "INV-2025-0198", date: "Dec 1, 2025", amount: "NPR 28,000", status: "Paid", plan: "Starter" },
];

export function MySubscription() {
  const [tab, setTab] = useState<"plan" | "usage" | "billing">("plan");
  const [showCompare, setShowCompare] = useState(false);

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Subscription" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-0 border-b border-[#E0E0E0] mb-6">
          {[{ key: "plan", label: "My Plan" }, { key: "usage", label: "Usage Details" }, { key: "billing", label: "Billing History" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-4 py-3 text-sm font-medium border-b-2 ${tab === t.key ? "border-[#1565C0] text-[#1565C0]" : "border-transparent text-[#616161]"}`}>{t.label}</button>
          ))}
        </div>

        {tab === "plan" && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2>Growth Plan</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#E3F2FD] text-[#1565C0] text-[11px] font-semibold border border-[#90CAF9]">Growth</span>
                    <StatusBadge status="Active" />
                  </div>
                  <div className="text-2xl font-bold text-[#212121] mt-3">NPR 35,000 <span className="text-sm font-normal text-[#616161]">/ month</span></div>
                  <div className="text-sm text-[#616161] mt-2">Jan 1, 2026 — Dec 31, 2026</div>
                  <div className="text-sm text-[#616161] mt-1">Renewal countdown: <span className="font-medium text-[#212121]">42 days</span></div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-[#616161]">Auto-Renew:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Access */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h4 className="mb-4">Feature Access</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "AI Calling", enabled: true }, { name: "Basic CRM", enabled: true }, { name: "Campaign Management", enabled: true },
                  { name: "Basic Analytics", enabled: true }, { name: "WhatsApp", enabled: true }, { name: "Call Recording", enabled: true },
                  { name: "Advanced CRM", enabled: false, tier: "Enterprise" }, { name: "Advanced Analytics", enabled: false, tier: "Enterprise" }, { name: "API Access", enabled: false, tier: "Enterprise" },
                  { name: "Webhooks", enabled: false, tier: "Enterprise" }, { name: "Custom IVR", enabled: false, tier: "Enterprise" }, { name: "Sentiment Analysis", enabled: false, tier: "Enterprise" },
                ].map(f => (
                  <div key={f.name} className={`flex items-center gap-2 text-sm px-3 py-2.5 rounded-md ${f.enabled ? "bg-[#E8F5E9]" : "bg-[#F5F5F5]"}`}>
                    {f.enabled ? <Check size={14} className="text-[#2E7D32]" /> : <Lock size={14} className="text-[#9E9E9E]" />}
                    <span className={f.enabled ? "text-[#212121]" : "text-[#9E9E9E]"}>{f.name}</span>
                    {!f.enabled && f.tier && <span className="text-[10px] text-[#9E9E9E] ml-auto">Available on {f.tier}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Compare Plans */}
            <button onClick={() => setShowCompare(!showCompare)} className="flex items-center gap-2 text-sm text-[#1565C0] font-medium hover:underline">
              <ChevronDown size={16} className={`transition-transform ${showCompare ? "rotate-180" : ""}`} />
              Compare All Plans
            </button>

            {showCompare && (
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-[#616161]">Feature</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold">Starter</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-[#1565C0] bg-[#E3F2FD] rounded-t">Growth (Current)</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Price", s: "NPR 15,000", g: "NPR 35,000", e: "NPR 75,000" },
                      { feature: "AI Minutes", s: "5,000", g: "15,000", e: "50,000" },
                      { feature: "AI Calling", s: true, g: true, e: true },
                      { feature: "WhatsApp", s: false, g: true, e: true },
                      { feature: "Advanced CRM", s: false, g: false, e: true },
                      { feature: "API Access", s: false, g: false, e: true },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-[#EEEEEE]">
                        <td className="py-2 px-3 text-[#212121]">{row.feature}</td>
                        {["s", "g", "e"].map(k => (
                          <td key={k} className={`text-center py-2 px-3 ${k === "g" ? "bg-[#E3F2FD]/30" : ""}`}>
                            {typeof (row as any)[k] === "boolean"
                              ? (row as any)[k] ? <Check size={14} className="text-[#2E7D32] mx-auto" /> : <span className="text-[#9E9E9E]">—</span>
                              : (row as any)[k]
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-3">
              <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Request Upgrade</button>
              <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Request Downgrade</button>
              <button className="h-10 px-4 text-[#C62828] text-sm hover:underline">Cancel Subscription</button>
            </div>
          </div>
        )}

        {tab === "usage" && (
          <div className="space-y-6">
            <div className="flex gap-2 mb-2">
              {["7d", "30d", "90d"].map(p => (
                <button key={p} className={`px-4 py-2 rounded-md text-sm ${p === "30d" ? "bg-[#1565C0] text-white" : "border border-[#E0E0E0] text-[#616161]"}`}>{p}</button>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">AI Minutes Consumption</h4>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#616161" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#616161" }} />
                  <Tooltip />
                  <ReferenceLine y={267} stroke="#F57F17" strokeDasharray="5 5" label={{ value: "80%", fill: "#F57F17", fontSize: 11 }} />
                  <ReferenceLine y={300} stroke="#C62828" strokeDasharray="5 5" label={{ value: "90%", fill: "#C62828", fontSize: 11 }} />
                  <Area type="monotone" dataKey="minutes" stroke="#1565C0" fill="#E3F2FD" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-[#EEEEEE]">
                {[
                  { label: "Total Used", value: "8,180" },
                  { label: "Daily Avg", value: "273" },
                  { label: "Peak Day", value: "412" },
                  { label: "Remaining", value: "1,820" },
                  { label: "Est. Depletion", value: "Apr 6" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-bold text-[#212121]">{s.value}</div>
                    <div className="text-xs text-[#616161]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">Resource Usage</h4>
              <div className="space-y-3">
                {[{ label: "AI Agents", used: 5, max: 15 }, { label: "Concurrent Calls", used: 2, max: 15 }, { label: "Active Campaigns", used: 1, max: 5 }, { label: "Users", used: 8, max: 25 }].map(r => (
                  <div key={r.label} className="flex items-center gap-4">
                    <span className="w-36 text-sm text-[#616161]">{r.label}</span>
                    <div className="flex-1"><ProgressBar value={r.used} max={r.max} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <div className="flex items-center justify-between mb-4">
                <h4>Usage History</h4>
                <button className="h-9 px-4 rounded-md text-[#1565C0] text-sm hover:bg-[#E3F2FD] flex items-center gap-2"><Download size={14} /> Export CSV</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F5F5] border-b">
                    {["Date/Time", "Event Type", "Duration", "AI Minutes", "Reference ID"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usageHistory.map((u, i) => (
                    <tr key={i} className="border-b border-[#EEEEEE] h-11 hover:bg-[#F5F5F5]">
                      <td className="px-3 font-mono text-xs text-[#616161]">{u.date}</td>
                      <td className="px-3"><StatusBadge status={u.type === "Call" ? "Active" : u.type === "Campaign" ? "Monthly" : "Trial"} /></td>
                      <td className="px-3">{u.duration}</td>
                      <td className="px-3 font-medium">{u.minutes}</td>
                      <td className="px-3 font-mono text-xs text-[#1565C0]">{u.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "billing" && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
            <h4 className="mb-4">Invoices</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] border-b">
                  {["Invoice #", "Date", "Amount", "Status", "Plan", "Actions"].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-[#EEEEEE] h-11 hover:bg-[#F5F5F5]">
                    <td className="px-3 font-mono text-[#1565C0]">{inv.id}</td>
                    <td className="px-3">{inv.date}</td>
                    <td className="px-3 font-medium">{inv.amount}</td>
                    <td className="px-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-3">{inv.plan}</td>
                    <td className="px-3">
                      <button className="text-[#1565C0] text-sm hover:underline mr-3">View</button>
                      <button className="text-[#1565C0] text-sm hover:underline flex items-center gap-1 inline-flex"><Download size={12} /> PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}