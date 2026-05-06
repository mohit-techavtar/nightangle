import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Users, Lock, Activity, AlertCircle, Settings, FileText,
  Ban, RefreshCw, Eye, Clock, CheckCircle2, TrendingUp, UserX, Bell
} from "lucide-react";

interface ControlCard {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action: string;
  path?: string;
}

const orgControls: ControlCard[] = [
  {
    title: "Team Member Management",
    description: "Add, remove, and manage team member access and status",
    icon: Users,
    color: "#1565C0",
    action: "Manage Team",
    path: "/tenant/team/assignments"
  },
  {
    title: "Role & Permission Control",
    description: "Define and manage team roles with granular permissions",
    icon: Lock,
    color: "#5E35B1",
    action: "Manage Roles",
    path: "/tenant/team/roles"
  },
  {
    title: "Suspend Member Access",
    description: "Temporarily suspend team member access without removal",
    icon: Ban,
    color: "#F57C00",
    action: "Suspend Member"
  },
  {
    title: "Force Password Reset",
    description: "Require specific team members to reset their passwords",
    icon: RefreshCw,
    color: "#00897B",
    action: "Reset Passwords"
  },
  {
    title: "Activity Monitoring",
    description: "Monitor team member activity and permission changes",
    icon: Eye,
    color: "#1565C0",
    action: "View Activity",
    path: "/tenant/team/audit"
  },
  {
    title: "Session Management",
    description: "View and terminate active team member sessions",
    icon: Activity,
    color: "#5E35B1",
    action: "Manage Sessions"
  },
];

const orgMetrics = [
  { label: "Active Members", value: "48", change: "+5 this week", icon: Users, color: "#1565C0" },
  { label: "Suspended Members", value: "2", change: "1 auto-suspended", icon: UserX, color: "#F57C00" },
  { label: "Active Sessions", value: "32", change: "67% of team", icon: Activity, color: "#00897B" },
  { label: "Security Alerts", value: "3", change: "Requires review", icon: AlertCircle, color: "#D32F2F" },
];

const tenantBoundaries = [
  {
    category: "Team Scope",
    description: "Your controls apply only to your organization's team members",
    items: [
      { label: "Manage Your Team Members", status: "allowed" },
      { label: "Create Organization Roles", status: "allowed" },
      { label: "View Team Activity Logs", status: "allowed" },
      { label: "Access Other Organizations", status: "blocked" },
      { label: "View Platform Analytics", status: "blocked" },
    ]
  },
  {
    category: "Data Boundaries",
    description: "Your data is isolated from other organizations",
    items: [
      { label: "Access Your CRM Data", status: "allowed" },
      { label: "Export Your Organization Data", status: "allowed" },
      { label: "Manage Your Campaigns", status: "allowed" },
      { label: "Cross-Organization Queries", status: "blocked" },
      { label: "Platform Configuration", status: "blocked" },
    ]
  },
];

const recentActions = [
  {
    action: "Member Suspended",
    target: "John Martinez",
    reason: "Exceeded failed login attempts (5 in 10 min)",
    user: "You",
    timestamp: "2024-03-15T14:30:00"
  },
  {
    action: "Role Assigned",
    target: "Sarah Chen → Sales Manager",
    reason: "Promotion to team lead position",
    user: "You",
    timestamp: "2024-03-15T10:20:00"
  },
  {
    action: "Password Reset Required",
    target: "3 team members",
    reason: "Security policy: 90-day rotation",
    user: "System",
    timestamp: "2024-03-14T18:45:00"
  },
  {
    action: "Session Terminated",
    target: "Michael Rodriguez",
    reason: "Admin request - device change verification",
    user: "You",
    timestamp: "2024-03-14T12:15:00"
  },
];

export function TenantAdminControls() {
  const navigate = useNavigate();
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedControl, setSelectedControl] = useState<string>("");

  const handleControlAction = (title: string, path?: string) => {
    if (path) {
      navigate(path);
    } else {
      setSelectedControl(title);
      setShowActionModal(true);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Shield size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="font-semibold text-[#0F1B2D]">Organization Admin Controls</h1>
              <p className="text-sm text-[#64748B]">
                Manage team access, permissions, and security within your organization
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Organization Scope:</strong> These controls affect only your team members and data. Platform-level settings are managed by the platform owner.
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Organization Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {orgMetrics.map((metric, index) => (
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

        {/* Organization Controls */}
        <div className="mb-8">
          <h2 className="font-semibold text-[#0F1B2D] mb-4">Team Governance Controls</h2>
          <div className="grid grid-cols-3 gap-4">
            {orgControls.map((control, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#1565C0] hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${control.color}15` }}
                  >
                    <control.icon size={24} style={{ color: control.color }} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-semibold text-[#0F1B2D] mb-2">{control.title}</h3>
                <p className="text-sm text-[#64748B] mb-4">{control.description}</p>
                <button
                  onClick={() => handleControlAction(control.title, control.path)}
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

        {/* Tenant Autonomy vs Platform Sovereignty */}
        <div className="mb-8">
          <h2 className="font-semibold text-[#0F1B2D] mb-4">Your Organization's Boundaries</h2>
          <div className="grid grid-cols-2 gap-6">
            {tenantBoundaries.map((boundary, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1565C0]/10 flex items-center justify-center">
                    {index === 0 ? (
                      <Users size={20} className="text-[#1565C0]" />
                    ) : (
                      <Lock size={20} className="text-[#1565C0]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F1B2D]">{boundary.category}</h3>
                    <p className="text-xs text-[#64748B]">{boundary.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {boundary.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm text-[#0F1B2D]">{item.label}</span>
                      {item.status === "allowed" ? (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Allowed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1">
                          <Ban size={12} />
                          Blocked
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="mb-8">
          <h2 className="font-semibold text-[#0F1B2D] mb-4">Security & Compliance Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Lock size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-[#0F1B2D]">Password Policies</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Minimum Length</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">12 characters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Rotation Period</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">90 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">2FA Required</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Enabled</span>
                </div>
                <button className="w-full h-9 rounded-lg bg-gray-100 text-[#0F1B2D] text-sm font-medium hover:bg-gray-200 transition-colors">
                  Configure Policy
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Bell size={20} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-[#0F1B2D]">Security Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Failed Login Alerts</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Unusual Activity Detection</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Permission Change Alerts</span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Active</span>
                </div>
                <button className="w-full h-9 rounded-lg bg-gray-100 text-[#0F1B2D] text-sm font-medium hover:bg-gray-200 transition-colors">
                  Configure Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Admin Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F1B2D]">Recent Admin Actions</h2>
            <button
              onClick={() => navigate("/tenant/team/audit")}
              className="text-sm text-[#1565C0] hover:underline"
            >
              View Full Activity Log
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
                      <span className="font-medium text-sm text-[#0F1B2D]">{action.action}</span>
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

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Settings size={32} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#0F1B2D] text-center mb-2">{selectedControl}</h3>
              <p className="text-sm text-[#64748B] text-center mb-6">
                This feature is being configured. All actions will be logged for your organization's audit trail.
              </p>
              <button
                onClick={() => setShowActionModal(false)}
                className="w-full h-10 px-4 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
