import React, { useState } from "react";
import { CreateLeadSlideOver } from "../components/crm/CreateLeadSlideOver";
import { Plus, Users, TrendingUp, Target } from "lucide-react";

export function LeadFormDemo() {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Lead created:", data);
    alert("Lead created successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex flex-col items-center justify-center p-6">
      {/* Demo Content */}
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white mb-4">
            <Users size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2">
            CRM Lead Creation Form
          </h1>
          <p className="text-[#616161] text-lg">
            Click the button below to open the slide-over panel and create a new lead
          </p>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#1565C0] mb-1">
              <Users size={20} />
              <span className="text-sm font-medium">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">1,247</p>
            <p className="text-xs text-[#616161] mt-1">+12% from last month</p>
          </div>

          <div className="bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#2E7D32] mb-1">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Conversion Rate</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">24.5%</p>
            <p className="text-xs text-[#616161] mt-1">+3.2% from last month</p>
          </div>

          <div className="bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#EF6C00] mb-1">
              <Target size={20} />
              <span className="text-sm font-medium">Active Pipelines</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">3</p>
            <p className="text-xs text-[#616161] mt-1">Sales, Support, Collections</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-[#F5F5F5] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Form Features</h2>
          <ul className="space-y-2 text-[#616161]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>4 organized sections with subtle dividers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>Required field validation with red asterisks</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>Country code selector for phone numbers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>Dynamic stage dropdown based on pipeline selection</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>Multi-select tags with ability to create new tags</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>Inline validation states with error messages</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>Dynamic custom fields section</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></span>
              <span>Sticky footer with action buttons</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => setIsSlideOverOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            <Plus size={24} />
            Create New Lead
          </button>
        </div>
      </div>

      {/* Slide-over Panel */}
      <CreateLeadSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
