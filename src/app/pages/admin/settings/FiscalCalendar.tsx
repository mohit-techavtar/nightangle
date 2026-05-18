import React, { useState } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import {
  Save, Calendar, Plus, Trash2, AlertCircle, CheckCircle2,
  CalendarDays, Globe, Edit3, X
} from "lucide-react";

type FiscalMonth =
  | "January" | "February" | "March" | "April" | "May" | "June"
  | "July" | "August" | "September" | "October" | "November" | "December";

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "national" | "regional" | "company" | "optional";
  recurring: boolean;
  region?: string;
  description?: string;
}

interface FiscalPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "closed";
}

const MONTHS: FiscalMonth[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const HOLIDAY_TYPE_COLORS: Record<Holiday["type"], string> = {
  national: "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]",
  regional: "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]",
  company:  "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
  optional: "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]",
};

export function FiscalCalendar() {
  const [activeTab, setActiveTab] = useState<"fiscal" | "periods" | "holidays">("fiscal");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [fiscalConfig, setFiscalConfig] = useState({
    fiscalYearStart: "April" as FiscalMonth,
    fiscalYearStartDay: "1",
    fiscalYearLabelFormat: "FY-YYYY",
    weekStartsOn: "Monday",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    quartersStructure: "3-3-3-3",
    defaultRegion: "IN",
  });

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: "h1", name: "New Year's Day", date: "2026-01-01", type: "national", recurring: true, region: "IN" },
    { id: "h2", name: "Republic Day", date: "2026-01-26", type: "national", recurring: true, region: "IN" },
    { id: "h3", name: "Holi", date: "2026-03-14", type: "national", recurring: false, region: "IN" },
    { id: "h4", name: "Independence Day", date: "2026-08-15", type: "national", recurring: true, region: "IN" },
    { id: "h5", name: "Gandhi Jayanti", date: "2026-10-02", type: "national", recurring: true, region: "IN" },
    { id: "h6", name: "Diwali", date: "2026-11-08", type: "national", recurring: false, region: "IN" },
    { id: "h7", name: "Christmas Day", date: "2026-12-25", type: "national", recurring: true, region: "IN" },
    { id: "h8", name: "Annual Company Offsite", date: "2026-09-15", type: "company", recurring: false, description: "Company-wide offsite" },
    { id: "h9", name: "Founders Day", date: "2026-06-10", type: "company", recurring: true },
  ]);

  const [periods] = useState<FiscalPeriod[]>([
    { id: "fp1", name: "Q1 FY-2026 (Apr-Jun)", startDate: "2026-04-01", endDate: "2026-06-30", status: "active" },
    { id: "fp2", name: "Q2 FY-2026 (Jul-Sep)", startDate: "2026-07-01", endDate: "2026-09-30", status: "upcoming" },
    { id: "fp3", name: "Q3 FY-2026 (Oct-Dec)", startDate: "2026-10-01", endDate: "2026-12-31", status: "upcoming" },
    { id: "fp4", name: "Q4 FY-2026 (Jan-Mar)", startDate: "2027-01-01", endDate: "2027-03-31", status: "upcoming" },
  ]);

  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [newHoliday, setNewHoliday] = useState<Omit<Holiday, "id">>({
    name: "", date: "", type: "company", recurring: false, description: "",
  });

  const handleFiscalChange = (field: keyof typeof fiscalConfig, value: any) => {
    setFiscalConfig({ ...fiscalConfig, [field]: value });
    setHasChanges(true);
  };

  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      alert("Please enter a holiday name and date");
      return;
    }
    if (editingHoliday) {
      setHolidays(holidays.map(h => h.id === editingHoliday.id ? { ...editingHoliday, ...newHoliday } : h));
    } else {
      setHolidays([...holidays, { ...newHoliday, id: `h-${Date.now()}` }]);
    }
    setShowAddHoliday(false);
    setEditingHoliday(null);
    setNewHoliday({ name: "", date: "", type: "company", recurring: false, description: "" });
    setHasChanges(true);
  };

  const handleEditHoliday = (h: Holiday) => {
    setEditingHoliday(h);
    setNewHoliday({ name: h.name, date: h.date, type: h.type, recurring: h.recurring, region: h.region, description: h.description });
    setShowAddHoliday(true);
  };

  const handleDeleteHoliday = (id: string) => {
    if (!confirm("Delete this holiday?")) return;
    setHolidays(holidays.filter(h => h.id !== id));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Fiscal Year & Holidays" }]} mode="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2">Fiscal Year & Holiday Calendar</h2>
              <p className="text-sm text-[#616161]">Configure your fiscal calendar, quarters, and organization holidays</p>
            </div>
            <div className="flex items-center gap-3">
              {showSuccess && <div className="flex items-center gap-2 text-sm text-[#2E7D32] bg-[#E8F5E9] px-4 py-2 rounded-md"><CheckCircle2 size={16} /> Saved</div>}
              {hasChanges && !showSuccess && <div className="flex items-center gap-2 text-sm text-[#F57F17]"><AlertCircle size={16} /> Unsaved changes</div>}
              <button onClick={handleSave} disabled={!hasChanges || isSaving} className="inline-flex items-center gap-2 px-5 h-10 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] disabled:opacity-50 disabled:cursor-not-allowed">
                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-lg">
            <div className="flex border-b border-[#E0E0E0]">
              {[
                { id: "fiscal", label: "Fiscal Year", icon: Calendar },
                { id: "periods", label: "Quarters & Periods", icon: CalendarDays },
                { id: "holidays", label: "Holidays", icon: Globe },
              ].map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${active ? "border-[#1565C0] text-[#1565C0] bg-[#E3F2FD]/40" : "border-transparent text-[#616161] hover:text-[#212121] hover:bg-[#F5F5F5]"}`}>
                    <Icon size={16} /> {t.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === "fiscal" && (
                <div className="space-y-6">
                  <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-md p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-[#1565C0] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#1565C0]">Changes affect all reports, forecasts, and dashboards. Existing data is preserved.</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-1">Fiscal Year Starts In</label>
                      <select value={fiscalConfig.fiscalYearStart} onChange={(e) => handleFiscalChange("fiscalYearStart", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <p className="text-xs text-[#616161] mt-1">Common: April (India), January (Calendar), July (US Govt)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-1">Start Day</label>
                      <input type="number" min="1" max="28" value={fiscalConfig.fiscalYearStartDay} onChange={(e) => handleFiscalChange("fiscalYearStartDay", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-1">Label Format</label>
                      <select value={fiscalConfig.fiscalYearLabelFormat} onChange={(e) => handleFiscalChange("fiscalYearLabelFormat", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                        <option value="FY-YYYY">FY-2026</option>
                        <option value="YYYY-YY">2026-27</option>
                        <option value="FY YYYY-YY">FY 2026-27</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-1">Week Starts On</label>
                      <select value={fiscalConfig.weekStartsOn} onChange={(e) => handleFiscalChange("weekStartsOn", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                        <option>Monday</option><option>Sunday</option><option>Saturday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-1">Quarter Structure</label>
                      <select value={fiscalConfig.quartersStructure} onChange={(e) => handleFiscalChange("quartersStructure", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                        <option value="3-3-3-3">Standard (3-3-3-3 months)</option>
                        <option value="4-4-5">4-4-5 weeks</option>
                        <option value="4-5-4">4-5-4 weeks</option>
                        <option value="5-4-4">5-4-4 weeks</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-1">Default Region</label>
                      <select value={fiscalConfig.defaultRegion} onChange={(e) => handleFiscalChange("defaultRegion", e.target.value)} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                        <option value="IN">India</option><option value="US">United States</option>
                        <option value="UK">United Kingdom</option><option value="NP">Nepal</option><option value="AE">UAE</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-md p-4">
                    <h4 className="text-sm font-semibold text-[#212121] mb-3">Working Days</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => {
                        const active = fiscalConfig.workingDays.includes(day);
                        return (
                          <button key={day} onClick={() => {
                            const updated = active ? fiscalConfig.workingDays.filter(d => d !== day) : [...fiscalConfig.workingDays, day];
                            handleFiscalChange("workingDays", updated);
                          }} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${active ? "bg-[#1565C0] text-white border-[#1565C0]" : "bg-white text-[#616161] border-[#E0E0E0] hover:border-[#1565C0]"}`}>
                            {day.slice(0,3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "periods" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#212121]">Fiscal Quarters</h4>
                    <span className="text-xs text-[#616161]">Auto-generated from fiscal year settings</span>
                  </div>
                  <div className="overflow-hidden border border-[#E0E0E0] rounded-md">
                    <table className="w-full text-sm">
                      <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">Period</th>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">Start</th>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">End</th>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E0E0E0]">
                        {periods.map(p => (
                          <tr key={p.id} className="hover:bg-[#FAFAFA]">
                            <td className="px-4 py-3 font-medium text-[#212121]">{p.name}</td>
                            <td className="px-4 py-3 text-[#616161]">{new Date(p.startDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-[#616161]">{new Date(p.endDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${p.status === "active" ? "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]" : p.status === "upcoming" ? "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]" : "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]"}`}>{p.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "holidays" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#212121]">Holiday Calendar</h4>
                      <p className="text-xs text-[#616161]">Holidays impact campaign scheduling, SLAs and capacity planning</p>
                    </div>
                    <button onClick={() => { setEditingHoliday(null); setNewHoliday({ name: "", date: "", type: "company", recurring: false, description: "" }); setShowAddHoliday(true); }} className="inline-flex items-center gap-2 px-4 h-9 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
                      <Plus size={16} /> Add Holiday
                    </button>
                  </div>
                  <div className="overflow-hidden border border-[#E0E0E0] rounded-md">
                    <table className="w-full text-sm">
                      <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">Holiday</th>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">Date</th>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">Type</th>
                          <th className="text-left px-4 py-2 font-medium text-[#616161] text-xs uppercase">Recurring</th>
                          <th className="text-right px-4 py-2 font-medium text-[#616161] text-xs uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E0E0E0]">
                        {sortedHolidays.map(h => (
                          <tr key={h.id} className="hover:bg-[#FAFAFA]">
                            <td className="px-4 py-3">
                              <div className="font-medium text-[#212121]">{h.name}</div>
                              {h.description && <div className="text-xs text-[#9E9E9E] mt-0.5">{h.description}</div>}
                            </td>
                            <td className="px-4 py-3 text-[#616161]">{new Date(h.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</td>
                            <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${HOLIDAY_TYPE_COLORS[h.type]}`}>{h.type}</span></td>
                            <td className="px-4 py-3 text-[#616161] text-xs">{h.recurring ? "Annually" : "One-time"}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => handleEditHoliday(h)} className="p-1.5 rounded hover:bg-[#E3F2FD] text-[#1565C0] mr-1"><Edit3 size={14} /></button>
                              <button onClick={() => handleDeleteHoliday(h.id)} className="p-1.5 rounded hover:bg-[#FFEBEE] text-[#C62828]"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                        {sortedHolidays.length === 0 && (
                          <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#9E9E9E]">No holidays added.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddHoliday && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#E0E0E0]">
              <h3 className="text-lg font-semibold text-[#212121]">{editingHoliday ? "Edit Holiday" : "Add Holiday"}</h3>
              <button onClick={() => { setShowAddHoliday(false); setEditingHoliday(null); }} className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Holiday Name *</label>
                <input type="text" value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} placeholder="e.g. Diwali" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Date *</label>
                <input type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Type</label>
                <select value={newHoliday.type} onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value as Holiday["type"] })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option value="national">National</option><option value="regional">Regional</option>
                  <option value="company">Company</option><option value="optional">Optional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Description</label>
                <textarea value={newHoliday.description || ""} onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })} rows={2} className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#212121] cursor-pointer">
                <input type="checkbox" checked={newHoliday.recurring} onChange={(e) => setNewHoliday({ ...newHoliday, recurring: e.target.checked })} className="accent-[#1565C0]" />
                Repeats annually
              </label>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-[#E0E0E0]">
              <button onClick={() => { setShowAddHoliday(false); setEditingHoliday(null); }} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5]">Cancel</button>
              <button onClick={handleAddHoliday} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">{editingHoliday ? "Update" : "Add"} Holiday</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
