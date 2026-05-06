import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Send, Sparkles, TrendingUp, Users, Target, Zap, ArrowRight, CheckCircle2, Bot, Building2,
  Menu, X, PhoneCall, MessageCircle, Mail, Handshake, BarChart3, Plug, Shield, Globe,
  MessageSquare, Megaphone, GitBranch, Workflow, Star, Clock, DollarSign, Briefcase,
  Contact, FileText, Key, Webhook, Activity, Calendar, ChevronRight, Crown, Check
} from "lucide-react";

const heroFeatures = [
  { icon: GitBranch, title: "Lead Management", desc: "Capture, score, and nurture leads with AI" },
  { icon: PhoneCall, title: "AI Calling", desc: "Automated outbound calls with voice AI" },
  { icon: Handshake, title: "Deal Pipeline", desc: "Visual pipeline with forecasting" },
  { icon: Megaphone, title: "Campaigns", desc: "Multi-channel campaign automation" },
];

const mainFeatures = [
  {
    icon: GitBranch,
    title: "Advanced Lead Management",
    desc: "Capture leads from multiple sources, score with AI, manage duplicates, and automate workflows",
    highlights: ["AI Lead Scoring", "Duplicate Detection", "Kanban View", "Workflow Automation"]
  },
  {
    icon: PhoneCall,
    title: "AI-Powered Calling",
    desc: "Scale your outreach with AI voice agents that sound human and handle conversations naturally",
    highlights: ["Voice AI Agents", "Live Call Monitoring", "Call Analytics", "Cost Optimization"]
  },
  {
    icon: MessageCircle,
    title: "Multi-Channel Communication",
    desc: "Engage customers via WhatsApp, SMS, and Email with templates, automation, and compliance",
    highlights: ["WhatsApp Business API", "SMS Campaigns", "Email Marketing", "Unified Inbox"]
  },
  {
    icon: Handshake,
    title: "Deal & Pipeline Management",
    desc: "Visualize your sales pipeline, forecast revenue, and close deals faster with insights",
    highlights: ["Visual Pipeline", "Revenue Forecasting", "Deal Tracking", "Custom Stages"]
  },
  {
    icon: Plug,
    title: "Powerful Integrations",
    desc: "Connect with 100+ apps including Gmail, Slack, Stripe, and Zapier via our marketplace",
    highlights: ["100+ Integrations", "API & Webhooks", "OAuth Support", "Real-time Sync"]
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Track performance with customizable reports, dashboards, and AI-powered insights",
    highlights: ["Custom Reports", "Real-time Dashboards", "Export to CSV/PDF", "AI Insights"]
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹4,999",
    period: "/month",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 5 users",
      "1,000 leads/month",
      "Basic CRM features",
      "Email support",
      "WhatsApp & SMS (100/month)",
      "Basic reporting"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "₹14,999",
    period: "/month",
    description: "For growing businesses that need more",
    features: [
      "Up to 15 users",
      "10,000 leads/month",
      "AI Calling (500 mins/month)",
      "Advanced automation",
      "All integrations",
      "Priority support",
      "Custom reports",
      "API access"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored for large organizations",
    features: [
      "Unlimited users",
      "Unlimited leads",
      "Unlimited AI calling",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
      "White-label options"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Sales Director",
    company: "TechVista Solutions",
    content: "OmniCRM's AI calling feature helped us scale from 50 to 500 calls per day without hiring more staff. ROI was positive within the first month.",
    avatar: "👨‍💼"
  },
  {
    name: "Priya Sharma",
    role: "Marketing Head",
    company: "GrowthMinds",
    content: "The multi-channel campaigns and WhatsApp integration have transformed our customer engagement. We've seen a 3x increase in response rates.",
    avatar: "👩‍💼"
  },
  {
    name: "Amit Patel",
    role: "Founder & CEO",
    company: "CloudNine Systems",
    content: "Finally, a CRM that's built for India. The GST invoicing, INR billing, and local integrations make it perfect for our business.",
    avatar: "👨‍💻"
  }
];

const stats = [
  { value: "50K+", label: "Leads Managed" },
  { value: "1M+", label: "AI Calls Made" },
  { value: "1,000+", label: "Active Companies" },
  { value: "98%", label: "Customer Satisfaction" }
];

export function WebsiteLanding() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 max-md:px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center">
              <Building2 className="text-white" size={18} />
            </div>
            <span className="text-[#0F1B2D] text-xl font-bold tracking-tight">OmniCRM</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#64748B] hover:text-[#1565C0] transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-[#64748B] hover:text-[#1565C0] transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-[#64748B] hover:text-[#1565C0] transition-colors">Testimonials</a>
            <button
              onClick={() => navigate("/auth")}
              className="px-4 h-9 rounded-lg text-sm text-[#1565C0] hover:bg-[#E3F2FD] transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-5 h-9 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors shadow-sm"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-[#0F1B2D]"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3 shadow-lg">
            <a href="#features" className="block text-sm text-[#64748B] hover:text-[#1565C0] py-2">Features</a>
            <a href="#pricing" className="block text-sm text-[#64748B] hover:text-[#1565C0] py-2">Pricing</a>
            <a href="#testimonials" className="block text-sm text-[#64748B] hover:text-[#1565C0] py-2">Testimonials</a>
            <button
              onClick={() => navigate("/auth")}
              className="w-full px-4 h-9 rounded-lg text-sm text-[#1565C0] hover:bg-[#E3F2FD] transition-colors text-left font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="w-full px-5 h-9 rounded-lg bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Get Started Free
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 max-md:pt-24 max-md:pb-12 px-6 max-md:px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-md:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-[#1565C0] text-sm font-medium mb-6 max-md:mb-4">
              <Sparkles size={16} />
              India's Complete CRM Platform
            </div>
            <h1 className="text-6xl max-md:text-4xl font-bold text-[#0F1B2D] mb-6 max-md:mb-4 leading-tight">
              The All-in-One CRM for<br />
              <span className="bg-gradient-to-r from-[#1565C0] to-[#0D47A1] bg-clip-text text-transparent">
                Modern Businesses
              </span>
            </h1>
            <p className="text-xl max-md:text-base text-[#64748B] max-w-3xl mx-auto mb-8 max-md:mb-6">
              Manage leads, automate AI calling, run multi-channel campaigns, close deals, and integrate with 100+ apps—all in one powerful platform built for India.
            </p>

            <div className="flex items-center justify-center gap-4 max-md:flex-col mb-12">
              <button
                onClick={() => navigate("/auth")}
                className="px-8 h-12 rounded-lg bg-[#1565C0] text-white font-semibold hover:bg-[#0D47A1] transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Start Free Trial <ArrowRight size={20} />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 h-12 rounded-lg border-2 border-gray-300 text-[#0F1B2D] font-semibold hover:border-[#1565C0] hover:bg-gray-50 transition-all"
              >
                Explore Features
              </button>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6 max-md:gap-4 max-w-4xl mx-auto">
              {heroFeatures.map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 max-md:w-10 max-md:h-10 mx-auto mb-3 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <feature.icon size={20} className="text-[#1565C0]" />
                  </div>
                  <div className="text-sm font-medium text-[#0F1B2D] mb-1">{feature.title}</div>
                  <div className="text-xs text-[#64748B]">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 max-md:py-10 px-6 max-md:px-4 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-8 max-md:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl max-md:text-3xl font-bold bg-gradient-to-r from-[#1565C0] to-[#0D47A1] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[#64748B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="py-20 max-md:py-12 px-6 max-md:px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-md:mb-10">
            <h2 className="text-4xl max-md:text-3xl font-bold text-[#0F1B2D] mb-4">Everything You Need to Grow</h2>
            <p className="text-lg max-md:text-base text-[#64748B] max-w-2xl mx-auto">
              From lead capture to deal closure, OmniCRM has all the tools you need to scale your business
            </p>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-8 max-md:gap-6">
            {mainFeatures.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 max-md:p-6 hover:shadow-xl transition-all hover:border-[#1565C0] group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F1B2D] mb-3">{feature.title}</h3>
                <p className="text-[#64748B] mb-4">{feature.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {feature.highlights.map((highlight, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-[#64748B]">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-20 max-md:py-12 px-6 max-md:px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-md:mb-8">
            <h2 className="text-4xl max-md:text-3xl font-bold text-[#0F1B2D] mb-4">Connect Everything</h2>
            <p className="text-lg max-md:text-base text-[#64748B] max-w-2xl mx-auto">
              Seamlessly integrate with the tools you already use
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-12 max-md:p-6">
            <div className="grid grid-cols-3 max-md:grid-cols-2 gap-6 max-md:gap-4 mb-8">
              {['Gmail', 'Slack', 'Stripe', 'Google Calendar', 'Mailchimp', 'Zapier'].map((app, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center h-20 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl">{['📧', '💬', '💳', '📅', '🐒', '⚡'][i]}</span>
                  <span className="ml-3 font-semibold text-[#0F1B2D]">{app}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-[#64748B] mb-4">+ 94 more integrations available</p>
              <div className="flex items-center justify-center gap-4 text-sm text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Key size={16} />
                  <span>API Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Webhook size={16} />
                  <span>Webhooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <span>OAuth Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-md:py-12 px-6 max-md:px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-md:mb-10">
            <h2 className="text-4xl max-md:text-3xl font-bold text-[#0F1B2D] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg max-md:text-base text-[#64748B] max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8 max-md:gap-6">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border-2 p-8 max-md:p-6 relative ${
                  plan.popular
                    ? 'border-[#1565C0] shadow-xl scale-105 max-md:scale-100'
                    : 'border-gray-200 hover:border-[#1565C0] hover:shadow-lg'
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-sm font-semibold rounded-full flex items-center gap-1">
                    <Crown size={14} />
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#0F1B2D] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-[#0F1B2D]">{plan.price}</span>
                  <span className="text-[#64748B]">{plan.period}</span>
                </div>
                <p className="text-[#64748B] mb-6">{plan.description}</p>
                <button
                  onClick={() => navigate("/auth")}
                  className={`w-full h-12 rounded-lg font-semibold transition-colors mb-6 ${
                    plan.popular
                      ? 'bg-[#1565C0] text-white hover:bg-[#0D47A1]'
                      : 'bg-gray-100 text-[#0F1B2D] hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-[#64748B]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 max-md:py-12 px-6 max-md:px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-md:mb-10">
            <h2 className="text-4xl max-md:text-3xl font-bold text-[#0F1B2D] mb-4">Loved by Teams Across India</h2>
            <p className="text-lg max-md:text-base text-[#64748B] max-w-2xl mx-auto">
              See what our customers have to say about OmniCRM
            </p>
          </div>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8 max-md:gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-200 p-8 max-md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[#0F1B2D] mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F1B2D]">{testimonial.name}</div>
                    <div className="text-sm text-[#64748B]">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-md:py-12 px-6 max-md:px-4 bg-gradient-to-br from-[#1565C0] to-[#0D47A1]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl max-md:text-3xl font-bold text-white mb-4">Ready to Transform Your Sales?</h2>
          <p className="text-xl max-md:text-base text-white/90 mb-8 max-md:mb-6">
            Join 1,000+ companies using OmniCRM to close more deals and grow faster.
          </p>
          <div className="flex items-center justify-center gap-4 max-md:flex-col">
            <button
              onClick={() => navigate("/auth")}
              className="px-8 h-14 rounded-lg bg-white text-[#1565C0] font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-xl"
            >
              Start Free 14-Day Trial <ArrowRight size={20} />
            </button>
            <div className="text-white/80 text-sm">
              No credit card required • Setup in 5 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 max-md:px-4 bg-[#0F1B2D] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center">
                  <Building2 className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold">OmniCRM</span>
              </div>
              <p className="text-sm text-gray-400">
                India's complete CRM platform for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex items-center justify-between max-md:flex-col max-md:gap-4">
            <div className="text-sm text-gray-400">&copy; 2026 OmniCRM. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Made with ❤️ in India</span>
              <span>•</span>
              <span>GST Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
