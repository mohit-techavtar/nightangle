import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useCrmData, type Contact } from "../../hooks/useCrmData";
import { useFormConfig } from "../../hooks/useFormConfig";
import { useOrgHierarchy } from "../../hooks/useOrgHierarchy";
import { useCompanies } from "../../hooks/useCompanies";
import { allFields } from "../../lib/formSchema";
import { DynamicForm, type OptionItem } from "../../components/forms/DynamicForm";
import { ContactImportWizard } from "../../components/forms/ContactImportWizard";
import {
  Search, Plus, Upload, Download, Settings2, Mail, Phone, Building2,
  Star, Filter, X, Users, MapPin, ChevronDown, MoreHorizontal, Contact as ContactIcon,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-[#E8F5E9] text-[#2E7D32]",
  Inactive: "bg-[#FFEBEE] text-[#C62828]",
  Lead: "bg-[#FFF8E1] text-[#F57F17]",
};

export function ContactsEnhanced() {
  const navigate = useNavigate();
  const {
    contacts, accounts, createContact, bulkCreateContacts, deleteContact,
  } = useCrmData();
  const { schema } = useFormConfig("contact");
  const { users } = useOrgHierarchy();
  const { companies } = useCompanies();

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [localContacts, setLocalContacts] = useState<Contact[]>(contacts);

  // option sources for the configurable form (account / owner / branch lookups)
  const optionSources: Record<string, OptionItem[]> = useMemo(() => ({
    accountId: accounts.map((a) => ({ value: a.id, label: a.name })),
    ownerId: users.map((u) => ({ value: u.id, label: u.name })),
    branchId: companies.map((c) => ({ value: c.id, label: c.name })),
  }), [accounts, users, companies]);

  const accountName = (id?: string | null) => accounts.find((a) => a.id === id)?.name ?? "—";
  const branchName = (id?: string) => companies.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => localContacts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = `${c.firstName} ${c.lastName} ${c.email} ${accountName(c.accountId)}`.toLowerCase().includes(q);
    const matchBranch = branchFilter === "all" || c.branchId === branchFilter;
    return matchSearch && matchBranch;
  }), [localContacts, search, branchFilter]);

  const handleAdd = (values: Record<string, unknown>) => {
    const created = createContact(values as Partial<Contact>);
    setLocalContacts((p) => [created, ...p]);
    setShowAdd(false);
  };

  const handleImport = (records: Record<string, string>[]) => {
    const created = bulkCreateContacts(records.map((r) => ({ ...r, status: "Active" } as Partial<Contact>)));
    setLocalContacts((p) => [...created, ...p]);
  };

  const existingEmails = useMemo(() => new Set(localContacts.map((c) => c.email.toLowerCase())), [localContacts]);
  const fieldOptions = allFields(schema).filter((f) => !f.hidden).map((f) => ({ apiName: f.apiName, label: f.label }));

  const handleExport = () => {
    const cols = ["firstName", "lastName", "email", "phone", "title", "accountId", "city", "country"];
    const header = cols.join(",");
    const rows = filtered.map((c) => cols.map((k) => `"${String((c as any)[k] ?? "")}"`).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "contacts.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Contacts" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] flex items-center gap-2"><ContactIcon size={24} className="text-[#1565C0]" /> Contacts</h1>
            <p className="text-sm text-[#616161] mt-1">{filtered.length} of {localContacts.length} contacts · across {companies.length} branches</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/tenant/settings/contact-form")} className="px-3 h-10 rounded-lg border border-[#E0E0E0] bg-white text-[#616161] text-sm font-medium hover:bg-[#F5F5F5] flex items-center gap-1.5"><Settings2 size={16} /> Configure Form</button>
            <button onClick={handleExport} className="px-3 h-10 rounded-lg border border-[#E0E0E0] bg-white text-[#616161] text-sm font-medium hover:bg-[#F5F5F5] flex items-center gap-1.5"><Download size={16} /> Export</button>
            <button onClick={() => setShowImport(true)} className="px-3 h-10 rounded-lg border border-[#2E7D32] text-[#2E7D32] text-sm font-medium hover:bg-[#E8F5E9] flex items-center gap-1.5"><Upload size={16} /> Import</button>
            <button onClick={() => setShowAdd(true)} className="px-4 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5"><Plus size={16} /> New Contact</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 max-md:flex-col">
          <div className="relative flex-1 max-md:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or account…"
              className="w-full h-11 pl-11 pr-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20" />
          </div>
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] bg-white">
            <option value="all">All branches</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr className="text-left text-[#616161]">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Account</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Branch</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-[#F0F0F0] hover:bg-[#F9FAFB] cursor-pointer" onClick={() => navigate(`/tenant/contacts/${c.id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#42A5F5] to-[#1565C0] text-white flex items-center justify-center text-xs font-semibold">
                          {c.firstName[0]}{c.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-[#212121] flex items-center gap-1.5">
                            {c.salutation ? `${c.salutation} ` : ""}{c.firstName} {c.lastName}
                            {c.isPrimary && <Star size={12} className="text-[#F57F17] fill-[#F57F17]" />}
                          </div>
                          {c.phone && <div className="text-xs text-[#9E9E9E] flex items-center gap-1"><Phone size={10} /> {c.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#616161]">{c.title || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[#1565C0] font-medium"><Building2 size={13} /> {accountName(c.accountId)}</span>
                    </td>
                    <td className="px-4 py-3 text-[#616161]"><span className="inline-flex items-center gap-1.5"><Mail size={13} className="text-[#9E9E9E]" /> {c.email}</span></td>
                    <td className="px-4 py-3 text-[#616161]">{branchName(c.branchId)}</td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[c.status || "Active"]}`}>{c.status}</span></td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { deleteContact(c.id); setLocalContacts((p) => p.filter((x) => x.id !== c.id)); }} className="p-1.5 text-[#9E9E9E] hover:text-[#C62828] rounded"><X size={16} /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-[#9E9E9E]">No contacts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add contact drawer (configurable form) */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
              <div>
                <h2 className="text-lg font-semibold text-[#212121]">New Contact</h2>
                <p className="text-xs text-[#9E9E9E]">Fields driven by your configurable contact layout (v{schema.version})</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="p-1.5 text-[#9E9E9E] hover:text-[#212121]"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <DynamicForm schema={schema} optionSources={optionSources} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel="Create Contact" />
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <ContactImportWizard
          fieldOptions={fieldOptions}
          existingEmails={existingEmails}
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}
