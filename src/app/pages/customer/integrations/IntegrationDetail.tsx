import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useOmniStore } from "../../../store";
import {
  ArrowLeft, Settings, Zap, CheckCircle2, XCircle, Clock,
  Activity, RefreshCw, Power, Trash2, ExternalLink, Key,
  Calendar, TrendingUp, AlertCircle, Info
} from "lucide-react";
import type { Integration, IntegrationLog } from "../../../store/types";

export function IntegrationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getIntegration, disconnectIntegration, syncIntegration, getIntegrationLogs } = useOmniStore();

  const [integration, setIntegration] = useState<Integration | null>(null);
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [integrationData, logsData] = await Promise.all([
        getIntegration(id as any),
        getIntegrationLogs(id as any)
      ]);
      setIntegration(integrationData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!integration) return;
    setSyncing(true);
    try {
      await syncIntegration(integration.id);
      await loadData();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!integration) return;
    try {
      await disconnectIntegration(integration.id, 'User requested disconnection');
      navigate('/tenant/integrations');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      configuring: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };

    const icons = {
      active: <CheckCircle2 size={14} />,
      inactive: <XCircle size={14} />,
      error: <AlertCircle size={14} />,
      configuring: <Clock size={14} />
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLogStatusIcon = (status: string) => {
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

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin text-[#1565C0]" size={40} />
          <p className="text-sm text-[#64748B]">Loading integration...</p>
        </div>
      </div>
    );
  }

  if (!integration) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="font-semibold text-[#0F1B2D] mb-2">Integration not found</h2>
          <button
            onClick={() => navigate('/tenant/integrations')}
            className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
          >
            Back to Integrations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/tenant/integrations')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-[#64748B]" />
            </button>
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-4xl">
              {integration.logoUrl}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-semibold text-[#0F1B2D]">{integration.name}</h1>
                {getStatusBadge(integration.status)}
                {integration.isPremium && (
                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-[#64748B]">{integration.provider} • {integration.category}</p>
            </div>
            <div className="flex items-center gap-2">
              {integration.isActive ? (
                <>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                    {syncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button
                    onClick={() => navigate(`/tenant/integrations/${id}/configure`)}
                    className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Settings size={18} />
                    Configure
                  </button>
                  <button
                    onClick={() => setShowDisconnectModal(true)}
                    className="h-10 px-5 rounded-lg border border-red-300 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Power size={18} />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(`/tenant/integrations/${id}/configure`)}
                  className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
                >
                  <Zap size={18} />
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Overview Card */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-[#0F1B2D] mb-4">Overview</h2>
            <p className="text-sm text-[#64748B] mb-6">{integration.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs text-[#64748B] mb-1">Authentication</div>
                <div className="text-sm font-medium text-[#0F1B2D] flex items-center gap-2">
                  <Key size={14} className="text-[#64748B]" />
                  {integration.authType.toUpperCase().replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#64748B] mb-1">Connected</div>
                <div className="text-sm font-medium text-[#0F1B2D] flex items-center gap-2">
                  <Calendar size={14} className="text-[#64748B]" />
                  {formatDate(integration.connectedAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#64748B] mb-1">Last Sync</div>
                <div className="text-sm font-medium text-[#0F1B2D] flex items-center gap-2">
                  <RefreshCw size={14} className="text-[#64748B]" />
                  {formatDate(integration.lastSyncedAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#64748B] mb-1">Rate Limit</div>
                <div className="text-sm font-medium text-[#0F1B2D] flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#64748B]" />
                  {integration.rateLimit?.requests || 'N/A'} / {integration.rateLimit?.period || 'N/A'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0F1B2D] mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {integration.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-[#0F1B2D] mb-4">Statistics</h2>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-green-700">Successful Syncs</span>
                  <CheckCircle2 size={16} className="text-green-600" />
                </div>
                <div className="text-2xl font-semibold text-green-700">
                  {logs.filter(l => l.status === 'success' && l.action === 'sync').length}
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-red-700">Failed Operations</span>
                  <XCircle size={16} className="text-red-600" />
                </div>
                <div className="text-2xl font-semibold text-red-700">
                  {logs.filter(l => l.status === 'failed').length}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-700">Total Activity</span>
                  <Activity size={16} className="text-blue-600" />
                </div>
                <div className="text-2xl font-semibold text-blue-700">
                  {logs.length}
                </div>
              </div>
            </div>

            {integration.metadata?.documentationUrl && (
              <a
                href={integration.metadata.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-sm text-[#1565C0] hover:underline"
              >
                <ExternalLink size={16} />
                View Documentation
              </a>
            )}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-[#0F1B2D]">Activity Log</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="p-12 text-center">
                <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-[#64748B]">No activity yet</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getLogStatusIcon(log.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <div className="text-sm font-medium text-[#0F1B2D] mb-1">
                            {log.action.replace('_', ' ').charAt(0).toUpperCase() + log.action.slice(1).replace('_', ' ')}
                          </div>
                          <div className="text-sm text-[#64748B]">{log.message}</div>
                        </div>
                        <div className="text-xs text-[#64748B] whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </div>
                      </div>
                      {log.duration && (
                        <div className="text-xs text-[#64748B]">
                          Duration: {(log.duration / 1000).toFixed(2)}s
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F1B2D] mb-1">Disconnect Integration</h3>
                <p className="text-sm text-[#64748B]">
                  Are you sure you want to disconnect {integration.name}? This will stop all syncing and data exchange.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnect}
                className="h-10 px-5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
