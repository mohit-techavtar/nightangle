import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Download, Filter, Megaphone, TrendingUp, TrendingDown,
  DollarSign, Target, Users, Mail, MessageCircle, MessageSquare, Phone
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const roiData = [
  { month: "Oct", email: 3.2, sms: 2.8, whatsapp: 4.1, call: 2.5 },
  { month: "Nov", email: 3.5, sms: 3.1, whatsapp: 4.3, call: 2.7 },
  { month: "Dec", email: 3.8, sms: 3.4, whatsapp: 4.6, call: 2.9 },
  { month: "Jan", email: 4.1, sms: 3.7, whatsapp: 4.9, call: 3.2 },
  { month: "Feb", email: 4.4, sms: 4.0, whatsapp: 5.2, call: 3.5 },
  { month: "Mar", email: 4.7, sms: 4.3, whatsapp: 5.5, call: 3.8 },
];

const engagementData = [
  { channel: "Email", sent: 15420, opened: 9234, clicked: 4567, converted: 892, rate: 5.8 },
  { channel: "SMS", sent: 12340, opened: 10987, clicked: 5432, converted: 1234, rate: 10.0 },
  { channel: "WhatsApp", sent: 9876, opened: 8765, clicked: 4321, converted: 987, rate: 10.0 },
  { channel: "Call", sent: 5432, opened: 4321, clicked: 2345, converted: 567, rate: 10.4 },
];

const channelPerformanceData = [
  { name: "Email", value: 35, color: "#1565C0", campaigns: 45, roi: 4.7 },
  { name: "SMS", value: 28, color: "#10B981", campaigns: 28, roi: 4.3 },
  { name: "WhatsApp", value: 22, color: "#F59E0B", campaigns: 22, roi: 5.5 },
  { name: "AI Calls", value: 15, color: "#6366F1", campaigns: 15, roi: 3.8 },
];

const campaignTypeData = [
  { type: "Promotional", count: 34, engagement: 67, conversion: 12.3, roi: 4.2 },
  { type: "Nurturing", count: 28, engagement: 78, conversion: 15.6, roi: 5.1 },
  { type: "Re-engagement", count: 23, engagement: 45, conversion: 8.9, roi: 3.4 },
  { type: "Onboarding", count: 19, engagement: 82, conversion: 18.2, roi: 6.3 },
  { type: "Retention", count: 15, engagement: 71, conversion: 14.5, roi: 4.8 },
];

const costPerLeadData = [
  { month: "Oct", email: 45, sms: 38, whatsapp: 52, call: 68 },
  { month: "Nov", email: 42, sms: 35, whatsapp: 48, call: 65 },
  { month: "Dec", email: 39, sms: 33, whatsapp: 45, call: 62 },
  { month: "Jan", email: 37, sms: 31, whatsapp: 42, call: 59 },
  { month: "Feb", email: 35, sms: 29, whatsapp: 39, call: 56 },
  { month: "Mar", email: 33, sms: 27, whatsapp: 36, call: 53 },
];

export function CampaignEfficiencyReport() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("last-6-months");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Insights" },
          { label: "Reports & Analytics", path: "/tenant/reports-analytics" },
          { label: "Campaign Efficiency" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/tenant/reports-analytics")}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-[#6B7280]" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-[#0F1B2D]">Campaign Efficiency</h1>
                <p className="text-sm text-[#6B7280] mt-1">Analyze campaign ROI, engagement rates, and channel performance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
                <option value="this-year">This Year</option>
              </select>
              <button
                onClick={() => navigate("/tenant/reports-analytics/builder")}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <Filter size={16} />
                Customize
              </button>
              <button className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#E3F2FD] p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#1565C0]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">4.6x</p>
              <p className="text-sm text-[#6B7280] mt-1">Average ROI</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +0.8x from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#D1FAE5] p-3 rounded-lg">
                  <Target className="w-5 h-5 text-[#10B981]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">68.3%</p>
              <p className="text-sm text-[#6B7280] mt-1">Engagement Rate</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +5.2% from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FEF3C7] p-3 rounded-lg">
                  <Users className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">12.4%</p>
              <p className="text-sm text-[#6B7280] mt-1">Conversion Rate</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +1.8% from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FCE7F3] p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#EC4899]" />
                </div>
                <TrendingDown className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">₹34</p>
              <p className="text-sm text-[#6B7280] mt-1">Cost per Lead</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingDown size={14} />
                -₹8 improvement
              </div>
            </div>
          </div>

          {/* ROI Trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">ROI Trend by Channel</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Legend />
                <Line key="line-email" type="monotone" dataKey="email" stroke="#1565C0" strokeWidth={2} name="Email" />
                <Line key="line-sms" type="monotone" dataKey="sms" stroke="#10B981" strokeWidth={2} name="SMS" />
                <Line key="line-whatsapp" type="monotone" dataKey="whatsapp" stroke="#F59E0B" strokeWidth={2} name="WhatsApp" />
                <Line key="line-call" type="monotone" dataKey="call" stroke="#6366F1" strokeWidth={2} name="AI Calls" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Performance */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Channel Distribution & ROI</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={channelPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {channelPerformanceData.map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                      <span className="text-sm font-medium text-[#0F1B2D]">{channel.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#10B981]">{channel.roi}x ROI</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Engagement Funnel by Channel</h2>
              <div className="space-y-4">
                {engagementData.map((channel) => (
                  <div key={channel.channel}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#0F1B2D]">{channel.channel}</span>
                      <span className="text-sm font-semibold text-[#10B981]">{channel.rate}% conversion</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 bg-[#F3F4F6] rounded h-8 relative overflow-hidden">
                        <div className="absolute h-full bg-[#1565C0] flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(channel.sent / 15420) * 100}%` }}>
                          {channel.sent}
                        </div>
                      </div>
                      <div className="flex-1 bg-[#F3F4F6] rounded h-8 relative overflow-hidden">
                        <div className="absolute h-full bg-[#10B981] flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(channel.opened / channel.sent) * 100}%` }}>
                          {channel.opened}
                        </div>
                      </div>
                      <div className="flex-1 bg-[#F3F4F6] rounded h-8 relative overflow-hidden">
                        <div className="absolute h-full bg-[#F59E0B] flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(channel.clicked / channel.sent) * 100}%` }}>
                          {channel.clicked}
                        </div>
                      </div>
                      <div className="flex-1 bg-[#F3F4F6] rounded h-8 relative overflow-hidden">
                        <div className="absolute h-full bg-[#EC4899] flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(channel.converted / channel.sent) * 100}%` }}>
                          {channel.converted}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-[#E5E7EB] text-xs text-[#6B7280]">
                <span>Sent</span>
                <span>Opened</span>
                <span>Clicked</span>
                <span>Converted</span>
              </div>
            </div>
          </div>

          {/* Campaign Type Performance */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Performance by Campaign Type</h2>
            <div className="space-y-4">
              {campaignTypeData.map((campaign) => (
                <div key={campaign.type} className="border-b border-[#E5E7EB] pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-[#0F1B2D]">{campaign.type}</h3>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-[#6B7280]">Count</p>
                        <p className="font-semibold text-[#0F1B2D]">{campaign.count}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[#6B7280]">Engagement</p>
                        <p className="font-semibold text-[#0F1B2D]">{campaign.engagement}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[#6B7280]">Conversion</p>
                        <p className="font-semibold text-[#10B981]">{campaign.conversion}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[#6B7280]">ROI</p>
                        <p className="font-semibold text-[#1565C0]">{campaign.roi}x</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-[#1565C0] to-[#10B981] transition-all duration-500"
                      style={{ width: `${campaign.roi * 15}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost per Lead Trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Cost per Lead Optimization</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={costPerLeadData}>
                <defs>
                  <linearGradient id="colorEmailCE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSMSCE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWhatsAppCE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCallCE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Legend />
                <Area key="area-email" type="monotone" dataKey="email" stroke="#1565C0" fillOpacity={1} fill="url(#colorEmailCE)" name="Email (₹)" strokeWidth={2} />
                <Area key="area-sms" type="monotone" dataKey="sms" stroke="#10B981" fillOpacity={1} fill="url(#colorSMSCE)" name="SMS (₹)" strokeWidth={2} />
                <Area key="area-whatsapp" type="monotone" dataKey="whatsapp" stroke="#F59E0B" fillOpacity={1} fill="url(#colorWhatsAppCE)" name="WhatsApp (₹)" strokeWidth={2} />
                <Area key="area-call" type="monotone" dataKey="call" stroke="#6366F1" fillOpacity={1} fill="url(#colorCallCE)" name="AI Calls (₹)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}