import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, Save, Play, Settings, Trash2, Plus, Check, X,
  MessageSquare, UserPlus, Tag, Bell, Clock, GitBranch, Zap,
  User, Mail, Phone, Calendar, DollarSign, Edit2
} from "lucide-react";
import { useWhatsApp } from "../../hooks/useWhatsApp";

interface FlowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "delay";
  category?: string;
  icon: any;
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface NodeTemplate {
  type: "trigger" | "action" | "condition" | "delay";
  category: string;
  icon: any;
  title: string;
  description: string;
  configFields: ConfigField[];
}

interface ConfigField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "tags";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  {
    type: "trigger",
    category: "Trigger",
    icon: Zap,
    title: "New Contact",
    description: "When a new contact messages you",
    configFields: []
  },
  {
    type: "trigger",
    category: "Trigger",
    icon: MessageSquare,
    title: "Keyword Match",
    description: "When message contains specific keywords",
    configFields: [
      { key: "keywords", label: "Keywords", type: "tags", placeholder: "e.g., pricing, demo, help", required: true }
    ]
  },
  {
    type: "trigger",
    category: "Trigger",
    icon: MessageSquare,
    title: "Specific Message",
    description: "When contact sends a specific message",
    configFields: [
      { key: "message", label: "Message Text", type: "text", placeholder: "Exact message to match", required: true }
    ]
  },
  {
    type: "trigger",
    category: "Trigger",
    icon: Clock,
    title: "Time-Based",
    description: "Trigger at specific time or interval",
    configFields: [
      { key: "schedule", label: "Schedule Type", type: "select", options: ["Daily", "Weekly", "Monthly", "Custom Interval"], required: true },
      { key: "time", label: "Time", type: "text", placeholder: "HH:MM", required: true }
    ]
  },

  // Actions
  {
    type: "action",
    category: "Action",
    icon: MessageSquare,
    title: "Send Message",
    description: "Send a WhatsApp message",
    configFields: [
      { key: "message", label: "Message", type: "textarea", placeholder: "Enter your message...", required: true }
    ]
  },
  {
    type: "action",
    category: "Action",
    icon: Tag,
    title: "Add Tag",
    description: "Add tag to contact",
    configFields: [
      { key: "tag", label: "Tag Name", type: "text", placeholder: "e.g., Hot Lead, VIP", required: true }
    ]
  },
  {
    type: "action",
    category: "Action",
    icon: User,
    title: "Assign to User",
    description: "Assign conversation to team member",
    configFields: [
      { key: "user", label: "User", type: "select", options: ["John Smith", "Sarah Johnson", "Mike Chen"], required: true }
    ]
  },
  {
    type: "action",
    category: "Action",
    icon: Bell,
    title: "Send Notification",
    description: "Notify team member",
    configFields: [
      { key: "recipient", label: "Recipient", type: "select", options: ["Sales Team", "Support Team", "Manager"], required: true },
      { key: "message", label: "Notification Message", type: "text", placeholder: "Custom notification text", required: true }
    ]
  },
  {
    type: "action",
    category: "Action",
    icon: UserPlus,
    title: "Create Lead",
    description: "Convert contact to lead in CRM",
    configFields: [
      { key: "source", label: "Lead Source", type: "text", placeholder: "WhatsApp Automation", required: true },
      { key: "stage", label: "Initial Stage", type: "select", options: ["new", "contacted", "qualified"], required: true }
    ]
  },
  {
    type: "action",
    category: "Action",
    icon: Edit2,
    title: "Update Field",
    description: "Update contact or lead field",
    configFields: [
      { key: "field", label: "Field Name", type: "select", options: ["email", "company", "phone", "notes"], required: true },
      { key: "value", label: "Value", type: "text", placeholder: "New field value", required: true }
    ]
  },

  // Conditions
  {
    type: "condition",
    category: "Condition",
    icon: GitBranch,
    title: "If/Then/Else",
    description: "Branch flow based on condition",
    configFields: [
      { key: "field", label: "Check Field", type: "select", options: ["message", "tag", "user_status", "time"], required: true },
      { key: "operator", label: "Operator", type: "select", options: ["equals", "contains", "greater_than", "less_than"], required: true },
      { key: "value", label: "Value", type: "text", placeholder: "Comparison value", required: true }
    ]
  },

  // Delay
  {
    type: "delay",
    category: "Delay",
    icon: Clock,
    title: "Wait",
    description: "Pause before next action",
    configFields: [
      { key: "duration", label: "Duration", type: "number", placeholder: "5", required: true },
      { key: "unit", label: "Unit", type: "select", options: ["Minutes", "Hours", "Days"], required: true }
    ]
  }
];

export function CreateWhatsAppAutomation() {
  const navigate = useNavigate();
  const { createAutomation } = useWhatsApp();

  const [automationName, setAutomationName] = useState("");
  const [automationDescription, setAutomationDescription] = useState("");
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [showNodeLibrary, setShowNodeLibrary] = useState(true);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addNode = (template: NodeTemplate) => {
    const newNode: FlowNode = {
      id: `node_${Date.now()}`,
      type: template.type,
      category: template.category,
      icon: template.icon,
      title: template.title,
      description: template.description,
      config: {},
      position: {
        x: 400 + nodes.length * 50,
        y: 200 + nodes.length * 30
      },
      connections: []
    };

    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
    setShowConfigPanel(true);
    setShowNodeLibrary(false);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      setShowConfigPanel(false);
    }
  };

  const updateNodeConfig = (nodeId: string, config: Record<string, any>) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, config } : n));
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, config });
    }
  };

  const connectNodes = (fromId: string, toId: string) => {
    setNodes(nodes.map(n => {
      if (n.id === fromId && !n.connections.includes(toId)) {
        return { ...n, connections: [...n.connections, toId] };
      }
      return n;
    }));
    setConnectingFrom(null);
  };

  const handleSave = (activate: boolean) => {
    if (!automationName.trim()) {
      alert("Please enter automation name");
      return;
    }

    const triggerNode = nodes.find(n => n.type === "trigger");
    if (!triggerNode) {
      alert("Automation must have at least one trigger");
      return;
    }

    // Convert nodes to automation format
    const actions = nodes
      .filter(n => n.type === "action")
      .map(n => ({
        type: n.title.toLowerCase().replace(/ /g, "_") as any,
        value: n.config.message || n.config.tag || n.config.value || ""
      }));

    createAutomation({
      name: automationName,
      trigger: triggerNode.title.toLowerCase().replace(/ /g, "_") as any,
      triggerValue: triggerNode.config.keywords?.join("|") || triggerNode.config.message || "",
      actions,
      status: activate ? "active" : "inactive"
    });

    setShowSuccessModal(true);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "trigger": return "from-purple-500 to-purple-600";
      case "action": return "from-blue-500 to-blue-600";
      case "condition": return "from-orange-500 to-orange-600";
      case "delay": return "from-gray-500 to-gray-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getNodeBorderColor = (type: string) => {
    switch (type) {
      case "trigger": return "border-purple-300";
      case "action": return "border-blue-300";
      case "condition": return "border-orange-300";
      case "delay": return "border-gray-300";
      default: return "border-gray-300";
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/whatsapp/automation")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={18} />
              Back to Automations
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex-1">
              <input
                type="text"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                placeholder="Automation Name"
                className="text-lg font-semibold text-gray-900 border-none focus:outline-none focus:ring-0 p-0 w-full max-w-md"
              />
              <input
                type="text"
                value={automationDescription}
                onChange={(e) => setAutomationDescription(e.target.value)}
                placeholder="Add description..."
                className="text-sm text-gray-500 border-none focus:outline-none focus:ring-0 p-0 w-full max-w-md mt-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNodeLibrary(!showNodeLibrary)}
              className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Node
            </button>
            <button
              onClick={() => handleSave(false)}
              className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              className="h-9 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2"
            >
              <Play size={16} />
              Save & Activate
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Node Library Sidebar */}
        {showNodeLibrary && (
          <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Node Library</h3>
                <button
                  onClick={() => setShowNodeLibrary(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {["Trigger", "Action", "Condition", "Delay"].map(category => (
                  <div key={category}>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">{category}s</h4>
                    <div className="space-y-2">
                      {nodeTemplates
                        .filter(t => t.category === category)
                        .map((template, idx) => (
                          <button
                            key={idx}
                            onClick={() => addNode(template)}
                            className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#25D366] hover:bg-green-50 transition-all text-left group"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getNodeColor(template.type)} flex items-center justify-center shrink-0`}>
                                <template.icon size={16} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 mb-0.5">{template.title}</div>
                                <div className="text-xs text-gray-500">{template.description}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 relative bg-gray-50 overflow-auto">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
            {/* Render Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map(node =>
                node.connections.map(targetId => {
                  const targetNode = nodes.find(n => n.id === targetId);
                  if (!targetNode) return null;

                  const x1 = node.position.x + 150;
                  const y1 = node.position.y + 50;
                  const x2 = targetNode.position.x + 150;
                  const y2 = targetNode.position.y + 50;

                  return (
                    <g key={`${node.id}-${targetId}`}>
                      <path
                        d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  );
                })
              )}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
                </marker>
              </defs>
            </svg>

            {/* Render Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.position.x,
                  top: node.position.y,
                  width: 300
                }}
                className={`bg-white rounded-lg border-2 shadow-lg transition-all ${
                  selectedNode?.id === node.id ? `${getNodeBorderColor(node.type)} shadow-xl` : 'border-gray-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getNodeColor(node.type)} flex items-center justify-center shrink-0`}>
                      <node.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 mb-0.5">{node.title}</div>
                      <div className="text-xs text-gray-500">{node.description}</div>
                    </div>
                    <button
                      onClick={() => deleteNode(node.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 size={14} className="text-gray-400" />
                    </button>
                  </div>

                  {Object.keys(node.config).length > 0 && (
                    <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                      {Object.entries(node.config).map(([key, value]) => (
                        <div key={key} className="text-gray-600">
                          <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(", ") : value}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedNode(node);
                        setShowConfigPanel(true);
                      }}
                      className="flex-1 h-8 px-3 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Settings size={12} />
                      Configure
                    </button>
                    <button
                      onClick={() => {
                        if (connectingFrom === node.id) {
                          setConnectingFrom(null);
                        } else if (connectingFrom) {
                          connectNodes(connectingFrom, node.id);
                        } else {
                          setConnectingFrom(node.id);
                        }
                      }}
                      className={`flex-1 h-8 px-3 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                        connectingFrom === node.id
                          ? 'bg-[#25D366] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Plus size={12} />
                      {connectingFrom === node.id ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Automation</h3>
                  <p className="text-sm text-gray-500 mb-6">Start by adding a trigger node from the library</p>
                  <button
                    onClick={() => setShowNodeLibrary(true)}
                    className="h-10 px-6 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add First Node
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Config Panel */}
        {showConfigPanel && selectedNode && (
          <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Configure Node</h3>
                <button
                  onClick={() => setShowConfigPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getNodeColor(selectedNode.type)} flex items-center justify-center`}>
                    <selectedNode.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedNode.title}</div>
                    <div className="text-sm text-gray-500">{selectedNode.description}</div>
                  </div>
                </div>

                {nodeTemplates
                  .find(t => t.title === selectedNode.title)
                  ?.configFields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === "text" && (
                        <input
                          type="text"
                          value={selectedNode.config[field.key] || ""}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { ...selectedNode.config, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                        />
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          value={selectedNode.config[field.key] || ""}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { ...selectedNode.config, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none"
                        />
                      )}

                      {field.type === "select" && (
                        <select
                          value={selectedNode.config[field.key] || ""}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { ...selectedNode.config, [field.key]: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                        >
                          <option value="">Select...</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.type === "number" && (
                        <input
                          type="number"
                          value={selectedNode.config[field.key] || ""}
                          onChange={(e) => updateNodeConfig(selectedNode.id, { ...selectedNode.config, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                        />
                      )}

                      {field.type === "tags" && (
                        <div>
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                const value = (e.target as HTMLInputElement).value.trim();
                                if (value) {
                                  const current = selectedNode.config[field.key] || [];
                                  updateNodeConfig(selectedNode.id, {
                                    ...selectedNode.config,
                                    [field.key]: [...current, value]
                                  });
                                  (e.target as HTMLInputElement).value = "";
                                }
                              }
                            }}
                            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                          />
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(selectedNode.config[field.key] || []).map((tag: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                                {tag}
                                <button
                                  onClick={() => {
                                    const current = selectedNode.config[field.key] || [];
                                    updateNodeConfig(selectedNode.id, {
                                      ...selectedNode.config,
                                      [field.key]: current.filter((_: string, i: number) => i !== idx)
                                    });
                                  }}
                                  className="hover:text-green-900"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Automation Created Successfully</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your automation <strong>{automationName}</strong> has been saved and is ready to use.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/tenant/whatsapp/automation")}
                  className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Automations
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 h-10 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
