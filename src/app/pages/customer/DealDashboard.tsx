import { useState } from "react";
import { useNavigate } from "react-router";
import { useDeals } from "../../hooks/useDeals";
import {
  TrendingUp,
  DollarSign,
  Target,
  Plus,
  Filter,
  Download,
  Calendar,
  Users,
  Percent,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  TrendingDown,
  Settings,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function DealDashboard() {
  const navigate = useNavigate();
  const { deals, pipelines, getForecastData, getWinLossAnalysis, getDealVelocity } = useDeals();

  const [selectedPipeline, setSelectedPipeline] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"month" | "quarter" | "year">("quarter");

  // Calculate key metrics
  const openDeals = deals.filter(d => d.status === "open");
  const wonDeals = deals.filter(d => d.status === "won");
  const lostDeals = deals.filter(d => d.status === "lost");

  const totalPipelineValue = openDeals.reduce((sum, d) => sum + d.estimatedValue, 0);
  const weightedPipelineValue = openDeals.reduce((sum, d) => sum + (d.estimatedValue * d.probability / 100), 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + (d.actualValue || d.estimatedValue), 0);
  const winRate = (wonDeals.length + lostDeals.length) > 0
    ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
    : 0;

  // Forecast data
  const forecastData = getForecastData(selectedPipeline !== "all" ? selectedPipeline : undefined);

  // Win/Loss Analysis
  const winLossData = getWinLossAnalysis(selectedPipeline !== "all" ? selectedPipeline : undefined);

  // Deal Velocity
  const velocityData = getDealVelocity(selectedPipeline !== "all" ? selectedPipeline : undefined);

  // Pipeline breakdown
  const pipelineBreakdown = pipelines.map(pipeline => {
    const pipelineDeals = openDeals.filter(d => d.pipelineId === pipeline.id);
    return {
      name: pipeline.name,
      count: pipelineDeals.length,
      value: pipelineDeals.reduce((sum, d) => sum + d.estimatedValue, 0),
    };
  });

  // Stage breakdown for selected pipeline
  const getStageBreakdown = () => {
    const pipeline = selectedPipeline !== "all"
      ? pipelines.find(p => p.id === selectedPipeline)
      : pipelines[0];

    if (!pipeline) return [];

    return pipeline.stages
      .filter(s => s.probability > 0 && s.probability < 100)
      .map(stage => {
        const stageDeals = openDeals.filter(d => d.pipelineId === pipeline.id && d.stageId === stage.id);
        return {
          stage: stage.name,
          count: stageDeals.length,
          value: stageDeals.reduce((sum, d) => sum + d.estimatedValue, 0),
          color: stage.color,
        };
      });
  };

  const stageBreakdown = getStageBreakdown();

  // Deal type breakdown
  const dealTypeBreakdown = [
    { name: "New Business", value: openDeals.filter(d => d.dealType === "new-business").reduce((s, d) => s + d.estimatedValue, 0), color: "#3b82f6" },
    { name: "Renewal", value: openDeals.filter(d => d.dealType === "renewal").reduce((s, d) => s + d.estimatedValue, 0), color: "#10b981" },
    { name: "Upsell", value: openDeals.filter(d => d.dealType === "upsell").reduce((s, d) => s + d.estimatedValue, 0), color: "#f59e0b" },
    { name: "Cross-sell", value: openDeals.filter(d => d.dealType === "cross-sell").reduce((s, d) => s + d.estimatedValue, 0), color: "#8b5cf6" },
  ].filter(item => item.value > 0);

  // At-risk deals (stalled > 7 days or low probability)
  const atRiskDeals = openDeals.filter(d =>
    d.aiInsights?.stalledDays && d.aiInsights.stalledDays > 7 ||
    d.probability < 30
  ).slice(0, 5);

  // Top opportunities
  const topOpportunities = openDeals
    .sort((a, b) => (b.estimatedValue * b.probability / 100) - (a.estimatedValue * a.probability / 100))
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Deal Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Revenue tracking and opportunity management</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tenant/deals/pipeline")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Pipeline View
            </button>
            <button
              onClick={() => alert("Exporting report...")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
            <button
              onClick={() => navigate("/tenant/deals/create")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New Deal
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <select
            value={selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Pipelines</option>
            {pipelines.map(pipeline => (
              <option key={pipeline.id} value={pipeline.id}>{pipeline.name}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <button className="ml-auto px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Customize Dashboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Open Pipeline</p>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalPipelineValue)}</p>
              <p className="text-sm text-gray-600">{openDeals.length} opportunities</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Weighted Pipeline</p>
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(weightedPipelineValue)}</p>
              <p className="text-sm text-gray-600">Probability-adjusted</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Won This Period</p>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(wonValue)}</p>
              <p className="text-sm text-gray-600">{wonDeals.length} deals closed</p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Win Rate</p>
                <Percent className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{winRate.toFixed(1)}%</p>
              <div className="flex items-center gap-1 text-sm">
                {winRate > 50 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={winRate > 50 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(winRate - 50).toFixed(1)}% vs 50%
                </span>
              </div>
            </div>
          </div>

          {/* Forecast and Pipeline Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Forecast */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Forecast</h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="committed" stroke="#10b981" strokeWidth={2} name="Committed" />
                  <Line type="monotone" dataKey="bestCase" stroke="#3b82f6" strokeWidth={2} name="Best Case" />
                  <Line type="monotone" dataKey="pipeline" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" name="Total Pipeline" />
                  <Line type="monotone" dataKey="closed" stroke="#22c55e" strokeWidth={3} name="Closed Won" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pipeline by Stage */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pipeline by Stage</h3>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stageBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="stage" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                    {stageBreakdown.map((entry) => (
                      <Cell key={`stage-${entry.stage}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Deal Type and Velocity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deal Type Distribution */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Deal Type Mix</h3>
                <PieChartIcon className="w-5 h-5 text-blue-600" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dealTypeBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dealTypeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Win/Loss Summary */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Win/Loss Analysis</h3>
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Won</span>
                    <span className="font-semibold text-green-600">{winLossData.totalWon} deals</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Total Value</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(winLossData.totalWonValue)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Lost</span>
                    <span className="font-semibold text-red-600">{winLossData.totalLost} deals</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Total Value</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(winLossData.totalLostValue)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Win Rate</span>
                    <span className="font-bold text-gray-900">{winLossData.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${winLossData.winRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deal Velocity */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Deal Velocity</h3>
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-gray-900 mb-2">{velocityData.averageDays}</p>
                <p className="text-gray-600 mb-4">days to close</p>
                <p className="text-sm text-gray-500">Based on {velocityData.totalDeals} won deals</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fastest</span>
                  <span className="font-semibold text-gray-900">
                    {Math.min(...velocityData.velocities, Infinity) !== Infinity ? Math.round(Math.min(...velocityData.velocities)) : 0} days
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Slowest</span>
                  <span className="font-semibold text-gray-900">
                    {Math.max(...velocityData.velocities, -Infinity) !== -Infinity ? Math.round(Math.max(...velocityData.velocities)) : 0} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Opportunities and At-Risk Deals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Opportunities */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Top Opportunities</h3>
                  <button
                    onClick={() => navigate("/tenant/deals/list")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y">
                {topOpportunities.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => navigate(`/tenant/deals/detail?id=${deal.id}`)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{deal.name}</h4>
                        <p className="text-sm text-gray-500">{deal.ownerName} • {deal.stageName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(deal.estimatedValue)}</p>
                        <p className="text-sm text-gray-500">{deal.probability}% prob</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* At-Risk Deals */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">At-Risk Deals</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                      {atRiskDeals.length}
                    </span>
                  </div>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="divide-y">
                {atRiskDeals.length > 0 ? (
                  atRiskDeals.map((deal) => (
                    <button
                      key={deal.id}
                      onClick={() => navigate(`/tenant/deals/detail?id=${deal.id}`)}
                      className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{deal.name}</h4>
                          <p className="text-sm text-gray-500">{deal.ownerName}</p>
                        </div>
                        <p className="font-semibold text-gray-900">{formatCurrency(deal.estimatedValue)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {deal.aiInsights?.stalledDays && deal.aiInsights.stalledDays > 7 && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                            Stalled {deal.aiInsights.stalledDays} days
                          </span>
                        )}
                        {deal.probability < 30 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            Low probability ({deal.probability}%)
                          </span>
                        )}
                      </div>
                      {deal.aiInsights?.nextBestAction && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-blue-600">
                          <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{deal.aiInsights.nextBestAction}</span>
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No at-risk deals</p>
                    <p className="text-sm text-gray-500 mt-1">All deals are on track!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
