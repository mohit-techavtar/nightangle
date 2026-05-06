import React, { useState } from "react";
import { X, Sparkles, Zap, Copy, Download, Send } from "lucide-react";

interface ContentGenerationFormProps {
  template: {
    id: string;
    title: string;
    icon: any;
    category: string;
    type: string;
    credits: number;
  };
  onGenerate: (inputs: Record<string, any>) => void;
  onCancel: () => void;
}

export function ContentGenerationForm({ template, onGenerate, onCancel }: ContentGenerationFormProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({
    tone: "professional",
    length: "medium",
  });
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI generation
    onGenerate(inputs);
    setGenerating(false);
  };

  const renderFormFields = () => {
    switch (template.category) {
      case "text":
        return (
          <>
            {/* Purpose/Goal */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Content Purpose <span className="text-[#C62828]">*</span>
              </label>
              <textarea
                value={inputs.purpose || ""}
                onChange={(e) => setInputs({ ...inputs, purpose: e.target.value })}
                placeholder="What is the goal of this content? (e.g., Generate leads for our new product launch)"
                rows={3}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
                required
              />
            </div>

            {/* Target Audience */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Target Audience <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="text"
                value={inputs.audience || ""}
                onChange={(e) => setInputs({ ...inputs, audience: e.target.value })}
                placeholder="e.g., B2B decision makers, tech startups, retail customers"
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                required
              />
            </div>

            {/* Key Points */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Key Points to Include
              </label>
              <textarea
                value={inputs.keyPoints || ""}
                onChange={(e) => setInputs({ ...inputs, keyPoints: e.target.value })}
                placeholder="List important points or messages (one per line)"
                rows={4}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
              />
            </div>
          </>
        );

      case "marketing":
        return (
          <>
            {/* Topic/Keyword */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Topic/Primary Keyword <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="text"
                value={inputs.topic || ""}
                onChange={(e) => setInputs({ ...inputs, topic: e.target.value })}
                placeholder="e.g., Electric kettle buying guide"
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                required
              />
            </div>

            {/* Secondary Keywords */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Secondary Keywords
              </label>
              <input
                type="text"
                value={inputs.keywords || ""}
                onChange={(e) => setInputs({ ...inputs, keywords: e.target.value })}
                placeholder="Separate with commas (e.g., best electric kettle, kettle price Nepal)"
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              />
            </div>

            {/* Target Audience */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Target Audience <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="text"
                value={inputs.audience || ""}
                onChange={(e) => setInputs({ ...inputs, audience: e.target.value })}
                placeholder="e.g., First-time buyers, home appliance shoppers"
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                required
              />
            </div>

            {/* Length */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Content Length
              </label>
              <select
                value={inputs.length || "medium"}
                onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                <option value="short">Short (500-800 words)</option>
                <option value="medium">Medium (800-1200 words)</option>
                <option value="long">Long (1500-2000 words)</option>
              </select>
            </div>
          </>
        );

      case "creative":
        return (
          <>
            {/* Creative Brief */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Creative Brief <span className="text-[#C62828]">*</span>
              </label>
              <textarea
                value={inputs.brief || ""}
                onChange={(e) => setInputs({ ...inputs, brief: e.target.value })}
                placeholder="Describe what you want to create (e.g., Modern kitchen scene with electric kettle, morning sunlight)"
                rows={4}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
                required
              />
            </div>

            {/* Style/Theme */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Style/Theme
              </label>
              <select
                value={inputs.style || "modern"}
                onChange={(e) => setInputs({ ...inputs, style: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                <option value="modern">Modern & Clean</option>
                <option value="vibrant">Vibrant & Colorful</option>
                <option value="minimal">Minimal & Simple</option>
                <option value="professional">Professional & Corporate</option>
                <option value="playful">Playful & Fun</option>
              </select>
            </div>

            {/* Platform */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Platform/Format
              </label>
              <select
                value={inputs.platform || "instagram"}
                onChange={(e) => setInputs({ ...inputs, platform: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                <option value="instagram">Instagram (1:1 Square)</option>
                <option value="facebook">Facebook (1200x630)</option>
                <option value="linkedin">LinkedIn (1200x627)</option>
                <option value="twitter">Twitter/X (1200x675)</option>
                <option value="story">Stories (9:16 Vertical)</option>
              </select>
            </div>
          </>
        );

      case "video":
        return (
          <>
            {/* Video Concept */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Video Concept <span className="text-[#C62828]">*</span>
              </label>
              <textarea
                value={inputs.concept || ""}
                onChange={(e) => setInputs({ ...inputs, concept: e.target.value })}
                placeholder="What's your video about? (e.g., Product demo showing how to use the electric kettle)"
                rows={3}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
                required
              />
            </div>

            {/* Duration */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Video Duration
              </label>
              <select
                value={inputs.duration || "30"}
                onChange={(e) => setInputs({ ...inputs, duration: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                <option value="15">15 seconds (Quick hook)</option>
                <option value="30">30 seconds (Standard)</option>
                <option value="60">60 seconds (Detailed)</option>
                <option value="90">90 seconds (In-depth)</option>
              </select>
            </div>

            {/* Call to Action */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Call to Action
              </label>
              <input
                type="text"
                value={inputs.cta || ""}
                onChange={(e) => setInputs({ ...inputs, cta: e.target.value })}
                placeholder="e.g., Visit our website, Order now, Learn more"
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              />
            </div>
          </>
        );

      case "voice":
        return (
          <>
            {/* Call Objective */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Call Objective <span className="text-[#C62828]">*</span>
              </label>
              <select
                value={inputs.objective || "appointment"}
                onChange={(e) => setInputs({ ...inputs, objective: e.target.value })}
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              >
                <option value="appointment">Schedule Appointment</option>
                <option value="survey">Survey/Feedback</option>
                <option value="sales">Product Sale</option>
                <option value="followup">Follow-up</option>
                <option value="support">Customer Support</option>
              </select>
            </div>

            {/* Product/Service */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Product/Service <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="text"
                value={inputs.product || ""}
                onChange={(e) => setInputs({ ...inputs, product: e.target.value })}
                placeholder="e.g., Smart Electric Kettle, Insurance Policy"
                className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                required
              />
            </div>

            {/* Key Benefits */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Key Benefits to Mention
              </label>
              <textarea
                value={inputs.benefits || ""}
                onChange={(e) => setInputs({ ...inputs, benefits: e.target.value })}
                placeholder="List 3-5 key benefits or features"
                rows={3}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
              />
            </div>

            {/* Objections */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[#212121] mb-2 block">
                Common Objections
              </label>
              <textarea
                value={inputs.objections || ""}
                onChange={(e) => setInputs({ ...inputs, objections: e.target.value })}
                placeholder="List common objections and how to handle them"
                rows={3}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const Icon = template.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{template.title}</h3>
              <p className="text-sm text-white/80">{template.type} Content</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Tone Selection */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Tone & Style
            </label>
            <div className="grid grid-cols-3 max-md:grid-cols-2 gap-2">
              {["professional", "friendly", "casual", "formal", "persuasive", "informative"].map(tone => (
                <button
                  key={tone}
                  onClick={() => setInputs({ ...inputs, tone })}
                  className={`px-3 py-2 rounded-md border text-sm font-medium capitalize transition-all ${
                    inputs.tone === tone
                      ? "border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]"
                      : "border-[#E0E0E0] hover:bg-[#F5F5F5] text-[#616161]"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Form Fields */}
          {renderFormFields()}

          {/* Additional Context */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              Additional Context (Optional)
            </label>
            <textarea
              value={inputs.context || ""}
              onChange={(e) => setInputs({ ...inputs, context: e.target.value })}
              placeholder="Any additional information or specific requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
          <div className="text-sm text-[#616161]">
            Cost: <span className="font-bold text-[#1565C0]">{template.credits} Credit{template.credits > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Zap size={16} className="animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
