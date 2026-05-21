import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useCrmData, type Contact } from "../../hooks/useCrmData";
import { useCompanies } from "../../hooks/useCompanies";
import {
  Building2, ChevronLeft, Users, Handshake, Globe, Phone, MapPin, Star,
  Plus, Mail, TrendingUp, Network, X, Briefcase,
} from "lucide-react";

const fmtCurrency = (n?: number) => n ? `₹${(n / 100000).toFixed(1)}L` : "—";

export function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, getAccount, contactsForAccount, childAccounts, createContact, linkContactToAccount } = useCrmData();
  const { companies } = useCompanies();

  const account = getAccount(id);
  const [tab, setTab] = useState<"contacts" | "deals" | "details">("contacts");
  const [showAddContact, setShowAddContact] = useState(false);
  const [extraContacts, setExtraContacts] = useState<Contact[]>([]);

  if (!account) {
    return (
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Accounts" }, { label: "Not found" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />
        <div className="flex-1 flex items-center justify-center text-[#9E9E9E]">Account not found.</div>
      </div>
    );
  }

  const branchName = companies.find((c) => c.id === account.branchId)?.name ?? "—";
  const contacts = [...contactsForAccount(account.id), ...extraContacts];
  const subs = childAccounts(account.id);
  const parent = accounts.find((a) => a.id === account.parentAccountId);

  // mock deals derived from relatedDealIds
  const deals = account.relatedDealIds.map((d, i) => ({
    id: d, name: `${account.name} — Opportunity ${i + 1}`,
    stage: ["Qualification", "Proposal Sent", "Negotiation"][i % 3],
    amount: (account.annualRevenue || 1000000) * (0.05 + i * 0.03),
  }));

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Accounts", path: "/tenant/accounts" }, { label: account.name }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto p-6 max-w-6xl w-full mx-auto">
        <button onClick={() => navigate("/tenant/accounts")} className="text-sm text-[#616161] flex items-center gap-1 mb-4 hover:text-[#212121]"><ChevronLeft size={16} /> Back to Accounts</button>

        {/* Header */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 mb-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#42A5F5] to-[#1565C0] text-white flex items-center justify-center text-xl font-semibold">
                {account.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[#212121]">{account.name}</h1>
                <div className="flex items-center gap-3 text-sm text-[#616161] mt-1">
                  <span className="flex items-center gap-1"><Briefcase size={13} /> {account.industry}</span>
                  <span className="flex items-center gap-1"><Building2 size={13} /> {branchName}</span>
                  {account.website && <span className="flex items-center gap-1"><Globe size={13} /> {account.website.replace("https://", "")}</span>}
                </div>
                {parent && <div className="text-xs text-[#7B1FA2] flex items-center gap-1 mt-1"><Network size={11} /> Sub-account of {parent.name}</div>}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#E8F5E9] text-[#2E7D32]">{account.type}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#F0F0F0]">
            <div><div className="text-xs text-[#9E9E9E]">Contacts</div><div className="text-xl font-semibold text-[#212121] flex items-center gap-1.5"><Users size={18} className="text-[#1565C0]" /> {contacts.length}</div></div>
            <div><div className="text-xs text-[#9E9E9E]">Deals</div><div className="text-xl font-semibold text-[#212121] flex items-center gap-1.5"><Handshake size={18} className="text-[#F57C00]" /> {deals.length}</div></div>
            <div><div className="text-xs text-[#9E9E9E]">Annual Revenue</div><div className="text-xl font-semibold text-[#212121]">{fmtCurrency(account.annualRevenue)}</div></div>
            <div><div className="text-xs text-[#9E9E9E]">Sub-accounts</div><div className="text-xl font-semibold text-[#212121] flex items-center gap-1.5"><Network size={18} className="text-[#7B1FA2]" /> {subs.length}</div></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(["contacts", "deals", "details"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 h-10 rounded-lg text-sm font-semibold capitalize ${tab === t ? "bg-[#1565C0] text-white" : "bg-white border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>{t}</button>
          ))}
        </div>

        {tab === "contacts" && (
          <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0E0E0]">
              <span className="text-sm font-medium text-[#212121]">Related Contacts ({contacts.length})</span>
              <button onClick={() => setShowAddContact(true)} className="text-sm font-medium text-[#1565C0] flex items-center gap-1.5 hover:underline"><Plus size={15} /> Add Contact</button>
            </div>
            <div className="divide-y divide-[#F0F0F0]">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#42A5F5] to-[#1565C0] text-white flex items-center justify-center text-xs font-semibold">{c.firstName[0]}{c.lastName[0]}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#212121] flex items-center gap-1.5">{c.firstName} {c.lastName} {c.isPrimary && <Star size={12} className="text-[#F57F17] fill-[#F57F17]" />}</div>
                    <div className="text-xs text-[#9E9E9E]">{c.title}</div>
                  </div>
                  <div className="text-sm text-[#616161] flex items-center gap-3 max-md:hidden">
                    <span className="flex items-center gap-1"><Mail size={13} className="text-[#9E9E9E]" /> {c.email}</span>
                    {c.phone && <span className="flex items-center gap-1"><Phone size={13} className="text-[#9E9E9E]" /> {c.phone}</span>}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && <div className="px-4 py-10 text-center text-[#9E9E9E]">No contacts linked yet.</div>}
            </div>
          </div>
        )}

        {tab === "deals" && (
          <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E0E0E0] text-sm font-medium text-[#212121]">Associated Deals ({deals.length})</div>
            <div className="divide-y divide-[#F0F0F0]">
              {deals.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#F9FAFB]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#FFF3E0] text-[#F57C00] flex items-center justify-center"><Handshake size={16} /></div>
                    <div>
                      <div className="text-sm font-medium text-[#212121]">{d.name}</div>
                      <div className="text-xs text-[#9E9E9E]">{d.stage}</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#212121] flex items-center gap-1"><TrendingUp size={14} className="text-[#2E7D32]" /> {fmtCurrency(d.amount)}</span>
                </div>
              ))}
              {deals.length === 0 && <div className="px-4 py-10 text-center text-[#9E9E9E]">No deals associated.</div>}
            </div>
            {subs.length > 0 && (
              <>
                <div className="px-4 py-3 border-t border-[#E0E0E0] text-sm font-medium text-[#212121]">Sub-accounts</div>
                <div className="divide-y divide-[#F0F0F0]">
                  {subs.map((s) => (
                    <div key={s.id} onClick={() => navigate(`/tenant/accounts/${s.id}`)} className="flex items-center justify-between px-4 py-3 hover:bg-[#F9FAFB] cursor-pointer">
                      <span className="text-sm font-medium text-[#1565C0] flex items-center gap-1.5"><Network size={14} /> {s.name}</span>
                      <span className="text-xs text-[#9E9E9E]">{s.type}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "details" && (
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              ["Type", account.type], ["Industry", account.industry], ["Branch", branchName],
              ["Website", account.website], ["Phone", account.phone],
              ["Billing City", account.billingCity], ["Billing State", account.billingState], ["Country", account.billingCountry],
              ["Employees", account.employeeCount?.toString()], ["Annual Revenue", fmtCurrency(account.annualRevenue)], ["Rating", account.rating],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-xs text-[#9E9E9E]">{k}</span>
                <span className="text-[#212121] font-medium">{v || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddContact && (
        <QuickAddContact
          onClose={() => setShowAddContact(false)}
          onAdd={(data) => {
            const c = createContact({ ...data, accountId: account.id, branchId: account.branchId });
            linkContactToAccount(c.id, account.id);
            setExtraContacts((p) => [...p, c]);
            setShowAddContact(false);
          }}
        />
      )}
    </div>
  );
}

function QuickAddContact({ onClose, onAdd }: { onClose: () => void; onAdd: (data: Partial<Contact>) => void }) {
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", title: "", phone: "", isPrimary: false });
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const inputCls = "w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20";
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
          <h2 className="text-lg font-semibold text-[#212121]">Add Contact to Account</h2>
          <button onClick={onClose} className="p-1.5 text-[#9E9E9E] hover:text-[#212121]"><X size={20} /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-[#212121] mb-1.5">First Name *</label><input value={f.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputCls} /></div>
          <div><label className="block text-sm font-medium text-[#212121] mb-1.5">Last Name *</label><input value={f.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputCls} /></div>
          <div className="col-span-2"><label className="block text-sm font-medium text-[#212121] mb-1.5">Email *</label><input value={f.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></div>
          <div><label className="block text-sm font-medium text-[#212121] mb-1.5">Title</label><input value={f.title} onChange={(e) => set("title", e.target.value)} className={inputCls} /></div>
          <div><label className="block text-sm font-medium text-[#212121] mb-1.5">Phone</label><input value={f.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></div>
          <label className="col-span-2 flex items-center gap-2 text-sm text-[#616161]"><input type="checkbox" checked={f.isPrimary} onChange={(e) => set("isPrimary", e.target.checked)} className="w-4 h-4 accent-[#1565C0]" /> Mark as primary contact</label>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E0E0E0]">
          <button onClick={onClose} className="px-5 h-11 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">Cancel</button>
          <button onClick={() => f.firstName && f.lastName && f.email && onAdd(f)} className="px-6 h-11 rounded-lg bg-[#1565C0] text-white text-sm font-semibold">Add Contact</button>
        </div>
      </div>
    </div>
  );
}
