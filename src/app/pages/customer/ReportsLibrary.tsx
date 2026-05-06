import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useReports } from "../../hooks/useReports";
import {
  BarChart3,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Clock,
  TrendingUp,
  Layout,
  Play,
  MoreVertical,
  Star,
  Users,
  Lock,
  Globe,
} from "lucide-react";

export function ReportsLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reports, templates, deleteReport, duplicateReport, runReport, getPopularTemplates } = useReports();

  const tabFromUrl = searchParams.get("tab") as "my-reports" | "templates" | null;
  const [activeTab, setActiveTab] = useState<"my-reports" | "templates">(tabFromUrl || "my-reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModule, setFilterModule] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = filterModule === "all" || report.module === filterModule;
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesSearch && matchesModule && matchesType;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = filterModule === "all" || template.module === filterModule;
    const matchesType = filterType === "all" || template.type === filterType;
    return matchesSearch && matchesModule && matchesType;
  });

  const handleRunReport = (id: string) => {
    runReport(id);
    navigate(`/tenant/reports/view/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicate = duplicateReport(id);
    if (duplicate) {
      alert("Report duplicated successfully!");
    }
  };

  const getVisualizationIcon = (type: string) => {
    switch (type) {
      case "bar":
      case "line":
      case "area":
        return <BarChart3 className="w-5 h-5" />;
      case "pie":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Layout className="w-5 h-5" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports Library</h1>
            <p className="text-sm text-gray-500 mt-1">Create, manage, and run custom reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tenant/reports/dashboards")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Layout className="w-4 h-4" />
              Dashboards
            </button>
            <button
              onClick={() => navigate("/tenant/reports/builder")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("my-reports")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "my-reports"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            My Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "templates"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Templates ({templates.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Modules</option>
            <option value="deals">Deals</option>
            <option value="leads">Leads</option>
            <option value="campaigns">Campaigns</option>
            <option value="ai-calling">AI Calling</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="team">Team</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="pipeline">Pipeline</option>
            <option value="revenue">Revenue</option>
            <option value="performance">Performance</option>
            <option value="activity">Activity</option>
            <option value="custom">Custom</option>
          </select>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Layout className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "my-reports" ? (
          viewMode === "grid" ? (
            // Grid View - My Reports
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {getVisualizationIcon(report.visualization)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{report.name}</h3>
                          <p className="text-xs text-gray-500">{report.module}</p>
                        </div>
                      </div>
                      {report.isPublic ? (
                        <Globe className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {report.type}
                      </span>
                      {report.lastRunAt && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(report.lastRunAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t">
                      <button
                        onClick={() => handleRunReport(report.id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Run
                      </button>
                      <button
                        onClick={() => navigate(`/tenant/reports/builder?id=${report.id}`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(report.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || filterModule !== "all" || filterType !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first report to get started"}
                  </p>
                  <button
                    onClick={() => navigate("/tenant/reports/builder")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Report
                  </button>
                </div>
              )}
            </div>
          ) : (
            // List View - My Reports
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Last Run</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Visibility</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                              {getVisualizationIcon(report.visualization)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{report.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{report.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{report.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{report.module}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {report.lastRunAt ? new Date(report.lastRunAt).toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {report.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {report.isPublic ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRunReport(report.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Run"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/tenant/reports/builder?id=${report.id}`)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(report.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredReports.length === 0 && (
                <div className="text-center py-16">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || filterModule !== "all" || filterType !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first report to get started"}
                  </p>
                  <button
                    onClick={() => navigate("/tenant/reports/builder")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Report
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          // Templates Grid
          <div className="space-y-6">
            {/* Popular Templates */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900">Popular Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getPopularTemplates().map((template) => (
                  <div key={template.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                            <Layout className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <p className="text-xs text-gray-500">{template.category}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {template.module}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {template.availableColumns.length} columns
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/tenant/reports/builder?template=${template.id}`)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Templates */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                            <Layout className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <p className="text-xs text-gray-500">{template.category}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {template.module}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {template.availableColumns.length} columns
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/tenant/reports/builder?template=${template.id}`)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
