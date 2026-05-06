import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOmniStore } from "../../../store";
import {
  ArrowLeft, Search, Filter, CheckCircle2, XCircle, Clock,
  Activity, RefreshCw, Download, ChevronDown
} from "lucide-react";
import type { IntegrationLog, Integration } from "../../../store/types";

export function IntegrationLogs() {
  const navigate = useNavigate();
  const { getIntegrationLogs, getIntegrations } = useOmniStore();

  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [logsData, integrationsData] = await Promise.all([
        getIntegrationLogs(),
        getIntegrations()
      ]);
      setLogs(logsData);
      setIntegrations(integrationsData);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Integration', 'Action', 'Status', 'Message', 'Duration', 'Timestamp'].join(','),
      ...filteredLogs.map(log => [
        log.id,
        log.integrationName,
        log.action,
        log.status,
        `"${log.message}"`,
        log.duration || 'N/A',
        new Date(log.timestamp).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.integrationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntegration = selectedIntegration === 'all' || log.integrationId === selectedIntegration;
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;

    return matchesSearch && matchesIntegration && matchesAction && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      success: 'bg-green-100 text-green-700 border-green-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatDuration = (ms: number | undefined) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getActionLabel = (action: string) => {
    return action.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/tenant/integrations')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-[#64748B]" />
              </button>
              <div>
                <h1 className="font-semibold text-[#0F1B2D]">Integration Logs</h1>
                <p className="text-sm text-[#64748B]">
                  View and monitor integration activity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={filteredLogs.length === 0}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-4 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters ? "border-[#1565C0] bg-[#1565C0]/5 text-[#1565C0]" : "border-gray-300 text-[#0F1B2D] hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-2">Integration</label>
                <select
                  value={selectedIntegration}
                  onChange={(e) => setSelectedIntegration(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                >
                  <option value="all">All Integrations</option>
                  {integrations.map(integration => (
                    <option key={integration.id} value={integration.id}>
                      {integration.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-2">Action</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>
                      {getActionLabel(action)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#64748B] mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#64748B]">Total Logs</div>
              <Activity size={18} className="text-[#64748B]" />
            </div>
            <div className="text-2xl font-semibold text-[#0F1B2D]">
              {filteredLogs.length}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#64748B]">Successful</div>
              <CheckCircle2 size={18} className="text-green-500" />
            </div>
            <div className="text-2xl font-semibold text-green-600">
              {filteredLogs.filter(l => l.status === 'success').length}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#64748B]">Failed</div>
              <XCircle size={18} className="text-red-500" />
            </div>
            <div className="text-2xl font-semibold text-red-600">
              {filteredLogs.filter(l => l.status === 'failed').length}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#64748B]">Pending</div>
              <Clock size={18} className="text-yellow-500" />
            </div>
            <div className="text-2xl font-semibold text-yellow-600">
              {filteredLogs.filter(l => l.status === 'pending').length}
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#64748B]">Loading logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-[#0F1B2D] mb-2">No logs found</h3>
              <p className="text-sm text-[#64748B] mb-6">
                {searchTerm || selectedIntegration !== 'all' || selectedAction !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Integration activity will appear here'
                }
              </p>
              {(searchTerm || selectedIntegration !== 'all' || selectedAction !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedIntegration('all');
                    setSelectedAction('all');
                    setSelectedStatus('all');
                  }}
                  className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Integration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#0F1B2D]">
                          {log.integrationName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#64748B] max-w-md truncate">
                          {log.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#64748B]">
                          {formatDuration(log.duration)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#64748B] whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
