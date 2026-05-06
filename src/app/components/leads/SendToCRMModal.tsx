import React, { useState } from "react";
import { X, Send, Tag, User, Calendar, CheckCircle } from "lucide-react";

interface SendToCRMModalProps {
  leadCount: number;
  onSend: (campaignTag: string, assignTo: string, priority: string) => void;
  onCancel: () => void;
}

const campaignTags = [
  "Q1 2026 Outreach",
  "Product Launch - Electric Kettle",
  "Seasonal Campaign - Dashain",
  "Partner Acquisition",
  "Market Expansion - Western Nepal",
  "Cold Outreach - Tech Sector",
];

const teamMembers = [
  { id: "rajesh", name: "Rajesh Sharma", role: "Sales Manager" },
  { id: "anita", name: "Anita Gurung", role: "Business Development" },
  { id: "bikash", name: "Bikash Thapa", role: "Account Executive" },
  { id: "unassigned", name: "Unassigned", role: "Will be assigned later" },
];

export function SendToCRMModal({ leadCount, onSend, onCancel }: SendToCRMModalProps) {
  const [campaignTag, setCampaignTag] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [assignTo, setAssignTo] = useState("unassigned");
  const [priority, setPriority] = useState("medium");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTag = campaignTag === "custom" ? customTag : campaignTag;
    onSend(finalTag, assignTo, priority);
    setShowSuccess(true);
    setTimeout(() => {
      onCancel();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="text-[#4CAF50]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#212121] mb-2">Leads Sent Successfully!</h3>
          <p className="text-sm text-[#616161]">
            {leadCount} leads have been added to your CRM and tagged with "{campaignTag === "custom" ? customTag : campaignTag}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div>
            <h3 className="text-lg font-semibold text-white">Send to CRM</h3>
            <p className="text-sm text-white/80">Configure lead import settings</p>
          </div>
          <button onClick={onCancel} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Lead Count Summary */}
          <div className="mb-6 p-4 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
            <div className="flex items-center gap-2 text-sm text-[#1565C0]">
              <CheckCircle size={16} />
              <span>Ready to import <strong>{leadCount} leads</strong> to your CRM</span>
            </div>
          </div>

          {/* Campaign Tag */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 flex items-center gap-2">
              <Tag size={16} className="text-[#1565C0]" />
              Campaign Tag <span className="text-[#C62828]">*</span>
            </label>
            <select
              value={campaignTag}
              onChange={(e) => setCampaignTag(e.target.value)}
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 mb-2"
              required
            >
              <option value="">Select campaign tag...</option>
              {campaignTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
              <option value="custom">+ Create Custom Tag</option>
            </select>
            
            {campaignTag === "custom" && (
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Enter custom campaign tag"
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                required
              />
            )}
            <p className="text-xs text-[#616161] mt-1">
              Tag helps you organize and track leads from different campaigns
            </p>
          </div>

          {/* Assign To */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 flex items-center gap-2">
              <User size={16} className="text-[#1565C0]" />
              Assign To Team Member
            </label>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    assignTo === member.id
                      ? 'border-[#1565C0] bg-[#E3F2FD]'
                      : 'border-[#E0E0E0] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="assignTo"
                    value={member.id}
                    checked={assignTo === member.id}
                    onChange={(e) => setAssignTo(e.target.value)}
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

          {/* Priority */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-[#1565C0]" />
              Lead Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "high", label: "High", color: "bg-[#FFEBEE] text-[#C62828] border-[#EF5350]" },
                { value: "medium", label: "Medium", color: "bg-[#FFF8E1] text-[#F57F17] border-[#FFB300]" },
                { value: "low", label: "Low", color: "bg-[#E8F5E9] text-[#2E7D32] border-[#66BB6A]" },
              ].map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`h-10 rounded-md border-2 text-sm font-semibold transition-all ${
                    priority === p.value
                      ? p.color
                      : 'border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source Attribution */}
          <div className="p-4 rounded-lg bg-[#F5F5F5] border border-[#E0E0E0]">
            <h4 className="text-sm font-semibold text-[#212121] mb-2">Source Attribution</h4>
            <div className="space-y-1 text-xs text-[#616161]">
              <div className="flex justify-between">
                <span>Source:</span>
                <span className="font-medium text-[#212121]">AI Lead Generation</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-medium text-[#212121]">Data Scraping</span>
              </div>
              <div className="flex justify-between">
                <span>Generated:</span>
                <span className="font-medium text-[#212121]">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Lead Count:</span>
                <span className="font-medium text-[#212121]">{leadCount} leads</span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
          <div className="text-sm text-[#616161]">
            Leads will be available in <strong>Lead Management</strong> module
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
              <Send size={16} />
              Send to CRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
