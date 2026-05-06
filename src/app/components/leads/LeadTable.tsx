import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Phone, Mail, MapPin, MoreVertical, Edit, Trash2, UserPlus, CheckSquare, Square, Star, Clock } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  pipeline: string;
  stage: string;
  owner: {
    name: string;
    avatar?: string;
    initials: string;
  };
  score: number;
  lastActivity: Date;
  value?: number;
  location?: string;
}

interface LeadTableProps {
  leads: Lead[];
  selectedLeads: string[];
  onSelectLead: (leadId: string) => void;
  onSelectAll: () => void;
  onEdit: (leadId: string) => void;
  onDelete: (leadId: string) => void;
  onAssign: (leadId: string) => void;
}

export function LeadTable({ leads, selectedLeads, onSelectLead, onSelectAll, onEdit, onDelete, onAssign }: LeadTableProps) {
  const navigate = useNavigate();
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("lastActivity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const allSelected = leads.length > 0 && selectedLeads.length === leads.length;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      "Website": "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]",
      "Referral": "bg-[#F3E5F5] text-[#6A1B9A] border-[#BA68C8]",
      "Cold Call": "bg-[#E8F5E9] text-[#2E7D32] border-[#66BB6A]",
      "Social Media": "bg-[#FFF8E1] text-[#F57F17] border-[#FFB300]",
      "Email Campaign": "bg-[#FCE4EC] text-[#C2185B] border-[#F06292]",
      "Trade Show": "bg-[#E0F2F1] text-[#00695C] border-[#26A69A]",
      "Partner": "bg-[#F3E5F5] text-[#7B1FA2] border-[#AB47BC]",
    };
    return colors[source] || "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]";
  };

  const getPipelineColor = (pipeline: string) => {
    const colors: Record<string, string> = {
      "Sales": "bg-[#1565C0] text-white",
      "Support": "bg-[#6A1B9A] text-white",
      "Collections": "bg-[#F57F17] text-white",
    };
    return colors[pipeline] || "bg-[#616161] text-white";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#4CAF50] bg-[#E8F5E9]";
    if (score >= 50) return "text-[#F57F17] bg-[#FFF8E1]";
    return "text-[#9E9E9E] bg-[#F5F5F5]";
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <th className="text-left py-3 px-4 w-12">
                <button onClick={onSelectAll} className="text-[#616161] hover:text-[#1565C0]">
                  {allSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              <th 
                className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase cursor-pointer hover:text-[#1565C0]"
                onClick={() => handleSort("name")}
              >
                Lead Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">
                Contact
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">
                Source
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">
                Stage
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">
                Owner
              </th>
              <th 
                className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase cursor-pointer hover:text-[#1565C0]"
                onClick={() => handleSort("score")}
              >
                Score
              </th>
              <th 
                className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase cursor-pointer hover:text-[#1565C0]"
                onClick={() => handleSort("lastActivity")}
              >
                Last Activity
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                <td className="py-3 px-4">
                  <button
                    onClick={() => onSelectLead(lead.id)}
                    className="text-[#616161] hover:text-[#1565C0]"
                  >
                    {selectedLeads.includes(lead.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <button
                      onClick={() => navigate("/tenant/lead-detail")}
                      className="text-sm font-semibold text-[#1565C0] hover:text-[#0D47A1] hover:underline mb-0.5 text-left"
                    >
                      {lead.name}
                    </button>
                    {lead.company && (
                      <div className="text-xs text-[#616161]">{lead.company}</div>
                    )}
                    {lead.value && (
                      <div className="text-xs font-semibold text-[#1565C0] mt-0.5">
                        NPR {lead.value.toLocaleString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#616161]">
                      <Phone size={12} />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#616161]">
                      <Mail size={12} />
                      <span className="truncate max-w-[150px]">{lead.email}</span>
                    </div>
                    {lead.location && (
                      <div className="flex items-center gap-1.5 text-xs text-[#616161]">
                        <MapPin size={12} />
                        <span>{lead.location}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getSourceColor(lead.source)}`}>
                    {lead.source}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPipelineColor(lead.pipeline)}`}>
                      {lead.stage}
                    </span>
                    <div className="text-xs text-[#9E9E9E] mt-1">{lead.pipeline}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {lead.owner.avatar ? (
                      <img src={lead.owner.avatar} alt={lead.owner.name} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-xs font-semibold">
                        {lead.owner.initials}
                      </div>
                    )}
                    <span className="text-sm text-[#212121]">{lead.owner.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          stroke="#E0E0E0"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          stroke={lead.score >= 80 ? "#4CAF50" : lead.score >= 50 ? "#F57F17" : "#9E9E9E"}
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${(lead.score / 100) * 113} 113`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${lead.score >= 80 ? "text-[#4CAF50]" : lead.score >= 50 ? "text-[#F57F17]" : "text-[#9E9E9E]"}`}>
                          {lead.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-sm text-[#616161]">
                    <Clock size={14} />
                    <span>{getRelativeTime(lead.lastActivity)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(lead.id)}
                      className="w-7 h-7 rounded flex items-center justify-center text-[#1565C0] hover:bg-[#E3F2FD]"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuId(actionMenuId === lead.id ? null : lead.id)}
                        className="w-7 h-7 rounded flex items-center justify-center text-[#616161] hover:bg-[#F5F5F5]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {actionMenuId === lead.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActionMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-xl border border-[#E0E0E0] py-1 w-40">
                            <button
                              onClick={() => {
                                onAssign(lead.id);
                                setActionMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#212121] hover:bg-[#F5F5F5] flex items-center gap-2"
                            >
                              <UserPlus size={14} />
                              Assign
                            </button>
                            <button
                              onClick={() => {
                                onDelete(lead.id);
                                setActionMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#C62828] hover:bg-[#FFEBEE] flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="py-12 text-center text-[#9E9E9E]">
          <UserPlus size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No leads found</p>
        </div>
      )}
    </div>
  );
}