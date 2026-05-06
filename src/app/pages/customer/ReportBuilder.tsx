import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useReports, type Report, type ReportColumn, type ReportFilter, type ReportVisualization } from "../../hooks/useReports";
import {
  ArrowLeft,
  Save,
  Play,
  Plus,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Filter as FilterIcon,
  Calendar,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Table,
  TrendingUp,
  Settings,
  ChevronDown,
} from "lucide-react";

export function ReportBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("id");
  const templateId = searchParams.get("template");

  const { reports, templates, createReport, updateReport } = useReports();

  // Report State
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedModule, setSelectedModule] = useState("deals");
  const [selectedType, setSelectedType] = useState<string>("custom");
  const [visualization, setVisualization] = useState<ReportVisualization>("table");
  const [columns, setColumns] = useState<ReportColumn[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [dateRangePreset, setDateRangePreset] = useState<string>("last30days");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [groupBy, setGroupBy] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // UI State
  const [activeTab, setActiveTab] = useState<"columns" | "filters" | "visualization" | "settings">("columns");
  const [showPreview, setShowPreview] = useState(false);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);

  // Available columns based on module
  const availableColumns: Record<string, ReportColumn[]> = {
    deals: [
      { id: "deal-name", name: "Deal Name", field: "name", type: "string", visible: false, order: 0 },
      { id: "deal-value", name: "Deal Value", field: "value", type: "currency", aggregation: "sum", visible: false, order: 1 },
      { id: "deal-stage", name: "Stage", field: "stage", type: "string", visible: false, order: 2 },
      { id: "deal-probability", name: "Probability", field: "probability", type: "percentage", visible: false, order: 3 },
      { id: "deal-owner", name: "Owner", field: "owner", type: "string", visible: false, order: 4 },
      { id: "deal-closedate", name: "Close Date", field: "closeDate", type: "date", visible: false, order: 5 },
      { id: "deal-created", name: "Created Date", field: "createdAt", type: "date", visible: false, order: 6 },
    ],
    leads: [
      { id: "lead-name", name: "Lead Name", field: "name", type: "string", visible: false, order: 0 },
      { id: "lead-email", name: "Email", field: "email", type: "string", visible: false, order: 1 },
      { id: "lead-phone", name: "Phone", field: "phone", type: "string", visible: false, order: 2 },
      { id: "lead-score", name: "Lead Score", field: "score", type: "number", aggregation: "average", visible: false, order: 3 },
      { id: "lead-source", name: "Source", field: "source", type: "string", visible: false, order: 4 },
      { id: "lead-status", name: "Status", field: "status", type: "string", visible: false, order: 5 },
    ],
    campaigns: [
      { id: "campaign-name", name: "Campaign Name", field: "name", type: "string", visible: false, order: 0 },
      { id: "campaign-sent", name: "Sent", field: "sent", type: "number", aggregation: "sum", visible: false, order: 1 },
      { id: "campaign-delivered", name: "Delivered", field: "delivered", type: "number", aggregation: "sum", visible: false, order: 2 },
      { id: "campaign-opened", name: "Opened", field: "opened", type: "number", aggregation: "sum", visible: false, order: 3 },
      { id: "campaign-clicked", name: "Clicked", field: "clicked", type: "number", aggregation: "sum", visible: false, order: 4 },
      { id: "campaign-roi", name: "ROI", field: "roi", type: "percentage", visible: false, order: 5 },
    ],
  };

  // Load existing report or template
  useEffect(() => {
    if (reportId) {
      const report = reports.find(r => r.id === reportId);
      if (report) {
        setReportName(report.name);
        setReportDescription(report.description);
        setSelectedModule(report.module);
        setSelectedType(report.type);
        setVisualization(report.visualization);
        setColumns(report.columns);
        setFilters(report.filters);
        setDateRangePreset(report.dateRange.preset);
        setIsPublic(report.isPublic);
        setTags(report.tags);
        if (report.groupBy && report.groupBy.length > 0) {
          setGroupBy(report.groupBy[0].field);
        }
        if (report.sortBy && report.sortBy.length > 0) {
          setSortBy(report.sortBy[0].field);
          setSortDirection(report.sortBy[0].direction);
        }
      }
    } else if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setReportName(`New ${template.name}`);
        setReportDescription(template.description);
        setSelectedModule(template.module);
        setSelectedType(template.type);
        setVisualization(template.defaultVisualization);
        setColumns(template.availableColumns.map(col => ({ ...col, visible: true })));
        setFilters(template.defaultFilters);
      }
    }
  }, [reportId, templateId, reports, templates]);

  const addColumn = (columnId: string) => {
    const moduleColumns = availableColumns[selectedModule] || [];
    const column = moduleColumns.find(c => c.id === columnId);
    if (column && !columns.find(c => c.id === columnId)) {
      setColumns([...columns, { ...column, visible: true, order: columns.length }]);
    }
  };

  const removeColumn = (columnId: string) => {
    setColumns(columns.filter(c => c.id !== columnId).map((c, i) => ({ ...c, order: i })));
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(columns.map(c => c.id === columnId ? { ...c, visible: !c.visible } : c));
  };

  const moveColumn = (columnId: string, direction: "up" | "down") => {
    const index = columns.findIndex(c => c.id === columnId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === columns.length - 1) return;

    const newColumns = [...columns];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newColumns[index], newColumns[newIndex]] = [newColumns[newIndex], newColumns[index]];
    newColumns.forEach((col, i) => col.order = i);
    setColumns(newColumns);
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: `filter-${Date.now()}`,
      field: columns[0]?.field || "name",
      operator: "equals",
      value: "",
    };
    setFilters([...filters, newFilter]);
    setShowFilterBuilder(true);
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setFilters(filters.map(f => f.id === filterId ? { ...f, ...updates } : f));
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!reportName.trim()) {
      alert("Please enter a report name");
      return;
    }

    const reportData = {
      name: reportName,
      description: reportDescription,
      type: selectedType as any,
      module: selectedModule,
      visualization,
      columns,
      filters,
      dateRange: {
        preset: dateRangePreset as any,
        startDate: customDateStart || undefined,
        endDate: customDateEnd || undefined,
      },
      groupBy: groupBy ? [{ field: groupBy, order: sortDirection }] : undefined,
      sortBy: sortBy ? [{ field: sortBy, direction: sortDirection }] : undefined,
      isPublic,
      isTemplate: false,
      tags,
    };

    if (reportId) {
      updateReport(reportId, reportData);
      alert("Report updated successfully!");
    } else {
      const newReport = createReport(reportData);
      alert("Report created successfully!");
      navigate(`/tenant/reports/view/${newReport.id}`);
    }
  };

  const handleRunReport = () => {
    if (!reportName.trim()) {
      alert("Please save the report first");
      return;
    }
    // In a real app, this would run the report with current settings
    setShowPreview(true);
  };

  const getVisualizationIcon = (type: ReportVisualization) => {
    switch (type) {
      case "bar":
        return <BarChart3 className="w-5 h-5" />;
      case "line":
        return <LineChartIcon className="w-5 h-5" />;
      case "pie":
        return <PieChart className="w-5 h-5" />;
      case "table":
        return <Table className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const moduleColumns = availableColumns[selectedModule] || [];
  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/reports/library")}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {reportId ? "Edit Report" : "Create Report"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Build custom reports with advanced filtering and visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunReport}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Run Report
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Report
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Name *
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Describe what this report shows"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Module Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setColumns([]);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="deals">Deals</option>
                <option value="leads">Leads</option>
                <option value="campaigns">Campaigns</option>
                <option value="ai-calling">AI Calling</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRangePreset}
                onChange={(e) => setDateRangePreset(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisQuarter">This Quarter</option>
                <option value="lastQuarter">Last Quarter</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>

              {dateRangePreset === "custom" && (
                <div className="mt-3 space-y-2">
                  <input
                    type="date"
                    value={customDateStart}
                    onChange={(e) => setCustomDateStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="date"
                    value={customDateEnd}
                    onChange={(e) => setCustomDateEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
            </div>

            {/* Visualization Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visualization
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["table", "bar", "line", "pie"] as ReportVisualization[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setVisualization(type)}
                    className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                      visualization === type
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {getVisualizationIcon(type)}
                    <span className="text-xs font-medium capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grouping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group By (Optional)
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Grouping</option>
                {columns.map(col => (
                  <option key={col.id} value={col.field}>{col.name}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Sorting</option>
                  {columns.map(col => (
                    <option key={col.id} value={col.field}>{col.name}</option>
                  ))}
                </select>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
                  disabled={!sortBy}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Make this report public</span>
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Columns and Filters */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("columns")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === "columns"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Columns ({visibleColumns.length})
            </button>
            <button
              onClick={() => setActiveTab("filters")}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === "filters"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Filters ({filters.length})
            </button>
          </div>

          {/* Columns Tab */}
          {activeTab === "columns" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Selected Columns</h3>
                <button
                  onClick={() => setShowColumnPicker(!showColumnPicker)}
                  className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Column
                </button>
              </div>

              {showColumnPicker && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Available Columns</p>
                  <div className="grid grid-cols-2 gap-2">
                    {moduleColumns.filter(c => !columns.find(col => col.id === c.id)).map(col => (
                      <button
                        key={col.id}
                        onClick={() => {
                          addColumn(col.id);
                          setShowColumnPicker(false);
                        }}
                        className="px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {col.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {columns.map((column, index) => (
                  <div
                    key={column.id}
                    className="bg-white border rounded-lg p-4 flex items-center gap-3"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{column.name}</p>
                      <p className="text-xs text-gray-500">
                        {column.type} {column.aggregation && `• ${column.aggregation}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveColumn(column.id, "up")}
                        disabled={index === 0}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveColumn(column.id, "down")}
                        disabled={index === columns.length - 1}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => toggleColumnVisibility(column.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        {column.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => removeColumn(column.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {columns.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Table className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No columns selected</p>
                    <p className="text-sm text-gray-500">Add columns to include in your report</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filters Tab */}
          {activeTab === "filters" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Report Filters</h3>
                <button
                  onClick={addFilter}
                  className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Filter
                </button>
              </div>

              <div className="space-y-3">
                {filters.map((filter) => (
                  <div key={filter.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <select
                          value={filter.field}
                          onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          {columns.map(col => (
                            <option key={col.id} value={col.field}>{col.name}</option>
                          ))}
                        </select>
                        <select
                          value={filter.operator}
                          onChange={(e) => updateFilter(filter.id, { operator: e.target.value as any })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="equals">Equals</option>
                          <option value="notEquals">Not Equals</option>
                          <option value="contains">Contains</option>
                          <option value="notContains">Not Contains</option>
                          <option value="greaterThan">Greater Than</option>
                          <option value="lessThan">Less Than</option>
                          <option value="between">Between</option>
                        </select>
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                          placeholder="Value"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filters.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FilterIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No filters applied</p>
                    <p className="text-sm text-gray-500">Add filters to refine your report data</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Report preview will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  This would show your {visualization} chart with {visibleColumns.length} columns
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
