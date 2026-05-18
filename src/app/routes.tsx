import { createBrowserRouter } from "react-router";
import { WebsiteLanding } from "./pages/WebsiteLanding";
import { AuthSelection } from "./pages/AuthSelection";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ForgotPasswordSent } from "./pages/ForgotPasswordSent";
import { ResetPassword } from "./pages/ResetPassword";
import { ModalShowcase } from "./pages/ModalShowcase";
import { EmptyStatesShowcase } from "./pages/EmptyStatesShowcase";
import { LoadingShowcase } from "./pages/LoadingShowcase";
import { LeadFormDemo } from "./pages/LeadFormDemo";
import { KanbanDemo } from "./pages/KanbanDemo";
import { ScoringDemo } from "./pages/ScoringDemo";
import { AssignmentDemo } from "./pages/AssignmentDemo";
import { DuplicatesDemo } from "./pages/DuplicatesDemo";
import { WorkflowDemo } from "./pages/WorkflowDemo";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { TenantList } from "./pages/admin/TenantList";
import { CreateTenant } from "./pages/admin/CreateTenant";
import { EditTenant } from "./pages/admin/EditTenant";
import { TenantDetail } from "./pages/admin/TenantDetail";
import { SubscriptionPlans } from "./pages/admin/SubscriptionPlans";
import { PlanDetail } from "./pages/admin/PlanDetail";
import { EditPlan } from "./pages/admin/EditPlan";
import { LicenseManagement } from "./pages/admin/LicenseManagement";
import { LicenseDetail } from "./pages/admin/LicenseDetail";
import { UsageAnalytics } from "./pages/admin/UsageAnalytics";
import { CreditConfiguration } from "./pages/admin/CreditConfiguration";
import { StorageConfiguration } from "./pages/admin/StorageConfiguration";
import { AlertsCenter } from "./pages/admin/AlertsCenter";
import { Settings } from "./pages/admin/Settings";
import { PlatformSettings } from "./pages/admin/settings/PlatformSettings";
import { EmailNotifications } from "./pages/admin/settings/EmailNotifications";
import { SecurityAuth } from "./pages/admin/settings/SecurityAuth";
import { BillingPayments } from "./pages/admin/settings/BillingPayments";
import { APIIntegrations } from "./pages/admin/settings/APIIntegrations";
import { AuditCompliance } from "./pages/admin/settings/AuditCompliance";
import { SystemMaintenance } from "./pages/admin/settings/SystemMaintenance";
import { AppearanceBranding } from "./pages/admin/settings/AppearanceBranding";
import { LeadFormConfiguration } from "./pages/admin/settings/LeadFormConfiguration";
import { FiscalCalendar } from "./pages/admin/settings/FiscalCalendar";
import { CompanyBranchManagement } from "./pages/admin/CompanyBranchManagement";
import { LeadAssignmentConfig } from "./pages/admin/LeadAssignmentConfig";
import { AdminLayout, CustomerLayout } from "./components/layout/AdminLayout";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { BusinessPlayground } from "./pages/customer/BusinessPlayground";
import { ProductResearch } from "./pages/customer/ProductResearch";
import { StrategyPlanning } from "./pages/customer/StrategyPlanning";
import { LeadGeneration } from "./pages/customer/LeadGeneration";
import { AIContentCreation } from "./pages/customer/AIContentCreation";
import { SocialMediaMarketing } from "./pages/customer/SocialMediaMarketing";
import { ResponseManagement } from "./pages/customer/ResponseManagement";
import { KnowledgeBase } from "./pages/customer/KnowledgeBase";
import { AssetLibrary } from "./pages/customer/AssetLibrary";
import { LeadManagement } from "./pages/customer/LeadManagement";
import { LeadDetail } from "./pages/customer/LeadDetail";
import { LeadKanban } from "./pages/customer/LeadKanban";
import { LeadScoringDashboard } from "./pages/customer/LeadScoringDashboard";
import { DuplicateLeadManagement } from "./pages/customer/DuplicateLeadManagement";
import { WorkflowAutomation } from "./pages/customer/WorkflowAutomation";
import { Contacts } from "./pages/customer/Contacts";
import { ContactDetail } from "./pages/customer/ContactDetail";
import { ProductMaster } from "./pages/customer/ProductMaster";
import { CompanySettings } from "./pages/customer/CompanySettings";
import { MySubscription } from "./pages/customer/MySubscription";
import { CampaignManager } from "./pages/customer/CampaignManager";
import { CreateCampaign } from "./pages/customer/CreateCampaign";
import { AIAgents } from "./pages/customer/AIAgents";
import { EditAgent } from "./pages/customer/EditAgent";
import { AICallingDashboard } from "./pages/customer/AICallingDashboard";
import { LiveMonitor } from "./pages/customer/LiveMonitor";
import { CallLogs } from "./pages/customer/CallLogs";
import { CallDetail } from "./pages/customer/CallDetail";
import { ConversationFlowEditor } from "./pages/customer/ConversationFlowEditor";
import { PromptTemplateEditor } from "./pages/customer/PromptTemplateEditor";
import { InboundCallSetup } from "./pages/customer/InboundCallSetup";
import { TransferQueue } from "./pages/customer/TransferQueue";
import { CallAnalytics } from "./pages/customer/CallAnalytics";
import { CallLibrary } from "./pages/customer/CallLibrary";
import { WhatsAppDashboard } from "./pages/customer/WhatsAppDashboard";
import { WhatsAppInbox } from "./pages/customer/WhatsAppInbox";
import { WhatsAppCampaigns } from "./pages/customer/WhatsAppCampaigns";
import { WhatsAppAutomation } from "./pages/customer/WhatsAppAutomation";
import { WhatsAppTemplates } from "./pages/customer/WhatsAppTemplates";
import { WhatsAppConsent } from "./pages/customer/WhatsAppConsent";
import { WhatsAppAnalytics } from "./pages/customer/WhatsAppAnalytics";
import { WhatsAppAPI } from "./pages/customer/WhatsAppAPI";
import { WhatsAppSettings } from "./pages/customer/WhatsAppSettings";
import { LeadsWhatsApp } from "./pages/customer/LeadsWhatsApp";
import { SMSDashboard } from "./pages/customer/SMSDashboard";
import { SMSInbox } from "./pages/customer/SMSInbox";
import { SMSCampaigns } from "./pages/customer/SMSCampaigns";
import { CreateSMSCampaign } from "./pages/customer/CreateSMSCampaign";
import { SMSTemplates } from "./pages/customer/SMSTemplates";
import { SMSShortLinks } from "./pages/customer/SMSShortLinks";
import { SMSAnalytics } from "./pages/customer/SMSAnalytics";
import { SMSSettings } from "./pages/customer/SMSSettings";
import { CampaignDashboard } from "./pages/customer/CampaignDashboard";
import { CampaignList } from "./pages/customer/CampaignList";
import { CreateOmniCampaign } from "./pages/customer/CreateOmniCampaign";
import { CampaignDetail } from "./pages/customer/CampaignDetail";
import { CampaignBudgetManager } from "./pages/customer/CampaignBudgetManager";
import { CampaignExecutionMonitor } from "./pages/customer/CampaignExecutionMonitor";
import { EmailDashboard } from "./pages/customer/EmailDashboard";
import { EmailInbox } from "./pages/customer/EmailInbox";
import { EmailCompose } from "./pages/customer/EmailCompose";
import { EmailCampaigns } from "./pages/customer/EmailCampaigns";
import { CreateEmailCampaign } from "./pages/customer/CreateEmailCampaign";
import { EmailTemplates } from "./pages/customer/EmailTemplates";
import { CreateEmailTemplate } from "./pages/customer/CreateEmailTemplate";
import { EmailSignatures } from "./pages/customer/EmailSignatures";
import { EmailAnalytics } from "./pages/customer/EmailAnalytics";
import { EmailSettings } from "./pages/customer/EmailSettings";
import { DealDashboard } from "./pages/customer/DealDashboard";
import { DealList } from "./pages/customer/DealList";
import { CreateDeal } from "./pages/customer/CreateDeal";
import { DealDetail } from "./pages/customer/DealDetail";
import { DealPipeline } from "./pages/customer/DealPipeline";
import { DealForecasting } from "./pages/customer/DealForecasting";
import { ReportsAnalyticsDashboard } from "./pages/customer/ReportsAnalyticsDashboard";
import { CustomReportBuilder } from "./pages/customer/CustomReportBuilder";
import { AICallingReport } from "./pages/customer/AICallingReport";
import { CRMEffectivenessReport } from "./pages/customer/CRMEffectivenessReport";
import { CampaignEfficiencyReport } from "./pages/customer/CampaignEfficiencyReport";
import { DealProgressionReport } from "./pages/customer/DealProgressionReport";
import { UserAgentPerformanceReport } from "./pages/customer/UserAgentPerformanceReport";
import { CostTransparencyReport } from "./pages/customer/CostTransparencyReport";
import { CostGovernance } from "./pages/customer/CostGovernance";
import { ComplianceConsent } from "./pages/customer/ComplianceConsent";
import { StandaloneConfig } from "./pages/customer/StandaloneConfig";
import { CallSchedulingRetry } from "./pages/customer/CallSchedulingRetry";
import { BillingDashboard } from "./pages/admin/BillingDashboard";
import { InvoiceList } from "./pages/admin/InvoiceList";
import { InvoiceDetail } from "./pages/admin/InvoiceDetail";
import { CreateInvoice } from "./pages/admin/CreateInvoice";
import { UsageMetering } from "./pages/admin/UsageMetering";
import { BillingCreditManagement } from "./pages/admin/BillingCreditManagement";
import { BillingRules } from "./pages/admin/BillingRules";
import { BillingHistory } from "./pages/admin/BillingHistory";
import { BillingDashboard as CustomerBillingDashboard } from "./pages/customer/BillingDashboard";
import { CreditPurchase } from "./pages/customer/CreditPurchase";
import { InvoiceList as CustomerInvoiceList } from "./pages/customer/InvoiceList";
import { InvoiceDetail as CustomerInvoiceDetail } from "./pages/customer/InvoiceDetail";
import { UsageMetering as CustomerUsageMetering } from "./pages/customer/UsageMetering";
import { SuperAdminBillingDashboard } from "./pages/superadmin/SuperAdminBillingDashboard";
import { CreditManagement } from "./pages/superadmin/CreditManagement";
import { RolesPermissionsDashboard } from "./pages/admin/RolesPermissionsDashboard";
import { RolesList } from "./pages/admin/RolesList";
import { CreateEditRole } from "./pages/admin/CreateEditRole";
import { PermissionMatrix } from "./pages/admin/PermissionMatrix";
import { UserRoleAssignment } from "./pages/admin/UserRoleAssignment";
import { PermissionAuditLog } from "./pages/admin/PermissionAuditLog";
import { UserManagement } from "./pages/admin/UserManagement";
import { TenantRolesDashboard } from "./pages/customer/TenantRolesDashboard";
import { TenantRolesList } from "./pages/customer/TenantRolesList";
import { TenantCreateEditRole } from "./pages/customer/TenantCreateEditRole";
import { TenantPermissionMatrix } from "./pages/customer/TenantPermissionMatrix";
import { TeamUserAssignment } from "./pages/customer/TeamUserAssignment";
import { TenantPermissionAuditLog } from "./pages/customer/TenantPermissionAuditLog";
import { TeamUserManagement } from "./pages/customer/TeamUserManagement";
import { TeamCreateEditUser } from "./pages/customer/TeamCreateEditUser";
import { SuperAdminControls } from "./pages/admin/SuperAdminControls";
import { AbusePreventionControls } from "./pages/admin/AbusePreventionControls";
import { TenantAdminControls } from "./pages/customer/TenantAdminControls";
import { CRMCustomization } from "./pages/customer/CRMCustomization";
import { CreateWhatsAppCampaign } from "./pages/customer/CreateWhatsAppCampaign";
import { CreateWhatsAppTemplate } from "./pages/customer/CreateWhatsAppTemplate";
import { CreateWhatsAppAutomation } from "./pages/customer/CreateWhatsAppAutomation";
import { WhatsAppSetup } from "./pages/customer/WhatsAppSetup";
import { DocumentLibrary } from "./pages/customer/DocumentLibrary";
import { DocumentCreate } from "./pages/customer/DocumentCreate";
import { DocumentDetail } from "./pages/customer/DocumentDetail";
import { ReportsLibrary } from "./pages/customer/ReportsLibrary";
import { ReportBuilder } from "./pages/customer/ReportBuilder";
import { ReportViewer } from "./pages/customer/ReportViewer";
import { DashboardManager } from "./pages/customer/DashboardManager";
import { DashboardViewer } from "./pages/customer/DashboardViewer";
import { Placeholder } from "./pages/Placeholder";
import { LicenseApprovalQueue } from "./pages/admin/LicenseApprovalQueue";
import { PlatformOverrideManager } from "./pages/admin/PlatformOverrideManager";
import { PlatformAuditLog } from "./pages/admin/PlatformAuditLog";
import { Companies } from "./pages/customer/Companies";
import { PaymentMethods } from "./pages/customer/PaymentMethods";
import { DealEdit } from "./pages/customer/DealEdit";
import { DocumentTemplates } from "./pages/customer/DocumentTemplates";
import { DashboardBuilder } from "./pages/customer/DashboardBuilder";
import { IntegrationDashboard } from "./pages/customer/integrations/IntegrationDashboard";
import { IntegrationMarketplace } from "./pages/customer/integrations/IntegrationMarketplace";
import { IntegrationDetail } from "./pages/customer/integrations/IntegrationDetail";
import { IntegrationConfiguration } from "./pages/customer/integrations/IntegrationConfiguration";
import { APIKeysManagement } from "./pages/customer/integrations/APIKeysManagement";
import { WebhooksManagement } from "./pages/customer/integrations/WebhooksManagement";
import { IntegrationLogs } from "./pages/customer/integrations/IntegrationLogs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WebsiteLanding,
  },
  {
    path: "/auth",
    Component: AuthSelection,
  },
  {
    path: "/login/admin",
    Component: Login,
  },
  {
    path: "/login/customer",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/forgot-password/sent",
    Component: ForgotPasswordSent,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/modals",
    Component: ModalShowcase,
  },
  {
    path: "/empty-states",
    Component: EmptyStatesShowcase,
  },
  {
    path: "/loading",
    Component: LoadingShowcase,
  },
  {
    path: "/lead-form",
    Component: LeadFormDemo,
  },
  {
    path: "/kanban",
    Component: KanbanDemo,
  },
  {
    path: "/scoring",
    Component: ScoringDemo,
  },
  {
    path: "/assignment",
    Component: AssignmentDemo,
  },
  {
    path: "/duplicates",
    Component: DuplicatesDemo,
  },
  {
    path: "/workflow",
    Component: WorkflowDemo,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "tenants", Component: TenantList },
      { path: "tenants/create", Component: CreateTenant },
      { path: "tenants/edit", Component: EditTenant },
      { path: "tenants/detail", Component: TenantDetail },
      { path: "subscription-plans", Component: SubscriptionPlans },
      { path: "subscription-plans/detail", Component: PlanDetail },
      { path: "subscription-plans/edit", Component: EditPlan },
      { path: "licenses", Component: LicenseManagement },
      { path: "licenses/detail", Component: LicenseDetail },
      { path: "usage", Component: UsageAnalytics },
      { path: "credits", Component: CreditConfiguration },
      { path: "storage", Component: StorageConfiguration },
      { path: "alerts", Component: AlertsCenter },
      { path: "settings", Component: Settings },
      { path: "settings/platform", Component: PlatformSettings },
      { path: "settings/email", Component: EmailNotifications },
      { path: "settings/security", Component: SecurityAuth },
      { path: "settings/billing", Component: BillingPayments },
      { path: "settings/api", Component: APIIntegrations },
      { path: "settings/audit", Component: AuditCompliance },
      { path: "settings/maintenance", Component: SystemMaintenance },
      { path: "settings/appearance", Component: AppearanceBranding },
      { path: "settings/fiscal", Component: FiscalCalendar },
      { path: "settings/lead-form", Component: LeadFormConfiguration },
      { path: "companies", Component: CompanyBranchManagement },
      { path: "companies/:id", Component: CompanyBranchManagement },
      { path: "lead-assignment-config", Component: LeadAssignmentConfig },
      { path: "billing", Component: SuperAdminBillingDashboard },
      { path: "billing/platform", Component: SuperAdminBillingDashboard },
      { path: "billing/tenants", Component: Placeholder },
      { path: "billing/tenants/:tenantId", Component: CreditManagement },
      { path: "billing/credit-management", Component: CreditManagement },
      { path: "billing/invoices", Component: InvoiceList },
      { path: "billing/invoices/detail", Component: InvoiceDetail },
      { path: "billing/invoices/create", Component: CreateInvoice },
      { path: "billing/usage-metering", Component: UsageMetering },
      { path: "billing/rules", Component: BillingRules },
      { path: "billing/history", Component: BillingHistory },
      { path: "roles-permissions", Component: RolesPermissionsDashboard },
      { path: "roles-permissions/roles", Component: RolesList },
      { path: "roles-permissions/create", Component: CreateEditRole },
      { path: "roles-permissions/edit", Component: CreateEditRole },
      { path: "roles-permissions/matrix", Component: PermissionMatrix },
      { path: "roles-permissions/assignments", Component: UserRoleAssignment },
      { path: "roles-permissions/audit", Component: PermissionAuditLog },
      { path: "users", Component: UserManagement },
      { path: "controls", Component: SuperAdminControls },
      { path: "controls/abuse-prevention", Component: AbusePreventionControls },
      { path: "controls/overrides", Component: PlatformOverrideManager },
      { path: "controls/audit", Component: PlatformAuditLog },
      { path: "licenses/approvals", Component: LicenseApprovalQueue },
      { path: "*", Component: Placeholder },
    ],
  },
  {
    path: "/tenant",
    Component: CustomerLayout,
    children: [
      { index: true, Component: CustomerDashboard },
      { path: "dashboard", Component: CustomerDashboard },
      { path: "playground", Component: BusinessPlayground },
      { path: "research", Component: ProductResearch },
      { path: "strategy", Component: StrategyPlanning },
      { path: "leads-generation", Component: LeadGeneration },
      { path: "content", Component: AIContentCreation },
      { path: "social", Component: SocialMediaMarketing },
      { path: "responses", Component: ResponseManagement },
      { path: "knowledge", Component: KnowledgeBase },
      { path: "assets", Component: AssetLibrary },
      { path: "leads", Component: LeadManagement },
      { path: "lead-detail", Component: LeadDetail },
      { path: "lead-kanban", Component: LeadKanban },
      { path: "lead-scoring", Component: LeadScoringDashboard },
      { path: "duplicates", Component: DuplicateLeadManagement },
      { path: "workflow-automation", Component: WorkflowAutomation },
      { path: "contacts", Component: Contacts },
      { path: "contacts/:id", Component: ContactDetail },
      { path: "crm-customization/products", Component: ProductMaster },
      { path: "companies", Component: Companies },
      { path: "deals", Component: DealDashboard },
      { path: "deals/list", Component: DealList },
      { path: "deals/create", Component: CreateDeal },
      { path: "deals/detail", Component: DealDetail },
      { path: "deals/edit", Component: DealEdit },
      { path: "deals/pipeline", Component: DealPipeline },
      { path: "deals/forecasting", Component: DealForecasting },
      { path: "documents", Component: DocumentLibrary },
      { path: "documents/create", Component: DocumentCreate },
      { path: "documents/:id", Component: DocumentDetail },
      { path: "documents/:id/edit", Component: DocumentCreate },
      { path: "documents/templates", Component: DocumentTemplates },
      { path: "documents/templates/create", Component: DocumentTemplates },
      { path: "documents/templates/:id", Component: DocumentTemplates },
      { path: "campaigns", Component: CampaignList },
      { path: "campaigns/create", Component: CreateOmniCampaign },
      { path: "campaigns/dashboard", Component: CampaignDashboard },
      { path: "campaigns/:id", Component: CampaignDetail },
      { path: "campaigns/:id/edit", Component: CreateOmniCampaign },
      { path: "campaigns/:id/analytics", Component: CallAnalytics },
      { path: "campaigns/:id/budget", Component: CampaignBudgetManager },
      { path: "campaigns/:id/monitor", Component: CampaignExecutionMonitor },
      { path: "ai-campaigns", Component: CampaignManager },
      { path: "ai-campaigns/create", Component: CreateCampaign },
      { path: "ai-agents", Component: AIAgents },
      { path: "edit-agent", Component: EditAgent },
      { path: "ai-calling", Component: AICallingDashboard },
      { path: "live-monitor", Component: LiveMonitor },
      { path: "call-logs", Component: CallLogs },
      { path: "call-detail", Component: CallDetail },
      { path: "conversation-flow-editor", Component: ConversationFlowEditor },
      { path: "prompt-template-editor", Component: PromptTemplateEditor },
      { path: "inbound-call-setup", Component: InboundCallSetup },
      { path: "transfer-queue", Component: TransferQueue },
      { path: "call-analytics", Component: CallAnalytics },
      { path: "call-library", Component: CallLibrary },
      { path: "whatsapp", Component: WhatsAppDashboard },
      { path: "whatsapp/setup", Component: WhatsAppSetup },
      { path: "whatsapp/inbox", Component: WhatsAppInbox },
      { path: "whatsapp/leads", Component: LeadsWhatsApp },
      { path: "whatsapp/campaigns", Component: WhatsAppCampaigns },
      { path: "whatsapp/campaigns/create", Component: CreateWhatsAppCampaign },
      { path: "whatsapp/automation", Component: WhatsAppAutomation },
      { path: "whatsapp/automation/create", Component: CreateWhatsAppAutomation },
      { path: "whatsapp/templates", Component: WhatsAppTemplates },
      { path: "whatsapp/templates/create", Component: CreateWhatsAppTemplate },
      { path: "whatsapp/consent", Component: WhatsAppConsent },
      { path: "whatsapp/analytics", Component: WhatsAppAnalytics },
      { path: "whatsapp/api", Component: WhatsAppAPI },
      { path: "whatsapp/settings", Component: WhatsAppSettings },
      { path: "sms", Component: SMSDashboard },
      { path: "sms/inbox", Component: SMSInbox },
      { path: "sms/campaigns", Component: SMSCampaigns },
      { path: "sms/campaigns/create", Component: CreateSMSCampaign },
      { path: "sms/templates", Component: SMSTemplates },
      { path: "sms/short-links", Component: SMSShortLinks },
      { path: "sms/analytics", Component: SMSAnalytics },
      { path: "sms/settings", Component: SMSSettings },
      { path: "email", Component: EmailDashboard },
      { path: "email/inbox", Component: EmailInbox },
      { path: "email/compose", Component: EmailCompose },
      { path: "email/campaigns", Component: EmailCampaigns },
      { path: "email/campaigns/create", Component: CreateEmailCampaign },
      { path: "email/campaigns/:id/edit", Component: CreateEmailCampaign },
      { path: "email/templates", Component: EmailTemplates },
      { path: "email/templates/create", Component: CreateEmailTemplate },
      { path: "email/templates/:id/edit", Component: CreateEmailTemplate },
      { path: "email/signatures", Component: EmailSignatures },
      { path: "email/analytics", Component: EmailAnalytics },
      { path: "email/settings", Component: EmailSettings },
      { path: "reports", Component: ReportsAnalyticsDashboard },
      { path: "reports/library", Component: ReportsLibrary },
      { path: "reports/builder", Component: ReportBuilder },
      { path: "reports/view/:id", Component: ReportViewer },
      { path: "reports/dashboards", Component: DashboardManager },
      { path: "reports/dashboards/builder", Component: DashboardBuilder },
      { path: "reports/dashboards/:id", Component: DashboardViewer },
      { path: "reports/ai-calling", Component: AICallingReport },
      { path: "reports/crm", Component: CRMEffectivenessReport },
      { path: "reports/campaigns", Component: CampaignEfficiencyReport },
      { path: "reports/deals", Component: DealProgressionReport },
      { path: "reports/performance", Component: UserAgentPerformanceReport },
      { path: "reports/cost", Component: CostTransparencyReport },
      { path: "reports-analytics", Component: ReportsAnalyticsDashboard },
      { path: "reports-analytics/builder", Component: ReportBuilder },
      { path: "settings/company", Component: CompanySettings },
      { path: "settings/subscription", Component: MySubscription },
      { path: "subscription", Component: MySubscription },
      { path: "billing", Component: CustomerBillingDashboard },
      { path: "billing/subscription", Component: MySubscription },
      { path: "billing/purchase", Component: CreditPurchase },
      { path: "billing/invoices", Component: CustomerInvoiceList },
      { path: "billing/invoices/:invoiceId", Component: CustomerInvoiceDetail },
      { path: "billing/usage", Component: CustomerUsageMetering },
      { path: "billing/payment-methods", Component: PaymentMethods },
      { path: "invoices", Component: CustomerInvoiceList },
      { path: "usage", Component: CustomerUsageMetering },
      { path: "payment-methods", Component: PaymentMethods },
      { path: "cost-governance", Component: CostGovernance },
      { path: "compliance-consent", Component: ComplianceConsent },
      { path: "standalone-config", Component: StandaloneConfig },
      { path: "call-scheduling-retry", Component: CallSchedulingRetry },
      { path: "team", Component: TenantRolesDashboard },
      { path: "team/roles", Component: TenantRolesList },
      { path: "team/roles/create", Component: TenantCreateEditRole },
      { path: "team/roles/edit", Component: TenantCreateEditRole },
      { path: "team/matrix", Component: TenantPermissionMatrix },
      { path: "team/assignments", Component: TeamUserAssignment },
      { path: "team/users", Component: TeamUserManagement },
      { path: "team/users/create", Component: TeamCreateEditUser },
      { path: "team/users/edit", Component: TeamCreateEditUser },
      { path: "team/audit", Component: TenantPermissionAuditLog },
      { path: "admin-controls", Component: TenantAdminControls },
      { path: "crm-customization", Component: CRMCustomization },
      { path: "integrations", Component: IntegrationDashboard },
      { path: "integrations/marketplace", Component: IntegrationMarketplace },
      { path: "integrations/marketplace/:id", Component: IntegrationDetail },
      { path: "integrations/api-keys", Component: APIKeysManagement },
      { path: "integrations/webhooks", Component: WebhooksManagement },
      { path: "integrations/logs", Component: IntegrationLogs },
      { path: "integrations/:id", Component: IntegrationDetail },
      { path: "integrations/:id/configure", Component: IntegrationConfiguration },
      { path: "*", Component: Placeholder },
    ],
  },
  {
    path: "*",
    Component: Placeholder,
  },
]);