import React, { useState } from "react";
import { X, Save, Star, Clock, AlertCircle, UserX, Target, TrendingUp, Users, Lock, Globe } from "lucide-react";

interface CreateViewModalProps {
  onCreateView: (view: any) => void;
  onClose: () => void;
}

export function CreateViewModal({ onCreateView, onClose }: CreateViewModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "Star",
    type: "personal" as "personal" | "shared",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const iconOptions = [
    { value: "Star", label: "Star", icon: Star, color: "text-[#F57F17]" },
    { value: "Clock", label: "Clock", icon: Clock, color: "text-[#1565C0]" },
    { value: "AlertCircle", label: "Alert", icon: AlertCircle, color: "text-[#C62828]" },
    { value: "UserX", label: "User X", icon: UserX, color: "text-[#9E9E9E]" },
    { value: "Target", label: "Target", icon: Target, color: "text-[#4CAF50]" },
    { value: "TrendingUp", label: "Trending", icon: TrendingUp, color: "text-[#6A1B9A]" },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "View name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const selectedIcon = iconOptions.find(opt => opt.value === formData.icon);
    
    onCreateView({
      id: `view-${Date.now()}`,
      name: formData.name,
      icon: selectedIcon?.icon || Star,
      count: 0,
      type: formData.type,
      filters: {}, // Empty filters for new view
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div>
            <h3 className="text-lg font-semibold text-white">Create New View</h3>
            <p className="text-sm text-white/80">Save your current filters as a view</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* View Name */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              View Name <span className="text-[#C62828]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full h-10 px-3 border rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 ${
                errors.name ? "border-[#C62828]" : "border-[#E0E0E0]"
              }`}
              placeholder="e.g., High Priority Leads"
            />
            {errors.name && <p className="text-xs text-[#C62828] mt-1">{errors.name}</p>}
          </div>

          {/* Icon Selection */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map(option => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: option.value })}
                    className={`h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                      formData.icon === option.value
                        ? "border-[#1565C0] bg-[#E3F2FD]"
                        : "border-[#E0E0E0] hover:border-[#BDBDBD]"
                    }`}
                    title={option.label}
                  >
                    <IconComponent size={20} className={option.color} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* View Type */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              View Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "personal" })}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  formData.type === "personal"
                    ? "border-[#1565C0] bg-[#E3F2FD]"
                    : "border-[#E0E0E0] hover:bg-[#F5F5F5]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={16} className={formData.type === "personal" ? "text-[#1565C0]" : "text-[#616161]"} />
                  <span className="text-sm font-semibold text-[#212121]">Personal</span>
                </div>
                <p className="text-xs text-[#616161]">Only visible to you</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "shared" })}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  formData.type === "shared"
                    ? "border-[#1565C0] bg-[#E3F2FD]"
                    : "border-[#E0E0E0] hover:bg-[#F5F5F5]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} className={formData.type === "shared" ? "text-[#1565C0]" : "text-[#616161]"} />
                  <span className="text-sm font-semibold text-[#212121]">Shared</span>
                </div>
                <p className="text-xs text-[#616161]">Visible to all team</p>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
              placeholder="Describe what this view is for..."
            />
          </div>

          {/* Info Box */}
          <div className="mb-6 p-3 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
            <p className="text-xs text-[#1565C0]">
              <strong>Tip:</strong> This view will save your current filters and search criteria. You can modify them later by editing the view.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
          <p className="text-xs text-[#616161]">
            <span className="text-[#C62828]">*</span> Required fields
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2"
            >
              <Save size={16} />
              Create View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
