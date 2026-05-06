import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { GaugeChart } from "../../components/scoring/GaugeChart";
import { DualThumbSlider } from "../../components/scoring/DualThumbSlider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus, Save, Sparkles } from "lucide-react";

interface ScoringWeights {
  leadSource: number;
  stageProgress: number;
  engagementFrequency: number;
  responseTime: number;
  callOutcome: number;
}

interface AIFactors {
  sentimentAnalysis: number;
  intentStrength: number;
  objectionPatterns: number;
  conversationDepth: number;
}

interface TopLead {
  id: string;
  name: string;
  compositeScore: number;
  ruleScore: number;
  aiScore: number;
  trend: "up" | "down" | "stable";
}

const scoreDistributionData = [
  { range: "0-20", count: 12, color: "#D32F2F" },
  { range: "20-40", count: 28, color: "#EF6C00" },
  { range: "40-60", count: 45, color: "#F57F17" },
  { range: "60-80", count: 67, color: "#43A047" },
  { range: "80-100", count: 34, color: "#2E7D32" },
];

const topLeadsData: TopLead[] = [
  { id: "1", name: "Rajesh Kumar", compositeScore: 95, ruleScore: 92, aiScore: 98, trend: "up" },
  { id: "2", name: "Priya Sharma", compositeScore: 93, ruleScore: 90, aiScore: 96, trend: "up" },
  { id: "3", name: "Amit Patel", compositeScore: 91, ruleScore: 94, aiScore: 88, trend: "stable" },
  { id: "4", name: "Sneha Reddy", compositeScore: 89, ruleScore: 87, aiScore: 91, trend: "up" },
  { id: "5", name: "Vikram Singh", compositeScore: 87, ruleScore: 89, aiScore: 85, trend: "down" },
  { id: "6", name: "Anjali Mehta", compositeScore: 85, ruleScore: 82, aiScore: 88, trend: "up" },
  { id: "7", name: "Rahul Verma", compositeScore: 83, ruleScore: 85, aiScore: 81, trend: "stable" },
  { id: "8", name: "Kavita Joshi", compositeScore: 81, ruleScore: 79, aiScore: 83, trend: "up" },
  { id: "9", name: "Suresh Nair", compositeScore: 79, ruleScore: 81, aiScore: 77, trend: "down" },
  { id: "10", name: "Deepa Iyer", compositeScore: 77, ruleScore: 76, aiScore: 78, trend: "stable" },
];

export function LeadScoringDashboard() {
  const [ruleWeights, setRuleWeights] = useState<ScoringWeights>({
    leadSource: 25,
    stageProgress: 35,
    engagementFrequency: 20,
    responseTime: 10,
    callOutcome: 10,
  });

  const [aiFactors] = useState<AIFactors>({
    sentimentAnalysis: 78,
    intentStrength: 85,
    objectionPatterns: 42,
    conversationDepth: 68,
  });

  const [aiEnabled, setAiEnabled] = useState(true);
  const [ruleWeight, setRuleWeight] = useState(60);
  const [aiWeight, setAiWeight] = useState(40);

  const handleWeightChange = (field: keyof ScoringWeights, value: number) => {
    setRuleWeights((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveWeights = () => {
    console.log("Saving weights:", ruleWeights);
    alert("Scoring weights saved successfully!");
  };

  const handleRuleAIWeightChange = (left: number, right: number) => {
    setRuleWeight(left);
    setAiWeight(right);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp size={16} className="text-[#2E7D32]" />;
      case "down":
        return <TrendingDown size={16} className="text-[#D32F2F]" />;
      case "stable":
        return <Minus size={16} className="text-[#9E9E9E]" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#2E7D32]";
    if (score >= 60) return "text-[#43A047]";
    if (score >= 40) return "text-[#F57F17]";
    if (score >= 20) return "text-[#EF6C00]";
    return "text-[#D32F2F]";
  };

  const totalWeight = Object.values(ruleWeights).reduce((sum, val) => sum + val, 0);

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        breadcrumbs={[{ label: "CRM" }, { label: "Lead Scoring" }]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />

      <div className="flex-1 bg-[#F5F5F5] overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#212121] mb-2">Lead Scoring Configuration</h1>
            <p className="text-[#616161]">
              Configure rule-based and AI-powered scoring models to prioritize your leads effectively
            </p>
          </div>

          {/* Top Section: Two Cards Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Card: Rule-Based Scoring */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#212121] mb-1">Rule-Based Scoring</h2>
                <p className="text-sm text-[#9E9E9E]">
                  Configure weights for each scoring criterion (Total: {totalWeight}/100)
                </p>
              </div>

              <div className="space-y-6">
                {/* Lead Source Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#424242]">Lead Source</label>
                    <span className="text-sm font-bold text-[#1565C0]">
                      {ruleWeights.leadSource}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ruleWeights.leadSource}
                    onChange={(e) => handleWeightChange("leadSource", parseInt(e.target.value))}
                    className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-[#9E9E9E] mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Stage Progress Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#424242]">Stage Progress</label>
                    <span className="text-sm font-bold text-[#1565C0]">
                      {ruleWeights.stageProgress}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ruleWeights.stageProgress}
                    onChange={(e) => handleWeightChange("stageProgress", parseInt(e.target.value))}
                    className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-[#9E9E9E] mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Engagement Frequency Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#424242]">Engagement Frequency</label>
                    <span className="text-sm font-bold text-[#1565C0]">
                      {ruleWeights.engagementFrequency}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ruleWeights.engagementFrequency}
                    onChange={(e) => handleWeightChange("engagementFrequency", parseInt(e.target.value))}
                    className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-[#9E9E9E] mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Response Time Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#424242]">Response Time</label>
                    <span className="text-sm font-bold text-[#1565C0]">
                      {ruleWeights.responseTime}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ruleWeights.responseTime}
                    onChange={(e) => handleWeightChange("responseTime", parseInt(e.target.value))}
                    className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-[#9E9E9E] mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Call Outcome Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#424242]">Call Outcome</label>
                    <span className="text-sm font-bold text-[#1565C0]">
                      {ruleWeights.callOutcome}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ruleWeights.callOutcome}
                    onChange={(e) => handleWeightChange("callOutcome", parseInt(e.target.value))}
                    className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-[#9E9E9E] mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveWeights}
                className="w-full mt-6 h-11 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <Save size={18} />
                Save Weights
              </button>

              {totalWeight !== 100 && (
                <div className="mt-3 p-3 rounded-md bg-[#FFF8E1] border border-[#F57F17] text-sm text-[#EF6C00]">
                  ⚠️ Total weight should equal 100. Current: {totalWeight}
                </div>
              )}
            </div>

            {/* Right Card: AI Scoring Model */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-[#212121] flex items-center gap-2">
                    <Sparkles size={20} className="text-[#7C4DFF]" />
                    AI Scoring Model
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#616161]">Enable AI Scoring</span>
                    <button
                      onClick={() => setAiEnabled(!aiEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        aiEnabled ? "bg-[#7C4DFF]" : "bg-[#E0E0E0]"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          aiEnabled ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#9E9E9E]">
                  AI-powered analysis of conversation quality and buyer intent
                </p>
              </div>

              {/* AI Factors - Gauges */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <GaugeChart value={aiFactors.sentimentAnalysis} label="Sentiment Analysis" />
                <GaugeChart value={aiFactors.intentStrength} label="Intent Strength" />
              </div>

              {/* AI Factors - Bars */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#424242]">Objection Patterns</label>
                    <span className="text-sm font-bold text-[#7C4DFF]">
                      {aiFactors.objectionPatterns}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C4DFF] to-[#9575CD] transition-all duration-500"
                      style={{ width: `${aiFactors.objectionPatterns}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[#424242]">Conversation Depth</label>
                    <span className="text-sm font-bold text-[#7C4DFF]">
                      {aiFactors.conversationDepth}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C4DFF] to-[#9575CD] transition-all duration-500"
                      style={{ width: `${aiFactors.conversationDepth}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rule vs AI Weight Slider */}
              <div className="pt-6 border-t border-[#E0E0E0]">
                <h3 className="text-sm font-semibold text-[#212121] mb-4">Rule vs AI Weight Split</h3>
                <DualThumbSlider
                  leftValue={ruleWeight}
                  onChange={handleRuleAIWeightChange}
                  leftLabel="Rule"
                  rightLabel="AI"
                />
              </div>

              {/* AI Info */}
              <div className="mt-4 p-3 rounded-md bg-[#F3E5F5] border border-[#7C4DFF] text-sm text-[#6A1B9A]">
                <p className="flex items-start gap-2">
                  <Sparkles size={14} className="mt-0.5 flex-shrink-0" />
                  <span>
                    AI scoring analyzes conversation transcripts, email sentiment, and behavioral patterns
                    to predict conversion likelihood.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section: Distribution & Top Leads */}
          <div className="grid grid-cols-2 gap-6">
            {/* Score Distribution Histogram */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#212121] mb-1">Score Distribution</h2>
                <p className="text-sm text-[#9E9E9E]">
                  Number of leads in each score bracket
                </p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis
                    dataKey="range"
                    tick={{ fill: "#616161", fontSize: 12 }}
                    axisLine={{ stroke: "#E0E0E0" }}
                  />
                  <YAxis
                    tick={{ fill: "#616161", fontSize: 12 }}
                    axisLine={{ stroke: "#E0E0E0" }}
                    label={{ value: "Number of Leads", angle: -90, position: "insideLeft", style: { fill: "#616161", fontSize: 12 } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E0E0E0",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {scoreDistributionData.map((entry) => (
                      <Cell key={`cell-${entry.range}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-[#E8F5E9] rounded-md p-3 text-center">
                  <div className="text-2xl font-bold text-[#2E7D32]">
                    {scoreDistributionData[3].count + scoreDistributionData[4].count}
                  </div>
                  <div className="text-xs text-[#616161] mt-1">High Quality (60+)</div>
                </div>
                <div className="bg-[#FFF8E1] rounded-md p-3 text-center">
                  <div className="text-2xl font-bold text-[#F57F17]">
                    {scoreDistributionData[2].count}
                  </div>
                  <div className="text-xs text-[#616161] mt-1">Medium Quality</div>
                </div>
                <div className="bg-[#FFEBEE] rounded-md p-3 text-center">
                  <div className="text-2xl font-bold text-[#D32F2F]">
                    {scoreDistributionData[0].count + scoreDistributionData[1].count}
                  </div>
                  <div className="text-xs text-[#616161] mt-1">Low Quality (0-40)</div>
                </div>
              </div>
            </div>

            {/* Top 10 Scored Leads */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#212121] mb-1">Top 10 Scored Leads</h2>
                <p className="text-sm text-[#9E9E9E]">
                  Leads with the highest composite scores
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E0E0E0]">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-[#616161] uppercase">
                        Lead Name
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-[#616161] uppercase">
                        Composite
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-[#616161] uppercase">
                        Rule
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-[#616161] uppercase">
                        AI
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-semibold text-[#616161] uppercase">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLeadsData.map((lead, index) => (
                      <tr
                        key={lead.id}
                        className="border-b border-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#9E9E9E] w-5">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-medium text-[#212121]">
                              {lead.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-sm font-bold ${getScoreColor(lead.compositeScore)}`}>
                            {lead.compositeScore}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-sm text-[#616161]">{lead.ruleScore}</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-sm text-[#7C4DFF] font-medium">{lead.aiScore}</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center">
                            {getTrendIcon(lead.trend)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All Button */}
              <button className="w-full mt-4 h-10 rounded-md border border-[#E0E0E0] text-[#1565C0] text-sm font-semibold hover:bg-[#E3F2FD] hover:border-[#1565C0] transition-all">
                View All Leads
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}