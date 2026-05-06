import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useOmniStore } from "../../../store";
import {
  ArrowLeft, Plus, Webhook, Edit, Trash2, Power, CheckCircle2,
  XCircle, Activity, AlertCircle, TrendingUp, Settings, Eye
} from "lucide-react";
import type { Webhook as WebhookType } from "../../../store/types";

export function WebhooksManagement() {
  const navigate = useNavigate();
  const { getWebhooks, createWebhook, updateWebhook, deleteWebhook, toggleWebhook } = useOmniStore();

  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookType | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookType | null>(null);

  // Form state
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [maxRetries, setMaxRetries] = useState(3);
  const [backoffMultiplier, setBackoffMultiplier] = useState(2);
  const [customHeaders, setCustomHeaders] = useState<Record<string, string>>({});
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');

  const availableEvents = [
    'lead.created', 'lead.updated', 'lead.deleted',
    'deal.created', 'deal.updated', 'deal.won', 'deal.lost',
    'contact.created', 'contact.updated', 'contact.deleted',
    'campaign.started', 'campaign.completed',
    'ai_call.completed', 'ai_call.failed',
    'integration.connected', 'integration.sync_completed'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (webhook?: WebhookType) => {
    if (webhook) {
      setEditingWebhook(webhook);
      setWebhookName(webhook.name);
      setWebhookUrl(webhook.url);
      setSelectedEvents(webhook.events);
      setMaxRetries(webhook.retryPolicy.maxRetries);
      setBackoffMultiplier(webhook.retryPolicy.backoffMultiplier);
      setCustomHeaders(webhook.headers || {});
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const webhookData = {
        name: webhookName,
        url: webhookUrl,
        events: selectedEvents,
        retryPolicy: {
          maxRetries,
          backoffMultiplier
        },
        headers: Object.keys(customHeaders).length > 0 ? customHeaders : undefined
      };

      if (editingWebhook) {
        await updateWebhook(editingWebhook.id, webhookData);
      } else {
        await createWebhook(webhookData);
      }

      await loadData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save webhook:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedWebhook) return;
    try {
      await deleteWebhook(selectedWebhook.id, 'Deleted by user');
      await loadData();
      setShowDeleteModal(false);
      setSelectedWebhook(null);
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const handleToggle = async (webhook: WebhookType) => {
    try {
      await toggleWebhook(webhook.id);
      await loadData();
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  };

  const resetForm = () => {
    setEditingWebhook(null);
    setWebhookName('');
    setWebhookUrl('');
    setSelectedEvents([]);
    setMaxRetries(3);
    setBackoffMultiplier(2);
    setCustomHeaders({});
    setNewHeaderKey('');
    setNewHeaderValue('');
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setCustomHeaders(prev => ({ ...prev, [newHeaderKey]: newHeaderValue }));
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    setCustomHeaders(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getSuccessRate = (webhook: WebhookType) => {
    const total = webhook.successCount + webhook.failureCount;
    if (total === 0) return 0;
    return Math.round((webhook.successCount / total) * 100);
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
                <h1 className="font-semibold text-[#0F1B2D]">Webhooks</h1>
                <p className="text-sm text-[#64748B]">
                  Configure webhooks for real-time event notifications
                </p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Create Webhook
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Webhooks List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#1565C0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#64748B]">Loading webhooks...</p>
            </div>
          ) : webhooks.length === 0 ? (
            <div className="p-12 text-center">
              <Webhook size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-[#0F1B2D] mb-2">No webhooks configured</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Create your first webhook to receive real-time event notifications
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="h-10 px-5 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
              >
                Create Webhook
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        webhook.isActive ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Webhook size={24} className={webhook.isActive ? 'text-green-600' : 'text-gray-600'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-[#0F1B2D]">{webhook.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            webhook.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {webhook.isActive ? (
                              <>
                                <CheckCircle2 size={12} />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle size={12} />
                                Disabled
                              </>
                            )}
                          </span>
                        </div>
                        <div className="text-sm text-[#64748B] mb-3">
                          <code className="px-2 py-1 bg-gray-100 rounded text-xs">{webhook.url}</code>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1">
                            <Activity size={14} />
                            {webhook.events.length} events
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={14} className="text-green-500" />
                            {webhook.successCount} success
                          </span>
                          <span className="flex items-center gap-1">
                            <XCircle size={14} className="text-red-500" />
                            {webhook.failureCount} failed
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            {getSuccessRate(webhook)}% success rate
                          </span>
                        </div>
                        {webhook.lastTriggeredAt && (
                          <div className="text-xs text-[#64748B] mt-2">
                            Last triggered: {formatDate(webhook.lastTriggeredAt)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(webhook)}
                        className={`p-2 rounded-lg transition-colors ${
                          webhook.isActive
                            ? 'hover:bg-gray-200 text-[#64748B]'
                            : 'hover:bg-green-50 text-green-600'
                        }`}
                        title={webhook.isActive ? 'Disable' : 'Enable'}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(webhook)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-[#64748B]"
                        title="Edit webhook"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWebhook(webhook);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        title="Delete webhook"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Events */}
                  <div className="ml-16">
                    <div className="text-xs font-medium text-[#64748B] mb-2">Subscribed Events</div>
                    <div className="flex flex-wrap gap-1.5">
                      {webhook.events.slice(0, 6).map((event) => (
                        <span
                          key={event}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs"
                        >
                          {event}
                        </span>
                      ))}
                      {webhook.events.length > 6 && (
                        <span className="px-2 py-1 rounded bg-gray-100 text-xs text-[#64748B]">
                          +{webhook.events.length - 6} more
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#64748B] mt-2">
                      Retry policy: {webhook.retryPolicy.maxRetries} attempts, {webhook.retryPolicy.backoffMultiplier}x backoff
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Webhook Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-[#0F1B2D]">
                  {editingWebhook ? 'Edit Webhook' : 'Create Webhook'}
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  {editingWebhook
                    ? 'Update webhook configuration'
                    : 'Configure a new webhook endpoint for event notifications'
                  }
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Webhook Name *
                  </label>
                  <input
                    type="text"
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
                    required
                    placeholder="e.g., Lead Notifications"
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Endpoint URL *
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    required
                    placeholder="https://your-domain.com/webhooks/omnicrm"
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Events *
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    <div className="space-y-2">
                      {availableEvents.map((event) => (
                        <label
                          key={event}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event)}
                            onChange={() => toggleEvent(event)}
                            className="w-4 h-4 rounded border-gray-300 text-[#1565C0] focus:ring-[#1565C0]"
                          />
                          <span className="text-sm text-[#0F1B2D]">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    {selectedEvents.length} event(s) selected
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                      Max Retries
                    </label>
                    <select
                      value={maxRetries}
                      onChange={(e) => setMaxRetries(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                    >
                      <option value={0}>No retries</option>
                      <option value={1}>1 retry</option>
                      <option value={2}>2 retries</option>
                      <option value={3}>3 retries</option>
                      <option value={5}>5 retries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                      Backoff Multiplier
                    </label>
                    <select
                      value={backoffMultiplier}
                      onChange={(e) => setBackoffMultiplier(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                    >
                      <option value={1}>1x (no backoff)</option>
                      <option value={2}>2x</option>
                      <option value={3}>3x</option>
                      <option value={5}>5x</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F1B2D] mb-2">
                    Custom Headers (optional)
                  </label>
                  <div className="space-y-2">
                    {Object.entries(customHeaders).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <code className="flex-1 text-xs text-[#0F1B2D]">{key}: {value}</code>
                        <button
                          type="button"
                          onClick={() => removeHeader(key)}
                          className="p-1 hover:bg-gray-200 rounded text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newHeaderKey}
                        onChange={(e) => setNewHeaderKey(e.target.value)}
                        placeholder="Header name"
                        className="flex-1 h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={newHeaderValue}
                        onChange={(e) => setNewHeaderValue(e.target.value)}
                        placeholder="Header value"
                        className="flex-1 h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addHeader}
                        disabled={!newHeaderKey || !newHeaderValue}
                        className="h-9 px-4 rounded-lg bg-gray-100 text-sm font-medium text-[#0F1B2D] hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="h-11 px-6 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!webhookName || !webhookUrl || selectedEvents.length === 0}
                  className="h-11 px-6 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingWebhook ? 'Save Changes' : 'Create Webhook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedWebhook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F1B2D] mb-1">Delete Webhook</h3>
                <p className="text-sm text-[#64748B]">
                  Are you sure you want to delete "{selectedWebhook.name}"? This action cannot be undone and will stop all event notifications to this endpoint.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedWebhook(null);
                }}
                className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-medium text-[#0F1B2D] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
