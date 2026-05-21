import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useCrmData, type Account, type AccountType } from "../../hooks/useCrmData";
import { useCompanies } from "../../hooks/useCompanies";
import {
  Building2, Search, Plus, Users, Handshake, TrendingUp, X, Globe,
  MapPin, ChevronRight, Network, Briefcase,
} from "lucide-react";

const TYPE_COLORS: Record<AccountType, string> = {
  Customer: "bg-[#E8F5E9] text-[#2E7D32]",
  Prospect: "bg-[#E3F2FD] text-[#1565C0]",
  Partner: "bg-[#F3E5F5] text-[#7B1FA2]",
  Vendor: "bg-[#FFF8E1] text-[#F57F17]",
  Competitor: "bg-[#FFEBEE] text-[#C62828]",
};

const fmtCurrency = (n?: number) => n ? `₹${(n / 100000).toFixed(1)}L` : "—";

export function Accounts() {
  const navigate = useNavigate();
  const { accounts, contactsForAccount, createAccount } = useCrmData();
  const { companies } = useCompanies();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AccountType | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [localAccounts, setLocalAccounts] = useState<Account[]>(accounts);

  const branchName = (id?: string) => companies.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => localAccounts.filter((a) => {
    const matchSearch = `${a.name} ${a.industry} ${a.billingCity}`.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchSearch && matchType;
  }), [localAccounts, search, typeFilter]);

  const totals = useMemo(() => ({
    total: localAccounts.length,
    customers: localAccounts.filter((a) => a.type === "Customer").length,
    deals: localAccounts.reduce((s, a) => s + a.relatedDealIds.length, 0),
    revenue: localAccounts.reduce((s, a) => s + (a.annualRevenue || 0), 0),
  }), [localAccounts]);

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Accounts" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] flex items-center gap-2"><Building2 size={24} className="text-[#1565C0]" /> Accounts</h1>
            <p className="text-sm text-[#616161] mt-1">Organisations grouping multiple contacts and deals.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="px-4 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5"><Plus size={16} /> New Account</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Accounts", value: totals.total, icon: Building2, grad: "from-[#42A5F5] to-[#1565C0]" },
            { label: "Customers", value: totals.customers, icon: Briefcase, grad: "from-[#66BB6A] to-[#2E7D32]" },
            { label: "Associated Deals", value: totals.deals, icon: Handshake, grad: "from-[#FFB74D] to-[#F57C00]" },
            { label: "Total ARR", value: fmtCurrency(totals.revenue), icon: TrendingUp, grad: "from-[#AB47BC] to-[#6A1B9A]" },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white border border-[#E0E0E0] rounded-xl p-4">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${k.grad} text-white flex items-center justify-center mb-2`}><Icon size={18} /></div>
                <div className="text-2xl font-semibold text-[#212121]">{k.value}</div>
                <div className="text-xs text-[#9E9E9E]">{k.label}</div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-4 max-md:flex-col">
          <div className="relative flex-1 max-md:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search accounts…"
              className="w-full h-11 pl-11 pr-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] bg-white">
            <option value="all">All types</option>
            {(["Customer", "Prospect", "Partner", "Vendor", "Competitor"] as AccountType[]).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => {
            const contactCount = contactsForAccount(a.id).length;
            const isParent = localAccounts.some((x) => x.parentAccountId === a.id);
            return (
              <div key={a.id} onClick={() => navigate(`/tenant/accounts/${a.id}`)}
                className="bg-white border border-[#E0E0E0] rounded-xl p-4 hover:shadow-md hover:border-[#1565C0]/40 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#42A5F5] to-[#1565C0] text-white flex items-center justify-center font-semibold">
                      {a.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[#212121] flex items-center gap-1.5">{a.name}</div>
                      <div className="text-xs text-[#9E9E9E]">{a.industry}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[a.type]}`}>{a.type}</span>
                </div>
                {a.parentAccountId && (
                  <div className="text-xs text-[#7B1FA2] flex items-center gap-1 mb-2"><Network size={11} /> Sub-account of {localAccounts.find((x) => x.id === a.parentAccountId)?.name}</div>
                )}
                {isParent && <div className="text-xs text-[#1565C0] flex items-center gap-1 mb-2"><Network size={11} /> Parent account</div>}
                <div className="flex items-center gap-3 text-xs text-[#616161] mb-3">
                  {a.billingCity && <span className="flex items-center gap-1"><MapPin size={11} /> {a.billingCity}</span>}
                  {a.website && <span className="flex items-center gap-1 truncate"><Globe size={11} /> {a.website.replace("https://", "")}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0] text-sm">
                  <span className="flex items-center gap-1.5 text-[#616161]"><Users size={14} className="text-[#1565C0]" /> {contactCount} contacts</span>
                  <span className="flex items-center gap-1.5 text-[#616161]"><Handshake size={14} className="text-[#F57C00]" /> {a.relatedDealIds.length} deals</span>
                  <span className="font-medium text-[#212121]">{fmtCurrency(a.annualRevenue)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && <AddAccountModal companies={companies} accounts={localAccounts} onClose={() => setShowAdd(false)} onCreate={(data) => { const a = createAccount(data); setLocalAccounts((p) => [a, ...p]); setShowAdd(false); }} />}
    </div>
  );
}

function AddAccountModal({ companies, accounts, onClose, onCreate }: { companies: { id: string; name: string }[]; accounts: Account[]; onClose: () => void; onCreate: (data: Partial<Account>) => void }) {
  const [form, setForm] = useState<Partial<Account>>({ name: "", type: "Prospect", industry: "Technology", branchId: companies[0]?.id, parentAccountId: null });
  const set = (k: keyof Account, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const inputCls = "w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
          <h2 className="text-lg font-semibold text-[#212121]">New Account</h2>
          <button onClick={onClose} className="p-1.5 text-[#9E9E9E] hover:text-[#212121]"><X size={20} /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Account Name <span className="text-[#C62828]">*</span></label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Type</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls}>
              {["Customer", "Prospect", "Partner", "Vendor", "Competitor"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Industry</label>
            <input value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Branch</label>
            <select value={form.branchId} onChange={(e) => set("branchId", e.target.value)} className={inputCls}>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Parent Account</label>
            <select value={form.parentAccountId ?? ""} onChange={(e) => set("parentAccountId", e.target.value || null)} className={inputCls}>
              <option value="">— None —</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Website</label>
            <input value={form.website || ""} onChange={(e) => set("website", e.target.value)} placeholder="https://" className={inputCls} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E0E0E0]">
          <button onClick={onClose} className="px-5 h-11 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">Cancel</button>
          <button onClick={() => form.name?.trim() && onCreate(form)} className="px-6 h-11 rounded-lg bg-[#1565C0] text-white text-sm font-semibold">Create Account</button>
        </div>
      </div>
    </div>
  );
}
