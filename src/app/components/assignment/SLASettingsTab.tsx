import React, { useState } from "react";
import { Clock, Plus, Trash2, AlertTriangle } from "lucide-react";

interface SLASetting {
  id: string;
  stageName: string;
  inactivityThreshold: number;
  action: string;
  escalationTo: string;
}

const stageOptions = [
  { value: "new-inquiry", label: "New Inquiry" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal-sent", label: "Proposal Sent" },
  { value: "negotiation", label: "Negotiation" },
];

const actionOptions = [
  { value: "reassign", label: "Reassign to Another Rep" },
  { value: "notify", label: "Notify Manager" },
  { value: "both", label: "Reassign + Notify Manager" },
  { value: "escalate", label: "Escalate to Senior Rep" },
];

const userTeamOptions = [
  { value: "team-sales", label: "Sales Team" },
  { value: "team-support", label: "Support Team" },
  { value: "user-1", label: "Akash Verma" },
  { value: "user-2", label: "Priya Sharma" },
  { value: "user-3", label: "Rohit Singh" },
  { value: "user-4", label: "Neha Gupta (Manager)" },
  { value: "user-5", label: "Vikram Patel (Senior)" },
];

export function SLASettingsTab() {
  const [slaSettings, setSlaSettings] = useState<SLASetting[]>([
    {
      id: "1",
      stageName: "new-inquiry",
      inactivityThreshold: 24,
      action: "notify",
      escalationTo: "user-4",
    },
    {
      id: "2",
      stageName: "contacted",
      inactivityThreshold: 48,
      action: "both",
      escalationTo: "user-4",
    },
    {
      id: "3",
      stageName: "qualified",
      inactivityThreshold: 72,
      action: "reassign",
      escalationTo: "team-sales",
    },
  ]);

  const handleAddSLA = () => {
    const newSLA: SLASetting = {
      id: Date.now().toString(),
      stageName: "",
      inactivityThreshold: 24,
      action: "notify",
      escalationTo: "",
    };
    setSlaSettings((prev) => [...prev, newSLA]);
  };

  const handleUpdateSLA = (id: string, field: keyof SLASetting, value: string | number) => {
    setSlaSettings((prev) =>
      prev.map((sla) => (sla.id === id ? { ...sla, [field]: value } : sla))
    );
  };

  const handleDeleteSLA = (id: string) => {
    setSlaSettings((prev) => prev.filter((sla) => sla.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#212121] mb-2">SLA Settings</h2>
        <p className="text-sm text-[#616161]">
          Configure service level agreements and automatic escalation rules
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-[#FFF8E1] rounded-lg p-4 border border-[#F57F17]/20">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-[#F57F17] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#212121] mb-1">
              Automatic SLA Monitoring
            </p>
            <p className="text-xs text-[#616161]">
              The system checks for SLA violations every hour. Actions are triggered automatically when
              inactivity thresholds are exceeded.
            </p>
          </div>
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">Global SLA Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
              />
              <div>
                <p className="text-sm font-medium text-[#212121]">
                  Enable SLA monitoring
                </p>
                <p className="text-xs text-[#9E9E9E]">
                  Automatically track and enforce SLA rules
                </p>
              </div>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
              />
              <div>
                <p className="text-sm font-medium text-[#212121]">
                  Send daily SLA summary
                </p>
                <p className="text-xs text-[#9E9E9E]">
                  Email managers a daily report of SLA compliance
                </p>
              </div>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
              />
              <div>
                <p className="text-sm font-medium text-[#212121]">
                  Pause SLA on weekends
                </p>
                <p className="text-xs text-[#9E9E9E]">
                  Don't count Saturday and Sunday toward inactivity time
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* SLA Configuration Table */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#212121]">
            Stage-Specific SLA Rules ({slaSettings.length})
          </h3>
          <button
            onClick={handleAddSLA}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-sm font-semibold hover:shadow-lg transition-shadow"
          >
            <Plus size={16} />
            Add SLA Rule
          </button>
        </div>

        {slaSettings.length === 0 ? (
          <div className="text-center py-12 text-[#9E9E9E]">
            <Clock size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No SLA rules configured</p>
            <p className="text-xs mt-1">Click "Add SLA Rule" to create your first rule</p>
          </div>
        ) : (
          <div className="space-y-4">
            {slaSettings.map((sla) => (
              <div
                key={sla.id}
                className="bg-[#FAFAFA] rounded-lg border border-[#E0E0E0] p-4"
              >
                <div className="grid grid-cols-5 gap-4">
                  {/* Stage Name */}
                  <div>
                    <label className="block text-xs font-medium text-[#616161] mb-1">
                      Stage Name
                    </label>
                    <select
                      value={sla.stageName}
                      onChange={(e) => handleUpdateSLA(sla.id, "stageName", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] bg-white focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                    >
                      <option value="">Select stage</option>
                      {stageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Inactivity Threshold */}
                  <div>
                    <label className="block text-xs font-medium text-[#616161] mb-1">
                      Inactivity (hours)
                    </label>
                    <input
                      type="number"
                      value={sla.inactivityThreshold}
                      onChange={(e) =>
                        handleUpdateSLA(sla.id, "inactivityThreshold", parseInt(e.target.value))
                      }
                      min="1"
                      className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] bg-white focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                    />
                  </div>

                  {/* Action */}
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#616161] mb-1">
                      Action
                    </label>
                    <select
                      value={sla.action}
                      onChange={(e) => handleUpdateSLA(sla.id, "action", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] bg-white focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                    >
                      {actionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Escalation To */}
                  <div>
                    <label className="block text-xs font-medium text-[#616161] mb-1">
                      Escalation To
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={sla.escalationTo}
                        onChange={(e) => handleUpdateSLA(sla.id, "escalationTo", e.target.value)}
                        className="flex-1 h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] bg-white focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                      >
                        <option value="">Select user/team</option>
                        {userTeamOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteSLA(sla.id)}
                        className="w-10 h-10 rounded-md text-[#D32F2F] hover:bg-[#FFEBEE] transition-colors flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time Display */}
                <div className="mt-3 flex items-center gap-2 text-xs text-[#616161]">
                  <Clock size={14} />
                  <span>
                    If no activity for <strong>{sla.inactivityThreshold} hours</strong> in{" "}
                    <strong>{stageOptions.find((s) => s.value === sla.stageName)?.label || "this stage"}</strong>,
                    then <strong>{actionOptions.find((a) => a.value === sla.action)?.label.toLowerCase()}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SLA Violations */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">Recent SLA Violations</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#FFEBEE] rounded-md border border-[#D32F2F]/20">
            <div>
              <p className="text-sm font-medium text-[#212121]">Rajesh Kumar - New Inquiry</p>
              <p className="text-xs text-[#616161]">Inactive for 27 hours (Threshold: 24 hours)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#D32F2F] text-white text-xs font-semibold">
              Violated
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#FFF8E1] rounded-md border border-[#F57F17]/20">
            <div>
              <p className="text-sm font-medium text-[#212121]">Priya Sharma - Contacted</p>
              <p className="text-xs text-[#616161]">Inactive for 45 hours (Threshold: 48 hours)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F57F17] text-white text-xs font-semibold">
              Warning
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#E8F5E9] rounded-md border border-[#2E7D32]/20">
            <div>
              <p className="text-sm font-medium text-[#212121]">Amit Patel - Qualified</p>
              <p className="text-xs text-[#616161]">Inactive for 15 hours (Threshold: 72 hours)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#2E7D32] text-white text-xs font-semibold">
              On Track
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">SLA Compliance (Last 30 Days)</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#E8F5E9] rounded-lg p-4 text-center border border-[#2E7D32]/20">
            <p className="text-2xl font-bold text-[#2E7D32]">92%</p>
            <p className="text-xs text-[#616161] mt-1">Compliance Rate</p>
          </div>
          <div className="bg-[#FFEBEE] rounded-lg p-4 text-center border border-[#D32F2F]/20">
            <p className="text-2xl font-bold text-[#D32F2F]">23</p>
            <p className="text-xs text-[#616161] mt-1">Violations</p>
          </div>
          <div className="bg-[#E3F2FD] rounded-lg p-4 text-center border border-[#1565C0]/20">
            <p className="text-2xl font-bold text-[#1565C0]">18</p>
            <p className="text-xs text-[#616161] mt-1">Auto-Reassigned</p>
          </div>
          <div className="bg-[#FFF8E1] rounded-lg p-4 text-center border border-[#F57F17]/20">
            <p className="text-2xl font-bold text-[#F57F17]">36h</p>
            <p className="text-xs text-[#616161] mt-1">Avg Response Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
