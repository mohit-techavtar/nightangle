import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Settings,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Edit2,
  Lock,
  Info,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  dailyCap: number;
  maxDuration: number;
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Jewellery Q2",
    budget: 15000,
    spent: 8200,
    dailyCap: 500,
    maxDuration: 5,
  },
  {
    id: "2",
    name: "Trading Outreach",
    budget: 12000,
    spent: 5400,
    dailyCap: 400,
    maxDuration: 5,
  },
  {
    id: "3",
    name: "Collections",
    budget: 8000,
    spent: 4100,
    dailyCap: 300,
    maxDuration: 4,
  },
  {
    id: "4",
    name: "NPS Survey",
    budget: 5000,
    spent: 1200,
    dailyCap: 200,
    maxDuration: 3,
  },
];

const costBreakdown = [
  { component: "AI Processing", unitCost: "1.20/min", today: 890, thisMonth: 5640 },
  { component: "Telephony", unitCost: "0.50/min", today: 370, thisMonth: 2340 },
  { component: "TTS/ASR", unitCost: "0.40/min", today: 296, thisMonth: 1870 },
  { component: "Recording Storage", unitCost: "0.10/call", today: 185, thisMonth: 1170 },
];

const recentAlerts = [
  {
    id: "1",
    type: "warning",
    message: "Campaign 'Trading Outreach' reached 80% of budget",
    date: "Yesterday",
  },
  {
    id: "2",
    type: "success",
    message: "Monthly budget reset for April",
    date: "Apr 1",
  },
  {
    id: "3",
    type: "warning",
    message: "High cost spike detected: 23% above average",
    date: "Mar 28",
  },
];

// Mock sparkline data for daily spending
const dailySpendData = [420, 380, 450, 520, 490, 560, 540, 480, 510, 530, 490, 520, 550, 580];

export function CostGovernance() {
  const navigate = useNavigate();
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [dailyBudget, setDailyBudget] = useState(2500);
  const [maxCallDuration, setMaxCallDuration] = useState(5);
  const [silenceTermination, setSilenceTermination] = useState(8);
  const [maxConcurrentCalls, setMaxConcurrentCalls] = useState(15);
  const [pauseOnCapReached, setPauseOnCapReached] = useState(true);
  const [autoTerminate, setAutoTerminate] = useState(true);
  const [loopDetection, setLoopDetection] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [maxRetries, setMaxRetries] = useState(3);
  const [cooldownHours, setCooldownHours] = useState(4);
  const [maxCallsPerDay, setMaxCallsPerDay] = useState(2);
  const [maxCallsPerCampaign, setMaxCallsPerCampaign] = useState(5);
  const [dndCompliance, setDndCompliance] = useState(true);

  const spent = 12450;
  const budget = monthlyBudget;
  const remaining = budget - spent;
  const percentageSpent = (spent / budget) * 100;
  const projectedSpend = 38200;

  const getBudgetColor = () => {
    if (percentageSpent >= 90) return "text-red-600";
    if (percentageSpent >= 70) return "text-amber-600";
    return "text-green-600";
  };

  const getRingColor = () => {
    if (percentageSpent >= 90) return "#DC2626";
    if (percentageSpent >= 70) return "#F59E0B";
    return "#10B981";
  };

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 200;
    const height = 40;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline fill="none" stroke="#6366F1" strokeWidth="2" points={points} />
      </svg>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tenant/ai-calling")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Cost Governance</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor spending and configure safety limits
                </p>
              </div>
            </div>

            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
              <Settings className="w-4 h-4" />
              Budget Alert Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Current Month Spending - Large Visual Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Month Spending</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Circular Budget Gauge */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Background Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      stroke="#E5E7EB"
                      strokeWidth="20"
                      fill="none"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      stroke={getRingColor()}
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${percentageSpent * 6.28} 628`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-4xl font-bold font-mono ${getBudgetColor()}`}>
                      {percentageSpent.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">of budget</div>
                  </div>
                </div>

                {/* Budget Details */}
                <div className="mt-6 space-y-2 w-full max-w-xs">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      INR {spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      INR {budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-300 pt-2">
                    <span className="text-gray-600">Remaining:</span>
                    <span className={`font-mono font-bold ${getBudgetColor()}`}>
                      INR {remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Projection & Stats */}
              <div className="flex flex-col justify-center space-y-6">
                {/* Projection */}
                <div className="bg-white rounded-lg border border-green-200 p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        Projected Spend
                      </div>
                      <div className="text-xs text-gray-600 leading-relaxed">
                        At current pace, projected spend:{" "}
                        <span className="font-mono font-bold text-green-700">
                          INR {projectedSpend.toLocaleString()}
                        </span>
                        <br />
                        <span className="text-green-600 font-medium">
                          (within budget by INR{" "}
                          {(budget - projectedSpend).toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Spend Sparkline */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">
                    Daily Spend Trend (Last 14 Days)
                  </div>
                  <div className="flex justify-center">
                    <Sparkline data={dailySpendData} />
                  </div>
                </div>

                {/* Call Costs */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Last Call Cost</div>
                      <div className="text-lg font-mono font-bold text-gray-900">INR 2.40</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Avg Cost/Call</div>
                      <div className="text-lg font-mono font-bold text-gray-900">INR 2.57</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Limits */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Global Limits</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Budget Cap */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Budget Cap
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">INR</span>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pauseOnCapReached}
                    onChange={(e) => setPauseOnCapReached(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Pause all campaigns when reached
                  </span>
                </label>
              </div>

              {/* Daily Budget Cap */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Daily Budget Cap
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">INR</span>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Max Call Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Max Call Duration
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={maxCallDuration}
                    onChange={(e) => setMaxCallDuration(Number(e.target.value))}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-sm text-gray-600">minutes</span>
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoTerminate}
                    onChange={(e) => setAutoTerminate(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Auto-terminate after limit</span>
                </label>
              </div>

              {/* Silence Termination */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Silence Termination
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={silenceTermination}
                    onChange={(e) => setSilenceTermination(Number(e.target.value))}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-sm text-gray-600">seconds</span>
                </div>
                <p className="text-xs text-gray-500">End call after silence detected</p>
              </div>

              {/* Max Concurrent Calls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Max Concurrent Calls
                </label>
                <input
                  type="number"
                  value={maxConcurrentCalls}
                  onChange={(e) => setMaxConcurrentCalls(Number(e.target.value))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Loop Detection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Loop Detection
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loopDetection}
                    onChange={(e) => setLoopDetection(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Detect and terminate repetitive AI responses
                  </span>
                </label>
              </div>
            </div>

            {/* Alert Threshold Slider */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send alert at <span className="font-mono text-indigo-600">{alertThreshold}%</span>{" "}
                of budget
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${
                      ((alertThreshold - 50) / 45) * 100
                    }%, #E5E7EB ${((alertThreshold - 50) / 45) * 100}%, #E5E7EB 100%)`,
                  }}
                />
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>50%</span>
                  <span>|</span>
                  <span>70%</span>
                  <span>|</span>
                  <span>90%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Per-Campaign Limits */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Per-Campaign Limits</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Remaining
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Daily Cap
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Max Duration
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => {
                    const remaining = campaign.budget - campaign.spent;
                    const percentage = (campaign.spent / campaign.budget) * 100;
                    const getColor = () => {
                      if (percentage >= 90) return "bg-red-500";
                      if (percentage >= 70) return "bg-amber-500";
                      return "bg-green-500";
                    };

                    return (
                      <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {campaign.name}
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getColor()} transition-all`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {percentage.toFixed(1)}% used
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono font-semibold text-gray-900">
                            INR {campaign.budget.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-gray-900">
                            INR {campaign.spent.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-sm font-mono font-semibold ${
                              percentage >= 90
                                ? "text-red-600"
                                : percentage >= 70
                                ? "text-amber-600"
                                : "text-green-600"
                            }`}
                          >
                            INR {remaining.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-gray-900">
                            INR {campaign.dailyCap}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-900">
                            {campaign.maxDuration} min
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Retry & Rate Limits */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Retry & Rate Limits</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Max Retries */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Max retries per lead
                </label>
                <input
                  type="number"
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(Number(e.target.value))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Cooldown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cooldown between retries
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={cooldownHours}
                    onChange={(e) => setCooldownHours(Number(e.target.value))}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-sm text-gray-600">hours</span>
                </div>
              </div>

              {/* Max Calls Per Day */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Max calls per lead per day
                </label>
                <input
                  type="number"
                  value={maxCallsPerDay}
                  onChange={(e) => setMaxCallsPerDay(Number(e.target.value))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Max Calls Per Campaign */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Max calls per lead per campaign
                </label>
                <input
                  type="number"
                  value={maxCallsPerCampaign}
                  onChange={(e) => setMaxCallsPerCampaign(Number(e.target.value))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* DND Compliance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  DND Compliance
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
                    <input
                      type="checkbox"
                      checked={dndCompliance}
                      disabled
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Enabled (Required)</span>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Automatically respects Do Not Disturb registry
                </p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Unit Cost
                    </th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Today
                    </th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      This Month
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {costBreakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">
                          {item.component}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-mono text-gray-700">
                          INR {item.unitCost}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm font-mono text-gray-900">
                          INR {item.today.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          INR {item.thisMonth.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-gray-900">Total</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-500">—</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-mono font-bold text-gray-900">
                        INR{" "}
                        {costBreakdown
                          .reduce((sum, item) => sum + item.today, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-mono font-bold text-gray-900">
                        INR{" "}
                        {costBreakdown
                          .reduce((sum, item) => sum + item.thisMonth, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Cost Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Cost Alerts</h3>

            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    alert.type === "warning"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  {alert.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        alert.type === "warning" ? "text-amber-900" : "text-green-900"
                      }`}
                    >
                      {alert.message}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{alert.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
