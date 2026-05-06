import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Plus, Pencil, Trash2, X, Mail, MessageCircle, Bell as BellIcon } from "lucide-react";

const alertRules = [
  { type: "AI Minutes Warning", severity: "warning", scope: "Global", threshold: "80%", channels: ["email", "inapp"], enabled: true },
  { type: "AI Minutes Critical", severity: "error", scope: "Global", threshold: "95%", channels: ["email", "whatsapp", "inapp"], enabled: true },
  { type: "License Expiry", severity: "info", scope: "Global", threshold: "7 days", channels: ["email", "inapp"], enabled: true },
  { type: "License Expiry Urgent", severity: "warning", scope: "Global", threshold: "3 days", channels: ["email", "whatsapp", "inapp"], enabled: true },
  { type: "Payment Failed", severity: "error", scope: "Global", threshold: "Immediate", channels: ["email", "whatsapp"], enabled: true },
  { type: "Custom Usage Alert", severity: "info", scope: "Everest Digital", threshold: "90%", channels: ["email"], enabled: false },
];

const alertHistory = [
  { time: "2026-03-25 14:32", type: "AI Minutes Warning", tenant: "Everest Digital Solutions", threshold: "80% reached", channels: "Email, In-App", status: "Sent" },
  { time: "2026-03-25 11:15", type: "License Expiry", tenant: "Nepal Cloud Computing", threshold: "Expired", channels: "Email, WhatsApp", status: "Sent" },
  { time: "2026-03-24 09:00", type: "AI Minutes Critical", tenant: "KTM Software Labs", threshold: "96% reached", channels: "Email, WhatsApp, In-App", status: "Sent" },
  { time: "2026-03-23 16:45", type: "Payment Failed", tenant: "Biratnagar Tech Hub", threshold: "Payment failed", channels: "Email, WhatsApp", status: "Failed" },
  { time: "2026-03-22 08:30", type: "License Expiry", tenant: "Chitwan Business Solutions", threshold: "7 days remaining", channels: "Email", status: "Sent" },
];

export function AlertsCenter() {
  const [tab, setTab] = useState<"rules" | "history" | "log">("rules");
  const [showCreate, setShowCreate] = useState(false);

  const sevColors: Record<string, string> = {
    warning: "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]",
    error: "bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]",
    info: "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]",
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Alerts" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1>Alerts & Notifications</h1>
        </div>

        <div className="flex gap-0 border-b border-[#E0E0E0] mb-6">
          {[{ key: "rules", label: "Alert Rules" }, { key: "history", label: "Alert History" }, { key: "log", label: "Notification Log" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-4 py-3 text-sm font-medium border-b-2 ${tab === t.key ? "border-[#1565C0] text-[#1565C0]" : "border-transparent text-[#616161]"}`}>{t.label}</button>
          ))}
        </div>

        {tab === "rules" && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowCreate(true)} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] flex items-center gap-2"><Plus size={16} /> Add Alert Rule</button>
            </div>
            <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F5F5] border-b">
                    {["Alert Type", "Scope", "Threshold", "Channels", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alertRules.map((r, i) => (
                    <tr key={i} className="border-b border-[#EEEEEE] h-[52px] hover:bg-[#F5F5F5]">
                      <td className="px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${sevColors[r.severity]}`}>{r.type}</span></td>
                      <td className="px-4">{r.scope === "Global" ? <span className="px-2 py-0.5 rounded-full bg-[#E3F2FD] text-[#1565C0] text-[11px] font-semibold">Global</span> : <span className="text-[#212121]">{r.scope}</span>}</td>
                      <td className="px-4 font-medium">{r.threshold}</td>
                      <td className="px-4">
                        <div className="flex gap-1.5">
                          {r.channels.includes("email") && <Mail size={14} className="text-[#1565C0]" />}
                          {r.channels.includes("whatsapp") && <MessageCircle size={14} className="text-[#2E7D32]" />}
                          {r.channels.includes("inapp") && <BellIcon size={14} className="text-[#F57F17]" />}
                        </div>
                      </td>
                      <td className="px-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={r.enabled} />
                          <div className="w-9 h-5 bg-[#E0E0E0] peer-checked:bg-[#2E7D32] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                      </td>
                      <td className="px-4">
                        <div className="flex gap-1">
                          <button className="w-8 h-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]"><Pencil size={14} /></button>
                          <button className="w-8 h-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#C62828] hover:bg-[#FFEBEE]"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "history" && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] border-b">
                  {["Timestamp", "Alert Type", "Tenant", "Threshold", "Channels", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alertHistory.map((a, i) => (
                  <tr key={i} className="border-b border-[#EEEEEE] h-[52px] hover:bg-[#F5F5F5]">
                    <td className="px-4 font-mono text-xs text-[#616161]">{a.time}</td>
                    <td className="px-4 font-medium">{a.type}</td>
                    <td className="px-4">{a.tenant}</td>
                    <td className="px-4 text-[#616161]">{a.threshold}</td>
                    <td className="px-4 text-[#616161]">{a.channels}</td>
                    <td className="px-4"><StatusBadge status={a.status === "Sent" ? "Active" : "Failed"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "log" && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 flex flex-col items-center justify-center min-h-[300px]">
            <BellIcon size={48} className="text-[#E0E0E0] mb-4" />
            <h3 className="text-[#616161] mb-2">Notification Log</h3>
            <p className="text-sm text-[#9E9E9E]">Detailed delivery logs for all notifications sent across channels.</p>
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
            <div className="bg-white rounded-xl max-w-[540px] w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b"><h3>Add Alert Rule</h3><button onClick={() => setShowCreate(false)}><X size={16} /></button></div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block mb-1">Alert Type <span className="text-[#C62828]">*</span></label>
                  <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    <option>AI Minutes Warning</option><option>License Expiry</option><option>Payment Failed</option><option>Custom</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Threshold</label>
                    <input className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" placeholder="80" />
                  </div>
                  <div>
                    <label className="block mb-1">Unit</label>
                    <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"><option>%</option><option>days</option></select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Channels</label>
                  <div className="flex gap-4">
                    {["Email", "WhatsApp", "In-App"].map(ch => (
                      <label key={ch} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> {ch}</label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Scope</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="radio" name="scope" defaultChecked /> Global</label>
                    <label className="flex items-center gap-2 text-sm"><input type="radio" name="scope" /> Specific Tenant</label>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Custom Message (Optional)</label>
                  <textarea className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" rows={2} />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={() => setShowCreate(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">Cancel</button>
                <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm">Create Rule</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}