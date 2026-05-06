import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { KanbanColumn } from "../../components/kanban/KanbanColumn";
import { Search, Filter, ChevronDown } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  source: string;
  sourceColor: string;
  score: number;
  owner: {
    name: string;
    avatar?: string;
    initials: string;
  };
  lastActivity: string;
  stage: string;
}

// Pipeline stages with colors following a gradient from blue to green for progression
const stages = [
  { id: "new-inquiry", name: "New Inquiry", color: "#1565C0" }, // Blue
  { id: "contacted", name: "Contacted", color: "#0277BD" }, // Lighter Blue
  { id: "qualified", name: "Qualified", color: "#0288D1" }, // Cyan
  { id: "proposal-sent", name: "Proposal Sent", color: "#00897B" }, // Teal
  { id: "negotiation", name: "Negotiation", color: "#43A047" }, // Light Green
  { id: "won", name: "Won", color: "#2E7D32", bgColor: "#E8F5E9" }, // Green with tint
  { id: "lost", name: "Lost", color: "#D32F2F", bgColor: "#FFEBEE" }, // Red with tint
];

// Mock data
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    company: "Tech Innovations Pvt Ltd",
    phone: "+91 98765 43210",
    source: "Web Form",
    sourceColor: "#1565C0",
    score: 85,
    owner: { name: "Akash Verma", initials: "AV" },
    lastActivity: "2h ago",
    stage: "new-inquiry",
  },
  {
    id: "2",
    name: "Priya Sharma",
    company: "Digital Solutions Inc",
    phone: "+91 98765 43211",
    source: "WhatsApp",
    sourceColor: "#25D366",
    score: 72,
    owner: { name: "Priya Sharma", initials: "PS" },
    lastActivity: "5h ago",
    stage: "new-inquiry",
  },
  {
    id: "3",
    name: "Amit Patel",
    company: "Patel Enterprises",
    phone: "+91 98765 43212",
    source: "Meta Ads",
    sourceColor: "#1877F2",
    score: 90,
    owner: { name: "Rohit Singh", initials: "RS" },
    lastActivity: "1d ago",
    stage: "new-inquiry",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    company: "Reddy Corp",
    phone: "+91 98765 43213",
    source: "Phone Call",
    sourceColor: "#F57C00",
    score: 68,
    owner: { name: "Akash Verma", initials: "AV" },
    lastActivity: "3h ago",
    stage: "contacted",
  },
  {
    id: "5",
    name: "Vikram Singh",
    company: "Singh Industries",
    phone: "+91 98765 43214",
    source: "Email",
    sourceColor: "#D32F2F",
    score: 75,
    owner: { name: "Priya Sharma", initials: "PS" },
    lastActivity: "6h ago",
    stage: "contacted",
  },
  {
    id: "6",
    name: "Anjali Mehta",
    company: "Mehta Global",
    phone: "+91 98765 43215",
    source: "Web Form",
    sourceColor: "#1565C0",
    score: 82,
    owner: { name: "Rohit Singh", initials: "RS" },
    lastActivity: "4h ago",
    stage: "contacted",
  },
  {
    id: "7",
    name: "Rahul Verma",
    company: "Verma Tech Solutions",
    phone: "+91 98765 43216",
    source: "WhatsApp",
    sourceColor: "#25D366",
    score: 88,
    owner: { name: "Akash Verma", initials: "AV" },
    lastActivity: "1h ago",
    stage: "qualified",
  },
  {
    id: "8",
    name: "Kavita Joshi",
    company: "Joshi Consultants",
    phone: "+91 98765 43217",
    source: "Meta Ads",
    sourceColor: "#1877F2",
    score: 79,
    owner: { name: "Priya Sharma", initials: "PS" },
    lastActivity: "7h ago",
    stage: "qualified",
  },
  {
    id: "9",
    name: "Suresh Nair",
    company: "Nair Enterprises",
    phone: "+91 98765 43218",
    source: "Phone Call",
    sourceColor: "#F57C00",
    score: 91,
    owner: { name: "Rohit Singh", initials: "RS" },
    lastActivity: "2h ago",
    stage: "proposal-sent",
  },
  {
    id: "10",
    name: "Deepa Iyer",
    company: "Iyer & Associates",
    phone: "+91 98765 43219",
    source: "Email",
    sourceColor: "#D32F2F",
    score: 86,
    owner: { name: "Akash Verma", initials: "AV" },
    lastActivity: "5h ago",
    stage: "proposal-sent",
  },
  {
    id: "11",
    name: "Karan Malhotra",
    company: "Malhotra Group",
    phone: "+91 98765 43220",
    source: "Web Form",
    sourceColor: "#1565C0",
    score: 93,
    owner: { name: "Priya Sharma", initials: "PS" },
    lastActivity: "3h ago",
    stage: "negotiation",
  },
  {
    id: "12",
    name: "Nisha Gupta",
    company: "Gupta Innovations",
    phone: "+91 98765 43221",
    source: "WhatsApp",
    sourceColor: "#25D366",
    score: 87,
    owner: { name: "Rohit Singh", initials: "RS" },
    lastActivity: "8h ago",
    stage: "negotiation",
  },
  {
    id: "13",
    name: "Arun Krishnan",
    company: "Krishnan Tech",
    phone: "+91 98765 43222",
    source: "Meta Ads",
    sourceColor: "#1877F2",
    score: 95,
    owner: { name: "Akash Verma", initials: "AV" },
    lastActivity: "1d ago",
    stage: "won",
  },
  {
    id: "14",
    name: "Pooja Desai",
    company: "Desai Solutions",
    phone: "+91 98765 43223",
    source: "Phone Call",
    sourceColor: "#F57C00",
    score: 92,
    owner: { name: "Priya Sharma", initials: "PS" },
    lastActivity: "2d ago",
    stage: "won",
  },
  {
    id: "15",
    name: "Sanjay Pillai",
    company: "Pillai Industries",
    phone: "+91 98765 43224",
    source: "Email",
    sourceColor: "#D32F2F",
    score: 45,
    owner: { name: "Rohit Singh", initials: "RS" },
    lastActivity: "3d ago",
    stage: "lost",
  },
  {
    id: "16",
    name: "Meera Rao",
    company: "Rao Enterprises",
    phone: "+91 98765 43225",
    source: "Web Form",
    sourceColor: "#1565C0",
    score: 38,
    owner: { name: "Akash Verma", initials: "AV" },
    lastActivity: "4d ago",
    stage: "lost",
  },
];

const pipelines = [
  { id: "sales", name: "Sales Pipeline" },
  { id: "support", name: "Support Pipeline" },
  { id: "collections", name: "Collections Pipeline" },
];

export function LeadKanban() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedPipeline, setSelectedPipeline] = useState(pipelines[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPipelineDropdown, setShowPipelineDropdown] = useState(false);

  const handleDrop = (leadId: string, targetStage: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, stage: targetStage } : lead
      )
    );
  };

  const handleCardClick = (leadId: string) => {
    navigate("/tenant/lead-detail");
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter((lead) => lead.stage === stageId);
  };

  const filteredLeads = searchTerm
    ? leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : leads;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <TopBar
          breadcrumbs={[{ label: "CRM" }, { label: "Lead Pipeline" }]}
          companyName="Everest Digital Solutions"
          mode="customer"
          userName="Rajesh Sharma"
          userEmail="rajesh@everestdigital.com"
          userInitials="RS"
        />

        {/* Top Bar Controls */}
        <div className="bg-white border-b border-[#E0E0E0] px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Pipeline Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPipelineDropdown(!showPipelineDropdown)}
                className="h-10 px-4 rounded-md border border-[#E0E0E0] bg-white text-[#212121] text-sm font-semibold flex items-center gap-2 hover:border-[#1565C0] hover:bg-[#F5F5F5] transition-all"
              >
                <span>{selectedPipeline.name}</span>
                <ChevronDown size={16} />
              </button>
              {showPipelineDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md border border-[#E0E0E0] shadow-lg z-10 py-1">
                  {pipelines.map((pipeline) => (
                    <button
                      key={pipeline.id}
                      onClick={() => {
                        setSelectedPipeline(pipeline);
                        setShowPipelineDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        selectedPipeline.id === pipeline.id
                          ? "bg-[#E3F2FD] text-[#1565C0] font-semibold"
                          : "text-[#212121] hover:bg-[#F5F5F5]"
                      }`}
                    >
                      {pipeline.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads by name or company..."
                className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
              />
            </div>

            {/* Filter Button */}
            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] bg-white text-[#616161] text-sm font-semibold flex items-center gap-2 hover:border-[#1565C0] hover:text-[#1565C0] hover:bg-[#E3F2FD] transition-all">
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 bg-[#F5F5F5] overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 p-6 h-full">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                leads={getLeadsByStage(stage.id).filter((lead) =>
                  searchTerm
                    ? lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      lead.company.toLowerCase().includes(searchTerm.toLowerCase())
                    : true
                )}
                onDrop={handleDrop}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}