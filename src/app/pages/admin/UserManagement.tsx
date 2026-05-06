import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users, Search, Filter, Plus, MoreVertical, Edit2, Trash2, Shield,
  Mail, Phone, AlertTriangle, CheckCircle2, X, Clock, Monitor, Power,
  ChevronDown, UserX, UserCheck
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { User, UserSession, Role } from "../../store/types";

export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { getUsers, getRoles, getSessions, deactivateUser, terminateSession, terminateAllUserSessions } = useOmniStore();

  const MAX_NAMED_USERS = 15;
  const MAX_CONCURRENT_SESSIONS = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, rolesData, sessionsData] = await Promise.all([
        getUsers(),
        getRoles(),
        getSessions()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserSessions = (userId: string): UserSession[] => {
    return sessions.filter(s => s.userId === userId);
  };

  const handleViewSessions = (user: User) => {
    setSelectedUser(user);
    setShowSessionModal(true);
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId, "Session terminated by admin");
      await loadData();
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const handleTerminateAllSessions = async (userId: string) => {
    try {
      await terminateAllUserSessions(userId, "All sessions terminated by admin");
      await loadData();
      setShowSessionModal(false);
    } catch (error) {
      console.error('Failed to terminate sessions:', error);
    }
  };

  const handleDeactivateUser = async () => {
    if (!userToDelete) return;
    try {
      await deactivateUser(userToDelete.id, `User deactivated by admin`);
      await loadData();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
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
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeUsers = users.filter(u => u.status === "Active").length;
  const usagePercentage = (activeUsers / MAX_NAMED_USERS) * 100;

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
              <h1 className="font-semibold text-[#0F1B2D] mb-1">User Management</h1>
              <p className="text-sm text-[#64748B]">
                Manage users, sessions, and access control (Max {MAX_NAMED_USERS} named users)
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users/create")}
              disabled={activeUsers >= MAX_NAMED_USERS}
              className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={18} />
              Create User
            </button>
          </div>

          {/* User Limit Warning */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#64748B]">
                Active Users: {activeUsers} / {MAX_NAMED_USERS}
              </span>
              <span className="text-xs text-[#64748B]">{usagePercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  usagePercentage >= 100 ? "bg-red-500" :
                  usagePercentage >= 80 ? "bg-orange-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            {activeUsers >= MAX_NAMED_USERS && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                <AlertTriangle size={14} />
                <span>User limit reached. Deactivate users or upgrade plan to add more.</span>
              </div>
            )}
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
            <div className="mt-3">
              <div className="text-xs font-medium text-[#64748B] mb-2">Filter by Status</div>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { value: "all", label: "All Status" },
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                  { value: "Pending", label: "Pending" },
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => setStatusFilter(status.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      statusFilter === status.value ? "bg-[#1565C0] text-white" : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">{users.length}</div>
            <div className="text-sm text-[#64748B]">Total Users</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-green-600">{activeUsers}</div>
            <div className="text-sm text-[#64748B]">Active Users</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">{sessions.length}</div>
            <div className="text-sm text-[#64748B]">Active Sessions</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">
              {MAX_NAMED_USERS - activeUsers}
            </div>
            <div className="text-sm text-[#64748B]">Available Slots</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Last Login
                </th>
                <th className="w-12 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const userSessions = getUserSessions(user.id);
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1565C0]/10 flex items-center justify-center">
                          <Users size={20} className="text-[#1565C0]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#0F1B2D]">{user.name}</div>
                          <div className="text-xs text-[#64748B]">{user.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <Mail size={12} />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <Phone size={12} />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roleIds.slice(0, 2).map(roleId => {
                          const role = roles.find(r => r.id === roleId);
                          return (
                            <span key={roleId} className="px-2 py-0.5 rounded bg-[#1565C0]/10 text-[#1565C0] text-xs">
                              {role?.name || roleId}
                            </span>
                          );
                        })}
                        {user.roleIds.length > 2 && (
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-[#64748B] text-xs">
                            +{user.roleIds.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-[#64748B]"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewSessions(user)}
                        className="flex items-center gap-2 text-sm text-[#1565C0] hover:underline"
                      >
                        <Monitor size={16} />
                        <span>{userSessions.length} active</span>
                        {userSessions.length >= MAX_CONCURRENT_SESSIONS && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium">
                            MAX
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B]"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenuId === user.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  navigate(`/admin/roles-permissions/assignments`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Shield size={16} />
                                Manage Roles
                              </button>
                              <button
                                onClick={() => {
                                  handleViewSessions(user);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Monitor size={16} />
                                View Sessions
                              </button>
                              <div className="my-1 border-t border-gray-200" />
                              <button
                                onClick={() => {
                                  setUserToDelete(user);
                                  setShowDeleteModal(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <UserX size={16} />
                                Deactivate
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-[#0F1B2D] mb-2">No users found</h3>
            <p className="text-sm text-[#64748B]">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Session Management Modal */}
      {showSessionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#0F1B2D]">Active Sessions for {selectedUser.name}</h3>
                  <p className="text-sm text-[#64748B] mt-1">
                    {getUserSessions(selectedUser.id).length} / {MAX_CONCURRENT_SESSIONS} concurrent sessions
                  </p>
                </div>
                <button
                  onClick={() => handleTerminateAllSessions(selectedUser.id)}
                  className="h-9 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Power size={16} />
                  Terminate All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {getUserSessions(selectedUser.id).map(session => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Monitor size={20} className="text-[#64748B]" />
                          <div className="font-medium text-sm text-[#0F1B2D]">{session.deviceInfo}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-[#64748B]">
                          <div>
                            <span className="font-medium">IP Address:</span> {session.ipAddress}
                          </div>
                          <div>
                            <span className="font-medium">Login Time:</span>{" "}
                            {new Date(session.loginTime).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Last Activity:</span>{" "}
                            {new Date(session.lastActivityTime).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Expires:</span>{" "}
                            {new Date(session.expiresAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="ml-4 h-8 px-3 rounded-lg border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                      >
                        Terminate
                      </button>
                    </div>
                  </div>
                ))}
                {getUserSessions(selectedUser.id).length === 0 && (
                  <div className="text-center py-8 text-sm text-[#64748B]">
                    No active sessions for this user
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end">
              <button
                onClick={() => {
                  setShowSessionModal(false);
                  setSelectedUser(null);
                }}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-[#0F1B2D] mb-2">Deactivate User</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Are you sure you want to deactivate <strong>{userToDelete.name}</strong>? This will:
              </p>
              <ul className="text-sm text-[#64748B] mb-6 space-y-1 list-disc list-inside">
                <li>Terminate all active sessions</li>
                <li>Prevent login access</li>
                <li>Preserve audit trail (soft delete)</li>
              </ul>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateUser}
                  className="flex-1 h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Deactivate User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
