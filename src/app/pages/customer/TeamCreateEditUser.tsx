import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  User, Mail, Shield, ChevronLeft, AlertCircle, Check, X, Loader2
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { Role, UserId } from "../../store/types";

export function TeamCreateEditUser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const isEdit = !!userId;

  const { getUser, getUsers, createUser, updateUser, getRoles } = useOmniStore();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleIds: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRoles();
    if (isEdit && userId) {
      loadUser();
    }
  }, [userId]);

  const loadRoles = async () => {
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const loadUser = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const user = await getUser(userId as UserId);
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          roleIds: user.roleIds || [],
        });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.roleIds.length === 0) {
      newErrors.roles = "Please assign at least one role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEdit && userId) {
        await updateUser(userId as UserId, {
          name: formData.name,
          email: formData.email,
          roleIds: formData.roleIds,
        });
      } else {
        // Check user limit before creating
        const users = await getUsers();
        const activeUsers = users.filter(u => u.status === "active");
        if (activeUsers.length >= 15) {
          setErrors({ submit: "User limit reached (15 active users maximum)" });
          return;
        }

        await createUser({
          name: formData.name,
          email: formData.email,
          roleIds: formData.roleIds,
          tenantId: "TENANT-001" as any, // Would come from auth context
        });
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save user:', error);
      setErrors({ submit: "Failed to save user. Please try again." });
    }
  };

  const handleBack = () => {
    navigate("/tenant/team/users");
  };

  const toggleRole = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
    setErrors(prev => ({ ...prev, roles: "" }));
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
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F1B2D] mb-4"
          >
            <ChevronLeft size={18} />
            Back to Team Members
          </button>
          <div>
            <h1 className="font-semibold text-[#0F1B2D] mb-1">
              {isEdit ? "Edit Team Member" : "Add Team Member"}
            </h1>
            <p className="text-sm text-[#64748B]">
              {isEdit ? "Update member details and role assignments" : "Invite a new member to your team"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* User Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-[#0F1B2D] mb-4 flex items-center gap-2">
              <User size={20} />
              User Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className={`w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  disabled={isEdit}
                  className={`w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent ${
                    isEdit ? 'bg-gray-50 cursor-not-allowed' : ''
                  } ${errors.email ? "border-red-300" : "border-gray-300"}`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
                {isEdit && (
                  <p className="mt-1.5 text-xs text-[#64748B]">
                    Email cannot be changed after user creation
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-[#0F1B2D] mb-2 flex items-center gap-2">
              <Shield size={20} />
              Role Assignment
            </h2>
            <p className="text-sm text-[#64748B] mb-4">
              Select one or more roles for this user. Multiple roles combine permissions.
            </p>

            {errors.roles && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">{errors.roles}</p>
              </div>
            )}

            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.roleIds.includes(role.id)
                      ? "border-[#1565C0] bg-[#1565C0]/5"
                      : "border-gray-200 hover:border-gray-300"
                  } ${role.isSystem ? 'opacity-75' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.roleIds.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-[#0F1B2D]">{role.name}</span>
                      {role.isSystem && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          System
                        </span>
                      )}
                      {role.riskLevel && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          role.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                          role.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                          role.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {role.riskLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B]">{role.description || 'No description'}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">{errors.submit}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              {isEdit ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-[#0F1B2D] mb-2">
                {isEdit ? "Member Updated" : "Member Added"}
              </h3>
              <p className="text-sm text-[#64748B] mb-6">
                {isEdit
                  ? `${formData.name} has been updated successfully.`
                  : `${formData.name} has been added to your team and will receive an invitation email.`
                }
              </p>
              <button
                onClick={() => navigate("/tenant/team/users")}
                className="w-full h-10 px-4 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Back to Team Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
