import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { QueryHistoryTable } from "../../components/responses/QueryHistoryTable";
import { CampaignTagModal } from "../../components/responses/CampaignTagModal";
import { ResponseDetailView } from "../../components/responses/ResponseDetailView";
import { TrendingUp, Database, CheckCircle, Archive as ArchiveIcon } from "lucide-react";

interface QueryResponse {
  id: string;
  type: "research" | "strategy" | "leads" | "content";
  title: string;
  query: string;
  status: "completed" | "archived" | "failed";
  campaignTag?: string;
  creditsUsed: number;
  createdAt: Date;
  module: string;
  resultCount?: number;
  data?: any;
}

// Mock data
const mockResponses: QueryResponse[] = [
  {
    id: "resp-001",
    type: "research",
    title: "Electric Kettle Market Research",
    query: "Analyze electric kettle market in Nepal including pricing, competitors, and distribution channels",
    status: "completed",
    campaignTag: "Product Launch",
    creditsUsed: 2,
    createdAt: new Date("2026-03-25"),
    module: "Product Research",
    resultCount: 45,
  },
  {
    id: "resp-002",
    type: "strategy",
    title: "Product Launch Campaign Strategy",
    query: "Create 4-week campaign strategy for smart electric kettle launch targeting urban professionals",
    status: "completed",
    campaignTag: "Product Launch",
    creditsUsed: 2,
    createdAt: new Date("2026-03-24"),
    module: "Strategy Planning",
  },
  {
    id: "resp-003",
    type: "leads",
    title: "Technology Companies - Kathmandu",
    query: "Generate leads for technology and IT companies in Kathmandu Valley with 50-200 employees",
    status: "completed",
    campaignTag: "Q1 2026 Campaign",
    creditsUsed: 3,
    createdAt: new Date("2026-03-23"),
    module: "Lead Generation",
    resultCount: 142,
  },
  {
    id: "resp-004",
    type: "research",
    title: "Competitor Analysis - Home Appliances",
    query: "Detailed competitor analysis for home appliances sector in Nepal",
    status: "completed",
    creditsUsed: 2,
    createdAt: new Date("2026-03-22"),
    module: "Product Research",
    resultCount: 28,
  },
  {
    id: "resp-005",
    type: "strategy",
    title: "Market Expansion - Western Nepal",
    query: "Strategic plan for expanding distribution network to western Nepal regions",
    status: "archived",
    campaignTag: "Market Expansion - Western Nepal",
    creditsUsed: 2,
    createdAt: new Date("2026-03-20"),
    module: "Strategy Planning",
  },
  {
    id: "resp-006",
    type: "leads",
    title: "Retail Store Database - Pokhara",
    query: "Compile database of retail stores and distributors in Pokhara area",
    status: "completed",
    campaignTag: "Market Expansion - Western Nepal",
    creditsUsed: 3,
    createdAt: new Date("2026-03-19"),
    module: "Lead Generation",
    resultCount: 89,
  },
  {
    id: "resp-007",
    type: "research",
    title: "Pricing Benchmark Study",
    query: "Benchmark pricing for electric kettles across online and offline channels",
    status: "completed",
    campaignTag: "Product Launch",
    creditsUsed: 2,
    createdAt: new Date("2026-03-18"),
    module: "Product Research",
    resultCount: 67,
  },
  {
    id: "resp-008",
    type: "leads",
    title: "Decision Makers - Manufacturing Sector",
    query: "Find decision makers and executives in manufacturing companies nationwide",
    status: "completed",
    creditsUsed: 4,
    createdAt: new Date("2026-03-15"),
    module: "Lead Generation",
    resultCount: 203,
  },
];

export function ResponseManagement() {
  const [responses, setResponses] = useState<QueryResponse[]>(mockResponses);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedForTag, setSelectedForTag] = useState<string[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<QueryResponse | null>(null);

  const existingTags = Array.from(new Set(responses.filter(r => r.campaignTag).map(r => r.campaignTag!)));

  const handleView = (id: string) => {
    const response = responses.find(r => r.id === id);
    if (response) {
      setSelectedResponse(response);
    }
  };

  const handleRerun = (id: string) => {
    console.log("Re-running query:", id);
    alert("Query re-run initiated. You'll be notified when complete.");
  };

  const handleArchive = (ids: string[]) => {
    setResponses(responses.map(r =>
      ids.includes(r.id) ? { ...r, status: "archived" as const } : r
    ));
    console.log("Archived:", ids);
  };

  const handleDelete = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} ${ids.length === 1 ? 'response' : 'responses'}?`)) {
      setResponses(responses.filter(r => !ids.includes(r.id)));
      console.log("Deleted:", ids);
    }
  };

  const handleTag = (ids: string[], tag?: string) => {
    setSelectedForTag(ids);
    setShowTagModal(true);
  };

  const handleApplyTag = (tag: string) => {
    setResponses(responses.map(r =>
      selectedForTag.includes(r.id) ? { ...r, campaignTag: tag } : r
    ));
    setShowTagModal(false);
    setSelectedForTag([]);
  };

  const handleExport = (id: string) => {
    console.log("Exporting response:", id);
    alert("Export initiated. Download will start shortly.");
  };

  const stats = {
    total: responses.length,
    completed: responses.filter(r => r.status === "completed").length,
    archived: responses.filter(r => r.status === "archived").length,
    totalCredits: responses.reduce((sum, r) => sum + r.creditsUsed, 0),
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Business Playground" }, { label: "Response Management" }]} 
        companyName="Everest Digital Solutions" 
        mode="customer" 
        userName="Rajesh Sharma" 
        userEmail="rajesh@everestdigital.com" 
        userInitials="RS" 
      />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 max-md:mb-4">
            <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Response & Data Management</h1>
            <p className="text-sm text-[#616161]">Track, organize, and manage all your AI query responses and generated data</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-6 max-md:mb-4">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <Database className="text-[#1565C0]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Total Responses</div>
                  <div className="text-2xl font-bold text-[#212121]">{stats.total}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
                  <CheckCircle className="text-[#4CAF50]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Completed</div>
                  <div className="text-2xl font-bold text-[#4CAF50]">{stats.completed}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
                  <ArchiveIcon className="text-[#616161]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Archived</div>
                  <div className="text-2xl font-bold text-[#616161]">{stats.archived}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#FFF8E1] flex items-center justify-center">
                  <TrendingUp className="text-[#F57F17]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Credits Used</div>
                  <div className="text-2xl font-bold text-[#F57F17]">{stats.totalCredits}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Tags Overview */}
          {existingTags.length > 0 && (
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 mb-6 max-md:mb-4">
              <h3 className="text-sm font-semibold text-[#212121] mb-3">Active Campaign Tags</h3>
              <div className="flex flex-wrap gap-2">
                {existingTags.map(tag => {
                  const count = responses.filter(r => r.campaignTag === tag).length;
                  return (
                    <div key={tag} className="px-3 py-2 rounded-lg bg-[#E3F2FD] border border-[#90CAF9] flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1565C0]">{tag}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1565C0] text-white text-xs font-bold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Query History Table */}
          <QueryHistoryTable
            responses={responses}
            onView={handleView}
            onRerun={handleRerun}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onTag={handleTag}
          />
        </div>
      </div>

      {/* Modals */}
      {showTagModal && (
        <CampaignTagModal
          selectedCount={selectedForTag.length}
          existingTags={existingTags}
          onApply={handleApplyTag}
          onCancel={() => {
            setShowTagModal(false);
            setSelectedForTag([]);
          }}
        />
      )}

      {selectedResponse && (
        <ResponseDetailView
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
          onRerun={() => {
            handleRerun(selectedResponse.id);
            setSelectedResponse(null);
          }}
          onArchive={() => {
            handleArchive([selectedResponse.id]);
            setSelectedResponse(null);
          }}
          onDelete={() => {
            handleDelete([selectedResponse.id]);
            setSelectedResponse(null);
          }}
          onExport={() => handleExport(selectedResponse.id)}
        />
      )}
    </>
  );
}
