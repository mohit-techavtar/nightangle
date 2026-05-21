import React, { useState, useEffect, useRef } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { CreditDisplay } from "../../components/ui/CreditDisplay";
import { TopUpCreditsModal } from "../../components/modals/TopUpCreditsModal";
import {
  Send, Bot, User, Sparkles, Target, TrendingUp, Users, Zap, Loader,
  AlertTriangle, Search, FileText, Mail, PenLine, Database, ArrowRight,
  Plus, Wand2, Coins,
} from "lucide-react";

// ============================================================
// Task 5 — Business Playground revamped: a cleaner AI workspace
// with capability categories, themed quick-starts, a polished
// hero/empty state and a refined conversation view. Credit
// logic, AI responses and modals are preserved.
// ============================================================

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  creditsCost?: number;
}

interface Capability {
  id: string;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  grad: string;
  soft: string;
  text: string;
  prompts: string[];
}

const CAPABILITIES: Capability[] = [
  {
    id: "leads", label: "Lead Generation", tagline: "Find & qualify prospects",
    icon: Target, grad: "from-[#42A5F5] to-[#1565C0]", soft: "bg-[#E3F2FD]", text: "text-[#1565C0]",
    prompts: ["Find 50 tech companies in Nepal with 10-50 employees", "Build an ICP for our SaaS product", "Find potential clients in healthcare"],
  },
  {
    id: "research", label: "Market Research", tagline: "Competitor & market intel",
    icon: Search, grad: "from-[#AB47BC] to-[#6A1B9A]", soft: "bg-[#F3E5F5]", text: "text-[#7B1FA2]",
    prompts: ["Research top CRM competitors in the market", "Analyze competitor pricing models", "Research market trends in AI/ML space"],
  },
  {
    id: "strategy", label: "GTM Strategy", tagline: "Plans & playbooks",
    icon: TrendingUp, grad: "from-[#26A69A] to-[#00695C]", soft: "bg-[#E0F2F1]", text: "text-[#00897B]",
    prompts: ["Create a go-to-market strategy for our new product", "Draft a channel strategy for B2B", "Build a 90-day launch plan"],
  },
  {
    id: "campaigns", label: "Campaigns & Content", tagline: "Outreach & copy",
    icon: Mail, grad: "from-[#FFB74D] to-[#F57C00]", soft: "bg-[#FFF3E0]", text: "text-[#E65100]",
    prompts: ["Draft an email campaign for enterprise B2B clients", "Write cold email templates for product launch", "Create a LinkedIn outreach sequence"],
  },
];

const quickActions = [
  { icon: Target, label: "Find Leads", query: "Find me 50 tech companies in Nepal with 10-50 employees" },
  { icon: TrendingUp, label: "GTM Strategy", query: "Create a go-to-market strategy for our new SaaS product" },
  { icon: Users, label: "Research Competitors", query: "Research top CRM competitors in the market" },
  { icon: Zap, label: "Campaign Plan", query: "Draft an email campaign for enterprise B2B clients" },
];

export function BusinessPlayground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(145);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showNoCreditModal, setShowNoCreditModal] = useState(false);
  const [activeCap, setActiveCap] = useState<string>("leads");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pendingQuery = sessionStorage.getItem("pendingPlaygroundQuery");
    if (pendingQuery) { sessionStorage.removeItem("pendingPlaygroundQuery"); handleSendMessage(pendingQuery); }
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = (query?: string) => {
    const messageText = query || input;
    if (!messageText.trim()) return;
    if (credits < 1) { setShowNoCreditModal(true); return; }

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setCredits((prev) => prev - 1);

    setTimeout(() => {
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: getAIResponse(messageText), timestamp: new Date(), creditsCost: 1 };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1600);
  };

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("lead") || q.includes("companies") || q.includes("icp"))
      return `I'll help you generate qualified leads.\n\n**Lead Generation Plan**\n1. Target Profile: Tech companies, 10-50 employees in Nepal\n2. Data Sources: LinkedIn, company databases, industry directories\n3. Qualification: Active funding, tech-stack match, decision-maker access\n\n**Next Steps**\n• Run enrichment for company data\n• Score leads against your ICP\n• Push qualified leads to the CRM\n\nWant me to define tighter targeting or set up an enrichment workflow?`;
    if (q.includes("gtm") || q.includes("strategy") || q.includes("launch") || q.includes("channel"))
      return `Here's a GTM framework tailored to your ask.\n\n**1. Market Analysis** — segments, personas, competitive landscape\n**2. Positioning** — value proposition, differentiators, messaging\n**3. Channel Strategy** — direct sales + content (primary), partnerships (secondary)\n**4. Timeline** — pre-launch (4w), launch (2w), optimise (ongoing)\n\nWant a deep dive into personas, competitive analysis, or a channel playbook?`;
    if (q.includes("research") || q.includes("competitor") || q.includes("pricing") || q.includes("market"))
      return `I'll run structured research for you.\n\n**Company Intel** — funding, products, tech stack, leadership\n**Competitive Analysis** — feature matrix, pricing, positioning, gaps\n**Market Insights** — trends, growth, sentiment, ecosystem\n\nDeliverables: executive summary, comparison matrix, or a visual dashboard. Which companies should I start with?`;
    if (q.includes("campaign") || q.includes("email") || q.includes("outreach") || q.includes("linkedin"))
      return `Here's a high-converting campaign blueprint.\n\n**Sequence (5 touches)**\n• Day 1: Problem-aware intro\n• Day 3: Solution showcase\n• Day 7: Social proof / case study\n• Day 10: Demo invite\n• Day 14: Final value reminder\n\n**Targets** — Open 35%+ · Click 8%+ · Reply 5%+\n\nShould I write the copy, build LinkedIn templates, or wire the workflow into your CRM?`;
    return `Happy to help! I can assist with lead generation, market & competitor research, GTM strategy, and campaign planning.\n\nTell me your goal and I'll create a step-by-step action plan with the right deliverables.`;
  };

  const handlePurchaseCredits = (purchasedCredits: number) => setCredits((prev) => prev + purchasedCredits);
  const cap = CAPABILITIES.find((c) => c.id === activeCap)!;

  return (
    <div className="flex flex-col h-full">
      <TopBar breadcrumbs={[{ label: "Business Playground" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      <div className="flex-1 overflow-hidden flex flex-col bg-[#F9FAFB]">
        {/* Credit bar */}
        <div className="bg-white border-b border-[#E0E0E0] px-6 max-md:px-4 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-[#616161]"><Wand2 size={16} className="text-[#7B1FA2]" /> AI Workspace</div>
            <div className="flex items-center gap-3">
              <CreditDisplay credits={credits} size="md" />
              <button onClick={() => setShowTopUpModal(true)} className="px-3 h-8 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] flex items-center gap-1.5"><Coins size={14} /> Top up</button>
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} className="px-3 h-8 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-1.5"><Plus size={14} /> New</button>
              )}
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 overflow-auto p-6 max-md:p-4">
            <div className="max-w-4xl mx-auto">
              {/* Hero */}
              <div className="text-center mb-7">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1565C0] via-[#5E35B1] to-[#7B1FA2] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1565C0]/20">
                  <Sparkles className="text-white" size={30} />
                </div>
                <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-1">Business Playground</h1>
                <p className="text-[#616161] max-md:text-sm">Your AI co-pilot for leads, research, strategy and campaigns.</p>
              </div>

              {/* Capability switcher */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {CAPABILITIES.map((c) => {
                  const Icon = c.icon; const on = activeCap === c.id;
                  return (
                    <button key={c.id} onClick={() => setActiveCap(c.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${on ? "border-[#1565C0] bg-white shadow-sm ring-1 ring-[#1565C0]/15" : "border-[#E0E0E0] bg-white hover:border-[#1565C0]/40"}`}>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.grad} text-white flex items-center justify-center mb-2.5`}><Icon size={18} /></div>
                      <div className="font-semibold text-[#212121] text-sm">{c.label}</div>
                      <div className="text-xs text-[#9E9E9E]">{c.tagline}</div>
                    </button>
                  );
                })}
              </div>

              {/* Themed prompt starters */}
              <div className={`rounded-2xl border border-[#E0E0E0] p-5 mb-6 ${cap.soft}`}>
                <div className="flex items-center gap-2 mb-3">
                  <cap.icon size={16} className={cap.text} />
                  <h3 className={`text-sm font-semibold ${cap.text}`}>{cap.label} · try one of these</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {cap.prompts.map((p) => (
                    <button key={p} onClick={() => handleSendMessage(p)}
                      className="text-left bg-white rounded-xl border border-[#E0E0E0] p-3 hover:border-[#1565C0] hover:shadow-sm transition-all group">
                      <div className="text-sm text-[#212121] mb-2 line-clamp-2 min-h-[40px]">{p}</div>
                      <span className="text-xs text-[#1565C0] font-medium flex items-center gap-1">Run <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" /></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div>
                <h3 className="text-sm font-semibold text-[#616161] mb-2.5">Quick actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((a, i) => (
                    <button key={i} onClick={() => handleSendMessage(a.query)}
                      className="bg-white rounded-xl border border-[#E0E0E0] p-4 text-left hover:border-[#1565C0] hover:shadow-md transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-[#E3F2FD] flex items-center justify-center mb-2 group-hover:bg-[#1565C0] transition-colors">
                        <a.icon size={18} className="text-[#1565C0] group-hover:text-white" />
                      </div>
                      <div className="text-sm font-medium text-[#212121]">{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6 max-md:p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1565C0] to-[#7B1FA2] flex items-center justify-center shrink-0"><Bot className="text-white" size={16} /></div>
                  )}
                  <div className={`max-w-[72%] max-md:max-w-[86%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-[#1565C0] text-white" : "bg-white border border-[#E0E0E0] text-[#212121]"}`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                    <div className={`text-xs mt-2 ${m.role === "user" ? "text-white/70" : "text-[#9E9E9E]"}`}>{m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{m.creditsCost ? ` · ${m.creditsCost} credit` : ""}</div>
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0"><User className="text-[#1565C0]" size={16} /></div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1565C0] to-[#7B1FA2] flex items-center justify-center shrink-0"><Bot className="text-white" size={16} /></div>
                  <div className="bg-white border border-[#E0E0E0] rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader className="animate-spin text-[#1565C0]" size={16} /><span className="text-sm text-[#616161]">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-[#E0E0E0] bg-white p-4 max-md:p-3">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about leads, research, strategy, campaigns…" rows={2}
                className="w-full px-4 py-3 pr-12 border-2 border-[#E0E0E0] rounded-xl bg-white text-[#212121] text-sm outline-none transition-all focus:border-[#1565C0] focus:ring-4 focus:ring-[#1565C0]/10 resize-none"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
              <button onClick={() => handleSendMessage()} disabled={!input.trim() || isTyping}
                className="absolute right-3 bottom-3 w-10 h-10 rounded-lg bg-[#1565C0] text-white flex items-center justify-center hover:bg-[#0D47A1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-[#9E9E9E] mt-2 text-center">Each query uses 1 credit · {credits} remaining</p>
          </div>
        </div>
      </div>

      <TopUpCreditsModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} currentCredits={credits} onPurchase={handlePurchaseCredits} />

      {showNoCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#FFEBEE] flex items-center justify-center mx-auto mb-4"><AlertTriangle className="text-[#C62828]" size={32} /></div>
            <h2 className="text-xl font-bold text-[#212121] mb-2 text-center">Insufficient Credits</h2>
            <p className="text-sm text-[#616161] mb-6 text-center">Each AI query costs 1 credit. Purchase more credits to continue.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowNoCreditModal(false)} className="flex-1 h-10 rounded-lg border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium">Cancel</button>
              <button onClick={() => { setShowNoCreditModal(false); setShowTopUpModal(true); }} className="flex-1 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]">Purchase Credits</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
