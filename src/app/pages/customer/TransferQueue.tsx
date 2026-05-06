import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Users,
  Phone,
  PhoneForwarded,
  Voicemail,
  Clock,
  Building2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Coffee,
  Smile,
  Meh,
  Frown,
  ChevronRight,
  ChevronLeft,
  Target,
} from "lucide-react";

interface TransferCard {
  id: string;
  urgency: "urgent" | "high" | "normal" | "completed";
  waitingTime: number; // in seconds
  lead: string;
  company: string;
  reason: string;
  aiSummary: string;
  sentiment: "happy" | "neutral" | "angry";
  campaign: string;
  aiAgent: string;
  transferredTo?: string;
  transferredAt?: string;
  durationWithHuman?: string;
  outcome?: string;
}

interface Agent {
  id: string;
  name: string;
  status: "available" | "on-call" | "break";
  currentCall?: string;
  transfersToday: number;
}

const initialTransfers: TransferCard[] = [
  {
    id: "1",
    urgency: "urgent",
    waitingTime: 154,
    lead: "Dinesh Shah",
    company: "Shah Enterprises",
    reason: "Customer requested human agent",
    aiSummary:
      "Customer frustrated about billing charges. Wants to speak to manager. Has been a customer for 2 years. Outstanding amount: INR 45,000.",
    sentiment: "angry",
    campaign: "Collections March",
    aiAgent: "Collection Bot",
  },
  {
    id: "2",
    urgency: "high",
    waitingTime: 72,
    lead: "Priya Mehta",
    company: "Gold Palace Jewellers",
    reason: "AI confidence dropped below threshold",
    aiSummary:
      "Customer asking detailed technical questions about API integration. AI unable to provide specific answers.",
    sentiment: "neutral",
    campaign: "Technical Support",
    aiAgent: "Support AI",
  },
  {
    id: "3",
    urgency: "normal",
    waitingTime: 28,
    lead: "Amit Verma",
    company: "TechVista Solutions",
    reason: "Payment negotiation required",
    aiSummary:
      "Customer willing to pay but requesting 30-day extension. Needs human authorization.",
    sentiment: "neutral",
    campaign: "Collections March",
    aiAgent: "Collection Bot",
  },
  {
    id: "4",
    urgency: "completed",
    waitingTime: 0,
    lead: "Previous Transfer",
    company: "Transferred Successfully",
    reason: "Completed",
    aiSummary: "",
    sentiment: "neutral",
    campaign: "Collections March",
    aiAgent: "Collection Bot",
    transferredTo: "Deepak V.",
    transferredAt: "2 min ago",
    durationWithHuman: "4:15",
    outcome: "Resolved — Payment plan agreed",
  },
];

const agents: Agent[] = [
  { id: "1", name: "Priya Sharma", status: "available", transfersToday: 3 },
  {
    id: "2",
    name: "Deepak Verma",
    status: "on-call",
    currentCall: "Dinesh Shah (4:15)",
    transfersToday: 5,
  },
  { id: "3", name: "Neha Gupta", status: "available", transfersToday: 2 },
  { id: "4", name: "Amit Patel", status: "break", transfersToday: 4 },
  { id: "5", name: "Rohit Singh", status: "available", transfersToday: 1 },
];

const transferHistory = [
  {
    time: "3:42 PM",
    lead: "Dinesh Shah",
    agent: "Deepak V.",
    reason: "Customer request",
    status: "completed",
  },
  {
    time: "3:15 PM",
    lead: "Suresh P.",
    agent: "Priya S.",
    reason: "Low confidence",
    status: "completed",
  },
  {
    time: "2:50 PM",
    lead: "Unknown Caller",
    agent: "Voicemail",
    reason: "",
    status: "voicemail",
  },
  {
    time: "2:30 PM",
    lead: "Rajesh K.",
    agent: "Amit P.",
    reason: "Payment negotiation",
    status: "completed",
  },
];

export function TransferQueue() {
  const navigate = useNavigate();
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [transfers, setTransfers] = useState<TransferCard[]>(initialTransfers);
  const [showSidebar, setShowSidebar] = useState(true);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTransfers((prev) =>
        prev.map((t) =>
          t.urgency !== "completed" ? { ...t, waitingTime: t.waitingTime + 1 } : t
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pendingCount = transfers.filter((t) => t.urgency !== "completed").length;
  const availableAgents = agents.filter((a) => a.status === "available").length;

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return {
          border: "border-red-500",
          bg: "bg-red-50",
          timer: "text-red-700",
          badge: "bg-red-100 text-red-700 border-red-300",
          pulse: true,
        };
      case "high":
        return {
          border: "border-amber-500",
          bg: "bg-amber-50",
          timer: "text-amber-700",
          badge: "bg-amber-100 text-amber-700 border-amber-300",
          pulse: false,
        };
      case "normal":
        return {
          border: "border-blue-500",
          bg: "bg-blue-50",
          timer: "text-blue-700",
          badge: "bg-blue-100 text-blue-700 border-blue-300",
          pulse: false,
        };
      case "completed":
        return {
          border: "border-gray-300",
          bg: "bg-gray-50",
          timer: "text-gray-600",
          badge: "bg-gray-100 text-gray-600 border-gray-300",
          pulse: false,
        };
      default:
        return {
          border: "border-gray-300",
          bg: "bg-white",
          timer: "text-gray-700",
          badge: "bg-gray-100 text-gray-700 border-gray-300",
          pulse: false,
        };
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "happy":
        return <Smile className="w-5 h-5 text-green-600" />;
      case "neutral":
        return <Meh className="w-5 h-5 text-yellow-600" />;
      case "angry":
        return <Frown className="w-5 h-5 text-red-600" />;
      default:
        return <Meh className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tenant/ai-calling")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">Transfer Queue</h1>
                {pendingCount > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold border border-red-300">
                    {pendingCount} pending
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sound Alerts Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sound alerts</span>
                <button
                  onClick={() => setSoundAlerts(!soundAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundAlerts ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                {soundAlerts ? (
                  <Bell className="w-4 h-4 text-indigo-600" />
                ) : (
                  <BellOff className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {/* Available Agents Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <Users className="w-4 h-4 text-green-700" />
                <span className="text-sm font-semibold text-green-900">
                  Available Agents: {availableAgents}/{agents.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Active Transfer Cards - 2x2 Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Transfers</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {transfers.map((transfer) => {
                  const styles = getUrgencyStyles(transfer.urgency);

                  if (transfer.urgency === "completed") {
                    return (
                      <div
                        key={transfer.id}
                        className={`bg-white rounded-lg border-2 ${styles.border} p-5 opacity-60`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-gray-700">
                              Transferred to {transfer.transferredTo}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{transfer.transferredAt}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Duration with human:</span>{" "}
                            {transfer.durationWithHuman}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Outcome:</span> {transfer.outcome}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={transfer.id}
                      className={`bg-white rounded-lg border-2 ${styles.border} ${
                        styles.pulse ? "animate-pulse" : ""
                      } shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      {/* Timer Header */}
                      <div className={`${styles.bg} px-5 py-3 rounded-t-lg border-b ${styles.border}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-5 h-5 ${styles.timer}`} />
                            <span className={`text-xl font-bold font-mono ${styles.timer}`}>
                              WAITING {formatTime(transfer.waitingTime)}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase border ${styles.badge}`}
                          >
                            {transfer.urgency}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-4">
                        {/* Lead Info */}
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {transfer.lead}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Building2 className="w-4 h-4" />
                                <span>{transfer.company}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {getSentimentIcon(transfer.sentiment)}
                            </div>
                          </div>

                          {/* Reason Badge */}
                          <div className="flex items-start gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className={`text-sm font-medium px-2 py-1 rounded border ${styles.badge}`}>
                              {transfer.reason}
                            </span>
                          </div>
                        </div>

                        {/* AI Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            AI Summary
                          </h4>
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {transfer.aiSummary}
                          </p>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" />
                            <span>{transfer.campaign}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{transfer.aiAgent}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2 shadow-md">
                            <Phone className="w-4 h-4" />
                            Accept Call
                          </button>
                          <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2">
                            <PhoneForwarded className="w-4 h-4" />
                            Forward
                          </button>
                          <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                            <Voicemail className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Human Agents */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Available Human Agents</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Agent Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Current Call
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Transfers Today
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                        </td>
                        <td className="py-4 px-4">
                          {agent.status === "available" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Available
                            </span>
                          )}
                          {agent.status === "on-call" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                              <Phone className="w-3.5 h-3.5" />
                              On Call
                            </span>
                          )}
                          {agent.status === "break" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                              <Coffee className="w-3.5 h-3.5" />
                              Break
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {agent.currentCall ? (
                            <span className="text-sm text-gray-900 font-mono">
                              {agent.currentCall}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {agent.transfersToday}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {agent.status === "available" ? (
                            <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                              Accept
                            </button>
                          ) : agent.status === "on-call" ? (
                            <span className="text-sm text-gray-500 font-medium">Busy</span>
                          ) : (
                            <span className="text-sm text-gray-400 font-medium">Unavailable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Sidebar - Transfer History */}
        <div
          className={`bg-white border-l border-gray-200 transition-all duration-300 ${
            showSidebar ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          <div className="w-80 h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Transfer History</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">Today's transfers</p>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transferHistory.map((history, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-900">{history.time}</span>
                    {history.status === "completed" && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {history.status === "voicemail" && (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{history.lead}</div>
                  <div className="text-xs text-gray-600">
                    → {history.agent}
                    {history.reason && ` (${history.reason})`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button (when collapsed) */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-l-0 border-gray-200 rounded-l-lg p-2 hover:bg-gray-50 transition-colors shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
