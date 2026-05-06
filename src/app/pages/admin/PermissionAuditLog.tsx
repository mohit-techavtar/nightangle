import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FileText, Search, Filter, Calendar, Download, User, Shield,
  CheckCircle2, AlertTriangle, Activity, Trash2, Edit2, Eye, ChevronDown,
  Clock, UserPlus, RefreshCw
} from "lucide-react";
import { useOmniStore } from "../../store";
import type { AuditLog } from "../../store/types";

type ActionFilter = "all" | "create" | "update" | "delete" | "assign";
type EntityFilter = "all" | "Role" | "User" | "Session";

export function PermissionAuditLog() {
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { auditLogs: allAuditLogs } = useOmniStore();

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = () => {
    setIsLoading(true);
    try {
      // Filter for permission-related entities only
      const permissionLogs = allAuditLogs.filter(log =>
        log.entity === "Role" || log.entity === "User" || log.entity === "Session"
      );
      setAuditLogs(permissionLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create": return <CheckCircle2 size={16} className="text-green-500" />;
      case "update": return <Edit2 size={16} className="text-blue-500" />;
      case "delete": return <Trash2 size={16} className="text-red-500" />;
      case "assign": return <UserPlus size={16} className="text-purple-500" />;
      case "deactivate": return <AlertTriangle size={16} className="text-orange-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "text-green-700 bg-green-100";
      case "update": return "text-blue-700 bg-blue-100";
      case "delete": return "text-red-700 bg-red-100";
      case "assign": return "text-purple-700 bg-purple-100";
      case "deactivate": return "text-orange-700 bg-orange-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const getDateFilterDays = (filter: string): number => {
    switch (filter) {
      case "today": return 1;
      case "week": return 7;
      case "month": return 30;
      default: return Infinity;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesEntity = entityFilter === "all" || log.entity === entityFilter;

    const days = getDateFilterDays(dateFilter);
    const logDate = new Date(log.timestamp);
    const daysAgo = (Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24);
    const matchesDate = dateFilter === "all" || daysAgo <= days;

    return matchesSearch && matchesAction && matchesEntity && matchesDate;
  });

  const exportLogs = () => {
    const headers = ["Timestamp", "Action", "Entity", "Actor", "Details", "Reason"];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.action,
      `${log.entity} (${log.entityId})`,
      `${log.actor} (${log.actorType})`,
      JSON.stringify(log.after || {}),
      log.reason || ""
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `permission-audit-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewDetails = (log: AuditLog) => {
    setSelectedEntry(log);
    setShowDetailModal(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
          <p className="text-sm text-[#64748B]">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Permission Audit Log</h1>
              <p className="text-sm text-[#64748B]">
                Complete audit trail of all permission and role changes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadAuditLogs}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button
                onClick={exportLogs}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search by actor, entity, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-4 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters ? "border-[#1565C0] bg-[#1565C0]/5 text-[#1565C0]" : "border-gray-300 text-[#0F1B2D] hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-2">Filter by Action</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All Actions" },
                    { value: "create", label: "Created" },
                    { value: "update", label: "Updated" },
                    { value: "delete", label: "Deleted" },
                    { value: "assign", label: "Assigned" },
                  ].map(action => (
                    <button
                      key={action.value}
                      onClick={() => setActionFilter(action.value as ActionFilter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        actionFilter === action.value ? "bg-[#1565C0] text-white" : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-2">Filter by Entity</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All Entities" },
                    { value: "Role", label: "Roles" },
                    { value: "User", label: "Users" },
                    { value: "Session", label: "Sessions" },
                  ].map(entity => (
                    <button
                      key={entity.value}
                      onClick={() => setEntityFilter(entity.value as EntityFilter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        entityFilter === entity.value ? "bg-[#1565C0] text-white" : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                      }`}
                    >
                      {entity.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#64748B] mb-2">Filter by Date</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "Last 7 Days" },
                    { value: "month", label: "Last 30 Days" },
                  ].map(date => (
                    <button
                      key={date.value}
                      onClick={() => setDateFilter(date.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        dateFilter === date.value ? "bg-[#1565C0] text-white" : "bg-gray-100 text-[#64748B] hover:bg-gray-200"
                      }`}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">{filteredLogs.length}</div>
            <div className="text-sm text-[#64748B]">Total Events</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">
              {filteredLogs.filter(l => l.action === "create").length}
            </div>
            <div className="text-sm text-[#64748B]">Created</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">
              {filteredLogs.filter(l => l.action === "update").length}
            </div>
            <div className="text-sm text-[#64748B]">Updated</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-[#0F1B2D]">
              {filteredLogs.filter(l => l.action === "delete").length}
            </div>
            <div className="text-sm text-[#64748B]">Deleted</div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Actor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Reason
                </th>
                <th className="w-12 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                      <Clock size={14} />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-sm text-[#0F1B2D]">{log.entity}</div>
                      <div className="text-xs text-[#64748B]">{log.entityId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1565C0]/10 flex items-center justify-center">
                        <User size={16} className="text-[#1565C0]" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-[#0F1B2D]">{log.actor}</div>
                        <div className="text-xs text-[#64748B]">{log.actorType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#64748B] max-w-xs truncate">
                      {log.reason || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewDetails(log)}
                      className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#64748B]"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-[#0F1B2D] mb-2">No audit logs found</h3>
            <p className="text-sm text-[#64748B] mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActionFilter("all");
                setEntityFilter("all");
                setDateFilter("all");
              }}
              className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-[#0F1B2D]">Audit Log Details</h3>
              <p className="text-sm text-[#64748B] mt-1">{selectedEntry.id}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Timestamp</div>
                  <div className="text-sm text-[#0F1B2D]">
                    {new Date(selectedEntry.timestamp).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Action</div>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getActionColor(selectedEntry.action)}`}>
                    {selectedEntry.action.charAt(0).toUpperCase() + selectedEntry.action.slice(1)}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Entity Type</div>
                  <div className="text-sm text-[#0F1B2D]">{selectedEntry.entity}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Entity ID</div>
                  <div className="text-sm text-[#0F1B2D]">{selectedEntry.entityId}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Actor</div>
                  <div className="text-sm text-[#0F1B2D]">{selectedEntry.actor}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Actor Type</div>
                  <div className="text-sm text-[#0F1B2D]">{selectedEntry.actorType}</div>
                </div>
              </div>

              {selectedEntry.reason && (
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Reason</div>
                  <div className="text-sm text-[#0F1B2D] p-3 bg-gray-50 rounded-lg">
                    {selectedEntry.reason}
                  </div>
                </div>
              )}

              {selectedEntry.before && Object.keys(selectedEntry.before).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">Before (Previous State)</div>
                  <pre className="text-xs text-[#0F1B2D] p-3 bg-gray-50 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedEntry.before, null, 2)}
                  </pre>
                </div>
              )}

              {selectedEntry.after && Object.keys(selectedEntry.after).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-[#64748B] mb-1">After (New State)</div>
                  <pre className="text-xs text-[#0F1B2D] p-3 bg-gray-50 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedEntry.after, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEntry(null);
                }}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
