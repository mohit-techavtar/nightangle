import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  CreditCard, Plus, Trash2, CheckCircle2, Shield, AlertCircle,
  Building2, Smartphone, Globe, Lock, Edit3, Star, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  label: string;
  detail: string;
  isDefault: boolean;
  brand?: string;
  expiry?: string;
  bank?: string;
  status: 'active' | 'expired';
}

const mockMethods: PaymentMethod[] = [
  { id: "PM-001", type: "card", label: "HDFC Credit Card", detail: "•••• •••• •••• 4567", isDefault: true, brand: "Visa", expiry: "09/26", status: "active" },
  { id: "PM-002", type: "card", label: "ICICI Debit Card", detail: "•••• •••• •••• 1234", isDefault: false, brand: "Mastercard", expiry: "03/25", status: "active" },
  { id: "PM-003", type: "upi", label: "Google Pay UPI", detail: "rajesh@okicici", isDefault: false, status: "active" },
  { id: "PM-004", type: "netbanking", label: "SBI Net Banking", detail: "State Bank of India", isDefault: false, bank: "SBI", status: "active" },
];

export function PaymentMethods() {
  const [methods, setMethods] = useState(mockMethods);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'card' | 'upi' | 'netbanking'>('card');

  const setDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    toast.success("Default payment method updated");
  };

  const remove = (id: string) => {
    const method = methods.find(m => m.id === id);
    if (method?.isDefault) { toast.error("Cannot remove default payment method"); return; }
    setMethods(prev => prev.filter(m => m.id !== id));
    toast.success("Payment method removed");
  };

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'card') return <CreditCard className="w-5 h-5 text-blue-600" />;
    if (type === 'upi') return <Smartphone className="w-5 h-5 text-green-600" />;
    return <Building2 className="w-5 h-5 text-purple-600" />;
  };

  const TypeBg = ({ type }: { type: string }) => {
    const bg = type === 'card' ? 'bg-blue-50' : type === 'upi' ? 'bg-green-50' : 'bg-purple-50';
    return <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}><TypeIcon type={type} /></div>;
  };

  return (
    <>
      <TopBar
        breadcrumbs={[{ label: "Billing" }, { label: "Payment Methods" }]}
        companyName="TechAvtar India Pvt Ltd"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 max-w-3xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Payment Methods</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your saved payment options for credit top-ups</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </button>
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Payment Processing</p>
              <p className="text-xs text-blue-700 mt-0.5">All payment data is encrypted and processed via Razorpay/Stripe. We never store full card details. PCI DSS compliant.</p>
            </div>
          </div>

          {/* Saved Methods */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Saved Payment Methods ({methods.length})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {methods.map(method => (
                <div key={method.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <TypeBg type={method.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{method.label}</p>
                      {method.isDefault && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" /> Default
                        </span>
                      )}
                      {method.status === 'expired' && (
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Expired
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{method.detail}</p>
                    {method.expiry && <p className="text-xs text-gray-400">Expires {method.expiry}</p>}
                    {method.brand && <p className="text-xs text-gray-400">{method.brand}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => setDefault(method.id)}
                        className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                      >
                        Set Default
                      </button>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(method.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Method Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Add Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'card' as const, icon: CreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', color: 'text-blue-600', bg: 'bg-blue-50' },
                { type: 'upi' as const, icon: Smartphone, label: 'UPI', desc: 'GPay, PhonePe, Paytm, BHIM', color: 'text-green-600', bg: 'bg-green-50' },
                { type: 'netbanking' as const, icon: Building2, label: 'Net Banking', desc: 'SBI, HDFC, ICICI, Axis', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(option => (
                <button
                  key={option.type}
                  onClick={() => { setAddType(option.type); setShowAddModal(true); }}
                  className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all text-center group"
                >
                  <div className={`w-12 h-12 ${option.bg} rounded-xl flex items-center justify-center`}>
                    <option.icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Billing Address</h2>
              <button className="text-sm text-blue-600 hover:underline">Edit</button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">TechAvtar India Pvt Ltd</p>
              <p>4th Floor, Platina, Bandra Kurla Complex</p>
              <p>Mumbai, Maharashtra 400051</p>
              <p>India · GSTIN: 27AABCT1332L1ZV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Add {addType === 'card' ? 'Card' : addType === 'upi' ? 'UPI ID' : 'Net Banking'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {addType === 'card' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Card Number *</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Expiry *</label>
                      <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">CVV *</label>
                      <input type="password" placeholder="•••" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={4} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cardholder Name *</label>
                    <input type="text" placeholder="Name on card" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}
              {addType === 'upi' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">UPI ID *</label>
                  <input type="text" placeholder="yourname@okicici" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-500 mt-1">Format: name@bank or mobile@upi</p>
                </div>
              )}
              {addType === 'netbanking' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Select Bank *</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Set as default payment method
              </label>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Secured by 256-bit TLS encryption via Razorpay</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 text-sm text-gray-600 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={() => { setShowAddModal(false); toast.success("Payment method added successfully!"); }}
                className="flex-1 text-sm bg-blue-600 text-white rounded-lg py-2.5 hover:bg-blue-700 transition-colors font-medium"
              >
                Save & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
