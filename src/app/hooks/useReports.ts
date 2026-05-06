import { useState } from "react";

// Report Types
export type ReportType =
  | "deals"
  | "leads"
  | "campaigns"
  | "ai-calling"
  | "whatsapp"
  | "email"
  | "sms"
  | "revenue"
  | "pipeline"
  | "activity"
  | "performance"
  | "custom";

export type ReportVisualization =
  | "table"
  | "bar"
  | "line"
  | "pie"
  | "funnel"
  | "heatmap"
  | "scatter"
  | "area"
  | "gauge";

export type AggregationType = "sum" | "average" | "count" | "min" | "max" | "median";

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "custom";

// Report Interfaces
export interface ReportColumn {
  id: string;
  name: string;
  field: string;
  type: "string" | "number" | "date" | "currency" | "percentage" | "duration";
  aggregation?: AggregationType;
  visible: boolean;
  order: number;
  width?: number;
  format?: string;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: "equals" | "notEquals" | "contains" | "notContains" | "greaterThan" | "lessThan" | "between" | "in" | "notIn";
  value: any;
  logicalOperator?: "AND" | "OR";
}

export interface ReportGrouping {
  field: string;
  order: "asc" | "desc";
}

export interface ReportSorting {
  field: string;
  direction: "asc" | "desc";
}

export interface ReportSchedule {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  format: "pdf" | "excel" | "csv";
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  module: string;
  visualization: ReportVisualization;
  columns: ReportColumn[];
  filters: ReportFilter[];
  groupBy?: ReportGrouping[];
  sortBy?: ReportSorting[];
  dateRange: {
    preset: DateRangePreset;
    startDate?: string;
    endDate?: string;
  };
  schedule?: ReportSchedule;
  isPublic: boolean;
  isTemplate: boolean;
  createdBy: string;
  createdAt: string;
  lastRunAt?: string;
  tags: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  module: string;
  icon: string;
  category: string;
  previewImage?: string;
  defaultVisualization: ReportVisualization;
  availableColumns: ReportColumn[];
  defaultFilters: ReportFilter[];
  isPopular: boolean;
}

export interface DashboardWidget {
  id: string;
  reportId: string;
  title: string;
  type: ReportVisualization;
  position: { x: number; y: number; w: number; h: number };
  refreshInterval?: number;
  lastRefreshed?: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  tags: string[];
}

export interface ReportExport {
  id: string;
  reportId: string;
  format: "pdf" | "excel" | "csv" | "json";
  status: "pending" | "processing" | "completed" | "failed";
  downloadUrl?: string;
  createdAt: string;
  expiresAt: string;
}

// Mock Data
const mockReportTemplates: ReportTemplate[] = [
  {
    id: "template-1",
    name: "Sales Pipeline Report",
    description: "Track deals across pipeline stages with win rates and revenue forecasting",
    type: "pipeline",
    module: "deals",
    icon: "TrendingUp",
    category: "Sales",
    defaultVisualization: "funnel",
    availableColumns: [
      { id: "col-1", name: "Stage", field: "stage", type: "string", visible: true, order: 0 },
      { id: "col-2", name: "Deal Count", field: "count", type: "number", aggregation: "count", visible: true, order: 1 },
      { id: "col-3", name: "Total Value", field: "value", type: "currency", aggregation: "sum", visible: true, order: 2 },
      { id: "col-4", name: "Win Rate", field: "winRate", type: "percentage", visible: true, order: 3 },
    ],
    defaultFilters: [
      { id: "filter-1", field: "status", operator: "equals", value: "open" },
    ],
    isPopular: true,
  },
  {
    id: "template-2",
    name: "Lead Conversion Funnel",
    description: "Analyze lead conversion rates across different stages and sources",
    type: "leads",
    module: "leads",
    icon: "Filter",
    category: "Marketing",
    defaultVisualization: "funnel",
    availableColumns: [
      { id: "col-1", name: "Stage", field: "stage", type: "string", visible: true, order: 0 },
      { id: "col-2", name: "Lead Count", field: "count", type: "number", aggregation: "count", visible: true, order: 1 },
      { id: "col-3", name: "Conversion Rate", field: "conversionRate", type: "percentage", visible: true, order: 2 },
    ],
    defaultFilters: [],
    isPopular: true,
  },
  {
    id: "template-3",
    name: "Campaign Performance Report",
    description: "Measure campaign effectiveness with ROI, reach, and engagement metrics",
    type: "campaigns",
    module: "campaigns",
    icon: "Target",
    category: "Marketing",
    defaultVisualization: "bar",
    availableColumns: [
      { id: "col-1", name: "Campaign", field: "name", type: "string", visible: true, order: 0 },
      { id: "col-2", name: "Sent", field: "sent", type: "number", aggregation: "sum", visible: true, order: 1 },
      { id: "col-3", name: "Delivered", field: "delivered", type: "number", aggregation: "sum", visible: true, order: 2 },
      { id: "col-4", name: "Opened", field: "opened", type: "number", aggregation: "sum", visible: true, order: 3 },
      { id: "col-5", name: "Clicked", field: "clicked", type: "number", aggregation: "sum", visible: true, order: 4 },
      { id: "col-6", name: "ROI", field: "roi", type: "percentage", visible: true, order: 5 },
    ],
    defaultFilters: [],
    isPopular: true,
  },
  {
    id: "template-4",
    name: "AI Calling Analytics",
    description: "Track AI call performance, success rates, and conversation insights",
    type: "ai-calling",
    module: "ai-calling",
    icon: "Phone",
    category: "AI Tools",
    defaultVisualization: "line",
    availableColumns: [
      { id: "col-1", name: "Date", field: "date", type: "date", visible: true, order: 0 },
      { id: "col-2", name: "Total Calls", field: "totalCalls", type: "number", aggregation: "sum", visible: true, order: 1 },
      { id: "col-3", name: "Successful", field: "successful", type: "number", aggregation: "sum", visible: true, order: 2 },
      { id: "col-4", name: "Avg Duration", field: "avgDuration", type: "duration", aggregation: "average", visible: true, order: 3 },
      { id: "col-5", name: "Success Rate", field: "successRate", type: "percentage", visible: true, order: 4 },
    ],
    defaultFilters: [],
    isPopular: true,
  },
  {
    id: "template-5",
    name: "Revenue Forecast Report",
    description: "Project revenue based on pipeline stages and historical win rates",
    type: "revenue",
    module: "deals",
    icon: "DollarSign",
    category: "Sales",
    defaultVisualization: "line",
    availableColumns: [
      { id: "col-1", name: "Month", field: "month", type: "date", visible: true, order: 0 },
      { id: "col-2", name: "Closed Won", field: "closedWon", type: "currency", aggregation: "sum", visible: true, order: 1 },
      { id: "col-3", name: "Committed", field: "committed", type: "currency", aggregation: "sum", visible: true, order: 2 },
      { id: "col-4", name: "Best Case", field: "bestCase", type: "currency", aggregation: "sum", visible: true, order: 3 },
      { id: "col-5", name: "Pipeline", field: "pipeline", type: "currency", aggregation: "sum", visible: true, order: 4 },
    ],
    defaultFilters: [],
    isPopular: true,
  },
  {
    id: "template-6",
    name: "Team Performance Report",
    description: "Evaluate team member performance across key metrics",
    type: "performance",
    module: "team",
    icon: "Users",
    category: "Management",
    defaultVisualization: "table",
    availableColumns: [
      { id: "col-1", name: "Team Member", field: "name", type: "string", visible: true, order: 0 },
      { id: "col-2", name: "Deals Closed", field: "dealsCloses", type: "number", aggregation: "sum", visible: true, order: 1 },
      { id: "col-3", name: "Revenue", field: "revenue", type: "currency", aggregation: "sum", visible: true, order: 2 },
      { id: "col-4", name: "Activities", field: "activities", type: "number", aggregation: "sum", visible: true, order: 3 },
      { id: "col-5", name: "Win Rate", field: "winRate", type: "percentage", visible: true, order: 4 },
    ],
    defaultFilters: [],
    isPopular: true,
  },
  {
    id: "template-7",
    name: "Email Campaign Report",
    description: "Track email campaign metrics including deliverability and engagement",
    type: "email",
    module: "email",
    icon: "Mail",
    category: "Marketing",
    defaultVisualization: "bar",
    availableColumns: [
      { id: "col-1", name: "Campaign", field: "name", type: "string", visible: true, order: 0 },
      { id: "col-2", name: "Sent", field: "sent", type: "number", aggregation: "sum", visible: true, order: 1 },
      { id: "col-3", name: "Open Rate", field: "openRate", type: "percentage", visible: true, order: 2 },
      { id: "col-4", name: "Click Rate", field: "clickRate", type: "percentage", visible: true, order: 3 },
      { id: "col-5", name: "Unsubscribe Rate", field: "unsubscribeRate", type: "percentage", visible: true, order: 4 },
    ],
    defaultFilters: [],
    isPopular: false,
  },
  {
    id: "template-8",
    name: "WhatsApp Engagement Report",
    description: "Monitor WhatsApp message delivery and response rates",
    type: "whatsapp",
    module: "whatsapp",
    icon: "MessageSquare",
    category: "Messaging",
    defaultVisualization: "area",
    availableColumns: [
      { id: "col-1", name: "Date", field: "date", type: "date", visible: true, order: 0 },
      { id: "col-2", name: "Messages Sent", field: "sent", type: "number", aggregation: "sum", visible: true, order: 1 },
      { id: "col-3", name: "Delivered", field: "delivered", type: "number", aggregation: "sum", visible: true, order: 2 },
      { id: "col-4", name: "Read", field: "read", type: "number", aggregation: "sum", visible: true, order: 3 },
      { id: "col-5", name: "Replied", field: "replied", type: "number", aggregation: "sum", visible: true, order: 4 },
    ],
    defaultFilters: [],
    isPopular: false,
  },
];

const mockReports: Report[] = [
  {
    id: "report-1",
    name: "Q2 Pipeline Analysis",
    description: "Quarterly pipeline performance across all stages",
    type: "pipeline",
    module: "deals",
    visualization: "funnel",
    columns: mockReportTemplates[0].availableColumns,
    filters: [
      { id: "filter-1", field: "quarter", operator: "equals", value: "Q2" },
    ],
    dateRange: { preset: "thisQuarter" },
    isPublic: false,
    isTemplate: false,
    createdBy: "current-user",
    createdAt: "2026-04-01T00:00:00Z",
    lastRunAt: "2026-04-27T10:30:00Z",
    tags: ["sales", "pipeline", "quarterly"],
  },
  {
    id: "report-2",
    name: "Monthly Lead Sources",
    description: "Lead generation by source channel",
    type: "leads",
    module: "leads",
    visualization: "pie",
    columns: [
      { id: "col-1", name: "Source", field: "source", type: "string", visible: true, order: 0 },
      { id: "col-2", name: "Lead Count", field: "count", type: "number", aggregation: "count", visible: true, order: 1 },
    ],
    filters: [],
    dateRange: { preset: "thisMonth" },
    isPublic: true,
    isTemplate: false,
    createdBy: "current-user",
    createdAt: "2026-04-10T00:00:00Z",
    lastRunAt: "2026-04-27T09:00:00Z",
    tags: ["leads", "marketing"],
  },
];

const mockDashboards: Dashboard[] = [
  {
    id: "dashboard-1",
    name: "Sales Executive Dashboard",
    description: "Real-time view of sales performance and pipeline health",
    widgets: [
      {
        id: "widget-1",
        reportId: "report-1",
        title: "Pipeline by Stage",
        type: "funnel",
        position: { x: 0, y: 0, w: 6, h: 4 },
        refreshInterval: 300000,
      },
      {
        id: "widget-2",
        reportId: "report-2",
        title: "Leads by Source",
        type: "pie",
        position: { x: 6, y: 0, w: 6, h: 4 },
        refreshInterval: 300000,
      },
    ],
    isDefault: true,
    isPublic: false,
    createdBy: "current-user",
    createdAt: "2026-04-01T00:00:00Z",
    tags: ["sales", "executive"],
  },
];

export function useReports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockReportTemplates);
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);
  const [exports, setExports] = useState<ReportExport[]>([]);

  // Report CRUD
  const createReport = (reportData: Omit<Report, "id" | "createdAt" | "createdBy">) => {
    const newReport: Report = {
      ...reportData,
      id: `report-${Date.now()}`,
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
    };
    setReports([...reports, newReport]);
    return newReport;
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(reports.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const duplicateReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      const duplicate: Report = {
        ...report,
        id: `report-${Date.now()}`,
        name: `${report.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };
      setReports([...reports, duplicate]);
      return duplicate;
    }
  };

  const runReport = (id: string) => {
    setReports(reports.map(r =>
      r.id === id ? { ...r, lastRunAt: new Date().toISOString() } : r
    ));
  };

  // Dashboard CRUD
  const createDashboard = (dashboardData: Omit<Dashboard, "id" | "createdAt" | "createdBy">) => {
    const newDashboard: Dashboard = {
      ...dashboardData,
      id: `dashboard-${Date.now()}`,
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
    };
    setDashboards([...dashboards, newDashboard]);
    return newDashboard;
  };

  const updateDashboard = (id: string, updates: Partial<Dashboard>) => {
    setDashboards(dashboards.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
  };

  const addWidgetToDashboard = (dashboardId: string, widget: Omit<DashboardWidget, "id">) => {
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

  const removeWidgetFromDashboard = (dashboardId: string, widgetId: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      updateDashboard(dashboardId, {
        widgets: dashboard.widgets.filter(w => w.id !== widgetId),
      });
    }
  };

  const updateWidgetPosition = (dashboardId: string, widgetId: string, position: DashboardWidget["position"]) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      updateDashboard(dashboardId, {
        widgets: dashboard.widgets.map(w =>
          w.id === widgetId ? { ...w, position } : w
        ),
      });
    }
  };

  // Export
  const exportReport = (reportId: string, format: "pdf" | "excel" | "csv" | "json") => {
    const newExport: ReportExport = {
      id: `export-${Date.now()}`,
      reportId,
      format,
      status: "processing",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    setExports([...exports, newExport]);

    // Simulate processing
    setTimeout(() => {
      setExports(prev => prev.map(e =>
        e.id === newExport.id
          ? { ...e, status: "completed", downloadUrl: `/downloads/${newExport.id}.${format}` }
          : e
      ));
    }, 2000);

    return newExport;
  };

  // Schedule
  const scheduleReport = (reportId: string, schedule: ReportSchedule) => {
    updateReport(reportId, { schedule });
  };

  // Filters
  const getReportsByModule = (module: string) => {
    return reports.filter(r => r.module === module);
  };

  const getReportsByType = (type: ReportType) => {
    return reports.filter(r => r.type === type);
  };

  const getPopularTemplates = () => {
    return templates.filter(t => t.isPopular);
  };

  const getTemplatesByCategory = (category: string) => {
    return templates.filter(t => t.category === category);
  };

  return {
    // State
    reports,
    templates,
    dashboards,
    exports,

    // Report Operations
    createReport,
    updateReport,
    deleteReport,
    duplicateReport,
    runReport,

    // Dashboard Operations
    createDashboard,
    updateDashboard,
    deleteDashboard,
    addWidgetToDashboard,
    removeWidgetFromDashboard,
    updateWidgetPosition,

    // Export & Schedule
    exportReport,
    scheduleReport,

    // Filters & Queries
    getReportsByModule,
    getReportsByType,
    getPopularTemplates,
    getTemplatesByCategory,
  };
}
