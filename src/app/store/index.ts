// ============================================================
// OmniCRM — Centralized Zustand Mock Store
// Single source of truth. Backend-swap ready.
// ============================================================
import { create } from 'zustand';
import { toast } from 'sonner';
import type {
  Tenant, User, Lead, Deal, Campaign, Invoice, AuditLog,
  AIAgent, AICall, CustomObject, License, ApprovalRequest,
  WhatsAppTemplate, SMSDLTTemplate, Role, UserSession,
  Integration, APIKey, Webhook, IntegrationLog, IntegrationSyncJob,
  IntegrationId, WebhookId, APIKeyId, MarketplaceIntegration
} from './types';
import {
  seedTenants, seedUsers, seedLeads, seedDeals, seedCampaigns, seedInvoices,
  seedAIAgents, seedAICalls, seedAuditLogs, seedCustomObjects, seedLicenses,
  seedApprovalRequests, seedWhatsAppTemplates, seedSMSTemplates, seedRoles, seedSessions
} from './seed';
import {
  seedIntegrations, seedAPIKeys, seedWebhooks, seedIntegrationLogs, seedMarketplaceIntegrations
} from './integrationSeed';

// ─── Simulated API latency ────────────────────────────────────
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const readDelay = () => delay(300 + Math.random() * 500);
const writeDelay = () => delay(600 + Math.random() * 900);

// Auto-increment audit ID
let auditCounter = seedAuditLogs.length + 1;
const generateAuditId = () => `AUD-${String(auditCounter++).padStart(6, '0')}`;
const now = () => new Date().toISOString();

// ─── Store State ─────────────────────────────────────────────
interface OmniCRMState {
  // Data
  tenants: Tenant[];
  users: User[];
  roles: Role[];
  sessions: UserSession[];
  leads: Lead[];
  deals: Deal[];
  campaigns: Campaign[];
  invoices: Invoice[];
  aiAgents: AIAgent[];
  aiCalls: AICall[];
  auditLogs: AuditLog[];
  customObjects: CustomObject[];
  licenses: License[];
  approvalRequests: ApprovalRequest[];
  whatsappTemplates: WhatsAppTemplate[];
  smsTemplates: SMSDLTTemplate[];
  integrations: Integration[];
  marketplaceIntegrations: MarketplaceIntegration[];
  apiKeys: APIKey[];
  webhooks: Webhook[];
  integrationLogs: IntegrationLog[];

  // UI State
  isLoading: boolean;
  currentTenantId: string;

  // ─── Audit ───────────────────────────────────────────────
  getAuditLogs: (tenantId?: string | null) => Promise<AuditLog[]>;
  addAuditLog: (entry: Omit<AuditLog, 'id' | 'timestamp'>) => void;

  // ─── Tenants ─────────────────────────────────────────────
  getTenants: () => Promise<Tenant[]>;
  getTenant: (id: string) => Promise<Tenant | null>;
  createTenant: (data: Partial<Tenant>) => Promise<Tenant>;
  updateTenant: (id: string, data: Partial<Tenant>, reason?: string) => Promise<Tenant>;
  suspendTenant: (id: string, reason: string) => Promise<void>;
  restoreTenant: (id: string, reason: string) => Promise<void>;

  // ─── Users ───────────────────────────────────────────────
  getUsers: (tenantId?: string) => Promise<User[]>;
  getUser: (id: string) => Promise<User | null>;
  createUser: (data: Partial<User>) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deactivateUser: (id: string, reason: string) => Promise<void>;
  assignRolesToUser: (userId: string, roleIds: string[], reason?: string) => Promise<User>;

  // ─── Roles ───────────────────────────────────────────────
  getRoles: (tenantId?: string) => Promise<Role[]>;
  getRole: (id: string) => Promise<Role | null>;
  createRole: (data: Partial<Role>) => Promise<Role>;
  updateRole: (id: string, data: Partial<Role>, reason?: string) => Promise<Role>;
  deleteRole: (id: string, reason: string) => Promise<void>;
  cloneRole: (id: string, newName: string) => Promise<Role>;

  // ─── Sessions ────────────────────────────────────────────
  getSessions: (userId?: string, tenantId?: string) => Promise<UserSession[]>;
  terminateSession: (sessionId: string, reason: string) => Promise<void>;
  terminateAllUserSessions: (userId: string, reason: string) => Promise<void>;

  // ─── Leads ───────────────────────────────────────────────
  getLeads: (tenantId?: string) => Promise<Lead[]>;
  getLead: (id: string) => Promise<Lead | null>;
  createLead: (data: Partial<Lead>) => Promise<Lead>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<Lead>;
  deleteLead: (id: string, reason: string) => Promise<void>;
  assignLead: (id: string, userId: string, reason?: string) => Promise<Lead>;

  // ─── Deals ───────────────────────────────────────────────
  getDeals: (tenantId?: string) => Promise<Deal[]>;
  getDeal: (id: string) => Promise<Deal | null>;
  createDeal: (data: Partial<Deal>) => Promise<Deal>;
  updateDeal: (id: string, data: Partial<Deal>) => Promise<Deal>;
  closeDeal: (id: string, won: boolean, reason: string) => Promise<Deal>;

  // ─── Campaigns ───────────────────────────────────────────
  getCampaigns: (tenantId?: string) => Promise<Campaign[]>;
  getCampaign: (id: string) => Promise<Campaign | null>;
  updateCampaignStatus: (id: string, status: Campaign['status']) => Promise<Campaign>;

  // ─── Invoices ────────────────────────────────────────────
  getInvoices: (tenantId?: string) => Promise<Invoice[]>;
  getInvoice: (id: string) => Promise<Invoice | null>;

  // ─── AI ──────────────────────────────────────────────────
  getAIAgents: (tenantId?: string) => Promise<AIAgent[]>;
  getAICalls: (tenantId?: string) => Promise<AICall[]>;
  getAICall: (id: string) => Promise<AICall | null>;

  // ─── Custom Objects (M3) ─────────────────────────────────
  getCustomObjects: (tenantId?: string) => Promise<CustomObject[]>;
  getCustomObject: (id: string) => Promise<CustomObject | null>;
  createCustomObject: (data: Partial<CustomObject>) => Promise<CustomObject>;
  updateCustomObject: (id: string, data: Partial<CustomObject>) => Promise<CustomObject>;
  deleteCustomObject: (id: string, reason: string) => Promise<void>;

  // ─── Licenses ─────────────────────────────────────────────
  getLicenses: () => Promise<License[]>;
  getLicense: (id: string) => Promise<License | null>;
  assignLicense: (tenantId: string, planId: string, reason: string) => Promise<License>;
  approveLicense: (licenseId: string, approverId: string) => Promise<License>;

  // ─── Approvals ───────────────────────────────────────────
  getApprovalRequests: () => Promise<ApprovalRequest[]>;
  approveRequest: (id: string, checkerId: string, checkerName: string) => Promise<ApprovalRequest>;
  rejectRequest: (id: string, reason: string) => Promise<ApprovalRequest>;

  // ─── WhatsApp Templates ───────────────────────────────────
  getWhatsAppTemplates: (tenantId?: string) => Promise<WhatsAppTemplate[]>;
  submitWhatsAppTemplate: (id: string) => Promise<WhatsAppTemplate>;

  // ─── SMS Templates ────────────────────────────────────────
  getSMSTemplates: (tenantId?: string) => Promise<SMSDLTTemplate[]>;

  // ─── Integrations ────────────────────────────────────────
  getIntegrations: (activeOnly?: boolean) => Promise<Integration[]>;
  getIntegration: (id: IntegrationId) => Promise<Integration | null>;
  getMarketplaceIntegrations: () => Promise<MarketplaceIntegration[]>;
  connectIntegration: (id: IntegrationId, credentials: Record<string, any>) => Promise<Integration>;
  disconnectIntegration: (id: IntegrationId, reason: string) => Promise<Integration>;
  updateIntegrationConfig: (id: IntegrationId, config: Record<string, any>) => Promise<Integration>;
  syncIntegration: (id: IntegrationId) => Promise<void>;

  // ─── API Keys ────────────────────────────────────────────
  getAPIKeys: () => Promise<APIKey[]>;
  getAPIKey: (id: APIKeyId) => Promise<APIKey | null>;
  createAPIKey: (data: Partial<APIKey>) => Promise<APIKey>;
  revokeAPIKey: (id: APIKeyId, reason: string) => Promise<void>;

  // ─── Webhooks ────────────────────────────────────────────
  getWebhooks: () => Promise<Webhook[]>;
  getWebhook: (id: WebhookId) => Promise<Webhook | null>;
  createWebhook: (data: Partial<Webhook>) => Promise<Webhook>;
  updateWebhook: (id: WebhookId, data: Partial<Webhook>) => Promise<Webhook>;
  deleteWebhook: (id: WebhookId, reason: string) => Promise<void>;
  toggleWebhook: (id: WebhookId) => Promise<Webhook>;

  // ─── Integration Logs ────────────────────────────────────
  getIntegrationLogs: (integrationId?: IntegrationId) => Promise<IntegrationLog[]>;
  addIntegrationLog: (entry: Omit<IntegrationLog, 'id' | 'timestamp'>) => void;
}

// ─── Store Implementation ─────────────────────────────────────
export const useOmniStore = create<OmniCRMState>((set, get) => ({
  // Initial State
  tenants: seedTenants,
  users: seedUsers,
  roles: seedRoles,
  sessions: seedSessions,
  leads: seedLeads,
  deals: seedDeals,
  campaigns: seedCampaigns,
  invoices: seedInvoices,
  aiAgents: seedAIAgents,
  aiCalls: seedAICalls,
  auditLogs: seedAuditLogs,
  customObjects: seedCustomObjects,
  licenses: seedLicenses,
  approvalRequests: seedApprovalRequests,
  whatsappTemplates: seedWhatsAppTemplates,
  smsTemplates: seedSMSTemplates,
  integrations: seedIntegrations,
  marketplaceIntegrations: seedMarketplaceIntegrations,
  apiKeys: seedAPIKeys,
  webhooks: seedWebhooks,
  integrationLogs: seedIntegrationLogs,
  isLoading: false,
  currentTenantId: 'TNT-001',

  // ─── Audit ───────────────────────────────────────────────
  getAuditLogs: async (tenantId) => {
    await readDelay();
    if (tenantId === undefined) {
      return get().auditLogs;
    }
    return get().auditLogs.filter(log => log.tenantId === tenantId);
  },

  addAuditLog: (entry) => {
    const log: AuditLog = { ...entry, id: generateAuditId(), timestamp: now() };
    set(state => ({ auditLogs: [log, ...state.auditLogs] }));
  },

  // ─── Tenants ─────────────────────────────────────────────
  getTenants: async () => {
    await readDelay();
    return get().tenants;
  },

  getTenant: async (id) => {
    await readDelay();
    return get().tenants.find(t => t.id === id) ?? null;
  },

  createTenant: async (data) => {
    await writeDelay();
    const newTenant: Tenant = {
      id: `TNT-${String(get().tenants.length + 1).padStart(3, '0')}`,
      status: 'Provisioning',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      locale: 'en-IN',
      creditBalance: 0,
      creditLimit: 10000,
      usedCredits: 0,
      licenseId: null,
      kycStatus: 'Pending',
      hardStopActive: false,
      createdAt: now(),
      updatedAt: now(),
      ...data,
    } as Tenant;
    set(state => ({ tenants: [...state.tenants, newTenant] }));
    get().addAuditLog({ tenantId: null, actor: 'Admin', actorId: 'USR-SA-001', actorType: 'human', action: 'create', entity: 'Tenant', entityId: newTenant.id, after: { name: newTenant.name, status: newTenant.status } });
    toast.success(`Tenant "${newTenant.name}" created in Provisioning state`);
    return newTenant;
  },

  updateTenant: async (id, data, reason) => {
    await writeDelay();
    const before = get().tenants.find(t => t.id === id);
    const updated = { ...before!, ...data, updatedAt: now() };
    set(state => ({ tenants: state.tenants.map(t => t.id === id ? updated : t) }));
    get().addAuditLog({ tenantId: null, actor: 'Admin', actorId: 'USR-SA-001', actorType: 'human', action: 'update', entity: 'Tenant', entityId: id, before: before as Record<string, unknown>, after: data as Record<string, unknown>, reason });
    toast.success('Tenant updated successfully');
    return updated;
  },

  suspendTenant: async (id, reason) => {
    await writeDelay();
    const before = get().tenants.find(t => t.id === id);
    set(state => ({
      tenants: state.tenants.map(t => t.id === id ? { ...t, status: 'Suspended', hardStopActive: true, updatedAt: now() } : t)
    }));
    get().addAuditLog({ tenantId: null, actor: 'Admin', actorId: 'USR-SA-001', actorType: 'human', action: 'suspend', entity: 'Tenant', entityId: id, before: { status: before?.status }, after: { status: 'Suspended' }, reason });
    toast.warning(`Tenant "${before?.name}" has been suspended`);
  },

  restoreTenant: async (id, reason) => {
    await writeDelay();
    const before = get().tenants.find(t => t.id === id);
    set(state => ({
      tenants: state.tenants.map(t => t.id === id ? { ...t, status: 'Active', hardStopActive: false, updatedAt: now() } : t)
    }));
    get().addAuditLog({ tenantId: null, actor: 'Admin', actorId: 'USR-SA-001', actorType: 'human', action: 'restore', entity: 'Tenant', entityId: id, before: { status: before?.status }, after: { status: 'Active' }, reason });
    toast.success(`Tenant "${before?.name}" has been restored`);
  },

  // ─── Users ───────────────────────────────────────────────
  getUsers: async (tenantId) => {
    await readDelay();
    return tenantId ? get().users.filter(u => u.tenantId === tenantId) : get().users;
  },

  getUser: async (id) => {
    await readDelay();
    return get().users.find(u => u.id === id) ?? null;
  },

  createUser: async (data) => {
    await writeDelay();
    const newUser: User = {
      id: `USR-${String(get().users.length + 1).padStart(3, '0')}` as UserId,
      tenantId: get().currentTenantId,
      status: 'active',
      twoFAEnabled: false,
      lastLogin: now(),
      createdAt: now(),
      roleIds: data.roleIds || [],
      activeSessions: 0,
      ...data,
    } as User;
    set(state => ({ users: [...state.users, newUser] }));
    get().addAuditLog({
      tenantId: newUser.tenantId,
      actor: 'Tenant Admin',
      actorId: 'USR-001' as UserId,
      actorType: 'human',
      action: 'create',
      entity: 'User',
      entityId: newUser.id,
      after: { name: newUser.name, email: newUser.email, roleIds: newUser.roleIds },
      details: `User ${newUser.name} created with ${newUser.roleIds.length} role(s)`
    });
    toast.success(`User ${newUser.name} created successfully.`);
    return newUser;
  },

  updateUser: async (id, data) => {
    await writeDelay();
    const before = get().users.find(u => u.id === id);
    const updated = { ...before!, ...data, updatedAt: now() };
    set(state => ({ users: state.users.map(u => u.id === id ? updated : u) }));
    get().addAuditLog({
      tenantId: updated.tenantId,
      actor: 'Tenant Admin',
      actorId: 'USR-001' as UserId,
      actorType: 'human',
      action: 'update',
      entity: 'User',
      entityId: id,
      before: { name: before?.name, email: before?.email, roleIds: before?.roleIds },
      after: { name: updated.name, email: updated.email, roleIds: updated.roleIds },
      details: `User ${updated.name} updated`
    });
    toast.success('User updated successfully');
    return updated;
  },

  deactivateUser: async (id, reason) => {
    await writeDelay();
    const user = get().users.find(u => u.id === id);
    set(state => ({ users: state.users.map(u => u.id === id ? { ...u, status: 'inactive', updatedAt: now() } : u) }));
    get().addAuditLog({
      tenantId: user?.tenantId ?? null,
      actor: 'Tenant Admin',
      actorId: 'USR-001' as UserId,
      actorType: 'human',
      action: 'delete',
      entity: 'User',
      entityId: id,
      before: { status: user?.status },
      after: { status: 'inactive' },
      reason,
      details: `User ${user?.name} deactivated`
    });
    toast.success('User deactivated successfully');
  },

  assignRolesToUser: async (userId, roleIds, reason) => {
    await writeDelay();
    const user = get().users.find(u => u.id === userId);
    const before = user?.roleIds || [];
    set(state => ({ users: state.users.map(u => u.id === userId ? { ...u, roleIds, updatedAt: now() } : u) }));
    get().addAuditLog({ tenantId: user?.tenantId ?? null, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'update', entity: 'User', entityId: userId, before: { roleIds: before }, after: { roleIds }, reason });
    toast.success('User roles updated successfully');
    return get().users.find(u => u.id === userId)!;
  },

  // ─── Roles ───────────────────────────────────────────────
  getRoles: async (tenantId) => {
    await readDelay();
    return tenantId ? get().roles.filter(r => r.tenantId === tenantId || r.tenantId === 'system') : get().roles;
  },

  getRole: async (id) => {
    await readDelay();
    return get().roles.find(r => r.id === id) ?? null;
  },

  createRole: async (data) => {
    await writeDelay();
    const newRole: Role = {
      id: `ROLE-${String(get().roles.length + 1).padStart(3, '0')}`,
      tenantId: get().currentTenantId,
      isSystem: false,
      permissions: {},
      userCount: 0,
      riskLevel: 'low',
      createdAt: now(),
      updatedAt: now(),
      createdBy: 'USR-001',
      ...data,
    } as Role;
    set(state => ({ roles: [...state.roles, newRole] }));
    get().addAuditLog({ tenantId: newRole.tenantId, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'create', entity: 'Role', entityId: newRole.id, after: { name: newRole.name } });
    toast.success(`Role "${newRole.name}" created successfully`);
    return newRole;
  },

  updateRole: async (id, data, reason) => {
    await writeDelay();
    const role = get().roles.find(r => r.id === id);
    if (role?.isSystem && role.name === 'Super Admin') {
      toast.error('Super Admin role cannot be modified');
      throw new Error('Super Admin role cannot be modified');
    }
    const before = { ...role };
    const updated = { ...role!, ...data, updatedAt: now() };
    set(state => ({ roles: state.roles.map(r => r.id === id ? updated : r) }));
    get().addAuditLog({ tenantId: role?.tenantId ?? null, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'update', entity: 'Role', entityId: id, before: before as Record<string, unknown>, after: data as Record<string, unknown>, reason });
    toast.success('Role updated successfully');
    return updated;
  },

  deleteRole: async (id, reason) => {
    await writeDelay();
    const role = get().roles.find(r => r.id === id);
    if (role?.isSystem) {
      toast.error('System roles cannot be deleted');
      throw new Error('System roles cannot be deleted');
    }
    if (role?.userCount && role.userCount > 0) {
      toast.error(`Cannot delete role "${role.name}" - it is assigned to ${role.userCount} users`);
      throw new Error('Role is assigned to users');
    }
    set(state => ({ roles: state.roles.filter(r => r.id !== id) }));
    get().addAuditLog({ tenantId: role?.tenantId ?? null, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'delete', entity: 'Role', entityId: id, before: { name: role?.name }, reason });
    toast.success('Role deleted successfully');
  },

  cloneRole: async (id, newName) => {
    await writeDelay();
    const sourceRole = get().roles.find(r => r.id === id);
    if (!sourceRole) {
      toast.error('Source role not found');
      throw new Error('Source role not found');
    }
    const newRole: Role = {
      ...sourceRole,
      id: `ROLE-${String(get().roles.length + 1).padStart(3, '0')}`,
      name: newName,
      isSystem: false,
      userCount: 0,
      createdAt: now(),
      updatedAt: now(),
      createdBy: 'USR-001'
    };
    set(state => ({ roles: [...state.roles, newRole] }));
    get().addAuditLog({ tenantId: newRole.tenantId, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'create', entity: 'Role', entityId: newRole.id, after: { name: newRole.name, clonedFrom: sourceRole.name } });
    toast.success(`Role "${newName}" cloned from "${sourceRole.name}"`);
    return newRole;
  },

  // ─── Sessions ────────────────────────────────────────────
  getSessions: async (userId, tenantId) => {
    await readDelay();
    let sessions = get().sessions;
    if (userId) sessions = sessions.filter(s => s.userId === userId);
    if (tenantId) sessions = sessions.filter(s => s.tenantId === tenantId);
    return sessions;
  },

  terminateSession: async (sessionId, reason) => {
    await writeDelay();
    const session = get().sessions.find(s => s.id === sessionId);
    set(state => ({ sessions: state.sessions.filter(s => s.id !== sessionId) }));
    get().addAuditLog({ tenantId: session?.tenantId ?? null, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'delete', entity: 'Session', entityId: sessionId, reason });
    toast.success('Session terminated');
  },

  terminateAllUserSessions: async (userId, reason) => {
    await writeDelay();
    const user = get().users.find(u => u.id === userId);
    const sessionCount = get().sessions.filter(s => s.userId === userId).length;
    set(state => ({ sessions: state.sessions.filter(s => s.userId !== userId) }));
    get().addAuditLog({ tenantId: user?.tenantId ?? null, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'delete', entity: 'Session', entityId: userId, before: { sessionCount }, after: { sessionCount: 0 }, reason });
    toast.success(`All sessions terminated for user (${sessionCount} sessions)`);
  },

  // ─── Leads ───────────────────────────────────────────────
  getLeads: async (tenantId) => {
    await readDelay();
    return tenantId ? get().leads.filter(l => l.tenantId === tenantId) : get().leads;
  },

  getLead: async (id) => {
    await readDelay();
    return get().leads.find(l => l.id === id) ?? null;
  },

  createLead: async (data) => {
    await writeDelay();
    const newLead: Lead = {
      id: `LD-${String(get().leads.length + 1).padStart(4, '0')}`,
      tenantId: get().currentTenantId,
      status: 'New',
      leadScore: 0,
      aiScore: 0,
      tags: [],
      customFields: {},
      relatedDealIds: [],
      relatedCampaignIds: [],
      relatedCallIds: [],
      timeline: [],
      createdAt: now(),
      updatedAt: now(),
      ...data,
    } as Lead;
    set(state => ({ leads: [newLead, ...state.leads] }));
    get().addAuditLog({ tenantId: newLead.tenantId, actor: 'User', actorId: 'USR-001', actorType: 'human', action: 'create', entity: 'Lead', entityId: newLead.id });
    toast.success('Lead created successfully');
    return newLead;
  },

  updateLead: async (id, data) => {
    await writeDelay();
    const updated = { ...get().leads.find(l => l.id === id)!, ...data, updatedAt: now() };
    set(state => ({ leads: state.leads.map(l => l.id === id ? updated : l) }));
    toast.success('Lead updated');
    return updated;
  },

  deleteLead: async (id, reason) => {
    await writeDelay();
    get().addAuditLog({ tenantId: get().currentTenantId, actor: 'User', actorId: 'USR-001', actorType: 'human', action: 'delete', entity: 'Lead', entityId: id, reason });
    set(state => ({ leads: state.leads.filter(l => l.id !== id) }));
    toast.success('Lead deleted');
  },

  assignLead: async (id, userId, reason) => {
    await writeDelay();
    const before = get().leads.find(l => l.id === id);
    const user = get().users.find(u => u.id === userId);
    const updated = { ...before!, ownerId: userId, updatedAt: now() };
    set(state => ({ leads: state.leads.map(l => l.id === id ? updated : l) }));
    get().addAuditLog({ tenantId: get().currentTenantId, actor: 'User', actorId: 'USR-001', actorType: 'human', action: 'assign', entity: 'Lead', entityId: id, before: { ownerId: before?.ownerId }, after: { ownerId: userId, ownerName: user?.name }, reason });
    toast.success(`Lead assigned to ${user?.name}`);
    return updated;
  },

  // ─── Deals ───────────────────────────────────────────────
  getDeals: async (tenantId) => {
    await readDelay();
    return tenantId ? get().deals.filter(d => d.tenantId === tenantId) : get().deals;
  },

  getDeal: async (id) => {
    await readDelay();
    return get().deals.find(d => d.id === id) ?? null;
  },

  createDeal: async (data) => {
    await writeDelay();
    const newDeal: Deal = {
      id: `DL-${String(get().deals.length + 1).padStart(4, '0')}`,
      tenantId: get().currentTenantId,
      status: 'Open',
      stage: 'Qualification',
      probability: 20,
      currency: 'INR',
      lineItems: [],
      discountPercent: 0,
      requiresApproval: false,
      closeReason: null,
      relatedCampaignIds: [],
      relatedCallIds: [],
      createdAt: now(),
      updatedAt: now(),
      ...data,
    } as Deal;
    set(state => ({ deals: [newDeal, ...state.deals] }));
    get().addAuditLog({ tenantId: newDeal.tenantId, actor: 'User', actorId: 'USR-001', actorType: 'human', action: 'create', entity: 'Deal', entityId: newDeal.id });
    toast.success('Deal created');
    return newDeal;
  },

  updateDeal: async (id, data) => {
    await writeDelay();
    const updated = { ...get().deals.find(d => d.id === id)!, ...data, updatedAt: now() };
    set(state => ({ deals: state.deals.map(d => d.id === id ? updated : d) }));
    toast.success('Deal updated');
    return updated;
  },

  closeDeal: async (id, won, reason) => {
    await writeDelay();
    const deal = get().deals.find(d => d.id === id)!;
    const updated: Deal = {
      ...deal,
      status: won ? 'Won' : 'Lost',
      stage: won ? 'Won' : 'Lost',
      probability: won ? 100 : 0,
      closeReason: reason,
      wonAt: won ? now() : undefined,
      lostAt: !won ? now() : undefined,
      updatedAt: now()
    };
    set(state => ({ deals: state.deals.map(d => d.id === id ? updated : d) }));
    get().addAuditLog({ tenantId: get().currentTenantId, actor: 'User', actorId: 'USR-001', actorType: 'human', action: won ? 'close_won' : 'close_lost', entity: 'Deal', entityId: id, reason });
    toast.success(won ? '🎉 Deal closed as Won!' : 'Deal closed as Lost');
    return updated;
  },

  // ─── Campaigns ───────────────────────────────────────────
  getCampaigns: async (tenantId) => {
    await readDelay();
    return tenantId ? get().campaigns.filter(c => c.tenantId === tenantId) : get().campaigns;
  },

  getCampaign: async (id) => {
    await readDelay();
    return get().campaigns.find(c => c.id === id) ?? null;
  },

  updateCampaignStatus: async (id, status) => {
    await writeDelay();
    const updated = { ...get().campaigns.find(c => c.id === id)!, status, updatedAt: now() };
    set(state => ({ campaigns: state.campaigns.map(c => c.id === id ? updated : c) }));
    get().addAuditLog({ tenantId: get().currentTenantId, actor: 'User', actorId: 'USR-001', actorType: 'human', action: `campaign_${status.toLowerCase()}`, entity: 'Campaign', entityId: id });
    toast.success(`Campaign ${status}`);
    return updated;
  },

  // ─── Invoices ────────────────────────────────────────────
  getInvoices: async (tenantId) => {
    await readDelay();
    return tenantId ? get().invoices.filter(i => i.tenantId === tenantId) : get().invoices;
  },

  getInvoice: async (id) => {
    await readDelay();
    return get().invoices.find(i => i.id === id) ?? null;
  },

  // ─── AI ──────────────────────────────────────────────────
  getAIAgents: async (tenantId) => {
    await readDelay();
    return tenantId ? get().aiAgents.filter(a => a.tenantId === tenantId) : get().aiAgents;
  },

  getAICalls: async (tenantId) => {
    await readDelay();
    return tenantId ? get().aiCalls.filter(c => c.tenantId === tenantId) : get().aiCalls;
  },

  getAICall: async (id) => {
    await readDelay();
    return get().aiCalls.find(c => c.id === id) ?? null;
  },

  // ─── Custom Objects (M3) ─────────────────────────────────
  getCustomObjects: async (tenantId) => {
    await readDelay();
    return tenantId ? get().customObjects.filter(o => o.tenantId === tenantId) : get().customObjects;
  },

  getCustomObject: async (id) => {
    await readDelay();
    return get().customObjects.find(o => o.id === id) ?? null;
  },

  createCustomObject: async (data) => {
    await writeDelay();
    const newObj: CustomObject = {
      id: `OBJ-${String(get().customObjects.length + 1).padStart(4, '0')}`,
      tenantId: get().currentTenantId,
      isEnabled: true,
      isSystemObject: false,
      allowReports: true,
      allowActivities: true,
      recordCount: 0,
      layoutCount: 0,
      fields: [],
      createdAt: now(),
      ...data,
    } as CustomObject;
    set(state => ({ customObjects: [...state.customObjects, newObj] }));
    get().addAuditLog({ tenantId: get().currentTenantId, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'create_object', entity: 'CustomObject', entityId: newObj.id, after: { label: newObj.label, apiName: newObj.apiName } });
    toast.success(`Custom object "${newObj.label}" created`);
    return newObj;
  },

  updateCustomObject: async (id, data) => {
    await writeDelay();
    const updated = { ...get().customObjects.find(o => o.id === id)!, ...data };
    set(state => ({ customObjects: state.customObjects.map(o => o.id === id ? updated : o) }));
    toast.success('Object updated');
    return updated;
  },

  deleteCustomObject: async (id, reason) => {
    await writeDelay();
    set(state => ({
      customObjects: state.customObjects.map(o => o.id === id ? { ...o, isEnabled: false } : o)
    }));
    get().addAuditLog({ tenantId: get().currentTenantId, actor: 'Admin', actorId: 'USR-001', actorType: 'human', action: 'delete_object', entity: 'CustomObject', entityId: id, reason });
    toast.success('Object disabled');
  },

  // ─── Licenses ─────────────────────────────────────────────
  getLicenses: async () => {
    await readDelay();
    return get().licenses;
  },

  getLicense: async (id) => {
    await readDelay();
    return get().licenses.find(l => l.id === id) ?? null;
  },

  assignLicense: async (tenantId, planId, reason) => {
    await writeDelay();
    const newLicense: License = {
      id: `LIC-${String(get().licenses.length + 1).padStart(3, '0')}`,
      tenantId,
      planId,
      planName: planId === 'PLN-ENT' ? 'Enterprise' : planId === 'PLN-GROWTH' ? 'Growth' : 'Starter',
      status: 'PendingApproval',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxUsers: planId === 'PLN-ENT' ? 50 : 15,
      features: ['AI Calling', 'WhatsApp', 'SMS', 'Email', 'CRM', 'Analytics'],
      approvedBy: [],
      makerId: 'USR-SA-001',
      checkerId: null,
      createdAt: now()
    };
    set(state => ({ licenses: [...state.licenses, newLicense] }));
    get().addAuditLog({ tenantId: null, actor: 'Admin', actorId: 'USR-SA-001', actorType: 'human', action: 'license_assign', entity: 'License', entityId: newLicense.id, reason });
    toast.success('License created. Awaiting second approver.');
    return newLicense;
  },

  approveLicense: async (licenseId, approverId) => {
    await writeDelay();
    const license = get().licenses.find(l => l.id === licenseId)!;
    const updated: License = {
      ...license,
      status: 'Active',
      checkerId: approverId,
      approvedBy: [...license.approvedBy, approverId]
    };
    set(state => ({ licenses: state.licenses.map(l => l.id === licenseId ? updated : l) }));
    set(state => ({ tenants: state.tenants.map(t => t.id === license.tenantId ? { ...t, licenseId, status: 'Active' } : t) }));
    get().addAuditLog({ tenantId: null, actor: 'Admin', actorId: approverId, actorType: 'human', action: 'license_approve', entity: 'License', entityId: licenseId });
    toast.success('License approved and activated!');
    return updated;
  },

  // ─── Approvals ───────────────────────────────────────────
  getApprovalRequests: async () => {
    await readDelay();
    return get().approvalRequests;
  },

  approveRequest: async (id, checkerId, checkerName) => {
    await writeDelay();
    const updated: ApprovalRequest = {
      ...get().approvalRequests.find(a => a.id === id)!,
      status: 'Approved',
      checkerId,
      checkerName,
      resolvedAt: now()
    };
    set(state => ({ approvalRequests: state.approvalRequests.map(a => a.id === id ? updated : a) }));
    toast.success('Request approved');
    return updated;
  },

  rejectRequest: async (id, reason) => {
    await writeDelay();
    const updated: ApprovalRequest = {
      ...get().approvalRequests.find(a => a.id === id)!,
      status: 'Rejected',
      rejectionReason: reason,
      resolvedAt: now()
    };
    set(state => ({ approvalRequests: state.approvalRequests.map(a => a.id === id ? updated : a) }));
    toast.error('Request rejected');
    return updated;
  },

  // ─── WhatsApp Templates ───────────────────────────────────
  getWhatsAppTemplates: async (tenantId) => {
    await readDelay();
    return tenantId ? get().whatsappTemplates.filter(t => t.tenantId === tenantId) : get().whatsappTemplates;
  },

  submitWhatsAppTemplate: async (id) => {
    await writeDelay();
    // Mock: 3s delay then randomly approve/reject
    const updated: WhatsAppTemplate = {
      ...get().whatsappTemplates.find(t => t.id === id)!,
      status: 'Submitted'
    };
    set(state => ({ whatsappTemplates: state.whatsappTemplates.map(t => t.id === id ? updated : t) }));
    setTimeout(() => {
      const approved = Math.random() > 0.2;
      set(state => ({
        whatsappTemplates: state.whatsappTemplates.map(t =>
          t.id === id ? { ...t, status: approved ? 'Approved' : 'Rejected', metaReason: approved ? undefined : 'Template format not compliant with Meta policies' } : t
        )
      }));
      if (approved) toast.success('WhatsApp template approved by Meta!');
      else toast.error('WhatsApp template rejected by Meta');
    }, 3000);
    toast.info('Template submitted to Meta for approval...');
    return updated;
  },

  // ─── SMS Templates ────────────────────────────────────────
  getSMSTemplates: async (tenantId) => {
    await readDelay();
    return tenantId ? get().smsTemplates.filter(t => t.tenantId === tenantId) : get().smsTemplates;
  },

  // ─── Integrations ────────────────────────────────────────
  getIntegrations: async (activeOnly = false) => {
    await readDelay();
    const integrations = get().integrations;
    return activeOnly ? integrations.filter(i => i.isActive) : integrations;
  },

  getIntegration: async (id) => {
    await readDelay();
    return get().integrations.find(i => i.id === id) ?? null;
  },

  getMarketplaceIntegrations: async () => {
    await readDelay();
    return get().marketplaceIntegrations;
  },

  connectIntegration: async (id, credentials) => {
    await writeDelay();
    const integration = get().integrations.find(i => i.id === id);
    if (!integration) throw new Error('Integration not found');

    const updated: Integration = {
      ...integration,
      isActive: true,
      status: 'active',
      connectedAt: new Date(),
      credentials,
      updatedAt: new Date()
    };

    set(state => ({
      integrations: state.integrations.map(i => i.id === id ? updated : i)
    }));

    get().addIntegrationLog({
      integrationId: id,
      integrationName: integration.name,
      action: 'connect',
      status: 'success',
      message: `Successfully connected ${integration.name}`
    });

    get().addAuditLog({
      tenantId: get().currentTenantId,
      actor: 'User',
      actorId: 'USR-001',
      actorType: 'human',
      action: 'connect',
      entity: 'Integration',
      entityId: id,
      after: { status: 'active' }
    });

    toast.success(`${integration.name} connected successfully`);
    return updated;
  },

  disconnectIntegration: async (id, reason) => {
    await writeDelay();
    const integration = get().integrations.find(i => i.id === id);
    if (!integration) throw new Error('Integration not found');

    const updated: Integration = {
      ...integration,
      isActive: false,
      status: 'inactive',
      credentials: undefined,
      updatedAt: new Date()
    };

    set(state => ({
      integrations: state.integrations.map(i => i.id === id ? updated : i)
    }));

    get().addIntegrationLog({
      integrationId: id,
      integrationName: integration.name,
      action: 'disconnect',
      status: 'success',
      message: `Disconnected ${integration.name}: ${reason}`
    });

    get().addAuditLog({
      tenantId: get().currentTenantId,
      actor: 'User',
      actorId: 'USR-001',
      actorType: 'human',
      action: 'disconnect',
      entity: 'Integration',
      entityId: id,
      reason,
      after: { status: 'inactive' }
    });

    toast.success(`${integration.name} disconnected`);
    return updated;
  },

  updateIntegrationConfig: async (id, config) => {
    await writeDelay();
    const integration = get().integrations.find(i => i.id === id);
    if (!integration) throw new Error('Integration not found');

    const updated: Integration = {
      ...integration,
      config: { ...integration.config, ...config },
      updatedAt: new Date()
    };

    set(state => ({
      integrations: state.integrations.map(i => i.id === id ? updated : i)
    }));

    get().addIntegrationLog({
      integrationId: id,
      integrationName: integration.name,
      action: 'config_update',
      status: 'success',
      message: `Configuration updated for ${integration.name}`
    });

    toast.success('Configuration updated successfully');
    return updated;
  },

  syncIntegration: async (id) => {
    await writeDelay();
    const integration = get().integrations.find(i => i.id === id);
    if (!integration) throw new Error('Integration not found');

    const updated: Integration = {
      ...integration,
      lastSyncedAt: new Date(),
      updatedAt: new Date()
    };

    set(state => ({
      integrations: state.integrations.map(i => i.id === id ? updated : i)
    }));

    get().addIntegrationLog({
      integrationId: id,
      integrationName: integration.name,
      action: 'sync',
      status: 'success',
      message: `Sync completed for ${integration.name}`,
      duration: Math.floor(Math.random() * 5000) + 1000
    });

    toast.success(`${integration.name} synced successfully`);
  },

  // ─── API Keys ────────────────────────────────────────────
  getAPIKeys: async () => {
    await readDelay();
    return get().apiKeys;
  },

  getAPIKey: async (id) => {
    await readDelay();
    return get().apiKeys.find(k => k.id === id) ?? null;
  },

  createAPIKey: async (data) => {
    await writeDelay();
    const newKey: APIKey = {
      id: `KEY-${String(get().apiKeys.length + 1).padStart(3, '0')}` as APIKeyId,
      name: data.name || 'New API Key',
      key: `omni_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      secret: data.secret,
      environment: data.environment || 'production',
      permissions: data.permissions || [],
      rateLimit: data.rateLimit || 1000,
      isActive: true,
      createdAt: new Date(),
      createdBy: data.createdBy || 'USR-001',
      ...data
    } as APIKey;

    set(state => ({ apiKeys: [...state.apiKeys, newKey] }));

    get().addAuditLog({
      tenantId: get().currentTenantId,
      actor: 'User',
      actorId: newKey.createdBy,
      actorType: 'human',
      action: 'create',
      entity: 'APIKey',
      entityId: newKey.id,
      after: { name: newKey.name, environment: newKey.environment }
    });

    toast.success('API key created successfully');
    return newKey;
  },

  revokeAPIKey: async (id, reason) => {
    await writeDelay();
    const key = get().apiKeys.find(k => k.id === id);
    if (!key) throw new Error('API key not found');

    set(state => ({
      apiKeys: state.apiKeys.map(k => k.id === id ? { ...k, isActive: false } : k)
    }));

    get().addAuditLog({
      tenantId: get().currentTenantId,
      actor: 'User',
      actorId: 'USR-001',
      actorType: 'human',
      action: 'revoke',
      entity: 'APIKey',
      entityId: id,
      reason,
      after: { isActive: false }
    });

    toast.success('API key revoked');
  },

  // ─── Webhooks ────────────────────────────────────────────
  getWebhooks: async () => {
    await readDelay();
    return get().webhooks;
  },

  getWebhook: async (id) => {
    await readDelay();
    return get().webhooks.find(w => w.id === id) ?? null;
  },

  createWebhook: async (data) => {
    await writeDelay();
    const newWebhook: Webhook = {
      id: `WHK-${String(get().webhooks.length + 1).padStart(3, '0')}` as WebhookId,
      name: data.name || 'New Webhook',
      url: data.url || '',
      events: data.events || [],
      isActive: true,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      headers: data.headers,
      retryPolicy: data.retryPolicy || { maxRetries: 3, backoffMultiplier: 2 },
      successCount: 0,
      failureCount: 0,
      createdAt: new Date(),
      ...data
    } as Webhook;

    set(state => ({ webhooks: [...state.webhooks, newWebhook] }));

    get().addAuditLog({
      tenantId: get().currentTenantId,
      actor: 'User',
      actorId: 'USR-001',
      actorType: 'human',
      action: 'create',
      entity: 'Webhook',
      entityId: newWebhook.id,
      after: { name: newWebhook.name, url: newWebhook.url }
    });

    toast.success('Webhook created successfully');
    return newWebhook;
  },

  updateWebhook: async (id, data) => {
    await writeDelay();
    const webhook = get().webhooks.find(w => w.id === id);
    if (!webhook) throw new Error('Webhook not found');

    const updated: Webhook = {
      ...webhook,
      ...data,
      updatedAt: new Date()
    };

    set(state => ({
      webhooks: state.webhooks.map(w => w.id === id ? updated : w)
    }));

    get().addAuditLog({
      tenantId: get().currentTenantId,
      actor: 'User',
      actorId: 'USR-001',
      actorType: 'human',
      action: 'update',
      entity: 'Webhook',
      entityId: id,
      after: data as Record<string, unknown>
    });

    toast.success('Webhook updated successfully');
    return updated;
  },

  deleteWebhook: async (id, reason) => {
    await writeDelay();
    const webhook = get().webhooks.find(w => w.id === id);
    if (!webhook) throw new Error('Webhook not found');

    set(state => ({
      webhooks: state.webhooks.filter(w => w.id !== id)
    }));

    get().addAuditLog({
      tenantId: get().currentTenantId,
      actor: 'User',
      actorId: 'USR-001',
      actorType: 'human',
      action: 'delete',
      entity: 'Webhook',
      entityId: id,
      reason,
      before: { name: webhook.name }
    });

    toast.success('Webhook deleted');
  },

  toggleWebhook: async (id) => {
    await writeDelay();
    const webhook = get().webhooks.find(w => w.id === id);
    if (!webhook) throw new Error('Webhook not found');

    const updated: Webhook = {
      ...webhook,
      isActive: !webhook.isActive,
      updatedAt: new Date()
    };

    set(state => ({
      webhooks: state.webhooks.map(w => w.id === id ? updated : w)
    }));

    toast.success(`Webhook ${updated.isActive ? 'enabled' : 'disabled'}`);
    return updated;
  },

  // ─── Integration Logs ────────────────────────────────────
  getIntegrationLogs: async (integrationId) => {
    await readDelay();
    const logs = get().integrationLogs;
    return integrationId ? logs.filter(l => l.integrationId === integrationId) : logs;
  },

  addIntegrationLog: (entry) => {
    const log: IntegrationLog = {
      ...entry,
      id: `LOG-${String(get().integrationLogs.length + 1).padStart(6, '0')}`,
      timestamp: new Date()
    };
    set(state => ({ integrationLogs: [log, ...state.integrationLogs] }));
  }
}));

// ─── Convenience Hooks ────────────────────────────────────────
export const useLeads = () => useOmniStore(s => ({ leads: s.leads, getLeads: s.getLeads, createLead: s.createLead, updateLead: s.updateLead }));
export const useDeals = () => useOmniStore(s => ({ deals: s.deals, getDeals: s.getDeals, createDeal: s.createDeal, updateDeal: s.updateDeal, closeDeal: s.closeDeal }));
export const useTenants = () => useOmniStore(s => ({ tenants: s.tenants, getTenants: s.getTenants, suspendTenant: s.suspendTenant, restoreTenant: s.restoreTenant }));
export const useCampaigns = () => useOmniStore(s => ({ campaigns: s.campaigns, getCampaigns: s.getCampaigns }));
export const useAuditLog = () => useOmniStore(s => ({ auditLogs: s.auditLogs, addAuditLog: s.addAuditLog }));
export const useCustomObjects = () => useOmniStore(s => ({ customObjects: s.customObjects, getCustomObjects: s.getCustomObjects, createCustomObject: s.createCustomObject }));
export const useApprovals = () => useOmniStore(s => ({ approvalRequests: s.approvalRequests, approveRequest: s.approveRequest, rejectRequest: s.rejectRequest }));
export const useIntegrations = () => useOmniStore(s => ({ integrations: s.integrations, getIntegrations: s.getIntegrations, connectIntegration: s.connectIntegration, disconnectIntegration: s.disconnectIntegration }));
export const useWebhooks = () => useOmniStore(s => ({ webhooks: s.webhooks, getWebhooks: s.getWebhooks, createWebhook: s.createWebhook, updateWebhook: s.updateWebhook, deleteWebhook: s.deleteWebhook }));
export const useAPIKeys = () => useOmniStore(s => ({ apiKeys: s.apiKeys, getAPIKeys: s.getAPIKeys, createAPIKey: s.createAPIKey, revokeAPIKey: s.revokeAPIKey }));
