import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Mail, Phone, Building2, MapPin, Calendar, Edit3, Trash2, MoreVertical,
  Star, MessageSquare, FileText, Briefcase, CheckCircle2, Clock, User,
  ChevronRight, Plus, Send, PhoneCall, Activity, Tag, ExternalLink, X,
  TrendingUp, DollarSign, AlertCircle
} from "lucide-react";

// Mock detailed contact (in a real app, this would come from a hook by id)
const MOCK_CONTACT = {
  id: "1",
  name: "Sarah Jenkins",
  title: "VP of Engineering",
  email: "sarah.j@techflow.io",
  phone: "+1 (555) 012-3456",
  mobile: "+1 (555) 999-8888",
  company: "TechFlow Inc.",
  companyId: "acc-1",
  department: "Engineering",
  reportsTo: "Marcus Rodriguez (CTO)",
  status: "Active",
  tags: ["Decision Maker", "Enterprise", "Champion"],
  rating: "Hot",
  leadSource: "Web — Demo Request",
  ownerId: "u-1",
  ownerName: "Rajesh Sharma",
  description: "Primary technical decision maker for the CRM evaluation. Strong advocate for SaaS adoption.",
  birthdate: "1985-04-12",
  mailingAddress: { street: "1234 Market Street, Suite 800", city: "San Francisco", state: "CA", country: "USA", postalCode: "94102" },
  social: { linkedin: "https://linkedin.com/in/sarahjenkins", twitter: "@sjenkins" },
  createdAt: "2025-08-12T10:30:00Z",
  lastActivity: "2 hours ago",
  avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHdvbWFufGVufDF8fHx8MTc3NDUzNDAyOHww&ixlib=rb-4.1.0&q=80&w=1080",
};

const RELATED_DEALS = [
  { id: "d1", name: "TechFlow Enterprise Q1", amount: 45000, stage: "Proposal Sent", probability: 60, closeDate: "2026-06-30" },
  { id: "d2", name: "TechFlow Add-on: AI Calling", amount: 12000, stage: "Negotiation", probability: 80, closeDate: "2026-05-15" },
];

const RELATED_ACTIVITIES = [
  { id: "a1", type: "call", title: "Discovery call completed", description: "Discussed CRM requirements; she wants AI calling features.", timestamp: "2 hours ago", user: "Rajesh Sharma" },
  { id: "a2", type: "email", title: "Proposal sent via email", description: "Sent v2 of the enterprise proposal with custom pricing.", timestamp: "Yesterday", user: "Rajesh Sharma" },
  { id: "a3", type: "meeting", title: "Demo scheduled", description: "Product demo scheduled for Thursday 2 PM PT.", timestamp: "3 days ago", user: "Priya Iyer" },
  { id: "a4", type: "note", title: "Internal note added", description: "Sarah mentioned budget approval timeline is March.", timestamp: "1 week ago", user: "Rajesh Sharma" },
  { id: "a5", type: "email", title: "Initial outreach email", description: "First email response from web form.", timestamp: "2 weeks ago", user: "System" },
];

const RELATED_FILES = [
  { id: "f1", name: "Enterprise_Proposal_v2.pdf", size: "1.2 MB", type: "pdf", uploadedAt: "Yesterday" },
  { id: "f2", name: "TechFlow_Requirements.docx", size: "340 KB", type: "doc", uploadedAt: "3 days ago" },
];

type Tab = "activity" | "deals" | "files" | "notes" | "emails";

const ACTIVITY_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  call:    { icon: PhoneCall,    color: "text-[#1565C0]", bg: "bg-[#E3F2FD]" },
  email:   { icon: Mail,         color: "text-[#7B1FA2]", bg: "bg-[#F3E5F5]" },
  meeting: { icon: Calendar,     color: "text-[#2E7D32]", bg: "bg-[#E8F5E9]" },
  note:    { icon: MessageSquare,color: "text-[#F57F17]", bg: "bg-[#FFF8E1]" },
  task:    { icon: CheckCircle2, color: "text-[#0277BD]", bg: "bg-[#E1F5FE]" },
};

export function ContactDetail() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const contact = MOCK_CONTACT; // would be: getContactById(params.id);
  const [activeTab, setActiveTab] = useState<Tab>("activity");
  const [isFollowing, setIsFollowing] = useState(true);

  return (
    <div className="h-full flex flex-col bg-[#F5F5F5]">
      {/* Highlights Header — Salesforce style */}
      <div className="bg-white border-b border-[#E0E0E0]">
        <div className="px-6 py-3 flex items-center gap-2 text-xs text-[#616161]">
          <button onClick={() => navigate("/tenant/contacts")} className="flex items-center gap-1 hover:text-[#1565C0]">
            <ArrowLeft size={14} /> Contacts
          </button>
          <ChevronRight size={12} />
          <span className="text-[#212121] font-medium">{contact.name}</span>
        </div>

        <div className="px-6 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <img src={contact.avatar} alt={contact.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold text-[#212121]">{contact.name}</h1>
                {contact.rating === "Hot" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
                    <Star size={11} className="fill-current" /> Hot
                  </span>
                )}
                <button onClick={() => setIsFollowing(!isFollowing)} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isFollowing ? "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]" : "bg-white text-[#616161] border-[#E0E0E0]"}`}>
                  {isFollowing ? "✓ Following" : "+ Follow"}
                </button>
              </div>
              <div className="text-sm text-[#616161] mt-0.5">{contact.title} at {contact.company}</div>

              {/* Highlights row — Salesforce-style key fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 max-w-3xl">
                <div>
                  <div className="text-xs text-[#9E9E9E] uppercase tracking-wide">Email</div>
                  <a href={`mailto:${contact.email}`} className="text-sm text-[#1565C0] hover:underline truncate block">{contact.email}</a>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] uppercase tracking-wide">Phone</div>
                  <a href={`tel:${contact.phone}`} className="text-sm text-[#1565C0] hover:underline">{contact.phone}</a>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] uppercase tracking-wide">Account</div>
                  <button onClick={() => navigate(`/tenant/companies/${contact.companyId}`)} className="text-sm text-[#1565C0] hover:underline truncate block">{contact.company}</button>
                </div>
                <div>
                  <div className="text-xs text-[#9E9E9E] uppercase tracking-wide">Owner</div>
                  <span className="text-sm text-[#212121]">{contact.ownerName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#212121] text-sm hover:bg-[#F5F5F5]">
              <Edit3 size={14} /> Edit
            </button>
            <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#212121] text-sm hover:bg-[#F5F5F5]">
              <Send size={14} /> Email
            </button>
            <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#212121] text-sm hover:bg-[#F5F5F5]">
              <PhoneCall size={14} /> Call
            </button>
            <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
              <Plus size={14} /> New Deal
            </button>
            <button className="p-2 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5]"><MoreVertical size={16} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Center: Tabs (Activity, Deals, Files, etc.) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg">
              <div className="flex border-b border-[#E0E0E0] overflow-x-auto">
                {[
                  { id: "activity", label: "Activity", icon: Activity, count: RELATED_ACTIVITIES.length },
                  { id: "deals",    label: "Deals",    icon: Briefcase, count: RELATED_DEALS.length },
                  { id: "files",    label: "Files",    icon: FileText,  count: RELATED_FILES.length },
                  { id: "notes",    label: "Notes",    icon: MessageSquare, count: 0 },
                  { id: "emails",   label: "Emails",   icon: Mail, count: 0 },
                ].map(t => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button key={t.id} onClick={() => setActiveTab(t.id as Tab)}
                      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${active ? "border-[#1565C0] text-[#1565C0]" : "border-transparent text-[#616161] hover:text-[#212121]"}`}>
                      <Icon size={15} /> {t.label}
                      {t.count > 0 && <span className={`px-1.5 py-0.5 text-[10px] rounded ${active ? "bg-[#E3F2FD] text-[#1565C0]" : "bg-[#F5F5F5] text-[#616161]"}`}>{t.count}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="p-5">
                {activeTab === "activity" && (
                  <div className="space-y-1">
                    {/* Quick add bar */}
                    <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-md p-3 mb-4 flex items-center gap-2">
                      <input type="text" placeholder="Log a call, email, or note..." className="flex-1 h-9 px-3 rounded border border-[#E0E0E0] text-sm" />
                      <button className="px-3 h-9 rounded-md bg-[#1565C0] text-white text-sm">Log</button>
                    </div>

                    {RELATED_ACTIVITIES.map((act, i) => {
                      const meta = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.note;
                      const Icon = meta.icon;
                      return (
                        <div key={act.id} className="flex gap-3 pb-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full ${meta.bg} flex items-center justify-center shrink-0`}>
                              <Icon size={16} className={meta.color} />
                            </div>
                            {i < RELATED_ACTIVITIES.length - 1 && <div className="w-px flex-1 bg-[#E0E0E0] my-1" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-[#212121]">{act.title}</span>
                              <span className="text-xs text-[#9E9E9E] shrink-0">{act.timestamp}</span>
                            </div>
                            <div className="text-sm text-[#616161] mt-1">{act.description}</div>
                            <div className="text-xs text-[#9E9E9E] mt-1">by {act.user}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "deals" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-[#212121]">Open Deals ({RELATED_DEALS.length})</h4>
                      <button className="inline-flex items-center gap-1 text-sm text-[#1565C0] hover:underline"><Plus size={14} /> New Deal</button>
                    </div>
                    <div className="space-y-3">
                      {RELATED_DEALS.map(deal => (
                        <div key={deal.id} className="border border-[#E0E0E0] rounded-md p-3 hover:border-[#1565C0] hover:bg-[#FAFAFA] cursor-pointer transition-colors" onClick={() => navigate(`/tenant/deals/${deal.id}`)}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-[#1565C0] hover:underline">{deal.name}</span>
                            <span className="text-sm font-semibold text-[#212121]">${deal.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#616161]">
                            <span className="inline-flex items-center gap-1"><TrendingUp size={11} /> {deal.stage}</span>
                            <span>· {deal.probability}% probability</span>
                            <span>· Closes {new Date(deal.closeDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "files" && (
                  <div className="space-y-2">
                    {RELATED_FILES.map(file => (
                      <div key={file.id} className="flex items-center gap-3 p-3 border border-[#E0E0E0] rounded-md hover:bg-[#FAFAFA]">
                        <div className="w-10 h-10 rounded bg-[#FFEBEE] flex items-center justify-center text-[#C62828]"><FileText size={18} /></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-[#212121]">{file.name}</div>
                          <div className="text-xs text-[#9E9E9E]">{file.size} · {file.uploadedAt}</div>
                        </div>
                        <button className="text-sm text-[#1565C0] hover:underline">View</button>
                      </div>
                    ))}
                  </div>
                )}

                {(activeTab === "notes" || activeTab === "emails") && (
                  <div className="text-center py-10 text-sm text-[#9E9E9E]">No {activeTab} yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Details Panel — Salesforce style */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <h4 className="text-sm font-semibold text-[#212121] mb-4 flex items-center gap-2">
                <User size={16} className="text-[#1565C0]" /> Contact Details
              </h4>
              <div className="space-y-3 text-sm">
                <DetailRow label="Title" value={contact.title} />
                <DetailRow label="Department" value={contact.department} />
                <DetailRow label="Reports To" value={contact.reportsTo} />
                <DetailRow label="Mobile" value={contact.mobile} link={`tel:${contact.mobile}`} />
                <DetailRow label="Lead Source" value={contact.leadSource} />
                <DetailRow label="Owner" value={contact.ownerName} />
                <DetailRow label="Birthdate" value={new Date(contact.birthdate).toLocaleDateString()} />
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <h4 className="text-sm font-semibold text-[#212121] mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-[#1565C0]" /> Mailing Address
              </h4>
              <div className="text-sm text-[#212121] space-y-1">
                <div>{contact.mailingAddress.street}</div>
                <div>{contact.mailingAddress.city}, {contact.mailingAddress.state} {contact.mailingAddress.postalCode}</div>
                <div className="text-[#616161]">{contact.mailingAddress.country}</div>
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <h4 className="text-sm font-semibold text-[#212121] mb-4 flex items-center gap-2">
                <Tag size={16} className="text-[#1565C0]" /> Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map(t => (
                  <span key={t} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#E3F2FD] text-[#1565C0] border border-[#90CAF9]">{t}</span>
                ))}
                <button className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-[#616161] border border-[#E0E0E0] hover:bg-[#F5F5F5]"><Plus size={11} /></button>
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <h4 className="text-sm font-semibold text-[#212121] mb-2">Description</h4>
              <p className="text-sm text-[#616161] leading-relaxed">{contact.description}</p>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <h4 className="text-sm font-semibold text-[#212121] mb-4">System Info</h4>
              <div className="space-y-3 text-sm">
                <DetailRow label="Created" value={new Date(contact.createdAt).toLocaleDateString()} />
                <DetailRow label="Last Activity" value={contact.lastActivity} />
                <DetailRow label="Status" value={contact.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div>
      <div className="text-xs text-[#9E9E9E] mb-0.5">{label}</div>
      {link ? (
        <a href={link} className="text-[#1565C0] hover:underline">{value}</a>
      ) : (
        <div className="text-[#212121]">{value || "—"}</div>
      )}
    </div>
  );
}
