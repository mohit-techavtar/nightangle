import React from "react";
import { Target, Users, DollarSign, Calendar, Briefcase, Package, MapPin, CheckCircle, TrendingUp, Clock, Download, Share2, Edit } from "lucide-react";

interface StrategyPlan {
  id: string;
  title: string;
  type: "campaign" | "operational" | "production" | "reach";
  createdAt: Date;
  sections: StrategySection[];
}

interface StrategySection {
  id: string;
  title: string;
  icon: any;
  content: SectionContent[];
}

interface SectionContent {
  label: string;
  value: string | string[];
  type: "text" | "list" | "timeline" | "budget" | "team";
}

interface StrategyOutputProps {
  plan: StrategyPlan;
  onEdit?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export function StrategyOutput({ plan, onEdit, onExport, onShare }: StrategyOutputProps) {
  const renderContent = (content: SectionContent) => {
    switch (content.type) {
      case "text":
        return (
          <div key={content.label} className="mb-4">
            <label className="text-xs font-semibold text-[#616161] uppercase mb-1 block">{content.label}</label>
            <p className="text-sm text-[#212121]">{content.value as string}</p>
          </div>
        );

      case "list":
        return (
          <div key={content.label} className="mb-4">
            <label className="text-xs font-semibold text-[#616161] uppercase mb-2 block">{content.label}</label>
            <ul className="space-y-2">
              {(Array.isArray(content.value) ? content.value : [content.value]).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#212121]">
                  <CheckCircle size={16} className="text-[#4CAF50] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "timeline":
        return (
          <div key={content.label} className="mb-4">
            <label className="text-xs font-semibold text-[#616161] uppercase mb-2 block">{content.label}</label>
            <div className="space-y-3">
              {(Array.isArray(content.value) ? content.value : [content.value]).map((item, i) => {
                const [phase, duration] = (item as string).split("|");
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#1565C0]">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#212121]">{phase}</div>
                      <div className="text-xs text-[#616161]">{duration}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "budget":
        return (
          <div key={content.label} className="mb-4">
            <label className="text-xs font-semibold text-[#616161] uppercase mb-2 block">{content.label}</label>
            <div className="bg-[#F5F5F5] rounded-lg p-4">
              {(Array.isArray(content.value) ? content.value : [content.value]).map((item, i) => {
                const [category, amount, percentage] = (item as string).split("|");
                return (
                  <div key={i} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#212121]">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1565C0]">{amount}</span>
                        <span className="text-xs text-[#616161]">({percentage})</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-[#1565C0] rounded-full"
                        style={{ width: percentage }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "team":
        return (
          <div key={content.label} className="mb-4">
            <label className="text-xs font-semibold text-[#616161] uppercase mb-2 block">{content.label}</label>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              {(Array.isArray(content.value) ? content.value : [content.value]).map((item, i) => {
                const [role, name, responsibility] = (item as string).split("|");
                return (
                  <div key={i} className="bg-[#F5F5F5] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                        <Users size={14} className="text-[#1565C0]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#212121]">{role}</div>
                        <div className="text-xs text-[#616161]">{name}</div>
                      </div>
                    </div>
                    <p className="text-xs text-[#616161]">{responsibility}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
        <div className="flex items-start justify-between mb-3 max-md:flex-col max-md:gap-3">
          <div>
            <h2 className="text-xl max-md:text-lg font-bold text-white mb-2">{plan.title}</h2>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Created: {plan.createdAt.toLocaleDateString()}</span>
              </div>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                {plan.type.toUpperCase()} PLAN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 max-md:w-full">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 h-9 rounded-md bg-white/20 hover:bg-white/30 text-white text-sm font-medium flex items-center gap-2 max-md:flex-1"
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="px-4 h-9 rounded-md bg-white/20 hover:bg-white/30 text-white text-sm font-medium flex items-center gap-2 max-md:flex-1"
              >
                <Share2 size={16} />
                Share
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="px-4 h-9 rounded-md bg-white hover:bg-white/90 text-[#1565C0] text-sm font-semibold flex items-center gap-2 max-md:flex-1"
              >
                <Download size={16} />
                Export PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 max-md:p-4 space-y-6">
        {plan.sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              <div className="px-4 py-3 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center gap-2">
                <Icon className="text-[#1565C0]" size={18} />
                <h3 className="font-semibold text-[#212121]">{section.title}</h3>
              </div>
              <div className="p-4">
                {section.content.map(content => renderContent(content))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Steps / Recommendations */}
      <div className="px-6 py-4 bg-[#E3F2FD] border-t border-[#90CAF9]">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-[#1565C0]" size={18} />
          <h4 className="text-sm font-semibold text-[#1565C0]">Recommended Next Steps</h4>
        </div>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-[#212121]">
            <CheckCircle size={16} className="text-[#1565C0] mt-0.5 shrink-0" />
            <span>Share this plan with your team for feedback and alignment</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-[#212121]">
            <CheckCircle size={16} className="text-[#1565C0] mt-0.5 shrink-0" />
            <span>Set up tracking metrics and KPIs in your dashboard</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-[#212121]">
            <CheckCircle size={16} className="text-[#1565C0] mt-0.5 shrink-0" />
            <span>Schedule weekly review meetings to track progress</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Example usage component showing a sample campaign plan
export function SampleCampaignPlan() {
  const samplePlan: StrategyPlan = {
    id: "plan-001",
    title: "Product Launch Campaign - Smart Electric Kettle",
    type: "campaign",
    createdAt: new Date("2026-03-26"),
    sections: [
      {
        id: "objectives",
        title: "Campaign Objectives",
        icon: Target,
        content: [
          {
            label: "Primary Objective",
            value: "Achieve 500 pre-orders within 30 days of launch and generate 40% brand awareness in target market",
            type: "text",
          },
          {
            label: "Key Goals",
            value: [
              "Generate 10,000+ website visits",
              "Achieve 2,500+ social media engagements",
              "Secure 500 pre-orders (NPR 1,750,000 revenue)",
              "Build email list of 3,000+ subscribers",
            ],
            type: "list",
          },
        ],
      },
      {
        id: "audience",
        title: "Target Audience",
        icon: Users,
        content: [
          {
            label: "Demographics",
            value: "Urban professionals aged 25-40, household income NPR 60K-180K/month, primarily Kathmandu Valley residents",
            type: "text",
          },
          {
            label: "Psychographics",
            value: [
              "Tech-savvy early adopters",
              "Value convenience and quality",
              "Active on social media",
              "Interested in smart home products",
            ],
            type: "list",
          },
        ],
      },
      {
        id: "budget",
        title: "Budget Allocation",
        icon: DollarSign,
        content: [
          {
            label: "Total Budget: NPR 250,000",
            value: [
              "Facebook & Instagram Ads|NPR 100,000|40%",
              "Google Ads (Search & Display)|NPR 60,000|24%",
              "Content Creation (Video/Photo)|NPR 45,000|18%",
              "Influencer Partnerships|NPR 30,000|12%",
              "Analytics & Tools|NPR 15,000|6%",
            ],
            type: "budget",
          },
        ],
      },
      {
        id: "platforms",
        title: "Platform Strategy",
        icon: MapPin,
        content: [
          {
            label: "Primary Channels",
            value: [
              "Facebook - Brand awareness & community building (Daily posts, Live demos)",
              "Instagram - Visual storytelling & influencer content (Stories, Reels, IGTV)",
              "Google Ads - Search intent capture (Keywords: smart kettle, electric kettle Nepal)",
              "YouTube - Product demos & testimonials (3-5 minute videos)",
            ],
            type: "list",
          },
        ],
      },
      {
        id: "timeline",
        title: "Campaign Timeline",
        icon: Calendar,
        content: [
          {
            label: "4-Week Execution Plan",
            value: [
              "Pre-Launch Phase (Week 1)|Teaser campaign, influencer seeding, email warm-up",
              "Launch Phase (Week 2)|Grand launch, live demos, flash sale announcement",
              "Growth Phase (Week 3)|User testimonials, comparison content, retargeting ads",
              "Closing Phase (Week 4)|Last chance offers, countdown campaign, early-bird bonus",
            ],
            type: "timeline",
          },
        ],
      },
      {
        id: "team",
        title: "Team Allocation",
        icon: Briefcase,
        content: [
          {
            label: "Campaign Team",
            value: [
              "Campaign Manager|Rajesh Sharma|Overall strategy, budget tracking, performance monitoring",
              "Content Creator|Anita Gurung|Video production, graphics, social media content",
              "Digital Marketer|Bikash Thapa|Ad management, SEO, analytics reporting",
              "Community Manager|Sita Rai|Social engagement, customer queries, reviews",
            ],
            type: "team",
          },
        ],
      },
    ],
  };

  return (
    <StrategyOutput
      plan={samplePlan}
      onEdit={() => console.log("Edit plan")}
      onExport={() => console.log("Export plan")}
      onShare={() => console.log("Share plan")}
    />
  );
}
