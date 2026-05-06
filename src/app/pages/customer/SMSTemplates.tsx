import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Search, Filter, Copy, Edit, Trash2, Eye, Star, AlertCircle, X
} from "lucide-react";

interface Template {
  id: number;
  name: string;
  category: "transactional" | "marketing" | "notification" | "custom";
  content: string;
  variables: string[];
  usageCount: number;
  created: string;
  lastUsed: string | null;
  favorite: boolean;
}

const templates: Template[] = [
  {
    id: 1,
    name: "Welcome Message",
    category: "transactional",
    content: "Hi {{name}}, welcome to {{company}}! We're excited to have you onboard. Visit {{link}} to get started.",
    variables: ["name", "company", "link"],
    usageCount: 2341,
    created: "2024-04-01",
    lastUsed: "2m ago",
    favorite: true,
  },
  {
    id: 2,
    name: "Appointment Reminder",
    category: "notification",
    content: "Hi {{name}}, reminder for your appointment on {{date}} at {{time}}. Reply YES to confirm or NO to reschedule.",
    variables: ["name", "date", "time"],
    usageCount: 1876,
    created: "2024-03-28",
    lastUsed: "15m ago",
    favorite: true,
  },
  {
    id: 3,
    name: "Payment Reminder",
    category: "transactional",
    content: "Hi {{name}}, your payment of {{amount}} for invoice #{{invoice_id}} is due on {{date}}. Pay now: {{link}}",
    variables: ["name", "amount", "invoice_id", "date", "link"],
    usageCount: 892,
    created: "2024-04-05",
    lastUsed: "1h ago",
    favorite: false,
  },
  {
    id: 4,
    name: "Promotional Offer",
    category: "marketing",
    content: "Exclusive offer for you! Get {{discount}}% off on all products. Use code {{code}} at checkout. Shop now: {{link}}",
    variables: ["discount", "code", "link"],
    usageCount: 4532,
    created: "2024-03-15",
    lastUsed: "5h ago",
    favorite: false,
  },
  {
    id: 5,
    name: "Order Confirmation",
    category: "transactional",
    content: "Hi {{name}}, your order #{{order_id}} has been confirmed! Expected delivery: {{delivery_date}}. Track: {{tracking_link}}",
    variables: ["name", "order_id", "delivery_date", "tracking_link"],
    usageCount: 3245,
    created: "2024-02-20",
    lastUsed: "2d ago",
    favorite: false,
  },
];

export function SMSTemplates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "custom" as Template["category"],
    content: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getCategoryBadge = (category: Template["category"]) => {
    const badges = {
      transactional: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
      marketing: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
      notification: { bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
      custom: { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]" },
    };
    return badges[category];
  };

  const handleOpenModal = (template?: Template) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        category: template.category,
        content: template.content,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        category: "custom",
        content: "",
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    setFormData({ name: "", category: "custom", content: "" });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Template content is required";
    } else if (formData.content.length > 160) {
      newErrors.content = "Template exceeds 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log(editingTemplate ? "Updating template:" : "Creating template:", formData);
      handleCloseModal();
    }
  };

  const handleDelete = (id: number) => {
    console.log("Deleting template:", id);
    setShowDeleteModal(null);
  };

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.matchAll(regex);
    return Array.from(new Set(Array.from(matches, m => m[1])));
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS" },
          { label: "Templates" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">SMS Templates</h1>
              <p className="text-sm text-[#6B7280] mt-1">Create reusable message templates with variables</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Template
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#0F1B2D]">{templates.length}</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Templates</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {templates.filter(t => t.favorite).length}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Favorites</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Total Uses</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {Math.round(templates.reduce((sum, t) => sum + t.usageCount, 0) / templates.length)}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Avg Uses/Template</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {["all", "transactional", "marketing", "notification", "custom"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === category
                        ? "bg-[#1565C0] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => {
              const badge = getCategoryBadge(template.category);
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-lg border border-[#E5E7EB] hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-[#0F1B2D]">{template.name}</h3>
                          {template.favorite && (
                            <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                          )}
                        </div>
                        <span className={`inline-block px-3 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded-full`}>
                          {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenModal(template)}
                          className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-[#6B7280]" />
                        </button>
                        <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors" title="Duplicate">
                          <Copy size={16} className="text-[#6B7280]" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(template.id)}
                          className="p-2 hover:bg-[#FEF2F2] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-[#EF4444]" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 mb-4">
                      <p className="text-sm text-[#374151] font-mono leading-relaxed">{template.content}</p>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-medium text-[#6B7280] mb-2">Variables ({template.variables.length})</div>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable, idx) => (
                          <code
                            key={idx}
                            className="px-2 py-1 bg-[#E0E7FF] text-[#3730A3] text-xs rounded font-mono"
                          >
                            {"{"}{"{"}{variable}{"}"}
{"}"}
                          </code>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-[#6B7280]">
                      <div>
                        <span className="font-medium text-[#0F1B2D]">{template.usageCount.toLocaleString()}</span> uses
                      </div>
                      <div>
                        Last used: {template.lastUsed || "Never"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
              <AlertCircle size={48} className="text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0F1B2D] mb-2">No templates found</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                {searchQuery || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first template"}
              </p>
              {!searchQuery && categoryFilter === "all" && (
                <button
                  onClick={() => handleOpenModal()}
                  className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors"
                >
                  Create Template
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Template Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#0F1B2D]">
                  {editingTemplate ? "Edit Template" : "Create Template"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-[#F9FAFB] rounded transition-colors"
                >
                  <X size={20} className="text-[#6B7280]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Template Name <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Welcome Message"
                    className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Template["category"] })}
                    className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  >
                    <option value="transactional">Transactional</option>
                    <option value="marketing">Marketing</option>
                    <option value="notification">Notification</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Message Content <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Type your message... Use {{variable_name}} for personalization"
                    rows={5}
                    maxLength={160}
                    className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent font-mono"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-[#6B7280]">
                      Use {"{"}{"{"} variable_name {"}"} {"}"} for dynamic content
                    </p>
                    <p className="text-sm font-medium text-[#6B7280]">
                      {formData.content.length}/160 characters
                    </p>
                  </div>
                  {errors.content && (
                    <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.content}
                    </p>
                  )}
                </div>

                {formData.content && extractVariables(formData.content).length > 0 && (
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                    <div className="text-sm font-medium text-[#374151] mb-2">
                      Detected Variables ({extractVariables(formData.content).length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {extractVariables(formData.content).map((variable, idx) => (
                        <code
                          key={idx}
                          className="px-2 py-1 bg-[#E0E7FF] text-[#3730A3] text-xs rounded font-mono"
                        >
                          {"{"}{"{"}{variable}{"}"}
{"}"}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors"
                >
                  {editingTemplate ? "Update Template" : "Create Template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#0F1B2D] mb-2">Delete Template</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Are you sure you want to delete this template? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 px-4 py-2 bg-[#EF4444] text-white rounded-lg text-sm font-medium hover:bg-[#DC2626] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
