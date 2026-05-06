import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { KeyRound, AlertTriangle, Calendar, Clock, Search, Download, Eye, ShieldCheck, MoreHorizontal, X, Building2 } from "lucide-react";

const licenses = [
  { id: "LIC-2026-00142", tenant: "Everest Digital Solutions", type: "Enterprise", planType: "Enterprise Basic", status: "Active", used: 7840, total: 10000, start: "2026-01-01", end: "2026-12-31", override: true, grace: false, customerType: "business" },
  { id: "LIC-2026-00138", tenant: "Himalayan Tech Services", type: "Enterprise Plus", planType: "Enterprise Plus", status: "Active", used: 42100, total: 50000, start: "2026-01-01", end: "2026-12-31", override: false, grace: false, customerType: "business" },
  { id: "LIC-2026-00135", tenant: "KTM Software Labs", type: "Enterprise", planType: "Enterprise Basic", status: "Suspended", used: 4800, total: 5000, start: "2026-01-01", end: "2026-06-30", override: false, grace: false, customerType: "business" },
  { id: "LIC-2026-00129", tenant: "Nepal Cloud Computing", type: "Enterprise", planType: "Enterprise Basic", status: "Expired", used: 10000, total: 10000, start: "2025-06-01", end: "2026-03-20", override: false, grace: false, customerType: "business" },
  { id: "LIC-2026-00125", tenant: "Pokhara InfoTech", type: "Enterprise Plus", planType: "Enterprise Plus", status: "Active", used: 15200, total: 50000, start: "2026-01-01", end: "2026-12-31", override: false, grace: false, customerType: "business" },
  { id: "LIC-2026-00121", tenant: "Lumbini Digital Agency", type: "Enterprise", planType: "Enterprise Basic", status: "Active", used: 4600, total: 5000, start: "2026-01-01", end: "2026-06-30", override: false, grace: true, customerType: "business" },
  { id: "LIC-2026-00118", tenant: "Chitwan Business Solutions", type: "Enterprise Custom", planType: "Enterprise Custom", status: "Active", used: 8900, total: 10000, start: "2026-01-01", end: "2026-12-31", override: true, grace: false, customerType: "business" },
];

export function LicenseManagement() {
  const [showOverride, setShowOverride] = useState(false);
  const [showGrace, setShowGrace] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Licenses" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Active Licenses" value="215" icon={KeyRound} color="primary" />
          <StatCard title="High Usage (>90%)" value="18" icon={AlertTriangle} color="warning" />
          <StatCard title="Expiring This Week" value="5" icon={Calendar} color="error" />
          <StatCard title="Grace Active" value="2" icon={Clock} color="purple" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input className="h-10 pl-9 pr-4 w-[320px] border border-[#E0E0E0] rounded-md bg-white text-sm focus:border-[#1565C0] outline-none" placeholder="Search licenses..." />
          </div>
          <button className="h-10 px-4 text-[#1565C0] hover:bg-[#E3F2FD] rounded-md flex items-center gap-2 text-sm"><Download size={16} /> Export</button>
        </div>

        <div className="bg-white rounded-lg border border-[#E0E0E0] shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] border-b">
                  {["License Number", "Tenant", "Type", "Status", "AI Minutes Usage", "Validity Period", "Override", "Grace", "Actions"].map(h => (
                    <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-[#616161] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {licenses.map(l => {
                  const expiryDays = Math.ceil((new Date(l.end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={l.id} className="border-b border-[#EEEEEE] h-[52px] hover:bg-[#F5F5F5] group relative">
                      <td className="px-3 font-mono text-[#1565C0] relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1565C0] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                        <button 
                          onClick={() => navigate(`/admin/licenses/${l.id}`)}
                          className="hover:underline"
                        >
                          {l.id}
                        </button>
                      </td>
                      <td className="px-3 font-medium text-[#212121]">{l.tenant}</td>
                      <td className="px-3"><StatusBadge status={l.type} /></td>
                      <td className="px-3"><StatusBadge status={l.status} /></td>
                      <td className="px-3 w-[180px]"><ProgressBar value={l.used} max={l.total} /></td>
                      <td className={`px-3 text-xs ${expiryDays < 7 ? "text-[#C62828] font-medium" : "text-[#616161]"}`}>{l.start} — {l.end}</td>
                      <td className="px-3">{l.override && <ShieldCheck size={16} className="text-[#1565C0]" />}</td>
                      <td className="px-3">{l.grace && <Clock size={16} className="text-[#6A1B9A]" />}</td>
                      <td className="px-3">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => navigate(`/admin/licenses/${l.id}`)}
                            className="w-8 h-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]" 
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button onClick={() => setShowOverride(true)} className="w-8 h-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]" title="Override"><ShieldCheck size={14} /></button>
                          <button onClick={() => setShowGrace(true)} className="w-8 h-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]" title="More"><MoreHorizontal size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Override Modal */}
        {showOverride && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowOverride(false)}>
            <div className="bg-white rounded-xl max-w-[640px] w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b"><h3>Override License Limits</h3><button onClick={() => setShowOverride(false)}><X size={16} /></button></div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#616161]">Adjust limits for Everest Digital Solutions</p>
                {[{ label: "Total AI Minutes", current: "10,000", field: "minutes" }, { label: "Max Agents", current: "15", field: "agents" }, { label: "Max Concurrent Calls", current: "15", field: "calls" }].map(item => (
                  <div key={item.field} className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm">{item.label}</label>
                    <div className="text-sm text-[#9E9E9E]">Current: {item.current}</div>
                    <input className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" placeholder="New value" />
                  </div>
                ))}
                <div>
                  <label className="block mb-1">Override Reason <span className="text-[#C62828]">*</span></label>
                  <textarea className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" rows={3} placeholder="Minimum 20 characters required..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={() => setShowOverride(false)} className="h-10 px-4 rounded-md border border-[#1565C0] text-[#1565C0] text-sm">Cancel</button>
                <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm">Apply Override</button>
              </div>
            </div>
          </div>
        )}

        {/* Grace Modal */}
        {showGrace && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowGrace(false)}>
            <div className="bg-white rounded-xl max-w-[540px] w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b"><h3>Grant Grace Extension</h3><button onClick={() => setShowGrace(false)}><X size={16} /></button></div>
              <div className="p-6 space-y-4">
                <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-md p-3 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-[#F57F17] mt-0.5" />
                  <span className="text-sm text-[#F57F17]">Grace minutes are billed at overage rates</span>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Grace Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="radio" name="grace" defaultChecked /> Additional Minutes</label>
                    <label className="flex items-center gap-2 text-sm"><input type="radio" name="grace" /> Date Extension</label>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Additional Minutes</label>
                  <input type="number" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" placeholder="500" />
                </div>
                <div>
                  <label className="block mb-1">Reason <span className="text-[#C62828]">*</span></label>
                  <textarea className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={() => setShowGrace(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Cancel</button>
                <button className="h-10 px-5 rounded-md bg-[#F57F17] text-white text-sm hover:bg-[#E65100]">Grant Grace</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}