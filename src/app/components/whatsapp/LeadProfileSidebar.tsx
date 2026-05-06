import React, { useState } from "react";
import { X, User, Building, Mail, Phone, Tag, TrendingUp, Calendar, DollarSign, Edit2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Lead } from "../../hooks/useLeads";

interface LeadProfileSidebarProps {
  lead: Lead;
  onClose: () => void;
  onUpdateStage: (stage: Lead["stage"]) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onUpdateField: (field: string, value: string) => void;
  onUpdateDeal: (value?: number, pipeline?: string) => void;
  onStartAIQualification: () => void;
}

export function LeadProfileSidebar({
  lead,
  onClose,
  onUpdateStage,
  onAddTag,
  onRemoveTag,
  onUpdateField,
  onUpdateDeal,
  onStartAIQualification
}: LeadProfileSidebarProps) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleSaveField = (field: string) => {
    if (fieldValue.trim()) {
      onUpdateField(field, fieldValue);
      setEditingField(null);
      setFieldValue("");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag);
      setNewTag("");
    }
  };

  const getStageColor = (stage: Lead["stage"]) => {
    const colors = {
      new: "bg-gray-100 text-gray-700",
      contacted: "bg-blue-100 text-blue-700",
      qualified: "bg-green-100 text-green-700",
      proposal: "bg-purple-100 text-purple-700",
      negotiation: "bg-orange-100 text-orange-700",
      won: "bg-emerald-100 text-emerald-700",
      lost: "bg-red-100 text-red-700"
    };
    return colors[stage] || colors.new;
  };

  const getQualificationColor = (status: Lead["qualification"]["status"]) => {
    const colors = {
      unqualified: "bg-gray-100 text-gray-700",
      qualifying: "bg-yellow-100 text-yellow-700",
      qualified: "bg-green-100 text-green-700",
      disqualified: "bg-red-100 text-red-700"
    };
    return colors[status] || colors.unqualified;
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <h3 className="font-semibold text-[#0F1B2D]">Lead Profile</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white font-semibold">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-[#0F1B2D]">{lead.name}</h4>
              <p className="text-xs text-[#64748B]">Score: {lead.score}/100</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-gray-400" />
              <span className="text-[#0F1B2D]">{lead.phone}</span>
            </div>
            {editingField === "email" ? (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  onBlur={() => handleSaveField("email")}
                  onKeyPress={(e) => e.key === "Enter" && handleSaveField("email")}
                  autoFocus
                  className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm group cursor-pointer" onClick={() => {
                setEditingField("email");
                setFieldValue(lead.email || "");
              }}>
                <Mail size={16} className="text-gray-400" />
                <span className="text-[#0F1B2D]">{lead.email || "Add email"}</span>
                <Edit2 size={12} className="text-gray-400 opacity-0 group-hover:opacity-100" />
              </div>
            )}
            {editingField === "company" ? (
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  onBlur={() => handleSaveField("company")}
                  onKeyPress={(e) => e.key === "Enter" && handleSaveField("company")}
                  autoFocus
                  className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm group cursor-pointer" onClick={() => {
                setEditingField("company");
                setFieldValue(lead.company || "");
              }}>
                <Building size={16} className="text-gray-400" />
                <span className="text-[#0F1B2D]">{lead.company || "Add company"}</span>
                <Edit2 size={12} className="text-gray-400 opacity-0 group-hover:opacity-100" />
              </div>
            )}
          </div>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-xs font-medium text-[#64748B] mb-2">Stage</label>
          <select
            value={lead.stage}
            onChange={(e) => onUpdateStage(e.target.value as Lead["stage"])}
            className={`w-full h-9 px-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#25D366] ${getStageColor(lead.stage)}`}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Qualification Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-[#64748B]">Qualification</label>
            {lead.qualification.status !== "qualified" && (
              <button
                onClick={onStartAIQualification}
                className="text-xs text-[#25D366] hover:text-[#128C7E] font-medium"
              >
                Run AI Qualification
              </button>
            )}
          </div>
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getQualificationColor(lead.qualification.status)}`}>
            {lead.qualification.status.charAt(0).toUpperCase() + lead.qualification.status.slice(1)}
            {lead.qualification.aiScore !== undefined && (
              <span className="ml-2 text-xs">AI Score: {lead.qualification.aiScore}</span>
            )}
          </div>
          {lead.qualification.status === "qualified" && (
            <div className="mt-3 space-y-2 text-xs">
              {lead.qualification.budget && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Budget:</span>
                  <span className="text-[#0F1B2D] font-medium">{lead.qualification.budget}</span>
                </div>
              )}
              {lead.qualification.timeline && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Timeline:</span>
                  <span className="text-[#0F1B2D] font-medium">{lead.qualification.timeline}</span>
                </div>
              )}
              {lead.qualification.authority && (
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Authority:</span>
                  <span className="text-[#0F1B2D] font-medium">{lead.qualification.authority}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deal Information */}
        <div>
          <label className="block text-xs font-medium text-[#64748B] mb-2">Deal Information</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-400" />
              <input
                type="number"
                value={lead.dealValue || ""}
                onChange={(e) => onUpdateDeal(Number(e.target.value), lead.dealPipeline)}
                placeholder="Deal value"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
            </div>
            <input
              type="text"
              value={lead.dealPipeline || ""}
              onChange={(e) => onUpdateDeal(lead.dealValue, e.target.value)}
              placeholder="Pipeline name"
              className="w-full h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-[#64748B] mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {lead.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="hover:text-blue-900"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="Add tag"
              className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
            <button
              onClick={handleAddTag}
              className="h-8 px-3 rounded bg-[#25D366] text-white text-sm hover:bg-[#128C7E]"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
            <Calendar size={14} />
            <span>First contact: {new Date(lead.firstTouchTimestamp).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
            <TrendingUp size={14} />
            <span>Source: {lead.source}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <User size={14} />
            <span>Assigned to: {lead.assignedTo || "Unassigned"}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center justify-between w-full text-sm font-medium text-[#0F1B2D] mb-3"
          >
            <span>Activity Timeline ({lead.timeline.length})</span>
            {showTimeline ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showTimeline && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {lead.timeline.map((entry) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] mt-2 shrink-0" />
                  <div className="flex-1 text-xs">
                    <p className="text-[#0F1B2D]">{entry.content}</p>
                    <p className="text-[#64748B] mt-1">
                      {new Date(entry.timestamp).toLocaleString()} • {entry.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
