import React, { useState } from "react";
import { X, Zap, GitBranch, Play, MessageSquare, CheckSquare, Mail, Clock, AlertTriangle, Trash2, TestTube } from "lucide-react";
import { NodeData } from "./WorkflowNode";

interface NodeConfigPanelProps {
  node: NodeData | null;
  onClose: () => void;
  onSave: (nodeId: string, config: any) => void;
}

export function NodeConfigPanel({ node, onClose, onSave }: NodeConfigPanelProps) {
  const [config, setConfig] = useState<any>({});

  if (!node) return null;

  const handleSave = () => {
    onSave(node.id, config);
    onClose();
  };

  const renderTriggerConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#424242] mb-2">
          Trigger Event
        </label>
        <select
          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          defaultValue="stage_change"
        >
          <option value="stage_change">Lead Enters Stage</option>
          <option value="score_change">Lead Score Changes</option>
          <option value="field_update">Field Updated</option>
          <option value="new_lead">New Lead Created</option>
          <option value="email_received">Email Received</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#424242] mb-2">
          Stage
        </label>
        <select
          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          defaultValue="qualified"
        >
          <option value="new">New Inquiry</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal Sent</option>
          <option value="negotiation">Negotiation</option>
        </select>
      </div>

      <div className="bg-[#E3F2FD] rounded-lg p-3 border border-[#1565C0]/20">
        <p className="text-xs text-[#1565C0] font-medium mb-1">Trigger Condition</p>
        <p className="text-xs text-[#616161]">
          This workflow will run when a lead enters the "Qualified" stage
        </p>
      </div>
    </div>
  );

  const renderConditionConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#424242] mb-2">
          Condition Type
        </label>
        <select
          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          defaultValue="score"
        >
          <option value="score">Lead Score</option>
          <option value="field">Field Value</option>
          <option value="tag">Has Tag</option>
          <option value="owner">Lead Owner</option>
          <option value="time">Time-based</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#424242] mb-2">
          Operator
        </label>
        <select
          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          defaultValue="greater_than"
        >
          <option value="equals">Equals</option>
          <option value="not_equals">Not Equals</option>
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
          <option value="contains">Contains</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#424242] mb-2">
          Value
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          placeholder="Enter value"
          defaultValue="70"
        />
      </div>

      <div className="bg-[#FFF8E1] rounded-lg p-3 border border-[#F57F17]/20">
        <p className="text-xs text-[#F57F17] font-medium mb-1">Branching Logic</p>
        <p className="text-xs text-[#616161]">
          If condition is true, follow "Yes" branch. Otherwise, follow "No" branch.
        </p>
      </div>
    </div>
  );

  const renderActionConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#424242] mb-2">
          Action Type
        </label>
        <select
          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          defaultValue="whatsapp"
          onChange={(e) => setConfig({ ...config, actionType: e.target.value })}
        >
          <option value="whatsapp">Send WhatsApp Message</option>
          <option value="email">Send Email</option>
          <option value="task">Create Task</option>
          <option value="update">Update Field</option>
          <option value="tag">Add Tag</option>
          <option value="campaign">Add to Campaign</option>
        </select>
      </div>

      {config.actionType === "whatsapp" || !config.actionType ? (
        <>
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Template Name
            </label>
            <select
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              defaultValue="high_priority"
              onChange={(e) => setConfig({ ...config, template: e.target.value })}
            >
              <option value="high_priority">High Priority Follow-up</option>
              <option value="welcome">Welcome Message</option>
              <option value="reminder">Follow-up Reminder</option>
              <option value="demo_invite">Demo Invitation</option>
              <option value="proposal">Proposal Sent Notification</option>
            </select>
          </div>

          {/* Template Preview */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Template Preview
            </label>
            <div className="bg-[#E8F5E9] rounded-lg p-4 border border-[#2E7D32]/30">
              <div className="flex items-start gap-2 mb-3">
                <MessageSquare size={16} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#2E7D32] mb-1">
                    High Priority Follow-up Template
                  </p>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-[#212121] leading-relaxed">
                      Hi <span className="bg-[#BBDEFB] px-1 rounded text-[#0D47A1] font-medium">{"{"}lead.name{"}"}</span>, 
                      thank you for your interest in <span className="bg-[#BBDEFB] px-1 rounded text-[#0D47A1] font-medium">{"{"}company.name{"}"}</span>! 
                      🎉
                    </p>
                    <p className="text-xs text-[#212121] leading-relaxed mt-2">
                      Our team would love to schedule a personalized demo to show you how we can help 
                      achieve your goals. Would you be available this week?
                    </p>
                    <p className="text-xs text-[#616161] mt-3 italic">
                      Best regards,<br />
                      <span className="bg-[#BBDEFB] px-1 rounded text-[#0D47A1] font-medium">{"{"}owner.name{"}"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Recipient
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-3 py-2 pr-24 border border-[#E0E0E0] bg-[#F5F5F5] rounded-lg text-sm text-[#616161] cursor-not-allowed"
                value="Lead's Primary Phone"
                disabled
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#2E7D32] bg-[#E8F5E9] px-2 py-1 rounded">
                Auto-filled
              </span>
            </div>
            <p className="text-xs text-[#9E9E9E] mt-1.5">
              Message will be sent to the primary phone number stored in the lead profile
            </p>
          </div>

          {/* Delay */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#616161]" />
                <span>Delay Before Sending</span>
                <span className="text-xs text-[#9E9E9E] font-normal">(Optional)</span>
              </div>
            </label>
            <select
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              defaultValue="none"
            >
              <option value="none">None - Send Immediately</option>
              <option value="1_hour">1 Hour</option>
              <option value="4_hours">4 Hours</option>
              <option value="1_day">1 Day</option>
            </select>
            <p className="text-xs text-[#9E9E9E] mt-1.5">
              Add a time delay before the message is sent to the lead
            </p>
          </div>

          {/* Fallback Action */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#F57F17]" />
                <span>Fallback Action if Send Fails</span>
              </div>
            </label>
            <select
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              defaultValue="retry"
            >
              <option value="retry">Retry - Attempt to send again after 1 hour</option>
              <option value="skip">Skip - Continue to next step</option>
              <option value="notify">Notify Agent - Alert lead owner of failure</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-[#E3F2FD] rounded-lg p-3 border border-[#1565C0]/20">
            <p className="text-xs text-[#1565C0] font-medium mb-1">📱 WhatsApp Business API</p>
            <p className="text-xs text-[#616161]">
              This action uses your connected WhatsApp Business account. Ensure the template is 
              approved before activating the workflow.
            </p>
          </div>
        </>
      ) : config.actionType === "task" ? (
        <>
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Task Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              placeholder="Enter task title"
              defaultValue="Schedule Demo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Assign To
            </label>
            <select
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
            >
              <option value="owner">Lead Owner</option>
              <option value="user1">Priya Sharma</option>
              <option value="user2">Amit Patel</option>
              <option value="user3">Vikram Singh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Due Date
            </label>
            <select
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              defaultValue="1_day"
            >
              <option value="immediate">Immediately</option>
              <option value="1_day">1 Day</option>
              <option value="2_days">2 Days</option>
              <option value="1_week">1 Week</option>
            </select>
          </div>
        </>
      ) : config.actionType === "campaign" ? (
        <>
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              Campaign
            </label>
            <select
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              defaultValue="nurture"
            >
              <option value="nurture">Nurture Campaign</option>
              <option value="onboarding">Onboarding Series</option>
              <option value="reengagement">Re-engagement</option>
              <option value="educational">Educational Content</option>
            </select>
          </div>

          <div className="bg-[#E8F5E9] rounded-lg p-3 border border-[#2E7D32]/20">
            <p className="text-xs text-[#2E7D32] font-medium mb-1">Campaign Details</p>
            <ul className="text-xs text-[#616161] space-y-1">
              <li>• 5 emails over 2 weeks</li>
              <li>• Focus: Product education & value</li>
              <li>• Average open rate: 42%</li>
            </ul>
          </div>
        </>
      ) : null}

      <div className="bg-[#E8F5E9] rounded-lg p-3 border border-[#2E7D32]/20">
        <p className="text-xs text-[#2E7D32] font-medium mb-1">Action Summary</p>
        <p className="text-xs text-[#616161]">
          This action will be executed when the workflow reaches this step
        </p>
      </div>
    </div>
  );

  const getNodeIcon = () => {
    switch (node.type) {
      case "trigger":
        return <Zap size={20} className="text-[#1565C0]" />;
      case "condition":
        return <GitBranch size={20} className="text-[#F57F17]" />;
      case "action":
        return <Play size={20} className="text-[#2E7D32]" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-96 bg-white border-l border-[#E0E0E0] flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-[#E0E0E0] bg-[#FAFAFA]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getNodeIcon()}
            <h3 className="text-lg font-semibold text-[#212121] capitalize">{node.type} Node</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#E0E0E0] text-[#616161] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-[#9E9E9E]">Configure node settings and behavior</p>
      </div>

      {/* Configuration Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#424242] mb-2">
            Node Label
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
            placeholder="Enter node label"
            defaultValue={node.label}
          />
        </div>

        {node.type === "trigger" && renderTriggerConfig()}
        {node.type === "condition" && renderConditionConfig()}
        {node.type === "action" && renderActionConfig()}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#E0E0E0] bg-[#FAFAFA] space-y-3">
        {/* Test This Step Button */}
        {node.type === "action" && (
          <button
            onClick={() => console.log("Testing step...")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#1565C0] rounded-lg text-sm font-semibold text-[#1565C0] bg-white hover:bg-[#E3F2FD] transition-colors"
          >
            <TestTube size={16} />
            Test This Step
          </button>
        )}

        {/* Save and Cancel Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-shadow"
          >
            Save Changes
          </button>
        </div>

        {/* Delete Node Link */}
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete this node?")) {
              console.log("Deleting node:", node.id);
              onClose();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#D32F2F] hover:bg-[#FFEBEE] rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          Delete Node
        </button>
      </div>
    </div>
  );
}