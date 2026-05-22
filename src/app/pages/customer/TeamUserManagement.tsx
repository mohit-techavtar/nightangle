import React, { useMemo, useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useOrgHierarchy, type OrgUser, type OrgRole } from "../../hooks/useOrgHierarchy";
import { useCompanies } from "../../hooks/useCompanies";
import {
  Users, Search, Plus, Edit2, UserX, UserCheck, X, Building2, Network,
  Mail, Shield, ChevronDown, GitBranch, Filter, MoreVertical, Check,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Task 5 — Team Management with branch dependency. Users are
// scoped by branch; the "Reports To" manager list is derived
// from the selected branch (true branch dependency). Full CRUD:
// add, edit, activate/deactivate.
// ============================================================

const ROLES: OrgRole[] = ["Branch Head", "Regional Manager", "Team Lead", "Sales Manager", "Sales Executive", "Support Agent", "Tenant Admin"];
const ROLE_STYLE: Record<string, string> = {
  "Tenant Admin": "bg-[#F3E5F5] text-[#7B1FA2]",
  "Branch Head": "bg-[#E3F2FD] text-[#1565C0]",
  "Regional Manager": "bg-[#E3F2FD] text-[#1565C0]",
  "Sales Manager": "bg-[#E0F2F1] text-[#00897B]",
  "Team Lead": "bg-[#FFF3E0] text-[#E65100]",
  "Sales Executive": "bg-[#F1F8E9] text-[#558B2F]",
  "Support Agent": "bg-[#FFF8E1] text-[#F57F17]",
};
const input = "w-full h-10 px-3 border border-[#C9C9C9] rounded text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20";

interface FormState { id?: string; name: string; email: string; title: OrgRole; branchId: string; reportsTo: string; status: "active" | "inactive"; capacity: number; }

export function TeamUserManagement() {
  const { users, addUser, updateUser, getUser } = useOrgHierarchy();
  const { companies } = useCompanies();
  const [branchFilter, setBranchFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<FormState | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const branchName = (id: string) => companies.find((c) => c.id === id)?.name || "—";
  const userName = (id: string | null) => (id ? users.find((u) => u.id === id)?.name ?? "—" : "—");

  const filtered = useMemo(() => users.filter((u) => {
    const mBranch = branchFilter === "all" || u.branchId === branchFilter;
    const mSearch = `${u.name} ${u.email} ${u.title}`.toLowerCase().includes(search.toLowerCase());
    const mStatus = statusFilter === "all" || u.status === statusFilter;
    return mBranch && mSearch && mStatus;
  }), [users, branchFilter, search, statusFilter]);

  // Per-branch KPI summary
  const branchSummary = useMemo(() => companies.map((c) => ({
    id: c.id, name: c.name,
    total: users.filter((u) => u.branchId === c.id).length,
    active: users.filter((u) => u.branchId === c.id && u.status === "active").length,
  })), [companies, users]);

  const openCreate = () => setModal({ name: "", email: "", title: "Sales Executive", branchId: branchFilter !== "all" ? branchFilter : companies[0]?.id || "", reportsTo: "", status: "active", capacity: 50 });
  const openEdit = (u: OrgUser) => { setModal({ id: u.id, name: u.name, email: u.email, title: u.title, branchId: u.branchId, reportsTo: u.reportsTo || "", status: u.status, capacity: u.capacity }); setMenuId(null); };

  const toggleStatus = (u: OrgUser) => { updateUser(u.id, { status: u.status === "active" ? "inactive" : "active" }); setMenuId(null); toast.success(u.status === "active" ? "User deactivated" : "User activated"); };

  const save = () => {
    if (!modal) return;
    if (!modal.name.trim() || !modal.email.trim()) { toast.error("Name and email are required"); return; }
    const avatar = modal.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const payload = { name: modal.name, email: modal.email, avatar, title: modal.title, branchId: modal.branchId, reportsTo: modal.reportsTo || null, status: modal.status, capacity: Number(modal.capacity) || 0, openLeads: modal.id ? (getUser(modal.id)?.openLeads ?? 0) : 0 };
    if (modal.id) { updateUser(modal.id, payload); toast.success("User updated"); }
    else { addUser(payload as Omit<OrgUser, "id">); toast.success("User added"); }
    setModal(null);
  };

  // Branch dependency: managers available to "Reports To" depend on the selected branch in the form.
  const managersForBranch = (branchId: string) =>
    users.filter((u) => u.branchId === branchId && ["Branch Head", "Regional Manager", "Sales Manager", "Team Lead", "Tenant Admin"].includes(u.title));

  return (
    <div className="flex flex-col h-full bg-[#F3F3F3]">
      <TopBar breadcrumbs={[{ label: "Team" }, { label: "Users" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="bg-white border-b border-[#E5E5E5] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#1565C0] text-white flex items-center justify-center"><Users size={17} /></div>
          <div><h1 className="text-base font-semibold text-[#181818] leading-tight">Team Management</h1><p className="text-xs text-[#747474]">{users.length} users across {companies.length} branches</p></div>
        </div>
        <button onClick={openCreate} className="px-4 h-9 rounded bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5"><Plus size={16} /> Add User</button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Branch dependency — branch summary chips that scope the whole console */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-[#616161]"><Building2 size={15} /> Branches</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setBranchFilter("all")} className={`px-3 h-9 rounded-lg text-sm border transition-colors ${branchFilter === "all" ? "bg-[#1565C0] text-white border-[#1565C0]" : "bg-white text-[#616161] border-[#E0E0E0] hover:bg-[#F5F5F5]"}`}>
              All Branches <span className="opacity-70">({users.length})</span>
            </button>
            {branchSummary.map((b) => (
              <button key={b.id} onClick={() => setBranchFilter(b.id)} className={`px-3 h-9 rounded-lg text-sm border transition-colors flex items-center gap-1.5 ${branchFilter === b.id ? "bg-[#1565C0] text-white border-[#1565C0]" : "bg-white text-[#616161] border-[#E0E0E0] hover:bg-[#F5F5F5]"}`}>
                {b.name} <span className="opacity-70">({b.active}/{b.total})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={17} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="w-full h-9 pl-10 pr-3 border border-[#C9C9C9] rounded text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 border border-[#C9C9C9] rounded text-sm bg-white outline-none focus:border-[#1565C0]">
            <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Users table */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-left text-[#747474]">
                <tr>
                  <th className="px-4 py-2.5 font-medium">User</th>
                  <th className="px-4 py-2.5 font-medium">Role</th>
                  <th className="px-4 py-2.5 font-medium">Branch</th>
                  <th className="px-4 py-2.5 font-medium">Reports To</th>
                  <th className="px-4 py-2.5 font-medium">Load</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FBFF]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white ${u.status === "active" ? "bg-gradient-to-br from-[#42A5F5] to-[#1565C0]" : "bg-[#BDBDBD]"}`}>{u.avatar}</div>
                        <div><div className="font-medium text-[#181818]">{u.name}</div><div className="text-xs text-[#A0A0A0] flex items-center gap-1"><Mail size={10} /> {u.email}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_STYLE[u.title] || "bg-[#F5F5F5] text-[#616161]"}`}>{u.title}</span></td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-[#444]"><Building2 size={13} className="text-[#9E9E9E]" /> {branchName(u.branchId)}</span></td>
                    <td className="px-4 py-3 text-[#444]"><span className="inline-flex items-center gap-1"><GitBranch size={13} className="text-[#9E9E9E]" /> {userName(u.reportsTo)}</span></td>
                    <td className="px-4 py-3">{u.capacity > 0 ? (
                      <div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-[#EEE] rounded-full overflow-hidden"><div className={`h-full ${u.openLeads / u.capacity > 0.8 ? "bg-[#C62828]" : "bg-[#2E7D32]"}`} style={{ width: `${Math.min(100, (u.openLeads / u.capacity) * 100)}%` }} /></div><span className="text-xs text-[#747474]">{u.openLeads}/{u.capacity}</span></div>
                    ) : <span className="text-xs text-[#BDBDBD]">—</span>}</td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-[#EBF7EE] text-[#2E844A]" : "bg-[#F3F3F3] text-[#747474]"}`}>{u.status}</span></td>
                    <td className="px-4 py-3 relative">
                      <button onClick={() => setMenuId(menuId === u.id ? null : u.id)} className="p-1.5 rounded hover:bg-[#F0F0F0] text-[#747474]"><MoreVertical size={17} /></button>
                      {menuId === u.id && (
                        <div className="absolute right-4 top-12 z-20 w-44 bg-white rounded-lg border border-[#E5E5E5] shadow-lg py-1">
                          <button onClick={() => openEdit(u)} className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[#F3F3F3] text-[#181818]"><Edit2 size={15} /> Edit</button>
                          <button onClick={() => toggleStatus(u)} className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[#F3F3F3] text-[#181818]">{u.status === "active" ? <><UserX size={15} /> Deactivate</> : <><UserCheck size={15} /> Activate</>}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-[#A0A0A0]">No users match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit modal with branch-dependent manager list */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#181818]">{modal.id ? "Edit User" : "Add User"}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded hover:bg-[#F3F3F3] text-[#747474]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-[#181818] mb-1.5">Full Name *</label><input value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} className={input} /></div>
                <div><label className="block text-sm font-medium text-[#181818] mb-1.5">Email *</label><input value={modal.email} onChange={(e) => setModal({ ...modal, email: e.target.value })} className={input} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-[#181818] mb-1.5">Role</label>
                  <select value={modal.title} onChange={(e) => setModal({ ...modal, title: e.target.value as OrgRole })} className={input}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select>
                </div>
                <div><label className="block text-sm font-medium text-[#181818] mb-1.5 flex items-center gap-1"><Building2 size={13} /> Branch</label>
                  {/* Changing branch resets the manager (branch dependency) */}
                  <select value={modal.branchId} onChange={(e) => setModal({ ...modal, branchId: e.target.value, reportsTo: "" })} className={input}>{companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#181818] mb-1.5 flex items-center gap-1"><GitBranch size={13} /> Reports To</label>
                  <select value={modal.reportsTo} onChange={(e) => setModal({ ...modal, reportsTo: e.target.value })} className={input}>
                    <option value="">— None (top of branch) —</option>
                    {managersForBranch(modal.branchId).filter((m) => m.id !== modal.id).map((m) => <option key={m.id} value={m.id}>{m.name} · {m.title}</option>)}
                  </select>
                  <p className="text-xs text-[#9E9E9E] mt-1">Managers are limited to the selected branch.</p>
                </div>
                <div><label className="block text-sm font-medium text-[#181818] mb-1.5">Lead Capacity</label><input type="number" value={modal.capacity} onChange={(e) => setModal({ ...modal, capacity: Number(e.target.value) })} className={input} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#181818] mb-1.5">Status</label>
                <div className="flex gap-2">
                  {(["active", "inactive"] as const).map((st) => (
                    <button key={st} onClick={() => setModal({ ...modal, status: st })} className={`flex-1 h-10 rounded text-sm font-medium border capitalize ${modal.status === st ? "bg-[#E3F2FD] border-[#1565C0] text-[#1565C0]" : "border-[#E0E0E0] text-[#747474] hover:bg-[#F5F5F5]"}`}>{st}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[#E5E5E5] flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 h-10 rounded border border-[#C9C9C9] text-sm font-medium text-[#444] hover:bg-[#F3F3F3]">Cancel</button>
              <button onClick={save} className="px-5 h-10 rounded bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5"><Check size={16} /> {modal.id ? "Save Changes" : "Add User"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
