import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Activity, Phone, MessageSquare, Mail, Database, TrendingUp,
  Clock, Play, Pause, RefreshCw, Download, Filter, Search,
  AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const realtimeData = [
  { time: "10:00", aiCalls: 245, whatsapp: 1850, sms: 420, email: 980 },
  { time: "10:05", aiCalls: 289, whatsapp: 1920, sms: 445, email: 1020 },
  { time: "10:10", aiCalls: 312, whatsapp: 1980, sms: 480, email: 1100 },
  { time: "10:15", aiCalls: 298, whatsapp: 2050, sms: 510, email: 1150 },
  { time: "10:20", aiCalls: 334, whatsapp: 2120, sms: 495, email: 1200 },
  { time: "10:25", aiCalls: 356, whatsapp: 2180, sms: 530, email: 1280 },
];

const services = [
  {
    id: 1,
    name: "AI Calling",
    icon: Phone,
    color: "#1565C0",
    lightColor: "#E3F2FD",
    current: {
      units: "12,340 minutes",
      cost: "₹30,850",
      rate: "₹2.50/min",
      trend: "+12.5%",
      status: "active"
    },
    limit: "50,000 minutes",
    usage: 24.68,
    alerts: []
  },
  {
    id: 2,
    name: "WhatsApp",
    icon: MessageSquare,
    color: "#10B981",
    lightColor: "#D1FAE5",
    current: {
      units: "8,500 messages",
      cost: "₹3,825",
      rate: "₹0.45/msg",
      trend: "+8.3%",
      status: "active"
    },
    limit: "100,000 messages",
    usage: 8.5,
    alerts: []
  },
  {
    id: 3,
    name: "SMS",
    icon: Mail,
    color: "#F59E0B",
    lightColor: "#FEF3C7",
    current: {
      units: "5,200 SMS",
      cost: "₹1,820",
      rate: "₹0.35/SMS",
      trend: "+15.2%",
      status: "active"
    },
    limit: "50,000 SMS",
    usage: 10.4,
    alerts: []
  },
  {
    id: 4,
    name: "Email",
    icon: Mail,
    color: "#6366F1",
    lightColor: "#EEF2FF",
    current: {
      units: "25,000 emails",
      cost: "₹3,750",
      rate: "₹0.15/email",
      trend: "+9.7%",
      status: "active"
    },
    limit: "500,000 emails",
    usage: 5.0,
    alerts: []
  },
  {
    id: 5,
    name: "Storage",
    icon: Database,
    color: "#EC4899",
    lightColor: "#FCE7F3",
    current: {
      units: "450 GB",
      cost: "₹9,000",
      rate: "₹20/GB",
      trend: "+3.1%",
      status: "warning"
    },
    limit: "500 GB",
    usage: 90.0,
    alerts: [{ type: "threshold", message: "90% storage used - upgrade recommended" }]
  },
];

const tenantUsage = [
  {
    id: 1,
    tenant: "Everest Digital Solutions",
    tenantId: "TEN-001",
    aiCalls: { minutes: 2340, cost: 5850 },
    whatsapp: { messages: 1850, cost: 833 },
    sms: { count: 920, cost: 322 },
    email: { count: 5200, cost: 780 },
    storage: { gb: 85, cost: 1700 },
    total: 9485,
    trend: "+12.5%",
    status: "normal"
  },
  {
    id: 2,
    tenant: "TechVision Enterprises",
    tenantId: "TEN-002",
    aiCalls: { minutes: 1890, cost: 4725 },
    whatsapp: { messages: 1420, cost: 639 },
    sms: { count: 670, cost: 235 },
    email: { count: 3800, cost: 570 },
    storage: { gb: 62, cost: 1240 },
    total: 7409,
    trend: "+8.3%",
    status: "normal"
  },
  {
    id: 3,
    tenant: "CloudScale Solutions",
    tenantId: "TEN-003",
    aiCalls: { minutes: 3120, cost: 7800 },
    whatsapp: { messages: 2340, cost: 1053 },
    sms: { count: 1280, cost: 448 },
    email: { count: 7800, cost: 1170 },
    storage: { gb: 128, cost: 2560 },
    total: 13031,
    trend: "+15.2%",
    status: "normal"
  },
  {
    id: 4,
    tenant: "DataFlow Systems",
    tenantId: "TEN-004",
    aiCalls: { minutes: 1240, cost: 3100 },
    whatsapp: { messages: 980, cost: 441 },
    sms: { count: 540, cost: 189 },
    email: { count: 2900, cost: 435 },
    storage: { gb: 95, cost: 1900 },
    total: 6065,
    trend: "-3.1%",
    status: "alert"
  },
];

export function UsageMetering() {
  const navigate = useNavigate();
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedService, setSelectedService] = useState("all");
  const [timeRange, setTimeRange] = useState("real-time");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing", onClick: () => navigate("/admin/billing") },
          { label: "Usage Metering" }
        ]}
        companyName="OmniCRM Platform"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Real-time Usage Metering</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Track every billable second across all services
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isMonitoring
                    ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                    : 'bg-[#10B981] text-white hover:bg-[#059669]'
                }`}
              >
                {isMonitoring ? <Pause size={16} /> : <Play size={16} />}
                {isMonitoring ? 'Pause' : 'Resume'} Monitoring
              </button>
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Refresh
              </button>
              <button className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`rounded-xl p-4 flex items-center gap-3 ${
            isMonitoring
              ? 'bg-[#D1FAE5] border border-[#10B981]'
              : 'bg-[#FEF3C7] border border-[#F59E0B]'
          }`}>
            <Activity className={`w-5 h-5 ${isMonitoring ? 'text-[#065F46] animate-pulse' : 'text-[#92400E]'}`} />
            <div>
              <p className={`text-sm font-semibold ${isMonitoring ? 'text-[#065F46]' : 'text-[#92400E]'}`}>
                {isMonitoring ? 'Real-time Monitoring Active' : 'Monitoring Paused'}
              </p>
              <p className={`text-xs mt-0.5 ${isMonitoring ? 'text-[#065F46]' : 'text-[#92400E]'}`}>
                {isMonitoring 
                  ? 'All usage is being tracked and metered in real-time' 
                  : 'Usage tracking is temporarily paused - resume to continue metering'}
              </p>
            </div>
          </div>

          {/* Real-time Chart */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F1B2D]">Live Usage Activity</h2>
                <p className="text-sm text-[#6B7280] mt-1">Last 30 minutes - updating every 5 seconds</p>
              </div>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151]"
              >
                <option value="all">All Services</option>
                <option value="ai-calls">AI Calls Only</option>
                <option value="whatsapp">WhatsApp Only</option>
                <option value="sms">SMS Only</option>
                <option value="email">Email Only</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="aiCalls" stroke="#1565C0" strokeWidth={2} name="AI Calls" />
                <Line type="monotone" dataKey="whatsapp" stroke="#10B981" strokeWidth={2} name="WhatsApp" />
                <Line type="monotone" dataKey="sms" stroke="#F59E0B" strokeWidth={2} name="SMS" />
                <Line type="monotone" dataKey="email" stroke="#6366F1" strokeWidth={2} name="Email" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Service Cards */}
          <div>
            <h2 className="text-lg font-semibold text-[#0F1B2D] mb-4">Service Usage Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => {
                const IconComponent = service.icon;
                const isNegative = service.current.trend.startsWith("-");
                
                return (
                  <div key={service.id} className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg`} style={{ backgroundColor: service.lightColor }}>
                          <IconComponent className="w-6 h-6" style={{ color: service.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0F1B2D]">{service.name}</h3>
                          <p className="text-xs text-[#6B7280] mt-0.5">{service.current.rate}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.current.status === 'active'
                          ? 'bg-[#D1FAE5] text-[#065F46]'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}>
                        {service.current.status === 'active' ? 'Active' : 'Warning'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-[#0F1B2D]">{service.current.cost}</p>
                        <p className="text-sm text-[#6B7280] mt-1">{service.current.units}</p>
                        <div className={`flex items-center gap-1 text-sm font-medium mt-2 ${
                          isNegative ? 'text-[#DC2626]' : 'text-[#10B981]'
                        }`}>
                          {isNegative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                          {service.current.trend}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                          <span>Usage</span>
                          <span>{service.usage}% of {service.limit}</span>
                        </div>
                        <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              service.usage >= 90 ? 'bg-[#DC2626]' : service.usage >= 70 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                            }`}
                            style={{ width: `${service.usage}%` }}
                          />
                        </div>
                      </div>

                      {service.alerts.length > 0 && (
                        <div className="pt-3 border-t border-[#E5E7EB]">
                          {service.alerts.map((alert, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-[#F59E0B] mt-0.5" />
                              <p className="text-xs text-[#92400E]">{alert.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tenant Usage Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F1B2D]">Tenant Usage Details</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Current billing period usage by tenant</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search tenants..."
                      className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                    />
                  </div>
                  <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2">
                    <Filter size={16} />
                    Filters
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      AI Calls
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      SMS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Storage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {tenantUsage.map((tenant) => {
                    const isNegative = tenant.trend.startsWith("-");
                    return (
                      <tr key={tenant.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#0F1B2D]">{tenant.tenant}</p>
                            <p className="text-xs text-[#6B7280]">{tenant.tenantId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-[#0F1B2D]">₹{tenant.aiCalls.cost}</p>
                            <p className="text-xs text-[#6B7280]">{tenant.aiCalls.minutes} min</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-[#0F1B2D]">₹{tenant.whatsapp.cost}</p>
                            <p className="text-xs text-[#6B7280]">{tenant.whatsapp.messages} msg</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-[#0F1B2D]">₹{tenant.sms.cost}</p>
                            <p className="text-xs text-[#6B7280]">{tenant.sms.count} SMS</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-[#0F1B2D]">₹{tenant.email.cost}</p>
                            <p className="text-xs text-[#6B7280]">{tenant.email.count} emails</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-[#0F1B2D]">₹{tenant.storage.cost}</p>
                            <p className="text-xs text-[#6B7280]">{tenant.storage.gb} GB</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#1565C0]">₹{tenant.total.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center gap-1 text-sm font-medium ${
                            isNegative ? 'text-[#DC2626]' : 'text-[#10B981]'
                          }`}>
                            {isNegative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                            {tenant.trend}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
