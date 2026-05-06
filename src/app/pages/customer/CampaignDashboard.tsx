import React from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, TrendingUp, Users, DollarSign, Target, PhoneCall, MessageCircle,
  MessageSquare, Mail, Play, Pause, CheckCircle, XCircle, Clock, Activity
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const campaignsByChannel = [
  { name: "Email", value: 45, color: "#1565C0" },
  { name: "SMS", value: 28, color: "#10B981" },
  { name: "WhatsApp", value: 18, color: "#F59E0B" },
  { name: "Call", value: 12, color: "#6366F1" },
];

const campaignsByStatus = [
  { name: "Active", value: 23, color: "#10B981" },
  { name: "Scheduled", value: 15, color: "#3B82F6" },
  { name: "Draft", value: 32, color: "#9CA3AF" },
  { name: "Completed", value: 27, color: "#6B7280" },
  { name: "Paused", value: 6, color: "#F59E0B" },
];

const budgetUtilization = [
  { month: "Jan", spent: 12500, budget: 15000 },
  { month: "Feb", spent: 14200, budget: 15000 },
  { month: "Mar", spent: 13800, budget: 15000 },
  { month: "Apr", spent: 11500, budget: 15000 },
];

const activeCampaigns = [
  {
    id: 1,
    name: "Summer Product Launch",
    type: "Multi-Channel",
    channels: ["Email", "SMS", "WhatsApp"],
    status: "active",
    audience: 15420,
    sent: 12345,
    converted: 892,
    budget: 5000,
    spent: 3420,
    startDate: "2024-04-10",
  },
  {
    id: 2,
    name: "Customer Onboarding Flow",
    type: "Triggered",
    channels: ["Email", "Call"],
    status: "active",
    audience: 8765,
    sent: 7234,
    converted: 1456,
    budget: 3000,
    spent: 2100,
    startDate: "2024-04-05",
  },
  {
    id: 3,
    name: "Re-engagement Campaign",
    type: "Scheduled",
    channels: ["Email", "SMS"],
    status: "scheduled",
    audience: 23100,
    sent: 0,
    converted: 0,
    budget: 4500,
    spent: 0,
    startDate: "2024-04-20",
  },
];

const channelIcons = {
  Email: Mail,
  SMS: MessageSquare,
  WhatsApp: MessageCircle,
  Call: PhoneCall,
};

export function CampaignDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "Campaign Dashboard" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Campaign Command Center</h1>
              <p className="text-sm text-[#6B7280] mt-1">Omni-channel campaign management and orchestration</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/tenant/campaigns")}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                View All Campaigns
              </button>
              <button
                onClick={() => navigate("/tenant/campaigns/create")}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Create Campaign
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Target size={20} className="text-[#1565C0]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+12.5%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">103</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Campaigns</div>
              <div className="text-xs text-[#9CA3AF] mt-2">23 active</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <Users size={20} className="text-[#10B981]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+18.3%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">47.3K</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Reach</div>
              <div className="text-xs text-[#9CA3AF] mt-2">Across all channels</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#F59E0B]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+24.7%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">18.6%</div>
              <div className="text-sm text-[#6B7280] mt-1">Avg Conversion</div>
              <div className="text-xs text-[#9CA3AF] mt-2">8,794 conversions</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <DollarSign size={20} className="text-[#6366F1]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">On track</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">$42.5K</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Budget</div>
              <div className="text-xs text-[#9CA3AF] mt-2">$31.2K spent (73%)</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campaigns by Channel */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Campaigns by Channel</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Distribution across channels</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={campaignsByChannel}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {campaignsByChannel.map((entry) => (
                      <Cell key={`channel-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {campaignsByChannel.map((item) => {
                  const Icon = channelIcons[item.name as keyof typeof channelIcons];
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <Icon size={14} className="text-[#6B7280]" />
                        <span className="text-sm text-[#6B7280]">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#0F1B2D]">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campaigns by Status */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Campaign Status</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Lifecycle distribution</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={campaignsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {campaignsByStatus.map((entry) => (
                      <Cell key={`status-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {campaignsByStatus.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-[#6B7280]">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#0F1B2D]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Utilization */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Budget Utilization</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Monthly tracking</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={budgetUtilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                  />
                  <Bar dataKey="spent" fill="#1565C0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="budget" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1565C0]"></div>
                  <span className="text-sm text-[#6B7280]">Spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E5E7EB]"></div>
                  <span className="text-sm text-[#6B7280]">Budget</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Active & Upcoming Campaigns</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Currently running and scheduled campaigns</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  onClick={() => navigate(`/tenant/campaigns/${campaign.id}`)}
                  className="border border-[#E5E7EB] rounded-lg p-5 hover:border-[#1565C0] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-[#0F1B2D]">{campaign.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.status === "active"
                            ? "bg-[#D1FAE5] text-[#065F46]"
                            : campaign.status === "scheduled"
                            ? "bg-[#DBEAFE] text-[#1E40AF]"
                            : "bg-[#E5E7EB] text-[#374151]"
                        }`}>
                          {campaign.status === "active" ? <><Play size={12} className="inline mr-1" />Active</> :
                           campaign.status === "scheduled" ? <><Clock size={12} className="inline mr-1" />Scheduled</> :
                           campaign.status}
                        </span>
                        <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-full">
                          {campaign.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <span>Started: {campaign.startDate}</span>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                          <span>Channels:</span>
                          {campaign.channels.map((channel, idx) => {
                            const Icon = channelIcons[channel as keyof typeof channelIcons];
                            return <Icon key={idx} size={14} />;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div className="bg-[#F9FAFB] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={14} className="text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280]">Audience</span>
                      </div>
                      <div className="text-lg font-bold text-[#0F1B2D]">{campaign.audience.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#F9FAFB] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity size={14} className="text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280]">Sent</span>
                      </div>
                      <div className="text-lg font-bold text-[#0F1B2D]">{campaign.sent.toLocaleString()}</div>
                      {campaign.audience > 0 && (
                        <div className="text-xs text-[#3B82F6] mt-1">
                          {((campaign.sent / campaign.audience) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <div className="bg-[#F9FAFB] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={14} className="text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280]">Converted</span>
                      </div>
                      <div className="text-lg font-bold text-[#10B981]">{campaign.converted.toLocaleString()}</div>
                      {campaign.sent > 0 && (
                        <div className="text-xs text-[#10B981] mt-1">
                          {((campaign.converted / campaign.sent) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <div className="bg-[#F9FAFB] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign size={14} className="text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280]">Budget</span>
                      </div>
                      <div className="text-lg font-bold text-[#0F1B2D]">${campaign.budget.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#F9FAFB] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className="text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280]">Spent</span>
                      </div>
                      <div className="text-lg font-bold text-[#F59E0B]">${campaign.spent.toLocaleString()}</div>
                      {campaign.budget > 0 && (
                        <div className="text-xs text-[#F59E0B] mt-1">
                          {((campaign.spent / campaign.budget) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
