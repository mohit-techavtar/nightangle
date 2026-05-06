import React, { useState } from "react";
import { Sparkles, Hash, Image as ImageIcon, Calendar, Target, TrendingUp, Zap } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  charLimit: number;
  formats: string[];
}

const platforms: Platform[] = [
  { id: "instagram", name: "Instagram", icon: "📷", color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045]", charLimit: 2200, formats: ["Feed", "Story", "Reel", "Carousel"] },
  { id: "facebook", name: "Facebook", icon: "👥", color: "bg-[#1877F2]", charLimit: 63206, formats: ["Post", "Story", "Video"] },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-[#0A66C2]", charLimit: 3000, formats: ["Post", "Article", "Document"] },
  { id: "twitter", name: "Twitter/X", icon: "🐦", color: "bg-[#000000]", charLimit: 280, formats: ["Tweet", "Thread"] },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-[#000000]", charLimit: 2200, formats: ["Video"] },
];

interface SocialPostGeneratorProps {
  onGenerate: (config: any) => void;
}

export function SocialPostGenerator({ onGenerate }: SocialPostGeneratorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [postType, setPostType] = useState("promotional");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [callToAction, setCallToAction] = useState("");
  const [generating, setGenerating] = useState(false);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic or message");
      return;
    }

    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onGenerate({
      platforms: selectedPlatforms,
      postType,
      topic,
      tone,
      includeHashtags,
      includeEmojis,
      callToAction,
    });
    
    setGenerating(false);
  };

  const postTypes = [
    { value: "promotional", label: "Promotional", icon: "📣", description: "Product launches, offers" },
    { value: "educational", label: "Educational", icon: "📚", description: "Tips, guides, tutorials" },
    { value: "engagement", label: "Engagement", icon: "💬", description: "Questions, polls, contests" },
    { value: "announcement", label: "Announcement", icon: "📢", description: "News, updates, events" },
    { value: "testimonial", label: "Testimonial", icon: "⭐", description: "Reviews, success stories" },
    { value: "behind-scenes", label: "Behind the Scenes", icon: "🎬", description: "Team, culture, process" },
  ];

  const tones = ["professional", "friendly", "casual", "inspiring", "humorous", "authoritative"];

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-[#1565C0]" size={20} />
        <h3 className="text-lg font-semibold text-[#212121]">AI-Powered Post Generator</h3>
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-[#212121] mb-3 block">
          Select Platforms <span className="text-[#C62828]">*</span>
        </label>
        <div className="grid grid-cols-5 max-md:grid-cols-2 gap-3">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? "border-[#1565C0] bg-[#E3F2FD]"
                  : "border-[#E0E0E0] hover:border-[#BDBDBD]"
              }`}
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <div className="text-xs font-semibold text-[#212121]">{platform.name}</div>
              {selectedPlatforms.includes(platform.id) && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#616161] mt-2">
          Content will be optimized for each platform's format and character limits
        </p>
      </div>

      {/* Post Type */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-[#212121] mb-3 block">
          Post Type <span className="text-[#C62828]">*</span>
        </label>
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3">
          {postTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setPostType(type.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                postType === type.value
                  ? "border-[#1565C0] bg-[#E3F2FD]"
                  : "border-[#E0E0E0] hover:bg-[#F5F5F5]"
              }`}
            >
              <div className="text-xl mb-1">{type.icon}</div>
              <div className="text-sm font-semibold text-[#212121]">{type.label}</div>
              <div className="text-xs text-[#616161]">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Topic/Message */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-[#212121] mb-2 block">
          Topic or Message <span className="text-[#C62828]">*</span>
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Launching our new Smart Electric Kettle with 20% off for early customers. Features fast boiling, auto shut-off, and LED display."
          rows={4}
          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-[#616161]">
            Describe what you want to post about
          </p>
          <span className="text-xs text-[#9E9E9E]">{topic.length} characters</span>
        </div>
      </div>

      {/* Tone Selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-[#212121] mb-2 block">
          Tone & Style
        </label>
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-2">
          {tones.map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-2 rounded-md border text-sm font-medium capitalize transition-all ${
                tone === t
                  ? "border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]"
                  : "border-[#E0E0E0] hover:bg-[#F5F5F5] text-[#616161]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-[#212121] mb-2 block">
          Call to Action (Optional)
        </label>
        <input
          type="text"
          value={callToAction}
          onChange={(e) => setCallToAction(e.target.value)}
          placeholder="e.g., Shop Now, Learn More, Sign Up Today, Visit Our Website"
          className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
        />
      </div>

      {/* Options */}
      <div className="mb-6 space-y-3">
        <label className="text-sm font-semibold text-[#212121] block">
          Content Options
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHashtags}
            onChange={(e) => setIncludeHashtags(e.target.checked)}
            className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
          />
          <div>
            <div className="text-sm font-medium text-[#212121] flex items-center gap-2">
              <Hash size={14} />
              Include Optimized Hashtags
            </div>
            <div className="text-xs text-[#616161]">AI-generated trending and relevant hashtags</div>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeEmojis}
            onChange={(e) => setIncludeEmojis(e.target.checked)}
            className="w-4 h-4 rounded border-[#E0E0E0] text-[#1565C0] focus:ring-[#1565C0]"
          />
          <div>
            <div className="text-sm font-medium text-[#212121]">Include Emojis</div>
            <div className="text-xs text-[#616161]">Add relevant emojis for better engagement</div>
          </div>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating || !topic.trim() || selectedPlatforms.length === 0}
        className="w-full h-12 rounded-lg bg-[#1565C0] text-white font-semibold hover:bg-[#0D47A1] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
      >
        {generating ? (
          <>
            <Zap size={20} className="animate-pulse" />
            Generating AI Content...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Posts ({selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'})
          </>
        )}
      </button>

      {/* Cost Info */}
      <div className="mt-3 p-3 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
        <div className="flex items-center gap-2 text-sm text-[#1565C0]">
          <Target size={14} />
          <span>Cost: <strong>1 Credit</strong> • Generates optimized content for {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'platform' : 'platforms'}</span>
        </div>
      </div>
    </div>
  );
}
