import React from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { 
  PhoneCall, TrendingUp, Clock, Target, Headphones, PhoneForwarded, 
  PhoneOff, Smile, Meh, Users, Star, Settings as SettingsIcon
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mock data for the dashboard
const outcomeData = [
  { name: "Interested", value: 34, color: "#10B981" },
  { name: "Callback Requested", value: 22, color: "#3B82F6" },
  { name: "Not Interested", value: 18, color: "#EF4444" },
  { name: "No Answer", value: 15, color: "#9CA3AF" },
  { name: "Voicemail", value: 8, color: "#D1D5DB" },
  { name: "Transferred to Human", value: 3, color: "#F59E0B" },
];

const campaignData = [
  { name: "Jewellery Software Q2", completed: 456, total: 600, percentage: 76, color: "#10B981" },
  { name: "Trading Platform Outreach", completed: 312, total: 500, percentage: 62, color: "#F59E0B" },
  { name: "Production Module Upsell", completed: 89, total: 200, percentage: 45, color: "#F97316" },
  { name: "Collection Reminder Mar", completed: 234, total: 300, percentage: 78, color: "#10B981" },
];

const agents = [
  { name: "Priya (Sales)", status: "online", calls: 145, rating: 4.2 },
  { name: "Amit (Support)", status: "online", calls: 98, rating: 4.5 },
  { name: "Neha (Collections)", status: "busy", calls: 67, rating: 3.8 },
  { name: "Survey Bot", status: "offline", calls: 0, rating: null },
];

const liveCallsData = [
  {
    id: 1,
    agent: "Priya",
    lead: "Rajesh Kumar",
    company: "Mehta Jewellers",
    duration: "2:34",
    status: "Active",
    sentiment: "happy",
    campaign: "Jewellery Software Q2",
  },
  {
    id: 2,
    agent: "Amit",
    lead: "Suresh Patel",
    company: "Patel Traders",
    duration: "1:12",
    status: "Active",
    sentiment: "neutral",
    campaign: "Trading Platform Outreach",
  },
  {
    id: 3,
    agent: "Priya",
    lead: "+91 87654 32109",
    company: "",
    duration: "0:08",
    status: "Ringing",
    sentiment: null,
    campaign: "Jewellery Software Q2",
  },
  {
    id: 4,
    agent: "Neha",
    lead: "Wrapping Up",
    company: "",
    duration: "-",
    status: "Wrapping Up",
    sentiment: null,
    campaign: "Collections",
  },
  {
    id: 5,
    agent: "Transferred to Deepak V.",
    lead: "",
    company: "",
    duration: "-",
    status: "On Hold",
    sentiment: null,
    campaign: "",
    isTransferred: true,
  },
];

export function AICallingDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "AI Calling Command Center" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TOP METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Live Calls */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600">Live Calls</span>
                  <div className="relative">
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono text-gray-900">12</div>
                <div className="text-xs text-gray-500 mt-1">currently active</div>
              </div>
            </div>
            <div className="h-8">
              <svg className="w-full h-full" viewBox="0 0 100 20">
                <polyline
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2"
                  points="0,15 10,12 20,14 30,8 40,10 50,6 60,9 70,7 80,12 90,8 100,10"
                />
              </svg>
            </div>
          </div>

          {/* Calls Today */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Calls Today</div>
            <div className="text-3xl font-bold font-mono text-gray-900 mb-2">1,847</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+23% vs yesterday</span>
            </div>
          </div>

          {/* Pending Transfers - NEW */}
          <div
            onClick={() => navigate("/tenant/transfer-queue")}
            className="bg-white p-6 rounded-lg shadow-sm border-2 border-amber-500 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600">Pending Transfers</span>
                  <div className="relative">
                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono text-amber-700">4</div>
                <div className="text-xs text-amber-600 mt-1 font-semibold">needs attention</div>
              </div>
              <PhoneForwarded className="w-8 h-8 text-amber-500" />
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              View Transfer Queue →
            </button>
          </div>

          {/* Connect Rate */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Connect Rate</div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold font-mono text-gray-900">68.4%</div>
              <div className="relative w-12 h-12">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#10B981"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="125.6"
                    strokeDashoffset="44"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Avg Duration */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Avg Duration</div>
            <div className="text-3xl font-bold font-mono text-gray-900 mb-2">3m 42s</div>
            <div className="text-xs text-gray-500">target: 4m 00s</div>
          </div>
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Call Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Live Call Activity</h3>
                <div className="relative">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </div>
                <span className="text-sm text-cyan-600">Live Now</span>
              </div>
            </div>

            <div className="space-y-3">
              {liveCallsData.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        {call.isTransferred ? (
                          <Users className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <PhoneCall className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {call.isTransferred ? call.agent : `AI Agent: ${call.agent}`}
                        </div>
                        {!call.isTransferred && (
                          <div className="text-xs text-gray-600">
                            {call.lead}
                            {call.company && `, ${call.company}`}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-gray-700">{call.duration}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          call.status === "Active"
                            ? "bg-cyan-100 text-cyan-700"
                            : call.status === "Ringing"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {call.status}
                      </span>
                      {call.sentiment === "happy" && (
                        <Smile className="w-4 h-4 text-green-500" />
                      )}
                      {call.sentiment === "neutral" && (
                        <Meh className="w-4 h-4 text-yellow-500" />
                      )}
                      {call.campaign && (
                        <span className="text-gray-500 truncate">{call.campaign}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => navigate("/tenant/live-monitor")}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors" 
                      title="Listen"
                    >
                      <Headphones className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => navigate("/tenant/transfer-queue")}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors" 
                      title="Barge In"
                    >
                      <PhoneForwarded className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => alert("Call will be ended")}
                      className="p-1.5 hover:bg-red-100 rounded transition-colors" 
                      title="End Call"
                    >
                      <PhoneOff className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate("/tenant/live-monitor")}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All Live Calls →
            </button>
          </div>

          {/* Today's Call Outcomes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Call Outcomes</h3>

            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {outcomeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900 ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* THIRD ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>

            <div className="space-y-4">
              {campaignData.map((campaign, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                    <span className="text-sm text-gray-600">
                      {campaign.completed}/{campaign.total} calls — {campaign.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${campaign.percentage}%`,
                        backgroundColor: campaign.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agent Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Status</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agents.map((agent, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {agent.name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            agent.status === "online"
                              ? "bg-green-500"
                              : agent.status === "busy"
                              ? "bg-amber-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-600 capitalize">
                          {agent.status}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate("/tenant/ai-agents")}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <SettingsIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 mb-2">
                    {agent.calls} calls today
                  </div>

                  {agent.rating !== null && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-900">
                        {agent.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/tenant/ai-campaigns/create")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                Start New Campaign
              </button>
              <button 
                onClick={() => navigate("/tenant/ai-agents")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Create AI Agent
              </button>
              <button
                onClick={() => navigate("/tenant/prompt-template-editor")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Edit Prompts
              </button>
            </div>

            <div className="flex-1 max-w-md">
              <div className="text-sm text-gray-600 mb-2">
                Cost This Month: <span className="font-mono font-medium text-gray-900">INR 12,450</span> / INR 50,000 budget
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}