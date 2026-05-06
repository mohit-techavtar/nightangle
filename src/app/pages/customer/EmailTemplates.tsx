import { useState } from "react";
import { useNavigate } from "react-router";
import { useEmail } from "../../hooks/useEmail";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  MoreVertical,
  FileText
} from "lucide-react";

export function EmailTemplates() {
  const navigate = useNavigate();
  const { templates, deleteTemplate, approveTemplate, updateTemplate } = useEmail();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<string | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || template.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-700",
      approved: "bg-green-100 text-green-700",
      active: "bg-blue-100 text-blue-700",
      archived: "bg-gray-100 text-gray-500"
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      marketing: "bg-purple-100 text-purple-700",
      transactional: "bg-blue-100 text-blue-700",
      support: "bg-orange-100 text-orange-700"
    };
    return styles[category as keyof typeof styles] || styles.marketing;
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setShowDeleteModal(null);
    setShowActionMenu(null);
  };

  const handleApprove = (id: string) => {
    approveTemplate(id, "current-user@company.com");
    setShowActionMenu(null);
  };

  const handleArchive = (id: string) => {
    updateTemplate(id, { status: "archived" });
    setShowActionMenu(null);
  };

  const previewTemplate = templates.find(t => t.id === showPreviewModal);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Email Templates</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage email templates</p>
          </div>
          <button
            onClick={() => navigate("/tenant/email/templates/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="marketing">Marketing</option>
            <option value="transactional">Transactional</option>
            <option value="support">Support</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(template.status)}`}>
                        {template.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getCategoryBadge(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === template.id ? null : template.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {showActionMenu === template.id && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                        <button
                          onClick={() => {
                            setShowPreviewModal(template.id);
                            setShowActionMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/tenant/email/templates/${template.id}/edit`);
                            setShowActionMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        {template.status === "draft" && (
                          <button
                            onClick={() => handleApprove(template.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        {template.status === "active" && (
                          <button
                            onClick={() => handleArchive(template.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Archive
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowDeleteModal(template.id);
                            setShowActionMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">Subject:</p>
                  <p className="text-sm text-gray-900">{template.subject}</p>
                </div>

                {template.variables.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map(variable => (
                        <span key={variable} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {`{{${variable}}}`}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{template.variables.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
                  <div>
                    <span className="font-medium">{template.usageCount.toLocaleString()}</span> uses
                  </div>
                  <div>
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {template.approvedAt && (
                  <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                    Approved by {template.approvedBy} on {new Date(template.approvedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first email template"}
            </p>
            {!searchQuery && categoryFilter === "all" && statusFilter === "all" && (
              <button
                onClick={() => navigate("/tenant/email/templates/create")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Create Template
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Template Preview</h3>
              <button
                onClick={() => setShowPreviewModal(null)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Template Name</h4>
                <p className="text-gray-900">{previewTemplate.name}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Subject</h4>
                <p className="text-gray-900">{previewTemplate.subject}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">HTML Body</h4>
                <div
                  className="border rounded-lg p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.bodyHtml }}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Plain Text Body</h4>
                <div className="border rounded-lg p-4 bg-gray-50 text-sm whitespace-pre-wrap font-mono">
                  {previewTemplate.bodyText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Template</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this template? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
