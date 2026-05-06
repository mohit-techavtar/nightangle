import React from "react";
import { useNavigate } from "react-router";
import { GitMerge, Mail, Phone, User, CheckCircle } from "lucide-react";

export function DuplicatesDemo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex flex-col items-center justify-center p-6">
      {/* Demo Content */}
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white mb-4">
            <GitMerge size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2">
            Duplicate Lead Management
          </h1>
          <p className="text-[#616161] text-lg">
            Identify, compare, and merge duplicate leads efficiently
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#FFEBEE] to-[#FFCDD2] rounded-lg p-5 border border-[#D32F2F]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#D32F2F] flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">Email Match</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              Automatically detect duplicates based on email addresses
            </p>
            <p className="text-xs text-[#9E9E9E]">95% confidence match</p>
          </div>

          <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg p-5 border border-[#1565C0]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1565C0] flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">Phone Match</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              Identify duplicates with matching phone numbers
            </p>
            <p className="text-xs text-[#9E9E9E]">88% confidence match</p>
          </div>

          <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFE082] rounded-lg p-5 border border-[#F57F17]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F57F17] flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">Name Match</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              Fuzzy matching for similar names and company details
            </p>
            <p className="text-xs text-[#9E9E9E]">82% confidence match</p>
          </div>

          <div className="bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] rounded-lg p-5 border border-[#2E7D32]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#2E7D32] flex items-center justify-center">
                <GitMerge size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">Smart Merge</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              Field-by-field comparison with merge preview
            </p>
            <p className="text-xs text-[#9E9E9E]">Multiple matches detected</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-[#F5F5F5] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Interface Features</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Duplicate Pairs List</p>
                <p className="text-xs text-[#616161]">Left sidebar with match confidence</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Side-by-Side Comparison</p>
                <p className="text-xs text-[#616161]">Every field aligned in rows</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Match Highlighting</p>
                <p className="text-xs text-[#616161]">Yellow highlights for matched fields</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Field Selection</p>
                <p className="text-xs text-[#616161]">Radio buttons to choose values</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Merged Preview</p>
                <p className="text-xs text-[#616161]">See final result before merging</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Action Buttons</p>
                <p className="text-xs text-[#616161]">Merge, Link, Not Duplicate, Skip</p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Pairs */}
        <div className="bg-[#FAFAFA] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Sample Duplicate Pairs</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-[#E0E0E0]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#616161]">Rajesh Kumar</span>
                <span className="text-xs text-[#9E9E9E]">vs</span>
                <span className="text-sm font-medium text-[#616161]">Rajesh K.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-md bg-[#FFEBEE] text-[#D32F2F] text-xs font-medium">
                  Multiple Matches
                </span>
                <span className="text-sm font-bold text-[#D32F2F]">95%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-[#E0E0E0]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#616161]">Sneha Reddy</span>
                <span className="text-xs text-[#9E9E9E]">vs</span>
                <span className="text-sm font-medium text-[#616161]">Sneha R.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-md bg-[#E3F2FD] text-[#1565C0] text-xs font-medium">
                  Phone Match
                </span>
                <span className="text-sm font-bold text-[#F57F17]">88%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-[#E0E0E0]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#616161]">Amit Verma</span>
                <span className="text-xs text-[#9E9E9E]">vs</span>
                <span className="text-sm font-medium text-[#616161]">Amit V. Verma</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-md bg-[#FFF8E1] text-[#F57F17] text-xs font-medium">
                  Name Match
                </span>
                <span className="text-sm font-bold text-[#1565C0]">82%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center p-3 bg-[#FAFAFA] rounded-lg">
            <p className="text-2xl font-bold text-[#D32F2F]">3</p>
            <p className="text-xs text-[#616161] mt-1">Pairs Pending</p>
          </div>
          <div className="text-center p-3 bg-[#FAFAFA] rounded-lg">
            <p className="text-2xl font-bold text-[#F57F17]">15</p>
            <p className="text-xs text-[#616161] mt-1">Fields to Review</p>
          </div>
          <div className="text-center p-3 bg-[#FAFAFA] rounded-lg">
            <p className="text-2xl font-bold text-[#1565C0]">88%</p>
            <p className="text-xs text-[#616161] mt-1">Avg Confidence</p>
          </div>
          <div className="text-center p-3 bg-[#FAFAFA] rounded-lg">
            <p className="text-2xl font-bold text-[#2E7D32]">42</p>
            <p className="text-xs text-[#616161] mt-1">Merged This Week</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/tenant/duplicates")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            <GitMerge size={24} />
            Open Duplicate Management
          </button>
          <p className="text-xs text-[#9E9E9E] mt-3">
            Review and merge duplicate leads with confidence
          </p>
        </div>
      </div>
    </div>
  );
}
