import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Ban, AlertTriangle, Activity, TrendingUp, Globe, Clock, X, Plus
} from "lucide-react";

interface RateLimit {
  id: string;
  endpoint: string;
  limit: number;
  window: string;
  status: "active" | "inactive";
  hits: number;
}

interface BlockedIP {
  id: string;
  ip: string;
  reason: string;
  blockedAt: string;
  expiresAt: string;
  tenant?: string;
}

const rateLimits: RateLimit[] = [
  { id: "1", endpoint: "/api/v1/campaigns/send", limit: 1000, window: "1 hour", status: "active", hits: 847 },
  { id: "2", endpoint: "/api/v1/ai-calling/initiate", limit: 500, window: "1 hour", status: "active", hits: 423 },
  { id: "3", endpoint: "/api/v1/auth/login", limit: 10, window: "15 min", status: "active", hits: 8 },
  { id: "4", endpoint: "/api/v1/crm/bulk-import", limit: 50, window: "1 day", status: "active", hits: 12 },
  { id: "5", endpoint: "/api/v1/reports/export", limit: 100, window: "1 hour", status: "active", hits: 67 },
];

const blockedIPs: BlockedIP[] = [
  { id: "1", ip: "192.168.45.123", reason: "Brute force - 50+ failed logins", blockedAt: "2024-03-15T14:30:00", expiresAt: "2024-03-16T14:30:00" },
  { id: "2", ip: "10.0.0.87", reason: "Rate limit exceeded - 5000 req/min", blockedAt: "2024-03-15T12:15:00", expiresAt: "2024-03-15T18:15:00", tenant: "Acme Corp" },
  { id: "3", ip: "172.16.0.42", reason: "Suspicious activity pattern detected", blockedAt: "2024-03-15T10:20:00", expiresAt: "2024-03-17T10:20:00" },
  { id: "4", ip: "203.0.113.45", reason: "API abuse - scraping attempt", blockedAt: "2024-03-14T18:45:00", expiresAt: "2024-03-21T18:45:00" },
];

const abuseMetrics = [
  { label: "Blocked IPs", value: "47", change: "+12 today", icon: Ban, color: "#D32F2F" },
  { label: "Rate Limited", value: "156", change: "Last 24 hours", icon: Activity, color: "#F57C00" },
  { label: "Suspicious Patterns", value: "23", change: "Under review", icon: AlertTriangle, color: "#FFA000" },
  { label: "Auto-Mitigated", value: "189", change: "This week", icon: Shield, color: "#00897B" },
];

export function AbusePreventionControls() {
  const navigate = useNavigate();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [ipToBlock, setIpToBlock] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const handleUnblockIP = (ip: string) => {
    console.log("Unblocking IP:", ip);
  };

  const handleBlockIP = () => {
    if (!ipToBlock || !blockReason) return;
    console.log("Blocking IP:", ipToBlock, "Reason:", blockReason);
    setShowBlockModal(false);
    setIpToBlock("");
    setBlockReason("");
  };

  const getUsagePercentage = (hits: number, limit: number) => {
    return Math.round((hits / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "#D32F2F";
    if (percentage >= 70) return "#F57C00";
    return "#00897B";
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="font-semibold text-[#0F1B2D]">Abuse Prevention & Rate Limiting</h1>
                <p className="text-sm text-[#64748B]">
                  Monitor and control platform usage to prevent abuse and ensure fair access
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="h-10 px-5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Ban size={18} />
              Block IP Address
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {abuseMetrics.map((metric, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <metric.icon size={24} style={{ color: metric.color }} strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">{metric.value}</div>
              <div className="text-sm text-[#64748B] mb-2">{metric.label}</div>
              <div className="flex items-center gap-1 text-xs text-[#00897B]">
                <TrendingUp size={14} />
                <span>{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F1B2D]">Active Rate Limits</h2>
            <button
              onClick={() => setShowRateLimitModal(true)}
              className="h-9 px-4 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Limit
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Current Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rateLimits.map((limit) => {
                  const percentage = getUsagePercentage(limit.hits, limit.limit);
                  const color = getUsageColor(percentage);

                  return (
                    <tr key={limit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <code className="text-sm font-mono text-[#0F1B2D] bg-gray-100 px-2 py-1 rounded">
                          {limit.endpoint}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#0F1B2D]">
                        {limit.limit.toLocaleString()} / {limit.window}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-[#0F1B2D]">
                              {limit.hits.toLocaleString()} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          limit.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {limit.status.charAt(0).toUpperCase() + limit.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm text-[#1565C0] hover:underline">
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blocked IPs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F1B2D]">Blocked IP Addresses</h2>
            <span className="text-sm text-[#64748B]">{blockedIPs.length} currently blocked</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Blocked At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blockedIPs.map((blocked) => (
                  <tr key={blocked.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Ban size={16} className="text-red-500" />
                        <code className="text-sm font-mono text-[#0F1B2D]">{blocked.ip}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0F1B2D]">{blocked.reason}</td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {blocked.tenant || "Platform-wide"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <Clock size={12} />
                        {new Date(blocked.blockedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <Clock size={12} />
                        {new Date(blocked.expiresAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUnblockIP(blocked.ip)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Block IP Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0F1B2D]">Block IP Address</h3>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B]"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={ipToBlock}
                    onChange={(e) => setIpToBlock(e.target.value)}
                    placeholder="192.168.1.1"
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Reason
                  </label>
                  <textarea
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Describe the reason for blocking this IP..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent resize-none"
                  />
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-900">
                      This IP will be blocked immediately and all requests will be rejected for 24 hours.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockIP}
                  disabled={!ipToBlock || !blockReason}
                  className="flex-1 h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Block IP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Rate Limit Modal */}
      {showRateLimitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0F1B2D]">Add Rate Limit</h3>
                <button
                  onClick={() => setShowRateLimitModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B]"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-[#64748B] mb-6">
                Configure a new rate limit for API endpoints to prevent abuse.
              </p>
              <button
                onClick={() => setShowRateLimitModal(false)}
                className="w-full h-10 px-4 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Configure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
