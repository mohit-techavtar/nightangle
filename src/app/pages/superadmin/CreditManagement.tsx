import { useState } from "react";
import { useNavigate } from "react-router";
import { useBilling } from "../../hooks/useBilling";
import {
  CreditCard,
  Plus,
  Minus,
  Search,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  History,
  DollarSign,
  Users,
  Filter,
  ChevronDown,
} from "lucide-react";

export function CreditManagement() {
  const navigate = useNavigate();
  const { getBalanceByTenant, adjustCredits } = useBilling();

  const [selectedTenant, setSelectedTenant] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");
  const [creditAmount, setCreditAmount] = useState("");
  const [reason, setReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Mock tenant list
  const allTenants = [
    { id: "tenant-1", name: "Acme Corp", email: "admin@acme.com", status: "active", balance: 15000 },
    { id: "tenant-2", name: "TechStart Inc", email: "admin@techstart.com", status: "active", balance: 8500 },
    { id: "tenant-3", name: "Global Sales Ltd", email: "admin@globalsales.com", status: "trial", balance: 2000 },
    { id: "tenant-4", name: "Marketing Pro", email: "admin@marketingpro.com", status: "active", balance: 500 },
    { id: "tenant-5", name: "Sales Force Co", email: "admin@salesforce.com", status: "inactive", balance: 0 },
  ];

  const filteredTenants = allTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || tenant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedTenantData = allTenants.find(t => t.id === selectedTenant);
  const balance = selectedTenant ? getBalanceByTenant(selectedTenant) : null;

  // Mock audit log
  const auditLog = (balance?.transactions || [])
    .filter(t => t.type === "adjustment")
    .map(t => ({
      id: t.id,
      timestamp: t.timestamp,
      amount: t.amount,
      reason: t.description,
      adminUser: t.metadata?.adminUser || "admin@platform.com",
    }));

  const handleAdjustment = () => {
    if (!selectedTenant || !creditAmount || !reason) {
      alert("Please fill in all fields");
      return;
    }

    const amount = parseInt(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid credit amount");
      return;
    }

    const finalAmount = adjustmentType === "add" ? amount : -amount;
    const adjustmentId = `adj_${Date.now()}`;

    adjustCredits(
      selectedTenant,
      finalAmount,
      reason,
      "admin@platform.com"
    );

    setShowSuccess(true);
    setCreditAmount("");
    setReason("");

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/superadmin/billing")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Credit Management</h1>
              <p className="text-sm text-gray-500 mt-1">Adjust tenant credits with audit logging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Credits Adjusted Successfully</p>
                  <p className="text-sm text-green-700 mt-1">
                    {adjustmentType === "add" ? "Added" : "Deducted"} {creditAmount} credits {adjustmentType === "add" ? "to" : "from"} {selectedTenantData?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tenant Selection */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Tenant</h3>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tenants..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative mb-4">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">
                        {filterStatus === "all" ? "All Status" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showFilterMenu && (
                    <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
                      {["all", "active", "trial", "inactive"].map((status) => (
                        <button
                          key={status}
                          onClick={() => { setFilterStatus(status); setShowFilterMenu(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tenant List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => setSelectedTenant(tenant.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedTenant === tenant.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 text-sm">{tenant.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          tenant.status === "active"
                            ? "bg-green-100 text-green-700"
                            : tenant.status === "trial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {tenant.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{tenant.email}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Balance</span>
                        <span className={`font-medium ${
                          tenant.balance < 1000 ? "text-red-600" : "text-gray-900"
                        }`}>
                          {tenant.balance.toLocaleString()} credits
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {filteredTenants.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No tenants found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Adjustment Form */}
            <div className="lg:col-span-2 space-y-4">
              {selectedTenant && balance ? (
                <>
                  {/* Current Balance */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 mb-1">Current Balance</p>
                        <h2 className="text-4xl font-bold mb-1">{balance.remainingCredits.toLocaleString()}</h2>
                        <p className="text-blue-100">
                          {balance.currency} {(balance.remainingCredits / 100).toFixed(2)} value
                        </p>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <CreditCard className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Adjustment Form */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Adjustment</h3>

                    {/* Adjustment Type */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setAdjustmentType("add")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            adjustmentType === "add"
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Plus className={`w-6 h-6 mx-auto mb-2 ${
                            adjustmentType === "add" ? "text-green-600" : "text-gray-400"
                          }`} />
                          <p className="font-medium text-gray-900">Add Credits</p>
                        </button>
                        <button
                          onClick={() => setAdjustmentType("deduct")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            adjustmentType === "deduct"
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Minus className={`w-6 h-6 mx-auto mb-2 ${
                            adjustmentType === "deduct" ? "text-red-600" : "text-gray-400"
                          }`} />
                          <p className="font-medium text-gray-900">Deduct Credits</p>
                        </button>
                      </div>
                    </div>

                    {/* Credit Amount */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Credit Amount</label>
                      <div className="relative">
                        <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                          min="1"
                          step="1"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter amount"
                        />
                      </div>
                      {creditAmount && (
                        <p className="mt-2 text-sm text-gray-600">
                          Equivalent to <span className="font-semibold text-gray-900">
                            ${(parseInt(creditAmount) / 100).toFixed(2)} {balance.currency}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Reason */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Adjustment</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Enter reason for this adjustment (required for audit trail)"
                      />
                    </div>

                    {/* Warning */}
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-orange-900">
                          <p className="font-medium mb-1">Important Notice</p>
                          <p className="text-orange-800">
                            All credit adjustments are logged in the audit trail with your admin user ID and timestamp.
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleAdjustment}
                      disabled={!creditAmount || !reason}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        adjustmentType === "add"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {adjustmentType === "add" ? "Add Credits" : "Deduct Credits"}
                    </button>
                  </div>

                  {/* Audit Log */}
                  <div className="bg-white rounded-lg border">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <History className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Adjustment History</h3>
                        </div>
                        <button
                          onClick={() => setShowAuditLog(!showAuditLog)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {showAuditLog ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    {showAuditLog && (
                      <div className="overflow-x-auto">
                        {auditLog.length === 0 ? (
                          <div className="p-8 text-center">
                            <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No adjustment history</p>
                          </div>
                        ) : (
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Timestamp</th>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Admin User</th>
                                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Reason</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {auditLog.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-900">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{log.adminUser}</td>
                                  <td className="px-6 py-4 text-sm text-right">
                                    <span className={`font-medium ${
                                      log.amount > 0 ? "text-green-600" : "text-red-600"
                                    }`}>
                                      {log.amount > 0 ? "+" : ""}{log.amount.toLocaleString()}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{log.reason}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg border p-16 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Tenant</h3>
                  <p className="text-gray-600">Choose a tenant from the list to manage their credits</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
