import React, { useState } from "react";
import { X, Globe, MousePointer, MessageCircle, Share2, Phone, Mail, User, Building, MapPin, Languages, Tag, Plus, ChevronDown } from "lucide-react";

interface CreateLeadSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface LeadSource {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

interface Pipeline {
  id: string;
  name: string;
  stages: string[];
}

interface CustomField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "dropdown" | "checkbox";
  required: boolean;
  options?: string[];
}

const leadSources: LeadSource[] = [
  { id: "web-form", label: "Web Form", icon: Globe, color: "#1565C0" },
  { id: "manual", label: "Manual Entry", icon: User, color: "#616161" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
  { id: "meta", label: "Meta Ads", icon: Share2, color: "#1877F2" },
  { id: "phone-call", label: "Phone Call", icon: Phone, color: "#F57C00" },
  { id: "email", label: "Email Campaign", icon: Mail, color: "#D32F2F" },
];

const pipelines: Pipeline[] = [
  { id: "sales", name: "Sales Pipeline", stages: ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"] },
  { id: "support", name: "Support Pipeline", stages: ["New Ticket", "In Progress", "Waiting for Customer", "Resolved", "Closed"] },
  { id: "collections", name: "Collections Pipeline", stages: ["Outstanding", "First Reminder", "Second Reminder", "Legal Notice", "Paid", "Written Off"] },
];

const users: User[] = [
  { id: "unassigned", name: "Unassigned", initials: "UN" },
  { id: "user1", name: "Akash Verma", initials: "AV" },
  { id: "user2", name: "Priya Sharma", initials: "PS" },
  { id: "user3", name: "Rohit Singh", initials: "RS" },
];

const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "Singapore"];
const languages = ["English", "Hindi", "Spanish", "French", "German", "Mandarin", "Arabic"];
const availableTags = ["Hot Lead", "Cold Lead", "VIP", "Enterprise", "SMB", "Follow-up Required"];

const customFields: CustomField[] = [
  { id: "budget", label: "Budget Range", type: "dropdown", required: false, options: ["< $10K", "$10K - $50K", "$50K - $100K", "> $100K"] },
  { id: "timeline", label: "Purchase Timeline", type: "dropdown", required: false, options: ["Immediate", "1-3 months", "3-6 months", "6+ months"] },
  { id: "employees", label: "Number of Employees", type: "number", required: false },
  { id: "website", label: "Company Website", type: "text", required: false },
];

const countryCodes = [
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "GB", flag: "🇬🇧" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
];

export function CreateLeadSlideOver({ isOpen, onClose, onSubmit }: CreateLeadSlideOverProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    countryCode: "+91",
    primaryPhone: "",
    email: "",
    alternatePhone: "",
    companyName: "",
    leadSource: "",
    pipeline: "",
    stage: "",
    assignTo: "unassigned",
    city: "",
    state: "",
    country: "",
    preferredLanguage: "",
    tags: [] as string[],
    customFields: {} as Record<string, any>,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [newTag, setNewTag] = useState("");
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);

  const selectedPipeline = pipelines.find(p => p.id === formData.pipeline);
  const availableStages = selectedPipeline?.stages || [];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };

    if (field === "fullName") {
      if (!value || value.trim() === "") {
        newErrors.fullName = "Full name is required";
      } else {
        delete newErrors.fullName;
      }
    }

    if (field === "primaryPhone") {
      if (!value || value.trim() === "") {
        newErrors.primaryPhone = "Primary phone is required";
      } else if (!/^\d{10}$/.test(value.replace(/\s/g, ""))) {
        newErrors.primaryPhone = "Please enter a valid 10-digit phone number";
      } else {
        delete newErrors.primaryPhone;
      }
    }

    if (field === "email" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }

    setErrors(newErrors);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.primaryPhone.trim()) newErrors.primaryPhone = "Primary phone is required";

    setErrors(newErrors);
    setTouched({ fullName: true, primaryPhone: true });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right max-md:w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
          <div>
            <h2 className="text-xl font-semibold text-[#212121]">Create New Lead</h2>
            <p className="text-sm text-[#9E9E9E] mt-0.5">Add a new lead to your pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#616161] hover:bg-[#F5F5F5] hover:text-[#212121] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-8">
            {/* Section 1: Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-[#212121] mb-4">Contact Information</h3>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Full Name <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={`w-full h-10 px-3 rounded-md border ${
                      errors.fullName && touched.fullName
                        ? "border-[#D32F2F] bg-[#FFEBEE]"
                        : "border-[#E0E0E0]"
                    } text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="text-xs text-[#D32F2F] mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Primary Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Primary Phone <span className="text-[#D32F2F]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryCodeDropdown(!showCountryCodeDropdown)}
                        className="w-20 h-10 px-2 rounded-md border border-[#E0E0E0] text-[#212121] text-sm flex items-center justify-between hover:border-[#1565C0] transition-colors"
                      >
                        <span>{formData.countryCode}</span>
                        <ChevronDown size={14} />
                      </button>
                      {showCountryCodeDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md border border-[#E0E0E0] shadow-lg z-10 py-1">
                          {countryCodes.map((cc) => (
                            <button
                              key={cc.code}
                              type="button"
                              onClick={() => {
                                handleInputChange("countryCode", cc.code);
                                setShowCountryCodeDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-[#212121] hover:bg-[#F5F5F5] flex items-center gap-2"
                            >
                              <span>{cc.flag}</span>
                              <span>{cc.code}</span>
                              <span className="text-[#9E9E9E]">{cc.country}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={formData.primaryPhone}
                      onChange={(e) => handleInputChange("primaryPhone", e.target.value)}
                      onBlur={() => handleBlur("primaryPhone")}
                      className={`flex-1 h-10 px-3 rounded-md border ${
                        errors.primaryPhone && touched.primaryPhone
                          ? "border-[#D32F2F] bg-[#FFEBEE]"
                          : "border-[#E0E0E0]"
                      } text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.primaryPhone && touched.primaryPhone && (
                    <p className="text-xs text-[#D32F2F] mt-1">{errors.primaryPhone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`w-full h-10 px-3 rounded-md border ${
                      errors.email && touched.email
                        ? "border-[#D32F2F] bg-[#FFEBEE]"
                        : "border-[#E0E0E0]"
                    } text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all`}
                    placeholder="email@example.com"
                  />
                  {errors.email && touched.email && (
                    <p className="text-xs text-[#D32F2F] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Alternate Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                    placeholder="Enter alternate phone"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E0E0E0]" />

            {/* Section 2: Lead Configuration */}
            <div>
              <h3 className="text-sm font-semibold text-[#212121] mb-4">Lead Configuration</h3>
              <div className="space-y-4">
                {/* Lead Source */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Lead Source
                  </label>
                  <select
                    value={formData.leadSource}
                    onChange={(e) => handleInputChange("leadSource", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                  >
                    <option value="">Select lead source</option>
                    {leadSources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pipeline */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Pipeline
                  </label>
                  <select
                    value={formData.pipeline}
                    onChange={(e) => {
                      handleInputChange("pipeline", e.target.value);
                      handleInputChange("stage", ""); // Reset stage when pipeline changes
                    }}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                  >
                    <option value="">Select pipeline</option>
                    {pipelines.map((pipeline) => (
                      <option key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stage */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => handleInputChange("stage", e.target.value)}
                    disabled={!formData.pipeline}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all disabled:bg-[#F5F5F5] disabled:text-[#9E9E9E] disabled:cursor-not-allowed"
                  >
                    <option value="">Select stage</option>
                    {availableStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  {!formData.pipeline && (
                    <p className="text-xs text-[#9E9E9E] mt-1">Select a pipeline first</p>
                  )}
                </div>

                {/* Assign To */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Assign To
                  </label>
                  <select
                    value={formData.assignTo}
                    onChange={(e) => handleInputChange("assignTo", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E0E0E0]" />

            {/* Section 3: Additional Info */}
            <div>
              <h3 className="text-sm font-semibold text-[#212121] mb-4">Additional Information</h3>
              <div className="space-y-4">
                {/* Location Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#424242] mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#424242] mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => handleInputChange("preferredLanguage", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                  >
                    <option value="">Select language</option>
                    {languages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-[#424242] mb-2">
                    Tags
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                        placeholder="Type and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="h-10 px-3 rounded-md bg-[#F5F5F5] text-[#1565C0] hover:bg-[#E3F2FD] transition-colors flex items-center gap-1"
                      >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Add</span>
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#E3F2FD] text-[#1565C0] text-xs font-medium"
                          >
                            <Tag size={12} />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-[#D32F2F]"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {availableTags
                        .filter(tag => !formData.tags.includes(tag))
                        .map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                            className="px-2 py-1 rounded-md border border-[#E0E0E0] text-[#616161] text-xs hover:border-[#1565C0] hover:text-[#1565C0] hover:bg-[#E3F2FD] transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E0E0E0]" />

            {/* Section 4: Custom Fields */}
            <div>
              <h3 className="text-sm font-semibold text-[#212121] mb-4">Custom Fields</h3>
              <div className="space-y-4">
                {customFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-[#424242] mb-2">
                      {field.label}
                      {field.required && <span className="text-[#D32F2F]">*</span>}
                    </label>
                    {field.type === "text" && (
                      <input
                        type="text"
                        value={formData.customFields[field.id] || ""}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            customFields: { ...prev.customFields, [field.id]: e.target.value },
                          }))
                        }
                        className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {field.type === "number" && (
                      <input
                        type="number"
                        value={formData.customFields[field.id] || ""}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            customFields: { ...prev.customFields, [field.id]: e.target.value },
                          }))
                        }
                        className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {field.type === "dropdown" && (
                      <select
                        value={formData.customFields[field.id] || ""}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            customFields: { ...prev.customFields, [field.id]: e.target.value },
                          }))
                        }
                        className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                      >
                        <option value="">Select {field.label.toLowerCase()}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="border-t border-[#E0E0E0] px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-md border border-[#E0E0E0] text-[#616161] text-sm font-semibold hover:bg-[#F5F5F5] hover:text-[#212121] hover:border-[#9E9E9E] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 h-11 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-sm font-semibold hover:shadow-lg transition-shadow"
            >
              Create Lead
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
