import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Save, Play, Download, Settings2, Calendar, Filter,
  Plus, X, Check, ChevronDown, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, TrendingUp, Table, ListFilter
} from "lucide-react";

const reportTypes = [
  { id: "ai-calling", label: "AI Calling Performance", metrics: ["Call Volume", "Success Rate", "Avg Duration", "Conversion Rate", "Call Cost", "Agent Performance"] },
  { id: "crm", label: "CRM Effectiveness", metrics: ["Lead Conversion", "Pipeline Velocity", "Deal Win Rate", "Customer Lifetime Value", "Lead Response Time", "Source Attribution"] },
  { id: "campaigns", label: "Campaign Efficiency", metrics: ["Campaign ROI", "Engagement Rate", "Click-through Rate", "Conversion Rate", "Cost per Lead", "Channel Performance"] },
  { id: "deals", label: "Deal Progression", metrics: ["Deal Velocity", "Win Rate", "Pipeline Value", "Forecast Accuracy", "Average Deal Size", "Sales Cycle Length"] },
  { id: "performance", label: "User & Agent Performance", metrics: ["Tasks Completed", "Response Time", "Customer Satisfaction", "Productivity Score", "Activity Volume", "Goal Achievement"] },
  { id: "cost", label: "Cost Transparency", metrics: ["Total Spend", "Cost per Channel", "ROI by Campaign", "Budget Utilization", "Cost per Conversion", "Spend Trend"] }
];

const visualizationTypes = [
  { id: "bar", label: "Bar Chart", icon: BarChart3 },
  { id: "line", label: "Line Chart", icon: LineChartIcon },
  { id: "pie", label: "Pie Chart", icon: PieChartIcon },
  { id: "table", label: "Data Table", icon: Table },
  { id: "trend", label: "Trend Analysis", icon: TrendingUp }
];

const timeRanges = [
  { id: "last-7-days", label: "Last 7 Days" },
  { id: "last-30-days", label: "Last 30 Days" },
  { id: "last-3-months", label: "Last 3 Months" },
  { id: "last-6-months", label: "Last 6 Months" },
  { id: "this-year", label: "This Year" },
  { id: "custom", label: "Custom Range" }
];

const groupByOptions = [
  { id: "day", label: "By Day" },
  { id: "week", label: "By Week" },
  { id: "month", label: "By Month" },
  { id: "quarter", label: "By Quarter" },
  { id: "agent", label: "By Agent" },
  { id: "campaign", label: "By Campaign" },
  { id: "channel", label: "By Channel" },
  { id: "source", label: "By Source" }
];

const filterOptions = [
  { id: "agent", label: "Agent", values: ["All Agents", "Rajesh S.", "Priya M.", "Amit K.", "Sneha R."] },
  { id: "campaign", label: "Campaign", values: ["All Campaigns", "Q1 Outreach", "Product Launch", "Follow-up Series"] },
  { id: "channel", label: "Channel", values: ["All Channels", "AI Calls", "WhatsApp", "Email", "SMS"] },
  { id: "status", label: "Status", values: ["All Status", "Active", "Completed", "Scheduled", "Paused"] }
];

const exportFormats = [
  { id: "pdf", label: "PDF Document" },
  { id: "excel", label: "Excel Spreadsheet" },
  { id: "csv", label: "CSV File" },
  { id: "json", label: "JSON Data" }
];

export function CustomReportBuilder() {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] = useState("bar");
  const [selectedTimeRange, setSelectedTimeRange] = useState("last-30-days");
  const [selectedGroupBy, setSelectedGroupBy] = useState("day");
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string}>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const currentReportType = reportTypes.find(t => t.id === selectedType);

  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters({ ...selectedFilters, [filterId]: value });
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Insights" },
          { label: "Reports & Analytics", path: "/tenant/reports-analytics" },
          { label: "Custom Report Builder" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/tenant/reports-analytics")}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-[#6B7280]" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-[#0F1B2D]">Custom Report Builder</h1>
                <p className="text-sm text-[#6B7280] mt-1">Create customized reports with your preferred metrics and parameters</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Save size={16} />
                Save Template
              </button>
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Play size={16} />
                Preview Report
              </button>
              <button className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2">
                <Download size={16} />
                Generate Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="col-span-2 space-y-6">
              {/* Report Name */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name..."
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>

              {/* Report Type Selection */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h3 className="text-base font-semibold text-[#0F1B2D] mb-4">1. Select Report Category</h3>
                <div className="grid grid-cols-2 gap-3">
                  {reportTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        setSelectedMetrics([]);
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedType === type.id
                          ? "border-[#1565C0] bg-[#E3F2FD]"
                          : "border-[#E5E7EB] hover:border-[#1565C0] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#0F1B2D]">{type.label}</span>
                        {selectedType === type.id && (
                          <Check size={16} className="text-[#1565C0]" />
                        )}
                      </div>
                      <span className="text-xs text-[#6B7280]">{type.metrics.length} metrics available</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics Selection */}
              {selectedType && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-[#0F1B2D]">2. Choose Metrics</h3>
                    <span className="text-sm text-[#6B7280]">{selectedMetrics.length} selected</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {currentReportType?.metrics.map((metric) => (
                      <button
                        key={metric}
                        onClick={() => toggleMetric(metric)}
                        className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2 ${
                          selectedMetrics.includes(metric)
                            ? "border-[#1565C0] bg-[#E3F2FD]"
                            : "border-[#E5E7EB] hover:border-[#1565C0] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedMetrics.includes(metric)
                            ? "border-[#1565C0] bg-[#1565C0]"
                            : "border-[#D1D5DB]"
                        }`}>
                          {selectedMetrics.includes(metric) && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-[#0F1B2D]">{metric}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visualization Type */}
              {selectedMetrics.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <h3 className="text-base font-semibold text-[#0F1B2D] mb-4">3. Select Visualization</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {visualizationTypes.map((viz) => {
                      const IconComponent = viz.icon;
                      return (
                        <button
                          key={viz.id}
                          onClick={() => setSelectedVisualization(viz.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedVisualization === viz.id
                              ? "border-[#1565C0] bg-[#E3F2FD]"
                              : "border-[#E5E7EB] hover:border-[#1565C0] hover:bg-[#F9FAFB]"
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                            selectedVisualization === viz.id ? "text-[#1565C0]" : "text-[#6B7280]"
                          }`} />
                          <span className="text-xs font-medium text-[#0F1B2D] block text-center">
                            {viz.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Time Range & Grouping */}
              {selectedMetrics.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <h3 className="text-base font-semibold text-[#0F1B2D] mb-4">4. Configure Time Range & Grouping</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                        Time Range
                      </label>
                      <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                      >
                        {timeRanges.map((range) => (
                          <option key={range.id} value={range.id}>{range.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                        Group By
                      </label>
                      <select
                        value={selectedGroupBy}
                        onChange={(e) => setSelectedGroupBy(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                      >
                        {groupByOptions.map((option) => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedTimeRange === "custom" && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Filters */}
              {selectedMetrics.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full p-6 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
                  >
                    <h3 className="text-base font-semibold text-[#0F1B2D] flex items-center gap-2">
                      <ListFilter size={20} />
                      Advanced Filters (Optional)
                    </h3>
                    <ChevronDown
                      size={20}
                      className={`text-[#6B7280] transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    />
                  </button>
                  
                  {showAdvanced && (
                    <div className="px-6 pb-6 border-t border-[#E5E7EB] pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        {filterOptions.map((filter) => (
                          <div key={filter.id}>
                            <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                              {filter.label}
                            </label>
                            <select
                              value={selectedFilters[filter.id] || filter.values[0]}
                              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                            >
                              {filter.values.map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule & Export */}
              {selectedMetrics.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <h3 className="text-base font-semibold text-[#0F1B2D] mb-4">5. Schedule & Export Options</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scheduleEnabled}
                        onChange={(e) => setScheduleEnabled(e.target.checked)}
                        className="w-4 h-4 text-[#1565C0] border-[#D1D5DB] rounded focus:ring-[#1565C0]"
                      />
                      <span className="text-sm font-medium text-[#0F1B2D]">
                        Schedule automatic report generation
                      </span>
                    </label>

                    {scheduleEnabled && (
                      <div className="ml-7 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                            Frequency
                          </label>
                          <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                            Email Recipients
                          </label>
                          <input
                            type="email"
                            placeholder="Enter email addresses..."
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                        Export Format
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {exportFormats.map((format) => (
                          <label key={format.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="exportFormat"
                              value={format.id}
                              defaultChecked={format.id === "pdf"}
                              className="w-4 h-4 text-[#1565C0] border-[#D1D5DB] focus:ring-[#1565C0]"
                            />
                            <span className="text-sm text-[#0F1B2D]">{format.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="col-span-1">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sticky top-6">
                <h3 className="text-base font-semibold text-[#0F1B2D] mb-4">Report Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Report Name
                    </label>
                    <p className="text-sm text-[#0F1B2D] mt-1">
                      {reportName || "Untitled Report"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Category
                    </label>
                    <p className="text-sm text-[#0F1B2D] mt-1">
                      {currentReportType?.label || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Metrics ({selectedMetrics.length})
                    </label>
                    <div className="mt-2 space-y-1">
                      {selectedMetrics.length === 0 ? (
                        <p className="text-sm text-[#9CA3AF]">No metrics selected</p>
                      ) : (
                        selectedMetrics.map((metric) => (
                          <div key={metric} className="flex items-center justify-between text-sm">
                            <span className="text-[#0F1B2D]">{metric}</span>
                            <button
                              onClick={() => toggleMetric(metric)}
                              className="text-[#6B7280] hover:text-[#DC2626] transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Visualization
                    </label>
                    <p className="text-sm text-[#0F1B2D] mt-1 capitalize">
                      {visualizationTypes.find(v => v.id === selectedVisualization)?.label || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Time Range
                    </label>
                    <p className="text-sm text-[#0F1B2D] mt-1">
                      {timeRanges.find(t => t.id === selectedTimeRange)?.label}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Grouping
                    </label>
                    <p className="text-sm text-[#0F1B2D] mt-1">
                      {groupByOptions.find(g => g.id === selectedGroupBy)?.label}
                    </p>
                  </div>

                  {Object.keys(selectedFilters).length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Active Filters
                      </label>
                      <div className="mt-2 space-y-1">
                        {Object.entries(selectedFilters).map(([key, value]) => (
                          <p key={key} className="text-sm text-[#0F1B2D]">
                            {filterOptions.find(f => f.id === key)?.label}: {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {scheduleEnabled && (
                    <div>
                      <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Schedule
                      </label>
                      <p className="text-sm text-[#0F1B2D] mt-1">Enabled</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <div className="bg-[#E3F2FD] rounded-lg p-4">
                    <p className="text-xs font-medium text-[#1565C0] mb-1">Ready to generate?</p>
                    <p className="text-xs text-[#6B7280]">
                      {selectedMetrics.length > 0 
                        ? "Your report configuration is complete. Click 'Generate Report' to create your custom report."
                        : "Please select a category and at least one metric to continue."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
