import React from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  MessageSquare, Send, TrendingUp, Users, Clock, CheckCheck, XCircle,
  Link2, Bot, UserPlus, Settings as SettingsIcon, Activity, ArrowUpRight
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const messageVolumeData = [
  { date: "Apr 10", sent: 1245, delivered: 1198, failed: 47 },
  { date: "Apr 11", sent: 1512, delivered: 1478, failed: 34 },
  { date: "Apr 12", sent: 1389, delivered: 1354, failed: 35 },
  { date: "Apr 13", sent: 1821, delivered: 1789, failed: 32 },
  { date: "Apr 14", sent: 1698, delivered: 1671, failed: 27 },
  { date: "Apr 15", sent: 1956, delivered: 1923, failed: 33 },
  { date: "Apr 16", sent: 2123, delivered: 2089, failed: 34 },
];

const responseRateData = [
  { hour: "00-04", responses: 12 },
  { hour: "04-08", responses: 23 },
  { hour: "08-12", responses: 189 },
  { hour: "12-16", responses: 234 },
  { hour: "16-20", responses: 167 },
  { hour: "20-24", responses: 89 },
];

const activeCampaigns = [
  { id: 1, name: "Summer Sale Promotion", status: "active", sent: 4532, delivered: 4498, clicked: 892, responses: 234 },
  { id: 2, name: "Appointment Reminders", status: "active", sent: 2341, delivered: 2298, clicked: 1876, responses: 456 },
  { id: 3, name: "Payment Due Alerts", status: "active", sent: 1876, delivered: 1854, clicked: 987, responses: 123 },
];

const recentActivity = [
  { id: 1, type: "lead", message: "New lead created from SMS: Rajesh Kumar (+91 98765 43210)", time: "2m ago", icon: UserPlus, color: "text-[#10B981]" },
  { id: 2, type: "campaign", message: "Campaign 'Summer Sale' completed - 4,532 messages sent", time: "15m ago", icon: Send, color: "text-[#1565C0]" },
  { id: 3, type: "response", message: "156 new responses received in last hour", time: "1h ago", icon: MessageSquare, color: "text-[#F59E0B]" },
  { id: 4, type: "link", message: "Short link 'SALE20' clicked 47 times", time: "2h ago", icon: Link2, color: "text-[#6366F1]" },
];

export function SMSDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS Dashboard" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">SMS Command Center</h1>
              <p className="text-sm text-[#6B7280] mt-1">Monitor and manage all SMS communications</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/tenant/sms/compose")}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <MessageSquare size={16} />
                Compose SMS
              </button>
              <button
                onClick={() => navigate("/tenant/sms/campaigns/create")}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                New Campaign
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Send size={20} className="text-[#1565C0]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+18.2%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">12,540</div>
              <div className="text-sm text-[#6B7280] mt-1">Messages Sent (7d)</div>
              <div className="text-xs text-[#9CA3AF] mt-2">Avg. 1,791/day</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <CheckCheck size={20} className="text-[#10B981]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+2.1%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">98.3%</div>
              <div className="text-sm text-[#6B7280] mt-1">Delivery Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">12,327 delivered</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#F59E0B]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+12.5%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">24.7%</div>
              <div className="text-sm text-[#6B7280] mt-1">Response Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">3,047 responses</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <UserPlus size={20} className="text-[#6366F1]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+24.1%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">487</div>
              <div className="text-sm text-[#6B7280] mt-1">Leads Created</div>
              <div className="text-xs text-[#9CA3AF] mt-2">Auto-captured (7d)</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message Volume Trend */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Message Volume (7 Days)</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Sent vs Delivered vs Failed</p>
                </div>
                <Activity size={20} className="text-[#9CA3AF]" />
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={messageVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                  />
                  <Line key="sent" type="monotone" dataKey="sent" stroke="#1565C0" strokeWidth={2} dot={{ r: 4 }} />
                  <Line key="delivered" type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line key="failed" type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1565C0]"></div>
                  <span className="text-sm text-[#6B7280]">Sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                  <span className="text-sm text-[#6B7280]">Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                  <span className="text-sm text-[#6B7280]">Failed</span>
                </div>
              </div>
            </div>

            {/* Response Rate by Time */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Response by Hour</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Best engagement times</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={responseRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" style={{ fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                  />
                  <Bar dataKey="responses" fill="#1565C0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Campaigns & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Campaigns */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E7EB]">
              <div className="p-6 border-b border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1B2D]">Active Campaigns</h3>
                    <p className="text-sm text-[#6B7280] mt-1">Currently running campaigns</p>
                  </div>
                  <button
                    onClick={() => navigate("/tenant/sms/campaigns")}
                    className="text-sm font-medium text-[#1565C0] hover:text-[#0D47A1] flex items-center gap-1"
                  >
                    View All
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1565C0] transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-[#0F1B2D]">{campaign.name}</h4>
                        <span className="inline-block px-2 py-1 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold rounded mt-1">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <div className="text-xs text-[#6B7280] mb-1">Sent</div>
                        <div className="text-lg font-bold text-[#0F1B2D]">{campaign.sent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] mb-1">Delivered</div>
                        <div className="text-lg font-bold text-[#10B981]">{campaign.delivered.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] mb-1">Clicked</div>
                        <div className="text-lg font-bold text-[#3B82F6]">{campaign.clicked.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] mb-1">Responses</div>
                        <div className="text-lg font-bold text-[#F59E0B]">{campaign.responses.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-[#E5E7EB]">
              <div className="p-6 border-b border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#0F1B2D]">Recent Activity</h3>
                <p className="text-sm text-[#6B7280] mt-1">Latest system events</p>
              </div>
              <div className="p-4 space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0 ${activity.color}`}>
                      <activity.icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#374151]">{activity.message}</p>
                      <p className="text-xs text-[#9CA3AF] mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}