import React from "react";
import { useNavigate } from "react-router";
import { Play, ExternalLink, ArrowRight, Check, Circle, Book, Video, MessageCircle } from "lucide-react";

interface EmptyStateProps {
  type: "no-campaigns" | "no-agents" | "no-recordings" | "first-time-dashboard";
}

const templateCards = [
  {
    name: "Sales Outreach",
    description: "Introduce products to prospects",
    icon: "📞",
  },
  {
    name: "Collections",
    description: "Payment reminders & follow-ups",
    icon: "💰",
  },
  {
    name: "Customer Survey",
    description: "Gather feedback & insights",
    icon: "📊",
  },
];

const setupSteps = [
  {
    id: 1,
    title: "Create your first AI Agent",
    link: "/tenant/agent-studio",
    completed: false,
  },
  {
    id: 2,
    title: "Set up compliance & consent",
    link: "/tenant/compliance-consent",
    completed: false,
  },
  {
    id: 3,
    title: "Configure budget limits",
    link: "/tenant/cost-governance",
    completed: false,
  },
  {
    id: 4,
    title: "Upload or connect leads",
    link: "/tenant/standalone-config",
    completed: false,
  },
  {
    id: 5,
    title: "Launch your first campaign",
    link: "/tenant/ai-calling",
    completed: false,
  },
];

export function EmptyStates({ type }: EmptyStateProps) {
  const navigate = useNavigate();

  // EMPTY STATE 1: No Campaigns
  if (type === "no-campaigns") {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="max-w-2xl w-full text-center">
          {/* Illustration: Phone with sound waves */}
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Phone outline */}
              <rect
                x="70"
                y="40"
                width="60"
                height="100"
                rx="8"
                stroke="#4F46E5"
                strokeWidth="2"
                fill="none"
              />
              <rect x="85" y="50" width="30" height="4" rx="2" fill="#E0E7FF" />
              <circle cx="100" cy="125" r="8" stroke="#4F46E5" strokeWidth="2" fill="none" />

              {/* Sound waves emanating */}
              <path
                d="M 135 60 Q 150 70 150 80"
                stroke="#818CF8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 135 80 Q 155 90 155 105"
                stroke="#818CF8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 135 100 Q 150 110 150 120"
                stroke="#818CF8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* People icons connected by dots */}
              <circle cx="160" cy="50" r="6" fill="#9CA3AF" />
              <circle cx="165" cy="75" r="4" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
              
              <circle cx="170" cy="100" r="6" fill="#9CA3AF" />
              <circle cx="173" cy="120" r="4" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />

              <circle cx="165" cy="140" r="6" fill="#9CA3AF" />
              <circle cx="168" cy="155" r="4" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />

              {/* Connecting dots */}
              <circle cx="142" cy="65" r="2" fill="#C7D2FE" />
              <circle cx="148" cy="90" r="2" fill="#C7D2FE" />
              <circle cx="145" cy="115" r="2" fill="#C7D2FE" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Launch your first AI campaign
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Create an AI-powered calling campaign to automatically reach your leads. Set up an
            AI agent, choose your audience, and let the AI handle the conversations.
          </p>

          <div className="flex items-center justify-center gap-4 mb-10">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
              Create First Campaign
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <Play className="w-4 h-4" />
              Watch Tutorial
            </button>
          </div>

          {/* Template Cards */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-sm text-gray-600 mb-4">Start with a template:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templateCards.map((template) => (
                <button
                  key={template.name}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className="font-medium text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-600">{template.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE 2: No AI Agents
  if (type === "no-agents") {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="max-w-2xl w-full text-center">
          {/* Illustration: Bot/brain with gears */}
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Brain/bot outline */}
              <circle cx="100" cy="90" r="40" stroke="#8B5CF6" strokeWidth="2" fill="none" />
              
              {/* Neural network inside */}
              <circle cx="85" cy="80" r="4" fill="#A78BFA" />
              <circle cx="100" cy="75" r="4" fill="#A78BFA" />
              <circle cx="115" cy="80" r="4" fill="#A78BFA" />
              <circle cx="90" cy="95" r="4" fill="#C4B5FD" />
              <circle cx="110" cy="95" r="4" fill="#C4B5FD" />
              <circle cx="100" cy="105" r="4" fill="#C4B5FD" />

              <line x1="85" y1="80" x2="90" y2="95" stroke="#DDD6FE" strokeWidth="1.5" />
              <line x1="100" y1="75" x2="90" y2="95" stroke="#DDD6FE" strokeWidth="1.5" />
              <line x1="100" y1="75" x2="110" y2="95" stroke="#DDD6FE" strokeWidth="1.5" />
              <line x1="115" y1="80" x2="110" y2="95" stroke="#DDD6FE" strokeWidth="1.5" />
              <line x1="90" y1="95" x2="100" y2="105" stroke="#DDD6FE" strokeWidth="1.5" />
              <line x1="110" y1="95" x2="100" y2="105" stroke="#DDD6FE" strokeWidth="1.5" />

              {/* Antennas */}
              <line x1="100" y1="50" x2="100" y2="40" stroke="#8B5CF6" strokeWidth="2" />
              <circle cx="100" cy="37" r="3" fill="#8B5CF6" />

              {/* Gears */}
              <g transform="translate(140, 70)">
                <circle cx="0" cy="0" r="12" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                <circle cx="0" cy="0" r="6" fill="#9CA3AF" />
                <rect x="-2" y="-14" width="4" height="4" fill="#9CA3AF" />
                <rect x="-2" y="10" width="4" height="4" fill="#9CA3AF" />
                <rect x="-14" y="-2" width="4" height="4" fill="#9CA3AF" />
                <rect x="10" y="-2" width="4" height="4" fill="#9CA3AF" />
              </g>

              <g transform="translate(155, 105)">
                <circle cx="0" cy="0" r="10" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                <circle cx="0" cy="0" r="5" fill="#9CA3AF" />
                <rect x="-1.5" y="-12" width="3" height="3" fill="#9CA3AF" />
                <rect x="-1.5" y="9" width="3" height="3" fill="#9CA3AF" />
                <rect x="-12" y="-1.5" width="3" height="3" fill="#9CA3AF" />
                <rect x="9" y="-1.5" width="3" height="3" fill="#9CA3AF" />
              </g>

              {/* Body */}
              <rect
                x="85"
                y="125"
                width="30"
                height="35"
                rx="4"
                stroke="#8B5CF6"
                strokeWidth="2"
                fill="none"
              />
              <line x1="95" y1="135" x2="105" y2="135" stroke="#A78BFA" strokeWidth="2" />
              <line x1="95" y1="145" x2="105" y2="145" stroke="#A78BFA" strokeWidth="2" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Build your AI calling team
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Create AI agents with unique personalities, voices, and skills. Each agent can
            handle different types of calls — from sales to support to collections.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => navigate("/tenant/agent-studio")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
            >
              Create First Agent
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1 mx-auto">
            Browse Agent Templates
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // EMPTY STATE 3: No Recordings
  if (type === "no-recordings") {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="max-w-2xl w-full text-center">
          {/* Illustration: Waveform */}
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="120"
              viewBox="0 0 200 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="50%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>

              {/* Waveform bars */}
              <rect x="10" y="45" width="4" height="30" rx="2" fill="url(#waveGradient)" opacity="0.4" />
              <rect x="20" y="35" width="4" height="50" rx="2" fill="url(#waveGradient)" opacity="0.5" />
              <rect x="30" y="25" width="4" height="70" rx="2" fill="url(#waveGradient)" opacity="0.6" />
              <rect x="40" y="15" width="4" height="90" rx="2" fill="url(#waveGradient)" opacity="0.7" />
              <rect x="50" y="30" width="4" height="60" rx="2" fill="url(#waveGradient)" opacity="0.8" />
              <rect x="60" y="40" width="4" height="40" rx="2" fill="url(#waveGradient)" opacity="0.9" />
              <rect x="70" y="20" width="4" height="80" rx="2" fill="url(#waveGradient)" />
              <rect x="80" y="10" width="4" height="100" rx="2" fill="url(#waveGradient)" />
              <rect x="90" y="25" width="4" height="70" rx="2" fill="url(#waveGradient)" />
              <rect x="100" y="35" width="4" height="50" rx="2" fill="url(#waveGradient)" />
              <rect x="110" y="25" width="4" height="70" rx="2" fill="url(#waveGradient)" />
              <rect x="120" y="15" width="4" height="90" rx="2" fill="url(#waveGradient)" />
              <rect x="130" y="30" width="4" height="60" rx="2" fill="url(#waveGradient)" opacity="0.9" />
              <rect x="140" y="40" width="4" height="40" rx="2" fill="url(#waveGradient)" opacity="0.8" />
              <rect x="150" y="35" width="4" height="50" rx="2" fill="url(#waveGradient)" opacity="0.7" />
              <rect x="160" y="25" width="4" height="70" rx="2" fill="url(#waveGradient)" opacity="0.6" />
              <rect x="170" y="40" width="4" height="40" rx="2" fill="url(#waveGradient)" opacity="0.5" />
              <rect x="180" y="45" width="4" height="30" rx="2" fill="url(#waveGradient)" opacity="0.4" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Your call recordings will appear here
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Once your campaigns start making calls, all recordings and transcripts will be
            stored here for review, search, and training.
          </p>

          <button
            onClick={() => navigate("/tenant/ai-calling")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go to Campaigns
          </button>
        </div>
      </div>
    );
  }

  // EMPTY STATE 4: First Time Dashboard
  if (type === "first-time-dashboard") {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="max-w-5xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Welcome & Setup Checklist */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                <div className="mb-8">
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Welcome to AI Calling Engine
                  </h1>
                  <p className="text-gray-600">
                    Get started in just a few steps. Complete the setup to launch your first
                    AI-powered campaign.
                  </p>
                </div>

                {/* Setup Stepper */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Setup Checklist</h3>
                    <div className="text-sm text-gray-600">
                      <span className="font-mono font-medium text-gray-900">0</span> of{" "}
                      <span className="font-mono">5</span> completed
                    </div>
                  </div>

                  {setupSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4 group">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            step.completed
                              ? "border-indigo-600 bg-indigo-600"
                              : "border-gray-300 bg-white group-hover:border-indigo-400"
                          }`}
                        >
                          {step.completed ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        {index < setupSteps.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 mt-1" />
                        )}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 pb-6">
                        <button
                          onClick={() => navigate(step.link)}
                          className="text-left w-full"
                        >
                          <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                            {step.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {step.completed ? "Completed" : "Not started"}
                          </div>
                        </button>
                      </div>

                      {/* Arrow on hover */}
                      <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-medium text-gray-900">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Need Help Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200 p-6 shadow-sm sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need help?</h3>
                <p className="text-sm text-gray-600 mb-6">
                  We're here to help you get started with AI calling.
                </p>

                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Book className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors mb-0.5">
                        Documentation
                      </div>
                      <div className="text-xs text-gray-600">
                        Comprehensive guides and API docs
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <a
                    href="#"
                    className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Video className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors mb-0.5">
                        Video Tutorials
                      </div>
                      <div className="text-xs text-gray-600">
                        Step-by-step walkthroughs
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <a
                    href="#"
                    className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors mb-0.5">
                        Support Chat
                      </div>
                      <div className="text-xs text-gray-600">
                        Get help from our team
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-indigo-200">
                  <div className="text-xs text-gray-600 mb-2">Quick tip</div>
                  <div className="text-sm text-gray-700">
                    Start by creating an AI agent with a specific personality and voice for
                    your first campaign.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
