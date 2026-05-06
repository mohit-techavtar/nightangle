import React, { useState } from "react";
import { Download, Send, CheckSquare, Square, Mail, Phone, MapPin, Building2, User, Globe, ExternalLink } from "lucide-react";

interface Lead {
  id: string;
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  title?: string;
  industry?: string;
  location?: string;
  website?: string;
  verified: boolean;
}

interface LeadPreviewTableProps {
  leads: Lead[];
  onExport: (format: "excel" | "csv", selectedLeads: string[]) => void;
  onSendToCRM: (selectedLeads: string[]) => void;
}

export function LeadPreviewTable({ leads, onExport, onSendToCRM }: LeadPreviewTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads([]);
      setSelectAll(false);
    } else {
      setSelectedLeads(leads.map(l => l.id));
      setSelectAll(true);
    }
  };

  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedLeads, leadId];
      setSelectedLeads(newSelected);
      if (newSelected.length === leads.length) {
        setSelectAll(true);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E0E0E0] bg-[#F5F5F5]">
        <div className="flex items-center justify-between mb-3 max-md:flex-col max-md:gap-3 max-md:items-start">
          <div>
            <h3 className="text-lg font-semibold text-[#212121]">Lead Preview</h3>
            <p className="text-sm text-[#616161]">
              {leads.length} leads generated • {selectedLeads.length} selected
            </p>
          </div>
          <div className="flex items-center gap-2 max-md:w-full">
            <button
              onClick={() => onExport("csv", selectedLeads)}
              disabled={selectedLeads.length === 0}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed max-md:flex-1"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={() => onExport("excel", selectedLeads)}
              disabled={selectedLeads.length === 0}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed max-md:flex-1"
            >
              <Download size={16} />
              Excel
            </button>
            <button
              onClick={() => onSendToCRM(selectedLeads)}
              disabled={selectedLeads.length === 0}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed max-md:flex-1"
            >
              <Send size={16} />
              Send to CRM
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-[#E0E0E0]">
            <div className="text-xs text-[#616161] mb-1">Total Leads</div>
            <div className="text-lg font-bold text-[#212121]">{leads.length}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#E0E0E0]">
            <div className="text-xs text-[#616161] mb-1">Verified</div>
            <div className="text-lg font-bold text-[#4CAF50]">{leads.filter(l => l.verified).length}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#E0E0E0]">
            <div className="text-xs text-[#616161] mb-1">With Email</div>
            <div className="text-lg font-bold text-[#1565C0]">{leads.filter(l => l.email).length}</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#E0E0E0]">
            <div className="text-xs text-[#616161] mb-1">With Phone</div>
            <div className="text-lg font-bold text-[#1565C0]">{leads.filter(l => l.phone).length}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <th className="text-left py-3 px-4 w-12">
                <button onClick={handleSelectAll} className="text-[#616161] hover:text-[#1565C0]">
                  {selectAll ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Company</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Contact</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Email</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Phone</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Location</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleSelectLead(lead.id)}
                    className="text-[#616161] hover:text-[#1565C0]"
                  >
                    {selectedLeads.includes(lead.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-start gap-2">
                    <Building2 size={16} className="text-[#1565C0] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#212121]">{lead.companyName}</div>
                      {lead.industry && (
                        <div className="text-xs text-[#616161]">{lead.industry}</div>
                      )}
                      {lead.website && (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#1565C0] hover:underline flex items-center gap-1 mt-1"
                        >
                          <Globe size={10} />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {lead.contactName && (
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#9E9E9E]" />
                      <div>
                        <div className="text-sm text-[#212121]">{lead.contactName}</div>
                        {lead.title && (
                          <div className="text-xs text-[#616161]">{lead.title}</div>
                        )}
                      </div>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  {lead.email ? (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#1565C0]" />
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-sm text-[#1565C0] hover:underline"
                      >
                        {lead.email}
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs text-[#9E9E9E]">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {lead.phone ? (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#1565C0]" />
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-sm text-[#212121]"
                      >
                        {lead.phone}
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs text-[#9E9E9E]">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {lead.location ? (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#9E9E9E]" />
                      <span className="text-sm text-[#616161]">{lead.location}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#9E9E9E]">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    lead.verified
                      ? "bg-[#E8F5E9] text-[#2E7D32]"
                      : "bg-[#FFF8E1] text-[#F57F17]"
                  }`}>
                    {lead.verified ? "Verified" : "Unverified"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="py-12 text-center text-[#9E9E9E]">
          <Building2 size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No leads generated yet</p>
        </div>
      )}
    </div>
  );
}
