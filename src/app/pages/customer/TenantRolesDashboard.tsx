import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Users, Lock, Activity, TrendingUp, UserCog, Grid3x3,
  FileText, Eye, CheckCircle2, AlertTriangle, Clock, Loader2
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { Role, AuditLog, PermissionSet } from "../../store/types";

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

const quickActions: QuickAction[] = [
  {
    label: "Manage Members",
    description: "Add and manage team members",
    icon: Users,
    path: "/tenant/team/users",
    color: "#00897B"
  },
  {
    label: "Create Team Role",
    description: "Define custom role for your team",
    icon: Shield,
    path: "/tenant/team/roles/create",
    color: "#1565C0"
  },
  {
    label: "Permission Matrix",
    description: "View all role permissions",
    icon: Grid3x3,
    path: "/tenant/team/matrix",
    color: "#5E35B1"
  },
  {
    label: "Activity Log",
    description: "Review permission changes",
    icon: FileText,
    path: "/tenant/team/audit",
    color: "#F57C00"
  },
];

export function TenantRolesDashboard() {
  const navigate = useNavigate();
  const { getRoles, getUsers, getAuditLogs } = useOmniStore();
  const [roles, setRoles] = useState<Role[]>([]);
  const [recentActivities, setRecentActivities] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, usersData, auditData] = await Promise.all([
        getRoles(),
        getUsers(),
        getAuditLogs()
      ]);
      setRoles(rolesData);
      const roleAuditLogs = auditData.filter(log =>
        log.entity === 'Role' || log.entity === 'User' || log.action === 'role_assignment'
      ).slice(0, 5);
      setRecentActivities(roleAuditLogs);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const countPermissions = (permissions: PermissionSet): number => {
    let count = 0;
    Object.values(permissions).forEach(module => {
      if (module && typeof module === 'object') {
        Object.values(module).forEach(actions => {
          if (Array.isArray(actions)) {
            count += actions.length;
          }
        });
      }
    });
    return count;
  };

  const totalPermissions = roles.reduce((sum, role) => sum + countPermissions(role.permissions), 0);
  const totalUsers = roles.reduce((sum, role) => sum + (role.userCount || 0), 0);
  const recentChangesCount = recentActivities.length;

  const metrics: MetricCard[] = [
    { label: "Team Roles", value: roles.length.toString(), change: `${roles.filter(r => !r.isSystem).length} custom`, trend: "up", icon: Shield, color: "#1565C0" },
    { label: "Team Members", value: totalUsers.toString(), change: "Active users", trend: "up", icon: Users, color: "#00897B" },
    { label: "Active Permissions", value: totalPermissions.toString(), change: "Across all roles", trend: "up", icon: Lock, color: "#5E35B1" },
    { label: "Recent Changes", value: recentChangesCount.toString(), change: "Last 7 days", trend: "up", icon: Activity, color: "#F57C00" },
  ];

  const teamRoles = roles.slice(0, 4).map(role => ({
    name: role.name,
    members: role.userCount || 0,
    permissions: countPermissions(role.permissions),
    scope: role.description || "Team role"
  }));

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "create": return <CheckCircle2 size={16} className="text-green-500" />;
      case "update": return <Activity size={16} className="text-blue-500" />;
      case "delete": return <AlertTriangle size={16} className="text-red-500" />;
      case "role_assignment": return <UserCog size={16} className="text-purple-500" />;
      default: return <Activity size={16} className="text-blue-500" />;
    }
  };

  const getTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="h-screen overflow-y-auto bg-white flex items-center justify-center">
        <Loader2 size={48} className="text-[#1565C0] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Team Roles & Permissions</h1>
              <p className="text-sm text-[#64748B]">
                Manage access control and permissions for your team members
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/tenant/team/users/create")}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <UserCog size={18} />
                Add Member
              </button>
              <button
                onClick={() => navigate("/tenant/team/roles/create")}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Create Role
              </button>
            </div>
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
          {/* Team Roles */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0F1B2D]">Team Roles</h2>
                <button
                  onClick={() => navigate("/tenant/team/roles")}
                  className="text-sm text-[#1565C0] hover:underline"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {teamRoles.map((role, index) => (
                <div key={index} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="font-medium text-[#0F1B2D] mb-2">{role.name}</div>
                  <div className="flex items-center gap-4 text-xs text-[#64748B] mb-2">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {role.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock size={14} />
                      {role.permissions} permissions
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B]">{role.scope}</div>
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
                  onClick={() => navigate("/tenant/team/audit")}
                  className="text-sm text-[#1565C0] hover:underline"
                >
                  Full Activity Log
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getActivityIcon(activity.action)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-[#0F1B2D] text-sm">
                          {activity.action === 'create' && 'Created'}
                          {activity.action === 'update' && 'Updated'}
                          {activity.action === 'delete' && 'Deleted'}
                          {activity.action === 'role_assignment' && 'Role Assignment'}
                          {' '}{activity.entity}
                        </span>
                        <span className="text-xs text-[#64748B] shrink-0 flex items-center gap-1">
                          <Clock size={12} />
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] mb-1">{activity.details}</div>
                      <div className="text-xs text-[#64748B]">by {activity.actor}</div>
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
