import React from "react";
import { useNavigate } from "react-router";
import {
  Shield, Users, Lock, Activity, AlertTriangle, CheckCircle2,
  TrendingUp, Clock, UserCog, Grid3x3, FileText, Eye
} from "lucide-react";

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const metrics: MetricCard[] = [
  { label: "Total Roles", value: "24", change: "+2 this month", trend: "up", icon: Shield, color: "#1565C0" },
  { label: "Active Users", value: "1,847", change: "+127 this week", trend: "up", icon: Users, color: "#00897B" },
  { label: "Permission Groups", value: "42", change: "Across 8 modules", trend: "up", icon: Lock, color: "#5E35B1" },
  { label: "Recent Changes", value: "15", change: "Last 24 hours", trend: "up", icon: Activity, color: "#F57C00" },
];

const quickActions: QuickAction[] = [
  {
    label: "Create New Role",
    description: "Define a new role with custom permissions",
    icon: Shield,
    path: "/admin/roles-permissions/create",
    color: "#1565C0"
  },
  {
    label: "Permission Matrix",
    description: "View and manage all role permissions",
    icon: Grid3x3,
    path: "/admin/roles-permissions/matrix",
    color: "#5E35B1"
  },
  {
    label: "Assign Users",
    description: "Manage user-role assignments",
    icon: UserCog,
    path: "/admin/roles-permissions/assignments",
    color: "#00897B"
  },
  {
    label: "Audit Log",
    description: "Review permission change history",
    icon: FileText,
    path: "/admin/roles-permissions/audit",
    color: "#F57C00"
  },
];

const recentActivities = [
  { action: "Role Created", user: "Admin", detail: "Created 'Regional Manager' role", time: "2 hours ago", type: "create" },
  { action: "Permissions Modified", user: "Sarah Chen", detail: "Updated 'Sales Rep' permissions for Deals module", time: "4 hours ago", type: "update" },
  { action: "User Assigned", user: "Admin", detail: "Assigned 'Campaign Manager' role to 5 users", time: "6 hours ago", type: "assign" },
  { action: "Role Deleted", user: "Admin", detail: "Removed deprecated 'Trial User' role", time: "1 day ago", type: "delete" },
  { action: "Audit Review", user: "Compliance Team", detail: "Reviewed Q1 permission changes", time: "2 days ago", type: "audit" },
];

const criticalRoles = [
  { name: "Super Admin", users: 3, permissions: 180, risk: "Critical", modules: ["All"] },
  { name: "Finance Manager", users: 8, permissions: 45, risk: "High", modules: ["Billing", "Reports"] },
  { name: "AI Operations", users: 12, permissions: 38, risk: "High", modules: ["AI Calling", "Campaigns"] },
  { name: "Campaign Manager", users: 24, permissions: 32, risk: "Medium", modules: ["Campaigns", "Email", "SMS"] },
];

export function RolesPermissionsDashboard() {
  const navigate = useNavigate();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical": return "text-red-500 bg-red-500/10";
      case "High": return "text-orange-500 bg-orange-500/10";
      case "Medium": return "text-yellow-500 bg-yellow-500/10";
      default: return "text-green-500 bg-green-500/10";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create": return <CheckCircle2 size={16} className="text-green-500" />;
      case "update": return <Activity size={16} className="text-blue-500" />;
      case "assign": return <UserCog size={16} className="text-purple-500" />;
      case "delete": return <AlertTriangle size={16} className="text-red-500" />;
      case "audit": return <Eye size={16} className="text-gray-500" />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Roles & Permissions</h1>
              <p className="text-sm text-[#64748B]">
                Manage access control, security policies, and user permissions across the platform
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/roles-permissions/create")}
              className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Create Role
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
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

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="font-semibold text-[#0F1B2D] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#1565C0] hover:shadow-md transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon size={20} style={{ color: action.color }} strokeWidth={1.5} />
                </div>
                <div className="font-medium text-[#0F1B2D] mb-1">{action.label}</div>
                <div className="text-xs text-[#64748B]">{action.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Critical Roles */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0F1B2D]">High-Privilege Roles</h2>
                <button
                  onClick={() => navigate("/admin/roles-permissions/roles")}
                  className="text-sm text-[#1565C0] hover:underline"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {criticalRoles.map((role, index) => (
                <div key={index} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-[#0F1B2D]">{role.name}</div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(role.risk)}`}>
                      {role.risk}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#64748B] mb-2">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {role.users} users
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock size={14} />
                      {role.permissions} permissions
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.modules.map((module, mi) => (
                      <span key={mi} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-[#64748B]">
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0F1B2D]">Recent Activity</h2>
                <button
                  onClick={() => navigate("/admin/roles-permissions/audit")}
                  className="text-sm text-[#1565C0] hover:underline"
                >
                  Full Audit Log
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-[#0F1B2D] text-sm">{activity.action}</span>
                        <span className="text-xs text-[#64748B] shrink-0 flex items-center gap-1">
                          <Clock size={12} />
                          {activity.time}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] mb-1">{activity.detail}</div>
                      <div className="text-xs text-[#64748B]">by {activity.user}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
