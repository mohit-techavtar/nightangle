import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Download,
  RefreshCw,
  ExternalLink,
  Shield,
} from "lucide-react";

interface LanguageVariation {
  id: string;
  language: string;
  text: string;
}

interface AuditEvent {
  id: string;
  type: "success" | "warning";
  message: string;
  date: string;
}

const auditEvents: AuditEvent[] = [
  {
    id: "1",
    type: "success",
    message: "DND sync completed — 234 numbers blocked",
    date: "Today",
  },
  {
    id: "2",
    type: "warning",
    message: "3 calls attempted outside calling hours (auto-blocked)",
    date: "Yesterday",
  },
  {
    id: "3",
    type: "success",
    message: "Consent captured for 89/92 calls (97%)",
    date: "Yesterday",
  },
  {
    id: "4",
    type: "success",
    message: "AI disclosure verified for all calls",
    date: "Yesterday",
  },
];

export function ComplianceConsent() {
  const navigate = useNavigate();
  const [overallCompliant, setOverallCompliant] = useState(true);

  // AI Disclosure
  const [aiMustIdentify, setAiMustIdentify] = useState(true);
  const [disclosureSeconds, setDisclosureSeconds] = useState(15);
  const [mustCompleteBeforeProceeding, setMustCompleteBeforeProceeding] = useState(true);
  const [languageVariations, setLanguageVariations] = useState<LanguageVariation[]>([
    {
      id: "1",
      language: "Hindi",
      text: "Yeh call ek AI assistant dwara ki ja rahi hai",
    },
    {
      id: "2",
      language: "English",
      text: "This call is being made by an AI assistant",
    },
    {
      id: "3",
      language: "Marathi",
      text: "",
    },
  ]);

  // Recording Consent
  const [recordingRequiresConsent, setRecordingRequiresConsent] = useState(true);
  const [consentScript, setConsentScript] = useState(
    "Yeh call quality aur training ke liye record ki ja sakti hai. Kya aap sahmat hain?"
  );
  const [consentDeniedAction, setConsentDeniedAction] = useState("continue");
  const [autoEnableRecording, setAutoEnableRecording] = useState(true);

  // DND Compliance
  const [checkDndRegistry, setCheckDndRegistry] = useState(true);
  const [dndProvider, setDndProvider] = useState("TRAI DND Registry");
  const [autoScrubLeads, setAutoScrubLeads] = useState(true);
  const [blockDndCalls, setBlockDndCalls] = useState(true);
  const [dndOverrideExisting, setDndOverrideExisting] = useState(false);
  const [lastDndSync, setLastDndSync] = useState("April 1, 2026 at 6:00 AM");

  // Calling Hours
  const [enforceCallingHours, setEnforceCallingHours] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("19:00");
  const [timezone, setTimezone] = useState("lead-local");
  const [noHolidayCalls, setNoHolidayCalls] = useState(true);

  // Data Retention
  const [recordingRetention, setRecordingRetention] = useState(90);
  const [transcriptRetention, setTranscriptRetention] = useState(180);
  const [autoDelete, setAutoDelete] = useState(true);
  const [enableDeletionRequests, setEnableDeletionRequests] = useState(true);

  const addLanguageVariation = () => {
    setLanguageVariations([
      ...languageVariations,
      {
        id: Date.now().toString(),
        language: "",
        text: "",
      },
    ]);
  };

  const updateLanguageVariation = (id: string, field: "language" | "text", value: string) => {
    setLanguageVariations(
      languageVariations.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tenant/ai-calling")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Compliance & Consent
                  </h1>
                  {overallCompliant ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      All compliant
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      Action needed
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Configure AI disclosure, recording consent, and regulatory compliance
                </p>
              </div>
            </div>

            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* SECTION 1 - AI Disclosure Requirements */}
          <div className="bg-white rounded-lg border-l-4 border-l-red-500 border-t border-r border-b border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200 bg-red-50">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Disclosure Requirements
                </h3>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                  MANDATORY
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* AI Must Identify Toggle */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      AI must identify itself
                    </span>
                    <Lock className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Required by regulation - cannot be disabled
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={aiMustIdentify}
                    disabled
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-not-allowed opacity-60"
                  />
                  <span className="text-sm font-medium text-green-700">ON</span>
                </div>
              </div>

              {/* Disclosure Timing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Timing: Disclose within first
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={disclosureSeconds}
                      onChange={(e) => setDisclosureSeconds(Number(e.target.value))}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                    <span className="text-sm text-gray-600">seconds</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mustCompleteBeforeProceeding}
                      onChange={(e) => setMustCompleteBeforeProceeding(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Must complete before proceeding to conversation
                    </span>
                  </label>
                </div>
              </div>

              {/* Language Variations */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Language Variations</h4>

                <div className="space-y-3">
                  {languageVariations.map((lang) => (
                    <div
                      key={lang.id}
                      className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="lg:col-span-1">
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Language
                        </label>
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) =>
                            updateLanguageVariation(lang.id, "language", e.target.value)
                          }
                          placeholder="e.g., Telugu"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                      <div className="lg:col-span-3">
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Disclosure Text
                        </label>
                        <input
                          type="text"
                          value={lang.text}
                          onChange={(e) =>
                            updateLanguageVariation(lang.id, "text", e.target.value)
                          }
                          placeholder="Enter disclosure message in this language"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addLanguageVariation}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Language
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2 - Call Recording Consent */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Call Recording Consent
            </h3>

            <div className="space-y-6">
              {/* Recording Requires Consent */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Recording requires consent
                  </div>
                  <p className="text-xs text-gray-600">
                    Ask for explicit permission before recording
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordingRequiresConsent}
                    onChange={(e) => setRecordingRequiresConsent(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      recordingRequiresConsent ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {recordingRequiresConsent ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Consent Script */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Consent Script
                </label>
                <textarea
                  value={consentScript}
                  onChange={(e) => setConsentScript(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Enter consent message..."
                />
              </div>

              {/* If Consent Denied */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  If consent denied:
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="consent-denied"
                      value="continue"
                      checked={consentDeniedAction === "continue"}
                      onChange={(e) => setConsentDeniedAction(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Continue call without recording
                      </div>
                      <p className="text-xs text-gray-600">
                        Proceed with conversation but don't record audio
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="consent-denied"
                      value="end"
                      checked={consentDeniedAction === "end"}
                      onChange={(e) => setConsentDeniedAction(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        End call and flag for human follow-up
                      </div>
                      <p className="text-xs text-gray-600">
                        Terminate AI call and schedule manual callback
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="consent-denied"
                      value="transfer"
                      checked={consentDeniedAction === "transfer"}
                      onChange={(e) => setConsentDeniedAction(e.target.value)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Transfer to human agent
                      </div>
                      <p className="text-xs text-gray-600">
                        Immediately connect to available human representative
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Auto-enable Recording */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Auto-enable recording after consent
                  </div>
                  <p className="text-xs text-gray-600">
                    Automatically start recording when customer agrees
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoEnableRecording}
                    onChange={(e) => setAutoEnableRecording(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      autoEnableRecording ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {autoEnableRecording ? "ON" : "OFF"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 3 - DND Compliance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              DND (Do Not Disturb) Compliance
            </h3>

            <div className="space-y-6">
              {/* Check DND Registry */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      Check DND registry before calling
                    </span>
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-600">Mandatory regulatory requirement</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checkDndRegistry}
                    disabled
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-not-allowed opacity-60"
                  />
                  <span className="text-sm font-medium text-green-700">ON</span>
                </div>
              </div>

              {/* DND Provider */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">DND Provider</label>
                <select
                  value={dndProvider}
                  onChange={(e) => setDndProvider(e.target.value)}
                  className="w-full lg:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option>TRAI DND Registry</option>
                  <option>Alternative Provider</option>
                </select>
              </div>

              {/* Auto-scrub Leads */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Auto-scrub uploaded leads against DND
                  </div>
                  <p className="text-xs text-gray-600">
                    Automatically check and remove DND numbers from uploaded lead lists
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoScrubLeads}
                    onChange={(e) => setAutoScrubLeads(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      autoScrubLeads ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {autoScrubLeads ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Block DND Calls */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Block calls to DND numbers
                  </div>
                  <p className="text-xs text-gray-600">
                    Prevent any outbound calls to registered DND numbers
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockDndCalls}
                    onChange={(e) => setBlockDndCalls(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      blockDndCalls ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {blockDndCalls ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* DND Override for Existing Customers */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    DND override for existing customers
                  </div>
                  <p className="text-xs text-gray-600">
                    Allow calls to DND numbers if they're existing customers with prior
                    relationship
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dndOverrideExisting}
                    onChange={(e) => setDndOverrideExisting(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      dndOverrideExisting ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {dndOverrideExisting ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Last DND Sync */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Last DND sync</div>
                  <p className="text-xs text-gray-600">{lastDndSync}</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium">
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 4 - Calling Hours Restrictions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Calling Hours Restrictions
            </h3>

            <div className="space-y-6">
              {/* Enforce Calling Hours */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Enforce calling hours
                  </div>
                  <p className="text-xs text-gray-600">
                    Only allow calls during specified time windows
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enforceCallingHours}
                    onChange={(e) => setEnforceCallingHours(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      enforceCallingHours ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {enforceCallingHours ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Allowed Hours */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full lg:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="lead-local">Lead's local timezone (auto-detect)</option>
                  <option value="ist">Fixed: IST (Indian Standard Time)</option>
                  <option value="utc">Fixed: UTC</option>
                </select>
              </div>

              {/* No Holiday Calls */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    No calls on national holidays
                  </div>
                  <p className="text-xs text-gray-600">
                    Automatically block calls on recognized public holidays
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noHolidayCalls}
                    onChange={(e) => setNoHolidayCalls(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      noHolidayCalls ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {noHolidayCalls ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Holiday Calendar Link */}
              <div className="pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  <ExternalLink className="w-4 h-4" />
                  Manage Holiday List
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5 - Data Retention & Privacy */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Data Retention & Privacy
            </h3>

            <div className="space-y-6">
              {/* Recording Retention */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Call recording retention
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={recordingRetention}
                    onChange={(e) => setRecordingRetention(Number(e.target.value))}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
              </div>

              {/* Transcript Retention */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Transcript retention
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={transcriptRetention}
                    onChange={(e) => setTranscriptRetention(Number(e.target.value))}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
              </div>

              {/* Auto-delete */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Auto-delete after retention period
                  </div>
                  <p className="text-xs text-gray-600">
                    Automatically remove data when retention period expires
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDelete}
                    onChange={(e) => setAutoDelete(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      autoDelete ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {autoDelete ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Right to Deletion */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Right to deletion: Enable customer data deletion requests
                  </div>
                  <p className="text-xs text-gray-600">
                    Allow customers to request permanent deletion of their data
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDeletionRequests}
                    onChange={(e) => setEnableDeletionRequests(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm font-medium ${
                      enableDeletionRequests ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {enableDeletionRequests ? "ON" : "OFF"}
                  </span>
                </label>
              </div>

              {/* Export Settings */}
              <div className="pt-4 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export all compliance settings
                </button>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Compliance Events
              </h3>
            </div>

            <div className="p-6 space-y-3">
              {auditEvents.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    event.type === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  {event.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        event.type === "success" ? "text-green-900" : "text-amber-900"
                      }`}
                    >
                      {event.message}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{event.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
