import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { Settings as SettingsIcon, Save, RefreshCw, MessageCircle, Shield, Bell, Bot } from "lucide-react";

export function WhatsAppSettings() {
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
          { label: "WhatsApp" },
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">WhatsApp Settings</h1>
              <p className="text-sm text-[#6B7280] mt-1">Configure your WhatsApp integration</p>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>

          {/* WhatsApp Business Account */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle size={20} className="text-[#1565C0]" />
                <h3 className="text-lg font-semibold text-[#0F1B2D]">WhatsApp Business Account</h3>
              </div>
              <p className="text-sm text-[#6B7280]">Connect and configure your WhatsApp Business API account</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  defaultValue="102476589321456"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  WhatsApp Business Account ID
                </label>
                <input
                  type="text"
                  defaultValue="178965432109876"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  defaultValue="EAAxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#E5E7EB] transition-colors flex items-center gap-2">
                  <RefreshCw size={16} />
                  Test Connection
                </button>
                <span className="flex items-center gap-2 text-sm text-[#10B981]">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-2">
                <Bot size={20} className="text-[#1565C0]" />
                <h3 className="text-lg font-semibold text-[#0F1B2D]">AI Configuration</h3>
              </div>
              <p className="text-sm text-[#6B7280]">Configure AI-driven conversation handling</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Enable AI Responses</div>
                  <div className="text-sm text-[#6B7280] mt-1">Let AI handle incoming messages automatically</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Auto-Create Leads</div>
                  <div className="text-sm text-[#6B7280] mt-1">Automatically create leads from new conversations</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  AI Confidence Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                  <span>Low (0%)</span>
                  <span>Medium (50%)</span>
                  <span>High (100%)</span>
                </div>
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
              <p className="text-sm text-[#6B7280]">Configure when to escalate conversations to human agents</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Auto-Escalate on Request</div>
                  <div className="text-sm text-[#6B7280] mt-1">Escalate when customer asks for human agent</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Escalate on Low Confidence</div>
                  <div className="text-sm text-[#6B7280] mt-1">Transfer to human when AI confidence is low</div>
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
                  defaultValue="speak to human, talk to agent, need help, support"
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
                  <div className="text-sm text-[#6B7280] mt-1">Get notified when new messages arrive</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1565C0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E7EB] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1565C0]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F1B2D]">Escalation Alerts</div>
                  <div className="text-sm text-[#6B7280] mt-1">Notify when conversations are escalated</div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
