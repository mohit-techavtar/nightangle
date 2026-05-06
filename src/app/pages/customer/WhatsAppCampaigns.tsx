import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Send, TrendingUp, Users, Clock, CheckCheck, Eye, Edit, Trash2,
  Copy, Play, Pause, Filter, Search, MoreVertical, Calendar, Target
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Summer Product Launch",
    status: "active",
    type: "broadcast",
    sent: 4567,
    delivered: 4523,
    read: 3890,
    replied: 892,
    ctr: 19.7,
    created: "2024-04-15",
    scheduled: null,
  },
  {
    id: 2,
    name: "Customer Feedback Survey",
    status: "active",
    type: "session",
    sent: 2341,
    delivered: 2298,
    read: 1876,
    replied: 567,
    ctr: 24.2,
    created: "2024-04-12",
    scheduled: null,
  },
  {
    id: 3,
    name: "Abandoned Cart Recovery",
    status: "scheduled",
    type: "template",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    ctr: 0,
    created: "2024-04-18",
    scheduled: "2024-04-20 10:00 AM",
  },
  {
    id: 4,
    name: "Weekend Flash Sale",
    status: "draft",
    type: "broadcast",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    ctr: 0,
    created: "2024-04-17",
    scheduled: null,
  },
  {
    id: 5,
    name: "Product Update Notification",
    status: "completed",
    type: "template",
    sent: 5632,
    delivered: 5598,
    read: 4723,
    replied: 1234,
    ctr: 21.9,
    created: "2024-04-01",
    scheduled: null,
  },
];

export function WhatsAppCampaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-[#D1FAE5] text-[#065F46]";
      case "scheduled": return "bg-[#DBEAFE] text-[#1E40AF]";
      case "draft": return "bg-[#E5E7EB] text-[#374151]";
      case "completed": return "bg-[#FEF3C7] text-[#92400E]";
      default: return "bg-[#E5E7EB] text-[#374151]";
    }
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "WhatsApp" },
          { label: "Campaigns" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Campaign Manager</h1>
              <p className="text-sm text-[#6B7280] mt-1">Create and manage WhatsApp broadcast campaigns</p>
            </div>
            <button
              onClick={() => navigate("/tenant/whatsapp/campaigns/create")}
              className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Campaign
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <Target size={20} className="text-[#10B981]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">5</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Campaigns</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Send size={20} className="text-[#1565C0]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">12,540</div>
              <div className="text-sm text-[#6B7280] mt-1">Messages Sent</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <CheckCheck size={20} className="text-[#10B981]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">97.8%</div>
              <div className="text-sm text-[#6B7280] mt-1">Avg Delivery Rate</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#F59E0B]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">21.9%</div>
              <div className="text-sm text-[#6B7280] mt-1">Avg Response Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "all"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "active"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter("scheduled")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === "scheduled"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  Scheduled
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
                >
                  <Filter size={16} />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg border border-[#E5E7EB] hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#0F1B2D]">{campaign.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#6B7280]">
                          {campaign.type === "broadcast" ? "Broadcast" : campaign.type === "session" ? "Session Message" : "Template"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Created {campaign.created}</span>
                        </div>
                        {campaign.scheduled && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>Scheduled for {campaign.scheduled}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-[#6B7280]" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                          <Eye size={14} />
                          View Details
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                          <Edit size={14} />
                          Edit
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                          <Copy size={14} />
                          Duplicate
                        </button>
                        {campaign.status === "active" && (
                          <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                            <Pause size={14} />
                            Pause
                          </button>
                        )}
                        {campaign.status === "draft" && (
                          <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                            <Play size={14} />
                            Launch
                          </button>
                        )}
                        <div className="border-t border-[#E5E7EB]"></div>
                        <button className="w-full px-4 py-2 text-left text-sm text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2">
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {campaign.status !== "draft" && campaign.sent > 0 && (
                    <div className="grid grid-cols-5 gap-4">
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Send size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Sent</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.sent.toLocaleString()}</div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCheck size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Delivered</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.delivered.toLocaleString()}</div>
                        <div className="text-xs text-[#10B981] mt-1">
                          {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Read</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.read.toLocaleString()}</div>
                        <div className="text-xs text-[#3B82F6] mt-1">
                          {((campaign.read / campaign.delivered) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Replied</span>
                        </div>
                        <div className="text-xl font-bold text-[#0F1B2D]">{campaign.replied.toLocaleString()}</div>
                        <div className="text-xs text-[#F59E0B] mt-1">
                          {((campaign.replied / campaign.read) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-[#F9FAFB] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Response Rate</span>
                        </div>
                        <div className="text-xl font-bold text-[#10B981]">{campaign.ctr.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}

                  {campaign.status === "scheduled" && (
                    <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-[#1565C0]" />
                          <span className="text-sm font-medium text-[#1E40AF]">
                            Scheduled for {campaign.scheduled}
                          </span>
                        </div>
                        <button className="px-3 py-1 bg-white border border-[#93C5FD] text-[#1E40AF] rounded text-xs font-medium hover:bg-[#EFF6FF] transition-colors">
                          Edit Schedule
                        </button>
                      </div>
                    </div>
                  )}

                  {campaign.status === "draft" && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors">
                        Complete Setup
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors">
                        Schedule
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
