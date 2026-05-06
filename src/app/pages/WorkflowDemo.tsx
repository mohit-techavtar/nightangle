import React from "react";
import { useNavigate } from "react-router";
import { Workflow, Zap, GitBranch, Play, CheckCircle, MessageSquare, ListTodo } from "lucide-react";

export function WorkflowDemo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#BBDEFB] to-[#90CAF9] flex flex-col items-center justify-center p-6">
      {/* Demo Content */}
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1565C0] to-[#0D47A1] p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Workflow size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Workflow Automation Builder</h1>
              <p className="text-lg opacity-90">Visual CRM automation for lead management</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Visual Workflow Preview */}
          <div className="bg-gradient-to-br from-[#F5F5F5] to-[#E0E0E0] rounded-xl p-8 mb-8 border-2 border-[#E0E0E0]">
            <h2 className="text-xl font-semibold text-[#212121] mb-6 text-center">
              Example: High Value Lead Follow-up Workflow
            </h2>
            
            <div className="flex items-center justify-center gap-4">
              {/* Trigger Node */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#1565C0] to-[#0D47A1] rounded-2xl p-4 shadow-lg min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-white" />
                    <span className="text-xs font-bold text-white opacity-80">TRIGGER</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Lead Enters Stage:</p>
                  <p className="text-xs text-white opacity-90">Qualified</p>
                </div>
              </div>

              <div className="text-[#1565C0]">→</div>

              {/* Condition Node */}
              <div className="relative">
                <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
                  <defs>
                    <linearGradient id="grad-demo" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F57F17" />
                      <stop offset="100%" stopColor="#E65100" />
                    </linearGradient>
                  </defs>
                  <path d="M 60 5 L 115 60 L 60 115 L 5 60 Z" fill="url(#grad-demo)" stroke="#F57F17" strokeWidth="2" />
                  <text x="60" y="55" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">If Score</text>
                  <text x="60" y="70" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">&gt; 70</text>
                </svg>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-[#2E7D32] font-semibold text-sm">Yes →</div>
                  <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-4 shadow-lg min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-white" />
                      <span className="text-xs font-bold text-white opacity-80">ACTION</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Send WhatsApp</p>
                    <p className="text-xs text-white opacity-90">High Priority</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-[#D32F2F] font-semibold text-sm">No →</div>
                  <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-4 shadow-lg min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Play size={16} className="text-white" />
                      <span className="text-xs font-bold text-white opacity-80">ACTION</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Add to Campaign</p>
                    <p className="text-xs text-white opacity-90">Nurture Sequence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg p-5 border border-[#1565C0]/20">
              <div className="w-12 h-12 rounded-full bg-[#1565C0] flex items-center justify-center mb-3">
                <Zap size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121] mb-2">Triggers</h3>
              <p className="text-sm text-[#616161]">
                Start workflows based on lead stage changes, score updates, or field modifications
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFE082] rounded-lg p-5 border border-[#F57F17]/20">
              <div className="w-12 h-12 rounded-full bg-[#F57F17] flex items-center justify-center mb-3">
                <GitBranch size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121] mb-2">Conditions</h3>
              <p className="text-sm text-[#616161]">
                Create branching logic with if/else conditions based on lead data and scoring
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] rounded-lg p-5 border border-[#2E7D32]/20">
              <div className="w-12 h-12 rounded-full bg-[#2E7D32] flex items-center justify-center mb-3">
                <Play size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121] mb-2">Actions</h3>
              <p className="text-sm text-[#616161]">
                Send messages, create tasks, update fields, and add leads to campaigns automatically
              </p>
            </div>
          </div>

          {/* Interface Features */}
          <div className="bg-[#F5F5F5] rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#212121] mb-4">Interface Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#212121] mb-1">Visual Canvas</p>
                  <p className="text-xs text-[#616161]">
                    Grid-based canvas with snap-to-grid for precise node placement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#212121] mb-1">Node Connections</p>
                  <p className="text-xs text-[#616161]">
                    Connection ports on node edges with curved arrows and labels
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#212121] mb-1">Workflow Library</p>
                  <p className="text-xs text-[#616161]">
                    Left sidebar with workflows grouped by pipeline (Sales, Support)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#212121] mb-1">Status Indicators</p>
                  <p className="text-xs text-[#616161]">
                    Active, Paused, and Draft status with color-coded badges
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#212121] mb-1">Node Configuration</p>
                  <p className="text-xs text-[#616161]">
                    Right panel with detailed settings for each node type
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#212121] mb-1">Toolbar Actions</p>
                  <p className="text-xs text-[#616161]">
                    Save, Test, Activate toggle, and Undo/Redo functionality
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Node Types */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border-2 border-[#1565C0] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-[#212121]">Trigger Nodes</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-[#616161]">
                <li>• Lead enters stage</li>
                <li>• Score changes</li>
                <li>• Field updated</li>
                <li>• New lead created</li>
                <li>• Email received</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border-2 border-[#F57F17] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F57F17] to-[#E65100] flex items-center justify-center">
                  <GitBranch size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-[#212121]">Condition Nodes</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-[#616161]">
                <li>• Lead score comparison</li>
                <li>• Field value checks</li>
                <li>• Tag presence</li>
                <li>• Lead owner</li>
                <li>• Time-based conditions</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border-2 border-[#2E7D32] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center">
                  <Play size={16} className="text-white" />
                </div>
                <h3 className="font-semibold text-[#212121]">Action Nodes</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-[#616161]">
                <li>• Send WhatsApp/Email</li>
                <li>• Create task</li>
                <li>• Update field</li>
                <li>• Add/remove tag</li>
                <li>• Add to campaign</li>
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg">
              <p className="text-3xl font-bold text-[#1565C0] mb-1">5</p>
              <p className="text-xs text-[#616161]">Active Workflows</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-lg">
              <p className="text-3xl font-bold text-[#2E7D32] mb-1">452</p>
              <p className="text-xs text-[#616161]">Executions Today</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-[#FFF8E1] to-[#FFE082] rounded-lg">
              <p className="text-3xl font-bold text-[#F57F17] mb-1">98%</p>
              <p className="text-xs text-[#616161]">Success Rate</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7] rounded-lg">
              <p className="text-3xl font-bold text-[#7C4DFF] mb-1">24h</p>
              <p className="text-xs text-[#616161]">Time Saved</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => navigate("/tenant/workflow-automation")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold text-lg hover:shadow-2xl transition-shadow"
            >
              <Workflow size={24} />
              Open Workflow Builder
            </button>
            <p className="text-xs text-[#9E9E9E] mt-4">
              Automate your CRM workflows with visual builder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}