import React, { useState } from "react";
import { RotateCw, Users } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  assignmentCount: number;
  isActive: boolean;
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Akash Verma", email: "akash@omnicrm.com", initials: "AV", assignmentCount: 45, isActive: true },
  { id: "2", name: "Priya Sharma", email: "priya@omnicrm.com", initials: "PS", assignmentCount: 38, isActive: true },
  { id: "3", name: "Rohit Singh", email: "rohit@omnicrm.com", initials: "RS", assignmentCount: 52, isActive: true },
  { id: "4", name: "Neha Gupta", email: "neha@omnicrm.com", initials: "NG", assignmentCount: 41, isActive: false },
  { id: "5", name: "Vikram Patel", email: "vikram@omnicrm.com", initials: "VP", assignmentCount: 35, isActive: true },
];

export function RoundRobinTab() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

  const handleToggleMember = (memberId: string) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, isActive: !member.isActive } : member
      )
    );
  };

  const handleResetDistribution = () => {
    if (confirm("Are you sure you want to reset the distribution? All assignment counts will be set to 0.")) {
      setTeamMembers((prev) =>
        prev.map((member) => ({ ...member, assignmentCount: 0 }))
      );
    }
  };

  const maxCount = Math.max(...teamMembers.map((m) => m.assignmentCount));
  const activeCount = teamMembers.filter((m) => m.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#212121] mb-2">Round Robin Assignment</h2>
        <p className="text-sm text-[#616161]">
          Distribute leads evenly among active team members
        </p>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg p-4 border border-[#1565C0]/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <Users size={24} className="text-[#1565C0]" />
          </div>
          <div>
            <p className="text-sm text-[#616161]">Active Team Members</p>
            <p className="text-2xl font-bold text-[#212121]">
              {activeCount} / {teamMembers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Active Team Members Card */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#212121]">Team Members</h3>
          <button
            onClick={handleResetDistribution}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#D32F2F] text-[#D32F2F] text-sm font-semibold hover:bg-[#FFEBEE] transition-colors"
          >
            <RotateCw size={16} />
            Reset Distribution
          </button>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-5 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`bg-[#FAFAFA] rounded-lg p-4 border-2 transition-all ${
                member.isActive
                  ? "border-[#1565C0] bg-white"
                  : "border-[#E0E0E0] opacity-60"
              }`}
            >
              {/* Avatar and Toggle */}
              <div className="flex flex-col items-center mb-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-semibold mb-3 ${
                    member.isActive
                      ? "bg-gradient-to-br from-[#1565C0] to-[#0D47A1]"
                      : "bg-[#9E9E9E]"
                  }`}
                >
                  {member.initials}
                </div>
                <h4 className="text-sm font-semibold text-[#212121] text-center mb-1">
                  {member.name}
                </h4>
                <p className="text-xs text-[#9E9E9E] text-center mb-3">{member.email}</p>

                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggleMember(member.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    member.isActive ? "bg-[#2E7D32]" : "bg-[#E0E0E0]"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      member.isActive ? "translate-x-6" : ""
                    }`}
                  />
                </button>
                <p className="text-xs text-[#616161] mt-2">
                  {member.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              {/* Assignment Count */}
              <div className="border-t border-[#E0E0E0] pt-4">
                <p className="text-xs text-[#9E9E9E] mb-2 text-center">Assignments</p>
                <p className="text-2xl font-bold text-[#1565C0] text-center mb-2">
                  {member.assignmentCount}
                </p>
                {/* Bar Chart */}
                <div className="w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1565C0] to-[#0D47A1] transition-all duration-500"
                    style={{
                      width: `${maxCount > 0 ? (member.assignmentCount / maxCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Options */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">Round Robin Settings</h3>
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
                  Skip members on vacation/out-of-office
                </p>
                <p className="text-xs text-[#9E9E9E]">
                  Automatically exclude members with OOO status
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
                  Balance by workload
                </p>
                <p className="text-xs text-[#9E9E9E]">
                  Consider current open leads when assigning new ones
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
                  Notify members on new assignment
                </p>
                <p className="text-xs text-[#9E9E9E]">
                  Send email and in-app notification when a lead is assigned
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
