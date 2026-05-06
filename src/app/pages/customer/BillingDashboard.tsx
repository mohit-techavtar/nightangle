import { useState } from "react";
import { useNavigate } from "react-router";
import { useBilling } from "../../hooks/useBilling";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
  Clock,
  FileText,
  Plus,
  Download,
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap,
  Activity
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function BillingDashboard() {
  const navigate = useNavigate();
  const { getBalanceByTenant, getInvoicesByTenant, getAlertsByTenant, getTransactionsByTenant, markAlertRead } = useBilling();

  const tenantId = "tenant-1"; // Get from auth context
  const balance = getBalanceByTenant(tenantId);
  const invoices = getInvoicesByTenant(tenantId);
  const alerts = getAlertsByTenant(tenantId).filter(a => !a.read);
  const recentTransactions = getTransactionsByTenant(tenantId).slice(0, 5);

  const usageData = [
    { date: "Apr 15", credits: 234, cost: 23.40 },
    { date: "Apr 16", credits: 312, cost: 31.20 },
    { date: "Apr 17", credits: 289, cost: 28.90 },
    { date: "Apr 18", credits: 401, cost: 40.10 },
    { date: "Apr 19", credits: 356, cost: 35.60 },
    { date: "Apr 20", credits: 423, cost: 42.30 },
    { date: "Apr 21", credits: 378, cost: 37.80 },
  ];

  const creditUsagePercentage = balance ? (balance.usedCredits / balance.totalCredits) * 100 : 0;
  const remainingPercentage = balance ? (balance.remainingCredits / balance.totalCredits) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "low": return "text-yellow-600 bg-yellow-100";
      case "depleted": return "text-red-600 bg-red-100";
      case "suspended": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (!balance) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Billing Information</h2>
          <p className="text-gray-600 mb-6">Unable to load billing information</p>
          <button
            onClick={() => navigate("/tenant/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Billing & Usage</h1>
            <p className="text-sm text-gray-500 mt-1">Manage credits, view invoices, and track usage</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/tenant/billing/invoices")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              All Invoices
            </button>
            <button
              onClick={() => navigate("/tenant/billing/purchase")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Purchase Credits
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    alert.severity === "critical"
                      ? "bg-red-50 border-red-200"
                      : alert.severity === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 mt-0.5 ${
                      alert.severity === "critical"
                        ? "text-red-600"
                        : alert.severity === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <h3
                      className={`font-medium mb-1 ${
                        alert.severity === "critical"
                          ? "text-red-900"
                          : alert.severity === "warning"
                          ? "text-yellow-900"
                          : "text-blue-900"
                      }`}
                    >
                      {alert.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        alert.severity === "critical"
                          ? "text-red-700"
                          : alert.severity === "warning"
                          ? "text-yellow-700"
                          : "text-blue-700"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                  {alert.actionUrl && (
                    <button
                      onClick={() => {
                        markAlertRead(alert.id);
                        navigate(alert.actionUrl);
                      }}
                      className={`px-3 py-1.5 rounded text-sm font-medium ${
                        alert.severity === "critical"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : alert.severity === "warning"
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Take Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Credit Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(balance.status)}`}>
                  {balance.status.charAt(0).toUpperCase() + balance.status.slice(1)}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{balance.remainingCredits.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Available Credits</div>
              <div className="text-xs text-gray-400 mt-2">{remainingPercentage.toFixed(1)}% of total</div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{balance.totalCredits.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Total Credits</div>
              <div className="text-xs text-gray-400 mt-2">Purchased to date</div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{balance.usedCredits.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Credits Used</div>
              <div className="text-xs text-gray-400 mt-2">{creditUsagePercentage.toFixed(1)}% utilized</div>
            </div>

            <div className="bg-white rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {balance.currency} {(balance.remainingCredits / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Credit Value</div>
              <div className="text-xs text-gray-400 mt-2">@ $0.01 per credit</div>
            </div>
          </div>

          {/* Usage Trend Chart */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Credit Usage Trend</h2>
                <p className="text-sm text-gray-500 mt-1">Daily credit consumption over the last 7 days</p>
              </div>
              <button
                onClick={() => navigate("/tenant/billing/usage")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="credits" stroke="#3B82F6" strokeWidth={2} name="Credits Used" />
                <Line type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={2} name="Cost ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Invoices */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
                <button
                  onClick={() => navigate("/tenant/billing/invoices")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {invoices.slice(0, 3).map((invoice) => (
                  <div
                    key={invoice.id}
                    onClick={() => navigate(`/tenant/billing/invoices/${invoice.id}`)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(invoice.billingPeriodStart).toLocaleDateString()} -{" "}
                          {new Date(invoice.billingPeriodEnd).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {invoice.currency} {invoice.total.toFixed(2)}
                        </div>
                        <span
                          className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : invoice.status === "overdue"
                              ? "bg-red-100 text-red-700"
                              : invoice.status === "issued"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{invoice.totalMinutes.toLocaleString()} minutes</span>
                      <span>•</span>
                      <span>{invoice.totalCredits.toLocaleString()} credits</span>
                    </div>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <div className="py-8 text-center text-gray-500 text-sm">No invoices yet</div>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <button
                  onClick={() => navigate("/tenant/billing/transactions")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            transaction.type === "purchase" || transaction.type === "bonus"
                              ? "bg-green-100"
                              : transaction.type === "refund"
                              ? "bg-blue-100"
                              : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "purchase" || transaction.type === "bonus" ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : transaction.type === "refund" ? (
                            <TrendingDown className="w-4 h-4 text-blue-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{transaction.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">{transaction.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <div className="py-8 text-center text-gray-500 text-sm">No transactions yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => navigate("/tenant/billing/purchase")}
                className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all text-left"
              >
                <Plus className="w-5 h-5 text-blue-600 mb-2" />
                <div className="font-medium text-gray-900 text-sm">Purchase Credits</div>
                <div className="text-xs text-gray-500 mt-1">Add credits to your balance</div>
              </button>

              <button
                onClick={() => navigate("/tenant/billing/usage")}
                className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all text-left"
              >
                <Activity className="w-5 h-5 text-purple-600 mb-2" />
                <div className="font-medium text-gray-900 text-sm">Usage Details</div>
                <div className="text-xs text-gray-500 mt-1">View detailed usage logs</div>
              </button>

              <button
                onClick={() => navigate("/tenant/billing/invoices")}
                className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all text-left"
              >
                <FileText className="w-5 h-5 text-green-600 mb-2" />
                <div className="font-medium text-gray-900 text-sm">All Invoices</div>
                <div className="text-xs text-gray-500 mt-1">Download past invoices</div>
              </button>

              <button
                onClick={() => navigate("/tenant/billing/settings")}
                className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all text-left"
              >
                <Zap className="w-5 h-5 text-orange-600 mb-2" />
                <div className="font-medium text-gray-900 text-sm">Alert Settings</div>
                <div className="text-xs text-gray-500 mt-1">Configure billing alerts</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
