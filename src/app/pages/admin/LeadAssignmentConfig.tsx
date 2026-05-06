import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { RoundRobinTab } from "../../components/assignment/RoundRobinTab";
import { RuleBasedTab } from "../../components/assignment/RuleBasedTab";
import { AIAssistedTab } from "../../components/assignment/AIAssistedTab";
import { SLASettingsTab } from "../../components/assignment/SLASettingsTab";
import { RotateCw, ListFilter, Sparkles, Clock, Save } from "lucide-react";

type TabType = "round-robin" | "rule-based" | "ai-assisted" | "sla-settings";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    id: "round-robin",
    label: "Round Robin",
    icon: <RotateCw size={20} />,
    description: "Distribute leads evenly",
  },
  {
    id: "rule-based",
    label: "Rule-Based",
    icon: <ListFilter size={20} />,
    description: "Custom assignment rules",
  },
  {
    id: "ai-assisted",
    label: "AI-Assisted",
    icon: <Sparkles size={20} />,
    description: "ML-powered matching",
  },
  {
    id: "sla-settings",
    label: "SLA Settings",
    icon: <Clock size={20} />,
    description: "Service level agreements",
  },
];

export function LeadAssignmentConfig() {
  const [activeTab, setActiveTab] = useState<TabType>("round-robin");

  const renderTabContent = () => {
    switch (activeTab) {
      case "round-robin":
        return <RoundRobinTab />;
      case "rule-based":
        return <RuleBasedTab />;
      case "ai-assisted":
        return <AIAssistedTab />;
      case "sla-settings":
        return <SLASettingsTab />;
      default:
        return <RoundRobinTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        breadcrumbs={[
          { label: "Admin" },
          { label: "Lead Management" },
          { label: "Assignment Configuration" },
        ]}
        companyName="OmniCRM Platform"
        mode="admin"
        userName="Admin User"
        userEmail="admin@omnicrm.com"
        userInitials="AU"
      />

      <div className="flex-1 flex overflow-hidden bg-[#F5F5F5]">
        {/* Left Sidebar - Vertical Tabs */}
        <div className="w-72 bg-white border-r border-[#E0E0E0] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#E0E0E0]">
            <h1 className="text-xl font-bold text-[#212121] mb-1">
              Lead Assignment
            </h1>
            <p className="text-xs text-[#9E9E9E]">
              Configure how leads are distributed
            </p>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white shadow-md"
                      : "text-[#616161] hover:bg-[#F5F5F5]"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">{tab.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold mb-0.5 ${
                        activeTab === tab.id ? "text-white" : "text-[#212121]"
                      }`}
                    >
                      {tab.label}
                    </p>
                    <p
                      className={`text-xs ${
                        activeTab === tab.id ? "text-white/80" : "text-[#9E9E9E]"
                      }`}
                    >
                      {tab.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#E0E0E0] space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold hover:shadow-lg transition-shadow">
              <Save size={18} />
              Save All Changes
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#E0E0E0] text-[#616161] text-sm font-medium hover:bg-[#F5F5F5] transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
