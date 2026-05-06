import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useNavigate } from "react-router";
import {
  Bot,
  Plus,
  Search,
  Volume2,
  Star,
  Phone,
  Clock,
  Edit,
  Copy,
  Power,
  MoreVertical,
  ChevronRight,
  GitBranch,
  Rocket,
} from "lucide-react";

interface AIAgent {
  id: number;
  name: string;
  initials: string;
  type: "sales" | "support" | "collections" | "survey";
  accentColor: string;
  status: "active" | "inactive";
  campaignCount: number;
  voice: {
    gender: "Male" | "Female";
    languages: string[];
  };
  personalityTags: string[];
  rating: number;
  totalCalls: number;
  avgDuration: string;
}

interface AgentTemplate {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const agents: AIAgent[] = [
  {
    id: 1,
    name: "Priya (Sales)",
    initials: "PS",
    type: "sales",
    accentColor: "#8B5CF6", // Violet
    status: "active",
    campaignCount: 3,
    voice: { gender: "Female", languages: ["Hindi", "English"] },
    personalityTags: ["Persuasive", "Warm", "Professional"],
    rating: 4.2,
    totalCalls: 12450,
    avgDuration: "3m 38s",
  },
  {
    id: 2,
    name: "Amit (Support)",
    initials: "AS",
    type: "support",
    accentColor: "#3B82F6", // Blue
    status: "active",
    campaignCount: 2,
    voice: { gender: "Male", languages: ["Hindi"] },
    personalityTags: ["Helpful", "Patient", "Empathetic"],
    rating: 4.5,
    totalCalls: 8200,
    avgDuration: "5m 12s",
  },
  {
    id: 3,
    name: "Collection Bot",
    initials: "CB",
    type: "collections",
    accentColor: "#F59E0B", // Amber
    status: "active",
    campaignCount: 1,
    voice: { gender: "Male", languages: ["Hindi", "English"] },
    personalityTags: ["Firm", "Professional", "Clear"],
    rating: 3.8,
    totalCalls: 4100,
    avgDuration: "2m 55s",
  },
  {
    id: 4,
    name: "Survey Bot",
    initials: "SB",
    type: "survey",
    accentColor: "#6B7280", // Gray
    status: "inactive",
    campaignCount: 0,
    voice: { gender: "Female", languages: ["English"] },
    personalityTags: ["Neutral", "Concise"],
    rating: 0,
    totalCalls: 0,
    avgDuration: "0m 0s",
  },
  {
    id: 5,
    name: "Neha (Multilingual)",
    initials: "NM",
    type: "sales",
    accentColor: "#EC4899", // Pink
    status: "active",
    campaignCount: 1,
    voice: { gender: "Female", languages: ["Hindi", "Marathi", "English"] },
    personalityTags: ["Persuasive", "Regional", "Friendly"],
    rating: 4.0,
    totalCalls: 3250,
    avgDuration: "4m 15s",
  },
];

const templates: AgentTemplate[] = [
  {
    id: 1,
    name: "Sales Closer",
    description: "Confident closer for high-value deals",
    icon: "💼",
  },
  {
    id: 2,
    name: "Gentle Reminder",
    description: "Soft approach for payment reminders",
    icon: "🔔",
  },
  {
    id: 3,
    name: "Survey Conductor",
    description: "Neutral voice for feedback collection",
    icon: "📋",
  },
  {
    id: 4,
    name: "Appointment Setter",
    description: "Professional scheduler for meetings",
    icon: "📅",
  },
  {
    id: 5,
    name: "Product Demo Booker",
    description: "Enthusiastic demo appointment setter",
    icon: "🎯",
  },
];

export function AIAgents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [agentList, setAgentList] = useState<AIAgent[]>(agents);
  
  const handleToggleStatus = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setShowDeployModal(true);
  };
  
  const confirmToggleStatus = () => {
    if (selectedAgent) {
      setAgentList(prev =>
        prev.map(a =>
          a.id === selectedAgent.id
            ? { ...a, status: a.status === "active" ? "inactive" : "active" }
            : a
        )
      );
      setShowDeployModal(false);
      setSelectedAgent(null);
    }
  };

  const getTypeBadge = (type: AIAgent["type"]) => {
    const badges = {
      sales: { label: "Sales", color: "bg-green-100 text-green-700" },
      support: { label: "Support", color: "bg-blue-100 text-blue-700" },
      collections: { label: "Collections", color: "bg-amber-100 text-amber-700" },
      survey: { label: "Survey", color: "bg-gray-100 text-gray-700" },
    };
    const badge = badges[type];
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "AI Agents" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">AI Agents</h1>
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {agents.length}
              </span>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Create New Agent
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* AGENT GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {agentList.filter(agent => 
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.type.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Avatar Area */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="relative w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${agent.accentColor}15`,
                    border: `2px solid ${agent.accentColor}`,
                  }}
                >
                  <Bot
                    className="w-8 h-8"
                    style={{ color: agent.accentColor }}
                  />
                  <div
                    className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: agent.accentColor }}
                  >
                    {agent.initials}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5 truncate">
                    {agent.name}
                  </h3>
                  <div className="mb-2">{getTypeBadge(agent.type)}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1 ${
                        agent.status === "active" ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          agent.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      {agent.status === "active" ? "Active" : "Inactive"}
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {agent.campaignCount} campaign{agent.campaignCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Voice */}
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <span>
                  {agent.voice.gender}, {agent.voice.languages.join(" + ")}
                </span>
              </div>

              {/* Personality Tags */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {agent.personalityTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${agent.accentColor}15`,
                      color: agent.accentColor,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Performance */}
              {agent.status === "active" && agent.rating > 0 && (
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    {renderStars(agent.rating)}
                    <span className="text-sm font-semibold text-gray-900">
                      {agent.rating.toFixed(1)}/5
                    </span>
                    <span className="text-xs text-gray-500">avg rating</span>
                  </div>
                </div>
              )}

              {/* Stats Row */}
              {agent.totalCalls > 0 && (
                <div className="mb-4 flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium">
                      {agent.totalCalls.toLocaleString()}
                    </span>
                    <span>calls</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium font-mono">{agent.avgDuration}</span>
                    <span>avg</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/tenant/edit-agent")}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 flex items-center justify-center gap-1.5"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => navigate("/tenant/conversation-flow-editor")}
                  className="flex-1 px-3 py-1.5 border border-indigo-300 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium text-indigo-700 flex items-center justify-center gap-1.5"
                  title="Edit Flow"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  Flow
                </button>
                <button
                  onClick={() => handleToggleStatus(agent)}
                  className={`flex-1 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-1.5 ${
                    agent.status === "active"
                      ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                      : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  {agent.status === "active" ? (
                    <>
                      <Power className="w-3.5 h-3.5" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Rocket className="w-3.5 h-3.5" />
                      Deploy
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Create Agent Card */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create New AI Agent
            </h3>
            <p className="text-sm text-gray-600">
              Start from scratch or use a template
            </p>
          </div>
        </div>

        {/* AGENT TEMPLATES */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Agent Templates</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex-shrink-0 w-64 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-2xl">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
                <button className="w-full px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}