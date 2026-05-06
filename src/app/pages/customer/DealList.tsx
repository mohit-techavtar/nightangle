import { useState } from "react";
import { useNavigate } from "react-router";
import { useDeals } from "../../hooks/useDeals";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  Tag,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Settings,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

export function DealList() {
  const navigate = useNavigate();
  const { deals, pipelines, deleteDeal } = useDeals();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPipeline, setSelectedPipeline] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");
  const [selectedDealType, setSelectedDealType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"value" | "date" | "probability">("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);

  // Get unique owners
  const uniqueOwners = Array.from(new Set(deals.map(d => d.owner)));

  // Filter and sort deals
  let filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.companyName && deal.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPipeline = selectedPipeline === "all" || deal.pipelineId === selectedPipeline;
    const matchesStage = selectedStage === "all" || deal.stageId === selectedStage;
    const matchesStatus = selectedStatus === "all" || deal.status === selectedStatus;
    const matchesOwner = selectedOwner === "all" || deal.owner === selectedOwner;
    const matchesDealType = selectedDealType === "all" || deal.dealType === selectedDealType;

    return matchesSearch && matchesPipeline && matchesStage && matchesStatus && matchesOwner && matchesDealType;
  });

  // Sort deals
  filteredDeals = filteredDeals.sort((a, b) => {
    let comparison = 0;

    if (sortBy === "value") {
      comparison = a.estimatedValue - b.estimatedValue;
    } else if (sortBy === "date") {
      comparison = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
    } else if (sortBy === "probability") {
      comparison = a.probability - b.probability;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Get stages for selected pipeline
  const getStagesForPipeline = () => {
    if (selectedPipeline === "all") return [];
    const pipeline = pipelines.find(p => p.id === selectedPipeline);
    return pipeline?.stages || [];
  };

  const stages = getStagesForPipeline();

  const handleDelete = (dealId: string) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      deleteDeal(dealId);
    }
  };

  const handleBulkAction = (action: string) => {
    alert(`Bulk action: ${action} for ${selectedDeals.length} deals`);
    setSelectedDeals([]);
  };

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDeals.length === filteredDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(filteredDeals.map(d => d.id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "lost":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-700 border-green-200";
      case "lost":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Deals</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your sales opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tenant/deals/pipeline")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Pipeline View
            </button>
            <button
              onClick={() => alert("Exporting deals...")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
            <button
              onClick={() => navigate("/tenant/deals/create")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New Deal
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals, leads, companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 text-sm ${viewMode === "table" ? "bg-blue-50 text-blue-600" : "bg-white text-gray-600"}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm border-l ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "bg-white text-gray-600"}`}
              >
                Grid
              </button>
            </div>

            <button
              onClick={() => alert("Customize table columns...")}
              className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Customize
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedPipeline}
              onChange={(e) => {
                setSelectedPipeline(e.target.value);
                setSelectedStage("all");
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Pipelines</option>
              {pipelines.map(pipeline => (
                <option key={pipeline.id} value={pipeline.id}>{pipeline.name}</option>
              ))}
            </select>

            {stages.length > 0 && (
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
            )}

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Owners</option>
              {uniqueOwners.map(owner => (
                <option key={owner} value={owner}>{deals.find(d => d.owner === owner)?.ownerName}</option>
              ))}
            </select>

            <select
              value={selectedDealType}
              onChange={(e) => setSelectedDealType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="new-business">New Business</option>
              <option value="renewal">Renewal</option>
              <option value="upsell">Upsell</option>
              <option value="cross-sell">Cross-sell</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">{filteredDeals.length} deals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDeals.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{selectedDeals.length}</span> deal{selectedDeals.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("assign")}
                className="px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Assign Owner
              </button>
              <button
                onClick={() => handleBulkAction("move")}
                className="px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Move Stage
              </button>
              <button
                onClick={() => handleBulkAction("tag")}
                className="px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Add Tags
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1.5 text-sm text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        {viewMode === "table" ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => {
                      setSortBy("value");
                      setSortOrder(sortBy === "value" && sortOrder === "desc" ? "asc" : "desc");
                    }}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Deal Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pipeline/Stage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => {
                      setSortBy("value");
                      setSortOrder(sortBy === "value" && sortOrder === "desc" ? "asc" : "desc");
                    }}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Value
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => {
                      setSortBy("probability");
                      setSortOrder(sortBy === "probability" && sortOrder === "desc" ? "asc" : "desc");
                    }}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Probability
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Owner</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  <button
                    onClick={() => {
                      setSortBy("date");
                      setSortOrder(sortBy === "date" && sortOrder === "desc" ? "asc" : "desc");
                    }}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    Close Date
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDeals.includes(deal.id)}
                      onChange={() => toggleDealSelection(deal.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/tenant/deals/detail?id=${deal.id}`)}
                      className="text-left hover:text-blue-600"
                    >
                      <p className="font-medium text-gray-900">{deal.name}</p>
                      <p className="text-sm text-gray-500">{deal.leadName} • {deal.companyName || "No company"}</p>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{deal.pipelineName}</p>
                    <span
                      className="inline-block px-2 py-1 text-xs font-medium rounded mt-1"
                      style={{
                        backgroundColor: pipelines.find(p => p.id === deal.pipelineId)?.stages.find(s => s.id === deal.stageId)?.color + "20",
                        color: pipelines.find(p => p.id === deal.pipelineId)?.stages.find(s => s.id === deal.stageId)?.color,
                      }}
                    >
                      {deal.stageName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{formatCurrency(deal.estimatedValue)}</p>
                    {deal.status === "won" && deal.actualValue && (
                      <p className="text-sm text-green-600">Closed: {formatCurrency(deal.actualValue)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{deal.probability}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{deal.ownerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md border text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(deal.status)}`}>
                      {getStatusIcon(deal.status)}
                      {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/tenant/deals/detail?id=${deal.id}`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigate(`/tenant/deals/edit?id=${deal.id}`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{deal.name}</h3>
                    <p className="text-sm text-gray-500">{deal.leadName}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedDeals.includes(deal.id)}
                    onChange={() => toggleDealSelection(deal.id)}
                    className="rounded border-gray-300"
                  />
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Value</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(deal.estimatedValue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Probability</span>
                    <span className="font-medium text-gray-900">{deal.probability}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Close Date</span>
                    <span className="text-gray-900">{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{
                      backgroundColor: pipelines.find(p => p.id === deal.pipelineId)?.stages.find(s => s.id === deal.stageId)?.color + "20",
                      color: pipelines.find(p => p.id === deal.pipelineId)?.stages.find(s => s.id === deal.stageId)?.color,
                    }}
                  >
                    {deal.stageName}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="w-3 h-3" />
                    {deal.ownerName}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/tenant/deals/detail?id=${deal.id}`)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => navigate(`/tenant/deals/edit?id=${deal.id}`)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredDeals.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedPipeline !== "all" || selectedStatus !== "all"
                ? "Try adjusting your filters"
                : "Create your first deal to get started"}
            </p>
            <button
              onClick={() => navigate("/tenant/deals/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Deal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
