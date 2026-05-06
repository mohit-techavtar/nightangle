import React, { useState } from "react";
import { Copy, Download, Send, Edit, CheckCircle, Calendar, Hash } from "lucide-react";

interface GeneratedPost {
  platform: string;
  platformIcon: string;
  caption: string;
  hashtags: string[];
  charCount: number;
  charLimit: number;
  engagement: { likes: number; comments: number; shares: number };
}

interface GeneratedPostsPreviewProps {
  posts: GeneratedPost[];
  onSchedule: (platformIds: string[]) => void;
  onEdit: (platform: string, newCaption: string) => void;
}

export function GeneratedPostsPreview({ posts, onSchedule, onEdit }: GeneratedPostsPreviewProps) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>(posts.map(p => p.platform));
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleCopy = (platform: string, caption: string) => {
    navigator.clipboard.writeText(caption);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const handleEdit = (platform: string, caption: string) => {
    setEditingPlatform(platform);
    setEditText(caption);
  };

  const handleSaveEdit = (platform: string) => {
    onEdit(platform, editText);
    setEditingPlatform(null);
  };

  const togglePostSelection = (platform: string) => {
    setSelectedPosts(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram": return "from-[#833AB4] via-[#FD1D1D] to-[#FCB045]";
      case "facebook": return "from-[#1877F2] to-[#0C63D4]";
      case "linkedin": return "from-[#0A66C2] to-[#004182]";
      case "twitter": return "from-[#1DA1F2] to-[#0C85D0]";
      case "tiktok": return "from-[#000000] to-[#333333]";
      default: return "from-[#616161] to-[#424242]";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-md:flex-col max-md:gap-3 max-md:items-start">
        <div>
          <h3 className="text-lg font-semibold text-[#212121]">Generated Posts</h3>
          <p className="text-sm text-[#616161]">{selectedPosts.length} of {posts.length} selected for publishing</p>
        </div>
        <button
          onClick={() => onSchedule(selectedPosts)}
          disabled={selectedPosts.length === 0}
          className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Calendar size={16} />
          Schedule {selectedPosts.length > 0 ? `(${selectedPosts.length})` : 'Posts'}
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {posts.map(post => (
          <div
            key={post.platform}
            className={`bg-white rounded-lg border-2 transition-all ${
              selectedPosts.includes(post.platform)
                ? "border-[#1565C0] shadow-lg"
                : "border-[#E0E0E0]"
            }`}
          >
            {/* Platform Header */}
            <div className={`px-4 py-3 bg-gradient-to-r ${getPlatformColor(post.platform)} text-white rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{post.platformIcon}</div>
                  <div>
                    <div className="font-semibold capitalize">{post.platform}</div>
                    <div className="text-xs text-white/80">
                      {post.charCount}/{post.charLimit} characters
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.platform)}
                    onChange={() => togglePostSelection(post.platform)}
                    className="w-4 h-4 rounded border-white/30 bg-white/20 text-white focus:ring-white"
                  />
                  <span className="text-sm">Publish</span>
                </label>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              {editingPlatform === post.platform ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveEdit(post.platform)}
                      className="px-4 h-8 rounded-md bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1]"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingPlatform(null)}
                      className="px-4 h-8 rounded-md border border-[#E0E0E0] bg-white text-[#616161] text-sm font-medium hover:bg-[#F5F5F5]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="whitespace-pre-wrap text-sm text-[#212121] mb-3 leading-relaxed">
                    {post.caption}
                  </div>

                  {/* Hashtags */}
                  {post.hashtags.length > 0 && (
                    <div className="mb-3 p-3 rounded-lg bg-[#F5F5F5] border border-[#E0E0E0]">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash size={14} className="text-[#1565C0]" />
                        <span className="text-xs font-semibold text-[#616161]">Optimized Hashtags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag, i) => (
                          <span key={i} className="text-sm text-[#1565C0] font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Engagement Prediction */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-[#F5F5F5] rounded-lg p-2 text-center">
                      <div className="text-xs text-[#616161] mb-1">Est. Likes</div>
                      <div className="text-lg font-bold text-[#E91E63]">{post.engagement.likes}</div>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-lg p-2 text-center">
                      <div className="text-xs text-[#616161] mb-1">Est. Comments</div>
                      <div className="text-lg font-bold text-[#1565C0]">{post.engagement.comments}</div>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-lg p-2 text-center">
                      <div className="text-xs text-[#616161] mb-1">Est. Shares</div>
                      <div className="text-lg font-bold text-[#4CAF50]">{post.engagement.shares}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(post.platform, post.caption)}
                      className="flex-1 h-8 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {copiedPlatform === post.platform ? (
                        <>
                          <CheckCircle size={14} className="text-[#4CAF50]" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(post.platform, post.caption)}
                      className="flex-1 h-8 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      className="flex-1 h-8 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      Export
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-[#E3F2FD] rounded-lg border border-[#90CAF9] p-4">
        <h4 className="text-sm font-semibold text-[#1565C0] mb-2 flex items-center gap-2">
          <CheckCircle size={16} />
          AI Optimization Insights
        </h4>
        <ul className="space-y-1 text-sm text-[#1565C0]">
          <li>• All posts optimized for each platform's character limits and best practices</li>
          <li>• Hashtags selected based on trending topics and your industry</li>
          <li>• Engagement predictions based on historical performance data</li>
          <li>• Content tone matches your selected style preferences</li>
        </ul>
      </div>
    </div>
  );
}
