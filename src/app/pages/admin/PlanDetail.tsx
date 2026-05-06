import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { 
  Pencil, Copy, Archive, Check, Calendar, DollarSign, 
  PhoneCall, Users, Settings, ChevronRight, AlertCircle
} from "lucide-react";

// Mock plan data - in real app would fetch from API
const planData: Record<string, any> = {
  "PLAN-GRW-001": {
    name: "Growth",
    code: "PLAN-GRW-001",
    status: "Published",
    tier: "Growth",
    description: "Perfect for growing businesses that need advanced features and higher usage limits.",
    basePrice: 35000,
    currency: "NPR",
    billingCycle: "Monthly",
    aiMinutes: 15000,
    maxAgents: 15,
    maxConcurrent: 15,
    maxUsers: 25,
    maxCampaigns: 10,
    features: [
      { name: "AI Calling", enabled: true },
      { name: "WhatsApp", enabled: true },
      { name: "Campaign Management", enabled: true },
      { name: "Basic CRM", enabled: true },
      { name: "Basic Analytics", enabled: true },
      { name: "Call Recording", enabled: true },
      { name: "Advanced CRM", enabled: false },
      { name: "Advanced Analytics", enabled: false },
      { name: "API Access", enabled: false },
      { name: "Webhooks", enabled: false },
      { name: "Custom IVR", enabled: false },
      { name: "Sentiment Analysis", enabled: false },
    ],
    createdAt: "2026-01-15",
    createdBy: "Super Admin",
    lastModified: "2026-03-20",
    modifiedBy: "Super Admin",
    activeTenants: 42,
    totalRevenue: "NPR 1,470,000",
  }
};

const auditHistory = [
  { date: "2026-03-20 14:30", actor: "Super Admin", action: "Updated pricing", details: "Changed base price from NPR 32,000 to NPR 35,000" },
  { date: "2026-02-10 10:15", actor: "Super Admin", action: "Modified features", details: "Enabled Call Recording feature" },
  { date: "2026-01-15 09:00", actor: "Super Admin", action: "Plan created", details: "Growth plan initialized with base configuration" },
];

export function PlanDetail() {
  const { planCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const plan = planData[planCode as string];

  if (!plan) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Subscription Plans" }, { label: "Not Found" }]} mode="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Plan Not Found</h3>
            <p className="text-sm text-[#616161] mb-4">The subscription plan you're looking for doesn't exist.</p>
            <button onClick={() => navigate("/admin/subscription-plans")} className="h-10 px-4 rounded-md bg-[#1565C0] text-white text-sm">
              Back to Plans
            </button>
          </div>
        </div>
      </>
    );
  }

  const tabs = ["overview", "features", "tenants", "audit"];

  return (
    <>
      <TopBar 
        breadcrumbs={[
          { label: "Dashboard" }, 
          { label: "Subscription Plans", onClick: () => navigate("/admin/subscription-plans") }, 
          { label: plan.name }
        ]} 
        mode="admin" 
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">{plan.name} Plan</h1>
              <StatusBadge status={plan.status} size="md" />
            </div>
            <p className="text-sm text-[#616161] font-mono">{plan.code}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/admin/subscription-plans/edit/${planCode}`)}
              className="h-10 px-4 rounded-md border border-[#1565C0] text-[#1565C0] hover:bg-[#E3F2FD] flex items-center gap-2 text-sm"
            >
              <Pencil size={16} /> Edit Plan
            </button>
            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-2 text-sm">
              <Copy size={16} /> Duplicate
            </button>
            <button className="h-10 px-4 rounded-md border border-[#C62828] text-[#C62828] hover:bg-[#FFEBEE] flex items-center gap-2 text-sm">
              <Archive size={16} /> Archive
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E0E0E0] mb-6 flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab ? "border-[#1565C0] text-[#1565C0]" : "border-transparent text-[#616161] hover:text-[#212121]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h3 className="mb-4">Basic Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#9E9E9E] text-xs block mb-1">Plan Name</span>
                      <span className="text-[#212121] font-medium">{plan.name}</span>
                    </div>
                    <div>
                      <span className="text-[#9E9E9E] text-xs block mb-1">Plan Code</span>
                      <span className="text-[#212121] font-mono">{plan.code}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#9E9E9E] text-xs block mb-1">Description</span>
                    <span className="text-[#212121]">{plan.description}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#9E9E9E] text-xs block mb-1">Tier</span>
                      <span className="inline-flex px-2 py-1 rounded-md bg-[#E3F2FD] text-[#1565C0] text-xs font-semibold">{plan.tier}</span>
                    </div>
                    <div>
                      <span className="text-[#9E9E9E] text-xs block mb-1">Status</span>
                      <StatusBadge status={plan.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h3 className="mb-4">Pricing</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-[#9E9E9E] text-xs block mb-1">Base Price</span>
                    <span className="text-2xl font-bold text-[#212121]">{plan.currency} {plan.basePrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#9E9E9E] text-xs block mb-1">Currency</span>
                    <span className="text-[#212121] font-medium">{plan.currency}</span>
                  </div>
                  <div>
                    <span className="text-[#9E9E9E] text-xs block mb-1">Billing Cycle</span>
                    <span className="text-[#212121] font-medium">{plan.billingCycle}</span>
                  </div>
                </div>
              </div>

              {/* Resource Limits */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h3 className="mb-4">Resource Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "AI Minutes", value: plan.aiMinutes.toLocaleString(), icon: PhoneCall },
                    { label: "Max Agents", value: plan.maxAgents, icon: Users },
                    { label: "Concurrent Calls", value: plan.maxConcurrent, icon: PhoneCall },
                    { label: "Max Users", value: plan.maxUsers, icon: Users },
                    { label: "Max Campaigns", value: plan.maxCampaigns, icon: Settings },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-md bg-[#F5F5F5]">
                      <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                        <item.icon size={16} className="text-[#1565C0]" />
                      </div>
                      <div>
                        <div className="text-xs text-[#616161]">{item.label}</div>
                        <div className="text-lg font-semibold text-[#212121]">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h4 className="mb-4">Plan Statistics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#616161]">Active Tenants</span>
                    <span className="text-lg font-semibold text-[#212121]">{plan.activeTenants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#616161]">Total Revenue</span>
                    <span className="text-lg font-semibold text-[#2E7D32]">{plan.totalRevenue}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                    <span className="text-sm text-[#616161]">Created</span>
                    <span className="text-sm text-[#212121]">{plan.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#616161]">Last Modified</span>
                    <span className="text-sm text-[#212121]">{plan.lastModified}</span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <h4 className="mb-4">Metadata</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#9E9E9E] text-xs block mb-1">Created By</span>
                    <span className="text-[#212121]">{plan.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-[#9E9E9E] text-xs block mb-1">Modified By</span>
                    <span className="text-[#212121]">{plan.modifiedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
            <h3 className="mb-4">Feature Modules</h3>
            <div className="grid grid-cols-3 gap-3">
              {plan.features.map((feature: any) => (
                <div 
                  key={feature.name} 
                  className={`flex items-center gap-3 p-3 rounded-md border ${
                    feature.enabled 
                      ? "bg-[#E8F5E9] border-[#81C784]" 
                      : "bg-[#F5F5F5] border-[#E0E0E0]"
                  }`}
                >
                  {feature.enabled ? (
                    <Check size={18} className="text-[#2E7D32]" />
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-[#BDBDBD]" />
                  )}
                  <span className={`text-sm font-medium ${feature.enabled ? "text-[#212121]" : "text-[#9E9E9E]"}`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tenants Tab */}
        {activeTab === "tenants" && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>Active Tenants ({plan.activeTenants})</h3>
              <button className="text-sm text-[#1565C0] hover:underline">View All</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] border-b">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Tenant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Started</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Expiry</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Usage</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Everest Digital Solutions", id: "TNT-00042", started: "2026-01-15", expiry: "2026-12-31", usage: "65%", status: "Active" },
                  { name: "Himalayan Tech Services", id: "TNT-00038", started: "2026-02-01", expiry: "2026-09-15", usage: "82%", status: "Active" },
                  { name: "Pokhara InfoTech", id: "TNT-00025", started: "2026-01-20", expiry: "2026-11-30", usage: "48%", status: "Active" },
                ].map((tenant) => (
                  <tr key={tenant.id} className="border-b border-[#EEEEEE] hover:bg-[#F5F5F5]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#212121]">{tenant.name}</div>
                      <div className="text-xs text-[#616161] font-mono">{tenant.id}</div>
                    </td>
                    <td className="px-4 py-3">{tenant.started}</td>
                    <td className="px-4 py-3">{tenant.expiry}</td>
                    <td className="px-4 py-3">{tenant.usage}</td>
                    <td className="px-4 py-3"><StatusBadge status={tenant.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
            <h3 className="mb-4">Audit History</h3>
            <div className="space-y-3">
              {auditHistory.map((entry, idx) => (
                <div key={idx} className="flex gap-4 pb-3 border-b border-[#EEEEEE] last:border-0">
                  <div className="w-2 h-2 rounded-full bg-[#1565C0] mt-2 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-[#212121]">{entry.action}</span>
                      <span className="text-xs text-[#9E9E9E] font-mono">{entry.date}</span>
                    </div>
                    <div className="text-sm text-[#616161] mb-1">{entry.details}</div>
                    <div className="text-xs text-[#9E9E9E]">By {entry.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
