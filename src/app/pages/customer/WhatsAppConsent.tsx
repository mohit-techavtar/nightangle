import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import {
  Search, Filter, Download, Shield, CheckCircle, XCircle, Clock, AlertTriangle
} from "lucide-react";

const contacts = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    consent: "granted",
    source: "Website Form",
    grantedDate: "2024-04-15 10:30 AM",
    ipAddress: "103.54.12.45",
    optInMethod: "Double opt-in",
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    consent: "granted",
    source: "Campaign Sign-up",
    grantedDate: "2024-04-14 03:22 PM",
    ipAddress: "103.54.12.78",
    optInMethod: "Single opt-in",
  },
  {
    id: 3,
    name: "Amit Patel",
    phone: "+91 76543 21098",
    consent: "pending",
    source: "Manual Import",
    grantedDate: null,
    ipAddress: null,
    optInMethod: "Pending verification",
  },
  {
    id: 4,
    name: "Neha Singh",
    phone: "+91 65432 10987",
    consent: "revoked",
    source: "Website Form",
    grantedDate: "2024-03-10 02:15 PM",
    ipAddress: "103.54.13.92",
    optInMethod: "Double opt-in",
    revokedDate: "2024-04-10 11:20 AM",
  },
];

export function WhatsAppConsent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [consentFilter, setConsentFilter] = useState("all");

  const getConsentBadge = (consent: string) => {
    switch (consent) {
      case "granted":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold rounded-full">
            <CheckCircle size={12} />
            Granted
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-[#FEF3C7] text-[#92400E] text-xs font-semibold rounded-full">
            <Clock size={12} />
            Pending
          </span>
        );
      case "revoked":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold rounded-full">
            <XCircle size={12} />
            Revoked
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "WhatsApp" },
          { label: "Consent Tracking" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F1B2D]">Consent Management</h1>
              <p className="text-sm text-[#6B7280] mt-1">Track and manage customer messaging consent</p>
            </div>
            <button className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2">
              <Download size={16} />
              Export Consent Log
            </button>
          </div>

          {/* Compliance Warning */}
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#92400E] mb-1">GDPR & WhatsApp Policy Compliance</h3>
                <p className="text-sm text-[#92400E]">
                  Ensure you have explicit consent before sending marketing messages. Only message contacts with "Granted" consent status.
                  Maintain audit trails for compliance purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                  <CheckCircle size={20} className="text-[#10B981]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">2,341</div>
              <div className="text-sm text-[#6B7280] mt-1">Consent Granted</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <Clock size={20} className="text-[#F59E0B]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">124</div>
              <div className="text-sm text-[#6B7280] mt-1">Pending Verification</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                  <XCircle size={20} className="text-[#EF4444]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">67</div>
              <div className="text-sm text-[#6B7280] mt-1">Consent Revoked</div>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E0E7FF] flex items-center justify-center">
                  <Shield size={20} className="text-[#6366F1]" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#0F1B2D]">100%</div>
              <div className="text-sm text-[#6B7280] mt-1">Compliance Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConsentFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    consentFilter === "all"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setConsentFilter("granted")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    consentFilter === "granted"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  Granted
                </button>
                <button
                  onClick={() => setConsentFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    consentFilter === "pending"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setConsentFilter("revoked")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    consentFilter === "revoked"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  Revoked
                </button>
              </div>
            </div>
          </div>

          {/* Consent Records */}
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Opt-in Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#0F1B2D]">{contact.name}</div>
                        <div className="text-sm text-[#6B7280]">{contact.phone}</div>
                      </td>
                      <td className="px-6 py-4">{getConsentBadge(contact.consent)}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{contact.source}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{contact.optInMethod}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#0F1B2D]">
                          {contact.grantedDate || "-"}
                        </div>
                        {contact.consent === "revoked" && contact.revokedDate && (
                          <div className="text-xs text-[#EF4444] mt-1">
                            Revoked: {contact.revokedDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280] font-mono">
                        {contact.ipAddress || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
