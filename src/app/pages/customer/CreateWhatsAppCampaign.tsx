import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Check, AlertCircle, Users, MessageSquare, Calendar, Settings } from "lucide-react";
import { useWhatsApp } from "../../hooks/useWhatsApp";

const steps = [
  { id: 1, name: "Campaign Details", icon: Settings },
  { id: 2, name: "Select Template", icon: MessageSquare },
  { id: 3, name: "Choose Audience", icon: Users },
  { id: 4, name: "Schedule & Review", icon: Calendar },
];

export function CreateWhatsAppCampaign() {
  const navigate = useNavigate();
  const { templates, createCampaign } = useWhatsApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    templateId: "",
    audienceType: "all" as "all" | "segment" | "custom",
    audienceSize: 5420,
    scheduleType: "now" as "now" | "later",
    scheduledAt: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const approvedTemplates = templates.filter(t => t.status === "approved");

  const handleNext = () => {
    if (currentStep === 1) {
      const newErrors: Record<string, string> = {};
      if (!formData.name.trim()) newErrors.name = "Campaign name is required";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
    }

    if (currentStep === 2) {
      if (!formData.templateId) {
        setErrors({ template: "Please select a template" });
        return;
      }
      setErrors({});
    }

    if (currentStep === 4) {
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
              {currentStep === 1 && "Set campaign name and basic details"}
              {currentStep === 2 && "Choose an approved message template"}
              {currentStep === 3 && "Select your target audience"}
              {currentStep === 4 && "Review and schedule your campaign"}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between max-w-3xl">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
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
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? "text-[#0F1B2D]" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-[#64748B]">Step {step.id} of {steps.length}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-[#25D366]" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-3xl">
        {/* Step 1: Campaign Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <strong>WhatsApp Business Requirements:</strong> Campaigns must use pre-approved templates and comply with WhatsApp Business Policy.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Spring Sale 2024, Product Launch Announcement"
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
          </div>
        )}

        {/* Step 2: Select Template */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                Only approved templates can be used for campaigns. Need a new template? Create and submit it for approval first.
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
                      <div className="text-xs text-[#64748B]">
                        Variables: {template.variables.map(v => `{{${v}}}`).join(", ")}
                      </div>
                    </div>
                  </div>
                </label>
              ))}

              {approvedTemplates.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-[#0F1B2D] mb-2">No Approved Templates</h3>
                  <p className="text-sm text-[#64748B] mb-6">
                    Create and submit templates for approval before creating campaigns
                  </p>
                  <button
                    onClick={() => navigate("/tenant/whatsapp/templates")}
                    className="h-10 px-5 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
                  >
                    Create Template
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Choose Audience */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0F1B2D] mb-3">
                Select Audience
              </label>
              <div className="space-y-3">
                <label className="block p-4 rounded-lg border-2 cursor-pointer transition-all border-[#25D366] bg-green-50">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="audience"
                      checked={formData.audienceType === "all"}
                      onChange={() => setFormData({ ...formData, audienceType: "all" })}
                      className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[#0F1B2D] mb-1">All Contacts</div>
                      <div className="text-sm text-[#64748B]">Send to all contacts who have opted in ({formData.audienceSize.toLocaleString()} contacts)</div>
                    </div>
                  </div>
                </label>

                <label className="block p-4 rounded-lg border-2 cursor-pointer transition-all border-gray-200 hover:border-gray-300 opacity-50">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="audience"
                      disabled
                      className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[#0F1B2D] mb-1">Segment</div>
                      <div className="text-sm text-[#64748B]">Send to a specific segment (Coming soon)</div>
                    </div>
                  </div>
                </label>

                <label className="block p-4 rounded-lg border-2 cursor-pointer transition-all border-gray-200 hover:border-gray-300 opacity-50">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="audience"
                      disabled
                      className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-[#0F1B2D] mb-1">Custom List</div>
                      <div className="text-sm text-[#64748B]">Upload a CSV file with phone numbers (Coming soon)</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Schedule & Review */}
        {currentStep === 4 && (
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
                      <div className="font-medium text-[#0F1B2D] mb-1">Send Now</div>
                      <div className="text-sm text-[#64748B]">Campaign will start immediately</div>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Campaign Name</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Template</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {templates.find(t => t.id === formData.templateId)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Recipients</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {formData.audienceSize.toLocaleString()} contacts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Schedule</span>
                  <span className="text-sm font-medium text-[#0F1B2D]">
                    {formData.scheduleType === "now" ? "Immediate" : new Date(formData.scheduledAt).toLocaleString()}
                  </span>
                </div>
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
            {currentStep === 4 ? "Create Campaign" : "Continue"}
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
              <h3 className="font-semibold text-[#0F1B2D] mb-2">Campaign Created Successfully</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Your WhatsApp campaign <strong>{formData.name}</strong> has been {formData.scheduleType === "now" ? "started" : "scheduled"} successfully.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/tenant/campaigns")}
                  className="w-full h-10 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
                >
                  Go to Campaign Manager
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/tenant/whatsapp/campaigns")}
                    className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                  >
                    WhatsApp Campaigns
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
