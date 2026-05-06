import React from "react";
import { useNavigate } from "react-router";
import { LayoutGrid, TrendingUp, Users, Target } from "lucide-react";

export function KanbanDemo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex flex-col items-center justify-center p-6">
      {/* Demo Content */}
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white mb-4">
            <LayoutGrid size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2">
            CRM Kanban Board
          </h1>
          <p className="text-[#616161] text-lg">
            Visual lead pipeline management with drag-and-drop
          </p>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#1565C0] mb-1">
              <Users size={20} />
              <span className="text-sm font-medium">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">16</p>
            <p className="text-xs text-[#616161] mt-1">Across 7 stages</p>
          </div>

          <div className="bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#2E7D32] mb-1">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Won</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">2</p>
            <p className="text-xs text-[#616161] mt-1">High-value deals</p>
          </div>

          <div className="bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#EF6C00] mb-1">
              <Target size={20} />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">12</p>
            <p className="text-xs text-[#616161] mt-1">Active pipeline</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-[#F5F5F5] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Board Features</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">7 Pipeline Stages</p>
                <p className="text-xs text-[#616161]">From inquiry to won/lost</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Drag & Drop</p>
                <p className="text-xs text-[#616161]">Move leads between stages</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Color-Coded Stages</p>
                <p className="text-xs text-[#616161]">Blue to green gradient</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Lead Count Badges</p>
                <p className="text-xs text-[#616161]">Real-time stage counts</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Lead Score Indicators</p>
                <p className="text-xs text-[#616161]">Color-coded by score</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Quick Search & Filter</p>
                <p className="text-xs text-[#616161]">Find leads instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Owner Avatars</p>
                <p className="text-xs text-[#616161]">See who owns each lead</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Source Badges</p>
                <p className="text-xs text-[#616161]">Track lead origin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Preview */}
        <div className="bg-[#FAFAFA] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Pipeline Stages</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="flex-shrink-0 px-3 py-2 rounded-md border-t-2 border-[#1565C0] bg-white text-xs font-medium text-[#212121]">
              New Inquiry
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-md border-t-2 border-[#0277BD] bg-white text-xs font-medium text-[#212121]">
              Contacted
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-md border-t-2 border-[#0288D1] bg-white text-xs font-medium text-[#212121]">
              Qualified
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-md border-t-2 border-[#00897B] bg-white text-xs font-medium text-[#212121]">
              Proposal Sent
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-md border-t-2 border-[#43A047] bg-white text-xs font-medium text-[#212121]">
              Negotiation
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-md border-t-2 border-[#2E7D32] bg-[#E8F5E9] text-xs font-medium text-[#212121]">
              Won ✓
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-md border-t-2 border-[#D32F2F] bg-[#FFEBEE] text-xs font-medium text-[#212121]">
              Lost ✗
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/tenant/lead-kanban")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            <LayoutGrid size={24} />
            Open Kanban Board
          </button>
          <p className="text-xs text-[#9E9E9E] mt-3">
            Drag cards between columns to update lead stages
          </p>
        </div>
      </div>
    </div>
  );
}
