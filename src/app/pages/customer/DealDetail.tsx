import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDocuments } from "../../hooks/useDocuments";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Edit2, Trash2, MoreVertical, Building2, User, Mail,
  Phone, Calendar, DollarSign, TrendingUp, Tag, Package, MessageSquare,
  Clock, CheckCircle2, XCircle, Activity, FileText, Send, Users,
  Target, AlertCircle, MapPin, Globe, Eye, Plus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dealData = {
  id: 1,
  name: "Enterprise CRM Implementation",
  company: "TechCorp India Pvt Ltd",
  contactPerson: "Amit Kumar",
  email: "amit.kumar@techcorp.in",
  phone: "+91 98765 43210",
  value: 1250000,
  currency: "INR",
  stage: "Negotiation",
  probability: 85,
  expectedCloseDate: "2026-05-15",
  createdDate: "2026-04-01",
  lastModified: "2026-04-18",
  owner: "Rajesh Sharma",
  team: ["Sales Team A", "Enterprise Sales"],
  source: "AI Campaign",
  campaign: "Enterprise Outreach April",
  aiCall: "Enterprise Discovery Call #234",
  channel: "Outbound",
  dealType: "New Business",
  products: [
    { id: 1, name: "CRM Enterprise License", price: 50000, quantity: 15 },
    { id: 2, name: "Marketing Automation Platform", price: 35000, quantity: 10 },
    { id: 3, name: "AI Chatbot Integration", price: 25000, quantity: 8 }
  ],
  discount: 10,
  tax: 18,
  notes: "Key decision maker is the CTO. They're comparing us with Salesforce. Price is critical but they value our AI features. Follow-up meeting scheduled for next Tuesday.",
  address: "Tower A, Cyber City, Gurugram, Haryana 122002",
  website: "www.techcorp.in"
};

const activityHistory = [
  { id: 1, type: "stage", action: "Stage changed to Negotiation", user: "Rajesh Sharma", time: "2h ago", icon: TrendingUp, color: "text-[#1565C0]" },
  { id: 2, type: "note", action: "Added note about pricing discussion", user: "Rajesh Sharma", time: "5h ago", icon: MessageSquare, color: "text-[#6366F1]" },
  { id: 3, type: "email", action: "Sent proposal email", user: "System", time: "1d ago", icon: Mail, color: "text-[#10B981]" },
  { id: 4, type: "call", action: "Logged call - Product demo", user: "Rajesh Sharma", time: "2d ago", icon: Phone, color: "text-[#F59E0B]" },
  { id: 5, type: "update", action: "Updated deal value", user: "Rajesh Sharma", time: "3d ago", icon: DollarSign, color: "text-[#EC4899]" },
];

const probabilityHistory = [
  { date: "Apr 1", probability: 45 },
  { date: "Apr 5", probability: 55 },
  { date: "Apr 10", probability: 65 },
  { date: "Apr 15", probability: 75 },
  { date: "Apr 18", probability: 85 },
];

export function DealDetail() {
  const navigate = useNavigate();
  const { documents, getDocumentsByDeal } = useDocuments();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "activity" | "notes" | "documents">("overview");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [newNote, setNewNote] = useState("");

  const dealDocuments = getDocumentsByDeal(dealData.id.toString());

  const subtotal = dealData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const discountAmount = (subtotal * dealData.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * dealData.tax) / 100;
  const total = taxableAmount + taxAmount;

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "Qualification": "bg-[#FEF3C7] text-[#F59E0B]",
      "Proposal": "bg-[#DBEAFE] text-[#1565C0]",
      "Negotiation": "bg-[#E0E7FF] text-[#6366F1]",
      "Closing": "bg-[#D1FAE5] text-[#10B981]",
    };
    return colors[stage] || "bg-[#F3F4F6] text-[#6B7280]";
  };

  const handleDelete = () => {
    console.log("Deleting deal...");
    navigate("/tenant/deals/list");
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Sales" },
          { label: "Deals", path: "/tenant/deals" },
          { label: dealData.name }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => navigate("/tenant/deals/list")}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-semibold text-[#0F1B2D] mb-2">{dealData.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded ${getStageColor(dealData.stage)}`}>
                      {dealData.stage}
                    </span>
                    <span className="text-sm text-[#6B7280] flex items-center gap-1">
                      <Building2 size={14} />
                      {dealData.company}
                    </span>
                    <span className="text-sm text-[#6B7280] flex items-center gap-1">
                      <User size={14} />
                      Owned by {dealData.owner}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStageModal(true)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                >
                  Change Stage
                </button>
                <button
                  onClick={() => navigate("/tenant/deals/edit")}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#EF4444] hover:bg-[#FEE2E2] transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#E5E7EB]">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Deal Value</p>
                <p className="text-2xl font-bold text-[#1565C0]">₹{(total / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Win Probability</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F3F4F6] rounded-full h-2">
                    <div
                      className="bg-[#10B981] h-2 rounded-full transition-all"
                      style={{ width: `${dealData.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-[#0F1B2D]">{dealData.probability}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Expected Close</p>
                <p className="text-lg font-semibold text-[#0F1B2D]">
                  {new Date(dealData.expectedCloseDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Weighted Value</p>
                <p className="text-lg font-semibold text-[#10B981]">
                  ₹{((total * dealData.probability) / 10000000).toFixed(2)}L
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="border-b border-[#E5E7EB]">
              <div className="flex gap-6 px-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "overview"
                      ? 'border-[#1565C0] text-[#1565C0]'
                      : 'border-transparent text-[#6B7280] hover:text-[#0F1B2D]'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "products"
                      ? 'border-[#1565C0] text-[#1565C0]'
                      : 'border-transparent text-[#6B7280] hover:text-[#0F1B2D]'
                  }`}
                >
                  Products & Pricing
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "activity"
                      ? 'border-[#1565C0] text-[#1565C0]'
                      : 'border-transparent text-[#6B7280] hover:text-[#0F1B2D]'
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "notes"
                      ? 'border-[#1565C0] text-[#1565C0]'
                      : 'border-transparent text-[#6B7280] hover:text-[#0F1B2D]'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "documents"
                      ? 'border-[#1565C0] text-[#1565C0]'
                      : 'border-transparent text-[#6B7280] hover:text-[#0F1B2D]'
                  }`}
                >
                  Documents ({dealDocuments.length})
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F1B2D] mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <User size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Contact Person</p>
                            <p className="text-sm font-medium text-[#0F1B2D]">{dealData.contactPerson}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Email</p>
                            <a href={`mailto:${dealData.email}`} className="text-sm font-medium text-[#1565C0] hover:underline">
                              {dealData.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Phone</p>
                            <a href={`tel:${dealData.phone}`} className="text-sm font-medium text-[#1565C0] hover:underline">
                              {dealData.phone}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Address</p>
                            <p className="text-sm font-medium text-[#0F1B2D]">{dealData.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Globe size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Website</p>
                            <a href={`https://${dealData.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1565C0] hover:underline">
                              {dealData.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deal Details */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F1B2D] mb-4">Deal Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Tag size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Deal Type</p>
                            <p className="text-sm font-medium text-[#0F1B2D]">{dealData.dealType}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Target size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Source</p>
                            <p className="text-sm font-medium text-[#0F1B2D]">{dealData.source}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Send size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Campaign</p>
                            <p className="text-sm font-medium text-[#0F1B2D]">{dealData.campaign}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">AI Call</p>
                            <p className="text-sm font-medium text-[#0F1B2D]">{dealData.aiCall}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Team Access</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {dealData.team.map(team => (
                                <span key={team} className="inline-flex px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded text-xs">
                                  {team}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar size={18} className="text-[#6B7280] mt-0.5" />
                          <div>
                            <p className="text-xs text-[#6B7280]">Created</p>
                            <p className="text-sm font-medium text-[#0F1B2D]">
                              {new Date(dealData.createdDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Probability Trend */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F1B2D] mb-4">Probability Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={probabilityHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                          formatter={(value) => `${value}%`}
                        />
                        <Line key="probability" type="monotone" dataKey="probability" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#F9FAFB]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F1B2D] uppercase">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-[#0F1B2D] uppercase">Price</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-[#0F1B2D] uppercase">Quantity</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-[#0F1B2D] uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {dealData.products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-4 py-3 text-sm text-[#0F1B2D]">{product.name}</td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] text-right">₹{product.price.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] text-center">{product.quantity}</td>
                            <td className="px-4 py-3 text-sm font-medium text-[#0F1B2D] text-right">
                              ₹{(product.price * product.quantity).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <div className="w-80 bg-[#F9FAFB] rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Subtotal</span>
                        <span className="text-[#0F1B2D] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Discount ({dealData.discount}%)</span>
                        <span className="text-[#EF4444]">-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Tax ({dealData.tax}%)</span>
                        <span className="text-[#0F1B2D] font-medium">₹{taxAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-semibold text-[#0F1B2D]">Total Deal Value</span>
                          <span className="text-lg font-bold text-[#1565C0]">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="space-y-4">
                  {activityHistory.map((activity) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b border-[#E5E7EB] last:border-0">
                      <div className={`w-8 h-8 rounded-lg bg-opacity-10 flex items-center justify-center flex-shrink-0 ${activity.color}`}
                        style={{ backgroundColor: activity.color.replace('text-', '').replace('[', '').replace(']', '') + '1A' }}
                      >
                        <activity.icon size={16} className={activity.color} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0F1B2D]">{activity.action}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[#6B7280]">by {activity.user}</span>
                          <span className="text-xs text-[#9CA3AF]">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <div className="bg-[#F9FAFB] rounded-lg p-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this deal..."
                      rows={4}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent resize-none bg-white"
                    />
                    <button className="mt-2 px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors">
                      Add Note
                    </button>
                  </div>

                  <div className="border border-[#E5E7EB] rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <MessageSquare size={18} className="text-[#6B7280] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-[#0F1B2D]">{dealData.notes}</p>
                        <p className="text-xs text-[#9CA3AF] mt-2">Added by {dealData.owner} on {new Date(dealData.createdDate).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[#6B7280]">
                      Documents associated with this deal
                    </p>
                    <button
                      onClick={() => navigate(`/tenant/documents/create?deal=${dealData.id}`)}
                      className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Create Document
                    </button>
                  </div>

                  {dealDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dealDocuments.map((doc) => (
                        <div key={doc.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                                <FileText size={20} className="text-[#1565C0]" />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-[#0F1B2D]">{doc.name}</h4>
                                <p className="text-xs text-[#9CA3AF]">
                                  {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              doc.status === "draft" ? "bg-[#F3F4F6] text-[#6B7280]" :
                              doc.status === "sent" ? "bg-[#DBEAFE] text-[#1565C0]" :
                              doc.status === "viewed" ? "bg-[#E0E7FF] text-[#6366F1]" :
                              doc.status === "signed" ? "bg-[#D1FAE5] text-[#10B981]" :
                              "bg-[#F3F4F6] text-[#6B7280]"
                            }`}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </span>
                            <span className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded text-xs font-medium">
                              {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/tenant/documents/${doc.id}`)}
                              className="flex-1 px-3 py-2 text-sm font-medium text-[#1565C0] bg-[#F0F9FF] hover:bg-[#DBEAFE] rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/tenant/documents/${doc.id}/edit`)}
                              className="flex-1 px-3 py-2 text-sm font-medium text-[#6B7280] bg-[#F9FAFB] hover:bg-[#F3F4F6] rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Edit2 size={16} />
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-[#E5E7EB] rounded-lg">
                      <FileText size={48} className="text-[#9CA3AF] mx-auto mb-3" />
                      <h3 className="text-sm font-semibold text-[#0F1B2D] mb-1">No documents yet</h3>
                      <p className="text-sm text-[#6B7280] mb-4">Create documents like proposals, contracts, or invoices for this deal</p>
                      <button
                        onClick={() => navigate(`/tenant/documents/create?deal=${dealData.id}`)}
                        className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors inline-flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Create Document
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <Trash2 size={20} className="text-[#EF4444]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F1B2D]">Delete Deal</h3>
            </div>
            <p className="text-sm text-[#6B7280] mb-6">
              Are you sure you want to delete "{dealData.name}"? This action cannot be undone and all deal data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-[#EF4444] text-white rounded-lg text-sm font-medium hover:bg-[#DC2626] transition-colors"
              >
                Delete Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Stage Modal */}
      {showStageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0F1B2D]">Change Deal Stage</h3>
              <button
                onClick={() => setShowStageModal(false)}
                className="text-[#6B7280] hover:text-[#0F1B2D]"
              >
                <XCircle size={20} />
              </button>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              Current stage: <span className="font-medium text-[#0F1B2D]">{dealData.stage}</span>
            </p>
            <div className="space-y-2 mb-6">
              {["Qualification", "Proposal", "Negotiation", "Closing"].map((stage) => (
                <button
                  key={stage}
                  onClick={() => {
                    console.log("Changing stage to:", stage);
                    setShowStageModal(false);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg text-sm font-medium text-left transition-colors ${
                    stage === dealData.stage
                      ? 'border-[#1565C0] bg-[#F0F9FF] text-[#1565C0]'
                      : 'border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStageModal(false)}
              className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
