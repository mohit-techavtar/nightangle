import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Shield, Check, ChevronLeft, AlertCircle, Lock, Users, Settings,
  PhoneCall, MessageCircle, Mail, Megaphone, BarChart3, DollarSign, FileText,
  Briefcase, CheckSquare, Square, MinusSquare, Loader2
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

const riskLevels = [
  { value: "low" as const, label: "Low", description: "Limited access to read-only data", color: "text-green-600 bg-green-50" },
  { value: "medium" as const, label: "Medium", description: "Can create and edit records", color: "text-blue-600 bg-blue-50" },
  { value: "high" as const, label: "High", description: "Can delete records and execute operations", color: "text-orange-600 bg-orange-50" },
  { value: "critical" as const, label: "Critical", description: "Full administrative access", color: "text-red-600 bg-red-50" },
];

export function TenantCreateEditRole() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get("id");
  const isEdit = !!roleId;

  const { getRole, createRole, updateRole } = useOmniStore();
  const [loading, setLoading] = useState(isEdit);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "low" as "low" | "medium" | "high" | "critical",
    permissions: {} as PermissionSet,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && roleId) {
      loadRole();
    }
  }, [roleId]);

  const loadRole = async () => {
    if (!roleId) return;
    setLoading(true);
    try {
      const role = await getRole(roleId);
      if (role) {
        setFormData({
          name: role.name,
          description: role.description || "",
          riskLevel: role.riskLevel || "low",
          permissions: role.permissions,
        });
      }
    } catch (error) {
      console.error('Failed to load role:', error);
    } finally {
      setLoading(false);
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
        module && typeof module === 'object' &&
        Object.values(module).some(actions => Array.isArray(actions) && actions.length > 0)
      );

      if (!hasPermissions) {
        setErrors({ permissions: "Please select at least one permission" });
        return;
      }
      setErrors({});
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/tenant/team/roles");
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && roleId) {
        await updateRole(roleId, {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          riskLevel: formData.riskLevel,
        });
      } else {
        await createRole({
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          riskLevel: formData.riskLevel,
          isSystem: false,
        });
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save role:', error);
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
    setErrors({});
  };

  const getSubmoduleState = (moduleId: keyof PermissionSet, submoduleId: string, availableActions: PermissionAction[]): 'all' | 'some' | 'none' => {
    const module = formData.permissions[moduleId] as any;
    if (!module || !module[submoduleId]) return 'none';

    const selectedActions = module[submoduleId] as PermissionAction[];
    if (selectedActions.length === 0) return 'none';
    if (selectedActions.length === availableActions.length) return 'all';
    return 'some';
  };

  const toggleSubmodule = (moduleId: keyof PermissionSet, submoduleId: string, availableActions: PermissionAction[]) => {
    const state = getSubmoduleState(moduleId, submoduleId, availableActions);

    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      if (!newPermissions[moduleId]) {
        newPermissions[moduleId] = {};
      }
      const module = newPermissions[moduleId] as any;

      if (state === 'all' || state === 'some') {
        module[submoduleId] = [];
      } else {
        module[submoduleId] = [...availableActions];
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const getModuleState = (moduleId: keyof PermissionSet, submodules: typeof permissionModules[0]['submodules']): 'all' | 'some' | 'none' => {
    const states = submodules.map(sub => getSubmoduleState(moduleId, sub.id, sub.actions));
    if (states.every(s => s === 'all')) return 'all';
    if (states.every(s => s === 'none')) return 'none';
    return 'some';
  };

  const toggleModule = (moduleId: keyof PermissionSet, submodules: typeof permissionModules[0]['submodules']) => {
    const state = getModuleState(moduleId, submodules);

    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      const module: any = {};

      if (state !== 'all') {
        submodules.forEach(sub => {
          module[sub.id] = [...sub.actions];
        });
      } else {
        submodules.forEach(sub => {
          module[sub.id] = [];
        });
      }

      newPermissions[moduleId] = module;
      return { ...prev, permissions: newPermissions };
    });
  };

  const countPermissions = (): number => {
    let count = 0;
    Object.values(formData.permissions).forEach(module => {
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
            Back to {currentStep === 1 ? "Roles" : "Previous Step"}
          </button>
          <div>
            <h1 className="font-semibold text-[#0F1B2D] mb-1">
              {isEdit ? "Edit Team Role" : "Create Team Role"}
            </h1>
            <p className="text-sm text-[#64748B]">
              {currentStep === 1 && "Define role details and basic information"}
              {currentStep === 2 && "Select permissions for this role"}
              {currentStep === 3 && "Review and confirm role configuration"}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-[#1565C0] border-[#1565C0] text-white"
                        : currentStep === step.id
                        ? "border-[#1565C0] text-[#1565C0] bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={20} strokeWidth={2.5} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? "text-[#0F1B2D]" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-[#64748B]">Step {step.id} of {steps.length}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-[#1565C0]" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-6xl">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>Create roles based on job functions:</strong> Define clear responsibilities and access levels for different team positions.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sales Manager, Campaign Coordinator, Support Specialist"
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
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role's responsibilities and scope of access..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent resize-none ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Risk Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {riskLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.riskLevel === level.value
                        ? "border-[#1565C0] bg-[#1565C0]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="riskLevel"
                      value={level.value}
                      checked={formData.riskLevel === level.value}
                      onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.riskLevel === level.value ? "border-[#1565C0]" : "border-gray-300"
                      }`}>
                        {formData.riskLevel === level.value && (
                          <div className="w-2 h-2 rounded-full bg-[#1565C0]" />
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${level.color}`}>
                        {level.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] ml-7">{level.description}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Permissions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>Grant minimum required access:</strong> Select only the permissions necessary for the role to perform its duties.
              </div>
            </div>

            {errors.permissions && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-900">{errors.permissions}</div>
              </div>
            )}

            <div className="space-y-4">
              {permissionModules.map((module) => {
                const moduleState = getModuleState(module.id, module.submodules);
                const ModuleIcon = module.icon;

                return (
                  <div key={module.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleModule(module.id, module.submodules)}
                          className="hover:bg-gray-200 rounded p-1 transition-colors"
                        >
                          {moduleState === 'all' && <CheckSquare size={20} className="text-[#1565C0]" />}
                          {moduleState === 'some' && <MinusSquare size={20} className="text-[#1565C0]" />}
                          {moduleState === 'none' && <Square size={20} className="text-gray-400" />}
                        </button>
                        <ModuleIcon size={20} className="text-[#1565C0]" />
                        <span className="font-semibold text-[#0F1B2D]">{module.name}</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {module.submodules.map((submodule) => {
                        const submoduleState = getSubmoduleState(module.id, submodule.id, submodule.actions);

                        return (
                          <div key={submodule.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleSubmodule(module.id, submodule.id, submodule.actions)}
                                  className="hover:bg-gray-100 rounded p-1 transition-colors"
                                >
                                  {submoduleState === 'all' && <CheckSquare size={18} className="text-[#1565C0]" />}
                                  {submoduleState === 'some' && <MinusSquare size={18} className="text-[#1565C0]" />}
                                  {submoduleState === 'none' && <Square size={18} className="text-gray-400" />}
                                </button>
                                <span className="font-medium text-sm text-[#0F1B2D]">{submodule.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 ml-7">
                              {submodule.actions.map((action) => {
                                const module_perms = formData.permissions[module.id] as any;
                                const isSelected = module_perms?.[submodule.id]?.includes(action) || false;

                                return (
                                  <button
                                    key={action}
                                    onClick={() => togglePermission(module.id, submodule.id, action)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                Review the role configuration. You can edit these settings anytime after creation.
              </div>
            </div>

            {/* Basic Info Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#0F1B2D] mb-4">Role Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#64748B] mb-1">Role Name</div>
                  <div className="font-medium text-[#0F1B2D]">{formData.name}</div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B] mb-1">Description</div>
                  <div className="text-sm text-[#0F1B2D]">{formData.description}</div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B] mb-1">Risk Level</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    riskLevels.find(l => l.value === formData.riskLevel)?.color
                  }`}>
                    {riskLevels.find(l => l.value === formData.riskLevel)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Permissions Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0F1B2D]">Selected Permissions</h3>
                <span className="text-sm text-[#64748B]">
                  {countPermissions()} permissions
                </span>
              </div>
              <div className="space-y-3">
                {permissionModules.map((module) => {
                  const moduleName = module.name;
                  const ModuleIcon = module.icon;
                  const modulePerms = formData.permissions[module.id] as any;

                  if (!modulePerms) return null;

                  const selectedSubmodules = module.submodules.filter(sub =>
                    modulePerms[sub.id] && modulePerms[sub.id].length > 0
                  );

                  if (selectedSubmodules.length === 0) return null;

                  return (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ModuleIcon size={18} className="text-[#1565C0]" />
                        <span className="font-medium text-[#0F1B2D]">{moduleName}</span>
                      </div>
                      <div className="space-y-2 ml-6">
                        {selectedSubmodules.map((submodule) => (
                          <div key={submodule.id} className="text-sm">
                            <div className="text-[#0F1B2D] font-medium mb-1">{submodule.name}</div>
                            <div className="flex flex-wrap gap-1">
                              {(modulePerms[submodule.id] as PermissionAction[]).map((action) => (
                                <span
                                  key={action}
                                  className="px-2 py-0.5 rounded text-xs bg-[#1565C0]/10 text-[#1565C0]"
                                >
                                  {actionLabels[action]}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            className="h-11 px-6 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
          >
            {currentStep === 3 ? (isEdit ? "Update Role" : "Create Role") : "Continue"}
          </button>
        </div>
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
                Role {isEdit ? "Updated" : "Created"} Successfully
              </h3>
              <p className="text-sm text-[#64748B] mb-6">
                The role <strong>{formData.name}</strong> has been {isEdit ? "updated" : "created"} with {countPermissions()} permissions.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/tenant/team/roles")}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  View All Roles
                </button>
                <button
                  onClick={() => navigate("/tenant/team/assignments")}
                  className="flex-1 h-10 px-4 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
                >
                  Assign Members
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
