import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useCompanies } from "../../hooks/useCompanies";
import { isNepaliLocale, todayMiti, formatMiti } from "../../lib/nepaliDate";
import { MitiDateField, DualDateLabel } from "../../components/common/MitiDateField";
import {
  Info, Lock, Globe, Calendar, CheckCircle2, Circle, Building2,
  CreditCard, Users, Workflow, Sparkles, ChevronRight, Flag,
} from "lucide-react";
import { toast } from "sonner";

const tabs = ["Company Profile", "Localization & Miti", "Initial Setup", "Business Hours", "Data & Privacy"];

export function CompanySettingsEnhanced() {
  const [tab, setTab] = useState("Company Profile");
  const { companies, getActiveCompany, updateCompany } = useCompanies();
  const hq = getActiveCompany();

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Company" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />
      <div className="flex-1 overflow-auto p-6 bg-[#F9FAFB]">
        <div className="flex gap-6 max-md:flex-col">
          <div className="w-[210px] shrink-0">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-md mb-1 transition-colors ${tab === t ? "bg-[#E3F2FD] text-[#1565C0] font-medium border-l-[3px] border-[#1565C0]" : "text-[#616161] hover:bg-[#F5F5F5]"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-3xl">
            {tab === "Company Profile" && <CompanyProfileTab />}
            {tab === "Localization & Miti" && <LocalizationTab hq={hq} updateCompany={updateCompany} />}
            {tab === "Initial Setup" && <InitialSetupTab />}
            {tab === "Business Hours" && <PlaceholderTab title="Business Hours" />}
            {tab === "Data & Privacy" && <PlaceholderTab title="Data & Privacy" />}
          </div>
        </div>
      </div>
    </>
  );
}

function CompanyProfileTab() {
  return (
    <div className="space-y-6">
      <div className="bg-[#E3F2FD] border border-[#90CAF9] border-l-4 border-l-[#1565C0] rounded-md p-3 flex items-start gap-2">
        <Info size={16} className="text-[#1565C0] mt-0.5 shrink-0" />
        <span className="text-sm text-[#1565C0]">Legal company details are managed by the platform administrator. Branch-level details are configured under Companies &amp; Branches.</span>
      </div>
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
        <h4 className="mb-4 font-semibold text-[#212121]">Company Information</h4>
        <div className="space-y-3">
          {[
            { label: "Company Legal Name", value: "Everest Digital Solutions Pvt. Ltd." },
            { label: "Registered Address", value: "Durbar Marg, Ward 10, Kathmandu, Nepal" },
            { label: "PAN Number", value: "123456789" },
            { label: "Tenant Code", value: "TNT-00042" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block mb-1 text-sm text-[#212121]">{f.label}</label>
              <div className="flex items-center gap-2">
                <input value={f.value} readOnly className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-[#FAFAFA] text-[#616161] cursor-not-allowed" />
                <Lock size={14} className="text-[#9E9E9E] shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocalizationTab({ hq, updateCompany }: { hq: any; updateCompany: (id: string, patch: any) => void }) {
  const [country, setCountry] = useState(hq.address?.country || "Nepal");
  const [currency, setCurrency] = useState(hq.currency || "NPR");
  const [timezone, setTimezone] = useState(hq.timezone || "Asia/Kathmandu");
  const [mitiEnabled, setMitiEnabled] = useState(isNepaliLocale(hq.address?.country, hq.currency, hq.timezone));
  const [numerals, setNumerals] = useState<"latin" | "devanagari">("latin");
  const [sampleDate, setSampleDate] = useState(new Date().toISOString());

  const nepaliDetected = isNepaliLocale(country, currency, timezone);

  const save = () => {
    updateCompany(hq.id, { currency, timezone, address: { ...hq.address, country } });
    toast.success("Localization settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
        <h4 className="mb-1 font-semibold text-[#212121] flex items-center gap-2"><Globe size={18} className="text-[#1565C0]" /> Region &amp; Locale</h4>
        <p className="text-sm text-[#616161] mb-4">These defaults flow down to branches, forms, and date displays.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-sm text-[#212121]">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full h-11 border border-[#E0E0E0] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#1565C0]">
              {["Nepal", "India", "UAE", "USA", "Singapore"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-sm text-[#212121]">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-11 border border-[#E0E0E0] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#1565C0]">
              {["NPR", "INR", "AED", "USD", "SGD"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block mb-1.5 text-sm text-[#212121]">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full h-11 border border-[#E0E0E0] rounded-lg px-3 text-sm bg-white outline-none focus:border-[#1565C0]">
              {["Asia/Kathmandu", "Asia/Kolkata", "Asia/Dubai", "America/New_York", "Asia/Singapore"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Miti configuration — appears prominently when Nepal is detected */}
      <div className={`rounded-lg border p-5 transition-colors ${nepaliDetected ? "border-[#FFE082] bg-[#FFFDF5]" : "border-[#E0E0E0] bg-white"}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-[#212121] flex items-center gap-2"><Calendar size={18} className="text-[#E65100]" /> Nepali Date (Miti / Bikram Sambat)</h4>
          {nepaliDetected && <span className="text-xs px-2 py-1 rounded-full bg-[#FFF3E0] text-[#E65100] font-semibold">Nepal locale detected</span>}
        </div>

        {!nepaliDetected ? (
          <p className="text-sm text-[#9E9E9E]">Miti configuration becomes available when the country is set to Nepal (or currency NPR / timezone Asia/Kathmandu).</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-[#212121]">Show Miti dates across the CRM</div>
                <div className="text-xs text-[#9E9E9E]">Leads, activities, and forms will display Bikram Sambat alongside AD.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={mitiEnabled} onChange={(e) => setMitiEnabled(e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-[#E0E0E0] rounded-full peer peer-checked:bg-[#E65100] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>

            {mitiEnabled && (
              <>
                <div>
                  <label className="block mb-1.5 text-sm text-[#212121]">Numerals</label>
                  <div className="flex gap-2">
                    {(["latin", "devanagari"] as const).map((n) => (
                      <button key={n} onClick={() => setNumerals(n)} className={`px-4 h-10 rounded-lg text-sm font-medium border capitalize ${numerals === n ? "bg-[#FFF3E0] border-[#E65100] text-[#E65100]" : "border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>
                        {n === "devanagari" ? "Devanagari (०१२)" : "Latin (012)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                  <MitiDateField label="Try the Miti picker" value={sampleDate} onChange={setSampleDate} nepali numerals={numerals} />
                  <div className="bg-white border border-[#E0E0E0] rounded-lg p-3">
                    <div className="text-xs text-[#9E9E9E] mb-1">Selected date</div>
                    <DualDateLabel iso={sampleDate} nepali numerals={numerals} />
                  </div>
                </div>

                <div className="bg-[#FFF3E0] rounded-lg p-3 text-sm text-[#5D4037]">
                  Today is <span className="font-semibold">{todayMiti({ numerals })}</span> ({formatMiti(new Date(), { numerals: "latin", withWeekday: true })}).
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-[#616161] text-sm">Discard</button>
        <button onClick={save} className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Save Changes</button>
      </div>
    </div>
  );
}

const SETUP_STEPS = [
  { key: "profile", title: "Company Profile", desc: "Legal name, address, tax IDs", icon: Building2, done: true },
  { key: "localization", title: "Localization & Miti", desc: "Country, currency, Nepali date", icon: Globe, done: true },
  { key: "branches", title: "Branches & Hierarchy", desc: "Set up offices and reporting lines", icon: Workflow, done: true },
  { key: "team", title: "Invite Your Team", desc: "Add users and assign roles", icon: Users, done: false },
  { key: "forms", title: "Configure Forms", desc: "Customise lead & contact layouts", icon: Sparkles, done: false },
  { key: "billing", title: "Billing & Plan", desc: "Confirm subscription and credits", icon: CreditCard, done: false },
];

function InitialSetupTab() {
  const [steps, setSteps] = useState(SETUP_STEPS);
  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  const toggle = (key: string) => setSteps((p) => p.map((s) => s.key === key ? { ...s, done: !s.done } : s));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1565C0] to-[#0D47A1] rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Flag size={20} /><h4 className="font-semibold">Onboarding Progress</h4></div>
          <span className="text-2xl font-bold">{pct}%</span>
        </div>
        <div className="w-full h-2.5 bg-white/25 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-white/80 mt-2">{completed} of {steps.length} steps complete. Finish setup to unlock the full CRM.</p>
      </div>

      <div className="space-y-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className={`flex items-center gap-4 bg-white border rounded-xl p-4 transition-colors ${s.done ? "border-[#A5D6A7]" : "border-[#E0E0E0]"}`}>
              <button onClick={() => toggle(s.key)} className="shrink-0">
                {s.done ? <CheckCircle2 size={24} className="text-[#2E7D32]" /> : <Circle size={24} className="text-[#BDBDBD]" />}
              </button>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.done ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#E3F2FD] text-[#1565C0]"}`}><Icon size={20} /></div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#212121]">Step {i + 1}: {s.title}</div>
                <div className="text-xs text-[#9E9E9E]">{s.desc}</div>
              </div>
              {!s.done && <button className="text-sm font-medium text-[#1565C0] flex items-center gap-1 hover:underline">Set up <ChevronRight size={15} /></button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 text-center text-[#9E9E9E]">
      <p>{title} settings (existing configuration preserved).</p>
    </div>
  );
}
