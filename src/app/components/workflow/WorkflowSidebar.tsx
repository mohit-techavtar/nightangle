import React from "react";
import { Plus, Play, Pause, FileText, Phone, Mail } from "lucide-react";

export interface Workflow {
  id: string;
  name: string;
  pipeline: "sales" | "support";
  status: "active" | "draft" | "paused";
  lastModified: string;
  triggerCount: number;
}

interface WorkflowSidebarProps {
  workflows: Workflow[];
  selectedWorkflowId: string | null;
  onSelectWorkflow: (workflowId: string) => void;
  onCreateWorkflow: () => void;
}

export function WorkflowSidebar({
  workflows,
  selectedWorkflowId,
  onSelectWorkflow,
  onCreateWorkflow,
}: WorkflowSidebarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/20";
      case "paused":
        return "bg-[#FFF8E1] text-[#F57F17] border-[#F57F17]/20";
      case "draft":
        return "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]";
      default:
        return "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play size={12} className="fill-current" />;
      case "paused":
        return <Pause size={12} />;
      case "draft":
        return <FileText size={12} />;
      default:
        return null;
    }
  };

  const salesWorkflows = workflows.filter((w) => w.pipeline === "sales");
  const supportWorkflows = workflows.filter((w) => w.pipeline === "support");

  const renderWorkflowList = (workflowList: Workflow[], icon: React.ReactNode) => (
    <div className="space-y-1.5">
      {workflowList.map((workflow) => (
        <button
          key={workflow.id}
          onClick={() => onSelectWorkflow(workflow.id)}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selectedWorkflowId === workflow.id
              ? "border-[#1565C0] bg-[#E3F2FD] shadow-sm"
              : "border-transparent bg-white hover:bg-[#FAFAFA] hover:border-[#E0E0E0]"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className="mt-0.5 text-[#616161]">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#212121] truncate">{workflow.name}</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                workflow.status
              )}`}
            >
              {getStatusIcon(workflow.status)}
              <span className="capitalize">{workflow.status}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-[#9E9E9E] ml-6">
            <span>{workflow.lastModified}</span>
            <span>{workflow.triggerCount} runs</span>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-80 bg-[#FAFAFA] border-r border-[#E0E0E0] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#E0E0E0] bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#212121]">Workflows</h2>
          <button
            onClick={onCreateWorkflow}
            className="p-2 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white hover:shadow-md transition-shadow"
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="text-xs text-[#9E9E9E]">
          {workflows.length} workflow{workflows.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Workflow List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Sales Workflows */}
        {salesWorkflows.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Phone size={16} className="text-[#1565C0]" />
              <h3 className="text-sm font-semibold text-[#424242]">Sales Workflows</h3>
              <span className="text-xs text-[#9E9E9E]">({salesWorkflows.length})</span>
            </div>
            {renderWorkflowList(
              salesWorkflows,
              <Phone size={14} className="text-[#1565C0]" />
            )}
          </div>
        )}

        {/* Support Workflows */}
        {supportWorkflows.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mail size={16} className="text-[#7C4DFF]" />
              <h3 className="text-sm font-semibold text-[#424242]">Support Workflows</h3>
              <span className="text-xs text-[#9E9E9E]">({supportWorkflows.length})</span>
            </div>
            {renderWorkflowList(
              supportWorkflows,
              <Mail size={14} className="text-[#7C4DFF]" />
            )}
          </div>
        )}

        {workflows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#9E9E9E] mb-3">No workflows yet</p>
            <button
              onClick={onCreateWorkflow}
              className="text-sm text-[#1565C0] hover:underline"
            >
              Create your first workflow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
