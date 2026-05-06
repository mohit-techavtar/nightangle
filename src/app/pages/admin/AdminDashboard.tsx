import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatCard } from "../../components/ui/StatCard";
import { SkeletonStatCard, SkeletonCard } from "../../components/ui/Skeleton";
import { Building2, CheckCircle2, AlertTriangle, XCircle, PhoneCall, CreditCard, KeyRound, BarChart3, Bell, Settings } from "lucide-react";

const quickLinks = [
  { icon: Building2, label: "Manage Tenants", path: "/admin/tenants", color: "bg-[#E3F2FD] text-[#1565C0]" },
  { icon: CreditCard, label: "Subscription Plans", path: "/admin/subscription-plans", color: "bg-[#E8F5E9] text-[#2E7D32]" },
  { icon: KeyRound, label: "License Management", path: "/admin/licenses", color: "bg-[#FFF8E1] text-[#F57F17]" },
  { icon: BarChart3, label: "Usage Analytics", path: "/admin/usage", color: "bg-[#F3E5F5] text-[#6A1B9A]" },
  { icon: Bell, label: "Alerts Center", path: "/admin/alerts", color: "bg-[#FFEBEE] text-[#C62828]" },
  { icon: Settings, label: "Settings", path: "/admin/settings", color: "bg-[#ECEFF1] text-[#455A64]" },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <h1 className="mb-6 max-md:mb-4">Platform Overview</h1>
        
        {loading ? (
          <>
            {/* Skeleton for Stats */}
            <div className="grid grid-cols-5 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 max-md:gap-3 mb-8 max-md:mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonStatCard key={i} />
              ))}
            </div>

            <h3 className="mb-4 max-md:mb-3">Quick Access</h3>
            {/* Skeleton for Quick Links */}
            <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-5 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 max-md:gap-3 mb-8 max-md:mb-6">
              <StatCard title="Total Tenants" value="248" icon={Building2} color="primary" trend={{ value: "7 this month", up: true }} />
              <StatCard title="Active Tenants" value="215" icon={CheckCircle2} color="success" />
              <StatCard title="Expiring Soon" value="12" icon={AlertTriangle} color="warning" subtitle="Within 30 days" />
              <StatCard title="Suspended / Locked" value="8" icon={XCircle} color="error" />
              <StatCard title="AI Minutes Today" value="45,230" icon={PhoneCall} color="info" trend={{ value: "12%", up: true }} />
            </div>

            <h3 className="mb-4 max-md:mb-3">Quick Access</h3>
            <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3">
              {quickLinks.map(ql => (
                <button key={ql.label} onClick={() => navigate(ql.path)} className="bg-white rounded-lg border border-[#E0E0E0] p-5 max-md:p-4 text-left hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow flex items-center gap-4 max-md:gap-3">
                  <div className={`w-12 h-12 max-md:w-10 max-md:h-10 rounded-full ${ql.color.split(" ")[0]} flex items-center justify-center`}>
                    <ql.icon size={24} className={`${ql.color.split(" ")[1]} max-md:w-5 max-md:h-5`} />
                  </div>
                  <span className="text-base max-md:text-sm font-semibold text-[#212121]">{ql.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}