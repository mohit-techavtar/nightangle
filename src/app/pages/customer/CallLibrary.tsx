import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Download,
  Calendar,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronLeft,
  Filter,
  ExternalLink,
  Flag,
  Database,
  Smile,
  Meh,
  Frown,
  Check,
  Phone,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface CallRecord {
  id: string;
  hasRecording: boolean;
  leadName: string;
  phone: string;
  campaign: string;
  agent: string;
  duration: string;
  outcome: "interested" | "callback" | "not-interested" | "no-answer" | "transferred";
  sentiment: "positive" | "neutral" | "negative" | null;
  date: string;
  transcriptPreview?: string;
  aiSummary?: string;
}

const callRecords: CallRecord[] = [
  {
    id: "1",
    hasRecording: true,
    leadName: "Rajesh Kumar",
    phone: "+91 98765 43210",
    campaign: "Jewellery Q2",
    agent: "Priya",
    duration: "4:32",
    outcome: "interested",
    sentiment: "positive",
    date: "Apr 1, 2:30 PM",
    transcriptPreview: `AI Agent: Namaste Rajesh ji! Main Priya bol rahi hoon Nightangle CRM se. Aapne humari jewellery software ke baare mein inquiry ki thi.

Rajesh Kumar: Haan haan, yaad hai. Batao kya features hain?

AI Agent: Bilkul! Humare software mein inventory management, customer database, billing, aur GST compliance sabhi features hain. Aapka business kitne stores mein hai?

Rajesh Kumar: Do stores hain. Ek Mumbai aur ek Pune mein. Multi-location support hai kya?`,
    aiSummary:
      "Customer is interested in jewellery software for 2 stores (Mumbai & Pune). Asked about multi-location support and inventory management. Positive engagement, ready for demo. Next step: Schedule product demonstration within 3 days.",
  },
  {
    id: "2",
    hasRecording: true,
    leadName: "Suresh Patel",
    phone: "+91 87654 32109",
    campaign: "Trading Platform",
    agent: "Amit",
    duration: "5:12",
    outcome: "callback",
    sentiment: "neutral",
    date: "Apr 1, 11:00 AM",
    transcriptPreview: `AI Agent: Good morning Mr. Patel. This is Amit from Nightangle Trading Platform. We spoke last week about your commodity trading needs.

Suresh Patel: Yes, I remember. Look, I'm in a meeting right now.

AI Agent: I understand. Would you prefer I call you at a better time?

Suresh Patel: Yes, call me after 4 PM today.`,
    aiSummary:
      "Customer was busy during the call. Requested callback after 4 PM same day. Previously discussed commodity trading platform needs. Neutral sentiment, not a rejection.",
  },
  {
    id: "3",
    hasRecording: false,
    leadName: "Unknown",
    phone: "+91 76543 21098",
    campaign: "Collections March",
    agent: "Collection Bot",
    duration: "0:45",
    outcome: "no-answer",
    sentiment: null,
    date: "Apr 1, 10:30 AM",
  },
  {
    id: "4",
    hasRecording: true,
    leadName: "Ananya Sharma",
    phone: "+91 65432 10987",
    campaign: "Jewellery Q2",
    agent: "Priya",
    duration: "3:18",
    outcome: "not-interested",
    sentiment: "negative",
    date: "Mar 31, 5:45 PM",
    transcriptPreview: `AI Agent: Hello Ananya ji, this is Priya from Nightangle CRM. I'm calling about our jewellery management software.

Ananya Sharma: I already told you people I'm not interested. Please remove my number.

AI Agent: I apologize for the inconvenience. I'll make sure your number is removed from our calling list immediately.

Ananya Sharma: Thank you. [Call ended]`,
    aiSummary:
      "Customer explicitly requested to be removed from calling list. Previously contacted. Negative sentiment. Action taken: Number marked as DND (Do Not Disturb). No further follow-up.",
  },
  {
    id: "5",
    hasRecording: true,
    leadName: "Vikram Malhotra",
    phone: "+91 54321 09876",
    campaign: "Trading Platform",
    agent: "Amit",
    duration: "6:45",
    outcome: "interested",
    sentiment: "positive",
    date: "Mar 31, 3:20 PM",
    aiSummary:
      "Customer is a commodity trader looking for automated trading platform. Interested in API integration and real-time data feeds. Requested technical documentation and pricing. Follow-up: Send proposal within 24 hours.",
  },
  {
    id: "6",
    hasRecording: true,
    leadName: "Priya Mehta",
    phone: "+91 43210 98765",
    campaign: "Collections March",
    agent: "Collection Bot",
    duration: "4:10",
    outcome: "callback",
    sentiment: "neutral",
    date: "Mar 31, 2:15 PM",
    aiSummary:
      "Customer acknowledged outstanding payment of INR 45,000. Requested extension of 15 days due to cash flow issues. Willing to pay but needs time. Scheduled follow-up call on Apr 15.",
  },
  {
    id: "7",
    hasRecording: true,
    leadName: "Deepak Singh",
    phone: "+91 32109 87654",
    campaign: "NPS Survey",
    agent: "Survey Bot",
    duration: "2:28",
    outcome: "interested",
    sentiment: "positive",
    date: "Mar 31, 12:00 PM",
    aiSummary:
      "Customer gave NPS score of 9/10. Very satisfied with product. Suggested adding mobile app feature. Willing to provide testimonial. Positive brand advocate.",
  },
  {
    id: "8",
    hasRecording: true,
    leadName: "Neha Gupta",
    phone: "+91 21098 76543",
    campaign: "Jewellery Q2",
    agent: "Priya",
    duration: "1:35",
    outcome: "transferred",
    sentiment: "neutral",
    date: "Mar 31, 10:45 AM",
    aiSummary:
      "Customer had complex technical questions about API integration that AI couldn't answer confidently. Transferred to human technical expert (Deepak V.). Transfer successful.",
  },
  {
    id: "9",
    hasRecording: false,
    leadName: "Rahul Verma",
    phone: "+91 10987 65432",
    campaign: "Trading Platform",
    agent: "Amit",
    duration: "0:22",
    outcome: "no-answer",
    sentiment: null,
    date: "Mar 30, 6:30 PM",
  },
  {
    id: "10",
    hasRecording: true,
    leadName: "Sneha Kapoor",
    phone: "+91 09876 54321",
    campaign: "Jewellery Q2",
    agent: "Priya",
    duration: "5:50",
    outcome: "interested",
    sentiment: "positive",
    date: "Mar 30, 4:15 PM",
    aiSummary:
      "Customer runs 3 jewellery stores. Very interested in inventory and billing features. Asked about pricing for 5-user license. Demo scheduled for Apr 5 at 11 AM. High-value lead.",
  },
];

export function CallLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>("1");
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [campaignFilter, setCampaignFilter] = useState("All Campaigns");
  const [agentFilter, setAgentFilter] = useState("All Agents");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [durationFilter, setDurationFilter] = useState("All");
  const [hasRecordingOnly, setHasRecordingOnly] = useState(false);
  const [perPage, setPerPage] = useState(25);

  const toggleRowSelection = (id: string) => {
    setSelectedCalls((prev) =>
      prev.includes(id) ? prev.filter((callId) => callId !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedCalls.length === callRecords.length) {
      setSelectedCalls([]);
    } else {
      setSelectedCalls(callRecords.map((call) => call.id));
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "interested":
        return <Check className="w-4 h-4 text-green-600" />;
      case "callback":
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case "not-interested":
        return <X className="w-4 h-4 text-red-600" />;
      case "no-answer":
        return <X className="w-4 h-4 text-gray-400" />;
      case "transferred":
        return <Phone className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "interested":
        return "bg-green-100 text-green-700 border-green-300";
      case "callback":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "not-interested":
        return "bg-red-100 text-red-700 border-red-300";
      case "no-answer":
        return "bg-gray-100 text-gray-600 border-gray-300";
      case "transferred":
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="w-5 h-5 text-green-600" />;
      case "neutral":
        return <Meh className="w-5 h-5 text-yellow-600" />;
      case "negative":
        return <Frown className="w-5 h-5 text-red-600" />;
      default:
        return <span className="text-xs text-gray-400">N/A</span>;
    }
  };

  const formatOutcome = (outcome: string) => {
    switch (outcome) {
      case "interested":
        return "Interested";
      case "callback":
        return "Callback";
      case "not-interested":
        return "Not Interested";
      case "no-answer":
        return "No Answer";
      case "transferred":
        return "Transferred";
      default:
        return outcome;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tenant/ai-calling")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">Call Library</h1>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    4,847 calls
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transcripts, leads, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Export Button */}
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
                <Download className="w-4 h-4" />
                Export Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range */}
            <div className="relative">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-600" />
                {dateRange}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Campaign Filter */}
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All Campaigns</option>
              <option>Jewellery Q2</option>
              <option>Trading Platform</option>
              <option>Collections March</option>
              <option>NPS Survey</option>
            </select>

            {/* Agent Filter */}
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All Agents</option>
              <option>Priya</option>
              <option>Amit</option>
              <option>Collection Bot</option>
              <option>Survey Bot</option>
            </select>

            {/* Outcome Filter */}
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All</option>
              <option>Interested</option>
              <option>Callback</option>
              <option>Not Interested</option>
              <option>No Answer</option>
              <option>Transferred</option>
            </select>

            {/* Sentiment Filter */}
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All</option>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>

            {/* Duration Filter */}
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>All</option>
              <option>&lt;1min</option>
              <option>1-3min</option>
              <option>3-5min</option>
              <option>&gt;5min</option>
            </select>

            {/* Has Recording Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={hasRecordingOnly}
                onChange={(e) => setHasRecordingOnly(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Has Recording</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCalls.length > 0 && (
        <div className="bg-indigo-50 border-b border-indigo-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-900">
              {selectedCalls.length} call{selectedCalls.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                Download Selected ({selectedCalls.length})
              </button>
              <button className="px-3 py-1.5 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                Export Transcripts
              </button>
              <button className="px-3 py-1.5 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                Add to Training
              </button>
              <button className="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Call List Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left w-10">
                      <button onClick={toggleAllSelection}>
                        {selectedCalls.length === callRecords.length ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 text-left w-12"></th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lead Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Outcome
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sentiment
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {callRecords.map((call) => (
                    <React.Fragment key={call.id}>
                      {/* Main Row */}
                      <tr
                        className={`hover:bg-gray-50 transition-colors ${
                          expandedRow === call.id ? "bg-indigo-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <button onClick={() => toggleRowSelection(call.id)}>
                            {selectedCalls.includes(call.id) ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              setExpandedRow(expandedRow === call.id ? null : call.id)
                            }
                            className="flex items-center gap-1"
                          >
                            {call.hasRecording ? (
                              <Play className="w-5 h-5 text-indigo-600 hover:text-indigo-700" />
                            ) : (
                              <X className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {call.leadName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono text-gray-700">{call.phone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{call.campaign}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{call.agent}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono text-gray-900">{call.duration}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getOutcomeColor(
                              call.outcome
                            )}`}
                          >
                            {getOutcomeIcon(call.outcome)}
                            {formatOutcome(call.outcome)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{getSentimentIcon(call.sentiment)}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{call.date}</span>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRow === call.id && call.hasRecording && (
                        <tr className="bg-indigo-50">
                          <td colSpan={10} className="py-4 px-6">
                            <div className="space-y-4">
                              {/* Audio Player */}
                              <div className="bg-white rounded-lg border border-indigo-200 p-4">
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
                                  >
                                    {isPlaying ? (
                                      <Pause className="w-5 h-5" />
                                    ) : (
                                      <Play className="w-5 h-5 ml-0.5" />
                                    )}
                                  </button>

                                  {/* Waveform */}
                                  <div className="flex-1 h-12 bg-gray-100 rounded-lg flex items-center px-2 gap-0.5">
                                    {Array.from({ length: 60 }).map((_, i) => {
                                      const height = Math.random() * 40 + 10;
                                      return (
                                        <div
                                          key={i}
                                          className="flex-1 bg-indigo-500 rounded-full"
                                          style={{
                                            height: `${height}%`,
                                            opacity: i < 30 ? 0.5 : 1,
                                          }}
                                        />
                                      );
                                    })}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                      <SkipBack className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-mono text-gray-700 w-16 text-center">
                                      1:23 / {call.duration}
                                    </span>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                      <SkipForward className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Transcript Preview */}
                                {call.transcriptPreview && (
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                      Transcript Preview
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                                      {call.transcriptPreview.split("\n\n").map((exchange, idx) => (
                                        <p key={idx} className="whitespace-pre-wrap">
                                          {exchange}
                                        </p>
                                      ))}
                                      <p className="text-xs text-gray-500 italic mt-2">
                                        ... [truncated]
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* AI Summary */}
                                {call.aiSummary && (
                                  <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg border border-violet-200 p-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                      AI Summary
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {call.aiSummary}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Quick Actions */}
                              <div className="flex items-center gap-2 pt-2">
                                <button
                                  onClick={() => navigate("/tenant/call-detail")}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Full Detail
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                                  <Download className="w-4 h-4" />
                                  Download Recording
                                </button>
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                                  <Database className="w-4 h-4" />
                                  Add to Training Set
                                </button>
                                <button className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium flex items-center gap-2">
                                  <Flag className="w-4 h-4" />
                                  Flag for Review
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1-{callRecords.length}</span> of{" "}
                  <span className="font-medium">4,847</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                      1
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm font-medium">
                      2
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm font-medium">
                      3
                    </button>
                    <span className="text-sm text-gray-500">...</span>
                    <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm font-medium">
                      194
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
