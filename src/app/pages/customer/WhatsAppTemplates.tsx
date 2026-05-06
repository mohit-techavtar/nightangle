import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Search, Filter, Copy, Edit, Trash2, Eye, CheckCircle, Clock, XCircle
} from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Order Confirmation",
    category: "Transactional",
    language: "English",
    status: "approved",
    uses: 2341,
    content: "Hi {{1}}, your order #{{2}} has been confirmed! Expected delivery: {{3}}. Track: {{4}}",
    approvedDate: "2024-04-01",
  },
  {
    id: 2,
    name: "Payment Reminder",
    category: "Transactional",
    language: "English",
    status: "approved",
    uses: 1876,
    content: "Hello {{1}}, this is a reminder that payment for invoice #{{2}} is due on {{3}}. Amount: {{4}}",
    approvedDate: "2024-03-28",
  },
  {
    id: 3,
    name: "Summer Sale Announcement",
    category: "Marketing",
    language: "English",
    status: "pending",
    uses: 0,
    content: "Hi {{1}}! Our Summer Sale is here! Get {{2}}% off on all products. Shop now: {{3}}",
    approvedDate: null,
  },
  {
    id: 4,
    name: "Appointment Reminder",
    category: "Utility",
    language: "English",
    status: "approved",
    uses: 892,
    content: "Hi {{1}}, this is a reminder for your appointment on {{2}} at {{3}}. Reply YES to confirm or NO to reschedule.",
    approvedDate: "2024-04-05",
  },
  {
    id: 5,
    name: "Product Launch",
    category: "Marketing",
    language: "English",
    status: "rejected",
    uses: 0,
    content: "Exciting news! Check out our new product {{1}}. Limited time offer!",
    approvedDate: null,
  },
];

export function WhatsAppTemplates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold rounded-full">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-[#FEF3C7] text-[#92400E] text-xs font-semibold rounded-full">
            <Clock size={12} />
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold rounded-full">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "WhatsApp" },
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Message Templates</h1>
              <p className="text-sm text-[#6B7280] mt-1">Manage WhatsApp approved message templates</p>
            </div>
            <button
              onClick={() => navigate("/tenant/whatsapp/templates/create")}
              className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Template
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#0F1B2D]">5</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Templates</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#10B981]">3</div>
              <div className="text-sm text-[#6B7280] mt-1">Approved</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#F59E0B]">1</div>
              <div className="text-sm text-[#6B7280] mt-1">Pending Review</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="text-2xl font-bold text-[#EF4444]">1</div>
              <div className="text-sm text-[#6B7280] mt-1">Rejected</div>
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
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "all"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("approved")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "approved"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "pending"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>

          {/* Templates List */}
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg border border-[#E5E7EB] hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#0F1B2D]">{template.name}</h3>
                        {getStatusBadge(template.status)}
                        <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-full">
                          {template.category}
                        </span>
                        <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-full">
                          {template.language}
                        </span>
                      </div>
                      {template.status === "approved" && (
                        <div className="text-sm text-[#6B7280] mb-3">
                          Used {template.uses.toLocaleString()} times • Approved on {template.approvedDate}
                        </div>
                      )}
                      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 font-mono text-sm text-[#374151]">
                        {template.content}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors" title="Preview">
                        <Eye size={18} className="text-[#6B7280]" />
                      </button>
                      {template.status === "approved" && (
                        <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors" title="Duplicate">
                          <Copy size={18} className="text-[#6B7280]" />
                        </button>
                      )}
                      {template.status !== "approved" && (
                        <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors" title="Edit">
                          <Edit size={18} className="text-[#6B7280]" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </div>

                  {template.status === "rejected" && (
                    <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-3">
                      <div className="text-sm font-medium text-[#991B1B] mb-1">Rejection Reason</div>
                      <div className="text-sm text-[#B91C1C]">
                        Template does not comply with WhatsApp messaging policy. Promotional content must include opt-out option.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
