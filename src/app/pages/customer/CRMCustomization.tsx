import React, { useState } from "react";
import {
  Settings2, Plus, Search, Trash2, Edit3, ChevronRight, ChevronDown,
  ToggleLeft, ToggleRight, GripVertical, Eye, EyeOff, CheckCircle2,
  AlertCircle, Layers, Database, FormInput, List, Hash, Calendar,
  Image, Paperclip, CheckSquare, Circle, Type, Phone, Mail, Globe,
  Clock, Star, Tag, Link, DollarSign, Percent, Binary, Wand2,
  BarChart3, Users, User as UserIcon, Briefcase, Target, FileText, Copy, ArrowUpDown,
  Filter, SlidersHorizontal, Layout, Workflow, Shield, Zap, Building2,
  X, Check, Info, Lock, Unlock, RefreshCw, Download, Upload, MoreVertical,
  ChevronLeft, Move, PlusCircle, MinusCircle, Save, ChevronUp, LayoutGrid,
  Table, Kanban, TrendingUp, Activity, FolderOpen, PieChart
} from "lucide-react";

type FieldType = "text" | "number" | "email" | "phone" | "url" | "textarea" | "date" | "datetime" | "currency" | "percent" | "boolean" | "picklist" | "multipicklist" | "lookup" | "formula" | "autonumber" | "image" | "attachment" | "rating" | "tag";

interface CustomField {
  id: string;
  label: string;
  apiName: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  readOnly: boolean;
  showInListView: boolean;
  showInDetailView: boolean;
  section: string;
  description?: string;
  defaultValue?: string;
  options?: string[];
  formula?: string;
  lookupModule?: string;
}

interface ModuleLayout {
  id: string;
  name: string;
  sections: LayoutSection[];
}

interface LayoutSection {
  id: string;
  label: string;
  columns: number;
  fields: string[];
}

interface CRMModule {
  id: string;
  name: string;
  label: string;
  icon: React.ElementType;
  color: string;
  recordCount: number;
  fields: CustomField[];
  layouts: ModuleLayout[];
  enabled: boolean;
}

interface ValidationRule {
  id: string;
  name: string;
  module: string;
  condition: string;
  errorMessage: string;
  active: boolean;
  triggerOn: "create" | "update" | "both";
}

interface Pipeline {
  id: string;
  name: string;
  module: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

interface PipelineStage {
  id: string;
  name: string;
  probability: number;
  color: string;
  rottenDays: number;
  category: "open" | "won" | "lost";
}

const fieldTypeConfig: Record<FieldType, { label: string; icon: React.ElementType; color: string }> = {
  text: { label: "Text", icon: Type, color: "text-blue-600" },
  number: { label: "Number", icon: Hash, color: "text-purple-600" },
  email: { label: "Email", icon: Mail, color: "text-green-600" },
  phone: { label: "Phone", icon: Phone, color: "text-indigo-600" },
  url: { label: "URL", icon: Globe, color: "text-cyan-600" },
  textarea: { label: "Text Area", icon: FormInput, color: "text-blue-500" },
  date: { label: "Date", icon: Calendar, color: "text-orange-600" },
  datetime: { label: "Date & Time", icon: Clock, color: "text-amber-600" },
  currency: { label: "Currency", icon: DollarSign, color: "text-green-700" },
  percent: { label: "Percent", icon: Percent, color: "text-teal-600" },
  boolean: { label: "Checkbox", icon: CheckSquare, color: "text-violet-600" },
  picklist: { label: "Dropdown", icon: List, color: "text-rose-600" },
  multipicklist: { label: "Multi-Select", icon: CheckSquare, color: "text-pink-600" },
  lookup: { label: "Lookup", icon: Link, color: "text-sky-600" },
  formula: { label: "Formula", icon: Wand2, color: "text-fuchsia-600" },
  autonumber: { label: "Auto Number", icon: Binary, color: "text-slate-600" },
  image: { label: "Image", icon: Image, color: "text-red-500" },
  attachment: { label: "Attachment", icon: Paperclip, color: "text-gray-600" },
  rating: { label: "Rating", icon: Star, color: "text-yellow-500" },
  tag: { label: "Tag", icon: Tag, color: "text-emerald-600" },
};

const sampleModules: CRMModule[] = [
  {
    id: "leads", name: "leads", label: "Leads", icon: Target, color: "bg-blue-500",
    recordCount: 4782, enabled: true,
    fields: [
      { id: "f1", label: "Full Name", apiName: "full_name", type: "text", required: true, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Lead Information" },
      { id: "f2", label: "Primary Phone", apiName: "primary_phone", type: "phone", required: true, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Lead Information" },
      { id: "f3", label: "Email Address", apiName: "email", type: "email", required: false, unique: true, readOnly: false, showInListView: true, showInDetailView: true, section: "Lead Information" },
      { id: "f4", label: "Company Name", apiName: "company", type: "text", required: false, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Company Details" },
      { id: "f5", label: "Lead Source", apiName: "lead_source", type: "picklist", required: true, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Lead Information", options: ["Web Form", "CSV Import", "WhatsApp", "SMS", "Manual", "AI Call", "Meta Ads", "LinkedIn"] },
      { id: "f6", label: "Lead Score", apiName: "lead_score", type: "number", required: false, unique: false, readOnly: true, showInListView: true, showInDetailView: true, section: "Scoring" },
      { id: "f7", label: "Lead Status", apiName: "status", type: "picklist", required: true, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Lead Information", options: ["New", "Contacted", "Qualified", "Unqualified", "Converted", "Lost"] },
      { id: "f8", label: "Annual Revenue", apiName: "annual_revenue", type: "currency", required: false, unique: false, readOnly: false, showInListView: false, showInDetailView: true, section: "Company Details" },
      { id: "f9", label: "Industry", apiName: "industry", type: "picklist", required: false, unique: false, readOnly: false, showInListView: false, showInDetailView: true, section: "Company Details", options: ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Real Estate", "Other"] },
      { id: "f10", label: "GST Number", apiName: "gst_number", type: "text", required: false, unique: false, readOnly: false, showInListView: false, showInDetailView: true, section: "Company Details" },
      { id: "f11", label: "Language Preference", apiName: "language_pref", type: "picklist", required: false, unique: false, readOnly: false, showInListView: false, showInDetailView: true, section: "Preferences", options: ["English", "Hindi", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu"] },
      { id: "f12", label: "Tags", apiName: "tags", type: "tag", required: false, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Lead Information" },
    ],
    layouts: [
      {
        id: "l1", name: "Default Lead Layout",
        sections: [
          { id: "s1", label: "Lead Information", columns: 2, fields: ["f1", "f2", "f3", "f5", "f7", "f12"] },
          { id: "s2", label: "Company Details", columns: 2, fields: ["f4", "f8", "f9", "f10"] },
          { id: "s3", label: "Scoring", columns: 2, fields: ["f6"] },
        ]
      }
    ]
  },
  {
    id: "contacts", name: "contacts", label: "Contacts", icon: Users, color: "bg-green-500",
    recordCount: 2341, enabled: true,
    fields: [
      { id: "c1", label: "Full Name", apiName: "full_name", type: "text", required: true, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Contact Information" },
      { id: "c2", label: "Email", apiName: "email", type: "email", required: false, unique: true, readOnly: false, showInListView: true, showInDetailView: true, section: "Contact Information" },
      { id: "c3", label: "Phone", apiName: "phone", type: "phone", required: false, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Contact Information" },
      { id: "c4", label: "Account", apiName: "account_id", type: "lookup", required: false, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Contact Information", lookupModule: "accounts" },
    ],
    layouts: []
  },
  {
    id: "deals", name: "deals", label: "Deals", icon: Briefcase, color: "bg-purple-500",
    recordCount: 891, enabled: true,
    fields: [
      { id: "d1", label: "Deal Name", apiName: "deal_name", type: "text", required: true, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Deal Information" },
      { id: "d2", label: "Amount", apiName: "amount", type: "currency", required: false, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Deal Information" },
      { id: "d3", label: "Close Date", apiName: "close_date", type: "date", required: true, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Deal Information" },
      { id: "d4", label: "Probability", apiName: "probability", type: "percent", required: false, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Deal Information" },
      { id: "d5", label: "Deal Type", apiName: "deal_type", type: "picklist", required: false, unique: false, readOnly: false, showInListView: true, showInDetailView: true, section: "Deal Information", options: ["New Business", "Renewal", "Upsell", "Cross-sell"] },
    ],
    layouts: []
  },
  {
    id: "accounts", name: "accounts", label: "Accounts", icon: Building2, color: "bg-orange-500",
    recordCount: 567, enabled: true,
    fields: [],
    layouts: []
  },
  {
    id: "activities", name: "activities", label: "Activities", icon: Activity, color: "bg-pink-500",
    recordCount: 9823, enabled: true,
    fields: [],
    layouts: []
  },
];

const sampleValidationRules: ValidationRule[] = [
  { id: "vr1", name: "Require Email for Qualified Leads", module: "leads", condition: "Status = 'Qualified' AND Email is empty", errorMessage: "Email is required when lead status is Qualified", active: true, triggerOn: "both" },
  { id: "vr2", name: "Close Date Cannot Be in Past", module: "deals", condition: "Close Date < Today", errorMessage: "Deal close date cannot be in the past", active: true, triggerOn: "create" },
  { id: "vr3", name: "Probability Auto-Set for Won Stage", module: "deals", condition: "Stage = 'Won' AND Probability != 100", errorMessage: "Won deals must have 100% probability", active: false, triggerOn: "both" },
];

const samplePipelines: Pipeline[] = [
  {
    id: "p1", name: "Sales Pipeline", module: "deals", isDefault: true,
    stages: [
      { id: "ps1", name: "Qualification", probability: 20, color: "#6366f1", rottenDays: 7, category: "open" },
      { id: "ps2", name: "Needs Analysis", probability: 40, color: "#8b5cf6", rottenDays: 7, category: "open" },
      { id: "ps3", name: "Proposal Sent", probability: 60, color: "#a855f7", rottenDays: 10, category: "open" },
      { id: "ps4", name: "Negotiation", probability: 80, color: "#d946ef", rottenDays: 5, category: "open" },
      { id: "ps5", name: "Won", probability: 100, color: "#22c55e", rottenDays: 0, category: "won" },
      { id: "ps6", name: "Lost", probability: 0, color: "#ef4444", rottenDays: 0, category: "lost" },
    ]
  },
  {
    id: "p2", name: "Enterprise Pipeline", module: "deals", isDefault: false,
    stages: [
      { id: "pe1", name: "Discovery", probability: 10, color: "#3b82f6", rottenDays: 14, category: "open" },
      { id: "pe2", name: "Demo Scheduled", probability: 30, color: "#6366f1", rottenDays: 10, category: "open" },
      { id: "pe3", name: "POC/Pilot", probability: 50, color: "#8b5cf6", rottenDays: 21, category: "open" },
      { id: "pe4", name: "Commercial", probability: 70, color: "#a855f7", rottenDays: 14, category: "open" },
      { id: "pe5", name: "Contract Review", probability: 90, color: "#d946ef", rottenDays: 7, category: "open" },
      { id: "pe6", name: "Closed Won", probability: 100, color: "#22c55e", rottenDays: 0, category: "won" },
      { id: "pe7", name: "Closed Lost", probability: 0, color: "#ef4444", rottenDays: 0, category: "lost" },
    ]
  }
];

interface CrmView {
  id: string;
  name: string;
  type: "shared" | "personal";
  count: number;
  isDefault: boolean;
  conditions: string[];
  icon: React.ElementType;
}

const sampleViews: CrmView[] = [
  { id: "v1", name: "All Leads", type: "shared", count: 4782, isDefault: true, conditions: [], icon: Globe },
  { id: "v2", name: "My Leads", type: "personal", count: 142, isDefault: false, conditions: ["Owner = Me"], icon: UserIcon },
  { id: "v3", name: "Hot Leads", type: "shared", count: 89, isDefault: false, conditions: ["Score > 80", "Status = Qualified"], icon: Star },
  { id: "v4", name: "Unassigned", type: "shared", count: 23, isDefault: false, conditions: ["Owner is empty"], icon: AlertCircle },
  { id: "v5", name: "Today's Follow-ups", type: "personal", count: 17, isDefault: false, conditions: ["Follow-up Date = Today"], icon: Clock },
  { id: "v6", name: "Stale > 7 Days", type: "shared", count: 34, isDefault: false, conditions: ["Last Activity > 7 days ago"], icon: AlertCircle },
];

interface CrmWorkflow {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  active: boolean;
  runs: number;
  icon: React.ElementType;
  color: string;
}

const sampleWorkflows: CrmWorkflow[] = [
  { id: "w1", name: "Auto-assign New Leads", trigger: "When lead is created", actions: ["Assign to available agent (round-robin)", "Send welcome WhatsApp"], active: true, runs: 1284, icon: Zap, color: "bg-yellow-500" },
  { id: "w2", name: "Qualified Lead Notification", trigger: "When Lead Score > 80", actions: ["Notify assigned manager", "Create follow-up task", "Update status to Qualified"], active: true, runs: 342, icon: Target, color: "bg-green-500" },
  { id: "w3", name: "Stale Lead Re-engagement", trigger: "When no activity for 7 days", actions: ["Trigger AI follow-up call", "Send re-engagement SMS"], active: false, runs: 0, icon: RefreshCw, color: "bg-blue-500" },
  { id: "w4", name: "Deal Won Celebration", trigger: "When Deal stage = Won", actions: ["Send thank you email", "Create onboarding task", "Update lead to Converted"], active: true, runs: 67, icon: Star, color: "bg-purple-500" },
];

type MainTab = "modules" | "fields" | "layouts" | "validation" | "pipelines" | "views" | "workflows" | "permissions";

export function CRMCustomization() {
  // Task 8 — state-backed CRM Setup data so Validation Rules and Views
  // are fully dynamic (create / toggle / delete) instead of static markup.
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(sampleValidationRules);
  const [views, setViews] = useState<CrmView[]>(sampleViews);

  const addValidationRule = () => {
    const n = validationRules.length + 1;
    setValidationRules(prev => [{ id: `vr-${Date.now()}`, name: `New Rule ${n}`, module: selectedModule.id, condition: "Field is empty", errorMessage: "This field is required", active: true, triggerOn: "both" }, ...prev]);
  };
  const toggleValidationRule = (id: string) => setValidationRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const deleteValidationRule = (id: string) => setValidationRules(prev => prev.filter(r => r.id !== id));

  const addView = () => {
    const n = views.length + 1;
    setViews(prev => [...prev, { id: `view-${Date.now()}`, name: `Custom View ${n}`, type: "personal", count: 0, isDefault: false, conditions: ["Owner = Me"], icon: Filter }]);
  };
  const deleteView = (id: string) => setViews(prev => prev.filter(v => v.id !== id));

  const [workflows, setWorkflows] = useState<CrmWorkflow[]>(sampleWorkflows);
  const toggleWorkflow = (id: string) => setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  const addWorkflow = () => {
    const n = workflows.length + 1;
    setWorkflows(prev => [{ id: `w-${Date.now()}`, name: `New Automation ${n}`, trigger: "When lead is created", actions: ["Notify owner"], active: false, runs: 0, icon: Zap, color: "bg-yellow-500" }, ...prev]);
  };
  const duplicateWorkflow = (id: string) => setWorkflows(prev => {
    const w = prev.find(x => x.id === id); if (!w) return prev;
    return [{ ...w, id: `w-${Date.now()}`, name: `${w.name} (copy)`, runs: 0 }, ...prev];
  });

  const [activeTab, setActiveTab] = useState<MainTab>("modules");
  const [selectedModule, setSelectedModule] = useState<CRMModule>(sampleModules[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("Lead Information");
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline>(samplePipelines[0]);
  const [showAddStage, setShowAddStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [showNewFieldModal, setShowNewFieldModal] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [draggedField, setDraggedField] = useState<string | null>(null);

  const tabs: { id: MainTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "modules", label: "Modules", icon: Layers },
    { id: "fields", label: "Fields", icon: FormInput, badge: selectedModule.fields.length },
    { id: "layouts", label: "Page Layouts", icon: Layout },
    { id: "validation", label: "Validation Rules", icon: Shield, badge: validationRules.filter(r => r.module === selectedModule.id).length },
    { id: "pipelines", label: "Pipelines", icon: TrendingUp, badge: samplePipelines.length },
    { id: "views", label: "Views & Filters", icon: Filter },
    { id: "workflows", label: "Automation", icon: Workflow },
    { id: "permissions", label: "Permissions", icon: Lock },
  ];

  const filteredFields = selectedModule.fields.filter(f =>
    f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.apiName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fieldsBySection = filteredFields.reduce((acc, field) => {
    if (!acc[field.section]) acc[field.section] = [];
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, CustomField[]>);

  const stageColors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"];

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Left Module Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Settings2 className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-gray-900">CRM Customization</span>
          </div>
          <p className="text-xs text-gray-500">Configure modules, fields & rules</p>
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Standard Modules</p>
          </div>
          {sampleModules.map(module => (
            <button
              key={module.id}
              onClick={() => { setSelectedModule(module); setSearchQuery(""); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all ${
                selectedModule.id === module.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className={`w-7 h-7 rounded-md ${module.color} flex items-center justify-center flex-shrink-0`}>
                <module.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{module.label}</p>
                <p className="text-xs text-gray-400">{module.recordCount.toLocaleString()} records</p>
              </div>
              {!module.enabled && (
                <span className="text-xs text-gray-400">Off</span>
              )}
            </button>
          ))}

          <div className="mt-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">Custom Modules</p>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            New Module
          </button>
        </div>

        {/* Import/Export */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Import Configuration
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export Configuration
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${selectedModule.color} flex items-center justify-center`}>
                <selectedModule.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedModule.label} Module</h2>
                <p className="text-sm text-gray-500">{selectedModule.recordCount.toLocaleString()} records · {selectedModule.fields.length} fields</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "text-gray-600 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    activeTab === tab.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* MODULES TAB */}
          {activeTab === "modules" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleModules.map(module => (
                  <div key={module.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer" onClick={() => setSelectedModule(module)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center`}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{module.label}</h3>
                          <p className="text-xs text-gray-500">{module.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className={`relative w-10 h-5 rounded-full transition-colors ${module.enabled ? "bg-indigo-500" : "bg-gray-300"}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${module.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-gray-900">{module.fields.length}</p>
                        <p className="text-xs text-gray-500">Fields</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-gray-900">{module.layouts.length}</p>
                        <p className="text-xs text-gray-500">Layouts</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-lg font-bold text-gray-900">{module.recordCount > 999 ? `${(module.recordCount / 1000).toFixed(1)}k` : module.recordCount}</p>
                        <p className="text-xs text-gray-500">Records</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">List View</span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Kanban</span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Detail View</span>
                    </div>
                  </div>
                ))}
                
                {/* Add Custom Module Card */}
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer min-h-[160px]">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    <Plus className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="font-medium text-gray-700">Create Custom Module</p>
                  <p className="text-xs text-gray-500 text-center mt-1">Build a new module tailored to your business needs</p>
                </div>
              </div>

              {/* Module Settings */}
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Global Module Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Activity Timeline", desc: "Show unified timeline on all records", enabled: true },
                    { label: "Duplicate Detection", desc: "Auto-detect duplicate records on create", enabled: true },
                    { label: "Merge Records", desc: "Allow merging duplicate records", enabled: true },
                    { label: "Record Versioning", desc: "Keep history of all field changes", enabled: false },
                    { label: "Global Search", desc: "Include all modules in global search", enabled: true },
                    { label: "AI Suggestions", desc: "AI-powered next best action suggestions", enabled: true },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                        <p className="text-xs text-gray-500">{setting.desc}</p>
                      </div>
                      <button className={`relative w-10 h-5 rounded-full transition-colors ${setting.enabled ? "bg-indigo-500" : "bg-gray-300"}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${setting.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FIELDS TAB */}
          {activeTab === "fields" && (
            <div className="p-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search fields..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setShowNewFieldModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Field
                </button>
              </div>

              {/* Field type summary */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {Object.entries(
                  selectedModule.fields.reduce((acc, f) => { acc[f.type] = (acc[f.type] || 0) + 1; return acc; }, {} as Record<string, number>)
                ).map(([type, count]) => {
                  const config = fieldTypeConfig[type as FieldType];
                  if (!config) return null;
                  return (
                    <span key={type} className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      <config.icon className={`w-3 h-3 ${config.color}`} />
                      {count} {config.label}
                    </span>
                  );
                })}
              </div>

              {/* Fields by section */}
              <div className="space-y-4">
                {Object.entries(fieldsBySection).map(([section, fields]) => (
                  <div key={section} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                      onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                    >
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">{section}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{fields.length}</span>
                      </div>
                      {expandedSection === section ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>

                    {expandedSection === section && (
                      <div>
                        <div className="grid grid-cols-5 gap-0 px-5 py-2 border-b border-gray-100 bg-gray-50/50">
                          <div className="text-xs font-medium text-gray-500 col-span-2">Field Label</div>
                          <div className="text-xs font-medium text-gray-500">Type</div>
                          <div className="text-xs font-medium text-gray-500">Properties</div>
                          <div className="text-xs font-medium text-gray-500 text-right">Actions</div>
                        </div>
                        {fields.map((field, idx) => {
                          const typeConfig = fieldTypeConfig[field.type];
                          return (
                            <div key={field.id} className={`grid grid-cols-5 gap-0 px-5 py-3 items-center ${idx < fields.length - 1 ? "border-b border-gray-50" : ""} hover:bg-indigo-50/30 group transition-colors`}>
                              <div className="col-span-2 flex items-center gap-2.5">
                                <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-400 cursor-grab" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{field.label}</p>
                                  <p className="text-xs text-gray-400 font-mono">{field.apiName}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {typeConfig && <typeConfig.icon className={`w-4 h-4 ${typeConfig.color}`} />}
                                <span className="text-xs text-gray-600">{typeConfig?.label}</span>
                              </div>
                              <div className="flex items-center gap-1 flex-wrap">
                                {field.required && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Required</span>}
                                {field.unique && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Unique</span>}
                                {field.readOnly && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Read Only</span>}
                                {!field.required && !field.unique && !field.readOnly && <span className="text-xs text-gray-400">Optional</span>}
                              </div>
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Toggle visibility">
                                  {field.showInListView ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                                <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        <div className="px-5 py-3 border-t border-gray-50">
                          <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
                            <PlusCircle className="w-4 h-4" />
                            Add field to {section}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LAYOUTS TAB */}
          {activeTab === "layouts" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Layout selector */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">Page Layouts</h3>
                    <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700">
                      <Plus className="w-3.5 h-3.5" />
                      New Layout
                    </button>
                  </div>
                  {(selectedModule.layouts.length > 0 ? selectedModule.layouts : [{ id: "default", name: "Default Layout", sections: [] }]).map(layout => (
                    <div key={layout.id} className="bg-white border border-indigo-200 rounded-xl p-4 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layout className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium text-gray-900">{layout.name}</span>
                        </div>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{layout.sections.length} sections</p>
                    </div>
                  ))}

                  {/* View types */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Views</h4>
                    <div className="space-y-2">
                      {[
                        { icon: Table, label: "List View", enabled: true },
                        { icon: Kanban, label: "Kanban Board", enabled: true },
                        { icon: LayoutGrid, label: "Card View", enabled: true },
                        { icon: PieChart, label: "Analytics View", enabled: false },
                      ].map((view, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <view.icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{view.label}</span>
                          </div>
                          <button className={`relative w-9 h-5 rounded-full transition-colors ${view.enabled ? "bg-indigo-500" : "bg-gray-300"}`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${view.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout builder */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-xl">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Layout Builder</h3>
                      <div className="flex gap-2">
                        <button className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Preview</button>
                        <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Save Layout</button>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {(selectedModule.layouts[0]?.sections || [
                        { id: "s1", label: "Lead Information", columns: 2, fields: ["f1", "f2", "f3", "f5", "f7", "f12"] },
                        { id: "s2", label: "Company Details", columns: 2, fields: ["f4", "f8", "f9", "f10"] },
                        { id: "s3", label: "Scoring & Tags", columns: 2, fields: ["f6"] },
                      ]).map((section, sIdx) => (
                        <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                              <span className="text-sm font-medium text-gray-800">{section.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600" defaultValue={section.columns}>
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns</option>
                              </select>
                              <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className={`p-4 grid grid-cols-${section.columns} gap-3`}>
                            {section.fields.map(fieldId => {
                              const field = selectedModule.fields.find(f => f.id === fieldId);
                              if (!field) return null;
                              const typeConfig = fieldTypeConfig[field.type];
                              return (
                                <div key={fieldId} className="border border-gray-200 rounded-lg p-2.5 flex items-center gap-2 group hover:border-indigo-300 bg-gray-50 cursor-move">
                                  <GripVertical className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400" />
                                  {typeConfig && <typeConfig.icon className={`w-3.5 h-3.5 ${typeConfig.color}`} />}
                                  <span className="text-xs font-medium text-gray-700 flex-1 truncate">{field.label}</span>
                                  {field.required && <span className="text-red-400 text-xs">*</span>}
                                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                            <button className="border-2 border-dashed border-gray-200 rounded-lg p-2.5 flex items-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                              <span className="text-xs">Add Field</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all">
                        <PlusCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Add New Section</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VALIDATION RULES TAB */}
          {activeTab === "validation" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Validation Rules</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Define rules to ensure data quality and business compliance</p>
                </div>
                <button onClick={addValidationRule} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />
                  New Rule
                </button>
              </div>

              <div className="space-y-4">
                {validationRules.filter(r => r.module === selectedModule.id || selectedModule.id === "leads").map(rule => (
                  <div key={rule.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${rule.active ? "bg-green-100" : "bg-gray-100"}`}>
                          <Shield className={`w-4 h-4 ${rule.active ? "text-green-600" : "text-gray-500"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{rule.name}</p>
                            <button onClick={() => toggleValidationRule(rule.id)} className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors ${rule.active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                              {rule.active ? "Active" : "Inactive"}
                            </button>
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              On {rule.triggerOn === "both" ? "Create & Update" : rule.triggerOn === "create" ? "Create" : "Update"}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-start gap-2 text-sm">
                              <span className="text-gray-500 min-w-20 font-medium">Condition:</span>
                              <code className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">{rule.condition}</code>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <span className="text-gray-500 min-w-20 font-medium">Error:</span>
                              <span className="text-gray-700">{rule.errorMessage}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button onClick={() => toggleValidationRule(rule.id)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteValidationRule(rule.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Formula Builder Guide */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">Validation Rule Syntax</p>
                      <p className="text-xs text-indigo-700 mt-1">Use field names, operators (AND, OR, NOT), comparisons (=, !=, &gt;, &lt;, &gt;=, &lt;=), and functions (isBlank(), contains(), startsWith()).</p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {["AND", "OR", "isBlank()", "contains()", "startsWith()", "TODAY()", "NOW()"].map(f => (
                          <code key={f} className="text-xs bg-white text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono">{f}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PIPELINES TAB */}
          {activeTab === "pipelines" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Pipeline List */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Pipelines</h3>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      New
                    </button>
                  </div>
                  {samplePipelines.map(pipeline => (
                    <button
                      key={pipeline.id}
                      onClick={() => setSelectedPipeline(pipeline)}
                      className={`w-full text-left border rounded-xl p-4 transition-all ${
                        selectedPipeline.id === pipeline.id
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-indigo-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{pipeline.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{pipeline.stages.length} stages</p>
                        </div>
                        {pipeline.isDefault && (
                          <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <div className="flex gap-0.5 mt-2">
                        {pipeline.stages.filter(s => s.category === "open").slice(0, 6).map(stage => (
                          <div key={stage.id} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: stage.color }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Stage Editor */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedPipeline.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedPipeline.stages.length} stages configured</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Duplicate</button>
                      <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Save Pipeline</button>
                    </div>
                  </div>
                  <div className="p-5">
                    {/* Visual pipeline */}
                    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
                      {selectedPipeline.stages.map((stage, idx) => (
                        <div key={stage.id} className="flex items-center flex-shrink-0">
                          <div className="relative flex flex-col items-center">
                            <div
                              className="w-28 h-10 flex items-center justify-center text-white text-xs font-medium rounded-lg shadow-sm"
                              style={{ backgroundColor: stage.color }}
                            >
                              {stage.name}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">{stage.probability}%</div>
                          </div>
                          {idx < selectedPipeline.stages.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-gray-300 mx-0.5 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Stage table */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-8"></th>
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Stage Name</th>
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Probability</th>
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Rotten Days</th>
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Category</th>
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Color</th>
                            <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPipeline.stages.map((stage, idx) => (
                            <tr key={stage.id} className={`${idx < selectedPipeline.stages.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50/50 group`}>
                              <td className="px-4 py-3">
                                <GripVertical className="w-4 h-4 text-gray-300 cursor-grab group-hover:text-gray-400" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                                  <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-24">
                                    <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${stage.probability}%` }} />
                                  </div>
                                  <span className="text-xs text-gray-600 w-8 text-right">{stage.probability}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-700">{stage.rottenDays > 0 ? `${stage.rottenDays} days` : "—"}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  stage.category === "won" ? "bg-green-50 text-green-700" :
                                  stage.category === "lost" ? "bg-red-50 text-red-700" :
                                  "bg-blue-50 text-blue-700"
                                }`}>
                                  {stage.category === "won" ? "Won" : stage.category === "lost" ? "Lost" : "Open"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="w-6 h-6 rounded-md" style={{ backgroundColor: stage.color }} />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                                  <button className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={() => setShowAddStage(true)}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Stage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEWS TAB */}
          {activeTab === "views" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Views & Saved Filters</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Create and manage custom views for {selectedModule.label}</p>
                </div>
                <button onClick={addView} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />
                  Create View
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {views.map((view, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <view.icon className="w-4 h-4 text-indigo-600" />
                        <span className="font-medium text-gray-900 text-sm">{view.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {view.isDefault && <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">Default</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${view.type === "personal" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                          {view.type === "personal" ? "Personal" : "Shared"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900">{view.count.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">records</span>
                    </div>
                    {view.conditions.length > 0 && (
                      <div className="space-y-1 mb-3">
                        {view.conditions.map((cond, ci) => (
                          <div key={ci} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                            <Filter className="w-3 h-3 text-gray-400" />
                            {cond}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button className="flex-1 text-xs text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-2 py-1.5 rounded-lg transition-colors">Edit</button>
                      <button onClick={() => deleteView(view.id)} className="text-xs text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advanced Filter Builder */}
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  Advanced Filter Builder
                </h4>
                <div className="space-y-3">
                  {[
                    { field: "Status", operator: "is", value: "Qualified" },
                    { field: "Lead Score", operator: "greater than", value: "70" },
                    { field: "Created Date", operator: "within", value: "Last 30 days" },
                  ].map((filter, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {i > 0 && (
                        <select className="w-16 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600">
                          <option>AND</option>
                          <option>OR</option>
                        </select>
                      )}
                      {i === 0 && <span className="w-16 text-xs text-gray-500 text-center">WHERE</span>}
                      <select className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700">
                        {selectedModule.fields.map(f => <option key={f.id}>{f.label}</option>)}
                      </select>
                      <select className="w-36 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700">
                        <option>is</option>
                        <option>is not</option>
                        <option>contains</option>
                        <option>greater than</option>
                        <option>less than</option>
                        <option>within</option>
                      </select>
                      <input className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5" defaultValue={filter.value} />
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
                    <PlusCircle className="w-4 h-4" />
                    Add Condition
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOWS TAB */}
          {activeTab === "workflows" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Automation Rules</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Auto-trigger actions when conditions are met</p>
                </div>
                <button onClick={addWorkflow} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                  <Plus className="w-4 h-4" />
                  New Automation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflows.map((workflow, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${workflow.color} flex items-center justify-center`}>
                          <workflow.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{workflow.name}</p>
                          <p className="text-xs text-gray-500">{workflow.runs} runs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleWorkflow(workflow.id)} className={`relative w-9 h-5 rounded-full transition-colors ${workflow.active ? "bg-indigo-500" : "bg-gray-300"}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${workflow.active ? "translate-x-4" : "translate-x-0.5"}`} /></button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">WHEN</span>
                        <span className="text-xs text-gray-700">{workflow.trigger}</span>
                      </div>
                      {workflow.actions.map((action, ai) => (
                        <div key={ai} className="flex items-start gap-2">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded flex-shrink-0">THEN</span>
                          <span className="text-xs text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button className="flex-1 text-xs text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-2 py-1.5 rounded-lg transition-colors">Edit</button>
                      <button className="text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors">History</button>
                      <button onClick={() => duplicateWorkflow(workflow.id)} className="text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors">Duplicate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERMISSIONS TAB */}
          {activeTab === "permissions" && (
            <div className="p-6">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900">Module Permissions</h3>
                <p className="text-sm text-gray-500 mt-0.5">Configure role-based access to {selectedModule.label} fields and actions</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 w-48">Role</th>
                      {["View", "Create", "Edit", "Delete", "Export", "Import", "Configure"].map(action => (
                        <th key={action} className="text-center text-xs font-medium text-gray-500 px-3 py-3">{action}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "Tenant Admin", color: "bg-red-500", perms: [true, true, true, true, true, true, true] },
                      { role: "Manager", color: "bg-orange-500", perms: [true, true, true, true, true, true, false] },
                      { role: "Sales Agent", color: "bg-blue-500", perms: [true, true, true, false, false, false, false] },
                      { role: "Support Agent", color: "bg-green-500", perms: [true, true, true, false, false, false, false] },
                      { role: "Auditor", color: "bg-gray-500", perms: [true, false, false, false, true, false, false] },
                    ].map((row, i) => (
                      <tr key={i} className={`${i < 4 ? "border-b border-gray-100" : ""} hover:bg-gray-50/50`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                            <span className="text-sm font-medium text-gray-800">{row.role}</span>
                          </div>
                        </td>
                        {row.perms.map((perm, pi) => (
                          <td key={pi} className="text-center px-3 py-3">
                            <button className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-colors ${perm ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                              {perm ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Field-level permissions */}
              <div className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-1">Field-Level Security</h4>
                <p className="text-xs text-gray-500 mb-4">Control which roles can view or edit individual fields</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 pb-2 w-40">Field</th>
                        {["Admin", "Manager", "Sales", "Support", "Auditor"].map(role => (
                          <th key={role} className="text-center text-xs font-medium text-gray-500 pb-2 px-2">{role}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedModule.fields.slice(0, 6).map((field, fi) => (
                        <tr key={field.id} className={`${fi < 5 ? "border-b border-gray-50" : ""}`}>
                          <td className="py-2 pr-3">
                            <div>
                              <p className="text-xs font-medium text-gray-800">{field.label}</p>
                              <p className="text-xs text-gray-400 font-mono">{field.apiName}</p>
                            </div>
                          </td>
                          {["admin", "manager", "sales", "support", "auditor"].map(role => (
                            <td key={role} className="text-center py-2 px-2">
                              <select className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-600">
                                <option value="rw">Edit</option>
                                <option value="ro">View</option>
                                <option value="hidden">Hidden</option>
                              </select>
                            </td>
                          ))}
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

      {/* New Field Modal */}
      {showNewFieldModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add Custom Field</h3>
              <button onClick={() => { setShowNewFieldModal(false); setSelectedFieldType(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {!selectedFieldType ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Select the type of field you want to create:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {(Object.entries(fieldTypeConfig) as [FieldType, typeof fieldTypeConfig[FieldType]][]).map(([type, config]) => (
                      <button
                        key={type}
                        onClick={() => setSelectedFieldType(type)}
                        className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-center group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center">
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{config.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedFieldType(null)} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 mb-4">
                    <ChevronLeft className="w-4 h-4" />
                    Back to field types
                  </button>
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                    {(() => {
                      const config = fieldTypeConfig[selectedFieldType];
                      return (
                        <>
                          <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                            <config.icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{config.label} Field</p>
                            <p className="text-xs text-gray-500">Configure your new field settings</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Label *</label>
                        <input type="text" placeholder="e.g., Customer Priority" value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">API Name (auto-generated)</label>
                        <input type="text" value={newFieldLabel.toLowerCase().replace(/\s+/g, "_")} readOnly className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea placeholder="Describe what this field is used for..." rows={2} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                    </div>
                    {(selectedFieldType === "picklist" || selectedFieldType === "multipicklist") && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Options (one per line)</label>
                        <textarea placeholder="Option 1&#10;Option 2&#10;Option 3" rows={4} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Section</label>
                      <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {Object.keys(fieldsBySection).map(s => <option key={s}>{s}</option>)}
                        <option>New Section</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: "required", label: "Required Field", desc: "User must fill this field" },
                        { key: "unique", label: "Unique Value", desc: "No duplicate values allowed" },
                        { key: "showListView", label: "Show in List View", desc: "Visible in table/list view" },
                        { key: "showDetailView", label: "Show in Detail View", desc: "Visible on record detail page" },
                      ].map(opt => (
                        <label key={opt.key} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="mt-0.5 rounded" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                            <p className="text-xs text-gray-500">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button onClick={() => { setShowNewFieldModal(false); setSelectedFieldType(null); setNewFieldLabel(""); }} className="flex-1 text-sm text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={() => { setShowNewFieldModal(false); setSelectedFieldType(null); setNewFieldLabel(""); }} className="flex-1 text-sm bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium">Add Field</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
