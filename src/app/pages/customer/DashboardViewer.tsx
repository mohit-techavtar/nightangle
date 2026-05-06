import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDashboards } from "../../hooks/useDashboards";
import {
  ArrowLeft,
  Edit,
  RefreshCw,
  Share2,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Users,
  DollarSign,
  Phone,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock widget data
const mockWidgetData: Record<string, any> = {
  "platform.callMinutes": { value: "2.4M", change: "+12.5%", trend: "up" },
  "platform.activeTenants": { value: "147", change: "+8", trend: "up" },
  "platform.aiSuccessRate": { value: 85, max: 100 },
  "platform.costUsage": [
    { month: "Jan", cost: 45000, usage: 1200000 },
    { month: "Feb", cost: 52000, usage: 1450000 },
    { month: "Mar", cost: 58000, usage: 1680000 },
  ],
  "platform.errorRates": [
    { category: "Connection", errors: 45 },
    { category: "Timeout", errors: 32 },
    { category: "Auth", errors: 18 },
  ],
  "tenant.aiVsHuman": [
    { type: "AI Calls", success: 85, total: 2234 },
    { type: "Human Calls", success: 72, total: 1456 },
  ],
  "tenant.conversionFunnel": [
    { stage: "Leads", value: 1000 },
    { stage: "Qualified", value: 750 },
    { stage: "Proposal", value: 450 },
    { stage: "Negotiation", value: 250 },
    { stage: "Won", value: 150 },
  ],
  "manager.teamPerformance": [
    { name: "John Doe", deals: 45, revenue: 234000, winRate: 68 },
    { name: "Jane Smith", deals: 52, revenue: 289000, winRate: 72 },
    { name: "Bob Wilson", deals: 38, revenue: 198000, winRate: 65 },
  ],
  "agent.assignedLeads": [
    { name: "Acme Corp", score: 85, status: "Hot", value: 50000 },
    { name: "TechStart Inc", score: 72, status: "Warm", value: 35000 },
    { name: "Global Systems", score: 68, status: "Warm", value: 42000 },
  ],
};

const COLORS = ["#1565C0", "#10B981", "#F59E0B", "#6366F1", "#EC4899"];

export function DashboardViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dashboards, updateDashboard } = useDashboards();

  const [dashboard, setDashboard] = useState(dashboards.find(d => d.id === id));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const foundDashboard = dashboards.find(d => d.id === id);
    if (foundDashboard) {
      setDashboard(foundDashboard);
    }
  }, [id, dashboards]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (!dashboard) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard not found</h2>
          <button
            onClick={() => navigate("/tenant/reports/dashboards")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboards
          </button>
        </div>
      </div>
    );
  }

  const renderWidget = (widget: typeof dashboard.widgets[0]) => {
    const data = mockWidgetData[widget.dataSource] || {};

    switch (widget.type) {
      case "metric":
        return (
          <div className="flex flex-col justify-center h-full">
            <p className="text-3xl font-bold text-gray-900">{data.value}</p>
            {data.change && (
              <div className="flex items-center gap-1 mt-2">
                {data.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${data.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {data.change}
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            )}
          </div>
        );

      case "gauge":
        const percentage = (data.value / data.max) * 100;
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{data.value}%</span>
              </div>
            </div>
          </div>
        );

      case "chart":
        if (widget.chartType === "bar") {
          return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Bar key="bar-errors" dataKey="errors" fill="#1565C0" />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if (widget.chartType === "line") {
          return (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line key="line-cost" type="monotone" dataKey="cost" stroke="#1565C0" strokeWidth={2} name="Cost" />
                <Line key="line-usage" type="monotone" dataKey="usage" stroke="#10B981" strokeWidth={2} name="Usage" />
              </LineChart>
            </ResponsiveContainer>
          );
        }
        return null;

      case "funnel":
        return (
          <div className="flex flex-col justify-center h-full space-y-2 px-4">
            {data.map((stage: any, index: number) => {
              const widthPercent = (stage.value / data[0].value) * 100;
              return (
                <div key={stage.stage} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-gray-600">{stage.stage}</div>
                  <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-8 flex items-center px-3 text-white text-sm font-medium"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {stage.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "table":
        return (
          <div className="overflow-auto h-full">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {Object.keys(data[0] || {}).map(key => (
                    <th key={key} className="px-4 py-2 text-left font-semibold text-gray-900">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} className="px-4 py-2 text-gray-700">
                        {typeof value === "number" ? value.toLocaleString() : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "list":
        return (
          <div className="space-y-2 overflow-auto h-full">
            {data.map((item: any, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-sm text-gray-600">{item.value ? `$${item.value.toLocaleString()}` : item.status}</span>
                </div>
                {item.score && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{item.score}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return <div className="flex items-center justify-center h-full text-gray-500">No data</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/reports/dashboards")}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{dashboard.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{dashboard.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => navigate(`/tenant/reports/dashboards/builder?id=${dashboard.id}`)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridAutoRows: "minmax(120px, auto)",
          }}
        >
          {dashboard.widgets.map((widget) => (
            <div
              key={widget.id}
              className="bg-white rounded-lg border p-4"
              style={{
                gridColumn: `span ${widget.position.w}`,
                gridRow: `span ${widget.position.h}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{widget.title}</h3>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="h-[calc(100%-2.5rem)]">
                {renderWidget(widget)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}