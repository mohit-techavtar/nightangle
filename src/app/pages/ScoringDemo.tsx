import React from "react";
import { useNavigate } from "react-router";
import { Award, TrendingUp, Sparkles, BarChart3 } from "lucide-react";

export function ScoringDemo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] flex flex-col items-center justify-center p-6">
      {/* Demo Content */}
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] text-white mb-4">
            <Award size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#212121] mb-2">
            Lead Scoring Dashboard
          </h1>
          <p className="text-[#616161] text-lg">
            Configure rule-based and AI-powered scoring models
          </p>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#1565C0] mb-1">
              <Award size={20} />
              <span className="text-sm font-medium">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">186</p>
            <p className="text-xs text-[#616161] mt-1">Across all score ranges</p>
          </div>

          <div className="bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#2E7D32] mb-1">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">High Quality</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">101</p>
            <p className="text-xs text-[#616161] mt-1">Score 60+ (54%)</p>
          </div>

          <div className="bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#7C4DFF] mb-1">
              <Sparkles size={20} />
              <span className="text-sm font-medium">AI Enabled</span>
            </div>
            <p className="text-2xl font-bold text-[#212121]">Active</p>
            <p className="text-xs text-[#616161] mt-1">60/40 Rule-AI split</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-[#F5F5F5] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Dashboard Features</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Rule-Based Scoring</p>
                <p className="text-xs text-[#616161]">5 configurable weight sliders</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C4DFF] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">AI Scoring Model</p>
                <p className="text-xs text-[#616161]">4 AI factors with gauges</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Dual-Thumb Slider</p>
                <p className="text-xs text-[#616161]">Adjust Rule vs AI weight split</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C4DFF] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Score Distribution</p>
                <p className="text-xs text-[#616161]">Color-coded histogram chart</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Top 10 Leads</p>
                <p className="text-xs text-[#616161]">Composite, Rule, AI scores</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C4DFF] mt-2"></span>
              <div>
                <p className="text-sm font-medium text-[#212121]">Trend Indicators</p>
                <p className="text-xs text-[#616161]">Up/down/stable arrows</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Criteria Preview */}
        <div className="bg-[#FAFAFA] rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#212121] mb-4">Scoring Criteria</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1565C0] mb-2 flex items-center gap-2">
                <BarChart3 size={16} />
                Rule-Based Factors
              </h3>
              <ul className="space-y-1.5 text-sm text-[#616161]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#1565C0]"></span>
                  Lead Source (Weight: 25)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#1565C0]"></span>
                  Stage Progress (Weight: 35)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#1565C0]"></span>
                  Engagement Frequency (Weight: 20)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#1565C0]"></span>
                  Response Time (Weight: 10)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#1565C0]"></span>
                  Call Outcome (Weight: 10)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#7C4DFF] mb-2 flex items-center gap-2">
                <Sparkles size={16} />
                AI-Powered Factors
              </h3>
              <ul className="space-y-1.5 text-sm text-[#616161]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7C4DFF]"></span>
                  Sentiment Analysis (Gauge: 78/100)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7C4DFF]"></span>
                  Intent Strength (Gauge: 85/100)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7C4DFF]"></span>
                  Objection Patterns (Bar: 42/100)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7C4DFF]"></span>
                  Conversation Depth (Bar: 68/100)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/tenant/lead-scoring")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            <Award size={24} />
            Open Scoring Dashboard
          </button>
          <p className="text-xs text-[#9E9E9E] mt-3">
            Configure weights and analyze lead score distribution
          </p>
        </div>
      </div>
    </div>
  );
}