import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  FileText, Filter, Download, Plus, Search, Calendar,
  CheckCircle, XCircle, Clock3, ArrowUpDown, Eye, Edit, Send,
  Trash2, MoreVertical, RefreshCw
} from "lucide-react";

const invoices = [
  {
    id: "INV-2026-1847",
    tenant: "Everest Digital Solutions",
    tenantId: "TEN-001",
    amount: 45678,
    status: "paid",
    dueDate: "2026-04-15",
    issueDate: "2026-04-01",
    paidDate: "2026-04-12",
    items: 12,
    services: ["AI Calls", "WhatsApp", "Storage"],
    billingCycle: "Monthly"
  },
  {
    id: "INV-2026-1846",
    tenant: "TechVision Enterprises",
    tenantId: "TEN-002",
    amount: 32890,
    status: "paid",
    dueDate: "2026-04-15",
    issueDate: "2026-04-01",
    paidDate: "2026-04-14",
    items: 8,
    services: ["AI Calls", "SMS"],
    billingCycle: "Monthly"
  },
  {
    id: "INV-2026-1845",
    tenant: "CloudScale Solutions",
    tenantId: "TEN-003",
    amount: 56234,
    status: "pending",
    dueDate: "2026-04-25",
    issueDate: "2026-04-10",
    paidDate: null,
    items: 15,
    services: ["AI Calls", "WhatsApp", "SMS", "Email"],
    billingCycle: "Monthly"
  },
  {
    id: "INV-2026-1844",
    tenant: "DataFlow Systems",
    tenantId: "TEN-004",
    amount: 23456,
    status: "overdue",
    dueDate: "2026-04-10",
    issueDate: "2026-03-26",
    paidDate: null,
    items: 6,
    services: ["AI Calls"],
    billingCycle: "Monthly"
  },
  {
    id: "INV-2026-1843",
    tenant: "InnovateCorp",
    tenantId: "TEN-005",
    amount: 41200,
    status: "paid",
    dueDate: "2026-04-12",
    issueDate: "2026-03-28",
    paidDate: "2026-04-11",
    items: 10,
    services: ["AI Calls", "WhatsApp"],
    billingCycle: "Monthly"
  },
  {
    id: "INV-2026-1842",
    tenant: "SmartTech Ltd",
    tenantId: "TEN-006",
    amount: 18900,
    status: "cancelled",
    dueDate: "2026-04-08",
    issueDate: "2026-03-24",
    paidDate: null,
    items: 5,
    services: ["SMS", "Email"],
    billingCycle: "Monthly"
  },
  {
    id: "INV-2026-1841",
    tenant: "DigiServe Pro",
    tenantId: "TEN-007",
    amount: 67890,
    status: "paid",
    dueDate: "2026-04-18",
    issueDate: "2026-04-03",
    paidDate: "2026-04-16",
    items: 18,
    services: ["AI Calls", "WhatsApp", "SMS", "Email", "Storage"],
    billingCycle: "Monthly"
  },
  {
    id: "INV-2026-1840",
    tenant: "FutureTech Solutions",
    tenantId: "TEN-008",
    amount: 29500,
    status: "pending",
    dueDate: "2026-04-22",
    issueDate: "2026-04-07",
    paidDate: null,
    items: 7,
    services: ["AI Calls", "Storage"],
    billingCycle: "Monthly"
  },
];

export function InvoiceList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };

  const handleSelectInvoice = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter(invId => invId !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "pending":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "overdue":
        return "bg-[#FEE2E2] text-[#991B1B]";
      case "cancelled":
        return "bg-[#F3F4F6] text-[#374151]";
      default:
        return "bg-[#E5E7EB] text-[#6B7280]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={12} />;
      case "pending":
        return <Clock3 size={12} />;
      case "overdue":
        return <XCircle size={12} />;
      default:
        return null;
    }
  };

  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === "paid").length,
    pending: invoices.filter(inv => inv.status === "pending").length,
    overdue: invoices.filter(inv => inv.status === "overdue").length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
    outstandingAmount: invoices.filter(inv => inv.status !== "paid" && inv.status !== "cancelled").reduce((sum, inv) => sum + inv.amount, 0),
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing", onClick: () => navigate("/admin/billing") },
          { label: "Invoices" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Invoice Management</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Manage all invoices and billing transactions
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
              <button
                onClick={() => navigate("/admin/billing/invoices/create")}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Create Invoice
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-sm text-[#6B7280] mb-1">Total Invoices</p>
              <p className="text-2xl font-semibold text-[#0F1B2D]">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-sm text-[#6B7280] mb-1">Paid Amount</p>
              <p className="text-2xl font-semibold text-[#10B981]">₹{stats.paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-sm text-[#6B7280] mb-1">Outstanding</p>
              <p className="text-2xl font-semibold text-[#F59E0B]">₹{stats.outstandingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-sm text-[#6B7280] mb-1">Overdue</p>
              <p className="text-2xl font-semibold text-[#DC2626]">{stats.overdue}</p>
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
                    placeholder="Search by invoice ID or tenant name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
              </select>
              <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Filter size={16} />
                More Filters
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedInvoices.length > 0 && (
            <div className="bg-[#E3F2FD] border border-[#1565C0] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#0F1B2D]">
                  {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                    <Send size={14} />
                    Send Reminders
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                    <Download size={14} />
                    Export Selected
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition-colors flex items-center gap-2">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-[#E5E7EB] text-[#1565C0] focus:ring-[#1565C0]"
                      />
                    </th>
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
                      Issue Date
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
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => handleSelectInvoice(invoice.id)}
                          className="w-4 h-4 rounded border-[#E5E7EB] text-[#1565C0] focus:ring-[#1565C0]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-[#6B7280]" />
                          <span className="text-sm font-medium text-[#1565C0]">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#0F1B2D]">{invoice.tenant}</p>
                          <p className="text-xs text-[#6B7280]">{invoice.tenantId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-[#0F1B2D]">
                          ₹{invoice.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6B7280]">{invoice.issueDate}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#6B7280]">{invoice.dueDate}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate("/admin/billing/invoices/detail")}
                            className="p-1.5 text-[#1565C0] hover:bg-[#E3F2FD] rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded transition-colors"
                            title="More Options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                Showing {filteredInvoices.length} of {invoices.length} invoices
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-[#1565C0] text-white rounded-lg text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                  3
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
