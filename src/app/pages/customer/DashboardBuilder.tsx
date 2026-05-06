import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  LayoutGrid, Plus, Save, Eye, Settings2, X, GripVertical, BarChart3,
  LineChart as LineIcon, PieChart as PieIcon, Hash, TrendingUp, Users,
  Table2, Gauge, Funnel, ArrowLeft, Trash2, Edit3, RefreshCw, Download,
  AlignLeft, Activity, Calendar, Target, DollarSign, Phone, MessageCircle,
  Zap, ChevronDown, ChevronUp, Copy, CheckCircle2, Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Widget Registry ─────────────────────────────────────────
const WIDGET_TYPES = [
  { id: "metric_card", label: "Metric Card", icon: Hash, category: "KPI", desc: "Single number with trend" },
  { id: "bar_chart", label: "Bar Chart", icon: BarChart3, category: "Chart", desc: "Compare categories" },
  { id: "line_chart", label: "Line Chart", icon: LineIcon, category: "Chart", desc: "Show trends over time" },
  { id: "pie_chart", label: "Pie Chart", icon: PieIcon, category: "Chart", desc: "Show proportions" },
  { id: "data_table", label: "Data Table", icon: Table2, category: "Table", desc: "Tabular records view" },
  { id: "funnel", label: "Funnel", icon: Funnel, category: "Chart", desc: "Conversion funnel" },
  { id: "gauge", label: "Gauge / KPI", icon: Gauge, category: "KPI", desc: "Target vs actual gauge" },
  { id: "activity_feed", label: "Activity Feed", icon: Activity, category: "Feed", desc: "Recent activity list" },
];

const WIDGET_METRICS = [
  { id: "leads_total", label: "Total Leads", module: "Leads", icon: Users },
  { id: "leads_qualified", label: "Qualified Leads", module: "Leads", icon: Target },
  { id: "deals_value", label: "Pipeline Value (₹)", module: "Deals", icon: DollarSign },
  { id: "deals_won", label: "Won Deals", module: "Deals", icon: CheckCircle2 },
  { id: "calls_total", label: "AI Calls Made", module: "AI Calling", icon: Phone },
  { id: "campaigns_active", label: "Active Campaigns", module: "Campaigns", icon: Zap },
  { id: "messages_sent", label: "WhatsApp Sent", module: "WhatsApp", icon: MessageCircle },
  { id: "conversion_rate", label: "Conversion Rate", module: "Leads", icon: TrendingUp },
];

const COLUMN_SPANS = [
  { value: 1, label: "1/4" },
  { value: 2, label: "1/2" },
  { value: 3, label: "3/4" },
  { value: 4, label: "Full" },
];

// ─── Mock widget data rendering ───────────────────────────────
const mockBarData = [
  { name: "Q1", value: 4200000 }, { name: "Q2", value: 5800000 },
  { name: "Q3", value: 3900000 }, { name: "Q4", value: 7100000 }
];
const mockLineData = [
  { name: "Jan", leads: 120, deals: 18 }, { name: "Feb", leads: 145, deals: 22 },
  { name: "Mar", leads: 178, deals: 28 }, { name: "Apr", leads: 203, deals: 34 }
];
const mockPieData = [
  { name: "Qualified", value: 35, color: "#10B981" },
  { name: "Contacted", value: 28, color: "#3B82F6" },
  { name: "New", value: 22, color: "#8B5CF6" },
  { name: "Unqualified", value: 15, color: "#EF4444" },
];
const CHART_COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

interface DashWidget {
  id: string;
  type: string;
  label: string;
  metric?: string;
  colSpan: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  config: Record<string, unknown>;
}

const defaultWidgets: DashWidget[] = [
  { id: "w1", type: "metric_card", label: "Total Leads", metric: "leads_total", colSpan: 1, config: { value: "4,782", trend: "+12.4%", positive: true } },
  { id: "w2", type: "metric_card", label: "Pipeline Value", metric: "deals_value", colSpan: 1, config: { value: "₹1.93Cr", trend: "+8.7%", positive: true } },
  { id: "w3", type: "metric_card", label: "Conversion Rate", metric: "conversion_rate", colSpan: 1, config: { value: "36.8%", trend: "+2.1%", positive: true } },
  { id: "w4", type: "metric_card", label: "AI Calls Made", metric: "calls_total", colSpan: 1, config: { value: "2,713", trend: "-4.2%", positive: false } },
  { id: "w5", type: "bar_chart", label: "Revenue by Quarter", colSpan: 2, config: {} },
  { id: "w6", type: "pie_chart", label: "Lead Distribution", colSpan: 2, config: {} },
];

function WidgetPreview({ widget }: { widget: DashWidget }) {
  switch (widget.type) {
    case "metric_card": {
      const cfg = widget.config as { value: string; trend: string; positive: boolean };
      return (
        <div className="h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-blue-600" />
            </div>
            <span className={`text-xs font-medium ${cfg.positive ? "text-green-600" : "text-red-500"}`}>{cfg.trend}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{cfg.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{widget.label}</p>
          </div>
        </div>
      );
    }
    case "bar_chart":
      return (
        <div className="h-full">
          <p className="text-xs font-medium text-gray-700 mb-2">{widget.label}</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={mockBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" style={{ fontSize: 10 }} />
              <YAxis style={{ fontSize: 10 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => `₹${(v/100000).toFixed(1)}L`} />
              <Bar key="bar-value" dataKey="value" fill="#3B82F6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    case "line_chart":
      return (
        <div className="h-full">
          <p className="text-xs font-medium text-gray-700 mb-2">{widget.label}</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={mockLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" style={{ fontSize: 10 }} />
              <YAxis style={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line key="line-leads" type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} name="Leads" dot={false} />
              <Line key="line-deals" type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={2} name="Deals" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    case "pie_chart":
      return (
        <div className="h-full">
          <p className="text-xs font-medium text-gray-700 mb-1">{widget.label}</p>
          <div className="flex items-center gap-3">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={mockPieData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value">
                  {mockPieData.map((entry, i) => <Cell key={`cell-pie-${i}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1">
              {mockPieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}: {d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "data_table":
      return (
        <div className="h-full">
          <p className="text-xs font-medium text-gray-700 mb-2">{widget.label}</p>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100"><th className="text-left py-1 text-gray-500">Lead</th><th className="text-right py-1 text-gray-500">Score</th><th className="text-right py-1 text-gray-500">Status</th></tr></thead>
            <tbody>
              {[{ n: "Arjun Sharma", s: 87, st: "Qualified" }, { n: "Priya Patel", s: 74, st: "Contacted" }, { n: "Ravi Kumar", s: 65, st: "New" }].map(r => (
                <tr key={r.n} className="border-b border-gray-50"><td className="py-1 text-gray-700">{r.n}</td><td className="text-right py-1 text-gray-700">{r.s}</td><td className="text-right py-1"><span className="text-green-600">{r.st}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "activity_feed":
      return (
        <div className="h-full">
          <p className="text-xs font-medium text-gray-700 mb-2">{widget.label}</p>
          <div className="space-y-2">
            {["AI Agent called Arjun S. — Qualified", "Deal DL-0007 moved to Negotiation", "WhatsApp campaign sent to 1,200 leads", "New lead from Meta Ads: Priya M."].map((act, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">{act}</p>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return <div className="h-full flex items-center justify-center text-sm text-gray-400">{widget.label}</div>;
  }
}

export function DashboardBuilder() {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<DashWidget[]>(defaultWidgets);
  const [selectedWidget, setSelectedWidget] = useState<DashWidget | null>(null);
  const [dashName, setDashName] = useState("My Custom Dashboard");
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [searchWidget, setSearchWidget] = useState("");

  const addWidget = (type: string) => {
    const widgetDef = WIDGET_TYPES.find(w => w.id === type)!;
    const newWidget: DashWidget = {
      id: `w-${Date.now()}`,
      type,
      label: widgetDef.label,
      colSpan: type === "metric_card" ? 1 : 2,
      config: type === "metric_card" ? { value: "—", trend: "0%", positive: true } : {}
    };
    setWidgets(prev => [...prev, newWidget]);
    setSelectedWidget(newWidget);
    setShowWidgetPicker(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    if (selectedWidget?.id === id) setSelectedWidget(null);
  };

  const updateWidget = (id: string, data: Partial<DashWidget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...data } : w));
    if (selectedWidget?.id === id) setSelectedWidget(prev => prev ? { ...prev, ...data } : prev);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success(`Dashboard "${dashName}" saved successfully!`);
    navigate("/tenant/reports/dashboards");
  };

  const filteredWidgetTypes = WIDGET_TYPES.filter(w =>
    w.label.toLowerCase().includes(searchWidget.toLowerCase()) ||
    w.category.toLowerCase().includes(searchWidget.toLowerCase())
  );

  const gridColClass = (span: number) => {
    const map: Record<number, string> = { 1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4" };
    return map[span] ?? "col-span-2";
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Reports & Analytics", path: "/tenant/reports" },
          { label: "Dashboards", path: "/tenant/reports/dashboards" },
          { label: "Builder" }
        ]}
        companyName="TechAvtar India Pvt Ltd"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Widget Palette (Left) */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-3">Widget Library</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchWidget}
                onChange={e => setSearchWidget(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <LayoutGrid className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {["KPI", "Chart", "Table", "Feed"].map(cat => {
              const catWidgets = filteredWidgetTypes.filter(w => w.category === cat);
              if (!catWidgets.length) return null;
              return (
                <div key={cat}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">{cat}</p>
                  {catWidgets.map(wt => (
                    <button
                      key={wt.id}
                      onClick={() => addWidget(wt.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group mb-0.5"
                    >
                      <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <wt.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-800 group-hover:text-blue-700">{wt.label}</p>
                        <p className="text-xs text-gray-400">{wt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Click a widget to add it to the canvas</p>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
            <button onClick={() => navigate("/tenant/reports/dashboards")} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={dashName}
              onChange={e => setDashName(e.target.value)}
              className="text-sm font-semibold text-gray-900 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
            />
            <div className="flex items-center gap-1 ml-auto">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? "Saving…" : "Save Dashboard"}
              </button>
            </div>
          </div>

          {/* Canvas Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-4 auto-rows-min">
              {widgets.map(widget => (
                <div
                  key={widget.id}
                  className={`${gridColClass(widget.colSpan)} ${
                    selectedWidget?.id === widget.id
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-1 hover:ring-blue-300 hover:ring-offset-1"
                  } bg-white border border-gray-200 rounded-xl p-4 cursor-pointer transition-all relative group`}
                  style={{ minHeight: widget.type === "metric_card" ? 120 : 180 }}
                  onClick={() => setSelectedWidget(widget)}
                >
                  {/* Widget Controls */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      className="p-1 bg-white border border-gray-200 rounded shadow-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                      onClick={e => { e.stopPropagation(); setSelectedWidget(widget); }}
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1 bg-white border border-gray-200 rounded shadow-sm text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors"
                      onClick={e => { e.stopPropagation(); removeWidget(widget.id); }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <WidgetPreview widget={widget} />
                </div>
              ))}

              {/* Drop zone */}
              <div
                className="col-span-4 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center py-8 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
                onClick={() => setShowWidgetPicker(true)}
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-100 transition-colors">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Add Widget</p>
                  <p className="text-xs text-gray-400 mt-0.5">Click to browse widget library</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Config Panel (Right) */}
        {selectedWidget && (
          <div className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-gray-900">Widget Config</p>
              </div>
              <button onClick={() => setSelectedWidget(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Widget Label */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Widget Label</label>
                <input
                  type="text"
                  value={selectedWidget.label}
                  onChange={e => updateWidget(selectedWidget.id, { label: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Column Span */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                <div className="grid grid-cols-4 gap-1">
                  {COLUMN_SPANS.map(cs => (
                    <button
                      key={cs.value}
                      onClick={() => updateWidget(selectedWidget.id, { colSpan: cs.value as 1 | 2 | 3 | 4 })}
                      className={`py-1.5 text-xs rounded-lg border transition-colors ${
                        selectedWidget.colSpan === cs.value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {cs.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric for metric card */}
              {selectedWidget.type === "metric_card" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data Source</label>
                  <select
                    value={selectedWidget.metric ?? ""}
                    onChange={e => updateWidget(selectedWidget.id, { metric: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select metric…</option>
                    {WIDGET_METRICS.map(m => (
                      <option key={m.id} value={m.id}>{m.label} ({m.module})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Range */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Month</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
              </div>

              {/* Refresh Interval */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Auto-Refresh</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Off</option>
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every hour</option>
                </select>
              </div>

              {/* Chart-specific settings */}
              {["bar_chart", "line_chart", "pie_chart"].includes(selectedWidget.type) && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-600">Chart Options</p>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Show Legend
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Show Grid Lines
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    Show Data Labels
                  </label>
                </div>
              )}

              {/* Delete button */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => removeWidget(selectedWidget.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Widget
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
