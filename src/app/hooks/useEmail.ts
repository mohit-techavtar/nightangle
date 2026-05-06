import { useState, useCallback } from "react";

export interface EmailThread {
  id: string;
  subject: string;
  participants: {
    from: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
  };
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
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

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
  progress: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
    unsubscribed: number;
    converted: number;
  };
  schedule?: {
    startDate?: string;
    endDate?: string;
    quietHours?: { start: string; end: string };
    daysOfWeek?: string[];
  };
  controls: {
    sendCap?: number;
    dailyLimit?: number;
    requireApproval: boolean;
    respectQuietHours: boolean;
  };
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface EmailConfig {
  senderIdentity: {
    fromEmail: string;
    fromName: string;
    replyTo: string;
    domain: string;
  };
  provider: "sendgrid" | "mailgun" | "ses" | "smtp";
  deliverability: {
    spf: {
      status: "verified" | "pending" | "failed" | "not_configured";
      record?: string;
    };
    dkim: {
      status: "verified" | "pending" | "failed" | "not_configured";
      selector?: string;
    };
    dmarc: {
      status: "verified" | "pending" | "failed" | "not_configured";
      policy?: string;
    };
  };
  sendLimits: {
    dailyLimit: number;
    hourlyLimit: number;
    perRecipientLimit: number;
    throttling: {
      enabled: boolean;
      messagesPerBatch: number;
      delayBetweenBatchesMs: number;
    };
  };
  compliance: {
    unsubscribe: {
      enabled: boolean;
      pageUrl: string;
      oneClickUnsubscribe: boolean;
    };
    suppressionList: {
      addresses: string[];
      autoSuppressBounces: boolean;
      autoSuppressComplaints: boolean;
    };
    dataRetention: {
      emailContentDays: number;
      analyticsDataDays: number;
      deleteUnsubscribedUsers: boolean;
    };
  };
}

export function useEmail() {
  const [threads, setThreads] = useState<EmailThread[]>([
    {
      id: "thread_1",
      subject: "Re: Enterprise plan inquiry",
      participants: {
        from: "sarah.chen@techcorp.com",
        to: ["sales@company.com"]
      },
      leadId: "lead_1",
      leadName: "Sarah Chen",
      messages: [],
      status: "unread",
      tags: ["sales", "enterprise"],
      sentiment: "positive",
      priority: "high",
      assignedTo: "John Smith",
      createdAt: "2026-04-20T14:25:00Z",
      updatedAt: "2026-04-21T10:15:00Z",
      lastMessageAt: "2026-04-21T10:15:00Z"
    },
    {
      id: "thread_2",
      subject: "Product demo follow-up",
      participants: {
        from: "support@company.com",
        to: ["michael.rodriguez@startup.io"]
      },
      leadId: "lead_2",
      leadName: "Michael Rodriguez",
      messages: [],
      status: "replied",
      tags: ["support", "demo"],
      sentiment: "neutral",
      priority: "medium",
      createdAt: "2026-04-19T09:00:00Z",
      updatedAt: "2026-04-20T16:30:00Z",
      lastMessageAt: "2026-04-20T16:30:00Z"
    }
  ]);

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "template_1",
      name: "Welcome Email",
      subject: "Welcome to {{company_name}}!",
      bodyHtml: "<p>Hi {{lead_name}},</p><p>Welcome to {{company_name}}! We're excited to have you on board.</p>",
      bodyText: "Hi {{lead_name}}, Welcome to {{company_name}}! We're excited to have you on board.",
      category: "transactional",
      variables: ["lead_name", "company_name"],
      language: "en",
      status: "active",
      createdBy: "admin@company.com",
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-03-01T10:00:00Z",
      approvedAt: "2026-03-01T11:00:00Z",
      approvedBy: "manager@company.com",
      usageCount: 1234
    },
    {
      id: "template_2",
      name: "Product Launch Announcement",
      subject: "🚀 Introducing Our Latest Innovation",
      bodyHtml: "<p>Hi {{lead_name}},</p><p>We're thrilled to announce our latest product...</p>",
      bodyText: "Hi {{lead_name}}, We're thrilled to announce our latest product...",
      category: "marketing",
      variables: ["lead_name", "product_name", "cta_link"],
      language: "en",
      status: "approved",
      createdBy: "marketing@company.com",
      createdAt: "2026-04-10T14:00:00Z",
      updatedAt: "2026-04-15T09:00:00Z",
      approvedAt: "2026-04-15T10:00:00Z",
      approvedBy: "manager@company.com",
      usageCount: 567
    }
  ]);

  const [signatures, setSignatures] = useState<EmailSignature[]>([
    {
      id: "sig_1",
      name: "Default Company Signature",
      html: "<p>Best regards,<br/><strong>{{user_name}}</strong><br/>{{user_role}}<br/>Company Name</p>",
      text: "Best regards,\n{{user_name}}\n{{user_role}}\nCompany Name",
      scope: "tenant",
      isDefault: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    }
  ]);

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: "email_camp_1",
      name: "Spring Product Launch",
      type: "broadcast",
      status: "active",
      templateId: "template_2",
      audienceSize: 5420,
      progress: {
        sent: 4231,
        delivered: 4156,
        opened: 2847,
        clicked: 892,
        replied: 156,
        bounced: 75,
        unsubscribed: 12,
        converted: 67
      },
      schedule: {
        startDate: "2026-04-15T09:00:00Z",
        quietHours: { start: "22:00", end: "08:00" }
      },
      controls: {
        dailyLimit: 1000,
        requireApproval: false,
        respectQuietHours: true
      },
      createdBy: "marketing@company.com",
      createdAt: "2026-04-10T10:00:00Z",
      startedAt: "2026-04-15T09:00:00Z"
    }
  ]);

  const [config, setConfig] = useState<EmailConfig>({
    senderIdentity: {
      fromEmail: "noreply@company.com",
      fromName: "Company Name",
      replyTo: "support@company.com",
      domain: "company.com"
    },
    provider: "sendgrid",
    deliverability: {
      spf: {
        status: "verified",
        record: "v=spf1 include:_spf.sendgrid.net ~all"
      },
      dkim: {
        status: "verified",
        selector: "s1"
      },
      dmarc: {
        status: "verified",
        policy: "v=DMARC1; p=quarantine; rua=mailto:dmarc@company.com"
      }
    },
    sendLimits: {
      dailyLimit: 10000,
      hourlyLimit: 1000,
      perRecipientLimit: 5,
      throttling: {
        enabled: true,
        messagesPerBatch: 100,
        delayBetweenBatchesMs: 1000
      }
    },
    compliance: {
      unsubscribe: {
        enabled: true,
        pageUrl: "https://company.com/unsubscribe",
        oneClickUnsubscribe: true
      },
      suppressionList: {
        addresses: [],
        autoSuppressBounces: true,
        autoSuppressComplaints: true
      },
      dataRetention: {
        emailContentDays: 365,
        analyticsDataDays: 730,
        deleteUnsubscribedUsers: false
      }
    }
  });

  // Thread operations
  const createThread = useCallback((data: Omit<EmailThread, "id" | "createdAt" | "updatedAt">) => {
    const newThread: EmailThread = {
      ...data,
      id: `thread_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setThreads(prev => [newThread, ...prev]);
    return newThread;
  }, []);

  const updateThread = useCallback((id: string, updates: Partial<EmailThread>) => {
    setThreads(prev => prev.map(thread =>
      thread.id === id
        ? { ...thread, ...updates, updatedAt: new Date().toISOString() }
        : thread
    ));
  }, []);

  const deleteThread = useCallback((id: string) => {
    setThreads(prev => prev.filter(thread => thread.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    updateThread(id, { status: "read" });
  }, [updateThread]);

  const markAsUnread = useCallback((id: string) => {
    updateThread(id, { status: "unread" });
  }, [updateThread]);

  const archiveThread = useCallback((id: string) => {
    updateThread(id, { status: "archived" });
  }, [updateThread]);

  // Template operations
  const createTemplate = useCallback((data: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt" | "usageCount">) => {
    const newTemplate: EmailTemplate = {
      ...data,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<EmailTemplate>) => {
    setTemplates(prev => prev.map(template =>
      template.id === id
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    ));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  }, []);

  const approveTemplate = useCallback((id: string, approvedBy: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === id
        ? {
            ...template,
            status: "approved" as const,
            approvedAt: new Date().toISOString(),
            approvedBy,
            updatedAt: new Date().toISOString()
          }
        : template
    ));
  }, []);

  // Signature operations
  const createSignature = useCallback((data: Omit<EmailSignature, "id" | "createdAt" | "updatedAt">) => {
    const newSignature: EmailSignature = {
      ...data,
      id: `sig_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSignatures(prev => [...prev, newSignature]);
    return newSignature;
  }, []);

  const updateSignature = useCallback((id: string, updates: Partial<EmailSignature>) => {
    setSignatures(prev => prev.map(signature =>
      signature.id === id
        ? { ...signature, ...updates, updatedAt: new Date().toISOString() }
        : signature
    ));
  }, []);

  const deleteSignature = useCallback((id: string) => {
    setSignatures(prev => prev.filter(signature => signature.id !== id));
  }, []);

  // Config operations
  const updateConfig = useCallback((updates: Partial<EmailConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Campaign operations
  const createCampaign = useCallback((data: Omit<EmailCampaign, "id" | "createdAt" | "progress">) => {
    const newCampaign: EmailCampaign = {
      ...data,
      id: `email_camp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      progress: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        bounced: 0,
        unsubscribed: 0,
        converted: 0
      }
    };
    setCampaigns(prev => [...prev, newCampaign]);
    return newCampaign;
  }, []);

  const updateCampaign = useCallback((id: string, updates: Partial<EmailCampaign>) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id ? { ...campaign, ...updates } : campaign
    ));
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  }, []);

  const startCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id
        ? { ...campaign, status: "active" as const, startedAt: new Date().toISOString() }
        : campaign
    ));
  }, []);

  const pauseCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id ? { ...campaign, status: "paused" as const } : campaign
    ));
  }, []);

  // Stats
  const getStats = useCallback(() => {
    const totalThreads = threads.length;
    const unreadThreads = threads.filter(t => t.status === "unread").length;
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter(t => t.status === "active").length;
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === "active").length;

    const totalSent = campaigns.reduce((sum, c) => sum + c.progress.sent, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.progress.opened, 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + c.progress.clicked, 0);
    const totalReplied = campaigns.reduce((sum, c) => sum + c.progress.replied, 0);

    const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
    const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0";
    const replyRate = totalSent > 0 ? ((totalReplied / totalSent) * 100).toFixed(1) : "0";

    return {
      totalThreads,
      unreadThreads,
      totalTemplates,
      activeTemplates,
      totalCampaigns,
      activeCampaigns,
      totalSent,
      totalOpened,
      totalClicked,
      totalReplied,
      openRate,
      clickRate,
      replyRate
    };
  }, [threads, templates, campaigns]);

  return {
    // State
    threads,
    templates,
    signatures,
    campaigns,
    config,

    // Thread operations
    createThread,
    updateThread,
    deleteThread,
    markAsRead,
    markAsUnread,
    archiveThread,

    // Template operations
    createTemplate,
    updateTemplate,
    deleteTemplate,
    approveTemplate,

    // Signature operations
    createSignature,
    updateSignature,
    deleteSignature,

    // Campaign operations
    createCampaign,
    updateCampaign,
    deleteCampaign,
    startCampaign,
    pauseCampaign,

    // Config operations
    updateConfig,

    // Stats
    getStats
  };
}
