import React from "react";
import { Target, Users, DollarSign, Megaphone, Calendar, Briefcase, Package, MapPin, TrendingUp, Zap } from "lucide-react";

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

export const strategyTemplates: StrategyTemplate[] = [
  // Campaign Planning
  {
    id: "product-launch-campaign",
    title: "Product Launch Campaign",
    icon: Megaphone,
    description: "Complete go-to-market strategy for new product launch",
    layers: ["Objective Definition", "Target Audience", "Budget Planning", "Platform Selection"],
    category: "campaign",
    credits: 2,
    estimatedTime: "15-20 min",
  },
  {
    id: "brand-awareness-campaign",
    title: "Brand Awareness Campaign",
    icon: TrendingUp,
    description: "Build brand recognition and market presence",
    layers: ["Campaign Objectives", "Audience Segmentation", "Budget Allocation", "Channel Strategy"],
    category: "campaign",
    credits: 2,
    estimatedTime: "15-20 min",
  },
  {
    id: "seasonal-campaign",
    title: "Seasonal Campaign Planning",
    icon: Calendar,
    description: "Festival/seasonal marketing campaign strategy",
    layers: ["Event Selection", "Target Demographics", "Budget & ROI", "Multi-channel Approach"],
    category: "campaign",
    credits: 2,
    estimatedTime: "15-20 min",
  },

  // Operational Planning
  {
    id: "team-expansion",
    title: "Team Expansion Plan",
    icon: Users,
    description: "Strategic hiring and team building roadmap",
    layers: ["Role Definition", "Team Allocation", "Timeline & Milestones", "Resource Planning"],
    category: "operational",
    credits: 2,
    estimatedTime: "20-25 min",
  },
  {
    id: "project-execution",
    title: "Project Execution Plan",
    icon: Briefcase,
    description: "End-to-end project delivery framework",
    layers: ["Scope Definition", "Team Assignment", "Timeline Structuring", "Workflow Automation"],
    category: "operational",
    credits: 2,
    estimatedTime: "20-25 min",
  },

  // Production Planning
  {
    id: "manufacturing-plan",
    title: "Manufacturing Strategy",
    icon: Package,
    description: "Production planning from sourcing to delivery",
    layers: ["Vendor Sourcing", "Manufacturing Timeline", "Cost Planning", "Quality Control"],
    category: "production",
    credits: 2,
    estimatedTime: "25-30 min",
  },
  {
    id: "supplier-strategy",
    title: "Supplier & Procurement",
    icon: Zap,
    description: "Optimize supply chain and vendor relationships",
    layers: ["Vendor Identification", "Contract Negotiation", "Cost Optimization", "Risk Management"],
    category: "production",
    credits: 2,
    estimatedTime: "20-25 min",
  },

  // Reach Strategy
  {
    id: "distribution-plan",
    title: "Distribution Strategy",
    icon: MapPin,
    description: "Geographic expansion and channel optimization",
    layers: ["Channel Mapping", "Distribution Planning", "Geographic Targeting", "Partner Network"],
    category: "reach",
    credits: 2,
    estimatedTime: "20-25 min",
  },
  {
    id: "market-expansion",
    title: "Market Expansion Plan",
    icon: Target,
    description: "Enter new markets and geographic regions",
    layers: ["Market Analysis", "Entry Strategy", "Local Partnerships", "Scaling Roadmap"],
    category: "reach",
    credits: 2,
    estimatedTime: "25-30 min",
  },
];

interface StrategyTemplatesProps {
  onSelectTemplate: (template: StrategyTemplate) => void;
}

export function StrategyTemplates({ onSelectTemplate }: StrategyTemplatesProps) {
  const categories = [
    { key: "campaign", label: "Campaign Planning", color: "bg-[#E3F2FD] text-[#1565C0]", icon: Megaphone },
    { key: "operational", label: "Operational Planning", color: "bg-[#F3E5F5] text-[#6A1B9A]", icon: Briefcase },
    { key: "production", label: "Production Planning", color: "bg-[#E8F5E9] text-[#2E7D32]", icon: Package },
    { key: "reach", label: "Reach Strategy", color: "bg-[#FFF8E1] text-[#F57F17]", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#212121] mb-2">Strategy Planning Templates</h3>
        <p className="text-sm text-[#616161]">Select a template to start building your strategic plan with AI guidance.</p>
      </div>

      {categories.map(category => {
        const templates = strategyTemplates.filter(t => t.category === category.key);
        if (templates.length === 0) return null;

        const CategoryIcon = category.icon;

        return (
          <div key={category.key}>
            <div className="flex items-center gap-2 mb-3">
              <CategoryIcon size={16} className="text-[#616161]" />
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                {category.label}
              </span>
              <span className="text-xs text-[#9E9E9E]">{templates.length} templates</span>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              {templates.map(template => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="bg-white rounded-lg border border-[#E0E0E0] p-4 text-left hover:shadow-lg hover:border-[#1565C0] transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] group-hover:bg-[#E3F2FD] flex items-center justify-center transition-colors shrink-0">
                        <Icon className="text-[#616161] group-hover:text-[#1565C0]" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#212121] mb-1">{template.title}</h4>
                        <p className="text-xs text-[#616161] line-clamp-2">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-[#616161] mb-1 block">Planning Layers:</span>
                      <div className="flex flex-wrap gap-1">
                        {template.layers.slice(0, 2).map((layer, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px]">
                            {layer}
                          </span>
                        ))}
                        {template.layers.length > 2 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px]">
                            +{template.layers.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                      <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                        <span>{template.credits} Credits</span>
                        <span>•</span>
                        <span>{template.estimatedTime}</span>
                      </div>
                      <span className="text-xs text-[#1565C0] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Plan →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
