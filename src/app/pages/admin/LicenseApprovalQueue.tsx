import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  KeyRound, CheckCircle2, XCircle, Clock, AlertCircle, Eye,
  User, Building2, Calendar, Shield, ChevronRight, Search, Filter,
  CheckCheck, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useApprovals, useOmniStore } from "../../store/index";

interface QueueItem {
  id: string;
  tenantName: string;
  tenantId: string;
  planName: string;
  makerId: string;
  makerName: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  licenseId: string;
  expiryDate: string;
  maxUsers: number;
  type: 'New' | 'Upgrade' | 'Renewal' | 'Temp';
  notes?: string;
}

const queueItems: QueueItem[] = [
  { id: "APR-001", tenantName: "Global Fintech Services", tenantId: "TNT-004", planName: "Growth", makerId: "USR-SA-003", makerName: "Deepak Kumar (SA)", requestedAt: "2025-04-25T10:00:00Z", status: "Pending", licenseId: "LIC-NEW-001", expiryDate: "2026-04-27", maxUsers: 15, type: "New", notes: "New customer onboarding. KYC verified. India-primary deployment." },
  { id: "APR-004", tenantName: "TechAvtar India Pvt Ltd", tenantId: "TNT-001", planName: "Enterprise", makerId: "USR-SA-001", makerName: "Admin SA-01", requestedAt: "2025-04-22T14:00:00Z", status: "Pending", licenseId: "LIC-UPG-001", expiryDate: "2026-03-31", maxUsers: 50, type: "Upgrade", notes: "Customer requesting upgrade from Growth to Enterprise. Payment received." },
  { id: "APR-005", tenantName: "CloudStack Technologies", tenantId: "TNT-008", planName: "Starter", makerId: "USR-SA-002", makerName: "Admin SA-02", requestedAt: "2025-04-20T09:00:00Z", status: "Pending", licenseId: "LIC-TEMP-001", expiryDate: "2025-05-05", maxUsers: 5, type: "Temp", notes: "Temporary 15-day trial extension. Customer evaluating paid plan." },
  { id: "APR-006", tenantName: "Vedanta Logistics", tenantId: "TNT-009", planName: "Growth", makerId: "USR-SA-001", makerName: "Admin SA-01", requestedAt: "2025-04-10T11:00:00Z", status: "Approved", licenseId: "LIC-RNW-001", expiryDate: "2026-05-18", maxUsers: 15, type: "Renewal" },
  { id: "APR-007", tenantName: "Nexus Healthcare", tenantId: "TNT-006", planName: "Enterprise", makerId: "USR-SA-003", makerName: "Deepak Kumar (SA)", requestedAt: "2025-04-05T09:00:00Z", status: "Rejected", licenseId: "LIC-N-002", expiryDate: "", maxUsers: 50, type: "Upgrade", notes: "Payment not received. License rejected pending payment." },
];

const typeColors: Record<string, string> = {
  New: "bg-green-50 text-green-700",
  Upgrade: "bg-blue-50 text-blue-700",
  Renewal: "bg-purple-50 text-purple-700",
  Temp: "bg-amber-50 text-amber-700",
};

export function LicenseApprovalQueue() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [search, setSearch] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [items, setItems] = useState(queueItems);
  const { approvalRequests, approveRequest, rejectRequest } = useApprovals();

  const filtered = items.filter(item => {
    const matchStatus = statusFilter === "All" || item.status === statusFilter;
    const matchSearch = item.tenantName.toLowerCase().includes(search.toLowerCase()) || item.planName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = items.filter(i => i.status === "Pending").length;

  const handleApprove = async (id: string) => {
    setProcessing(id);
    await new Promise(r => setTimeout(r, 1000));
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' as const } : item));
    toast.success("License approved and activated! Tenant has been notified.");
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) { toast.error("Rejection reason is required"); return; }
    setProcessing(id);
    await new Promise(r => setTimeout(r, 800));
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' as const } : item));
    setShowRejectModal(null);
    setRejectReason("");
    toast.error("License request rejected. Requester notified.");
    setProcessing(null);
  };

  const fmtDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Admin" }, { label: "Licenses", path: "/admin/licenses" }, { label: "Approval Queue" }]}
        companyName="Hitech Solutions"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">License Approval Queue</h1>
                {pendingCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">{pendingCount} Pending</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Maker-checker flow: two distinct approvers required for all license assignments</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Maker-Checker Enforcement</p>
              <p className="text-xs text-blue-700 mt-0.5">License assignments require approval from 2 distinct admins. The maker who submitted cannot be the checker. All approvals are audit-logged with reason, timestamp, and actor.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              {(["All", "Pending", "Approved", "Rejected"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {s} {s === "Pending" && pendingCount > 0 && `(${pendingCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Tenant</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Plan / Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Requested By</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Validity</th>
                  <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} className={`${i < filtered.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.tenantName}</p>
                          <p className="text-xs text-gray-400">{item.tenantId}</p>
                          {item.notes && <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{item.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{item.planName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type]}`}>{item.type}</span>
                        <p className="text-xs text-gray-500">Max {item.maxUsers} users</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">{item.makerName}</p>
                          <p className="text-xs text-gray-400">{fmtDate(item.requestedAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {item.expiryDate ? (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          Until {fmtDate(item.expiryDate)}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        item.status === 'Approved' ? 'bg-green-50 text-green-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {item.status === 'Pending' && <Clock className="w-3 h-3 inline mr-1" />}
                        {item.status === 'Approved' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        {item.status === 'Rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {item.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/tenants/${item.tenantId}`)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Tenant"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={!!processing}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {processing === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => setShowRejectModal(item.id)}
                            disabled={!!processing}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate(`/admin/licenses/${item.licenseId}`)}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 ml-auto"
                        >
                          View License <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No pending approvals</p>
                <p className="text-sm text-gray-400 mt-1">All license requests have been processed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Reject License Request</h3>
              <p className="text-xs text-gray-500 mt-0.5">Rejection reason is mandatory and will be visible in the audit log</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g., Payment not received. License cannot be activated until payment is confirmed..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              {!rejectReason.trim() && <p className="text-xs text-red-500 mt-1">Rejection reason is required</p>}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setShowRejectModal(null); setRejectReason(""); }} className="flex-1 text-sm text-gray-600 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim() || !!processing}
                className="flex-1 text-sm bg-red-600 text-white rounded-lg py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
