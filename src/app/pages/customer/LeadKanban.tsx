import React, { useState, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { KanbanColumn } from "../../components/kanban/KanbanColumn";
import { KanbanLead, KanbanField } from "../../components/kanban/LeadKanbanCard";
import { Search, Filter, ChevronDown, SlidersHorizontal, Paintbrush, Square, Check, Plus, X } from "lucide-react";

const stages = [
  { id: "new-inquiry", name: "New Inquiry", color: "#1565C0" },
  { id: "contacted", name: "Contacted", color: "#0277BD" },
  { id: "qualified", name: "Qualified", color: "#0288D1" },
  { id: "proposal-sent", name: "Proposal Sent", color: "#00897B" },
  { id: "negotiation", name: "Negotiation", color: "#43A047" },
  { id: "won", name: "Won", color: "#2E7D32", bgColor: "#E8F5E9" },
  { id: "lost", name: "Lost", color: "#D32F2F", bgColor: "#FFEBEE" },
];

const mk = (id: string, name: string, company: string, phone: string, source: string, sourceColor: string, score: number, initials: string, ownerName: string, lastActivity: string, stage: string, value: number, email: string, tags: string[]): KanbanLead & { stage: string } =>
  ({ id, name, company, phone, source, sourceColor, score, owner: { name: ownerName, initials }, lastActivity, stage, value, email, tags });

const mockLeads = [
  mk("1", "Rajesh Kumar", "Tech Innovations Pvt Ltd", "+91 98765 43210", "Web Form", "#1565C0", 85, "AV", "Akash Verma", "2h ago", "new-inquiry", 250000, "rajesh@techinnov.in", ["Enterprise"]),
  mk("2", "Priya Sharma", "Digital Solutions Inc", "+91 98765 43211", "WhatsApp", "#25D366", 72, "PS", "Priya Sharma", "5h ago", "new-inquiry", 120000, "priya@digisol.in", ["SMB"]),
  mk("3", "Amit Patel", "Patel Enterprises", "+91 98765 43212", "Meta Ads", "#1877F2", 90, "RS", "Rohit Singh", "1d ago", "new-inquiry", 480000, "amit@patel.co", ["Hot"]),
  mk("4", "Sneha Reddy", "Reddy Corp", "+91 98765 43213", "Phone Call", "#F57C00", 68, "AV", "Akash Verma", "3h ago", "contacted", 90000, "sneha@reddycorp.in", []),
  mk("5", "Vikram Singh", "Singh Industries", "+91 98765 43214", "Email", "#D32F2F", 75, "PS", "Priya Sharma", "6h ago", "contacted", 300000, "vikram@singhind.in", ["Manufacturing"]),
  mk("6", "Anjali Mehta", "Mehta Global", "+91 98765 43215", "Web Form", "#1565C0", 82, "RS", "Rohit Singh", "4h ago", "contacted", 175000, "anjali@mehtaglobal.in", []),
  mk("7", "Rahul Verma", "Verma Tech Solutions", "+91 98765 43216", "WhatsApp", "#25D366", 88, "AV", "Akash Verma", "1h ago", "qualified", 540000, "rahul@vermatech.in", ["Enterprise", "Hot"]),
  mk("8", "Kavita Joshi", "Joshi Consultants", "+91 98765 43217", "Meta Ads", "#1877F2", 79, "PS", "Priya Sharma", "7h ago", "qualified", 220000, "kavita@joshicon.in", []),
  mk("9", "Suresh Nair", "Nair Enterprises", "+91 98765 43218", "Phone Call", "#F57C00", 91, "RS", "Rohit Singh", "2h ago", "proposal-sent", 610000, "suresh@nair.co", ["Enterprise"]),
  mk("10", "Deepa Iyer", "Iyer & Associates", "+91 98765 43219", "Email", "#D32F2F", 86, "AV", "Akash Verma", "5h ago", "proposal-sent", 410000, "deepa@iyerassoc.in", []),
  mk("11", "Karan Malhotra", "Malhotra Group", "+91 98765 43220", "Web Form", "#1565C0", 93, "PS", "Priya Sharma", "3h ago", "negotiation", 880000, "karan@malhotra.in", ["Hot", "Key Account"]),
  mk("12", "Nisha Gupta", "Gupta Innovations", "+91 98765 43221", "WhatsApp", "#25D366", 87, "RS", "Rohit Singh", "8h ago", "negotiation", 360000, "nisha@guptainnov.in", []),
  mk("13", "Arun Krishnan", "Krishnan Tech", "+91 98765 43222", "Meta Ads", "#1877F2", 95, "AV", "Akash Verma", "1d ago", "won", 720000, "arun@krishnantech.in", ["Closed"]),
  mk("14", "Pooja Desai", "Desai Solutions", "+91 98765 43223", "Phone Call", "#F57C00", 92, "PS", "Priya Sharma", "2d ago", "won", 450000, "pooja@desaisol.in", []),
  mk("15", "Sanjay Pillai", "Pillai Industries", "+91 98765 43224", "Email", "#D32F2F", 45, "RS", "Rohit Singh", "3d ago", "lost", 150000, "sanjay@pillai.in", ["Lost"]),
  mk("16", "Meera Rao", "Rao Enterprises", "+91 98765 43225", "Web Form", "#1565C0", 38, "AV", "Akash Verma", "4d ago", "lost", 80000, "meera@raoent.in", []),
];

const pipelines = [
  { id: "sales", name: "Sales Pipeline" },
  { id: "support", name: "Support Pipeline" },
  { id: "collections", name: "Collections Pipeline" },
];

const ALL_FIELDS: { key: KanbanField; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "value", label: "Deal Value" },
  { key: "source", label: "Source" },
  { key: "score", label: "Lead Score" },
  { key: "owner", label: "Owner" },
  { key: "lastActivity", label: "Last Activity" },
  { key: "tags", label: "Tags" },
];

const DEFAULT_FIELDS: KanbanField[] = ["company", "phone", "source", "score", "owner", "lastActivity"];

export function LeadKanban() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState(mockLeads);
  const [selectedPipeline, setSelectedPipeline] = useState(pipelines[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPipelineDropdown, setShowPipelineDropdown] = useState(false);
  const [variant, setVariant] = useState<"simple" | "gradient">("gradient");
  const [visibleFields, setVisibleFields] = useState<Set<KanbanField>>(new Set(DEFAULT_FIELDS));
  const [showFieldMenu, setShowFieldMenu] = useState(false);

  const handleDrop = (leadId: string, targetStage: string) =>
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: targetStage } : l)));

  const toggleField = (f: KanbanField) =>
    setVisibleFields((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });

  const matches = (l: KanbanLead) =>
    !searchTerm ||
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase());

  const stageLeads = (stageId: string) => leads.filter((l) => l.stage === stageId && matches(l));
  const stageValue = (stageId: string) => leads.filter((l) => l.stage === stageId).reduce((s, l) => s + (l.value || 0), 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Lead Pipeline" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

        {/* Controls */}
        <div className="bg-white border-b border-[#E0E0E0] px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Pipeline selector */}
            <div className="relative">
              <button onClick={() => setShowPipelineDropdown(!showPipelineDropdown)}
                className="h-10 px-4 rounded-lg border border-[#E0E0E0] bg-white text-[#212121] text-sm font-semibold flex items-center gap-2 hover:border-[#1565C0] hover:bg-[#F5F5F5] transition-all">
                <span>{selectedPipeline.name}</span><ChevronDown size={16} />
              </button>
              {showPipelineDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg border border-[#E0E0E0] shadow-lg z-20 py-1">
                  {pipelines.map((p) => (
                    <button key={p.id} onClick={() => { setSelectedPipeline(p); setShowPipelineDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedPipeline.id === p.id ? "bg-[#E3F2FD] text-[#1565C0] font-semibold" : "text-[#212121] hover:bg-[#F5F5F5]"}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[220px] max-w-md relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search leads by name or company..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#E0E0E0] text-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all" />
            </div>

            {/* View toggle: Simple / Gradient */}
            <div className="flex items-center rounded-lg border border-[#E0E0E0] overflow-hidden h-10">
              <button onClick={() => setVariant("simple")}
                className={`h-full px-3 text-sm font-medium flex items-center gap-1.5 transition-colors ${variant === "simple" ? "bg-[#1565C0] text-white" : "bg-white text-[#616161] hover:bg-[#F5F5F5]"}`}>
                <Square size={15} /> Simple
              </button>
              <button onClick={() => setVariant("gradient")}
                className={`h-full px-3 text-sm font-medium flex items-center gap-1.5 transition-colors ${variant === "gradient" ? "bg-gradient-to-r from-[#1565C0] to-[#00897B] text-white" : "bg-white text-[#616161] hover:bg-[#F5F5F5]"}`}>
                <Paintbrush size={15} /> Gradient
              </button>
            </div>

            {/* Field management */}
            <div className="relative">
              <button onClick={() => setShowFieldMenu((s) => !s)}
                className={`h-10 px-4 rounded-lg border text-sm font-semibold flex items-center gap-2 transition-all ${showFieldMenu ? "border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]" : "border-[#E0E0E0] bg-white text-[#616161] hover:border-[#1565C0] hover:text-[#1565C0]"}`}>
                <SlidersHorizontal size={16} /> Fields
              </button>
              {showFieldMenu && (
                <div className="absolute top-full right-0 mt-1 w-60 bg-white rounded-lg border border-[#E0E0E0] shadow-lg z-20 p-2">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-xs font-semibold text-[#616161] uppercase">Card Fields</span>
                    <button onClick={() => setShowFieldMenu(false)} className="text-[#9E9E9E] hover:text-[#212121]"><X size={14} /></button>
                  </div>
                  {ALL_FIELDS.map((f) => {
                    const on = visibleFields.has(f.key);
                    return (
                      <button key={f.key} onClick={() => toggleField(f.key)}
                        className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#F5F5F5] text-sm text-[#212121]">
                        {f.label}
                        <span className={`w-4 h-4 rounded flex items-center justify-center border ${on ? "bg-[#1565C0] border-[#1565C0]" : "border-[#BDBDBD]"}`}>
                          {on && <Check size={12} className="text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button className="h-10 px-4 rounded-lg border border-[#E0E0E0] bg-white text-[#616161] text-sm font-semibold flex items-center gap-2 hover:border-[#1565C0] hover:text-[#1565C0] hover:bg-[#E3F2FD] transition-all">
              <Filter size={16} /> Filters
            </button>

            <button onClick={() => navigate("/tenant/leads/create")}
              className="h-10 px-4 rounded-lg bg-[#1565C0] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#0D47A1] transition-all">
              <Plus size={16} /> Create Lead
            </button>
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 bg-[#F5F5F5] overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 p-6 h-full">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                leads={stageLeads(stage.id)}
                onDrop={handleDrop}
                onCardClick={() => navigate("/tenant/lead-detail")}
                visibleFields={visibleFields}
                variant={variant}
                totalValue={visibleFields.has("value") ? stageValue(stage.id) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
