import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield, AlertTriangle, Zap, Lock, Eye, Ban, Power, RefreshCw,
  Database, Globe, Users, DollarSign, FileText, Activity, Clock, CheckCircle2
} from "lucide-react";

interface ControlCard {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  riskLevel: "critical" | "high" | "medium";
  action: string;
  path?: string;
}

const platformControls: ControlCard[] = [
  {
    title: "Emergency Shutdown",
    description: "Immediately suspend all platform operations and API access",
    icon: Power,
    color: "#D32F2F",
    riskLevel: "critical",
    action: "Initiate Shutdown"
  },
  {
    title: "Tenant Suspension",
    description: "Suspend specific tenant access without affecting others",
    icon: Ban,
    color: "#F57C00",
    riskLevel: "high",
    action: "Suspend Tenant"
  },
  {
    title: "Override Permissions",
    description: "Temporarily override tenant permission settings for emergency access",
    icon: Lock,
    color: "#F57C00",
    riskLevel: "high",
    action: "Override",
    path: "/admin/controls/overrides"
  },
  {
    title: "Force Password Reset",
    description: "Require immediate password reset for all users or specific tenant",
    icon: RefreshCw,
    color: "#1565C0",
    riskLevel: "medium",
    action: "Force Reset"
  },
  {
    title: "Abuse Prevention",
    description: "Rate limiting, IP blocking, and suspicious activity controls",
    icon: Shield,
    color: "#00897B",
    riskLevel: "medium",
    action: "Manage",
    path: "/admin/controls/abuse-prevention"
  },
  {
    title: "Platform-Wide Audit",
    description: "Comprehensive audit log access across all tenants",
    icon: Eye,
    color: "#5E35B1",
    riskLevel: "medium",
    action: "View Logs",
    path: "/admin/controls/audit"
  },
];

const emergencyMetrics = [
  { label: "Active Incidents", value: "0", icon: AlertTriangle, color: "#00897B" },
  { label: "Suspended Tenants", value: "2", icon: Ban, color: "#F57C00" },
  { label: "Override Active", value: "1", icon: Lock, color: "#1565C0" },
  { label: "Rate Limited IPs", value: "47", icon: Shield, color: "#5E35B1" },
];

const recentActions = [
  {
    action: "Tenant Suspended",
    target: "Acme Corp (ID: 1847)",
    reason: "Payment failure - 60 days overdue",
    user: "Super Admin",
    timestamp: "2024-03-15T14:30:00",
    severity: "high"
  },
  {
    action: "Permission Override",
    target: "TechStart Inc (ID: 2156)",
    reason: "Emergency compliance audit access",
    user: "Super Admin",
    timestamp: "2024-03-15T10:20:00",
    severity: "medium"
  },
  {
    action: "IP Blocked",
    target: "192.168.45.123",
    reason: "Multiple failed login attempts (50+ in 5 min)",
    user: "System",
    timestamp: "2024-03-14T18:45:00",
    severity: "medium"
  },
  {
    action: "Force Password Reset",
    target: "GlobalCorp (ID: 1523)",
    reason: "Security breach reported by tenant",
    user: "Super Admin",
    timestamp: "2024-03-14T12:15:00",
    severity: "high"
  },
];

export function SuperAdminControls() {
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [confirmText, setConfirmText] = useState("");

  const handleEmergencyAction = (actionTitle: string, path?: string) => {
    if (path) {
      navigate(path);
    } else {
      setSelectedAction(actionTitle);
      setShowEmergencyModal(true);
    }
  };

  const handleConfirmAction = () => {
    if (confirmText !== "CONFIRM") return;
    console.log("Executing emergency action:", selectedAction);
    setShowEmergencyModal(false);
    setConfirmText("");
    setSelectedAction("");
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-100 text-red-700 border-red-300";
      case "high": return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium": return "bg-blue-100 text-blue-700 border-blue-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertTriangle size={16} className="text-red-500" />;
      case "medium": return <Activity size={16} className="text-orange-500" />;
      default: return <CheckCircle2 size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield size={24} className="text-red-600" />
            </div>
            <div>
              <h1 className="font-semibold text-[#0F1B2D]">Super Admin Controls</h1>
              <p className="text-sm text-[#64748B]">
                Platform governance, emergency actions, and sovereignty controls
              </p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <strong>Critical Access:</strong> These controls affect platform-wide operations and all tenants. All actions are logged and audited.
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Emergency Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {emergencyMetrics.map((metric, index) => (
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
              <div className="text-sm text-[#64748B]">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Platform Controls */}
        <div className="mb-8">
          <h2 className="font-semibold text-[#0F1B2D] mb-4">Platform-Wide Controls</h2>
          <div className="grid grid-cols-3 gap-4">
            {platformControls.map((control, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#1565C0] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${control.color}15` }}
                  >
                    <control.icon size={24} style={{ color: control.color }} strokeWidth={1.5} />
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(control.riskLevel)}`}>
                    {control.riskLevel.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-[#0F1B2D] mb-2">{control.title}</h3>
                <p className="text-sm text-[#64748B] mb-4">{control.description}</p>
                <button
                  onClick={() => handleEmergencyAction(control.title, control.path)}
                  className="w-full h-9 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: `${control.color}15`,
                    color: control.color
                  }}
                >
                  {control.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Sovereignty Controls */}
        <div className="mb-8">
          <h2 className="font-semibold text-[#0F1B2D] mb-4">Platform Sovereignty</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Database size={20} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-[#0F1B2D]">Data Access Controls</h3>
              </div>
              <p className="text-sm text-[#64748B] mb-4">
                Platform owner maintains ultimate access to all tenant data for compliance, legal, and operational continuity.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-[#0F1B2D]">Cross-Tenant Query Access</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">ENABLED</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-[#0F1B2D]">Encryption Key Management</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">PLATFORM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-[#0F1B2D]">Backup & Recovery Control</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">CENTRALIZED</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Globe size={20} className="text-orange-600" />
                </div>
                <h3 className="font-semibold text-[#0F1B2D]">Tenant Boundaries</h3>
              </div>
              <p className="text-sm text-[#64748B] mb-4">
                Tenants operate independently within their scope but cannot access platform-level controls or other tenants.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-[#0F1B2D]">Tenant Data Isolation</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">ENFORCED</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-[#0F1B2D]">Cross-Tenant Access Block</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-[#0F1B2D]">Platform Setting Protection</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">LOCKED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Emergency Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F1B2D]">Recent Emergency Actions</h2>
            <button
              onClick={() => navigate("/admin/controls/audit")}
              className="text-sm text-[#1565C0] hover:underline"
            >
              Full Audit Log
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Executed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActions.map((action, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(action.severity)}
                        <span className="font-medium text-sm text-[#0F1B2D]">{action.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0F1B2D]">{action.target}</td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">{action.reason}</td>
                    <td className="px-6 py-4 text-sm text-[#0F1B2D]">{action.user}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <Clock size={12} />
                        {new Date(action.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Emergency Action Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-[#0F1B2D] text-center mb-2">Confirm Emergency Action</h3>
              <p className="text-sm text-[#64748B] text-center mb-6">
                You are about to execute: <strong>{selectedAction}</strong>
                <br />
                This action will be logged and audited.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                  Type "CONFIRM" to proceed
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="CONFIRM"
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowEmergencyModal(false);
                    setConfirmText("");
                    setSelectedAction("");
                  }}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={confirmText !== "CONFIRM"}
                  className="flex-1 h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Execute Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
