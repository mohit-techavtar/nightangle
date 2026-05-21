import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Phone, Mail, MapPin, Building2, Copy, Check, Calendar,
  User, Tag, ChevronDown, ChevronUp, ArrowRight, MessageCircle,
  FileText, Bot, Edit, UserPlus, Clock, PhoneCall, Plus, Star
} from "lucide-react";
import { LeadStageTabs, DEFAULT_LEAD_STAGES } from "../../components/lead/LeadStageTabs";
import { ActivityForm, type ActivityEntry } from "../../components/lead/ActivityForm";

interface Activity {
  id: string;
  type: "call" | "ai_call" | "email" | "whatsapp" | "stage_change" | "note";
  title: string;
  description: string;
  actor: string;
  timestamp: Date;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  status: "Open" | "Closed";
  score: number;
  stage: string;
  pipeline: string;
  source: string;
  owner: {
    name: string;
    avatar?: string;
    initials: string;
    color: string;
  };
  createdDate: Date;
  tags: { id: string; name: string; color: string }[];
  customFields: { label: string; value: string }[];
  activities: Activity[];
}

// Mock data
const mockLead: Lead = {
  id: "lead-001",
  name: "Rajesh Kumar Sharma",
  email: "rajesh@techsolutions.com",
  phone: "+977 9801234567",
  company: "Tech Solutions Pvt Ltd",
  location: "Kathmandu, Nepal",
  status: "Open",
  score: 85,
  stage: "Qualified",
  pipeline: "Sales",
  source: "Website",
  owner: {
    name: "Akash Sharma",
    initials: "AS",
    color: "#1565C0",
  },
  createdDate: new Date("2026-03-15T10:30:00"),
  tags: [
    { id: "1", name: "Hot Lead", color: "#C62828" },
    { id: "2", name: "High Value", color: "#1565C0" },
    { id: "3", name: "Enterprise", color: "#6A1B9A" },
  ],
  customFields: [
    { label: "Industry", value: "Information Technology" },
    { label: "Company Size", value: "50-100 employees" },
    { label: "Annual Revenue", value: "NPR 50M - 100M" },
    { label: "Decision Maker", value: "CTO" },
    { label: "Budget", value: "NPR 2.5M - 5M" },
  ],
  activities: [
    {
      id: "act-1",
      type: "call",
      title: "Outbound Call Completed",
      description: "Discussed product features and pricing. Customer showed strong interest in enterprise plan.",
      actor: "Akash Sharma",
      timestamp: new Date("2026-03-26T14:30:00"),
    },
    {
      id: "act-2",
      type: "stage_change",
      title: "Stage Changed",
      description: "Moved from 'Contacted' to 'Qualified'",
      actor: "Akash Sharma",
      timestamp: new Date("2026-03-26T14:25:00"),
    },
    {
      id: "act-3",
      type: "email",
      title: "Email Sent: Product Proposal",
      description: "Sent detailed proposal with pricing breakdown and implementation timeline.",
      actor: "Akash Sharma",
      timestamp: new Date("2026-03-26T11:15:00"),
    },
    {
      id: "act-4",
      type: "ai_call",
      title: "AI Agent Call Completed",
      description: "AI agent performed discovery call. Lead confirmed interest in CRM solution for 50+ users.",
      actor: "AI Agent (Sarah)",
      timestamp: new Date("2026-03-25T16:45:00"),
    },
    {
      id: "act-5",
      type: "whatsapp",
      title: "WhatsApp Message Sent",
      description: "Shared demo video link and calendar booking for live demo session.",
      actor: "Priya Thapa",
      timestamp: new Date("2026-03-25T10:20:00"),
    },
    {
      id: "act-6",
      type: "note",
      title: "Note Added",
      description: "Lead is actively comparing with Salesforce and HubSpot. Price sensitivity moderate. Decision timeline: 2-3 weeks.",
      actor: "Akash Sharma",
      timestamp: new Date("2026-03-24T15:30:00"),
    },
    {
      id: "act-7",
      type: "email",
      title: "Email Received: Demo Request",
      description: "Lead requested product demo and additional information about data migration capabilities.",
      actor: "Rajesh Kumar Sharma",
      timestamp: new Date("2026-03-23T14:10:00"),
    },
    {
      id: "act-8",
      type: "call",
      title: "Inbound Call Received",
      description: "Initial contact call. Lead found us through website. Interested in CRM for sales team automation.",
      actor: "Priya Thapa",
      timestamp: new Date("2026-03-22T11:45:00"),
    },
  ],
};

const stages = [
  { id: "new", name: "New" },
  { id: "contacted", name: "Contacted" },
  { id: "qualified", name: "Qualified" },
  { id: "proposal", name: "Proposal" },
  { id: "negotiation", name: "Negotiation" },
  { id: "won", name: "Won" },
];

export function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead>(mockLead);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [customFieldsExpanded, setCustomFieldsExpanded] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [loggedActivities, setLoggedActivities] = useState<ActivityEntry[]>([]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "call":
        return { icon: Phone, color: "#4CAF50", bg: "#E8F5E9" };
      case "ai_call":
        return { icon: Bot, color: "#6A1B9A", bg: "#F3E5F5" };
      case "email":
        return { icon: Mail, color: "#1565C0", bg: "#E3F2FD" };
      case "whatsapp":
        return { icon: MessageCircle, color: "#25D366", bg: "#E8F5E9" };
      case "stage_change":
        return { icon: ArrowRight, color: "#FF6F00", bg: "#FFF3E0" };
      case "note":
        return { icon: FileText, color: "#616161", bg: "#F5F5F5" };
    }
  };

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.name === lead.stage);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "CRM" },
          { label: "Lead Management", path: "/tenant/leads" },
          { label: lead.name },
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />

      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="max-w-[1600px] mx-auto p-6 max-md:p-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/tenant/leads")}
            className="mb-4 flex items-center gap-2 text-sm text-[#616161] hover:text-[#1565C0] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Leads
          </button>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
            {/* Left Column - 65% */}
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-6">
                <div className="flex items-start justify-between mb-4 max-md:flex-col max-md:gap-3">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#212121] mb-2">
                      {lead.name}
                    </h1>
                    <div className="flex items-center gap-2 text-[#616161] mb-3">
                      <Building2 size={16} />
                      <span className="text-lg">{lead.company}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lead.status === "Open"
                            ? "bg-[#E8F5E9] text-[#2E7D32]"
                            : "bg-[#F5F5F5] text-[#616161]"
                        }`}
                      >
                        {lead.status}
                      </span>
                      {lead.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lead Score - Circular Progress */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#E0E0E0"
                          strokeWidth="8"
                          fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={
                            lead.score >= 80
                              ? "#4CAF50"
                              : lead.score >= 60
                              ? "#FF9800"
                              : "#F44336"
                          }
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(lead.score / 100) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#212121]">
                            {lead.score}
                          </div>
                          <div className="text-[10px] text-[#9E9E9E] uppercase font-semibold">
                            Score
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage Stepper — gradient pipeline tabs */}
                <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
                  <div className="text-xs font-semibold text-[#616161] uppercase tracking-wider mb-4">
                    Pipeline Stage
                  </div>
                  <LeadStageTabs
                    stages={DEFAULT_LEAD_STAGES}
                    activeKey={lead.stage}
                    onChange={(key) => setLead({ ...lead, stage: key })}
                    variant="path"
                  />
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#212121]">Activity Timeline</h2>
                  <button
                    onClick={() => setShowActivityForm((s) => !s)}
                    className="px-3 py-1.5 rounded-md border border-[#1565C0] text-sm font-medium text-[#1565C0] hover:bg-[#E3F2FD] flex items-center gap-2">
                    <Plus size={16} />
                    {showActivityForm ? "Close" : "Add Activity"}
                  </button>
                </div>

                {showActivityForm && (
                  <div className="mb-6">
                    <ActivityForm
                      nepali={lead.location?.toLowerCase().includes("nepal")}
                      onLog={(entry) => { setLoggedActivities((p) => [entry, ...p]); setShowActivityForm(false); }}
                      onCancel={() => setShowActivityForm(false)}
                    />
                  </div>
                )}

                {loggedActivities.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {loggedActivities.map((a) => (
                      <div key={a.id} className="flex items-start gap-3 bg-[#F3F8FF] border border-[#BBDEFB] rounded-lg px-3 py-2.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1565C0] text-white capitalize mt-0.5">{a.type}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#212121]">{a.subject}</div>
                          {a.body && <div className="text-xs text-[#616161] mt-0.5">{a.body}</div>}
                          <div className="text-xs text-[#9E9E9E] mt-1 flex flex-wrap gap-x-3">
                            {a.outcome && <span>Outcome: {a.outcome}</span>}
                            {a.durationMin && <span>{a.durationMin} min</span>}
                            {a.direction && <span className="capitalize">{a.direction}</span>}
                            {a.followUpDate && <span>Follow-up: {new Date(a.followUpDate).toLocaleDateString("en-GB")}</span>}
                            {a.priority && a.type === "task" && <span>Priority: {a.priority}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#E0E0E0]" />

                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {lead.activities.map((activity, index) => {
                      const activityStyle = getActivityIcon(activity.type);
                      const ActivityIcon = activityStyle.icon;

                      return (
                        <div key={activity.id} className="relative pl-16">
                          {/* Icon */}
                          <div
                            className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm border border-[#E0E0E0]"
                            style={{ backgroundColor: activityStyle.bg }}
                          >
                            <ActivityIcon size={20} style={{ color: activityStyle.color }} />
                          </div>

                          {/* Content */}
                          <div className="bg-[#FAFAFA] rounded-lg border border-[#E0E0E0] p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2 max-md:flex-col max-md:gap-1">
                              <h3 className="text-sm font-semibold text-[#212121]">
                                {activity.title}
                              </h3>
                              <span className="text-xs text-[#9E9E9E] whitespace-nowrap">
                                {formatDateTime(activity.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-[#616161] mb-2">
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                              <User size={12} />
                              <span>{activity.actor}</span>
                              <span>•</span>
                              <span>{formatDate(activity.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 35% */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-5">
                <h3 className="text-sm font-semibold text-[#616161] uppercase tracking-wider mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-[#E3F2FD] flex items-center justify-center shrink-0">
                        <Phone size={16} className="text-[#1565C0]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#9E9E9E] mb-0.5">Phone</div>
                        <div className="text-sm font-medium text-[#212121] truncate">
                          {lead.phone}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(lead.phone, "phone")}
                      className="w-8 h-8 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#F5F5F5] transition-all"
                    >
                      {copiedField === "phone" ? (
                        <Check size={14} className="text-[#4CAF50]" />
                      ) : (
                        <Copy size={14} className="text-[#9E9E9E]" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0">
                        <Mail size={16} className="text-[#6A1B9A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#9E9E9E] mb-0.5">Email</div>
                        <div className="text-sm font-medium text-[#212121] truncate">
                          {lead.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(lead.email, "email")}
                      className="w-8 h-8 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#F5F5F5] transition-all"
                    >
                      {copiedField === "email" ? (
                        <Check size={14} className="text-[#4CAF50]" />
                      ) : (
                        <Copy size={14} className="text-[#9E9E9E]" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] flex items-center justify-center shrink-0">
                        <Building2 size={16} className="text-[#FF6F00]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#9E9E9E] mb-0.5">Company</div>
                        <div className="text-sm font-medium text-[#212121] truncate">
                          {lead.company}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(lead.company, "company")}
                      className="w-8 h-8 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#F5F5F5] transition-all"
                    >
                      {copiedField === "company" ? (
                        <Check size={14} className="text-[#4CAF50]" />
                      ) : (
                        <Copy size={14} className="text-[#9E9E9E]" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-[#4CAF50]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#9E9E9E] mb-0.5">Location</div>
                        <div className="text-sm font-medium text-[#212121] truncate">
                          {lead.location}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(lead.location, "location")}
                      className="w-8 h-8 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#F5F5F5] transition-all"
                    >
                      {copiedField === "location" ? (
                        <Check size={14} className="text-[#4CAF50]" />
                      ) : (
                        <Copy size={14} className="text-[#9E9E9E]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-5">
                <h3 className="text-sm font-semibold text-[#616161] uppercase tracking-wider mb-4">
                  Lead Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-[#9E9E9E] mb-1">Source</div>
                    <div className="text-sm font-medium text-[#212121]">{lead.source}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#9E9E9E] mb-1">Pipeline</div>
                    <div className="text-sm font-medium text-[#212121]">{lead.pipeline}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#9E9E9E] mb-1">Lead Owner</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: lead.owner.color }}
                      >
                        {lead.owner.initials}
                      </div>
                      <span className="text-sm font-medium text-[#212121]">
                        {lead.owner.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#9E9E9E] mb-1">Created Date</div>
                    <div className="text-sm font-medium text-[#212121]">
                      {lead.createdDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#9E9E9E] mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 rounded-md text-xs font-semibold text-white flex items-center gap-1"
                          style={{ backgroundColor: tag.color }}
                        >
                          <Tag size={12} />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] overflow-hidden">
                <button
                  onClick={() => setCustomFieldsExpanded(!customFieldsExpanded)}
                  className="w-full p-5 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                >
                  <h3 className="text-sm font-semibold text-[#616161] uppercase tracking-wider">
                    Custom Fields
                  </h3>
                  {customFieldsExpanded ? (
                    <ChevronUp size={18} className="text-[#9E9E9E]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#9E9E9E]" />
                  )}
                </button>

                {customFieldsExpanded && (
                  <div className="px-5 pb-5 space-y-3 border-t border-[#E0E0E0] pt-4">
                    {lead.customFields.map((field, index) => (
                      <div key={index}>
                        <div className="text-xs text-[#9E9E9E] mb-1">{field.label}</div>
                        <div className="text-sm font-medium text-[#212121]">{field.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-5">
                <h3 className="text-sm font-semibold text-[#616161] uppercase tracking-wider mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full h-10 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-sm font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                    <ArrowRight size={16} />
                    Change Stage
                  </button>
                  <button className="w-full h-10 rounded-md border-2 border-[#1565C0] bg-white text-[#1565C0] text-sm font-semibold hover:bg-[#E3F2FD] transition-colors flex items-center justify-center gap-2">
                    <UserPlus size={16} />
                    Reassign
                  </button>
                  <button className="w-full h-10 rounded-md border border-[#E0E0E0] bg-white text-[#616161] text-sm font-semibold hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2">
                    <Calendar size={16} />
                    Schedule Follow-up
                  </button>
                  <button className="w-full h-10 rounded-md border border-[#E0E0E0] bg-white text-[#616161] text-sm font-semibold hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2">
                    <FileText size={16} />
                    Add Note
                  </button>
                  <button className="w-full h-10 rounded-md border border-[#E0E0E0] bg-white text-[#616161] text-sm font-semibold hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2">
                    <PhoneCall size={16} />
                    Start Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
