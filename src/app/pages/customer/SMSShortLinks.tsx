import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Link2, Copy, Edit, Trash2, TrendingUp, ExternalLink, BarChart2, Calendar, X, AlertCircle
} from "lucide-react";

interface ShortLink {
  id: number;
  name: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  created: string;
  expiresAt: string | null;
  status: "active" | "expired" | "paused";
}

const shortLinks: ShortLink[] = [
  {
    id: 1,
    name: "Summer Sale Landing",
    shortCode: "SALE20",
    originalUrl: "https://example.com/summer-sale-2024",
    shortUrl: "https://sms.link/SALE20",
    clicks: 892,
    created: "2024-04-15",
    expiresAt: "2024-05-31",
    status: "active",
  },
  {
    id: 2,
    name: "Product Demo Sign Up",
    shortCode: "DEMO",
    originalUrl: "https://example.com/demo/signup",
    shortUrl: "https://sms.link/DEMO",
    clicks: 1234,
    created: "2024-04-10",
    expiresAt: null,
    status: "active",
  },
  {
    id: 3,
    name: "Download App",
    shortCode: "GETAPP",
    originalUrl: "https://example.com/download",
    shortUrl: "https://sms.link/GETAPP",
    clicks: 567,
    created: "2024-04-05",
    expiresAt: null,
    status: "active",
  },
];

export function SMSShortLinks() {
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    originalUrl: "",
    shortCode: "",
    expiresAt: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOpenModal = (link?: ShortLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        name: link.name,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        expiresAt: link.expiresAt || "",
      });
    } else {
      setEditingLink(null);
      setFormData({ name: "", originalUrl: "", shortCode: "", expiresAt: "" });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLink(null);
    setFormData({ name: "", originalUrl: "", shortCode: "", expiresAt: "" });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Link name is required";
    }
    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.originalUrl)) {
      newErrors.originalUrl = "Please enter a valid URL";
    }
    if (!formData.shortCode.trim()) {
      newErrors.shortCode = "Short code is required";
    } else if (!/^[A-Z0-9]+$/.test(formData.shortCode)) {
      newErrors.shortCode = "Short code must be uppercase letters and numbers only";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log(editingLink ? "Updating link:" : "Creating link:", formData);
      handleCloseModal();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS" },
          { label: "Short Links" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Short Links</h1>
              <p className="text-sm text-[#6B7280] mt-1">Create trackable short links for SMS campaigns</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Short Link
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Link2 size={20} className="text-[#1565C0]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">{shortLinks.length}</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Links</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#10B981]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {shortLinks.reduce((sum, link) => sum + link.clicks, 0).toLocaleString()}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Total Clicks</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <BarChart2 size={20} className="text-[#F59E0B]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {Math.round(shortLinks.reduce((sum, link) => sum + link.clicks, 0) / shortLinks.length)}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Avg Clicks/Link</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#6366F1]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {shortLinks.filter(l => l.status === "active").length}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Active Links</div>
            </div>
          </div>

          {/* Links List */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Link Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Short URL</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Original URL</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {shortLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-[#0F1B2D]">{link.name}</div>
                          <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                            <Calendar size={12} />
                            Created {link.created}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-[#1565C0] bg-[#EBF5FF] px-2 py-1 rounded">
                            {link.shortUrl}
                          </code>
                          <button
                            onClick={() => copyToClipboard(link.shortUrl)}
                            className="p-1 hover:bg-[#E5E7EB] rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={14} className="text-[#6B7280]" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-xs">
                          <div className="text-sm text-[#6B7280] truncate">{link.originalUrl}</div>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-[#E5E7EB] rounded transition-colors shrink-0"
                          >
                            <ExternalLink size={14} className="text-[#6B7280]" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-[#0F1B2D]">
                          {link.clicks.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          link.status === "active"
                            ? "bg-[#D1FAE5] text-[#065F46]"
                            : link.status === "expired"
                            ? "bg-[#FEE2E2] text-[#991B1B]"
                            : "bg-[#E5E7EB] text-[#374151]"
                        }`}>
                          {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(link)}
                            className="p-1 hover:bg-[#E5E7EB] rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} className="text-[#6B7280]" />
                          </button>
                          <button className="p-1 hover:bg-[#FEF2F2] rounded transition-colors" title="Delete">
                            <Trash2 size={16} className="text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#0F1B2D]">
                  {editingLink ? "Edit Short Link" : "Create Short Link"}
                </h3>
                <button onClick={handleCloseModal} className="p-1 hover:bg-[#F9FAFB] rounded transition-colors">
                  <X size={20} className="text-[#6B7280]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Link Name <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Sale Landing"
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
                    Original URL <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.originalUrl}
                    onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                    placeholder="https://example.com/page"
                    className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent font-mono"
                  />
                  {errors.originalUrl && (
                    <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.originalUrl}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Short Code <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6B7280]">https://sms.link/</span>
                    <input
                      type="text"
                      value={formData.shortCode}
                      onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                      placeholder="MYCODE"
                      maxLength={20}
                      className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent font-mono uppercase"
                    />
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Use uppercase letters and numbers only (max 20 characters)
                  </p>
                  {errors.shortCode && (
                    <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.shortCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    Leave blank for no expiration
                  </p>
                </div>
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
                  {editingLink ? "Update Link" : "Create Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
