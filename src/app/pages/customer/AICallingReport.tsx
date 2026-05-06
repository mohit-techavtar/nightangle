import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Download, Filter, Calendar, Phone, Clock, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, DollarSign, Users, Target, BarChart3, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from "recharts";

const callVolumeData = [
  { date: "Apr 01", total: 145, successful: 98, failed: 32, noAnswer: 15 },
  { date: "Apr 03", total: 167, successful: 112, failed: 38, noAnswer: 17 },
  { date: "Apr 05", total: 189, successful: 125, failed: 42, noAnswer: 22 },
  { date: "Apr 07", total: 201, successful: 138, failed: 45, noAnswer: 18 },
  { date: "Apr 09", total: 223, successful: 156, failed: 48, noAnswer: 19 },
  { date: "Apr 11", total: 234, successful: 167, failed: 44, noAnswer: 23 },
  { date: "Apr 13", total: 256, successful: 178, failed: 52, noAnswer: 26 },
  { date: "Apr 15", total: 278, successful: 192, failed: 56, noAnswer: 30 },
  { date: "Apr 17", total: 289, successful: 205, failed: 54, noAnswer: 30 },
  { date: "Apr 19", total: 301, successful: 218, failed: 58, noAnswer: 25 },
];

const durationData = [
  { range: "0-1 min", count: 234, percentage: 12 },
  { range: "1-3 min", count: 567, percentage: 28 },
  { range: "3-5 min", count: 823, percentage: 41 },
  { range: "5-10 min", count: 312, percentage: 15 },
  { range: "10+ min", count: 78, percentage: 4 },
];

const conversionData = [
  { agent: "Rajesh S.", calls: 234, conversions: 87, rate: 37.2 },
  { agent: "Priya M.", calls: 198, conversions: 76, rate: 38.4 },
  { agent: "Amit K.", calls: 267, conversions: 92, rate: 34.5 },
  { agent: "Sneha R.", calls: 189, conversions: 71, rate: 37.6 },
  { agent: "Vikram J.", calls: 245, conversions: 89, rate: 36.3 },
  { agent: "Anita D.", calls: 223, conversions: 84, rate: 37.7 },
];

const outcomeData = [
  { name: "Successful", value: 1834, color: "#10B981" },
  { name: "No Answer", value: 234, color: "#F59E0B" },
  { name: "Failed", value: 456, color: "#DC2626" },
  { name: "Voicemail", value: 189, color: "#6366F1" },
];

const costData = [
  { month: "Oct", total: 12450, perCall: 5.6 },
  { month: "Nov", total: 14230, perCall: 5.4 },
  { month: "Dec", total: 15890, perCall: 5.2 },
  { month: "Jan", total: 18670, perCall: 5.1 },
  { month: "Feb", total: 21340, perCall: 4.9 },
  { month: "Mar", total: 24560, perCall: 4.8 },
];

const peakHoursData = [
  { hour: "9 AM", calls: 45 },
  { hour: "10 AM", calls: 78 },
  { hour: "11 AM", calls: 92 },
  { hour: "12 PM", calls: 67 },
  { hour: "1 PM", calls: 54 },
  { hour: "2 PM", calls: 89 },
  { hour: "3 PM", calls: 102 },
  { hour: "4 PM", calls: 95 },
  { hour: "5 PM", calls: 71 },
  { hour: "6 PM", calls: 43 },
];

export function AICallingReport() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("last-30-days");
  const [agentFilter, setAgentFilter] = useState("all");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Insights" },
          { label: "Reports & Analytics", path: "/tenant/reports-analytics" },
          { label: "AI Calling Performance" }
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
                <h1 className="text-2xl font-semibold text-[#0F1B2D]">AI Calling Performance</h1>
                <p className="text-sm text-[#6B7280] mt-1">Comprehensive analysis of AI calling activities and outcomes</p>
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
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <option value="all">All Agents</option>
                <option value="rajesh">Rajesh S.</option>
                <option value="priya">Priya M.</option>
                <option value="amit">Amit K.</option>
                <option value="sneha">Sneha R.</option>
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
                  <Phone className="w-5 h-5 text-[#1565C0]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">2,713</p>
              <p className="text-sm text-[#6B7280] mt-1">Total Calls</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +12.4% from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#D1FAE5] p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">67.6%</p>
              <p className="text-sm text-[#6B7280] mt-1">Success Rate</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +3.2% from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FEF3C7] p-3 rounded-lg">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <TrendingDown className="w-4 h-4 text-[#DC2626]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">4m 32s</p>
              <p className="text-sm text-[#6B7280] mt-1">Avg Call Duration</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#DC2626] mt-2">
                <TrendingDown size={14} />
                -8s from last period
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FCE7F3] p-3 rounded-lg">
                  <Target className="w-5 h-5 text-[#EC4899]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">36.8%</p>
              <p className="text-sm text-[#6B7280] mt-1">Conversion Rate</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +2.1% from last period
              </div>
            </div>
          </div>

          {/* Call Volume Trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F1B2D]">Call Volume & Outcomes</h2>
                <p className="text-sm text-[#6B7280] mt-1">Daily breakdown of call attempts and results</p>
              </div>
              <button className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1] transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Refresh Data
              </button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={callVolumeData}>
                <defs>
                  <linearGradient id="colorSuccessfulAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailedAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
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
                <Area
                  key="area-successful"
                  type="monotone"
                  dataKey="successful"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorSuccessfulAI)"
                  name="Successful"
                  strokeWidth={2}
                />
                <Area
                  key="area-failed"
                  type="monotone"
                  dataKey="failed"
                  stroke="#DC2626"
                  fillOpacity={1}
                  fill="url(#colorFailedAI)"
                  name="Failed"
                  strokeWidth={2}
                />
                <Line key="line-noAnswer" type="monotone" dataKey="noAnswer" stroke="#F59E0B" strokeWidth={2} name="No Answer" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Call Outcomes */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Call Outcome Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {outcomeData.map((outcome) => (
                  <div key={outcome.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: outcome.color }} />
                    <div>
                      <p className="text-sm font-medium text-[#0F1B2D]">{outcome.value}</p>
                      <p className="text-xs text-[#6B7280]">{outcome.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Duration Distribution */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Call Duration Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={durationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="range" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Bar dataKey="count" fill="#1565C0" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {durationData.map((duration) => (
                  <div key={duration.range} className="text-center">
                    <p className="text-lg font-semibold text-[#0F1B2D]">{duration.percentage}%</p>
                    <p className="text-xs text-[#6B7280]">{duration.range}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Agent Performance Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="agent" stroke="#6B7280" />
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
                <Bar dataKey="calls" fill="#1565C0" name="Total Calls" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conversions" fill="#10B981" name="Conversions" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Cost Analysis */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Cost Trend Analysis</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={costData}>
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
                  <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} name="Total Cost (₹)" />
                  <Line type="monotone" dataKey="perCall" stroke="#EC4899" strokeWidth={2} name="Cost per Call (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Peak Hours */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Peak Calling Hours</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={peakHoursData}>
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
                  <Bar dataKey="calls" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}