import React, { useState } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { Save, CreditCard, DollarSign, Receipt, TrendingUp, AlertCircle, CheckCircle2, Building2 } from "lucide-react";

export function BillingPayments() {
  const [paymentGateways, setPaymentGateways] = useState({
    stripe: { enabled: true, publicKey: "pk_test_....", secretKey: "sk_test_...." },
    paypal: { enabled: false, clientId: "", clientSecret: "" },
    razorpay: { enabled: false, keyId: "", keySecret: "" },
  });

  const [billingConfig, setBillingConfig] = useState({
    currency: "NPR",
    taxRate: "13",
    invoicePrefix: "INV",
    invoiceNumbering: "sequential",
    paymentTerms: "net30",
    autoCharge: true,
    gracePeriod: "7",
    lateFeesEnabled: false,
    lateFeePercentage: "5",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const toggleGateway = (gateway: string) => {
    setPaymentGateways({
      ...paymentGateways,
      [gateway]: { ...paymentGateways[gateway], enabled: !paymentGateways[gateway].enabled }
    });
    handleChange();
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Settings" }, { label: "Billing & Payments" }]} mode="admin" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2">Billing & Payments</h2>
              <p className="text-sm text-[#616161]">Configure payment gateways and billing settings</p>
            </div>
            <div className="flex items-center gap-3">
              {showSuccess && (
                <div className="flex items-center gap-2 text-sm text-[#2E7D32] bg-[#E8F5E9] px-4 py-2 rounded-md">
                  <CheckCircle2 size={16} />
                  Changes saved
                </div>
              )}
              <button 
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="h-10 px-5 rounded-md bg-[#1565C0] text-white hover:bg-[#0D47A1] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {hasChanges && !showSuccess && (
            <div className="mb-4 p-3 bg-[#FFF8E1] border border-[#FFE082] rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-[#F57F17]" />
              <span className="text-[#616161]">You have unsaved changes</span>
            </div>
          )}

          {/* Payment Gateways */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Payment Gateways</h3>
            </div>

            <div className="space-y-4">
              {/* Stripe */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-bold">S</div>
                    <div>
                      <h4 className="text-sm font-medium">Stripe</h4>
                      <p className="text-xs text-[#616161]">Credit cards, debit cards, and more</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={paymentGateways.stripe.enabled}
                      onChange={() => toggleGateway("stripe")}
                    />
                    <div className="w-11 h-6 bg-[#E0E0E0] peer-checked:bg-[#1565C0] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                {paymentGateways.stripe.enabled && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EEEEEE]">
                    <div>
                      <label className="block text-xs font-medium text-[#616161] mb-1">Publishable Key</label>
                      <input 
                        type="text" 
                        value={paymentGateways.stripe.publicKey}
                        onChange={(e) => { setPaymentGateways({ ...paymentGateways, stripe: { ...paymentGateways.stripe, publicKey: e.target.value } }); handleChange(); }}
                        className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#616161] mb-1">Secret Key</label>
                      <input 
                        type="password" 
                        value={paymentGateways.stripe.secretKey}
                        onChange={(e) => { setPaymentGateways({ ...paymentGateways, stripe: { ...paymentGateways.stripe, secretKey: e.target.value } }); handleChange(); }}
                        className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PayPal */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003087] flex items-center justify-center text-white font-bold">P</div>
                    <div>
                      <h4 className="text-sm font-medium">PayPal</h4>
                      <p className="text-xs text-[#616161]">PayPal payments and subscriptions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={paymentGateways.paypal.enabled}
                      onChange={() => toggleGateway("paypal")}
                    />
                    <div className="w-11 h-6 bg-[#E0E0E0] peer-checked:bg-[#1565C0] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                {paymentGateways.paypal.enabled && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EEEEEE]">
                    <div>
                      <label className="block text-xs font-medium text-[#616161] mb-1">Client ID</label>
                      <input 
                        type="text" 
                        value={paymentGateways.paypal.clientId}
                        onChange={(e) => { setPaymentGateways({ ...paymentGateways, paypal: { ...paymentGateways.paypal, clientId: e.target.value } }); handleChange(); }}
                        className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" 
                        placeholder="Client ID"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#616161] mb-1">Client Secret</label>
                      <input 
                        type="password" 
                        value={paymentGateways.paypal.clientSecret}
                        onChange={(e) => { setPaymentGateways({ ...paymentGateways, paypal: { ...paymentGateways.paypal, clientSecret: e.target.value } }); handleChange(); }}
                        className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" 
                        placeholder="Client Secret"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Razorpay */}
              <div className="border border-[#E0E0E0] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#3395FF] flex items-center justify-center text-white font-bold">R</div>
                    <div>
                      <h4 className="text-sm font-medium">Razorpay</h4>
                      <p className="text-xs text-[#616161]">Popular in India and South Asia</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={paymentGateways.razorpay.enabled}
                      onChange={() => toggleGateway("razorpay")}
                    />
                    <div className="w-11 h-6 bg-[#E0E0E0] peer-checked:bg-[#1565C0] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                {paymentGateways.razorpay.enabled && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EEEEEE] mt-3">
                    <div>
                      <label className="block text-xs font-medium text-[#616161] mb-1">Key ID</label>
                      <input 
                        type="text" 
                        value={paymentGateways.razorpay.keyId}
                        onChange={(e) => { setPaymentGateways({ ...paymentGateways, razorpay: { ...paymentGateways.razorpay, keyId: e.target.value } }); handleChange(); }}
                        className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" 
                        placeholder="Key ID"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#616161] mb-1">Key Secret</label>
                      <input 
                        type="password" 
                        value={paymentGateways.razorpay.keySecret}
                        onChange={(e) => { setPaymentGateways({ ...paymentGateways, razorpay: { ...paymentGateways.razorpay, keySecret: e.target.value } }); handleChange(); }}
                        className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono" 
                        placeholder="Key Secret"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing Configuration */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Receipt size={18} className="text-[#1565C0]" />
              <h3 className="font-semibold text-[#212121]">Billing Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Currency</label>
                <select 
                  value={billingConfig.currency}
                  onChange={(e) => { setBillingConfig({ ...billingConfig, currency: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="NPR">NPR - Nepalese Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={billingConfig.taxRate}
                  onChange={(e) => { setBillingConfig({ ...billingConfig, taxRate: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Invoice Prefix</label>
                <input 
                  type="text" 
                  value={billingConfig.invoicePrefix}
                  onChange={(e) => { setBillingConfig({ ...billingConfig, invoicePrefix: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Payment Terms</label>
                <select 
                  value={billingConfig.paymentTerms}
                  onChange={(e) => { setBillingConfig({ ...billingConfig, paymentTerms: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                >
                  <option value="immediate">Due Immediately</option>
                  <option value="net7">Net 7 Days</option>
                  <option value="net15">Net 15 Days</option>
                  <option value="net30">Net 30 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Grace Period (days)</label>
                <input 
                  type="number" 
                  value={billingConfig.gracePeriod}
                  onChange={(e) => { setBillingConfig({ ...billingConfig, gracePeriod: e.target.value }); handleChange(); }}
                  className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" 
                />
              </div>

              <div className="flex items-center pt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingConfig.autoCharge}
                    onChange={(e) => { setBillingConfig({ ...billingConfig, autoCharge: e.target.checked }); handleChange(); }}
                    className="rounded border-[#E0E0E0] text-[#1565C0]"
                  />
                  <span className="text-sm text-[#212121]">Auto-charge on renewal</span>
                </label>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#EEEEEE]">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={billingConfig.lateFeesEnabled}
                  onChange={(e) => { setBillingConfig({ ...billingConfig, lateFeesEnabled: e.target.checked }); handleChange(); }}
                  className="rounded border-[#E0E0E0] text-[#1565C0]"
                />
                <span className="text-sm text-[#212121]">Enable late payment fees</span>
              </label>
              {billingConfig.lateFeesEnabled && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-[#212121] mb-1">Late Fee Percentage</label>
                  <input 
                    type="number" 
                    value={billingConfig.lateFeePercentage}
                    onChange={(e) => { setBillingConfig({ ...billingConfig, lateFeePercentage: e.target.value }); handleChange(); }}
                    className="w-32 h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" 
                  />
                  <span className="text-sm text-[#616161] ml-2">% of invoice total</span>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Statistics */}
          <div className="bg-gradient-to-br from-[#1565C0] to-[#0D47A1] rounded-lg p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} />
              <h3 className="font-semibold">Revenue Overview (Last 30 Days)</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold mb-1">NPR 2.4M</div>
                <div className="text-sm opacity-90">Total Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">248</div>
                <div className="text-sm opacity-90">Invoices Paid</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">12</div>
                <div className="text-sm opacity-90">Pending Payments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
