import { useState } from "react";
import { useEmail } from "../../hooks/useEmail";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  Code
} from "lucide-react";

export function EmailSignatures() {
  const { signatures, createSignature, updateSignature, deleteSignature } = useEmail();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    html: "",
    text: "",
    scope: "tenant" as "tenant" | "role" | "user",
    isDefault: false
  });

  const handleCreate = () => {
    createSignature(formData);
    setShowCreateModal(false);
    setFormData({
      name: "",
      html: "",
      text: "",
      scope: "tenant",
      isDefault: false
    });
  };

  const handleEdit = () => {
    if (showEditModal) {
      updateSignature(showEditModal, formData);
      setShowEditModal(null);
      setFormData({
        name: "",
        html: "",
        text: "",
        scope: "tenant",
        isDefault: false
      });
    }
  };

  const openEditModal = (id: string) => {
    const signature = signatures.find(s => s.id === id);
    if (signature) {
      setFormData({
        name: signature.name,
        html: signature.html,
        text: signature.text,
        scope: signature.scope,
        isDefault: signature.isDefault
      });
      setShowEditModal(id);
    }
  };

  const handleDelete = (id: string) => {
    deleteSignature(id);
    setShowDeleteModal(null);
  };

  const previewSignature = signatures.find(s => s.id === showPreview);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Email Signatures</h1>
            <p className="text-sm text-gray-500 mt-1">Manage email signatures for your organization</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Signature
          </button>
        </div>
      </div>

      {/* Signatures List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signatures.map(signature => (
            <div key={signature.id} className="bg-white rounded-lg border p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{signature.name}</h3>
                    {signature.isDefault && (
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">
                    {signature.scope}
                  </span>
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded border text-sm">
                <div dangerouslySetInnerHTML={{ __html: signature.html }} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(signature.id)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => openEditModal(signature.id)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(signature.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                Updated {new Date(signature.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {signatures.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No signatures yet</h3>
            <p className="text-gray-500 mb-4">Create your first email signature to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Create Signature
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {showEditModal ? "Edit Signature" : "Create Signature"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(null);
                  setFormData({
                    name: "",
                    html: "",
                    text: "",
                    scope: "tenant",
                    isDefault: false
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Default Company Signature"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tenant">Tenant-wide</option>
                  <option value="role">Role-based</option>
                  <option value="user">User-specific</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Set as default signature</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTML Content
                </label>
                <textarea
                  value={formData.html}
                  onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="<p>Best regards,<br/><strong>{{user_name}}</strong><br/>{{user_role}}<br/>Company Name</p>"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available variables: {'{{user_name}}, {{user_role}}, {{user_email}}, {{user_phone}}'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plain Text Content
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Best regards,&#10;{{user_name}}&#10;{{user_role}}&#10;Company Name"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(null);
                  setFormData({
                    name: "",
                    html: "",
                    text: "",
                    scope: "tenant",
                    isDefault: false
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? handleEdit : handleCreate}
                disabled={!formData.name || !formData.html || !formData.text}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showEditModal ? "Update Signature" : "Create Signature"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Signature Preview</h3>
              <button
                onClick={() => setShowPreview(null)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">HTML Preview</h4>
                <div className="border rounded-lg p-4 bg-white">
                  <div dangerouslySetInnerHTML={{ __html: previewSignature.html }} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Plain Text Preview</h4>
                <div className="border rounded-lg p-4 bg-gray-50 font-mono text-sm whitespace-pre-wrap">
                  {previewSignature.text}
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
            <h3 className="text-lg font-semibold mb-2">Delete Signature</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this signature? This action cannot be undone.
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
