import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  FileText, Plus, Search, Filter, Copy, Edit3, Trash2, Eye,
  Star, Clock, Users, Download, Tag, ChevronRight, LayoutGrid,
  List, CheckCircle2, Lock, Globe, Zap, BookOpen, IndianRupee
} from "lucide-react";
import { toast } from "sonner";

interface DocumentTemplate {
  id: string;
  name: string;
  category: "Proposal" | "Agreement" | "NDA" | "Invoice" | "SOW" | "Quote" | "Welcome";
  description: string;
  variables: string[];
  usageCount: number;
  isDefault: boolean;
  isPublic: boolean;
  hasGSTBlock: boolean;
  language: string;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
}

const templates: DocumentTemplate[] = [
  {
    id: "TMP-001", name: "Sales Proposal — Enterprise", category: "Proposal",
    description: "Full-featured proposal with cover page, executive summary, pricing table with GST breakup, and signature block.",
    variables: ["{{client_name}}", "{{company_gstin}}", "{{deal_value}}", "{{close_date}}", "{{owner_name}}"],
    usageCount: 156, isDefault: true, isPublic: true, hasGSTBlock: true,
    language: "English", lastUpdated: "2025-04-10", createdBy: "Rajesh Sharma", tags: ["Enterprise", "Sales"]
  },
  {
    id: "TMP-002", name: "Service Agreement", category: "Agreement",
    description: "Standard service agreement with SLA annexure, payment terms (INR), and GDPR/DPDP compliance clauses.",
    variables: ["{{client_name}}", "{{start_date}}", "{{sla_uptime}}", "{{monthly_fee}}"],
    usageCount: 89, isDefault: false, isPublic: true, hasGSTBlock: true,
    language: "English", lastUpdated: "2025-03-22", createdBy: "Priya Mehta", tags: ["Legal", "SLA"]
  },
  {
    id: "TMP-003", name: "Non-Disclosure Agreement", category: "NDA",
    description: "Mutual NDA with Indian jurisdiction, PAN/GSTIN verification, and digital signature support.",
    variables: ["{{party_a}}", "{{party_b}}", "{{effective_date}}", "{{duration_years}}"],
    usageCount: 234, isDefault: true, isPublic: true, hasGSTBlock: false,
    language: "English", lastUpdated: "2025-02-14", createdBy: "Anita Desai", tags: ["Legal", "Confidentiality"]
  },
  {
    id: "TMP-004", name: "GST Tax Invoice", category: "Invoice",
    description: "Compliant GST invoice with CGST/SGST/IGST split, HSN code, place of supply, and QR code.",
    variables: ["{{invoice_no}}", "{{gstin}}", "{{hsn_code}}", "{{tax_rate}}", "{{amount}}"],
    usageCount: 421, isDefault: true, isPublic: true, hasGSTBlock: true,
    language: "English", lastUpdated: "2025-04-15", createdBy: "Rajesh Sharma", tags: ["Finance", "GST", "Compliance"]
  },
  {
    id: "TMP-005", name: "Statement of Work — Software Dev", category: "SOW",
    description: "Detailed SOW for software implementation projects with milestone tables, deliverables, and acceptance criteria.",
    variables: ["{{project_name}}", "{{client_name}}", "{{start_date}}", "{{end_date}}", "{{total_value}}"],
    usageCount: 67, isDefault: false, isPublic: true, hasGSTBlock: true,
    language: "English", lastUpdated: "2025-01-30", createdBy: "Priya Mehta", tags: ["Projects", "Technical"]
  },
  {
    id: "TMP-006", name: "Price Quote — SME", category: "Quote",
    description: "Simplified quote template for SME customers. Single page with product list, pricing, GST, and validity period.",
    variables: ["{{client_name}}", "{{valid_till}}", "{{discount_pct}}"],
    usageCount: 198, isDefault: false, isPublic: true, hasGSTBlock: true,
    language: "English", lastUpdated: "2025-03-01", createdBy: "Amit Kumar", tags: ["SME", "Quick"]
  },
  {
    id: "TMP-007", name: "Welcome Pack — Onboarding", category: "Welcome",
    description: "Customer welcome letter with account credentials, support contacts, onboarding checklist, and next steps.",
    variables: ["{{client_name}}", "{{account_id}}", "{{csm_name}}", "{{portal_url}}"],
    usageCount: 312, isDefault: false, isPublic: false, hasGSTBlock: false,
    language: "English", lastUpdated: "2025-04-20", createdBy: "Sneha Reddy", tags: ["Onboarding", "Customer Success"]
  },
  {
    id: "TMP-008", name: "Hindi — Sales Proposal (Tier-2)", category: "Proposal",
    description: "Sales proposal in Hindi for Tier-2 city prospects. Simplified language, local pricing references.",
    variables: ["{{client_name}}", "{{company_name}}", "{{deal_value}}", "{{owner_name}}"],
    usageCount: 43, isDefault: false, isPublic: false, hasGSTBlock: true,
    language: "Hindi", lastUpdated: "2025-02-28", createdBy: "Vikram Joshi", tags: ["Hindi", "Regional", "Tier-2"]
  },
];

const categoryColors: Record<string, string> = {
  Proposal: "bg-blue-50 text-blue-700",
  Agreement: "bg-purple-50 text-purple-700",
  NDA: "bg-red-50 text-red-700",
  Invoice: "bg-green-50 text-green-700",
  SOW: "bg-orange-50 text-orange-700",
  Quote: "bg-cyan-50 text-cyan-700",
  Welcome: "bg-pink-50 text-pink-700",
};

const categories = ["All", "Proposal", "Agreement", "NDA", "Invoice", "SOW", "Quote", "Welcome"];

export function DocumentTemplates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = templates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || t.category === category;
    return matchSearch && matchCat;
  });

  const handleUse = (template: DocumentTemplate) => {
    navigate(`/tenant/documents/create?template=${template.id}`);
  };

  const handleClone = (template: DocumentTemplate) => {
    toast.success(`"${template.name}" cloned. Redirecting to editor…`);
    navigate(`/tenant/documents/templates/create?clone=${template.id}`);
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "CRM" },
          { label: "Documents", path: "/tenant/documents" },
          { label: "Templates" }
        ]}
        companyName="TechAvtar India Pvt Ltd"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Document Templates</h1>
              <p className="text-sm text-gray-500 mt-1">{templates.length} templates · GST-compliant · India-primary</p>
            </div>
            <button
              onClick={() => navigate("/tenant/documents/templates/create")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Templates", value: templates.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "GST-Compliant", value: templates.filter(t => t.hasGSTBlock).length, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
              { label: "Total Uses", value: templates.reduce((s, t) => s + t.usageCount, 0), icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Multi-Language", value: templates.filter(t => t.language !== "English").length, icon: Globe, color: "text-orange-600", bg: "bg-orange-50" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    category === cat ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-white">
              <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Template Grid */}
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(template => (
                <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group">
                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                        <FileText className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{template.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[template.category]}`}>{template.category}</span>
                          {template.isDefault && <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Star className="w-3 h-3" /> Default</span>}
                          {template.hasGSTBlock && <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">GST ✓</span>}
                          {!template.isPublic && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Lock className="w-3 h-3" /> Private</span>}
                          {template.language !== "English" && <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full">{template.language}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{template.description}</p>

                  {/* Variables preview */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1.5">Variables ({template.variables.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map(v => (
                        <code key={v} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">{v}</code>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="text-xs text-gray-400">+{template.variables.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{template.usageCount} uses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Updated {template.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUse(template)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Use Template
                    </button>
                    <button
                      onClick={() => navigate(`/tenant/documents/templates/${template.id}`)}
                      className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleClone(template)}
                      className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/tenant/documents/templates/create?edit=${template.id}`)}
                      className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add new card */}
              <button
                onClick={() => navigate("/tenant/documents/templates/create")}
                className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center hover:border-blue-300 hover:bg-blue-50/30 transition-all min-h-[200px] group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium text-gray-700">Create New Template</p>
                <p className="text-xs text-gray-500 text-center mt-1">Build a custom template with merge fields, GST blocks, and e-signature support</p>
              </button>
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Template</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Category</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Language</th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Uses</th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">GST</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Updated</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((template, i) => (
                    <tr key={template.id} className={`${i < filtered.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 group`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{template.name}</p>
                            {template.isDefault && <span className="text-xs text-yellow-600 flex items-center gap-0.5"><Star className="w-3 h-3" /> Default</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[template.category]}`}>{template.category}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{template.language}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">{template.usageCount}</td>
                      <td className="px-4 py-3 text-center">{template.hasGSTBlock ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <span className="text-gray-400 text-xs">—</span>}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{template.lastUpdated}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleUse(template)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">Use</button>
                          <button onClick={() => handleClone(template)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"><Copy className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
