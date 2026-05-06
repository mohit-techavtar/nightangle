import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  DollarSign, TrendingUp, CreditCard, AlertCircle, FileText,
  Clock, Users, Zap, ArrowUpRight, ArrowDownRight, Download,
  Plus, Filter, Calendar, Phone, Database, Mail, MessageSquare,
  CheckCircle, XCircle, Clock3, Activity
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const revenueData = [
  { month: "Oct", revenue: 234000, cost: 89000, profit: 145000 },
  { month: "Nov", revenue: 289000, cost: 102000, profit: 187000 },
  { month: "Dec", revenue: 312000, cost: 98000, profit: 214000 },
  { month: "Jan", revenue: 345000, cost: 115000, profit: 230000 },
  { month: "Feb", revenue: 398000, cost: 125000, profit: 273000 },
  { month: "Mar", revenue: 456000, cost: 138000, profit: 318000 },
];

const usageByService = [
  { name: "AI Calls", value: 182000, color: "#1565C0" },
  { name: "WhatsApp", value: 98000, color: "#10B981" },
  { name: "SMS", value: 76000, color: "#F59E0B" },
  { name: "Email", value: 54000, color: "#6366F1" },
  { name: "Storage", value: 46000, color: "#EC4899" },
];

const recentInvoices = [
  {
    id: "INV-2026-1847",
    tenant: "Everest Digital Solutions",
    amount: 45678,
    status: "paid",
    dueDate: "2026-04-15",
    paidDate: "2026-04-12",
    items: 12
  },
  {
    id: "INV-2026-1846",
    tenant: "TechVision Enterprises",
    amount: 32890,
    status: "paid",
    dueDate: "2026-04-15",
    paidDate: "2026-04-14",
    items: 8
  },
  {
    id: "INV-2026-1845",
    tenant: "CloudScale Solutions",
    amount: 56234,
    status: "pending",
    dueDate: "2026-04-25",
    paidDate: null,
    items: 15
  },
  {
    id: "INV-2026-1844",
    tenant: "DataFlow Systems",
    amount: 23456,
    status: "overdue",
    dueDate: "2026-04-10",
    paidDate: null,
    items: 6
  },
  {
    id: "INV-2026-1843",
    tenant: "InnovateCorp",
    amount: 41200,
    status: "paid",
    dueDate: "2026-04-12",
    paidDate: "2026-04-11",
    items: 10
  },
];

const topTenants = [
  { name: "Everest Digital", revenue: 45678, usage: "12,340 mins", trend: "+12.5%" },
  { name: "TechVision", revenue: 32890, usage: "8,920 mins", trend: "+8.3%" },
  { name: "CloudScale", revenue: 56234, usage: "15,670 mins", trend: "+15.2%" },
  { name: "DataFlow", revenue: 23456, usage: "6,450 mins", trend: "-3.1%" },
  { name: "InnovateCorp", revenue: 41200, usage: "11,230 mins", trend: "+9.7%" },
];

const alerts = [
  {
    id: 1,
    type: "overdue",
    message: "DataFlow Systems has an overdue invoice of ₹23,456",
    severity: "high",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "threshold",
    message: "CloudScale Solutions approaching credit limit (92% used)",
    severity: "medium",
    time: "4 hours ago"
  },
  {
    id: 3,
    type: "payment",
    message: "Failed payment attempt for TechCorp - ₹18,900",
    severity: "high",
    time: "6 hours ago"
  },
];

export function BillingDashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("this-month");

  const stats = [
    {
      label: "Total Revenue",
      value: "₹4,56,000",
      change: "+14.6%",
      trend: "up",
      icon: DollarSign,
      color: "bg-[#1565C0]",
      lightColor: "bg-[#E3F2FD]"
    },
    {
      label: "Outstanding Amount",
      value: "₹79,690",
      change: "3 invoices",
      trend: "neutral",
      icon: FileText,
      color: "bg-[#F59E0B]",
      lightColor: "bg-[#FEF3C7]"
    },
    {
      label: "Total Usage Cost",
      value: "₹1,38,000",
      change: "+8.2%",
      trend: "up",
      icon: Activity,
      color: "bg-[#10B981]",
      lightColor: "bg-[#D1FAE5]"
    },
    {
      label: "Active Tenants",
      value: "47",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "bg-[#6366F1]",
      lightColor: "bg-[#EEF2FF]"
    },
  ];

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing Dashboard" }
        ]}
        companyName="OmniCRM Platform"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Billing Dashboard</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Complete financial overview and monetization control
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151]"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </select>
              <button
                onClick={() => navigate("/admin/billing/invoices/create")}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Create Invoice
              </button>
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              const isNegative = stat.change.startsWith("-");
              
              return (
                <div key={index} className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.lightColor} p-3 rounded-lg`}>
                      <IconComponent className={`${stat.color.replace('bg-', 'text-')} w-6 h-6`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-[#0F1B2D] mb-2">{stat.value}</p>
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'neutral' ? 'text-[#6B7280]' : 
                      isNegative ? 'text-[#DC2626]' : 'text-[#10B981]'
                    }`}>
                      {stat.trend === 'up' && <ArrowUpRight size={16} />}
                      {stat.trend === 'down' && <ArrowDownRight size={16} />}
                      <span className="font-medium">{stat.change}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                  <h2 className="text-lg font-semibold text-[#0F1B2D]">Billing Alerts</h2>
                </div>
                <button className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1]">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      alert.severity === 'high' 
                        ? 'bg-[#FEF2F2] border-[#FCA5A5]' 
                        : 'bg-[#FFFBEB] border-[#FCD34D]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'high' ? 'bg-[#DC2626]' : 'bg-[#F59E0B]'
                    }`}>
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F1B2D]">{alert.message}</p>
                      <p className="text-xs text-[#6B7280] mt-1">{alert.time}</p>
                    </div>
                    <button className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1]">
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F1B2D]">Revenue Trend</h2>
                <p className="text-sm text-[#6B7280] mt-1">Revenue vs. costs over time</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-[#E3F2FD] text-[#1565C0] rounded-lg text-sm font-medium">
                  Revenue
                </button>
                <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm font-medium hover:bg-[#F9FAFB]">
                  Profit
                </button>
                <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm font-medium hover:bg-[#F9FAFB]">
                  Cost
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line type="monotone" dataKey="revenue" stroke="#1565C0" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="cost" stroke="#DC2626" strokeWidth={2} name="Cost" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage by Service */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F1B2D]">Usage by Service</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Billable usage breakdown</p>
                </div>
                <button
                  onClick={() => navigate("/admin/billing/usage-metering")}
                  className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1]"
                >
                  View Details
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usageByService}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {usageByService.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {usageByService.map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="text-sm text-[#374151]">{service.name}</span>
                      </div>
                      <span className="text-sm font-medium text-[#0F1B2D]">
                        ₹{service.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Tenants */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F1B2D]">Top Tenants by Revenue</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Highest revenue generators</p>
                </div>
              </div>
              <div className="space-y-4">
                {topTenants.map((tenant, index) => {
                  const isNegative = tenant.trend.startsWith("-");
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0F1B2D]">{tenant.name}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{tenant.usage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#0F1B2D]">
                          ₹{tenant.revenue.toLocaleString()}
                        </p>
                        <p className={`text-xs font-medium ${
                          isNegative ? 'text-[#DC2626]' : 'text-[#10B981]'
                        }`}>
                          {tenant.trend}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F1B2D]">Recent Invoices</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Latest billing transactions</p>
                </div>
                <button
                  onClick={() => navigate("/admin/billing/invoices")}
                  className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1]"
                >
                  View All Invoices
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#1565C0]">{invoice.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#0F1B2D]">{invoice.tenant}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-[#0F1B2D]">
                          ₹{invoice.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' 
                            ? 'bg-[#D1FAE5] text-[#065F46]' 
                            : invoice.status === 'pending'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#FEE2E2] text-[#991B1B]'
                        }`}>
                          {invoice.status === 'paid' && <CheckCircle size={12} />}
                          {invoice.status === 'pending' && <Clock3 size={12} />}
                          {invoice.status === 'overdue' && <XCircle size={12} />}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6B7280]">{invoice.dueDate}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate("/admin/billing/invoices/detail")}
                          className="text-[#1565C0] hover:text-[#0D47A1] font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => navigate("/admin/billing/usage-metering")}
              className="bg-gradient-to-br from-[#1565C0] to-[#0D47A1] rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all"
            >
              <Activity className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Real-time Usage Metering</h3>
              <p className="text-sm opacity-90 mb-4">Track every billable second across all services</p>
              <button className="bg-white text-[#1565C0] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                View Metering
              </button>
            </div>

            <div
              onClick={() => navigate("/admin/billing/credit-management")}
              className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all"
            >
              <CreditCard className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Credit Management</h3>
              <p className="text-sm opacity-90 mb-4">Manage credits, balances, and top-ups</p>
              <button className="bg-white text-[#10B981] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                Manage Credits
              </button>
            </div>

            <div
              onClick={() => navigate("/admin/billing/rules")}
              className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all"
            >
              <Zap className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Billing Rules & Policies</h3>
              <p className="text-sm opacity-90 mb-4">Configure billing rules and overage policies</p>
              <button className="bg-white text-[#F59E0B] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                Configure Rules
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
