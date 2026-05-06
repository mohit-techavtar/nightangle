import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Plus, Pencil, MoreHorizontal, LayoutGrid, List, Check, X, Copy, Archive, Eye, Loader2, AlertTriangle } from "lucide-react";

const plans = [
  { name: "Starter", code: "PLAN-STR-001", status: "Published", price: "NPR 15,000", cycle: "/mo", minutes: "5,000", agents: 5, concurrent: 5, features: 7, total: 12, color: "border-l-4 border-l-[#E0E0E0]" },
  { name: "Growth", code: "PLAN-GRW-001", status: "Published", price: "NPR 35,000", cycle: "/mo", minutes: "15,000", agents: 15, concurrent: 15, features: 10, total: 12, color: "border-l-4 border-l-[#1565C0]" },
  { name: "Enterprise", code: "PLAN-ENT-001", status: "Published", price: "NPR 75,000", cycle: "/mo", minutes: "50,000", agents: 50, concurrent: 50, features: 12, total: 12, color: "border-l-4 border-l-[#F57F17]" },
  { name: "Custom", code: "PLAN-CST-001", status: "Draft", price: "Custom", cycle: "", minutes: "Custom", agents: 0, concurrent: 0, features: 0, total: 12, color: "border-l-4 border-l-[#9E9E9E]" },
];

export function SubscriptionPlans() {
  const [view, setView] = useState<"card" | "table">("card");
  const [showCreate, setShowCreate] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <TopBar breadcrumbs={[{ label: "Dashboard" }, { label: "Subscription Plans" }]} mode="admin" />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1>Subscription Plans</h1>
          <div className="flex items-center gap-3">
            <div className="flex border border-[#E0E0E0] rounded-md overflow-hidden">
              <button onClick={() => setView("card")} className={`w-9 h-9 flex items-center justify-center ${view === "card" ? "bg-[#1565C0] text-white" : "bg-white text-[#616161]"}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setView("table")} className={`w-9 h-9 flex items-center justify-center ${view === "table" ? "bg-[#1565C0] text-white" : "bg-white text-[#616161]"}`}><List size={16} /></button>
            </div>
            <button onClick={() => setShowCreate(true)} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1] flex items-center gap-2">
              <Plus size={16} /> Create New Plan
            </button>
          </div>
        </div>

        {view === "card" ? (
          <div className="grid grid-cols-3 gap-5">
            {plans.map(plan => (
              <div key={plan.code} className={`bg-white rounded-lg border border-[#E0E0E0] ${plan.color} shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow overflow-hidden`}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3>{plan.name}</h3>
                      <div className="font-mono text-xs text-[#9E9E9E] mt-0.5">{plan.code}</div>
                    </div>
                    <StatusBadge status={plan.status} />
                  </div>
                  <div className="text-2xl font-bold text-[#212121] mb-1">{plan.price}<span className="text-sm font-normal text-[#616161]">{plan.cycle}</span></div>
                  <div className="space-y-1.5 text-sm text-[#616161] mt-3">
                    <div>{plan.minutes} AI Minutes</div>
                    <div>{plan.agents} Agents · {plan.concurrent} Concurrent Calls</div>
                    <div>{plan.features}/{plan.total} Features</div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#EEEEEE] bg-[#FAFAFA]">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate(`/admin/subscription-plans/${plan.code}`)}
                      className="text-sm text-[#1565C0] hover:underline flex items-center gap-1"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/subscription-plans/edit/${plan.code}`)}
                      className="text-sm text-[#1565C0] hover:underline flex items-center gap-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowActionMenu(showActionMenu === plan.code ? null : plan.code)}
                      className="w-8 h-8 rounded-md border border-[#E0E0E0] flex items-center justify-center text-[#616161] hover:bg-[#F5F5F5]"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    
                    {showActionMenu === plan.code && (
                      <div className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-md shadow-lg border border-[#E0E0E0] z-10">
                        <button 
                          onClick={() => { setSelectedPlan(plan); setShowDuplicateModal(true); setShowActionMenu(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#212121] hover:bg-[#F5F5F5] transition-colors"
                        >
                          <Copy size={14} /> Duplicate Plan
                        </button>
                        {plan.status === "Draft" && (
                          <button 
                            onClick={() => { setSelectedPlan(plan); setShowPublishModal(true); setShowActionMenu(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                          >
                            <Check size={14} /> Publish Plan
                          </button>
                        )}
                        {plan.status === "Published" && (
                          <button 
                            onClick={() => { setSelectedPlan(plan); setShowArchiveModal(true); setShowActionMenu(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                          >
                            <Archive size={14} /> Archive Plan
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Create new plan card */}
            <button onClick={() => setShowCreate(true)} className="border-2 border-dashed border-[#E0E0E0] rounded-lg flex flex-col items-center justify-center min-h-[280px] hover:border-[#1565C0] hover:bg-[#FAFAFA] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
                <Plus size={24} className="text-[#616161]" />
              </div>
              <span className="text-sm font-medium text-[#616161]">Create New Plan</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] border-b">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Plan Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">AI Minutes</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Limits</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Features</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#616161] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(p => (
                  <tr key={p.code} className="border-b border-[#EEEEEE] h-[52px] hover:bg-[#F5F5F5]">
                    <td className="px-4 font-semibold">{p.name}</td>
                    <td className="px-4 font-mono text-xs text-[#616161]">{p.code}</td>
                    <td className="px-4">{p.price}{p.cycle}</td>
                    <td className="px-4">{p.minutes}</td>
                    <td className="px-4 text-[#616161]">{p.agents}A / {p.concurrent}C</td>
                    <td className="px-4">{p.features}/{p.total}</td>
                    <td className="px-4"><StatusBadge status={p.status} /></td>
                    <td className="px-4 text-right">
                      <button 
                        onClick={() => navigate(`/admin/subscription-plans/${p.code}`)}
                        className="w-8 h-8 rounded-md border border-[#E0E0E0] inline-flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE] mr-1" 
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/subscription-plans/edit/${p.code}`)}
                        className="w-8 h-8 rounded-md border border-[#E0E0E0] inline-flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE] mr-1" 
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <div className="relative inline-block">
                        <button 
                          onClick={() => setShowActionMenu(showActionMenu === p.code ? null : p.code)}
                          className="w-8 h-8 rounded-md border border-[#E0E0E0] inline-flex items-center justify-center text-[#616161] hover:bg-[#EEEEEE]" 
                          title="More"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        
                        {showActionMenu === p.code && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-[#E0E0E0] z-10">
                            <button 
                              onClick={() => { setSelectedPlan(p); setShowDuplicateModal(true); setShowActionMenu(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#212121] hover:bg-[#F5F5F5] transition-colors"
                            >
                              <Copy size={14} /> Duplicate Plan
                            </button>
                            {p.status === "Draft" && (
                              <button 
                                onClick={() => { setSelectedPlan(p); setShowPublishModal(true); setShowActionMenu(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                              >
                                <Check size={14} /> Publish Plan
                              </button>
                            )}
                            {p.status === "Published" && (
                              <button 
                                onClick={() => { setSelectedPlan(p); setShowArchiveModal(true); setShowActionMenu(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                              >
                                <Archive size={14} /> Archive Plan
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
            <div className="bg-white rounded-xl max-w-[640px] w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
                <h3>Create New Plan</h3>
                <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-md hover:bg-[#F5F5F5] flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Plan Name <span className="text-[#C62828]">*</span></label>
                    <input className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" placeholder="e.g., Premium" />
                  </div>
                  <div>
                    <label className="block mb-1">Tier <span className="text-[#C62828]">*</span></label>
                    <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                      <option>Starter</option><option>Growth</option><option>Enterprise</option><option>Custom</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" rows={2} placeholder="Plan description" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1">Base Price <span className="text-[#C62828]">*</span></label>
                    <input type="number" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" placeholder="35000" />
                  </div>
                  <div>
                    <label className="block mb-1">Currency</label>
                    <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"><option>NPR</option><option>USD</option></select>
                  </div>
                  <div>
                    <label className="block mb-1">Billing Cycle</label>
                    <select className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"><option>Monthly</option><option>Yearly</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Included AI Minutes <span className="text-[#C62828]">*</span></label>
                    <input type="number" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" placeholder="15000" />
                  </div>
                  <div>
                    <label className="block mb-1">Max Agents</label>
                    <input type="number" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" placeholder="15" />
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Feature Modules</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["AI Calling", "WhatsApp", "Campaign Mgmt", "Basic CRM", "Advanced CRM", "Basic Analytics", "Advanced Analytics", "Call Recording", "API Access", "Webhooks", "Custom IVR", "Sentiment Analysis"].map(f => (
                      <label key={f} className="flex items-center gap-2 text-sm text-[#212121] cursor-pointer">
                        <input type="checkbox" className="rounded border-[#E0E0E0]" />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E0E0E0]">
                <button onClick={() => setShowCreate(false)} className="h-10 px-4 rounded-md border border-[#1565C0] text-[#1565C0] text-sm">Cancel</button>
                <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Create Plan</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Duplicate Modal */}
        {showDuplicateModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDuplicateModal(false)}>
            <div className="bg-white rounded-xl max-w-[540px] w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Duplicate Plan</h3>
                <button onClick={() => setShowDuplicateModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-md p-3 flex items-start gap-2">
                  <Copy size={16} className="text-[#1565C0] mt-0.5" />
                  <div className="text-sm text-[#1565C0]">
                    <div className="font-semibold mb-1">Duplicate Plan</div>
                    <div>Create a copy of "{selectedPlan.name}" plan with all settings. You can modify it after creation.</div>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    New Plan Name <span className="text-[#C62828]">*</span>
                  </label>
                  <input 
                    className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" 
                    placeholder={`${selectedPlan.name} Copy`}
                    defaultValue={`${selectedPlan.name} Copy`}
                  />
                </div>
                
                <div className="bg-[#F5F5F5] rounded-md p-3 text-sm">
                  <div className="font-medium text-[#212121] mb-2">What will be duplicated:</div>
                  <ul className="space-y-1 text-[#616161]">
                    <li>✓ Pricing and billing settings</li>
                    <li>✓ Resource limits</li>
                    <li>✓ Feature module configuration</li>
                    <li className="text-[#9E9E9E]">✗ Active tenant assignments</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={() => setShowDuplicateModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                  Cancel
                </button>
                <button className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
                  Duplicate Plan
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Publish Modal */}
        {showPublishModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowPublishModal(false)}>
            <div className="bg-white rounded-xl max-w-[540px] w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Publish Plan</h3>
                <button onClick={() => setShowPublishModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[#E8F5E9] border border-[#81C784] rounded-md p-3 flex items-start gap-2">
                  <Check size={16} className="text-[#2E7D32] mt-0.5" />
                  <div className="text-sm text-[#2E7D32]">
                    <div className="font-semibold mb-1">Publish Plan</div>
                    <div>Publishing "{selectedPlan.name}" will make it available for new tenant subscriptions.</div>
                  </div>
                </div>
                
                <div className="bg-[#F5F5F5] rounded-md p-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-[#616161]">Plan:</span> <span className="font-medium text-[#212121]">{selectedPlan.name}</span></div>
                    <div><span className="text-[#616161]">Code:</span> <span className="font-mono text-[#1565C0]">{selectedPlan.code}</span></div>
                    <div><span className="text-[#616161]">Price:</span> <span className="font-medium text-[#212121]">{selectedPlan.price}{selectedPlan.cycle}</span></div>
                    <div><span className="text-[#616161]">AI Minutes:</span> <span className="font-medium text-[#212121]">{selectedPlan.minutes}</span></div>
                  </div>
                </div>
                
                <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-md p-3 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-[#F57F17] mt-0.5" />
                  <div className="text-sm text-[#F57F17]">
                    Once published, this plan will be visible to all new tenants during subscription selection.
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={() => setShowPublishModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                  Cancel
                </button>
                <button className="h-10 px-5 rounded-md bg-[#2E7D32] text-white text-sm hover:bg-[#1B5E20]">
                  Publish Plan
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Archive Modal */}
        {showArchiveModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowArchiveModal(false)}>
            <div className="bg-white rounded-xl max-w-[540px] w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Archive Plan</h3>
                <button onClick={() => setShowArchiveModal(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-md p-3 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-[#C62828] mt-0.5" />
                  <div className="text-sm text-[#C62828]">
                    <div className="font-semibold mb-1">Important</div>
                    <div>Archiving "{selectedPlan.name}" will prevent new tenant subscriptions but existing tenants will continue service.</div>
                  </div>
                </div>
                
                <div className="bg-[#F5F5F5] rounded-md p-3 text-sm">
                  <div className="font-medium text-[#212121] mb-2">What happens after archiving:</div>
                  <ul className="space-y-1 text-[#616161]">
                    <li>✓ Existing tenants remain unaffected</li>
                    <li>✓ Plan hidden from new subscriptions</li>
                    <li>✓ Can be restored later if needed</li>
                    <li>✗ Cannot assign to new tenants</li>
                  </ul>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Archive Reason
                  </label>
                  <textarea 
                    className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" 
                    rows={2}
                    placeholder="Optional: Provide reason for archiving this plan..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={() => setShowArchiveModal(false)} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm">
                  Cancel
                </button>
                <button className="h-10 px-5 rounded-md bg-[#C62828] text-white text-sm hover:bg-[#B71C1C]">
                  Archive Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}