import React from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  MessageCircle, Send, TrendingUp, Users, Clock, CheckCheck,
  AlertCircle, Bot, UserPlus, Settings as SettingsIcon, Zap, Activity
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const messageVolumeData = [
  { hour: "00:00", inbound: 12, outbound: 8 },
  { hour: "03:00", inbound: 5, outbound: 3 },
  { hour: "06:00", inbound: 18, outbound: 12 },
  { hour: "09:00", inbound: 45, outbound: 67 },
  { hour: "12:00", inbound: 78, outbound: 92 },
  { hour: "15:00", inbound: 56, outbound: 43 },
  { hour: "18:00", inbound: 34, outbound: 28 },
  { hour: "21:00", inbound: 23, outbound: 15 },
];

const conversationStatusData = [
  { name: "Active", value: 234, color: "#10B981" },
  { name: "AI Handling", value: 156, color: "#3B82F6" },
  { name: "Escalated", value: 45, color: "#F59E0B" },
  { name: "Resolved", value: 89, color: "#6B7280" },
];

const activeCampaigns = [
  { name: "Summer Product Launch", sent: 4567, delivered: 4523, read: 3890, replied: 892, ctr: "19.7%" },
  { name: "Customer Feedback Survey", sent: 2341, delivered: 2298, read: 1876, replied: 567, ctr: "24.2%" },
  { name: "Abandoned Cart Recovery", sent: 1234, delivered: 1198, read: 987, replied: 234, ctr: "19.0%" },
];

const recentConversations = [
  { contact: "Rajesh Kumar", company: "Tech Solutions Ltd", lastMessage: "Yes, I'm interested in the premium plan", time: "2m ago", status: "AI", unread: 2 },
  { contact: "Priya Sharma", company: "Sharma Enterprises", lastMessage: "Can I speak to a human agent?", time: "5m ago", status: "Escalated", unread: 1 },
  { contact: "Amit Patel", company: "", lastMessage: "Thank you for the information!", time: "12m ago", status: "Resolved", unread: 0 },
  { contact: "+91 98765 43210", company: "", lastMessage: "What are your business hours?", time: "18m ago", status: "Active", unread: 3 },
];

export function WhatsAppDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "WhatsApp Dashboard" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">WhatsApp Command Center</h1>
              <p className="text-sm text-[#6B7280] mt-1">Monitor and manage all WhatsApp communications</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/tenant/whatsapp/campaigns/create")}
                className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                New Campaign
              </button>
              <button
                onClick={() => navigate("/tenant/whatsapp/settings")}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <SettingsIcon size={16} />
                Settings
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <MessageCircle size={20} className="text-[#1565C0]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+12.5%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">8,943</div>
              <div className="text-sm text-[#6B7280] mt-1">Total Conversations</div>
              <div className="text-xs text-[#9CA3AF] mt-2">Last 30 days</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <CheckCheck size={20} className="text-[#10B981]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+8.3%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">96.2%</div>
              <div className="text-sm text-[#6B7280] mt-1">Delivery Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">23,456 delivered today</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <Bot size={20} className="text-[#F59E0B]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+15.7%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">78%</div>
              <div className="text-sm text-[#6B7280] mt-1">AI Resolution Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">1,234 auto-resolved</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <UserPlus size={20} className="text-[#6366F1]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+24.1%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">342</div>
              <div className="text-sm text-[#6B7280] mt-1">Leads Created</div>
              <div className="text-xs text-[#9CA3AF] mt-2">Auto-captured this week</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message Volume Trend */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Message Volume (24h)</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Inbound vs Outbound messages</p>
                </div>
                <Activity size={20} className="text-[#9CA3AF]" />
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={messageVolumeData}>
                  <defs>
                    <linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="outbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                  />
                  <Area type="monotone" dataKey="inbound" stroke="#3B82F6" fillOpacity={1} fill="url(#inbound)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outbound" stroke="#10B981" fillOpacity={1} fill="url(#outbound)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                  <span className="text-sm text-[#6B7280]">Inbound</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                  <span className="text-sm text-[#6B7280]">Outbound</span>
                </div>
              </div>
            </div>

            {/* Conversation Status */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Conversation Status</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Current distribution</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={conversationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {conversationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {conversationStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-[#6B7280]">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#0F1B2D]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Active Campaigns</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Performance overview</p>
                </div>
                <button
                  onClick={() => navigate("/tenant/whatsapp/campaigns")}
                  className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1]"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Delivered</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Read</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Replied</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">CTR</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {activeCampaigns.map((campaign, index) => (
                    <tr key={index} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#0F1B2D]">{campaign.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{campaign.sent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{campaign.delivered.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{campaign.read.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{campaign.replied.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#10B981]">{campaign.ctr}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Recent Conversations</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Latest customer interactions</p>
                </div>
                <button
                  onClick={() => navigate("/tenant/whatsapp/inbox")}
                  className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1]"
                >
                  Open Inbox →
                </button>
              </div>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {recentConversations.map((conv, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  onClick={() => navigate("/tenant/whatsapp/conversations")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0F1B2D]">{conv.contact}</span>
                        {conv.company && <span className="text-sm text-[#9CA3AF]">• {conv.company}</span>}
                        {conv.unread > 0 && (
                          <span className="px-2 py-0.5 bg-[#1565C0] text-white text-xs font-semibold rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B7280] mt-1">{conv.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-[#9CA3AF]">{conv.time}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        conv.status === "AI" ? "bg-[#DBEAFE] text-[#1E40AF]" :
                        conv.status === "Escalated" ? "bg-[#FEF3C7] text-[#92400E]" :
                        conv.status === "Resolved" ? "bg-[#E5E7EB] text-[#374151]" :
                        "bg-[#D1FAE5] text-[#065F46]"
                      }`}>
                        {conv.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
