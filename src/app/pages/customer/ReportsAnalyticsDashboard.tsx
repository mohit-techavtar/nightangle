import { useState } from "react";
import { useNavigate } from "react-router";
import { useReports } from "../../hooks/useReports";
import {
  BarChart3,
  Phone,
  Users,
  Megaphone,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowUpRight,
  Star,
  Layout,
  FileText,
  Clock,
  PlayCircle,
  Grid3x3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const performanceData = [
  { month: "Oct", calls: 1234, campaigns: 45, deals: 89 },
  { month: "Nov", calls: 1456, campaigns: 52, deals: 102 },
  { month: "Dec", calls: 1678, campaigns: 48, deals: 95 },
  { month: "Jan", calls: 1890, campaigns: 61, deals: 118 },
  { month: "Feb", calls: 2012, campaigns: 58, deals: 125 },
  { month: "Mar", calls: 2234, campaigns: 67, deals: 142 },
];

const moduleData = [
  { name: "Deals", value: 142, color: "#1565C0" },
  { name: "Leads", value: 856, color: "#10B981" },
  { name: "Campaigns", value: 67, color: "#F59E0B" },
  { name: "AI Calls", value: 2234, color: "#6366F1" },
];

const reportCategories = [
  {
    id: "ai-calling",
    title: "AI Calling Performance",
    description: "Call volume, success rates, duration, and conversion metrics",
    icon: Phone,
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    stats: { value: "2,234", label: "Calls this month", change: "+12.4%" },
    path: "/tenant/reports/ai-calling",
  },
  {
    id: "crm",
    title: "CRM Effectiveness",
    description: "Lead conversion, pipeline velocity, and customer lifecycle metrics",
    icon: Users,
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    stats: { value: "68.5%", label: "Conversion rate", change: "+5.2%" },
    path: "/tenant/reports/crm",
  },
  {
    id: "campaigns",
    title: "Campaign Efficiency",
    description: "Campaign ROI, engagement rates, and channel performance",
    icon: Megaphone,
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    stats: { value: "67", label: "Active campaigns", change: "+8.1%" },
    path: "/tenant/reports/campaigns",
  },
  {
    id: "deals",
    title: "Deal Progression",
    description: "Deal velocity, win rates, pipeline health, and forecast accuracy",
    icon: TrendingUp,
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    stats: { value: "142", label: "Deals closed", change: "+13.5%" },
    path: "/tenant/reports/deals",
  },
  {
    id: "performance",
    title: "Team Performance",
    description: "Team productivity, individual metrics, and performance benchmarks",
    icon: Star,
    lightColor: "bg-pink-50",
    textColor: "text-pink-600",
    stats: { value: "24", label: "Active agents", change: "+2" },
    path: "/tenant/reports/performance",
  },
  {
    id: "cost",
    title: "Cost Transparency",
    description: "Budget tracking, cost per channel, ROI analysis, and spend optimization",
    icon: DollarSign,
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    stats: { value: "₹45,678", label: "Total spend", change: "-3.2%" },
    path: "/tenant/reports/cost",
  },
];

export function ReportsAnalyticsDashboard() {
  const navigate = useNavigate();
  const { reports, templates, getPopularTemplates } = useReports();
  const [dateRange, setDateRange] = useState("last30days");

  const recentReports = reports.slice(0, 5);
  const popularTemplates = getPopularTemplates().slice(0, 4);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive insights across all CRM modules
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="thisQuarter">This Quarter</option>
            </select>
            <button
              onClick={() => navigate("/tenant/reports/dashboards")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Grid3x3 className="w-4 h-4" />
              Dashboards
            </button>
            <button
              onClick={() => navigate("/tenant/reports/library")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Layout className="w-4 h-4" />
              My Reports
            </button>
            <button
              onClick={() => navigate("/tenant/reports/builder")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Reports</p>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +3 this week
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Report Templates</p>
                <Layout className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              <p className="text-xs text-gray-500 mt-1">Ready to use</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Scheduled Reports</p>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.schedule?.enabled).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active schedules</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Public Reports</p>
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.isPublic).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Shared with team</p>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Details
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Line key="line-deals" type="monotone" dataKey="deals" stroke="#1565C0" strokeWidth={2} name="Deals" />
                  <Line key="line-campaigns" type="monotone" dataKey="campaigns" stroke="#10B981" strokeWidth={2} name="Campaigns" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Module Distribution</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moduleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moduleData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Report Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Report Categories</h2>
              <button
                onClick={() => navigate("/tenant/reports/library")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Categories
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => navigate(category.path)}
                  className="bg-white rounded-lg border hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 ${category.lightColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <category.icon className={`w-6 h-6 ${category.textColor}`} />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">{category.stats.value}</span>
                      <span className="text-sm text-gray-600">{category.stats.label}</span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        category.stats.change.startsWith("+") ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {category.stats.change} vs last period
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports & Templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reports */}
            <div className="bg-white rounded-lg border">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
                <button
                  onClick={() => navigate("/tenant/reports/library")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="p-6 space-y-4">
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => navigate(`/tenant/reports/view/${report.id}`)}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{report.name}</p>
                        <p className="text-sm text-gray-500">
                          {report.module} • {report.type}
                        </p>
                      </div>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <PlayCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No reports yet</p>
                    <button
                      onClick={() => navigate("/tenant/reports/builder")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Create your first report
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Popular Templates */}
            <div className="bg-white rounded-lg border">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Popular Templates</h2>
                <button
                  onClick={() => navigate("/tenant/reports/library?tab=templates")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="p-6 space-y-4">
                {popularTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => navigate(`/tenant/reports/builder?template=${template.id}`)}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Layout className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{template.name}</p>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Need a custom report?</h3>
                <p className="text-blue-100 mb-4">
                  Use our report builder to create custom reports with advanced filtering and visualizations
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/tenant/reports/builder")}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    Create Custom Report
                  </button>
                  <button
                    onClick={() => navigate("/tenant/reports/library?tab=templates")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium"
                  >
                    Browse Templates
                  </button>
                </div>
              </div>
              <BarChart3 className="w-24 h-24 text-blue-300 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}