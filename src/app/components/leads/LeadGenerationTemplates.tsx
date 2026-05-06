import React from "react";
import { Building2, Users, Mail, Phone, MapPin, Package, ShoppingBag, Globe, Target } from "lucide-react";

interface LeadTemplate {
  id: string;
  title: string;
  icon: any;
  description: string;
  dataPoints: string[];
  category: "companies" | "people" | "distributors" | "retailers";
  credits: number;
  estimatedLeads: string;
}

export const leadTemplates: LeadTemplate[] = [
  {
    id: "company-list",
    title: "Company Database",
    icon: Building2,
    description: "Extract comprehensive company information and business details",
    dataPoints: ["Company Name", "Industry", "Website", "Phone", "Address", "Employee Count", "Revenue"],
    category: "companies",
    credits: 3,
    estimatedLeads: "50-500 leads",
  },
  {
    id: "decision-makers",
    title: "Decision Makers & Executives",
    icon: Users,
    description: "Find key decision makers, executives, and stakeholders",
    dataPoints: ["Name", "Job Title", "Email", "Phone", "LinkedIn", "Company", "Department"],
    category: "people",
    credits: 4,
    estimatedLeads: "25-200 leads",
  },
  {
    id: "email-phone-database",
    title: "Email & Phone Database",
    icon: Mail,
    description: "Build contact database with verified emails and phone numbers",
    dataPoints: ["Email", "Phone", "Name", "Company", "Title", "Verification Status"],
    category: "people",
    credits: 3,
    estimatedLeads: "100-1000 leads",
  },
  {
    id: "product-distributors",
    title: "Product Distributors",
    icon: Package,
    description: "Identify distributors and wholesalers for your product category",
    dataPoints: ["Distributor Name", "Products", "Location", "Contact", "Coverage Area", "Website"],
    category: "distributors",
    credits: 3,
    estimatedLeads: "30-300 leads",
  },
  {
    id: "retailer-database",
    title: "Retailer Database",
    icon: ShoppingBag,
    description: "Compile list of retailers, shops, and stores in target market",
    dataPoints: ["Store Name", "Category", "Location", "Owner", "Phone", "Email", "Operating Hours"],
    category: "retailers",
    credits: 3,
    estimatedLeads: "50-500 leads",
  },
  {
    id: "geographic-businesses",
    title: "Geographic Business Listing",
    icon: MapPin,
    description: "Get businesses in specific geographic areas or cities",
    dataPoints: ["Business Name", "Category", "Address", "Phone", "Rating", "Reviews"],
    category: "companies",
    credits: 2,
    estimatedLeads: "100-1000 leads",
  },
  {
    id: "industry-specific",
    title: "Industry-Specific Leads",
    icon: Target,
    description: "Target leads from specific industries or verticals",
    dataPoints: ["Company", "Industry", "Sub-sector", "Key Contacts", "Phone", "Email", "Website"],
    category: "companies",
    credits: 3,
    estimatedLeads: "50-400 leads",
  },
  {
    id: "online-businesses",
    title: "E-commerce & Online Businesses",
    icon: Globe,
    description: "Scrape online businesses, e-commerce stores, and digital sellers",
    dataPoints: ["Store Name", "Platform", "Website", "Products", "Contact Email", "Social Media"],
    category: "companies",
    credits: 3,
    estimatedLeads: "50-500 leads",
  },
];

interface LeadGenerationTemplatesProps {
  onSelectTemplate: (template: LeadTemplate) => void;
}

export function LeadGenerationTemplates({ onSelectTemplate }: LeadGenerationTemplatesProps) {
  const categories = [
    { key: "companies", label: "Companies", color: "bg-[#E3F2FD] text-[#1565C0]", icon: Building2 },
    { key: "people", label: "People & Contacts", color: "bg-[#F3E5F5] text-[#6A1B9A]", icon: Users },
    { key: "distributors", label: "Distributors", color: "bg-[#E8F5E9] text-[#2E7D32]", icon: Package },
    { key: "retailers", label: "Retailers", color: "bg-[#FFF8E1] text-[#F57F17]", icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#212121] mb-2">Lead Generation Templates</h3>
        <p className="text-sm text-[#616161]">Select a template to start generating leads with AI-powered data scraping.</p>
      </div>

      {categories.map(category => {
        const templates = leadTemplates.filter(t => t.category === category.key);
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
                      <span className="text-xs font-semibold text-[#616161] mb-1 block">Data Points:</span>
                      <div className="flex flex-wrap gap-1">
                        {template.dataPoints.slice(0, 3).map((point, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px]">
                            {point}
                          </span>
                        ))}
                        {template.dataPoints.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px]">
                            +{template.dataPoints.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                      <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                        <span>{template.credits} Credits</span>
                        <span>•</span>
                        <span>{template.estimatedLeads}</span>
                      </div>
                      <span className="text-xs text-[#1565C0] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Generate →
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
