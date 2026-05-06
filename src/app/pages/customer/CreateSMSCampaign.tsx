import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, ArrowRight, Check, MessageSquare, Users, Settings as SettingsIcon,
  Calendar, Link2, AlertCircle, X
} from "lucide-react";

interface CampaignFormData {
  name: string;
  type: "one-time" | "recurring";
  message: string;
  template: string;
  audienceType: "all" | "segment" | "custom" | "upload";
  segmentId: string;
  customNumbers: string;
  scheduled: boolean;
  scheduleDate: string;
  scheduleTime: string;
  recurringFrequency: "daily" | "weekly" | "monthly" | "";
  recurringDays: string[];
  enableShortLinks: boolean;
  shortLinkUrl: string;
  trackClicks: boolean;
  enableAIResponse: boolean;
  autoCreateLeads: boolean;
  senderName: string;
}

const initialFormData: CampaignFormData = {
  name: "",
  type: "one-time",
  message: "",
  template: "",
  audienceType: "all",
  segmentId: "",
  customNumbers: "",
  scheduled: false,
  scheduleDate: "",
  scheduleTime: "",
  recurringFrequency: "",
  recurringDays: [],
  enableShortLinks: false,
  shortLinkUrl: "",
  trackClicks: true,
  enableAIResponse: false,
  autoCreateLeads: true,
  senderName: "OmniCRM",
};

const templates = [
  { id: "1", name: "Welcome Message", content: "Hi {{name}}, welcome to {{company}}! We're excited to have you." },
  { id: "2", name: "Appointment Reminder", content: "Hi {{name}}, this is a reminder for your appointment on {{date}} at {{time}}." },
  { id: "3", name: "Payment Reminder", content: "Hi {{name}}, your payment of {{amount}} is due on {{date}}. Pay now: {{link}}" },
  { id: "4", name: "Promotional Offer", content: "Exclusive offer for you! Get {{discount}}% off. Shop now: {{link}}" },
];

const segments = [
  { id: "1", name: "All Customers", count: 5420 },
  { id: "2", name: "Active Leads", count: 1234 },
  { id: "3", name: "Hot Prospects", count: 456 },
  { id: "4", name: "Inactive Users (30d)", count: 890 },
];

export function CreateSMSCampaign() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CampaignFormData, string>>>({});

  const steps = [
    { number: 1, title: "Campaign Details", icon: MessageSquare },
    { number: 2, title: "Message Content", icon: MessageSquare },
    { number: 3, title: "Audience", icon: Users },
    { number: 4, title: "Schedule & Settings", icon: SettingsIcon },
    { number: 5, title: "Review", icon: Check },
  ];

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CampaignFormData, string>> = {};

    if (step === 1) {
      if (!formData.name) newErrors.name = "Campaign name is required";
    } else if (step === 2) {
      if (!formData.message) newErrors.message = "Message content is required";
      if (formData.message.length > 160) newErrors.message = "Message exceeds 160 characters";
    } else if (step === 3) {
      if (formData.audienceType === "segment" && !formData.segmentId) {
        newErrors.segmentId = "Please select a segment";
      }
      if (formData.audienceType === "custom" && !formData.customNumbers) {
        newErrors.customNumbers = "Please enter phone numbers";
      }
    } else if (step === 4) {
      if (formData.scheduled && !formData.scheduleDate) {
        newErrors.scheduleDate = "Schedule date is required";
      }
      if (formData.scheduled && !formData.scheduleTime) {
        newErrors.scheduleTime = "Schedule time is required";
      }
      if (formData.type === "recurring" && !formData.recurringFrequency) {
        newErrors.recurringFrequency = "Recurring frequency is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log("Submitting campaign:", formData);
      navigate("/tenant/sms/campaigns");
    }
  };

  const useTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      handleInputChange("message", template.content);
      handleInputChange("template", templateId);
    }
  };

  const getAudienceCount = (): number => {
    if (formData.audienceType === "all") return 5420;
    if (formData.audienceType === "segment" && formData.segmentId) {
      return segments.find(s => s.id === formData.segmentId)?.count || 0;
    }
    if (formData.audienceType === "custom" && formData.customNumbers) {
      return formData.customNumbers.split("\n").filter(n => n.trim()).length;
    }
    return 0;
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS" },
          { label: "Campaigns", path: "/tenant/sms/campaigns" },
          { label: "Create Campaign" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/tenant/sms/campaigns")}
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0F1B2D] mb-4"
              >
                <ArrowLeft size={16} />
                Back to Campaigns
              </button>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Create SMS Campaign</h1>
              <p className="text-sm text-[#6B7280] mt-1">Send targeted SMS messages to your audience</p>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          currentStep === step.number
                            ? "bg-[#1565C0] text-white"
                            : currentStep > step.number
                            ? "bg-[#10B981] text-white"
                            : "bg-[#F3F4F6] text-[#9CA3AF]"
                        }`}
                      >
                        {currentStep > step.number ? (
                          <Check size={20} />
                        ) : (
                          <step.icon size={20} />
                        )}
                      </div>
                      <div className="text-xs font-medium text-[#6B7280] mt-2 text-center max-w-[100px]">
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          currentStep > step.number ? "bg-[#10B981]" : "bg-[#E5E7EB]"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              {/* Step 1: Campaign Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Campaign Name <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Summer Sale Promotion"
                      className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                    />
                    {errors.name && (
                      <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Campaign Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleInputChange("type", "one-time")}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.type === "one-time"
                            ? "border-[#1565C0] bg-[#EBF5FF]"
                            : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                        }`}
                      >
                        <div className="font-semibold text-[#0F1B2D] mb-1">One-Time Campaign</div>
                        <div className="text-sm text-[#6B7280]">Send once to your audience</div>
                      </button>
                      <button
                        onClick={() => handleInputChange("type", "recurring")}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.type === "recurring"
                            ? "border-[#1565C0] bg-[#EBF5FF]"
                            : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                        }`}
                      >
                        <div className="font-semibold text-[#0F1B2D] mb-1">Recurring Campaign</div>
                        <div className="text-sm text-[#6B7280]">Send on a regular schedule</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={formData.senderName}
                      onChange={(e) => handleInputChange("senderName", e.target.value)}
                      placeholder="OmniCRM"
                      maxLength={11}
                      className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                    />
                    <p className="text-xs text-[#6B7280] mt-1">
                      Max 11 characters. This will appear as the sender.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Message Content */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Use Template (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => useTemplate(template.id)}
                          className={`p-3 border rounded-lg text-left hover:border-[#1565C0] transition-colors ${
                            formData.template === template.id ? "border-[#1565C0] bg-[#EBF5FF]" : "border-[#E5E7EB]"
                          }`}
                        >
                          <div className="font-medium text-sm text-[#0F1B2D]">{template.name}</div>
                          <div className="text-xs text-[#6B7280] mt-1 truncate">{template.content}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Message Content <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Type your message here... Use {{name}}, {{company}}, etc. for personalization"
                      rows={5}
                      maxLength={160}
                      className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-[#6B7280]">
                        Available variables: {"{"}{"{"} name {"}"} {"}"}, {"{"}{"{"} company {"}"} {"}"}, {"{"}{"{"} link {"}"} {"}"}
                      </p>
                      <p className="text-sm font-medium text-[#6B7280]">
                        {formData.message.length}/160 characters
                        {formData.message.length > 0 && (
                          <span className="ml-2">
                            ({Math.ceil(formData.message.length / 160)} SMS)
                          </span>
                        )}
                      </p>
                    </div>
                    {errors.message && (
                      <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Link2 size={16} className="text-[#1565C0]" />
                        <span className="font-medium text-[#0F1B2D]">Short Link</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.enableShortLinks}
                          onChange={(e) => handleInputChange("enableShortLinks", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                      </label>
                    </div>
                    {formData.enableShortLinks && (
                      <input
                        type="url"
                        value={formData.shortLinkUrl}
                        onChange={(e) => handleInputChange("shortLinkUrl", e.target.value)}
                        placeholder="https://example.com/page"
                        className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                      />
                    )}
                    <p className="text-xs text-[#6B7280] mt-2">
                      Generate a trackable short link to include in your message
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Audience */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-3">
                      Select Audience
                    </label>
                    <div className="space-y-3">
                      <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.audienceType === "all" ? "border-[#1565C0] bg-[#EBF5FF]" : "border-[#E5E7EB]"
                      }`}>
                        <input
                          type="radio"
                          name="audienceType"
                          checked={formData.audienceType === "all"}
                          onChange={() => handleInputChange("audienceType", "all")}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-[#0F1B2D]">All Contacts</div>
                          <div className="text-sm text-[#6B7280]">Send to all {segments[0].count.toLocaleString()} contacts</div>
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.audienceType === "segment" ? "border-[#1565C0] bg-[#EBF5FF]" : "border-[#E5E7EB]"
                      }`}>
                        <input
                          type="radio"
                          name="audienceType"
                          checked={formData.audienceType === "segment"}
                          onChange={() => handleInputChange("audienceType", "segment")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-[#0F1B2D] mb-2">Specific Segment</div>
                          {formData.audienceType === "segment" && (
                            <select
                              value={formData.segmentId}
                              onChange={(e) => handleInputChange("segmentId", e.target.value)}
                              className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                            >
                              <option value="">Select a segment...</option>
                              {segments.map((segment) => (
                                <option key={segment.id} value={segment.id}>
                                  {segment.name} ({segment.count.toLocaleString()} contacts)
                                </option>
                              ))}
                            </select>
                          )}
                          {errors.segmentId && (
                            <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.segmentId}
                            </p>
                          )}
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.audienceType === "custom" ? "border-[#1565C0] bg-[#EBF5FF]" : "border-[#E5E7EB]"
                      }`}>
                        <input
                          type="radio"
                          name="audienceType"
                          checked={formData.audienceType === "custom"}
                          onChange={() => handleInputChange("audienceType", "custom")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-[#0F1B2D] mb-2">Custom Numbers</div>
                          {formData.audienceType === "custom" && (
                            <textarea
                              value={formData.customNumbers}
                              onChange={(e) => handleInputChange("customNumbers", e.target.value)}
                              placeholder="Enter phone numbers (one per line)&#10;+91 98765 43210&#10;+91 87654 32109"
                              rows={5}
                              className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent font-mono"
                            />
                          )}
                          {errors.customNumbers && (
                            <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.customNumbers}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-[#EBF5FF] border border-[#93C5FD] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={16} className="text-[#1565C0]" />
                      <span className="font-medium text-[#0F1B2D]">Estimated Reach</span>
                    </div>
                    <p className="text-2xl font-bold text-[#1565C0]">
                      {getAudienceCount().toLocaleString()} recipients
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Schedule & Settings */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center justify-between mb-4">
                      <span className="font-medium text-[#0F1B2D]">Schedule Campaign</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.scheduled}
                          onChange={(e) => handleInputChange("scheduled", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                      </label>
                    </label>

                    {formData.scheduled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-2">
                            Date <span className="text-[#EF4444]">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.scheduleDate}
                            onChange={(e) => handleInputChange("scheduleDate", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                          />
                          {errors.scheduleDate && (
                            <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.scheduleDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-2">
                            Time <span className="text-[#EF4444]">*</span>
                          </label>
                          <input
                            type="time"
                            value={formData.scheduleTime}
                            onChange={(e) => handleInputChange("scheduleTime", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                          />
                          {errors.scheduleTime && (
                            <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                              <AlertCircle size={14} />
                              {errors.scheduleTime}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {formData.type === "recurring" && (
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-2">
                        Recurring Frequency <span className="text-[#EF4444]">*</span>
                      </label>
                      <select
                        value={formData.recurringFrequency}
                        onChange={(e) => handleInputChange("recurringFrequency", e.target.value as any)}
                        className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                      >
                        <option value="">Select frequency...</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      {errors.recurringFrequency && (
                        <p className="text-sm text-[#EF4444] mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.recurringFrequency}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="border-t border-[#E5E7EB] pt-6">
                    <h3 className="font-medium text-[#0F1B2D] mb-4">Additional Settings</h3>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg">
                        <div>
                          <div className="font-medium text-[#0F1B2D]">Track Click Analytics</div>
                          <div className="text-sm text-[#6B7280]">Monitor link clicks and engagement</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.trackClicks}
                          onChange={(e) => handleInputChange("trackClicks", e.target.checked)}
                          className="w-4 h-4 text-[#1565C0] bg-white border-[#E5E7EB] rounded focus:ring-2 focus:ring-[#1565C0]"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg">
                        <div>
                          <div className="font-medium text-[#0F1B2D]">Enable AI Responses</div>
                          <div className="text-sm text-[#6B7280]">Let AI handle incoming replies</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.enableAIResponse}
                          onChange={(e) => handleInputChange("enableAIResponse", e.target.checked)}
                          className="w-4 h-4 text-[#1565C0] bg-white border-[#E5E7EB] rounded focus:ring-2 focus:ring-[#1565C0]"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg">
                        <div>
                          <div className="font-medium text-[#0F1B2D]">Auto-Create Leads</div>
                          <div className="text-sm text-[#6B7280]">Automatically create leads from responses</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.autoCreateLeads}
                          onChange={(e) => handleInputChange("autoCreateLeads", e.target.checked)}
                          className="w-4 h-4 text-[#1565C0] bg-white border-[#E5E7EB] rounded focus:ring-2 focus:ring-[#1565C0]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-[#F9FAFB] rounded-lg p-6">
                    <h3 className="font-semibold text-[#0F1B2D] mb-4">Campaign Summary</h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-[#6B7280] mb-1">Campaign Name</div>
                          <div className="font-medium text-[#0F1B2D]">{formData.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-[#6B7280] mb-1">Type</div>
                          <div className="font-medium text-[#0F1B2D]">
                            {formData.type === "one-time" ? "One-Time" : "Recurring"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-[#6B7280] mb-1">Message</div>
                        <div className="p-3 bg-white border border-[#E5E7EB] rounded text-sm text-[#0F1B2D]">
                          {formData.message}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-[#6B7280] mb-1">Audience</div>
                          <div className="font-medium text-[#0F1B2D]">
                            {getAudienceCount().toLocaleString()} recipients
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-[#6B7280] mb-1">Schedule</div>
                          <div className="font-medium text-[#0F1B2D]">
                            {formData.scheduled
                              ? `${formData.scheduleDate} at ${formData.scheduleTime}`
                              : "Send immediately"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-[#6B7280] mb-1">Features Enabled</div>
                        <div className="flex flex-wrap gap-2">
                          {formData.enableShortLinks && (
                            <span className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-xs font-medium rounded-full">
                              Short Links
                            </span>
                          )}
                          {formData.trackClicks && (
                            <span className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-xs font-medium rounded-full">
                              Click Tracking
                            </span>
                          )}
                          {formData.enableAIResponse && (
                            <span className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-xs font-medium rounded-full">
                              AI Responses
                            </span>
                          )}
                          {formData.autoCreateLeads && (
                            <span className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-xs font-medium rounded-full">
                              Auto Lead Creation
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-[#92400E] mb-1">Before You Launch</h4>
                        <ul className="text-sm text-[#92400E] space-y-1 list-disc list-inside">
                          <li>Verify your message content and recipient list</li>
                          <li>Ensure compliance with SMS regulations and opt-in requirements</li>
                          <li>Check that short links are working correctly</li>
                          <li>Review scheduled time if applicable</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                <div className="text-sm text-[#6B7280]">
                  Step {currentStep} of {steps.length}
                </div>

                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#10B981] text-white rounded-lg text-sm font-medium hover:bg-[#059669] transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    {formData.scheduled ? "Schedule Campaign" : "Launch Campaign"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
