import React, { useState } from "react";
import { Save, Plug, Key, Webhook, Copy, Eye, EyeOff, Plus } from "lucide-react";

export function APIIntegrations() {
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production API", key: "sk_live_••••••••••••••••", created: "2024-01-15", lastUsed: "2024-04-01" },
    { id: "2", name: "Development API", key: "sk_test_••••••••••••••••", created: "2024-02-10", lastUsed: "2024-03-28" },
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: "1", url: "https://example.com/webhook", events: ["tenant.created", "license.expired"], active: true },
    { id: "2", url: "https://api.partner.com/hook", events: ["payment.failed"], active: true },
  ]);

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#212121] mb-1">API & Integrations</h2>
            <p className="text-sm text-[#616161]">Manage API keys, webhooks, and third-party integrations</p>
          </div>
          <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white hover:bg-[#0D47A1] flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">API Keys</h3>
            </div>
            <button className="h-9 px-4 rounded-md border border-[#1565C0] text-[#1565C0] hover:bg-[#E3F2FD] text-sm flex items-center gap-2">
              <Plus size={14} /> Create New Key
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="border border-[#E0E0E0] rounded-md p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-[#212121] mb-1">{key.name}</h4>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-[#F5F5F5] px-2 py-1 rounded font-mono">{key.key}</code>
                      <button className="text-[#1565C0] hover:text-[#0D47A1]" title="Copy">
                        <Copy size={14} />
                      </button>
                      <button className="text-[#616161] hover:text-[#212121]" title="Show full key">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                  <button className="text-sm text-[#C62828] hover:underline">Revoke</button>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#616161]">
                  <span>Created: {key.created}</span>
                  <span>•</span>
                  <span>Last used: {key.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-[#E3F2FD] rounded-md p-3 text-sm text-[#1565C0]">
            <strong>Note:</strong> Keep your API keys secure. Never share them publicly or commit them to version control.
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Webhook size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Webhooks</h3>
            </div>
            <button className="h-9 px-4 rounded-md border border-[#1565C0] text-[#1565C0] hover:bg-[#E3F2FD] text-sm flex items-center gap-2">
              <Plus size={14} /> Add Webhook
            </button>
          </div>

          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="border border-[#E0E0E0] rounded-md p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono text-[#212121]">{webhook.url}</code>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        webhook.active ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#F5F5F5] text-[#616161]"
                      }`}>
                        {webhook.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <span key={event} className="px-2 py-0.5 bg-[#F5F5F5] text-xs rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-[#1565C0] hover:underline">Edit</button>
                    <button className="text-sm text-[#C62828] hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Third-Party Integrations */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plug size={18} className="text-[#1565C0]" />
            <h3 className="font-semibold text-[#212121]">Third-Party Integrations</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Slack", connected: true, logo: "💬" },
              { name: "Microsoft Teams", connected: false, logo: "👥" },
              { name: "Zapier", connected: true, logo: "⚡" },
              { name: "Google Workspace", connected: false, logo: "🔷" },
              { name: "Salesforce", connected: false, logo: "☁️" },
              { name: "HubSpot", connected: false, logo: "🔶" },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-3 border border-[#E0E0E0] rounded-md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.logo}</span>
                  <span className="text-sm font-medium text-[#212121]">{integration.name}</span>
                </div>
                {integration.connected ? (
                  <button className="text-xs text-[#C62828] hover:underline">Disconnect</button>
                ) : (
                  <button className="text-xs text-[#1565C0] hover:underline">Connect</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
