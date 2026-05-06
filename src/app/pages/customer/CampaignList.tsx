import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useCampaigns } from "../../hooks/useCampaigns";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Search, Filter, Edit, Trash2, Copy, Play, Pause, Eye,
  MoreVertical, PhoneCall, MessageCircle, MessageSquare, Mail,
  CheckCircle, Clock, XCircle, AlertCircle, Calendar, Users, TrendingUp
} from "lucide-react";

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: MessageCircle,
  "ai-calling": PhoneCall,
};

export function CampaignList() {
  const navigate = useNavigate();
  const { campaigns, deleteCampaign, pauseCampaign, startCampaign, duplicateCampaign } = useCampaigns();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: "bg-[#D1FAE5]", text: "text-[#065F46]", icon: Play },
      scheduled: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]", icon: Clock },
      draft: { bg: "bg-[#E5E7EB]", text: "text-[#374151]", icon: Edit },
      paused: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", icon: Pause },
      completed: { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", icon: CheckCircle },
      archived: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", icon: XCircle },
    };

    const badge = badges[status as keyof typeof badges] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`flex items-center gap-1 px-3 py-1 ${badge.bg} ${badge.text} text-xs font-semibold rounded-full`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      "sales-outreach": "Sales Outreach",
      "lead-qualification": "Lead Qualification",
      "follow-up-nurture": "Follow-up Nurture",
      "support-notification": "Support Notification",
      "collections": "Collections",
      "surveys-feedback": "Surveys & Feedback",
      "transactional-alerts": "Transactional Alerts",
    };
    return typeMap[type] || type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    setShowDeleteModal(null);
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateCampaign(id);
    if (duplicated) {
      navigate(`/tenant/campaigns/${duplicated.id}/edit`);
    }
  };

  const handlePause = (id: string) => {
    pauseCampaign(id, "Paused by user");
  };

  const handleStart = (id: string) => {
    startCampaign(id);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesChannel = channelFilter === "all" ||
      campaign.primaryChannel === channelFilter ||
      campaign.fallbackChannels?.includes(channelFilter as any);
    return matchesSearch && matchesStatus && matchesChannel;
  });

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">All Campaigns</h1>
              <p className="text-sm text-[#6B7280] mt-1">Manage and monitor all marketing campaigns</p>
            </div>
            <button
              onClick={() => navigate("/tenant/campaigns/create")}
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Campaign
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <div className="text-2xl font-bold text-[#0F1B2D]">{campaigns.length}</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Campaigns</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <div className="text-2xl font-bold text-[#10B981]">
                {campaigns.filter(c => c.status === "active").length}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Active</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <div className="text-2xl font-bold text-[#3B82F6]">
                {campaigns.filter(c => c.status === "scheduled").length}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Scheduled</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <div className="text-2xl font-bold text-[#9CA3AF]">
                {campaigns.filter(c => c.status === "draft").length}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Drafts</div>
            </div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
              <div className="text-2xl font-bold text-[#6B7280]">
                {campaigns.filter(c => c.status === "completed").length}
              </div>
              <div className="text-sm text-[#6B7280] mt-1">Completed</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <div className="flex flex-col gap-4">
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
                <button className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                  <Filter size={16} />
                  More Filters
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#6B7280]">Status:</span>
                {["all", "active", "scheduled", "draft", "paused", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-[#1565C0] text-white"
                        : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#6B7280]">Channel:</span>
                {["all", "email", "sms", "whatsapp", "ai-calling"].map((channel) => {
                  const Icon = channel !== "all" ? channelIcons[channel as keyof typeof channelIcons] : Filter;
                  return (
                    <button
                      key={channel}
                      onClick={() => setChannelFilter(channel)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        channelFilter === channel
                          ? "bg-[#1565C0] text-white"
                          : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      <Icon size={14} />
                      {channel === "ai-calling" ? "AI Calling" : channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </button>
                  );
                })}
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
                          {getTypeBadge(campaign.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {campaign.startedAt ? new Date(campaign.startedAt).toLocaleDateString() : "Not started"}
                            {campaign.endedAt && ` - ${new Date(campaign.endedAt).toLocaleDateString()}`}
                          </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                          <span>Channels:</span>
                          {[campaign.primaryChannel, ...(campaign.fallbackChannels || [])]
                            .filter(channel => channel)
                            .map((channel, idx) => {
                              const Icon = channelIcons[channel as keyof typeof channelIcons] || Mail;
                              const channelName = channel === "ai-calling"
                                ? "AI Call"
                                : channel?.charAt(0).toUpperCase() + channel?.slice(1);
                              return (
                                <div key={idx} className="flex items-center gap-1">
                                  <Icon size={14} />
                                  <span className="text-xs">{channelName}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-[#6B7280]" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => navigate(`/tenant/campaigns/${campaign.id}`)}
                          className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/tenant/campaigns/${campaign.id}/edit`)}
                          className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicate(campaign.id)}
                          className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                        >
                          <Copy size={14} />
                          Duplicate
                        </button>
                        {campaign.status === "active" && (
                          <button
                            onClick={() => handlePause(campaign.id)}
                            className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                          >
                            <Pause size={14} />
                            Pause
                          </button>
                        )}
                        {(campaign.status === "paused" || campaign.status === "draft") && (
                          <button
                            onClick={() => handleStart(campaign.id)}
                            className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2"
                          >
                            <Play size={14} />
                            {campaign.status === "draft" ? "Launch" : "Resume"}
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

                  {campaign.status !== "draft" && (
                    <div className="grid grid-cols-5 gap-4">
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Audience</span>
                        </div>
                        <div className="text-lg font-bold text-[#0F1B2D]">
                          {(campaign.audienceSize || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Sent</span>
                        </div>
                        <div className="text-lg font-bold text-[#0F1B2D]">
                          {(campaign.progress?.sent || 0).toLocaleString()}
                        </div>
                        {(campaign.audienceSize || 0) > 0 && (
                          <div className="text-xs text-[#3B82F6] mt-1">
                            {(((campaign.progress?.sent || 0) / (campaign.audienceSize || 1)) * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Converted</span>
                        </div>
                        <div className="text-lg font-bold text-[#10B981]">
                          {(campaign.progress?.converted || 0).toLocaleString()}
                        </div>
                        {(campaign.progress?.sent || 0) > 0 && (
                          <div className="text-xs text-[#10B981] mt-1">
                            {(((campaign.progress?.converted || 0) / (campaign.progress?.sent || 1)) * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="text-xs text-[#6B7280] mb-1">Budget</div>
                        <div className="text-lg font-bold text-[#0F1B2D]">
                          {campaign.budget ? `${campaign.budget.currency} ${(campaign.budget.totalCap || 0).toLocaleString()}` : "N/A"}
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="text-xs text-[#6B7280] mb-1">Spent</div>
                        <div className="text-lg font-bold text-[#F59E0B]">
                          {campaign.budget ? `${campaign.budget.currency} ${(campaign.budget.spent || 0).toLocaleString()}` : "N/A"}
                        </div>
                        {campaign.budget && (campaign.budget.totalCap || 0) > 0 && (
                          <div className="text-xs text-[#F59E0B] mt-1">
                            {(((campaign.budget.spent || 0) / (campaign.budget.totalCap || 1)) * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {campaign.status === "draft" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/tenant/campaigns/${campaign.id}/edit`)}
                        className="flex-1 px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors"
                      >
                        Complete Setup
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                        Preview
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
              <AlertCircle size={48} className="text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0F1B2D] mb-2">No campaigns found</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                {searchQuery || statusFilter !== "all" || channelFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first campaign"}
              </p>
              {!searchQuery && statusFilter === "all" && channelFilter === "all" && (
                <button
                  onClick={() => navigate("/tenant/campaigns/create")}
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
                Are you sure you want to delete this campaign? This action cannot be undone and all campaign data will be permanently removed.
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
