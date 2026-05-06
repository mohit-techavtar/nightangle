import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SkeletonStatCard, SkeletonTable } from "../../components/ui/Skeleton";
import {
  Building2, CheckCircle2, AlertTriangle, XCircle, PhoneCall,
  Search, Filter, Download, Plus, Eye, Pencil, Pause, MoreHorizontal, ChevronLeft, ChevronRight,
  Lock, Trash2, RotateCcw, ShieldAlert
} from "lucide-react";

const tenants = [
  { id: "TNT-00042", name: "Everest Digital Solutions Pvt. Ltd.", contact: "Rajesh Sharma", email: "rajesh@everestdigital.com", plan: "Growth", status: "Active", aiUsed: 7840, aiTotal: 10000, expiry: "2026-12-31" },
  { id: "TNT-00038", name: "Himalayan Tech Services", contact: "Sita Thapa", email: "sita@himalayantech.com", plan: "Enterprise", status: "Active", aiUsed: 42100, aiTotal: 50000, expiry: "2026-09-15" },
  { id: "TNT-00035", name: "KTM Software Labs", contact: "Amit Poudel", email: "amit@ktmsoftware.com", plan: "Starter", status: "Suspended", aiUsed: 4200, aiTotal: 5000, expiry: "2026-04-01" },
  { id: "TNT-00029", name: "Nepal Cloud Computing", contact: "Priya Basnet", email: "priya@nepalcloud.com", plan: "Growth", status: "Expired", aiUsed: 10000, aiTotal: 10000, expiry: "2026-03-20" },
  { id: "TNT-00025", name: "Pokhara InfoTech Solutions", contact: "Bikash Gurung", email: "bikash@pokharainfotech.com", plan: "Enterprise", status: "Active", aiUsed: 15200, aiTotal: 50000, expiry: "2026-11-30" },
  { id: "TNT-00021", name: "Lumbini Digital Agency", contact: "Meera Pandey", email: "meera@lumbinidigital.com", plan: "Starter", status: "Active", aiUsed: 3100, aiTotal: 5000, expiry: "2026-08-15" },
  { id: "TNT-00018", name: "Chitwan Business Solutions", contact: "Suresh KC", email: "suresh@chitwanbiz.com", plan: "Growth", status: "Pending Renewal", aiUsed: 8900, aiTotal: 10000, expiry: "2026-04-05" },
  { id: "TNT-00015", name: "Biratnagar Tech Hub", contact: "Anita Rai", email: "anita@biratnagartech.com", plan: "Starter", status: "Locked", aiUsed: 5000, aiTotal: 5000, expiry: "2026-03-10" },
];

const planColors: Record<string, string> = {
  Starter: "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]",
  Growth: "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]",
  Enterprise: "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]",
};

export function TenantList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<typeof tenants[0] | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getExpiryClass = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "text-[#C62828] font-medium";
    if (diff < 7) return "text-[#C62828]";
    if (diff < 30) return "text-[#F57F17]";
    return "text-[#212121]";
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Tenants" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-5 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 max-md:gap-3 mb-6 max-md:mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonStatCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 max-md:gap-3 mb-6 max-md:mb-4">
            <StatCard title="Total Tenants" value="248" icon={Building2} color="primary" />
            <StatCard title="Active Tenants" value="215" icon={CheckCircle2} color="success" />
            <StatCard title="Expiring Soon" value="12" icon={AlertTriangle} color="warning" subtitle="Within 30 days" />
            <StatCard title="Suspended / Locked" value="8" icon={XCircle} color="error" />
            <StatCard title="AI Minutes Today" value="45,230" icon={PhoneCall} color="info" />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-4 max-md:flex-col max-md:items-stretch max-md:gap-3">
          <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
            <div className="relative max-md:w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
              <input
                type="text"
                placeholder="Search by company name, code, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 pr-4 w-[360px] max-md:w-full border border-[#E0E0E0] rounded-md bg-white text-sm focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] outline-none transition"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="h-10 px-4 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-2 text-sm transition">
              <Filter size={16} /> Filters
            </button>
          </div>
          <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
            <button onClick={() => navigate("/admin/tenants/create")} className="h-10 px-5 rounded-md bg-[#1565C0] text-white hover:bg-[#0D47A1] flex items-center gap-2 text-sm transition">
              <Plus size={16} /> Create Tenant
            </button>
            <button className="h-10 px-4 rounded-md text-[#1565C0] hover:bg-[#E3F2FD] flex items-center gap-2 text-sm transition">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 mb-4 grid grid-cols-5 gap-4">
            <div>
              <label className="block mb-1 text-[#212121]">Status</label>
              <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                <option>All Statuses</option>
                <option>Active</option><option>Suspended</option><option>Expired</option><option>Locked</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[#212121]">Plan</label>
              <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                <option>All Plans</option><option>Starter</option><option>Growth</option><option>Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[#212121]">Created From</label>
              <input type="date" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white" />
            </div>
            <div>
              <label className="block mb-1 text-[#212121]">Industry</label>
              <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                <option>All Industries</option><option>Technology</option><option>Finance</option><option>Healthcare</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button className="h-10 px-4 text-sm text-[#1565C0] hover:underline">Clear All</button>
              <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Apply</button>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <SkeletonTable rows={8} columns={9} />
        ) : (
          <div className="bg-white rounded-lg border border-[#E0E0E0] shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F5F5] border-b border-[#EEEEEE]">
                    <th className="w-[4%] h-11 px-3"><input type="checkbox" className="rounded" /></th>
                    <th className="w-[10%] h-11 px-3 text-left text-[12px] font-semibold text-[#616161] uppercase tracking-wider">Tenant Code</th>
                    <th className="w-[20%] h-11 px-3 text-left text-[12px] font-semibold text-[#616161] uppercase tracking-wider">Company Name</th>
                    <th className="w-[14%] h-11 px-3 text-left text-[12px] font-semibold text-[#616161] uppercase tracking-wider">Primary Contact</th>
                    <th className="w-[10%] h-11 px-3 text-left text-[12px] font-semibold text-[#616161] uppercase tracking-wider">Plan</th>
                    <th className="w-[8%] h-11 px-3 text-left text-[12px] font-semibold text-[#616161] uppercase tracking-wider">Status</th>
                    <th className="w-[14%] h-11 px-3 text-left text-[12px] font-semibold text-[#616161] uppercase tracking-wider">AI Min Used</th>
                    <th className="w-[10%] h-11 px-3 text-left text-[12px] font-semibold text-[#616161] uppercase tracking-wider">Expiry Date</th>
                    <th className="w-[10%] h-11 px-3 text-right text-[12px] font-semibold text-[#616161] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b border-[#EEEEEE] h-[52px] hover:bg-[#F5F5F5] group relative transition-colors">
                      <td className="px-3"><input type="checkbox" className="rounded" /></td>
                      <td className="px-3">
                        <button onClick={() => navigate("/admin/tenants/detail")} className="font-mono text-sm text-[#1565C0] hover:underline">{t.id}</button>
                      </td>
                      <td className="px-3">
                        <button onClick={() => navigate("/admin/tenants/detail")} className="text-sm font-semibold text-[#212121] hover:text-[#1565C0] text-left">{t.name}</button>
                      </td>
                      <td className="px-3">
                        <div className="text-sm text-[#212121]">{t.contact}</div>
                        <div className="text-xs text-[#616161]">{t.email}</div>
                      </td>
                      <td className="px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${planColors[t.plan]}`}>{t.plan}</span>
                      </td>
                      <td className="px-3"><StatusBadge status={t.status} /></td>
                      <td className="px-3"><ProgressBar value={t.aiUsed} max={t.aiTotal} /></td>
                      <td className="px-3"><span className={`text-sm ${getExpiryClass(t.expiry)}`}>{t.expiry}</span></td>
                      <td className="px-3">
                        <div className="flex items-center justify-end gap-1 relative">
                          <button 
                            onClick={() => navigate("/admin/tenants/detail")} 
                            className="w-8 h-8 rounded-md border border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]" 
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => navigate("/admin/tenants/edit")} 
                            className="w-8 h-8 rounded-md border border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]" 
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setShowActionMenu(showActionMenu === t.id ? null : t.id)} 
                              className="w-8 h-8 rounded-md border border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]" 
                              title="More"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {showActionMenu === t.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-[#E0E0E0] z-10">
                                {t.status === "Active" && (
                                  <>
                                    <button 
                                      onClick={() => { setSelectedTenant(t); setShowSuspendModal(true); setShowActionMenu(null); }}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#F57F17] hover:bg-[#FFF8E1] transition-colors"
                                    >
                                      <Pause size={14} /> Suspend Tenant
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedTenant(t); setShowLockModal(true); setShowActionMenu(null); }}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#9E9E9E] hover:bg-[#F5F5F5] transition-colors"
                                    >
                                      <Lock size={14} /> Lock Tenant
                                    </button>
                                  </>
                                )}
                                {(t.status === "Suspended" || t.status === "Locked") && (
                                  <button 
                                    onClick={() => { setSelectedTenant(t); setShowRestoreModal(true); setShowActionMenu(null); }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                                  >
                                    <RotateCcw size={14} /> Restore Access
                                  </button>
                                )}
                                <div className="border-t border-[#EEEEEE] my-1" />
                                <button 
                                  onClick={() => { setSelectedTenant(t); setShowDeleteModal(true); setShowActionMenu(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                                >
                                  <Trash2 size={14} /> Soft Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1565C0] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#EEEEEE]">
              <span className="text-sm text-[#616161]">Showing 1-{filtered.length} of 248</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded border border-[#E0E0E0] flex items-center justify-center text-[#9E9E9E]"><ChevronLeft size={16} /></button>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} className={`w-8 h-8 rounded text-sm ${p === 1 ? "bg-[#1565C0] text-white" : "border border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>{p}</button>
                ))}
                <button className="w-8 h-8 rounded border border-[#E0E0E0] flex items-center justify-center text-[#616161]"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Suspend Modal */}
      {showSuspendModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowSuspendModal(false)}>
          <div className="bg-white rounded-xl max-w-[540px] w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Suspend Tenant</h3>
              <button onClick={() => setShowSuspendModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-md p-3 flex items-start gap-2">
                <AlertTriangle size={16} className="text-[#F57F17] mt-0.5" />
                <div className="text-sm text-[#F57F17]">
                  <div className="font-semibold mb-1">Warning</div>
                  <div>Suspending {selectedTenant.name} will immediately disable all access and pause active campaigns.</div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Suspension Reason <span className="text-[#C62828]">*</span>
                </label>
                <textarea 
                  className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                  rows={3}
                  placeholder="Provide detailed reason for suspension (minimum 20 characters)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowSuspendModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                Cancel
              </button>
              <button className="h-10 px-5 rounded-md bg-[#F57F17] text-white text-sm hover:bg-[#E65100]">
                Suspend Tenant
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lock Modal */}
      {showLockModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowLockModal(false)}>
          <div className="bg-white rounded-xl max-w-[540px] w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Lock Tenant</h3>
              <button onClick={() => setShowLockModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-md p-3 flex items-start gap-2">
                <ShieldAlert size={16} className="text-[#C62828] mt-0.5" />
                <div className="text-sm text-[#C62828]">
                  <div className="font-semibold mb-1">Compliance or Security Lock</div>
                  <div>Locking {selectedTenant.name} indicates a compliance or security violation. This will require Super Admin review for restoration.</div>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">Lock Reason Category</label>
                <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option>Compliance Violation</option>
                  <option>Security Breach</option>
                  <option>Payment Fraud</option>
                  <option>Terms of Service Violation</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Detailed Reason <span className="text-[#C62828]">*</span>
                </label>
                <textarea 
                  className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                  rows={3}
                  placeholder="Provide detailed reason for lock (minimum 20 characters)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowLockModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                Cancel
              </button>
              <button className="h-10 px-5 rounded-md bg-[#C62828] text-white text-sm hover:bg-[#B71C1C]">
                Lock Tenant
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Restore Modal */}
      {showRestoreModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowRestoreModal(false)}>
          <div className="bg-white rounded-xl max-w-[540px] w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Restore Tenant Access</h3>
              <button onClick={() => setShowRestoreModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#E8F5E9] border border-[#81C784] rounded-md p-3 flex items-start gap-2">
                <RotateCcw size={16} className="text-[#2E7D32] mt-0.5" />
                <div className="text-sm text-[#2E7D32]">
                  <div className="font-semibold mb-1">Restore Access</div>
                  <div>Restoring access to {selectedTenant.name} will reactivate their account and resume all services.</div>
                </div>
              </div>
              
              <div className="bg-[#F5F5F5] rounded-md p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-[#616161]">Tenant:</span> <span className="font-medium text-[#212121]">{selectedTenant.name}</span></div>
                  <div><span className="text-[#616161]">Current Status:</span> <span className="font-medium text-[#F57F17]">{selectedTenant.status}</span></div>
                  <div><span className="text-[#616161]">Tenant ID:</span> <span className="font-mono text-[#1565C0]">{selectedTenant.id}</span></div>
                  <div><span className="text-[#616161]">Plan:</span> <span className="font-medium text-[#212121]">{selectedTenant.plan}</span></div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Restoration Notes
                </label>
                <textarea 
                  className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                  rows={2}
                  placeholder="Optional: Add notes about restoration reason..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowRestoreModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                Cancel
              </button>
              <button className="h-10 px-5 rounded-md bg-[#2E7D32] text-white text-sm hover:bg-[#1B5E20]">
                Restore Access
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Soft Delete Modal */}
      {showDeleteModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-xl max-w-[540px] w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Soft Delete Tenant</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-md p-3 flex items-start gap-2">
                <AlertTriangle size={16} className="text-[#C62828] mt-0.5" />
                <div className="text-sm text-[#C62828]">
                  <div className="font-semibold mb-1">Important Information</div>
                  <div>Soft deleting {selectedTenant.name} will hide the tenant but retain all data for the configured retention period. Hard deletion can only be performed by backend administrators.</div>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">Retention Period</label>
                <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                </select>
                <p className="text-xs text-[#616161] mt-1">Data will be retained and recoverable during this period</p>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Deletion Reason <span className="text-[#C62828]">*</span>
                </label>
                <textarea 
                  className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                  rows={3}
                  placeholder="Provide detailed reason for soft deletion..."
                />
              </div>
              
              <div className="bg-[#F5F5F5] rounded-md p-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>I understand this action will hide the tenant and all associated data</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowDeleteModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                Cancel
              </button>
              <button className="h-10 px-5 rounded-md bg-[#C62828] text-white text-sm hover:bg-[#B71C1C]">
                Soft Delete Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}