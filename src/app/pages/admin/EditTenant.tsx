import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { Check, Upload, Loader2 } from "lucide-react";

// Mock data - in real app would fetch from API based on tenantId
const tenantData: Record<string, any> = {
  "TNT-00042": {
    companyName: "Everest Digital Solutions Pvt. Ltd.", 
    address: "Durbar Marg, Ward 10", 
    city: "Kathmandu", 
    state: "Bagmati", 
    country: "Nepal", 
    postalCode: "44600",
    contactName: "Rajesh Sharma", 
    mobile: "9841234567", 
    email: "rajesh@everestdigital.com", 
    timezone: "Asia/Kathmandu", 
    locale: "ne-NP", 
    currency: "NPR", 
    industry: "Technology",
    pan: "123456789", 
    panFile: "pan_certificate.pdf", 
    incorporationFile: "incorporation_certificate.pdf",
  }
};

export function EditTenant() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"company" | "compliance">("company");
  
  const initialData = tenantData[tenantId as string] || {};
  const [formData, setFormData] = useState(initialData);

  const updateField = (field: string, value: any) => setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/admin/tenants/${tenantId}`);
    }, 1500);
  };

  if (!tenantData[tenantId as string]) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Tenants" }, { label: "Not Found" }]} mode="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Tenant Not Found</h3>
            <p className="text-sm text-[#616161] mb-4">The tenant you're trying to edit doesn't exist.</p>
            <button onClick={() => navigate("/admin/tenants")} className="h-10 px-4 rounded-md bg-[#1565C0] text-white text-sm">
              Back to Tenants
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
          { label: "Tenants", onClick: () => navigate("/admin/tenants") }, 
          { label: tenantId || "", onClick: () => navigate(`/admin/tenants/${tenantId}`) },
          { label: "Edit" }
        ]} 
        mode="admin" 
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#0F1B2D] mb-2">Edit Tenant</h1>
            <p className="text-sm text-[#616161]">Update tenant information and compliance documents</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] mb-6">
            <div className="flex border-b border-[#E0E0E0]">
              <button
                onClick={() => setActiveTab("company")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "company" 
                    ? "border-[#1565C0] text-[#1565C0]" 
                    : "border-transparent text-[#616161] hover:text-[#212121]"
                }`}
              >
                Company Information
              </button>
              <button
                onClick={() => setActiveTab("compliance")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "compliance" 
                    ? "border-[#1565C0] text-[#1565C0]" 
                    : "border-transparent text-[#616161] hover:text-[#212121]"
                }`}
              >
                Compliance & KYC
              </button>
            </div>

            <div className="p-6">
              {activeTab === "company" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block mb-1 text-sm font-medium">Company Legal Name <span className="text-[#C62828]">*</span></label>
                    <input 
                      value={formData.companyName} 
                      onChange={e => updateField("companyName", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      placeholder="Enter registered company name" 
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block mb-1 text-sm font-medium">Registered Address <span className="text-[#C62828]">*</span></label>
                    <textarea 
                      value={formData.address} 
                      onChange={e => updateField("address", e.target.value)} 
                      className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      rows={3} 
                      placeholder="Full registered address" 
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">City <span className="text-[#C62828]">*</span></label>
                    <input 
                      value={formData.city} 
                      onChange={e => updateField("city", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      placeholder="City name" 
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">State / Province</label>
                    <input 
                      value={formData.state} 
                      onChange={e => updateField("state", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      placeholder="State or province" 
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Country <span className="text-[#C62828]">*</span></label>
                    <select 
                      value={formData.country} 
                      onChange={e => updateField("country", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white focus:border-[#1565C0] outline-none"
                    >
                      <option>Nepal</option>
                      <option>India</option>
                      <option>Bangladesh</option>
                      <option>Sri Lanka</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Postal Code</label>
                    <input 
                      value={formData.postalCode} 
                      onChange={e => updateField("postalCode", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      placeholder="Postal / ZIP code" 
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Primary Contact Name <span className="text-[#C62828]">*</span></label>
                    <input 
                      value={formData.contactName} 
                      onChange={e => updateField("contactName", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      placeholder="Full name" 
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Primary Contact Mobile <span className="text-[#C62828]">*</span></label>
                    <div className="flex">
                      <span className="h-10 px-3 border border-r-0 border-[#E0E0E0] rounded-l-md bg-[#F5F5F5] flex items-center text-sm text-[#616161]">+977</span>
                      <input 
                        value={formData.mobile} 
                        onChange={e => updateField("mobile", e.target.value)} 
                        className="flex-1 h-10 border border-[#E0E0E0] rounded-r-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block mb-1 text-sm font-medium">Primary Contact Email <span className="text-[#C62828]">*</span></label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => updateField("email", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none" 
                      placeholder="email@company.com" 
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Timezone <span className="text-[#C62828]">*</span></label>
                    <select 
                      value={formData.timezone} 
                      onChange={e => updateField("timezone", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                    >
                      <option>Asia/Kathmandu</option>
                      <option>Asia/Kolkata</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Locale <span className="text-[#C62828]">*</span></label>
                    <select 
                      value={formData.locale} 
                      onChange={e => updateField("locale", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                    >
                      <option>ne-NP</option>
                      <option>en-US</option>
                      <option>hi-IN</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Currency <span className="text-[#C62828]">*</span></label>
                    <select 
                      value={formData.currency} 
                      onChange={e => updateField("currency", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                    >
                      <option>NPR</option>
                      <option>INR</option>
                      <option>USD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium">Industry</label>
                    <select 
                      value={formData.industry} 
                      onChange={e => updateField("industry", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                    >
                      <option value="">Select industry (optional)</option>
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Retail</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "compliance" && (
                <div className="space-y-5">
                  <div>
                    <label className="block mb-1 text-sm font-medium">PAN Number {formData.country === "Nepal" && <span className="text-[#C62828]">*</span>}</label>
                    <input 
                      value={formData.pan} 
                      onChange={e => updateField("pan", e.target.value)} 
                      className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] outline-none max-w-md" 
                      placeholder="Enter PAN number" 
                    />
                    <p className="text-xs text-[#616161] mt-1">Required for Nepal-based companies</p>
                  </div>
                  
                  {["PAN Certificate", "Certificate of Incorporation"].map(doc => {
                    const fieldKey = doc.includes("PAN") ? "panFile" : "incorporationFile";
                    const currentFile = formData[fieldKey];
                    
                    return (
                      <div key={doc}>
                        <label className="block mb-1 text-sm font-medium">{doc} <span className="text-[#C62828]">*</span></label>
                        
                        {currentFile && (
                          <div className="mb-2 p-3 bg-[#E8F5E9] rounded-md border border-[#2E7D32] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Check size={16} className="text-[#2E7D32]" />
                              <span className="text-sm text-[#212121]">{currentFile}</span>
                              <span className="text-xs text-[#2E7D32] font-medium">Verified</span>
                            </div>
                            <button 
                              onClick={() => updateField(fieldKey, null)}
                              className="text-xs text-[#C62828] hover:underline"
                            >
                              Replace
                            </button>
                          </div>
                        )}
                        
                        {!currentFile && (
                          <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg h-[120px] flex flex-col items-center justify-center hover:border-[#1565C0] transition-colors cursor-pointer">
                            <Upload size={24} className="text-[#9E9E9E] mb-2" />
                            <span className="text-sm text-[#616161]">Drag file here or click to browse</span>
                            <span className="text-xs text-[#9E9E9E] mt-1">PDF, JPG, PNG up to {doc.includes("PAN") ? "5MB" : "10MB"}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button 
              onClick={() => navigate(`/admin/tenants/${tenantId}`)} 
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
                  Saving...
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
