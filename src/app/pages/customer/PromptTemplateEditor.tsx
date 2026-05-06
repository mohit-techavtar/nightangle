import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Search,
  Save,
  Copy,
  ChevronDown,
  Lock,
  AlertCircle,
  Trash2,
  GripVertical,
  Play,
  Edit3,
  Clock,
  Briefcase,
  FileText,
  History,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  usedIn: number;
  lastEdited: string;
  isDraft: boolean;
}

const templates: Template[] = [
  {
    id: "1",
    name: "Sales — Jewellery Software",
    usedIn: 2,
    lastEdited: "2 days ago",
    isDraft: false,
  },
  {
    id: "2",
    name: "Collections — Payment Reminder",
    usedIn: 1,
    lastEdited: "1 week ago",
    isDraft: false,
  },
  {
    id: "3",
    name: "Support — Post-Ticket Follow-up",
    usedIn: 1,
    lastEdited: "3 weeks ago",
    isDraft: false,
  },
  {
    id: "4",
    name: "Survey — NPS Score Collection",
    usedIn: 0,
    lastEdited: "1 month ago",
    isDraft: true,
  },
];

const contextVariables = [
  "{lead_name}",
  "{company_name}",
  "{lead_source}",
  "{previous_interactions}",
  "{campaign_objective}",
  "{product_interest}",
];

export function PromptTemplateEditor() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [templateName, setTemplateName] = useState("Sales — Jewellery Software");
  const [isEditingName, setIsEditingName] = useState(false);
  const [systemRole, setSystemRole] = useState(
    `You are Priya, a friendly and professional sales representative for Nightangle CRM. You speak Hindi and English fluently. Your goal is to understand the customer's business needs and book a product demo. You work for a software company that sells CRM and ERP solutions to Indian businesses.`
  );
  const [objectives, setObjectives] = useState(
    `1. Confirm the lead's identity and business details
2. Understand their current software setup and pain points
3. Explain relevant Nightangle features (focus on their industry)
4. If interested, schedule a demo within the next 7 days
5. If not interested, note the reason and thank them`
  );
  const [complianceText, setComplianceText] = useState(
    `You MUST say the following within the first 15 seconds:
'Yeh call AI assistant dwara ki ja rahi hai aur ise record kiya ja sakta hai.'`
  );
  const [complianceRequired, setComplianceRequired] = useState(true);

  const prohibitions = [
    "Never discuss competitor products by name",
    "Never make pricing commitments above listed rates",
    "Never share other customer information",
    "Never provide legal or financial advice",
  ];

  const highlightVariables = (text: string) => {
    const parts = text.split(/(\{[^}]+\})/g);
    return parts.map((part, idx) => {
      if (part.match(/^\{[^}]+\}$/)) {
        return (
          <span key={idx} className="text-violet-600 font-semibold bg-violet-50 px-1 rounded">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderLineNumbers = (text: string) => {
    const lines = text.split("\n");
    return (
      <div className="flex gap-4">
        <div className="text-gray-400 text-right select-none flex-shrink-0" style={{ width: "30px" }}>
          {lines.map((_, idx) => (
            <div key={idx} className="leading-6 font-mono text-xs">
              {idx + 1}
            </div>
          ))}
        </div>
        <div className="flex-1 font-mono text-sm leading-6 text-gray-900 whitespace-pre-wrap">
          {highlightVariables(text)}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/tenant/ai-calling")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Prompt Templates</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Create Button */}
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>
      </div>

      {/* Main Content - Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Template List */}
        <div className="w-[280px] border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-3 space-y-1">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "bg-indigo-50 border-2 border-indigo-500 shadow-sm"
                    : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight pr-2">
                    {template.name}
                  </h3>
                  {template.isDraft && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium flex-shrink-0">
                      Draft
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Briefcase className="w-3 h-3" />
                    <span>
                      Used in {template.usedIn} campaign{template.usedIn !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>Edited {template.lastEdited}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* New Template Button */}
            <button className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Template</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Editor */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-5xl mx-auto p-6">
            {/* Template Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {isEditingName ? (
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                      className="text-2xl font-semibold text-gray-900 border-b-2 border-indigo-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold text-gray-900">{templateName}</h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Version Dropdown */}
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
                    <History className="w-4 h-4" />
                    v3
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate Button */}
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>

                  {/* Save Button */}
                  <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium">
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Last saved 2 days ago • Used in 2 active campaigns
              </p>
            </div>

            {/* Prompt Stack */}
            <div className="space-y-5">
              {/* Card 1 - System Role */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(to right, #3B82F6, #2563EB)" }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        System Role Definition
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {systemRole.length} / 1000
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <textarea
                      value={systemRole}
                      onChange={(e) => setSystemRole(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-6 text-gray-900"
                      rows={6}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 - Objective Instructions */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(to right, #10B981, #059669)" }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Objective & Goals
                      </h3>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <textarea
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-6 text-gray-900"
                      rows={6}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3 - Compliance Disclosures */}
              <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(to right, #EF4444, #DC2626)" }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" />
                        Mandatory Disclosures
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                      REQUIRED
                    </span>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-3">
                    <textarea
                      value={complianceText}
                      onChange={(e) => setComplianceText(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-6 text-red-900"
                      rows={3}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">
                        Must complete before proceeding
                      </span>
                    </div>
                    <button
                      onClick={() => setComplianceRequired(!complianceRequired)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        complianceRequired ? "bg-red-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          complianceRequired ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4 - Disallowed Statements */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(to right, #F59E0B, #D97706)" }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Prohibited Content
                      </h3>
                    </div>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      Add Prohibition
                    </button>
                  </div>
                  <div className="space-y-2">
                    {prohibitions.map((prohibition, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg group hover:border-amber-300 transition-colors"
                      >
                        <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="flex-1 text-sm text-gray-900 leading-relaxed font-mono">
                          {prohibition}
                        </p>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-amber-100 rounded">
                          <Trash2 className="w-3.5 h-3.5 text-amber-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 5 - Context Variables */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(to right, #6B7280, #4B5563)" }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Dynamic Context (Injected at Call Time)
                      </h3>
                    </div>
                  </div>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-3">
                    <p className="text-xs text-violet-900 mb-3 font-medium">
                      Drag these variables into the prompt sections above. They will be
                      automatically replaced with real data during calls.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contextVariables.map((variable, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm font-mono font-semibold cursor-move hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm"
                          draggable
                        >
                          <GripVertical className="w-3 h-3" />
                          {variable}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Example Usage:</h4>
                    <code className="text-xs font-mono text-gray-900 block leading-relaxed">
                      "Namaste {highlightVariables("{lead_name}")} ji! Main Priya bol rahi hoon{" "}
                      {highlightVariables("{company_name}")} se..."
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Preview Section */}
            <div className="mt-8 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg border-2 border-indigo-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Test Preview</h3>
                  <p className="text-sm text-gray-600">
                    See how your prompt will behave with sample data
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Preview with Sample Lead
                </button>
              </div>

              {/* Sample Output */}
              <div className="bg-white rounded-lg border border-indigo-200 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    AI
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Simulated Opening (with sample data)</div>
                    <div className="text-sm text-gray-900 leading-relaxed">
                      "Namaste <span className="font-semibold text-indigo-600">Rajesh Kumar</span>{" "}
                      ji! Main Priya bol rahi hoon Nightangle CRM se. Aapne humari jewellery
                      software ke baare mein inquiry ki thi. Yeh call AI assistant dwara ki ja rahi
                      hai aur ise record kiya ja sakta hai. Kya aapke paas 2 minute hain?"
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Variables: 2 replaced</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Compliance: ✓ Included</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. duration: 8-10 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
