import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Search, Filter, MoreVertical, Edit2, Trash2, Copy,
  Users, Lock, Eye, Plus, ChevronDown, AlertTriangle, X, CheckCircle2, Loader2
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { Role, PermissionSet } from "../../store/types";
import { toast } from "sonner";

export function TenantRolesList() {
  const navigate = useNavigate();
  const { getRoles, deleteRole, cloneRole } = useOmniStore();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load roles:', error);
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

  const getModules = (permissions: PermissionSet): string[] => {
    return Object.keys(permissions).map(key => {
      const moduleNames: Record<string, string> = {
        crm: 'CRM',
        aiCalling: 'AI Calling',
        campaigns: 'Campaigns',
        analytics: 'Analytics',
        billing: 'Billing',
        admin: 'Admin'
      };
      return moduleNames[key] || key;
    });
  };

  const handleSelectRole = (id: string) => {
    setSelectedRoles(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === roles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles.map(r => r.id));
    }
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete.id, `Role "${roleToDelete.name}" deleted by tenant admin`);
      setShowDeleteModal(false);
      setRoleToDelete(null);
      await loadRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const handleCloneRole = async (roleId: string) => {
    try {
      await cloneRole(roleId);
      setOpenMenuId(null);
      await loadRoles();
    } catch (error) {
      console.error('Failed to clone role:', error);
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === "all" ||
      (selectedFilter === "system" && role.isSystem) ||
      (selectedFilter === "custom" && !role.isSystem);
    return matchesSearch && matchesFilter;
  });

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Team Roles</h1>
              <p className="text-sm text-[#64748B]">
                Manage roles and permissions for your team members
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/tenant/team/users")}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Manage Users
              </button>
              <button
                onClick={() => navigate("/tenant/team/matrix")}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Permission Matrix
              </button>
              <button
                onClick={() => navigate("/tenant/team/roles/create")}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
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
                placeholder="Search roles by name or description..."
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
              <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {[
                { value: "all", label: "All Roles" },
                { value: "system", label: "System Roles" },
                { value: "custom", label: "Custom Roles" },
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedFilter === filter.value
                      ? "bg-[#1565C0] text-white"
                      : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Bulk Actions */}
        {selectedRoles.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-[#0F1B2D]">
              <strong>{selectedRoles.length}</strong> role{selectedRoles.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-[#0F1B2D] hover:bg-gray-50">
                Bulk Edit
              </button>
              <button className="h-9 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600">
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Roles Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRoles.length === roles.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Modules
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="w-12 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRoles.map((role) => {
                const modules = getModules(role.permissions);
                const permissionCount = countPermissions(role.permissions);
                const updatedAt = role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : new Date(role.createdAt).toLocaleDateString();

                return (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={() => handleSelectRole(role.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          role.isSystem ? 'bg-purple-100' : 'bg-[#1565C0]/10'
                        }`}>
                          <Shield size={20} className={role.isSystem ? 'text-purple-600' : 'text-[#1565C0]'} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-[#0F1B2D]">{role.name}</div>
                            {role.isSystem && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                                System
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#64748B]">{role.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#0F1B2D]">
                        <Users size={16} className="text-[#64748B]" />
                        {role.userCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#0F1B2D]">
                        <Lock size={16} className="text-[#64748B]" />
                        {permissionCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {modules.slice(0, 2).map((module, index) => (
                          <span key={index} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-[#64748B]">
                            {module}
                          </span>
                        ))}
                        {modules.length > 2 && (
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-xs text-[#64748B]">
                            +{modules.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {updatedAt}
                    </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === role.id ? null : role.id)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B]"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === role.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              onClick={() => {
                                navigate(`/tenant/team/roles/edit?id=${role.id}`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit2 size={16} />
                              Edit Role
                            </button>
                            <button
                              onClick={() => {
                                console.log("View details:", role.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                            <button
                              onClick={() => handleCloneRole(role.id)}
                              className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Copy size={16} />
                              Duplicate
                            </button>
                            <div className="my-1 border-t border-gray-200" />
                            <button
                              onClick={() => handleDeleteClick(role)}
                              disabled={role.isSystem}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                                role.isSystem
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                setSelectedFilter("all");
              }}
              className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && roleToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-[#0F1B2D] mb-2">Delete Role</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Are you sure you want to delete <strong>{roleToDelete.name}</strong>?
                {roleToDelete.userCount && roleToDelete.userCount > 0 ? (
                  <> This will remove the role from <strong>{roleToDelete.userCount} user{roleToDelete.userCount > 1 ? 's' : ''}</strong>.</>
                ) : null}
                {' '}This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
