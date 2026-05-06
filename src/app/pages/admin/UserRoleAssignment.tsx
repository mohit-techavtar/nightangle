import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users, Search, Filter, Shield, Mail, Building2, CheckCircle2,
  ChevronDown, X, Plus, AlertCircle, UserPlus, Tag
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { User, Role } from "../../store/types";

export function UserRoleAssignment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [selectedRolesForAssignment, setSelectedRolesForAssignment] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUserRoleModal, setShowUserRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getUsers, getRoles, assignRolesToUser } = useOmniStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkAssign = async () => {
    if (selectedRolesForAssignment.length === 0) return;

    try {
      for (const userId of selectedUsers) {
        await assignRolesToUser(userId, selectedRolesForAssignment, "Bulk role assignment by admin");
      }

      setShowBulkAssignModal(false);
      setShowSuccessModal(true);
      await loadData();

      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedUsers([]);
        setSelectedRolesForAssignment([]);
      }, 2000);
    } catch (error) {
      console.error('Failed to assign roles:', error);
    }
  };

  const handleEditUserRoles = (user: User) => {
    setSelectedUser(user);
    setSelectedRolesForAssignment(user.roleIds || []);
    setShowUserRoleModal(true);
  };

  const handleSaveUserRoles = async () => {
    if (!selectedUser) return;

    try {
      await assignRolesToUser(selectedUser.id, selectedRolesForAssignment, `Roles updated for ${selectedUser.name}`);
      setShowUserRoleModal(false);
      setSelectedUser(null);
      setSelectedRolesForAssignment([]);
      await loadData();
    } catch (error) {
      console.error('Failed to update user roles:', error);
    }
  };

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRolesForAssignment(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const getRoleNames = (roleIds: string[]) => {
    return roleIds
      .map(roleId => roles.find(r => r.id === roleId)?.name)
      .filter(Boolean)
      .join(", ") || "No roles";
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === "all" || user.roleIds.includes(selectedRoleFilter);
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
          <p className="text-sm text-[#64748B]">Loading users...</p>
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
              <h1 className="font-semibold text-[#0F1B2D] mb-1">User Role Assignment</h1>
              <p className="text-sm text-[#64748B]">
                Assign and manage user roles across the platform (Multi-role support enabled)
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
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
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-2">Filter by Role</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedRoleFilter("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedRoleFilter === "all" ? "bg-[#1565C0] text-white" : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                    }`}
                  >
                    All Roles
                  </button>
                  {roles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleFilter(role.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedRoleFilter === role.id ? "bg-[#1565C0] text-white" : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                      }`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-2">Filter by Status</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All Status" },
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ].map(status => (
                    <button
                      key={status.value}
                      onClick={() => setSelectedStatus(status.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedStatus === status.value ? "bg-[#1565C0] text-white" : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-[#0F1B2D]">
              <strong>{selectedUsers.length}</strong> user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setShowBulkAssignModal(true)}
              className="h-9 px-4 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] flex items-center gap-2"
            >
              <UserPlus size={16} />
              Assign Roles
            </button>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Current Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Last Login
                </th>
                <th className="w-12 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1565C0]/10 flex items-center justify-center">
                        <Users size={20} className="text-[#1565C0]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#0F1B2D]">{user.name}</div>
                        <div className="text-xs text-[#64748B]">{user.department || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roleIds.length > 0 ? (
                        user.roleIds.slice(0, 2).map((roleId) => {
                          const role = roles.find(r => r.id === roleId);
                          return (
                            <span key={roleId} className="px-2 py-1 rounded bg-[#1565C0]/10 text-[#1565C0] text-xs font-medium">
                              {role?.name || roleId}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-[#64748B]">No roles assigned</span>
                      )}
                      {user.roleIds.length > 2 && (
                        <span className="px-2 py-1 rounded bg-gray-100 text-[#64748B] text-xs font-medium">
                          +{user.roleIds.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-[#64748B]"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#64748B]">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditUserRoles(user)}
                      className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B]"
                    >
                      <Shield size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-[#0F1B2D] mb-2">No users found</h3>
            <p className="text-sm text-[#64748B] mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRoleFilter("all");
                setSelectedStatus("all");
              }}
              className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Assignment Modal */}
      {showBulkAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-[#0F1B2D]">Assign Roles to Selected Users</h3>
              <p className="text-sm text-[#64748B] mt-1">
                Assigning roles to {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0F1B2D] mb-3">
                  Select Roles (Multiple allowed)
                </label>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {roles.filter(r => !r.isSystem || r.name !== 'Super Admin').map(role => (
                    <label
                      key={role.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRolesForAssignment.includes(role.id)}
                        onChange={() => toggleRoleSelection(role.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-[#0F1B2D]">{role.name}</div>
                        <div className="text-xs text-[#64748B]">{role.description}</div>
                      </div>
                      {role.isSystem && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                          System
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {selectedRolesForAssignment.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                  <AlertCircle size={16} />
                  <span>Please select at least one role</span>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowBulkAssignModal(false);
                  setSelectedRolesForAssignment([]);
                }}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssign}
                disabled={selectedRolesForAssignment.length === 0}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Roles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Roles Modal */}
      {showUserRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-[#0F1B2D]">Edit Roles for {selectedUser.name}</h3>
              <p className="text-sm text-[#64748B] mt-1">{selectedUser.email}</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0F1B2D] mb-3">
                  Assigned Roles (Multiple allowed)
                </label>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {roles.filter(r => !r.isSystem || r.name !== 'Super Admin').map(role => (
                    <label
                      key={role.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRolesForAssignment.includes(role.id)}
                        onChange={() => toggleRoleSelection(role.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-[#0F1B2D]">{role.name}</div>
                        <div className="text-xs text-[#64748B]">{role.description}</div>
                      </div>
                      {role.isSystem && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                          System
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowUserRoleModal(false);
                  setSelectedUser(null);
                  setSelectedRolesForAssignment([]);
                }}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserRoles}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-[#0F1B2D] mb-2">Roles Assigned Successfully!</h3>
            <p className="text-sm text-[#64748B]">
              User roles have been updated successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
