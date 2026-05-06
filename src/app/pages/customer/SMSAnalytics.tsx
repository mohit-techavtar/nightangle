import React from "react";
import { TopBar } from "../../components/layout/TopBar";
import { Send, TrendingUp, Users, CheckCheck, XCircle, Download, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const deliveryTrendData = [
  { date: "Apr 10", sent: 1245, delivered: 1198, failed: 47 },
  { date: "Apr 11", sent: 1512, delivered: 1478, failed: 34 },
  { date: "Apr 12", sent: 1389, delivered: 1354, failed: 35 },
  { date: "Apr 13", sent: 1821, delivered: 1789, failed: 32 },
  { date: "Apr 14", sent: 1698, delivered: 1671, failed: 27 },
  { date: "Apr 15", sent: 1956, delivered: 1923, failed: 33 },
  { date: "Apr 16", sent: 2123, delivered: 2089, failed: 34 },
];

const responsesByHourData = [
  { hour: "00-04", count: 23 },
  { hour: "04-08", count: 45 },
  { hour: "08-12", count: 234 },
  { hour: "12-16", count: 312 },
  { hour: "16-20", count: 189 },
  { hour: "20-24", count: 98 },
];

const messageTypeData = [
  { name: "Campaigns", value: 6543, color: "#1565C0" },
  { name: "Transactional", value: 3421, color: "#10B981" },
  { name: "AI Auto-Reply", value: 1234, color: "#F59E0B" },
  { name: "Manual", value: 892, color: "#6366F1" },
];

export function SMSAnalytics() {
  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "SMS" },
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
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">SMS Analytics</h1>
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
              <div className="text-2xl font-bold text-[#0F1B2D]">12,744</div>
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
              <div className="text-2xl font-bold text-[#0F1B2D]">98.3%</div>
              <div className="text-sm text-[#6B7280] mt-1">Delivery Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">12,502 delivered</div>
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
              <div className="text-xs text-[#9CA3AF] mt-2">3,088 responses</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                  <XCircle size={20} className="text-[#EF4444]" />
                </div>
                <span className="text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded">-5.3%</span>
              </div>
              <div className="text-2xl font-bold text-[#EF4444]">1.7%</div>
              <div className="text-sm text-[#6B7280] mt-1">Failure Rate</div>
              <div className="text-xs text-[#9CA3AF] mt-2">242 failed</div>
            </div>
          </div>

          {/* Delivery Trend */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0F1B2D]">Delivery Trend (7 Days)</h3>
                <p className="text-sm text-[#6B7280] mt-1">Sent vs Delivered vs Failed</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deliveryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                />
                <Line key="sent" type="monotone" dataKey="sent" stroke="#1565C0" strokeWidth={2} dot={{ r: 4 }} name="Sent" />
                <Line key="delivered" type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Delivered" />
                <Line key="failed" type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} name="Failed" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Responses by Hour */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Responses by Hour</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Best engagement times</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={responsesByHourData}>
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

            {/* Message Type Distribution */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1B2D]">Message Type Distribution</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Breakdown by type</p>
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
        </div>
      </div>
    </>
  );
}