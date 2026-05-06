import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  TrendingUp, MessageCircle, Users, Clock, Send, CheckCheck, Eye, Reply,
  Download, Calendar
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const messageVolumeData = [
  { date: "Apr 10", sent: 245, delivered: 242, read: 198, replied: 45 },
  { date: "Apr 11", sent: 312, delivered: 308, read: 267, replied: 62 },
  { date: "Apr 12", sent: 289, delivered: 285, read: 234, replied: 51 },
  { date: "Apr 13", sent: 421, delivered: 415, read: 356, replied: 89 },
  { date: "Apr 14", sent: 398, delivered: 392, read: 341, replied: 78 },
  { date: "Apr 15", sent: 456, delivered: 451, read: 389, replied: 92 },
  { date: "Apr 16", sent: 523, delivered: 517, read: 445, replied: 108 },
];

const responseTimeData = [
  { hour: "0-1h", count: 234 },
  { hour: "1-2h", count: 178 },
  { hour: "2-4h", count: 145 },
  { hour: "4-8h", count: 98 },
  { hour: "8-24h", count: 67 },
  { hour: "24h+", count: 34 },
];

const campaignPerformanceData = [
  { name: "Summer Launch", sent: 4567, delivered: 4523, read: 3890, replied: 892 },
  { name: "Feedback Survey", sent: 2341, delivered: 2298, read: 1876, replied: 567 },
  { name: "Cart Recovery", sent: 1234, delivered: 1198, read: 987, replied: 234 },
];

const messageTypeData = [
  { name: "Session Messages", value: 4532, color: "#1565C0" },
  { name: "Template Messages", value: 3421, color: "#10B981" },
  { name: "AI Responses", value: 2156, color: "#F59E0B" },
];

export function WhatsAppAnalytics() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "WhatsApp" },
          { label: "Analytics" }
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">WhatsApp Analytics</h1>
              <p className="text-sm text-[#6B7280] mt-1">Performance metrics and insights</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Calendar size={16} />
                Last 7 Days
              </button>
              <button className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <Send size={20} className="text-[#1565C0]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+18.2%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">2,644</div>
              <div className="text-sm text-[#6B7280] mt-1">Messages Sent</div>
              <div className="text-xs text-[#9CA3AF] mt-2">Last 7 days</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <CheckCheck size={20} className="text-[#10B981]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+2.1%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">98.7%</div>
              <div className="text-sm text-[#6B7280] mt-1">Delivery Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">2,610 delivered</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <Eye size={20} className="text-[#F59E0B]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+12.5%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">84.3%</div>
              <div className="text-sm text-[#6B7280] mt-1">Read Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">2,200 read</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <Reply size={20} className="text-[#6366F1]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">+8.7%</span>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">21.4%</div>
              <div className="text-sm text-[#6B7280] mt-1">Response Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">525 responses</div>
            </div>
          </div>

          {/* Message Volume Trend */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0F1B2D]">Message Volume Trend</h3>
                <p className="text-sm text-[#6B7280] mt-1">Daily message metrics over time</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={messageVolumeData}>
                <defs>
                  <linearGradient id="sent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="delivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="read" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                />
                <Legend />
                <Area type="monotone" dataKey="sent" stroke="#1565C0" fillOpacity={1} fill="url(#sent)" strokeWidth={2} />
                <Area type="monotone" dataKey="delivered" stroke="#10B981" fillOpacity={1} fill="url(#delivered)" strokeWidth={2} />
                <Area type="monotone" dataKey="read" stroke="#F59E0B" fillOpacity={1} fill="url(#read)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Distribution */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Response Time Distribution</h3>
                  <p className="text-sm text-[#6B7280] mt-1">How quickly customers respond</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                  />
                  <Bar dataKey="count" fill="#1565C0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Message Type Breakdown */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Message Type Breakdown</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Distribution by message type</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={messageTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {messageTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {messageTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-[#6B7280]">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#0F1B2D]">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Performance */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0F1B2D]">Campaign Performance</h3>
                <p className="text-sm text-[#6B7280] mt-1">Top performing campaigns</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" style={{ fontSize: 12 }} width={150} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                />
                <Legend />
                <Bar key="sent" dataKey="sent" fill="#1565C0" radius={[0, 4, 4, 0]} />
                <Bar key="delivered" dataKey="delivered" fill="#10B981" radius={[0, 4, 4, 0]} />
                <Bar key="read" dataKey="read" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                <Bar key="replied" dataKey="replied" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}