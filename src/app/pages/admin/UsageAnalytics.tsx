import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { 
  BarChart3, DollarSign, Users, PhoneCall, Megaphone, TrendingUp, TrendingDown,
  Settings, Download, Calendar, Filter, Building2, Bot, Database, ChevronDown,
  Check, X, Eye, EyeOff, RefreshCw, Target
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart, Line 
} from "recharts";

// Mock data generators
const generateDailyData = (days: number) => Array.from({ length: days }, (_, i) => ({
  date: `Mar ${i + 1}`,
  credits: Math.floor(15000 + Math.random() * 5000),
  agents: Math.floor(50 + Math.random() * 30),
  concurrent: Math.floor(20 + Math.random() * 15),
  campaigns: Math.floor(30 + Math.random() * 20),
  crmRecords: Math.floor(1000 + Math.random() * 500),
  companies: Math.floor(200 + Math.random() * 100),
  users: Math.floor(150 + Math.random() * 50),
}));

const pieData = [
  { name: "Everest Digital", value: 18 },
  { name: "Himalayan Tech", value: 15 },
  { name: "Pokhara InfoTech", value: 12 },
  { name: "Chitwan Biz", value: 10 },
  { name: "Others", value: 45 },
];
const COLORS = ["#1565C0", "#2E7D32", "#F57F17", "#C62828", "#6A1B9A"];

const topConsumers = [
  { rank: 1, name: "Himalayan Tech Services", id: "TNT-00042", plan: "Enterprise", credits: 42100, agents: 48, concurrent: 35, campaigns: 12, crmRecords: 15820, companies: 450, users: 25 },
  { rank: 2, name: "Everest Digital Solutions", id: "TNT-00038", plan: "Growth", credits: 7840, agents: 12, concurrent: 10, campaigns: 8, crmRecords: 3420, companies: 120, users: 15 },
  { rank: 3, name: "Pokhara InfoTech Solutions", id: "TNT-00025", plan: "Enterprise", credits: 15200, agents: 32, concurrent: 28, campaigns: 10, crmRecords: 8900, companies: 280, users: 20 },
  { rank: 4, name: "Chitwan Business Solutions", id: "TNT-00019", plan: "Growth", credits: 8900, agents: 14, concurrent: 12, campaigns: 6, crmRecords: 4200, companies: 150, users: 12 },
  { rank: 5, name: "Lumbini Digital Agency", id: "TNT-00015", plan: "Starter", credits: 3100, agents: 4, concurrent: 4, campaigns: 3, crmRecords: 1200, companies: 45, users: 5 },
];

// Available metrics configuration
const availableMetrics = {
  billable: [
    { key: "credits", label: "AI Minutes/Credits", icon: PhoneCall, color: "primary", unit: "minutes", isBillable: true },
    { key: "estimatedRevenue", label: "Estimated Revenue", icon: DollarSign, color: "success", unit: "NPR", isBillable: true },
  ],
  operationalLimits: [
    { key: "agents", label: "AI Agents Created", icon: Bot, color: "info", unit: "agents", isBillable: false },
    { key: "concurrent", label: "Concurrent Calls", icon: PhoneCall, color: "warning", unit: "calls", isBillable: false },
    { key: "campaigns", label: "Active Campaigns", icon: Megaphone, color: "purple", unit: "campaigns", isBillable: false },
  ],
  analyticsOnly: [
    { key: "crmRecords", label: "CRM Record Count", icon: Database, color: "info", unit: "records", isBillable: false },
    { key: "companies", label: "Number of Companies", icon: Building2, color: "success", unit: "companies", isBillable: false },
    { key: "users", label: "Number of Users", icon: Users, color: "primary", unit: "users", isBillable: false },
  ],
};

export function UsageAnalytics() {
  const [period, setPeriod] = useState("30d");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showMetricSelector, setShowMetricSelector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>(["Starter", "Growth", "Enterprise"]);
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");
  
  // Selected metrics for display
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "credits", "estimatedRevenue", "agents", "concurrent", "campaigns", "crmRecords"
  ]);

  // Current data based on period
  const [data] = useState(generateDailyData(30));

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(k => k !== metricKey)
        : [...prev, metricKey]
    );
  };

  const getAllMetrics = () => [
    ...availableMetrics.billable,
    ...availableMetrics.operationalLimits,
    ...availableMetrics.analyticsOnly,
  ];

  const getMetricConfig = (key: string) => getAllMetrics().find(m => m.key === key);

  // Calculate current values and trends
  const currentValues = {
    credits: 1245000,
    estimatedRevenue: 4800000,
    agents: 215,
    concurrent: 342,
    campaigns: 89,
    crmRecords: 42580,
    companies: 1850,
    users: 524,
  };

  const trends = {
    credits: { value: 12, up: true },
    estimatedRevenue: { value: 8, up: true },
    agents: { value: 5, up: true },
    concurrent: { value: 3, up: false },
    campaigns: { value: 15, up: true },
    crmRecords: { value: 18, up: true },
    companies: { value: 22, up: true },
    users: { value: 10, up: true },
  };

  const exportData = () => {
    console.log("Exporting usage data...");
    // Implementation would generate CSV/Excel export
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Usage Analytics" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mb-1">Platform Usage Analytics</h1>
            <p className="text-sm text-[#616161]">Real-time tracking of billable metrics, operational limits, and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-4 rounded-md border text-sm flex items-center gap-2 ${showFilters ? "border-[#1565C0] text-[#1565C0] bg-[#E3F2FD]" : "border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}
            >
              <Filter size={16} /> Filters
            </button>
            <button 
              onClick={() => setShowMetricSelector(!showMetricSelector)}
              className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2"
            >
              <Settings size={16} /> Customize KPIs
            </button>
            <button 
              onClick={exportData}
              className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2"
            >
              <Download size={16} /> Export
            </button>
            <button 
              className="h-10 w-10 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] flex items-center justify-center"
              title="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Metric Selector Modal */}
        {showMetricSelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowMetricSelector(false)}>
            <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                <div>
                  <h3 className="text-lg font-semibold">Customize KPIs & Metrics</h3>
                  <p className="text-sm text-[#616161]">Select which metrics to display on your dashboard</p>
                </div>
                <button onClick={() => setShowMetricSelector(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Billable Metrics */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={18} className="text-[#2E7D32]" />
                    <h4 className="font-semibold text-[#212121]">Billable Metrics</h4>
                    <span className="px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">REVENUE DRIVER</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {availableMetrics.billable.map(metric => (
                      <label 
                        key={metric.key}
                        className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedMetrics.includes(metric.key)
                            ? "bg-[#E3F2FD] border-[#1565C0]"
                            : "bg-white border-[#E0E0E0] hover:border-[#BDBDBD]"
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedMetrics.includes(metric.key)}
                          onChange={() => toggleMetric(metric.key)}
                          className="rounded border-[#E0E0E0]"
                        />
                        <metric.icon size={18} className="text-[#1565C0]" />
                        <span className="text-sm font-medium flex-1">{metric.label}</span>
                        {selectedMetrics.includes(metric.key) && <Check size={16} className="text-[#1565C0]" />}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Operational Limits */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={18} className="text-[#F57F17]" />
                    <h4 className="font-semibold text-[#212121]">Operational Limits</h4>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF8E1] text-[#F57F17] text-xs font-semibold">RESOURCE TRACKING</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {availableMetrics.operationalLimits.map(metric => (
                      <label 
                        key={metric.key}
                        className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedMetrics.includes(metric.key)
                            ? "bg-[#E3F2FD] border-[#1565C0]"
                            : "bg-white border-[#E0E0E0] hover:border-[#BDBDBD]"
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedMetrics.includes(metric.key)}
                          onChange={() => toggleMetric(metric.key)}
                          className="rounded border-[#E0E0E0]"
                        />
                        <metric.icon size={18} className="text-[#F57F17]" />
                        <span className="text-sm font-medium flex-1">{metric.label}</span>
                        {selectedMetrics.includes(metric.key) && <Check size={16} className="text-[#1565C0]" />}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Analytics Only */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={18} className="text-[#1565C0]" />
                    <h4 className="font-semibold text-[#212121]">Analytics-Only (Non-Billable)</h4>
                    <span className="px-2 py-0.5 rounded-md bg-[#E3F2FD] text-[#1565C0] text-xs font-semibold">INSIGHTS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {availableMetrics.analyticsOnly.map(metric => (
                      <label 
                        key={metric.key}
                        className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedMetrics.includes(metric.key)
                            ? "bg-[#E3F2FD] border-[#1565C0]"
                            : "bg-white border-[#E0E0E0] hover:border-[#BDBDBD]"
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedMetrics.includes(metric.key)}
                          onChange={() => toggleMetric(metric.key)}
                          className="rounded border-[#E0E0E0]"
                        />
                        <metric.icon size={18} className="text-[#616161]" />
                        <span className="text-sm font-medium flex-1">{metric.label}</span>
                        {selectedMetrics.includes(metric.key) && <Check size={16} className="text-[#1565C0]" />}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-[#F5F5F5] rounded-md p-3 text-sm">
                  <div className="font-medium text-[#212121] mb-1">
                    {selectedMetrics.length} of {getAllMetrics().length} metrics selected
                  </div>
                  <div className="text-xs text-[#616161]">
                    Selected metrics will appear as KPI cards and in detailed charts below
                  </div>
                </div>
              </div>

              <div className="flex justify-between px-6 py-4 border-t">
                <button 
                  onClick={() => setSelectedMetrics(getAllMetrics().map(m => m.key))}
                  className="text-sm text-[#1565C0] hover:underline"
                >
                  Select All
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedMetrics(["credits", "estimatedRevenue"])}
                    className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm"
                  >
                    Reset to Billable Only
                  </button>
                  <button 
                    onClick={() => setShowMetricSelector(false)}
                    className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#616161] mb-2">TIME PERIOD</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Today", "7d", "30d", "90d"].map(p => (
                    <button 
                      key={p} 
                      onClick={() => { setPeriod(p); setShowCustomDate(false); }} 
                      className={`px-3 py-1.5 rounded-md text-xs font-medium ${period === p && !showCustomDate ? "bg-[#1565C0] text-white" : "border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowCustomDate(!showCustomDate)} 
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${showCustomDate ? "bg-[#1565C0] text-white" : "border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}
                  >
                    <Calendar size={14} /> Custom
                  </button>
                </div>
                {showCustomDate && (
                  <div className="mt-2">
                    <DateRangePicker 
                      startDate={customStartDate}
                      endDate={customEndDate}
                      onStartDateChange={setCustomStartDate}
                      onEndDateChange={setCustomEndDate}
                      showQuickSelects={true}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#616161] mb-2">PLANS</label>
                <div className="flex flex-wrap gap-2">
                  {["Starter", "Growth", "Enterprise"].map(plan => (
                    <label key={plan} className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedPlans.includes(plan)}
                        onChange={() => setSelectedPlans(prev => 
                          prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
                        )}
                        className="rounded border-[#E0E0E0] text-[#1565C0]"
                      />
                      <span className="text-xs">{plan}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#616161] mb-2">CHART TYPE</label>
                <select 
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  className="w-full h-9 border border-[#E0E0E0] rounded-md px-2 text-sm bg-white"
                >
                  <option value="area">Area Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSelectedPlans(["Starter", "Growth", "Enterprise"]);
                    setPeriod("30d");
                    setChartType("area");
                  }}
                  className="h-9 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5]"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards - Dynamic based on selected metrics */}
        <div className={`grid gap-4 mb-6`} style={{ gridTemplateColumns: `repeat(${Math.min(selectedMetrics.length, 6)}, minmax(0, 1fr))` }}>
          {selectedMetrics.map(metricKey => {
            const config = getMetricConfig(metricKey);
            if (!config) return null;
            
            const value = metricKey === "estimatedRevenue" 
              ? `NPR ${(currentValues[metricKey] / 1000000).toFixed(1)}M`
              : currentValues[metricKey].toLocaleString();
            
            return (
              <StatCard 
                key={metricKey}
                title={config.label}
                value={value}
                icon={config.icon}
                color={config.color as any}
                trend={trends[metricKey]}
                subtitle={config.isBillable ? "Billable" : undefined}
              />
            );
          })}
        </div>

        {/* Detailed Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Primary metric chart - takes full width if only one selected */}
          {selectedMetrics.slice(0, 4).map((metricKey, idx) => {
            const config = getMetricConfig(metricKey);
            if (!config) return null;

            return (
              <div key={metricKey} className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <config.icon size={18} className="text-[#1565C0]" />
                    <h4>{config.label}</h4>
                    {config.isBillable && (
                      <span className="px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">BILLABLE</span>
                    )}
                  </div>
                  <div className="text-sm text-[#616161]">Last {period}</div>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  {chartType === "area" ? (
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#616161" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#616161" }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey={metricKey} 
                        stroke="#1565C0" 
                        fill="#1565C0" 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  ) : chartType === "bar" ? (
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#616161" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#616161" }} />
                      <Tooltip />
                      <Bar dataKey={metricKey} fill="#1565C0" />
                    </BarChart>
                  ) : (
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#616161" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#616161" }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey={metricKey} 
                        stroke="#1565C0" 
                        strokeWidth={2}
                        dot={{ fill: "#1565C0", r: 3 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#EEEEEE] text-sm">
                  <span className="text-[#616161]">Current Total:</span>
                  <span className="font-semibold text-[#212121]">
                    {currentValues[metricKey].toLocaleString()} {config.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Tenant Usage Table */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h4>Detailed Tenant Usage Breakdown</h4>
            <div className="flex items-center gap-2">
              <button className="text-sm text-[#1565C0] hover:underline">View All Tenants</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] border-b">
                  <th className="text-left px-3 py-3 text-xs font-semibold text-[#616161] uppercase w-12">#</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-[#616161] uppercase">Tenant</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-[#616161] uppercase">Plan</th>
                  {selectedMetrics.includes("credits") && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-[#616161] uppercase">
                      <div className="flex items-center justify-end gap-1">
                        AI Minutes
                        <span className="px-1.5 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] text-[10px]">$</span>
                      </div>
                    </th>
                  )}
                  {selectedMetrics.includes("agents") && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-[#616161] uppercase">Agents</th>
                  )}
                  {selectedMetrics.includes("concurrent") && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-[#616161] uppercase">Concurrent</th>
                  )}
                  {selectedMetrics.includes("campaigns") && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-[#616161] uppercase">Campaigns</th>
                  )}
                  {selectedMetrics.includes("crmRecords") && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-[#616161] uppercase">CRM Records</th>
                  )}
                  {selectedMetrics.includes("companies") && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-[#616161] uppercase">Companies</th>
                  )}
                  {selectedMetrics.includes("users") && (
                    <th className="text-right px-3 py-3 text-xs font-semibold text-[#616161] uppercase">Users</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {topConsumers.map(tenant => (
                  <tr key={tenant.rank} className="border-b border-[#EEEEEE] hover:bg-[#F5F5F5]">
                    <td className="px-3 py-3 font-bold text-[#1565C0]">{tenant.rank}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-[#212121]">{tenant.name}</div>
                      <div className="text-xs text-[#616161] font-mono">{tenant.id}</div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={tenant.plan === "Enterprise" ? "Yearly" : tenant.plan === "Growth" ? "Monthly" : "Draft"} />
                    </td>
                    {selectedMetrics.includes("credits") && (
                      <td className="px-3 py-3 text-right font-semibold">{tenant.credits.toLocaleString()}</td>
                    )}
                    {selectedMetrics.includes("agents") && (
                      <td className="px-3 py-3 text-right">{tenant.agents}</td>
                    )}
                    {selectedMetrics.includes("concurrent") && (
                      <td className="px-3 py-3 text-right">{tenant.concurrent}</td>
                    )}
                    {selectedMetrics.includes("campaigns") && (
                      <td className="px-3 py-3 text-right">{tenant.campaigns}</td>
                    )}
                    {selectedMetrics.includes("crmRecords") && (
                      <td className="px-3 py-3 text-right">{tenant.crmRecords.toLocaleString()}</td>
                    )}
                    {selectedMetrics.includes("companies") && (
                      <td className="px-3 py-3 text-right">{tenant.companies}</td>
                    )}
                    {selectedMetrics.includes("users") && (
                      <td className="px-3 py-3 text-right">{tenant.users}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}