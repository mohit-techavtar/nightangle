import React, { useState } from "react";
import { Search, Filter, Download, Archive, Trash2, RotateCw, Tag, Eye, MoreVertical, CheckSquare, Square } from "lucide-react";

interface QueryResponse {
  id: string;
  type: "research" | "strategy" | "leads" | "content";
  title: string;
  query: string;
  status: "completed" | "archived" | "failed";
  campaignTag?: string;
  creditsUsed: number;
  createdAt: Date;
  module: string;
  resultCount?: number;
}

interface QueryHistoryTableProps {
  responses: QueryResponse[];
  onView: (id: string) => void;
  onRerun: (id: string) => void;
  onArchive: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
  onTag: (ids: string[], tag: string) => void;
}

export function QueryHistoryTable({ responses, onView, onRerun, onArchive, onDelete, onTag }: QueryHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filteredResponses = responses.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.campaignTag?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || r.type === filterType;
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(filteredResponses.map(r => r.id));
      setSelectAll(true);
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedIds, id];
      setSelectedIds(newSelected);
      if (newSelected.length === filteredResponses.length) {
        setSelectAll(true);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "research": return "bg-[#E3F2FD] text-[#1565C0]";
      case "strategy": return "bg-[#F3E5F5] text-[#6A1B9A]";
      case "leads": return "bg-[#E8F5E9] text-[#2E7D32]";
      case "content": return "bg-[#FFF8E1] text-[#F57F17]";
      default: return "bg-[#F5F5F5] text-[#616161]";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-[#E8F5E9] text-[#2E7D32]";
      case "archived": return "bg-[#F5F5F5] text-[#616161]";
      case "failed": return "bg-[#FFEBEE] text-[#C62828]";
      default: return "bg-[#F5F5F5] text-[#616161]";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E0E0E0] bg-[#F5F5F5]">
        <div className="flex items-center justify-between mb-4 max-md:flex-col max-md:gap-3 max-md:items-start">
          <div>
            <h3 className="text-lg font-semibold text-[#212121]">Query History</h3>
            <p className="text-sm text-[#616161]">
              {filteredResponses.length} responses • {selectedIds.length} selected
            </p>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 max-md:w-full">
              <button
                onClick={() => onTag(selectedIds, "")}
                className="px-3 h-8 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-xs font-medium flex items-center gap-2"
              >
                <Tag size={14} />
                Tag
              </button>
              <button
                onClick={() => onArchive(selectedIds)}
                className="px-3 h-8 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-xs font-medium flex items-center gap-2"
              >
                <Archive size={14} />
                Archive
              </button>
              <button
                onClick={() => onDelete(selectedIds)}
                className="px-3 h-8 rounded-md border border-[#E0E0E0] bg-white text-[#C62828] hover:bg-[#FFEBEE] text-xs font-medium flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2 max-md:flex-col">
          <div className="relative flex-1 max-md:w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search queries, campaigns, or tags..."
              className="w-full h-9 pl-10 pr-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 h-9 rounded-md border text-sm font-medium flex items-center gap-2 max-md:w-full max-md:justify-center ${
              showFilters
                ? "border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]"
                : "border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5]"
            }`}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-3 p-3 rounded-lg bg-white border border-[#E0E0E0] grid grid-cols-2 max-md:grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#616161] mb-2 block">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
              >
                <option value="all">All Types</option>
                <option value="research">Research</option>
                <option value="strategy">Strategy</option>
                <option value="leads">Lead Generation</option>
                <option value="content">Content</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#616161] mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0]"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
              <th className="text-left py-3 px-4 w-12">
                <button onClick={handleSelectAll} className="text-[#616161] hover:text-[#1565C0]">
                  {selectAll ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Query</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Campaign</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Credits</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResponses.map((response) => (
              <tr key={response.id} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleSelect(response.id)}
                    className="text-[#616161] hover:text-[#1565C0]"
                  >
                    {selectedIds.includes(response.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="text-sm font-medium text-[#212121] mb-1">{response.title}</div>
                    <div className="text-xs text-[#616161] line-clamp-1">{response.query}</div>
                    {response.resultCount !== undefined && (
                      <div className="text-xs text-[#1565C0] mt-1">{response.resultCount} results</div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(response.type)}`}>
                    {response.type.charAt(0).toUpperCase() + response.type.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {response.campaignTag ? (
                    <div className="flex items-center gap-1">
                      <Tag size={12} className="text-[#1565C0]" />
                      <span className="text-sm text-[#212121]">{response.campaignTag}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#9E9E9E]">No tag</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-bold text-[#1565C0]">{response.creditsUsed}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(response.status)}`}>
                    {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[#616161]">{response.createdAt.toLocaleDateString()}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onView(response.id)}
                      className="w-7 h-7 rounded flex items-center justify-center text-[#1565C0] hover:bg-[#E3F2FD]"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onRerun(response.id)}
                      className="w-7 h-7 rounded flex items-center justify-center text-[#616161] hover:bg-[#F5F5F5]"
                      title="Re-run"
                    >
                      <RotateCw size={16} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuId(actionMenuId === response.id ? null : response.id)}
                        className="w-7 h-7 rounded flex items-center justify-center text-[#616161] hover:bg-[#F5F5F5]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {actionMenuId === response.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActionMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-xl border border-[#E0E0E0] py-1 w-40">
                            <button
                              onClick={() => {
                                onArchive([response.id]);
                                setActionMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#212121] hover:bg-[#F5F5F5] flex items-center gap-2"
                            >
                              <Archive size={14} />
                              Archive
                            </button>
                            <button
                              onClick={() => {
                                onDelete([response.id]);
                                setActionMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-[#C62828] hover:bg-[#FFEBEE] flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredResponses.length === 0 && (
        <div className="py-12 text-center text-[#9E9E9E]">
          <Search size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No query responses found</p>
          {(searchTerm || filterType !== "all" || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setFilterStatus("all");
              }}
              className="text-sm text-[#1565C0] hover:underline mt-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
