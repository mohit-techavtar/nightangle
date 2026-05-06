import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Download,
  ChevronDown,
  Calendar,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Mock data for charts
const callVolumeData = [
  { date: "Mar 1", attempted: 180, connected: 125 },
  { date: "Mar 3", attempted: 165, connected: 115 },
  { date: "Mar 5", attempted: 195, connected: 135 },
  { date: "Mar 7", attempted: 175, connected: 120 },
  { date: "Mar 9", attempted: 210, connected: 145 },
  { date: "Mar 11", attempted: 190, connected: 130 },
  { date: "Mar 13", attempted: 200, connected: 140 },
  { date: "Mar 15", attempted: 185, connected: 128 },
  { date: "Mar 17", attempted: 220, connected: 155 },
  { date: "Mar 19", attempted: 205, connected: 142 },
  { date: "Mar 21", attempted: 195, connected: 135 },
  { date: "Mar 23", attempted: 215, connected: 148 },
  { date: "Mar 25", attempted: 230, connected: 162 },
  { date: "Mar 27", attempted: 210, connected: 145 },
  { date: "Mar 29", attempted: 225, connected: 158 },
];

const outcomeDistributionData = [
  {
    week: "Week 1",
    interested: 35,
    callback: 20,
    notInterested: 18,
    noAnswer: 15,
    voicemail: 8,
    transferred: 4,
  },
  {
    week: "Week 2",
    interested: 32,
    callback: 22,
    notInterested: 20,
    noAnswer: 14,
    voicemail: 9,
    transferred: 3,
  },
  {
    week: "Week 3",
    interested: 38,
    callback: 18,
    notInterested: 16,
    noAnswer: 16,
    voicemail: 7,
    transferred: 5,
  },
  {
    week: "Week 4",
    interested: 34,
    callback: 24,
    notInterested: 17,
    noAnswer: 13,
    voicemail: 8,
    transferred: 4,
  },
];

const sentimentTrendData = [
  { date: "Mar 1", positive: 45, neutral: 35, negative: 20 },
  { date: "Mar 3", positive: 42, neutral: 38, negative: 20 },
  { date: "Mar 5", positive: 48, neutral: 33, negative: 19 },
  { date: "Mar 7", positive: 44, neutral: 36, negative: 20 },
  { date: "Mar 9", positive: 50, neutral: 32, negative: 18 },
  { date: "Mar 11", positive: 46, neutral: 35, negative: 19 },
  { date: "Mar 13", positive: 52, neutral: 30, negative: 18 },
  { date: "Mar 15", positive: 49, neutral: 33, negative: 18 },
  { date: "Mar 17", positive: 55, neutral: 28, negative: 17 },
  { date: "Mar 19", positive: 51, neutral: 31, negative: 18 },
  { date: "Mar 21", positive: 48, neutral: 34, negative: 18 },
  { date: "Mar 23", positive: 53, neutral: 29, negative: 18 },
  { date: "Mar 25", positive: 56, neutral: 27, negative: 17 },
];

const agentPerformanceData = [
  { agent: "Priya", connectRate: 72, positiveOutcome: 38, avgConfidence: 85 },
  { agent: "Amit", connectRate: 68, positiveOutcome: 42, avgConfidence: 88 },
  { agent: "Neha", connectRate: 65, positiveOutcome: 35, avgConfidence: 82 },
  { agent: "Collection Bot", connectRate: 75, positiveOutcome: 28, avgConfidence: 90 },
  { agent: "Survey Bot", connectRate: 80, positiveOutcome: 15, avgConfidence: 92 },
];

interface Campaign {
  id: string;
  name: string;
  calls: number;
  connected: number;
  interestRate: string;
  avgDuration: string;
  cost: string;
  roi: string;
  trend: number[];
}

const campaignData: Campaign[] = [
  {
    id: "1",
    name: "Jewellery Software Q2",
    calls: 456,
    connected: 312,
    interestRate: "38%",
    avgDuration: "3:42",
    cost: "INR 1,094",
    roi: "4.2x",
    trend: [20, 25, 22, 28, 32, 30, 35, 38],
  },
  {
    id: "2",
    name: "Trading Platform",
    calls: 312,
    connected: 198,
    interestRate: "29%",
    avgDuration: "3:15",
    cost: "INR 749",
    roi: "3.1x",
    trend: [15, 18, 20, 22, 25, 27, 28, 29],
  },
  {
    id: "3",
    name: "Collections March",
    calls: 234,
    connected: 189,
    interestRate: "N/A",
    avgDuration: "2:55",
    cost: "INR 562",
    roi: "6.8x",
    trend: [45, 48, 50, 52, 55, 58, 60, 65],
  },
  {
    id: "4",
    name: "NPS Survey",
    calls: 150,
    connected: 112,
    interestRate: "N/A",
    avgDuration: "1:45",
    cost: "INR 360",
    roi: "N/A",
    trend: [10, 12, 14, 15, 18, 20, 22, 25],
  },
];

export function CallAnalytics() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedCampaign, setSelectedCampaign] = useState("All Campaigns");
  const [selectedAgent, setSelectedAgent] = useState("All Agents");
  const [callType, setCallType] = useState("All");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 80;
    const height = 24;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          fill="none"
          stroke="#6366F1"
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tenant/ai-calling")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Call Analytics</h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Date Range Picker */}
              <div className="relative">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  {dateRange}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Campaign Filter */}
              <div className="relative">
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                >
                  <option>All Campaigns</option>
                  <option>Jewellery Software Q2</option>
                  <option>Trading Platform</option>
                  <option>Collections March</option>
                  <option>NPS Survey</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* AI Agent Filter */}
              <div className="relative">
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                >
                  <option>All Agents</option>
                  <option>Priya (Sales)</option>
                  <option>Amit (Support)</option>
                  <option>Neha (Collections)</option>
                  <option>Survey Bot</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Call Type Filter */}
              <div className="relative">
                <select
                  value={callType}
                  onChange={(e) => setCallType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                >
                  <option>All</option>
                  <option>Outbound</option>
                  <option>Inbound</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Export Button */}
              <div className="relative">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export Report
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Top Metrics - 6 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Total Calls */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Total Calls
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 mb-2">4,847</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="font-medium">+12%</span>
              </div>
            </div>

            {/* Connected */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Connected
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 mb-1">3,296</div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-indigo-600">68%</span> connect rate
              </div>
            </div>

            {/* Avg Duration */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Avg Duration
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 mb-2">3m 42s</div>
              <div className="text-xs text-gray-600">per connected call</div>
            </div>

            {/* Positive Outcome */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Positive Outcome
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 mb-1">1,121</div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-green-600">34%</span> of connected
              </div>
            </div>

            {/* Human Transfers */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Human Transfers
              </div>
              <div className="text-2xl font-bold font-mono text-gray-900 mb-1">148</div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-amber-600">4.5%</span> of calls
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Total Cost
              </div>
              <div className="text-xl font-bold font-mono text-gray-900 mb-1">
                INR 11,632
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-mono">INR 2.40</span>/call avg
              </div>
            </div>
          </div>

          {/* Chart Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call Volume Over Time */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Call Volume Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={callVolumeData}>
                  <defs>
                    <linearGradient id="colorAttempted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConnected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "14px" }}
                    iconType="line"
                  />
                  <Area
                    type="monotone"
                    dataKey="attempted"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAttempted)"
                    name="Attempted"
                  />
                  <Area
                    type="monotone"
                    dataKey="connected"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConnected)"
                    name="Connected"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Call Outcomes Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Call Outcomes Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={outcomeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    label={{ value: "%", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="interested" stackId="a" fill="#10B981" name="Interested" />
                  <Bar dataKey="callback" stackId="a" fill="#3B82F6" name="Callback" />
                  <Bar dataKey="notInterested" stackId="a" fill="#EF4444" name="Not Interested" />
                  <Bar dataKey="noAnswer" stackId="a" fill="#9CA3AF" name="No Answer" />
                  <Bar dataKey="voicemail" stackId="a" fill="#D1D5DB" name="Voicemail" />
                  <Bar dataKey="transferred" stackId="a" fill="#F59E0B" name="Transferred" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Analysis Trend */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sentiment Analysis Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    label={{ value: "%", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "14px" }} />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Positive"
                    dot={{ fill: "#10B981", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name="Neutral"
                    dot={{ fill: "#F59E0B", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#EF4444"
                    strokeWidth={3}
                    name="Negative"
                    dot={{ fill: "#EF4444", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Agent Performance Comparison */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Agent Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="agent"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    label={{ value: "%", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="connectRate" fill="#6366F1" name="Connect Rate %" />
                  <Bar dataKey="positiveOutcome" fill="#10B981" name="Positive Outcome %" />
                  <Bar dataKey="avgConfidence" fill="#F59E0B" name="Avg Confidence %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campaign Performance Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("campaign")}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Campaign
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("calls")}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Calls
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("connected")}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Connected
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Interest %
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Avg Duration
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("cost")}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Cost
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaignData.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-900">
                          {campaign.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          {campaign.calls.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          {campaign.connected}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-900">
                          {campaign.interestRate}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-mono text-gray-900">
                          {campaign.avgDuration}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-mono text-gray-900">
                          {campaign.cost}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-sm font-bold ${
                            campaign.roi === "N/A"
                              ? "text-gray-400"
                              : "text-green-700"
                          }`}
                        >
                          {campaign.roi}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Sparkline data={campaign.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
