import { useState } from "react";
import { useNavigate } from "react-router";
import { useBilling } from "../../hooks/useBilling";
import {
  Activity,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Download,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function UsageMetering() {
  const navigate = useNavigate();
  const { getUsageByTenant, getBalanceByTenant } = useBilling();

  const tenantId = "tenant-1";
  const usage = getUsageByTenant(tenantId);
  const balance = getBalanceByTenant(tenantId);

  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("week");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter usage records by date range
  const filterByDateRange = (records: typeof usage) => {
    if (!records) return [];

    const now = new Date();
    const cutoff = new Date();

    switch (dateRange) {
      case "today":
        cutoff.setHours(0, 0, 0, 0);
        break;
      case "week":
        cutoff.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoff.setDate(now.getDate() - 30);
        break;
      default:
        return records;
    }

    return records.filter(r => new Date(r.timestamp) >= cutoff);
  };

  const filteredUsage = filterByDateRange(usage).filter(
    r => channelFilter === "all" || r.channel === channelFilter
  );

  // Calculate totals
  const totalCredits = filteredUsage.reduce((sum, r) => sum + r.creditsUsed, 0);
  const totalCost = totalCredits / 100;
  const totalDuration = filteredUsage.reduce((sum, r) => sum + (r.duration || 0), 0);
  const totalCalls = filteredUsage.filter(r => r.channel === "ai-calling").length;

  // Channel breakdown
  const channelStats = [
    {
      channel: "ai-calling",
      name: "AI Calling",
      icon: Phone,
      color: "blue",
      credits: filteredUsage.filter(r => r.channel === "ai-calling").reduce((sum, r) => sum + r.creditsUsed, 0),
      count: filteredUsage.filter(r => r.channel === "ai-calling").length,
    },
    {
      channel: "email",
      name: "Email",
      icon: Mail,
      color: "green",
      credits: filteredUsage.filter(r => r.channel === "email").reduce((sum, r) => sum + r.creditsUsed, 0),
      count: filteredUsage.filter(r => r.channel === "email").length,
    },
    {
      channel: "sms",
      name: "SMS",
      icon: MessageSquare,
      color: "purple",
      credits: filteredUsage.filter(r => r.channel === "sms").reduce((sum, r) => sum + r.creditsUsed, 0),
      count: filteredUsage.filter(r => r.channel === "sms").length,
    },
  ];

  // Daily usage trend (last 7 days)
  const getDailyTrend = () => {
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayUsage = (usage || []).filter(r => {
        const timestamp = new Date(r.timestamp);
        return timestamp >= date && timestamp < nextDate;
      });

      days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        credits: dayUsage.reduce((sum, r) => sum + r.creditsUsed, 0),
        cost: dayUsage.reduce((sum, r) => sum + r.creditsUsed, 0) / 100,
        calls: dayUsage.filter(r => r.channel === "ai-calling").length,
      });
    }

    return days;
  };

  const dailyTrend = getDailyTrend();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/billing")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Usage Metering</h1>
              <p className="text-sm text-gray-500 mt-1">Track your credit consumption in real-time</p>
            </div>
          </div>
          <button
            onClick={() => alert("Downloading usage report...")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {["today", "week", "month", "all"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range as typeof dateRange)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range === "today" ? "Today" : range === "week" ? "Last 7 Days" : range === "month" ? "Last 30 Days" : "All Time"}
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {channelFilter === "all" ? "All Channels" : channelStats.find(c => c.channel === channelFilter)?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showFilterMenu && (
              <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg z-10 min-w-[180px]">
                <button
                  onClick={() => { setChannelFilter("all"); setShowFilterMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
                >
                  All Channels
                </button>
                {channelStats.map((channel) => (
                  <button
                    key={channel.channel}
                    onClick={() => { setChannelFilter(channel.channel); setShowFilterMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg flex items-center gap-2"
                  >
                    <channel.icon className="w-4 h-4 text-gray-400" />
                    {channel.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Credits Used</p>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{totalCredits.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{filteredUsage.length} transactions</p>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Cost</p>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">${totalCost.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">{balance?.currency || "USD"}</p>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Duration</p>
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{formatDuration(totalDuration)}</p>
              <p className="text-sm text-gray-500 mt-1">AI Calling time</p>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Calls</p>
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{totalCalls.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </div>
          </div>

          {/* Usage Trend Chart */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="credits"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Credits"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cost"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Cost ($)"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channelStats.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div key={channel.channel} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-${channel.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${channel.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{channel.name}</h4>
                        <p className="text-sm text-gray-500">{channel.count} transactions</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Credits Used</span>
                        <span className="font-medium text-gray-900">{channel.credits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cost</span>
                        <span className="font-medium text-gray-900">${(channel.credits / 100).toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-${channel.color}-600 h-2 rounded-full`}
                          style={{ width: `${totalCredits > 0 ? (channel.credits / totalCredits) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Usage Records */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Usage</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Timestamp</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Channel</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Campaign</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Duration</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Credits</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsage.slice(0, 20).map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(record.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {record.channel === "ai-calling" && <Phone className="w-4 h-4 text-blue-600" />}
                          {record.channel === "email" && <Mail className="w-4 h-4 text-green-600" />}
                          {record.channel === "sms" && <MessageSquare className="w-4 h-4 text-purple-600" />}
                          <span className="text-sm text-gray-900 capitalize">
                            {record.channel === "ai-calling" ? "AI Calling" : record.channel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.campaignId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.duration ? formatDuration(record.duration) : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                        {record.creditsUsed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                        ${(record.creditsUsed / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsage.length === 0 && (
              <div className="py-16 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No usage records found</p>
                <p className="text-sm text-gray-500 mt-1">Start a campaign to see usage data here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
