import { useEmail } from "../../hooks/useEmail";
import {
  Mail,
  Send,
  MousePointer,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function EmailAnalytics() {
  const { campaigns, getStats } = useEmail();
  const stats = getStats();

  // Generate mock data for charts
  const volumeData = [
    { date: "Apr 15", sent: 845, delivered: 832, opened: 645, clicked: 234 },
    { date: "Apr 16", sent: 912, delivered: 897, opened: 723, clicked: 289 },
    { date: "Apr 17", sent: 789, delivered: 778, opened: 612, clicked: 201 },
    { date: "Apr 18", sent: 1021, delivered: 1005, opened: 834, clicked: 312 },
    { date: "Apr 19", sent: 898, delivered: 885, opened: 698, clicked: 267 },
    { date: "Apr 20", sent: 956, delivered: 941, opened: 756, clicked: 298 },
    { date: "Apr 21", sent: 1123, delivered: 1107, opened: 889, clicked: 356 }
  ];

  const performanceByTimeData = [
    { hour: "00-04", opens: 23 },
    { hour: "04-08", opens: 156 },
    { hour: "08-12", opens: 423 },
    { hour: "12-16", opens: 389 },
    { hour: "16-20", opens: 267 },
    { hour: "20-24", opens: 134 }
  ];

  const campaignPerformance = campaigns.filter(c => c.status !== "draft").map(campaign => ({
    name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + "..." : campaign.name,
    sent: campaign.progress.sent,
    opened: campaign.progress.opened,
    clicked: campaign.progress.clicked
  })).slice(0, 5);

  const deviceBreakdown = [
    { name: "Desktop", value: 45, color: "#3B82F6" },
    { name: "Mobile", value: 38, color: "#10B981" },
    { name: "Tablet", value: 12, color: "#F59E0B" },
    { name: "Other", value: 5, color: "#9CA3AF" }
  ];

  const deliveryRate = stats.totalSent > 0
    ? ((campaigns.reduce((sum, c) => sum + c.progress.delivered, 0) / stats.totalSent) * 100).toFixed(1)
    : "0";

  const bounceRate = stats.totalSent > 0
    ? ((campaigns.reduce((sum, c) => sum + c.progress.bounced, 0) / stats.totalSent) * 100).toFixed(1)
    : "0";

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold">Email Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Performance metrics and insights</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                12%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Total Sent</div>
            <div className="text-xs text-gray-400 mt-2">Last 30 days</div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {deliveryRate}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalOpened.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Delivered</div>
            <div className="text-xs text-gray-400 mt-2">{stats.openRate}% open rate</div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                {stats.clickRate}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalClicked.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Clicks</div>
            <div className="text-xs text-gray-400 mt-2">Click-through rate</div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                {stats.replyRate}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalReplied.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Replies</div>
            <div className="text-xs text-gray-400 mt-2">Response rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Email Volume Trend */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Email Volume Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="opened" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="clicked" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Open Rate by Time */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Open Rate by Time of Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceByTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="opens" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Performance */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Top Campaign Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" fill="#3B82F6" />
                <Bar dataKey="opened" fill="#10B981" />
                <Bar dataKey="clicked" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Opens by Device</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceBreakdown.map((entry) => (
                    <Cell key={`device-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Bounce Rate</div>
                <div className="text-xl font-bold text-gray-900">{bounceRate}%</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {campaigns.reduce((sum, c) => sum + c.progress.bounced, 0)} bounced emails
            </div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Unsubscribes</div>
                <div className="text-xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + c.progress.unsubscribed, 0)}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.totalSent > 0
                ? ((campaigns.reduce((sum, c) => sum + c.progress.unsubscribed, 0) / stats.totalSent) * 100).toFixed(2)
                : 0}% unsubscribe rate
            </div>
          </div>

          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Conversions</div>
                <div className="text-xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + c.progress.converted, 0)}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.totalSent > 0
                ? ((campaigns.reduce((sum, c) => sum + c.progress.converted, 0) / stats.totalSent) * 100).toFixed(2)
                : 0}% conversion rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
