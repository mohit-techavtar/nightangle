import { create } from "zustand";

// ============================================================
// useEmail — now backed by a shared Zustand store so all CRUD
// (threads, templates, signatures, campaigns, config) persists
// across every page in the Email module. Public API is unchanged:
// components still call `const { ... } = useEmail()`.
// Backend-swap ready.
// ============================================================

export interface EmailThread {
  id: string;
  subject: string;
  participants: { from: string; to: string[]; cc?: string[]; bcc?: string[] };
  leadId?: string;
  leadName?: string;
  campaignId?: string;
  messages: EmailMessage[];
  status: "unread" | "read" | "replied" | "archived";
  tags: string[];
  sentiment?: "positive" | "neutral" | "negative";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyHtml: string;
  bodyText: string;
  attachments: EmailAttachment[];
  direction: "inbound" | "outbound";
  status: "sent" | "delivered" | "opened" | "clicked" | "bounced" | "failed";
  ownershipMode: "ai-drafted" | "human-authored" | "ai-managed";
  aiAssisted: boolean;
  timestamp: string;
  openedAt?: string;
  clickedAt?: string;
  metadata?: { ipAddress?: string; userAgent?: string; location?: string };
}

export interface EmailAttachment { id: string; filename: string; mimeType: string; size: number; url: string; }

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  category: "marketing" | "transactional" | "support";
  variables: string[];
  language: string;
  status: "draft" | "approved" | "active" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  usageCount: number;
}

export interface EmailSignature {
  id: string;
  name: string;
  html: string;
  text: string;
  scope: "tenant" | "role" | "user";
  scopeId?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  type: "broadcast" | "drip" | "event-triggered" | "transactional" | "call-to-email";
  status: "draft" | "scheduled" | "active" | "paused" | "completed";
  templateId: string;
  audienceSize: number;
  progress: { sent: number; delivered: number; opened: number; clicked: number; replied: number; bounced: number; unsubscribed: number; converted: number };
  schedule?: { startDate?: string; endDate?: string; quietHours?: { start: string; end: string }; daysOfWeek?: string[] };
  controls: { sendCap?: number; dailyLimit?: number; requireApproval: boolean; respectQuietHours: boolean };
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface EmailConfig {
  senderIdentity: { fromEmail: string; fromName: string; replyTo: string; domain: string };
  provider: "sendgrid" | "mailgun" | "ses" | "smtp";
  deliverability: {
    spf: { status: "verified" | "pending" | "failed" | "not_configured"; record?: string };
    dkim: { status: "verified" | "pending" | "failed" | "not_configured"; selector?: string };
    dmarc: { status: "verified" | "pending" | "failed" | "not_configured"; policy?: string };
  };
  sendLimits: { dailyLimit: number; hourlyLimit: number; perRecipientLimit: number; throttling: { enabled: boolean; messagesPerBatch: number; delayBetweenBatchesMs: number } };
  compliance: {
    unsubscribe: { enabled: boolean; pageUrl: string; oneClickUnsubscribe: boolean };
    suppressionList: { addresses: string[]; autoSuppressBounces: boolean; autoSuppressComplaints: boolean };
    dataRetention: { emailContentDays: number; analyticsDataDays: number; deleteUnsubscribedUsers: boolean };
  };
}

const emptyProgress = () => ({ sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0, converted: 0 });

const seedThreads: EmailThread[] = [
  { id: "thread_1", subject: "Re: Enterprise plan inquiry", participants: { from: "sarah.chen@techcorp.com", to: ["sales@company.com"] }, leadId: "lead_1", leadName: "Sarah Chen", messages: [], status: "unread", tags: ["sales", "enterprise"], sentiment: "positive", priority: "high", assignedTo: "John Smith", createdAt: "2026-04-20T14:25:00Z", updatedAt: "2026-04-21T10:15:00Z", lastMessageAt: "2026-04-21T10:15:00Z" },
  { id: "thread_2", subject: "Product demo follow-up", participants: { from: "support@company.com", to: ["michael.rodriguez@startup.io"] }, leadId: "lead_2", leadName: "Michael Rodriguez", messages: [], status: "replied", tags: ["support", "demo"], sentiment: "neutral", priority: "medium", createdAt: "2026-04-19T09:00:00Z", updatedAt: "2026-04-20T16:30:00Z", lastMessageAt: "2026-04-20T16:30:00Z" },
  { id: "thread_3", subject: "Pricing question for SMB tier", participants: { from: "ravi@finx.in", to: ["sales@company.com"] }, leadName: "Ravi Menon", messages: [], status: "read", tags: ["pricing"], sentiment: "positive", priority: "medium", createdAt: "2026-04-18T08:00:00Z", updatedAt: "2026-04-18T12:00:00Z", lastMessageAt: "2026-04-18T12:00:00Z" },
];

const seedTemplates: EmailTemplate[] = [
  { id: "template_1", name: "Welcome Email", subject: "Welcome to {{company_name}}!", bodyHtml: "<p>Hi {{lead_name}},</p><p>Welcome to {{company_name}}! We're excited to have you on board.</p>", bodyText: "Hi {{lead_name}}, Welcome to {{company_name}}!", category: "transactional", variables: ["lead_name", "company_name"], language: "en", status: "active", createdBy: "admin@company.com", createdAt: "2026-03-01T10:00:00Z", updatedAt: "2026-03-01T10:00:00Z", approvedAt: "2026-03-01T11:00:00Z", approvedBy: "manager@company.com", usageCount: 1234 },
  { id: "template_2", name: "Product Launch Announcement", subject: "🚀 Introducing Our Latest Innovation", bodyHtml: "<p>Hi {{lead_name}},</p><p>We're thrilled to announce our latest product...</p>", bodyText: "Hi {{lead_name}}, We're thrilled to announce our latest product...", category: "marketing", variables: ["lead_name", "product_name", "cta_link"], language: "en", status: "approved", createdBy: "marketing@company.com", createdAt: "2026-04-10T14:00:00Z", updatedAt: "2026-04-15T09:00:00Z", approvedAt: "2026-04-15T10:00:00Z", approvedBy: "manager@company.com", usageCount: 567 },
  { id: "template_3", name: "Re-engagement Nudge", subject: "We miss you, {{lead_name}}", bodyHtml: "<p>Hi {{lead_name}}, it's been a while…</p>", bodyText: "Hi {{lead_name}}, it's been a while…", category: "marketing", variables: ["lead_name"], language: "en", status: "draft", createdBy: "marketing@company.com", createdAt: "2026-05-02T14:00:00Z", updatedAt: "2026-05-02T14:00:00Z", usageCount: 0 },
];

const seedSignatures: EmailSignature[] = [
  { id: "sig_1", name: "Default Company Signature", html: "<p>Best regards,<br/><strong>{{user_name}}</strong><br/>{{user_role}}<br/>Company Name</p>", text: "Best regards,\n{{user_name}}\n{{user_role}}\nCompany Name", scope: "tenant", isDefault: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
];

const seedCampaigns: EmailCampaign[] = [
  { id: "email_camp_1", name: "Spring Product Launch", type: "broadcast", status: "active", templateId: "template_2", audienceSize: 5420, progress: { sent: 4231, delivered: 4156, opened: 2847, clicked: 892, replied: 156, bounced: 75, unsubscribed: 12, converted: 67 }, schedule: { startDate: "2026-04-15T09:00:00Z", quietHours: { start: "22:00", end: "08:00" } }, controls: { dailyLimit: 1000, requireApproval: false, respectQuietHours: true }, createdBy: "marketing@company.com", createdAt: "2026-04-10T10:00:00Z", startedAt: "2026-04-15T09:00:00Z" },
  { id: "email_camp_2", name: "Q2 Nurture Drip", type: "drip", status: "scheduled", templateId: "template_1", audienceSize: 2100, progress: emptyProgress(), schedule: { startDate: "2026-05-25T09:00:00Z" }, controls: { dailyLimit: 500, requireApproval: true, respectQuietHours: true }, createdBy: "marketing@company.com", createdAt: "2026-05-10T10:00:00Z" },
];

const seedConfig: EmailConfig = {
  senderIdentity: { fromEmail: "noreply@company.com", fromName: "Company Name", replyTo: "support@company.com", domain: "company.com" },
  provider: "sendgrid",
  deliverability: { spf: { status: "verified", record: "v=spf1 include:_spf.sendgrid.net ~all" }, dkim: { status: "verified", selector: "s1" }, dmarc: { status: "verified", policy: "v=DMARC1; p=quarantine;" } },
  sendLimits: { dailyLimit: 10000, hourlyLimit: 1000, perRecipientLimit: 5, throttling: { enabled: true, messagesPerBatch: 100, delayBetweenBatchesMs: 1000 } },
  compliance: { unsubscribe: { enabled: true, pageUrl: "https://company.com/unsubscribe", oneClickUnsubscribe: true }, suppressionList: { addresses: [], autoSuppressBounces: true, autoSuppressComplaints: true }, dataRetention: { emailContentDays: 365, analyticsDataDays: 730, deleteUnsubscribedUsers: false } },
};

interface EmailStore {
  threads: EmailThread[];
  templates: EmailTemplate[];
  signatures: EmailSignature[];
  campaigns: EmailCampaign[];
  config: EmailConfig;

  createThread: (data: Omit<EmailThread, "id" | "createdAt" | "updatedAt">) => EmailThread;
  updateThread: (id: string, updates: Partial<EmailThread>) => void;
  deleteThread: (id: string) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  archiveThread: (id: string) => void;

  createTemplate: (data: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt" | "usageCount">) => EmailTemplate;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteTemplate: (id: string) => void;
  approveTemplate: (id: string, approvedBy: string) => void;

  createSignature: (data: Omit<EmailSignature, "id" | "createdAt" | "updatedAt">) => EmailSignature;
  updateSignature: (id: string, updates: Partial<EmailSignature>) => void;
  deleteSignature: (id: string) => void;

  createCampaign: (data: Omit<EmailCampaign, "id" | "createdAt" | "progress">) => EmailCampaign;
  updateCampaign: (id: string, updates: Partial<EmailCampaign>) => void;
  deleteCampaign: (id: string) => void;
  startCampaign: (id: string) => void;
  pauseCampaign: (id: string) => void;

  updateConfig: (updates: Partial<EmailConfig>) => void;
}

const nowISO = () => new Date().toISOString();

export const useEmailStore = create<EmailStore>((set) => ({
  threads: seedThreads,
  templates: seedTemplates,
  signatures: seedSignatures,
  campaigns: seedCampaigns,
  config: seedConfig,

  createThread: (data) => {
    const t: EmailThread = { ...data, id: `thread_${Date.now()}`, createdAt: nowISO(), updatedAt: nowISO() };
    set((s) => ({ threads: [t, ...s.threads] }));
    return t;
  },
  updateThread: (id, updates) => set((s) => ({ threads: s.threads.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: nowISO() } : t)) })),
  deleteThread: (id) => set((s) => ({ threads: s.threads.filter((t) => t.id !== id) })),
  markAsRead: (id) => set((s) => ({ threads: s.threads.map((t) => (t.id === id ? { ...t, status: "read", updatedAt: nowISO() } : t)) })),
  markAsUnread: (id) => set((s) => ({ threads: s.threads.map((t) => (t.id === id ? { ...t, status: "unread", updatedAt: nowISO() } : t)) })),
  archiveThread: (id) => set((s) => ({ threads: s.threads.map((t) => (t.id === id ? { ...t, status: "archived", updatedAt: nowISO() } : t)) })),

  createTemplate: (data) => {
    const t: EmailTemplate = { ...data, id: `template_${Date.now()}`, createdAt: nowISO(), updatedAt: nowISO(), usageCount: 0 };
    set((s) => ({ templates: [...s.templates, t] }));
    return t;
  },
  updateTemplate: (id, updates) => set((s) => ({ templates: s.templates.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: nowISO() } : t)) })),
  deleteTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
  approveTemplate: (id, approvedBy) => set((s) => ({ templates: s.templates.map((t) => (t.id === id ? { ...t, status: "approved", approvedAt: nowISO(), approvedBy, updatedAt: nowISO() } : t)) })),

  createSignature: (data) => {
    const sig: EmailSignature = { ...data, id: `sig_${Date.now()}`, createdAt: nowISO(), updatedAt: nowISO() };
    set((s) => ({ signatures: [...s.signatures, sig] }));
    return sig;
  },
  updateSignature: (id, updates) => set((s) => ({ signatures: s.signatures.map((x) => (x.id === id ? { ...x, ...updates, updatedAt: nowISO() } : x)) })),
  deleteSignature: (id) => set((s) => ({ signatures: s.signatures.filter((x) => x.id !== id) })),

  createCampaign: (data) => {
    const c: EmailCampaign = { ...data, id: `email_camp_${Date.now()}`, createdAt: nowISO(), progress: emptyProgress() };
    set((s) => ({ campaigns: [...s.campaigns, c] }));
    return c;
  },
  updateCampaign: (id, updates) => set((s) => ({ campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
  deleteCampaign: (id) => set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),
  startCampaign: (id) => set((s) => ({ campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status: "active", startedAt: nowISO() } : c)) })),
  pauseCampaign: (id) => set((s) => ({ campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status: "paused" } : c)) })),

  updateConfig: (updates) => set((s) => ({ config: { ...s.config, ...updates } })),
}));

export function useEmail() {
  const store = useEmailStore();

  const getStats = () => {
    const { threads, templates, campaigns } = store;
    const totalSent = campaigns.reduce((sum, c) => sum + c.progress.sent, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.progress.opened, 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + c.progress.clicked, 0);
    const totalReplied = campaigns.reduce((sum, c) => sum + c.progress.replied, 0);
    return {
      totalThreads: threads.length,
      unreadThreads: threads.filter((t) => t.status === "unread").length,
      totalTemplates: templates.length,
      activeTemplates: templates.filter((t) => t.status === "active").length,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c) => c.status === "active").length,
      totalSent, totalOpened, totalClicked, totalReplied,
      openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0",
      clickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0",
      replyRate: totalSent > 0 ? ((totalReplied / totalSent) * 100).toFixed(1) : "0",
    };
  };

  return { ...store, getStats };
}
