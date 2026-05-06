import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  History, Download, Filter, Search, Calendar, TrendingUp,
  TrendingDown, CheckCircle, XCircle, Clock, Eye, FileText,
  CreditCard, Building
} from "lucide-react";

const transactions = [
  {
    id: "TXN-2026-8934567",
    type: "payment",
    tenant: "Everest Digital Solutions",
    tenantId: "TEN-001",
    amount: 53900,
    status: "completed",
    method: "Bank Transfer",
    date: "2026-04-12",
    invoiceId: "INV-2026-1847",
    description: "Invoice payment for March 2026"
  },
  {
    id: "TXN-2026-8934568",
    type: "refund",
    tenant: "TechVision Enterprises",
    tenantId: "TEN-002",
    amount: 5600,
    status: "completed",
    method: "Bank Transfer",
    date: "2026-04-11",
    invoiceId: "INV-2026-1842",
    description: "Service credit refund"
  },
  {
    id: "TXN-2026-8934569",
    type: "payment",
    tenant: "CloudScale Solutions",
    tenantId: "TEN-003",
    amount: 67890,
    status: "completed",
    method: "Credit Card",
    date: "2026-04-16",
    invoiceId: "INV-2026-1841",
    description: "Invoice payment for March 2026"
  },
  {
    id: "TXN-2026-8934570",
    type: "payment",
    tenant: "DataFlow Systems",
    tenantId: "TEN-004",
    amount: 23456,
    status: "failed",
    method: "Credit Card",
    date: "2026-04-10",
    invoiceId: "INV-2026-1844",
    description: "Invoice payment failed - Insufficient funds"
  },
  {
    id: "TXN-2026-8934571",
    type: "payment",
    tenant: "InnovateCorp",
    tenantId: "TEN-005",
    amount: 41200,
    status: "completed",
    method: "Bank Transfer",
    date: "2026-04-11",
    invoiceId: "INV-2026-1843",
    description: "Invoice payment for March 2026"
  },
  {
    id: "TXN-2026-8934572",
    type: "credit-topup",
    tenant: "Everest Digital Solutions",
    tenantId: "TEN-001",
    amount: 25000,
    status: "completed",
    method: "Bank Transfer",
    date: "2026-04-15",
    invoiceId: null,
    description: "Credit balance top-up"
  },
  {
    id: "TXN-2026-8934573",
    type: "usage-charge",
    tenant: "CloudScale Solutions",
    tenantId: "TEN-003",
    amount: 8900,
    status: "pending",
    method: "Credit Deduction",
    date: "2026-04-18",
    invoiceId: null,
    description: "AI Calling usage charges"
  },
  {
    id: "TXN-2026-8934574",
    type: "payment",
    tenant: "SmartTech Ltd",
    tenantId: "TEN-006",
    amount: 18900,
    status: "completed",
    method: "Credit Card",
    date: "2026-04-09",
    invoiceId: "INV-2026-1842",
    description: "Invoice payment for February 2026"
  },
];

export function BillingHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("this-month");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.invoiceId && txn.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" || txn.type === typeFilter;
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeLabel = (type: string) => {
    const labels: any = {
      payment: "Payment",
      refund: "Refund",
      "credit-topup": "Credit Top-up",
      "usage-charge": "Usage Charge"
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "payment":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "refund":
        return "bg-[#FEE2E2] text-[#991B1B]";
      case "credit-topup":
        return "bg-[#E3F2FD] text-[#1565C0]";
      case "usage-charge":
        return "bg-[#FEF3C7] text-[#92400E]";
      default:
        return "bg-[#F3F4F6] text-[#374151]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={12} />;
      case "pending":
        return <Clock size={12} />;
      case "failed":
        return <XCircle size={12} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "pending":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "failed":
        return "bg-[#FEE2E2] text-[#991B1B]";
      default:
        return "bg-[#F3F4F6] text-[#374151]";
    }
  };

  const stats = {
    totalTransactions: transactions.length,
    completedAmount: transactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0),
    pendingAmount: transactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0),
    failedCount: transactions.filter(t => t.status === "failed").length,
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing", onClick: () => navigate("/admin/billing") },
          { label: "Transaction History" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Billing History</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Complete transaction and payment history
              </p>
            </div>
            <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
              <Download size={16} />
              Export History
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#E3F2FD] rounded-lg">
                  <History className="w-5 h-5 text-[#1565C0]" />
                </div>
                <p className="text-sm text-[#6B7280]">Total Transactions</p>
              </div>
              <p className="text-2xl font-bold text-[#0F1B2D]">{stats.totalTransactions}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#D1FAE5] rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <p className="text-sm text-[#6B7280]">Completed</p>
              </div>
              <p className="text-2xl font-bold text-[#10B981]">₹{stats.completedAmount.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#FEF3C7] rounded-lg">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <p className="text-sm text-[#6B7280]">Pending</p>
              </div>
              <p className="text-2xl font-bold text-[#F59E0B]">₹{stats.pendingAmount.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#FEE2E2] rounded-lg">
                  <XCircle className="w-5 h-5 text-[#DC2626]" />
                </div>
                <p className="text-sm text-[#6B7280]">Failed</p>
              </div>
              <p className="text-2xl font-bold text-[#DC2626]">{stats.failedCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Search by transaction ID, tenant, or invoice..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              >
                <option value="all">All Types</option>
                <option value="payment">Payments</option>
                <option value="refund">Refunds</option>
                <option value="credit-topup">Credit Top-ups</option>
                <option value="usage-charge">Usage Charges</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Date
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
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="text-sm font-medium text-[#1565C0]">{txn.id}</span>
                          {txn.invoiceId && (
                            <p className="text-xs text-[#6B7280] mt-0.5">{txn.invoiceId}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(txn.type)}`}>
                          {getTypeLabel(txn.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#0F1B2D]">{txn.tenant}</p>
                          <p className="text-xs text-[#6B7280]">{txn.tenantId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${
                          txn.type === 'refund' ? 'text-[#DC2626]' : 'text-[#10B981]'
                        }`}>
                          {txn.type === 'refund' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-[#6B7280]" />
                          <span className="text-sm text-[#6B7280]">{txn.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6B7280]">{txn.date}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                          {getStatusIcon(txn.status)}
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="p-1.5 text-[#1565C0] hover:bg-[#E3F2FD] rounded transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-[#1565C0] text-white rounded-lg text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
