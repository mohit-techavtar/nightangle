import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  FileText,
  Clock,
  Calendar,
  User,
  Bot,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Volume2,
  BarChart3,
  ExternalLink,
} from "lucide-react";

interface CallLog {
  id: string;
  timestamp: string;
  duration: string;
  durationSeconds: number;
  type: "inbound" | "outbound";
  status: "completed" | "missed" | "failed" | "no-answer" | "busy";
  contactName: string;
  contactPhone: string;
  agentName: string;
  sentiment: "positive" | "neutral" | "negative";
  outcome: "converted" | "callback" | "not-interested" | "information" | "escalated";
  hasRecording: boolean;
  hasTranscript: boolean;
  callQuality: number; // 1-5
  aiConfidence: number; // percentage
  tags: string[];
  notes?: string;
  transcript?: string;
}

const dummyCallLogs: CallLog[] = [
  {
    id: "CL-2026-001234",
    timestamp: "2026-04-02 14:32:15",
    duration: "4m 23s",
    durationSeconds: 263,
    type: "outbound",
    status: "completed",
    contactName: "Rajesh Kumar",
    contactPhone: "+91 98765 43210",
    agentName: "Priya (Sales)",
    sentiment: "positive",
    outcome: "converted",
    hasRecording: true,
    hasTranscript: true,
    callQuality: 5,
    aiConfidence: 92,
    tags: ["Hot Lead", "Jewellery Software"],
    notes: "Customer interested in premium plan. Scheduled demo for April 5th.",
    transcript: "Priya: Namaste Rajesh ji! Main Priya bol rahi hoon Nightangle se...\nRajesh: Haan, main aapka call ka intezar kar raha tha...\nPriya: Thank you! Aapne humari jewellery software ke baare mein inquiry ki thi..."
  },
  {
    id: "CL-2026-001233",
    timestamp: "2026-04-02 14:15:42",
    duration: "2m 18s",
    durationSeconds: 138,
    type: "inbound",
    status: "completed",
    contactName: "Priya Sharma",
    contactPhone: "+91 98234 56789",
    agentName: "Amit (Support)",
    sentiment: "neutral",
    outcome: "information",
    hasRecording: true,
    hasTranscript: true,
    callQuality: 4,
    aiConfidence: 87,
    tags: ["Support Query"],
    notes: "Customer asked about pricing plans. Information provided."
  },
  {
    id: "CL-2026-001232",
    timestamp: "2026-04-02 13:45:20",
    duration: "0m 0s",
    durationSeconds: 0,
    type: "outbound",
    status: "no-answer",
    contactName: "Amit Patel",
    contactPhone: "+91 97123 45678",
    agentName: "Priya (Sales)",
    sentiment: "neutral",
    outcome: "callback",
    hasRecording: false,
    hasTranscript: false,
    callQuality: 0,
    aiConfidence: 0,
    tags: ["Follow-up Required"],
    notes: "No answer. Will retry after 2 hours."
  },
  {
    id: "CL-2026-001231",
    timestamp: "2026-04-02 13:20:55",
    duration: "5m 47s",
    durationSeconds: 347,
    type: "outbound",
    status: "completed",
    contactName: "Sunita Verma",
    contactPhone: "+91 96345 67890",
    agentName: "Priya (Sales)",
    sentiment: "negative",
    outcome: "not-interested",
    hasRecording: true,
    hasTranscript: true,
    callQuality: 3,
    aiConfidence: 78,
    tags: ["Not Interested", "Budget Constraint"],
    notes: "Customer found pricing too high. Mentioned competitor offering lower rates."
  },
  {
    id: "CL-2026-001230",
    timestamp: "2026-04-02 12:58:33",
    duration: "6m 12s",
    durationSeconds: 372,
    type: "inbound",
    status: "completed",
    contactName: "Vikram Singh",
    contactPhone: "+91 95456 78901",
    agentName: "Amit (Support)",
    sentiment: "negative",
    outcome: "escalated",
    hasRecording: true,
    hasTranscript: true,
    callQuality: 4,
    aiConfidence: 65,
    tags: ["Complaint", "Escalated"],
    notes: "Technical issue with software. Escalated to senior support team."
  },
  {
    id: "CL-2026-001229",
    timestamp: "2026-04-02 12:30:18",
    duration: "3m 45s",
    durationSeconds: 225,
    type: "outbound",
    status: "completed",
    contactName: "Meera Joshi",
    contactPhone: "+91 94567 89012",
    agentName: "Priya (Sales)",
    sentiment: "positive",
    outcome: "callback",
    hasRecording: true,
    hasTranscript: true,
    callQuality: 5,
    aiConfidence: 90,
    tags: ["Interested", "Needs Approval"],
    notes: "Customer very interested. Needs to discuss with business partner. Will call back tomorrow."
  },
  {
    id: "CL-2026-001228",
    timestamp: "2026-04-02 11:55:07",
    duration: "0m 0s",
    durationSeconds: 0,
    type: "outbound",
    status: "failed",
    contactName: "Arjun Reddy",
    contactPhone: "+91 93678 90123",
    agentName: "Collection Bot",
    sentiment: "neutral",
    outcome: "callback",
    hasRecording: false,
    hasTranscript: false,
    callQuality: 0,
    aiConfidence: 0,
    tags: ["Technical Error"],
    notes: "Call failed due to network error. Retry scheduled."
  },
  {
    id: "CL-2026-001227",
    timestamp: "2026-04-02 11:20:44",
    duration: "4m 56s",
    durationSeconds: 296,
    type: "outbound",
    status: "completed",
    contactName: "Kavita Desai",
    contactPhone: "+91 92789 01234",
    agentName: "Priya (Sales)",
    sentiment: "positive",
    outcome: "converted",
    hasRecording: true,
    hasTranscript: true,
    callQuality: 5,
    aiConfidence: 95,
    tags: ["Hot Lead", "Immediate Purchase"],
    notes: "Customer signed up for annual plan. Payment link sent via SMS."
  },
  {
    id: "CL-2026-001226",
    timestamp: "2026-04-02 10:45:22",
    duration: "2m 33s",
    durationSeconds: 153,
    type: "inbound",
    status: "completed",
    contactName: "Rohit Malhotra",
    contactPhone: "+91 91890 12345",
    agentName: "Amit (Support)",
    sentiment: "neutral",
    outcome: "information",
    hasRecording: true,
    hasTranscript: true,
    callQuality: 4,
    aiConfidence: 85,
    tags: ["General Query"],
    notes: "Asked about integration capabilities. Information provided via email."
  },
  {
    id: "CL-2026-001225",
    timestamp: "2026-04-02 10:15:55",
    duration: "1m 12s",
    durationSeconds: 72,
    type: "outbound",
    status: "busy",
    contactName: "Neha Kapoor",
    contactPhone: "+91 90901 23456",
    agentName: "Priya (Sales)",
    sentiment: "neutral",
    outcome: "callback",
    hasRecording: false,
    hasTranscript: false,
    callQuality: 0,
    aiConfidence: 0,
    tags: ["Busy", "Retry Later"],
    notes: "Line was busy. Will attempt again in 1 hour."
  },
];

export function CallLogs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedOutcome, setSelectedOutcome] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [playingRecording, setPlayingRecording] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter logs
  const filteredLogs = dummyCallLogs.filter((log) => {
    const matchesSearch =
      log.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.contactPhone.includes(searchQuery) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;
    const matchesType = selectedType === "all" || log.type === selectedType;
    const matchesOutcome = selectedOutcome === "all" || log.outcome === selectedOutcome;
    const matchesAgent = selectedAgent === "all" || log.agentName === selectedAgent;

    return matchesSearch && matchesStatus && matchesType && matchesOutcome && matchesAgent;
  });

  // Calculate stats
  const totalCalls = filteredLogs.length;
  const completedCalls = filteredLogs.filter(l => l.status === "completed").length;
  const avgDuration = filteredLogs.length > 0 
    ? Math.round(filteredLogs.reduce((sum, l) => sum + l.durationSeconds, 0) / filteredLogs.length)
    : 0;
  const conversionRate = completedCalls > 0
    ? Math.round((filteredLogs.filter(l => l.outcome === "converted").length / completedCalls) * 100)
    : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: CallLog["status"]) => {
    const styles = {
      completed: "bg-green-100 text-green-700 border-green-200",
      missed: "bg-orange-100 text-orange-700 border-orange-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      "no-answer": "bg-gray-100 text-gray-700 border-gray-200",
      busy: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    const icons = {
      completed: <CheckCircle2 className="w-3 h-3" />,
      missed: <PhoneMissed className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      "no-answer": <AlertCircle className="w-3 h-3" />,
      busy: <AlertCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.replace("-", " ")}
      </span>
    );
  };

  const getSentimentIcon = (sentiment: CallLog["sentiment"]) => {
    if (sentiment === "positive") return <ThumbsUp className="w-4 h-4 text-green-600" />;
    if (sentiment === "negative") return <ThumbsDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getOutcomeBadge = (outcome: CallLog["outcome"]) => {
    const styles = {
      converted: "bg-green-50 text-green-700 border-green-200",
      callback: "bg-blue-50 text-blue-700 border-blue-200",
      "not-interested": "bg-red-50 text-red-700 border-red-200",
      information: "bg-purple-50 text-purple-700 border-purple-200",
      escalated: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[outcome]}`}>
        {outcome.replace("-", " ")}
      </span>
    );
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "AI Calling", href: "/tenant/ai-calling" },
          { label: "Call Logs" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Call Logs</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View and analyze all AI calling activity
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Total Calls</span>
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalCalls}</div>
                <div className="text-xs text-gray-600 mt-1">Today</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Completed</span>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{completedCalls}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0}% success rate
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Avg Duration</span>
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatDuration(avgDuration)}</div>
                <div className="text-xs text-gray-600 mt-1">Per call</div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Conversion</span>
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
                <div className="text-xs text-gray-600 mt-1">Success rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or call ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                  showFilters
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-4 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                    <option value="failed">Failed</option>
                    <option value="no-answer">No Answer</option>
                    <option value="busy">Busy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Call Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="outbound">Outbound</option>
                    <option value="inbound">Inbound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Outcome</label>
                  <select
                    value={selectedOutcome}
                    onChange={(e) => setSelectedOutcome(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Outcomes</option>
                    <option value="converted">Converted</option>
                    <option value="callback">Callback</option>
                    <option value="not-interested">Not Interested</option>
                    <option value="information">Information</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">AI Agent</label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Agents</option>
                    <option value="Priya (Sales)">Priya (Sales)</option>
                    <option value="Amit (Support)">Amit (Support)</option>
                    <option value="Collection Bot">Collection Bot</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call Logs Table */}
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Call ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Outcome
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Sentiment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <React.Fragment key={log.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-sm font-mono text-indigo-600">{log.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-900">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {log.timestamp}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.contactName}</div>
                              <div className="text-xs text-gray-500">{log.contactPhone}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {log.type === "outbound" ? (
                                <PhoneOutgoing className="w-4 h-4 text-blue-600" />
                              ) : (
                                <PhoneIncoming className="w-4 h-4 text-green-600" />
                              )}
                              <span className="text-sm text-gray-700 capitalize">{log.type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Bot className="w-4 h-4 text-violet-600" />
                              <span className="text-sm text-gray-900">{log.agentName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-900">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {log.duration}
                            </div>
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                          <td className="px-4 py-3">{getOutcomeBadge(log.outcome)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {getSentimentIcon(log.sentiment)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {log.hasRecording && (
                                <button
                                  onClick={() =>
                                    setPlayingRecording(playingRecording === log.id ? null : log.id)
                                  }
                                  className="p-1.5 hover:bg-indigo-50 rounded transition-colors"
                                  title="Play Recording"
                                >
                                  {playingRecording === log.id ? (
                                    <Pause className="w-4 h-4 text-indigo-600" />
                                  ) : (
                                    <Play className="w-4 h-4 text-indigo-600" />
                                  )}
                                </button>
                              )}
                              {log.hasTranscript && (
                                <button
                                  onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                                  className="p-1.5 hover:bg-purple-50 rounded transition-colors"
                                  title="View Transcript"
                                >
                                  <FileText className="w-4 h-4 text-purple-600" />
                                </button>
                              )}
                              <button
                                onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                title="Toggle Details"
                              >
                                {expandedRow === log.id ? (
                                  <ChevronUp className="w-4 h-4 text-gray-600" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {expandedRow === log.id && (
                          <tr>
                            <td colSpan={10} className="px-4 py-4 bg-gray-50">
                              <div className="grid grid-cols-3 gap-4">
                                {/* Left Column - Call Details */}
                                <div className="col-span-1">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Call Details</h4>
                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-600">Call Quality:</span>
                                      <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`w-3.5 h-3.5 ${
                                              star <= log.callQuality
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-600">AI Confidence:</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-indigo-600 rounded-full"
                                            style={{ width: `${log.aiConfidence}%` }}
                                          />
                                        </div>
                                        <span className="text-xs font-medium text-gray-900">
                                          {log.aiConfidence}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                      <span className="text-xs text-gray-600 block mb-2">Tags:</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {log.tags.map((tag, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Middle Column - Notes */}
                                <div className="col-span-1">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Notes</h4>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {log.notes || "No notes available."}
                                  </p>
                                </div>

                                {/* Right Column - Transcript Preview */}
                                <div className="col-span-1">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-purple-600" />
                                    Transcript Preview
                                  </h4>
                                  {log.hasTranscript && log.transcript ? (
                                    <div className="bg-white rounded border border-gray-200 p-3 max-h-32 overflow-y-auto">
                                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">
                                        {log.transcript}
                                      </pre>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">No transcript available.</p>
                                  )}
                                </div>
                              </div>

                              {/* View Full Details Button */}
                              <div className="mt-4 flex items-center justify-end gap-3">
                                <button
                                  onClick={() => navigate("/tenant/call-detail")}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Full Details
                                </button>
                              </div>

                              {/* Recording Player */}
                              {log.hasRecording && playingRecording === log.id && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Volume2 className="w-5 h-5 text-indigo-600" />
                                    <span className="text-sm font-medium text-gray-900">Recording Player</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                                      <Pause className="w-4 h-4" />
                                    </button>
                                    <div className="flex-1">
                                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: "35%" }} />
                                      </div>
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-gray-600">1:32</span>
                                        <span className="text-xs text-gray-600">{log.duration}</span>
                                      </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                      <Download className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <Phone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No call logs found</h3>
                  <p className="text-sm text-gray-600">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}