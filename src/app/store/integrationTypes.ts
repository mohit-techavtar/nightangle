// Integration Module Types

export type IntegrationId = string & { readonly brand: unique symbol };
export type WebhookId = string & { readonly brand: unique symbol };
export type APIKeyId = string & { readonly brand: unique symbol };

export type IntegrationCategory =
  | 'email'
  | 'calendar'
  | 'communication'
  | 'marketing'
  | 'payment'
  | 'storage'
  | 'social'
  | 'analytics'
  | 'telephony'
  | 'custom';

export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'configuring';

export type AuthType = 'oauth2' | 'api_key' | 'basic' | 'custom';

export interface Integration {
  id: IntegrationId;
  name: string;
  slug: string;
  description: string;
  category: IntegrationCategory;
  provider: string;
  logoUrl: string;
  status: IntegrationStatus;
  authType: AuthType;
  isActive: boolean;
  isPremium: boolean;
  connectedAt?: Date;
  lastSyncedAt?: Date;
  config?: Record<string, any>;
  features: string[];
  supportedActions: string[];
  rateLimit?: {
    requests: number;
    period: 'minute' | 'hour' | 'day';
  };
  credentials?: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  settings?: {
    syncEnabled: boolean;
    syncInterval: number; // minutes
    webhooksEnabled: boolean;
    autoRetry: boolean;
    retryAttempts: number;
  };
  metadata?: {
    version: string;
    documentationUrl?: string;
    supportEmail?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface APIKey {
  id: APIKeyId;
  name: string;
  key: string;
  secret?: string;
  environment: 'production' | 'sandbox';
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  createdBy: string;
}

export interface Webhook {
  id: WebhookId;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  headers?: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
  lastTriggeredAt?: Date;
  successCount: number;
  failureCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IntegrationLog {
  id: string;
  integrationId: IntegrationId;
  integrationName: string;
  action: 'connect' | 'disconnect' | 'sync' | 'error' | 'config_update' | 'webhook_trigger';
  status: 'success' | 'failed' | 'pending';
  message: string;
  details?: Record<string, any>;
  duration?: number; // milliseconds
  timestamp: Date;
}

export interface IntegrationSyncJob {
  id: string;
  integrationId: IntegrationId;
  type: 'full' | 'incremental';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  itemsProcessed: number;
  itemsTotal: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface MarketplaceIntegration {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: IntegrationCategory;
  provider: string;
  logoUrl: string;
  screenshots: string[];
  isPremium: boolean;
  isPopular: boolean;
  isNew: boolean;
  authType: AuthType;
  features: string[];
  supportedActions: string[];
  pricing?: {
    free: boolean;
    startingPrice?: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  installCount: number;
  metadata: {
    version: string;
    documentationUrl: string;
    supportEmail: string;
    website?: string;
  };
}
