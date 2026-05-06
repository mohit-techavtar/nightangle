import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  CreditCard, Plus, TrendingUp, TrendingDown, DollarSign,
  Clock, CheckCircle, AlertCircle, Download, Filter, Search,
  Gift, RefreshCw, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const creditHistory = [
  { month: "Oct", purchased: 50000, consumed: 38000, balance: 12000 },
  { month: "Nov", purchased: 60000, consumed: 45000, balance: 15000 },
  { month: "Dec", purchased: 55000, consumed: 42000, balance: 13000 },
  { month: "Jan", purchased: 70000, consumed: 52000, balance: 18000 },
  { month: "Feb", purchased: 65000, consumed: 48000, balance: 17000 },
  { month: "Mar", purchased: 75000, consumed: 56000, balance: 19000 },
];

const tenantCredits = [
  {
    id: 1,
    tenant: "Everest Digital Solutions",
    tenantId: "TEN-001",
    balance: 45678,
    consumed: 28450,
    purchased: 74128,
    lastTopup: "2026-04-15",
    status: "healthy",
    limit: 100000,
    autoTopup: true
  },
  {
    id: 2,
    tenant: "TechVision Enterprises",
    tenantId: "TEN-002",
    balance: 12890,
    consumed: 19320,
    purchased: 32210,
    lastTopup: "2026-04-12",
    status: "low",
    limit: 50000,
    autoTopup: false
  },
  {
    id: 3,
    tenant: "CloudScale Solutions",
    tenantId: "TEN-003",
    balance: 67234,
    consumed: 45600,
    purchased: 112834,
    lastTopup: "2026-04-18",
    status: "healthy",
    limit: 150000,
    autoTopup: true
  },
  {
    id: 4,
    tenant: "DataFlow Systems",
    tenantId: "TEN-004",
    balance: 3456,
    consumed: 15890,
    purchased: 19346,
    lastTopup: "2026-04-05",
    status: "critical",
    limit: 30000,
    autoTopup: false
  },
  {
    id: 5,
    tenant: "InnovateCorp",
    tenantId: "TEN-005",
    balance: 34200,
    consumed: 23500,
    purchased: 57700,
    lastTopup: "2026-04-16",
    status: "healthy",
    limit: 80000,
    autoTopup: true
  },
];

const recentTransactions = [
  {
    id: 1,
    tenant: "Everest Digital Solutions",
    type: "topup",
    amount: 25000,
    date: "2026-04-15",
    method: "Bank Transfer",
    status: "completed",
    reference: "TXN-2026-8934567"
  },
  {
    id: 2,
    tenant: "CloudScale Solutions",
    type: "topup",
    amount: 35000,
    date: "2026-04-18",
    method: "Credit Card",
    status: "completed",
    reference: "TXN-2026-8934568"
  },
  {
    id: 3,
    tenant: "TechVision Enterprises",
    type: "deduction",
    amount: 8500,
    date: "2026-04-17",
    method: "Usage Billing",
    status: "completed",
    reference: "DED-2026-1234"
  },
  {
    id: 4,
    tenant: "InnovateCorp",
    type: "topup",
    amount: 18000,
    date: "2026-04-16",
    method: "Bank Transfer",
    status: "completed",
    reference: "TXN-2026-8934569"
  },
  {
    id: 5,
    tenant: "DataFlow Systems",
    type: "deduction",
    amount: 5600,
    date: "2026-04-14",
    method: "Usage Billing",
    status: "completed",
    reference: "DED-2026-1235"
  },
];

export function BillingCreditManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTopupModal, setShowTopupModal] = useState(false);

  const stats = {
    totalCredits: tenantCredits.reduce((sum, t) => sum + t.balance, 0),
    totalConsumed: tenantCredits.reduce((sum, t) => sum + t.consumed, 0),
    totalPurchased: tenantCredits.reduce((sum, t) => sum + t.purchased, 0),
    lowBalanceCount: tenantCredits.filter(t => t.status === 'low' || t.status === 'critical').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "low":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "critical":
        return "bg-[#FEE2E2] text-[#991B1B]";
      default:
        return "bg-[#F3F4F6] text-[#374151]";
    }
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing", onClick: () => navigate("/admin/billing") },
          { label: "Credit Management" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Credit Management</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Manage pre-paid credits, balances, and top-ups
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
              <button
                onClick={() => setShowTopupModal(true)}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Credits
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#E3F2FD] rounded-lg">
                  <CreditCard className="w-5 h-5 text-[#1565C0]" />
                </div>
                <p className="text-sm text-[#6B7280]">Total Balance</p>
              </div>
              <p className="text-2xl font-bold text-[#0F1B2D]">₹{stats.totalCredits.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-[#10B981] mt-2">
                <ArrowUpRight size={14} />
                <span>+8.2%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#FEF3C7] rounded-lg">
                  <TrendingDown className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <p className="text-sm text-[#6B7280]">Total Consumed</p>
              </div>
              <p className="text-2xl font-bold text-[#0F1B2D]">₹{stats.totalConsumed.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-[#6B7280] mt-2">
                <span>This month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#D1FAE5] rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#10B981]" />
                </div>
                <p className="text-sm text-[#6B7280]">Total Purchased</p>
              </div>
              <p className="text-2xl font-bold text-[#0F1B2D]">₹{stats.totalPurchased.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-[#10B981] mt-2">
                <ArrowUpRight size={14} />
                <span>+12.5%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#FEE2E2] rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                </div>
                <p className="text-sm text-[#6B7280]">Low Balance</p>
              </div>
              <p className="text-2xl font-bold text-[#DC2626]">{stats.lowBalanceCount}</p>
              <div className="flex items-center gap-1 text-sm text-[#6B7280] mt-2">
                <span>Tenants</span>
              </div>
            </div>
          </div>

          {/* Credit History Chart */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F1B2D]">Credit History</h2>
                <p className="text-sm text-[#6B7280] mt-1">Purchase and consumption trends</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={creditHistory}>
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
                <Line type="monotone" dataKey="purchased" stroke="#10B981" strokeWidth={2} name="Purchased" />
                <Line type="monotone" dataKey="consumed" stroke="#DC2626" strokeWidth={2} name="Consumed" />
                <Line type="monotone" dataKey="balance" stroke="#1565C0" strokeWidth={2} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tenant Credits Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F1B2D]">Tenant Credit Balances</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Current credit status for all tenants</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search tenants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151]"
                  >
                    <option value="all">All Status</option>
                    <option value="healthy">Healthy</option>
                    <option value="low">Low Balance</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Consumed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Purchased
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Last Top-up
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Auto Top-up
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {tenantCredits.map((tenant) => {
                    const usagePercent = (tenant.consumed / tenant.limit) * 100;
                    return (
                      <tr key={tenant.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#0F1B2D]">{tenant.tenant}</p>
                            <p className="text-xs text-[#6B7280]">{tenant.tenantId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#1565C0]">
                            ₹{tenant.balance.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-[#0F1B2D]">
                            ₹{tenant.consumed.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-[#0F1B2D]">
                            ₹{tenant.purchased.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-[#6B7280]">{tenant.lastTopup}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            tenant.autoTopup ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#F3F4F6] text-[#374151]'
                          }`}>
                            {tenant.autoTopup ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {tenant.autoTopup ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                            {tenant.status === 'healthy' && <CheckCircle size={12} />}
                            {tenant.status === 'low' && <Clock size={12} />}
                            {tenant.status === 'critical' && <AlertCircle size={12} />}
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1]">
                            Add Credits
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#0F1B2D]">Recent Transactions</h2>
              <p className="text-sm text-[#6B7280] mt-1">Latest credit transactions</p>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="p-6 hover:bg-[#F9FAFB] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      txn.type === 'topup' ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'
                    }`}>
                      {txn.type === 'topup' ? (
                        <TrendingUp className={`w-5 h-5 text-[#065F46]`} />
                      ) : (
                        <TrendingDown className={`w-5 h-5 text-[#991B1B]`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#0F1B2D]">{txn.tenant}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{txn.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      txn.type === 'topup' ? 'text-[#10B981]' : 'text-[#DC2626]'
                    }`}>
                      {txn.type === 'topup' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{txn.date} • {txn.method}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
