import React, { useState } from "react";
import { X, Sparkles, Search, MapPin, Filter, Users, AlertCircle } from "lucide-react";

interface ScrapingRequest {
  templateId: string;
  industry?: string;
  location?: string;
  keywords?: string;
  leadCount?: number;
  assignedTo?: string;
  additionalFilters?: string;
}

interface ScrapingRequestFormProps {
  templateTitle: string;
  onSubmit: (request: ScrapingRequest) => void;
  onCancel: () => void;
}

const teamMembers = [
  { id: "akash", name: "Akash Shrestha", role: "Lead Scraping Specialist" },
  { id: "priya", name: "Priya Tamang", role: "Data Research Analyst" },
  { id: "rohit", name: "Rohit KC", role: "Business Intelligence" },
];

const industries = [
  "Technology & IT",
  "Manufacturing",
  "Retail & E-commerce",
  "Healthcare",
  "Education",
  "Real Estate",
  "Finance & Banking",
  "Hospitality & Tourism",
  "Agriculture",
  "Construction",
  "Automotive",
  "Food & Beverage",
];

const locations = [
  "Kathmandu Valley",
  "Pokhara",
  "Biratnagar",
  "Butwal",
  "Nepalgunj",
  "Dharan",
  "Birgunj",
  "Hetauda",
  "Nationwide",
];

export function ScrapingRequestForm({ templateTitle, onSubmit, onCancel }: ScrapingRequestFormProps) {
  const [formData, setFormData] = useState<ScrapingRequest>({
    templateId: "",
    leadCount: 100,
    assignedTo: "akash",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div>
            <h3 className="text-lg font-semibold text-white">{templateTitle}</h3>
            <p className="text-sm text-white/80">Configure your lead generation requirements</p>
          </div>
          <button onClick={onCancel} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Industry */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Target Industry <span className="text-[#C62828]">*</span>
            </label>
            <select
              value={formData.industry || ""}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              required
            >
              <option value="">Select industry...</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Geographic Location <span className="text-[#C62828]">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={16} />
              <select
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-10 pl-10 pr-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                required
              >
                <option value="">Select location...</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-[#9E9E9E]" size={16} />
              <textarea
                value={formData.keywords || ""}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="Enter keywords to refine your search (e.g., software company, hardware store, restaurant)"
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
              />
            </div>
          </div>

          {/* Lead Count */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Target Lead Count
            </label>
            <input
              type="number"
              value={formData.leadCount || 100}
              onChange={(e) => setFormData({ ...formData, leadCount: Number(e.target.value) })}
              min="10"
              max="10000"
              step="10"
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            />
            <div className="flex justify-between text-xs text-[#616161] mt-1">
              <span>Minimum: 10</span>
              <span>Maximum: 10,000</span>
            </div>
          </div>

          {/* Assigned To */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Assign To Team Member
            </label>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.assignedTo === member.id
                      ? 'border-[#1565C0] bg-[#E3F2FD]'
                      : 'border-[#E0E0E0] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="assignedTo"
                    value={member.id}
                    checked={formData.assignedTo === member.id}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-4 h-4"
                  />
                  <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-xs font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#212121]">{member.name}</div>
                    <div className="text-xs text-[#616161]">{member.role}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Additional Filters (Optional)
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-[#9E9E9E]" size={16} />
              <textarea
                value={formData.additionalFilters || ""}
                onChange={(e) => setFormData({ ...formData, additionalFilters: e.target.value })}
                placeholder="Specify any additional requirements (e.g., company size, revenue range, certifications)"
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-[#E3F2FD] border border-[#90CAF9] flex items-start gap-2">
            <AlertCircle className="text-[#1565C0] shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-[#1565C0]">
              <strong>Processing Time:</strong> Lead generation typically takes 2-24 hours depending on complexity and volume. 
              You'll receive an email notification when your leads are ready.
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
          <div className="text-sm text-[#616161]">
            Estimated Cost: <span className="font-bold text-[#1565C0]">3 Credits</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2"
            >
              <Sparkles size={16} />
              Generate Leads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
