import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useLeadRecords } from "../../hooks/useLeadRecords";
import { useOrgHierarchy } from "../../hooks/useOrgHierarchy";
import { Search, Plus, Edit3, Trash2, UserPlus, Mail, Phone, Filter, X } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-[#E3F2FD] text-[#1565C0]",
  Contacted: "bg-[#FFF8E1] text-[#F57F17]",
  Qualified: "bg-[#E8F5E9] text-[#2E7D32]",
  Unqualified: "bg-[#FFEBEE] text-[#C62828]",
  Converted: "bg-[#F3E5F5] text-[#7B1FA2]",
};

const RATING_COLORS: Record<string, string> = {
  Hot: "bg-[#FFEBEE] text-[#C62828]",
  Warm: "bg-[#FFF3E0] text-[#E65100]",
  Cold: "bg-[#E3F2FD] text-[#1565C0]",
};

export function LeadRecords() {
  const navigate = useNavigate();
  const { records, deleteLead } = useLeadRecords();
  const { users } = useOrgHierarchy();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const ownerName = (id?: unknown) => users.find((u) => u.id === id)?.name ?? "Unassigned";

  const filtered = useMemo(() => records.filter((r) => {
    const v = r.values;
    const q = search.toLowerCase();
    const matchSearch = `${v.firstName ?? ""} ${v.lastName ?? ""} ${v.company ?? ""} ${v.email ?? ""}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchStatus;
  }), [records, search, statusFilter]);

  const stats = useMemo(() => ({
    total: records.length,
    qualified: records.filter((r) => r.values.status === "Qualified").length,
    hot: records.filter((r) => r.values.rating === "Hot").length,
    newToday: records.filter((r) => Date.now() - new Date(r.createdAt).getTime() < 86400000).length,
  }), [records]);

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Leads" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] flex items-center gap-2"><UserPlus size={24} className="text-[#1565C0]" /> Leads</h1>
            <p className="text-sm text-[#616161] mt-1">{filtered.length} of {records.length} leads · full create / edit / delete</p>
          </div>
          <button onClick={() => navigate("/tenant/leads/create")} className="px-4 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5">
            <Plus size={16} /> Create Lead
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Leads", value: stats.total, grad: "from-[#42A5F5] to-[#1565C0]" },
            { label: "Qualified", value: stats.qualified, grad: "from-[#66BB6A] to-[#2E7D32]" },
            { label: "Hot Leads", value: stats.hot, grad: "from-[#EF5350] to-[#C62828]" },
            { label: "New (24h)", value: stats.newToday, grad: "from-[#FFB74D] to-[#F57C00]" },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-[#E0E0E0] rounded-xl p-4">
              <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${k.grad} mb-2`} />
              <div className="text-2xl font-semibold text-[#212121]">{k.value}</div>
              <div className="text-xs text-[#9E9E9E]">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4 max-md:flex-col">
          <div className="relative flex-1 max-md:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads…"
              className="w-full h-11 pl-11 pr-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] bg-white">
            <option value="all">All statuses</option>
            {["New", "Contacted", "Qualified", "Unqualified", "Converted"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0] text-left text-[#616161]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const v = r.values as Record<string, any>;
                  return (
                    <tr key={r.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#42A5F5] to-[#1565C0] text-white flex items-center justify-center text-xs font-semibold">
                            {(v.firstName?.[0] ?? "") + (v.lastName?.[0] ?? "")}
                          </div>
                          <div>
                            <div className="font-medium text-[#212121]">{v.salutation ? `${v.salutation} ` : ""}{v.firstName} {v.lastName}</div>
                            <div className="text-xs text-[#9E9E9E]">{r.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#616161]">{v.company || "—"}</td>
                      <td className="px-4 py-3 text-[#616161]">
                        <div className="flex flex-col gap-0.5">
                          {v.email && <span className="flex items-center gap-1 text-xs"><Mail size={11} /> {v.email}</span>}
                          {v.phone && <span className="flex items-center gap-1 text-xs"><Phone size={11} /> {v.phone}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[v.status] || "bg-[#F5F5F5] text-[#616161]"}`}>{v.status || "—"}</span></td>
                      <td className="px-4 py-3">{v.rating ? <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${RATING_COLORS[v.rating]}`}>{v.rating}</span> : "—"}</td>
                      <td className="px-4 py-3 text-[#616161]">{ownerName(v.ownerId)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => navigate(`/tenant/leads/create?id=${r.id}`)} className="p-1.5 text-[#1565C0] hover:bg-[#E3F2FD] rounded" title="Edit"><Edit3 size={16} /></button>
                          <button onClick={() => setConfirmId(r.id)} className="p-1.5 text-[#C62828] hover:bg-[#FFEBEE] rounded" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-[#9E9E9E]">No leads. Click “Create Lead” to add one.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#212121] mb-1">Delete lead?</h3>
            <p className="text-sm text-[#616161] mb-5">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-4 h-10 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">Cancel</button>
              <button onClick={() => { deleteLead(confirmId); setConfirmId(null); }} className="px-4 h-10 rounded-lg bg-[#C62828] text-white text-sm font-semibold hover:bg-[#B71C1C]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
