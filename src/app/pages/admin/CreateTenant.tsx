import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { Check, ChevronRight, Upload, X, Loader2, Users, Building2 } from "lucide-react";
import confetti from "canvas-confetti";

const steps = ["Customer Type", "Company Information", "Compliance & KYC", "Subscription & Review"];

const subscriptionPlans = [
  { name: "Starter", price: "NPR 15,000", cycle: "/mo", minutes: "5,000", agents: 5, concurrent: 5, features: ["AI Calling", "Basic CRM", "Basic Analytics", "Call Recording"], tier: "starter", featureCount: "7/12" },
  { name: "Growth", price: "NPR 35,000", cycle: "/mo", minutes: "15,000", agents: 15, concurrent: 15, features: ["AI Calling", "Basic CRM", "Basic Analytics", "Call Recording", "WhatsApp", "Campaign Management"], tier: "growth", popular: true, featureCount: "10/12" },
  { name: "Professional", price: "NPR 55,000", cycle: "/mo", minutes: "30,000", agents: 30, concurrent: 30, features: ["AI Calling", "Advanced CRM", "Advanced Analytics", "Call Recording", "WhatsApp", "Campaign Management", "API Access"], tier: "professional", featureCount: "11/12" },
];

const enterprisePlans = [
  { name: "Enterprise Basic", price: "NPR 75,000", cycle: "/mo", minutes: "50,000", agents: 50, concurrent: 50, features: ["AI Calling", "Enterprise CRM", "Advanced Analytics", "Call Recording", "WhatsApp", "Campaign Management", "API Access", "Webhooks", "Custom IVR", "Dedicated Support"], tier: "enterprise", featureCount: "12/12", licenses: 50 },
  { name: "Enterprise Plus", price: "NPR 150,000", cycle: "/mo", minutes: "100,000", agents: 100, concurrent: 100, features: ["AI Calling", "Enterprise CRM", "Advanced Analytics", "Call Recording", "WhatsApp", "Campaign Management", "API Access", "Webhooks", "Custom IVR", "Dedicated Support", "White Labeling", "SSO"], tier: "enterprise-plus", popular: true, featureCount: "12/12", licenses: 100 },
  { name: "Enterprise Custom", price: "Custom", cycle: "", minutes: "Unlimited", agents: "Unlimited", concurrent: "Unlimited", features: ["All Features", "Custom Development", "Dedicated Infrastructure", "SLA Guarantee", "24/7 Support", "Training & Onboarding"], tier: "enterprise-custom", featureCount: "12/12", licenses: "Custom" },
];

export function CreateTenant() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [customerType, setCustomerType] = useState<"individual" | "business">("individual");
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "", address: "", city: "", state: "", country: "Nepal", postalCode: "",
    contactName: "", mobile: "", email: "", timezone: "Asia/Kathmandu", locale: "ne-NP", currency: "NPR", industry: "",
    pan: "", panFile: null as File | null, incorporationFile: null as File | null,
    startDate: "2026-03-25", autoRenew: true, trialDays: 0,
  });

  const updateField = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const currentPlans = customerType === "individual" ? subscriptionPlans : enterprisePlans;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  if (success) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Tenants" }, { label: "Create New Tenant" }]} mode="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
              <Check size={40} className="text-[#2E7D32]" />
            </div>
            <h1 className="mb-2">Tenant Created Successfully!</h1>
            <p className="text-[#616161] mb-2">Your new tenant has been provisioned and is ready to use.</p>
            <div className="font-mono text-lg text-[#1565C0] mb-6">TNT-00249</div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate("/admin/tenants/TNT-00249")} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">View Tenant</button>
              <button onClick={() => { setSuccess(false); setStep(0); }} className="h-10 px-5 rounded-md border border-[#1565C0] text-[#1565C0] text-sm hover:bg-[#E3F2FD]">Create Another</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Tenants" }, { label: "Create New Tenant" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className={`w-20 h-0.5 ${i <= step ? "bg-[#1565C0]" : "bg-[#E0E0E0]"}`} />}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < step ? "bg-[#1565C0] text-white" : i === step ? "bg-[#1565C0] text-white" : "bg-[#E0E0E0] text-[#616161]"
                }`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-sm ${i <= step ? "text-[#212121] font-medium" : "text-[#9E9E9E]"}`}>{s}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 */}
        {step === 0 && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-w-4xl mx-auto">
            <h3 className="mb-2">Select Customer Type</h3>
            <p className="text-sm text-[#616161] mb-6">Choose the type of customer you want to onboard. This determines the available plans and features.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Individual Customer */}
              <div
                onClick={() => setCustomerType("individual")}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  customerType === "individual"
                    ? "border-[#1565C0] bg-[#E3F2FD] shadow-lg"
                    : "border-[#E0E0E0] hover:border-[#90CAF9]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    customerType === "individual" ? "bg-[#1565C0]" : "bg-[#F5F5F5]"
                  }`}>
                    <Users className={`w-6 h-6 ${customerType === "individual" ? "text-white" : "text-[#616161]"}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">Individual Customer</h4>
                    <p className="text-sm text-[#616161] mb-3">For individual users or small teams who need subscription-based access.</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-[#212121]">
                        <Check size={14} className="text-[#2E7D32]" />Subscription Plans
                      </div>
                      <div className="flex items-center gap-2 text-[#212121]">
                        <Check size={14} className="text-[#2E7D32]" />No License Management
                      </div>
                      <div className="flex items-center gap-2 text-[#212121]">
                        <Check size={14} className="text-[#2E7D32]" />Pay-as-you-go Billing
                      </div>
                    </div>
                  </div>
                </div>
                {customerType === "individual" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#1565C0] flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>

              {/* Business Customer */}
              <div
                onClick={() => setCustomerType("business")}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  customerType === "business"
                    ? "border-[#F57F17] bg-[#FFF8E1] shadow-lg"
                    : "border-[#E0E0E0] hover:border-[#FFE082]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    customerType === "business" ? "bg-[#F57F17]" : "bg-[#F5F5F5]"
                  }`}>
                    <Building2 className={`w-6 h-6 ${customerType === "business" ? "text-white" : "text-[#616161]"}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">Business / Enterprise</h4>
                    <p className="text-sm text-[#616161] mb-3">For companies requiring enterprise features and license-based user management.</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-[#212121]">
                        <Check size={14} className="text-[#2E7D32]" />Enterprise Plans
                      </div>
                      <div className="flex items-center gap-2 text-[#212121]">
                        <Check size={14} className="text-[#2E7D32]" />License Management
                      </div>
                      <div className="flex items-center gap-2 text-[#212121]">
                        <Check size={14} className="text-[#2E7D32]" />Custom Features & SLA
                      </div>
                    </div>
                  </div>
                </div>
                {customerType === "business" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#F57F17] flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#EEEEEE]">
              <button onClick={() => navigate("/admin/tenants")} className="h-10 px-4 rounded-md border border-[#1565C0] text-[#1565C0] text-sm">Cancel</button>
              <button onClick={() => setStep(1)} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] flex items-center gap-2">
                Next: Company Information <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-w-4xl mx-auto">
            <h3 className="mb-5">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block mb-1">Company Legal Name <span className="text-[#C62828]">*</span></label>
                <input value={formData.companyName} onChange={e => updateField("companyName", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" placeholder="Enter registered company name" />
              </div>
              <div className="col-span-2">
                <label className="block mb-1">Registered Address <span className="text-[#C62828]">*</span></label>
                <textarea value={formData.address} onChange={e => updateField("address", e.target.value)} className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" rows={3} placeholder="Full registered address" />
              </div>
              <div>
                <label className="block mb-1">City <span className="text-[#C62828]">*</span></label>
                <input value={formData.city} onChange={e => updateField("city", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" placeholder="City name" />
              </div>
              <div>
                <label className="block mb-1">State / Province</label>
                <input value={formData.state} onChange={e => updateField("state", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" placeholder="State or province" />
              </div>
              <div>
                <label className="block mb-1">Country <span className="text-[#C62828]">*</span></label>
                <select value={formData.country} onChange={e => updateField("country", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white focus:border-[#1565C0] outline-none">
                  <option>Nepal</option><option>India</option><option>Bangladesh</option><option>Sri Lanka</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Postal Code</label>
                <input value={formData.postalCode} onChange={e => updateField("postalCode", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" placeholder="Postal / ZIP code" />
              </div>
              <div>
                <label className="block mb-1">Primary Contact Name <span className="text-[#C62828]">*</span></label>
                <input value={formData.contactName} onChange={e => updateField("contactName", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" placeholder="Full name" />
              </div>
              <div>
                <label className="block mb-1">Primary Contact Mobile <span className="text-[#C62828]">*</span></label>
                <div className="flex">
                  <span className="h-10 px-3 border border-r-0 border-[#E0E0E0] rounded-l-md bg-[#F5F5F5] flex items-center text-sm text-[#616161]">+977</span>
                  <input value={formData.mobile} onChange={e => updateField("mobile", e.target.value)} className="flex-1 h-10 border border-[#E0E0E0] rounded-r-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block mb-1">Primary Contact Email <span className="text-[#C62828]">*</span></label>
                <input type="email" value={formData.email} onChange={e => updateField("email", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" placeholder="email@company.com" />
              </div>
              <div>
                <label className="block mb-1">Timezone <span className="text-[#C62828]">*</span></label>
                <select value={formData.timezone} onChange={e => updateField("timezone", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option>Asia/Kathmandu</option><option>Asia/Kolkata</option><option>UTC</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Locale <span className="text-[#C62828]">*</span></label>
                <select value={formData.locale} onChange={e => updateField("locale", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option>ne-NP</option><option>en-US</option><option>hi-IN</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Currency <span className="text-[#C62828]">*</span></label>
                <select value={formData.currency} onChange={e => updateField("currency", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option>NPR</option><option>INR</option><option>USD</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Industry</label>
                <select value={formData.industry} onChange={e => updateField("industry", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option value="">Select industry (optional)</option>
                  <option>Technology</option><option>Finance</option><option>Healthcare</option><option>Education</option><option>Retail</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#EEEEEE]">
              <button onClick={() => navigate("/admin/tenants")} className="h-10 px-4 rounded-md border border-[#1565C0] text-[#1565C0] text-sm">Cancel</button>
              <button onClick={() => setStep(2)} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] flex items-center gap-2">
                Next: Compliance <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-w-4xl mx-auto">
            <h3 className="mb-5">Compliance & KYC</h3>
            <div className="space-y-5">
              <div>
                <label className="block mb-1">PAN Number {formData.country === "Nepal" && <span className="text-[#C62828]">*</span>}</label>
                <input value={formData.pan} onChange={e => updateField("pan", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] outline-none max-w-md" placeholder="Enter PAN number" />
                <p className="text-xs text-[#616161] mt-1">Required for Nepal-based companies</p>
              </div>
              {["PAN Certificate", "Certificate of Incorporation"].map(doc => (
                <div key={doc}>
                  <label className="block mb-1">{doc} <span className="text-[#C62828]">*</span></label>
                  <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg h-[120px] flex flex-col items-center justify-center hover:border-[#1565C0] transition-colors cursor-pointer">
                    <Upload size={24} className="text-[#9E9E9E] mb-2" />
                    <span className="text-sm text-[#616161]">Drag file here or click to browse</span>
                    <span className="text-xs text-[#9E9E9E] mt-1">PDF, JPG, PNG up to {doc.includes("PAN") ? "5MB" : "10MB"}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 pt-4 border-t border-[#EEEEEE]">
              <button onClick={() => setStep(1)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Back</button>
              <button onClick={() => setStep(3)} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] flex items-center gap-2">
                Next: Subscription <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 3 && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="mb-1">Select {customerType === "individual" ? "Subscription" : "Enterprise"} Plan</h3>
                  <p className="text-sm text-[#616161]">
                    {customerType === "individual" 
                      ? "Choose a subscription plan based on AI minutes and features needed."
                      : "Enterprise plans include license-based user management and advanced features."
                    }
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {currentPlans.map((plan, i) => (
                  <div
                    key={plan.name}
                    onClick={() => setSelectedPlan(i)}
                    className={`relative rounded-lg border-2 p-5 cursor-pointer transition-all ${
                      selectedPlan === i
                        ? customerType === "business" ? "border-[#F57F17] shadow-lg" : "border-[#1565C0] shadow-lg"
                        : "border-[#E0E0E0] hover:border-[#90CAF9]"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1565C0] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full">Most Popular</div>
                    )}
                    <h4 className="mb-1">{plan.name}</h4>
                    <div className="text-2xl font-bold text-[#212121]">{plan.price}<span className="text-sm font-normal text-[#616161]">{plan.cycle}</span></div>
                    <div className="text-sm text-[#616161] mt-2 mb-4">{plan.minutes} AI Minutes</div>
                    <div className="space-y-1.5 text-sm border-t border-[#EEEEEE] pt-3">
                      <div className="text-[#616161]">{plan.agents} Agents · {plan.concurrent} Concurrent Calls</div>
                      {customerType === "business" && 'licenses' in plan && (
                        <div className="text-[#F57F17] font-medium">{plan.licenses} Licenses Included</div>
                      )}
                      <div className="text-[#616161]">{plan.featureCount} Features</div>
                      {plan.features.slice(0, 4).map(f => (
                        <div key={f} className="flex items-center gap-2 text-[#212121]">
                          <Check size={14} className="text-[#2E7D32]" />{f}
                        </div>
                      ))}
                      {plan.features.length > 4 && <div className="text-xs text-[#1565C0]">+{plan.features.length - 4} more features</div>}
                    </div>
                  </div>
                ))}
              </div>
              
              {customerType === "business" && (
                <div className="mt-4 p-4 bg-[#FFF8E1] border border-[#FFE082] rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#F57F17] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-white" />
                    </div>
                    <div className="text-sm text-[#616161]">
                      <span className="font-medium text-[#212121]">License Management Enabled:</span> Each enterprise plan includes user licenses. Additional licenses can be purchased as needed. Licenses will be automatically created upon tenant provisioning.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Start Date</label>
                <input type="date" value={formData.startDate} onChange={e => updateField("startDate", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <label className="text-sm text-[#212121]">Auto-Renew</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.autoRenew} onChange={e => updateField("autoRenew", e.target.checked)} />
                  <div className="w-9 h-5 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
              <div>
                <label className="block mb-1">Trial Period (days)</label>
                <input type="number" min={0} max={30} value={formData.trialDays} onChange={e => updateField("trialDays", +e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
              </div>
            </div>

            {/* Review Summary */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h4 className="mb-4">Review Summary</h4>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="text-xs text-[#9E9E9E] uppercase font-semibold mb-2">Company Information</div>
                  <div className="space-y-1">
                    <div><span className="text-[#616161]">Company:</span> {formData.companyName || "—"}</div>
                    <div><span className="text-[#616161]">City:</span> {formData.city || "—"}, {formData.country}</div>
                    <div><span className="text-[#616161]">Contact:</span> {formData.contactName || "—"}</div>
                    <div><span className="text-[#616161]">Email:</span> {formData.email || "—"}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] uppercase font-semibold mb-2">Subscription</div>
                  <div className="space-y-1">
                    <div><span className="text-[#616161]">Plan:</span> {currentPlans[selectedPlan].name}</div>
                    <div><span className="text-[#616161]">Price:</span> {currentPlans[selectedPlan].price}{currentPlans[selectedPlan].cycle}</div>
                    <div><span className="text-[#616161]">AI Minutes:</span> {currentPlans[selectedPlan].minutes}</div>
                    <div><span className="text-[#616161]">Start Date:</span> {formData.startDate}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Back</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="h-10 px-6 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] flex items-center gap-2 disabled:opacity-60">
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Provisioning...</> : "Create Tenant"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}