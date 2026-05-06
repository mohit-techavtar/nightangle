import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Check, X, Filter, Search, Download, Eye, EyeOff, ChevronDown,
  AlertTriangle, Users, PhoneCall, Megaphone, BarChart3, DollarSign, Settings
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { Role, PermissionSet, PermissionAction } from "../../store/types";

interface PermissionItem {
  module: string;
  submodule: string;
  action: PermissionAction;
  moduleIcon: React.ElementType;
}

const moduleIcons: Record<string, React.ElementType> = {
  crm: Users,
  aiCalling: PhoneCall,
  campaigns: Megaphone,
  analytics: BarChart3,
  billing: DollarSign,
  admin: Settings,
};

export function PermissionMatrix() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [showSystemRoles, setShowSystemRoles] = useState(true);
  const [showCustomRoles, setShowCustomRoles] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { getRoles } = useOmniStore();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
      // Expand all modules by default
      setExpandedModules(new Set(["crm", "aiCalling", "campaigns", "analytics", "billing", "admin"]));
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Build complete permission list from all roles
  const getAllPermissions = (): PermissionItem[] => {
    const permissionsSet = new Set<string>();
    const items: PermissionItem[] = [];

    roles.forEach(role => {
      Object.entries(role.permissions).forEach(([moduleId, modulePerms]) => {
        if (!modulePerms) return;
        Object.entries(modulePerms).forEach(([submoduleId, actions]) => {
          if (!actions || actions.length === 0) return;
          (actions as PermissionAction[]).forEach(action => {
            const key = `${moduleId}.${submoduleId}.${action}`;
            if (!permissionsSet.has(key)) {
              permissionsSet.add(key);
              items.push({
                module: moduleId,
                submodule: submoduleId,
                action: action,
                moduleIcon: moduleIcons[moduleId] || Shield,
              });
            }
          });
        });
      });
    });

    // Sort by module, then submodule, then action
    return items.sort((a, b) => {
      if (a.module !== b.module) return a.module.localeCompare(b.module);
      if (a.submodule !== b.submodule) return a.submodule.localeCompare(b.submodule);
      return a.action.localeCompare(b.action);
    });
  };

  const hasPermission = (role: Role, module: string, submodule: string, action: PermissionAction): boolean => {
    const modulePerms = role.permissions[module as keyof PermissionSet] as any;
    if (!modulePerms) return false;
    const actions = modulePerms[submodule] as PermissionAction[];
    return actions ? actions.includes(action) : false;
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = (showSystemRoles && role.isSystem) || (showCustomRoles && !role.isSystem);
    return matchesSearch && matchesType;
  });

  const allPermissions = getAllPermissions();

  const filteredPermissions = allPermissions.filter(perm => {
    const matchesModule = selectedModule === "all" || perm.module === selectedModule;
    return matchesModule;
  });

  // Group permissions by module
  const permissionsByModule = filteredPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, PermissionItem[]>);

  const exportMatrix = () => {
    // Build CSV content
    const headers = ["Module", "Submodule", "Action", ...filteredRoles.map(r => r.name)];
    const rows = filteredPermissions.map(perm => {
      const row = [
        perm.module,
        perm.submodule,
        perm.action,
        ...filteredRoles.map(role => hasPermission(role, perm.module, perm.submodule, perm.action) ? "✓" : "✗")
      ];
      return row.join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `permission-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
          <p className="text-sm text-[#64748B]">Loading permission matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Permission Matrix</h1>
              <p className="text-sm text-[#64748B]">
                Comprehensive view of all role permissions across modules
              </p>
            </div>
            <button
              onClick={exportMatrix}
              className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
              />
            </div>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="h-10 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
            >
              <option value="all">All Modules</option>
              <option value="crm">CRM</option>
              <option value="aiCalling">AI Calling</option>
              <option value="campaigns">Campaigns</option>
              <option value="analytics">Analytics</option>
              <option value="billing">Billing</option>
              <option value="admin">Administration</option>
            </select>

            <div className="flex items-center gap-2 px-4 h-10 border border-gray-200 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSystemRoles}
                  onChange={(e) => setShowSystemRoles(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                />
                <span className="text-sm text-[#64748B]">System</span>
              </label>
              <div className="w-px h-4 bg-gray-300" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCustomRoles}
                  onChange={(e) => setShowCustomRoles(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                />
                <span className="text-sm text-[#64748B]">Custom</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">{filteredRoles.length}</div>
            <div className="text-sm text-[#64748B]">Total Roles</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">{allPermissions.length}</div>
            <div className="text-sm text-[#64748B]">Total Permissions</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">{Object.keys(permissionsByModule).length}</div>
            <div className="text-sm text-[#64748B]">Modules</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">
              {filteredRoles.filter(r => r.isSystem).length}
            </div>
            <div className="text-sm text-[#64748B]">System Roles</div>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="sticky left-0 bg-gray-50 z-10 px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider border-r border-gray-200">
                    Permission
                  </th>
                  {filteredRoles.map(role => (
                    <th key={role.id} className="px-4 py-3 text-center min-w-[120px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className="font-semibold text-xs text-[#0F1B2D]">{role.name}</div>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          role.isSystem ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {role.isSystem ? "System" : "Custom"}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(permissionsByModule).map(([moduleId, perms]) => {
                  const isExpanded = expandedModules.has(moduleId);
                  const ModuleIcon = moduleIcons[moduleId] || Shield;

                  // Group by submodule within this module
                  const submoduleGroups = perms.reduce((acc, perm) => {
                    if (!acc[perm.submodule]) acc[perm.submodule] = [];
                    acc[perm.submodule].push(perm);
                    return acc;
                  }, {} as Record<string, PermissionItem[]>);

                  return (
                    <React.Fragment key={moduleId}>
                      {/* Module Header Row */}
                      <tr className="bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => toggleModule(moduleId)}>
                        <td className="sticky left-0 bg-gray-50 z-10 px-6 py-4 border-r border-gray-200">
                          <div className="flex items-center gap-3">
                            <ChevronDown
                              size={18}
                              className={`text-[#64748B] transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                            />
                            <div className="w-8 h-8 rounded-lg bg-[#1565C0]/10 flex items-center justify-center">
                              <ModuleIcon size={18} className="text-[#1565C0]" />
                            </div>
                            <div className="font-medium text-sm text-[#0F1B2D]">
                              {moduleId.charAt(0).toUpperCase() + moduleId.slice(1).replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="text-xs text-[#64748B]">({perms.length} permissions)</div>
                          </div>
                        </td>
                        <td colSpan={filteredRoles.length} className="px-4 py-4 text-center text-xs text-[#64748B]">
                          {isExpanded ? "Click to collapse" : "Click to expand"}
                        </td>
                      </tr>

                      {/* Submodule & Permission Rows */}
                      {isExpanded && Object.entries(submoduleGroups).map(([submoduleId, subPerms]) => (
                        <React.Fragment key={`${moduleId}.${submoduleId}`}>
                          {subPerms.map((perm, idx) => (
                            <tr key={`${perm.module}.${perm.submodule}.${perm.action}`} className="hover:bg-gray-50">
                              <td className="sticky left-0 bg-white z-10 px-6 py-3 border-r border-gray-200">
                                <div className="pl-11">
                                  <div className="text-sm text-[#0F1B2D]">
                                    {idx === 0 && (
                                      <span className="font-medium text-[#64748B] mr-2">
                                        {submoduleId.charAt(0).toUpperCase() + submoduleId.slice(1)} →
                                      </span>
                                    )}
                                    {idx !== 0 && <span className="invisible mr-2">→</span>}
                                    <span className="capitalize">{perm.action}</span>
                                  </div>
                                </div>
                              </td>
                              {filteredRoles.map(role => {
                                const hasAccess = hasPermission(role, perm.module, perm.submodule, perm.action);
                                return (
                                  <td key={role.id} className="px-4 py-3 text-center">
                                    {hasAccess ? (
                                      <div className="inline-flex w-6 h-6 rounded-full bg-green-100 items-center justify-center">
                                        <Check size={14} className="text-green-600" strokeWidth={3} />
                                      </div>
                                    ) : (
                                      <div className="inline-flex w-6 h-6 rounded-full bg-gray-100 items-center justify-center">
                                        <X size={14} className="text-gray-400" strokeWidth={2} />
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={14} className="text-green-600" strokeWidth={3} />
            </div>
            <span className="text-[#64748B]">Permission Granted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={14} className="text-gray-400" strokeWidth={2} />
            </div>
            <span className="text-[#64748B]">Permission Denied</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-[#0F1B2D] mb-2">No roles found</h3>
            <p className="text-sm text-[#64748B] mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setShowSystemRoles(true);
                setShowCustomRoles(true);
              }}
              className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
