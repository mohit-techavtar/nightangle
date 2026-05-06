import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useEmail } from "../../hooks/useEmail";
import {
  ArrowLeft,
  Save,
  Eye,
  Code,
  Type,
  Sparkles,
  Plus,
  X
} from "lucide-react";

export function CreateEmailTemplate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { templates, createTemplate, updateTemplate } = useEmail();

  const isEditing = !!id;
  const existingTemplate = isEditing ? templates.find(t => t.id === id) : null;

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    bodyHtml: "",
    bodyText: "",
    category: "marketing" as "marketing" | "transactional" | "support",
    status: "draft" as "draft" | "approved" | "active" | "archived"
  });

  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");

  useEffect(() => {
    if (existingTemplate) {
      setFormData({
        name: existingTemplate.name,
        subject: existingTemplate.subject,
        bodyHtml: existingTemplate.bodyHtml,
        bodyText: existingTemplate.bodyText,
        category: existingTemplate.category,
        status: existingTemplate.status
      });
      setVariables(existingTemplate.variables);
    }
  }, [existingTemplate]);

  const handleAddVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable]);
      setNewVariable("");
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const insertVariable = (variable: string) => {
    const variableTag = `{{${variable}}}`;
    setFormData({
      ...formData,
      bodyHtml: formData.bodyHtml + variableTag,
      bodyText: formData.bodyText + variableTag
    });
  };

  const handleAIGenerate = () => {
    const aiGenerated = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #333;">{{subject}}</h1>
  <p>Dear {{recipient_name}},</p>
  <p>We hope this email finds you well. We wanted to reach out regarding...</p>
  <p>If you have any questions, please don't hesitate to contact us.</p>
  <p>Best regards,<br>{{sender_name}}<br>{{company_name}}</p>
</div>`;

    setFormData({
      ...formData,
      bodyHtml: aiGenerated,
      bodyText: aiGenerated.replace(/<[^>]*>/g, '\n').trim()
    });

    setVariables(['subject', 'recipient_name', 'sender_name', 'company_name']);
  };

  const handleSave = () => {
    if (isEditing && id) {
      updateTemplate(id, {
        ...formData,
        variables
      });
    } else {
      createTemplate({
        ...formData,
        variables
      });
    }
    navigate("/tenant/email/templates");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/email/templates")}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">
                {isEditing ? "Edit Template" : "Create Template"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Build reusable email templates with variables
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.subject || !formData.bodyHtml}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isEditing ? "Update Template" : "Create Template"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Template Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Welcome Email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="marketing">Marketing</option>
                      <option value="transactional">Transactional</option>
                      <option value="support">Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject (can include variables)"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Email Content *</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleAIGenerate}
                    className="px-3 py-2 border border-purple-300 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Generate
                  </button>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("visual")}
                      className={`px-3 py-2 text-sm flex items-center gap-2 ${
                        viewMode === "visual" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Type className="w-4 h-4" />
                      Visual
                    </button>
                    <button
                      onClick={() => setViewMode("html")}
                      className={`px-3 py-2 text-sm flex items-center gap-2 border-l ${
                        viewMode === "html" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Code className="w-4 h-4" />
                      HTML
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === "visual" ? (
                <textarea
                  value={formData.bodyText}
                  onChange={(e) => {
                    const text = e.target.value;
                    setFormData({
                      ...formData,
                      bodyText: text,
                      bodyHtml: `<p>${text.split('\n').join('</p><p>')}</p>`
                    });
                  }}
                  rows={16}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Type your email content here..."
                />
              ) : (
                <textarea
                  value={formData.bodyHtml}
                  onChange={(e) => setFormData({ ...formData, bodyHtml: e.target.value })}
                  rows={16}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="<html>...</html>"
                />
              )}

              <p className="text-xs text-gray-500 mt-2">
                Use variables like {'{{variable_name}}'} to personalize your emails
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Variables */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Variables</h3>

              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddVariable()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="variable_name"
                  />
                  <button
                    onClick={handleAddVariable}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {variables.map(variable => (
                  <div
                    key={variable}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                  >
                    <button
                      onClick={() => insertVariable(variable)}
                      className="flex-1 text-left text-sm font-mono text-gray-700 hover:text-blue-600"
                    >
                      {'{{' + variable + '}}'}
                    </button>
                    <button
                      onClick={() => handleRemoveVariable(variable)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>

              {variables.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No variables added yet
                </p>
              )}

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs font-medium text-gray-700 mb-2">Common variables:</p>
                <div className="space-y-1">
                  {['recipient_name', 'recipient_email', 'sender_name', 'company_name', 'date'].map(v => (
                    <button
                      key={v}
                      onClick={() => !variables.includes(v) && setVariables([...variables, v])}
                      className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 py-1"
                      disabled={variables.includes(v)}
                    >
                      + {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Subject:</div>
                    <div className="text-sm font-medium">{formData.subject || "No subject"}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Body:</div>
                    <div
                      className="border rounded p-3 text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.bodyHtml || "<p>No content</p>" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
