import { useState } from "react";
import { useWhatsAppAPI } from "../../hooks/useWhatsAppAPI";
import { ArrowLeft, Plus, Copy, RefreshCw, Trash2, Key, Webhook, Activity, TrendingUp, CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import { useNavigate } from "react-router";

export function WhatsAppAPI() {
  const navigate = useNavigate();
  const {
    apiKeys,
    webhooks,
    webhookEvents,
    usage,
    availableEvents,
    createAPIKey,
    revokeAPIKey,
    deleteAPIKey,
    regenerateAPIKey,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    toggleWebhookStatus,
    regenerateWebhookSecret,
    testWebhook
  } = useWhatsAppAPI();

  const [activeTab, setActiveTab] = useState<"api-keys" | "webhooks" | "events" | "usage">("api-keys");
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateAPIKey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createAPIKey({
      name: formData.get("name") as string,
      environment: formData.get("environment") as "production" | "sandbox",
      status: "active",
      permissions: Array.from(formData.getAll("permissions")) as string[],
      createdBy: "current-user@company.com",
      rateLimit: {
        requestsPerMinute: parseInt(formData.get("requestsPerMinute") as string),
        requestsPerDay: parseInt(formData.get("requestsPerDay") as string)
      }
    });

    setShowAPIKeyModal(false);
  };

  const handleCreateOrUpdateWebhook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const webhookData = {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      events: Array.from(formData.getAll("events")) as string[],
      status: "active" as const,
      retryConfig: {
        maxRetries: parseInt(formData.get("maxRetries") as string),
        retryDelay: parseInt(formData.get("retryDelay") as string)
      },
      headers: []
    };

    if (editingWebhook) {
      updateWebhook(editingWebhook, webhookData);
      setEditingWebhook(null);
    } else {
      createWebhook(webhookData);
    }

    setShowWebhookModal(false);
  };

  const handleTestWebhook = async (webhookId: string) => {
    const result = await testWebhook(webhookId);
    if (result) {
      alert(`Webhook test successful! Response: ${result.responseCode} (${result.responseTime}ms)`);
    }
  };

  const activeKeys = apiKeys.filter(k => k.status === "active").length;
  const activeWebhooks = webhooks.filter(w => w.status === "active").length;
  const totalRequests = usage.reduce((sum, day) => sum + day.requests, 0);
  const avgSuccessRate = usage.length > 0
    ? (usage.reduce((sum, day) => sum + (day.successful / day.requests * 100), 0) / usage.length).toFixed(1)
    : "0";

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/whatsapp")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">API & Webhooks</h1>
              <p className="text-sm text-gray-500">Manage API keys, webhooks, and monitor usage</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">Active API Keys</span>
            </div>
            <div className="text-2xl font-semibold">{activeKeys}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Webhook className="w-4 h-4" />
              <span className="text-sm font-medium">Active Webhooks</span>
            </div>
            <div className="text-2xl font-semibold">{activeWebhooks}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Total Requests (7d)</span>
            </div>
            <div className="text-2xl font-semibold">{totalRequests.toLocaleString()}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-semibold">{avgSuccessRate}%</div>
          </div>
        </div>
      </div>

      <div className="border-b bg-white px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("api-keys")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "api-keys"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab("webhooks")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "webhooks"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "events"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Webhook Events
          </button>
          <button
            onClick={() => setActiveTab("usage")}
            className={`px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === "usage"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            API Usage
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {activeTab === "api-keys" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">API Keys</h2>
              <button
                onClick={() => setShowAPIKeyModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create API Key
              </button>
            </div>

            <div className="space-y-4">
              {apiKeys.map(key => (
                <div key={key.id} className="bg-white rounded-lg border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{key.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          key.environment === "production"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {key.environment}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          key.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {key.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Created by {key.createdBy}</p>
                      <p className="text-xs text-gray-400">Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                      {key.lastUsedAt && (
                        <p className="text-xs text-gray-400">Last used: {new Date(key.lastUsedAt).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {key.status === "active" && (
                        <>
                          <button
                            onClick={() => {
                              const newKey = regenerateAPIKey(key.id);
                              alert(`New API key generated: ${newKey}`);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Regenerate"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to revoke this API key?")) {
                                revokeAPIKey(key.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Revoke"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this API key?")) {
                            deleteAPIKey(key.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">{key.key}</code>
                      <button
                        onClick={() => copyToClipboard(key.key, key.id)}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        {copiedKey === key.id ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Usage Count:</span>
                      <span className="ml-2 font-medium">{key.usageCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rate Limit:</span>
                      <span className="ml-2 font-medium">{key.rateLimit.requestsPerMinute}/min</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Daily Limit:</span>
                      <span className="ml-2 font-medium">{key.rateLimit.requestsPerDay.toLocaleString()}/day</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-500">Permissions:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {key.permissions.map(perm => (
                        <span key={perm} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "webhooks" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Webhooks</h2>
              <button
                onClick={() => {
                  setEditingWebhook(null);
                  setShowWebhookModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Webhook
              </button>
            </div>

            <div className="space-y-4">
              {webhooks.map(webhook => (
                <div key={webhook.id} className="bg-white rounded-lg border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{webhook.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          webhook.status === "active"
                            ? "bg-green-100 text-green-700"
                            : webhook.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {webhook.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{webhook.url}</p>
                      <p className="text-xs text-gray-400 mt-1">Created: {new Date(webhook.createdAt).toLocaleDateString()}</p>
                      {webhook.lastTriggeredAt && (
                        <p className="text-xs text-gray-400">Last triggered: {new Date(webhook.lastTriggeredAt).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleWebhookStatus(webhook.id)}
                        className={`p-2 rounded transition-colors ${
                          webhook.status === "active"
                            ? "text-yellow-600 hover:bg-yellow-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={webhook.status === "active" ? "Deactivate" : "Activate"}
                      >
                        {webhook.status === "active" ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleTestWebhook(webhook.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Test Webhook"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this webhook?")) {
                            deleteWebhook(webhook.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Webhook Secret</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(webhook.secret, `secret-${webhook.id}`)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedKey === `secret-${webhook.id}` ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            const newSecret = regenerateWebhookSecret(webhook.id);
                            alert(`New secret generated: ${newSecret}`);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <code className="text-sm font-mono">{webhook.secret}</code>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Success Count:</span>
                      <span className="ml-2 font-medium text-green-600">{webhook.successCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Failure Count:</span>
                      <span className="ml-2 font-medium text-red-600">{webhook.failureCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Retries:</span>
                      <span className="ml-2 font-medium">{webhook.retryConfig.maxRetries}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Retry Delay:</span>
                      <span className="ml-2 font-medium">{webhook.retryConfig.retryDelay}s</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <span className="text-sm text-gray-500">Subscribed Events:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {webhook.events.map(event => (
                        <span key={event} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  {webhook.headers.length > 0 && (
                    <div className="pt-3 border-t mt-3">
                      <span className="text-sm text-gray-500">Custom Headers:</span>
                      <div className="mt-2 space-y-1">
                        {webhook.headers.map((header, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">{header.key}:</span>
                            <span className="ml-2 text-gray-600">{header.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {webhook.lastError && (
                    <div className="pt-3 border-t mt-3">
                      <span className="text-sm text-red-600">Last Error:</span>
                      <p className="text-sm text-gray-600 mt-1">{webhook.lastError}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Webhook Event Log</h2>
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Webhook</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {webhookEvents.map(event => {
                    const webhook = webhooks.find(w => w.id === event.webhookId);
                    return (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {webhook?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                            {event.event}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${
                            event.status === "success"
                              ? "bg-green-100 text-green-700"
                              : event.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : event.status === "retrying"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {event.responseCode && (
                            <span className={event.responseCode >= 200 && event.responseCode < 300 ? "text-green-600" : "text-red-600"}>
                              {event.responseCode}
                            </span>
                          )}
                          {event.responseTime && (
                            <span className="text-gray-500 ml-2">({event.responseTime}ms)</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {event.attempts}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "usage" && (
          <div>
            <h2 className="text-lg font-semibold mb-6">API Usage (Last 7 Days)</h2>
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Requests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Successful</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Response Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usage.map(day => {
                    const successRate = ((day.successful / day.requests) * 100).toFixed(1);
                    return (
                      <tr key={day.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {day.requests.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600">
                          {day.successful.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-red-600">
                          {day.failed.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${successRate}%` }}
                              />
                            </div>
                            <span className="text-gray-900">{successRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {day.avgResponseTime}ms
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAPIKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create API Key</h2>
            <form onSubmit={handleCreateAPIKey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="My API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Environment</label>
                <select name="environment" required className="w-full px-3 py-2 border rounded-lg">
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Requests per Minute</label>
                  <input
                    type="number"
                    name="requestsPerMinute"
                    required
                    defaultValue={20}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Requests per Day</label>
                  <input
                    type="number"
                    name="requestsPerDay"
                    required
                    defaultValue={5000}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="space-y-2">
                  {["messages:read", "messages:write", "campaigns:read", "campaigns:write", "leads:read", "leads:write", "webhooks:manage"].map(perm => (
                    <label key={perm} className="flex items-center gap-2">
                      <input type="checkbox" name="permissions" value={perm} className="rounded" />
                      <span className="text-sm">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
                >
                  Create API Key
                </button>
                <button
                  type="button"
                  onClick={() => setShowAPIKeyModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingWebhook ? "Edit Webhook" : "Create Webhook"}
            </h2>
            <form onSubmit={handleCreateOrUpdateWebhook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Webhook Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingWebhook ? webhooks.find(w => w.id === editingWebhook)?.name : ""}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="My Webhook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Webhook URL</label>
                <input
                  type="url"
                  name="url"
                  required
                  defaultValue={editingWebhook ? webhooks.find(w => w.id === editingWebhook)?.url : ""}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://api.example.com/webhooks/whatsapp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Retries</label>
                  <input
                    type="number"
                    name="maxRetries"
                    required
                    defaultValue={editingWebhook ? webhooks.find(w => w.id === editingWebhook)?.retryConfig.maxRetries : 3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Retry Delay (seconds)</label>
                  <input
                    type="number"
                    name="retryDelay"
                    required
                    defaultValue={editingWebhook ? webhooks.find(w => w.id === editingWebhook)?.retryConfig.retryDelay : 60}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subscribe to Events</label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {availableEvents.map(event => {
                    const webhook = editingWebhook ? webhooks.find(w => w.id === editingWebhook) : null;
                    return (
                      <label key={event} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="events"
                          value={event}
                          defaultChecked={webhook?.events.includes(event)}
                          className="rounded"
                        />
                        <span className="text-sm">{event}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
                >
                  {editingWebhook ? "Update Webhook" : "Create Webhook"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWebhookModal(false);
                    setEditingWebhook(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
