import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Phone,
  PhoneIncoming,
  Hand,
  MessageSquare,
  Mic,
  Shield,
  HelpCircle,
  GitBranch,
  Smile,
  Search,
  Brain,
  Clock,
  Database,
  Calendar,
  MessageCircle,
  Pencil,
  UserPlus,
  CheckCircle,
  XCircle,
  Save,
  Play,
  History,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  RotateCw,
  Map,
  AlertCircle,
  Edit3,
} from "lucide-react";

interface NodeType {
  id: string;
  category: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const nodeTypes: NodeType[] = [
  // Triggers
  { id: "call-connected", category: "TRIGGERS", label: "Call Connected", icon: <Phone className="w-4 h-4" />, color: "#3B82F6" },
  { id: "inbound-answer", category: "TRIGGERS", label: "Inbound Answer", icon: <PhoneIncoming className="w-4 h-4" />, color: "#3B82F6" },
  
  // Conversation
  { id: "greeting", category: "CONVERSATION", label: "Greeting Node", icon: <Hand className="w-4 h-4" />, color: "#10B981" },
  { id: "speak", category: "CONVERSATION", label: "Speak/Say", icon: <MessageSquare className="w-4 h-4" />, color: "#10B981" },
  { id: "listen", category: "CONVERSATION", label: "Listen/Capture", icon: <Mic className="w-4 h-4" />, color: "#10B981" },
  { id: "verification", category: "CONVERSATION", label: "Verification Node", icon: <Shield className="w-4 h-4" />, color: "#F97316" },
  { id: "question", category: "CONVERSATION", label: "Question Node", icon: <HelpCircle className="w-4 h-4" />, color: "#10B981" },
  
  // Logic
  { id: "decision", category: "LOGIC", label: "Decision Branch", icon: <GitBranch className="w-4 h-4" />, color: "#F59E0B" },
  { id: "sentiment", category: "LOGIC", label: "Sentiment Check", icon: <Smile className="w-4 h-4" />, color: "#8B5CF6" },
  { id: "keyword", category: "LOGIC", label: "Keyword Match", icon: <Search className="w-4 h-4" />, color: "#8B5CF6" },
  { id: "ai-freeform", category: "LOGIC", label: "AI Free-Form", icon: <Brain className="w-4 h-4" />, color: "#7C3AED" },
  { id: "wait", category: "LOGIC", label: "Wait/Pause", icon: <Clock className="w-4 h-4" />, color: "#8B5CF6" },
  
  // Actions
  { id: "update-crm", category: "ACTIONS", label: "Update CRM", icon: <Database className="w-4 h-4" />, color: "#06B6D4" },
  { id: "schedule-callback", category: "ACTIONS", label: "Schedule Callback", icon: <Calendar className="w-4 h-4" />, color: "#06B6D4" },
  { id: "send-whatsapp", category: "ACTIONS", label: "Send WhatsApp", icon: <MessageCircle className="w-4 h-4" />, color: "#06B6D4" },
  { id: "add-note", category: "ACTIONS", label: "Add Note", icon: <Pencil className="w-4 h-4" />, color: "#06B6D4" },
  { id: "transfer-human", category: "ACTIONS", label: "Transfer to Human", icon: <UserPlus className="w-4 h-4" />, color: "#06B6D4" },
  
  // Terminal
  { id: "end-success", category: "TERMINAL", label: "End Call — Success", icon: <CheckCircle className="w-4 h-4" />, color: "#10B981" },
  { id: "end-failed", category: "TERMINAL", label: "End Call — Failed", icon: <XCircle className="w-4 h-4" />, color: "#EF4444" },
  { id: "end-callback", category: "TERMINAL", label: "End Call — Callback", icon: <Clock className="w-4 h-4" />, color: "#F59E0B" },
];

interface FlowNode {
  id: string;
  type: string;
  label: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon: React.ReactNode;
  isDiamond?: boolean;
  isAI?: boolean;
}

interface Connection {
  from: string;
  to: string;
  label?: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export function ConversationFlowEditor() {
  const navigate = useNavigate();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>("node-4");
  const [flowName, setFlowName] = useState("Jewellery Software — Sales Call");
  const [isEditingName, setIsEditingName] = useState(false);

  // Sample flow nodes
  const flowNodes: FlowNode[] = [
    {
      id: "node-start",
      type: "call-connected",
      label: "Call Connected",
      x: 400,
      y: 50,
      width: 180,
      height: 60,
      color: "#3B82F6",
      icon: <Phone className="w-4 h-4" />,
    },
    {
      id: "node-1",
      type: "greeting",
      label: "Greeting",
      content: 'Namaste! Main [Agent Name] bol raha/rahi hoon [Company] se.',
      x: 400,
      y: 150,
      width: 180,
      height: 80,
      color: "#10B981",
      icon: <Hand className="w-4 h-4" />,
    },
    {
      id: "node-2",
      type: "verification",
      label: "Verification",
      content: 'Kya main [Lead Name] ji se baat kar raha/rahi hoon?',
      x: 400,
      y: 270,
      width: 180,
      height: 80,
      color: "#F97316",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "node-3",
      type: "speak",
      label: "Confirm & Proceed",
      content: 'Thank you for confirming.',
      x: 300,
      y: 390,
      width: 180,
      height: 70,
      color: "#10B981",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "node-3b",
      type: "speak",
      label: "Ask for Correct Person",
      content: 'Kya aap unhe phone pe bula sakte hain?',
      x: 520,
      y: 390,
      width: 180,
      height: 70,
      color: "#10B981",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "node-4",
      type: "ai-freeform",
      label: "Product Discussion",
      content: 'AI improvises based on customer responses',
      x: 300,
      y: 500,
      width: 180,
      height: 90,
      color: "#7C3AED",
      icon: <Brain className="w-4 h-4" />,
      isAI: true,
    },
    {
      id: "node-5",
      type: "decision",
      label: "Is Customer Interested?",
      x: 300,
      y: 630,
      width: 180,
      height: 80,
      color: "#F59E0B",
      icon: <GitBranch className="w-4 h-4" />,
      isDiamond: true,
    },
    {
      id: "node-6a",
      type: "schedule-callback",
      label: "Schedule Demo",
      content: 'Book a product demo',
      x: 180,
      y: 750,
      width: 160,
      height: 70,
      color: "#06B6D4",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "node-6b",
      type: "speak",
      label: "Thank & Close",
      content: 'Thank you for your time.',
      x: 420,
      y: 750,
      width: 160,
      height: 70,
      color: "#10B981",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "node-7a",
      type: "send-whatsapp",
      label: "Send WhatsApp",
      content: 'Send demo confirmation',
      x: 180,
      y: 860,
      width: 160,
      height: 70,
      color: "#06B6D4",
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      id: "node-end-success",
      type: "end-success",
      label: "Demo Booked",
      x: 180,
      y: 970,
      width: 160,
      height: 60,
      color: "#10B981",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "node-end-failed",
      type: "end-failed",
      label: "Not Interested",
      x: 420,
      y: 860,
      width: 160,
      height: 60,
      color: "#EF4444",
      icon: <XCircle className="w-4 h-4" />,
    },
    {
      id: "node-end-wrong",
      type: "end-failed",
      label: "Wrong Person",
      x: 520,
      y: 500,
      width: 160,
      height: 60,
      color: "#EF4444",
      icon: <XCircle className="w-4 h-4" />,
    },
  ];

  // Connections
  const connections: Connection[] = [
    { from: "node-start", to: "node-1", fromX: 490, fromY: 110, toX: 490, toY: 150 },
    { from: "node-1", to: "node-2", fromX: 490, fromY: 230, toX: 490, toY: 270 },
    { from: "node-2", to: "node-3", label: "Yes", fromX: 450, fromY: 350, toX: 390, toY: 390 },
    { from: "node-2", to: "node-3b", label: "No", fromX: 530, fromY: 350, toX: 610, toY: 390 },
    { from: "node-3", to: "node-4", fromX: 390, fromY: 460, toX: 390, toY: 500 },
    { from: "node-3b", to: "node-end-wrong", fromX: 610, fromY: 460, toX: 600, toY: 500 },
    { from: "node-4", to: "node-5", fromX: 390, fromY: 590, toX: 390, toY: 630 },
    { from: "node-5", to: "node-6a", label: "Interested", fromX: 340, fromY: 710, toX: 260, toY: 750 },
    { from: "node-5", to: "node-6b", label: "Not Interested", fromX: 440, fromY: 710, toX: 500, toY: 750 },
    { from: "node-6a", to: "node-7a", fromX: 260, fromY: 820, toX: 260, toY: 860 },
    { from: "node-7a", to: "node-end-success", fromX: 260, fromY: 930, toX: 260, toY: 970 },
    { from: "node-6b", to: "node-end-failed", fromX: 500, fromY: 820, toX: 500, toY: 860 },
  ];

  const categories = Array.from(new Set(nodeTypes.map(n => n.category)));

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/tenant/ai-calling")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Conversation Flow Editor</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Flow Name */}
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                className="px-3 py-1.5 border border-indigo-300 rounded text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{flowName}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            Draft
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Publish
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              Test Flow
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <History className="w-4 h-4" />
              Version History
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Node Palette */}
        <div
          className={`border-r border-gray-200 bg-white transition-all duration-300 flex flex-col ${
            leftPanelOpen ? "w-60" : "w-0"
          }`}
        >
          {leftPanelOpen && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Node Palette</h3>
                <button
                  onClick={() => setLeftPanelOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Node Categories */}
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {category}
                    </h4>
                    <div className="space-y-1.5">
                      {nodeTypes
                        .filter((node) => node.category === category)
                        .map((node) => (
                          <div
                            key={node.id}
                            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg cursor-move hover:border-indigo-300 hover:shadow-sm transition-all group"
                            style={{ borderLeftWidth: "3px", borderLeftColor: node.color }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded flex items-center justify-center"
                                style={{ backgroundColor: `${node.color}15`, color: node.color }}
                              >
                                {node.icon}
                              </div>
                              <span className="text-sm text-gray-700 font-medium">{node.label}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button for Collapsed Panel */}
        {!leftPanelOpen && (
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-16 bg-white border border-gray-200 rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Center Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gray-50">
          {/* Dot Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Canvas Content */}
          <div className="absolute inset-0 overflow-auto">
            <div className="relative" style={{ width: "2000px", height: "1400px" }}>
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {connections.map((conn, idx) => {
                  const midY = (conn.fromY + conn.toY) / 2;
                  return (
                    <g key={idx}>
                      {/* Path */}
                      <path
                        d={`M ${conn.fromX} ${conn.fromY} L ${conn.fromX} ${midY} L ${conn.toX} ${midY} L ${conn.toX} ${conn.toY}`}
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      {/* Label */}
                      {conn.label && (
                        <text
                          x={(conn.fromX + conn.toX) / 2}
                          y={midY - 5}
                          fill="#6B7280"
                          fontSize="11"
                          fontWeight="500"
                          textAnchor="middle"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {conn.label}
                        </text>
                      )}
                    </g>
                  );
                })}
                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
                  </marker>
                </defs>
              </svg>

              {/* Flow Nodes */}
              {flowNodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all ${
                    selectedNode === node.id ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                  } ${node.isAI ? "ai-node-pulse" : ""}`}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.width,
                    zIndex: 2,
                  }}
                  onClick={() => setSelectedNode(node.id)}
                >
                  {node.isDiamond ? (
                    // Diamond shape for decision nodes
                    <div className="relative" style={{ height: node.height }}>
                      <svg
                        width={node.width}
                        height={node.height}
                        className={`absolute inset-0 ${node.isAI ? "ai-node-border" : ""}`}
                      >
                        <polygon
                          points={`${node.width / 2},0 ${node.width},${node.height / 2} ${
                            node.width / 2
                          },${node.height} 0,${node.height / 2}`}
                          fill="white"
                          stroke={node.color}
                          strokeWidth={node.isAI ? "2" : "2"}
                          className={node.isAI ? "ai-stroke" : ""}
                        />
                      </svg>
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-3"
                        style={{ zIndex: 1 }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5"
                          style={{ backgroundColor: `${node.color}20`, color: node.color }}
                        >
                          {node.icon}
                        </div>
                        <div className="text-xs font-semibold text-gray-900 text-center leading-tight">
                          {node.label}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular rectangular nodes
                    <div
                      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${
                        node.isAI ? "border-2 border-dashed ai-node-border" : "border border-gray-200"
                      }`}
                      style={{
                        borderLeftWidth: node.isAI ? "2px" : "4px",
                        borderLeftColor: node.color,
                        height: node.height,
                      }}
                    >
                      <div className="h-full flex flex-col p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${node.color}20`, color: node.color }}
                          >
                            {node.icon}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 leading-tight">
                            {node.label}
                          </div>
                        </div>
                        {node.content && (
                          <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                            {node.content}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Node Properties */}
        {selectedNode && (
          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Properties</h3>

              {/* Node Name */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Node Name</label>
                <input
                  type="text"
                  defaultValue="Product Discussion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* AI Behavior */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">AI Behavior</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Open Discussion</option>
                  <option>Guided Q&A</option>
                  <option>Objection Handling</option>
                </select>
              </div>

              {/* AI Prompt Instructions */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  AI Prompt Instructions
                </label>
                <textarea
                  rows={6}
                  defaultValue="Discuss the product features relevant to the customer's business. Focus on inventory management and billing. If they mention competitors, acknowledge but redirect to our strengths."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Max Duration */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Max Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue="90"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">seconds</span>
                </div>
              </div>

              {/* Fallback */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fallback</label>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-900">
                      If AI confidence drops below 60%, transfer to human
                    </p>
                  </div>
                </div>
              </div>

              {/* Exit Conditions */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Exit Conditions</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Customer says "interested"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Customer says "not interested"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Customer says "callback"</span>
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Enable recording</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Save transcript</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Update CRM after</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="h-14 border-t border-gray-200 bg-white px-6 flex items-center justify-between">
        {/* Left Side - Zoom & Minimap */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 font-mono min-w-[60px] text-center">100%</span>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2">
            <Map className="w-4 h-4" />
            Minimap
          </button>
        </div>

        {/* Right Side - Validation & Test */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">All nodes connected</span>
          </div>

          <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2">
            <Play className="w-4 h-4" />
            Test Run
          </button>
        </div>
      </div>

      {/* AI Node Animation Styles */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .ai-node-pulse {
          animation: pulse-border 2s ease-in-out infinite;
        }

        .ai-node-border {
          border-color: #7C3AED;
        }

        .ai-stroke {
          stroke-dasharray: 5, 5;
          animation: dash 20s linear infinite;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -200;
          }
        }
      `}</style>
    </div>
  );
}
