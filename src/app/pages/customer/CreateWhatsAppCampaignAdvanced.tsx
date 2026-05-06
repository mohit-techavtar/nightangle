import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, Check, AlertCircle, Users, MessageSquare, Calendar, Settings,
  Radio, Zap, Target, PhoneCall, Shield, Clock, DollarSign, TrendingUp, GitBranch, Plus, X
} from "lucide-react";
import { useWhatsApp } from "../../hooks/useWhatsApp";

interface CampaignType {
  id: "broadcast" | "drip" | "event_based" | "ai_followup" | "call_to_whatsapp";
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}

const campaignTypes: CampaignType[] = [
  {
    id: "broadcast",
    name: "Broadcast Campaign",
    description: "One-time message to verified broadcast list",
    icon: Radio,
    features: ["Verified opt-in list only", "Template-based messaging", "Immediate or scheduled send", "Compliance enforced"]
  },
  {
    id: "drip",
    name: "Drip Sequence",
    description: "Multi-step nurture campaign over time",
    icon: GitBranch,
    features: ["Multi-message sequence", "Time-based intervals", "Lead stage progression", "Automated follow-ups"]
  },
  {
    id: "event_based",
    name: "Event-Based Trigger",
    description: "Automated campaign triggered by specific events",
    icon: Zap,
    features: ["Real-time event triggers", "Conditional logic", "CRM integration", "Action-based automation"]
  },
  {
    id: "ai_followup",
    name: "AI Follow-up Campaign",
    description: "Intelligent AI-powered follow-up sequences",
    icon: Target,
    features: ["AI response analysis", "Smart timing", "Personalized content", "Engagement optimization"]
  },
  {
    id: "call_to_whatsapp",
    name: "Call-to-WhatsApp",
    description: "Drive inbound WhatsApp conversations from calls",
    icon: PhoneCall,
    features: ["Post-call automation", "Click-to-chat links", "Call integration", "Conversation starter"]
  }
];

const steps = [
  { id: 1, name: "Campaign Type", icon: Settings },
  { id: 2, name: "Details", icon: MessageSquare },
  { id: 3, name: "Template & Message", icon: MessageSquare },
  { id: 4, name: "Audience", icon: Users },
  { id: 5, name: "Rules & Guardrails", icon: Shield },
  { id: 6, name: "CRM Integration", icon: TrendingUp },
  { id: 7, name: "Schedule & Review", icon: Calendar },
];

const leadStages = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal Sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function CreateWhatsAppCampaignAdvanced() {
  const navigate = useNavigate();
  const { templates, createCampaign } = useWhatsApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Campaign Type
    campaignType: "" as CampaignType["id"] | "",

    // Step 2: Details
    name: "",
    description: "",
    objective: "",

    // Step 3: Template & Message
    templateId: "",
    dripSequence: [] as { templateId: string; delayHours: number }[],

    // Step 4: Audience
    audienceType: "verified_only" as "verified_only" | "segment" | "custom",
    audienceSize: 5420,
    optInVerified: true,

    // Step 5: Rules & Guardrails
    dailySendCap: 1000,
    timeWindowStart: "09:00",
    timeWindowEnd: "18:00",
    timezone: "America/New_York",
    budgetLimit: 500,
    respectQuietHours: true,

    // Step 6: CRM Integration
    mode: "crm" as "standalone" | "crm",
    updateLeadStage: true,
    targetLeadStage: "qualified",
    updateLeadScore: true,
    scoreIncrement: 10,
    createTimelineEntry: true,
    updateDealObject: false,
    dealStage: "",

    // Step 7: Schedule
    scheduleType: "now" as "now" | "later",
    scheduledAt: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const approvedTemplates = templates.filter(t => t.status === "approved");

  const handleNext = () => {
    // Step 1 validation
    if (currentStep === 1) {
      if (!formData.campaignType) {
        setErrors({ campaignType: "Please select a campaign type" });
        return;
      }
      setErrors({});
    }

    // Step 2 validation
    if (currentStep === 2) {
      const newErrors: Record<string, string> = {};
      if (!formData.name.trim()) newErrors.name = "Campaign name is required";
      if (!formData.objective.trim()) newErrors.objective = "Campaign objective is required";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
    }

    // Step 3 validation
    if (currentStep === 3) {
      if (formData.campaignType === "drip") {
        if (formData.dripSequence.length === 0) {
          setErrors({ drip: "Add at least one message to the sequence" });
          return;
        }
      } else {
        if (!formData.templateId) {
          setErrors({ template: "Please select a template" });
          return;
        }
      }
      setErrors({});
    }

    // Step 7: Submit
    if (currentStep === 7) {
      handleSubmit();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/tenant/whatsapp/campaigns");
    }
  };

  const handleSubmit = () => {
    console.log("Creating advanced campaign:", formData);

    const selectedTemplate = templates.find(t => t.id === formData.templateId);

    createCampaign({
      name: formData.name,
      status: formData.scheduleType === "now" ? "running" : "scheduled",
      templateId: formData.templateId,
      templateName: selectedTemplate?.name || "",
      audienceSize: formData.audienceSize,
      scheduledAt: formData.scheduleType === "later" ? formData.scheduledAt : undefined,
    });

    setShowSuccessModal(true);
  };

  const addDripMessage = () => {
    setFormData({
      ...formData,
      dripSequence: [...formData.dripSequence, { templateId: "", delayHours: 24 }]
    });
  };

  const removeDripMessage = (index: number) => {
    setFormData({
      ...formData,
      dripSequence: formData.dripSequence.filter((_, i) => i !== index)
    });
  };

  const updateDripMessage = (index: number, field: "templateId" | "delayHours", value: string | number) => {
    const updated = [...formData.dripSequence];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, dripSequence: updated });
  };

  const selectedCampaignType = campaignTypes.find(t => t.id === formData.campaignType);

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F1B2D] mb-4"
          >
            <ChevronLeft size={18} />
            Back to {currentStep === 1 ? "Campaigns" : "Previous Step"}
          </button>
          <div>
            <h1 className="font-semibold text-[#0F1B2D] mb-1">Create WhatsApp Campaign</h1>
            <p className="text-sm text-[#64748B]">
              {currentStep === 1 && "Choose the type of campaign you want to create"}
              {currentStep === 2 && "Set campaign name and objective"}
              {currentStep === 3 && "Configure message template or sequence"}
              {currentStep === 4 && "Select verified opt-in audience"}
              {currentStep === 5 && "Configure compliance and budget rules"}
              {currentStep === 6 && "Set up CRM integration and automation"}
              {currentStep === 7 && "Review and schedule your campaign"}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-8 pb-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[900px]">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                      currentStep > step.id
                        ? "bg-[#25D366] border-[#25D366] text-white"
                        : currentStep === step.id
                        ? "border-[#25D366] text-[#25D366] bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={20} strokeWidth={2.5} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <div className="hidden xl:block">
                    <div
                      className={`text-xs font-medium whitespace-nowrap ${
                        currentStep >= step.id ? "text-[#0F1B2D]" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-[#25D366]" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Step 1: Campaign Type */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <strong>Compliance First:</strong> All campaign types enforce WhatsApp Business Policy including template-only initiation and opt-in verification.
              </div>
            </div>

            {errors.campaignType && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-900">{errors.campaignType}</div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {campaignTypes.map((type) => (
                <label
                  key={type.id}
                  className={`block p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.campaignType === type.id
                      ? "border-[#25D366] bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="campaignType"
                      checked={formData.campaignType === type.id}
                      onChange={() => setFormData({ ...formData, campaignType: type.id })}
                      className="mt-1 w-5 h-5 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                          <type.icon size={20} className="text-[#25D366]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#0F1B2D]">{type.name}</div>
                          <div className="text-sm text-[#64748B]">{type.description}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {type.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-[#64748B]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Campaign Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={`e.g., ${selectedCampaignType?.name} - Q1 2024`}
                className={`w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose and goals of this campaign..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Campaign Objective <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className={`w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent ${
                  errors.objective ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select objective...</option>
                <option value="lead_nurturing">Lead Nurturing</option>
                <option value="product_launch">Product Launch</option>
                <option value="re_engagement">Re-engagement</option>
                <option value="event_promotion">Event Promotion</option>
                <option value="customer_support">Customer Support</option>
                <option value="upsell_crosssell">Upsell / Cross-sell</option>
              </select>
              {errors.objective && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.objective}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Template & Message */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {formData.campaignType === "drip" ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <strong>Drip Sequence:</strong> Build a multi-step message sequence with time delays between each message.
                  </div>
                </div>

                {errors.drip && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-900">{errors.drip}</div>
                  </div>
                )}

                <div className="space-y-4">
                  {formData.dripSequence.map((message, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-sm text-[#0F1B2D]">
                          Message {index + 1}
                          {index > 0 && (
                            <span className="ml-2 text-xs text-[#64748B]">
                              (Sent {message.delayHours}h after previous)
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeDripMessage(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#64748B] mb-2">
                            Template
                          </label>
                          <select
                            value={message.templateId}
                            onChange={(e) => updateDripMessage(index, "templateId", e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                          >
                            <option value="">Select template...</option>
                            {approvedTemplates.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>
                        {index > 0 && (
                          <div>
                            <label className="block text-xs font-medium text-[#64748B] mb-2">
                              Delay (hours)
                            </label>
                            <input
                              type="number"
                              value={message.delayHours}
                              onChange={(e) => updateDripMessage(index, "delayHours", parseInt(e.target.value))}
                              min="1"
                              className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addDripMessage}
                  className="w-full h-11 rounded-lg border-2 border-dashed border-gray-300 text-sm font-medium text-[#64748B] hover:border-[#25D366] hover:text-[#25D366] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Message to Sequence
                </button>
              </>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    Only approved templates can be used. All templates must comply with WhatsApp Business Policy.
                  </div>
                </div>

                {errors.template && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-900">{errors.template}</div>
                  </div>
                )}

                <div className="space-y-3">
                  {approvedTemplates.map((template) => (
                    <label
                      key={template.id}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.templateId === template.id
                          ? "border-[#25D366] bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="template"
                          checked={formData.templateId === template.id}
                          onChange={() => setFormData({ ...formData, templateId: template.id })}
                          className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-[#0F1B2D]">{template.name}</span>
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium">
                              {template.category}
                            </span>
                          </div>
                          <div className="text-sm text-[#64748B] mb-2 bg-white p-3 rounded border border-gray-200">
                            {template.content}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Audience */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
              <Shield size={20} className="text-orange-600 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-900">
                <strong>Opt-in Enforcement:</strong> Only contacts who have explicitly opted in can receive campaign messages. This is automatically verified.
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-[#0F1B2D] mb-1">Verified Opt-in Contacts</div>
                  <div className="text-sm text-[#64748B]">All contacts have confirmed opt-in status</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-[#0F1B2D]">{formData.audienceSize.toLocaleString()}</div>
                  <div className="text-xs text-[#64748B]">eligible contacts</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
                <Check size={18} className="text-green-600" />
                <span className="text-sm text-green-900 font-medium">
                  100% opt-in verified • WhatsApp compliant
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#0F1B2D] mb-3">
                Audience Selection
              </label>

              <label className="block p-4 rounded-lg border-2 cursor-pointer transition-all border-[#25D366] bg-green-50">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="audience"
                    checked
                    readOnly
                    className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[#0F1B2D] mb-1">All Verified Contacts</div>
                    <div className="text-sm text-[#64748B]">
                      Send to all contacts with verified opt-in status ({formData.audienceSize.toLocaleString()} contacts)
                    </div>
                  </div>
                </div>
              </label>

              <div className="block p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-50">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    disabled
                    className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[#0F1B2D] mb-1">Segment by Lead Stage</div>
                    <div className="text-sm text-[#64748B]">Filter by CRM lead stage (Coming soon)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Rules & Guardrails */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Shield size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>Guardrails:</strong> These rules ensure compliance, protect your budget, and maintain deliverability.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                  Daily Send Cap
                </label>
                <input
                  type="number"
                  value={formData.dailySendCap}
                  onChange={(e) => setFormData({ ...formData, dailySendCap: parseInt(e.target.value) })}
                  min="1"
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                />
                <p className="mt-1.5 text-xs text-[#64748B]">
                  Maximum messages per day to prevent rate limiting
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                  Budget Limit (USD)
                </label>
                <input
                  type="number"
                  value={formData.budgetLimit}
                  onChange={(e) => setFormData({ ...formData, budgetLimit: parseInt(e.target.value) })}
                  min="0"
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                />
                <p className="mt-1.5 text-xs text-[#64748B]">
                  Campaign will pause when budget is reached
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-3">
                Time Window Restrictions
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#64748B] mb-2">Start Time</label>
                  <input
                    type="time"
                    value={formData.timeWindowStart}
                    onChange={(e) => setFormData({ ...formData, timeWindowStart: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.timeWindowEnd}
                    onChange={(e) => setFormData({ ...formData, timeWindowEnd: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-2">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern (ET)</option>
                    <option value="America/Chicago">Central (CT)</option>
                    <option value="America/Denver">Mountain (MT)</option>
                    <option value="America/Los_Angeles">Pacific (PT)</option>
                  </select>
                </div>
              </div>
              <p className="mt-2 text-xs text-[#64748B]">
                Messages will only be sent during these hours in the recipient's timezone
              </p>
            </div>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.respectQuietHours}
                onChange={(e) => setFormData({ ...formData, respectQuietHours: e.target.checked })}
                className="w-5 h-5 rounded text-[#25D366] focus:ring-[#25D366]"
              />
              <div className="flex-1">
                <div className="font-medium text-sm text-[#0F1B2D]">Respect Quiet Hours</div>
                <div className="text-xs text-[#64748B]">
                  Skip contacts who have set quiet hours preferences
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Step 6: CRM Integration */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
              <TrendingUp size={20} className="text-purple-600 shrink-0 mt-0.5" />
              <div className="text-sm text-purple-900">
                <strong>CRM Automation:</strong> Campaign outcomes automatically update lead stages, scores, and timeline entries in your CRM.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-3">
                Integration Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.mode === "crm" ? "border-[#25D366] bg-green-50" : "border-gray-200"
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="mode"
                      checked={formData.mode === "crm"}
                      onChange={() => setFormData({ ...formData, mode: "crm" })}
                      className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div>
                      <div className="font-medium text-[#0F1B2D] mb-1">CRM Mode</div>
                      <div className="text-xs text-[#64748B]">Full CRM integration with stages, scores, and deals</div>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.mode === "standalone" ? "border-[#25D366] bg-green-50" : "border-gray-200"
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="mode"
                      checked={formData.mode === "standalone"}
                      onChange={() => setFormData({ ...formData, mode: "standalone" })}
                      className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div>
                      <div className="font-medium text-[#0F1B2D] mb-1">Standalone Mode</div>
                      <div className="text-xs text-[#64748B]">Basic lead tracking without CRM sync</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {formData.mode === "crm" && (
              <>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.updateLeadStage}
                      onChange={(e) => setFormData({ ...formData, updateLeadStage: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#0F1B2D] mb-2">Update Lead Stage</div>
                      {formData.updateLeadStage && (
                        <select
                          value={formData.targetLeadStage}
                          onChange={(e) => setFormData({ ...formData, targetLeadStage: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                        >
                          {leadStages.map(stage => (
                            <option key={stage.value} value={stage.value}>{stage.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.updateLeadScore}
                      onChange={(e) => setFormData({ ...formData, updateLeadScore: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#0F1B2D] mb-2">Update Lead Score</div>
                      {formData.updateLeadScore && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#64748B]">Increment by:</span>
                          <input
                            type="number"
                            value={formData.scoreIncrement}
                            onChange={(e) => setFormData({ ...formData, scoreIncrement: parseInt(e.target.value) })}
                            min="0"
                            max="100"
                            className="w-24 h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                          />
                          <span className="text-sm text-[#64748B]">points</span>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.createTimelineEntry}
                      onChange={(e) => setFormData({ ...formData, createTimelineEntry: e.target.checked })}
                      className="w-5 h-5 rounded text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#0F1B2D]">Create Timeline Entry</div>
                      <div className="text-xs text-[#64748B]">
                        Add campaign activity to contact timeline
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.updateDealObject}
                      onChange={(e) => setFormData({ ...formData, updateDealObject: e.target.checked })}
                      className="w-5 h-5 rounded text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#0F1B2D]">Update Deal Object</div>
                      <div className="text-xs text-[#64748B]">
                        Update associated deal stages (if exists)
                      </div>
                    </div>
                  </label>
                </div>
              </>
            )}

            {formData.mode === "standalone" && (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-[#64748B] mb-4">
                  Standalone mode will track:
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-[#0F1B2D]">
                    <Check size={16} className="text-green-600" />
                    Lead Stage progression
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#0F1B2D]">
                    <Check size={16} className="text-green-600" />
                    Lead Score updates
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#0F1B2D]">
                    <Check size={16} className="text-green-600" />
                    Timeline entries
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Step 7: Schedule & Review */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-3">
                Schedule
              </label>
              <div className="space-y-3">
                <label className="block p-4 rounded-lg border-2 cursor-pointer transition-all border-[#25D366] bg-green-50">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="schedule"
                      checked={formData.scheduleType === "now"}
                      onChange={() => setFormData({ ...formData, scheduleType: "now" })}
                      className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[#0F1B2D] mb-1">Start Now</div>
                      <div className="text-sm text-[#64748B]">
                        Campaign will begin immediately (within time window restrictions)
                      </div>
                    </div>
                  </div>
                </label>

                <label className="block p-4 rounded-lg border-2 cursor-pointer transition-all border-gray-200 hover:border-gray-300">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="schedule"
                      checked={formData.scheduleType === "later"}
                      onChange={() => setFormData({ ...formData, scheduleType: "later" })}
                      className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[#0F1B2D] mb-1">Schedule for Later</div>
                      <div className="text-sm text-[#64748B] mb-3">Choose a specific date and time</div>
                      {formData.scheduleType === "later" && (
                        <input
                          type="datetime-local"
                          value={formData.scheduledAt}
                          onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                          className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Campaign Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#0F1B2D] mb-4">Campaign Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-[#64748B]">Campaign Type</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">{selectedCampaignType?.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-[#64748B]">Campaign Name</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-[#64748B]">Recipients</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {formData.audienceSize.toLocaleString()} verified contacts
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-[#64748B]">Daily Send Cap</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {formData.dailySendCap.toLocaleString()} messages/day
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-[#64748B]">Budget Limit</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    ${formData.budgetLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-[#64748B]">Time Window</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {formData.timeWindowStart} - {formData.timeWindowEnd}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-[#64748B]">CRM Integration</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {formData.mode === "crm" ? "Full CRM Mode" : "Standalone Mode"}
                  </span>
                </div>
                {formData.mode === "crm" && formData.updateLeadStage && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-[#64748B]">Target Lead Stage</span>
                    <span className="text-sm font-medium text-[#0F1B2D]">
                      {leadStages.find(s => s.value === formData.targetLeadStage)?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Check size={20} className="text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <strong>Compliance Verified:</strong> All guardrails and opt-in requirements are in place.
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            className="h-11 px-6 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
          >
            {currentStep === 7 ? "Launch Campaign" : "Continue"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-[#0F1B2D] mb-2">Campaign Launched Successfully</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Your {selectedCampaignType?.name} <strong>{formData.name}</strong> is now{" "}
                {formData.scheduleType === "now" ? "running" : "scheduled"} with all compliance guardrails active.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/tenant/whatsapp/campaigns")}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  View Campaigns
                </button>
                <button
                  onClick={() => navigate("/tenant/whatsapp")}
                  className="flex-1 h-10 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
