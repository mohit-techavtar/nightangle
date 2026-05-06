import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { DuplicatePairList, DuplicatePair } from "../../components/duplicates/DuplicatePairList";
import { DuplicateComparison, LeadData } from "../../components/duplicates/DuplicateComparison";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

// Mock data
const mockLeadData: Record<string, LeadData> = {
  "lead-1": {
    id: "lead-1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@techcorp.com",
    phone: "+91 98765 43210",
    company: "TechCorp Solutions",
    title: "VP of Engineering",
    source: "Web Form",
    location: "Mumbai, Maharashtra",
    industry: "Software",
    score: 85,
    stage: "Qualified",
    owner: "Priya Sharma",
    tags: ["Enterprise", "Hot Lead", "Decision Maker"],
    notes: "Interested in enterprise plan. Follow up on pricing.",
    createdAt: "2026-03-15",
    lastActivity: "2026-03-24",
  },
  "lead-2": {
    id: "lead-2",
    name: "Rajesh K.",
    email: "rajesh.kumar@techcorp.com",
    phone: "+91 9876543210",
    company: "TechCorp Solutions Pvt Ltd",
    title: "Vice President Engineering",
    source: "LinkedIn",
    location: "Mumbai, MH",
    industry: "Technology",
    score: 82,
    stage: "Contacted",
    owner: "Amit Patel",
    tags: ["Enterprise", "High Priority"],
    notes: "Discussed product demo. Needs technical documentation.",
    createdAt: "2026-03-18",
    lastActivity: "2026-03-25",
  },
  "lead-3": {
    id: "lead-3",
    name: "Sneha Reddy",
    email: "sneha@innovateai.com",
    phone: "+91 99887 76655",
    company: "Innovate AI Labs",
    title: "CEO",
    source: "Referral",
    location: "Bangalore, Karnataka",
    industry: "AI/ML",
    score: 92,
    stage: "Proposal Sent",
    owner: "Vikram Singh",
    tags: ["Hot Lead", "C-Level"],
    notes: "Very interested. Waiting for proposal approval.",
    createdAt: "2026-03-10",
    lastActivity: "2026-03-23",
  },
  "lead-4": {
    id: "lead-4",
    name: "Sneha R.",
    email: "s.reddy@innovateai.com",
    phone: "+91 99887 76655",
    company: "Innovate AI Labs",
    title: "Chief Executive Officer",
    source: "Conference",
    location: "Bengaluru, KA",
    industry: "Artificial Intelligence",
    score: 90,
    stage: "Qualified",
    owner: "Neha Gupta",
    tags: ["C-Level", "High Value"],
    notes: "Met at AI Summit. Strong interest in our platform.",
    createdAt: "2026-03-12",
    lastActivity: "2026-03-22",
  },
  "lead-5": {
    id: "lead-5",
    name: "Amit Verma",
    email: "amit.verma@digicorp.in",
    phone: "+91 88776 65544",
    company: "DigiCorp",
    title: "Marketing Head",
    source: "Web Form",
    location: "Delhi, Delhi",
    industry: "Marketing",
    score: 75,
    stage: "New Inquiry",
    owner: "Rohit Singh",
    tags: ["SMB"],
    notes: "Requested demo for small team.",
    createdAt: "2026-03-20",
    lastActivity: "2026-03-21",
  },
  "lead-6": {
    id: "lead-6",
    name: "Amit V. Verma",
    email: "averma@digicorp.in",
    phone: "+91 88776 65544",
    company: "DigiCorp India",
    title: "Head of Marketing",
    source: "Email Campaign",
    location: "New Delhi",
    industry: "Digital Marketing",
    score: 73,
    stage: "New Inquiry",
    owner: "Priya Sharma",
    tags: ["SMB", "Marketing"],
    notes: "Opened email campaign. Clicked pricing link.",
    createdAt: "2026-03-21",
    lastActivity: "2026-03-21",
  },
};

const mockDuplicatePairs: DuplicatePair[] = [
  {
    id: "pair-1",
    leadA: { id: "lead-1", name: "Rajesh Kumar", company: "TechCorp Solutions" },
    leadB: { id: "lead-2", name: "Rajesh K.", company: "TechCorp Solutions Pvt Ltd" },
    confidence: 95,
    matchType: "multiple",
    matchedFields: ["email", "phone", "company"],
  },
  {
    id: "pair-2",
    leadA: { id: "lead-3", name: "Sneha Reddy", company: "Innovate AI Labs" },
    leadB: { id: "lead-4", name: "Sneha R.", company: "Innovate AI Labs" },
    confidence: 88,
    matchType: "phone",
    matchedFields: ["phone", "company"],
  },
  {
    id: "pair-3",
    leadA: { id: "lead-5", name: "Amit Verma", company: "DigiCorp" },
    leadB: { id: "lead-6", name: "Amit V. Verma", company: "DigiCorp India" },
    confidence: 82,
    matchType: "name",
    matchedFields: ["phone", "name"],
  },
];

export function DuplicateLeadManagement() {
  const [pairs, setPairs] = useState<DuplicatePair[]>(mockDuplicatePairs);
  const [selectedPairId, setSelectedPairId] = useState<string | null>(pairs[0]?.id || null);
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    message: string;
  } | null>(null);

  const selectedPair = pairs.find((p) => p.id === selectedPairId);

  const showNotification = (type: "success" | "info" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMerge = (mergedData: Partial<LeadData>) => {
    console.log("Merging leads:", mergedData);
    showNotification("success", "Leads merged successfully!");
    // Remove the processed pair
    setPairs((prev) => prev.filter((p) => p.id !== selectedPairId));
    // Select next pair
    const currentIndex = pairs.findIndex((p) => p.id === selectedPairId);
    const nextPair = pairs[currentIndex + 1] || pairs[currentIndex - 1];
    setSelectedPairId(nextPair?.id || null);
  };

  const handleLink = () => {
    console.log("Linking as related");
    showNotification("info", "Leads linked as related contacts.");
    setPairs((prev) => prev.filter((p) => p.id !== selectedPairId));
    const currentIndex = pairs.findIndex((p) => p.id === selectedPairId);
    const nextPair = pairs[currentIndex + 1] || pairs[currentIndex - 1];
    setSelectedPairId(nextPair?.id || null);
  };

  const handleNotDuplicate = () => {
    console.log("Not a duplicate");
    showNotification("info", "Marked as not a duplicate.");
    setPairs((prev) => prev.filter((p) => p.id !== selectedPairId));
    const currentIndex = pairs.findIndex((p) => p.id === selectedPairId);
    const nextPair = pairs[currentIndex + 1] || pairs[currentIndex - 1];
    setSelectedPairId(nextPair?.id || null);
  };

  const handleSkip = () => {
    console.log("Skipping");
    const currentIndex = pairs.findIndex((p) => p.id === selectedPairId);
    const nextPair = pairs[(currentIndex + 1) % pairs.length];
    setSelectedPairId(nextPair?.id || null);
  };

  const getNotificationIcon = () => {
    switch (notification?.type) {
      case "success":
        return <CheckCircle size={18} className="text-[#2E7D32]" />;
      case "error":
        return <XCircle size={18} className="text-[#D32F2F]" />;
      case "info":
      default:
        return <AlertCircle size={18} className="text-[#1565C0]" />;
    }
  };

  const getNotificationColor = () => {
    switch (notification?.type) {
      case "success":
        return "bg-[#E8F5E9] border-[#2E7D32]/20 text-[#2E7D32]";
      case "error":
        return "bg-[#FFEBEE] border-[#D32F2F]/20 text-[#D32F2F]";
      case "info":
      default:
        return "bg-[#E3F2FD] border-[#1565C0]/20 text-[#1565C0]";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        breadcrumbs={[{ label: "CRM" }, { label: "Lead Management" }, { label: "Duplicates" }]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />

      <div className="flex-1 flex overflow-hidden bg-[#F5F5F5]">
        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getNotificationColor()}`}
            >
              {getNotificationIcon()}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Left Side - Duplicate Pairs List */}
        <div className="w-96 bg-white border-r border-[#E0E0E0] flex-shrink-0">
          <DuplicatePairList
            pairs={pairs}
            selectedPairId={selectedPairId}
            onSelectPair={setSelectedPairId}
          />
        </div>

        {/* Right Side - Comparison View */}
        <div className="flex-1 overflow-hidden">
          {selectedPair ? (
            <DuplicateComparison
              leadA={mockLeadData[selectedPair.leadA.id]}
              leadB={mockLeadData[selectedPair.leadB.id]}
              confidence={selectedPair.confidence}
              matchedFields={selectedPair.matchedFields}
              onMerge={handleMerge}
              onLink={handleLink}
              onNotDuplicate={handleNotDuplicate}
              onSkip={handleSkip}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-[#2E7D32]" />
                </div>
                <h3 className="text-lg font-semibold text-[#212121] mb-2">All Done!</h3>
                <p className="text-sm text-[#616161]">
                  No more duplicate pairs to review
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
