import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Phone,
  PhoneOff,
  Headphones,
  MessageSquare,
  PhoneIncoming,
  Play,
  Pause,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  TrendingUp,
  Activity,
  Bot,
  User,
} from "lucide-react";

interface CallCard {
  id: string;
  agentName: string;
  agentAvatar: string;
  leadName: string;
  company?: string;
  phone: string;
  campaign: string;
  duration: number;
  status: "active" | "attention" | "positive" | "escalating" | "ringing" | "wrapup";
  sentiment: "positive" | "neutral" | "negative";
  confidence: number;
  currentTopic: string;
  alert?: string;
  borderColor: string;
}

export function LiveMonitor() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(2);
  const [isPaused, setIsPaused] = useState(false);

  // Call cards data
  const [calls, setcalls] = useState<CallCard[]>([
    {
      id: "1",
      agentName: "Priya",
      agentAvatar: "PS",
      leadName: "Rajesh Kumar",
      company: "Mehta Jewellers",
      phone: "+91 98765 43210",
      campaign: "Jewellery Software Q2",
      duration: 222, // 3:42
      status: "active",
      sentiment: "positive",
      confidence: 89,
      currentTopic: "Discussing pricing for 3-store setup",
      borderColor: "border-cyan-500",
    },
    {
      id: "2",
      agentName: "Amit",
      agentAvatar: "AS",
      leadName: "Suresh Patel",
      company: "Patel Traders",
      phone: "+91 87654 32109",
      campaign: "Trading Platform Outreach",
      duration: 312, // 5:12
      status: "attention",
      sentiment: "neutral",
      confidence: 62,
      currentTopic: "Customer asking about competitor comparison",
      alert: "Low confidence — consider intervention",
      borderColor: "border-amber-500",
    },
    {
      id: "3",
      agentName: "Neha",
      agentAvatar: "NP",
      leadName: "Priya Mehta",
      company: "Gold Palace",
      phone: "+91 76543 21987",
      campaign: "Product Demo Follow-ups",
      duration: 105, // 1:45
      status: "positive",
      sentiment: "positive",
      confidence: 94,
      currentTopic: "Scheduling demo for next week",
      borderColor: "border-green-500",
    },
    {
      id: "4",
      agentName: "Collection Bot",
      agentAvatar: "CB",
      leadName: "Dinesh Shah",
      company: "Shah Enterprises",
      phone: "+91 98712 34567",
      campaign: "Payment Recovery Q1",
      duration: 150, // 2:30
      status: "escalating",
      sentiment: "negative",
      confidence: 45,
      currentTopic: "Payment dispute escalation",
      alert: "Escalation requested — waiting for human agent",
      borderColor: "border-red-500",
    },
    {
      id: "5",
      agentName: "Priya",
      agentAvatar: "PS",
      leadName: "Unknown Lead",
      phone: "+91 76543 21098",
      campaign: "Jewellery Software Q2",
      duration: 0,
      status: "ringing",
      sentiment: "neutral",
      confidence: 0,
      currentTopic: "Ringing...",
      borderColor: "border-gray-400",
    },
    {
      id: "6",
      agentName: "Amit",
      agentAvatar: "AS",
      leadName: "Ananya Sharma",
      company: "Modern Retail",
      phone: "+91 98765 12345",
      campaign: "Trading Platform Outreach",
      duration: 0,
      status: "wrapup",
      sentiment: "positive",
      confidence: 0,
      currentTopic: "Generating summary...",
      borderColor: "border-gray-400",
    },
  ]);

  const activityFeed = [
    {
      time: "3:42 PM",
      text: "Rajesh Kumar answered (Priya)",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    },
    {
      time: "3:41 PM",
      text: "+91 87654 failed, retry 2/3",
      icon: <XCircle className="w-4 h-4 text-red-500" />,
    },
    {
      time: "3:40 PM",
      text: "Suresh Patel: sentiment drop detected",
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    },
    {
      time: "3:38 PM",
      text: "Demo booked: Ananya Sharma",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    },
    {
      time: "3:35 PM",
      text: "Transfer: Dinesh Shah → Deepak V.",
      icon: <ArrowRight className="w-4 h-4 text-orange-500" />,
    },
    {
      time: "3:33 PM",
      text: "Priya Mehta answered (Neha)",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    },
    {
      time: "3:30 PM",
      text: "Low confidence alert: Call #2847",
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    },
    {
      time: "3:28 PM",
      text: "Campaign paused: Legacy Migration",
      icon: <Pause className="w-4 h-4 text-gray-500" />,
    },
    {
      time: "3:25 PM",
      text: "No answer: +91 98712 45678",
      icon: <XCircle className="w-4 h-4 text-red-500" />,
    },
    {
      time: "3:22 PM",
      text: "Meeting scheduled: Vikram Singh",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    },
  ];

  // Update durations every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setLastUpdate((prev) => prev + 1);
      
      if (!isPaused) {
        setcalls((prevCalls) =>
          prevCalls.map((call) => {
            if (call.status === "active" || call.status === "attention" || call.status === "positive" || call.status === "escalating") {
              return { ...call, duration: call.duration + 1 };
            }
            return call;
          })
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Reset last update every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(0);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="w-4 h-4 text-green-500" />;
      case "neutral":
        return <Meh className="w-4 h-4 text-amber-500" />;
      case "negative":
        return <Frown className="w-4 h-4 text-red-500" />;
      default:
        return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "Positive";
      case "neutral":
        return "Neutral/Uncertain";
      case "negative":
        return "Frustrated";
      default:
        return "Unknown";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const activeCount = calls.filter((c) => c.status === "active" || c.status === "attention" || c.status === "positive" || c.status === "escalating").length;
  const ringingCount = calls.filter((c) => c.status === "ringing").length;
  const onHoldCount = 2;
  const transferringCount = 1;

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "AI Calling", href: "/tenant/ai-calling" },
          { label: "Live Monitor" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />

      <div className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
        {/* TOP BAR */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Live Monitor
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                </h1>
              </div>

              {/* Counters */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-cyan-600">{activeCount}</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-amber-600">{ringingCount}</div>
                  <div className="text-xs text-gray-600">Ringing</div>
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-gray-600">{onHoldCount}</div>
                  <div className="text-xs text-gray-600">On Hold</div>
                </div>
                <div className="w-px h-10 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-orange-600">{transferringCount}</div>
                  <div className="text-xs text-gray-600">Transferring</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live • Updated {lastUpdate}s ago
                </div>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-4 py-2 bg-white border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pause All
                </button>
                <button 
                  onClick={() => navigate("/tenant/ai-campaigns/create")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Start New Call
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-hidden flex">
          {/* CALL CARDS GRID */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {calls.map((call) => (
                  <CallCardComponent 
                    key={call.id} 
                    call={call} 
                    formatDuration={formatDuration} 
                    getSentimentIcon={getSentimentIcon} 
                    getSentimentLabel={getSentimentLabel} 
                    getConfidenceColor={getConfidenceColor}
                    onNavigate={navigate}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Activity Feed
              </h3>
              <div className="space-y-3">
                {activityFeed.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs">
                    <div className="flex-shrink-0 mt-0.5">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-500 font-mono mb-0.5">{activity.time}</div>
                      <div className="text-gray-900">{activity.text}</div>
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

function CallCardComponent({
  call,
  formatDuration,
  getSentimentIcon,
  getSentimentLabel,
  getConfidenceColor,
  onNavigate,
}: {
  call: CallCard;
  formatDuration: (seconds: number) => string;
  getSentimentIcon: (sentiment: string) => JSX.Element;
  getSentimentLabel: (sentiment: string) => string;
  getConfidenceColor: (confidence: number) => string;
  onNavigate: (path: string) => void;
}) {
  const [showWhisperModal, setShowWhisperModal] = useState(false);
  const [whisperMessage, setWhisperMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const isActive = call.status === "active" || call.status === "attention" || call.status === "positive" || call.status === "escalating";

  return (
    <div className={`bg-white rounded-lg border-l-4 ${call.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-700">
              {call.agentAvatar}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{call.agentName}</div>
              {call.status === "ringing" && (
                <div className="text-xs text-gray-500">Attempt 2 of 3</div>
              )}
            </div>
          </div>
          {isActive && (
            <div className="text-right">
              <div className="text-xl font-mono font-bold text-cyan-600">
                {formatDuration(call.duration)}
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
          )}
        </div>

        {/* Lead Info */}
        <div className="mb-3">
          <div className="font-bold text-gray-900">{call.leadName}</div>
          {call.company && <div className="text-sm text-gray-600">{call.company}</div>}
          <div className="text-xs font-mono text-gray-500">{call.phone}</div>
        </div>

        {/* Campaign Tag */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {call.campaign}
          </span>
        </div>

        {/* Live Waveform (only for active calls) */}
        {isActive && call.status !== "wrapup" && (
          <div className="mb-3 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg">
            <div className="flex items-center gap-1 h-12">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-indigo-400 to-violet-400 rounded-full transition-all duration-150"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ringing Status */}
        {call.status === "ringing" && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-sm text-gray-600 animate-pulse">Ringing...</div>
          </div>
        )}

        {/* Wrap-up Status */}
        {call.status === "wrapup" && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              Generating Summary...
            </div>
            <div className="text-xs text-green-600 font-medium">
              Outcome: Interested — Demo Booked
            </div>
          </div>
        )}

        {/* Sentiment & Confidence (for active calls) */}
        {isActive && call.status !== "wrapup" && (
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              {getSentimentIcon(call.sentiment)}
              <div>
                <div className="text-xs text-gray-600">Sentiment</div>
                <div className="text-xs font-medium text-gray-900">
                  {getSentimentLabel(call.sentiment)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">AI Confidence</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      call.confidence >= 80
                        ? "bg-green-500"
                        : call.confidence >= 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${call.confidence}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-bold ${getConfidenceColor(call.confidence)}`}>
                  {call.confidence}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Alert (if any) */}
        {call.alert && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">{call.alert}</div>
          </div>
        )}

        {/* Current Topic */}
        {call.status !== "ringing" && call.status !== "wrapup" && (
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-900 italic">"{call.currentTopic}"</div>
          </div>
        )}

        {/* Escalation Button */}
        {call.status === "escalating" && (
          <div className="mb-3">
            <button 
              onClick={() => onNavigate("/tenant/transfer-queue")}
              className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm animate-pulse"
            >
              Accept Transfer
            </button>
          </div>
        )}

        {/* Action Buttons (for active non-escalating calls) */}
        {isActive && call.status !== "escalating" && call.status !== "wrapup" && (
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`p-2 ${isListening ? 'bg-green-100' : 'bg-gray-100'} hover:bg-gray-200 rounded-lg transition-colors flex flex-col items-center gap-1`}
              title="Monitor call silently"
            >
              <Headphones className={`w-4 h-4 ${isListening ? 'text-green-700' : 'text-gray-700'}`} />
              <span className={`text-xs ${isListening ? 'text-green-700' : 'text-gray-700'}`}>
                {isListening ? 'Listening' : 'Listen'}
              </span>
            </button>
            <button
              onClick={() => setShowWhisperModal(true)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex flex-col items-center gap-1"
              title="Send instruction to AI"
            >
              <MessageSquare className="w-4 h-4 text-gray-700" />
              <span className="text-xs text-gray-700">Whisper</span>
            </button>
            <button
              onClick={() => onNavigate("/tenant/transfer-queue")}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex flex-col items-center gap-1"
              title="Join the call"
            >
              <PhoneIncoming className="w-4 h-4 text-gray-700" />
              <span className="text-xs text-gray-700">Barge</span>
            </button>
            <button
              onClick={() => {
                if (confirm(`End call with ${call.leadName}?`)) {
                  alert('Call ended successfully');
                }
              }}
              className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex flex-col items-center gap-1"
              title="End call"
            >
              <PhoneOff className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-600">End</span>
            </button>
          </div>
        )}
        
        {/* Whisper Modal */}
        {showWhisperModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Send Instruction to AI</h3>
                <button
                  onClick={() => setShowWhisperModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Send a private message to the AI agent during the call with {call.leadName}.
              </p>
              <textarea
                value={whisperMessage}
                onChange={(e) => setWhisperMessage(e.target.value)}
                placeholder="e.g., Mention the discount offer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWhisperModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Instruction sent to AI: "${whisperMessage}"`);
                    setWhisperMessage("");
                    setShowWhisperModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Send Instruction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
