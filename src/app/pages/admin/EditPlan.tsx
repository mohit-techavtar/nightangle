import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { Loader2, Check, AlertTriangle } from "lucide-react";

// Mock plan data
const planData: Record<string, any> = {
  "PLAN-GRW-001": {
    name: "Growth",
    tier: "Growth",
    description: "Perfect for growing businesses that need advanced features and higher usage limits.",
    basePrice: 35000,
    currency: "NPR",
    billingCycle: "Monthly",
    aiMinutes: 15000,
    maxAgents: 15,
    maxConcurrent: 15,
    maxUsers: 25,
    maxCampaigns: 10,
    features: {
      "AI Calling": true,
      "WhatsApp": true,
      "Campaign Management": true,
      "Basic CRM": true,
      "Basic Analytics": true,
      "Call Recording": true,
      "Advanced CRM": false,
      "Advanced Analytics": false,
      "API Access": false,
      "Webhooks": false,
      "Custom IVR": false,
      "Sentiment Analysis": false,
    },
    status: "Published",
  }
};

const allFeatures = [
  "AI Calling",
  "WhatsApp",
  "Campaign Management",
  "Basic CRM",
  "Advanced CRM",
  "Basic Analytics",
  "Advanced Analytics",
  "Call Recording",
  "API Access",
  "Webhooks",
  "Custom IVR",
  "Sentiment Analysis",
];

export function EditPlan() {
  const { planCode } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "limits" | "features">("basic");
  
  const initialData = planData[planCode as string] || {};
  const [formData, setFormData] = useState(initialData);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateFeature = (feature: string, enabled: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled }
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/admin/subscription-plans/${planCode}`);
    }, 1500);
  };

  if (!planData[planCode as string]) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Subscription Plans" }, { label: "Not Found" }]} mode="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Plan Not Found</h3>
            <p className="text-sm text-[#616161] mb-4">The plan you're trying to edit doesn't exist.</p>
            <button onClick={() => navigate("/admin/subscription-plans")} className="h-10 px-4 rounded-md bg-[#1565C0] text-white text-sm">
              Back to Plans
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar 
        breadcrumbs={[
          { label: "Dashboard" }, 
          { label: "Subscription Plans", onClick: () => navigate("/admin/subscription-plans") }, 
          { label: planCode || "", onClick: () => navigate(`/admin/subscription-plans/${planCode}`) },
          { label: "Edit" }
        ]} 
        mode="admin" 
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#0F1B2D] mb-2">Edit Plan</h1>
            <p className="text-sm text-[#616161]">Update plan configuration and features</p>
          </div>

          {/* Warning Banner */}
          <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-md p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-[#F57F17] mt-0.5" />
            <div className="text-sm text-[#F57F17]">
              <div className="font-semibold mb-1">Important</div>
              <div>Changes to this plan will affect all {initialData.name === "Growth" ? "42" : "0"} active tenants using this plan. Price changes will apply from the next billing cycle.</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] mb-6">
            <div className="flex border-b border-[#E0E0E0]">
              {[
                { key: "basic", label: "Basic Info" },
                { key: "pricing", label: "Pricing" },
                { key: "limits", label: "Resource Limits" },
                { key: "features", label: "Features" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key 
                      ? "border-[#1565C0] text-[#1565C0]" 
                      : "border-transparent text-[#616161] hover:text-[#212121]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Plan Name <span className="text-[#C62828]">*</span>
                      </label>
                      <input 
                        value={formData.name} 
                        onChange={e => updateField("name", e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                        placeholder="e.g., Growth" 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Tier <span className="text-[#C62828]">*</span>
                      </label>
                      <select 
                        value={formData.tier} 
                        onChange={e => updateField("tier", e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white focus:border-[#1565C0] outline-none"
                      >
                        <option>Starter</option>
                        <option>Growth</option>
                        <option>Enterprise</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={e => updateField("description", e.target.value)} 
                      className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      rows={3} 
                      placeholder="Plan description for customers" 
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Status <span className="text-[#C62828]">*</span>
                    </label>
                    <select 
                      value={formData.status} 
                      onChange={e => updateField("status", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white focus:border-[#1565C0] outline-none max-w-xs"
                    >
                      <option>Published</option>
                      <option>Draft</option>
                      <option>Archived</option>
                    </select>
                    <p className="text-xs text-[#616161] mt-1">Only published plans are visible to new tenants</p>
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Base Price <span className="text-[#C62828]">*</span>
                      </label>
                      <input 
                        type="number" 
                        value={formData.basePrice} 
                        onChange={e => updateField("basePrice", +e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                        placeholder="35000" 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Currency</label>
                      <select 
                        value={formData.currency} 
                        onChange={e => updateField("currency", e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                      >
                        <option>NPR</option>
                        <option>USD</option>
                        <option>INR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Billing Cycle</label>
                      <select 
                        value={formData.billingCycle} 
                        onChange={e => updateField("billingCycle", e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                      >
                        <option>Monthly</option>
                        <option>Yearly</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-md p-4 mt-4">
                    <div className="text-sm font-medium text-[#1565C0] mb-2">Pricing Summary</div>
                    <div className="text-2xl font-bold text-[#212121]">
                      {formData.currency} {formData.basePrice?.toLocaleString()}
                      <span className="text-sm font-normal text-[#616161]"> / {formData.billingCycle?.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resource Limits Tab */}
              {activeTab === "limits" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Included AI Minutes <span className="text-[#C62828]">*</span>
                      </label>
                      <input 
                        type="number" 
                        value={formData.aiMinutes} 
                        onChange={e => updateField("aiMinutes", +e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                        placeholder="15000" 
                      />
                      <p className="text-xs text-[#616161] mt-1">Total AI calling minutes per billing cycle</p>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Max Agents</label>
                      <input 
                        type="number" 
                        value={formData.maxAgents} 
                        onChange={e => updateField("maxAgents", +e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                        placeholder="15" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Concurrent Calls</label>
                      <input 
                        type="number" 
                        value={formData.maxConcurrent} 
                        onChange={e => updateField("maxConcurrent", +e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                        placeholder="15" 
                      />
                      <p className="text-xs text-[#616161] mt-1">Maximum simultaneous active calls</p>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Max Users</label>
                      <input 
                        type="number" 
                        value={formData.maxUsers} 
                        onChange={e => updateField("maxUsers", +e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                        placeholder="25" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Max Campaigns</label>
                      <input 
                        type="number" 
                        value={formData.maxCampaigns} 
                        onChange={e => updateField("maxCampaigns", +e.target.value)} 
                        className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                        placeholder="10" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && (
                <div className="space-y-4">
                  <div className="mb-3">
                    <p className="text-sm text-[#616161]">Select which features are available in this plan</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {allFeatures.map((feature) => (
                      <label 
                        key={feature} 
                        className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                          formData.features[feature] 
                            ? "bg-[#E8F5E9] border-[#81C784]" 
                            : "bg-white border-[#E0E0E0] hover:border-[#BDBDBD]"
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={formData.features[feature] || false}
                          onChange={e => updateFeature(feature, e.target.checked)}
                          className="rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]" 
                        />
                        <span className={`text-sm font-medium ${formData.features[feature] ? "text-[#212121]" : "text-[#616161]"}`}>
                          {feature}
                        </span>
                        {formData.features[feature] && <Check size={16} className="text-[#2E7D32] ml-auto" />}
                      </label>
                    ))}
                  </div>
                  
                  <div className="bg-[#F5F5F5] rounded-md p-4 mt-4">
                    <div className="text-sm font-medium text-[#212121] mb-1">
                      {Object.values(formData.features).filter(Boolean).length} / {allFeatures.length} features enabled
                    </div>
                    <div className="text-xs text-[#616161]">
                      Enabled features will be accessible to all tenants on this plan
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button 
              onClick={() => navigate(`/admin/subscription-plans/${planCode}`)} 
              className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5]"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="h-10 px-6 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> 
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
