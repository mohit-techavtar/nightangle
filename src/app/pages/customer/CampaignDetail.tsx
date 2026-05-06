import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCampaigns } from "../../hooks/useCampaigns";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  GitBranch,
  Zap,
  Check,
  X,
  MoreVertical,
  Activity,
  BarChart3,
  Settings
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCampaignById, deleteCampaign, pauseCampaign, startCampaign, duplicateCampaign } = useCampaigns();

  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const campaign = id ? getCampaignById(id) : null;

  if (!campaign) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign not found</h2>
          <button
            onClick={() => navigate("/tenant/campaigns")}
            className="text-blue-600 hover:underline"
          >
            Return to campaigns
          </button>
        </div>
      </div>
    );
  }

  const performanceData = [
    { date: "Apr 15", sent: 67, delivered: 65, replied: 23, converted: 5 },
    { date: "Apr 16", sent: 89, delivered: 87, replied: 31, converted: 7 },
    { date: "Apr 17", sent: 76, delivered: 74, replied: 26, converted: 6 },
    { date: "Apr 18", sent: 94, delivered: 92, replied: 34, converted: 8 },
    { date: "Apr 19", sent: 82, delivered: 80, replied: 29, converted: 7 },
    { date: "Apr 20", sent: 98, delivered: 96, replied: 36, converted: 9 },
    { date: "Apr 21", sent: 105, delivered: 103, replied: 39, converted: 10 },
  ];

  const channelIcons = {
    "ai-calling": Phone,
    whatsapp: MessageCircle,
    sms: MessageSquare,
    email: Mail,
  };

  const getChannelIcon = (channel: string) => {
    return channelIcons[channel as keyof typeof channelIcons] || Activity;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-700 border-green-200",
      paused: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      draft: "bg-gray-100 text-gray-700 border-gray-200",
      scheduled: "bg-purple-100 text-purple-700 border-purple-200",
      archived: "bg-gray-100 text-gray-500 border-gray-200",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const handleDelete = () => {
    if (id) {
      deleteCampaign(id);
      setShowDeleteModal(false);
      navigate("/tenant/campaigns");
    }
  };

  const handlePause = () => {
    if (id) {
      pauseCampaign(id, "Manually paused by user");
      setShowActions(false);
    }
  };

  const handleResume = () => {
    if (id) {
      startCampaign(id);
      setShowActions(false);
    }
  };

  const handleDuplicate = () => {
    if (id) {
      const duplicated = duplicateCampaign(id);
      if (duplicated) {
        navigate(`/tenant/campaigns/${duplicated.id}/edit`);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/tenant/campaigns/${id}/edit`);
  };

  const conversionRate = campaign.progress.sent > 0
    ? ((campaign.progress.converted / campaign.progress.sent) * 100).toFixed(1)
    : "0";

  const completionPercentage = campaign.audienceSize > 0
    ? ((campaign.progress.sent / campaign.audienceSize) * 100).toFixed(1)
    : "0";

  const budgetPercentage = campaign.budget
    ? ((campaign.budget.spent / campaign.budget.totalCap) * 100).toFixed(1)
    : "0";

  const PrimaryChannelIcon = getChannelIcon(campaign.primaryChannel);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate("/tenant/campaigns")}
              className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{campaign.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded" title={campaign.primaryChannel}>
                    <PrimaryChannelIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  {campaign.fallbackChannels?.map((channel) => {
                    const Icon = getChannelIcon(channel);
                    return (
                      <div key={channel} className="p-1.5 bg-gray-100 rounded" title={channel}>
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                    );
                  })}
                </div>
                {campaign.aiConfig?.enabled && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 border border-purple-200 rounded text-purple-700 text-sm">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>AI Enabled</span>
                  </div>
                )}
              </div>
              {campaign.description && (
                <p className="mt-2 text-sm text-gray-600">{campaign.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {campaign.status === "active" && (
              <button
                onClick={handlePause}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            {campaign.status === "paused" && (
              <button
                onClick={handleResume}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Campaign
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/tenant/campaigns/${id}/budget`);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <DollarSign className="w-4 h-4" />
                    Manage Budget
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/tenant/campaigns/${id}/monitor`);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Activity className="w-4 h-4" />
                    Live Monitor
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      setShowActions(false);
                      setShowDeleteModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-lg border-t"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/tenant/campaigns/${id}/monitor`)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Live Monitor
          </button>
          <button
            onClick={() => navigate(`/tenant/campaigns/${id}/budget`)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Budget
          </button>
          <button
            onClick={() => navigate(`/tenant/campaigns/${id}/analytics`)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => navigate(`/tenant/campaigns/${id}/edit`)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Completion</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
              <div className="text-sm text-gray-500 mt-1">
                {campaign.progress.sent} / {campaign.audienceSize} reached
              </div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Conversion</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
              <div className="text-sm text-gray-500 mt-1">
                {campaign.progress.converted} conversions
              </div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Budget</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{budgetPercentage}%</div>
              <div className="text-sm text-gray-500 mt-1">
                {campaign.budget?.currency} {campaign.budget?.spent.toLocaleString()} spent
              </div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Status</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 capitalize">{campaign.status}</div>
              <div className="text-sm text-gray-500 mt-1">
                {campaign.startedAt ? new Date(campaign.startedAt).toLocaleDateString() : "Not started"}
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} name="Sent" />
                <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} name="Delivered" />
                <Line type="monotone" dataKey="replied" stroke="#F59E0B" strokeWidth={2} name="Replied" />
                <Line type="monotone" dataKey="converted" stroke="#8B5CF6" strokeWidth={2} name="Converted" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Campaign Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Information */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Campaign Type</span>
                  <span className="text-sm text-gray-900 font-medium capitalize">
                    {campaign.type.replace(/-/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Primary Channel</span>
                  <span className="text-sm text-gray-900 font-medium capitalize">
                    {campaign.primaryChannel.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Audience Size</span>
                  <span className="text-sm text-gray-900 font-medium">{campaign.audienceSize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Modified</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {new Date(campaign.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Automation Features */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Configuration</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-900">AI-Driven Logic</span>
                  </div>
                  {campaign.aiConfig?.enabled ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-900">Trigger-Based</span>
                  </div>
                  {campaign.triggers ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-900">Budget Control</span>
                  </div>
                  {campaign.budget ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-900">Multi-Channel</span>
                  </div>
                  {campaign.fallbackChannels && campaign.fallbackChannels.length > 0 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Campaign</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
