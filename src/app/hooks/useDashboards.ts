import { useState } from "react";

// Dashboard Types
export type DashboardRole = "superadmin" | "tenant-admin" | "manager" | "agent";
export type WidgetType = "metric" | "chart" | "table" | "list" | "funnel" | "gauge" | "heatmap";
export type ChartType = "bar" | "line" | "pie" | "area" | "donut";

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  chartType?: ChartType;
  dataSource: string;
  filters?: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
  refreshInterval?: number;
  permissions?: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  role: DashboardRole;
  isDefault: boolean;
  isPublic: boolean;
  widgets: DashboardWidget[];
  layout: "grid" | "flex";
  refreshInterval?: number;
  permissions: string[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  sharedWith?: string[];
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  role: DashboardRole;
  icon: string;
  widgets: Omit<DashboardWidget, "id">[];
  isPopular: boolean;
  category: "analytics" | "operations" | "executive" | "custom";
}

// Mock Dashboard Templates
const mockTemplates: DashboardTemplate[] = [
  {
    id: "template-superadmin",
    name: "Platform Overview",
    description: "Super admin dashboard with platform-wide metrics",
    role: "superadmin",
    icon: "Shield",
    category: "executive",
    isPopular: true,
    widgets: [
      {
        title: "Total Call Minutes",
        type: "metric",
        dataSource: "platform.callMinutes",
        position: { x: 0, y: 0, w: 3, h: 2 },
      },
      {
        title: "Active Tenants",
        type: "metric",
        dataSource: "platform.activeTenants",
        position: { x: 3, y: 0, w: 3, h: 2 },
      },
      {
        title: "AI Call Success Rate",
        type: "gauge",
        dataSource: "platform.aiSuccessRate",
        position: { x: 6, y: 0, w: 3, h: 2 },
      },
      {
        title: "Cost vs Usage Overview",
        type: "chart",
        chartType: "line",
        dataSource: "platform.costUsage",
        position: { x: 9, y: 0, w: 3, h: 2 },
      },
      {
        title: "Error & Failure Rates",
        type: "chart",
        chartType: "bar",
        dataSource: "platform.errorRates",
        position: { x: 0, y: 2, w: 6, h: 3 },
      },
      {
        title: "Tenant Activity",
        type: "table",
        dataSource: "platform.tenantActivity",
        position: { x: 6, y: 2, w: 6, h: 3 },
      },
    ],
  },
  {
    id: "template-tenant-admin",
    name: "Tenant Performance",
    description: "Tenant admin dashboard with team and campaign metrics",
    role: "tenant-admin",
    icon: "Building",
    category: "executive",
    isPopular: true,
    widgets: [
      {
        title: "AI vs Human Performance",
        type: "chart",
        chartType: "bar",
        dataSource: "tenant.aiVsHuman",
        position: { x: 0, y: 0, w: 6, h: 3 },
      },
      {
        title: "Lead Conversion Funnel",
        type: "funnel",
        dataSource: "tenant.conversionFunnel",
        position: { x: 6, y: 0, w: 6, h: 3 },
      },
      {
        title: "Campaign Effectiveness",
        type: "chart",
        chartType: "line",
        dataSource: "tenant.campaignEffectiveness",
        position: { x: 0, y: 3, w: 4, h: 3 },
      },
      {
        title: "Cost per Lead",
        type: "metric",
        dataSource: "tenant.costPerLead",
        position: { x: 4, y: 3, w: 4, h: 2 },
      },
      {
        title: "Cost per Successful Call",
        type: "metric",
        dataSource: "tenant.costPerSuccessfulCall",
        position: { x: 8, y: 3, w: 4, h: 2 },
      },
      {
        title: "Revenue Pipeline",
        type: "chart",
        chartType: "area",
        dataSource: "tenant.revenuePipeline",
        position: { x: 4, y: 5, w: 8, h: 3 },
      },
    ],
  },
  {
    id: "template-manager",
    name: "Team Management",
    description: "Manager dashboard for team performance and deals",
    role: "manager",
    icon: "Users",
    category: "operations",
    isPopular: true,
    widgets: [
      {
        title: "Team Performance",
        type: "table",
        dataSource: "manager.teamPerformance",
        position: { x: 0, y: 0, w: 6, h: 4 },
      },
      {
        title: "Deal Velocity",
        type: "chart",
        chartType: "line",
        dataSource: "manager.dealVelocity",
        position: { x: 6, y: 0, w: 6, h: 4 },
      },
      {
        title: "Stalled Opportunities",
        type: "list",
        dataSource: "manager.stalledOpportunities",
        position: { x: 0, y: 4, w: 6, h: 4 },
      },
      {
        title: "Win Rate by Agent",
        type: "chart",
        chartType: "bar",
        dataSource: "manager.winRateByAgent",
        position: { x: 6, y: 4, w: 6, h: 4 },
      },
    ],
  },
  {
    id: "template-agent",
    name: "Agent Workspace",
    description: "Agent dashboard with assigned leads and tasks",
    role: "agent",
    icon: "User",
    category: "operations",
    isPopular: true,
    widgets: [
      {
        title: "Assigned Leads",
        type: "table",
        dataSource: "agent.assignedLeads",
        position: { x: 0, y: 0, w: 6, h: 4 },
      },
      {
        title: "My Tasks",
        type: "list",
        dataSource: "agent.tasks",
        position: { x: 6, y: 0, w: 6, h: 4 },
      },
      {
        title: "Call Outcomes",
        type: "chart",
        chartType: "pie",
        dataSource: "agent.callOutcomes",
        position: { x: 0, y: 4, w: 4, h: 3 },
      },
      {
        title: "Daily Activity",
        type: "metric",
        dataSource: "agent.dailyActivity",
        position: { x: 4, y: 4, w: 4, h: 3 },
      },
      {
        title: "Performance This Month",
        type: "metric",
        dataSource: "agent.monthlyPerformance",
        position: { x: 8, y: 4, w: 4, h: 3 },
      },
    ],
  },
];

// Mock Dashboards
const mockDashboards: Dashboard[] = [
  {
    id: "dashboard-1",
    name: "My Executive Dashboard",
    description: "Custom executive dashboard with key metrics",
    role: "tenant-admin",
    isDefault: true,
    isPublic: false,
    layout: "grid",
    widgets: mockTemplates[1].widgets.map((w, i) => ({ ...w, id: `widget-${i}` })),
    permissions: ["tenant-admin", "manager"],
    createdBy: "current-user",
    createdAt: "2026-04-01T00:00:00Z",
    lastModified: "2026-04-27T10:00:00Z",
    tags: ["executive", "performance"],
  },
];

export function useDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);
  const [templates] = useState<DashboardTemplate[]>(mockTemplates);

  // CRUD Operations
  const createDashboard = (data: Omit<Dashboard, "id" | "createdAt" | "createdBy" | "lastModified">) => {
    const newDashboard: Dashboard = {
      ...data,
      id: `dashboard-${Date.now()}`,
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setDashboards([...dashboards, newDashboard]);
    return newDashboard;
  };

  const updateDashboard = (id: string, updates: Partial<Dashboard>) => {
    setDashboards(dashboards.map(d =>
      d.id === id
        ? { ...d, ...updates, lastModified: new Date().toISOString() }
        : d
    ));
  };

  const deleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
  };

  const duplicateDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    if (dashboard) {
      const duplicate: Dashboard = {
        ...dashboard,
        id: `dashboard-${Date.now()}`,
        name: `${dashboard.name} (Copy)`,
        isDefault: false,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      setDashboards([...dashboards, duplicate]);
      return duplicate;
    }
  };

  // Widget Operations
  const addWidget = (dashboardId: string, widget: Omit<DashboardWidget, "id">) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      const newWidget: DashboardWidget = {
        ...widget,
        id: `widget-${Date.now()}`,
      };
      updateDashboard(dashboardId, {
        widgets: [...dashboard.widgets, newWidget],
      });
      return newWidget;
    }
  };

  const updateWidget = (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      updateDashboard(dashboardId, {
        widgets: dashboard.widgets.map(w => w.id === widgetId ? { ...w, ...updates } : w),
      });
    }
  };

  const removeWidget = (dashboardId: string, widgetId: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      updateDashboard(dashboardId, {
        widgets: dashboard.widgets.filter(w => w.id !== widgetId),
      });
    }
  };

  const updateWidgetPosition = (dashboardId: string, widgetId: string, position: DashboardWidget["position"]) => {
    updateWidget(dashboardId, widgetId, { position });
  };

  // Template Operations
  const createFromTemplate = (templateId: string, customName?: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const dashboard = createDashboard({
        name: customName || template.name,
        description: template.description,
        role: template.role,
        isDefault: false,
        isPublic: false,
        layout: "grid",
        widgets: template.widgets.map((w, i) => ({ ...w, id: `widget-${Date.now()}-${i}` })),
        permissions: [template.role],
        tags: [template.category],
      });
      return dashboard;
    }
  };

  // Filters
  const getDashboardsByRole = (role: DashboardRole) => {
    return dashboards.filter(d => d.role === role || d.permissions.includes(role));
  };

  const getDefaultDashboard = (role: DashboardRole) => {
    return dashboards.find(d => d.isDefault && (d.role === role || d.permissions.includes(role)));
  };

  const getTemplatesByRole = (role: DashboardRole) => {
    return templates.filter(t => t.role === role);
  };

  const getPopularTemplates = () => {
    return templates.filter(t => t.isPopular);
  };

  // Permissions
  const canAccessDashboard = (dashboardId: string, userRole: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) return false;
    return dashboard.isPublic || dashboard.permissions.includes(userRole) || dashboard.role === userRole;
  };

  const shareDashboard = (dashboardId: string, userIds: string[]) => {
    updateDashboard(dashboardId, {
      sharedWith: userIds,
      isPublic: false,
    });
  };

  const makePublic = (dashboardId: string, isPublic: boolean) => {
    updateDashboard(dashboardId, { isPublic });
  };

  return {
    // State
    dashboards,
    templates,

    // CRUD
    createDashboard,
    updateDashboard,
    deleteDashboard,
    duplicateDashboard,

    // Widgets
    addWidget,
    updateWidget,
    removeWidget,
    updateWidgetPosition,

    // Templates
    createFromTemplate,
    getTemplatesByRole,
    getPopularTemplates,

    // Filters
    getDashboardsByRole,
    getDefaultDashboard,

    // Permissions
    canAccessDashboard,
    shareDashboard,
    makePublic,
  };
}
