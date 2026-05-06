import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useReports } from "../../hooks/useReports";
import {
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  Edit,
  Calendar,
  Filter as FilterIcon,
  MoreVertical,
  Mail,
  FileText,
  Table as TableIcon,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart,
  Copy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for demonstration
const mockData = [
  { name: "Qualification", value: 45, count: 23, amount: 234000 },
  { name: "Proposal", value: 32, count: 18, amount: 456000 },
  { name: "Negotiation", value: 28, count: 15, amount: 678000 },
  { name: "Closing", value: 15, count: 8, amount: 345000 },
];

const COLORS = ["#1565C0", "#10B981", "#F59E0B", "#6366F1", "#EC4899"];

export function ReportViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports, runReport, exportReport } = useReports();

  const [report, setReport] = useState(reports.find(r => r.id === id));
  const [isLoading, setIsLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [data, setData] = useState(mockData);

  useEffect(() => {
    const foundReport = reports.find(r => r.id === id);
    if (foundReport) {
      setReport(foundReport);
      handleRefresh();
    }
  }, [id, reports]);

  const handleRefresh = () => {
    setIsLoading(true);
    if (id) {
      runReport(id);
    }
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (format: "pdf" | "excel" | "csv" | "json") => {
    if (id) {
      const exportJob = exportReport(id, format);
      alert(`Exporting report as ${format.toUpperCase()}...`);
      setShowExportMenu(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (!report) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Report not found</h2>
          <button
            onClick={() => navigate("/tenant/reports/library")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const renderVisualization = () => {
    const visibleColumns = report.columns.filter(c => c.visible);

    switch (report.visualization) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFF", border: "1px solid #E5E7EB", borderRadius: 8 }}
              />
              <Legend />
              <Bar dataKey="count" fill="#1565C0" name="Count" />
              <Bar dataKey="amount" fill="#10B981" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFF", border: "1px solid #E5E7EB", borderRadius: 8 }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#1565C0" strokeWidth={2} name="Count" />
              <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} name="Amount" />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPie>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        );

      case "table":
      default:
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {visibleColumns.map(col => (
                    <th key={col.id} className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                      {col.name}
                      {col.aggregation && <span className="text-gray-500 ml-1">({col.aggregation})</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                    {visibleColumns.map(col => (
                      <td key={`${rowIndex}-${col.id}`} className="px-6 py-4 text-sm text-gray-900">
                        {col.type === "currency" && "$"}
                        {(row as any)[col.field] !== undefined
                          ? col.type === "currency"
                            ? (row as any)[col.field].toLocaleString()
                            : (row as any)[col.field]
                          : "-"}
                        {col.type === "percentage" && "%"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

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
              <h1 className="text-2xl font-semibold text-gray-900">{report.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {report.dateRange.preset}
                </span>
                {report.filters.length > 0 && (
                  <span className="flex items-center gap-1">
                    <FilterIcon className="w-4 h-4" />
                    {report.filters.length} filters
                  </span>
                )}
                <span>Last run: {report.lastRunAt ? new Date(report.lastRunAt).toLocaleString() : "Never"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport("json")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                  >
                    Export as JSON
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate(`/tenant/reports/builder?id=${report.id}`)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Report Description */}
          {report.description && (
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">{report.description}</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600 mb-1">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600 mb-1">Total Count</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600 mb-1">Average Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.round(data.reduce((sum, item) => sum + item.amount, 0) / data.length).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Main Visualization */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {report.visualization.charAt(0).toUpperCase() + report.visualization.slice(1)} View
              </h2>
              <div className="flex items-center gap-2">
                {report.groupBy && report.groupBy.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Grouped by: {report.groupBy[0].field}
                  </span>
                )}
              </div>
            </div>
            {renderVisualization()}
          </div>

          {/* Active Filters */}
          {report.filters.length > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {report.filters.map(filter => (
                  <span key={filter.id} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                    {filter.field} {filter.operator} "{filter.value}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Report Details */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Report Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Module</p>
                <p className="font-medium text-gray-900">{report.module}</p>
              </div>
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-medium text-gray-900">{report.type}</p>
              </div>
              <div>
                <p className="text-gray-600">Created By</p>
                <p className="font-medium text-gray-900">{report.createdBy}</p>
              </div>
              <div>
                <p className="text-gray-600">Created At</p>
                <p className="font-medium text-gray-900">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {report.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Report</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`https://app.example.com/reports/${report.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://app.example.com/reports/${report.id}`);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Recipients
                </label>
                <input
                  type="email"
                  placeholder="Enter email addresses"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
