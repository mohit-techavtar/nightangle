import React, { useState, useMemo } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useCompanies } from "../../hooks/useCompanies";
import type { Company, CompanyType, CompanyStatus, BranchHierarchy } from "../../hooks/useCompanies";
import {
  Building2, Plus, Search, Edit3, Trash2, X, ChevronRight, ChevronDown,
  Users, MapPin, Mail, Phone, Globe, Briefcase, Network,
  CheckCircle2, AlertCircle, Filter, MoreVertical, Eye, GitBranch
} from "lucide-react";

const TYPE_COLORS: Record<CompanyType, string> = {
  headquarters: "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]",
  branch:       "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
  subsidiary:   "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]",
  franchise:    "bg-[#F3E5F5] text-[#7B1FA2] border-[#CE93D8]",
};

const STATUS_COLORS: Record<CompanyStatus, string> = {
  active:   "bg-[#E8F5E9] text-[#2E7D32]",
  inactive: "bg-[#FFEBEE] text-[#C62828]",
  pending:  "bg-[#FFF8E1] text-[#F57F17]",
};

interface CompanyFormState {
  name: string;
  code: string;
  type: CompanyType;
  status: CompanyStatus;
  parentId?: string;
  legalName: string;
  taxId: string;
  industry: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  currency: string;
  timezone: string;
  managerName: string;
  employeeCount: number;
}

const DEFAULT_FORM: CompanyFormState = {
  name: "", code: "", type: "branch", status: "active",
  legalName: "", taxId: "", industry: "Technology",
  email: "", phone: "", website: "",
  addressLine1: "", city: "", state: "", country: "India", postalCode: "",
  currency: "INR", timezone: "Asia/Kolkata", managerName: "", employeeCount: 0,
};

export function CompanyBranchManagement() {
  const {
    companies, createCompany, updateCompany, deleteCompany,
    getHierarchy, getAncestors, stats,
  } = useCompanies();

  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<CompanyType | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<CompanyFormState>(DEFAULT_FORM);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(companies.map(c => c.id)));
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const hierarchy = useMemo(() => getHierarchy(), [companies]);
  const selectedCompany = selectedCompanyId ? companies.find(c => c.id === selectedCompanyId) : null;

  const filteredCompanies = useMemo(() => companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.address.city || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchType;
  }), [companies, searchQuery, typeFilter]);

  const toggleExpand = (id: string) => setExpandedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const openCreate = (parentId?: string) => {
    setEditingCompany(null);
    setForm({ ...DEFAULT_FORM, parentId, type: parentId ? "branch" : "headquarters" });
    setShowForm(true);
  };

  const openEdit = (company: Company) => {
    setEditingCompany(company);
    setForm({
      name: company.name, code: company.code, type: company.type, status: company.status,
      parentId: company.parentId,
      legalName: company.legalName || "", taxId: company.taxId || "",
      industry: company.industry || "Technology",
      email: company.email || "", phone: company.phone || "", website: company.website || "",
      addressLine1: company.address.line1 || "", city: company.address.city || "",
      state: company.address.state || "", country: company.address.country || "India",
      postalCode: company.address.postalCode || "",
      currency: company.currency, timezone: company.timezone,
      managerName: company.managerName || "", employeeCount: company.employeeCount || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.code.trim()) {
      alert("Name and code are required"); return;
    }
    const payload = {
      name: form.name, code: form.code, type: form.type, status: form.status,
      parentId: form.parentId,
      legalName: form.legalName, taxId: form.taxId, industry: form.industry,
      email: form.email, phone: form.phone, website: form.website,
      address: {
        line1: form.addressLine1, city: form.city, state: form.state,
        country: form.country, postalCode: form.postalCode,
      },
      currency: form.currency, timezone: form.timezone, language: "en",
      managerName: form.managerName, employeeCount: form.employeeCount,
    };
    if (editingCompany) updateCompany(editingCompany.id, payload);
    else createCompany(payload);
    setShowForm(false); setEditingCompany(null);
  };

  const handleDelete = (id: string) => {
    const company = companies.find(c => c.id === id);
    if (!company) return;
    if (!confirm(`Delete "${company.name}"? Child branches will also be removed.`)) return;
    deleteCompany(id);
    if (selectedCompanyId === id) setSelectedCompanyId(null);
  };

  const renderTreeNode = (node: BranchHierarchy) => {
    const { company, children, depth } = node;
    const isExpanded = expandedIds.has(company.id);
    const isSelected = selectedCompanyId === company.id;
    const hasChildren = children.length > 0;

    return (
      <div key={company.id}>
        <div
          onClick={() => setSelectedCompanyId(company.id)}
          className={`flex items-center gap-2 py-2.5 px-3 rounded-md cursor-pointer transition-colors ${isSelected ? "bg-[#E3F2FD] border-l-3 border-l-[#1565C0]" : "hover:bg-[#FAFAFA]"}`}
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(company.id); }} className="p-0.5 rounded hover:bg-[#E0E0E0]">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : <span className="w-5" />}
          <div className={`w-8 h-8 rounded flex items-center justify-center ${TYPE_COLORS[company.type]}`}>
            <Building2 size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-[#212121] truncate">{company.name}</span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${TYPE_COLORS[company.type]} capitalize`}>{company.type}</span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[company.status]} capitalize`}>{company.status}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-[#9E9E9E]">
              <span>{company.code}</span>
              {company.address.city && <span>· {company.address.city}</span>}
              {company.employeeCount !== undefined && <span>· {company.employeeCount} employees</span>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); openCreate(company.id); }} className="p-1.5 rounded hover:bg-[#E3F2FD] text-[#1565C0]" title="Add branch"><Plus size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); openEdit(company); }} className="p-1.5 rounded hover:bg-[#E3F2FD] text-[#1565C0]"><Edit3 size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(company.id); }} className="p-1.5 rounded hover:bg-[#FFEBEE] text-[#C62828]"><Trash2 size={14} /></button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>{children.map(c => renderTreeNode(c))}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Admin" }, { label: "Companies & Branches" }]} mode="admin" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center"><Network size={20} className="text-[#1565C0]" /></div>
                <h2 className="text-2xl font-semibold text-[#0F1B2D]">Companies & Branches</h2>
              </div>
              <p className="text-sm text-[#616161]">Manage your organization structure: HQ, branches, subsidiaries, and franchises</p>
            </div>
            <button onClick={() => openCreate()} className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
              <Plus size={16} /> New Company
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Total Entities</div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.total}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">HQ</div>
              <div className="text-2xl font-semibold text-[#1565C0]">{stats.headquarters}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Branches</div>
              <div className="text-2xl font-semibold text-[#2E7D32]">{stats.branches}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Subsidiaries</div>
              <div className="text-2xl font-semibold text-[#F57F17]">{stats.subsidiaries}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Employees</div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.totalEmployees}</div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left: Tree / List */}
            <div className="flex-1 bg-white border border-[#E0E0E0] rounded-lg">
              <div className="p-4 border-b border-[#E0E0E0] flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search companies..." className="w-full pl-9 pr-3 h-9 border border-[#E0E0E0] rounded-md text-sm" />
                </div>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="h-9 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option value="all">All Types</option>
                  <option value="headquarters">HQ</option>
                  <option value="branch">Branch</option>
                  <option value="subsidiary">Subsidiary</option>
                  <option value="franchise">Franchise</option>
                </select>
                <div className="ml-auto flex items-center gap-1 bg-[#FAFAFA] border border-[#E0E0E0] rounded-md p-1">
                  <button onClick={() => setViewMode("tree")} className={`px-3 py-1 text-xs rounded ${viewMode === "tree" ? "bg-white shadow-sm text-[#1565C0] font-medium" : "text-[#616161]"}`}>Tree</button>
                  <button onClick={() => setViewMode("list")} className={`px-3 py-1 text-xs rounded ${viewMode === "list" ? "bg-white shadow-sm text-[#1565C0] font-medium" : "text-[#616161]"}`}>List</button>
                </div>
              </div>

              <div className="p-2 max-h-[600px] overflow-y-auto">
                {viewMode === "tree" ? (
                  hierarchy.length > 0
                    ? hierarchy.map(node => renderTreeNode(node))
                    : <div className="p-10 text-center text-sm text-[#9E9E9E]">No companies yet</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-[#616161] text-xs uppercase">Name</th>
                        <th className="text-left px-3 py-2 font-medium text-[#616161] text-xs uppercase">Code</th>
                        <th className="text-left px-3 py-2 font-medium text-[#616161] text-xs uppercase">Type</th>
                        <th className="text-left px-3 py-2 font-medium text-[#616161] text-xs uppercase">Location</th>
                        <th className="text-left px-3 py-2 font-medium text-[#616161] text-xs uppercase">Status</th>
                        <th className="text-right px-3 py-2 font-medium text-[#616161] text-xs uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E0E0]">
                      {filteredCompanies.map(c => (
                        <tr key={c.id} className="hover:bg-[#FAFAFA] cursor-pointer" onClick={() => setSelectedCompanyId(c.id)}>
                          <td className="px-3 py-2 font-medium text-[#212121]">{c.name}</td>
                          <td className="px-3 py-2 text-[#616161]">{c.code}</td>
                          <td className="px-3 py-2"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${TYPE_COLORS[c.type]}`}>{c.type}</span></td>
                          <td className="px-3 py-2 text-[#616161]">{c.address.city}, {c.address.country}</td>
                          <td className="px-3 py-2"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_COLORS[c.status]}`}>{c.status}</span></td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="p-1.5 rounded hover:bg-[#E3F2FD] text-[#1565C0]"><Edit3 size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="p-1.5 rounded hover:bg-[#FFEBEE] text-[#C62828]"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right: Detail panel */}
            {selectedCompany && (
              <div className="w-[380px] bg-white border border-[#E0E0E0] rounded-lg p-5 self-start">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${TYPE_COLORS[selectedCompany.type]}`}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#212121]">{selectedCompany.name}</h3>
                      <p className="text-xs text-[#616161] mt-0.5">{selectedCompany.code}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCompanyId(null)} className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]"><X size={16} /></button>
                </div>

                {/* Breadcrumb if branch */}
                {selectedCompany.parentId && (
                  <div className="bg-[#FAFAFA] rounded-md p-2 mb-4 text-xs text-[#616161] flex items-center gap-1 flex-wrap">
                    {getAncestors(selectedCompany.id).map((a, i) => (
                      <React.Fragment key={a.id}>
                        <span className="hover:text-[#1565C0] cursor-pointer" onClick={() => setSelectedCompanyId(a.id)}>{a.name}</span>
                        <ChevronRight size={10} />
                      </React.Fragment>
                    ))}
                    <span className="font-medium text-[#212121]">{selectedCompany.name}</span>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  {selectedCompany.legalName && (
                    <div><div className="text-xs text-[#9E9E9E] mb-0.5">Legal Name</div><div className="text-[#212121]">{selectedCompany.legalName}</div></div>
                  )}
                  {selectedCompany.taxId && (
                    <div><div className="text-xs text-[#9E9E9E] mb-0.5">Tax ID</div><div className="text-[#212121] font-mono">{selectedCompany.taxId}</div></div>
                  )}
                  <div className="flex items-center gap-2 text-[#616161]"><MapPin size={14} /><span>{[selectedCompany.address.line1, selectedCompany.address.city, selectedCompany.address.country].filter(Boolean).join(", ")}</span></div>
                  {selectedCompany.email && <div className="flex items-center gap-2 text-[#616161]"><Mail size={14} /><span>{selectedCompany.email}</span></div>}
                  {selectedCompany.phone && <div className="flex items-center gap-2 text-[#616161]"><Phone size={14} /><span>{selectedCompany.phone}</span></div>}
                  {selectedCompany.website && <div className="flex items-center gap-2 text-[#1565C0]"><Globe size={14} /><a href={selectedCompany.website} className="hover:underline">{selectedCompany.website}</a></div>}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E0E0E0]">
                    <div><div className="text-xs text-[#9E9E9E] mb-0.5">Currency</div><div className="text-[#212121]">{selectedCompany.currency}</div></div>
                    <div><div className="text-xs text-[#9E9E9E] mb-0.5">Timezone</div><div className="text-[#212121] text-xs">{selectedCompany.timezone}</div></div>
                    <div><div className="text-xs text-[#9E9E9E] mb-0.5">Manager</div><div className="text-[#212121]">{selectedCompany.managerName || "—"}</div></div>
                    <div><div className="text-xs text-[#9E9E9E] mb-0.5">Employees</div><div className="text-[#212121]">{selectedCompany.employeeCount || 0}</div></div>
                  </div>
                </div>

                <div className="flex gap-2 mt-5 pt-4 border-t border-[#E0E0E0]">
                  <button onClick={() => openEdit(selectedCompany)} className="flex-1 h-9 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] inline-flex items-center justify-center gap-2"><Edit3 size={14} /> Edit</button>
                  <button onClick={() => openCreate(selectedCompany.id)} className="flex-1 h-9 rounded-md border border-[#E0E0E0] text-[#1565C0] text-sm hover:bg-[#F5F5F5] inline-flex items-center justify-center gap-2"><GitBranch size={14} /> Add Branch</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-[#212121]">{editingCompany ? "Edit Company" : "New Company"}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Company Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Code *</label>
                  <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. EDS-BLR" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CompanyType })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    <option value="headquarters">Headquarters</option>
                    <option value="branch">Branch</option>
                    <option value="subsidiary">Subsidiary</option>
                    <option value="franchise">Franchise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Parent Company</label>
                  <select value={form.parentId || ""} onChange={(e) => setForm({ ...form, parentId: e.target.value || undefined })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    <option value="">— None (top-level) —</option>
                    {companies.filter(c => c.id !== editingCompany?.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Legal Name</label>
                  <input type="text" value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Tax ID / GST</label>
                  <input type="text" value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Industry</label>
                  <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CompanyStatus })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    <option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E0E0E0]">
                <h4 className="text-sm font-semibold text-[#212121] mb-3">Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#212121] mb-1">Address Line</label>
                    <input type="text" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">City</label>
                    <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">State / Province</label>
                    <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Country</label>
                    <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Postal Code</label>
                    <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E0E0E0]">
                <h4 className="text-sm font-semibold text-[#212121] mb-3">Contact & Operations</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Website</label>
                    <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Manager</label>
                    <input type="text" value={form.managerName} onChange={(e) => setForm({ ...form, managerName: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Currency</label>
                    <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                      <option>INR</option><option>USD</option><option>EUR</option><option>GBP</option><option>NPR</option><option>AED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Timezone</label>
                    <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                      <option>Asia/Kolkata</option><option>Asia/Kathmandu</option><option>Asia/Dubai</option><option>America/New_York</option><option>Europe/London</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-1">Employee Count</label>
                    <input type="number" min="0" value={form.employeeCount} onChange={(e) => setForm({ ...form, employeeCount: parseInt(e.target.value) || 0 })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-[#E0E0E0] sticky bottom-0 bg-white">
              <button onClick={() => setShowForm(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5]">Cancel</button>
              <button onClick={handleSubmit} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">{editingCompany ? "Save Changes" : "Create Company"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
