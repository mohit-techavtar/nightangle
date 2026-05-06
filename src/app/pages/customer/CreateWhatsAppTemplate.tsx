import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, AlertCircle, Check, Plus, X } from "lucide-react";
import { useWhatsApp } from "../../hooks/useWhatsApp";

export function CreateWhatsAppTemplate() {
  const navigate = useNavigate();
  const { createTemplate, submitTemplateForApproval } = useWhatsApp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "marketing" as "marketing" | "utility" | "authentication",
    language: "en",
    content: "",
    variables: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newVariable, setNewVariable] = useState("");

  const handleAddVariable = () => {
    if (!newVariable.trim()) return;
    if (formData.variables.includes(newVariable)) return;

    setFormData({
      ...formData,
      variables: [...formData.variables, newVariable],
      content: formData.content + ` {{${newVariable}}}`
    });
    setNewVariable("");
  };

  const handleRemoveVariable = (variable: string) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter(v => v !== variable)
    });
  };

  const handleSubmit = (submitForApproval: boolean) => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Template name is required";
    if (!formData.content.trim()) newErrors.content = "Template content is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const template = createTemplate({
      name: formData.name,
      category: formData.category,
      language: formData.language,
      content: formData.content,
      variables: formData.variables,
    });

    if (submitForApproval && template) {
      submitTemplateForApproval(template.id);
    }

    setShowSuccessModal(true);
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate("/tenant/whatsapp/templates")}
            className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F1B2D] mb-4"
          >
            <ChevronLeft size={18} />
            Back to Templates
          </button>
          <div>
            <h1 className="font-semibold text-[#0F1B2D] mb-1">Create WhatsApp Template</h1>
            <p className="text-sm text-[#64748B]">
              Create a new message template and submit for WhatsApp approval
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-orange-600 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-900">
                <strong>Approval Required:</strong> All templates must be approved by WhatsApp before use. Approval typically takes 24-48 hours.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., spring_sale_2024, order_confirmation"
                className={`w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.name}
                </p>
              )}
              <p className="mt-1.5 text-xs text-[#64748B]">
                Use lowercase letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
              >
                <option value="marketing">Marketing</option>
                <option value="utility">Utility</option>
                <option value="authentication">Authentication</option>
              </select>
              <p className="mt-1.5 text-xs text-[#64748B]">
                {formData.category === "marketing" && "Promotional content, offers, and announcements"}
                {formData.category === "utility" && "Order updates, account notifications, and service messages"}
                {formData.category === "authentication" && "One-time passwords and verification codes"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Template Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Hi {{name}}! Welcome to our service..."
                rows={8}
                className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none ${
                  errors.content ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.content && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.content}
                </p>
              )}
              <p className="mt-1.5 text-xs text-[#64748B]">
                Use variables like {`{{1}}`}, {`{{name}}`}, etc. for personalization
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Variables
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddVariable()}
                  placeholder="e.g., name, discount, code"
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                />
                <button
                  onClick={handleAddVariable}
                  className="h-10 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              {formData.variables.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-2"
                    >
                      {`{{${variable}}}`}
                      <button
                        onClick={() => handleRemoveVariable(variable)}
                        className="hover:text-green-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="sticky top-24">
              <h3 className="font-semibold text-[#0F1B2D] mb-4">Preview</h3>
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="bg-[#DCF8C6] rounded-lg p-4 relative">
                  <div className="text-sm text-[#0F1B2D] whitespace-pre-wrap break-words">
                    {formData.content || "Your message will appear here..."}
                  </div>
                  <div className="mt-2 text-right text-xs text-[#64748B]">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {formData.variables.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-sm text-[#0F1B2D] mb-2">Sample Data Required:</h4>
                  <div className="space-y-2">
                    {formData.variables.map((variable, index) => (
                      <div key={index} className="text-xs text-[#64748B]">
                        • <span className="font-mono">{`{{${variable}}}`}</span>: Sample value needed
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => handleSubmit(false)}
                  className="w-full h-11 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  className="w-full h-11 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
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
              <h3 className="font-semibold text-[#0F1B2D] mb-2">Template Created Successfully</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Your template has been submitted for WhatsApp approval. You'll be notified once it's reviewed.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/tenant/whatsapp/campaigns/create")}
                  className="w-full h-10 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
                >
                  Create Campaign with Template
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/tenant/whatsapp/templates")}
                    className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                  >
                    View Templates
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
