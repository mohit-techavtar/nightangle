import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useCampaigns, type Campaign, type CampaignType, type CampaignChannel } from "../../hooks/useCampaigns";
import { useOrgHierarchy } from "../../hooks/useOrgHierarchy";
import {
  Target, MessageCircle, Users, Workflow, CheckCircle2, ArrowLeft, ArrowRight,
  Phone, Mail, MessageSquare, Save, Check, PhoneOutgoing, Wallet, Headphones,
  ClipboardList, Megaphone, Sparkles, IndianRupee, Zap, X, Rocket,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Task 2 — Detailed, Salesforce-styled campaign creation with full
// CRUD (create + edit + save-draft) persisted via useCampaigns.
// 6 steps: Basics → Channels → Audience → Schedule & Budget →
// Automation → Review.
// ============================================================

const SF = { blue: "#0176D3", blueHover: "#014486", soft: "#EEF4FF", border: "#C9C9C9", line: "#E5E5E5", text: "#181818", sub: "#747474" };

const STEPS = [
  { key: "basics", label: "Basics", icon: Target },
  { key: "channels", label: "Channels", icon: MessageCircle },
  { key: "audience", label: "Audience", icon: Users },
  { key: "budget", label: "Schedule & Budget", icon: Wallet },
  { key: "automation", label: "Automation", icon: Workflow },
  { key: "review", label: "Review", icon: CheckCircle2 },
];

const TYPES: { id: CampaignType; title: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "sales-outreach", title: "Sales Outreach", desc: "Reach new prospects", icon: PhoneOutgoing },
  { id: "lead-qualification", title: "Lead Qualification", desc: "Qualify and score leads", icon: ClipboardList },
  { id: "follow-up-nurture", title: "Follow-up Nurture", desc: "Nurture existing leads", icon: Sparkles },
  { id: "support-notification", title: "Support Notification", desc: "Customer support alerts", icon: Headphones },
  { id: "collections", title: "Collections", desc: "Payment reminders", icon: Wallet },
  { id: "surveys-feedback", title: "Surveys & Feedback", desc: "Gather feedback", icon: Megaphone },
];

const CHANNELS: { id: CampaignChannel; label: string; icon: React.ComponentType<{ size?: number }>; grad: string }[] = [
  { id: "ai-calling", label: "AI Voice Call", icon: Phone, grad: "from-[#42A5F5] to-[#0176D3]" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, grad: "from-[#4CD964] to-[#1FA855]" },
  { id: "email", label: "Email", icon: Mail, grad: "from-[#AB47BC] to-[#6A1B9A]" },
  { id: "sms", label: "SMS", icon: MessageSquare, grad: "from-[#FFB74D] to-[#F57C00]" },
];

const STAGES = ["New", "Contacted", "Qualified", "Proposal", "Negotiation"];
const SOURCES = ["Web Form", "WhatsApp", "Meta Ads", "Google Ads", "Referral", "IndiaMART"];

export function CreateCampaignEnhanced() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createCampaign, updateCampaign, startCampaign, getCampaignById } = useCampaigns();
  const { users } = useOrgHierarchy();
  const existing = id ? getCampaignById(id) : undefined;
  const isEdit = !!existing;

  const [step, setStep] = useState(0);
  const [d, setD] = useState<any>(() => ({
    name: existing?.name || "",
    type: existing?.type || "sales-outreach",
    objective: existing?.objective || "",
    description: existing?.description || "",
    priority: existing?.priority || "medium",
    tags: existing?.tags || [],
    primaryChannel: existing?.primaryChannel || "ai-calling",
    fallbackChannels: existing?.fallbackChannels || [],
    emailSubject: existing?.channels?.email?.subject || "",
    smsMessage: existing?.channels?.sms?.message || "",
    waTemplate: existing?.channels?.whatsapp?.templateName || "",
    agentName: existing?.channels?.aiCalling?.agentName || "Aria — Sales Closer",
    segmentStages: existing?.audienceFilter?.pipelineStages || ["New"],
    segmentSources: existing?.audienceFilter?.leadSource || [],
    scoreMin: existing?.audienceFilter?.scoreRange?.min ?? 0,
    scoreMax: existing?.audienceFilter?.scoreRange?.max ?? 100,
    owner: existing?.audienceFilter?.assignedOwner?.[0] || "all",
    audienceSize: existing?.audienceSize || 1240,
    excludeOptOut: existing?.exclusionRules?.optOutLeads ?? true,
    excludeQuiet: existing?.exclusionRules?.dndQuietHours ?? true,
    excludeActive: existing?.exclusionRules?.activeConversations ?? true,
    scheduleType: existing?.schedule?.type || "scheduled",
    startDate: existing?.schedule?.startDate || "",
    time: existing?.schedule?.time || "09:00",
    timezone: existing?.schedule?.timezone || "Asia/Kolkata",
    budgetTotal: existing?.budget?.totalCap?.toString() || "50000",
    budgetDaily: existing?.budget?.dailyLimit?.toString() || "2500",
    currency: existing?.budget?.currency || "INR",
    autoPause: existing?.budget?.autoPauseOnLimit ?? true,
    aiEnabled: existing?.aiConfig?.enabled ?? true,
    autoAssign: true, retryOnFail: true, stopOnReply: true, escalate: false,
    tagInput: "",
  }));

  const set = (k: string, v: any) => setD((p: any) => ({ ...p, [k]: v }));
  const toggleArr = (k: string, v: string) => setD((p: any) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x: string) => x !== v) : [...p[k], v] }));

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const buildPayload = (status: Campaign["status"]): Omit<Campaign, "id" | "createdAt" | "updatedAt" | "progress"> => ({
    name: d.name || "Untitled Campaign",
    type: d.type,
    status,
    description: d.description,
    objective: d.objective,
    primaryChannel: d.primaryChannel,
    fallbackChannels: d.fallbackChannels,
    audienceSize: Number(d.audienceSize) || 0,
    audienceFilter: {
      leadSource: d.segmentSources,
      pipelineStages: d.segmentStages,
      scoreRange: { min: Number(d.scoreMin) || 0, max: Number(d.scoreMax) || 100 },
      assignedOwner: d.owner === "all" ? [] : [d.owner],
    },
    exclusionRules: { optOutLeads: d.excludeOptOut, dndQuietHours: d.excludeQuiet, activeConversations: d.excludeActive },
    metrics: {},
    schedule: { type: d.scheduleType, startDate: d.startDate, time: d.time, timezone: d.timezone },
    channels: {
      ...(d.primaryChannel === "email" || d.fallbackChannels.includes("email") ? { email: { subject: d.emailSubject, templateId: "", fromName: "Everest Digital", fromEmail: "no-reply@everestdigital.com" } } : {}),
      ...(d.primaryChannel === "sms" || d.fallbackChannels.includes("sms") ? { sms: { message: d.smsMessage, sender: "EVRSTD" } } : {}),
      ...(d.primaryChannel === "whatsapp" || d.fallbackChannels.includes("whatsapp") ? { whatsapp: { templateId: "", templateName: d.waTemplate } } : {}),
      ...(d.primaryChannel === "ai-calling" || d.fallbackChannels.includes("ai-calling") ? { aiCalling: { agentId: "", agentName: d.agentName, maxAttempts: 3, callWindow: { start: "09:00", end: "18:00", timezone: d.timezone } } } : {}),
    },
    budget: { totalCap: Number(d.budgetTotal) || 0, dailyLimit: Number(d.budgetDaily) || 0, spent: existing?.budget?.spent || 0, currency: d.currency, autoPauseOnLimit: d.autoPause },
    aiConfig: { enabled: d.aiEnabled, capabilities: { decideNextChannel: true, chooseMessageVariant: true, adjustTiming: true, escalateToHuman: d.escalate, terminateEarly: false } },
    createdBy: "Rajesh Sharma",
    tags: d.tags,
    priority: d.priority,
  });

  const save = (status: Campaign["status"]) => {
    if (!d.name.trim()) { toast.error("Campaign name is required"); setStep(0); return; }
    const payload = buildPayload(status);
    if (isEdit && existing) {
      updateCampaign(existing.id, payload);
      toast.success(status === "draft" ? "Draft saved" : "Campaign updated");
    } else {
      const c = createCampaign(payload);
      if (status === "active") startCampaign(c.id);
      toast.success(status === "draft" ? "Draft saved" : "Campaign launched");
    }
    navigate("/tenant/campaigns");
  };

  const inputCls = "w-full h-10 px-3 border border-[#C9C9C9] rounded text-sm outline-none focus:border-[#0176D3] focus:ring-2 focus:ring-[#0176D3]/20";

  return (
    <div className="flex flex-col h-full bg-[#F3F3F3]">
      <TopBar breadcrumbs={[{ label: "Communication" }, { label: "Campaigns", path: "/tenant/campaigns" }, { label: isEdit ? "Edit" : "Create" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-[#F3F3F3] text-[#747474]"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-lg font-semibold text-[#181818]">{isEdit ? `Edit Campaign · ${existing?.name}` : "Create New Campaign"}</h1>
            <p className="text-xs text-[#747474]">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => save("draft")} className="px-3 h-9 rounded border border-[#C9C9C9] text-sm font-medium text-[#444] hover:bg-[#F3F3F3] flex items-center gap-1.5"><Save size={15} /> Save Draft</button>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-4 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {STEPS.map((s, i) => {
            const Icon = s.icon; const done = i < step; const active = i === step;
            return (
              <React.Fragment key={s.key}>
                <button onClick={() => i <= step && setStep(i)} className="flex flex-col items-center gap-1.5 shrink-0">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${done ? "bg-[#2E844A] text-white" : active ? "bg-[#0176D3] text-white shadow-md" : "bg-[#F3F3F3] text-[#A0A0A0] border border-[#E5E5E5]"}`}>
                    {done ? <Check size={18} /> : <Icon size={18} />}
                  </span>
                  <span className={`text-xs font-medium ${active ? "text-[#0176D3]" : done ? "text-[#181818]" : "text-[#A0A0A0]"}`}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 min-w-[36px] mx-2 mb-5 ${i < step ? "bg-[#2E844A]" : "bg-[#E5E5E5]"}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {step === 0 && (
            <Panel>
              <Lbl>Campaign Name *</Lbl>
              <input value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g., Q2 Enterprise Outreach" className={inputCls} />
              <Lbl className="mt-5">Campaign Type *</Lbl>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TYPES.map((t) => { const Icon = t.icon; const on = d.type === t.id; return (
                  <button key={t.id} onClick={() => set("type", t.id)} className={`text-left p-4 rounded-lg border transition-all ${on ? "border-[#0176D3] bg-[#EEF4FF] ring-1 ring-[#0176D3]/20" : "border-[#E5E5E5] hover:border-[#0176D3]/40"}`}>
                    <Icon size={20} className={on ? "text-[#0176D3]" : "text-[#747474]"} />
                    <div className="font-medium text-[#181818] mt-2">{t.title}</div>
                    <div className="text-xs text-[#747474]">{t.desc}</div>
                  </button>); })}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div><Lbl>Objective</Lbl><input value={d.objective} onChange={(e) => set("objective", e.target.value)} placeholder="e.g., Book 50 demos" className={inputCls} /></div>
                <div><Lbl>Priority</Lbl><select value={d.priority} onChange={(e) => set("priority", e.target.value)} className={inputCls}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              </div>
              <Lbl className="mt-5">Description</Lbl>
              <textarea rows={3} value={d.description} onChange={(e) => set("description", e.target.value)} placeholder="Campaign goals and strategy…" className={`${inputCls} h-auto py-2`} />
              <Lbl className="mt-5">Tags</Lbl>
              <div className="flex flex-wrap gap-2 items-center">
                {d.tags.map((t: string) => <span key={t} className="px-2 py-1 rounded-full text-xs bg-[#EEF4FF] text-[#0176D3] flex items-center gap-1">{t}<button onClick={() => set("tags", d.tags.filter((x: string) => x !== t))}><X size={11} /></button></span>)}
                <input value={d.tagInput} onChange={(e) => set("tagInput", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && d.tagInput.trim()) { set("tags", [...d.tags, d.tagInput.trim()]); set("tagInput", ""); } }} placeholder="Type & Enter" className="h-8 px-2 border border-[#C9C9C9] rounded text-sm outline-none focus:border-[#0176D3] w-32" />
              </div>
            </Panel>
          )}

          {step === 1 && (
            <Panel>
              <Lbl>Primary Channel</Lbl>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CHANNELS.map((c) => { const Icon = c.icon; const on = d.primaryChannel === c.id; return (
                  <button key={c.id} onClick={() => set("primaryChannel", c.id)} className={`p-4 rounded-lg border text-center transition-all ${on ? "border-[#0176D3] bg-[#EEF4FF]" : "border-[#E5E5E5] hover:border-[#0176D3]/40"}`}>
                    <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${c.grad} text-white flex items-center justify-center mb-2`}><Icon size={18} /></div>
                    <div className="text-sm font-medium text-[#181818]">{c.label}</div>
                  </button>); })}
              </div>
              <Lbl className="mt-5">Fallback Channels (in sequence)</Lbl>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.filter((c) => c.id !== d.primaryChannel).map((c) => { const on = d.fallbackChannels.includes(c.id); return (
                  <button key={c.id} onClick={() => toggleArr("fallbackChannels", c.id)} className={`px-3 h-9 rounded-full text-sm border transition-colors ${on ? "bg-[#EEF4FF] border-[#0176D3] text-[#0176D3]" : "border-[#E5E5E5] text-[#747474] hover:bg-[#F3F3F3]"}`}>{c.label}</button>); })}
              </div>
              {/* Channel-specific config */}
              <div className="mt-5 space-y-4">
                {(d.primaryChannel === "email" || d.fallbackChannels.includes("email")) && <div><Lbl>Email Subject</Lbl><input value={d.emailSubject} onChange={(e) => set("emailSubject", e.target.value)} className={inputCls} placeholder="Subject line…" /></div>}
                {(d.primaryChannel === "sms" || d.fallbackChannels.includes("sms")) && <div><Lbl>SMS Message</Lbl><textarea rows={2} value={d.smsMessage} onChange={(e) => set("smsMessage", e.target.value)} className={`${inputCls} h-auto py-2`} placeholder="Message body (DLT template)…" /></div>}
                {(d.primaryChannel === "whatsapp" || d.fallbackChannels.includes("whatsapp")) && <div><Lbl>WhatsApp Template</Lbl><input value={d.waTemplate} onChange={(e) => set("waTemplate", e.target.value)} className={inputCls} placeholder="Approved template name…" /></div>}
                {(d.primaryChannel === "ai-calling" || d.fallbackChannels.includes("ai-calling")) && <div><Lbl>AI Agent</Lbl><input value={d.agentName} onChange={(e) => set("agentName", e.target.value)} className={inputCls} /></div>}
              </div>
            </Panel>
          )}

          {step === 2 && (
            <Panel>
              <Lbl>Target by Lead Stage</Lbl>
              <ChipRow options={STAGES} selected={d.segmentStages} onToggle={(o) => toggleArr("segmentStages", o)} />
              <Lbl className="mt-5">Target by Source</Lbl>
              <ChipRow options={SOURCES} selected={d.segmentSources} onToggle={(o) => toggleArr("segmentSources", o)} />
              <div className="grid grid-cols-3 gap-4 mt-5">
                <div><Lbl>Min Score</Lbl><input type="number" value={d.scoreMin} onChange={(e) => set("scoreMin", e.target.value)} className={inputCls} /></div>
                <div><Lbl>Max Score</Lbl><input type="number" value={d.scoreMax} onChange={(e) => set("scoreMax", e.target.value)} className={inputCls} /></div>
                <div><Lbl>Owner</Lbl><select value={d.owner} onChange={(e) => set("owner", e.target.value)} className={inputCls}><option value="all">All owners</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
              </div>
              <Lbl className="mt-5">Exclusion Rules</Lbl>
              <div className="space-y-2">
                {[["excludeOptOut", "Exclude opted-out leads"], ["excludeQuiet", "Respect DND / quiet hours"], ["excludeActive", "Skip leads in active conversations"]].map(([k, label]) => (
                  <label key={k} className="flex items-center justify-between bg-white border border-[#E5E5E5] rounded-lg p-3"><span className="text-sm text-[#181818]">{label}</span><Toggle on={d[k]} onClick={() => set(k, !d[k])} /></label>
                ))}
              </div>
              <div className="mt-5 bg-[#EEF4FF] rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm text-[#0176D3] font-medium flex items-center gap-2"><Users size={16} /> Estimated Reach</span>
                <input type="number" value={d.audienceSize} onChange={(e) => set("audienceSize", e.target.value)} className="w-28 h-9 px-2 border border-[#0176D3]/30 rounded text-right text-lg font-semibold text-[#0176D3] bg-white outline-none" />
              </div>
            </Panel>
          )}

          {step === 3 && (
            <Panel>
              <Lbl>Schedule</Lbl>
              <div className="flex gap-2 mb-4">
                {[["immediate", "Send immediately"], ["scheduled", "Schedule"], ["recurring", "Recurring"]].map(([id, label]) => (
                  <button key={id} onClick={() => set("scheduleType", id)} className={`flex-1 h-10 rounded text-sm font-medium border ${d.scheduleType === id ? "bg-[#EEF4FF] border-[#0176D3] text-[#0176D3]" : "border-[#E5E5E5] text-[#747474] hover:bg-[#F3F3F3]"}`}>{label}</button>
                ))}
              </div>
              {d.scheduleType !== "immediate" && (
                <div className="grid grid-cols-3 gap-4">
                  <div><Lbl>Start Date</Lbl><input type="date" value={d.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputCls} /></div>
                  <div><Lbl>Time</Lbl><input type="time" value={d.time} onChange={(e) => set("time", e.target.value)} className={inputCls} /></div>
                  <div><Lbl>Timezone</Lbl><select value={d.timezone} onChange={(e) => set("timezone", e.target.value)} className={inputCls}><option>Asia/Kolkata</option><option>Asia/Kathmandu</option><option>Asia/Dubai</option></select></div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div><Lbl>Total Budget</Lbl><CurrencyInput value={d.budgetTotal} onChange={(v) => set("budgetTotal", v)} /></div>
                <div><Lbl>Daily Cap</Lbl><CurrencyInput value={d.budgetDaily} onChange={(v) => set("budgetDaily", v)} /></div>
              </div>
              <label className="mt-4 flex items-center justify-between bg-white border border-[#E5E5E5] rounded-lg p-3"><span className="text-sm text-[#181818]">Auto-pause when budget exhausted</span><Toggle on={d.autoPause} onClick={() => set("autoPause", !d.autoPause)} /></label>
            </Panel>
          )}

          {step === 4 && (
            <Panel>
              <label className="flex items-center justify-between bg-white border border-[#E5E5E5] rounded-lg p-4 mb-4">
                <span><span className="text-sm font-medium text-[#181818] flex items-center gap-2"><Sparkles size={15} className="text-[#0176D3]" /> AI Orchestration</span><span className="block text-xs text-[#747474]">Let AI choose channel, variant and timing per lead</span></span>
                <Toggle on={d.aiEnabled} onClick={() => set("aiEnabled", !d.aiEnabled)} />
              </label>
              <Lbl>Automation Rules</Lbl>
              <div className="space-y-2">
                {[["autoAssign", "Auto-assign responders to owners"], ["retryOnFail", "Retry on channel failure"], ["stopOnReply", "Stop sequence on reply"], ["escalate", "Escalate hot leads to a human"]].map(([k, label]) => (
                  <label key={k} className="flex items-center justify-between bg-white border border-[#E5E5E5] rounded-lg p-3"><span className="text-sm text-[#181818]">{label}</span><Toggle on={d[k]} onClick={() => set(k, !d[k])} /></label>
                ))}
              </div>
            </Panel>
          )}

          {step === 5 && (
            <Panel>
              <h3 className="text-lg font-semibold text-[#181818] mb-4">Review &amp; Launch</h3>
              <div className="space-y-2.5">
                <Row label="Name" value={d.name || "Untitled"} />
                <Row label="Type" value={TYPES.find((t) => t.id === d.type)?.title || "—"} />
                <Row label="Primary channel" value={CHANNELS.find((c) => c.id === d.primaryChannel)?.label || "—"} />
                <Row label="Fallbacks" value={d.fallbackChannels.map((id: string) => CHANNELS.find((c) => c.id === id)?.label).join(", ") || "None"} />
                <Row label="Audience" value={`${d.segmentStages.join(", ") || "All"} · score ${d.scoreMin}-${d.scoreMax} · ~${Number(d.audienceSize).toLocaleString("en-IN")} leads`} />
                <Row label="Schedule" value={d.scheduleType === "immediate" ? "Immediate" : `${d.startDate || "—"} ${d.time}`} />
                <Row label="Budget" value={`₹${Number(d.budgetTotal).toLocaleString("en-IN")} total · ₹${Number(d.budgetDaily).toLocaleString("en-IN")}/day`} />
                <Row label="AI orchestration" value={d.aiEnabled ? "Enabled" : "Off"} />
              </div>
            </Panel>
          )}

          <div className="flex items-center justify-between mt-5">
            <button onClick={back} disabled={step === 0} className={`px-5 h-10 rounded text-sm font-medium flex items-center gap-1.5 ${step === 0 ? "text-[#C9C9C9] cursor-not-allowed" : "border border-[#C9C9C9] text-[#444] hover:bg-[#F3F3F3]"}`}><ArrowLeft size={16} /> Back</button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="px-6 h-10 rounded bg-[#0176D3] text-white text-sm font-semibold hover:bg-[#014486] flex items-center gap-1.5">Continue <ArrowRight size={16} /></button>
            ) : (
              <button onClick={() => save("active")} className="px-6 h-10 rounded bg-[#2E844A] text-white text-sm font-semibold hover:bg-[#1B5E20] flex items-center gap-1.5"><Rocket size={16} /> {isEdit ? "Save & Activate" : "Launch Campaign"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) { return <div className="bg-white border border-[#E5E5E5] rounded-lg p-6">{children}</div>; }
function Lbl({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <label className={`block text-sm font-medium text-[#181818] mb-1.5 ${className}`}>{children}</label>; }
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) { return <button onClick={onClick} className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${on ? "bg-[#2E844A]" : "bg-[#C9C9C9]"}`}><span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${on ? "translate-x-5" : ""}`} /></button>; }
function ChipRow({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (o: string) => void }) { return <div className="flex flex-wrap gap-2">{options.map((o) => { const on = selected.includes(o); return <button key={o} onClick={() => onToggle(o)} className={`px-3 h-9 rounded-full text-sm border transition-colors ${on ? "bg-[#EEF4FF] border-[#0176D3] text-[#0176D3]" : "border-[#E5E5E5] text-[#747474] hover:bg-[#F3F3F3]"}`}>{o}</button>; })}</div>; }
function CurrencyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) { return <div className="relative"><IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747474]" /><input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 pl-9 pr-3 border border-[#C9C9C9] rounded text-sm outline-none focus:border-[#0176D3] focus:ring-2 focus:ring-[#0176D3]/20" /></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between py-2.5 border-b border-[#F0F0F0]"><span className="text-sm text-[#747474]">{label}</span><span className="text-sm font-medium text-[#181818] text-right max-w-[60%]">{value}</span></div>; }
