import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Download, Filter, TrendingUp, DollarSign, Clock, Target,
  Zap, CheckCircle2, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ComposedChart
} from "recharts";

const dealVelocityData = [
  { stage: "Qualification", avgDays: 5, deals: 78, value: 456000 },
  { stage: "Needs Analysis", avgDays: 7, deals: 65, value: 589000 },
  { stage: "Proposal", avgDays: 10, deals: 52, value: 678000 },
  { stage: "Negotiation", avgDays: 8, deals: 38, value: 789000 },
  { stage: "Closing", avgDays: 6, deals: 28, value: 892000 },
];

const winRateData = [
  { month: "Oct", won: 45, lost: 23, rate: 66.2 },
  { month: "Nov", won: 52, lost: 21, rate: 71.2 },
  { month: "Dec", won: 58, lost: 19, rate: 75.3 },
  { month: "Jan", won: 63, lost: 17, rate: 78.8 },
  { month: "Feb", won: 68, lost: 15, rate: 81.9 },
  { month: "Mar", won: 74, lost: 13, rate: 85.1 },
];

const pipelineHealthData = [
  { week: "Week 1", value: 1234000, forecast: 1150000, deals: 45 },
  { week: "Week 2", value: 1456000, forecast: 1380000, deals: 52 },
  { week: "Week 3", value: 1678000, forecast: 1590000, deals: 58 },
  { week: "Week 4", value: 1892000, forecast: 1820000, deals: 63 },
];

const forecastAccuracyData = [
  { month: "Oct", forecasted: 850000, actual: 789000, accuracy: 92.8 },
  { month: "Nov", forecasted: 920000, actual: 892000, accuracy: 97.0 },
  { month: "Dec", forecasted: 980000, actual: 945000, accuracy: 96.4 },
  { month: "Jan", forecasted: 1050000, actual: 1023000, accuracy: 97.4 },
  { month: "Feb", forecasted: 1120000, actual: 1098000, accuracy: 98.0 },
  { month: "Mar", forecasted: 1200000, actual: 1178000, accuracy: 98.2 },
];

const dealSizeData = [
  { size: "<₹50K", count: 89, totalValue: 2345000, avgDays: 18 },
  { size: "₹50-100K", count: 56, totalValue: 4567000, avgDays: 24 },
  { size: "₹100-250K", count: 34, totalValue: 5678000, avgDays: 32 },
  { size: "₹250-500K", count: 18, totalValue: 6234000, avgDays: 45 },
  { size: ">₹500K", count: 9, totalValue: 5890000, avgDays: 62 },
];

const salesCycleData = [
  { month: "Oct", avgDays: 36, shortestDays: 15, longestDays: 78 },
  { month: "Nov", avgDays: 34, shortestDays: 14, longestDays: 72 },
  { month: "Dec", avgDays: 32, shortestDays: 13, longestDays: 68 },
  { month: "Jan", avgDays: 30, shortestDays: 12, longestDays: 65 },
  { month: "Feb", avgDays: 28, shortestDays: 11, longestDays: 62 },
  { month: "Mar", avgDays: 26, shortestDays: 10, longestDays: 58 },
];

export function DealProgressionReport() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("last-6-months");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Insights" },
          { label: "Reports & Analytics", path: "/tenant/reports-analytics" },
          { label: "Deal Progression Metrics" }
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
                <h1 className="text-2xl font-semibold text-[#0F1B2D]">Deal Progression Metrics</h1>
                <p className="text-sm text-[#6B7280] mt-1">Track deal velocity, win rates, pipeline health, and forecast accuracy</p>
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
                  <Zap className="w-5 h-5 text-[#1565C0]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">26 days</p>
              <p className="text-sm text-[#6B7280] mt-1">Avg Deal Velocity</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                10 days faster
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#D1FAE5] p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">85.1%</p>
              <p className="text-sm text-[#6B7280] mt-1">Win Rate</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +18.9% improvement
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FEF3C7] p-3 rounded-lg">
                  <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">₹1.89M</p>
              <p className="text-sm text-[#6B7280] mt-1">Pipeline Value</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +23.4% growth
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FCE7F3] p-3 rounded-lg">
                  <Target className="w-5 h-5 text-[#EC4899]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">98.2%</p>
              <p className="text-sm text-[#6B7280] mt-1">Forecast Accuracy</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +5.4% improvement
              </div>
            </div>
          </div>

          {/* Deal Velocity by Stage */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Deal Velocity by Pipeline Stage</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dealVelocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="stage" stroke="#6B7280" />
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
                <Bar yAxisId="left" dataKey="avgDays" fill="#1565C0" name="Avg Days in Stage" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="deals" fill="#10B981" name="Number of Deals" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Win Rate Trend */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Win Rate Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={winRateData}>
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
                  <Line type="monotone" dataKey="won" stroke="#10B981" strokeWidth={2} name="Deals Won" />
                  <Line type="monotone" dataKey="lost" stroke="#DC2626" strokeWidth={2} name="Deals Lost" />
                  <Line type="monotone" dataKey="rate" stroke="#1565C0" strokeWidth={3} name="Win Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Accuracy */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Forecast Accuracy</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={forecastAccuracyData}>
                  <defs>
                    <linearGradient id="colorForecasted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                  <Area type="monotone" dataKey="forecasted" stroke="#6366F1" fillOpacity={1} fill="url(#colorForecasted)" name="Forecasted (₹)" strokeWidth={2} />
                  <Area type="monotone" dataKey="actual" stroke="#10B981" fillOpacity={1} fill="url(#colorActual)" name="Actual (₹)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline Health */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Pipeline Health & Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={pipelineHealthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" stroke="#6B7280" />
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
                <Area key="area-value" type="monotone" dataKey="value" stroke="#1565C0" fillOpacity={1} fill="url(#colorValue)" name="Pipeline Value (₹)" strokeWidth={2} />
                <Line key="line-forecast" type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Forecast (₹)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Deal Size Analysis & Sales Cycle */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Deal Size Distribution</h2>
              <div className="space-y-4">
                {dealSizeData.map((deal) => (
                  <div key={deal.size} className="border-b border-[#E5E7EB] pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#0F1B2D]">{deal.size}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-[#6B7280]">Count: </span>
                          <span className="font-semibold text-[#0F1B2D]">{deal.count}</span>
                        </div>
                        <div>
                          <span className="text-[#6B7280]">Avg Days: </span>
                          <span className="font-semibold text-[#F59E0B]">{deal.avgDays}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-8 bg-[#F3F4F6] rounded-lg overflow-hidden">
                      <div
                        className="absolute h-full bg-gradient-to-r from-[#1565C0] to-[#10B981] flex items-center px-3 text-sm font-medium text-white"
                        style={{ width: `${(deal.totalValue / 6234000) * 100}%` }}
                      >
                        ₹{(deal.totalValue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Sales Cycle Length Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={salesCycleData}>
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
                  <Line type="monotone" dataKey="avgDays" stroke="#1565C0" strokeWidth={3} name="Average Days" />
                  <Line type="monotone" dataKey="shortestDays" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Shortest" />
                  <Line type="monotone" dataKey="longestDays" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" name="Longest" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}