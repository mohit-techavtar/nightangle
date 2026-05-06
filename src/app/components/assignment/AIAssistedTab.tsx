import React, { useState } from "react";
import { Sparkles, TrendingUp, Users, Target } from "lucide-react";

export function AIAssistedTab() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#212121] mb-2 flex items-center gap-2">
          <Sparkles size={24} className="text-[#7C4DFF]" />
          AI-Assisted Assignment
        </h2>
        <p className="text-sm text-[#616161]">
          Use machine learning to match leads with the best-suited team member
        </p>
      </div>

      {/* Enable AI Toggle */}
      <div className="bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7] rounded-lg p-6 border border-[#7C4DFF]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Sparkles size={24} className="text-[#7C4DFF]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#212121]">AI Assignment Engine</p>
              <p className="text-xs text-[#616161]">
                {aiEnabled ? "Currently active" : "Currently inactive"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              aiEnabled ? "bg-[#7C4DFF]" : "bg-[#E0E0E0]"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                aiEnabled ? "translate-x-8" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* AI Factors */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">AI Matching Factors</h3>
        <p className="text-sm text-[#616161] mb-6">
          The AI considers these factors when matching leads to team members
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F3E5F5] rounded-lg p-4 border border-[#7C4DFF]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#7C4DFF] flex items-center justify-center">
                <Target size={20} className="text-white" />
              </div>
              <h4 className="text-sm font-semibold text-[#212121]">Historical Performance</h4>
            </div>
            <p className="text-xs text-[#616161]">
              Success rate of each team member with similar leads in the past
            </p>
          </div>

          <div className="bg-[#E3F2FD] rounded-lg p-4 border border-[#1565C0]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1565C0] flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h4 className="text-sm font-semibold text-[#212121]">Industry Expertise</h4>
            </div>
            <p className="text-xs text-[#616161]">
              Team member's experience and success in the lead's industry
            </p>
          </div>

          <div className="bg-[#FFF8E1] rounded-lg p-4 border border-[#F57F17]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F57F17] flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h4 className="text-sm font-semibold text-[#212121]">Current Workload</h4>
            </div>
            <p className="text-xs text-[#616161]">
              Number of active leads and capacity of each team member
            </p>
          </div>

          <div className="bg-[#E8F5E9] rounded-lg p-4 border border-[#2E7D32]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#2E7D32] flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <h4 className="text-sm font-semibold text-[#212121]">Lead Characteristics</h4>
            </div>
            <p className="text-xs text-[#616161]">
              Lead score, source, location, company size, and other attributes
            </p>
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">AI Configuration</h3>

        {/* Confidence Threshold */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#424242]">
              Minimum Confidence Threshold
            </label>
            <span className="text-sm font-bold text-[#7C4DFF]">{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer ai-slider-thumb"
          />
          <div className="flex justify-between text-xs text-[#9E9E9E] mt-1">
            <span>50% (More assignments)</span>
            <span>100% (Higher accuracy)</span>
          </div>
          <p className="text-xs text-[#616161] mt-2">
            If AI confidence is below this threshold, the lead will be assigned using fallback rules
          </p>
        </div>

        {/* Fallback Method */}
        <div>
          <label className="block text-sm font-medium text-[#424242] mb-2">
            Fallback Assignment Method
          </label>
          <select className="w-full h-10 px-3 rounded-md border border-[#E0E0E0] text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]/20 focus:border-[#7C4DFF]">
            <option value="round-robin">Round Robin</option>
            <option value="rule-based">Rule-Based</option>
            <option value="manual">Manual Assignment Queue</option>
          </select>
          <p className="text-xs text-[#616161] mt-2">
            Used when AI confidence is below threshold or AI is unavailable
          </p>
        </div>
      </div>

      {/* AI Performance Stats */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">AI Performance Metrics</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#F5F5F5] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#7C4DFF]">94%</p>
            <p className="text-xs text-[#616161] mt-1">Accuracy</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#2E7D32]">87%</p>
            <p className="text-xs text-[#616161] mt-1">Conversion Rate</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#1565C0]">1,247</p>
            <p className="text-xs text-[#616161] mt-1">Leads Assigned</p>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#EF6C00]">23%</p>
            <p className="text-xs text-[#616161] mt-1">Improvement</p>
          </div>
        </div>
        <p className="text-xs text-[#9E9E9E] mt-4 text-center">
          Compared to manual assignment over the last 30 days
        </p>
      </div>

      {/* Training Section */}
      <div className="bg-[#F3E5F5] rounded-lg border border-[#7C4DFF]/20 p-6">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-[#7C4DFF] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#212121] mb-1">AI Model Training</h4>
            <p className="text-xs text-[#616161] mb-4">
              The AI model continuously learns from assignment outcomes. Last trained: March 24, 2026
            </p>
            <button className="px-4 py-2 rounded-md bg-[#7C4DFF] text-white text-sm font-semibold hover:bg-[#6A1B9A] transition-colors">
              Retrain Model Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
