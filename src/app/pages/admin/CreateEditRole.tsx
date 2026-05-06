import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Shield, Check, ChevronLeft, AlertCircle, Lock, Users, Settings,
  PhoneCall, MessageCircle, Mail, Megaphone, BarChart3, DollarSign, FileText,
  Briefcase, CheckSquare, Square, MinusSquare
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { PermissionSet, PermissionAction } from "../../store/types";

interface PermissionModule {
  id: keyof PermissionSet;
  name: string;
  icon: React.ElementType;
  submodules: {
    id: string;
    name: string;
    actions: PermissionAction[];
  }[];
}

const permissionModules: PermissionModule[] = [
  {
    id: "crm",
    name: "CRM",
    icon: Users,
    submodules: [
      { id: "leads", name: "Leads", actions: ["view", "create", "edit", "delete", "export"] },
      { id: "contacts", name: "Contacts", actions: ["view", "create", "edit", "delete", "export"] },
      { id: "companies", name: "Companies", actions: ["view", "create", "edit", "delete", "export"] },
      { id: "deals", name: "Deals", actions: ["view", "create", "edit", "delete", "approve", "export"] },
    ]
  },
  {
    id: "aiCalling",
    name: "AI Calling",
    icon: PhoneCall,
    submodules: [
      { id: "campaigns", name: "Campaigns", actions: ["view", "create", "edit", "delete", "execute"] },
      { id: "agents", name: "AI Agents", actions: ["view", "create", "edit", "delete", "configure"] },
      { id: "calls", name: "Call Logs", actions: ["view", "delete", "export"] },
      { id: "analytics", name: "Analytics", actions: ["view", "export"] },
    ]
  },
  {
    id: "campaigns",
    name: "Campaigns",
    icon: Megaphone,
    submodules: [
      { id: "email", name: "Email", actions: ["view", "create", "edit", "delete", "execute"] },
      { id: "sms", name: "SMS", actions: ["view", "create", "edit", "delete", "execute"] },
      { id: "whatsapp", name: "WhatsApp", actions: ["view", "create", "edit", "delete", "execute"] },
      { id: "management", name: "Campaign Management", actions: ["view", "create", "edit", "delete", "execute", "approve"] },
    ]
  },
  {
    id: "analytics",
    name: "Reports & Analytics",
    icon: BarChart3,
    submodules: [
      { id: "dashboards", name: "Dashboards", actions: ["view", "create", "edit", "delete", "export"] },
      { id: "reports", name: "Reports", actions: ["view", "create", "edit", "delete", "export"] },
      { id: "customReports", name: "Custom Reports", actions: ["view", "create", "edit", "delete", "export"] },
    ]
  },
  {
    id: "billing",
    name: "Billing",
    icon: DollarSign,
    submodules: [
      { id: "invoices", name: "Invoices", actions: ["view", "create", "edit", "delete", "export"] },
      { id: "usage", name: "Usage", actions: ["view", "export"] },
      { id: "credits", name: "Credits", actions: ["view", "create", "edit"] },
    ]
  },
  {
    id: "admin",
    name: "Administration",
    icon: Settings,
    submodules: [
      { id: "users", name: "User Management", actions: ["view", "create", "edit", "delete"] },
      { id: "roles", name: "Role Management", actions: ["view", "create", "edit", "delete"] },
      { id: "settings", name: "System Settings", actions: ["view", "edit", "configure"] },
      { id: "audit", name: "Audit Logs", actions: ["view", "export"] },
    ]
  },
];

const steps = [
  { id: 1, name: "Basic Information", icon: FileText },
  { id: 2, name: "Module Permissions", icon: Lock },
  { id: 3, name: "Review & Create", icon: Check },
];

const actionLabels: Record<PermissionAction, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  execute: "Execute",
  approve: "Approve",
  export: "Export",
  configure: "Configure",
  communicate: "Communicate",
  attach: "Attach",
  print: "Print",
};

export function CreateEditRole() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.has("id");
  const roleId = searchParams.get("id");
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getRole, createRole, updateRole } = useOmniStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {} as PermissionSet,
    riskLevel: "low" as "critical" | "high" | "medium" | "low",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load role if editing
  useEffect(() => {
    if (isEdit && roleId) {
      loadRole();
    }
  }, [isEdit, roleId]);

  const loadRole = async () => {
    if (!roleId) return;
    setIsLoading(true);
    try {
      const role = await getRole(roleId);
      if (role) {
        setFormData({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          riskLevel: role.riskLevel,
        });
      }
    } catch (error) {
      console.error('Failed to load role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const newErrors: Record<string, string> = {};
      if (!formData.name.trim()) newErrors.name = "Role name is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
    }

    if (currentStep === 2) {
      const hasPermissions = Object.values(formData.permissions).some(module =>
        Object.values(module || {}).some(actions => actions && actions.length > 0)
      );
      if (!hasPermissions) {
        setErrors({ permissions: "Please select at least one permission" });
        return;
      }
      setErrors({});
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (isEdit && roleId) {
        await updateRole(roleId, formData, `Role "${formData.name}" updated by admin`);
      } else {
        await createRole(formData);
      }
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/admin/roles-permissions/roles");
      }, 1500);
    } catch (error) {
      console.error('Failed to save role:', error);
      setErrors({ submit: "Failed to save role. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (moduleId: keyof PermissionSet, submoduleId: string, action: PermissionAction) => {
    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      if (!newPermissions[moduleId]) {
        newPermissions[moduleId] = {};
      }
      const module = newPermissions[moduleId] as any;
      if (!module[submoduleId]) {
        module[submoduleId] = [];
      }
      const actions = module[submoduleId] as PermissionAction[];
      const index = actions.indexOf(action);
      if (index > -1) {
        module[submoduleId] = actions.filter(a => a !== action);
      } else {
        module[submoduleId] = [...actions, action];
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const toggleSubmodule = (moduleId: keyof PermissionSet, submoduleId: string, allActions: PermissionAction[]) => {
    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      if (!newPermissions[moduleId]) {
        newPermissions[moduleId] = {};
      }
      const module = newPermissions[moduleId] as any;
      const currentActions = (module[submoduleId] as PermissionAction[]) || [];

      // If all actions are selected, deselect all; otherwise select all
      if (currentActions.length === allActions.length) {
        module[submoduleId] = [];
      } else {
        module[submoduleId] = [...allActions];
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const toggleModule = (moduleId: keyof PermissionSet, submodules: typeof permissionModules[0]['submodules']) => {
    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      if (!newPermissions[moduleId]) {
        newPermissions[moduleId] = {};
      }
      const module = newPermissions[moduleId] as any;

      // Check if all submodules are fully selected
      const allSelected = submodules.every(sub => {
        const actions = (module[sub.id] as PermissionAction[]) || [];
        return actions.length === sub.actions.length;
      });

      // Toggle all
      if (allSelected) {
        submodules.forEach(sub => {
          module[sub.id] = [];
        });
      } else {
        submodules.forEach(sub => {
          module[sub.id] = [...sub.actions];
        });
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const getSubmoduleState = (moduleId: keyof PermissionSet, submoduleId: string, allActions: PermissionAction[]) => {
    const module = formData.permissions[moduleId] as any;
    const actions = (module?.[submoduleId] as PermissionAction[]) || [];
    if (actions.length === 0) return "none";
    if (actions.length === allActions.length) return "all";
    return "some";
  };

  const getModuleState = (moduleId: keyof PermissionSet, submodules: typeof permissionModules[0]['submodules']) => {
    const module = formData.permissions[moduleId] as any;
    if (!module) return "none";

    let totalActions = 0;
    let selectedActions = 0;

    submodules.forEach(sub => {
      totalActions += sub.actions.length;
      const actions = (module[sub.id] as PermissionAction[]) || [];
      selectedActions += actions.length;
    });

    if (selectedActions === 0) return "none";
    if (selectedActions === totalActions) return "all";
    return "some";
  };

  const getTotalPermissions = () => {
    let total = 0;
    Object.values(formData.permissions).forEach(module => {
      if (module) {
        Object.values(module).forEach(actions => {
          total += (actions as PermissionAction[])?.length || 0;
        });
      }
    });
    return total;
  };

  if (isLoading && isEdit) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
          <p className="text-sm text-[#64748B]">Loading role...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/admin/roles-permissions/roles")}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-[#64748B] hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">
                {isEdit ? "Edit Role" : "Create New Role"}
              </h1>
              <p className="text-sm text-[#64748B]">
                {isEdit ? "Update role permissions and settings" : "Define a new role with custom permissions"}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === step.id
                        ? "bg-[#1565C0] text-white"
                        : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-[#64748B]"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={20} strokeWidth={2.5} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${currentStep >= step.id ? "text-[#0F1B2D]" : "text-[#64748B]"}`}>
                      {step.name}
                    </div>
                    <div className="text-xs text-[#64748B]">Step {step.id} of 3</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 max-w-[80px]">
                    <div
                      className="h-full bg-[#1565C0] transition-all"
                      style={{ width: currentStep > step.id ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="font-semibold text-[#0F1B2D] mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sales Manager, Support Agent"
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this role can do and who should have it"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent resize-none"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.description}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Risk Level
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(["low", "medium", "high", "critical"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, riskLevel: level })}
                        className={`h-11 rounded-lg border text-sm font-medium transition-all ${
                          formData.riskLevel === level
                            ? level === "critical"
                              ? "border-red-500 bg-red-50 text-red-700"
                              : level === "high"
                              ? "border-orange-500 bg-orange-50 text-orange-700"
                              : level === "medium"
                              ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                              : "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-300 text-[#64748B] hover:bg-gray-50"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Permissions */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-[#0F1B2D] mb-1">Module Permissions</h2>
                <p className="text-sm text-[#64748B]">
                  Select granular permissions using Module → Submodule → Action structure
                </p>
                {errors.permissions && (
                  <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>{errors.permissions}</span>
                  </div>
                )}
              </div>

              <div className="divide-y divide-gray-200">
                {permissionModules.map((module) => {
                  const moduleState = getModuleState(module.id, module.submodules);
                  return (
                    <div key={module.id} className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={() => toggleModule(module.id, module.submodules)}
                          className="shrink-0"
                        >
                          {moduleState === "all" ? (
                            <CheckSquare size={20} className="text-[#1565C0]" />
                          ) : moduleState === "some" ? (
                            <MinusSquare size={20} className="text-[#1565C0]" />
                          ) : (
                            <Square size={20} className="text-[#64748B]" />
                          )}
                        </button>
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "#1565C015" }}
                        >
                          <module.icon size={20} className="text-[#1565C0]" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-[#0F1B2D]">{module.name}</div>
                          <div className="text-xs text-[#64748B]">{module.submodules.length} submodules</div>
                        </div>
                      </div>

                      <div className="ml-12 space-y-4">
                        {module.submodules.map((submodule) => {
                          const submoduleState = getSubmoduleState(module.id, submodule.id, submodule.actions);
                          return (
                            <div key={submodule.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <button
                                  onClick={() => toggleSubmodule(module.id, submodule.id, submodule.actions)}
                                >
                                  {submoduleState === "all" ? (
                                    <CheckSquare size={18} className="text-[#1565C0]" />
                                  ) : submoduleState === "some" ? (
                                    <MinusSquare size={18} className="text-[#1565C0]" />
                                  ) : (
                                    <Square size={18} className="text-[#64748B]" />
                                  )}
                                </button>
                                <span className="font-medium text-sm text-[#0F1B2D]">{submodule.name}</span>
                              </div>

                              <div className="ml-7 flex flex-wrap gap-2">
                                {submodule.actions.map((action) => {
                                  const modulePerms = formData.permissions[module.id] as any;
                                  const actions = (modulePerms?.[submodule.id] as PermissionAction[]) || [];
                                  const isSelected = actions.includes(action);

                                  return (
                                    <button
                                      key={action}
                                      onClick={() => togglePermission(module.id, submodule.id, action)}
                                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                        isSelected
                                          ? "bg-[#1565C0] text-white"
                                          : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                                      }`}
                                    >
                                      {actionLabels[action]}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="font-semibold text-[#0F1B2D] mb-6">Review & Confirm</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-[#64748B] mb-1">Role Name</div>
                    <div className="text-[#0F1B2D]">{formData.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#64748B] mb-1">Risk Level</div>
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        formData.riskLevel === "critical"
                          ? "bg-red-100 text-red-700"
                          : formData.riskLevel === "high"
                          ? "bg-orange-100 text-orange-700"
                          : formData.riskLevel === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {formData.riskLevel.charAt(0).toUpperCase() + formData.riskLevel.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-[#64748B] mb-1">Description</div>
                  <div className="text-[#0F1B2D]">{formData.description}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-[#64748B] mb-3">
                    Permissions ({getTotalPermissions()} total)
                  </div>
                  <div className="space-y-3">
                    {Object.entries(formData.permissions).map(([moduleId, modulePerms]) => {
                      if (!modulePerms) return null;
                      const hasPermissions = Object.values(modulePerms).some(
                        actions => actions && (actions as PermissionAction[]).length > 0
                      );
                      if (!hasPermissions) return null;

                      const moduleName = permissionModules.find(m => m.id === moduleId)?.name || moduleId;

                      return (
                        <div key={moduleId} className="border border-gray-200 rounded-lg p-4">
                          <div className="font-medium text-sm text-[#0F1B2D] mb-2">{moduleName}</div>
                          <div className="space-y-2">
                            {Object.entries(modulePerms).map(([submoduleId, actions]) => {
                              if (!actions || (actions as PermissionAction[]).length === 0) return null;

                              const submoduleName = permissionModules
                                .find(m => m.id === moduleId)
                                ?.submodules.find(s => s.id === submoduleId)?.name || submoduleId;

                              return (
                                <div key={submoduleId} className="flex items-start gap-2">
                                  <span className="text-xs text-[#64748B] min-w-[120px]">{submoduleName}:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {(actions as PermissionAction[]).map(action => (
                                      <span
                                        key={action}
                                        className="px-2 py-0.5 rounded bg-[#1565C0]/10 text-[#1565C0] text-xs"
                                      >
                                        {actionLabels[action]}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {errors.submit && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={20} />
                    <span>{errors.submit}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="h-11 px-6 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {currentStep === 3 ? (isEdit ? "Update Role" : "Create Role") : "Next Step"}
                  {currentStep < 3 && <ChevronLeft size={18} className="rotate-180" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" strokeWidth={3} />
            </div>
            <h3 className="font-semibold text-[#0F1B2D] mb-2">
              {isEdit ? "Role Updated!" : "Role Created!"}
            </h3>
            <p className="text-sm text-[#64748B]">
              {isEdit
                ? `"${formData.name}" has been updated successfully.`
                : `"${formData.name}" has been created successfully.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
