import React, { useState, useEffect, useRef } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { CreditDisplay, CreditCard } from "../../components/ui/CreditDisplay";
import { TopUpCreditsModal } from "../../components/modals/TopUpCreditsModal";
import { ResearchTemplates } from "../../components/playground/ResearchTemplates";
import { CompetitorTable, PricingComparison, ProductVariantsTable, SWOTMatrix, MarketInsights } from "../../components/playground/ResearchResults";
import { Send, Bot, User, Sparkles, Target, TrendingUp, Users, Zap, Loader, AlertTriangle, Coins, BookOpen, Download, Share2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  creditsCost?: number;
  researchType?: "competitor" | "pricing" | "product" | "swot" | "market" | null;
  researchData?: any;
}

const quickActions = [
  { icon: Target, label: "Find Leads", query: "Find me 50 tech companies in Nepal with 10-50 employees" },
  { icon: TrendingUp, label: "GTM Strategy", query: "Create a go-to-market strategy for our new SaaS product" },
  { icon: Users, label: "Research Company", query: "Research top CRM competitors in the market" },
  { icon: Zap, label: "Campaign Plan", query: "Draft an email campaign for enterprise B2B clients" },
];

const suggestions = [
  "Find potential clients in the healthcare industry",
  "Create a LinkedIn outreach strategy",
  "Analyze competitor pricing models",
  "Draft cold email templates for product launch",
  "Research market trends in AI/ML space",
  "Build ICP (Ideal Customer Profile) for our product",
];

export function BusinessPlayground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(145); // Mock initial credits
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showNoCreditModal, setShowNoCreditModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if there's a pending query from the landing page
    const pendingQuery = sessionStorage.getItem("pendingPlaygroundQuery");
    if (pendingQuery) {
      sessionStorage.removeItem("pendingPlaygroundQuery");
      handleSendMessage(pendingQuery);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (query?: string) => {
    const messageText = query || input;
    if (!messageText.trim()) return;

    // Check credit balance
    if (credits < 1) {
      setShowNoCreditModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Deduct 1 credit
    setCredits(prev => prev - 1);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(messageText),
        timestamp: new Date(),
        creditsCost: 1,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("lead") || lowerQuery.includes("companies")) {
      return `I'll help you generate qualified leads. Based on your criteria, here's what I can do:

**Lead Generation Plan:**
1. Target Profile: Tech companies, 10-50 employees in Nepal
2. Data Sources: LinkedIn, Company databases, Industry directories
3. Qualification Criteria: Active funding, Tech stack match, Decision maker access

**Next Steps:**
• Run web scraping for company data
• Enrich with contact information
• Score leads based on ICP match
• Export to CRM for outreach

Would you like me to proceed with the lead generation? I can also help you:
- Define more specific targeting criteria
- Set up automated enrichment workflows
- Create outreach sequences`;
    }
    
    if (lowerQuery.includes("gtm") || lowerQuery.includes("strategy")) {
      return `I'll help you build a comprehensive GTM strategy. Here's a framework:

**Go-To-Market Strategy Framework:**

**1. Market Analysis**
- Target segments & personas
- Competitive landscape
- Market size & opportunity

**2. Positioning**
- Unique value proposition
- Key differentiators
- Messaging pillars

**3. Channel Strategy**
- Primary: Direct sales, Content marketing
- Secondary: Partnerships, Community
- Budget allocation by channel

**4. Launch Timeline**
- Pre-launch: 4 weeks
- Launch: 2 weeks
- Post-launch: Ongoing optimization

Would you like me to deep dive into any specific area? I can also help create:
- Detailed persona profiles
- Competitive analysis reports
- Channel-specific playbooks`;
    }
    
    if (lowerQuery.includes("research") || lowerQuery.includes("competitor")) {
      return `I'll conduct comprehensive company/competitor research for you.

**Research Framework:**

**Company Intel:**
• Funding & financials
• Product offerings
• Technology stack
• Team & leadership
• Customer base

**Competitive Analysis:**
• Feature comparison matrix
• Pricing analysis
• Market positioning
• Strengths & weaknesses
• Differentiation opportunities

**Market Insights:**
• Industry trends
• Growth patterns
• Customer sentiment
• Partnership ecosystem

I can provide detailed reports in formats like:
- Executive summary (PDF)
- Detailed analysis (Google Docs)
- Comparison matrix (Spreadsheet)
- Visual dashboards

What specific companies or aspects would you like me to research?`;
    }
    
    if (lowerQuery.includes("campaign") || lowerQuery.includes("email") || lowerQuery.includes("outreach")) {
      return `I'll help you create a high-converting campaign. Here's the plan:

**Campaign Blueprint:**

**1. Campaign Setup**
- Objective: Lead generation / Nurture / Re-engagement
- Target audience: Enterprise B2B decision makers
- Timeline: 4-week campaign

**2. Email Sequence (5 touches)**
- Day 1: Problem-aware intro
- Day 3: Solution showcase
- Day 7: Social proof & case study
- Day 10: Demo invitation
- Day 14: Final value reminder

**3. Multi-Channel Approach**
- Email: Primary touch
- LinkedIn: Social engagement
- Retargeting: Display ads
- Phone: Follow-up for hot leads

**4. Success Metrics**
- Open rate target: 35%+
- Click rate target: 8%+
- Reply rate target: 5%+
- Meeting booked: 2%+

Want me to:
- Write email copy for each sequence?
- Create LinkedIn message templates?
- Design campaign workflow in your CRM?`;
    }
    
    return `Thank you for your query! I'm analyzing your request and can help you with:

**Available Services:**
🎯 Lead Generation & Qualification
📊 Market & Competitor Research  
🚀 GTM Strategy Development
📧 Campaign Planning & Execution
📝 Content & Messaging Creation
🔍 Data Enrichment & Scraping

I can provide detailed analysis, actionable insights, and automated workflows for any of these areas.

**How I can help right now:**
1. Clarify your specific goals
2. Define success metrics
3. Create step-by-step action plans
4. Set up automated processes

What would you like to focus on first?`;
  };

  const handlePurchaseCredits = (purchasedCredits: number, amount: number) => {
    setCredits(prev => prev + purchasedCredits);
    // Show success notification (you can add a toast here)
    console.log(`Purchased ${purchasedCredits} credits for NPR ${amount}`);
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Business Playground" }]} 
        companyName="Everest Digital Solutions" 
        mode="customer" 
        userName="Rajesh Sharma" 
        userEmail="rajesh@everestdigital.com" 
        userInitials="RS" 
      />
      <div className="flex-1 overflow-hidden flex flex-col bg-[#F5F5F5]">
        {/* Credit Banner */}
        <div className="bg-white border-b border-[#E0E0E0] px-6 max-md:px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
            <CreditDisplay credits={credits} size="md" />
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-4 h-8 rounded-md bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors max-md:w-full"
            >
              Purchase Credits
            </button>
          </div>
        </div>

        {messages.length === 0 ? (
          // Empty State with Suggestions
          <div className="flex-1 overflow-auto p-6 max-md:p-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 max-md:mb-6">
                <div className="w-16 h-16 max-md:w-12 max-md:h-12 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center mx-auto mb-4 max-md:mb-3">
                  <Bot className="text-white" size={32} />
                </div>
                <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Business Playground</h1>
                <p className="text-base max-md:text-sm text-[#616161]">
                  AI-powered lead generation, research, and strategy suite
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mb-8 max-md:mb-6">
                <h3 className="text-sm font-semibold text-[#616161] mb-3 max-md:mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3 max-md:gap-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(action.query)}
                      className="bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3 text-left hover:border-[#1565C0] hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center group-hover:bg-[#1565C0] transition-colors">
                          <action.icon size={20} className="text-[#1565C0] group-hover:text-white max-md:w-4 max-md:h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm max-md:text-[13px] font-semibold text-[#212121] mb-1">{action.label}</div>
                          <div className="text-xs max-md:text-[11px] text-[#616161] line-clamp-2">{action.query}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h3 className="text-sm font-semibold text-[#616161] mb-3 max-md:mb-2">Try asking:</h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className="bg-white rounded-lg border border-[#E0E0E0] px-4 max-md:px-3 py-3 max-md:py-2 text-left hover:border-[#1565C0] hover:bg-[#E3F2FD] transition-all text-sm max-md:text-xs text-[#212121]"
                    >
                      <Sparkles size={14} className="inline mr-2 text-[#1565C0]" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex-1 overflow-auto p-6 max-md:p-4">
            <div className="max-w-4xl mx-auto space-y-4 max-md:space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 max-md:gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 max-md:w-7 max-md:h-7 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center shrink-0">
                      <Bot className="text-white" size={16} />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] max-md:max-w-[85%] rounded-2xl px-4 max-md:px-3 py-3 max-md:py-2 ${
                      message.role === "user"
                        ? "bg-[#1565C0] text-white"
                        : "bg-white border border-[#E0E0E0] text-[#212121]"
                    }`}
                  >
                    <div className="text-sm max-md:text-[13px] whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs max-md:text-[10px] mt-2 ${
                        message.role === "user" ? "text-white/70" : "text-[#9E9E9E]"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 max-md:w-7 max-md:h-7 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
                      <User className="text-[#1565C0]" size={16} />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-md:gap-2">
                  <div className="w-8 h-8 max-md:w-7 max-md:h-7 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center shrink-0">
                    <Bot className="text-white" size={16} />
                  </div>
                  <div className="bg-white border border-[#E0E0E0] rounded-2xl px-4 max-md:px-3 py-3 max-md:py-2">
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin text-[#1565C0]" size={16} />
                      <span className="text-sm max-md:text-xs text-[#616161]">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-[#E0E0E0] bg-white p-4 max-md:p-3">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about leads, research, strategy, campaigns..."
                rows={2}
                className="w-full px-4 max-md:px-3 py-3 max-md:py-2 pr-12 border-2 border-[#E0E0E0] rounded-xl bg-white text-[#212121] text-sm max-md:text-[13px] outline-none transition-all focus:border-[#1565C0] focus:ring-4 focus:ring-[#1565C0]/10 resize-none"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-3 bottom-3 w-10 h-10 max-md:w-8 max-md:h-8 rounded-lg bg-[#1565C0] text-white flex items-center justify-center hover:bg-[#0D47A1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={18} className="max-md:w-4 max-md:h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Top Up Credits Modal */}
      <TopUpCreditsModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        currentCredits={credits}
        onPurchase={handlePurchaseCredits}
      />

      {/* No Credit Modal */}
      {showNoCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-md:p-4 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#FFEBEE] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-[#C62828]" size={32} />
            </div>
            <h2 className="text-xl max-md:text-lg font-bold text-[#212121] mb-2 text-center">Insufficient Credits</h2>
            <p className="text-sm text-[#616161] mb-6 text-center">
              You don't have enough credits to proceed with this query. Each AI query costs 1 credit. Please purchase more credits to continue.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNoCreditModal(false)}
                className="flex-1 h-10 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNoCreditModal(false);
                  setShowTopUpModal(true);
                }}
                className="flex-1 h-10 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] transition-colors"
              >
                Purchase Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}