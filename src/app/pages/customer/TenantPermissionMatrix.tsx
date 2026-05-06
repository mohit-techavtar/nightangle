import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Check, X, Filter, Search, Download, Eye, EyeOff, ChevronDown, AlertTriangle
} from "lucide-react";

interface Permission {
  id: string;
  name: string;
  module: string;
  category: "read" | "write" | "delete" | "admin";
}

interface Role {
  id: string;
  name: string;
  type: "system" | "custom";
  permissions: string[];
}

const permissions: Permission[] = [
  // CRM
  { id: "crm_read", name: "View CRM Data", module: "CRM", category: "read" },
  { id: "crm_create", name: "Create Records", module: "CRM", category: "write" },
  { id: "crm_update", name: "Update Records", module: "CRM", category: "write" },
  { id: "crm_delete", name: "Delete Records", module: "CRM", category: "delete" },
  { id: "crm_export", name: "Export Data", module: "CRM", category: "write" },

  // AI Calling
  { id: "call_view", name: "View Campaigns", module: "AI Calling", category: "read" },
  { id: "call_create", name: "Create Campaigns", module: "AI Calling", category: "write" },
  { id: "call_monitor", name: "Live Monitoring", module: "AI Calling", category: "read" },
  { id: "call_config", name: "Configure Agents", module: "AI Calling", category: "write" },
  { id: "call_admin", name: "Admin Settings", module: "AI Calling", category: "admin" },

  // Campaigns
  { id: "camp_view", name: "View Campaigns", module: "Campaigns", category: "read" },
  { id: "camp_create", name: "Create Campaigns", module: "Campaigns", category: "write" },
  { id: "camp_edit", name: "Edit Campaigns", module: "Campaigns", category: "write" },
  { id: "camp_delete", name: "Delete Campaigns", module: "Campaigns", category: "delete" },
  { id: "camp_send", name: "Send Campaigns", module: "Campaigns", category: "write" },

  // Communication
  { id: "comm_whatsapp", name: "WhatsApp Access", module: "Communication", category: "read" },
  { id: "comm_sms", name: "SMS Access", module: "Communication", category: "read" },
  { id: "comm_email", name: "Email Access", module: "Communication", category: "read" },
  { id: "comm_send", name: "Send Messages", module: "Communication", category: "write" },

  // Analytics
  { id: "analytics_view", name: "View Reports", module: "Analytics", category: "read" },
  { id: "analytics_create", name: "Create Reports", module: "Analytics", category: "write" },
  { id: "analytics_export", name: "Export Reports", module: "Analytics", category: "write" },

  // Billing
  { id: "billing_view", name: "View Billing", module: "Billing", category: "read" },
  { id: "billing_manage", name: "Manage Billing", module: "Billing", category: "write" },
  { id: "billing_config", name: "Configure Rates", module: "Billing", category: "admin" },

  // Administration
  { id: "admin_users", name: "Manage Users", module: "Administration", category: "admin" },
  { id: "admin_roles", name: "Manage Roles", module: "Administration", category: "admin" },
  { id: "admin_tenants", name: "Manage Tenants", module: "Administration", category: "admin" },
  { id: "admin_settings", name: "System Settings", module: "Administration", category: "admin" },
];

const roles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    type: "system",
    permissions: permissions.map(p => p.id),
  },
  {
    id: "2",
    name: "Finance Manager",
    type: "custom",
    permissions: ["billing_view", "billing_manage", "billing_config", "analytics_view", "analytics_export"],
  },
  {
    id: "3",
    name: "AI Operations",
    type: "custom",
    permissions: ["call_view", "call_create", "call_monitor", "call_config", "camp_view", "analytics_view"],
  },
  {
    id: "4",
    name: "Campaign Manager",
    type: "custom",
    permissions: ["camp_view", "camp_create", "camp_edit", "camp_send", "comm_whatsapp", "comm_sms", "comm_email", "comm_send"],
  },
  {
    id: "5",
    name: "Sales Rep",
    type: "custom",
    permissions: ["crm_read", "crm_create", "crm_update", "crm_export"],
  },
  {
    id: "6",
    name: "Support Agent",
    type: "custom",
    permissions: ["crm_read", "comm_email", "comm_send"],
  },
  {
    id: "7",
    name: "Auditor",
    type: "custom",
    permissions: ["crm_read", "analytics_view", "billing_view"],
  },
];

export function TenantPermissionMatrix() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [hiddenRoles, setHiddenRoles] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const modules = Array.from(new Set(permissions.map(p => p.module)));

  const filteredPermissions = permissions.filter(permission => {
    const matchesModule = selectedModule === "all" || permission.module === selectedModule;
    const matchesCategory = selectedCategory === "all" || permission.category === selectedCategory;
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.module.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesCategory && matchesSearch;
  });

  const visibleRoles = roles.filter(role => !hiddenRoles.includes(role.id));

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const toggleRoleVisibility = (roleId: string) => {
    setHiddenRoles(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const hasPermission = (role: Role, permissionId: string) => {
    return role.permissions.includes(permissionId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "read": return "bg-blue-100 text-blue-700";
      case "write": return "bg-green-100 text-green-700";
      case "delete": return "bg-red-100 text-red-700";
      case "admin": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    console.log("Exporting as:", format);
    setShowExportMenu(false);
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Team Permission Matrix</h1>
              <p className="text-sm text-[#64748B]">
                Visual overview of all role permissions across modules
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  Export
                  <ChevronDown size={16} />
                </button>

                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => handleExport("csv")}
                        className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50"
                      >
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExport("excel")}
                        className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50"
                      >
                        Export as PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => navigate("/tenant/team/roles/create")}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Create Role
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-4 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters ? "border-[#1565C0] bg-[#1565C0]/5 text-[#1565C0]" : "border-gray-300 text-[#0F1B2D] hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-2">Module</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedModule("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedModule === "all"
                        ? "bg-[#1565C0] text-white"
                        : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                    }`}
                  >
                    All Modules
                  </button>
                  {modules.map(module => (
                    <button
                      key={module}
                      onClick={() => setSelectedModule(module)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedModule === module
                          ? "bg-[#1565C0] text-white"
                          : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                      }`}
                    >
                      {module}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-[#64748B] mb-2">Category</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All" },
                    { value: "read", label: "Read" },
                    { value: "write", label: "Write" },
                    { value: "delete", label: "Delete" },
                    { value: "admin", label: "Admin" },
                  ].map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedCategory(filter.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === filter.value
                          ? "bg-[#1565C0] text-white"
                          : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Role Visibility Controls */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-[#0F1B2D]">Visible Roles ({visibleRoles.length}/{roles.length})</h3>
            <button
              onClick={() => setHiddenRoles([])}
              className="text-xs text-[#1565C0] hover:underline"
            >
              Show All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => toggleRoleVisibility(role.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                  hiddenRoles.includes(role.id)
                    ? "bg-gray-200 text-gray-500"
                    : "bg-white border border-gray-300 text-[#0F1B2D] hover:border-[#1565C0]"
                }`}
              >
                {hiddenRoles.includes(role.id) ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}
                {role.name}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider w-80 sticky left-0 bg-gray-50 z-10">
                    Permission
                  </th>
                  {visibleRoles.map(role => (
                    <th
                      key={role.id}
                      className="px-4 py-4 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[120px]"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Shield size={16} className="text-[#1565C0]" />
                        <span>{role.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          role.type === "system" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {role.type}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedPermissions).map(([module, modulePermissions], moduleIndex) => (
                  <React.Fragment key={module}>
                    {/* Module Header */}
                    <tr className="bg-gray-100">
                      <td colSpan={visibleRoles.length + 1} className="px-6 py-3 sticky left-0 bg-gray-100 z-10">
                        <span className="font-semibold text-[#0F1B2D]">{module}</span>
                      </td>
                    </tr>
                    {/* Permissions */}
                    {modulePermissions.map((permission, permIndex) => (
                      <tr
                        key={permission.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 sticky left-0 bg-white hover:bg-gray-50 z-10">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#0F1B2D]">{permission.name}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(permission.category)}`}>
                              {permission.category}
                            </span>
                          </div>
                        </td>
                        {visibleRoles.map(role => {
                          const has = hasPermission(role, permission.id);
                          return (
                            <td
                              key={`${role.id}-${permission.id}`}
                              className="px-4 py-4 text-center"
                            >
                              <div className="flex items-center justify-center">
                                {has ? (
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check size={16} className="text-green-600" strokeWidth={2.5} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                    <X size={16} className="text-gray-400" strokeWidth={2} />
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={16} className="text-green-600" />
                </div>
                <span className="text-sm text-[#64748B]">Has Permission</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={16} className="text-gray-400" />
                </div>
                <span className="text-sm text-[#64748B]">No Permission</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#64748B]">Permission Categories:</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Read</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Write</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Delete</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">Admin</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredPermissions.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-[#0F1B2D] mb-2">No permissions found</h3>
            <p className="text-sm text-[#64748B] mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedModule("all");
                setSelectedCategory("all");
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
