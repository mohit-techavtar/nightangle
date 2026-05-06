import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { LeadTable } from "../../components/leads/LeadTable";
import { LeadFilterPanel } from "../../components/leads/LeadFilterPanel";
import { CreateViewModal } from "../../components/leads/CreateViewModal";
import { DynamicLeadFormModal } from "../../components/leads/DynamicLeadFormModal";
import { AdvancedFilterPanel } from "../../components/leads/AdvancedFilterPanel";
import { Search, Filter, Plus, Download, UserPlus, Trash2, Mail, Phone, Save, Users, TrendingUp, Target, X, Check } from "lucide-react";

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

interface FilterOptions {
  sources: string[];
  stages: string[];
  owners: string[];
  scoreRange: [number, number];
  valueRange: [number, number];
  dateRange: { start: Date | null; end: Date | null };
}

interface AdvancedFilterState {
  pipeline: string;
  stages: string[];
  scoreRange: [number, number];
  dateRange: { start: string; end: string };
  assignedUsers: string[];
  tags: string[];
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: "lead-001",
    name: "Rajesh Kumar Sharma",
    email: "rajesh@techsolutions.com",
    phone: "9801234567",
    company: "Tech Solutions Pvt Ltd",
    source: "Website",
    pipeline: "Sales",
    stage: "Qualified",
    owner: { name: "Akash Sharma", initials: "AS" },
    score: 85,
    lastActivity: new Date("2026-03-26T14:30:00"),
    value: 250000,
    location: "Kathmandu",
  },
  {
    id: "lead-002",
    name: "Sita Devi Thapa",
    email: "sita@himalayantrade.com",
    phone: "9851234567",
    company: "Himalayan Trade Co.",
    source: "Referral",
    pipeline: "Sales",
    stage: "Proposal",
    owner: { name: "Priya Thapa", initials: "PT" },
    score: 92,
    lastActivity: new Date("2026-03-26T11:15:00"),
    value: 450000,
    location: "Pokhara",
  },
  {
    id: "lead-003",
    name: "Mohan Bahadur KC",
    email: "mohan@retailpoint.com",
    phone: "9841234567",
    company: "Retail Point Nepal",
    source: "Cold Call",
    pipeline: "Sales",
    stage: "Negotiation",
    owner: { name: "Rohit Gurung", initials: "RG" },
    score: 78,
    lastActivity: new Date("2026-03-26T09:45:00"),
    value: 180000,
    location: "Lalitpur",
  },
  {
    id: "lead-004",
    name: "Anita Gurung",
    email: "anita@digitalnepal.com",
    phone: "9861234567",
    company: "Digital Nepal",
    source: "Social Media",
    pipeline: "Sales",
    stage: "New",
    owner: { name: "Akash Sharma", initials: "AS" },
    score: 65,
    lastActivity: new Date("2026-03-25T16:20:00"),
    value: 120000,
    location: "Kathmandu",
  },
  {
    id: "lead-005",
    name: "Bikram Adhikari",
    email: "bikram@mountainview.com",
    phone: "9871234567",
    company: "Mountain View Enterprises",
    source: "Email Campaign",
    pipeline: "Sales",
    stage: "Contacted",
    owner: { name: "Priya Thapa", initials: "PT" },
    score: 72,
    lastActivity: new Date("2026-03-25T10:30:00"),
    value: 320000,
    location: "Chitwan",
  },
  {
    id: "lead-006",
    name: "Deepak Maharjan",
    email: "deepak@newera.com",
    phone: "9881234567",
    source: "Trade Show",
    pipeline: "Support",
    stage: "In Progress",
    owner: { name: "Sita Rai", initials: "SR" },
    score: 45,
    lastActivity: new Date("2026-03-24T14:00:00"),
    location: "Bhaktapur",
  },
  {
    id: "lead-007",
    name: "Priya Shrestha",
    email: "priya@innovatehub.com",
    phone: "9891234567",
    company: "Innovate Hub",
    source: "Partner",
    pipeline: "Sales",
    stage: "Qualified",
    owner: { name: "Rohit Gurung", initials: "RG" },
    score: 88,
    lastActivity: new Date("2026-03-24T11:30:00"),
    value: 580000,
    location: "Kathmandu",
  },
  {
    id: "lead-008",
    name: "Ramesh Tamang",
    email: "ramesh@groceryking.com",
    phone: "9811234567",
    company: "Grocery King",
    source: "Referral",
    pipeline: "Collections",
    stage: "First Notice",
    owner: { name: "Ramesh KC", initials: "RK" },
    score: 35,
    lastActivity: new Date("2026-03-23T15:45:00"),
    value: 95000,
    location: "Kathmandu",
  },
];

export function LeadManagement() {
  const [searchParams] = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedPipeline, setSelectedPipeline] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateViewModal, setShowCreateViewModal] = useState(false);
  const [showDynamicLeadFormModal, setShowDynamicLeadFormModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sources: [],
    stages: [],
    owners: [],
    scoreRange: [0, 100],
    valueRange: [0, 1000000],
    dateRange: { start: null, end: null },
  });

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    pipeline: "all",
    stages: [],
    scoreRange: [0, 100],
    dateRange: { start: "", end: "" },
    assignedUsers: [],
    tags: [],
  });

  // Apply saved view filters from URL
  useEffect(() => {
    const viewId = searchParams.get("view");
    if (viewId) {
      switch (viewId) {
        case "my-hot-leads":
          setFilters({
            sources: [],
            stages: [],
            owners: ["Akash Sharma", "Priya Thapa", "Rohit Gurung"], // Current user
            scoreRange: [80, 100],
            valueRange: [0, 1000000],
            dateRange: { start: null, end: null },
          });
          break;
        case "stale-leads":
          setFilters({
            sources: [],
            stages: [],
            owners: ["Akash Sharma", "Priya Thapa", "Rohit Gurung"], // Current user
            scoreRange: [0, 100],
            valueRange: [0, 1000000],
            dateRange: {
              start: new Date("2026-01-01"),
              end: new Date("2026-03-01"),
            },
          });
          break;
        case "all-open-leads":
          setFilters({
            sources: [],
            stages: ["New", "Contacted", "Qualified", "Proposal", "Negotiation"],
            owners: [],
            scoreRange: [0, 100],
            valueRange: [0, 1000000],
            dateRange: { start: null, end: null },
          });
          break;
        case "unassigned":
          setFilters({
            sources: [],
            stages: [],
            owners: [], // Will need to filter for empty owners
            scoreRange: [0, 100],
            valueRange: [0, 1000000],
            dateRange: { start: null, end: null },
          });
          break;
        default:
          break;
      }
    }
  }, [searchParams]);

  const pipelines = [
    { id: "all", name: "All Leads", color: "bg-[#616161]" },
    { id: "Sales", name: "Sales", color: "bg-[#1565C0]" },
    { id: "Support", name: "Support", color: "bg-[#6A1B9A]" },
    { id: "Collections", name: "Collections", color: "bg-[#F57F17]" },
  ];

  const filteredLeads = leads.filter(lead => {
    // Pipeline filter
    if (selectedPipeline !== "all" && lead.pipeline !== selectedPipeline) return false;
    
    // Search filter
    if (searchTerm && !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.phone.includes(searchTerm) &&
        !lead.company?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Advanced filters
    if (filters.sources.length > 0 && !filters.sources.includes(lead.source)) return false;
    if (filters.stages.length > 0 && !filters.stages.includes(lead.stage)) return false;
    if (filters.owners.length > 0 && !filters.owners.includes(lead.owner.name)) return false;
    if (lead.score < filters.scoreRange[0] || lead.score > filters.scoreRange[1]) return false;
    if (lead.value && (lead.value < filters.valueRange[0] || lead.value > filters.valueRange[1])) return false;
    
    return true;
  });

  const stats = {
    total: filteredLeads.length,
    qualified: filteredLeads.filter(l => l.stage === "Qualified").length,
    avgScore: Math.round(filteredLeads.reduce((sum, l) => sum + l.score, 0) / filteredLeads.length) || 0,
    totalValue: filteredLeads.reduce((sum, l) => sum + (l.value || 0), 0),
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleEdit = (leadId: string) => {
    console.log("Editing lead:", leadId);
  };

  const handleDelete = (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      setLeads(leads.filter(l => l.id !== leadId));
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleAssign = (leadId: string) => {
    console.log("Assigning lead:", leadId);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedLeads.length} selected leads?`)) {
      setLeads(leads.filter(l => !selectedLeads.includes(l.id)));
      setSelectedLeads([]);
    }
  };

  const handleBulkAssign = () => {
    console.log("Bulk assign:", selectedLeads);
  };

  const handleExport = () => {
    console.log("Exporting leads");
    alert("Leads exported successfully!");
  };

  const handleCreateView = (viewData: any) => {
    setShowCreateViewModal(false);
    alert(`View "${viewData.name}" created successfully!`);
  };

  const handleCreateLead = (leadData: any) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name || "",
      email: leadData.email || "",
      phone: leadData.phone || "",
      company: leadData.company,
      source: leadData.source || "Direct",
      pipeline: "Sales",
      stage: leadData.stage || "New",
      owner: { name: "Akash Sharma", initials: "AS" },
      score: 50,
      lastActivity: new Date(),
      value: leadData.value ? Number(leadData.value) : undefined,
      location: leadData.location,
    };
    setLeads([newLead, ...leads]);
    setShowDynamicLeadFormModal(false);
    alert("Lead created successfully!");
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "CRM" }, { label: "Lead Management" }]} 
        companyName="Everest Digital Solutions" 
        mode="customer" 
        userName="Rajesh Sharma" 
        userEmail="rajesh@everestdigital.com" 
        userInitials="RS" 
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 max-md:p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 max-md:mb-4 max-md:flex-col max-md:gap-3">
              <div>
                <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Lead Management</h1>
                <p className="text-sm text-[#616161]">Manage and track all your leads across pipelines</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-6 max-md:mb-4">
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                    <Users className="text-[#1565C0]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Total Leads</div>
                    <div className="text-2xl font-bold text-[#212121]">{stats.total}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
                    <Target className="text-[#4CAF50]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Qualified</div>
                    <div className="text-2xl font-bold text-[#4CAF50]">{stats.qualified}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF8E1] flex items-center justify-center">
                    <TrendingUp className="text-[#F57F17]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Avg Score</div>
                    <div className="text-2xl font-bold text-[#F57F17]">{stats.avgScore}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex items-center justify-center">
                    <TrendingUp className="text-[#6A1B9A]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Pipeline Value</div>
                    <div className="text-lg font-bold text-[#6A1B9A]">NPR {(stats.totalValue / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-[#E0E0E0] overflow-x-auto">
              {pipelines.map(pipeline => (
                <button
                  key={pipeline.id}
                  onClick={() => setSelectedPipeline(pipeline.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                    selectedPipeline === pipeline.id
                      ? "border-[#1565C0] text-[#1565C0]"
                      : "border-transparent text-[#616161] hover:text-[#212121]"
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full ${pipeline.color} mr-2`}></span>
                  {pipeline.name}
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#F5F5F5] text-xs">
                    {pipeline.id === "all" 
                      ? leads.length 
                      : leads.filter(l => l.pipeline === pipeline.id).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-3 mb-4 max-md:flex-col">
              <div className="relative flex-1 max-md:w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone, or company..."
                  className="w-full h-11 pl-11 pr-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 h-11 rounded-lg border text-sm font-medium flex items-center gap-2 max-md:w-full max-md:justify-center transition-colors ${
                  showFilters 
                    ? "border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]"
                    : "border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5]"
                }`}
              >
                <Filter size={18} />
                Advanced Filters
              </button>
              <button
                onClick={handleExport}
                className="px-4 h-11 rounded-lg border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:w-full max-md:justify-center"
              >
                <Download size={18} />
                Export
              </button>
            </div>

            {/* Advanced Filter Panel */}
            {showFilters && (
              <div className="mb-4">
                <AdvancedFilterPanel
                  isOpen={showFilters}
                  filters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                  onApply={() => {
                    // Convert advanced filters to old filter format for now
                    setFilters({
                      sources: [],
                      stages: advancedFilters.stages,
                      owners: [],
                      scoreRange: advancedFilters.scoreRange,
                      valueRange: [0, 1000000],
                      dateRange: { 
                        start: advancedFilters.dateRange.start ? new Date(advancedFilters.dateRange.start) : null,
                        end: advancedFilters.dateRange.end ? new Date(advancedFilters.dateRange.end) : null,
                      },
                    });
                    setShowFilters(false);
                  }}
                  onClear={() => {
                    setAdvancedFilters({
                      pipeline: "all",
                      stages: [],
                      scoreRange: [0, 100],
                      dateRange: { start: "", end: "" },
                      assignedUsers: [],
                      tags: [],
                    });
                  }}
                  onSaveAsView={() => {
                    setShowFilters(false);
                    setShowCreateViewModal(true);
                  }}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            )}

            {/* Bulk Actions */}
            {selectedLeads.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-[#E3F2FD] border border-[#90CAF9] flex items-center justify-between max-md:flex-col max-md:gap-3">
                <span className="text-sm font-semibold text-[#1565C0]">
                  {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkAssign}
                    className="px-3 h-8 rounded-md bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
                  >
                    <UserPlus size={14} />
                    Assign
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 h-8 rounded-md bg-white text-[#C62828] hover:bg-[#FFEBEE] text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Lead Table */}
            <LeadTable
              leads={filteredLeads}
              selectedLeads={selectedLeads}
              onSelectLead={handleSelectLead}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAssign={handleAssign}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowDynamicLeadFormModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#1565C0] text-white shadow-2xl hover:bg-[#0D47A1] flex items-center justify-center transition-all hover:scale-110"
        title="Create Lead"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      {showCreateViewModal && (
        <CreateViewModal
          onCreateView={handleCreateView}
          onClose={() => setShowCreateViewModal(false)}
        />
      )}
      {showDynamicLeadFormModal && (
        <DynamicLeadFormModal
          onCreateLead={handleCreateLead}
          onClose={() => setShowDynamicLeadFormModal(false)}
        />
      )}
    </>
  );
}