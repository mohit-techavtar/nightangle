import { useState, useCallback } from "react";

export interface APIKey {
  id: string;
  name: string;
  key: string;
  environment: "production" | "sandbox";
  status: "active" | "revoked";
  permissions: string[];
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  createdBy: string;
  usageCount: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive" | "failed";
  secret: string;
  retryConfig: {
    maxRetries: number;
    retryDelay: number; // seconds
  };
  headers: { key: string; value: string }[];
  createdAt: string;
  lastTriggeredAt?: string;
  successCount: number;
  failureCount: number;
  lastError?: string;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  status: "success" | "failed" | "pending" | "retrying";
  responseCode?: number;
  responseTime?: number; // ms
  attempts: number;
  timestamp: string;
  errorMessage?: string;
}

export interface APIUsage {
  date: string;
  requests: number;
  successful: number;
  failed: number;
  avgResponseTime: number;
}

const AVAILABLE_EVENTS = [
  "lead.created",
  "lead.updated",
  "message.received",
  "message.sent",
  "message.delivered",
  "message.read",
  "campaign.started",
  "campaign.completed",
  "stage.changed",
  "consent.opted_in",
  "consent.opted_out",
  "sla.breached",
  "template.approved",
  "template.rejected"
];

export function useWhatsAppAPI() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "key_1",
      name: "Production API Key",
      key: "waba_prod_a1b2c3d4e5f6g7h8i9j0",
      environment: "production",
      status: "active",
      permissions: ["messages:read", "messages:write", "campaigns:read", "campaigns:write", "leads:read", "webhooks:manage"],
      createdAt: "2026-03-01T10:00:00Z",
      lastUsedAt: "2026-04-21T08:30:00Z",
      createdBy: "admin@company.com",
      usageCount: 15847,
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerDay: 50000
      }
    },
    {
      id: "key_2",
      name: "Sandbox Testing Key",
      key: "waba_sandbox_k1l2m3n4o5p6q7r8s9t0",
      environment: "sandbox",
      status: "active",
      permissions: ["messages:read", "messages:write", "leads:read"],
      createdAt: "2026-03-15T14:00:00Z",
      lastUsedAt: "2026-04-20T16:45:00Z",
      createdBy: "developer@company.com",
      usageCount: 3421,
      rateLimit: {
        requestsPerMinute: 20,
        requestsPerDay: 5000
      }
    }
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "webhook_1",
      name: "CRM Integration Webhook",
      url: "https://api.yourcrm.com/webhooks/whatsapp",
      events: ["lead.created", "lead.updated", "stage.changed"],
      status: "active",
      secret: "whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      retryConfig: {
        maxRetries: 3,
        retryDelay: 60
      },
      headers: [
        { key: "X-CRM-Auth", value: "Bearer crm_token_xyz" }
      ],
      createdAt: "2026-03-10T12:00:00Z",
      lastTriggeredAt: "2026-04-21T09:15:00Z",
      successCount: 2847,
      failureCount: 12
    },
    {
      id: "webhook_2",
      name: "Analytics Pipeline",
      url: "https://analytics.company.com/ingest/whatsapp",
      events: ["message.received", "message.sent", "message.delivered", "message.read"],
      status: "active",
      secret: "whsec_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4",
      retryConfig: {
        maxRetries: 5,
        retryDelay: 30
      },
      headers: [
        { key: "Authorization", value: "ApiKey analytics_key_123" }
      ],
      createdAt: "2026-04-01T08:00:00Z",
      lastTriggeredAt: "2026-04-21T09:20:00Z",
      successCount: 18934,
      failureCount: 45
    }
  ]);

  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([
    {
      id: "event_1",
      webhookId: "webhook_1",
      event: "lead.created",
      payload: { leadId: "lead_123", source: "WhatsApp", phone: "+1234567890" },
      status: "success",
      responseCode: 200,
      responseTime: 245,
      attempts: 1,
      timestamp: "2026-04-21T09:15:00Z"
    },
    {
      id: "event_2",
      webhookId: "webhook_2",
      event: "message.received",
      payload: { messageId: "msg_456", from: "+1234567890", text: "Hello" },
      status: "success",
      responseCode: 200,
      responseTime: 123,
      attempts: 1,
      timestamp: "2026-04-21T09:20:00Z"
    },
    {
      id: "event_3",
      webhookId: "webhook_1",
      event: "stage.changed",
      payload: { leadId: "lead_789", oldStage: "contacted", newStage: "qualified" },
      status: "failed",
      responseCode: 500,
      responseTime: 5000,
      attempts: 3,
      timestamp: "2026-04-21T08:45:00Z",
      errorMessage: "Internal Server Error: Database timeout"
    }
  ]);

  const [usage, setUsage] = useState<APIUsage[]>([
    { date: "2026-04-15", requests: 2345, successful: 2320, failed: 25, avgResponseTime: 156 },
    { date: "2026-04-16", requests: 2678, successful: 2650, failed: 28, avgResponseTime: 168 },
    { date: "2026-04-17", requests: 2234, successful: 2210, failed: 24, avgResponseTime: 145 },
    { date: "2026-04-18", requests: 2890, successful: 2865, failed: 25, avgResponseTime: 178 },
    { date: "2026-04-19", requests: 2456, successful: 2430, failed: 26, avgResponseTime: 162 },
    { date: "2026-04-20", requests: 2567, successful: 2540, failed: 27, avgResponseTime: 159 },
    { date: "2026-04-21", requests: 1234, successful: 1220, failed: 14, avgResponseTime: 152 }
  ]);

  // API Key CRUD Operations
  const createAPIKey = useCallback((data: Omit<APIKey, "id" | "key" | "createdAt" | "usageCount" | "lastUsedAt">) => {
    const newKey: APIKey = {
      ...data,
      id: `key_${Date.now()}`,
      key: `waba_${data.environment}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };
    setApiKeys(prev => [...prev, newKey]);
    return newKey;
  }, []);

  const updateAPIKey = useCallback((id: string, updates: Partial<APIKey>) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, ...updates } : key
    ));
  }, []);

  const revokeAPIKey = useCallback((id: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, status: "revoked" as const } : key
    ));
  }, []);

  const deleteAPIKey = useCallback((id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  }, []);

  const regenerateAPIKey = useCallback((id: string) => {
    const newKeyValue = `waba_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKeys(prev => prev.map(key =>
      key.id === id ? { ...key, key: newKeyValue, status: "active" as const } : key
    ));
    return newKeyValue;
  }, []);

  // Webhook CRUD Operations
  const createWebhook = useCallback((data: Omit<Webhook, "id" | "secret" | "createdAt" | "successCount" | "failureCount">) => {
    const newWebhook: Webhook = {
      ...data,
      id: `webhook_${Date.now()}`,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      successCount: 0,
      failureCount: 0
    };
    setWebhooks(prev => [...prev, newWebhook]);
    return newWebhook;
  }, []);

  const updateWebhook = useCallback((id: string, updates: Partial<Webhook>) => {
    setWebhooks(prev => prev.map(webhook =>
      webhook.id === id ? { ...webhook, ...updates } : webhook
    ));
  }, []);

  const deleteWebhook = useCallback((id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
    setWebhookEvents(prev => prev.filter(event => event.webhookId !== id));
  }, []);

  const toggleWebhookStatus = useCallback((id: string) => {
    setWebhooks(prev => prev.map(webhook =>
      webhook.id === id
        ? { ...webhook, status: webhook.status === "active" ? "inactive" : "active" as const }
        : webhook
    ));
  }, []);

  const regenerateWebhookSecret = useCallback((id: string) => {
    const newSecret = `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setWebhooks(prev => prev.map(webhook =>
      webhook.id === id ? { ...webhook, secret: newSecret } : webhook
    ));
    return newSecret;
  }, []);

  const testWebhook = useCallback(async (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return null;

    const testEvent: WebhookEvent = {
      id: `event_test_${Date.now()}`,
      webhookId: id,
      event: "webhook.test",
      payload: { test: true, timestamp: new Date().toISOString() },
      status: "success",
      responseCode: 200,
      responseTime: Math.floor(Math.random() * 500) + 100,
      attempts: 1,
      timestamp: new Date().toISOString()
    };

    setWebhookEvents(prev => [testEvent, ...prev]);
    setWebhooks(prev => prev.map(w =>
      w.id === id
        ? { ...w, lastTriggeredAt: new Date().toISOString(), successCount: w.successCount + 1 }
        : w
    ));

    return testEvent;
  }, [webhooks]);

  // Get webhook events for a specific webhook
  const getWebhookEvents = useCallback((webhookId: string) => {
    return webhookEvents.filter(event => event.webhookId === webhookId);
  }, [webhookEvents]);

  return {
    // State
    apiKeys,
    webhooks,
    webhookEvents,
    usage,
    availableEvents: AVAILABLE_EVENTS,

    // API Key operations
    createAPIKey,
    updateAPIKey,
    revokeAPIKey,
    deleteAPIKey,
    regenerateAPIKey,

    // Webhook operations
    createWebhook,
    updateWebhook,
    deleteWebhook,
    toggleWebhookStatus,
    regenerateWebhookSecret,
    testWebhook,
    getWebhookEvents
  };
}
