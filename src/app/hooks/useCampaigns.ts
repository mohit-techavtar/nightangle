import { useState, useCallback } from "react";

export type CampaignType =
  | "sales-outreach"
  | "lead-qualification"
  | "follow-up-nurture"
  | "support-notification"
  | "collections"
  | "surveys-feedback"
  | "transactional-alerts";

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";

export type CampaignChannel = "ai-calling" | "whatsapp" | "sms" | "email";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  description?: string;
  objective?: string;

  // Channel orchestration
  primaryChannel: CampaignChannel;
  fallbackChannels?: CampaignChannel[];

  // Audience
  audienceSize: number;
  audienceFilter?: {
    leadSource?: string[];
    pipelineStages?: string[];
    scoreRange?: { min: number; max: number };
    lastActivity?: string;
    tags?: string[];
    assignedOwner?: string[];
    consentStatus?: "granted" | "pending" | "denied";
    customFilters?: Record<string, any>;
  };

  // Exclusion Rules (Module 5 requirement)
  exclusionRules?: {
    optOutLeads: boolean;
    dndQuietHours: boolean;
    recentlyContacted?: { hours: number };
    activeConversations: boolean;
    suppressionLists?: string[];
  };

  // Progress & Metrics
  progress: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    converted: number;
    failed: number;
  };

  // Performance metrics
  metrics: {
    connectRate?: number;
    responseRate?: number;
    conversionRate?: number;
    avgDuration?: string;
    recoveryRate?: number;
    recoveredAmount?: number;
    roi?: number;
  };

  // Scheduling
  schedule?: {
    type: "immediate" | "scheduled" | "recurring";
    startDate?: string;
    endDate?: string;
    time?: string;
    timezone?: string;
    daysOfWeek?: string[];
    frequency?: "daily" | "weekly" | "monthly";
  };

  // Channel-specific configuration
  channels: {
    aiCalling?: {
      agentId: string;
      agentName: string;
      callScript?: string;
      maxAttempts: number;
      callWindow: {
        start: string;
        end: string;
        timezone: string;
      };
    };
    whatsapp?: {
      templateId: string;
      templateName: string;
      variables?: Record<string, string>;
    };
    sms?: {
      message: string;
      sender: string;
    };
    email?: {
      subject: string;
      templateId: string;
      fromName: string;
      fromEmail: string;
    };
  };

  // Execution Triggers (Module 5 requirement)
  triggers?: {
    type: "manual" | "scheduled" | "lead-creation" | "stage-change" | "ai-call-outcome" | "inactivity-timeout" | "webhook";
    config?: {
      stageChange?: { from: string; to: string };
      inactivityDays?: number;
      callOutcome?: string[];
      webhookUrl?: string;
    };
  };

  // Channel Sequencing & Flow (Module 5 requirement)
  flow?: {
    type: "single-channel" | "multi-step-sequence" | "ai-driven";
    steps?: Array<{
      id: string;
      channel: CampaignChannel;
      config: any;
      waitTime?: { value: number; unit: "hours" | "days" };
      conditions?: Array<{
        type: "no-answer" | "no-response" | "engaged" | "failed";
        nextStepId?: string;
        action: "continue" | "skip" | "exit" | "retry";
      }>;
    }>;
  };

  // Lead-Level Campaign State (Module 5 requirement)
  leadStates?: Record<string, {
    leadId: string;
    currentStep: string;
    lastAction?: {
      channel: string;
      timestamp: string;
      outcome: string;
    };
    nextScheduledAction?: {
      channel: string;
      scheduledAt: string;
    };
    exitReason?: string;
  }>;

  // Budget & Cost Control (Module 5 enhanced)
  budget?: {
    totalCap: number;
    dailyLimit?: number;
    perLeadLimit?: number;
    channelSpecificCaps?: Record<CampaignChannel, number>;
    spent: number;
    currency: string;
    autoPauseOnLimit: boolean;
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
  pauseReason?: string;

  // AI Decision Capabilities (Module 5 requirement)
  aiConfig?: {
    enabled: boolean;
    capabilities: {
      decideNextChannel: boolean;
      chooseMessageVariant: boolean;
      adjustTiming: boolean;
      escalateToHuman: boolean;
      terminateEarly: boolean;
    };
    guardrails?: {
      maxBudgetOverride: boolean;
      respectComplianceRules: boolean;
      honorOptOut: boolean;
    };
  };

  // Failure Handling & Recovery (Module 5 requirement)
  failureHandling?: {
    onChannelFailure: "retry" | "switch-channel" | "exit" | "flag-review";
    maxRetries?: number;
    retryDelay?: { value: number; unit: "minutes" | "hours" };
    onBudgetExhaustion: "pause" | "notify" | "continue-limited";
    onTimeWindowViolation: "skip" | "reschedule" | "exit";
  };

  // Tags & Organization
  tags: string[];
  folder?: string;
  priority?: "low" | "medium" | "high";
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  primaryChannel: CampaignChannel;
  icon: string;
  defaultConfig: Partial<Campaign>;
}

const campaignTemplates: CampaignTemplate[] = [
  {
    id: "sales-outreach",
    name: "Sales Outreach",
    description: "Reach out to qualified leads with AI calling",
    type: "sales-outreach",
    primaryChannel: "ai-calling",
    icon: "phone",
    defaultConfig: {
      primaryChannel: "ai-calling",
      fallbackChannels: ["whatsapp", "sms"],
      schedule: {
        type: "recurring",
        frequency: "daily",
        daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"]
      },
      exclusionRules: {
        optOutLeads: true,
        dndQuietHours: true,
        activeConversations: true
      }
    }
  },
  {
    id: "lead-qualification",
    name: "Lead Qualification",
    description: "Qualify and score incoming leads",
    type: "lead-qualification",
    primaryChannel: "ai-calling",
    icon: "user-check",
    defaultConfig: {
      primaryChannel: "ai-calling",
      triggers: {
        type: "lead-creation"
      }
    }
  },
  {
    id: "follow-up-nurture",
    name: "Follow-up & Nurture",
    description: "Multi-touch nurture sequence",
    type: "follow-up-nurture",
    primaryChannel: "email",
    icon: "mail",
    defaultConfig: {
      primaryChannel: "email",
      fallbackChannels: ["whatsapp", "sms"],
      flow: {
        type: "multi-step-sequence"
      }
    }
  },
  {
    id: "debt-collection",
    name: "Collections",
    description: "Automated payment reminder sequence",
    type: "collections",
    primaryChannel: "ai-calling",
    icon: "dollar-sign",
    defaultConfig: {
      primaryChannel: "ai-calling",
      fallbackChannels: ["sms", "whatsapp"]
    }
  },
  {
    id: "surveys-feedback",
    name: "Surveys & Feedback",
    description: "Collect customer feedback",
    type: "surveys-feedback",
    primaryChannel: "whatsapp",
    icon: "message-square",
    defaultConfig: {
      primaryChannel: "whatsapp",
      fallbackChannels: ["sms", "email"]
    }
  },
  {
    id: "transactional-alerts",
    name: "Transactional Alerts",
    description: "Order confirmations and notifications",
    type: "transactional-alerts",
    primaryChannel: "sms",
    icon: "bell",
    defaultConfig: {
      primaryChannel: "sms",
      fallbackChannels: ["whatsapp", "email"],
      triggers: {
        type: "webhook"
      }
    }
  }
];

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp_1",
      name: "Jewellery Software Q2",
      type: "sales-outreach",
      status: "active",
      description: "Outreach campaign for jewellery management software",
      objective: "Generate 50 qualified leads for jewellery software demo",
      primaryChannel: "ai-calling",
      fallbackChannels: ["whatsapp", "sms"],
      audienceSize: 600,
      progress: {
        sent: 456,
        delivered: 456,
        read: 0,
        replied: 156,
        converted: 34,
        failed: 0
      },
      metrics: {
        connectRate: 68,
        conversionRate: 7.4,
        avgDuration: "3m 42s",
        roi: 340
      },
      schedule: {
        type: "recurring",
        frequency: "daily",
        daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
        time: "10:00-18:00",
        timezone: "IST"
      },
      channels: {
        aiCalling: {
          agentId: "agent_1",
          agentName: "Priya (Sales)",
          maxAttempts: 3,
          callWindow: {
            start: "10:00",
            end: "18:00",
            timezone: "IST"
          }
        }
      },
      budget: {
        total: 15000,
        spent: 8200,
        currency: "INR"
      },
      createdAt: "2026-03-01T10:00:00Z",
      updatedAt: "2026-04-21T09:30:00Z",
      createdBy: "user@company.com",
      startedAt: "2026-03-15T10:00:00Z",
      tags: ["sales", "software", "q2"],
      priority: "high"
    },
    {
      id: "camp_2",
      name: "Spring Sale Announcement",
      type: "whatsapp",
      status: "completed",
      description: "WhatsApp campaign for spring sale",
      audienceSize: 5420,
      progress: {
        sent: 5420,
        delivered: 5340,
        read: 4856,
        replied: 892,
        converted: 234,
        failed: 80
      },
      metrics: {
        responseRate: 16.4,
        conversionRate: 4.3,
        roi: 520
      },
      schedule: {
        type: "scheduled",
        startDate: "2026-03-15",
        timezone: "IST"
      },
      channels: {
        whatsapp: {
          templateId: "template_1",
          templateName: "Spring Sale 2024",
          variables: {
            discount: "20",
            code: "SPRING20"
          }
        }
      },
      budget: {
        total: 10000,
        spent: 10000,
        currency: "INR"
      },
      createdAt: "2026-03-10T10:00:00Z",
      updatedAt: "2026-03-20T18:00:00Z",
      createdBy: "user@company.com",
      startedAt: "2026-03-15T09:00:00Z",
      completedAt: "2026-03-20T18:00:00Z",
      tags: ["marketing", "whatsapp", "promotion"],
      priority: "medium"
    },
    {
      id: "camp_3",
      name: "Product Launch Notification",
      type: "multi-channel",
      status: "scheduled",
      description: "Multi-channel campaign for new product launch",
      audienceSize: 8200,
      progress: {
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        converted: 0,
        failed: 0
      },
      metrics: {},
      schedule: {
        type: "scheduled",
        startDate: "2026-05-01",
        time: "10:00",
        timezone: "IST"
      },
      channels: {
        whatsapp: {
          templateId: "template_2",
          templateName: "New Product Launch"
        },
        email: {
          subject: "Introducing Our Latest Innovation",
          templateId: "email_template_1",
          fromName: "Everest Digital",
          fromEmail: "noreply@everestdigital.com"
        },
        sms: {
          message: "Exciting news! Check your email for our latest product announcement.",
          sender: "Everest"
        }
      },
      budget: {
        total: 25000,
        spent: 0,
        currency: "INR"
      },
      createdAt: "2026-04-15T14:00:00Z",
      updatedAt: "2026-04-15T14:00:00Z",
      createdBy: "user@company.com",
      tags: ["product-launch", "multi-channel"],
      priority: "high"
    }
  ]);

  // Create campaign
  const createCampaign = useCallback((data: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "progress">) => {
    const newCampaign: Campaign = {
      ...data,
      id: `camp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: {
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        converted: 0,
        failed: 0
      }
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    return newCampaign;
  }, []);

  // Update campaign
  const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id
        ? { ...campaign, ...updates, updatedAt: new Date().toISOString() }
        : campaign
    ));
  }, []);

  // Delete campaign
  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  }, []);

  // Duplicate campaign
  const duplicateCampaign = useCallback((id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return null;

    const duplicated: Campaign = {
      ...campaign,
      id: `camp_${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: undefined,
      completedAt: undefined,
      pausedAt: undefined,
      progress: {
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        converted: 0,
        failed: 0
      },
      budget: campaign.budget ? {
        ...campaign.budget,
        spent: 0
      } : undefined
    };

    setCampaigns(prev => [duplicated, ...prev]);
    return duplicated;
  }, [campaigns]);

  // Start/Resume campaign
  const startCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id
        ? {
            ...campaign,
            status: "active" as const,
            startedAt: campaign.startedAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            pauseReason: undefined
          }
        : campaign
    ));
  }, []);

  // Pause campaign
  const pauseCampaign = useCallback((id: string, reason?: string) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id
        ? {
            ...campaign,
            status: "paused" as const,
            pausedAt: new Date().toISOString(),
            pauseReason: reason,
            updatedAt: new Date().toISOString()
          }
        : campaign
    ));
  }, []);

  // Complete campaign
  const completeCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id
        ? {
            ...campaign,
            status: "completed" as const,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : campaign
    ));
  }, []);

  // Get campaign by ID
  const getCampaignById = useCallback((id: string) => {
    return campaigns.find(c => c.id === id);
  }, [campaigns]);

  // Get campaigns by type
  const getCampaignsByType = useCallback((type: Campaign["type"]) => {
    return campaigns.filter(c => c.type === type);
  }, [campaigns]);

  // Get campaigns by status
  const getCampaignsByStatus = useCallback((status: Campaign["status"]) => {
    return campaigns.filter(c => c.status === status);
  }, [campaigns]);

  // Calculate stats
  const getStats = useCallback(() => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === "active").length;
    const scheduled = campaigns.filter(c => c.status === "scheduled").length;
    const completed = campaigns.filter(c => c.status === "completed").length;
    const paused = campaigns.filter(c => c.status === "paused").length;
    const draft = campaigns.filter(c => c.status === "draft").length;

    const totalReach = campaigns.reduce((sum, c) => sum + c.audienceSize, 0);
    const totalSent = campaigns.reduce((sum, c) => sum + c.progress.sent, 0);
    const totalConverted = campaigns.reduce((sum, c) => sum + c.progress.converted, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget?.total || 0), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + (c.budget?.spent || 0), 0);

    const avgConversionRate = totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(2) : "0";

    return {
      total,
      active,
      scheduled,
      completed,
      paused,
      draft,
      totalReach,
      totalSent,
      totalConverted,
      totalBudget,
      totalSpent,
      avgConversionRate
    };
  }, [campaigns]);

  return {
    campaigns,
    campaignTemplates,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    startCampaign,
    pauseCampaign,
    completeCampaign,
    getCampaignById,
    getCampaignsByType,
    getCampaignsByStatus,
    getStats
  };
}
