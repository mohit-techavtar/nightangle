import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Building2, Palette, Globe, Clock, GitBranch, Coins, Bell, ShieldCheck,
  Database, Info, Lock, Upload, Check, Plus, Trash2, IndianRupee,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Task 6 — Company Settings fully redrafted: proper flex layout
// (was overflowing), valid Tailwind, and far richer content
// organised into nine sections.
// ============================================================

const TABS = [
  { key: "profile", label: "Company Profile", icon: Building2 },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "localization", label: "Localization", icon: Globe },
  { key: "hours", label: "Business Hours", icon: Clock },
  { key: "defaults", label: "Lead & Deal Defaults", icon: GitBranch },
  { key: "currency", label: "Currency & Tax", icon: Coins },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "data", label: "Data & Privacy", icon: Database },
];

const input = "w-full h-10 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/15";
const card = "bg-white rounded-xl border border-[#E0E0E0] p-5";

export function CompanySettings() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Company" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-[#212121]">Company Settings</h1>
            <p className="text-sm text-[#616161] mt-1">Configure your organisation’s profile, branding, localization and defaults.</p>
          </div>

          <div className="flex gap-6 items-start max-md:flex-col">
            {/* Sidebar tabs */}
            <div className="w-[230px] shrink-0 max-md:w-full bg-white border border-[#E0E0E0] rounded-xl p-2">
              {TABS.map((t) => {
                const Icon = t.icon; const active = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg mb-0.5 flex items-center gap-2.5 transition-colors ${active ? "bg-[#E3F2FD] text-[#1565C0] font-medium border-l-[3px] border-[#1565C0]" : "text-[#616161] hover:bg-[#F5F5F5]"}`}>
                    <Icon size={16} /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-5">
              {tab === "profile" && <ProfileTab />}
              {tab === "branding" && <BrandingTab />}
              {tab === "localization" && <LocalizationTab />}
              {tab === "hours" && <HoursTab />}
              {tab === "defaults" && <DefaultsTab />}
              {tab === "currency" && <CurrencyTab />}
              {tab === "notifications" && <NotificationsTab />}
              {tab === "security" && <SecurityTab />}
              {tab === "data" && <DataTab />}

              {tab !== "data" && (
                <div className="flex justify-end gap-3">
                  <button className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5]">Discard</button>
                  <button onClick={() => toast.success("Settings saved")} className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]">Save Changes</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className={card}><h4 className="font-semibold text-[#212121] mb-4">{title}</h4>{children}</div>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm text-[#212121] mb-1.5">{label}</label>{children}</div>;
}
function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <button onClick={() => setOn(!on)} className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${on ? "bg-[#2E7D32]" : "bg-[#E0E0E0]"}`}><span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${on ? "translate-x-5" : ""}`} /></button>;
}

function ProfileTab() {
  return (
    <>
      <div className="bg-[#E3F2FD] border border-[#90CAF9] border-l-4 border-l-[#1565C0] rounded-lg p-3 flex items-start gap-2">
        <Info size={16} className="text-[#1565C0] mt-0.5 shrink-0" />
        <span className="text-sm text-[#1565C0]">Legal entity fields are administered by the platform. Operational fields below are editable by tenant admins.</span>
      </div>
      <Sec title="Legal Information">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {[["Company Legal Name", "Everest Digital Solutions Pvt. Ltd."], ["Registered Address", "Durbar Marg, Ward 10, Kathmandu, Nepal"], ["PAN / Tax ID", "123456789"], ["Tenant Code", "TNT-00042"]].map(([l, v]) => (
            <F key={l} label={l}><div className="flex items-center gap-2"><input value={v} readOnly className={`${input} bg-[#FAFAFA] text-[#616161] cursor-not-allowed`} /><Lock size={14} className="text-[#9E9E9E] shrink-0" /></div></F>
          ))}
        </div>
      </Sec>
      <Sec title="Primary Contact">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <F label="Contact Name"><input defaultValue="Rajesh Sharma" className={input} /></F>
          <F label="Contact Email"><input defaultValue="rajesh@everestdigital.com" className={input} /></F>
          <F label="Contact Mobile"><div className="flex"><span className="h-10 px-3 border border-r-0 border-[#E0E0E0] rounded-l-lg bg-[#F5F5F5] flex items-center text-sm text-[#616161]">+977</span><input defaultValue="9841234567" className={`${input} rounded-l-none`} /></div></F>
          <F label="Support Email"><input defaultValue="support@everestdigital.com" className={input} /></F>
        </div>
      </Sec>
    </>
  );
}

function BrandingTab() {
  const colors = ["#1565C0", "#2E7D32", "#7B1FA2", "#E65100", "#00897B", "#C62828"];
  const [accent, setAccent] = useState("#1565C0");
  return (
    <>
      <Sec title="Logo & Identity">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#42A5F5] to-[#1565C0] text-white flex items-center justify-center text-2xl font-bold">ED</div>
          <div>
            <button className="h-10 px-4 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-1.5"><Upload size={15} /> Upload Logo</button>
            <p className="text-xs text-[#9E9E9E] mt-2">PNG or SVG, up to 2MB. Square recommended.</p>
          </div>
        </div>
      </Sec>
      <Sec title="Accent Colour">
        <div className="flex items-center gap-3">
          {colors.map((c) => (
            <button key={c} onClick={() => setAccent(c)} className={`w-10 h-10 rounded-full transition-transform ${accent === c ? "ring-2 ring-offset-2 ring-[#1565C0] scale-110" : ""}`} style={{ backgroundColor: c }}>{accent === c && <Check size={16} className="text-white mx-auto" />}</button>
          ))}
        </div>
        <p className="text-xs text-[#9E9E9E] mt-3">Used across buttons, links and active states in your tenant.</p>
      </Sec>
      <Sec title="Email Sender Branding">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <F label="From Name"><input defaultValue="Everest Digital" className={input} /></F>
          <F label="Reply-To"><input defaultValue="no-reply@everestdigital.com" className={input} /></F>
        </div>
      </Sec>
    </>
  );
}

function LocalizationTab() {
  return (
    <>
      <Sec title="Region & Language">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <F label="Default Country"><select className={input} defaultValue="Nepal"><option>Nepal</option><option>India</option><option>UAE</option><option>USA</option></select></F>
          <F label="Language"><select className={input}><option>English</option><option>Nepali</option><option>Hindi</option></select></F>
          <F label="Timezone"><select className={input} defaultValue="Asia/Kathmandu"><option>Asia/Kathmandu (UTC +5:45)</option><option>Asia/Kolkata (UTC +5:30)</option><option>Asia/Dubai (UTC +4:00)</option></select></F>
          <F label="First Day of Week"><select className={input}><option>Sunday</option><option>Monday</option></select></F>
        </div>
      </Sec>
      <Sec title="Date & Number Format">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <F label="Date Format"><select className={input}><option>DD/MM/YYYY (Gregorian)</option><option>YYYY-MM-DD</option><option>Nepali BS (Miti)</option></select></F>
          <F label="Number Format"><select className={input}><option>1,00,000 (Indian)</option><option>100,000 (Western)</option></select></F>
        </div>
        <label className="flex items-center justify-between mt-4 pt-4 border-t border-[#F0F0F0]"><span className="text-sm text-[#212121]">Show Nepali Miti dates alongside Gregorian</span><Toggle defaultOn /></label>
      </Sec>
    </>
  );
}

function HoursTab() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (
    <Sec title="Weekly Schedule">
      <div className="space-y-3">
        {days.map((d) => (
          <div key={d} className="flex items-center gap-4 max-md:flex-wrap">
            <span className="w-24 text-sm text-[#212121]">{d}</span>
            <Toggle defaultOn={d !== "Saturday" && d !== "Sunday"} />
            <input type="time" defaultValue="09:00" className="h-9 border border-[#E0E0E0] rounded-lg px-2 text-sm w-28" />
            <span className="text-[#9E9E9E]">to</span>
            <input type="time" defaultValue="18:00" className="h-9 border border-[#E0E0E0] rounded-lg px-2 text-sm w-28" />
          </div>
        ))}
      </div>
    </Sec>
  );
}

function DefaultsTab() {
  return (
    <>
      <Sec title="Lead Defaults">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <F label="Default Lead Status"><select className={input}><option>New</option><option>Contacted</option></select></F>
          <F label="Default Lead Source"><select className={input}><option>Web Form</option><option>WhatsApp</option><option>Referral</option></select></F>
          <F label="Auto-assignment Rule"><select className={input}><option>Round Robin</option><option>Load Balanced</option><option>Territory</option><option>Manual</option></select></F>
          <F label="Duplicate Handling"><select className={input}><option>Warn & merge</option><option>Block</option><option>Allow</option></select></F>
        </div>
      </Sec>
      <Sec title="Deal Defaults">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <F label="Default Pipeline"><select className={input}><option>Standard Sales Pipeline</option><option>Enterprise Sales</option></select></F>
          <F label="Default Currency"><select className={input}><option>NPR</option><option>INR</option><option>USD</option></select></F>
          <F label="Won Probability Threshold"><input type="number" defaultValue={90} className={input} /></F>
          <F label="Stale Deal Alert (days)"><input type="number" defaultValue={14} className={input} /></F>
        </div>
      </Sec>
    </>
  );
}

function CurrencyTab() {
  const [rows, setRows] = useState([{ code: "NPR", rate: "1.00", primary: true }, { code: "INR", rate: "0.625", primary: false }, { code: "USD", rate: "0.0075", primary: false }]);
  return (
    <>
      <Sec title="Currencies">
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 px-3 h-10 flex items-center rounded-lg bg-[#F5F5F5] text-sm font-medium text-[#212121]">{r.code}</div>
              <div className="relative flex-1 max-w-[200px]"><IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" /><input value={r.rate} onChange={(e) => setRows((p) => p.map((x, idx) => idx === i ? { ...x, rate: e.target.value } : x))} className={`${input} pl-8`} /></div>
              {r.primary ? <span className="px-2 py-1 rounded-full text-xs bg-[#E8F5E9] text-[#2E7D32] font-medium">Base</span> : <button onClick={() => setRows((p) => p.filter((_, idx) => idx !== i))} className="p-2 text-[#C62828] hover:bg-[#FFEBEE] rounded"><Trash2 size={15} /></button>}
            </div>
          ))}
        </div>
        <button onClick={() => setRows((p) => [...p, { code: "EUR", rate: "0.0069", primary: false }])} className="mt-3 text-sm text-[#1565C0] font-medium flex items-center gap-1.5 hover:underline"><Plus size={15} /> Add currency</button>
      </Sec>
      <Sec title="Tax">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <F label="Default Tax Name"><input defaultValue="VAT" className={input} /></F>
          <F label="Default Rate (%)"><input type="number" defaultValue={13} className={input} /></F>
        </div>
      </Sec>
    </>
  );
}

function NotificationsTab() {
  return (
    <>
      <Sec title="Channel Preferences">
        {["Email Notifications", "WhatsApp Alerts", "In-App Notifications", "Daily Summary Email"].map((c) => (
          <div key={c} className="flex items-center justify-between py-2.5 border-b border-[#F0F0F0] last:border-0"><span className="text-sm text-[#212121]">{c}</span><Toggle defaultOn /></div>
        ))}
      </Sec>
      <Sec title="Alert Thresholds">
        <F label="AI Minutes Warning (%)"><input type="range" min={50} max={95} defaultValue={80} className="w-full accent-[#1565C0]" /></F>
        <div className="mt-3"><F label="Credit Critical (%)"><input type="range" min={80} max={100} defaultValue={95} className="w-full accent-[#C62828]" /></F></div>
      </Sec>
    </>
  );
}

function SecurityTab() {
  return (
    <>
      <Sec title="Authentication">
        <div className="space-y-3">
          <label className="flex items-center justify-between"><span className="text-sm text-[#212121]">Enforce 2-Factor Authentication</span><Toggle defaultOn /></label>
          <label className="flex items-center justify-between"><span className="text-sm text-[#212121]">Single Sign-On (SAML)</span><Toggle /></label>
          <F label="Session timeout (minutes)"><input type="number" defaultValue={30} className={`${input} max-w-[160px]`} /></F>
        </div>
      </Sec>
      <Sec title="IP Allowlist">
        <F label="Allowed CIDR ranges (one per line)"><textarea rows={3} defaultValue={"103.10.0.0/16\n49.244.0.0/16"} className={`${input} h-auto py-2`} /></F>
      </Sec>
    </>
  );
}

function DataTab() {
  return (
    <>
      <Sec title="Data Retention">
        <div className="flex items-center gap-2 max-w-xs"><input type="number" defaultValue={365} min={90} className={`${input} w-28`} /><span className="text-sm text-[#616161]">days</span></div>
        <p className="text-xs text-[#9E9E9E] mt-1">Minimum 90 days required by compliance policy.</p>
      </Sec>
      <Sec title="Export & Erasure">
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => toast.success("Export queued — you’ll get an email")} className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]">Export All Data</button>
          <button className="h-10 px-5 rounded-lg border border-[#C62828] text-[#C62828] text-sm font-semibold hover:bg-[#FFEBEE]">Request Data Erasure</button>
        </div>
      </Sec>
    </>
  );
}
