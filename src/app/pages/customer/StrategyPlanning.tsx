import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { StrategyTemplates, strategyTemplates } from "../../components/strategy/StrategyTemplates";
import { StrategyBuilder } from "../../components/strategy/StrategyBuilder";
import { SampleCampaignPlan } from "../../components/strategy/StrategyOutput";
import { Sparkles, FolderOpen, Clock, Plus } from "lucide-react";

interface StrategyTemplate {
  id: string;
  title: string;
  icon: any;
  description: string;
  layers: string[];
  category: "campaign" | "operational" | "production" | "reach";
  credits: number;
  estimatedTime: string;
}

// Sample saved plans
const savedPlans = [
  {
    id: "1",
    title: "Product Launch Campaign - Smart Electric Kettle",
    type: "campaign" as const,
    createdAt: new Date("2026-03-26"),
    status: "completed",
  },
  {
    id: "2",
    title: "Q2 Team Expansion Strategy",
    type: "operational" as const,
    createdAt: new Date("2026-03-20"),
    status: "in-progress",
  },
  {
    id: "3",
    title: "Distribution Network Expansion - Western Nepal",
    type: "reach" as const,
    createdAt: new Date("2026-03-15"),
    status: "completed",
  },
];

// Define builder steps for Product Launch Campaign
const campaignBuilderSteps = [
  {
    id: "objectives",
    title: "Objectives",
    description: "Define your campaign goals and success metrics",
    fields: [
      {
        id: "campaign-objective",
        label: "Campaign Objective",
        type: "textarea" as const,
        placeholder: "What do you want to achieve with this campaign?",
        required: true,
        aiSuggestion: true,
      },
      {
        id: "success-metrics",
        label: "Success Metrics",
        type: "multiselect" as const,
        options: ["Lead Generation", "Brand Awareness", "Sales Conversion", "Engagement", "Traffic"],
        required: true,
      },
      {
        id: "target-revenue",
        label: "Target Revenue (NPR)",
        type: "number" as const,
        placeholder: "e.g., 500000",
      },
    ],
  },
  {
    id: "audience",
    title: "Target Audience",
    description: "Define who you're targeting with this campaign",
    fields: [
      {
        id: "target-audience",
        label: "Audience Description",
        type: "textarea" as const,
        placeholder: "Describe your ideal customer demographic and psychographic profile",
        required: true,
        aiSuggestion: true,
      },
      {
        id: "audience-location",
        label: "Geographic Focus",
        type: "multiselect" as const,
        options: ["Kathmandu Valley", "Pokhara", "Biratnagar", "Butwal", "Nepalgunj", "Nationwide"],
        required: true,
      },
      {
        id: "age-range",
        label: "Age Range",
        type: "select" as const,
        options: ["18-24", "25-34", "35-44", "45-54", "55+"],
        required: true,
      },
    ],
  },
  {
    id: "budget",
    title: "Budget Planning",
    description: "Allocate your campaign budget across channels",
    fields: [
      {
        id: "total-budget",
        label: "Total Campaign Budget (NPR)",
        type: "number" as const,
        placeholder: "e.g., 250000",
        required: true,
      },
      {
        id: "budget-breakdown",
        label: "Budget Allocation",
        type: "textarea" as const,
        placeholder: "How will you distribute the budget? e.g., Social Media: 40%, Google Ads: 25%...",
        required: true,
        aiSuggestion: true,
      },
      {
        id: "duration",
        label: "Campaign Duration",
        type: "select" as const,
        options: ["1 Week", "2 Weeks", "1 Month", "2 Months", "3 Months", "Ongoing"],
        required: true,
      },
    ],
  },
  {
    id: "platforms",
    title: "Platform Selection",
    description: "Choose where you'll run your campaign",
    fields: [
      {
        id: "platforms",
        label: "Marketing Platforms",
        type: "multiselect" as const,
        options: ["Facebook", "Instagram", "LinkedIn", "Google Ads", "YouTube", "TikTok", "Email"],
        required: true,
      },
      {
        id: "content-types",
        label: "Content Types",
        type: "multiselect" as const,
        options: ["Video", "Images", "Blog Posts", "Infographics", "Live Streams", "Stories"],
        required: true,
      },
    ],
  },
];

export function StrategyPlanning() {
  const [view, setView] = useState<"templates" | "builder" | "plan">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);

  const handleSelectTemplate = (template: StrategyTemplate) => {
    setSelectedTemplate(template);
    setView("builder");
  };

  const handleBuilderComplete = (data: any) => {
    console.log("Strategy plan data:", data);
    setView("plan");
  };

  const handleBuilderCancel = () => {
    setView("templates");
    setSelectedTemplate(null);
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Business Playground" }, { label: "Strategy Planning" }]} 
        companyName="Everest Digital Solutions" 
        mode="customer" 
        userName="Rajesh Sharma" 
        userEmail="rajesh@everestdigital.com" 
        userInitials="RS" 
      />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 max-md:mb-4 max-md:flex-col max-md:gap-3">
            <div>
              <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Strategy Planning</h1>
              <p className="text-sm text-[#616161]">AI-guided multi-layer planning for business growth and execution</p>
            </div>
            <div className="flex items-center gap-2">
              {view !== "templates" && (
                <button
                  onClick={() => setView("templates")}
                  className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Templates
                </button>
              )}
              {view === "templates" && savedPlans.length > 0 && (
                <button
                  onClick={() => setView("plan")}
                  className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
                >
                  <FolderOpen size={16} />
                  My Plans
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {view === "templates" && (
            <>
              {/* Saved Plans Preview */}
              {savedPlans.length > 0 && (
                <div className="mb-6 max-md:mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-[#212121]">Recent Plans</h3>
                    <button
                      onClick={() => setView("plan")}
                      className="text-sm text-[#1565C0] hover:underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3">
                    {savedPlans.slice(0, 3).map(plan => (
                      <button
                        key={plan.id}
                        onClick={() => setView("plan")}
                        className="bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3 text-left hover:shadow-lg hover:border-[#1565C0] transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            plan.status === "completed" 
                              ? "bg-[#E8F5E9] text-[#2E7D32]" 
                              : "bg-[#FFF8E1] text-[#F57F17]"
                          }`}>
                            {plan.status === "completed" ? "Completed" : "In Progress"}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#212121] mb-2 line-clamp-2">{plan.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#616161]">
                          <Clock size={12} />
                          <span>{plan.createdAt.toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Templates */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
                <StrategyTemplates onSelectTemplate={handleSelectTemplate} />
              </div>
            </>
          )}

          {view === "builder" && selectedTemplate && (
            <StrategyBuilder
              templateId={selectedTemplate.id}
              templateTitle={selectedTemplate.title}
              steps={campaignBuilderSteps}
              onComplete={handleBuilderComplete}
              onCancel={handleBuilderCancel}
            />
          )}

          {view === "plan" && (
            <SampleCampaignPlan />
          )}
        </div>
      </div>
    </>
  );
}
