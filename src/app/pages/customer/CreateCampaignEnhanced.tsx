import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Target, MessageCircle, Users, DollarSign, Workflow, CheckCircle2,
  ArrowLeft, ArrowRight, Phone, Mail, MessageSquare, Save, Check,
  PhoneOutgoing, Wallet, Headphones, ClipboardList, Megaphone, Sparkles,
  IndianRupee, Calendar, Zap, Plus, X,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Task 3 — Create Campaign wizard, expanded to a full CRM-grade
// 6-step flow: Basics, Channels, Audience, Budget, Automation, Review.
// ============================================================

const STEPS = [
  { key: "basics", label: "Basics", icon: Target },
  { key: "channels", label: "Channels", icon: MessageCircle },
  { key: "audience", label: "Audience", icon: Users },
  { key: "budget", label: "Budget", icon: DollarSign },
  { key: "automation", label: "Automation", icon: Workflow },
  { key: "review", label: "Review", icon: CheckCircle2 },
];

const TYPES = [
  { id: "outreach", title: "Sales Outreach", desc: "Reach new prospects", icon: PhoneOutgoing },
  { id: "qualification", title: "Lead Qualification", desc: "Qualify and score leads", icon: ClipboardList },
  { id: "nurture", title: "Follow-up Nurture", desc: "Nurture existing leads", icon: Sparkles },
  { id: "support", title: "Support Notification", desc: "Customer support alerts", icon: Headphones },
  { id: "collections", title: "Collections", desc: "Payment reminders", icon: Wallet },
  { id: "survey", title: "Surveys & Feedback", desc: "Gather feedback", icon: Megaphone },
];

const CHANNELS = [
  { id: "call", label: "Voice Call", icon: Phone, grad: "from-[#42A5F5] to-[#1565C0]" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, grad: "from-[#4CD964] to-[#1FA855]" },
  { id: "email", label: "Email", icon: Mail, grad: "from-[#AB47BC] to-[#6A1B9A]" },
  { id: "sms", label: "SMS", icon: MessageSquare, grad: "from-[#FFB74D] to-[#F57C00]" },
];

const STAGES = ["New", "Contacted", "Qualified", "Proposal", "Negotiation"];
const SOURCES = ["Web Form", "WhatsApp", "Meta Ads", "Google Ads", "Referral", "IndiaMART"];

export function CreateCampaignEnhanced() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({
    name: "", type: "outreach", description: "",
    channels: ["call"], primaryChannel: "call",
    segmentStages: ["New"], segmentSources: [] as string[], scoreMin: 0, scoreMax: 100, branch: "all", estReach: 1240,
    budgetTotal: "50000", budgetDaily: "2500", currency: "INR", startDate: "", endDate: "",
    automations: { autoAssign: true, retryOnNoAnswer: true, stopOnReply: true, escalateToHuman: false },
    sendWindow: "business", abTest: false,
  });
  const set = (k: string, v: any) => setData((p: any) => ({ ...p, [k]: v }));
  const toggleArr = (k: string, val: string) => setData((p: any) => ({ ...p, [k]: p[k].includes(val) ? p[k].filter((x: string) => x !== val) : [...p[k], val] }));

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const finish = () => { toast.success("Campaign created and scheduled"); navigate("/tenant/campaigns"); };

  const inputCls = "w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20";

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <TopBar breadcrumbs={[{ label: "Communication" }, { label: "Campaigns", path: "/tenant/campaigns" }, { label: "Create" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      {/* Header */}
      <div className="bg-white border-b border-[#E0E0E0] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-[#F5F5F5] text-[#616161]"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-lg font-semibold text-[#212121]">Create New Campaign</h1>
            <p className="text-xs text-[#9E9E9E]">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>
        <button className="px-3 h-9 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-1.5"><Save size={15} /> Save Draft</button>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-[#E0E0E0] px-6 py-4 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {STEPS.map((s, i) => {
            const Icon = s.icon; const done = i < step; const active = i === step;
            return (
              <React.Fragment key={s.key}>
                <button onClick={() => i <= step && setStep(i)} className="flex flex-col items-center gap-1.5 shrink-0">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${done ? "bg-[#2E7D32] text-white" : active ? "bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white shadow-md" : "bg-[#F5F5F5] text-[#9E9E9E] border border-[#E0E0E0]"}`}>
                    {done ? <Check size={18} /> : <Icon size={18} />}
                  </span>
                  <span className={`text-xs font-medium ${active ? "text-[#1565C0]" : done ? "text-[#212121]" : "text-[#9E9E9E]"}`}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 min-w-[40px] mx-2 mb-5 ${i < step ? "bg-[#2E7D32]" : "bg-[#E0E0E0]"}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* STEP 1 — Basics */}
          {step === 0 && (
            <Panel>
              <Lbl>Campaign Name *</Lbl>
              <input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g., Q2 Product Launch Campaign" className={inputCls} />
              <Lbl className="mt-5">Campaign Type *</Lbl>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TYPES.map((t) => {
                  const Icon = t.icon; const on = data.type === t.id;
                  return (
                    <button key={t.id} onClick={() => set("type", t.id)} className={`text-left p-4 rounded-xl border transition-all ${on ? "border-[#1565C0] bg-[#E3F2FD] ring-1 ring-[#1565C0]/20" : "border-[#E0E0E0] hover:border-[#1565C0]/40"}`}>
                      <Icon size={20} className={on ? "text-[#1565C0]" : "text-[#616161]"} />
                      <div className="font-medium text-[#212121] mt-2">{t.title}</div>
                      <div className="text-xs text-[#9E9E9E]">{t.desc}</div>
                    </button>
                  );
                })}
              </div>
              <Lbl className="mt-5">Description (Optional)</Lbl>
              <textarea rows={4} value={data.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description of campaign goals and strategy…" className={`${inputCls} h-auto py-2`} />
            </Panel>
          )}

          {/* STEP 2 — Channels */}
          {step === 1 && (
            <Panel>
              <Lbl>Select Channels</Lbl>
              <p className="text-sm text-[#9E9E9E] mb-3">Run a single channel or orchestrate an omni-channel sequence.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CHANNELS.map((c) => {
                  const Icon = c.icon; const on = data.channels.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => toggleArr("channels", c.id)} className={`p-4 rounded-xl border text-center transition-all ${on ? "border-[#1565C0] bg-[#E3F2FD]" : "border-[#E0E0E0] hover:border-[#1565C0]/40"}`}>
                      <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${c.grad} text-white flex items-center justify-center mb-2`}><Icon size={18} /></div>
                      <div className="text-sm font-medium text-[#212121]">{c.label}</div>
                      {on && <Check size={14} className="text-[#1565C0] mx-auto mt-1" />}
                    </button>
                  );
                })}
              </div>
              {data.channels.length > 1 && (
                <div className="mt-5">
                  <Lbl>Primary Channel</Lbl>
                  <select value={data.primaryChannel} onChange={(e) => set("primaryChannel", e.target.value)} className={inputCls}>
                    {data.channels.map((id: string) => <option key={id} value={id}>{CHANNELS.find((c) => c.id === id)?.label}</option>)}
                  </select>
                  <p className="text-xs text-[#9E9E9E] mt-1">Other channels act as fallbacks in sequence.</p>
                </div>
              )}
            </Panel>
          )}

          {/* STEP 3 — Audience */}
          {step === 2 && (
            <Panel>
              <Lbl>Target by Lead Stage</Lbl>
              <ChipRow options={STAGES} selected={data.segmentStages} onToggle={(o) => toggleArr("segmentStages", o)} />
              <Lbl className="mt-5">Target by Source</Lbl>
              <ChipRow options={SOURCES} selected={data.segmentSources} onToggle={(o) => toggleArr("segmentSources", o)} />
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div><Lbl>Min Lead Score</Lbl><input type="number" value={data.scoreMin} onChange={(e) => set("scoreMin", e.target.value)} className={inputCls} /></div>
                <div><Lbl>Max Lead Score</Lbl><input type="number" value={data.scoreMax} onChange={(e) => set("scoreMax", e.target.value)} className={inputCls} /></div>
              </div>
              <Lbl className="mt-5">Branch</Lbl>
              <select value={data.branch} onChange={(e) => set("branch", e.target.value)} className={inputCls}>
                <option value="all">All branches</option><option>Kathmandu HQ</option><option>Bangalore Branch</option><option>Mumbai Branch</option>
              </select>
              <div className="mt-5 bg-[#E3F2FD] rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-[#1565C0] font-medium flex items-center gap-2"><Users size={16} /> Estimated Reach</span>
                <span className="text-2xl font-semibold text-[#1565C0]">{data.estReach.toLocaleString("en-IN")}</span>
              </div>
            </Panel>
          )}

          {/* STEP 4 — Budget */}
          {step === 3 && (
            <Panel>
              <div className="grid grid-cols-2 gap-4">
                <div><Lbl>Total Budget</Lbl><CurrencyInput value={data.budgetTotal} onChange={(v) => set("budgetTotal", v)} /></div>
                <div><Lbl>Daily Cap</Lbl><CurrencyInput value={data.budgetDaily} onChange={(v) => set("budgetDaily", v)} /></div>
                <div><Lbl>Start Date</Lbl><input type="date" value={data.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputCls} /></div>
                <div><Lbl>End Date</Lbl><input type="date" value={data.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputCls} /></div>
              </div>
              <Lbl className="mt-5">Send Window</Lbl>
              <div className="flex gap-2">
                {[["business", "Business hours"], ["anytime", "Anytime"], ["custom", "Custom"]].map(([id, label]) => (
                  <button key={id} onClick={() => set("sendWindow", id)} className={`flex-1 h-11 rounded-lg text-sm font-medium border ${data.sendWindow === id ? "bg-[#E3F2FD] border-[#1565C0] text-[#1565C0]" : "border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>{label}</button>
                ))}
              </div>
              <label className="mt-5 flex items-center justify-between bg-white border border-[#E0E0E0] rounded-xl p-4 cursor-pointer">
                <span><span className="text-sm font-medium text-[#212121] flex items-center gap-2"><Zap size={15} className="text-[#F57F17]" /> A/B Test variants</span><span className="text-xs text-[#9E9E9E]">Split audience across message variants</span></span>
                <Toggle on={data.abTest} onClick={() => set("abTest", !data.abTest)} />
              </label>
              <div className="mt-4 bg-[#FFF8E1] rounded-xl p-4 text-sm text-[#5D4037]">
                Estimated cost at ₹12 / interaction ≈ <span className="font-semibold">₹{(data.estReach * 12).toLocaleString("en-IN")}</span> for full reach.
              </div>
            </Panel>
          )}

          {/* STEP 5 — Automation */}
          {step === 4 && (
            <Panel>
              <Lbl>Automation Rules</Lbl>
              <div className="space-y-2">
                {[
                  ["autoAssign", "Auto-assign responders to owners", "Route engaged leads using branch distribution rules"],
                  ["retryOnNoAnswer", "Retry on no-answer", "Re-attempt up to 3 times across the sequence"],
                  ["stopOnReply", "Stop sequence on reply", "Pause automation when a lead responds"],
                  ["escalateToHuman", "Escalate hot leads to a human", "Notify the owner when score crosses 80"],
                ].map(([key, title, desc]) => (
                  <label key={key} className="flex items-center justify-between bg-white border border-[#E0E0E0] rounded-xl p-4 cursor-pointer">
                    <span><span className="text-sm font-medium text-[#212121]">{title}</span><span className="block text-xs text-[#9E9E9E]">{desc}</span></span>
                    <Toggle on={data.automations[key as string]} onClick={() => set("automations", { ...data.automations, [key as string]: !data.automations[key as string] })} />
                  </label>
                ))}
              </div>
            </Panel>
          )}

          {/* STEP 6 — Review */}
          {step === 5 && (
            <Panel>
              <h3 className="text-lg font-semibold text-[#212121] mb-4">Review &amp; Launch</h3>
              <div className="space-y-3">
                <ReviewRow label="Name" value={data.name || "Untitled campaign"} />
                <ReviewRow label="Type" value={TYPES.find((t) => t.id === data.type)?.title || "—"} />
                <ReviewRow label="Channels" value={data.channels.map((id: string) => CHANNELS.find((c) => c.id === id)?.label).join(", ")} />
                <ReviewRow label="Audience" value={`${data.segmentStages.join(", ") || "All"} · score ${data.scoreMin}-${data.scoreMax}`} />
                <ReviewRow label="Estimated reach" value={data.estReach.toLocaleString("en-IN")} />
                <ReviewRow label="Budget" value={`₹${Number(data.budgetTotal).toLocaleString("en-IN")} total · ₹${Number(data.budgetDaily).toLocaleString("en-IN")}/day`} />
                <ReviewRow label="Automation" value={Object.entries(data.automations).filter(([, v]) => v).map(([k]) => k).join(", ") || "None"} />
              </div>
              <div className="mt-5 bg-[#E8F5E9] rounded-xl p-4 flex items-start gap-2 text-sm text-[#2E7D32]">
                <CheckCircle2 size={16} className="mt-0.5" /> Ready to launch. You can pause or edit anytime from the campaign dashboard.
              </div>
            </Panel>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between mt-5">
            <button onClick={back} disabled={step === 0} className={`px-5 h-11 rounded-lg text-sm font-medium flex items-center gap-1.5 ${step === 0 ? "text-[#BDBDBD] cursor-not-allowed" : "border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}><ArrowLeft size={16} /> Back</button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="px-6 h-11 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-1.5">Continue <ArrowRight size={16} /></button>
            ) : (
              <button onClick={finish} className="px-6 h-11 rounded-lg bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] flex items-center gap-1.5"><CheckCircle2 size={16} /> Launch Campaign</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) { return <div className="bg-white border border-[#E0E0E0] rounded-xl p-6">{children}</div>; }
function Lbl({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <label className={`block text-sm font-medium text-[#212121] mb-1.5 ${className}`}>{children}</label>; }
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${on ? "bg-[#2E7D32]" : "bg-[#E0E0E0]"}`}><span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${on ? "translate-x-5" : ""}`} /></button>;
}
function ChipRow({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (o: string) => void }) {
  return <div className="flex flex-wrap gap-2">{options.map((o) => { const on = selected.includes(o); return <button key={o} onClick={() => onToggle(o)} className={`px-3 h-9 rounded-full text-sm border transition-colors ${on ? "bg-[#E3F2FD] border-[#1565C0] text-[#1565C0]" : "border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>{o}</button>; })}</div>;
}
function CurrencyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <div className="relative"><IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" /><input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-11 pl-9 pr-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20" /></div>;
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between py-2.5 border-b border-[#F0F0F0]"><span className="text-sm text-[#9E9E9E]">{label}</span><span className="text-sm font-medium text-[#212121] text-right max-w-[60%]">{value}</span></div>;
}
