import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { ResearchTemplates } from "../../components/playground/ResearchTemplates";
import { CompetitorTable, PricingComparison, ProductVariantsTable, SWOTMatrix, MarketInsights } from "../../components/playground/ResearchResults";
import { Search, Download, Share2, Bookmark, Clock, Sparkles } from "lucide-react";

// Mock research data for Electric Kettle example
const electricKettleResearch = {
  competitor: [
    {
      name: "Philips",
      marketShare: 35,
      priceRange: "NPR 1,800 - 4,500",
      strengths: ["Brand reputation", "Wide distribution", "Quality assurance"],
      weaknesses: ["Premium pricing", "Limited SKUs"],
    },
    {
      name: "Prestige",
      marketShare: 28,
      priceRange: "NPR 1,200 - 2,800",
      strengths: ["Competitive pricing", "Local presence", "After-sales service"],
      weaknesses: ["Brand perception", "Build quality concerns"],
    },
    {
      name: "Bajaj",
      marketShare: 22,
      priceRange: "NPR 1,000 - 2,500",
      strengths: ["Affordability", "Trusted brand", "Energy efficient"],
      weaknesses: ["Basic features", "Design aesthetics"],
    },
    {
      name: "Baltra",
      marketShare: 15,
      priceRange: "NPR 900 - 2,200",
      strengths: ["Budget-friendly", "Local warranty", "Easy availability"],
      weaknesses: ["Limited features", "Durability issues"],
    },
  ],
  pricing: [
    { channel: "Daraz.com.np", priceRange: "NPR 1,200 - 3,800", averagePrice: 2200, discount: "10-25% off", availability: "High" },
    { channel: "SastoDeal", priceRange: "NPR 1,400 - 3,500", averagePrice: 2300, discount: "5-15% off", availability: "Medium" },
    { channel: "Physical Retail (New Road)", priceRange: "NPR 1,500 - 4,200", averagePrice: 2600, discount: "Negotiable", availability: "High" },
    { channel: "Supermarkets (Bhatbhateni)", priceRange: "NPR 1,800 - 4,500", averagePrice: 2800, discount: "Fixed price", availability: "High" },
    { channel: "Import (Direct from India)", priceRange: "NPR 800 - 2,500", averagePrice: 1500, discount: "Bulk only", availability: "Low" },
  ],
  variants: [
    { name: "Basic 1.5L Plastic Body", specs: "1500W, Auto shut-off, Single wall", price: "NPR 1,200 - 1,800", availability: "High stock" },
    { name: "Standard 1.7L Stainless Steel", specs: "1850W, Auto shut-off, Double wall", price: "NPR 1,800 - 2,500", availability: "High stock" },
    { name: "Premium 1.8L Glass Body", specs: "2000W, Temperature control, LED indicator", price: "NPR 2,800 - 3,800", availability: "Medium stock" },
    { name: "Smart 2L Multi-function", specs: "2200W, Keep warm, Multiple temp settings", price: "NPR 3,500 - 4,500", availability: "Low stock" },
  ],
  swot: {
    strengths: [
      "High demand in urban and semi-urban areas",
      "Growing middle-class purchasing power",
      "Awareness about energy-efficient appliances",
      "Established distribution channels across Nepal",
    ],
    weaknesses: [
      "Heavy reliance on imports (95% imported)",
      "Price sensitivity in tier 2/3 cities",
      "Limited local manufacturing capabilities",
      "After-sales service challenges in remote areas",
    ],
    opportunities: [
      "Expanding e-commerce penetration (45% YoY growth)",
      "Rising demand for premium/smart home appliances",
      "Untapped rural market potential",
      "Government push for 'Make in Nepal' initiative",
    ],
    threats: [
      "Increasing import duties and taxes",
      "Competition from cheap Chinese imports",
      "Currency fluctuations affecting pricing",
      "Economic uncertainty impacting consumer spending",
    ],
  },
  insights: [
    { title: "Market Size", value: "NPR 450M", trend: "+18% YoY" },
    { title: "Avg. Selling Price", value: "NPR 2,350", trend: "+5% YoY" },
    { title: "Units Sold (Annual)", value: "185K units", trend: "+22% YoY" },
  ],
};

export function ProductResearch() {
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedResearch, setSelectedResearch] = useState<string | null>("electric-kettle");

  const handleSelectTemplate = (prompt: string) => {
    console.log("Selected template:", prompt);
    // In a real app, this would trigger the research query
    setShowTemplates(false);
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Business Playground" }, { label: "Product Research" }]} 
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
              <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Product & Market Research</h1>
              <p className="text-sm text-[#616161]">AI-powered research engine for market intelligence and competitive analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
              >
                <Sparkles size={16} />
                Templates
              </button>
              <button className="px-4 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2">
                <Search size={16} />
                New Research
              </button>
            </div>
          </div>

          {showTemplates ? (
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
              <ResearchTemplates onSelectTemplate={handleSelectTemplate} />
            </div>
          ) : (
            <>
              {/* Research Report Header */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4 mb-6 max-md:mb-4">
                <div className="flex items-start justify-between mb-4 max-md:flex-col max-md:gap-3">
                  <div>
                    <h2 className="text-xl max-md:text-lg font-bold text-[#212121] mb-2">
                      Electric Kettle Market Research - Nepal
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-[#616161]">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Generated: March 26, 2026</span>
                      </div>
                      <span>•</span>
                      <span>1 Credit used</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 max-md:w-full">
                    <button className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1">
                      <Bookmark size={16} />
                      Save
                    </button>
                    <button className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1">
                      <Share2 size={16} />
                      Share
                    </button>
                    <button className="px-4 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2 max-md:flex-1">
                      <Download size={16} />
                      Export PDF
                    </button>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="p-4 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
                  <h3 className="text-sm font-semibold text-[#1565C0] mb-2">Executive Summary</h3>
                  <p className="text-sm text-[#212121] leading-relaxed">
                    The electric kettle market in Nepal is experiencing robust growth at 18% YoY, driven by urbanization and rising middle-class income. 
                    The market is dominated by 4 major players (Philips, Prestige, Bajaj, Baltra) controlling 95% market share. 
                    Average selling price is NPR 2,350 with 185K annual units sold. E-commerce channels (Daraz, SastoDeal) are gaining traction 
                    with 45% YoY growth. Key opportunity lies in premium segment and rural market penetration.
                  </p>
                </div>
              </div>

              {/* Market Insights */}
              <div className="mb-6 max-md:mb-4">
                <h3 className="text-lg font-semibold text-[#212121] mb-3">Market Insights</h3>
                <MarketInsights insights={electricKettleResearch.insights} />
              </div>

              {/* Competitor Analysis */}
              <div className="mb-6 max-md:mb-4">
                <CompetitorTable competitors={electricKettleResearch.competitor} />
              </div>

              {/* Pricing Benchmark */}
              <div className="mb-6 max-md:mb-4">
                <PricingComparison pricing={electricKettleResearch.pricing} />
              </div>

              {/* Product Variants */}
              <div className="mb-6 max-md:mb-4">
                <ProductVariantsTable variants={electricKettleResearch.variants} />
              </div>

              {/* SWOT Analysis */}
              <div className="mb-6 max-md:mb-4">
                <h3 className="text-lg font-semibold text-[#212121] mb-3">SWOT Analysis</h3>
                <SWOTMatrix swot={electricKettleResearch.swot} />
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
                <h3 className="text-lg font-semibold text-[#212121] mb-4">Strategic Recommendations</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#1565C0]">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#212121] mb-1">Focus on E-commerce Channels</h4>
                      <p className="text-sm text-[#616161]">
                        Leverage Daraz and SastoDeal platforms with competitive pricing (10-20% discount) and targeted digital marketing. 
                        Expected ROI: 3-4x within 6 months.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#1565C0]">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#212121] mb-1">Target Premium Segment</h4>
                      <p className="text-sm text-[#616161]">
                        Introduce smart/glass kettles (NPR 3,500-4,500) targeting tech-savvy urban consumers. 
                        Market gap identified with only 15% penetration in this segment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#1565C0]">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#212121] mb-1">Strengthen After-Sales Network</h4>
                      <p className="text-sm text-[#616161]">
                        Establish service centers in tier 2/3 cities (Pokhara, Biratnagar, Butwal) to differentiate from competitors 
                        and reduce customer acquisition cost by 25%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sources */}
              <div className="mt-6 max-md:mt-4 p-4 max-md:p-3 rounded-lg bg-[#F5F5F5] border border-[#E0E0E0]">
                <h4 className="text-sm font-semibold text-[#212121] mb-2">Data Sources & Methodology</h4>
                <p className="text-xs text-[#616161] mb-2">
                  This research report was generated using AI-powered analysis combined with real-time internet data aggregation from the following sources:
                </p>
                <ul className="text-xs text-[#616161] space-y-1">
                  <li>• Online marketplaces: Daraz.com.np, SastoDeal, HamroBazaar</li>
                  <li>• Retailer data: Bhatbhateni Supermarket, Big Mart, Sales Berry</li>
                  <li>• Industry reports: Nepal Electronics Association, Trade Ministry data</li>
                  <li>• Social media sentiment: Facebook, Instagram consumer reviews</li>
                  <li>• Competitor websites and public disclosures</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
