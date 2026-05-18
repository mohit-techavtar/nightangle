import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Building2, CreditCard, KeyRound, BarChart3, Bell, Settings, LayoutDashboard,
  Users, Bot, PhoneCall, MessageCircle, MessageSquare, Megaphone, FileText, ChevronLeft, ChevronRight,
  Contact, Briefcase, Handshake, HelpCircle, Menu, X, Sparkles, BookOpen, Image as ImageIcon, HardDrive,
  GitBranch, ChevronDown, ChevronUp, Star, Clock, AlertCircle, UserX, User as UserIcon,
  Search, Target, UserPlus, Edit3, Share2, Mail, Kanban, TrendingUp, Copy, Workflow, Settings2,
  Globe, Shield, Plug, Wrench, Palette, Radio, Library, BarChart2, DollarSign, FileCheck, Database, Calendar,
  Activity, CreditCard as CreditCardIcon, Receipt, Zap, History, Grid3x3, Ban, Lock as LockIcon, Key, Webhook,
  Package, Network, ShoppingCart, Store, ShoppingBag
} from "lucide-react";

interface SubNavItem {
  label: string;
  icon: React.ElementType;
  count: number;
  viewId: string;
  type: "personal" | "shared";
}

interface PlaygroundSubItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  subItems?: SubNavItem[];
  playgroundItems?: PlaygroundSubItem[];
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const savedViews: SubNavItem[] = [
  { label: "My Hot Leads", icon: Star, count: 12, viewId: "my-hot-leads", type: "personal" },
  { label: "Stale Leads", icon: Clock, count: 8, viewId: "stale-leads", type: "personal" },
  { label: "All Open Leads", icon: AlertCircle, count: 45, viewId: "all-open-leads", type: "shared" },
  { label: "Unassigned", icon: UserX, count: 5, viewId: "unassigned", type: "shared" },
];

const playgroundItems: PlaygroundSubItem[] = [
  { label: "Product Research", icon: Search, path: "/tenant/research" },
  { label: "Strategy Planning", icon: Target, path: "/tenant/strategy" },
  { label: "Lead Generation", icon: UserPlus, path: "/tenant/leads-generation" },
  { label: "AI Content Creation", icon: Edit3, path: "/tenant/content" },
  { label: "Social Media Marketing", icon: Share2, path: "/tenant/social" },
  { label: "Response Management", icon: Mail, path: "/tenant/responses" },
];

const leadManagementItems: PlaygroundSubItem[] = [
  { label: "Lead List View", icon: GitBranch, path: "/tenant/leads" },
  { label: "Lead Kanban", icon: Kanban, path: "/tenant/lead-kanban" },
  { label: "Lead Scoring", icon: TrendingUp, path: "/tenant/lead-scoring" },
  { label: "Duplicate Management", icon: Copy, path: "/tenant/duplicates" },
  { label: "Workflow Automation", icon: Workflow, path: "/tenant/workflow-automation" },
];

const documentItems: PlaygroundSubItem[] = [
  { label: "Document Library", icon: Library, path: "/tenant/documents" },
  { label: "Create Document", icon: FileText, path: "/tenant/documents/create" },
  { label: "Templates", icon: Copy, path: "/tenant/documents/templates" },
];

const aiCallingItems: PlaygroundSubItem[] = [
  { label: "AI Calling Dashboard", icon: LayoutDashboard, path: "/tenant/ai-calling" },
  { label: "Live Call Monitor", icon: Radio, path: "/tenant/live-monitor" },
  { label: "Call Library", icon: Library, path: "/tenant/call-library" },
  { label: "Call Analytics", icon: BarChart2, path: "/tenant/call-analytics" },
  { label: "Cost & Budget", icon: DollarSign, path: "/tenant/cost-governance" },
  { label: "Compliance", icon: FileCheck, path: "/tenant/compliance-consent" },
  { label: "Standalone Mode", icon: Database, path: "/tenant/standalone-config" },
  { label: "Scheduling & Retry", icon: Calendar, path: "/tenant/call-scheduling-retry" },
];

const whatsappItems: PlaygroundSubItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/whatsapp" },
  { label: "Inbox", icon: MessageCircle, path: "/tenant/whatsapp/inbox" },
  { label: "Campaigns", icon: Megaphone, path: "/tenant/whatsapp/campaigns" },
  { label: "Automation", icon: Workflow, path: "/tenant/whatsapp/automation" },
  { label: "Templates", icon: FileText, path: "/tenant/whatsapp/templates" },
  { label: "Consent Tracking", icon: Shield, path: "/tenant/whatsapp/consent" },
  { label: "Analytics", icon: BarChart2, path: "/tenant/whatsapp/analytics" },
  { label: "API & Webhooks", icon: Plug, path: "/tenant/whatsapp/api" },
  { label: "Settings", icon: Settings2, path: "/tenant/whatsapp/settings" },
];

const smsItems: PlaygroundSubItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/sms" },
  { label: "Inbox", icon: MessageCircle, path: "/tenant/sms/inbox" },
  { label: "Campaigns", icon: Megaphone, path: "/tenant/sms/campaigns" },
  { label: "Templates", icon: FileText, path: "/tenant/sms/templates" },
  { label: "Short Links", icon: GitBranch, path: "/tenant/sms/short-links" },
  { label: "Analytics", icon: BarChart2, path: "/tenant/sms/analytics" },
  { label: "Settings", icon: Settings2, path: "/tenant/sms/settings" },
];

const emailItems: PlaygroundSubItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/email" },
  { label: "Inbox", icon: MessageCircle, path: "/tenant/email/inbox" },
  { label: "Campaigns", icon: Megaphone, path: "/tenant/email/campaigns" },
  { label: "Templates", icon: FileText, path: "/tenant/email/templates" },
  { label: "Signatures", icon: Edit3, path: "/tenant/email/signatures" },
  { label: "Analytics", icon: BarChart2, path: "/tenant/email/analytics" },
  { label: "Settings", icon: Settings2, path: "/tenant/email/settings" },
];

const campaignItems: PlaygroundSubItem[] = [
  { label: "Campaign Dashboard", icon: LayoutDashboard, path: "/tenant/campaigns/dashboard" },
  { label: "All Campaigns", icon: GitBranch, path: "/tenant/campaigns" },
  { label: "Create Campaign", icon: Target, path: "/tenant/campaigns/create" },
  { label: "AI Campaigns", icon: Bot, path: "/tenant/ai-campaigns" },
];

const settingsItems: PlaygroundSubItem[] = [
  { label: "Platform Settings", icon: Globe, path: "/admin/settings/platform" },
  { label: "Fiscal Year & Holidays", icon: Calendar, path: "/admin/settings/fiscal" },
  { label: "Email & Notifications", icon: Mail, path: "/admin/settings/email" },
  { label: "Security & Authentication", icon: Shield, path: "/admin/settings/security" },
  { label: "Billing & Payments", icon: CreditCard, path: "/admin/settings/billing" },
  { label: "API & Integrations", icon: Plug, path: "/admin/settings/api" },
  { label: "Audit & Compliance", icon: FileText, path: "/admin/settings/audit" },
  { label: "System Maintenance", icon: Wrench, path: "/admin/settings/maintenance" },
  { label: "Appearance & Branding", icon: Palette, path: "/admin/settings/appearance" },
  { label: "Lead Form Configuration", icon: GitBranch, path: "/admin/settings/lead-form" },
];

const reportsItems: PlaygroundSubItem[] = [
  { label: "Reports Dashboard", icon: LayoutDashboard, path: "/tenant/reports" },
  { label: "Report Library", icon: Library, path: "/tenant/reports/library" },
  { label: "Create Custom Report", icon: Settings2, path: "/tenant/reports/builder" },
  { label: "My Dashboards", icon: Grid3x3, path: "/tenant/reports/dashboards" },
  { label: "AI Calling Reports", icon: PhoneCall, path: "/tenant/reports/ai-calling" },
  { label: "CRM Reports", icon: Users, path: "/tenant/reports/crm" },
  { label: "Campaign Reports", icon: Megaphone, path: "/tenant/reports/campaigns" },
  { label: "Deal Reports", icon: TrendingUp, path: "/tenant/reports/deals" },
  { label: "Performance Reports", icon: Star, path: "/tenant/reports/performance" },
  { label: "Cost Reports", icon: DollarSign, path: "/tenant/reports/cost" },
];

const customerBillingItems: PlaygroundSubItem[] = [
  { label: "My Subscription", icon: CreditCard, path: "/tenant/billing/subscription" },
  { label: "Invoices", icon: Receipt, path: "/tenant/billing/invoices" },
  { label: "Usage & Credits", icon: Activity, path: "/tenant/billing/usage" },
  { label: "Payment Methods", icon: CreditCardIcon, path: "/tenant/billing/payment-methods" },
];

const teamManagementItems: PlaygroundSubItem[] = [
  { label: "Overview", icon: LayoutDashboard, path: "/tenant/team" },
  { label: "Team Roles", icon: Shield, path: "/tenant/team/roles" },
  { label: "Permission Matrix", icon: Grid3x3, path: "/tenant/team/matrix" },
  { label: "Member Assignment", icon: UserIcon, path: "/tenant/team/assignments" },
  { label: "Activity Log", icon: FileText, path: "/tenant/team/audit" },
];

const integrationItems: PlaygroundSubItem[] = [
  { label: "Integration Dashboard", icon: LayoutDashboard, path: "/tenant/integrations" },
  { label: "Browse Marketplace", icon: Search, path: "/tenant/integrations/marketplace" },
  { label: "API Keys", icon: Key, path: "/tenant/integrations/api-keys" },
  { label: "Webhooks", icon: Webhook, path: "/tenant/integrations/webhooks" },
  { label: "Activity Logs", icon: Activity, path: "/tenant/integrations/logs" },
];

const crmCustomizationItems: PlaygroundSubItem[] = [
  { label: "Modules & Fields", icon: Database, path: "/tenant/crm-customization" },
  { label: "Product Master", icon: Package, path: "/tenant/crm-customization/products" },
  { label: "Page Layouts", icon: Grid3x3, path: "/tenant/crm-customization" },
  { label: "Validation Rules", icon: Shield, path: "/tenant/crm-customization" },
  { label: "Pipelines", icon: TrendingUp, path: "/tenant/crm-customization" },
  { label: "Views & Filters", icon: GitBranch, path: "/tenant/crm-customization" },
  { label: "Automation Rules", icon: Zap, path: "/tenant/crm-customization" },
];

const ecommerceItems: PlaygroundSubItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/ecommerce" },
  { label: "Store Connections", icon: Store, path: "/tenant/ecommerce/connections" },
  { label: "Orders", icon: ShoppingCart, path: "/tenant/ecommerce/orders" },
  { label: "Products", icon: Package, path: "/tenant/ecommerce/products" },
  { label: "Customers", icon: UserIcon, path: "/tenant/ecommerce/customers" },
];

const billingItems: PlaygroundSubItem[] = [
  { label: "Billing Dashboard", icon: LayoutDashboard, path: "/admin/billing" },
  { label: "Invoices", icon: Receipt, path: "/admin/billing/invoices" },
  { label: "Usage Metering", icon: Activity, path: "/admin/billing/usage-metering" },
  { label: "Credit Management", icon: CreditCardIcon, path: "/admin/billing/credit-management" },
  { label: "Billing Rules", icon: Zap, path: "/admin/billing/rules" },
  { label: "Transaction History", icon: History, path: "/admin/billing/history" },
];

const rolesPermissionsItems: PlaygroundSubItem[] = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin/roles-permissions" },
  { label: "All Roles", icon: Shield, path: "/admin/roles-permissions/roles" },
  { label: "Permission Matrix", icon: Grid3x3, path: "/admin/roles-permissions/matrix" },
  { label: "User Assignment", icon: UserIcon, path: "/admin/roles-permissions/assignments" },
  { label: "Audit Log", icon: FileText, path: "/admin/roles-permissions/audit" },
];

const platformControlsItems: PlaygroundSubItem[] = [
  { label: "Super Admin Controls", icon: Shield, path: "/admin/controls" },
  { label: "Abuse Prevention", icon: Ban, path: "/admin/controls/abuse-prevention" },
  { label: "Override Manager", icon: LockIcon, path: "/admin/controls/overrides" },
  { label: "Platform Audit", icon: FileText, path: "/admin/controls/audit" },
];

const customerNav: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/dashboard" },
      { label: "Business Playground", icon: Sparkles, path: "/tenant/playground", playgroundItems: playgroundItems },
    ]
  },
  {
    label: "CRM",
    items: [
      { label: "Lead Management", icon: GitBranch, path: "/tenant/leads", playgroundItems: leadManagementItems },
      { label: "Contacts", icon: Contact, path: "/tenant/contacts" },
      { label: "Companies", icon: Briefcase, path: "/tenant/companies" },
      { label: "Deals", icon: Handshake, path: "/tenant/deals" },
      { label: "Product Master", icon: Package, path: "/tenant/crm-customization/products" },
      { label: "Documents", icon: FileText, path: "/tenant/documents", playgroundItems: documentItems },
      { label: "CRM Setup", icon: Settings2, path: "/tenant/crm-customization", playgroundItems: crmCustomizationItems },
    ]
  },
  {
    label: "E-Commerce",
    items: [
      { label: "E-Commerce", icon: Store, path: "/tenant/ecommerce", playgroundItems: ecommerceItems },
    ]
  },
  {
    label: "Communication",
    items: [
      { label: "Campaigns", icon: Megaphone, path: "/tenant/campaigns", playgroundItems: campaignItems },
      { label: "AI Agents", icon: Bot, path: "/tenant/ai-agents" },
      { label: "AI Calling", icon: PhoneCall, path: "/tenant/ai-calling", playgroundItems: aiCallingItems },
      { label: "WhatsApp", icon: MessageCircle, path: "/tenant/whatsapp", playgroundItems: whatsappItems },
      { label: "SMS", icon: MessageSquare, path: "/tenant/sms", playgroundItems: smsItems },
      { label: "Email", icon: Mail, path: "/tenant/email", playgroundItems: emailItems },
      { label: "Call Logs", icon: PhoneCall, path: "/tenant/call-logs" },
    ]
  },
  {
    label: "Knowledge & Assets",
    items: [
      { label: "Knowledge Base", icon: BookOpen, path: "/tenant/knowledge" },
      { label: "Asset Library", icon: ImageIcon, path: "/tenant/assets" },
    ]
  },
  {
    label: "Insights",
    items: [
      { label: "Reports & Analytics", icon: BarChart3, path: "/tenant/reports", playgroundItems: reportsItems },
    ]
  },
  {
    label: "Team",
    items: [
      { label: "Team Management", icon: UserIcon, path: "/tenant/team", playgroundItems: teamManagementItems },
      { label: "Admin Controls", icon: LockIcon, path: "/tenant/admin-controls" },
    ]
  },
  {
    label: "Account",
    items: [
      { label: "Settings", icon: Settings, path: "/tenant/settings/company" },
      { label: "Integrations", icon: Plug, path: "/tenant/integrations", playgroundItems: integrationItems },
      { label: "Billing", icon: CreditCard, path: "/tenant/billing", playgroundItems: customerBillingItems },
    ]
  }
];

const adminNav: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    ]
  },
  {
    label: "Tenant Management",
    items: [
      { label: "All Tenants", icon: Building2, path: "/admin/tenants" },
      { label: "Companies & Branches", icon: Network, path: "/admin/companies" },
      { label: "Subscription Plans", icon: CreditCard, path: "/admin/subscription-plans" },
      { label: "License Management", icon: KeyRound, path: "/admin/licenses" },
    ]
  },
  {
    label: "Security & Access",
    items: [
      { label: "Roles & Permissions", icon: Shield, path: "/admin/roles-permissions", playgroundItems: rolesPermissionsItems },
      { label: "Platform Controls", icon: LockIcon, path: "/admin/controls", playgroundItems: platformControlsItems },
    ]
  },
  {
    label: "Finance",
    items: [
      { label: "Billing", icon: DollarSign, path: "/admin/billing", playgroundItems: billingItems },
    ]
  },
  {
    label: "Platform",
    items: [
      { label: "Usage Analytics", icon: BarChart3, path: "/admin/usage" },
      { label: "Credit Configuration", icon: Sparkles, path: "/admin/credits" },
      { label: "Storage Configuration", icon: HardDrive, path: "/admin/storage" },
      { label: "Alerts Center", icon: Bell, path: "/admin/alerts" },
      { label: "Settings", icon: Settings, path: "/admin/settings/platform", playgroundItems: settingsItems },
    ]
  }
];

interface SidebarProps {
  mode: "admin" | "customer";
}

export function Sidebar({ mode }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["/tenant/leads"]); // Lead Pipeline expanded by default
  const navigate = useNavigate();
  const location = useLocation();
  const nav = mode === "admin" ? adminNav : customerNav;

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path === "/tenant/dashboard" && (location.pathname === "/tenant" || location.pathname === "/tenant/dashboard")) return true;
    if (path !== "/admin" && path !== "/tenant/dashboard") return location.pathname.startsWith(path);
    return false;
  };

  const handleNavClick = (path: string, hasSubItems?: boolean) => {
    if (hasSubItems) {
      // Toggle expand/collapse
      setExpandedItems(prev =>
        prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
      );
    } else {
      navigate(path);
      setMobileOpen(false);
    }
  };

  const handleSubItemClick = (parentPath: string, viewId: string) => {
    navigate(`${parentPath}?view=${viewId}`);
    setMobileOpen(false);
  };

  const handlePlaygroundItemClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isExpanded = (path: string) => expandedItems.includes(path);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-[#0F1B2D] text-white flex items-center justify-center shadow-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        collapsed ? "w-16" : "w-[260px]"
      } h-screen bg-[#0F1B2D] flex flex-col shrink-0 transition-all duration-200 overflow-hidden max-md:fixed max-md:z-40 max-md:w-[280px] ${
        mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
          {!collapsed && <span className="text-white font-bold text-lg tracking-tight">OmniCRM</span>}
          {collapsed && <span className="text-white font-bold text-lg">O</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {nav.map((group, gi) => (
            <div key={gi}>
              {group.label && !collapsed && (
                <div className="px-4 pt-5 pb-1 text-[11px] uppercase tracking-widest text-[#9E9E9E] font-semibold">
                  {group.label}
                </div>
              )}
              {group.label && collapsed && <div className="my-2 mx-3 border-t border-white/10" />}
              {group.items.map((item) => {
                const active = isActive(item.path);
                const expanded = isExpanded(item.path);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const hasPlaygroundItems = item.playgroundItems && item.playgroundItems.length > 0;
                const isExpandable = hasSubItems || hasPlaygroundItems;

                return (
                  <div key={item.path}>
                    {/* Main Item */}
                    <button
                      onClick={() => handleNavClick(item.path, isExpandable)}
                      className={`w-full flex items-center justify-between h-11 px-4 text-sm transition-all relative
                        ${active ? "text-white bg-[rgba(21,101,192,0.15)]" : "text-white/70 hover:text-white hover:bg-white/5"}
                      `}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3">
                        {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1565C0] rounded-r" />}
                        <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                      {!collapsed && isExpandable && (
                        <div className="text-white/50">
                          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      )}
                    </button>

                    {/* Playground Sub Items */}
                    {!collapsed && hasPlaygroundItems && expanded && (
                      <div className="bg-[rgba(0,0,0,0.2)] py-2">
                        {item.playgroundItems?.map(playgroundItem => {
                          const PlaygroundIcon = playgroundItem.icon;
                          const isPlaygroundActive = location.pathname === playgroundItem.path;
                          return (
                            <button
                              key={playgroundItem.path}
                              onClick={() => handlePlaygroundItemClick(playgroundItem.path)}
                              className={`w-full flex items-center gap-2 px-4 pl-10 py-2 text-xs transition-all
                                ${isPlaygroundActive ? "text-white bg-white/5" : "text-white/70 hover:text-white hover:bg-white/5"}
                              `}
                            >
                              <PlaygroundIcon size={14} strokeWidth={1.5} />
                              <span>{playgroundItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Sub Items (Saved Views) */}
                    {!collapsed && hasSubItems && expanded && (
                      <div className="bg-[rgba(0,0,0,0.2)] py-2">
                        {/* Personal Views Header */}
                        <div className="px-4 py-1 flex items-center gap-2">
                          <UserIcon size={12} className="text-white/40" />
                          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                            Personal
                          </span>
                        </div>
                        {item.subItems?.filter(sub => sub.type === "personal").map(subItem => {
                          const SubIcon = subItem.icon;
                          return (
                            <button
                              key={subItem.viewId}
                              onClick={() => handleSubItemClick(item.path, subItem.viewId)}
                              className="w-full flex items-center justify-between px-4 pl-10 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <SubIcon size={14} strokeWidth={1.5} />
                                <span>{subItem.label}</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-white/60">
                                {subItem.count}
                              </span>
                            </button>
                          );
                        })}

                        {/* Shared Views Header */}
                        <div className="px-4 py-1 flex items-center gap-2 mt-2">
                          <Users size={12} className="text-white/40" />
                          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                            Shared
                          </span>
                        </div>
                        {item.subItems?.filter(sub => sub.type === "shared").map(subItem => {
                          const SubIcon = subItem.icon;
                          return (
                            <button
                              key={subItem.viewId}
                              onClick={() => handleSubItemClick(item.path, subItem.viewId)}
                              className="w-full flex items-center justify-between px-4 pl-10 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <SubIcon size={14} strokeWidth={1.5} />
                                <span>{subItem.label}</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-white/60">
                                {subItem.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle - Desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-11 flex items-center justify-center text-white/50 hover:text-white border-t border-white/10 transition-colors max-md:hidden"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>
    </>
  );
}