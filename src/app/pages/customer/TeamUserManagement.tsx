import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users, Search, Filter, MoreVertical, Edit2, Trash2, UserX,
  Plus, ChevronDown, AlertTriangle, X, CheckCircle2, Loader2,
  Mail, Shield, Activity, Clock, UserCheck, MonitorSmartphone
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { User, Role, UserSession } from "../../store/types";

export function TeamUserManagement() {
  const navigate = useNavigate();
  const { getUsers, getRoles, deactivateUser, getSessions, terminateSession, terminateAllUserSessions } = useOmniStore();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [selectedUserForSessions, setSelectedUserForSessions] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const getUserRoles = (user: User): Role[] => {
    if (!user.roleIds || user.roleIds.length === 0) return [];
    return roles.filter(r => user.roleIds.includes(r.id));
  };

  const getUserSessions = (userId: string): UserSession[] => {
    return sessions.filter(s => s.userId === userId && s.status === 'active');
  };

  const getTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
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

  const handleDeactivateClick = (user: User) => {
    setUserToDeactivate(user);
    setShowDeactivateModal(true);
    setOpenMenuId(null);
  };

  const handleDeactivateConfirm = async () => {
    if (!userToDeactivate) return;
    try {
      await deactivateUser(userToDeactivate.id, `User deactivated by tenant admin`);
      setShowDeactivateModal(false);
      setUserToDeactivate(null);
      await loadData();
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const handleViewSessions = (user: User) => {
    setSelectedUserForSessions(user);
    setShowSessionsModal(true);
    setOpenMenuId(null);
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId, "Session terminated by tenant admin");
      await loadData();
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const handleTerminateAllSessions = async (userId: string) => {
    try {
      await terminateAllUserSessions(userId, "All sessions terminated by tenant admin");
      await loadData();
      setShowSessionsModal(false);
    } catch (error) {
      console.error('Failed to terminate all sessions:', error);
    }
  };

  const activeUsers = users.filter(u => u.status === "active");
  const maxUsers = 15; // Tenant limit
  const userLimitPercentage = (activeUsers.length / maxUsers) * 100;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" ||
      (selectedFilter === "active" && user.status === "active") ||
      (selectedFilter === "inactive" && user.status !== "active");
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
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Team Members</h1>
              <p className="text-sm text-[#64748B]">
                Manage team members, roles, and access permissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/tenant/team/assignments")}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Assign Roles
              </button>
              <button
                onClick={() => navigate("/tenant/team/users/create")}
                disabled={activeUsers.length >= maxUsers}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                Add Member
              </button>
            </div>
          </div>

          {/* User Limit Warning */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#64748B]">
                Team Members: {activeUsers.length} of {maxUsers}
              </span>
              <span className={`text-xs font-medium ${
                userLimitPercentage >= 90 ? 'text-red-600' : 'text-[#64748B]'
              }`}>
                {userLimitPercentage.toFixed(0)}% used
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  userLimitPercentage >= 90 ? 'bg-red-500' :
                  userLimitPercentage >= 75 ? 'bg-orange-500' : 'bg-[#1565C0]'
                }`}
                style={{ width: `${Math.min(userLimitPercentage, 100)}%` }}
              />
            </div>
            {activeUsers.length >= maxUsers && (
              <p className="text-xs text-red-600 mt-1">
                User limit reached. Deactivate users or upgrade your plan to add more members.
              </p>
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
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {[
                { value: "all", label: "All Users" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
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
        {selectedUsers.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-[#0F1B2D]">
              <strong>{selectedUsers.length}</strong> user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-[#0F1B2D] hover:bg-gray-50">
                Bulk Edit
              </button>
              <button className="h-9 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600">
                Deactivate Selected
              </button>
            </div>
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
                const userRoles = getUserRoles(user);
                const userSessions = getUserSessions(user.id);

                return (
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
                          <span className="font-medium text-[#1565C0]">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-[#0F1B2D]">{user.name}</div>
                          <div className="text-xs text-[#64748B] flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {userRoles.length > 0 ? (
                          <>
                            {userRoles.slice(0, 2).map(role => (
                              <span key={role.id} className="px-2 py-0.5 rounded bg-[#1565C0]/10 text-xs text-[#1565C0]">
                                {role.name}
                              </span>
                            ))}
                            {userRoles.length > 2 && (
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-xs text-[#64748B]">
                                +{userRoles.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-[#64748B]">No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewSessions(user)}
                        className="flex items-center gap-1.5 text-sm text-[#0F1B2D] hover:text-[#1565C0]"
                      >
                        <MonitorSmartphone size={16} />
                        <span>{userSessions.length} active</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {user.lastLogin ? getTimeAgo(user.lastLogin) : 'Never'}
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
                                  navigate(`/tenant/team/users/edit?id=${user.id}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit2 size={16} />
                                Edit User
                              </button>
                              <button
                                onClick={() => handleViewSessions(user)}
                                className="w-full px-4 py-2 text-left text-sm text-[#0F1B2D] hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Activity size={16} />
                                View Sessions
                              </button>
                              <div className="my-1 border-t border-gray-200" />
                              <button
                                onClick={() => handleDeactivateClick(user)}
                                disabled={user.status !== "active"}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                                  user.status === "active"
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
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

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && userToDeactivate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-[#0F1B2D] mb-2">Deactivate User</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Are you sure you want to deactivate <strong>{userToDeactivate.name}</strong>? They will lose access to the platform and all active sessions will be terminated.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateConfirm}
                  className="flex-1 h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessionsModal && selectedUserForSessions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#0F1B2D] mb-1">Active Sessions</h3>
                  <p className="text-sm text-[#64748B]">
                    {selectedUserForSessions.name} - {getUserSessions(selectedUserForSessions.id).length} active sessions
                  </p>
                </div>
                <button
                  onClick={() => setShowSessionsModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {getUserSessions(selectedUserForSessions.id).map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MonitorSmartphone size={18} className="text-[#1565C0]" />
                        <div>
                          <div className="font-medium text-sm text-[#0F1B2D]">{session.device}</div>
                          <div className="text-xs text-[#64748B]">{session.browser}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Terminate
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-[#64748B] mb-0.5">IP Address</div>
                        <div className="text-[#0F1B2D]">{session.ipAddress}</div>
                      </div>
                      <div>
                        <div className="text-[#64748B] mb-0.5">Location</div>
                        <div className="text-[#0F1B2D]">{session.location}</div>
                      </div>
                      <div>
                        <div className="text-[#64748B] mb-0.5">Started</div>
                        <div className="text-[#0F1B2D]">{getTimeAgo(session.startedAt)}</div>
                      </div>
                      <div>
                        <div className="text-[#64748B] mb-0.5">Last Activity</div>
                        <div className="text-[#0F1B2D]">{getTimeAgo(session.lastActivity)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => handleTerminateAllSessions(selectedUserForSessions.id)}
                className="w-full h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Terminate All Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
