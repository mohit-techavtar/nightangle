import { useState } from "react";
import { useNavigate } from "react-router";
import { useEmail } from "../../hooks/useEmail";
import {
  Plus,
  Filter,
  Search,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Users,
  MousePointer,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Calendar
} from "lucide-react";

export function EmailCampaigns() {
  const navigate = useNavigate();
  const { campaigns, startCampaign, pauseCampaign, deleteCampaign } = useEmail();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      scheduled: "bg-blue-100 text-blue-700",
      paused: "bg-yellow-100 text-yellow-700",
      completed: "bg-gray-100 text-gray-700",
      draft: "bg-gray-100 text-gray-500"
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      broadcast: "Broadcast",
      drip: "Drip/Nurture",
      "event-triggered": "Event-Triggered",
      transactional: "Transactional",
      "call-to-email": "Call-to-Email"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    setShowDeleteModal(null);
    setShowActionMenu(null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Email Campaigns</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage email campaigns</p>
          </div>
          <button
            onClick={() => navigate("/tenant/email/campaigns/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Campaign List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {filteredCampaigns.map(campaign => {
            const openRate = campaign.progress.sent > 0
              ? ((campaign.progress.opened / campaign.progress.sent) * 100).toFixed(1)
              : "0";
            const clickRate = campaign.progress.sent > 0
              ? ((campaign.progress.clicked / campaign.progress.sent) * 100).toFixed(1)
              : "0";
            const conversionRate = campaign.progress.sent > 0
              ? ((campaign.progress.converted / campaign.progress.sent) * 100).toFixed(1)
              : "0";

            return (
              <div key={campaign.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusBadge(campaign.status)}`}>
                        {campaign.status}
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-purple-50 text-purple-700">
                        {getTypeLabel(campaign.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {campaign.audienceSize.toLocaleString()} recipients
                      </div>
                      {campaign.schedule?.startDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(campaign.schedule.startDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    {campaign.status === "active" && (
                      <button
                        onClick={() => pauseCampaign(campaign.id)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Pause"
                      >
                        <Pause className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    {(campaign.status === "paused" || campaign.status === "scheduled") && (
                      <button
                        onClick={() => startCampaign(campaign.id)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Start"
                      >
                        <Play className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/tenant/email/campaigns/${campaign.id}/edit`)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === campaign.id ? null : campaign.id)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {showActionMenu === campaign.id && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                        <button
                          onClick={() => {
                            setShowDeleteModal(campaign.id);
                            setShowActionMenu(null);
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

                {/* Progress */}
                {campaign.status !== "draft" && campaign.progress.sent > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress: {campaign.progress.sent.toLocaleString()}/{campaign.audienceSize.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {((campaign.progress.sent / campaign.audienceSize) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(campaign.progress.sent / campaign.audienceSize) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats */}
                {campaign.status !== "draft" && campaign.progress.sent > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Sent</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {campaign.progress.sent.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Delivered</div>
                      <div className="text-lg font-semibold text-green-600">
                        {campaign.progress.delivered.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Opened</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {campaign.progress.opened.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">({openRate}%)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Clicked</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {campaign.progress.clicked.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">({clickRate}%)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Replied</div>
                      <div className="text-lg font-semibold text-orange-600">
                        {campaign.progress.replied.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Converted</div>
                      <div className="text-lg font-semibold text-green-600">
                        {campaign.progress.converted.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">({conversionRate}%)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Draft State */}
                {campaign.status === "draft" && (
                  <div className="text-center py-4 border-t">
                    <button
                      onClick={() => navigate(`/tenant/email/campaigns/${campaign.id}/edit`)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Complete Setup →
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredCampaigns.length === 0 && (
            <div className="bg-white rounded-lg border p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first email campaign"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <button
                  onClick={() => navigate("/tenant/email/campaigns/create")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Create Campaign
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Campaign</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this campaign? This action cannot be undone.
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
