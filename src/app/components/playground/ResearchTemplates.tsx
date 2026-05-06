import React from "react";
import { Target, TrendingUp, Users, Package, DollarSign, MapPin, Award, Zap } from "lucide-react";

interface ResearchTemplate {
  id: string;
  title: string;
  icon: any;
  description: string;
  prompt: string;
  category: "market" | "competitor" | "product" | "strategy";
  credits: number;
}

export const researchTemplates: ResearchTemplate[] = [
  {
    id: "market-overview",
    title: "Market Overview & Size",
    icon: TrendingUp,
    description: "Get comprehensive market size, growth trends, and opportunities",
    prompt: "Provide a comprehensive market overview for [PRODUCT/INDUSTRY] including market size, growth rate, key trends, and opportunities in Nepal.",
    category: "market",
    credits: 1,
  },
  {
    id: "competitor-analysis",
    title: "Competitor Analysis",
    icon: Target,
    description: "Identify and analyze key competitors in your market",
    prompt: "Conduct a detailed competitor analysis for [PRODUCT/INDUSTRY] including top players, market share, pricing strategies, strengths/weaknesses, and positioning.",
    category: "competitor",
    credits: 1,
  },
  {
    id: "product-research",
    title: "Product Research",
    icon: Package,
    description: "Research product variants, specifications, and features",
    prompt: "Research [PRODUCT NAME] including variants, technical specifications, certifications, packaging formats, warranty models, and key features available in Nepal market.",
    category: "product",
    credits: 1,
  },
  {
    id: "pricing-benchmark",
    title: "Pricing Benchmark",
    icon: DollarSign,
    description: "Compare pricing across channels and competitors",
    prompt: "Provide pricing benchmarking for [PRODUCT] across online marketplaces (Daraz, SastoDeal), offline retail, and import costs. Include price ranges, discounts, and margin analysis.",
    category: "market",
    credits: 1,
  },
  {
    id: "swot-analysis",
    title: "SWOT Analysis",
    icon: Award,
    description: "Analyze Strengths, Weaknesses, Opportunities, Threats",
    prompt: "Conduct a SWOT analysis for [COMPANY/PRODUCT] in the Nepal market covering internal strengths/weaknesses and external opportunities/threats.",
    category: "strategy",
    credits: 1,
  },
  {
    id: "supplier-research",
    title: "Supplier & Manufacturer Research",
    icon: MapPin,
    description: "Identify suppliers, manufacturers, and distributors",
    prompt: "Research suppliers and manufacturers for [PRODUCT] including local manufacturers in Nepal, import options from India/China, regional distributors, and import/export vendors.",
    category: "market",
    credits: 1,
  },
  {
    id: "customer-segments",
    title: "Customer Segmentation",
    icon: Users,
    description: "Identify target customer segments and personas",
    prompt: "Identify and analyze customer segments for [PRODUCT/INDUSTRY] including demographics, psychographics, buying behavior, pain points, and preferences in Nepal market.",
    category: "strategy",
    credits: 1,
  },
  {
    id: "quick-insights",
    title: "Quick Market Insights",
    icon: Zap,
    description: "Fast snapshot of market opportunity",
    prompt: "Provide quick market insights for [PRODUCT/INDUSTRY] including top 3 competitors, average pricing, market demand indicators, and entry barriers in Nepal.",
    category: "market",
    credits: 1,
  },
];

interface ResearchTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

export function ResearchTemplates({ onSelectTemplate }: ResearchTemplatesProps) {
  const categories = [
    { key: "market", label: "Market Research", color: "bg-[#E3F2FD] text-[#1565C0]" },
    { key: "competitor", label: "Competitor Intel", color: "bg-[#F3E5F5] text-[#6A1B9A]" },
    { key: "product", label: "Product Analysis", color: "bg-[#E8F5E9] text-[#2E7D32]" },
    { key: "strategy", label: "Strategic Insights", color: "bg-[#FFF8E1] text-[#F57F17]" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#212121] mb-2">Research Templates</h3>
        <p className="text-sm text-[#616161]">Click any template to start your research. Customize the prompt by replacing [PLACEHOLDERS].</p>
      </div>

      {categories.map(category => {
        const templates = researchTemplates.filter(t => t.category === category.key);
        if (templates.length === 0) return null;

        return (
          <div key={category.key}>
            <div className="flex items-center gap-2 mb-3">
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
                    onClick={() => onSelectTemplate(template.prompt)}
                    className="bg-white rounded-lg border border-[#E0E0E0] p-4 text-left hover:shadow-lg hover:border-[#1565C0] transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] group-hover:bg-[#E3F2FD] flex items-center justify-center transition-colors">
                        <Icon className="text-[#616161] group-hover:text-[#1565C0]" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#212121] mb-1">{template.title}</h4>
                        <p className="text-xs text-[#616161]">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#EEEEEE]">
                      <span className="text-xs text-[#9E9E9E]">{template.credits} Credit</span>
                      <span className="text-xs text-[#1565C0] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Use Template →
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
