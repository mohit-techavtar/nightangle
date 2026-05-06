import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useCampaigns } from "../../hooks/useCampaigns";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  Check,
  AlertCircle,
  Calendar,
  Users,
  DollarSign,
  Zap,
  GitBranch,
  Clock,
  Target,
  Plus,
  X,
  ChevronRight,
  Play,
  Sparkles,
  Info,
  Save
} from "lucide-react";

export function CreateOmniCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCampaignById, createCampaign, updateCampaign } = useCampaigns();

  const isEditMode = !!id;
  const existingCampaign = isEditMode && id ? getCampaignById(id) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Campaign Basics
  const [campaignName, setCampaignName] = useState(existingCampaign?.name || "");
  const [campaignType, setCampaignType] = useState<string>(existingCampaign?.type || "sales-outreach");
  const [description, setDescription] = useState(existingCampaign?.description || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Step 2: Channel Configuration
  const [primaryChannel, setPrimaryChannel] = useState<"ai-calling" | "whatsapp" | "sms" | "email">(
    existingCampaign?.primaryChannel || "email"
  );
  const [fallbackChannels, setFallbackChannels] = useState<("ai-calling" | "whatsapp" | "sms" | "email")[]>(
    existingCampaign?.fallbackChannels || []
  );

  // Step 3: Audience
  const [audienceSize, setAudienceSize] = useState(existingCampaign?.audienceSize || 0);
  const [segmentType, setSegmentType] = useState<"all" | "segment" | "custom">("all");

  // Step 4: Budget & Schedule
  const [budgetEnabled, setBudgetEnabled] = useState(!!existingCampaign?.budget);
  const [totalBudget, setTotalBudget] = useState(existingCampaign?.budget?.totalCap?.toString() || "");
  const [dailyLimit, setDailyLimit] = useState(existingCampaign?.budget?.dailyLimit?.toString() || "");
  const [perLeadLimit, setPerLeadLimit] = useState(existingCampaign?.budget?.perLeadLimit?.toString() || "");
  const [currency, setCurrency] = useState(existingCampaign?.budget?.currency || "USD");

  // Step 5: AI & Automation
  const [aiEnabled, setAiEnabled] = useState(!!existingCampaign?.aiConfig?.enabled);
  const [triggerType, setTriggerType] = useState<string>(existingCampaign?.triggers?.type || "manual");

  const steps = [
    { num: 1, name: "Basics", icon: Target },
    { num: 2, name: "Channels", icon: MessageSquare },
    { num: 3, name: "Audience", icon: Users },
    { num: 4, name: "Budget", icon: DollarSign },
    { num: 5, name: "Automation", icon: GitBranch },
    { num: 6, name: "Review", icon: Check },
  ];

  const campaignTypes = [
    { value: "sales-outreach", label: "Sales Outreach", desc: "Reach new prospects" },
    { value: "lead-qualification", label: "Lead Qualification", desc: "Qualify and score leads" },
    { value: "follow-up-nurture", label: "Follow-up Nurture", desc: "Nurture existing leads" },
    { value: "support-notification", label: "Support Notification", desc: "Customer support alerts" },
    { value: "collections", label: "Collections", desc: "Payment reminders" },
    { value: "surveys-feedback", label: "Surveys & Feedback", desc: "Gather feedback" },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!campaignName.trim()) newErrors.campaignName = "Campaign name is required";
      if (!campaignType) newErrors.campaignType = "Campaign type is required";
    }

    if (step === 2) {
      if (!primaryChannel) newErrors.primaryChannel = "Primary channel is required";
    }

    if (step === 3) {
      if (audienceSize <= 0) newErrors.audienceSize = "Audience size must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const campaignData = {
        name: campaignName,
        type: campaignType as any,
        description,
        primaryChannel,
        fallbackChannels,
        audienceSize: audienceSize || 0,
        status: "draft" as const,
        budget: budgetEnabled ? {
          totalCap: parseFloat(totalBudget) || 0,
          dailyLimit: parseFloat(dailyLimit) || 0,
          perLeadLimit: parseFloat(perLeadLimit) || 0,
          currency,
          spent: 0,
          channelSpecificCaps: {},
          autoPauseOnLimit: true
        } : undefined,
        aiConfig: aiEnabled ? {
          enabled: true,
          capabilities: [],
          guardrails: {}
        } : undefined,
        triggers: triggerType !== "manual" ? {
          type: triggerType as any,
          config: {}
        } : undefined
      };

      if (isEditMode && id) {
        updateCampaign(id, campaignData);
      } else {
        const newCampaign = createCampaign(campaignData);
        navigate(`/tenant/campaigns/${newCampaign.id}`);
        return;
      }
      navigate("/tenant/campaigns");
    } catch (error) {
      console.error("Failed to save campaign:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLaunch = async () => {
    if (!validateStep(currentStep)) return;

    setIsSaving(true);
    try {
      const campaignData = {
        name: campaignName,
        type: campaignType as any,
        description,
        primaryChannel,
        fallbackChannels,
        audienceSize: audienceSize || 1000,
        status: "active" as const,
        budget: budgetEnabled ? {
          totalCap: parseFloat(totalBudget) || 0,
          dailyLimit: parseFloat(dailyLimit) || 0,
          perLeadLimit: parseFloat(perLeadLimit) || 0,
          currency,
          spent: 0,
          channelSpecificCaps: {},
          autoPauseOnLimit: true
        } : undefined,
        aiConfig: aiEnabled ? {
          enabled: true,
          capabilities: ["natural-conversation", "objection-handling"],
          guardrails: {
            maxCallDuration: 600,
            prohibitedTopics: []
          }
        } : undefined,
        triggers: triggerType !== "manual" ? {
          type: triggerType as any,
          config: {}
        } : undefined
      };

      if (isEditMode && id) {
        updateCampaign(id, campaignData);
        navigate(`/tenant/campaigns/${id}`);
      } else {
        const newCampaign = createCampaign(campaignData);
        navigate(`/tenant/campaigns/${newCampaign.id}`);
      }
    } catch (error) {
      console.error("Failed to launch campaign:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFallbackChannel = (channel: typeof fallbackChannels[number]) => {
    if (fallbackChannels.includes(channel)) {
      setFallbackChannels(fallbackChannels.filter(c => c !== channel));
    } else {
      setFallbackChannels([...fallbackChannels, channel]);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "ai-calling": return Phone;
      case "whatsapp": return MessageCircle;
      case "sms": return MessageSquare;
      case "email": return Mail;
      default: return Mail;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "ai-calling": return "text-purple-600 bg-purple-50 border-purple-200";
      case "whatsapp": return "text-green-600 bg-green-50 border-green-200";
      case "sms": return "text-blue-600 bg-blue-50 border-blue-200";
      case "email": return "text-indigo-600 bg-indigo-50 border-indigo-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.campaignName ? "border-red-500" : "border-gray-300"
                } rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="e.g., Q2 Product Launch Campaign"
              />
              {errors.campaignName && (
                <p className="mt-1 text-sm text-red-600">{errors.campaignName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Campaign Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {campaignTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setCampaignType(type.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      campaignType === type.value
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`font-medium text-sm mb-1 ${
                      campaignType === type.value ? "text-blue-900" : "text-gray-900"
                    }`}>
                      {type.label}
                    </div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
              {errors.campaignType && (
                <p className="mt-1 text-sm text-red-600">{errors.campaignType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief description of campaign goals and strategy..."
              />
            </div>
          </div>
        );

      case 2:
        const channels = [
          { value: "email", label: "Email", desc: "Rich content, templates, tracking" },
          { value: "sms", label: "SMS", desc: "High open rate, instant delivery" },
          { value: "whatsapp", label: "WhatsApp", desc: "Two-way conversations, media" },
          { value: "ai-calling", label: "AI Calling", desc: "Personal touch, high engagement" },
        ] as const;

        return (
          <div className="space-y-6">
            {errors.primaryChannel && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{errors.primaryChannel}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Primary Channel *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {channels.map((channel) => {
                  const Icon = getChannelIcon(channel.value);
                  const isPrimary = primaryChannel === channel.value;

                  return (
                    <button
                      key={channel.value}
                      onClick={() => setPrimaryChannel(channel.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isPrimary
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${isPrimary ? "bg-blue-500" : "bg-gray-100"}`}>
                          <Icon className={`w-5 h-5 ${isPrimary ? "text-white" : "text-gray-600"}`} />
                        </div>
                        <div className="text-left flex-1">
                          <div className={`font-medium text-sm ${isPrimary ? "text-blue-900" : "text-gray-900"}`}>
                            {channel.label}
                          </div>
                          <div className="text-xs text-gray-500">{channel.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fallback Channels (Optional)
              </label>
              <div className="text-xs text-gray-500 mb-3 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5" />
                <span>Select backup channels to use if the primary channel fails</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {channels.filter(c => c.value !== primaryChannel).map((channel) => {
                  const Icon = getChannelIcon(channel.value);
                  const isSelected = fallbackChannels.includes(channel.value);

                  return (
                    <button
                      key={channel.value}
                      onClick={() => toggleFallbackChannel(channel.value)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-green-500" : "bg-gray-100"}`}>
                          <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-600"}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${isSelected ? "text-green-900" : "text-gray-900"}`}>
                            {channel.label}
                          </div>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Audience Targeting
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "all", label: "All Leads", desc: "Target all available leads" },
                  { value: "segment", label: "Segment", desc: "Pre-defined segment" },
                  { value: "custom", label: "Custom", desc: "Build custom filters" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSegmentType(type.value as any)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      segmentType === type.value
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`font-medium text-sm mb-1 ${
                      segmentType === type.value ? "text-blue-900" : "text-gray-900"
                    }`}>
                      {type.label}
                    </div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audience Size *
              </label>
              <input
                type="number"
                value={audienceSize}
                onChange={(e) => setAudienceSize(parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.audienceSize ? "border-red-500" : "border-gray-300"
                } rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="e.g., 1000"
                min="1"
              />
              {errors.audienceSize && (
                <p className="mt-1 text-sm text-red-600">{errors.audienceSize}</p>
              )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Estimated Reach</span>
                </div>
                <span className="text-2xl font-bold text-blue-900">
                  {audienceSize.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Budget Control</h3>
                <p className="text-sm text-gray-500">Set spending limits for this campaign</p>
              </div>
              <button
                onClick={() => setBudgetEnabled(!budgetEnabled)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  budgetEnabled
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {budgetEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {budgetEnabled && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget
                    </label>
                    <input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Limit
                    </label>
                    <input
                      type="number"
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per Lead Limit
                    </label>
                    <input
                      type="number"
                      value={perLeadLimit}
                      onChange={(e) => setPerLeadLimit(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">AI-Powered Automation</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Use AI to personalize campaign flow and optimize engagement
                </p>
              </div>
              <button
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  aiEnabled
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {aiEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Trigger Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "manual", label: "Manual", desc: "Start manually when ready" },
                  { value: "scheduled", label: "Scheduled", desc: "Start at specific time" },
                  { value: "lead-creation", label: "Lead Created", desc: "Trigger on new leads" },
                  { value: "stage-change", label: "Stage Change", desc: "Trigger on stage updates" },
                ].map((trigger) => (
                  <button
                    key={trigger.value}
                    onClick={() => setTriggerType(trigger.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      triggerType === trigger.value
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`font-medium text-sm mb-1 ${
                      triggerType === trigger.value ? "text-blue-900" : "text-gray-900"
                    }`}>
                      {trigger.label}
                    </div>
                    <div className="text-xs text-gray-500">{trigger.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {aiEnabled && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">AI Capabilities Included</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700 ml-7">
                  <li>• Natural conversation flow</li>
                  <li>• Objection handling</li>
                  <li>• Sentiment analysis</li>
                  <li>• Personalized messaging</li>
                  <li>• Optimal timing prediction</li>
                </ul>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-green-900">Campaign Ready to {isEditMode ? "Update" : "Launch"}</h3>
              </div>
              <p className="text-sm text-green-700">
                Review the details below and click "{isEditMode ? "Update" : "Launch"} Campaign" to start.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Campaign Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm text-gray-900 font-medium">{campaignName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm text-gray-900 capitalize">
                      {campaignTypes.find(t => t.value === campaignType)?.label}
                    </span>
                  </div>
                  {description && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Description:</p>
                      <p className="text-sm text-gray-900">{description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Channels</h3>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getChannelColor(primaryChannel)}`}>
                    {(() => {
                      const Icon = getChannelIcon(primaryChannel);
                      return <Icon className="w-4 h-4" />;
                    })()}
                    <span className="text-sm font-medium capitalize">{primaryChannel.replace('-', ' ')}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-white/50 rounded">Primary</span>
                  </div>
                  {fallbackChannels.map((channel) => {
                    const Icon = getChannelIcon(channel);
                    return (
                      <div key={channel} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getChannelColor(channel)}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm capitalize">{channel.replace('-', ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Audience</h3>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estimated Reach:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {audienceSize.toLocaleString()}
                  </span>
                </div>
              </div>

              {budgetEnabled && totalBudget && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Budget</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Budget:</span>
                      <span className="text-sm text-gray-900 font-medium">{currency} {totalBudget}</span>
                    </div>
                    {dailyLimit && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Daily Limit:</span>
                        <span className="text-sm text-gray-900 font-medium">{currency} {dailyLimit}</span>
                      </div>
                    )}
                    {perLeadLimit && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Per Lead Limit:</span>
                        <span className="text-sm text-gray-900 font-medium">{currency} {perLeadLimit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(aiEnabled || triggerType !== "manual") && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Automation</h3>
                  <div className="space-y-2">
                    {aiEnabled && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-900">AI-powered automation enabled</span>
                      </div>
                    )}
                    {triggerType !== "manual" && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-900">
                          Trigger: {triggerType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/tenant/campaigns")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {isEditMode ? "Edit Campaign" : "Create New Campaign"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b px-4 sm:px-6 py-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 sm:w-16 mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Back
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="flex-1 sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>

                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleLaunch}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    {isEditMode ? "Update" : "Launch"} Campaign
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
