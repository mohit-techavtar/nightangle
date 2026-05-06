import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Lock, Eye, EyeOff, CheckCircle, Circle } from "lucide-react";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[!@#$%^&*(),.?\":{}|<>]/.test(p) },
];

export function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [strength, setStrength] = useState<"weak" | "fair" | "good" | "strong">("weak");

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setStrength("weak");
      return;
    }

    const metRequirements = requirements.filter((r) => r.test(newPassword)).length;
    
    if (metRequirements === 4 && newPassword.length >= 12) {
      setStrength("strong");
    } else if (metRequirements >= 3) {
      setStrength("good");
    } else if (metRequirements >= 2) {
      setStrength("fair");
    } else {
      setStrength("weak");
    }
  }, [newPassword]);

  const strengthConfig = {
    weak: { color: "#C62828", bg: "#FFEBEE", label: "Weak", width: "25%" },
    fair: { color: "#F57F17", bg: "#FFF8E1", label: "Fair", width: "50%" },
    good: { color: "#F9A825", bg: "#FFFDE7", label: "Good", width: "75%" },
    strong: { color: "#2E7D32", bg: "#E8F5E9", label: "Strong", width: "100%" },
  };

  const allRequirementsMet = requirements.every((r) => r.test(newPassword));
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const canSubmit = allRequirementsMet && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to success or login page
      navigate("/");
    }, 1200);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Panel - Branding */}
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

      {/* Right Panel - Form */}
      <div className="w-[45%] max-lg:w-full bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <div className="text-[#0F1B2D] text-2xl font-bold tracking-tight">OmniCRM</div>
            <div className="text-[#9E9E9E] text-xs mt-0.5">AI-Powered CRM</div>
          </div>

          {/* Icon */}
          <div className="mb-6 w-16 h-16 rounded-full bg-[#E3F2FD] flex items-center justify-center">
            <Lock size={28} className="text-[#1565C0]" />
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#212121", lineHeight: "28px", marginBottom: "6px" }}>
            Set new password
          </h2>
          <p className="text-sm text-[#616161] mb-8">
            Your new password must be different from previously used passwords.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#212121]">
                New Password <span className="text-[#C62828]">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full h-10 pl-10 pr-10 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#616161] transition-colors"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2">
                  <div className="w-full h-1 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: strengthConfig[strength].width,
                        backgroundColor: strengthConfig[strength].color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs" style={{ color: strengthConfig[strength].color }}>
                      {strengthConfig[strength].label}
                    </span>
                  </div>
                </div>
              )}

              {/* Requirements Checklist */}
              <div className="mt-3 space-y-2">
                {requirements.map((req, idx) => {
                  const isMet = req.test(newPassword);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      {isMet ? (
                        <CheckCircle size={14} className="text-[#2E7D32]" />
                      ) : (
                        <Circle size={14} className="text-[#E0E0E0]" />
                      )}
                      <span className={`text-xs ${isMet ? "text-[#2E7D32]" : "text-[#616161]"}`}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-[#212121]">
                Confirm Password <span className="text-[#C62828]">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full h-10 pl-10 pr-10 text-sm border border-[#E0E0E0] rounded-[6px] bg-white placeholder-[#9E9E9E] text-[#212121] outline-none transition-all focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#616161] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {passwordsMatch && (
                  <CheckCircle size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-[#2E7D32]" />
                )}
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-[#C62828]">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="w-full h-11 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
