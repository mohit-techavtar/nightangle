import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Send, Eye, Edit, Trash2, Copy, Play, Pause, Filter, Search,
  MoreVertical, Calendar, Users, TrendingUp, Clock, CheckCircle, XCircle
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  status: "draft" | "scheduled" | "active" | "completed" | "paused";
  type: "one-time" | "recurring";
  sent: number;
  delivered: number;
  clicked: number;
  responses: number;
  failed: number;
  scheduled: string | null;
  created: string;
  audience: number;
}

const campaigns: Campaign[] = [
  {
    id: 1,
    name: "Summer Sale Promotion",
    status: "active",
    type: "one-time",
    sent: 4532,
    delivered: 4498,
    clicked: 892,
    responses: 234,
    failed: 34,
    scheduled: null,
    created: "2024-04-15",
    audience: 5000,
  },
  {
    id: 2,
    name: "Appointment Reminders",
    status: "active",
    type: "recurring",
    sent: 2341,
    delivered: 2298,
    clicked: 1876,
    responses: 456,
    failed: 43,
    scheduled: null,
    created: "2024-04-10",
    audience: 2500,
  },
  {
    id: 3,
    name: "Payment Due Alerts",
    status: "scheduled",
    type: "recurring",
    sent: 0,
    delivered: 0,
    clicked: 0,
    responses: 0,
    failed: 0,
    scheduled: "2024-04-20 10:00 AM",
    created: "2024-04-18",
    audience: 1800,
  },
  {
    id: 4,
    name: "Product Launch Announcement",
    status: "draft",
    type: "one-time",
    sent: 0,
    delivered: 0,
    clicked: 0,
    responses: 0,
    failed: 0,
    scheduled: null,
    created: "2024-04-17",
    audience: 3200,
  },
  {
    id: 5,
    name: "Customer Feedback Survey",
    status: "completed",
    type: "one-time",
    sent: 1876,
    delivered: 1854,
    clicked: 987,
    responses: 234,
    failed: 22,
    scheduled: null,
    created: "2024-04-05",
    audience: 2000,
  },
];

export function SMSCampaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  const getStatusBadge = (status: Campaign["status"]) => {
    const badges = {
      active: { bg: "bg-[#D1FAE5]", text: "text-[#065F46]", icon: CheckCircle },
      scheduled: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]", icon: Clock },
      draft: { bg: "bg-[#E5E7EB]", text: "text-[#374151]", icon: Edit },
      completed: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", icon: CheckCircle },
      paused: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", icon: Pause },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span className={`flex items-center gap-1 px-3 py-1 ${badge.bg} ${badge.text} text-xs font-semibold rounded-full`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleDelete = (id: number) => {
    console.log("Deleting campaign:", id);
    setShowDeleteModal(null);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS" },
          { label: "Campaigns" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">SMS Campaigns</h1>
              <p className="text-sm text-[#6B7280] mt-1">Create and manage SMS broadcast campaigns</p>
            </div>
            <button
              onClick={() => navigate("/tenant/sms/campaigns/create")}
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Campaign
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Send size={20} className="text-[#1565C0]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">{campaigns.length}</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Campaigns</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <CheckCircle size={20} className="text-[#10B981]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {campaigns.filter(c => c.status === "active").length}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Active Campaigns</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#F59E0B]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {campaigns.reduce((sum, c) => sum + c.sent, 0).toLocaleString()}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Total Sent</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <Users size={20} className="text-[#6366F1]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">
                {(
                  (campaigns.reduce((sum, c) => sum + c.responses, 0) /
                    campaigns.reduce((sum, c) => sum + c.delivered, 0)) *
                  100 || 0
                ).toFixed(1)}%
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Avg Response Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {["all", "active", "scheduled", "draft", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-[#1565C0] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg border border-[#E5E7EB] hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#0F1B2D]">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                        <span className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-full">
                          {campaign.type === "one-time" ? "One-Time" : "Recurring"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Created {campaign.created}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{campaign.audience.toLocaleString()} contacts</span>
                        </div>
                        {campaign.scheduled && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>Scheduled: {campaign.scheduled}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-[#6B7280]" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => navigate(`/tenant/sms/campaigns/${campaign.id}`)}
                          className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/tenant/sms/campaigns/${campaign.id}/edit`)}
                          className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                          <Copy size={14} />
                          Duplicate
                        </button>
                        {campaign.status === "active" && (
                          <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                            <Pause size={14} />
                            Pause
                          </button>
                        )}
                        {campaign.status === "paused" && (
                          <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                            <Play size={14} />
                            Resume
                          </button>
                        )}
                        {campaign.status === "draft" && (
                          <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                            <Send size={14} />
                            Launch
                          </button>
                        )}
                        <div className="border-t border-[#E5E7EB]"></div>
                        <button
                          onClick={() => setShowDeleteModal(campaign.id)}
                          className="w-full px-4 py-2 text-left text-sm text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {campaign.status !== "draft" && campaign.sent > 0 && (
                    <div className="grid grid-cols-5 gap-4">
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Send size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Sent</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.sent.toLocaleString()}</div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Delivered</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.delivered.toLocaleString()}</div>
                        <div className="text-xs text-[#10B981] mt-1">
                          {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Clicked</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.clicked.toLocaleString()}</div>
                        <div className="text-xs text-[#3B82F6] mt-1">
                          {((campaign.clicked / campaign.delivered) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Responses</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.responses.toLocaleString()}</div>
                        <div className="text-xs text-[#F59E0B] mt-1">
                          {((campaign.responses / campaign.delivered) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Failed</span>
                        </div>
                        <div className="text-xl font-bold text-[#EF4444]">{campaign.failed.toLocaleString()}</div>
                        <div className="text-xs text-[#EF4444] mt-1">
                          {((campaign.failed / campaign.sent) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {campaign.status === "scheduled" && (
                    <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-[#1565C0]" />
                          <span className="text-sm font-medium text-[#1E40AF]">
                            Scheduled for {campaign.scheduled}
                          </span>
                        </div>
                        <button className="px-3 py-1 bg-white border border-[#93C5FD] text-[#1E40AF] rounded text-xs font-medium hover:bg-[#EFF6FF] transition-colors">
                          Edit Schedule
                        </button>
                      </div>
                    </div>
                  )}

                  {campaign.status === "draft" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/tenant/sms/campaigns/${campaign.id}/edit`)}
                        className="flex-1 px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors"
                      >
                        Complete Setup
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                        Schedule
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
              <Send size={48} className="text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0F1B2D] mb-2">No campaigns found</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first SMS campaign"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <button
                  onClick={() => navigate("/tenant/sms/campaigns/create")}
                  className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors"
                >
                  Create Campaign
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#0F1B2D] mb-2">Delete Campaign</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Are you sure you want to delete this campaign? This action cannot be undone.
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
