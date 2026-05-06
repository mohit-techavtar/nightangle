import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Plus, Zap, Bot, Users, MessageCircle, Clock, Settings as SettingsIcon,
  Play, Pause, Edit, Trash2, Copy, ChevronRight, ArrowRight
} from "lucide-react";

const automations = [
  {
    id: 1,
    name: "Welcome New Leads",
    trigger: "New contact added",
    status: "active",
    executions: 1234,
    successRate: 98.5,
    lastRun: "2m ago",
  },
  {
    id: 2,
    name: "Follow-up Sequence",
    trigger: "No response after 24h",
    status: "active",
    executions: 892,
    successRate: 87.3,
    lastRun: "15m ago",
  },
  {
    id: 3,
    name: "Lead Qualification",
    trigger: "Message contains 'pricing'",
    status: "active",
    executions: 567,
    successRate: 94.2,
    lastRun: "1h ago",
  },
  {
    id: 4,
    name: "Weekend Auto-Responder",
    trigger: "Message received on weekend",
    status: "paused",
    executions: 234,
    successRate: 100,
    lastRun: "2d ago",
  },
];

export function WhatsAppAutomation() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "WhatsApp" },
          { label: "Automation" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Automation Builder</h1>
              <p className="text-sm text-[#6B7280] mt-1">Create automated workflows and triggers</p>
            </div>
            <button
              onClick={() => navigate("/tenant/whatsapp/automation/create")}
              className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Automation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Zap size={20} className="text-[#1565C0]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">4</div>
              <div className="text-sm text-[#6B7280] mt-1">Active Automations</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <Play size={20} className="text-[#10B981]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">2,927</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Executions</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <Clock size={20} className="text-[#F59E0B]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">94.8%</div>
              <div className="text-sm text-[#6B7280] mt-1">Success Rate</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <Bot size={20} className="text-[#6366F1]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">342</div>
              <div className="text-sm text-[#6B7280] mt-1">Leads Auto-Created</div>
            </div>
          </div>

          {/* Automation List */}
          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="bg-white rounded-lg border border-[#E5E7EB] hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center">
                        <Zap size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#0F1B2D]">{automation.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            automation.status === "active"
                              ? "bg-[#D1FAE5] text-[#065F46]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}>
                            {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
                          <span className="flex items-center gap-1">
                            <Zap size={14} />
                            Trigger: {automation.trigger}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-[#F9FAFB] rounded-lg p-3">
                            <div className="text-xs text-[#6B7280] mb-1">Executions</div>
                            <div className="text-lg font-bold text-[#0F1B2D]">{automation.executions.toLocaleString()}</div>
                          </div>
                          <div className="bg-[#F9FAFB] rounded-lg p-3">
                            <div className="text-xs text-[#6B7280] mb-1">Success Rate</div>
                            <div className="text-lg font-bold text-[#10B981]">{automation.successRate}%</div>
                          </div>
                          <div className="bg-[#F9FAFB] rounded-lg p-3">
                            <div className="text-xs text-[#6B7280] mb-1">Last Run</div>
                            <div className="text-lg font-bold text-[#0F1B2D]">{automation.lastRun}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors" title="Edit">
                        <Edit size={18} className="text-[#6B7280]" />
                      </button>
                      <button className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors" title="Duplicate">
                        <Copy size={18} className="text-[#6B7280]" />
                      </button>
                      <button
                        className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                        title={automation.status === "active" ? "Pause" : "Activate"}
                      >
                        {automation.status === "active" ? (
                          <Pause size={18} className="text-[#6B7280]" />
                        ) : (
                          <Play size={18} className="text-[#10B981]" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Automation Templates */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <h3 className="text-lg font-semibold text-[#0F1B2D] mb-4">Popular Automation Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1565C0] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                    <Bot size={20} className="text-[#1565C0]" />
                  </div>
                  <ChevronRight size={18} className="text-[#9CA3AF]" />
                </div>
                <h4 className="font-semibold text-[#0F1B2D] mb-2">AI Lead Qualifier</h4>
                <p className="text-sm text-[#6B7280]">Automatically qualify leads based on conversation content and behavior</p>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1565C0] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                    <Users size={20} className="text-[#10B981]" />
                  </div>
                  <ChevronRight size={18} className="text-[#9CA3AF]" />
                </div>
                <h4 className="font-semibold text-[#0F1B2D] mb-2">Human Escalation</h4>
                <p className="text-sm text-[#6B7280]">Route complex queries to human agents with full context</p>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1565C0] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                    <MessageCircle size={20} className="text-[#F59E0B]" />
                  </div>
                  <ChevronRight size={18} className="text-[#9CA3AF]" />
                </div>
                <h4 className="font-semibold text-[#0F1B2D] mb-2">Multi-Day Nurture</h4>
                <p className="text-sm text-[#6B7280]">Send personalized follow-up messages over multiple days</p>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1565C0] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                    <Clock size={20} className="text-[#6366F1]" />
                  </div>
                  <ChevronRight size={18} className="text-[#9CA3AF]" />
                </div>
                <h4 className="font-semibold text-[#0F1B2D] mb-2">Business Hours Responder</h4>
                <p className="text-sm text-[#6B7280]">Auto-respond with business hours and expected response time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
