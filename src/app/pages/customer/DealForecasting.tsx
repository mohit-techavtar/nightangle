import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  TrendingUp, TrendingDown, DollarSign, Target, Filter, Download,
  RefreshCw, ChevronDown, Info, BarChart3, Calendar, Users,
  ArrowRight, Zap, AlertCircle, CheckCircle2
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart, Area, ReferenceLine
} from "recharts";
import { useDeals } from "../../store/index";

const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`;
const fmtFull = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const forecastData = [
  { period: "Apr 2025", committed: 2450000, bestCase: 3200000, pipeline: 5600000, closed: 1890000 },
  { period: "May 2025", committed: 3100000, bestCase: 4100000, pipeline: 7200000, closed: 0 },
  { period: "Jun 2025", committed: 2800000, bestCase: 3900000, pipeline: 6500000, closed: 0 },
  { period: "Q2 2025", committed: 8350000, bestCase: 11200000, pipeline: 19300000, closed: 1890000 },
];

const pipelineByStage = [
  { stage: "Qualification", count: 8, value: 2800000, probability: 20, weighted: 560000 },
  { stage: "Needs Analysis", count: 6, value: 3600000, probability: 40, weighted: 1440000 },
  { stage: "Proposal Sent", count: 4, value: 2400000, probability: 60, weighted: 1440000 },
  { stage: "Negotiation", count: 3, value: 2800000, probability: 80, weighted: 2240000 },
  { stage: "Won", count: 4, value: 1890000, probability: 100, weighted: 1890000 },
];

const teamForecast = [
  { owner: "Priya Mehta", committed: 980000, bestCase: 1400000, won: 650000, deals: 8 },
  { owner: "Amit Kumar", committed: 720000, bestCase: 1100000, won: 450000, deals: 6 },
  { owner: "Sneha Reddy", committed: 550000, bestCase: 890000, won: 390000, deals: 5 },
  { owner: "Rohit Gupta", committed: 200000, bestCase: 450000, won: 0, deals: 4 },
];

const velocityData = [
  { week: "W14", openDeals: 18, wonDeals: 3, avgDays: 32 },
  { week: "W15", openDeals: 20, wonDeals: 4, avgDays: 28 },
  { week: "W16", openDeals: 22, wonDeals: 2, avgDays: 35 },
  { week: "W17", openDeals: 25, wonDeals: 5, avgDays: 24 },
  { week: "W18", openDeals: 23, wonDeals: 3, avgDays: 29 },
];

export function DealForecasting() {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState("All Pipelines");
  const [period, setPeriod] = useState("Q2 2025");
  const [owner, setOwner] = useState("All Owners");
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const { deals } = useDeals();

  const totalPipelineValue = pipelineByStage.reduce((sum, s) => sum + s.value, 0);
  const weightedTotal = pipelineByStage.reduce((sum, s) => sum + s.weighted, 0);
  const wonTotal = pipelineByStage.find(s => s.stage === "Won")?.value ?? 0;

  const kpis = [
    { label: "Committed Forecast", value: fmt(8350000), sub: "High confidence", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", tooltip: "Deals in Negotiation+ with probability ≥80%", trend: "+12.4%" },
    { label: "Best Case", value: fmt(11200000), sub: "If all close", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", tooltip: "All open deals at maximum probability", trend: "+8.7%" },
    { label: "Total Pipeline", value: fmt(19300000), sub: "Gross open value", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", tooltip: "Sum of all open deal amounts regardless of probability", trend: "+5.2%" },
    { label: "Won This Period", value: fmt(wonTotal), sub: "Closed won", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", tooltip: "Total revenue from won deals in the selected period", trend: "+22.1%" },
  ];

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "CRM" },
          { label: "Deals", path: "/tenant/deals" },
          { label: "Forecasting" }
        ]}
        companyName="TechAvtar India Pvt Ltd"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Deal Forecasting</h1>
              <p className="text-sm text-gray-500 mt-1">Stage-weighted revenue projections with owner breakdown</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={pipeline} onChange={e => setPipeline(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Pipelines</option>
                <option>Sales Pipeline</option>
                <option>Enterprise Pipeline</option>
                <option>Renewal Pipeline</option>
              </select>
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Apr 2025</option>
                <option>May 2025</option>
                <option>Jun 2025</option>
                <option>Q2 2025</option>
                <option>Q3 2025</option>
              </select>
              <select value={owner} onChange={e => setOwner(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Owners</option>
                {teamForecast.map(t => <option key={t.owner}>{t.owner}</option>)}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            {kpis.map(kpi => (
              <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-green-600 font-medium">{kpi.trend}</span>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onMouseEnter={() => setShowTooltip(kpi.label)}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {showTooltip === kpi.label && (
                  <div className="absolute mt-1 bg-gray-900 text-white text-xs rounded-lg p-2 z-10 max-w-48">{kpi.tooltip}</div>
                )}
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{kpi.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Forecast Chart + Stage Breakdown */}
          <div className="grid grid-cols-3 gap-6">
            {/* Forecast Trend */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-gray-900">Forecast by Period</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Committed vs Best Case vs Pipeline</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Committed</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Best Case</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block" /> Pipeline</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Won</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={forecastData} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="period" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value: number) => fmtFull(value)} />
                  <Bar key="bar-pipeline" dataKey="pipeline" fill="#E5E7EB" name="Pipeline" radius={[4, 4, 0, 0]} />
                  <Bar key="bar-bestCase" dataKey="bestCase" fill="#93C5FD" name="Best Case" radius={[4, 4, 0, 0]} />
                  <Bar key="bar-committed" dataKey="committed" fill="#10B981" name="Committed" radius={[4, 4, 0, 0]} />
                  <Line key="line-closed" type="monotone" dataKey="closed" stroke="#059669" strokeWidth={2} name="Won" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Stage Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Pipeline by Stage</h3>
              <div className="space-y-3">
                {pipelineByStage.map((stage, i) => (
                  <div key={stage.stage} className="group cursor-pointer" onClick={() => navigate(`/tenant/deals/pipeline`)}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700">{stage.stage}</span>
                        <span className="text-xs text-gray-400">({stage.count})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-gray-900">{fmt(stage.value)}</span>
                        <span className="text-xs text-gray-400 ml-1">→ {fmt(stage.weighted)}</span>
                      </div>
                    </div>
                    <div className="flex h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(stage.value / totalPipelineValue) * 100}%`,
                          backgroundColor: ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#10B981'][i]
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{stage.probability}% probability</div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">Weighted Total</span>
                    <span className="text-sm font-bold text-blue-600">{fmt(weightedTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Forecast Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Team Forecast Breakdown</h3>
                <p className="text-xs text-gray-500 mt-0.5">Individual performance vs forecast — manual probability override available</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Full Team View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Sales Owner</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Deals</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Committed</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Best Case</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Won</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Attainment</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Override</th>
                </tr>
              </thead>
              <tbody>
                {teamForecast.map((row, i) => {
                  const target = 1500000;
                  const attainment = Math.round((row.won / target) * 100);
                  return (
                    <tr key={row.owner} className={`${i < teamForecast.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                            {row.owner.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{row.owner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{row.deals}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-green-600">{fmtFull(row.committed)}</td>
                      <td className="px-4 py-3 text-right text-sm text-blue-600">{fmtFull(row.bestCase)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{fmtFull(row.won)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(attainment, 100)}%` }} />
                          </div>
                          <span className={`text-xs font-medium ${attainment >= 80 ? 'text-green-600' : attainment >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {attainment}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-xs text-blue-600 hover:underline">Override Probability</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">Total</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{teamForecast.reduce((s, r) => s + r.deals, 0)}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">{fmtFull(teamForecast.reduce((s, r) => s + r.committed, 0))}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600">{fmtFull(teamForecast.reduce((s, r) => s + r.bestCase, 0))}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{fmtFull(teamForecast.reduce((s, r) => s + r.won, 0))}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Velocity + Insights */}
          <div className="grid grid-cols-2 gap-6">
            {/* Velocity Trend */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Pipeline Velocity</h3>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>How is this calculated?</span>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="week" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" key="yaxis-left-vel" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" key="yaxis-right-vel" orientation="right" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar key="bar-openDeals" yAxisId="left" dataKey="openDeals" fill="#DBEAFE" name="Open Deals" radius={[4, 4, 0, 0]} />
                  <Bar key="bar-wonDeals" yAxisId="left" dataKey="wonDeals" fill="#10B981" name="Won Deals" radius={[4, 4, 0, 0]} />
                  <Line key="line-avgDays" yAxisId="right" type="monotone" dataKey="avgDays" stroke="#6366F1" strokeWidth={2} name="Avg Days to Close" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">AI Forecast Insights</h3>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">AI Suggestion</span>
              </div>
              <div className="space-y-3">
                {[
                  { type: "risk", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", title: "3 deals stalled at Negotiation", body: "Deals DL-0007, DL-0014, DL-0021 have had no activity for 12+ days. Recommended: AI follow-up call.", action: "Schedule AI Call" },
                  { type: "opportunity", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", title: "Strong Q2 pipeline (+₹8.4L)", body: "Q2 pipeline is 24% above Q1. Committed forecast at 68% of target.", action: "View Pipeline" },
                  { type: "info", icon: Info, color: "text-blue-500", bg: "bg-blue-50", title: "Seasonal trend: May closes fastest", body: "Historically, deals close 18% faster in May. Prioritize Negotiation-stage deals.", action: "See History" },
                ].map(insight => (
                  <div key={insight.title} className={`flex gap-3 p-3 ${insight.bg} rounded-lg`}>
                    <insight.icon className={`w-4 h-4 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{insight.body}</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors">Execute</button>
                      <button className="text-xs text-gray-400 hover:text-gray-600">Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
