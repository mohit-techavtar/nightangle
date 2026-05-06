import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Building2, UserCog, ArrowLeft } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine user type from pathname
  const isCustomer = location.pathname === "/login/customer";
  const isAdmin = location.pathname === "/login/admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if there's a pending playground query
      const hasPendingQuery = sessionStorage.getItem("pendingPlaygroundQuery");
      
      if (isCustomer) {
        // If there's a pending query, go to playground, otherwise dashboard
        navigate(hasPendingQuery ? "/tenant/playground" : "/tenant/dashboard");
      } else if (isAdmin) {
        navigate("/admin");
      } else {
        // Fallback to customer dashboard if userType is unknown
        navigate("/tenant/dashboard");
      }
    }, 1200);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Panel */}
      <div className="w-[55%] bg-[#0F1B2D] relative flex flex-col min-h-0 max-lg:hidden">
        {/* Logo */}
        <div className="px-10 pt-10">
          <div className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            OmniCRM
          </div>
          <div className="text-[#9E9E9E] text-xs mt-0.5">AI-Powered CRM</div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-16">
          {/* Abstract Network Illustration */}
          <div className="w-full max-w-[480px] mb-10">
            <svg viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1565C0" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1565C0" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1565C0" />
                  <stop offset="100%" stopColor="#0D47A1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connection lines */}
              <line x1="120" y1="100" x2="240" y2="160" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line x1="240" y1="160" x2="360" y2="100" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line x1="240" y1="160" x2="180" y2="240" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line x1="240" y1="160" x2="320" y2="240" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line x1="120" y1="100" x2="60" y2="180" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <line x1="360" y1="100" x2="420" y2="180" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <line x1="180" y1="240" x2="320" y2="240" stroke="url(#grad2)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
              <line x1="60" y1="180" x2="180" y2="240" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <line x1="420" y1="180" x2="320" y2="240" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <line x1="120" y1="100" x2="180" y2="50" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <line x1="360" y1="100" x2="310" y2="50" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <line x1="180" y1="50" x2="310" y2="50" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <line x1="240" y1="160" x2="240" y2="70" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <line x1="180" y1="240" x2="120" y2="290" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
              <line x1="320" y1="240" x2="380" y2="290" stroke="url(#grad2)" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

              {/* Outer glow rings */}
              <circle cx="240" cy="160" r="28" fill="none" stroke="#1565C0" strokeWidth="0.5" opacity="0.15" />
              <circle cx="240" cy="160" r="42" fill="none" stroke="#1565C0" strokeWidth="0.5" opacity="0.08" />

              {/* Small nodes */}
              <circle cx="60" cy="180" r="4" fill="#1565C0" opacity="0.4" />
              <circle cx="420" cy="180" r="4" fill="#1565C0" opacity="0.4" />
              <circle cx="180" cy="50" r="3.5" fill="#1565C0" opacity="0.35" />
              <circle cx="310" cy="50" r="3.5" fill="#1565C0" opacity="0.35" />
              <circle cx="240" cy="70" r="3" fill="#1565C0" opacity="0.3" />
              <circle cx="120" cy="290" r="3" fill="#1565C0" opacity="0.2" />
              <circle cx="380" cy="290" r="3" fill="#1565C0" opacity="0.2" />

              {/* Medium nodes */}
              <circle cx="120" cy="100" r="8" fill="url(#nodeGrad)" opacity="0.7" filter="url(#glow)" />
              <circle cx="120" cy="100" r="3" fill="#E3F2FD" opacity="0.9" />

              <circle cx="360" cy="100" r="8" fill="url(#nodeGrad)" opacity="0.7" filter="url(#glow)" />
              <circle cx="360" cy="100" r="3" fill="#E3F2FD" opacity="0.9" />

              <circle cx="180" cy="240" r="7" fill="url(#nodeGrad)" opacity="0.6" filter="url(#glow)" />
              <circle cx="180" cy="240" r="2.5" fill="#E3F2FD" opacity="0.8" />

              <circle cx="320" cy="240" r="7" fill="url(#nodeGrad)" opacity="0.6" filter="url(#glow)" />
              <circle cx="320" cy="240" r="2.5" fill="#E3F2FD" opacity="0.8" />

              {/* Central hub node */}
              <circle cx="240" cy="160" r="16" fill="url(#nodeGrad)" opacity="0.9" filter="url(#glow)" />
              <circle cx="240" cy="160" r="6" fill="#E3F2FD" opacity="0.95" />

              {/* Pulse animation circles */}
              <circle cx="240" cy="160" r="16" fill="none" stroke="#1565C0" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" from="16" to="36" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="240" cy="160" r="16" fill="none" stroke="#1565C0" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" from="16" to="36" dur="3s" begin="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="3s" begin="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <h2
            className="text-white text-center mb-3"
            style={{ fontSize: "28px", fontWeight: 600, lineHeight: "36px" }}
          >
            Intelligent conversations.
            <br />
            Effortless growth.
          </h2>
          <p className="text-[#9E9E9E] text-center text-sm max-w-[400px] leading-relaxed">
            Manage your customer relationships with AI-powered calling, WhatsApp, and campaign automation.
          </p>
        </div>

        {/* Footer */}
        <div className="px-10 pb-8">
          <span className="text-[#616161] text-xs">&copy; 2026 OmniCRM. All rights reserved.</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[45%] max-lg:w-full bg-white flex items-center justify-center p-12 max-md:p-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 max-md:mb-8">
            <div className="text-[#0F1B2D] text-2xl font-bold tracking-tight">OmniCRM</div>
            <div className="text-[#9E9E9E] text-xs mt-0.5">AI-Powered CRM</div>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#212121", lineHeight: "28px" }} className="max-md:text-xl">
            Welcome back{isCustomer && " - Customer"}{isAdmin && " - Admin"}
          </h2>
          <p className="text-sm text-[#616161] mt-1.5 mb-8 max-md:mb-6">
            {isCustomer && "Sign in to your CRM account"}
            {isAdmin && "Sign in to your admin account"}
            {!isCustomer && !isAdmin && "Sign in to your account"}
          </p>

          {/* User Type Indicator */}
          {(isCustomer || isAdmin) && (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="mb-4 flex items-center gap-2 text-sm max-md:text-[13px] text-[#616161] hover:text-[#1565C0] transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to login options</span>
              </button>
              <div className="mb-6 max-md:mb-5 p-3 max-md:p-2.5 rounded-lg bg-[#E3F2FD] border border-[#90CAF9] flex items-center gap-3">
                {isCustomer && <Building2 size={20} className="text-[#1565C0] max-md:w-4 max-md:h-4" />}
                {isAdmin && <UserCog size={20} className="text-[#1565C0] max-md:w-4 max-md:h-4" />}
                <div>
                  <div className="text-sm max-md:text-[13px] font-semibold text-[#212121]">
                    {isCustomer && "Customer Portal"}
                    {isAdmin && "Super Admin Portal"}
                  </div>
                  <div className="text-xs max-md:text-[11px] text-[#616161] mt-0.5">
                    {isCustomer && "Access your CRM dashboard and tools"}
                    {isAdmin && "Manage tenants and platform settings"}
                  </div>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-md:space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#212121]">
                Email Address <span className="text-[#C62828]">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full h-10 pl-10 pr-3 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#212121]">
                Password <span className="text-[#C62828]">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-10 pl-10 pr-10 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#616161] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border-[#E0E0E0] text-[#1565C0] accent-[#1565C0] cursor-pointer"
                />
                <span className="text-sm max-md:text-[13px] text-[#212121]">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm max-md:text-[13px] text-[#1565C0] hover:text-[#0D47A1] transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 max-md:h-10 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E0E0E0]" />
              <span className="text-xs text-[#9E9E9E] whitespace-nowrap">or continue with</span>
              <div className="flex-1 h-px bg-[#E0E0E0]" />
            </div>

            {/* SSO */}
            <button
              type="button"
              className="w-full h-11 rounded-[6px] bg-white border border-[#E0E0E0] text-[#212121] text-sm font-medium hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} className="text-[#616161]" />
              Sign in with SSO
            </button>

            {/* Bottom text */}
            <p className="text-center text-[13px] max-md:text-xs text-[#616161] pt-2">
              Don't have an account?{" "}
              <span className="text-[#1565C0] font-medium">Contact your administrator</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}