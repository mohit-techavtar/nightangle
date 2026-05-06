import { useState } from "react";
import { useNavigate } from "react-router";
import { useBilling } from "../../hooks/useBilling";
import {
  CreditCard,
  DollarSign,
  Check,
  ArrowLeft,
  Zap,
  TrendingUp,
  Shield,
  Lock,
  AlertCircle,
  Sparkles,
  Info
} from "lucide-react";

export function CreditPurchase() {
  const navigate = useNavigate();
  const { getBalanceByTenant, purchaseCredits } = useBilling();

  const tenantId = "tenant-1"; // Get from auth context
  const balance = getBalanceByTenant(tenantId);

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "razorpay">("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const packages = [
    {
      id: "starter",
      name: "Starter",
      credits: 1000,
      price: 10,
      popular: false,
      features: ["1,000 Credits", "~16 hours of calls", "Basic support"],
    },
    {
      id: "professional",
      name: "Professional",
      credits: 5000,
      price: 45,
      popular: true,
      savings: 10,
      features: ["5,000 Credits", "~83 hours of calls", "Priority support", "10% discount"],
    },
    {
      id: "business",
      name: "Business",
      credits: 10000,
      price: 80,
      popular: false,
      savings: 20,
      features: ["10,000 Credits", "~166 hours of calls", "Premium support", "20% discount"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      credits: 25000,
      price: 175,
      popular: false,
      savings: 30,
      features: ["25,000 Credits", "~416 hours of calls", "Dedicated support", "30% discount"],
    },
  ];

  const selectedPkg = packages.find(p => p.id === selectedPackage);
  const customCredits = customAmount ? parseInt(customAmount) * 100 : 0;
  const totalAmount = selectedPkg?.price || (customCredits / 100);
  const totalCredits = selectedPkg?.credits || customCredits;

  const handlePurchase = async () => {
    if (!selectedPackage && !customAmount) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentId = `pay_${Date.now()}`;
      purchaseCredits(tenantId, totalCredits, paymentId);
      setIsProcessing(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/tenant/billing");
      }, 2000);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            {totalCredits.toLocaleString()} credits have been added to your account.
          </p>
          <p className="text-sm text-gray-500">Redirecting to billing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/tenant/billing")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Purchase Credits</h1>
            <p className="text-sm text-gray-500 mt-1">Select a package or enter a custom amount</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Current Balance Card */}
          {balance && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Current Balance</p>
                  <h2 className="text-3xl font-bold mb-1">{balance.remainingCredits.toLocaleString()}</h2>
                  <p className="text-blue-100 text-sm">
                    {balance.currency} {(balance.remainingCredits / 100).toFixed(2)} value
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8" />
                </div>
              </div>
            </div>
          )}

          {/* Credit Packages */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Package</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackage(pkg.id);
                    setCustomAmount("");
                  }}
                  className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                    selectedPackage === pkg.id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}
                  {pkg.savings && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Save {pkg.savings}%
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{pkg.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                      <span className="text-gray-500 text-sm">USD</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPackage === pkg.id && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Selected
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Or Enter Custom Amount</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPackage(null);
                  }}
                  min="1"
                  step="1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount (min $1)"
                />
              </div>
              {customAmount && (
                <p className="mt-2 text-sm text-gray-600">
                  You will receive <span className="font-semibold text-gray-900">{customCredits.toLocaleString()}</span> credits
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <button
                onClick={() => setPaymentMethod("stripe")}
                className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === "stripe"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paymentMethod === "stripe" ? "bg-blue-600" : "bg-gray-200"
                }`}>
                  <CreditCard className={`w-5 h-5 ${paymentMethod === "stripe" ? "text-white" : "text-gray-600"}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Stripe</div>
                  <div className="text-sm text-gray-500">Credit/Debit Card</div>
                </div>
                {paymentMethod === "stripe" && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("razorpay")}
                className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === "razorpay"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paymentMethod === "razorpay" ? "bg-blue-600" : "bg-gray-200"
                }`}>
                  <DollarSign className={`w-5 h-5 ${paymentMethod === "razorpay" ? "text-white" : "text-gray-600"}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Razorpay</div>
                  <div className="text-sm text-gray-500">UPI, Cards, Net Banking</div>
                </div>
                {paymentMethod === "razorpay" && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          {(selectedPackage || customAmount) && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Credits</span>
                  <span className="font-medium text-gray-900">{totalCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Rate</span>
                  <span className="font-medium text-gray-900">$0.01 per credit</span>
                </div>
                {selectedPkg?.savings && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{selectedPkg.savings}%</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">${totalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">What happens next?</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Credits will be added instantly to your account</li>
                      <li>• You can start using them immediately for AI calls</li>
                      <li>• Receipt will be sent to your email</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full mt-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete Secure Payment
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  SSL Encrypted
                </div>
              </div>
            </div>
          )}

          {/* Features Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Why Purchase Credits?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Instant Activation</div>
                  <div className="text-sm text-gray-600">Credits are added immediately and ready to use</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Bulk Savings</div>
                  <div className="text-sm text-gray-600">Get up to 30% discount on larger packages</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">No Expiry</div>
                  <div className="text-sm text-gray-600">Credits never expire, use them at your pace</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
