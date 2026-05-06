import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useEmail } from "../../hooks/useEmail";
import {
  ArrowLeft,
  Save,
  Users,
  Mail,
  Calendar,
  Settings,
  CheckCircle,
  Play
} from "lucide-react";

export function CreateEmailCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { campaigns, templates, createCampaign, updateCampaign, startCampaign } = useEmail();

  const isEditing = !!id;
  const existingCampaign = isEditing ? campaigns.find(c => c.id === id) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "broadcast" as "broadcast" | "drip" | "event-triggered" | "transactional" | "call-to-email",
    templateId: "",
    audienceSize: 0,
    schedule: {
      startDate: "",
      endDate: "",
      timezone: "UTC",
      sendTime: "09:00"
    }
  });

  useEffect(() => {
    if (existingCampaign) {
      setFormData({
        name: existingCampaign.name,
        type: existingCampaign.type,
        templateId: existingCampaign.templateId || "",
        audienceSize: existingCampaign.audienceSize,
        schedule: existingCampaign.schedule || {
          startDate: "",
          endDate: "",
          timezone: "UTC",
          sendTime: "09:00"
        }
      });
    }
  }, [existingCampaign]);

  const handleSave = () => {
    if (isEditing && id) {
      updateCampaign(id, formData);
      navigate("/tenant/email/campaigns");
    } else {
      const newId = createCampaign(formData);
      navigate("/tenant/email/campaigns");
    }
  };

  const handleSaveAndStart = () => {
    if (isEditing && id) {
      updateCampaign(id, formData);
      startCampaign(id);
      navigate("/tenant/email/campaigns");
    } else {
      const newId = createCampaign(formData);
      startCampaign(newId);
      navigate("/tenant/email/campaigns");
    }
  };

  const steps = [
    { number: 1, title: "Campaign Details", icon: Settings },
    { number: 2, title: "Template", icon: Mail },
    { number: 3, title: "Audience", icon: Users },
    { number: 4, title: "Schedule", icon: Calendar }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.type;
      case 2:
        return formData.templateId;
      case 3:
        return formData.audienceSize > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/email/campaigns")}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">
                {isEditing ? "Edit Campaign" : "Create Campaign"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Set up an email campaign to reach your audience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                    style={{ marginBottom: "2.5rem" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Q2 Product Launch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="broadcast">Broadcast - One-time send to all recipients</option>
                    <option value="drip">Drip/Nurture - Series over time</option>
                    <option value="event-triggered">Event-Triggered - Based on actions</option>
                    <option value="transactional">Transactional - Order confirmations, etc.</option>
                    <option value="call-to-email">Call-to-Email - Follow up on calls</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Select Template</h3>

              <div className="space-y-3">
                {templates.filter(t => t.status === "active").map(template => (
                  <div
                    key={template.id}
                    onClick={() => setFormData({ ...formData, templateId: template.id })}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.templateId === template.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            template.category === "marketing"
                              ? "bg-purple-100 text-purple-700"
                              : template.category === "transactional"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{template.subject}</p>
                      </div>
                      {formData.templateId === template.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}

                {templates.filter(t => t.status === "active").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No active templates available</p>
                    <button
                      onClick={() => navigate("/tenant/email/templates/create")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Create Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Select Audience</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Count *
                  </label>
                  <input
                    type="number"
                    value={formData.audienceSize}
                    onChange={(e) => setFormData({ ...formData, audienceSize: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the number of recipients for this campaign
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1">Audience Targeting</h4>
                      <p className="text-sm text-blue-800">
                        In a production environment, you would select specific segments,
                        tags, or filters to define your target audience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Schedule Campaign</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.schedule.startDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule, startDate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Send Time
                    </label>
                    <input
                      type="time"
                      value={formData.schedule.sendTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule, sendTime: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.schedule.timezone}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, timezone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                {formData.type === "drip" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.schedule.endDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule, endDate: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-1">Campaign Ready</h4>
                      <p className="text-sm text-green-800">
                        Your campaign is configured and ready to launch.
                        Review all details before starting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep === 4 ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </button>
                <button
                  onClick={handleSaveAndStart}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Save & Start
                </button>
              </>
            ) : (
              <button
                onClick={() => canProceed() && setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
