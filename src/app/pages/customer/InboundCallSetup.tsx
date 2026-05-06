import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Phone,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  ArrowDown,
  Search,
  User,
  PhoneIncoming,
  UserCheck,
  Users,
  Clock,
  Settings,
  AlertCircle,
  Globe,
} from "lucide-react";

interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  agent: string;
  status: "active" | "inactive";
  callsToday: number;
}

const phoneNumbers: PhoneNumber[] = [
  {
    id: "1",
    number: "+91 22 4000 1234",
    label: "Mumbai Sales",
    agent: "Priya (Sales)",
    status: "active",
    callsToday: 34,
  },
  {
    id: "2",
    number: "+91 22 4000 1235",
    label: "Mumbai Support",
    agent: "Amit (Support)",
    status: "active",
    callsToday: 18,
  },
  {
    id: "3",
    number: "+91 80 4000 5678",
    label: "Bangalore Sales",
    agent: "Neha",
    status: "inactive",
    callsToday: 0,
  },
  {
    id: "4",
    number: "1800-123-4567",
    label: "Toll Free",
    agent: "Round-Robin",
    status: "active",
    callsToday: 52,
  },
];

interface BusinessHours {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const initialBusinessHours: BusinessHours[] = [
  { day: "Monday", enabled: true, startTime: "09:00", endTime: "19:00" },
  { day: "Tuesday", enabled: true, startTime: "09:00", endTime: "19:00" },
  { day: "Wednesday", enabled: true, startTime: "09:00", endTime: "19:00" },
  { day: "Thursday", enabled: true, startTime: "09:00", endTime: "19:00" },
  { day: "Friday", enabled: true, startTime: "09:00", endTime: "19:00" },
  { day: "Saturday", enabled: true, startTime: "10:00", endTime: "18:00" },
  { day: "Sunday", enabled: false, startTime: "00:00", endTime: "00:00" },
];

export function InboundCallSetup() {
  const navigate = useNavigate();
  const [inboundEnabled, setInboundEnabled] = useState(true);
  const [matchByPhone, setMatchByPhone] = useState(true);
  const [matchByCallerId, setMatchByCallerId] = useState(true);
  const [unknownCallerBehavior, setUnknownCallerBehavior] = useState("collect");
  const [collectName, setCollectName] = useState(true);
  const [collectPhone, setCollectPhone] = useState(true);
  const [collectEmail, setCollectEmail] = useState(false);
  const [collectCompany, setCollectCompany] = useState(false);
  const [afterHoursBehavior, setAfterHoursBehavior] = useState("voicemail");
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(initialBusinessHours);

  const toggleDayEnabled = (index: number) => {
    const updated = [...businessHours];
    updated[index].enabled = !updated[index].enabled;
    setBusinessHours(updated);
  };

  const updateTime = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...businessHours];
    updated[index][field] = value;
    setBusinessHours(updated);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tenant/ai-calling")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Inbound Call Setup</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Configure how AI handles incoming customer calls
                </p>
              </div>
            </div>

            {/* Inbound AI Enabled Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Inbound AI Enabled</span>
              <button
                onClick={() => setInboundEnabled(!inboundEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  inboundEnabled ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    inboundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              {inboundEnabled && (
                <div className="flex items-center gap-1.5 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                  <span className="text-xs font-medium">Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Section 1 - Phone Numbers */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Phone Numbers</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Request New Number
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Number
                </button>
              </div>
            </div>

            {/* Phone Numbers Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Number
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Label
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      AI Agent
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Calls Today
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {phoneNumbers.map((phone) => (
                    <tr key={phone.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-gray-900 font-medium">
                          {phone.number}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{phone.label}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{phone.agent}</span>
                      </td>
                      <td className="py-4 px-4">
                        {phone.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {phone.callsToday}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <Edit3 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2 - Call Routing Logic */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Call Routing Logic</h2>
            </div>

            {/* Visual Flow Diagram */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg p-8">
              <div className="max-w-2xl mx-auto">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-64 bg-white border-2 border-indigo-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        <PhoneIncoming className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">Incoming Call</span>
                    </div>
                  </div>
                  <ArrowDown className="w-6 h-6 text-indigo-600 my-3" />

                  {/* Step 2 */}
                  <div className="w-64 bg-white border-2 border-violet-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Caller ID Lookup</div>
                        <div className="text-xs text-gray-600">CRM match?</div>
                      </div>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="flex items-start gap-12 my-3">
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-semibold text-green-700 mb-2">YES</div>
                      <ArrowDown className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-semibold text-amber-700 mb-2">NO</div>
                      <ArrowDown className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>

                  {/* Step 3 - Branches */}
                  <div className="flex items-start gap-8">
                    <div className="w-56 bg-white border-2 border-green-500 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">Load Lead Profile</span>
                      </div>
                      <p className="text-xs text-gray-600">Fetch customer history & context</p>
                    </div>
                    <div className="w-56 bg-white border-2 border-amber-500 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-gray-900">Collect Identity</span>
                      </div>
                      <p className="text-xs text-gray-600">Ask for name + phone</p>
                    </div>
                  </div>

                  {/* Convergence */}
                  <div className="flex items-start gap-12 my-3">
                    <ArrowDown className="w-5 h-5 text-green-600" />
                    <ArrowDown className="w-5 h-5 text-amber-600" />
                  </div>

                  {/* Step 4 - Merged */}
                  <div className="w-64 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Route to AI Agent</div>
                        <div className="text-xs text-gray-600">By campaign or default</div>
                      </div>
                    </div>
                  </div>
                  <ArrowDown className="w-6 h-6 text-indigo-600 my-3" />

                  {/* Step 5 */}
                  <div className="w-64 bg-white border-2 border-purple-500 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">AI Agent Answers</span>
                    </div>
                  </div>
                  <ArrowDown className="w-6 h-6 text-indigo-600 my-3" />

                  {/* Step 6 */}
                  <div className="w-64 bg-white border-2 border-teal-500 rounded-lg p-4 shadow-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 mb-1">Conversation</div>
                      <div className="text-xs text-gray-600">AI handles the call</div>
                    </div>
                  </div>
                  <ArrowDown className="w-6 h-6 text-indigo-600 my-3" />

                  {/* Step 7 */}
                  <div className="w-64 bg-white border-2 border-gray-500 rounded-lg p-4 shadow-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 mb-1">Resolution</div>
                      <div className="text-xs text-gray-600">
                        Complete / Transfer / Schedule Callback
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 - Caller Identification Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Caller Identification Settings</h2>
            </div>

            <div className="space-y-5">
              {/* Match Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={matchByPhone}
                    onChange={(e) => setMatchByPhone(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Match by phone number</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={matchByCallerId}
                    onChange={(e) => setMatchByCallerId(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Match by caller ID</span>
                </label>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Unknown Caller Behavior */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">If caller unknown:</h3>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="unknownBehavior"
                      value="collect"
                      checked={unknownCallerBehavior === "collect"}
                      onChange={(e) => setUnknownCallerBehavior(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        AI collects identity details
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Recommended: Agent asks for name and basic info before proceeding
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="unknownBehavior"
                      value="transfer"
                      checked={unknownCallerBehavior === "transfer"}
                      onChange={(e) => setUnknownCallerBehavior(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Transfer to human immediately
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Route unknown callers directly to a human agent
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="unknownBehavior"
                      value="disconnect"
                      checked={unknownCallerBehavior === "disconnect"}
                      onChange={(e) => setUnknownCallerBehavior(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Play recorded message and disconnect
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Reject unknown callers with a pre-recorded message
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Minimum Data to Collect */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Minimum data to collect from unknown callers:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={collectName}
                      onChange={(e) => setCollectName(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Name</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={collectPhone}
                      onChange={(e) => setCollectPhone(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Phone</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={collectEmail}
                      onChange={(e) => setCollectEmail(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Email</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={collectCompany}
                      onChange={(e) => setCollectCompany(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Company</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 - Business Hours & Availability */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Business Hours & Availability</h2>
            </div>

            {/* Business Hours Grid */}
            <div className="mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                        Day
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Enabled
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessHours.map((hour, index) => (
                      <tr
                        key={hour.day}
                        className={`border-b border-gray-100 ${
                          !hour.enabled ? "bg-gray-50 opacity-60" : ""
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">{hour.day}</span>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="time"
                            value={hour.startTime}
                            onChange={(e) => updateTime(index, "startTime", e.target.value)}
                            disabled={!hour.enabled}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="time"
                            value={hour.endTime}
                            onChange={(e) => updateTime(index, "endTime", e.target.value)}
                            disabled={!hour.enabled}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleDayEnabled(index)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              hour.enabled ? "bg-green-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                hour.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* After Hours Behavior */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  After hours behavior:
                </label>
                <select
                  value={afterHoursBehavior}
                  onChange={(e) => setAfterHoursBehavior(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="voicemail">Play voicemail greeting and record message</option>
                  <option value="transfer">Transfer to on-call human agent</option>
                  <option value="ai">AI handles with after-hours script</option>
                  <option value="disconnect">Play closed message and disconnect</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Timezone:
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Asia/Kolkata (IST)</option>
                    <option>Asia/Dubai (GST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <span className="font-medium">Business hours affect inbound call routing.</span> Calls
                received outside these hours will follow your after-hours behavior settings.
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3">
            <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
