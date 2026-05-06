import { useState } from "react";
import { useNavigate } from "react-router";
import { useDocuments } from "../../hooks/useDocuments";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  MessageSquare,
  Copy,
  Settings,
  Layout,
  ChevronDown,
} from "lucide-react";

export function DocumentLibrary() {
  const navigate = useNavigate();
  const { documents, templates, deleteDocument } = useDocuments();

  const [activeTab, setActiveTab] = useState<"documents" | "templates">("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.dealName && doc.dealName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.leadName && doc.leadName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || template.type === filterType;

    return matchesSearch && matchesType;
  }).filter(t => t.isActive);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="w-4 h-4 text-gray-600" />;
      case "sent":
        return <Send className="w-4 h-4 text-blue-600" />;
      case "viewed":
        return <Eye className="w-4 h-4 text-purple-600" />;
      case "signed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "sent":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "viewed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "signed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "invoice":
        return "bg-green-100 text-green-700";
      case "proposal":
        return "bg-blue-100 text-blue-700";
      case "contract":
        return "bg-purple-100 text-purple-700";
      case "agreement":
        return "bg-indigo-100 text-indigo-700";
      case "quotation":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(id);
    }
  };

  const handleDuplicate = (id: string) => {
    alert(`Duplicating document ${id}`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Document Library</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage documents for your deals</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tenant/documents/templates")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Layout className="w-4 h-4" />
              Manage Templates
            </button>
            <button
              onClick={() => navigate("/tenant/documents/create")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Document
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "documents"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "templates"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Templates ({templates.filter(t => t.isActive).length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "documents" ? "Search documents..." : "Search templates..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="invoice">Invoice</option>
            <option value="proposal">Proposal</option>
            <option value="contract">Contract</option>
            <option value="agreement">Agreement</option>
            <option value="quotation">Quotation</option>
            <option value="nda">NDA</option>
          </select>

          {/* Status Filter (Documents only) */}
          {activeTab === "documents" && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="signed">Signed</option>
            </select>
          )}

          <button
            onClick={() => alert("Exporting documents...")}
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "documents" ? (
          // Documents Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{doc.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(doc.type)}`}>
                        {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-md border text-xs font-medium flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>

                    {doc.dealName && (
                      <p className="text-sm text-gray-600">
                        <strong>Deal:</strong> {doc.dealName}
                      </p>
                    )}

                    {doc.leadName && (
                      <p className="text-sm text-gray-600">
                        <strong>Contact:</strong> {doc.leadName}
                      </p>
                    )}

                    {doc.sentVia && doc.sentVia.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Sent via:</span>
                        {doc.sentVia.map((channel, idx) => (
                          <span key={idx}>
                            {channel === "email" ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <button
                      onClick={() => navigate(`/tenant/documents/${doc.id}`)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/tenant/documents/${doc.id}/edit`)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(doc.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="col-span-full text-center py-16">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first document to get started"}
                </p>
                <button
                  onClick={() => navigate("/tenant/documents/create")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create Document
                </button>
              </div>
            )}
          </div>
        ) : (
          // Templates Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Layout className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{template.name}</h3>
                        {template.isDefault && (
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded mt-1">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(template.type)}`}>
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {template.sections.length} sections
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <button
                      onClick={() => navigate(`/tenant/documents/create?template=${template.id}`)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => navigate(`/tenant/documents/templates/${template.id}`)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View/Edit"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first template to get started"}
                </p>
                <button
                  onClick={() => navigate("/tenant/documents/templates/create")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create Template
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
