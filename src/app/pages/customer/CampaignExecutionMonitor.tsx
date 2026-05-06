import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCampaigns } from "../../hooks/useCampaigns";
import {
  ArrowLeft,
  Activity,
  Phone,
  MessageCircle,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from "lucide-react";

export function CampaignExecutionMonitor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCampaignById, pauseCampaign, startCampaign } = useCampaigns();

  const campaign = id ? getCampaignById(id) : null;
  const [autoRefresh, setAutoRefresh] = useState(true);

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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "ai-calling":
        return Phone;
      case "whatsapp":
        return MessageCircle;
      case "sms":
        return MessageSquare;
      case "email":
        return Mail;
      default:
        return Activity;
    }
  };

  const completionPercentage = campaign.audienceSize > 0
    ? (campaign.progress.sent / campaign.audienceSize) * 100
    : 0;

  const conversionRate = campaign.progress.sent > 0
    ? ((campaign.progress.converted / campaign.progress.sent) * 100).toFixed(2)
    : "0";

  const failureRate = campaign.progress.sent > 0
    ? ((campaign.progress.failed / campaign.progress.sent) * 100).toFixed(2)
    : "0";

  // Mock real-time activity log
  const activityLog = [
    { id: 1, timestamp: "2026-04-22 14:35:22", leadId: "lead_1234", leadName: "John Doe", channel: "ai-calling", action: "Call completed", outcome: "Interested", duration: "3m 24s" },
    { id: 2, timestamp: "2026-04-22 14:34:18", leadId: "lead_1235", leadName: "Sarah Smith", channel: "whatsapp", action: "Message sent", outcome: "Delivered" },
    { id: 3, timestamp: "2026-04-22 14:33:45", leadId: "lead_1236", leadName: "Mike Johnson", channel: "ai-calling", action: "Call failed", outcome: "No answer" },
    { id: 4, timestamp: "2026-04-22 14:32:10", leadId: "lead_1237", leadName: "Emma Wilson", channel: "sms", action: "SMS sent", outcome: "Delivered" },
    { id: 5, timestamp: "2026-04-22 14:31:05", leadId: "lead_1238", leadName: "David Brown", channel: "email", action: "Email sent", outcome: "Delivered" }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/tenant/campaigns/${id}`)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Live Execution Monitor</h1>
                {campaign.status === "active" && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                    <Activity className="w-3 h-3 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{campaign.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-gray-700">Auto-refresh</span>
            </label>
            <button
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {campaign.status === "active" ? (
              <button
                onClick={() => id && pauseCampaign(id)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <PauseCircle className="w-4 h-4" />
                Pause Campaign
              </button>
            ) : (
              <button
                onClick={() => id && startCampaign(id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Campaign
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Completion</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {completionPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {campaign.progress.sent} / {campaign.audienceSize} leads
              </div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Success Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {100 - parseFloat(failureRate)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {campaign.progress.delivered} delivered
              </div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Conversion</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
              <div className="text-sm text-gray-500 mt-1">
                {campaign.progress.converted} converted
              </div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Failures</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{campaign.progress.failed}</div>
              <div className="text-sm text-gray-500 mt-1">{failureRate}% failure rate</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Progress</h3>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {campaign.progress.sent.toLocaleString()} of {campaign.audienceSize.toLocaleString()} leads processed
              </span>
              <span className="font-medium text-gray-900">{completionPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {campaign.status === "paused" && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-yellow-900">Campaign Paused</div>
                  <div className="text-sm text-yellow-800 mt-1">
                    {campaign.pauseReason || "Campaign execution has been paused."}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Channel Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Channel Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { channel: "ai-calling", label: "AI Calling", sent: 234, success: 189, color: "blue" },
                { channel: "whatsapp", label: "WhatsApp", sent: 142, success: 138, color: "green" },
                { channel: "sms", label: "SMS", sent: 56, success: 54, color: "purple" },
                { channel: "email", label: "Email", sent: 24, success: 23, color: "orange" }
              ].map(({ channel, label, sent, success, color }) => {
                const Icon = getChannelIcon(channel);
                const successRate = sent > 0 ? ((success / sent) * 100).toFixed(1) : "0";

                return (
                  <div key={channel} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                      <span className="font-medium text-gray-900">{label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{sent}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {successRate}% success rate
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Activity Log */}
          <div className="bg-white rounded-lg border">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Live Activity Feed</h3>
              {campaign.status === "active" && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Updating in real-time
                </span>
              )}
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {activityLog.map(activity => {
                const Icon = getChannelIcon(activity.channel);
                const isSuccess = activity.outcome === "Delivered" || activity.outcome === "Interested";

                return (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full ${
                          isSuccess ? "bg-green-100" : "bg-gray-100"
                        } flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${
                            isSuccess ? "text-green-600" : "text-gray-600"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{activity.leadName}</span>
                            <span className="text-xs text-gray-500">({activity.leadId})</span>
                          </div>
                          <div className="text-sm text-gray-600">{activity.action}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              isSuccess
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {activity.outcome}
                            </span>
                            {activity.duration && (
                              <span className="text-xs text-gray-500">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {activity.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
