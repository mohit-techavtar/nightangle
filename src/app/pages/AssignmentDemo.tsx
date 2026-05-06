import React from "react";
import { useNavigate } from "react-router";
import { RotateCw, ListFilter, Sparkles, Clock, Users } from "lucide-react";

export function AssignmentDemo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex flex-col items-center justify-center p-6">
      {/* Demo Content */}
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white mb-4">
            <Users size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2">
            Lead Assignment Configuration
          </h1>
          <p className="text-[#616161] text-lg">
            Configure automated lead distribution and routing
          </p>
        </div>

        {/* Configuration Methods */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg p-5 border border-[#1565C0]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1565C0] flex items-center justify-center">
                <RotateCw size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">Round Robin</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              Distribute leads evenly among active team members
            </p>
            <ul className="text-xs text-[#616161] space-y-1">
              <li>• 5 active team members</li>
              <li>• Balance by workload</li>
              <li>• Skip OOO members</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7] rounded-lg p-5 border border-[#7C4DFF]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#7C4DFF] flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">AI-Assisted</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              ML-powered matching based on performance
            </p>
            <ul className="text-xs text-[#616161] space-y-1">
              <li>• 94% accuracy rate</li>
              <li>• 87% conversion rate</li>
              <li>• 1,247 leads assigned</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFE082] rounded-lg p-5 border border-[#F57F17]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F57F17] flex items-center justify-center">
                <ListFilter size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">Rule-Based</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              Custom rules with drag-to-reorder priority
            </p>
            <ul className="text-xs text-[#616161] space-y-1">
              <li>• 3 active rules configured</li>
              <li>• Field-operator-value logic</li>
              <li>• Fallback rule support</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#E8F5E9] to-[#A5D6A7] rounded-lg p-5 border border-[#2E7D32]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#2E7D32] flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#212121]">SLA Settings</h3>
            </div>
            <p className="text-sm text-[#616161] mb-2">
              Service level agreements and escalation
            </p>
            <ul className="text-xs text-[#616161] space-y-1">
              <li>• 92% compliance rate</li>
              <li>• 3 stage-specific rules</li>
              <li>• Auto-reassignment</li>
            </ul>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-[#F5F5F5] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Configuration Features</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Vertical Tab Navigation</p>
                <p className="text-xs text-[#616161]">4 configuration sections</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Team Member Management</p>
                <p className="text-xs text-[#616161]">Toggle active/inactive status</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Visual Rule Builder</p>
                <p className="text-xs text-[#616161]">Drag to reorder priority</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">AI Performance Metrics</p>
                <p className="text-xs text-[#616161]">Real-time accuracy tracking</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">SLA Monitoring</p>
                <p className="text-xs text-[#616161]">Automatic escalation rules</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Assignment Analytics</p>
                <p className="text-xs text-[#616161]">Workload distribution charts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="bg-[#FAFAFA] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Current Stats</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1565C0]">5</p>
              <p className="text-xs text-[#616161] mt-1">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2E7D32]">92%</p>
              <p className="text-xs text-[#616161] mt-1">SLA Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#7C4DFF]">87%</p>
              <p className="text-xs text-[#616161] mt-1">AI Conversion</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#F57F17]">3</p>
              <p className="text-xs text-[#616161] mt-1">Active Rules</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/admin/lead-assignment-config")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            <Users size={24} />
            Open Assignment Configuration
          </button>
          <p className="text-xs text-[#9E9E9E] mt-3">
            Configure automated lead distribution and routing rules
          </p>
        </div>
      </div>
    </div>
  );
}
