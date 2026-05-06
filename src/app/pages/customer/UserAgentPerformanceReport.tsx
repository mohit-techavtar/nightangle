import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Download, Filter, Users, TrendingUp, TrendingDown,
  Target, CheckCircle2, Clock, Star, Award, Trophy
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const agentPerformanceData = [
  { agent: "Rajesh S.", tasks: 234, calls: 456, deals: 67, revenue: 567000, satisfaction: 4.8, productivity: 92 },
  { agent: "Priya M.", tasks: 198, calls: 389, deals: 58, revenue: 489000, satisfaction: 4.7, productivity: 88 },
  { agent: "Amit K.", tasks: 267, calls: 512, deals: 74, revenue: 612000, satisfaction: 4.9, productivity: 95 },
  { agent: "Sneha R.", tasks: 189, calls: 367, deals: 52, revenue: 423000, satisfaction: 4.6, productivity: 85 },
  { agent: "Vikram J.", tasks: 245, calls: 478, deals: 69, revenue: 534000, satisfaction: 4.8, productivity: 91 },
  { agent: "Anita D.", tasks: 223, calls: 434, deals: 61, revenue: 498000, satisfaction: 4.7, productivity: 89 },
];

const productivityTrendData = [
  { week: "Week 1", productivity: 82, tasks: 156, quality: 85 },
  { week: "Week 2", productivity: 85, tasks: 178, quality: 87 },
  { week: "Week 3", productivity: 87, tasks: 189, quality: 89 },
  { week: "Week 4", productivity: 90, tasks: 201, quality: 91 },
];

const responseTimeData = [
  { agent: "Rajesh S.", avgTime: 1.2, target: 2.0, score: 95 },
  { agent: "Priya M.", avgTime: 1.5, target: 2.0, score: 92 },
  { agent: "Amit K.", avgTime: 0.9, target: 2.0, score: 98 },
  { agent: "Sneha R.", avgTime: 1.8, target: 2.0, score: 88 },
  { agent: "Vikram J.", avgTime: 1.3, target: 2.0, score: 94 },
  { agent: "Anita D.", avgTime: 1.4, target: 2.0, score: 93 },
];

const goalAchievementData = [
  { month: "Oct", achieved: 78, total: 100, percentage: 78 },
  { month: "Nov", achieved: 82, total: 100, percentage: 82 },
  { month: "Dec", achieved: 85, total: 100, percentage: 85 },
  { month: "Jan", achieved: 88, total: 100, percentage: 88 },
  { month: "Feb", achieved: 91, total: 100, percentage: 91 },
  { month: "Mar", achieved: 94, total: 100, percentage: 94 },
];

const activityVolumeData = [
  { day: "Mon", calls: 89, emails: 145, meetings: 23, tasks: 67 },
  { day: "Tue", calls: 92, emails: 156, meetings: 28, tasks: 71 },
  { day: "Wed", calls: 87, emails: 138, meetings: 25, tasks: 65 },
  { day: "Thu", calls: 95, emails: 167, meetings: 31, tasks: 74 },
  { day: "Fri", calls: 91, emails: 152, meetings: 27, tasks: 69 },
];

const skillsRadarData = [
  { skill: "Communication", teamAvg: 85, topPerformer: 95 },
  { skill: "Product Knowledge", teamAvg: 78, topPerformer: 92 },
  { skill: "Problem Solving", teamAvg: 82, topPerformer: 94 },
  { skill: "Time Management", teamAvg: 88, topPerformer: 96 },
  { skill: "Customer Service", teamAvg: 90, topPerformer: 98 },
  { skill: "Sales Closing", teamAvg: 75, topPerformer: 89 },
];

export function UserAgentPerformanceReport() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("this-month");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Insights" },
          { label: "Reports & Analytics", path: "/tenant/reports-analytics" },
          { label: "User & Agent Performance" }
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
                <h1 className="text-2xl font-semibold text-[#0F1B2D]">User & Agent Performance</h1>
                <p className="text-sm text-[#6B7280] mt-1">Analyze team productivity, individual metrics, and performance benchmarks</p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
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
                  <Users className="w-5 h-5 text-[#1565C0]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">24</p>
              <p className="text-sm text-[#6B7280] mt-1">Active Agents</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +2 from last month
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#D1FAE5] p-3 rounded-lg">
                  <Target className="w-5 h-5 text-[#10B981]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">90.2%</p>
              <p className="text-sm text-[#6B7280] mt-1">Avg Productivity</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +8.2% improvement
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FEF3C7] p-3 rounded-lg">
                  <Star className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">4.8/5.0</p>
              <p className="text-sm text-[#6B7280] mt-1">Customer Satisfaction</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +0.3 from last month
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#FCE7F3] p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#EC4899]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <p className="text-2xl font-semibold text-[#0F1B2D]">94%</p>
              <p className="text-sm text-[#6B7280] mt-1">Goal Achievement</p>
              <div className="flex items-center gap-1 text-sm font-medium text-[#10B981] mt-2">
                <TrendingUp size={14} />
                +16% from Oct
              </div>
            </div>
          </div>

          {/* Agent Performance Leaderboard */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D]">Agent Performance Leaderboard</h2>
              <div className="flex gap-2">
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                <Award className="w-5 h-5 text-[#6B7280]" />
              </div>
            </div>
            <div className="space-y-4">
              {agentPerformanceData
                .sort((a, b) => b.productivity - a.productivity)
                .map((agent, index) => (
                  <div key={agent.agent} className="border-b border-[#E5E7EB] pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          index === 0 ? "bg-[#F59E0B] text-white" :
                          index === 1 ? "bg-[#6B7280] text-white" :
                          index === 2 ? "bg-[#92400E] text-white" :
                          "bg-[#F3F4F6] text-[#6B7280]"
                        }`}>
                          {index + 1}
                        </div>
                        <h3 className="font-medium text-[#0F1B2D]">{agent.agent}</h3>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-[#6B7280]">Tasks</p>
                          <p className="font-semibold text-[#0F1B2D]">{agent.tasks}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B7280]">Calls</p>
                          <p className="font-semibold text-[#0F1B2D]">{agent.calls}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B7280]">Deals</p>
                          <p className="font-semibold text-[#10B981]">{agent.deals}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B7280]">Revenue</p>
                          <p className="font-semibold text-[#0F1B2D]">₹{(agent.revenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#6B7280]">Rating</p>
                          <p className="font-semibold text-[#F59E0B] flex items-center gap-1">
                            <Star size={14} fill="#F59E0B" /> {agent.satisfaction}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-gradient-to-r from-[#1565C0] to-[#10B981] transition-all duration-500"
                        style={{ width: `${agent.productivity}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#6B7280]">Productivity Score</span>
                      <span className="text-xs font-semibold text-[#0F1B2D]">{agent.productivity}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Productivity Trend */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Team Productivity Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={productivityTrendData}>
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
                  <Line type="monotone" dataKey="productivity" stroke="#1565C0" strokeWidth={2} name="Productivity %" />
                  <Line type="monotone" dataKey="quality" stroke="#10B981" strokeWidth={2} name="Quality Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Skills Analysis */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Skills Analysis</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={skillsRadarData}>
                  <PolarGrid key="polar-grid" stroke="#E5E7EB" />
                  <PolarAngleAxis key="polar-angle" dataKey="skill" stroke="#6B7280" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis key="polar-radius" stroke="#6B7280" />
                  <Radar key="radar-team" name="Team Average" dataKey="teamAvg" stroke="#1565C0" fill="#1565C0" fillOpacity={0.3} />
                  <Radar key="radar-top" name="Top Performer" dataKey="topPerformer" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response Time & Goal Achievement */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Response Time Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseTimeData}>
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
                  <Bar dataKey="avgTime" fill="#1565C0" name="Avg Response Time (hrs)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="target" fill="#E5E7EB" name="Target (hrs)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Goal Achievement Progress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalAchievementData}>
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
                  <Bar dataKey="percentage" fill="#10B981" name="Achievement %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Volume */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-6">Weekly Activity Volume</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
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
                <Bar dataKey="calls" stackId="a" fill="#1565C0" name="Calls" />
                <Bar dataKey="emails" stackId="a" fill="#10B981" name="Emails" />
                <Bar dataKey="meetings" stackId="a" fill="#F59E0B" name="Meetings" />
                <Bar dataKey="tasks" stackId="a" fill="#6366F1" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}