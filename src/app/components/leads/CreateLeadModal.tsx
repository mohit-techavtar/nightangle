import React, { useState } from "react";
import { X, User, Building, Phone, Mail, MapPin, DollarSign, Tag } from "lucide-react";

interface CreateLeadModalProps {
  onCreateLead: (lead: any) => void;
  onClose: () => void;
}

export function CreateLeadModal({ onCreateLead, onClose }: CreateLeadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    pipeline: "Sales",
    stage: "New",
    owner: "Akash Sharma",
    value: "",
    location: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sources = ["Website", "Referral", "Cold Call", "Social Media", "Email Campaign", "Trade Show", "Partner"];
  const pipelines = ["Sales", "Support", "Collections"];
  const stagesByPipeline: Record<string, string[]> = {
    "Sales": ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
    "Support": ["New", "In Progress", "Waiting", "Resolved", "Closed"],
    "Collections": ["New", "First Notice", "Second Notice", "Legal", "Paid", "Written Off"],
  };
  const owners = ["Akash Sharma", "Priya Thapa", "Rohit Gurung", "Sita Rai", "Ramesh KC"];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onCreateLead({
      ...formData,
      value: formData.value ? parseInt(formData.value) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div>
            <h3 className="text-lg font-semibold text-white">Create New Lead</h3>
            <p className="text-sm text-white/80">Add a new lead to your pipeline</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block flex items-center gap-2">
                <User size={14} />
                Full Name <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full h-10 px-3 border rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 ${
                  errors.name ? "border-[#C62828]" : "border-[#E0E0E0]"
                }`}
                placeholder="e.g., Rajesh Kumar Sharma"
              />
              {errors.name && <p className="text-xs text-[#C62828] mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block flex items-center gap-2">
                <Mail size={14} />
                Email Address <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full h-10 px-3 border rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 ${
                  errors.email ? "border-[#C62828]" : "border-[#E0E0E0]"
                }`}
                placeholder="e.g., rajesh@example.com"
              />
              {errors.email && <p className="text-xs text-[#C62828] mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block flex items-center gap-2">
                <Phone size={14} />
                Phone Number <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full h-10 px-3 border rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 ${
                  errors.phone ? "border-[#C62828]" : "border-[#E0E0E0]"
                }`}
                placeholder="e.g., 9801234567"
              />
              {errors.phone && <p className="text-xs text-[#C62828] mt-1">{errors.phone}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block flex items-center gap-2">
                <Building size={14} />
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                placeholder="e.g., Tech Solutions Pvt Ltd"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block flex items-center gap-2">
                <MapPin size={14} />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                placeholder="e.g., Kathmandu, Nepal"
              />
            </div>

            {/* Deal Value */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block flex items-center gap-2">
                <DollarSign size={14} />
                Deal Value (NPR)
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                placeholder="e.g., 50000"
              />
            </div>

            {/* Source */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block flex items-center gap-2">
                <Tag size={14} />
                Lead Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Pipeline */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Pipeline
              </label>
              <select
                value={formData.pipeline}
                onChange={(e) => {
                  const newPipeline = e.target.value;
                  setFormData({ 
                    ...formData, 
                    pipeline: newPipeline,
                    stage: stagesByPipeline[newPipeline][0],
                  });
                }}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                {pipelines.map(pipeline => (
                  <option key={pipeline} value={pipeline}>{pipeline}</option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                {stagesByPipeline[formData.pipeline].map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Owner */}
            <div>
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Assign To
              </label>
              <select
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                {owners.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
              placeholder="Add any additional notes or context about this lead..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
          <p className="text-xs text-[#616161]">
            <span className="text-[#C62828]">*</span> Required fields
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]"
            >
              Create Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
