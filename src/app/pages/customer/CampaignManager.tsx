import { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus,
  LayoutGrid,
  Table2,
  Filter,
  ChevronDown,
  Calendar,
  Play,
  Pause,
  Edit,
  BarChart3,
  MoreVertical,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Copy,
  X,
  MessageCircle,
  MessageSquare,
  Mail,
  PhoneCall,
  Layers,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCampaigns, Campaign } from "../../hooks/useCampaigns";

export function CampaignManager() {
  const navigate = useNavigate();
  const {
    campaigns,
    startCampaign,
    pauseCampaign,
    deleteCampaign,
    duplicateCampaign,
    getStats
  } = useCampaigns();

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showPauseModal, setShowPauseModal] = useState<Campaign | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Campaign | null>(null);
  const [pauseReasonInput, setPauseReasonInput] = useState("");

  const stats = getStats();

  const handleCreateCampaign = () => {
    navigate("/tenant/campaigns/create");
  };

  const handleStartCampaign = (campaign: Campaign) => {
    startCampaign(campaign.id);
    setShowActionMenu(null);
  };

  const handlePauseCampaign = (campaign: Campaign) => {
    setShowPauseModal(campaign);
    setShowActionMenu(null);
  };

  const confirmPauseCampaign = () => {
    if (showPauseModal) {
      pauseCampaign(showPauseModal.id, pauseReasonInput || "Paused by user");
      setShowPauseModal(null);
      setPauseReasonInput("");
    }
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setShowDeleteModal(campaign);
    setShowActionMenu(null);
  };

  const confirmDeleteCampaign = () => {
    if (showDeleteModal) {
      deleteCampaign(showDeleteModal.id);
      setShowDeleteModal(null);
    }
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    duplicateCampaign(campaign.id);
    setShowActionMenu(null);
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    navigate(`/tenant/campaigns/${campaign.id}/analytics`);
  };

  const handleViewDetails = (campaignId: string) => {
    navigate(`/tenant/campaigns/${campaignId}`);
  };

  const handleEditCampaign = (campaignId: string) => {
    navigate(`/tenant/campaigns/${campaignId}/edit`);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const getCampaignTypeIcon = (type: Campaign["type"]) => {
    switch (type) {
      case "ai-calling":
        return PhoneCall;
      case "whatsapp":
        return MessageCircle;
      case "sms":
        return MessageSquare;
      case "email":
        return Mail;
      case "multi-channel":
        return Layers;
      default:
        return Bot;
    }
  };

  const getCampaignTypeColor = (type: Campaign["type"]) => {
    switch (type) {
      case "ai-calling":
        return "#6366F1";
      case "whatsapp":
        return "#25D366";
      case "sms":
        return "#10B981";
      case "email":
        return "#1565C0";
      case "multi-channel":
        return "#F59E0B";
      default:
        return "#9CA3AF";
    }
  };

  const getLeftBorderColor = (campaign: Campaign) => {
    if (campaign.status === "active") return "#10B981";
    if (campaign.status === "paused") return "#F59E0B";
    if (campaign.status === "scheduled") return "#3B82F6";
    if (campaign.status === "completed") return "#9CA3AF";
    return "#D1D5DB";
  };

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <div className="relative">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            Active
          </div>
        );
      case "paused":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Pause className="w-3 h-3" />
            Paused
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </div>
        );
      case "draft":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
            Draft
          </div>
        );
      case "scheduled":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Scheduled
          </div>
        );
    }
  };

  const getProgressPercentage = (campaign: Campaign) => {
    return Math.round((campaign.progress.current / campaign.progress.total) * 100);
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "AI Campaigns" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />
      <div className="flex-1 overflow-y-auto p-6">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">AI Campaigns</h1>
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {filteredCampaigns.length}
              </span>
            </div>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
              onClick={handleCreateCampaign}
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </button>
          </div>

          {/* FILTER BAR */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("card")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "card"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Card View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Table2 className="w-4 h-4" />
                Table View
              </button>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {["all", "active", "paused", "completed", "draft", "scheduled"].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                Type: {typeFilter === "all" ? "All" : typeFilter.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {["all", "ai-calling", "whatsapp", "sms", "email", "multi-channel"].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setTypeFilter(type);
                        setShowTypeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {type === "all" ? "All Types" : type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="relative">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                All Time
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CAMPAIGN CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCampaigns.map((campaign) => {
            const TypeIcon = getCampaignTypeIcon(campaign.type);
            const typeColor = getCampaignTypeColor(campaign.type);
            const leftBorderColor = getLeftBorderColor(campaign);
            const progressPercentage = campaign.audienceSize > 0
              ? Math.round((campaign.progress.sent / campaign.audienceSize) * 100)
              : 0;
            const conversionRate = campaign.progress.sent > 0
              ? ((campaign.progress.converted / campaign.progress.sent) * 100).toFixed(1)
              : "0";

            return (
              <div
                key={campaign.id}
                className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  campaign.status === "draft" ? "border-dashed" : ""
                }`}
                style={{ borderLeftWidth: "4px", borderLeftColor: leftBorderColor }}
                onClick={() => handleViewDetails(campaign.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${typeColor}20` }}>
                        <TypeIcon className="w-4 h-4" style={{ color: typeColor }} />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {campaign.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(campaign.status)}
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                        {campaign.type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 relative">
                    {campaign.status === "paused" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCampaign(campaign);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Resume"
                      >
                        <Play className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    {(campaign.status === "active" || campaign.status === "scheduled") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePauseCampaign(campaign);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Pause"
                      >
                        <Pause className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(campaign.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCampaign(campaign.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    {campaign.status !== "draft" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAnalytics(campaign);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Analytics"
                      >
                        <BarChart3 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === campaign.id ? null : campaign.id);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title="More"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    {showActionMenu === campaign.id && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateCampaign(campaign);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCampaign(campaign);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
              </div>

                {/* Description */}
                {campaign.description && (
                  <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                )}

                {/* Pause Reason */}
                {campaign.pauseReason && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-700">{campaign.pauseReason}</span>
                  </div>
                )}

                {/* Scheduled Date */}
                {campaign.schedule?.startDate && campaign.status === "scheduled" && (
                  <div className="mb-3 text-sm text-blue-700 font-medium">
                    Starts {new Date(campaign.schedule.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {campaign.schedule.time && ` at ${campaign.schedule.time}`}
                  </div>
                )}

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {campaign.progress.sent}/{campaign.audienceSize} reached
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: leftBorderColor,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Draft State */}
                {campaign.status === "draft" && (
                  <div className="text-center py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCampaign(campaign.id);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Complete Setup →
                    </button>
                  </div>
                )}

                {/* Metrics */}
                {campaign.status !== "draft" && campaign.status !== "scheduled" && (
                  <div className="grid grid-cols-3 gap-4 mb-3 pb-3 border-b border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Delivered</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {campaign.progress.delivered.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Replied</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {campaign.progress.replied.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Converted</div>
                      <div className="text-sm font-semibold text-green-600">
                        {campaign.progress.converted.toLocaleString()} ({conversionRate}%)
                      </div>
                    </div>
                    {campaign.metrics.connectRate !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Connect Rate</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {campaign.metrics.connectRate}%
                        </div>
                      </div>
                    )}
                    {campaign.metrics.avgDuration && (
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Avg Duration</div>
                        <div className="text-sm font-semibold text-gray-900 font-mono">
                          {campaign.metrics.avgDuration}
                        </div>
                      </div>
                    )}
                    {campaign.metrics.roi !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">ROI</div>
                        <div className="text-sm font-semibold text-green-600">
                          {campaign.metrics.roi}%
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Channel Info */}
                {campaign.channels.aiCalling && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">AI Agent:</span> {campaign.channels.aiCalling.agentName}
                    </span>
                  </div>
                )}

                {/* Schedule Info */}
                {campaign.schedule && campaign.schedule.type === "recurring" && (
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {campaign.schedule.frequency?.charAt(0).toUpperCase() + campaign.schedule.frequency?.slice(1)}
                      {campaign.schedule.time && ` • ${campaign.schedule.time}`}
                    </span>
                  </div>
                )}

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {campaign.startedAt && `Started ${new Date(campaign.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    {campaign.status === "draft" && `Created ${new Date(campaign.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  </div>
                  {campaign.budget && (
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">Budget:</span>{" "}
                      <span className="font-mono">
                        {campaign.budget.currency} {campaign.budget.spent.toLocaleString()}/
                        {campaign.budget.total.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pause Campaign</h3>
              <button
                onClick={() => setShowPauseModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to pause "{showPauseModal.name}"? You can provide a reason for pausing.
            </p>
            <textarea
              value={pauseReasonInput}
              onChange={(e) => setPauseReasonInput(e.target.value)}
              placeholder="Reason for pausing (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPauseCampaign}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Pause Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Campaign</h3>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{showDeleteModal.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCampaign}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
