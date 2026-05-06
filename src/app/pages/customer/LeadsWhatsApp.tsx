import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Search, Filter, Plus, Download, TrendingUp, Users, CheckCircle, XCircle,
  Mail, Phone, Building, Calendar, DollarSign, Tag, ChevronDown, MoreVertical,
  Edit2, Trash2, Eye, Sparkles
} from "lucide-react";
import { useLeads, Lead } from "../../hooks/useLeads";
import { LeadProfileSidebar } from "../../components/whatsapp/LeadProfileSidebar";
import { AIQualificationModal } from "../../components/whatsapp/AIQualificationModal";

export function LeadsWhatsApp() {
  const {
    leads,
    aiQualificationQuestions,
    updateLeadStage,
    updateLeadScore,
    addLeadTag,
    removeLeadTag,
    updateLeadField,
    qualifyLeadWithAI,
    updateLeadDeal,
    assignLead
  } = useLeads();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState<Lead["stage"] | "all">("all");
  const [filterSource, setFilterSource] = useState<Lead["source"] | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadProfile, setShowLeadProfile] = useState(false);
  const [showAIQualification, setShowAIQualification] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = filterStage === "all" || lead.stage === filterStage;
    const matchesSource = filterSource === "all" || lead.source === filterSource;

    return matchesSearch && matchesStage && matchesSource;
  });

  const stats = {
    total: leads.length,
    qualified: leads.filter(l => l.qualification.status === "qualified").length,
    newToday: leads.filter(l => {
      const today = new Date().toDateString();
      const leadDate = new Date(l.firstTouchTimestamp).toDateString();
      return today === leadDate;
    }).length,
    conversionRate: leads.filter(l => l.stage === "won").length / Math.max(leads.length, 1) * 100
  };

  const getStageColor = (stage: Lead["stage"]) => {
    const colors = {
      new: "bg-gray-100 text-gray-700 border-gray-200",
      contacted: "bg-blue-100 text-blue-700 border-blue-200",
      qualified: "bg-green-100 text-green-700 border-green-200",
      proposal: "bg-purple-100 text-purple-700 border-purple-200",
      negotiation: "bg-orange-100 text-orange-700 border-orange-200",
      won: "bg-emerald-100 text-emerald-700 border-emerald-200",
      lost: "bg-red-100 text-red-700 border-red-200"
    };
    return colors[stage] || colors.new;
  };

  const getSourceColor = (source: Lead["source"]) => {
    const colors = {
      WhatsApp: "bg-green-100 text-green-700",
      Web: "bg-blue-100 text-blue-700",
      Phone: "bg-purple-100 text-purple-700",
      Referral: "bg-orange-100 text-orange-700",
      Manual: "bg-gray-100 text-gray-700"
    };
    return colors[source] || colors.Manual;
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadProfile(true);
  };

  const handleStartAIQualification = () => {
    setShowAIQualification(true);
  };

  const handleAIQualificationSubmit = (answers: Record<string, string>) => {
    if (selectedLead) {
      qualifyLeadWithAI(selectedLead.id, answers);
    }
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "CRM" },
          { label: "Leads" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Leads Management</h1>
              <p className="text-sm text-[#64748B]">
                Track and manage your leads from WhatsApp and other channels
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
              <button className="h-10 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2">
                <Plus size={16} />
                Add Lead
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">{stats.total}</div>
              <div className="text-sm text-[#64748B]">Total Leads</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">{stats.qualified}</div>
              <div className="text-sm text-[#64748B]">Qualified</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">{stats.newToday}</div>
              <div className="text-sm text-[#64748B]">New Today</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <DollarSign size={20} className="text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">{stats.conversionRate.toFixed(1)}%</div>
              <div className="text-sm text-[#64748B]">Conversion Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                />
              </div>

              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value as any)}
                className="h-10 px-3 pr-8 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent appearance-none"
              >
                <option value="all">All Stages</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as any)}
                className="h-10 px-3 pr-8 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent appearance-none"
              >
                <option value="all">All Sources</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Web">Web</option>
                <option value="Phone">Phone</option>
                <option value="Referral">Referral</option>
                <option value="Manual">Manual</option>
              </select>

              <button className="h-10 px-4 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Filter size={16} />
                More Filters
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Deal Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-400 mb-2">
                          <Users size={48} className="mx-auto mb-3 opacity-50" />
                          <p className="text-sm font-medium text-gray-600">No leads found</p>
                          <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search query</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-semibold text-sm">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-[#0F1B2D] text-sm">{lead.name}</div>
                              {lead.company && (
                                <div className="text-xs text-[#64748B] flex items-center gap-1">
                                  <Building size={12} />
                                  {lead.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-[#0F1B2D] flex items-center gap-1.5">
                              <Phone size={12} className="text-gray-400" />
                              {lead.phone}
                            </div>
                            {lead.email && (
                              <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                                <Mail size={12} className="text-gray-400" />
                                {lead.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(lead.stage)}`}>
                            {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  lead.score >= 70 ? "bg-green-500" :
                                  lead.score >= 40 ? "bg-yellow-500" :
                                  "bg-red-500"
                                }`}
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-[#0F1B2D] w-8">{lead.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {lead.dealValue ? (
                            <div className="text-sm font-medium text-[#0F1B2D]">
                              ${lead.dealValue.toLocaleString()}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-[#64748B] flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(lead.firstTouchTimestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewLead(lead)}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              title="View lead"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            {lead.qualification.status !== "qualified" && (
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setShowAIQualification(true);
                                }}
                                className="p-1.5 hover:bg-green-100 rounded transition-colors"
                                title="AI Qualification"
                              >
                                <Sparkles size={16} className="text-green-600" />
                              </button>
                            )}
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Profile Sidebar */}
      {showLeadProfile && selectedLead && (
        <div className="fixed inset-0 bg-black/20 z-50 flex justify-end">
          <LeadProfileSidebar
            lead={selectedLead}
            onClose={() => {
              setShowLeadProfile(false);
              setSelectedLead(null);
            }}
            onUpdateStage={(stage) => {
              updateLeadStage(selectedLead.id, stage);
              const updatedLead = leads.find(l => l.id === selectedLead.id);
              if (updatedLead) setSelectedLead(updatedLead);
            }}
            onAddTag={(tag) => {
              addLeadTag(selectedLead.id, tag);
              const updatedLead = leads.find(l => l.id === selectedLead.id);
              if (updatedLead) setSelectedLead(updatedLead);
            }}
            onRemoveTag={(tag) => {
              removeLeadTag(selectedLead.id, tag);
              const updatedLead = leads.find(l => l.id === selectedLead.id);
              if (updatedLead) setSelectedLead(updatedLead);
            }}
            onUpdateField={(field, value) => {
              updateLeadField(selectedLead.id, field, value);
              const updatedLead = leads.find(l => l.id === selectedLead.id);
              if (updatedLead) setSelectedLead(updatedLead);
            }}
            onUpdateDeal={(value, pipeline) => {
              updateLeadDeal(selectedLead.id, value, pipeline);
              const updatedLead = leads.find(l => l.id === selectedLead.id);
              if (updatedLead) setSelectedLead(updatedLead);
            }}
            onStartAIQualification={handleStartAIQualification}
          />
        </div>
      )}

      {/* AI Qualification Modal */}
      {showAIQualification && selectedLead && (
        <AIQualificationModal
          questions={aiQualificationQuestions}
          onSubmit={(answers) => {
            handleAIQualificationSubmit(answers);
            setShowAIQualification(false);
            const updatedLead = leads.find(l => l.id === selectedLead.id);
            if (updatedLead) setSelectedLead(updatedLead);
          }}
          onClose={() => setShowAIQualification(false)}
        />
      )}
    </>
  );
}
