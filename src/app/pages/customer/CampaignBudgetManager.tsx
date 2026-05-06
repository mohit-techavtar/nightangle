import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCampaigns } from "../../hooks/useCampaigns";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Save,
  Phone,
  MessageCircle,
  Mail,
  MessageSquare,
  PauseCircle,
  Activity
} from "lucide-react";

export function CampaignBudgetManager() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCampaignById, updateCampaign } = useCampaigns();

  const campaign = id ? getCampaignById(id) : null;

  const [budgetConfig, setBudgetConfig] = useState({
    totalCap: campaign?.budget?.totalCap || 0,
    dailyLimit: campaign?.budget?.dailyLimit || 0,
    perLeadLimit: campaign?.budget?.perLeadLimit || 0,
    channelSpecificCaps: campaign?.budget?.channelSpecificCaps || {
      "ai-calling": 0,
      "whatsapp": 0,
      "sms": 0,
      "email": 0
    },
    autoPauseOnLimit: campaign?.budget?.autoPauseOnLimit ?? true,
    currency: campaign?.budget?.currency || "INR"
  });

  const spent = campaign?.budget?.spent || 0;
  const remainingBudget = budgetConfig.totalCap - spent;
  const spendPercentage = budgetConfig.totalCap > 0 ? (spent / budgetConfig.totalCap) * 100 : 0;

  const handleSave = () => {
    if (id) {
      updateCampaign(id, {
        budget: {
          ...budgetConfig,
          spent,
          totalCap: budgetConfig.totalCap
        }
      });
      navigate(`/tenant/campaigns/${id}`);
    }
  };

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

  const channelLabels: Record<string, string> = {
    "ai-calling": "AI Calling",
    "whatsapp": "WhatsApp",
    "sms": "SMS",
    "email": "Email"
  };

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
              <h1 className="text-2xl font-semibold">Budget & Cost Control</h1>
              <p className="text-sm text-gray-500 mt-1">{campaign.name}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Total Budget</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {budgetConfig.currency} {budgetConfig.totalCap.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Campaign cap</div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Spent</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {budgetConfig.currency} {spent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {spendPercentage.toFixed(1)}% of budget
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${
                  remainingBudget < budgetConfig.totalCap * 0.2 ? "bg-red-50" : "bg-purple-50"
                } flex items-center justify-center`}>
                  {remainingBudget < budgetConfig.totalCap * 0.2 ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-500">Remaining</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {budgetConfig.currency} {remainingBudget.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Available to spend</div>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Utilization</h3>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {budgetConfig.currency} {spent.toLocaleString()} / {budgetConfig.totalCap.toLocaleString()}
              </span>
              <span className="font-medium text-gray-900">{spendPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  spendPercentage >= 90
                    ? "bg-red-600"
                    : spendPercentage >= 75
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
                style={{ width: `${Math.min(spendPercentage, 100)}%` }}
              />
            </div>
            {spendPercentage >= 90 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-red-900">Budget Alert</div>
                  <div className="text-sm text-red-800 mt-1">
                    You've used {spendPercentage.toFixed(1)}% of your budget. Campaign will auto-pause when limit is reached.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Budget Configuration */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Limits</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget Cap *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{budgetConfig.currency}</span>
                  <input
                    type="number"
                    value={budgetConfig.totalCap}
                    onChange={(e) => setBudgetConfig({
                      ...budgetConfig,
                      totalCap: parseInt(e.target.value) || 0
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum total spend allowed for this campaign
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Spend Limit
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{budgetConfig.currency}</span>
                  <input
                    type="number"
                    value={budgetConfig.dailyLimit}
                    onChange={(e) => setBudgetConfig({
                      ...budgetConfig,
                      dailyLimit: parseInt(e.target.value) || 0
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum spend per day (0 for no limit)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per-Lead Spend Limit
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{budgetConfig.currency}</span>
                  <input
                    type="number"
                    value={budgetConfig.perLeadLimit}
                    onChange={(e) => setBudgetConfig({
                      ...budgetConfig,
                      perLeadLimit: parseInt(e.target.value) || 0
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum spend per individual lead (0 for no limit)
                </p>
              </div>
            </div>
          </div>

          {/* Channel-Specific Caps */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Channel-Specific Budget Caps</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(channelLabels).map(([channel, label]) => {
                const Icon = getChannelIcon(channel);
                return (
                  <div key={channel} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{budgetConfig.currency}</span>
                      <input
                        type="number"
                        value={budgetConfig.channelSpecificCaps[channel as keyof typeof budgetConfig.channelSpecificCaps]}
                        onChange={(e) => setBudgetConfig({
                          ...budgetConfig,
                          channelSpecificCaps: {
                            ...budgetConfig.channelSpecificCaps,
                            [channel]: parseInt(e.target.value) || 0
                          }
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Set 0 for no channel-specific limit. Total across all channels cannot exceed campaign budget.
            </p>
          </div>

          {/* Enforcement Rules */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Enforcement</h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={budgetConfig.autoPauseOnLimit}
                  onChange={(e) => setBudgetConfig({
                    ...budgetConfig,
                    autoPauseOnLimit: e.target.checked
                  })}
                  className="mt-1 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <PauseCircle className="w-4 h-4" />
                    Auto-pause campaign when budget limit reached
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Campaign will automatically pause when total budget cap is reached.
                    Pending actions will be cancelled and admin will be notified.
                  </div>
                </div>
              </label>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-yellow-900">Budget Policy</div>
                    <div className="text-sm text-yellow-800 mt-1">
                      No soft overages are allowed. When any budget limit is reached, the campaign will
                      automatically pause unless explicitly overridden by an authorized user.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
