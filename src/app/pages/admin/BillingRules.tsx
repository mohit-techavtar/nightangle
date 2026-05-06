import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  Zap, Plus, Edit, Trash2, CheckCircle, AlertTriangle,
  DollarSign, Clock, TrendingUp, Phone, MessageSquare,
  Mail, Database, Settings, Save
} from "lucide-react";

const billingRules = [
  {
    id: 1,
    name: "AI Calling - Per Minute Rate",
    service: "AI Calls",
    type: "usage-based",
    rate: 2.50,
    unit: "minute",
    minCharge: 1,
    roundingRule: "round-up",
    status: "active",
    lastUpdated: "2026-03-15"
  },
  {
    id: 2,
    name: "WhatsApp - Per Message",
    service: "WhatsApp",
    type: "usage-based",
    rate: 0.45,
    unit: "message",
    minCharge: null,
    roundingRule: "exact",
    status: "active",
    lastUpdated: "2026-03-15"
  },
  {
    id: 3,
    name: "SMS - Per Unit",
    service: "SMS",
    type: "usage-based",
    rate: 0.35,
    unit: "SMS",
    minCharge: null,
    roundingRule: "exact",
    status: "active",
    lastUpdated: "2026-03-15"
  },
  {
    id: 4,
    name: "Email - Bulk Pricing",
    service: "Email",
    type: "tiered",
    tiers: [
      { from: 0, to: 10000, rate: 0.20 },
      { from: 10001, to: 50000, rate: 0.15 },
      { from: 50001, to: null, rate: 0.10 },
    ],
    unit: "email",
    status: "active",
    lastUpdated: "2026-03-20"
  },
  {
    id: 5,
    name: "Storage - Per GB",
    service: "Storage",
    type: "usage-based",
    rate: 20.00,
    unit: "GB",
    minCharge: 10,
    roundingRule: "round-up",
    status: "active",
    lastUpdated: "2026-03-15"
  },
  {
    id: 6,
    name: "Enterprise License",
    service: "License",
    type: "flat-rate",
    rate: 2433.00,
    unit: "month",
    minCharge: null,
    status: "active",
    lastUpdated: "2026-03-01"
  },
];

const overagePolicies = [
  {
    id: 1,
    name: "AI Calls - Hard Limit at 150%",
    service: "AI Calls",
    limitType: "hard-limit",
    threshold: 150,
    action: "block-service",
    notification: true,
    status: "active"
  },
  {
    id: 2,
    name: "Storage - Soft Warning at 90%",
    service: "Storage",
    limitType: "soft-warning",
    threshold: 90,
    action: "send-alert",
    notification: true,
    status: "active"
  },
  {
    id: 3,
    name: "WhatsApp - Auto Top-up at 80%",
    service: "WhatsApp",
    limitType: "auto-topup",
    threshold: 80,
    action: "auto-purchase",
    notification: true,
    status: "active"
  },
];

const paymentTerms = [
  {
    id: 1,
    name: "Net 15 - Standard Terms",
    description: "Payment due within 15 days",
    dueDays: 15,
    lateFee: 2.5,
    gracePeriod: 3,
    isDefault: true,
    status: "active"
  },
  {
    id: 2,
    name: "Net 30 - Extended Terms",
    description: "Payment due within 30 days",
    dueDays: 30,
    lateFee: 1.5,
    gracePeriod: 5,
    isDefault: false,
    status: "active"
  },
  {
    id: 3,
    name: "Immediate - Prepaid Only",
    description: "Payment required upfront",
    dueDays: 0,
    lateFee: 0,
    gracePeriod: 0,
    isDefault: false,
    status: "active"
  },
];

export function BillingRules() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'rates' | 'overage' | 'terms'>('rates');

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing", onClick: () => navigate("/admin/billing") },
          { label: "Billing Rules" }
        ]}
        companyName="OmniCRM Platform"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Billing Rules & Policies</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Configure billing rates, overage policies, and payment terms
              </p>
            </div>
            <button
              className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Rule
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="border-b border-[#E5E7EB]">
              <div className="flex gap-1 p-2">
                <button
                  onClick={() => setActiveTab('rates')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'rates'
                      ? 'bg-[#E3F2FD] text-[#1565C0]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  Billing Rates
                </button>
                <button
                  onClick={() => setActiveTab('overage')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'overage'
                      ? 'bg-[#E3F2FD] text-[#1565C0]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  Overage Policies
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'terms'
                      ? 'bg-[#E3F2FD] text-[#1565C0]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  Payment Terms
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Billing Rates Tab */}
              {activeTab === 'rates' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-[#6B7280]">
                      Configure per-service billing rates and calculation rules
                    </p>
                  </div>

                  <div className="space-y-3">
                    {billingRules.map((rule) => (
                      <div key={rule.id} className="p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-[#0F1B2D]">{rule.name}</h3>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                rule.status === 'active'
                                  ? 'bg-[#D1FAE5] text-[#065F46]'
                                  : 'bg-[#F3F4F6] text-[#374151]'
                              }`}>
                                {rule.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-6">
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Service</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">{rule.service}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Type</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">
                                  {rule.type === 'usage-based' ? 'Usage-Based' : 
                                   rule.type === 'tiered' ? 'Tiered Pricing' : 'Flat Rate'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Rate</p>
                                <p className="text-sm font-medium text-[#1565C0]">
                                  {rule.type === 'tiered' ? 'Variable' : `₹${rule.rate}/${rule.unit}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Last Updated</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">{rule.lastUpdated}</p>
                              </div>
                            </div>
                            {rule.minCharge && (
                              <div className="mt-3 p-3 bg-white rounded border border-[#E5E7EB]">
                                <p className="text-xs text-[#6B7280]">
                                  Minimum Charge: {rule.minCharge} {rule.unit}(s) • Rounding: {rule.roundingRule}
                                </p>
                              </div>
                            )}
                            {rule.type === 'tiered' && rule.tiers && (
                              <div className="mt-3 p-3 bg-white rounded border border-[#E5E7EB]">
                                <p className="text-xs font-medium text-[#0F1B2D] mb-2">Tiered Pricing</p>
                                <div className="space-y-1">
                                  {rule.tiers.map((tier, idx) => (
                                    <p key={idx} className="text-xs text-[#6B7280]">
                                      {tier.from.toLocaleString()} - {tier.to ? tier.to.toLocaleString() : '∞'}: ₹{tier.rate}/{rule.unit}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-[#1565C0] hover:bg-[#E3F2FD] rounded transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overage Policies Tab */}
              {activeTab === 'overage' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-[#6B7280]">
                      Define overage thresholds and automated actions
                    </p>
                  </div>

                  <div className="space-y-3">
                    {overagePolicies.map((policy) => (
                      <div key={policy.id} className="p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-[#0F1B2D]">{policy.name}</h3>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                policy.status === 'active'
                                  ? 'bg-[#D1FAE5] text-[#065F46]'
                                  : 'bg-[#F3F4F6] text-[#374151]'
                              }`}>
                                {policy.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-6">
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Service</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">{policy.service}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Limit Type</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">
                                  {policy.limitType === 'hard-limit' ? 'Hard Limit' :
                                   policy.limitType === 'soft-warning' ? 'Soft Warning' : 'Auto Top-up'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Threshold</p>
                                <p className="text-sm font-medium text-[#F59E0B]">{policy.threshold}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Action</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">
                                  {policy.action === 'block-service' ? 'Block Service' :
                                   policy.action === 'send-alert' ? 'Send Alert' : 'Auto Purchase'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              {policy.notification && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#E3F2FD] text-[#1565C0] rounded text-xs font-medium">
                                  <CheckCircle size={12} />
                                  Email Notifications Enabled
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-[#1565C0] hover:bg-[#E3F2FD] rounded transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#92400E] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#92400E]">Important: Overage Policy Enforcement</p>
                      <p className="text-xs text-[#92400E] mt-1">
                        Hard limits will immediately block service access when thresholds are reached. Ensure tenants are notified before enabling.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Terms Tab */}
              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-[#6B7280]">
                      Configure payment terms, due dates, and late fee policies
                    </p>
                  </div>

                  <div className="space-y-3">
                    {paymentTerms.map((term) => (
                      <div key={term.id} className="p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-[#0F1B2D]">{term.name}</h3>
                              {term.isDefault && (
                                <span className="px-2.5 py-1 bg-[#E3F2FD] text-[#1565C0] rounded-full text-xs font-medium">
                                  Default
                                </span>
                              )}
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                term.status === 'active'
                                  ? 'bg-[#D1FAE5] text-[#065F46]'
                                  : 'bg-[#F3F4F6] text-[#374151]'
                              }`}>
                                {term.status}
                              </span>
                            </div>
                            <p className="text-sm text-[#6B7280] mb-4">{term.description}</p>
                            <div className="grid grid-cols-4 gap-6">
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Payment Due</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">
                                  {term.dueDays === 0 ? 'Immediate' : `${term.dueDays} days`}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Late Fee</p>
                                <p className="text-sm font-medium text-[#DC2626]">
                                  {term.lateFee}% per month
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Grace Period</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">
                                  {term.gracePeriod} days
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6B7280] mb-1">Action After Grace</p>
                                <p className="text-sm font-medium text-[#0F1B2D]">
                                  Service Suspension
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-[#1565C0] hover:bg-[#E3F2FD] rounded transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#E3F2FD] border border-[#1565C0] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1565C0] rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F1B2D] mb-2">Billing Rules Best Practices</h3>
                <ul className="text-sm text-[#6B7280] space-y-1">
                  <li>• Review and update billing rates quarterly to match market conditions</li>
                  <li>• Set soft warnings before hard limits to prevent service disruption</li>
                  <li>• Enable auto-topup for high-value customers to ensure continuous service</li>
                  <li>• Communicate rate changes to tenants at least 30 days in advance</li>
                  <li>• Monitor overage policies regularly to prevent revenue leakage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
