import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Building2, Search, Plus, Filter, MoreVertical, Phone, Mail,
  Globe, MapPin, TrendingUp, Users, Briefcase, Star, ChevronDown,
  LayoutGrid, List, Edit3, Trash2, ArrowUpRight, Tag, IndianRupee
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  industry: string;
  city: string;
  state: string;
  gstin: string;
  phone: string;
  email: string;
  website: string;
  contactCount: number;
  dealCount: number;
  totalDealValue: number;
  leadCount: number;
  rating: number;
  status: 'Active' | 'Prospect' | 'Churned';
  tags: string[];
  createdAt: string;
}

const mockCompanies: Company[] = [
  { id: "ACC-001", name: "Reliance Industries Ltd", industry: "Oil & Gas", city: "Mumbai", state: "Maharashtra", gstin: "27AAACR5055K1ZV", phone: "+912222222222", email: "crm@ril.com", website: "ril.com", contactCount: 8, dealCount: 3, totalDealValue: 4500000, leadCount: 12, rating: 5, status: "Active", tags: ["Enterprise", "Key Account"], createdAt: "2024-02-01T09:00:00Z" },
  { id: "ACC-002", name: "Tata Consultancy Services", industry: "Technology", city: "Mumbai", state: "Maharashtra", gstin: "27AABCT1332L1ZP", phone: "+912233334444", email: "procurement@tcs.com", website: "tcs.com", contactCount: 12, dealCount: 5, totalDealValue: 8900000, leadCount: 18, rating: 5, status: "Active", tags: ["Enterprise", "Strategic"], createdAt: "2024-01-15T10:00:00Z" },
  { id: "ACC-003", name: "Infosys Limited", industry: "Technology", city: "Bengaluru", state: "Karnataka", gstin: "29AABCI7882B1ZK", phone: "+918044854985", email: "vendor@infosys.com", website: "infosys.com", contactCount: 6, dealCount: 2, totalDealValue: 2400000, leadCount: 8, rating: 4, status: "Active", tags: ["Enterprise"], createdAt: "2024-03-10T09:00:00Z" },
  { id: "ACC-004", name: "HDFC Bank Ltd", industry: "Finance", city: "Mumbai", state: "Maharashtra", gstin: "27AAAAH3475N1ZA", phone: "+912266316000", email: "partnerships@hdfcbank.com", website: "hdfcbank.com", contactCount: 4, dealCount: 1, totalDealValue: 1200000, leadCount: 5, rating: 4, status: "Active", tags: ["BFSI", "Enterprise"], createdAt: "2024-04-05T11:00:00Z" },
  { id: "ACC-005", name: "Wipro Technologies", industry: "Technology", city: "Bengaluru", state: "Karnataka", gstin: "29AAACW1538C1ZH", phone: "+918028440011", email: "crm@wipro.com", website: "wipro.com", contactCount: 5, dealCount: 2, totalDealValue: 1800000, leadCount: 7, rating: 3, status: "Prospect", tags: ["Mid-Market"], createdAt: "2024-05-01T09:00:00Z" },
  { id: "ACC-006", name: "Sun Pharma Industries", industry: "Healthcare", city: "Mumbai", state: "Maharashtra", gstin: "27AABCS5596Q1ZF", phone: "+912266455645", email: "vendor@sunpharma.com", website: "sunpharma.com", contactCount: 3, dealCount: 1, totalDealValue: 950000, leadCount: 4, rating: 4, status: "Active", tags: ["Pharma", "Enterprise"], createdAt: "2024-06-10T09:00:00Z" },
  { id: "ACC-007", name: "Mahindra & Mahindra", industry: "Manufacturing", city: "Mumbai", state: "Maharashtra", gstin: "27AAACM4262G1ZK", phone: "+912224901441", email: "procurement@mahindra.com", website: "mahindra.com", contactCount: 7, dealCount: 2, totalDealValue: 3200000, leadCount: 9, rating: 4, status: "Active", tags: ["Enterprise", "Auto"], createdAt: "2024-07-01T09:00:00Z" },
  { id: "ACC-008", name: "Asian Paints Ltd", industry: "Manufacturing", city: "Mumbai", state: "Maharashtra", gstin: "27AAACA9999A1ZA", phone: "+912269818000", email: "vendor@asianpaints.com", website: "asianpaints.com", contactCount: 2, dealCount: 1, totalDealValue: 450000, leadCount: 3, rating: 3, status: "Prospect", tags: ["Mid-Market", "FMCG"], createdAt: "2024-08-15T11:00:00Z" },
];

const industries = ["All Industries", "Technology", "Finance", "Healthcare", "Manufacturing", "Oil & Gas", "Retail"];
const statuses = ["All Statuses", "Active", "Prospect", "Churned"];

const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;

export function Companies() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filtered = mockCompanies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchIndustry = industryFilter === "All Industries" || c.industry === industryFilter;
    const matchStatus = statusFilter === "All Statuses" || c.status === statusFilter;
    return matchSearch && matchIndustry && matchStatus;
  });

  const totalDealsValue = mockCompanies.reduce((sum, c) => sum + c.totalDealValue, 0);
  const activeCount = mockCompanies.filter(c => c.status === 'Active').length;

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "CRM" }, { label: "Companies" }]}
        companyName="TechAvtar India Pvt Ltd"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
              <p className="text-sm text-gray-500 mt-1">{mockCompanies.length} accounts · {fmt(totalDealsValue)} total deal value</p>
            </div>
            <button
              onClick={() => navigate("/tenant/leads/create")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Company
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Companies", value: mockCompanies.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active Accounts", value: activeCount, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
              { label: "Total Deal Value", value: fmt(totalDealsValue), icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Total Contacts", value: mockCompanies.reduce((s, c) => s + c.contactCount, 0), icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="ml-auto flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Company List */}
          {viewMode === "list" ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Company</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Industry</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Location</th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Contacts</th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Deals</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Deal Value</th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((company, i) => (
                    <tr key={company.id}
                      className={`${i < filtered.length - 1 ? "border-b border-gray-50" : ""} hover:bg-blue-50/20 cursor-pointer group transition-colors`}
                      onClick={() => navigate(`/tenant/companies/${company.id}`)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{company.name}</p>
                            <p className="text-xs text-gray-400">{company.gstin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{company.industry}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {company.city}, {company.state}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-gray-900">{company.contactCount}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-gray-900">{company.dealCount}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900">{fmt(company.totalDealValue)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          company.status === 'Active' ? 'bg-green-50 text-green-700' :
                          company.status === 'Prospect' ? 'bg-blue-50 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{company.status}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" onClick={e => { e.stopPropagation(); }}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" onClick={e => { e.stopPropagation(); }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No companies found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map(company => (
                <div key={company.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                  onClick={() => navigate(`/tenant/companies/${company.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{company.name}</p>
                        <p className="text-xs text-gray-500">{company.industry}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${company.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{company.status}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {company.city}, {company.state}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-sm font-bold text-gray-900">{company.contactCount}</p>
                      <p className="text-xs text-gray-500">Contacts</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-sm font-bold text-gray-900">{company.dealCount}</p>
                      <p className="text-xs text-gray-500">Deals</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-sm font-bold text-gray-900">{fmt(company.totalDealValue)}</p>
                      <p className="text-xs text-gray-500">Value</p>
                    </div>
                  </div>
                  {company.tags.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {company.tags.map(tag => (
                        <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
