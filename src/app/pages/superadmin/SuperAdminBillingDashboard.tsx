import { useState } from "react";
import { useNavigate } from "react-router";
import { useBilling } from "../../hooks/useBilling";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  AlertTriangle,
  FileText,
  Settings,
  Download,
  Calendar,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function SuperAdminBillingDashboard() {
  const navigate = useNavigate();
  const { getPlatformRevenue } = useBilling();

  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month");

  const revenue = getPlatformRevenue(dateRange);

  // Revenue trend data
  const revenueTrend = (revenue?.revenueByDate || []).map(item => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: item.amount,
    transactions: item.transactions,
  }));

  // Tenant distribution
  const tenantData = [
    { name: "Active Paying", value: revenue?.payingTenants || 0, color: "#10b981" },
    { name: "Trial", value: revenue?.trialTenants || 0, color: "#f59e0b" },
    { name: "Inactive", value: revenue?.inactiveTenants || 0, color: "#ef4444" },
  ];

  // Channel revenue breakdown
  const channelRevenue = (revenue?.revenueByChannel || []).map(item => ({
    name: item.channel === "ai-calling" ? "AI Calling" : item.channel.charAt(0).toUpperCase() + item.channel.slice(1),
    revenue: item.amount,
    credits: item.credits,
  }));

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Platform Billing Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor platform-wide revenue and billing metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Downloading revenue report...")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={() => navigate("/superadmin/billing/rules")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Billing Rules
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          {["week", "month", "quarter", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range as typeof dateRange)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range === "week" ? "Last 7 Days" : range === "month" ? "Last 30 Days" : range === "quarter" ? "Last Quarter" : "Last Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100">Total Revenue</p>
                <DollarSign className="w-6 h-6 text-blue-200" />
              </div>
              <p className="text-3xl font-bold mb-1">{formatCurrency(revenue?.totalRevenue || 0)}</p>
              <div className="flex items-center gap-1 text-sm text-blue-100">
                <TrendingUp className="w-4 h-4" />
                <span>+{(revenue?.growthRate || 0).toFixed(1)}% from last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Total Transactions</p>
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{(revenue?.totalTransactions || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Across all tenants</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Active Tenants</p>
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{(revenue?.activeTenants || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">{revenue?.payingTenants || 0} paying</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Avg Revenue/Tenant</p>
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(revenue?.averageRevenuePerTenant || 0)}
              </p>
              <p className="text-sm text-gray-500">This period</p>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueTrend}>
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
                  formatter={(value: number, name: string) => {
                    if (name === "revenue") return [formatCurrency(value), "Revenue"];
                    return [value, "Transactions"];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Revenue"
                  dot={{ fill: "#3b82f6", r: 5 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Transactions"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Revenue Breakdown */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Channel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tenant Distribution */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Distribution</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tenantData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tenantData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {tenantData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tenants */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Revenue Generating Tenants</h3>
                <button
                  onClick={() => navigate("/superadmin/billing/tenants")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Tenant</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Revenue</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Credits Used</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Balance</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(revenue?.topTenants || []).map((tenant) => (
                    <tr key={tenant.tenantId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{tenant.tenantId}</p>
                          <p className="text-sm text-gray-500">{tenant.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          tenant.status === "active"
                            ? "bg-green-100 text-green-700"
                            : tenant.status === "trial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(tenant.revenue)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        {tenant.creditsUsed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${
                          tenant.balance < 1000 ? "text-red-600" : "text-gray-900"
                        }`}>
                          {tenant.balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/superadmin/billing/tenants/${tenant.tenantId}`)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts */}
          {(revenue?.alerts || []).length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">Billing Alerts</h3>
                  <ul className="space-y-2">
                    {(revenue?.alerts || []).map((alert, idx) => (
                      <li key={idx} className="text-sm text-orange-800">
                        • {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
