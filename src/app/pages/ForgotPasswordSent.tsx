import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { MailCheck } from "lucide-react";

export function ForgotPasswordSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown === 0) {
      setCooldown(60);
      // In a real app, this would trigger a new email send
      console.log("Resending email to:", email);
    }
  };

  const handleOpenEmail = () => {
    // Open default email client
    window.location.href = "mailto:";
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

      {/* Right Panel - Content */}
      <div className="w-[45%] max-lg:w-full bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <div className="text-[#0F1B2D] text-2xl font-bold tracking-tight">OmniCRM</div>
            <div className="text-[#9E9E9E] text-xs mt-0.5">AI-Powered CRM</div>
          </div>

          {/* Icon */}
          <div className="mb-6 w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <MailCheck size={28} className="text-[#2E7D32]" />
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#212121", lineHeight: "28px", marginBottom: "6px" }}>
            Check your email
          </h2>
          <p className="text-sm text-[#616161] mb-8">
            We sent a password reset link to <strong className="text-[#212121]">{email}</strong>. The link expires in 15 minutes.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            {/* Open Email App Button */}
            <button
              onClick={handleOpenEmail}
              className="w-full h-11 rounded-[6px] bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Open Email App
            </button>

            {/* Resend Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="text-sm text-[#1565C0] hover:text-[#0D47A1] transition-colors font-medium disabled:text-[#9E9E9E] disabled:cursor-not-allowed"
              >
                Didn't receive the email? {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
              </button>
            </div>

            {/* Back to Sign In */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-[#1565C0] hover:text-[#0D47A1] transition-colors font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
