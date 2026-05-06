import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Globe,
  Activity,
  Bot,
  CheckCircle2,
  TrendingUp,
  Phone,
  Clock,
  Smile,
  Target,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";

export function EditAgent() {
  const navigate = useNavigate();
  
  // Agent State
  const [agentName, setAgentName] = useState("Priya (Sales)");
  const [isActive, setIsActive] = useState(true);
  
  // Voice & Language
  const [voiceProvider, setVoiceProvider] = useState("elevenlabs");
  const [selectedVoice, setSelectedVoice] = useState("kavya");
  const [primaryLanguage, setPrimaryLanguage] = useState("hindi");
  const [secondaryLanguages, setSecondaryLanguages] = useState(["English", "Marathi"]);
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [speakingSpeed, setSpeakingSpeed] = useState(1.0);
  const [fillerWords, setFillerWords] = useState(true);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  
  // Personality & Tone
  const [formality, setFormality] = useState(70);
  const [empathy, setEmpathy] = useState(60);
  const [assertiveness, setAssertiveness] = useState(50);
  
  // Conversation Guardrails
  const [maxCallDuration, setMaxCallDuration] = useState(5);
  const [silenceThreshold, setSilenceThreshold] = useState(8);
  const [maxRetries, setMaxRetries] = useState(3);
  const [prohibitedTopics, setProhibitedTopics] = useState([
    "Competitor pricing",
    "Legal advice",
    "Personal opinions",
  ]);
  const [newProhibitedTopic, setNewProhibitedTopic] = useState("");
  const [disclosures, setDisclosures] = useState({
    aiAssistant: true,
    callRecording: true,
    custom: false,
    customText: "",
  });
  const [escalationTriggers, setEscalationTriggers] = useState([
    "speak to human",
    "manager",
    "complaint",
    "cancel",
  ]);
  const [newTrigger, setNewTrigger] = useState("");

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");

  const voiceOptions = [
    { id: "kavya", label: "Kavya - Female", gender: "Female" },
    { id: "ravi", label: "Ravi - Male", gender: "Male" },
    { id: "ananya", label: "Ananya - Female", gender: "Female" },
  ];

  const getSpeakingSpeedLabel = (speed: number) => {
    if (speed < 0.8) return "Slow";
    if (speed > 1.2) return "Fast";
    return "Normal";
  };

  const getPersonalityPreview = () => {
    let greeting = "Namaste";
    let tone = "";
    
    if (formality > 60) {
      greeting = "Namaste ji";
    }
    
    if (empathy > 50) {
      tone = "Main samajh sakti hoon ki aapka time valuable hai.";
    }
    
    return `${greeting} Rajesh ji! Main Priya bol rahi hoon Nightangle se. Aapne humari jewellery software ke baare mein inquiry ki thi. Kya aapke paas 2 minute hain? ${empathy > 50 ? tone : ""}`;
  };

  const addProhibitedTopic = () => {
    if (newProhibitedTopic.trim() && !prohibitedTopics.includes(newProhibitedTopic.trim())) {
      setProhibitedTopics([...prohibitedTopics, newProhibitedTopic.trim()]);
      setNewProhibitedTopic("");
    }
  };

  const removeProhibitedTopic = (topic: string) => {
    setProhibitedTopics(prohibitedTopics.filter(t => t !== topic));
  };

  const addEscalationTrigger = () => {
    if (newTrigger.trim() && !escalationTriggers.includes(newTrigger.trim())) {
      setEscalationTriggers([...escalationTriggers, newTrigger.trim()]);
      setNewTrigger("");
    }
  };

  const removeEscalationTrigger = (trigger: string) => {
    setEscalationTriggers(escalationTriggers.filter(t => t !== trigger));
  };

  const handleSave = () => {
    // Simulate save
    setShowSaveModal(false);
    // In real app, this would save to backend
    setTimeout(() => {
      navigate("/tenant/ai-agents");
    }, 500);
  };

  const handleDiscard = () => {
    setShowDiscardModal(false);
    navigate("/tenant/ai-agents");
  };

  const handleTest = () => {
    if (!testPhoneNumber.trim()) return;
    // Simulate test call
    setShowTestModal(false);
    // In real app, this would initiate a test call
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Communication" },
          { label: "AI Agents", href: "/tenant/ai-agents" },
          { label: "Edit Agent" }
        ]}
        companyName="Everest Digital Solutions"
        mode="customer"
        userName="Rajesh Sharma"
        userEmail="rajesh@everestdigital.com"
        userInitials="RS"
      />
      
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => navigate("/tenant/ai-agents")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="text-2xl font-semibold text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-violet-500 rounded px-2 py-1"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDiscardModal(true)}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={() => setShowTestModal(true)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Test Agent
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* LEFT COLUMN - 60% */}
              <div className="lg:col-span-3 space-y-6">
                {/* SECTION 1 - Voice & Language Configuration */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-violet-600" />
                    Voice & Language Configuration
                  </h2>

                  {/* Voice Provider */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Voice Provider
                    </label>
                    <select
                      value={voiceProvider}
                      onChange={(e) => setVoiceProvider(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                    >
                      <option value="elevenlabs">ElevenLabs</option>
                      <option value="google">Google TTS</option>
                      <option value="azure">Azure Speech</option>
                      <option value="custom">Custom Provider</option>
                    </select>
                  </div>

                  {/* Voice Selection */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Voice Selection
                    </label>
                    <div className="space-y-2">
                      {voiceOptions.map((voice) => (
                        <div
                          key={voice.id}
                          className={`flex items-center justify-between p-3 border rounded-lg transition-all cursor-pointer ${
                            selectedVoice === voice.id
                              ? "border-violet-500 bg-violet-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedVoice(voice.id)}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              checked={selectedVoice === voice.id}
                              onChange={() => setSelectedVoice(voice.id)}
                              className="w-4 h-4 text-violet-600"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {voice.label}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlayingPreview(!isPlayingPreview);
                            }}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isPlayingPreview && selectedVoice === voice.id ? (
                              <Pause className="w-4 h-4 text-violet-600" />
                            ) : (
                              <Play className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Audio Waveform Preview */}
                    {selectedVoice && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="w-4 h-4 text-violet-600" />
                          <span className="text-xs font-medium text-gray-700">Preview</span>
                        </div>
                        <div className="flex items-center gap-1 h-8">
                          {[...Array(40)].map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-violet-400 rounded-full"
                              style={{
                                height: `${Math.random() * 100}%`,
                                opacity: isPlayingPreview ? 0.7 : 0.3,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Language */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Primary Language
                    </label>
                    <select
                      value={primaryLanguage}
                      onChange={(e) => setPrimaryLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                    >
                      <option value="hindi">🇮🇳 Hindi</option>
                      <option value="english">🇬🇧 English</option>
                      <option value="marathi">🇮🇳 Marathi</option>
                    </select>
                  </div>

                  {/* Secondary Languages */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Secondary Languages
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {secondaryLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                        >
                          {lang}
                          <button
                            onClick={() =>
                              setSecondaryLanguages(secondaryLanguages.filter((l) => l !== lang))
                            }
                            className="hover:text-violet-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <select
                      onChange={(e) => {
                        if (e.target.value && !secondaryLanguages.includes(e.target.value)) {
                          setSecondaryLanguages([...secondaryLanguages, e.target.value]);
                          e.target.value = "";
                        }
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                    >
                      <option value="">Add language...</option>
                      <option value="English">English</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                    </select>
                  </div>

                  {/* Language Detection */}
                  <div className="mb-5 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Language Detection</div>
                        <div className="text-xs text-gray-600">Auto-detect caller's language and switch</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoDetectLanguage(!autoDetectLanguage)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoDetectLanguage ? "bg-violet-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoDetectLanguage ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Speaking Speed */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Speaking Speed: {speakingSpeed.toFixed(1)}x ({getSpeakingSpeedLabel(speakingSpeed)})
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speakingSpeed}
                      onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5x</span>
                      <span>1.0x</span>
                      <span>2.0x</span>
                    </div>
                  </div>

                  {/* Filler Words */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Filler Words</div>
                      <div className="text-xs text-gray-600">Include natural fillers (hmm, accha, theek hai)</div>
                    </div>
                    <button
                      onClick={() => setFillerWords(!fillerWords)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        fillerWords ? "bg-violet-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          fillerWords ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* SECTION 2 - Personality & Tone */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <Smile className="w-5 h-5 text-violet-600" />
                    Personality & Tone
                  </h2>

                  {/* Formality Level */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Formality Level
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formality}
                      onChange={(e) => setFormality(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Casual</span>
                      <span className="font-medium text-violet-600">{formality}%</span>
                      <span>Formal</span>
                    </div>
                  </div>

                  {/* Empathy Tone */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Empathy Tone
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={empathy}
                      onChange={(e) => setEmpathy(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Direct</span>
                      <span className="font-medium text-violet-600">{empathy}%</span>
                      <span>Empathetic</span>
                    </div>
                  </div>

                  {/* Assertiveness */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Assertiveness
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={assertiveness}
                      onChange={(e) => setAssertiveness(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Soft</span>
                      <span className="font-medium text-violet-600">{assertiveness}%</span>
                      <span>Assertive</span>
                    </div>
                  </div>

                  {/* Personality Preview */}
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Bot className="w-5 h-5 text-violet-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-violet-700 mb-2">
                          Based on your settings, Priya would say:
                        </div>
                        <div className="text-sm text-gray-900 leading-relaxed italic">
                          "{getPersonalityPreview()}"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3 - Conversation Guardrails */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-violet-600" />
                    Conversation Guardrails
                  </h2>

                  {/* Max Call Duration */}
                  <div className="mb-5 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Max Call Duration
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={maxCallDuration}
                          onChange={(e) => setMaxCallDuration(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                        />
                        <span className="text-sm text-gray-600">min</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Silence Threshold
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={silenceThreshold}
                          onChange={(e) => setSilenceThreshold(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                        />
                        <span className="text-sm text-gray-600">sec</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Max Retries
                      </label>
                      <input
                        type="number"
                        value={maxRetries}
                        onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Prohibited Topics */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Prohibited Topics
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {prohibitedTopics.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                        >
                          {topic}
                          <button onClick={() => removeProhibitedTopic(topic)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProhibitedTopic}
                        onChange={(e) => setNewProhibitedTopic(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addProhibitedTopic()}
                        placeholder="Add prohibited topic..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      />
                      <button
                        onClick={addProhibitedTopic}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Required Disclosures */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Required Disclosures
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={disclosures.aiAssistant}
                          onChange={(e) =>
                            setDisclosures({ ...disclosures, aiAssistant: e.target.checked })
                          }
                          className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-700">This call is from an AI assistant</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={disclosures.callRecording}
                          onChange={(e) =>
                            setDisclosures({ ...disclosures, callRecording: e.target.checked })
                          }
                          className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-700">This call may be recorded</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={disclosures.custom}
                          onChange={(e) =>
                            setDisclosures({ ...disclosures, custom: e.target.checked })
                          }
                          className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gray-700 block mb-2">Custom disclosure...</span>
                          {disclosures.custom && (
                            <textarea
                              value={disclosures.customText}
                              onChange={(e) =>
                                setDisclosures({ ...disclosures, customText: e.target.value })
                              }
                              placeholder="Enter custom disclosure text..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                            />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Escalation Trigger Words */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Escalation Trigger Words
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {escalationTriggers.map((trigger) => (
                        <span
                          key={trigger}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                        >
                          {trigger}
                          <button onClick={() => removeEscalationTrigger(trigger)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTrigger}
                        onChange={(e) => setNewTrigger(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addEscalationTrigger()}
                        placeholder="Add trigger word..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      />
                      <button
                        onClick={addEscalationTrigger}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - 40% */}
              <div className="lg:col-span-2 space-y-6">
                {/* SECTION 4 - Agent Preview Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Agent Preview Card</h3>
                  <div className="bg-white rounded-lg border-2 border-violet-200 p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="relative w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: "#8B5CF615",
                          border: "2px solid #8B5CF6",
                        }}
                      >
                        <Bot className="w-7 h-7 text-violet-600" />
                        <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-violet-600 rounded text-xs font-bold text-white">
                          PS
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{agentName}</h3>
                        <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Sales
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3 h-3" />
                        <span>
                          {voiceOptions.find((v) => v.id === selectedVoice)?.gender},{" "}
                          {primaryLanguage}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded text-xs">
                          Persuasive
                        </span>
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded text-xs">
                          Professional
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 5 - Performance Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Performance Summary
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Total Calls</div>
                      <div className="text-xl font-bold text-gray-900">12,450</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Avg Duration</div>
                      <div className="text-xl font-bold text-gray-900 font-mono">3m 38s</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Connect Rate</div>
                      <div className="text-xl font-bold text-green-600">72%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Positive Sentiment</div>
                      <div className="text-xl font-bold text-green-600">64%</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-gray-600 mb-1">Avg Confidence Score</div>
                    <div className="text-2xl font-bold text-violet-600">87%</div>
                  </div>

                  {/* Mini Line Chart */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-3">Performance (Last 30 Days)</div>
                    <div className="h-20 flex items-end gap-1">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-violet-200 rounded-t"
                          style={{
                            height: `${40 + Math.random() * 60}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 6 - Assigned Campaigns */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Assigned Campaigns</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          Jewellery Software Q2
                        </div>
                        <div className="text-xs text-gray-600">Active</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          Trading Platform Outreach
                        </div>
                        <div className="text-xs text-gray-600">Active</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          Product Demo Follow-ups
                        </div>
                        <div className="text-xs text-gray-600">Paused</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <button className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Assign to Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Save Agent Configuration?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will update the configuration for "{agentName}". All active and scheduled campaigns using this agent will use the updated settings.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Discard Changes?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  All unsaved changes will be lost. This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDiscardModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Agent Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Test AI Agent</h3>
                <p className="text-sm text-gray-600">
                  Enter your phone number to receive a test call from this AI agent.
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleTest}
                disabled={!testPhoneNumber.trim()}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Initiate Test Call
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}