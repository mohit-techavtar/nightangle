import React from "react";
import { X, Download, Archive, Trash2, RotateCw, Tag, Calendar, Zap, CheckCircle } from "lucide-react";

interface ResponseDetail {
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
  data: any;
}

interface ResponseDetailViewProps {
  response: ResponseDetail;
  onClose: () => void;
  onRerun: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export function ResponseDetailView({ response, onClose, onRerun, onArchive, onDelete, onExport }: ResponseDetailViewProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "research": return "bg-[#E3F2FD] text-[#1565C0]";
      case "strategy": return "bg-[#F3E5F5] text-[#6A1B9A]";
      case "leads": return "bg-[#E8F5E9] text-[#2E7D32]";
      case "content": return "bg-[#FFF8E1] text-[#F57F17]";
      default: return "bg-[#F5F5F5] text-[#616161]";
    }
  };

  const renderContent = () => {
    switch (response.type) {
      case "research":
        return (
          <div className="space-y-4">
            <div className="bg-[#F5F5F5] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-[#212121] mb-2">Market Overview</h4>
              <p className="text-sm text-[#616161]">
                The electric kettle market in Nepal is growing at a CAGR of 12% with strong demand 
                in urban areas. Key players include local distributors and international brands.
              </p>
            </div>
            <div className="bg-[#F5F5F5] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-[#212121] mb-2">Key Insights</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[#616161]">
                  <CheckCircle size={16} className="text-[#4CAF50] mt-0.5 shrink-0" />
                  <span>Price range: NPR 1,500 - 5,000 for standard models</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#616161]">
                  <CheckCircle size={16} className="text-[#4CAF50] mt-0.5 shrink-0" />
                  <span>Top selling features: Fast boiling, auto shut-off, LED indicators</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#616161]">
                  <CheckCircle size={16} className="text-[#4CAF50] mt-0.5 shrink-0" />
                  <span>Market dominated by Chinese imports (60%) and Indian brands (30%)</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case "strategy":
        return (
          <div className="space-y-4">
            <div className="bg-[#F5F5F5] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-[#212121] mb-2">Campaign Strategy</h4>
              <p className="text-sm text-[#616161]">
                4-week product launch campaign targeting urban professionals with focus on social media 
                and influencer partnerships. Budget allocated across 5 channels with performance tracking.
              </p>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
                <div className="text-xs text-[#616161] mb-1">Target Audience</div>
                <div className="text-sm font-semibold text-[#212121]">25-40 years, Urban</div>
              </div>
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
                <div className="text-xs text-[#616161] mb-1">Total Budget</div>
                <div className="text-sm font-semibold text-[#212121]">NPR 250,000</div>
              </div>
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
                <div className="text-xs text-[#616161] mb-1">Duration</div>
                <div className="text-sm font-semibold text-[#212121]">4 Weeks</div>
              </div>
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
                <div className="text-xs text-[#616161] mb-1">Expected Reach</div>
                <div className="text-sm font-semibold text-[#212121]">50,000+</div>
              </div>
            </div>
          </div>
        );

      case "leads":
        return (
          <div className="space-y-4">
            <div className="bg-[#E8F5E9] rounded-lg p-4 border border-[#66BB6A]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-[#4CAF50]" size={20} />
                <h4 className="text-sm font-semibold text-[#2E7D32]">Lead Generation Completed</h4>
              </div>
              <p className="text-sm text-[#2E7D32]">
                Successfully generated {response.resultCount || 0} verified leads from the Technology & IT sector in Kathmandu Valley.
              </p>
            </div>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3">
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
                <div className="text-xs text-[#616161] mb-1">Total Leads</div>
                <div className="text-2xl font-bold text-[#212121]">{response.resultCount || 0}</div>
              </div>
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
                <div className="text-xs text-[#616161] mb-1">Verified</div>
                <div className="text-2xl font-bold text-[#4CAF50]">85%</div>
              </div>
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-3">
                <div className="text-xs text-[#616161] mb-1">With Email</div>
                <div className="text-2xl font-bold text-[#1565C0]">92%</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-[#F5F5F5] rounded-lg p-4">
            <p className="text-sm text-[#616161]">Response data not available</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div className="flex items-start justify-between mb-3 max-md:flex-col max-md:gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(response.type)}`}>
                  {response.type.charAt(0).toUpperCase() + response.type.slice(1)}
                </span>
                {response.campaignTag && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20">
                    <Tag size={12} className="text-white" />
                    <span className="text-xs font-semibold text-white">{response.campaignTag}</span>
                  </div>
                )}
              </div>
              <h2 className="text-xl max-md:text-lg font-bold text-white mb-2">{response.title}</h2>
              <p className="text-sm text-white/80">{response.query}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-white/80 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{response.createdAt.toLocaleDateString()}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Zap size={14} />
              <span>{response.creditsUsed} Credits</span>
            </div>
            {response.resultCount !== undefined && (
              <>
                <span>•</span>
                <span>{response.resultCount} Results</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-240px)] overflow-y-auto">
          {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between max-md:flex-col max-md:gap-3">
          <div className="flex items-center gap-2 max-md:w-full">
            <button
              onClick={onExport}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={onRerun}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1"
            >
              <RotateCw size={16} />
              Re-run
            </button>
          </div>
          <div className="flex items-center gap-2 max-md:w-full">
            <button
              onClick={onArchive}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1"
            >
              <Archive size={16} />
              Archive
            </button>
            <button
              onClick={onDelete}
              className="px-4 h-9 rounded-md bg-[#C62828] text-white text-sm font-semibold hover:bg-[#B71C1C] flex items-center gap-2 max-md:flex-1"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
