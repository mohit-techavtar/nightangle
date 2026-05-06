import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Download, Filter, Users, TrendingUp, TrendingDown,
  Target, Clock, DollarSign, Zap, ArrowUpRight
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Funnel, FunnelChart
} from "recharts";

const conversionFunnelData = [
  { stage: "Leads", value: 2834, fill: "#1565C0" },
  { stage: "Qualified", value: 1945, fill: "#10B981" },
  { stage: "Engaged", value: 1234, fill: "#F59E0B" },
  { stage: "Opportunities", value: 789, fill: "#6366F1" },
  { stage: "Customers", value: 456, fill: "#EC4899" },
];

const pipelineVelocityData = [
  { month: "Oct", avgDays: 34, deals: 67 },
  { month: "Nov", avgDays: 32, deals: 78 },
  { month: "Dec", avgDays: 29, deals: 82 },
  { month: "Jan", avgDays: 28, deals: 89 },
  { month: "Feb", avgDays: 26, deals: 95 },
  { month: "Mar", avgDays: 24, deals: 102 },
];

const sourcePerformanceData = [
  { source: "AI Calling", leads: 1234, converted: 456, rate: 37.0, revenue: 567000 },
  { source: "WhatsApp", leads: 987, converted: 378, rate: 38.3, revenue: 489000 },
  { source: "Email", leads: 876, converted: 298, rate: 34.0, revenue: 398000 },
  { source: "SMS", leads: 654, converted: 234, rate: 35.8, revenue: 289000 },
  { source: "Direct", leads: 543, converted: 198, rate: 36.5, revenue: 234000 },
];

const customerLifecycleData = [
  { stage: "Awareness", count: 2834, avgTime: "2 days" },
  { stage: "Consideration", count: 1945, avgTime: "5 days" },
  { stage: "Decision", count: 1234, avgTime: "8 days" },
  { stage: "Purchase", count: 789, avgTime: "3 days" },
  { stage: "Retention", count: 456, avgTime: "90 days" },
];

const responseTimeData = [
  { hour: "0-1h", leads: 234, conversion: 42 },
  { hour: "1-2h", leads: 189, conversion: 38 },
  { hour: "2-4h", leads: 156, conversion: 34 },
  { hour: "4-8h", leads: 123, conversion: 28 },
  { hour: "8-24h", leads: 98, conversion: 22 },
  { hour: "24h+", leads: 67, conversion: 15 },
];

const leadQualityData = [
  { name: "Hot Leads", value: 456, color: "#DC2626" },
  { name: "Warm Leads", value: 789, color: "#F59E0B" },
  { name: "Cold Leads", value: 1234, color: "#1565C0" },
  { name: "Nurturing", value: 567, color: "#6366F1" },
];

export function CRMEffectivenessReport() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("last-30-days");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Insights" },
          { label: "Reports & Analytics", path: "/tenant/reports-analytics" },
          { label: "CRM Effectiveness" }
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
                <h1 className="text-2xl font-semibold text-[#0F1B2D]">CRM Effectiveness</h1>
                <p className="text-sm text-[#6B7280] mt-1">Analyze lead conversion, pipeline velocity, and customer lifecycle metrics</p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
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
                  <Target className="w-5 h-5 text-[#1565C0]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">16.1%</p>
              <p className="text-sm text-[#6B7280] mt-1">Lead Conversion Rate</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +2.4% from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#D1FAE5] p-3 rounded-lg">
                  <Zap className="w-5 h-5 text-[#10B981]" />
                </div>
                <TrendingDown className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">24 days</p>
              <p className="text-sm text-[#6B7280] mt-1">Avg Pipeline Velocity</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingDown size={14} />
                -2 days faster
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FEF3C7] p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">₹52,340</p>
              <p className="text-sm text-[#6B7280] mt-1">Customer Lifetime Value</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +8.3% from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FCE7F3] p-3 rounded-lg">
                  <Clock className="w-5 h-5 text-[#EC4899]" />
                </div>
                <TrendingDown className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">1.8 hrs</p>
              <p className="text-sm text-[#6B7280] mt-1">Avg Response Time</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingDown size={14} />
                -24 min improvement
              </div>
            </div>
          </div>

          {/* Conversion Funnel & Pipeline Velocity */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Conversion Funnel Analysis</h2>
              <div className="space-y-3">
                {conversionFunnelData.map((stage, index) => {
                  const percentage = index === 0 ? 100 : ((stage.value / conversionFunnelData[0].value) * 100);
                  const dropOff = index > 0 ? conversionFunnelData[index - 1].value - stage.value : 0;
                  
                  return (
                    <div key={stage.stage}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#0F1B2D]">{stage.stage}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#6B7280]">{stage.value} ({percentage.toFixed(1)}%)</span>
                          {index > 0 && (
                            <span className="text-xs text-[#DC2626]">-{dropOff} drop-off</span>
                          )}
                        </div>
                      </div>
                      <div className="relative h-10 bg-[#F3F4F6] rounded-lg overflow-hidden">
                        <div
                          className="absolute h-full transition-all duration-500 flex items-center justify-center text-xs font-medium text-white"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: stage.fill
                          }}
                        >
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Pipeline Velocity Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pipelineVelocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis key="yaxis-left" yAxisId="left" stroke="#6B7280" />
                  <YAxis key="yaxis-right" yAxisId="right" orientation="right" stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="avgDays" stroke="#1565C0" strokeWidth={2} name="Avg Days" />
                  <Line yAxisId="right" type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={2} name="Deals Closed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Performance */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Lead Source Performance</h2>
            <div className="space-y-4">
              {sourcePerformanceData.map((source) => (
                <div key={source.source} className="border-b border-[#E5E7EB] pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-[#0F1B2D]">{source.source}</h3>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-[#6B7280]">Leads</p>
                        <p className="font-semibold text-[#0F1B2D]">{source.leads}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#6B7280]">Converted</p>
                        <p className="font-semibold text-[#0F1B2D]">{source.converted}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#6B7280]">Rate</p>
                        <p className="font-semibold text-[#10B981]">{source.rate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#6B7280]">Revenue</p>
                        <p className="font-semibold text-[#0F1B2D]">₹{(source.revenue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-[#1565C0] to-[#10B981] transition-all duration-500"
                      style={{ width: `${source.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time Impact & Lead Quality */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Response Time Impact on Conversion</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#6B7280" />
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
                  <Bar dataKey="leads" fill="#1565C0" name="Total Leads" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="conversion" fill="#10B981" name="Conversion %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Lead Quality Distribution</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={leadQualityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadQualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Lifecycle */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Customer Lifecycle Journey</h2>
            <div className="grid grid-cols-5 gap-4">
              {customerLifecycleData.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="bg-gradient-to-br from-[#1565C0] to-[#0D47A1] rounded-xl p-6 text-white text-center">
                    <p className="text-2xl font-semibold mb-1">{stage.count}</p>
                    <p className="text-sm opacity-90 mb-3">{stage.stage}</p>
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <p className="text-xs">Avg: {stage.avgTime}</p>
                    </div>
                  </div>
                  {index < customerLifecycleData.length - 1 && (
                    <ArrowUpRight className="absolute -right-2 top-1/2 -translate-y-1/2 text-[#1565C0] w-8 h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}