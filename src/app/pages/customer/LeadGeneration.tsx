import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { LeadGenerationTemplates } from "../../components/leads/LeadGenerationTemplates";
import { ScrapingRequestForm } from "../../components/leads/ScrapingRequestForm";
import { LeadPreviewTable } from "../../components/leads/LeadPreviewTable";
import { SendToCRMModal } from "../../components/leads/SendToCRMModal";
import { Clock, CheckCircle, AlertCircle, Loader, FolderOpen, Plus } from "lucide-react";

interface LeadTemplate {
  id: string;
  title: string;
  icon: any;
  description: string;
  dataPoints: string[];
  category: "companies" | "people" | "distributors" | "retailers";
  credits: number;
  estimatedLeads: string;
}

interface ScrapingJob {
  id: string;
  templateTitle: string;
  industry: string;
  location: string;
  leadCount: number;
  assignedTo: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
  leadsGenerated?: number;
}

// Mock generated leads
const mockLeads = [
  {
    id: "1",
    companyName: "Himalayan Tech Solutions",
    contactName: "Rajesh Kumar",
    email: "rajesh@himalayan tech.com",
    phone: "+977-1-4123456",
    title: "CEO",
    industry: "Technology & IT",
    location: "Kathmandu",
    website: "https://himalayantechsolutions.com",
    verified: true,
  },
  {
    id: "2",
    companyName: "Everest Manufacturing Pvt. Ltd.",
    contactName: "Sita Devi",
    email: "sita@everestmfg.com.np",
    phone: "+977-1-4987654",
    title: "Operations Manager",
    industry: "Manufacturing",
    location: "Bhaktapur",
    website: "https://everestmanufacturing.com",
    verified: true,
  },
  {
    id: "3",
    companyName: "Nepal Distributors Hub",
    contactName: "Bikash Thapa",
    email: "bikash@nepaldist.com",
    phone: "+977-9851234567",
    title: "Sales Director",
    industry: "Distribution",
    location: "Lalitpur",
    website: "https://nepaldistributorshub.com",
    verified: false,
  },
  {
    id: "4",
    companyName: "Kathmandu Retail Group",
    contactName: "Anita Sharma",
    email: "anita@ktmretail.com",
    phone: "+977-1-5123789",
    title: "Store Manager",
    industry: "Retail",
    location: "Kathmandu",
    website: "https://ktmretailgroup.com",
    verified: true,
  },
  {
    id: "5",
    companyName: "Tech Valley Nepal",
    contactName: "Prakash Adhikari",
    email: "prakash@techvalley.np",
    phone: "+977-9841234567",
    title: "CTO",
    industry: "Technology & IT",
    location: "Pokhara",
    website: "https://techvalleynepal.com",
    verified: true,
  },
];

const mockJobs: ScrapingJob[] = [
  {
    id: "job-001",
    templateTitle: "Company Database",
    industry: "Technology & IT",
    location: "Kathmandu Valley",
    leadCount: 100,
    assignedTo: "Akash Shrestha",
    status: "completed",
    createdAt: new Date("2026-03-25"),
    completedAt: new Date("2026-03-26"),
    leadsGenerated: 142,
  },
  {
    id: "job-002",
    templateTitle: "Product Distributors",
    industry: "Manufacturing",
    location: "Nationwide",
    leadCount: 200,
    assignedTo: "Priya Tamang",
    status: "processing",
    createdAt: new Date("2026-03-26"),
  },
  {
    id: "job-003",
    templateTitle: "Retailer Database",
    industry: "Retail & E-commerce",
    location: "Pokhara",
    leadCount: 50,
    assignedTo: "Akash Shrestha",
    status: "pending",
    createdAt: new Date("2026-03-26"),
  },
];

export function LeadGeneration() {
  const [view, setView] = useState<"templates" | "request" | "preview" | "jobs">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<LeadTemplate | null>(null);
  const [jobs, setJobs] = useState<ScrapingJob[]>(mockJobs);
  const [generatedLeads, setGeneratedLeads] = useState(mockLeads);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [selectedLeadsForCRM, setSelectedLeadsForCRM] = useState<string[]>([]);

  const handleSelectTemplate = (template: LeadTemplate) => {
    setSelectedTemplate(template);
    setView("request");
  };

  const handleSubmitRequest = (request: any) => {
    console.log("Scraping request:", request);
    // Simulate job creation
    const newJob: ScrapingJob = {
      id: `job-${Date.now()}`,
      templateTitle: selectedTemplate?.title || "",
      industry: request.industry || "",
      location: request.location || "",
      leadCount: request.leadCount || 100,
      assignedTo: request.assignedTo || "",
      status: "processing",
      createdAt: new Date(),
    };
    setJobs([newJob, ...jobs]);
    setView("jobs");
  };

  const handleExport = (format: "excel" | "csv", selectedLeads: string[]) => {
    console.log(`Exporting ${selectedLeads.length} leads as ${format}`);
    // Simulate download
    alert(`Downloading ${selectedLeads.length || generatedLeads.length} leads as ${format.toUpperCase()}`);
  };

  const handleSendToCRM = (selectedLeads: string[]) => {
    setSelectedLeadsForCRM(selectedLeads);
    setShowCRMModal(true);
  };

  const handleCRMModalSend = (campaignTag: string, assignTo: string, priority: string) => {
    console.log("Sending to CRM:", { campaignTag, assignTo, priority, leads: selectedLeadsForCRM });
    setShowCRMModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-[#E8F5E9] text-[#2E7D32]";
      case "processing": return "bg-[#E3F2FD] text-[#1565C0]";
      case "pending": return "bg-[#FFF8E1] text-[#F57F17]";
      case "failed": return "bg-[#FFEBEE] text-[#C62828]";
      default: return "bg-[#F5F5F5] text-[#616161]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle size={14} />;
      case "processing": return <Loader size={14} className="animate-spin" />;
      case "pending": return <Clock size={14} />;
      case "failed": return <AlertCircle size={14} />;
      default: return null;
    }
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Business Playground" }, { label: "Lead Generation" }]} 
        companyName="Everest Digital Solutions" 
        mode="customer" 
        userName="Rajesh Sharma" 
        userEmail="rajesh@everestdigital.com" 
        userInitials="RS" 
      />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 max-md:mb-4 max-md:flex-col max-md:gap-3">
            <div>
              <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Lead Generation & Data Scraping</h1>
              <p className="text-sm text-[#616161]">AI-powered lead extraction with direct CRM integration</p>
            </div>
            <div className="flex items-center gap-2">
              {view !== "templates" && (
                <button
                  onClick={() => setView("templates")}
                  className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Request
                </button>
              )}
              {view !== "jobs" && jobs.length > 0 && (
                <button
                  onClick={() => setView("jobs")}
                  className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
                >
                  <FolderOpen size={16} />
                  My Jobs ({jobs.length})
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {view === "templates" && (
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
              <LeadGenerationTemplates onSelectTemplate={handleSelectTemplate} />
            </div>
          )}

          {view === "preview" && (
            <LeadPreviewTable
              leads={generatedLeads}
              onExport={handleExport}
              onSendToCRM={handleSendToCRM}
            />
          )}

          {view === "jobs" && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                  <div className="text-xs text-[#616161] uppercase font-semibold mb-2">Total Jobs</div>
                  <div className="text-2xl font-bold text-[#212121]">{jobs.length}</div>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                  <div className="text-xs text-[#616161] uppercase font-semibold mb-2">Completed</div>
                  <div className="text-2xl font-bold text-[#4CAF50]">{jobs.filter(j => j.status === "completed").length}</div>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                  <div className="text-xs text-[#616161] uppercase font-semibold mb-2">Processing</div>
                  <div className="text-2xl font-bold text-[#1565C0]">{jobs.filter(j => j.status === "processing").length}</div>
                </div>
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                  <div className="text-xs text-[#616161] uppercase font-semibold mb-2">Total Leads</div>
                  <div className="text-2xl font-bold text-[#212121]">
                    {jobs.filter(j => j.status === "completed").reduce((sum, j) => sum + (j.leadsGenerated || 0), 0)}
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E0E0E0] bg-[#F5F5F5]">
                  <h3 className="text-lg font-semibold text-[#212121]">Scraping Jobs</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Template</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Industry</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Location</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Assigned To</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Leads</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Created</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(job => (
                        <tr key={job.id} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                          <td className="py-3 px-4">
                            <span className="font-medium text-[#212121]">{job.templateTitle}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-[#616161]">{job.industry}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-[#616161]">{job.location}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-[#212121]">{job.assignedTo}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(job.status)}`}>
                              {getStatusIcon(job.status)}
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm font-bold text-[#1565C0]">
                              {job.leadsGenerated ? `${job.leadsGenerated} leads` : `-`}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-[#616161]">{job.createdAt.toLocaleDateString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            {job.status === "completed" && (
                              <button
                                onClick={() => setView("preview")}
                                className="text-sm text-[#1565C0] hover:underline font-medium"
                              >
                                View Leads
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {view === "request" && selectedTemplate && (
        <ScrapingRequestForm
          templateTitle={selectedTemplate.title}
          onSubmit={handleSubmitRequest}
          onCancel={() => setView("templates")}
        />
      )}

      {showCRMModal && (
        <SendToCRMModal
          leadCount={selectedLeadsForCRM.length || generatedLeads.length}
          onSend={handleCRMModalSend}
          onCancel={() => setShowCRMModal(false)}
        />
      )}
    </>
  );
}
