import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useOmniStore } from "../../../store";
import {
  ArrowLeft, Key, Lock, CheckCircle2, AlertCircle, Info,
  ExternalLink, Eye, EyeOff, Copy, Check
} from "lucide-react";
import type { Integration } from "../../../store/types";

export function IntegrationConfiguration() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getIntegration, connectIntegration, updateIntegrationConfig } = useOmniStore();

  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState(15);
  const [webhooksEnabled, setWebhooksEnabled] = useState(true);
  const [autoRetry, setAutoRetry] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(3);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getIntegration(id as any);
      setIntegration(data);

      // Load existing config
      if (data?.settings) {
        setSyncEnabled(data.settings.syncEnabled ?? true);
        setSyncInterval(data.settings.syncInterval ?? 15);
        setWebhooksEnabled(data.settings.webhooksEnabled ?? true);
        setAutoRetry(data.settings.autoRetry ?? true);
        setRetryAttempts(data.settings.retryAttempts ?? 3);
      }

      if (data?.credentials) {
        setApiKey(data.credentials.apiKey || '');
        setApiSecret(data.credentials.apiSecret || '');
      }
    } catch (error) {
      console.error('Failed to load integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!integration) return;

    setSaving(true);
    try {
      const credentials = integration.authType === 'api_key'
        ? { apiKey, apiSecret }
        : {};

      await connectIntegration(integration.id, credentials);

      // Update settings
      await updateIntegrationConfig(integration.id, {
        settings: {
          syncEnabled,
          syncInterval,
          webhooksEnabled,
          autoRetry,
          retryAttempts
        }
      });

      navigate(`/tenant/integrations/${id}`);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleOAuthConnect = () => {
    // In a real app, this would redirect to OAuth provider
    alert('OAuth flow would start here. Redirecting to provider...');
    // Simulate successful OAuth
    setTimeout(() => {
      if (integration) {
        connectIntegration(integration.id, {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token'
        });
        navigate(`/tenant/integrations/${id}`);
      }
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#64748B]">Loading configuration...</p>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/tenant/integrations/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-[#64748B]" />
            </button>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
              {integration.logoUrl}
            </div>
            <div>
              <h1 className="font-semibold text-[#0F1B2D]">
                Configure {integration.name}
              </h1>
              <p className="text-sm text-[#64748B]">
                {integration.isActive ? 'Update settings' : 'Connect your account'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Before you begin</h3>
            <p className="text-sm text-blue-700">
              {integration.authType === 'oauth2'
                ? `You'll be redirected to ${integration.provider} to authorize access. Make sure you have an account with ${integration.provider}.`
                : `You'll need your ${integration.provider} API credentials. You can find these in your ${integration.provider} account settings.`
              }
            </p>
            {integration.metadata?.documentationUrl && (
              <a
                href={integration.metadata.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
              >
                <ExternalLink size={14} />
                View Setup Guide
              </a>
            )}
          </div>
        </div>

        <form onSubmit={handleConnect} className="space-y-6">
          {/* Authentication Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-[#0F1B2D] mb-4 flex items-center gap-2">
              <Lock size={18} className="text-[#64748B]" />
              Authentication
            </h2>

            {integration.authType === 'oauth2' ? (
              <div>
                <p className="text-sm text-[#64748B] mb-4">
                  Click the button below to authorize OmniCRM to access your {integration.provider} account.
                </p>
                <button
                  type="button"
                  onClick={handleOAuthConnect}
                  className="h-12 px-6 rounded-lg bg-[#1565C0] text-white font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
                >
                  <Key size={18} />
                  Connect with {integration.provider}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    API Key *
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      required
                      placeholder="Enter your API key"
                      className="w-full h-11 px-4 pr-24 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {apiKey && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(apiKey)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-[#64748B]" />}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        {showApiKey ? <EyeOff size={16} className="text-[#64748B]" /> : <Eye size={16} className="text-[#64748B]" />}
                      </button>
                    </div>
                  </div>
                </div>

                {integration.authType === 'api_key' && (
                  <div>
                    <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                      API Secret
                      <span className="text-[#64748B] font-normal ml-1">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        placeholder="Enter your API secret"
                        className="w-full h-11 px-4 pr-12 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        {showSecret ? <EyeOff size={16} className="text-[#64748B]" /> : <Eye size={16} className="text-[#64748B]" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sync Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-[#0F1B2D] mb-4">Sync Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#0F1B2D]">Enable Auto Sync</div>
                  <div className="text-xs text-[#64748B]">Automatically sync data at regular intervals</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSyncEnabled(!syncEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    syncEnabled ? 'bg-[#1565C0]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      syncEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {syncEnabled && (
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Sync Interval (minutes)
                  </label>
                  <select
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  >
                    <option value={5}>Every 5 minutes</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every hour</option>
                    <option value={1440}>Daily</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#0F1B2D]">Enable Webhooks</div>
                  <div className="text-xs text-[#64748B]">Receive real-time updates via webhooks</div>
                </div>
                <button
                  type="button"
                  onClick={() => setWebhooksEnabled(!webhooksEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    webhooksEnabled ? 'bg-[#1565C0]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      webhooksEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#0F1B2D]">Auto Retry on Failure</div>
                  <div className="text-xs text-[#64748B]">Automatically retry failed operations</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRetry(!autoRetry)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoRetry ? 'bg-[#1565C0]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      autoRetry ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {autoRetry && (
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Max Retry Attempts
                  </label>
                  <select
                    value={retryAttempts}
                    onChange={(e) => setRetryAttempts(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  >
                    <option value={1}>1 attempt</option>
                    <option value={2}>2 attempts</option>
                    <option value={3}>3 attempts</option>
                    <option value={5}>5 attempts</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate(`/tenant/integrations/${id}`)}
              className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {integration.authType !== 'oauth2' && (
              <button
                type="submit"
                disabled={saving || !apiKey}
                className="h-11 px-6 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    {integration.isActive ? 'Save Changes' : 'Connect Integration'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
