import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { Save, MessageSquare, Bot, Shield, Bell, RefreshCw } from "lucide-react";

export function SMSSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS" },
          { label: "Settings" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">SMS Settings</h1>
              <p className="text-sm text-[#6B7280] mt-1">Configure your SMS integration and preferences</p>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>

          {/* SMS Provider */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={20} className="text-[#1565C0]" />
                <h3 className="text-lg font-semibold text-[#0F1B2D]">SMS Provider</h3>
              </div>
              <p className="text-sm text-[#6B7280]">Configure your SMS gateway provider</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Provider
                </label>
                <select className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent">
                  <option>Twilio</option>
                  <option>AWS SNS</option>
                  <option>MessageBird</option>
                  <option>Plivo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Account SID
                </label>
                <input
                  type="text"
                  defaultValue="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Auth Token
                </label>
                <input
                  type="password"
                  defaultValue="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  defaultValue="+1 234 567 8900"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#E5E7EB] transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Test Connection
              </button>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-2">
                <Bot size={20} className="text-[#1565C0]" />
                <h3 className="text-lg font-semibold text-[#0F1B2D]">AI Configuration</h3>
              </div>
              <p className="text-sm text-[#6B7280]">Configure AI-powered features</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Enable AI Auto-Reply</div>
                  <div className="text-sm text-[#6B7280] mt-1">Automatically respond to incoming messages</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Auto-Create Leads</div>
                  <div className="text-sm text-[#6B7280] mt-1">Create leads from new conversations</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Lead Enrichment</div>
                  <div className="text-sm text-[#6B7280] mt-1">Automatically enrich lead data from conversations</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  AI Response Delay (seconds)
                </label>
                <input
                  type="number"
                  defaultValue="2"
                  min="0"
                  max="10"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
                <p className="text-xs text-[#6B7280] mt-1">
                  Delay before AI sends automated responses (0-10 seconds)
                </p>
              </div>
            </div>
          </div>

          {/* Human Escalation */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={20} className="text-[#1565C0]" />
                <h3 className="text-lg font-semibold text-[#0F1B2D]">Human Escalation</h3>
              </div>
              <p className="text-sm text-[#6B7280]">Configure when to escalate to human agents</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Auto-Escalate on Request</div>
                  <div className="text-sm text-[#6B7280] mt-1">Transfer to human when customer requests</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Escalation Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  defaultValue="talk to agent, speak to human, need help, support"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-2">
                <Bell size={20} className="text-[#1565C0]" />
                <h3 className="text-lg font-semibold text-[#0F1B2D]">Notifications</h3>
              </div>
              <p className="text-sm text-[#6B7280]">Manage notification preferences</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">New Message Notifications</div>
                  <div className="text-sm text-[#6B7280] mt-1">Get notified of incoming messages</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Campaign Status Updates</div>
                  <div className="text-sm text-[#6B7280] mt-1">Get updates on campaign performance</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Failure Alerts</div>
                  <div className="text-sm text-[#6B7280] mt-1">Get alerted when messages fail to deliver</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
