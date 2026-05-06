import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Download,
  Search,
  Bot,
  Smile,
  Meh,
  Frown,
  Star,
  CheckCircle2,
  Calendar,
  Phone,
  DollarSign,
  Tag,
  TrendingUp,
  Clock,
  PhoneOutgoing,
  MessageSquare,
  FileText,
  Edit3,
  Shield,
} from "lucide-react";

interface TranscriptMessage {
  speaker: "AI" | "Customer";
  timestamp: string;
  seconds: number;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  isKeyMoment?: boolean;
}

const transcriptData: TranscriptMessage[] = [
  {
    speaker: "AI",
    timestamp: "0:00",
    seconds: 0,
    text: 'Namaste Rajesh ji! Main Priya bol rahi hoon Nightangle CRM se. Aapne humari jewellery software ke baare mein inquiry ki thi. Kya aapke paas 2 minute hain?',
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "0:08",
    seconds: 8,
    text: "Haan haan, boliye. Maine form fill kiya tha Meta pe.",
    sentiment: "neutral",
  },
  {
    speaker: "AI",
    timestamp: "0:12",
    seconds: 12,
    text: "Bilkul! Aapka Mehta Jewellers mein kitne stores hain currently?",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "0:18",
    seconds: 18,
    text: "Teen stores hain Mumbai mein. Aur ek naya kholne ka plan hai Pune mein.",
    sentiment: "positive",
    isKeyMoment: true,
  },
  {
    speaker: "AI",
    timestamp: "0:25",
    seconds: 25,
    text: "Bahut accha! Toh aapke liye humara multi-location inventory module perfect rahega. Rajesh ji, aap currently konsa software use kar rahe hain?",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "0:36",
    seconds: 36,
    text: "Abhi Excel se manage kar rahe hain. Bahut problem ho rahi hai, specially inventory sync karne mein.",
    sentiment: "negative",
  },
  {
    speaker: "AI",
    timestamp: "0:45",
    seconds: 45,
    text: "Samajh sakti hoon. Excel se toh bahut manual work hota hai na. Humare software mein real-time sync hai across all locations. Plus automatic billing, customer database, aur purchase tracking bhi hai.",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "0:58",
    seconds: 58,
    text: "Haan yeh sab chahiye. Pricing kya hai?",
    sentiment: "neutral",
    isKeyMoment: true,
  },
  {
    speaker: "AI",
    timestamp: "1:04",
    seconds: 64,
    text: "Aapke 4 locations ke liye, complete package approximately 3.5 to 4.5 lakh ka hai annually. Ismein sab modules included hain - inventory, billing, CRM, reports, everything.",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "1:18",
    seconds: 78,
    text: "Thik hai, yeh range mein hai. Aur implementation kitne din mein hota hai?",
    sentiment: "positive",
  },
  {
    speaker: "AI",
    timestamp: "1:25",
    seconds: 85,
    text: "Setup aur training 2-3 weeks mein complete ho jata hai. Aur humari team on-site bhi aati hai training ke liye.",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "1:35",
    seconds: 95,
    text: "Achha hai. Kya main software dekh sakta hoon pehle? Demo ho sakta hai?",
    sentiment: "positive",
    isKeyMoment: true,
  },
  {
    speaker: "AI",
    timestamp: "1:42",
    seconds: 102,
    text: "Zaroor! Main aapke liye live demo schedule kar deti hoon. Is week Friday morning 10 baje chalega?",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "1:50",
    seconds: 110,
    text: "Haan Friday perfect hai. 10 baje kariye.",
    sentiment: "positive",
    isKeyMoment: true,
  },
  {
    speaker: "AI",
    timestamp: "1:55",
    seconds: 115,
    text: "Perfect! Main confirmation WhatsApp aur email send kar dungi aapko. Meeting link bhi bhej deti hoon. Aur koi question hai Rajesh ji?",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "2:06",
    seconds: 126,
    text: "Nahi abhi ke liye bas. Demo mein discuss karenge detail.",
    sentiment: "neutral",
  },
  {
    speaker: "AI",
    timestamp: "2:11",
    seconds: 131,
    text: "Bilkul, bilkul. Friday ko baat karenge detail mein. Thank you Rajesh ji! Apna din shubh rahe.",
    sentiment: "positive",
  },
  {
    speaker: "Customer",
    timestamp: "2:18",
    seconds: 138,
    text: "Thank you, bye!",
    sentiment: "positive",
  },
];

export function CallDetail() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(80);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"full" | "keyMoments">("full");

  const totalDuration = 272; // 4m 32s in seconds
  const progressPercentage = (currentTime / totalDuration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(Math.floor(totalDuration * percentage));
  };

  const filteredTranscript = transcriptData.filter((msg) => {
    const matchesSearch = msg.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesViewMode = viewMode === "full" || msg.isKeyMoment;
    return matchesSearch && matchesViewMode;
  });

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "positive") return <Smile className="w-4 h-4 text-green-600" />;
    if (sentiment === "negative") return <Frown className="w-4 h-4 text-red-600" />;
    return <Meh className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/tenant/call-logs")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Call Library
          </button>

          {/* Call Header Info */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-gray-500">#CALL-2026-04847</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                  4m 32s
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  Interested — Demo Booked
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Rajesh Kumar — Mehta Jewellers
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  April 1, 2026 at 2:30 PM IST
                </div>
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Priya (Sales)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1600px] mx-auto px-6 py-6">
          <div className="h-full flex gap-6">
            {/* LEFT COLUMN - 65% */}
            <div className="w-[65%] flex flex-col gap-6 overflow-y-auto">
              {/* Audio Player Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Recording</h3>

                {/* Waveform Visualization */}
                <div
                  className="relative h-24 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg mb-4 cursor-pointer overflow-hidden"
                  onClick={handleSeek}
                >
                  {/* Waveform bars - simplified visualization */}
                  <div className="absolute inset-0 flex items-center gap-[2px] px-2">
                    {Array.from({ length: 120 }).map((_, i) => {
                      const height = Math.random() * 60 + 20;
                      const isAISpeaking = i % 15 < 8;
                      const isPlayed = (i / 120) * 100 < progressPercentage;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-colors"
                          style={{
                            height: `${height}%`,
                            backgroundColor: isPlayed
                              ? isAISpeaking
                                ? "#6366F1"
                                : "#10B981"
                              : "#E0E7FF",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Progress indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-indigo-600 pointer-events-none"
                    style={{ left: `${progressPercentage}%` }}
                  />
                </div>

                {/* Speaker Legend */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                    <span>AI Speaking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <span>Customer Speaking</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-600 w-10">
                      {formatTime(currentTime)}
                    </span>
                    <div
                      className="flex-1 h-1.5 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-600 w-10">
                      {formatTime(totalDuration)}
                    </span>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Play/Pause */}
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>

                      {/* Speed Control */}
                      <div className="flex items-center gap-1 ml-2">
                        {[0.5, 1, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                              playbackSpeed === speed
                                ? "bg-indigo-100 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Volume Control */}
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-gray-600" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-20 h-1.5"
                        />
                        <span className="text-xs text-gray-600 w-8">{volume}%</span>
                      </div>

                      {/* Download */}
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Call Transcript</h3>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("full")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === "full"
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Full Transcript
                    </button>
                    <button
                      onClick={() => setViewMode("keyMoments")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === "keyMoments"
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Key Moments Only
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Transcript Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {filteredTranscript.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.speaker === "AI" ? "" : "flex-row-reverse"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                          msg.speaker === "AI" ? "bg-indigo-600" : "bg-green-600"
                        }`}
                      >
                        {msg.speaker === "AI" ? <Bot className="w-4 h-4" /> : "RK"}
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 ${msg.speaker === "AI" ? "" : "flex flex-col items-end"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-900">
                            {msg.speaker === "AI" ? "AI (Priya)" : "Customer"}
                          </span>
                          <button
                            onClick={() => setCurrentTime(msg.seconds)}
                            className="text-xs font-mono text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            [{msg.timestamp}]
                          </button>
                          {msg.isKeyMoment && (
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                        <div
                          className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.speaker === "AI"
                              ? "bg-indigo-50 text-gray-900"
                              : "bg-green-50 text-gray-900"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getSentimentIcon(msg.sentiment)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - 35% */}
            <div className="w-[35%] space-y-6 overflow-y-auto">
              {/* AI Analysis Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>

                <div className="space-y-4">
                  {/* Overall Sentiment */}
                  <div className="text-center py-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <Smile className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-900">Positive</div>
                    <div className="text-xs text-gray-600">Overall Sentiment</div>
                  </div>

                  {/* Confidence Score */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Confidence Score</div>
                      <div className="text-2xl font-bold text-indigo-600">89/100</div>
                    </div>
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#E5E7EB"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#6366F1"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(89 / 100) * 176} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-600 px-[19px] py-[0px]">
                        89%
                      </div>
                    </div>
                  </div>

                  {/* Other Metrics */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Intent Detected</div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        High Purchase Intent
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600 mb-1">Key Objections</div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        None detected
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600 mb-2">Engagement Level</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-900">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Call Summary</h3>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Customer confirmed 3 retail stores in Mumbai with expansion plans. Expressed strong
                  interest in inventory + billing modules. Budget approved up to 5L. Demo scheduled for
                  April 4, 2026 at 10:00 AM. No objections raised.
                </p>
              </div>

              {/* Actions Taken */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Taken</h3>
                <div className="space-y-2.5">
                  {[
                    "Lead stage updated: Contacted → Qualified",
                    "Demo scheduled: Apr 4, 2026 10:00 AM",
                    "Note added to lead profile",
                    "Follow-up WhatsApp sent",
                    'Tag added: "High Value"',
                    "Score updated: 65 → 85",
                  ].map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call Metadata */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Metadata</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <PhoneOutgoing className="w-4 h-4" />
                      Call Type
                    </span>
                    <span className="font-medium text-gray-900">Outbound</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Campaign
                    </span>
                    <span className="font-medium text-gray-900">Jewellery Software Q2</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telephony
                    </span>
                    <span className="font-medium text-gray-900">VoIP Provider A</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Call Cost
                    </span>
                    <span className="font-medium text-gray-900">INR 2.40</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Retry Attempt
                    </span>
                    <span className="font-medium text-gray-900">1 of 3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Consent Captured
                    </span>
                    <span className="font-medium text-green-700">Yes (recording enabled)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}