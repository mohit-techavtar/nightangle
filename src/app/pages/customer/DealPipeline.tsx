import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Filter, Download, DollarSign, Users, Calendar, TrendingUp,
  MoreVertical, Eye, Edit2, ChevronDown, Search
} from "lucide-react";

interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  probability: number;
  owner: string;
  closeDate: string;
}

const dealsByStage: Record<string, Deal[]> = {
  "Qualification": [
    { id: 1, name: "Customer Analytics Dashboard", company: "DataInsights Co", value: 540000, probability: 45, owner: "Vikram Singh", closeDate: "2026-06-15" },
    { id: 2, name: "Website Redesign", company: "Fashion Retail Ltd", value: 320000, probability: 40, owner: "Priya Mehta", closeDate: "2026-06-20" },
    { id: 3, name: "Inventory Management System", company: "Supply Chain Inc", value: 680000, probability: 50, owner: "Amit Kumar", closeDate: "2026-06-18" },
  ],
  "Proposal": [
    { id: 4, name: "Digital Marketing Suite", company: "RetailPlus Pvt Ltd", value: 980000, probability: 70, owner: "Priya Mehta", closeDate: "2026-05-22" },
    { id: 5, name: "AI Automation Platform", company: "ManuTech Industries", value: 760000, probability: 65, owner: "Sneha Rao", closeDate: "2026-06-01" },
    { id: 6, name: "Mobile App Development", company: "StartupX Technologies", value: 650000, probability: 60, owner: "Ananya Desai", closeDate: "2026-05-28" },
  ],
  "Negotiation": [
    { id: 7, name: "Enterprise CRM Implementation", company: "TechCorp India", value: 1250000, probability: 85, owner: "Rajesh Sharma", closeDate: "2026-05-15" },
    { id: 8, name: "Cloud Infrastructure", company: "HealthTech Solutions", value: 890000, probability: 80, owner: "Vikram Singh", closeDate: "2026-05-20" },
  ],
  "Closing": [
    { id: 9, name: "Cloud Migration Services", company: "FinanceHub Ltd", value: 870000, probability: 90, owner: "Amit Kumar", closeDate: "2026-05-08" },
    { id: 10, name: "E-commerce Platform", company: "Online Mart", value: 1100000, probability: 95, owner: "Sneha Rao", closeDate: "2026-05-10" },
  ],
};

const stages = ["Qualification", "Proposal", "Negotiation", "Closing"];

const stageColors: Record<string, string> = {
  "Qualification": "bg-[#FEF3C7] text-[#F59E0B]",
  "Proposal": "bg-[#DBEAFE] text-[#1565C0]",
  "Negotiation": "bg-[#E0E7FF] text-[#6366F1]",
  "Closing": "bg-[#D1FAE5] text-[#10B981]",
};

export function DealPipeline() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [draggedFromStage, setDraggedFromStage] = useState<string | null>(null);

  const handleDragStart = (deal: Deal, stage: string) => {
    setDraggedDeal(deal);
    setDraggedFromStage(stage);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStage: string) => {
    if (draggedDeal && draggedFromStage && draggedFromStage !== targetStage) {
      console.log(`Moving deal ${draggedDeal.id} from ${draggedFromStage} to ${targetStage}`);
      // Here you would update the deal stage in your state/backend
    }
    setDraggedDeal(null);
    setDraggedFromStage(null);
  };

  const getStageTotal = (stage: string) => {
    return dealsByStage[stage].reduce((sum, deal) => sum + deal.value, 0);
  };

  const getStageWeightedTotal = (stage: string) => {
    return dealsByStage[stage].reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  };

  const getTotalPipelineValue = () => {
    return Object.values(dealsByStage).flat().reduce((sum, deal) => sum + deal.value, 0);
  };

  const getTotalWeightedValue = () => {
    return Object.values(dealsByStage).flat().reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Sales" },
          { label: "Deals", path: "/tenant/deals" },
          { label: "Pipeline View" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Deal Pipeline</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {Object.values(dealsByStage).flat().length} deals • ₹{(getTotalPipelineValue() / 100000).toFixed(1)}L total value
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/tenant/deals/list")}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                List View
              </button>
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
              <button
                onClick={() => navigate("/tenant/deals/create")}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                New Deal
              </button>
            </div>
          </div>

          {/* Pipeline Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <DollarSign size={20} className="text-[#1565C0]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Total Pipeline</p>
                  <p className="text-xl font-bold text-[#0F1B2D]">₹{(getTotalPipelineValue() / 100000).toFixed(1)}L</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Weighted Value</p>
                  <p className="text-xl font-bold text-[#10B981]">₹{(getTotalWeightedValue() / 100000).toFixed(1)}L</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <Users size={20} className="text-[#6366F1]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Active Deals</p>
                  <p className="text-xl font-bold text-[#0F1B2D]">{Object.values(dealsByStage).flat().length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search deals across all stages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
              />
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {stages.map((stage) => (
              <div
                key={stage}
                className="bg-white rounded-lg border border-[#E5E7EB] flex flex-col"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage)}
              >
                {/* Stage Header */}
                <div className="p-4 border-b border-[#E5E7EB]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[#0F1B2D]">{stage}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${stageColors[stage]}`}>
                      {dealsByStage[stage].length}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-[#6B7280]">
                      Total: <span className="font-semibold text-[#0F1B2D]">₹{(getStageTotal(stage) / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      Weighted: <span className="font-semibold text-[#10B981]">₹{(getStageWeightedTotal(stage) / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>

                {/* Deals List */}
                <div className="p-2 space-y-2 overflow-y-auto flex-1 min-h-[500px]">
                  {dealsByStage[stage]
                    .filter(deal =>
                      searchQuery === "" ||
                      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      deal.company.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal, stage)}
                        className="bg-white border border-[#E5E7EB] rounded-lg p-3 hover:shadow-md transition-shadow cursor-move"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-[#0F1B2D] flex-1 pr-2 line-clamp-2">
                            {deal.name}
                          </h4>
                          <button className="text-[#9CA3AF] hover:text-[#6B7280] flex-shrink-0">
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        <p className="text-xs text-[#6B7280] mb-3">{deal.company}</p>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#1565C0]">
                            ₹{(deal.value / 100000).toFixed(1)}L
                          </span>
                          <span className="text-xs text-[#6B7280]">{deal.probability}%</span>
                        </div>

                        <div className="w-full bg-[#F3F4F6] rounded-full h-1 mb-3">
                          <div
                            className="bg-[#10B981] h-1 rounded-full transition-all"
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>{deal.owner.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(deal.closeDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
                          <button
                            onClick={() => navigate("/tenant/deals/detail")}
                            className="flex-1 px-2 py-1 text-xs font-medium text-[#1565C0] hover:bg-[#F0F9FF] rounded transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye size={12} />
                            View
                          </button>
                          <button
                            onClick={() => navigate("/tenant/deals/edit")}
                            className="flex-1 px-2 py-1 text-xs font-medium text-[#6B7280] hover:bg-[#F9FAFB] rounded transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}

                  {dealsByStage[stage].length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-[#9CA3AF]">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-[#F0F9FF] border border-[#BFDBFE] rounded-lg p-4">
            <div className="flex gap-3">
              <TrendingUp size={20} className="text-[#1565C0] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-[#0F1B2D] mb-1">Pipeline Management</h4>
                <p className="text-xs text-[#6B7280]">
                  Drag and drop deals between stages to update their status. Click on a deal card to view details or use the action buttons to edit.
                  The weighted value is calculated based on each deal's probability percentage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
