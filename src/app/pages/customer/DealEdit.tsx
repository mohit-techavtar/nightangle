import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Save, X, Plus, Trash2, ChevronDown, AlertTriangle, CheckCircle2,
  IndianRupee, Calendar, User, Target, Percent, FileText, Link,
  Info, ArrowLeft, Loader2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useOmniStore } from "../../store/index";

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

const stages = ["Qualification", "Needs Analysis", "Proposal Sent", "Negotiation", "Won", "Lost"];
const pipelines = ["Sales Pipeline", "Enterprise Pipeline", "Renewal Pipeline"];
const stageProbability: Record<string, number> = {
  "Qualification": 20, "Needs Analysis": 40, "Proposal Sent": 60, "Negotiation": 80, "Won": 100, "Lost": 0
};
const lossReasons = ["Budget Constraint", "Competitor Selected", "No Decision", "Timeline Mismatch", "Feature Gap", "Internal Factors"];
const winsReasons = ["Best Value", "Relationship", "Superior Features", "Timeline Fit", "Reference Customer", "Price"];

const fmt = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

export function DealEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dealId = searchParams.get("id");
  const { deals, updateDeal, users, leads } = useOmniStore(s => ({ deals: s.deals, updateDeal: s.updateDeal, users: s.users, leads: s.leads }));

  const existingDeal = dealId ? deals.find(d => d.id === dealId) : null;
  const isNew = !existingDeal;

  const [saving, setSaving] = useState(false);
  const [showApprovalWarning, setShowApprovalWarning] = useState(false);

  const [form, setForm] = useState({
    name: existingDeal?.name ?? "",
    amount: existingDeal?.amount ?? 0,
    stage: existingDeal?.stage ?? "Qualification",
    pipeline: existingDeal?.pipeline ?? "Sales Pipeline",
    closeDate: existingDeal?.closeDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    probability: existingDeal?.probability ?? 20,
    ownerId: existingDeal?.ownerId ?? "USR-002",
    leadId: existingDeal?.leadId ?? "",
    discountPercent: existingDeal?.discountPercent ?? 0,
    closeReason: existingDeal?.closeReason ?? "",
    requiresApproval: existingDeal?.requiresApproval ?? false,
    notes: "",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>(
    existingDeal?.lineItems?.length
      ? existingDeal.lineItems.map(li => ({ ...li }))
      : [{ id: "li-1", name: "CRM License (Annual)", quantity: 10, unitPrice: 15000, discount: 0, total: 150000 }]
  );

  // Approval trigger
  useEffect(() => {
    setShowApprovalWarning(form.discountPercent > 20);
    setForm(prev => ({ ...prev, requiresApproval: prev.discountPercent > 20 }));
  }, [form.discountPercent]);

  // Auto-probability from stage
  const handleStageChange = (stage: string) => {
    setForm(prev => ({ ...prev, stage, probability: stageProbability[stage] ?? prev.probability }));
  };

  // Line item helpers
  const calcLineTotal = (li: LineItem) => li.quantity * li.unitPrice * (1 - li.discount / 100);
  const subtotal = lineItems.reduce((sum, li) => sum + calcLineTotal(li), 0);
  const discountAmt = subtotal * (form.discountPercent / 100);
  const netAmount = subtotal - discountAmt;
  const gstAmt = netAmount * 0.18;
  const totalWithGST = netAmount + gstAmt;

  const addLineItem = () => {
    setLineItems(prev => [...prev, {
      id: `li-${Date.now()}`, name: "", quantity: 1, unitPrice: 0, discount: 0, total: 0
    }]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(li => {
      if (li.id !== id) return li;
      const updated = { ...li, [field]: value };
      updated.total = calcLineTotal(updated);
      return updated;
    }));
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) { toast.error("At least one line item required"); return; }
    setLineItems(prev => prev.filter(li => li.id !== id));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Deal name is required"); return; }
    if (!form.closeDate) { toast.error("Close date is required"); return; }
    if (form.closeDate < new Date().toISOString().split("T")[0] && form.stage !== "Won" && form.stage !== "Lost") {
      toast.error("Close date cannot be in the past for open deals");
      return;
    }
    if (form.discountPercent > 20 && !form.requiresApproval) {
      toast.error("Discounts > 20% require manager approval");
      return;
    }

    setSaving(true);
    const data = {
      ...form,
      amount: netAmount,
      lineItems: lineItems.map(li => ({ ...li, total: calcLineTotal(li) })),
    };
    await updateDeal(existingDeal?.id ?? "", data);
    setSaving(false);
    navigate("/tenant/deals/list");
  };

  const tenantUsers = users.filter(u => u.status === "Active");
  const openLeads = leads.filter(l => l.status !== "Converted");

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "CRM" },
          { label: "Deals", path: "/tenant/deals" },
          { label: isNew ? "New Deal" : `Edit: ${existingDeal?.name ?? "Deal"}` }
        ]}
        companyName="TechAvtar India Pvt Ltd"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:bg-white hover:text-gray-700 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{isNew ? "Create New Deal" : "Edit Deal"}</h1>
                {existingDeal && <p className="text-xs text-gray-500 mt-0.5">{existingDeal.id}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Deal"}
              </button>
            </div>
          </div>

          {/* Approval warning */}
          {showApprovalWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">Manager Approval Required</p>
                <p className="text-xs text-amber-700 mt-0.5">Discounts exceeding 20% require approval from your manager before this deal can be marked as Won. Deal will be saved as "Pending Approval".</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium flex-shrink-0">Pending Approval</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-5">
            {/* Left — Main Form */}
            <div className="col-span-2 space-y-5">
              {/* Deal Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Deal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Deal Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., TCS Enterprise CRM License Q2 2025"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Pipeline *</label>
                      <select value={form.pipeline} onChange={e => setForm(prev => ({ ...prev, pipeline: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {pipelines.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Stage *</label>
                      <select value={form.stage} onChange={e => handleStageChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {stages.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Close Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={form.closeDate}
                          onChange={e => setForm(prev => ({ ...prev, closeDate: e.target.value }))}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                        Win Probability
                        <span className="text-xs text-gray-400">(auto from stage)</span>
                      </label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min={0} max={100}
                          value={form.probability}
                          onChange={e => setForm(prev => ({ ...prev, probability: Number(e.target.value) }))}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  {(form.stage === "Won" || form.stage === "Lost") && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {form.stage === "Won" ? "Win Reason" : "Loss Reason"} *
                      </label>
                      <select value={form.closeReason} onChange={e => setForm(prev => ({ ...prev, closeReason: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select reason…</option>
                        {(form.stage === "Won" ? winsReasons : lossReasons).map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    Line Items
                  </h2>
                  <button onClick={addLineItem} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">Item / Description</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-20">Qty</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-28">Unit Price (₹)</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-20">Disc %</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-28">Total (₹)</th>
                        <th className="w-8 px-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((li, idx) => (
                        <tr key={li.id} className={`${idx < lineItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={li.name}
                              onChange={e => updateLineItem(li.id, "name", e.target.value)}
                              placeholder="Item name"
                              className="w-full text-sm focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={1}
                              value={li.quantity}
                              onChange={e => updateLineItem(li.id, "quantity", Number(e.target.value))}
                              className="w-full text-sm text-right focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              value={li.unitPrice}
                              onChange={e => updateLineItem(li.id, "unitPrice", Number(e.target.value))}
                              className="w-full text-sm text-right focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0} max={100}
                              value={li.discount}
                              onChange={e => updateLineItem(li.id, "discount", Number(e.target.value))}
                              className="w-full text-sm text-right focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                            {fmt(calcLineTotal(li))}
                          </td>
                          <td className="px-2 py-2">
                            <button onClick={() => removeLineItem(li.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-4 flex justify-end">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>Additional Discount</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0} max={100}
                            value={form.discountPercent}
                            onChange={e => setForm(prev => ({ ...prev, discountPercent: Number(e.target.value) }))}
                            className="w-14 text-xs border border-gray-200 rounded px-1.5 py-0.5 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="text-xs">%</span>
                        </div>
                        {form.discountPercent > 20 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                      <span className="text-red-500">-{fmt(discountAmt)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-2">
                      <span>Net Amount</span>
                      <span>{fmt(netAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>GST @ 18% (IGST — Inter-state)</span>
                      <span>{fmt(gstAmt)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
                      <span>Total (Incl. GST)</span>
                      <span className="text-blue-600">{fmt(totalWithGST)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Internal Notes</h2>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any internal notes, context, or next steps..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Right — Sidebar */}
            <div className="space-y-5">
              {/* Assignment */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  Assignment
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Deal Owner *</label>
                    <select value={form.ownerId} onChange={e => setForm(prev => ({ ...prev, ownerId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {tenantUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-1"><Link className="w-3.5 h-3.5" /> Linked Lead</span>
                    </label>
                    <select value={form.leadId} onChange={e => setForm(prev => ({ ...prev, leadId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">No linked lead</option>
                      {openLeads.slice(0, 20).map(l => (
                        <option key={l.id} value={l.id}>{l.fullName} — {l.company}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white">
                <p className="text-xs text-blue-200 mb-1">Deal Value (Net + GST)</p>
                <p className="text-2xl font-bold">{fmt(totalWithGST)}</p>
                <div className="mt-3 pt-3 border-t border-blue-500/50 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Stage</span>
                    <span className="font-medium">{form.stage}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Probability</span>
                    <span className="font-medium">{form.probability}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Weighted Value</span>
                    <span className="font-medium">{fmt(netAmount * form.probability / 100)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Close Date</span>
                    <span className="font-medium">{form.closeDate ? new Date(form.closeDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
                  </div>
                </div>
                {form.requiresApproval && (
                  <div className="mt-3 pt-3 border-t border-blue-500/50 flex items-center gap-2 text-xs text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    Requires manager approval
                  </div>
                )}
              </div>

              {/* Pipeline stage tracker */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Pipeline Progress</h3>
                <div className="space-y-1.5">
                  {stages.slice(0, 5).map((stage, i) => {
                    const currentIdx = stages.indexOf(form.stage);
                    const isActive = stage === form.stage;
                    const isDone = i < currentIdx && form.stage !== "Lost";
                    return (
                      <button
                        key={stage}
                        onClick={() => handleStageChange(stage)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                          isActive ? "bg-blue-50 border border-blue-200 text-blue-700 font-medium" :
                          isDone ? "text-green-700 hover:bg-green-50" :
                          "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                          isActive ? "bg-blue-600 text-white" :
                          isDone ? "bg-green-500 text-white" :
                          "bg-gray-200 text-gray-500"
                        }`}>
                          {isDone ? "✓" : i + 1}
                        </div>
                        <span>{stage}</span>
                        <span className="ml-auto text-xs text-gray-400">{stageProbability[stage]}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-600">Compliance Checks</p>
                {[
                  { label: "GSTIN verified", ok: true },
                  { label: "Discount within limit", ok: form.discountPercent <= 20 },
                  { label: "Close date valid", ok: form.closeDate >= new Date().toISOString().split("T")[0] || form.stage === "Won" || form.stage === "Lost" },
                  { label: "Owner assigned", ok: !!form.ownerId },
                ].map(check => (
                  <div key={check.label} className="flex items-center gap-2 text-xs">
                    {check.ok
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      : <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className={check.ok ? "text-gray-600" : "text-red-600"}>{check.label}</span>
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
