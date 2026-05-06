import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useNavigate } from "react-router";
import {
  PhoneOutgoing,
  Wallet,
  Headphones,
  ClipboardList,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
  Upload,
  Database,
  Zap,
  Eye,
  Search,
} from "lucide-react";

interface CampaignType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const campaignTypes: CampaignType[] = [
  {
    id: "outbound-sales",
    label: "Outbound Sales",
    icon: <PhoneOutgoing className="w-6 h-6" />,
    description: "AI calls leads to book meetings and qualify interest",
  },
  {
    id: "collections",
    label: "Collections",
    icon: <Wallet className="w-6 h-6" />,
    description: "Automated payment reminders and recovery calls",
  },
  {
    id: "support-followup",
    label: "Support Follow-up",
    icon: <Headphones className="w-6 h-6" />,
    description: "Post-ticket satisfaction and resolution calls",
  },
  {
    id: "survey-feedback",
    label: "Survey & Feedback",
    icon: <ClipboardList className="w-6 h-6" />,
    description: "Automated survey calls to capture responses",
  },
];

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Audience" },
  { number: 3, label: "AI Agent" },
  { number: 4, label: "Script & Flow" },
  { number: 5, label: "Schedule" },
  { number: 6, label: "Compliance" },
  { number: 7, label: "Review & Launch" },
];

const mockLeads = [
  { id: 1, name: "Rajesh Kumar", phone: "+91 98765 43210", score: 85, stage: "Contacted", lastActivity: "2 days ago" },
  { id: 2, name: "Priya Sharma", phone: "+91 87654 32109", score: 92, stage: "New Lead", lastActivity: "1 hour ago" },
  { id: 3, name: "Amit Patel", phone: "+91 76543 21098", score: 78, stage: "Qualified", lastActivity: "3 days ago" },
  { id: 4, name: "Sunita Desai", phone: "+91 65432 10987", score: 88, stage: "Contacted", lastActivity: "5 hours ago" },
  { id: 5, name: "Vikram Singh", phone: "+91 54321 09876", score: 95, stage: "New Lead", lastActivity: "Today" },
];

export function CreateCampaign() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 - Basics
  const [campaignName, setCampaignName] = useState("");
  const [selectedType, setSelectedType] = useState("outbound-sales");
  const [deploymentMode, setDeploymentMode] = useState<"crm" | "standalone">("crm");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  // Step 2 - Audience
  const [sourceTab, setSourceTab] = useState<"crm" | "csv" | "api">("crm");
  const [selectedPipeline, setSelectedPipeline] = useState("sales-pipeline");
  const [selectedStages, setSelectedStages] = useState<string[]>(["new-lead", "contacted"]);
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [excludeDays, setExcludeDays] = useState(7);
  const [excludeDND, setExcludeDND] = useState(true);
  const [showLeadPreview, setShowLeadPreview] = useState(false);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleLaunchCampaign();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
      navigate("/tenant/campaigns");
    }
  };
  
  const handleLaunchCampaign = () => {
    // Simulate campaign creation
    alert(`Campaign "${campaignName || 'Untitled Campaign'}" created successfully!`);
    navigate("/tenant/campaigns");
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Basics 
          campaignName={campaignName}
          setCampaignName={setCampaignName}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          deploymentMode={deploymentMode}
          setDeploymentMode={setDeploymentMode}
          priority={priority}
          setPriority={setPriority}
          tags={tags}
          setTags={setTags}
          notes={notes}
          setNotes={setNotes}
        />;
      case 2:
        return <Step2Audience 
          sourceTab={sourceTab}
          setSourceTab={setSourceTab}
          selectedPipeline={selectedPipeline}
          setSelectedPipeline={setSelectedPipeline}
          selectedStages={selectedStages}
          setSelectedStages={setSelectedStages}
          scoreRange={scoreRange}
          setScoreRange={setScoreRange}
          excludeDays={excludeDays}
          setExcludeDays={setExcludeDays}
          excludeDND={excludeDND}
          setExcludeDND={setExcludeDND}
          showLeadPreview={showLeadPreview}
          setShowLeadPreview={setShowLeadPreview}
        />;
      default:
        return <div className="text-center py-12 text-gray-500">Step {currentStep} content coming soon...</div>;
    }
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "AI Campaigns" },
          { label: "Create Campaign" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />
      
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Step Indicator */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        step.number === currentStep
                          ? "bg-indigo-600 text-white"
                          : step.number < currentStep
                          ? "bg-indigo-600 text-white"
                          : "bg-white border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      {step.number < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        step.number === currentStep
                          ? "text-indigo-600"
                          : step.number < currentStep
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        step.number < currentStep ? "bg-indigo-600" : "bg-gray-300"
                      }`}
                      style={{ maxWidth: "80px" }}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-8">
          <div className="max-w-5xl mx-auto">
            {getStepContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            </div>

            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`w-2 h-2 rounded-full ${
                    step.number === currentStep
                      ? "bg-indigo-600"
                      : step.number < currentStep
                      ? "bg-indigo-400"
                      : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
            >
              {currentStep === 7 ? "Launch Campaign" : `Next: ${steps[currentStep]?.label}`}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Step 1 Component
interface Step1BasicsProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  deploymentMode: "crm" | "standalone";
  setDeploymentMode: (value: "crm" | "standalone") => void;
  priority: string;
  setPriority: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  notes: string;
  setNotes: (value: string) => void;
}

function Step1Basics({
  campaignName,
  setCampaignName,
  selectedType,
  setSelectedType,
  deploymentMode,
  setDeploymentMode,
  priority,
  setPriority,
  tags,
  setTags,
  notes,
  setNotes,
}: Step1BasicsProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Campaign Basics</h2>

      {/* Campaign Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Campaign Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="e.g., Q2 Sales Outreach"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Campaign Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Campaign Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaignTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                selectedType === type.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedType === type.id
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {type.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{type.label}</div>
                  <div className="text-xs text-gray-600">{type.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deployment Mode */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Deployment Mode <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setDeploymentMode("crm")}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              deploymentMode === "crm"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">CRM-Integrated</span>
            </div>
            <p className="text-xs text-gray-600">Full lead context from CRM pipeline</p>
          </button>
          <button
            onClick={() => setDeploymentMode("standalone")}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              deploymentMode === "standalone"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Standalone</span>
            </div>
            <p className="text-xs text-gray-600">Upload leads separately, outcomes via webhook</p>
          </button>
        </div>
      </div>

      {/* Priority Level */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">Priority Level</label>
        <div className="flex items-center gap-3">
          {["low", "medium", "high", "urgent"].map((level) => (
            <button
              key={level}
              onClick={() => setPriority(level)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                priority === level
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">Campaign Tags</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-indigo-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type and press Enter to add tags"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">Suggested: Q2-2026, Sales, Enterprise, Follow-up</p>
      </div>

      {/* Internal Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Internal Notes <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any internal notes or context about this campaign..."
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
        />
      </div>
    </div>
  );
}

// Step 2 Component
interface Step2AudienceProps {
  sourceTab: "crm" | "csv" | "api";
  setSourceTab: (value: "crm" | "csv" | "api") => void;
  selectedPipeline: string;
  setSelectedPipeline: (value: string) => void;
  selectedStages: string[];
  setSelectedStages: (value: string[]) => void;
  scoreRange: number[];
  setScoreRange: (value: number[]) => void;
  excludeDays: number;
  setExcludeDays: (value: number) => void;
  excludeDND: boolean;
  setExcludeDND: (value: boolean) => void;
  showLeadPreview: boolean;
  setShowLeadPreview: (value: boolean) => void;
}

function Step2Audience({
  sourceTab,
  setSourceTab,
  selectedPipeline,
  setSelectedPipeline,
  selectedStages,
  setSelectedStages,
  scoreRange,
  setScoreRange,
  excludeDays,
  setExcludeDays,
  excludeDND,
  setExcludeDND,
  showLeadPreview,
  setShowLeadPreview,
}: Step2AudienceProps) {
  const stages = [
    { id: "new-lead", label: "New Lead" },
    { id: "contacted", label: "Contacted" },
    { id: "qualified", label: "Qualified" },
    { id: "proposal", label: "Proposal Sent" },
  ];

  const toggleStage = (stageId: string) => {
    if (selectedStages.includes(stageId)) {
      setSelectedStages(selectedStages.filter(s => s !== stageId));
    } else {
      setSelectedStages([...selectedStages, stageId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Audience</h2>

      {/* Source Selector Tabs */}
      <div className="mb-6">
        <div className="flex items-center border-b border-gray-200">
          <button
            onClick={() => setSourceTab("crm")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              sourceTab === "crm"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              CRM Leads
            </div>
          </button>
          <button
            onClick={() => setSourceTab("csv")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              sourceTab === "csv"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              CSV Upload
            </div>
          </button>
          <button
            onClick={() => setSourceTab("api")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              sourceTab === "api"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              API/External
            </div>
          </button>
        </div>
      </div>

      {sourceTab === "crm" && (
        <>
          {/* Pipeline Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Pipeline</label>
            <select
              value={selectedPipeline}
              onChange={(e) => setSelectedPipeline(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="sales-pipeline">Sales Pipeline</option>
              <option value="support-pipeline">Support Pipeline</option>
              <option value="collections-pipeline">Collections Pipeline</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">Pipeline Stages</label>
            <div className="space-y-2">
              {stages.map((stage) => (
                <label key={stage.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStages.includes(stage.id)}
                    onChange={() => toggleStage(stage.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{stage.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Score Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Lead Score Range: {scoreRange[0]} - {scoreRange[1]}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={scoreRange[0]}
                onChange={(e) => setScoreRange([parseInt(e.target.value), scoreRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={scoreRange[1]}
                onChange={(e) => setScoreRange([scoreRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Location</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm">
                <option>All Locations</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Owner</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm">
                <option>All Owners</option>
                <option>Rajesh Sharma</option>
                <option>Priya Mehta</option>
              </select>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Tags</label>
            <input
              type="text"
              placeholder="Search tags..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-900">247</span>
                <span className="text-sm text-indigo-700">leads match these criteria</span>
              </div>
              <button
                onClick={() => setShowLeadPreview(!showLeadPreview)}
                className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showLeadPreview ? "Hide" : "Preview List"}
              </button>
            </div>
          </div>

          {/* Lead Preview Table */}
          {showLeadPreview && (
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{lead.phone}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.stage}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.lastActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Manual Exclusions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">Manual Exclusions</label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Exclude leads contacted in last</span>
              <input
                type="number"
                value={excludeDays}
                onChange={(e) => setExcludeDays(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center"
              />
              <span className="text-sm text-gray-700">days</span>
            </div>
          </div>

          {/* DND Check */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeDND}
                onChange={(e) => setExcludeDND(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                Exclude DND-registered numbers (Recommended)
              </span>
            </label>
          </div>
        </>
      )}

      {sourceTab === "csv" && (
        <div className="text-center py-12">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
          <p className="text-sm text-gray-600 mb-4">Upload a CSV file with lead information</p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
            Choose File
          </button>
        </div>
      )}

      {sourceTab === "api" && (
        <div className="text-center py-12">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">API Integration</h3>
          <p className="text-sm text-gray-600 mb-4">Connect to external data source via API</p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
            Configure API
          </button>
        </div>
      )}
    </div>
  );
}
