import React, { useState } from "react";
import {
  Phone, Mail, Users, CheckSquare, StickyNote, Calendar, Clock, X,
} from "lucide-react";
import { MitiDateField } from "../common/MitiDateField";

// ============================================================
// ActivityForm — log an activity against a Lead.
// Types mirror Salesforce: Call, Email, Meeting, Task, Note.
// Emits a structured ActivityEntry the parent timeline consumes.
// ============================================================

export type ActivityType = "call" | "email" | "meeting" | "task" | "note";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  subject: string;
  body: string;
  outcome?: string;
  direction?: "inbound" | "outbound";
  durationMin?: number;
  dueDate?: string;          // ISO
  followUpDate?: string;     // ISO
  priority?: "Low" | "Normal" | "High";
  completed: boolean;
  createdAt: string;
}

const TYPES: { key: ActivityType; label: string; icon: React.ComponentType<{ size?: number }>; grad: string }[] = [
  { key: "call",    label: "Call",    icon: Phone,      grad: "from-[#42A5F5] to-[#1565C0]" },
  { key: "email",   label: "Email",   icon: Mail,       grad: "from-[#26C6DA] to-[#00897B]" },
  { key: "meeting", label: "Meeting", icon: Users,      grad: "from-[#66BB6A] to-[#2E7D32]" },
  { key: "task",    label: "Task",    icon: CheckSquare,grad: "from-[#FFB74D] to-[#F57C00]" },
  { key: "note",    label: "Note",    icon: StickyNote, grad: "from-[#AB47BC] to-[#6A1B9A]" },
];

const CALL_OUTCOMES = ["Connected", "Left Voicemail", "No Answer", "Busy", "Wrong Number", "Callback Requested"];

interface ActivityFormProps {
  nepali?: boolean;
  onLog: (entry: ActivityEntry) => void;
  onCancel?: () => void;
}

export function ActivityForm({ nepali, onLog, onCancel }: ActivityFormProps) {
  const [type, setType] = useState<ActivityType>("call");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [outcome, setOutcome] = useState("");
  const [direction, setDirection] = useState<"inbound" | "outbound">("outbound");
  const [durationMin, setDurationMin] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [priority, setPriority] = useState<"Low" | "Normal" | "High">("Normal");
  const [createFollowUp, setCreateFollowUp] = useState(false);

  const active = TYPES.find((t) => t.key === type)!;

  const submit = () => {
    if (!subject.trim()) return;
    onLog({
      id: `act-${Date.now()}`,
      type, subject: subject.trim(), body: body.trim(),
      outcome: outcome || undefined,
      direction: type === "call" || type === "email" ? direction : undefined,
      durationMin: durationMin ? Number(durationMin) : undefined,
      dueDate: dueDate || undefined,
      followUpDate: createFollowUp ? followUpDate || undefined : undefined,
      priority,
      completed: type === "call" || type === "email" || type === "note",
      createdAt: new Date().toISOString(),
    });
    setSubject(""); setBody(""); setOutcome(""); setDurationMin(""); setDueDate(""); setFollowUpDate(""); setCreateFollowUp(false);
  };

  const inputCls = "w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20";

  return (
    <div className="border border-[#E0E0E0] rounded-xl bg-white overflow-hidden">
      {/* Type selector with gradients */}
      <div className="flex items-center gap-2 p-3 border-b border-[#E0E0E0] bg-[#FAFAFA] overflow-x-auto">
        {TYPES.map((t) => {
          const Icon = t.icon;
          const on = t.key === type;
          return (
            <button key={t.key} onClick={() => setType(t.key)}
              className={`flex items-center gap-2 px-3.5 h-10 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                on ? `bg-gradient-to-r ${t.grad} text-white shadow-sm` : "bg-white border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"
              }`}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
        {onCancel && (
          <button onClick={onCancel} className="ml-auto p-2 text-[#9E9E9E] hover:text-[#212121]"><X size={18} /></button>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1.5">Subject <span className="text-[#C62828]">*</span></label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={`${active.label} subject…`} className={inputCls} />
        </div>

        {(type === "call" || type === "email") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Direction</label>
              <div className="flex gap-2">
                {(["outbound", "inbound"] as const).map((d) => (
                  <button key={d} onClick={() => setDirection(d)}
                    className={`flex-1 h-11 rounded-lg text-sm font-medium capitalize border transition-colors ${direction === d ? "bg-[#E3F2FD] border-[#1565C0] text-[#1565C0]" : "border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {type === "call" && (
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1.5">Outcome</label>
                <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className={inputCls}>
                  <option value="">Select outcome…</option>
                  {CALL_OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {type === "call" && (
          <div className="md:w-1/2">
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Duration (minutes)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={16} />
              <input type="number" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} className={inputCls.replace("px-3", "pl-10 pr-3")} placeholder="0" />
            </div>
          </div>
        )}

        {type === "task" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MitiDateField label="Due Date" value={dueDate} onChange={setDueDate} nepali={nepali} />
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Priority</label>
              <div className="flex gap-2">
                {(["Low", "Normal", "High"] as const).map((p) => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`flex-1 h-11 rounded-lg text-sm font-medium border transition-colors ${
                      priority === p
                        ? p === "High" ? "bg-[#FFEBEE] border-[#C62828] text-[#C62828]" : p === "Normal" ? "bg-[#E3F2FD] border-[#1565C0] text-[#1565C0]" : "bg-[#F5F5F5] border-[#9E9E9E] text-[#616161]"
                        : "border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1.5">{type === "note" ? "Note" : "Details / Comments"}</label>
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add details…"
            className="w-full min-h-[80px] px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20" />
        </div>

        {(type === "call" || type === "email" || type === "meeting") && (
          <div className="rounded-lg border border-[#E0E0E0] p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={createFollowUp} onChange={(e) => setCreateFollowUp(e.target.checked)} className="w-4 h-4 accent-[#1565C0]" />
              <span className="text-sm font-medium text-[#212121]">Schedule a follow-up</span>
            </label>
            {createFollowUp && (
              <div className="mt-3 md:w-1/2">
                <MitiDateField label="Follow-up Date" value={followUpDate} onChange={setFollowUpDate} nepali={nepali} />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-1">
          {onCancel && <button onClick={onCancel} className="px-5 h-11 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">Cancel</button>}
          <button onClick={submit} disabled={!subject.trim()}
            className={`px-6 h-11 rounded-lg text-white text-sm font-semibold transition-all bg-gradient-to-r ${active.grad} ${!subject.trim() ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}>
            Log {active.label}
          </button>
        </div>
      </div>
    </div>
  );
}
