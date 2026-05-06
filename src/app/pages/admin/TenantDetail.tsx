import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar, CircularProgress } from "../../components/ui/ProgressBar";
import {
  Pencil, Pause, MoreHorizontal, PhoneCall, Clock, Megaphone, Bot,
  Check, Calendar, User, Mail, Phone, MapPin, Globe, Building2,
  ShieldCheck, FileText
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const tenant = {
  id: "TNT-00042",
  name: "Everest Digital Solutions Pvt. Ltd.",
  status: "Active",
  legalName: "Everest Digital Solutions Private Limited",
  address: "Durbar Marg, Ward 10",
  city: "Kathmandu",
  country: "Nepal",
  pan: "123456789",
  contact: "Rajesh Sharma",
  email: "rajesh@everestdigital.com",
  phone: "+977-9841234567",
  timezone: "Asia/Kathmandu",
  locale: "ne-NP",
  currency: "NPR",
  industry: "Technology",
  plan: "Growth",
  aiUsed: 6580,
  aiTotal: 10000,
  expiry: "2026-12-31",
  activeCampaigns: 3,
  activeAgents: 5,
  maxAgents: 10,
};

const activityFeed = [
  { time: "2 hours ago", user: "Rajesh Sharma", action: "Started campaign 'March Outreach'" },
  { time: "5 hours ago", user: "System", action: "AI Agent 'Sales Bot v2' completed 142 calls" },
  { time: "Yesterday", user: "Sita Thapa", action: "Created new AI Agent 'Support Assistant'" },
  { time: "Yesterday", user: "System", action: "Daily AI usage: 320 minutes consumed" },
  { time: "2 days ago", user: "Rajesh Sharma", action: "Updated business hours configuration" },
];

const usageData = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  minutes: Math.floor(150 + Math.random() * 250),
}));

const auditLog = [
  { time: "2026-03-25 14:30", actor: "Super Admin", type: "Configuration", desc: "Updated notification thresholds", ip: "192.168.1.1" },
  { time: "2026-03-24 10:15", actor: "System", type: "License", desc: "AI minutes threshold 80% reached", ip: "—" },
  { time: "2026-03-23 09:00", actor: "Rajesh Sharma", type: "Campaign", desc: "Created campaign 'March Outreach'", ip: "103.1.92.45" },
  { time: "2026-03-22 16:45", actor: "Super Admin", type: "Override", desc: "Increased max agents from 8 to 10", ip: "192.168.1.1" },
  { time: "2026-03-20 11:30", actor: "System", type: "Billing", desc: "Invoice INV-2026-0042 generated", ip: "—" },
];

const tabs = ["Overview", "Subscription", "License", "Usage", "Configuration", "Audit Trail"];

export function TenantDetail() {
  const { tenantId } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Tenants" }, { label: tenant.name }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1>{tenant.name}</h1>
              <StatusBadge status={tenant.status} size="md" />
            </div>
            <span className="font-mono text-sm text-[#616161]">{tenant.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/admin/tenants/edit/${tenantId}`)}
              className="h-10 px-4 rounded-md border border-[#1565C0] text-[#1565C0] hover:bg-[#E3F2FD] flex items-center gap-2 text-sm"
            >
              <Pencil size={16} /> Edit Tenant
            </button>
            <button className="h-10 px-4 rounded-md border border-[#C62828] text-[#C62828] hover:bg-[#FFEBEE] flex items-center gap-2 text-sm">
              <Pause size={16} /> Suspend
            </button>
            <button className="w-10 h-10 rounded-md border border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E0E0E0] mb-6 flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? "border-[#1565C0] text-[#1565C0]" : "border-transparent text-[#616161] hover:text-[#212121]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-5 gap-6">
            {/* Left Column - 3/5 */}
            <div className="col-span-3 space-y-6">
              {/* Company Profile */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h3 className="mb-4">Company Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { icon: Building2, label: "Legal Name", value: tenant.legalName },
                    { icon: MapPin, label: "Address", value: `${tenant.address}, ${tenant.city}, ${tenant.country}` },
                    { icon: FileText, label: "PAN Number", value: tenant.pan },
                    { icon: User, label: "Contact Person", value: tenant.contact },
                    { icon: Mail, label: "Email", value: tenant.email },
                    { icon: Phone, label: "Phone", value: tenant.phone },
                    { icon: Globe, label: "Timezone", value: tenant.timezone },
                    { icon: Globe, label: "Locale / Currency", value: `${tenant.locale} / ${tenant.currency}` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <item.icon size={16} className="text-[#616161] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[#9E9E9E] text-xs">{item.label}</div>
                        <div className="text-[#212121]">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KYC Documents */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h3 className="mb-4">KYC Documents</h3>
                <div className="space-y-2">
                  {["PAN Certificate.pdf", "Certificate of Incorporation.pdf"].map(doc => (
                    <div key={doc} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-[#2E7D32]" />
                      <span className="text-[#212121]">{doc}</span>
                      <span className="text-[#9E9E9E] text-xs">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - 2/5 */}
            <div className="col-span-2 space-y-4">
              {/* Stat Cards */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <CircularProgress value={tenant.aiUsed} max={tenant.aiTotal} size={80} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161]">AI Minutes Remaining</div>
                    <div className="text-xl font-bold text-[#212121]">{(tenant.aiTotal - tenant.aiUsed).toLocaleString()} <span className="text-sm font-normal text-[#616161]">/ {tenant.aiTotal.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard title="Days Until Expiry" value="281" icon={Calendar} color="primary" />
                <StatCard title="Active Campaigns" value={tenant.activeCampaigns} icon={Megaphone} color="warning" />
                <StatCard title="AI Agents" value={`${tenant.activeAgents} / ${tenant.maxAgents}`} icon={Bot} color="info" />
                <StatCard title="Plan" value={tenant.plan} icon={ShieldCheck} color="success" />
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h4 className="mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {activityFeed.map((a, i) => (
                    <div key={i} className="flex gap-3 text-sm border-b border-[#EEEEEE] pb-3 last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-[#1565C0] mt-1.5 shrink-0" />
                      <div>
                        <span className="text-[#212121] font-medium">{a.user}</span>{" "}
                        <span className="text-[#616161]">{a.action}</span>
                        <div className="text-xs text-[#9E9E9E] mt-0.5">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Subscription" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3>Growth Plan</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status="Active" />
                    <span className="text-sm text-[#616161]">Monthly Billing</span>
                  </div>
                  <div className="text-2xl font-bold text-[#212121] mt-3">NPR 35,000 <span className="text-sm font-normal text-[#616161]">/ month</span></div>
                  <div className="text-sm text-[#616161] mt-2">Jan 1, 2026 — Dec 31, 2026 · Auto-renew: <span className="text-[#2E7D32] font-medium">ON</span></div>
                </div>
                <div className="flex gap-2">
                  <button className="h-10 px-4 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Upgrade Plan</button>
                  <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5]">Downgrade</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">Feature Access</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "AI Calling", enabled: true }, { name: "WhatsApp", enabled: true }, { name: "Campaign Management", enabled: true },
                  { name: "Basic CRM", enabled: true }, { name: "Basic Analytics", enabled: true }, { name: "Call Recording", enabled: true },
                  { name: "Advanced CRM", enabled: false }, { name: "Advanced Analytics", enabled: false }, { name: "API Access", enabled: false },
                  { name: "Webhooks", enabled: false }, { name: "Custom IVR", enabled: false }, { name: "Sentiment Analysis", enabled: false },
                ].map(f => (
                  <div key={f.name} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${f.enabled ? "bg-[#E8F5E9]" : "bg-[#F5F5F5]"}`}>
                    {f.enabled ? <Check size={14} className="text-[#2E7D32]" /> : <span className="w-3.5 h-3.5 text-[#9E9E9E]">🔒</span>}
                    <span className={f.enabled ? "text-[#212121]" : "text-[#9E9E9E]"}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">Resource Limits</h4>
              <div className="space-y-3">
                {[
                  { label: "AI Agents", used: 5, max: 15 },
                  { label: "Concurrent Calls", used: 2, max: 15 },
                  { label: "Users", used: 8, max: 25 },
                  { label: "Campaigns", used: 3, max: 10 },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-4">
                    <span className="w-32 text-sm text-[#616161]">{r.label}</span>
                    <div className="flex-1"><ProgressBar value={r.used} max={r.max} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "License" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3>Active License</h3>
                    <StatusBadge status="Active" />
                  </div>
                  <div className="font-mono text-sm text-[#616161] mb-3">LIC-2026-00042</div>
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div><span className="text-[#9E9E9E] text-xs block">Type</span>Monthly</div>
                    <div><span className="text-[#9E9E9E] text-xs block">Valid From</span>Jan 1, 2026</div>
                    <div><span className="text-[#9E9E9E] text-xs block">Valid Until</span>Dec 31, 2026</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="h-10 px-4 rounded-md bg-[#1565C0] text-white text-sm">Override Limits</button>
                  <button className="h-10 px-4 rounded-md border border-[#C62828] text-[#C62828] text-sm">Suspend</button>
                  <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Grant Grace</button>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={6580} max={10000} size="md" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">License History</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F5F5] border-b">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">License #</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">Type</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">Period</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">AI Minutes</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { num: "LIC-2026-00042", type: "Monthly", period: "Jan 2026 - Dec 2026", mins: "10,000", status: "Active" },
                    { num: "LIC-2025-00038", type: "Monthly", period: "Jan 2025 - Dec 2025", mins: "8,000", status: "Expired" },
                    { num: "LIC-2024-00015", type: "Trial", period: "Nov 2024 - Dec 2024", mins: "1,000", status: "Expired" },
                  ].map(l => (
                    <tr key={l.num} className="border-b border-[#EEEEEE] h-11">
                      <td className="px-3 font-mono">{l.num}</td>
                      <td className="px-3">{l.type}</td>
                      <td className="px-3">{l.period}</td>
                      <td className="px-3">{l.mins}</td>
                      <td className="px-3"><StatusBadge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Usage" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              {["7d", "30d", "90d", "Custom"].map(p => (
                <button key={p} className={`px-4 py-2 rounded-md text-sm ${p === "30d" ? "bg-[#1565C0] text-white" : "border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>{p}</button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Total Consumed" value="6,580" icon={PhoneCall} color="primary" subtitle="AI minutes this period" />
              <StatCard title="Daily Average" value="219" icon={Clock} color="info" subtitle="Minutes per day" />
              <StatCard title="Peak Day" value="412" icon={PhoneCall} color="warning" subtitle="Mar 15, 2026" />
              <StatCard title="Est. Days Remaining" value="16" icon={Calendar} color="success" />
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">Daily AI Minutes Consumption</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#616161" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#616161" }} />
                  <Tooltip />
                  <ReferenceLine y={333} stroke="#F57F17" strokeDasharray="5 5" label={{ value: "80%", fill: "#F57F17", fontSize: 11 }} />
                  <ReferenceLine y={375} stroke="#C62828" strokeDasharray="5 5" label={{ value: "90%", fill: "#C62828", fontSize: 11 }} />
                  <Area type="monotone" dataKey="minutes" stroke="#1565C0" fill="#E3F2FD" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "Configuration" && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">Business Hours</h4>
              <div className="space-y-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                  <div key={day} className="flex items-center gap-4">
                    <span className="w-24 text-sm text-[#212121]">{day}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={day !== "Saturday" && day !== "Sunday"} />
                      <div className="w-9 h-5 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                    <input type="time" defaultValue="09:00" className="h-9 border border-[#E0E0E0] rounded-md px-2 text-sm w-28" />
                    <span className="text-[#9E9E9E]">to</span>
                    <input type="time" defaultValue="18:00" className="h-9 border border-[#E0E0E0] rounded-md px-2 text-sm w-28" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
              <h4 className="mb-4">Notification Preferences</h4>
              <div className="space-y-3">
                {["Email Notifications", "WhatsApp Alerts", "In-App Notifications"].map(ch => (
                  <div key={ch} className="flex items-center justify-between">
                    <span className="text-sm text-[#212121]">{ch}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Discard</button>
              <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === "Audit Trail" && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h4>Audit Log</h4>
              <div className="flex gap-2">
                <select className="h-9 border border-[#E0E0E0] rounded-md px-3 text-sm">
                  <option>All Actions</option><option>Configuration</option><option>License</option><option>Campaign</option>
                </select>
                <input type="date" className="h-9 border border-[#E0E0E0] rounded-md px-3 text-sm" />
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] border-b">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">Timestamp</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">Actor</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">Type</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">Description</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-[#616161] uppercase">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((a, i) => (
                  <tr key={i} className="border-b border-[#EEEEEE] h-11 hover:bg-[#F5F5F5]">
                    <td className="px-3 font-mono text-xs text-[#616161]">{a.time}</td>
                    <td className="px-3">{a.actor}</td>
                    <td className="px-3"><StatusBadge status={a.type === "Configuration" ? "Active" : a.type === "License" ? "Pending" : a.type === "Override" ? "Trial" : "Draft"} /></td>
                    <td className="px-3 text-[#212121]">{a.desc}</td>
                    <td className="px-3 font-mono text-xs text-[#9E9E9E]">{a.ip}</td>
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