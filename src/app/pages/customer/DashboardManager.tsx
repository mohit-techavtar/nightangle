import { useState } from "react";
import { useNavigate } from "react-router";
import { useDashboards, type DashboardRole } from "../../hooks/useDashboards";
import {
  Plus,
  Search,
  Grid3x3,
  Layout,
  Eye,
  Edit,
  Copy,
  Trash2,
  Star,
  Users,
  Lock,
  Globe,
  Shield,
  User,
  Building,
  MoreVertical,
  Filter,
} from "lucide-react";

export function DashboardManager() {
  const navigate = useNavigate();
  const {
    dashboards,
    templates,
    deleteDashboard,
    duplicateDashboard,
    getPopularTemplates,
    getDashboardsByRole,
  } = useDashboards();

  const [activeTab, setActiveTab] = useState<"my-dashboards" | "templates">("my-dashboards");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get current user role (mock - in real app, get from auth context)
  const currentUserRole: DashboardRole = "tenant-admin";

  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || dashboard.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || template.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this dashboard?")) {
      deleteDashboard(id);
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicate = duplicateDashboard(id);
    if (duplicate) {
      alert("Dashboard duplicated successfully!");
    }
  };

  const getRoleIcon = (role: DashboardRole) => {
    switch (role) {
      case "superadmin":
        return <Shield className="w-4 h-4" />;
      case "tenant-admin":
        return <Building className="w-4 h-4" />;
      case "manager":
        return <Users className="w-4 h-4" />;
      case "agent":
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: DashboardRole) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-700";
      case "tenant-admin":
        return "bg-blue-100 text-blue-700";
      case "manager":
        return "bg-green-100 text-green-700";
      case "agent":
        return "bg-orange-100 text-orange-700";
    }
  };

  const popularTemplates = getPopularTemplates();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage custom dashboards</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tenant/reports")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Layout className="w-4 h-4" />
              Back to Reports
            </button>
            <button
              onClick={() => navigate("/tenant/reports/dashboards/builder")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("my-dashboards")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "my-dashboards"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            My Dashboards ({dashboards.length})
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
              placeholder="Search dashboards..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="tenant-admin">Tenant Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
          </select>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Layout className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "my-dashboards" ? (
          viewMode === "grid" ? (
            // Grid View - Dashboards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDashboards.map((dashboard) => (
                <div key={dashboard.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Grid3x3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{dashboard.name}</h3>
                          <p className="text-xs text-gray-500">{dashboard.widgets.length} widgets</p>
                        </div>
                      </div>
                      {dashboard.isDefault && (
                        <Star className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dashboard.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleColor(dashboard.role)}`}>
                        {getRoleIcon(dashboard.role)}
                        {dashboard.role}
                      </span>
                      {dashboard.isPublic ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          <Globe className="w-3 h-3" />
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <button
                        onClick={() => navigate(`/tenant/reports/dashboards/${dashboard.id}`)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/tenant/reports/dashboards/builder?id=${dashboard.id}`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(dashboard.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dashboard.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDashboards.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <Grid3x3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No dashboards found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || filterRole !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first dashboard to get started"}
                  </p>
                  <button
                    onClick={() => navigate("/tenant/reports/dashboards/builder")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Dashboard
                  </button>
                </div>
              )}
            </div>
          ) : (
            // List View - Dashboards
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Widgets</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Visibility</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Modified</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDashboards.map((dashboard) => (
                      <tr key={dashboard.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {dashboard.isDefault && <Star className="w-4 h-4 text-yellow-500" />}
                            <div>
                              <p className="font-medium text-gray-900">{dashboard.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{dashboard.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleColor(dashboard.role)}`}>
                            {getRoleIcon(dashboard.role)}
                            {dashboard.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{dashboard.widgets.length}</td>
                        <td className="px-6 py-4">
                          {dashboard.isPublic ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              <Globe className="w-3 h-3" />
                              Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              <Lock className="w-3 h-3" />
                              Private
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(dashboard.lastModified).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/tenant/reports/dashboards/${dashboard.id}`)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/tenant/reports/dashboards/builder?id=${dashboard.id}`)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(dashboard.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(dashboard.id)}
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
            </div>
          )
        ) : (
          // Templates
          <div className="space-y-6">
            {/* Popular Templates */}
            {popularTemplates.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Popular Templates</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularTemplates.map((template) => (
                    <div key={template.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Grid3x3 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{template.name}</h3>
                              <p className="text-xs text-gray-500">{template.category}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleColor(template.role)}`}>
                            {getRoleIcon(template.role)}
                            {template.role}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {template.widgets.length} widgets
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/tenant/reports/dashboards/builder?template=${template.id}`)}
                          className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Templates */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Grid3x3 className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <p className="text-xs text-gray-500">{template.category}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleColor(template.role)}`}>
                          {getRoleIcon(template.role)}
                          {template.role}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {template.widgets.length} widgets
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/tenant/reports/dashboards/builder?template=${template.id}`)}
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
