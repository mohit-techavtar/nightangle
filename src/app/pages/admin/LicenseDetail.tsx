import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { 
  KeyRound, Calendar, Sparkles, Shield, Users as UsersIcon, Phone, 
  MessageCircle, Clock, TrendingUp, User, Mail, Activity, ChevronRight,
  ShieldCheck, Edit, Ban, RotateCcw, XCircle, AlertTriangle
} from "lucide-react";

// Mock data - in real app this would come from API based on licenseId
const licenseData = {
  "LIC-2026-00142": {
    id: "LIC-2026-00142",
    tenant: "Everest Digital Solutions",
    tenantId: "TNT-00085",
    type: "Monthly",
    status: "Active",
    
    // Validity
    validityStart: "2026-01-01",
    validityEnd: "2026-12-31",
    daysRemaining: 274,
    
    // Credits & Limits
    totalCredits: 10000,
    usedCredits: 7840,
    concurrentCallLimit: 15,
    agentCreationLimit: 10,
    userLimit: 25,
    
    // Feature Modules
    features: {
      aiCalling: true,
      whatsapp: true,
      smsMarketing: false,
      emailCampaigns: true,
    },
    
    // Override settings
    hasOverride: true,
    overrideReason: "Enterprise pilot program - increased limits for Q1 2026",
    overrideDate: "2026-01-15",
    overrideBy: "Admin User (admin@omnicrm.com)",
    
    // Grace period
    graceActive: false,
    
    // Users
    users: [
      { id: "USR-001", name: "Rajesh Sharma", email: "rajesh@everest.com", role: "Admin", status: "Active", lastLogin: "2026-04-01 14:23" },
      { id: "USR-002", name: "Priya Thapa", email: "priya@everest.com", role: "Manager", status: "Active", lastLogin: "2026-04-02 09:15" },
      { id: "USR-003", name: "Amit Kumar", email: "amit@everest.com", role: "Agent", status: "Active", lastLogin: "2026-04-02 11:42" },
      { id: "USR-004", name: "Sunita Rai", email: "sunita@everest.com", role: "Agent", status: "Inactive", lastLogin: "2026-03-28 16:05" },
    ],
    
    // License History / Audit Trail
    history: [
      { date: "2026-04-02 09:30", action: "Override Applied", details: "AI Minutes increased to 10,000", user: "Super Admin", effect: "Immediate" },
      { date: "2026-03-15 14:20", action: "Renewed", details: "License renewed for 12 months", user: "System", effect: "Next billing cycle" },
      { date: "2026-01-15 10:00", action: "Override Applied", details: "Concurrent call limit increased to 15", user: "Admin User", effect: "Immediate" },
      { date: "2026-01-01 00:00", action: "Assigned", details: "Initial license assignment", user: "System", effect: "Immediate" },
    ],
    
    // Billing
    billingCycle: "Monthly",
    nextBillingDate: "2026-05-01",
    currentPlan: "Professional",
    monthlyRate: "$599",
  },
};

export function LicenseDetail() {
  const { licenseId } = useParams();
  const navigate = useNavigate();
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [effectTiming, setEffectTiming] = useState<"immediate" | "next-cycle">("immediate");
  
  // Get license data (mock - would be API call)
  const license = licenseData[licenseId as keyof typeof licenseData];
  
  if (!license) {
    return (
      <>
        <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Licenses" }, { label: "Not Found" }]} mode="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <KeyRound size={48} className="text-[#9E9E9E] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">License Not Found</h3>
            <p className="text-sm text-[#616161] mb-4">The license you're looking for doesn't exist.</p>
            <button onClick={() => navigate("/admin/licenses")} className="h-10 px-4 rounded-md bg-[#1565C0] text-white text-sm">
              Back to Licenses
            </button>
          </div>
        </div>
      </>
    );
  }
  
  const usagePercent = (license.usedCredits / license.totalCredits) * 100;
  const usersCount = license.users.length;
  const activeUsers = license.users.filter(u => u.status === "Active").length;
  
  return (
    <>
      <TopBar 
        breadcrumbs={[
          { label: "Dashboard" }, 
          { label: "Licenses", onClick: () => navigate("/admin/licenses") }, 
          { label: license.id }
        ]} 
        mode="admin" 
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">{license.id}</h1>
              <StatusBadge status={license.status} />
              {license.hasOverride && (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#E3F2FD] text-[#1565C0] rounded text-xs font-medium">
                  <ShieldCheck size={12} />
                  Override Active
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#616161]">
              <span className="font-medium">{license.tenant}</span>
              <ChevronRight size={14} />
              <button 
                onClick={() => navigate(`/admin/tenants/${license.tenantId}`)}
                className="text-[#1565C0] hover:underline"
              >
                {license.tenantId}
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowOverrideModal(true)}
              className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2"
            >
              <ShieldCheck size={16} />
              Override
            </button>
            <button className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5] text-sm flex items-center gap-2">
              <RotateCcw size={16} />
              Renew
            </button>
            <button 
              onClick={() => setShowSuspendModal(true)}
              className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#F57F17] hover:bg-[#FFF8E1] text-sm flex items-center gap-2"
            >
              <Ban size={16} />
              Suspend
            </button>
            <button 
              onClick={() => setShowTerminateModal(true)}
              className="h-10 px-4 rounded-md border border-[#C62828] text-[#C62828] hover:bg-[#FFEBEE] text-sm flex items-center gap-2"
            >
              <XCircle size={16} />
              Terminate
            </button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                <Sparkles size={20} className="text-[#1565C0]" />
              </div>
              <div>
                <div className="text-xs text-[#9E9E9E]">AI Credits</div>
                <div className="text-xl font-semibold">{license.usedCredits.toLocaleString()} / {license.totalCredits.toLocaleString()}</div>
              </div>
            </div>
            <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1565C0] transition-all" 
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="text-xs text-[#616161] mt-1">{usagePercent.toFixed(1)}% used</div>
          </div>
          
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex items-center justify-center">
                <Calendar size={20} className="text-[#6A1B9A]" />
              </div>
              <div>
                <div className="text-xs text-[#9E9E9E]">Days Remaining</div>
                <div className="text-xl font-semibold">{license.daysRemaining}</div>
                <div className="text-xs text-[#616161]">Until {license.validityEnd}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
                <UsersIcon size={20} className="text-[#2E7D32]" />
              </div>
              <div>
                <div className="text-xs text-[#9E9E9E]">Active Users</div>
                <div className="text-xl font-semibold">{activeUsers} / {license.userLimit}</div>
                <div className="text-xs text-[#616161]">{usersCount} total users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF3E0] flex items-center justify-center">
                <Phone size={20} className="text-[#F57F17]" />
              </div>
              <div>
                <div className="text-xs text-[#9E9E9E]">Concurrent Calls</div>
                <div className="text-xl font-semibold">{license.concurrentCallLimit}</div>
                <div className="text-xs text-[#616161]">Max allowed</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* License Configuration */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <KeyRound size={20} className="text-[#1565C0]" />
                License Configuration
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-[#9E9E9E] mb-1">License Type</div>
                  <div className="text-sm font-medium">{license.type}</div>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] mb-1">Current Plan</div>
                  <div className="text-sm font-medium">{license.currentPlan}</div>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] mb-1">Validity Period</div>
                  <div className="text-sm font-medium">{license.validityStart} — {license.validityEnd}</div>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] mb-1">Billing Cycle</div>
                  <div className="text-sm font-medium">{license.billingCycle} - {license.monthlyRate}</div>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] mb-1">Next Billing Date</div>
                  <div className="text-sm font-medium">{license.nextBillingDate}</div>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] mb-1">Agent Creation Limit</div>
                  <div className="text-sm font-medium">{license.agentCreationLimit} agents</div>
                </div>
              </div>
            </div>
            
            {/* Feature Modules */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-[#1565C0]" />
                Feature Modules Enabled
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(license.features).map(([key, enabled]) => {
                  const featureNames: Record<string, string> = {
                    aiCalling: "AI Calling",
                    whatsapp: "WhatsApp Integration",
                    smsMarketing: "SMS Marketing",
                    emailCampaigns: "Email Campaigns",
                  };
                  
                  const icons: Record<string, React.ReactNode> = {
                    aiCalling: <Phone size={16} />,
                    whatsapp: <MessageCircle size={16} />,
                    smsMarketing: <MessageCircle size={16} />,
                    emailCampaigns: <Mail size={16} />,
                  };
                  
                  return (
                    <div 
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        enabled 
                          ? "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]" 
                          : "bg-[#F5F5F5] border-[#E0E0E0] text-[#9E9E9E]"
                      }`}
                    >
                      {icons[key]}
                      <span className="text-sm font-medium">{featureNames[key]}</span>
                      {enabled && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-[#2E7D32] flex items-center justify-center">
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Override Information */}
            {license.hasOverride && (
              <div className="bg-[#E3F2FD] rounded-lg border border-[#1565C0] p-6">
                <div className="flex items-start gap-3 mb-3">
                  <ShieldCheck size={20} className="text-[#1565C0] mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#0F1B2D] mb-1">Override Active</h3>
                    <p className="text-sm text-[#616161] mb-3">{license.overrideReason}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#9E9E9E]">Applied on:</span>
                        <span className="ml-2 font-medium text-[#212121]">{license.overrideDate}</span>
                      </div>
                      <div>
                        <span className="text-[#9E9E9E]">Applied by:</span>
                        <span className="ml-2 font-medium text-[#212121]">{license.overrideBy}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[#1565C0] hover:text-[#0D47A1]">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Users Associated with License */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              <div className="p-6 border-b border-[#E0E0E0]">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <UsersIcon size={20} className="text-[#1565C0]" />
                  Users ({usersCount} / {license.userLimit})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F5F5] border-b">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {license.users.map(user => (
                      <tr key={user.id} className="border-b border-[#EEEEEE] hover:bg-[#F5F5F5]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                              <User size={16} className="text-[#1565C0]" />
                            </div>
                            <div>
                              <div className="font-medium text-[#212121]">{user.name}</div>
                              <div className="text-xs text-[#9E9E9E]">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded bg-[#E3F2FD] text-[#1565C0] text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3 text-[#616161] text-xs">
                          {user.lastLogin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Right Column - Activity & History */}
          <div className="space-y-6">
            {/* License State History */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity size={20} className="text-[#1565C0]" />
                License History
              </h2>
              
              <div className="space-y-4">
                {license.history.map((event, idx) => (
                  <div key={idx} className="relative pl-6 pb-4 border-l-2 border-[#E0E0E0] last:border-l-0 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1565C0] border-2 border-white" />
                    <div className="text-xs text-[#9E9E9E] mb-1">{event.date}</div>
                    <div className="text-sm font-medium text-[#212121] mb-1">{event.action}</div>
                    <div className="text-xs text-[#616161] mb-2">{event.details}</div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[#9E9E9E]">By: <span className="text-[#212121]">{event.user}</span></span>
                      <span className={`px-2 py-0.5 rounded ${
                        event.effect === "Immediate" 
                          ? "bg-[#FFF3E0] text-[#F57F17]" 
                          : "bg-[#E3F2FD] text-[#1565C0]"
                      }`}>
                        {event.effect}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowSuspendModal(false)}>
          <div className="bg-white rounded-xl max-w-[540px] w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Suspend License</h3>
              <button onClick={() => setShowSuspendModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-md p-3 flex items-start gap-2">
                <AlertTriangle size={16} className="text-[#F57F17] mt-0.5" />
                <span className="text-sm text-[#F57F17]">
                  Suspending this license will immediately disable access for {license.tenant}
                </span>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">Effect Timing</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="radio" 
                      name="effect" 
                      value="immediate"
                      checked={effectTiming === "immediate"}
                      onChange={(e) => setEffectTiming(e.target.value as "immediate")}
                    />
                    <span>Immediate Effect</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="radio" 
                      name="effect" 
                      value="next-cycle"
                      checked={effectTiming === "next-cycle"}
                      onChange={(e) => setEffectTiming(e.target.value as "next-cycle")}
                    />
                    <span>Next Billing Cycle ({license.nextBillingDate})</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Suspension Reason <span className="text-[#C62828]">*</span>
                </label>
                <textarea 
                  className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                  rows={3}
                  placeholder="Provide detailed reason for suspension..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowSuspendModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                Cancel
              </button>
              <button className="h-10 px-5 rounded-md bg-[#F57F17] text-white text-sm hover:bg-[#E65100]">
                Suspend License
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Terminate Modal */}
      {showTerminateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowTerminateModal(false)}>
          <div className="bg-white rounded-xl max-w-[540px] w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Terminate License</h3>
              <button onClick={() => setShowTerminateModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-md p-3 flex items-start gap-2">
                <AlertTriangle size={16} className="text-[#C62828] mt-0.5" />
                <div className="text-sm text-[#C62828]">
                  <div className="font-semibold mb-1">Warning: This action cannot be undone</div>
                  <div>Terminating will permanently revoke access and may result in data loss</div>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">Effect Timing</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="radio" 
                      name="effect" 
                      value="immediate"
                      checked={effectTiming === "immediate"}
                      onChange={(e) => setEffectTiming(e.target.value as "immediate")}
                    />
                    <span>Immediate Effect</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="radio" 
                      name="effect" 
                      value="next-cycle"
                      checked={effectTiming === "next-cycle"}
                      onChange={(e) => setEffectTiming(e.target.value as "next-cycle")}
                    />
                    <span>Next Billing Cycle ({license.nextBillingDate})</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Termination Reason <span className="text-[#C62828]">*</span>
                </label>
                <textarea 
                  className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                  rows={3}
                  placeholder="Provide detailed reason for termination..."
                />
              </div>
              
              <div className="bg-[#F5F5F5] rounded-md p-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  <span>I understand this action is permanent and cannot be reversed</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowTerminateModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                Cancel
              </button>
              <button className="h-10 px-5 rounded-md bg-[#C62828] text-white text-sm hover:bg-[#B71C1C]">
                Terminate License
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowOverrideModal(false)}>
          <div className="bg-white rounded-xl max-w-[640px] w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Override License Limits</h3>
              <button onClick={() => setShowOverrideModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#616161]">Adjust limits for {license.tenant}</p>
              
              {[
                { label: "Total AI Credits", current: license.totalCredits.toLocaleString(), field: "credits" },
                { label: "Concurrent Call Limit", current: license.concurrentCallLimit.toString(), field: "calls" },
                { label: "Agent Creation Limit", current: license.agentCreationLimit.toString(), field: "agents" },
                { label: "User Limit", current: license.userLimit.toString(), field: "users" },
              ].map(item => (
                <div key={item.field} className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium">{item.label}</label>
                  <div className="text-sm text-[#9E9E9E]">Current: {item.current}</div>
                  <input 
                    className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" 
                    placeholder="New value"
                    type="number"
                  />
                </div>
              ))}
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Override Reason <span className="text-[#C62828]">*</span>
                </label>
                <textarea 
                  className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                  rows={3}
                  placeholder="Minimum 20 characters required..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowOverrideModal(false)} className="h-10 px-4 rounded-md border border-[#1565C0] text-[#1565C0] text-sm">
                Cancel
              </button>
              <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm">
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
