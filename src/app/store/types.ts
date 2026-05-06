// ============================================================
// OmniCRM — Centralized Type Definitions
// India-primary (INR, IST, en-IN, +91)
// ============================================================

// Branded IDs for referential integrity
export type TenantId = string;
export type UserId = string;
export type RoleId = string;
export type LeadId = string;
export type DealId = string;
export type CampaignId = string;
export type AICallId = string;
export type AgentId = string;
export type InvoiceId = string;
export type AuditId = string;
export type CustomObjectId = string;
export type CustomFieldId = string;

// ─── Tenant ─────────────────────────────────────────────────
export type TenantStatus = 'Active' | 'Provisioning' | 'Suspended' | 'Locked' | 'Trial' | 'HardStop';

export interface Tenant {
  id: TenantId;
  name: string;
  slug: string;
  status: TenantStatus;
  plan: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  currency: string; // INR default
  timezone: string; // Asia/Kolkata default
  locale: string;   // en-IN default
  creditBalance: number;
  creditLimit: number;
  usedCredits: number;
  licenseId: string | null;
  createdAt: string;
  updatedAt: string;
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  hardStopActive: boolean;
}

// ─── License ─────────────────────────────────────────────────
export type LicenseStatus = 'Active' | 'PendingApproval' | 'Expired' | 'Suspended' | 'Trial';

export interface License {
  id: string;
  tenantId: TenantId;
  planId: string;
  planName: string;
  status: LicenseStatus;
  startDate: string;
  endDate: string;
  maxUsers: number;
  features: string[];
  approvedBy: UserId[];
  makerId: UserId | null;
  checkerId: UserId | null;
  createdAt: string;
}

// ─── User / Role ─────────────────────────────────────────────
export type UserStatus = 'Active' | 'Inactive' | 'Pending';
export type ActorType = 'human' | 'ai' | 'system';

// Permission actions as per Module 2 spec
export type PermissionAction =
  | 'view' | 'create' | 'edit' | 'delete'
  | 'execute' | 'approve' | 'export' | 'configure'
  | 'communicate' | 'attach' | 'print';

// Session management
export interface UserSession {
  id: string;
  userId: UserId;
  tenantId: TenantId;
  deviceInfo: string;
  ipAddress: string;
  loginTime: string;
  lastActivityTime: string;
  expiresAt: string;
}

// User constraints: max 15 named users per tenant, max 5 concurrent sessions
export interface User {
  id: UserId;
  tenantId: TenantId;
  name: string;
  email: string; // unique per tenant, primary login identifier
  phone: string;
  role: string; // legacy field
  roleIds: RoleId[]; // supports multiple roles
  status: UserStatus;
  avatar: string;
  twoFAEnabled: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  department: string;
  activeSessions: number; // current active session count
  activitySummary?: {
    totalActions: number;
    lastActionTime: string;
    lastActionType: string;
  };
}

// Role with granular Module → Submodule → Action permissions
export interface Role {
  id: RoleId;
  tenantId: TenantId;
  name: string;
  description: string;
  isSystem: boolean; // system roles cannot be deleted
  permissions: PermissionSet;
  userCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: UserId | 'system';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

// Granular permission structure: Module → Submodule → Actions
export interface PermissionSet {
  crm?: {
    leads?: PermissionAction[];
    contacts?: PermissionAction[];
    companies?: PermissionAction[];
    deals?: PermissionAction[];
  };
  aiCalling?: {
    campaigns?: PermissionAction[];
    agents?: PermissionAction[];
    calls?: PermissionAction[];
    analytics?: PermissionAction[];
  };
  campaigns?: {
    email?: PermissionAction[];
    sms?: PermissionAction[];
    whatsapp?: PermissionAction[];
    management?: PermissionAction[];
  };
  analytics?: {
    dashboards?: PermissionAction[];
    reports?: PermissionAction[];
    customReports?: PermissionAction[];
  };
  billing?: {
    invoices?: PermissionAction[];
    usage?: PermissionAction[];
    credits?: PermissionAction[];
  };
  admin?: {
    users?: PermissionAction[];
    roles?: PermissionAction[];
    settings?: PermissionAction[];
    audit?: PermissionAction[];
  };
}

// ─── Lead ────────────────────────────────────────────────────
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Converted' | 'Lost';
export type LeadSource = 'Web Form' | 'CSV Import' | 'WhatsApp' | 'SMS' | 'Manual' | 'AI Call' | 'Meta Ads' | 'LinkedIn' | 'IndiaMART' | 'Google Ads';

export interface TimelineEntry {
  id: string;
  type: 'call' | 'whatsapp' | 'sms' | 'email' | 'note' | 'stage_change' | 'ai_qualification' | 'system';
  actorType: ActorType;
  actorId: string;
  actorName: string;
  agentId?: AgentId;
  campaignId?: CampaignId;
  title: string;
  body: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Lead {
  id: LeadId;
  tenantId: TenantId;
  ownerId: UserId | null;
  fullName: string;
  primaryPhone: string;
  email: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  leadScore: number;
  aiScore: number;
  industry: string;
  annualRevenue: number;
  city: string;
  state: string;
  tags: string[];
  customFields: Record<string, unknown>;
  relatedDealIds: DealId[];
  relatedCampaignIds: CampaignId[];
  relatedCallIds: AICallId[];
  timeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
  isDuplicate?: boolean;
}

// ─── Deal ────────────────────────────────────────────────────
export type DealStage = 'Qualification' | 'Needs Analysis' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
export type DealStatus = 'Open' | 'Won' | 'Lost' | 'PendingApproval';

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Deal {
  id: DealId;
  tenantId: TenantId;
  name: string;
  leadId: LeadId | null;
  ownerId: UserId;
  stage: DealStage;
  status: DealStatus;
  amount: number;
  currency: string;
  probability: number;
  closeDate: string;
  pipeline: string;
  lineItems: LineItem[];
  discountPercent: number;
  requiresApproval: boolean;
  closeReason: string | null;
  relatedCampaignIds: CampaignId[];
  relatedCallIds: AICallId[];
  createdAt: string;
  updatedAt: string;
  wonAt?: string;
  lostAt?: string;
}

// ─── AI Agent / Call ─────────────────────────────────────────
export type CallStatus = 'Initialized' | 'Dialing' | 'Connected' | 'Active' | 'Completed' | 'Failed' | 'NoAnswer' | 'Transferred';
export type CallOutcome = 'Qualified' | 'NotInterested' | 'Callback' | 'Transferred' | 'NoAnswer' | 'Voicemail' | 'Failed';

export interface AIAgent {
  id: AgentId;
  tenantId: TenantId;
  name: string;
  type: 'Sales' | 'Support' | 'Collections' | 'Survey' | 'Renewal';
  voice: string;
  languages: string[];
  status: 'Active' | 'Inactive' | 'Draft';
  callCount: number;
  successRate: number;
  createdAt: string;
}

export interface AICall {
  id: AICallId;
  tenantId: TenantId;
  agentId: AgentId;
  campaignId: CampaignId | null;
  leadId: LeadId | null;
  phone: string;
  status: CallStatus;
  outcome: CallOutcome | null;
  duration: number; // seconds
  cost: number; // INR
  consentCaptured: boolean;
  recordingUrl: string | null;
  transcriptPreview: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
}

// ─── Campaign ─────────────────────────────────────────────────
export type CampaignStatus = 'Draft' | 'Active' | 'Paused' | 'Completed' | 'Scheduled' | 'Stopped';

export interface Campaign {
  id: CampaignId;
  tenantId: TenantId;
  name: string;
  type: 'AI Call' | 'WhatsApp' | 'SMS' | 'Email' | 'Omni';
  status: CampaignStatus;
  audience: number;
  sent: number;
  delivered: number;
  opened: number;
  replied: number;
  converted: number;
  budget: number; // INR
  spent: number;  // INR
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Invoice / Billing ───────────────────────────────────────
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Invoice {
  id: InvoiceId;
  tenantId: TenantId;
  invoiceNumber: string; // INV-2024-000001
  status: InvoiceStatus;
  amount: number;         // INR (excl. GST)
  gstin: string;
  hsnCode: string;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;    // incl. GST
  isInterState: boolean;
  issueDate: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
}

// ─── Audit Log ───────────────────────────────────────────────
export interface AuditLog {
  id: AuditId;
  tenantId: TenantId | null;
  actor: string;
  actorId: string;
  actorType: ActorType;
  agentId?: AgentId;
  campaignId?: CampaignId;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  ipAddress?: string;
  timestamp: string;
}

// ─── Custom Metadata (M3) ────────────────────────────────────
export type FieldType =
  | 'text' | 'textarea' | 'number' | 'decimal' | 'currency' | 'percentage'
  | 'date' | 'datetime' | 'time' | 'email' | 'phone' | 'url' | 'checkbox'
  | 'picklist' | 'multipicklist' | 'attachment' | 'image' | 'lookup'
  | 'master_detail' | 'formula' | 'rollup' | 'autonumber' | 'geolocation';

export interface CustomField {
  id: CustomFieldId;
  objectId: CustomObjectId;
  label: string;
  apiName: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  readOnly: boolean;
  defaultValue?: string;
  helpText?: string;
  options?: string[]; // for picklist
  formula?: string;   // for formula type
  lookupObject?: string; // for lookup type
  isSystemField: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  section: string;
  sortOrder: number;
  showInListView: boolean;
  showInDetailView: boolean;
  createdAt: string;
}

export interface CustomObject {
  id: CustomObjectId;
  tenantId: TenantId;
  label: string;
  pluralLabel: string;
  apiName: string;
  description: string;
  icon: string;
  color: string;
  allowReports: boolean;
  allowActivities: boolean;
  isEnabled: boolean;
  isSystemObject: boolean;
  fields: CustomField[];
  recordCount: number;
  layoutCount: number;
  createdAt: string;
}

// ─── WhatsApp Template ───────────────────────────────────────
export type TemplateStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
export interface WhatsAppTemplate {
  id: string;
  tenantId: TenantId;
  name: string;
  category: 'Marketing' | 'Utility' | 'Authentication';
  status: TemplateStatus;
  body: string;
  metaReason?: string;
  createdAt: string;
}

// ─── SMS DLT Template ────────────────────────────────────────
export interface SMSDLTTemplate {
  id: string;
  tenantId: TenantId;
  name: string;
  dltTemplateId?: string;
  dltEntityId?: string;
  category: 'Transactional' | 'Promotional' | 'Service-Implicit' | 'Service-Explicit';
  status: 'Pending' | 'Approved' | 'Rejected';
  body: string;
  createdAt: string;
}

// ─── Pagination ──────────────────────────────────────────────
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Approval Request ─────────────────────────────────────────
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Executed';
export interface ApprovalRequest {
  id: string;
  type: string;
  status: ApprovalStatus;
  makerId: UserId;
  makerName: string;
  checkerId?: UserId;
  checkerName?: string;
  entityId: string;
  entityType: string;
  reason: string;
  rejectionReason?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  resolvedAt?: string;
}

// ─── Integration Module ─────────────────────────────────────
export * from './integrationTypes';
