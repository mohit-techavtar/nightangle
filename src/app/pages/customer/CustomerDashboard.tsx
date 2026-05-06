import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ProgressBar, CircularProgress } from "../../components/ui/ProgressBar";
import { SkeletonCard, Skeleton, SkeletonText } from "../../components/ui/Skeleton";
import { CreditCard as CreditCardComponent } from "../../components/ui/CreditDisplay";
import { StorageCard } from "../../components/ui/StorageQuota";
import { TopUpCreditsModal } from "../../components/modals/TopUpCreditsModal";
import {
  PhoneCall, Bot, FileText, BarChart3, Settings, HelpCircle,
  Megaphone, X, AlertTriangle, Bell, Clock, Check
} from "lucide-react";

const quickActions = [
  { icon: Megaphone, label: "Launch Campaign", desc: "Create and run outreach campaigns", color: "bg-[#E3F2FD] text-[#1565C0]" },
  { icon: Bot, label: "Create AI Agent", desc: "Build a new conversational agent", color: "bg-[#F3E5F5] text-[#6A1B9A]" },
  { icon: PhoneCall, label: "View Call Logs", desc: "Review recent call activity", color: "bg-[#E8F5E9] text-[#2E7D32]" },
  { icon: BarChart3, label: "Usage Report", desc: "Analyze your consumption metrics", color: "bg-[#FFF8E1] text-[#F57F17]" },
  { icon: Settings, label: "Company Settings", desc: "Manage your account preferences", color: "bg-[#ECEFF1] text-[#455A64]" },
  { icon: HelpCircle, label: "Get Support", desc: "Contact our support team", color: "bg-[#FFEBEE] text-[#C62828]" },
];

const activities = [
  { time: "2 hours ago", text: "Campaign 'March Outreach' completed 142 calls" },
  { time: "5 hours ago", text: "AI Agent 'Sales Bot v2' reached 1000 conversations" },
  { time: "Yesterday", text: "New contact list imported (345 contacts)" },
  { time: "Yesterday", text: "Campaign 'Follow-up Q1' started" },
  { time: "2 days ago", text: "AI Agent 'Support Bot' updated to v3.1" },
];

const notifications = [
  { text: "AI minutes usage reached 82% threshold", time: "1 hour ago", read: false, type: "warning" },
  { text: "Invoice INV-2026-0042 generated", time: "Yesterday", read: false, type: "info" },
  { text: "Subscription renews in 42 days", time: "2 days ago", read: true, type: "info" },
  { text: "System maintenance scheduled: Mar 30", time: "3 days ago", read: true, type: "info" },
];

export function CustomerDashboard() {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(145);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handlePurchaseCredits = (purchasedCredits: number, amount: number) => {
    setCredits(prev => prev + purchasedCredits);
    console.log(`Purchased ${purchasedCredits} credits for NPR ${amount}`);
  };

  const handleUpgradeStorage = () => {
    navigate("/tenant/settings/subscription");
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        {/* Alert Banner */}
        {showBanner && !loading && (
          <div className="mb-4 rounded-lg border border-[#FFE082] bg-[#FFF8E1] px-4 max-md:px-3 py-3 max-md:py-2.5 flex items-center gap-3 border-l-4 border-l-[#F57F17] max-md:flex-col max-md:items-start">
            <AlertTriangle size={20} className="text-[#F57F17] shrink-0 max-md:w-4 max-md:h-4" />
            <span className="text-sm max-md:text-[13px] text-[#212121] flex-1">Your AI minutes are running low (<strong>18% remaining</strong>). Consider purchasing additional minutes.</span>
            <div className="flex items-center gap-2 max-md:w-full">
              <button className="h-8 max-md:h-7 px-4 max-md:px-3 rounded-md bg-[#F57F17] text-white text-sm max-md:text-xs hover:bg-[#E65100] shrink-0">Top Up Minutes</button>
              <button onClick={() => setShowBanner(false)} className="text-[#9E9E9E] hover:text-[#616161]"><X size={16} /></button>
            </div>
          </div>
        )}

        {/* Health Cards */}
        {loading ? (
          <div className="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3 mb-6 max-md:mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3 mb-6 max-md:mb-4">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#616161] uppercase font-semibold">Your Plan</span>
                <StatusBadge status="Active" />
              </div>
              <div className="text-xl max-md:text-lg font-bold text-[#212121]">Growth Plan</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-[#E3F2FD] text-[#1565C0] text-[11px] font-semibold border border-[#90CAF9]">Growth</span>
              </div>
              <button onClick={() => navigate("/tenant/settings/subscription")} className="text-sm max-md:text-xs text-[#1565C0] hover:underline mt-3 max-md:mt-2 block">Manage Plan →</button>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3">
              <span className="text-xs text-[#616161] uppercase font-semibold block mb-3 max-md:mb-2">AI Minutes</span>
              <div className="flex items-center gap-4 max-md:gap-3">
                <div className="relative">
                  <CircularProgress value={1820} max={10000} size={70} />
                </div>
                <div>
                  <div className="text-lg max-md:text-base font-bold text-[#212121]">1,820 <span className="text-sm max-md:text-xs font-normal text-[#616161]">/ 10,000</span></div>
                  <div className="text-xs max-md:text-[11px] text-[#9E9E9E]">Est. 12 days remaining</div>
                </div>
              </div>
            </div>

            {/* Credit Balance Card */}
            <CreditCardComponent credits={credits} onTopUp={() => setShowTopUpModal(true)} />

            {/* Storage Card */}
            <StorageCard used={8460} total={10240} planName="Growth" onUpgrade={handleUpgradeStorage} />
          </div>
        )}

        {/* Quick Actions */}
        <h3 className="mb-3 max-md:mb-2">Quick Actions</h3>
        {loading ? (
          <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3 mb-6 max-md:mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3 mb-6 max-md:mb-4">
            {quickActions.map(qa => (
              <button key={qa.label} className="bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3 text-left hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow flex items-start gap-3">
                <div className={`w-10 h-10 max-md:w-8 max-md:h-8 rounded-full ${qa.color.split(" ")[0]} flex items-center justify-center shrink-0`}>
                  <qa.icon size={20} className={`${qa.color.split(" ")[1]} max-md:w-4 max-md:h-4`} />
                </div>
                <div>
                  <div className="text-sm max-md:text-[13px] font-semibold text-[#212121]">{qa.label}</div>
                  <div className="text-xs max-md:text-[11px] text-[#616161] mt-0.5">{qa.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Activity & Notifications */}
        {loading ? (
          <div className="grid grid-cols-5 max-xl:grid-cols-1 gap-6 max-md:gap-4">
            <div className="col-span-3 max-xl:col-span-1">
              <SkeletonCard className="h-64" />
            </div>
            <div className="col-span-2 max-xl:col-span-1">
              <SkeletonCard className="h-64" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-5 max-xl:grid-cols-1 gap-6 max-md:gap-4">
            <div className="col-span-3 max-xl:col-span-1 bg-white rounded-lg border border-[#E0E0E0] p-5 max-md:p-4">
              <h4 className="mb-3 max-md:mb-2">Recent Activity</h4>
              <div className="space-y-3 max-md:space-y-2">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm max-md:text-[13px] pb-3 max-md:pb-2 border-b border-[#EEEEEE] last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-[#1565C0] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <span className="text-[#212121]">{a.text}</span>
                      <div className="text-xs max-md:text-[11px] text-[#9E9E9E] mt-0.5">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 max-xl:col-span-1 bg-white rounded-lg border border-[#E0E0E0] p-5 max-md:p-4">
              <div className="flex items-center justify-between mb-3 max-md:mb-2">
                <h4>Notifications</h4>
                <span className="bg-[#C62828] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">2</span>
              </div>
              <div className="space-y-3 max-md:space-y-2">
                {notifications.map((n, i) => (
                  <div key={i} className={`flex items-start gap-3 text-sm max-md:text-[13px] pb-3 max-md:pb-2 border-b border-[#EEEEEE] last:border-0 last:pb-0 ${!n.read ? "bg-[#FAFAFA] -mx-2 px-2 py-1 rounded" : ""}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-[#1565C0]" : "bg-[#E0E0E0]"}`} />
                    <div>
                      <span className={`${!n.read ? "font-medium text-[#212121]" : "text-[#616161]"}`}>{n.text}</span>
                      <div className="text-xs max-md:text-[11px] text-[#9E9E9E] mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Top Up Credits Modal */}
      <TopUpCreditsModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        currentCredits={credits}
        onPurchase={handlePurchaseCredits}
      />
    </>
  );
}