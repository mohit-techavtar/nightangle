import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOmniStore } from "../../../store";
import {
  Plug, Search, Grid3x3, List, TrendingUp, AlertCircle,
  CheckCircle2, Clock, XCircle, Plus, Settings, Activity,
  Zap, BarChart3, Key, Webhook
} from "lucide-react";
import type { Integration, IntegrationLog } from "../../../store/types";

export function IntegrationDashboard() {
  const navigate = useNavigate();
  const { getIntegrations, getIntegrationLogs } = useOmniStore();

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [integrationsData, logsData] = await Promise.all([
        getIntegrations(),
        getIntegrationLogs()
      ]);
      setIntegrations(integrationsData);
      setLogs(logsData.slice(0, 4)); // Get latest 4 logs
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeIntegrations = integrations.filter(i => i.isActive);
  const failedIntegrations = integrations.filter(i => i.status === 'error');

  const formatLastSync = (date: Date | undefined) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'error': return <XCircle size={16} className="text-red-500" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-[#0F1B2D] mb-1">Integrations</h1>
              <p className="text-sm text-[#64748B]">
                Connect your favorite apps and automate workflows
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/tenant/integrations/api-keys")}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Key size={18} />
                API Keys
              </button>
              <button
                onClick={() => navigate("/tenant/integrations/webhooks")}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Webhook size={18} />
                Webhooks
              </button>
              <button
                onClick={() => navigate("/tenant/integrations/marketplace")}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Browse Integrations
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Plug size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">
              {integrations.length}
            </div>
            <div className="text-sm text-[#64748B]">Available Integrations</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">
              {activeIntegrations.length}
            </div>
            <div className="text-sm text-[#64748B]">Active Connections</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle size={24} className="text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">
              {failedIntegrations.length}
            </div>
            <div className="text-sm text-[#64748B]">Needs Attention</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#0F1B2D] mb-1">
              {logs.filter(l => l.action === 'sync' && l.status === 'success').length}
            </div>
            <div className="text-sm text-[#64748B]">Total Syncs Today</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate("/tenant/integrations/marketplace")}
            className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#1565C0] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plug size={20} className="text-blue-600" />
            </div>
            <div className="font-medium text-[#0F1B2D] mb-1">Browse Marketplace</div>
            <div className="text-xs text-[#64748B]">Discover new integrations</div>
          </button>

          <button
            onClick={() => navigate("/tenant/integrations/api-keys")}
            className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#1565C0] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Key size={20} className="text-green-600" />
            </div>
            <div className="font-medium text-[#0F1B2D] mb-1">Manage API Keys</div>
            <div className="text-xs text-[#64748B]">Configure API access</div>
          </button>

          <button
            onClick={() => navigate("/tenant/integrations/webhooks")}
            className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#1565C0] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Webhook size={20} className="text-purple-600" />
            </div>
            <div className="font-medium text-[#0F1B2D] mb-1">Configure Webhooks</div>
            <div className="text-xs text-[#64748B]">Set up event notifications</div>
          </button>

          <button
            onClick={() => navigate("/tenant/integrations/logs")}
            className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-[#1565C0] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 size={20} className="text-orange-600" />
            </div>
            <div className="font-medium text-[#0F1B2D] mb-1">View Activity Logs</div>
            <div className="text-xs text-[#64748B]">Monitor sync activity</div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Active Integrations */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0F1B2D]">Active Integrations</h2>
                <button
                  onClick={() => navigate("/tenant/integrations/active")}
                  className="text-sm text-[#1565C0] hover:underline"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {activeIntegrations.slice(0, 3).map((integration) => (
                <div
                  key={integration.id}
                  onClick={() => navigate(`/tenant/integrations/${integration.id}`)}
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                      {integration.logoUrl}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#0F1B2D] mb-1">{integration.name}</div>
                      <div className="text-xs text-[#64748B]">{integration.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs text-green-600 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Active
                      </div>
                      <div className="text-xs text-[#64748B]">
                        Synced {formatLastSync(integration.lastSyncedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#0F1B2D]">Recent Activity</h2>
                <button
                  onClick={() => navigate("/tenant/integrations/logs")}
                  className="text-sm text-[#1565C0] hover:underline"
                >
                  View Logs
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {logs.map((log, index) => (
                <div key={index} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                    <div className="flex-1">
                      <div className="text-sm text-[#0F1B2D] mb-1">{log.message}</div>
                      <div className="text-xs text-[#64748B]">{formatLastSync(log.timestamp)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
