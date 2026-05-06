import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Download, Filter, DollarSign, TrendingUp, TrendingDown,
  AlertCircle, Target, PieChart as PieChartIcon, BarChart3
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const totalSpendData = [
  { month: "Oct", total: 45678, email: 8900, sms: 12340, whatsapp: 9876, calls: 14562 },
  { month: "Nov", total: 52341, email: 10200, sms: 13890, whatsapp: 11234, calls: 17017 },
  { month: "Dec", total: 48923, email: 9560, sms: 12980, whatsapp: 10345, calls: 16038 },
  { month: "Jan", total: 56789, email: 11230, sms: 14567, whatsapp: 12456, calls: 18536 },
  { month: "Feb", total: 61234, email: 12100, sms: 15340, whatsapp: 13678, calls: 20116 },
  { month: "Mar", total: 58901, email: 11890, sms: 14890, whatsapp: 12987, calls: 19134 },
];

const channelCostData = [
  { name: "AI Calls", value: 19134, color: "#1565C0", perLead: 68 },
  { name: "SMS", value: 14890, color: "#10B981", perLead: 27 },
  { name: "WhatsApp", value: 12987, color: "#F59E0B", perLead: 36 },
  { name: "Email", value: 11890, color: "#6366F1", perLead: 33 },
];

const roiByChannelData = [
  { channel: "Email", spent: 11890, revenue: 55890, roi: 4.7, leads: 360 },
  { channel: "SMS", spent: 14890, revenue: 64030, roi: 4.3, leads: 551 },
  { channel: "WhatsApp", spent: 12987, revenue: 71427, roi: 5.5, leads: 360 },
  { channel: "AI Calls", spent: 19134, revenue: 72709, roi: 3.8, leads: 281 },
];

const budgetUtilizationData = [
  { category: "AI Calling", allocated: 25000, spent: 19134, remaining: 5866, utilization: 76.5 },
  { category: "SMS", allocated: 18000, spent: 14890, remaining: 3110, utilization: 82.7 },
  { category: "WhatsApp", allocated: 15000, spent: 12987, remaining: 2013, utilization: 86.6 },
  { category: "Email", allocated: 14000, spent: 11890, remaining: 2110, utilization: 84.9 },
  { category: "Platform", allocated: 8000, spent: 7456, remaining: 544, utilization: 93.2 },
];

const costPerConversionData = [
  { month: "Oct", email: 285, sms: 267, whatsapp: 312, calls: 456 },
  { month: "Nov", email: 268, sms: 251, whatsapp: 289, calls: 423 },
  { month: "Dec", email: 252, sms: 238, whatsapp: 268, calls: 398 },
  { month: "Jan", email: 239, sms: 226, whatsapp: 251, calls: 376 },
  { month: "Feb", email: 228, sms: 215, whatsapp: 239, calls: 358 },
  { month: "Mar", email: 218, sms: 206, whatsapp: 227, calls: 342 },
];

const spendOptimizationData = [
  { category: "Optimized", value: 42345, description: "Well-performing campaigns" },
  { category: "Under-performing", value: 12456, description: "Low ROI campaigns" },
  { category: "Testing", value: 4100, description: "New campaign tests" },
];

const forecastData = [
  { month: "Apr", actual: 0, forecast: 62340, trend: 60120 },
  { month: "May", actual: 0, forecast: 65780, trend: 63450 },
  { month: "Jun", actual: 0, forecast: 68920, trend: 66890 },
];

export function CostTransparencyReport() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("last-6-months");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Insights" },
          { label: "Reports & Analytics", path: "/tenant/reports-analytics" },
          { label: "Cost Transparency" }
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
                <h1 className="text-2xl font-semibold text-[#0F1B2D]">Cost Transparency</h1>
                <p className="text-sm text-[#6B7280] mt-1">Track budget, analyze costs, measure ROI, and optimize spending</p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <option value="this-month">This Month</option>
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
                <TrendingDown className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">₹58,901</p>
              <p className="text-sm text-[#6B7280] mt-1">Total Spend (Mar)</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingDown size={14} />
                -₹2,333 vs last month
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#D1FAE5] p-3 rounded-lg">
                  <Target className="w-5 h-5 text-[#10B981]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">4.6x</p>
              <p className="text-sm text-[#6B7280] mt-1">Average ROI</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +0.3x improvement
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FEF3C7] p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <TrendingDown className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">₹218</p>
              <p className="text-sm text-[#6B7280] mt-1">Cost per Conversion</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingDown size={14} />
                -₹67 reduction
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FCE7F3] p-3 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-[#EC4899]" />
                </div>
                <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">84.8%</p>
              <p className="text-sm text-[#6B7280] mt-1">Budget Utilization</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#6B7280] mt-2">
                <AlertCircle size={14} />
                ₹13,643 remaining
              </div>
            </div>
          </div>

          {/* Spend Trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Spend Trend by Channel</h2>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={totalSpendData}>
                <defs>
                  <linearGradient id="colorCallsCT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSMSCT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWhatsAppCT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEmailCT" x1="0" y1="0" x2="0" y2="1">
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
                <Area key="area-calls" type="monotone" dataKey="calls" stackId="1" stroke="#1565C0" fillOpacity={1} fill="url(#colorCallsCT)" name="AI Calls (₹)" strokeWidth={2} />
                <Area key="area-sms" type="monotone" dataKey="sms" stackId="1" stroke="#10B981" fillOpacity={1} fill="url(#colorSMSCT)" name="SMS (₹)" strokeWidth={2} />
                <Area key="area-whatsapp" type="monotone" dataKey="whatsapp" stackId="1" stroke="#F59E0B" fillOpacity={1} fill="url(#colorWhatsAppCT)" name="WhatsApp (₹)" strokeWidth={2} />
                <Area key="area-email" type="monotone" dataKey="email" stackId="1" stroke="#6366F1" fillOpacity={1} fill="url(#colorEmailCT)" name="Email (₹)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Distribution & ROI */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Cost Distribution by Channel</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={channelCostData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {channelCostData.map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                      <span className="text-sm font-medium text-[#0F1B2D]">{channel.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#6B7280]">₹{channel.perLead}/lead</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">ROI by Channel</h2>
              <div className="space-y-4">
                {roiByChannelData
                  .sort((a, b) => b.roi - a.roi)
                  .map((channel) => (
                    <div key={channel.channel} className="border-b border-[#E5E7EB] pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#0F1B2D]">{channel.channel}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-[#6B7280]">Spent: </span>
                            <span className="font-semibold text-[#0F1B2D]">₹{channel.spent.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[#6B7280]">Revenue: </span>
                            <span className="font-semibold text-[#10B981]">₹{channel.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative h-8 bg-[#F3F4F6] rounded-lg overflow-hidden">
                          <div
                            className="absolute h-full bg-gradient-to-r from-[#1565C0] to-[#10B981] flex items-center px-3 text-sm font-medium text-white"
                            style={{ width: `${(channel.roi / 5.5) * 100}%` }}
                          >
                            {channel.roi}x ROI
                          </div>
                        </div>
                        <span className="text-sm text-[#6B7280] w-16">{channel.leads} leads</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Budget Utilization by Category</h2>
            <div className="space-y-4">
              {budgetUtilizationData.map((item) => (
                <div key={item.category} className="border-b border-[#E5E7EB] pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-[#0F1B2D]">{item.category}</h3>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-[#6B7280]">Allocated: </span>
                        <span className="font-semibold text-[#0F1B2D]">₹{item.allocated.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Spent: </span>
                        <span className="font-semibold text-[#1565C0]">₹{item.spent.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280]">Remaining: </span>
                        <span className="font-semibold text-[#10B981]">₹{item.remaining.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full transition-all duration-500 ${
                        item.utilization > 90 ? "bg-[#DC2626]" :
                        item.utilization > 80 ? "bg-[#F59E0B]" :
                        "bg-[#10B981]"
                      }`}
                      style={{ width: `${item.utilization}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-[#6B7280]">{item.utilization}% utilized</span>
                    {item.utilization > 90 && (
                      <span className="text-xs text-[#DC2626] font-medium">⚠ Approaching limit</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost per Conversion Optimization */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Cost per Conversion Optimization</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costPerConversionData}>
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
                <Line type="monotone" dataKey="email" stroke="#6366F1" strokeWidth={2} name="Email (₹)" />
                <Line type="monotone" dataKey="sms" stroke="#10B981" strokeWidth={2} name="SMS (₹)" />
                <Line type="monotone" dataKey="whatsapp" stroke="#F59E0B" strokeWidth={2} name="WhatsApp (₹)" />
                <Line type="monotone" dataKey="calls" stroke="#1565C0" strokeWidth={2} name="AI Calls (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Spend Optimization & Forecast */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Spend Optimization Analysis</h2>
              <div className="space-y-4">
                {spendOptimizationData.map((item) => {
                  const percentage = (item.value / totalSpendData[5].total) * 100;
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-[#0F1B2D]">{item.category}</p>
                          <p className="text-xs text-[#6B7280]">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#0F1B2D]">₹{item.value.toLocaleString()}</p>
                          <p className="text-xs text-[#6B7280]">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="relative h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full ${
                            item.category === "Optimized" ? "bg-[#10B981]" :
                            item.category === "Under-performing" ? "bg-[#DC2626]" :
                            "bg-[#F59E0B]"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <div className="bg-[#E3F2FD] rounded-lg p-4">
                  <p className="text-sm font-medium text-[#1565C0]">Optimization Potential</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    You could save ₹4,100-6,200/month by reallocating budget from under-performing campaigns
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Spend Forecast (Next 3 Months)</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={[
                  ...totalSpendData.slice(-2).map((d, idx) => ({ ...d, chartId: `actual-${idx}` })),
                  ...forecastData.map((d, idx) => ({ ...d, chartId: `forecast-${idx}` }))
                ]}>
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
                  <Line type="monotone" dataKey="total" stroke="#1565C0" strokeWidth={2} name="Actual Spend (₹)" />
                  <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Forecasted (₹)" />
                  <Line type="monotone" dataKey="trend" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Optimized Trend (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}