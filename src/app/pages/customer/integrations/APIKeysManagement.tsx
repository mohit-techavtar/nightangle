import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOmniStore } from "../../../store";
import {
  ArrowLeft, Plus, Key, Copy, Check, Eye, EyeOff, Trash2,
  AlertCircle, CheckCircle2, Clock, XCircle
} from "lucide-react";
import type { APIKey } from "../../../store/types";

export function APIKeysManagement() {
  const navigate = useNavigate();
  const { getAPIKeys, createAPIKey, revokeAPIKey } = useOmniStore();

  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form state
  const [keyName, setKeyName] = useState('');
  const [environment, setEnvironment] = useState<'production' | 'sandbox'>('production');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [rateLimit, setRateLimit] = useState(1000);
  const [expiresIn, setExpiresIn] = useState<number>(0);

  const availablePermissions = [
    'leads:read', 'leads:write', 'leads:delete',
    'deals:read', 'deals:write', 'deals:delete',
    'contacts:read', 'contacts:write', 'contacts:delete',
    'campaigns:read', 'campaigns:write', 'campaigns:execute',
    'webhooks:manage', 'integrations:read'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAPIKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expiresAt = expiresIn > 0
        ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
        : undefined;

      await createAPIKey({
        name: keyName,
        environment,
        permissions: selectedPermissions,
        rateLimit,
        expiresAt
      });

      await loadData();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleRevokeKey = async () => {
    if (!selectedKey) return;
    try {
      await revokeAPIKey(selectedKey.id, 'Revoked by user');
      await loadData();
      setShowRevokeModal(false);
      setSelectedKey(null);
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const resetForm = () => {
    setKeyName('');
    setEnvironment('production');
    setSelectedPermissions([]);
    setRateLimit(1000);
    setExpiresIn(0);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const getStatusBadge = (key: APIKey) => {
    if (!key.isActive) {
      return (
        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1">
          <XCircle size={12} />
          Revoked
        </span>
      );
    }

    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
      return (
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium flex items-center gap-1">
          <Clock size={12} />
          Expired
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
        <CheckCircle2 size={12} />
        Active
      </span>
    );
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/tenant/integrations')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-[#64748B]" />
              </button>
              <div>
                <h1 className="font-semibold text-[#0F1B2D]">API Keys</h1>
                <p className="text-sm text-[#64748B]">
                  Manage API keys for external integrations
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Create API Key
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* API Keys List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#64748B]">Loading API keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="p-12 text-center">
              <Key size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-[#0F1B2D] mb-2">No API keys yet</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Create your first API key to start integrating with external systems
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Create API Key
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Key size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-[#0F1B2D]">{key.name}</h3>
                          {getStatusBadge(key)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            key.environment === 'production'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {key.environment}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#64748B] mb-3">
                          <span>Created {formatDate(key.createdAt)}</span>
                          {key.lastUsedAt && <span>Last used {formatDate(key.lastUsedAt)}</span>}
                          {key.expiresAt && (
                            <span>Expires {formatDate(key.expiresAt)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1.5 bg-gray-100 rounded text-xs font-mono text-[#0F1B2D]">
                            {visibleKeys[key.id] ? key.key : maskKey(key.key)}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                            title={visibleKeys[key.id] ? 'Hide key' : 'Show key'}
                          >
                            {visibleKeys[key.id] ? (
                              <EyeOff size={14} className="text-[#64748B]" />
                            ) : (
                              <Eye size={14} className="text-[#64748B]" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key, key.id)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedKey === key.id ? (
                              <Check size={14} className="text-green-600" />
                            ) : (
                              <Copy size={14} className="text-[#64748B]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    {key.isActive && (
                      <button
                        onClick={() => {
                          setSelectedKey(key);
                          setShowRevokeModal(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        title="Revoke key"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Permissions */}
                  <div className="ml-16">
                    <div className="text-xs font-medium text-[#64748B] mb-2">Permissions</div>
                    <div className="flex flex-wrap gap-1.5">
                      {key.permissions.slice(0, 5).map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 rounded bg-gray-100 text-xs text-[#0F1B2D]"
                        >
                          {permission}
                        </span>
                      ))}
                      {key.permissions.length > 5 && (
                        <span className="px-2 py-1 rounded bg-gray-100 text-xs text-[#64748B]">
                          +{key.permissions.length - 5} more
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#64748B] mt-2">
                      Rate limit: {key.rateLimit} requests/hour
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateKey}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-[#0F1B2D]">Create API Key</h2>
                <p className="text-sm text-[#64748B] mt-1">
                  Generate a new API key for external integrations
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Key Name *
                  </label>
                  <input
                    type="text"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    required
                    placeholder="e.g., Production Integration"
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Environment *
                  </label>
                  <div className="flex gap-3">
                    {(['production', 'sandbox'] as const).map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setEnvironment(env)}
                        className={`flex-1 h-11 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          environment === env
                            ? 'border-[#1565C0] bg-[#1565C0] text-white'
                            : 'border-gray-300 text-[#64748B] hover:border-[#1565C0] hover:text-[#1565C0]'
                        }`}
                      >
                        {env.charAt(0).toUpperCase() + env.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Permissions *
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {availablePermissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission)}
                            onChange={() => togglePermission(permission)}
                            className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                          />
                          <span className="text-sm text-[#0F1B2D]">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    {selectedPermissions.length} permission(s) selected
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Rate Limit (requests/hour)
                  </label>
                  <select
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  >
                    <option value={100}>100 requests/hour</option>
                    <option value={500}>500 requests/hour</option>
                    <option value={1000}>1,000 requests/hour</option>
                    <option value={5000}>5,000 requests/hour</option>
                    <option value={10000}>10,000 requests/hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Expiration
                  </label>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  >
                    <option value={0}>Never expires</option>
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!keyName || selectedPermissions.length === 0}
                  className="h-11 px-6 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {showRevokeModal && selectedKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F1B2D] mb-1">Revoke API Key</h3>
                <p className="text-sm text-[#64748B]">
                  Are you sure you want to revoke "{selectedKey.name}"? This action cannot be undone and will immediately invalidate the key.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRevokeModal(false);
                  setSelectedKey(null);
                }}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeKey}
                className="h-10 px-5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
