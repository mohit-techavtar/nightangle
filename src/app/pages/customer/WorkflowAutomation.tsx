import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { WorkflowSidebar, Workflow } from "../../components/workflow/WorkflowSidebar";
import { WorkflowCanvas } from "../../components/workflow/WorkflowCanvas";
import { NodeConfigPanel } from "../../components/workflow/NodeConfigPanel";
import { NodeData } from "../../components/workflow/WorkflowNode";
import {
  Save,
  Play,
  Undo,
  Redo,
  Edit2,
  Check,
  Zap,
  GitBranch,
  PlayCircle,
} from "lucide-react";

// Mock workflows
const mockWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "High Value Lead Follow-up",
    pipeline: "sales",
    status: "active",
    lastModified: "2 hours ago",
    triggerCount: 42,
  },
  {
    id: "wf-2",
    name: "Lead Scoring & Routing",
    pipeline: "sales",
    status: "active",
    lastModified: "1 day ago",
    triggerCount: 128,
  },
  {
    id: "wf-3",
    name: "Demo Scheduling Automation",
    pipeline: "sales",
    status: "paused",
    lastModified: "3 days ago",
    triggerCount: 67,
  },
  {
    id: "wf-4",
    name: "Support Ticket Assignment",
    pipeline: "support",
    status: "active",
    lastModified: "5 hours ago",
    triggerCount: 215,
  },
  {
    id: "wf-5",
    name: "Customer Onboarding",
    pipeline: "support",
    status: "draft",
    lastModified: "1 week ago",
    triggerCount: 0,
  },
];

// Mock nodes for the selected workflow
const mockNodes: NodeData[] = [
  {
    id: "node-1",
    type: "trigger",
    label: "When Lead Enters Stage: Qualified",
    description: "Trigger when a lead moves to Qualified stage",
    x: 400,
    y: 50,
  },
  {
    id: "node-2",
    type: "condition",
    label: "If Score > 70",
    description: "Check if lead score is greater than 70",
    x: 350,
    y: 250,
  },
  {
    id: "node-3",
    type: "action",
    label: "Send WhatsApp Template: High Priority Follow-up",
    description: "Send personalized WhatsApp message",
    x: 600,
    y: 500,
  },
  {
    id: "node-4",
    type: "action",
    label: "Create Task: Schedule Demo",
    description: "Assign demo scheduling task to lead owner",
    x: 600,
    y: 670,
  },
  {
    id: "node-5",
    type: "action",
    label: "Add to Nurture Campaign",
    description: "Add lead to email nurture sequence",
    x: 100,
    y: 500,
  },
];

const mockConnections = [
  { id: "conn-1", from: "node-1", to: "node-2" },
  { id: "conn-2", from: "node-2", to: "node-3", label: "Yes" },
  { id: "conn-3", from: "node-3", to: "node-4" },
  { id: "conn-4", from: "node-2", to: "node-5", label: "No" },
];

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(workflows[0]?.id);
  const [nodes, setNodes] = useState<NodeData[]>(mockNodes);
  const [connections, setConnections] = useState(mockConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [workflowName, setWorkflowName] = useState("High Value Lead Follow-up");
  const [isActive, setIsActive] = useState(true);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: "New Workflow",
      pipeline: "sales",
      status: "draft",
      lastModified: "Just now",
      triggerCount: 0,
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflowId(newWorkflow.id);
  };

  const handleSelectWorkflow = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setSelectedNodeId(null);
    setShowConfigPanel(false);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowConfigPanel(true);
  };

  const handleNodeSettingsClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowConfigPanel(true);
  };

  const handleSaveNodeConfig = (nodeId: string, config: any) => {
    console.log("Saving config for node:", nodeId, config);
    // Update node configuration logic here
  };

  const handleSaveWorkflow = () => {
    console.log("Saving workflow...");
    // Save workflow logic here
  };

  const handleTestWorkflow = () => {
    console.log("Testing workflow...");
    // Test workflow logic here
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        breadcrumbs={[{ label: "CRM" }, { label: "Automation" }, { label: "Workflows" }]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Workflows List */}
        <WorkflowSidebar
          workflows={workflows}
          selectedWorkflowId={selectedWorkflowId}
          onSelectWorkflow={handleSelectWorkflow}
          onCreateWorkflow={handleCreateWorkflow}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col bg-[#F5F5F5]">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-[#E0E0E0] px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left - Workflow Name */}
              <div className="flex items-center gap-3">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      className="text-xl font-semibold text-[#212121] border-b-2 border-[#1565C0] focus:outline-none"
                      autoFocus
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setIsEditingName(false);
                      }}
                    />
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="p-1.5 rounded-md bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] transition-colors"
                    >
                      <Check size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <h1 className="text-xl font-semibold text-[#212121]">{workflowName}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 rounded-md hover:bg-[#F5F5F5] text-[#616161] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Right - Actions */}
              <div className="flex items-center gap-3">
                {/* Undo/Redo */}
                <div className="flex items-center gap-1 border border-[#E0E0E0] rounded-lg overflow-hidden">
                  <button className="p-2 hover:bg-[#F5F5F5] text-[#616161] transition-colors">
                    <Undo size={18} />
                  </button>
                  <div className="w-px h-6 bg-[#E0E0E0]" />
                  <button className="p-2 hover:bg-[#F5F5F5] text-[#616161] transition-colors">
                    <Redo size={18} />
                  </button>
                </div>

                {/* Save */}
                <button
                  onClick={handleSaveWorkflow}
                  className="flex items-center gap-2 px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>

                {/* Test */}
                <button
                  onClick={handleTestWorkflow}
                  className="flex items-center gap-2 px-4 py-2 border border-[#1565C0] rounded-lg text-sm font-medium text-[#1565C0] hover:bg-[#E3F2FD] transition-colors"
                >
                  <Play size={16} />
                  Test
                </button>

                {/* Activate Toggle */}
                <button
                  onClick={handleToggleActive}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white shadow-md"
                      : "bg-[#F5F5F5] text-[#616161] border border-[#E0E0E0]"
                  }`}
                >
                  {isActive ? (
                    <>
                      <PlayCircle size={16} className="fill-current" />
                      Active
                    </>
                  ) : (
                    <>
                      <PlayCircle size={16} />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Workflow Stats */}
            <div className="flex items-center gap-6 mt-3 text-xs text-[#9E9E9E]">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-[#1565C0]" />
                <span>Last modified: 2 hours ago</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitBranch size={14} className="text-[#F57F17]" />
                <span>5 nodes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PlayCircle size={14} className="text-[#2E7D32]" />
                <span>42 executions this week</span>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-hidden">
            <WorkflowCanvas
              nodes={nodes}
              connections={connections}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNode}
              onNodeSettingsClick={handleNodeSettingsClick}
            />
          </div>
        </div>

        {/* Right Panel - Node Configuration */}
        {showConfigPanel && selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onClose={() => {
              setShowConfigPanel(false);
              setSelectedNodeId(null);
            }}
            onSave={handleSaveNodeConfig}
          />
        )}
      </div>
    </div>
  );
}
