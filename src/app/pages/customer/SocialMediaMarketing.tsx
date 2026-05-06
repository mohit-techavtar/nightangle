import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { SocialPostGenerator } from "../../components/social/SocialPostGenerator";
import { GeneratedPostsPreview } from "../../components/social/GeneratedPostsPreview";
import { ContentCalendar } from "../../components/social/ContentCalendar";
import { AdManagementDashboard } from "../../components/social/AdManagementDashboard";
import { Share2, Calendar, Target, TrendingUp, Zap, Users, BarChart3 } from "lucide-react";

interface GeneratedPost {
  platform: string;
  platformIcon: string;
  caption: string;
  hashtags: string[];
  charCount: number;
  charLimit: number;
  engagement: { likes: number; comments: number; shares: number };
}

interface ScheduledPost {
  id: string;
  platform: string;
  platformIcon: string;
  caption: string;
  scheduledDate: Date;
  status: "scheduled" | "published" | "failed";
  campaignTag?: string;
}

interface AdCampaign {
  id: string;
  name: string;
  platform: string;
  platformIcon: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  startDate: Date;
  endDate: Date;
}

// Mock data
const mockScheduledPosts: ScheduledPost[] = [
  {
    id: "sched-001",
    platform: "instagram",
    platformIcon: "📷",
    caption: "Introducing our new Smart Electric Kettle! ☕⚡ Fast boiling in just 3 minutes...",
    scheduledDate: new Date("2026-03-27T10:00:00"),
    status: "scheduled",
    campaignTag: "Product Launch",
  },
  {
    id: "sched-002",
    platform: "facebook",
    platformIcon: "👥",
    caption: "Big news! Our Smart Electric Kettle is now available with 20% off for early birds...",
    scheduledDate: new Date("2026-03-27T14:00:00"),
    status: "scheduled",
    campaignTag: "Product Launch",
  },
  {
    id: "sched-003",
    platform: "linkedin",
    platformIcon: "💼",
    caption: "Exciting product innovation in the home appliances sector. Our new Smart Electric Kettle...",
    scheduledDate: new Date("2026-03-28T09:00:00"),
    status: "scheduled",
  },
];

const mockAdCampaigns: AdCampaign[] = [
  {
    id: "ad-001",
    name: "Instagram Product Launch",
    platform: "instagram",
    platformIcon: "📷",
    status: "active",
    budget: 50000,
    spent: 32500,
    impressions: 125000,
    clicks: 3250,
    conversions: 142,
    ctr: 2.6,
    cpc: 10,
    roas: 4.2,
    startDate: new Date("2026-03-20"),
    endDate: new Date("2026-04-03"),
  },
  {
    id: "ad-002",
    name: "Facebook Retargeting",
    platform: "facebook",
    platformIcon: "👥",
    status: "active",
    budget: 30000,
    spent: 18500,
    impressions: 85000,
    clicks: 680,
    conversions: 52,
    ctr: 0.8,
    cpc: 27.2,
    roas: 2.8,
    startDate: new Date("2026-03-22"),
    endDate: new Date("2026-04-05"),
  },
  {
    id: "ad-003",
    name: "LinkedIn B2B Campaign",
    platform: "linkedin",
    platformIcon: "💼",
    status: "active",
    budget: 40000,
    spent: 25000,
    impressions: 45000,
    clicks: 1350,
    conversions: 89,
    ctr: 3.0,
    cpc: 18.5,
    roas: 3.5,
    startDate: new Date("2026-03-18"),
    endDate: new Date("2026-04-01"),
  },
];

export function SocialMediaMarketing() {
  const [activeTab, setActiveTab] = useState<"generator" | "calendar" | "ads">("generator");
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(mockAdCampaigns);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleGenerate = (config: any) => {
    console.log("Generating posts with config:", config);
    
    // Mock generated content for selected platforms
    const posts: GeneratedPost[] = config.platforms.map((platformId: string) => {
      const platformMap: Record<string, any> = {
        instagram: { name: "Instagram", icon: "📷", limit: 2200 },
        facebook: { name: "Facebook", icon: "👥", limit: 63206 },
        linkedin: { name: "LinkedIn", icon: "💼", limit: 3000 },
        twitter: { name: "Twitter/X", icon: "🐦", limit: 280 },
        tiktok: { name: "TikTok", icon: "🎵", limit: 2200 },
      };

      const platform = platformMap[platformId];
      const caption = generateCaption(platformId, config);
      const hashtags = generateHashtags(config.topic);

      return {
        platform: platformId,
        platformIcon: platform.icon,
        caption,
        hashtags: config.includeHashtags ? hashtags : [],
        charCount: caption.length,
        charLimit: platform.limit,
        engagement: {
          likes: Math.floor(Math.random() * 500) + 100,
          comments: Math.floor(Math.random() * 50) + 10,
          shares: Math.floor(Math.random() * 30) + 5,
        },
      };
    });

    setGeneratedPosts(posts);
  };

  const generateCaption = (platform: string, config: any) => {
    const emojis = config.includeEmojis ? "☕⚡✨" : "";
    
    if (platform === "twitter") {
      return `Introducing our Smart Electric Kettle! ${emojis} Fast boiling, auto shut-off & LED display. 20% OFF launch special! ${config.callToAction || "Shop now"} 🔗`;
    }
    
    if (platform === "linkedin") {
      return `We're excited to announce the launch of our innovative Smart Electric Kettle! ${emojis}\n\nKey Features:\n✓ Fast boiling technology (3 minutes)\n✓ Auto shut-off safety feature\n✓ LED temperature display\n✓ 1.7L capacity\n\nPerfect for modern homes and offices. Available now with a special 20% launch discount.\n\n${config.callToAction || "Learn more"} in the comments!`;
    }

    return `Hey there! ${emojis}\n\nWe're thrilled to introduce our brand new Smart Electric Kettle!\n\nWhy you'll love it:\n☕ Super fast boiling - just 3 minutes!\n⚡ Auto shut-off for safety\n✨ LED temperature display\n💧 1.7L capacity - perfect for the whole family\n\nFor a limited time, get 20% OFF as part of our launch special!\n\n${config.callToAction || "Tap the link in bio to order yours today!"}\n\n#SmartKettle #HomeAppliances #KitchenGadgets`;
  };

  const generateHashtags = (topic: string) => {
    return [
      "SmartKettle",
      "HomeAppliances",
      "KitchenGadgets",
      "ElectricKettle",
      "ModernHome",
      "NepalShopping",
      "ProductLaunch",
      "LimitedOffer",
    ];
  };

  const handleSchedule = (platformIds: string[]) => {
    setShowScheduleModal(true);
    console.log("Scheduling posts for platforms:", platformIds);
    alert(`Posts scheduled successfully for ${platformIds.length} platform(s)!`);
  };

  const handleEditPost = (platform: string, newCaption: string) => {
    setGeneratedPosts(posts =>
      posts.map(p =>
        p.platform === platform
          ? { ...p, caption: newCaption, charCount: newCaption.length }
          : p
      )
    );
  };

  const handleReschedule = (postId: string, newDate: Date) => {
    setScheduledPosts(posts =>
      posts.map(p => (p.id === postId ? { ...p, scheduledDate: newDate } : p))
    );
  };

  const handleEditScheduledPost = (postId: string) => {
    console.log("Editing scheduled post:", postId);
  };

  const handleDeleteScheduledPost = (postId: string) => {
    if (confirm("Are you sure you want to delete this scheduled post?")) {
      setScheduledPosts(posts => posts.filter(p => p.id !== postId));
    }
  };

  const handleCreateAd = () => {
    console.log("Creating new ad campaign");
    alert("Ad creation wizard coming soon!");
  };

  const handleEditAd = (campaignId: string) => {
    console.log("Editing ad campaign:", campaignId);
  };

  const handlePauseAd = (campaignId: string) => {
    setAdCampaigns(campaigns =>
      campaigns.map(c =>
        c.id === campaignId
          ? { ...c, status: c.status === "active" ? "paused" : "active" }
          : c
      )
    );
  };

  const stats = {
    totalPosts: scheduledPosts.length + generatedPosts.length,
    scheduled: scheduledPosts.filter(p => p.status === "scheduled").length,
    published: scheduledPosts.filter(p => p.status === "published").length,
    activeCampaigns: adCampaigns.filter(c => c.status === "active").length,
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Business Playground" }, { label: "Social Media Marketing" }]} 
        companyName="Everest Digital Solutions" 
        mode="customer" 
        userName="Rajesh Sharma" 
        userEmail="rajesh@everestdigital.com" 
        userInitials="RS" 
      />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 max-md:mb-4">
            <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Social Media Marketing Engine</h1>
            <p className="text-sm text-[#616161]">AI-powered social media automation with multi-platform publishing and ad management</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-6 max-md:mb-4">
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <Share2 className="text-[#1565C0]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Total Posts</div>
                  <div className="text-2xl font-bold text-[#212121]">{stats.totalPosts}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#FFF8E1] flex items-center justify-center">
                  <Calendar className="text-[#F57F17]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Scheduled</div>
                  <div className="text-2xl font-bold text-[#F57F17]">{stats.scheduled}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
                  <Zap className="text-[#4CAF50]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Published</div>
                  <div className="text-2xl font-bold text-[#4CAF50]">{stats.published}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex items-center justify-center">
                  <Target className="text-[#6A1B9A]" size={20} />
                </div>
                <div>
                  <div className="text-xs text-[#616161] uppercase font-semibold">Active Ads</div>
                  <div className="text-2xl font-bold text-[#6A1B9A]">{stats.activeCampaigns}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 max-md:mb-4 border-b border-[#E0E0E0]">
            <button
              onClick={() => setActiveTab("generator")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "generator"
                  ? "border-[#1565C0] text-[#1565C0]"
                  : "border-transparent text-[#616161] hover:text-[#212121]"
              }`}
            >
              <Share2 size={16} />
              Post Generator
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "calendar"
                  ? "border-[#1565C0] text-[#1565C0]"
                  : "border-transparent text-[#616161] hover:text-[#212121]"
              }`}
            >
              <Calendar size={16} />
              Content Calendar
            </button>
            <button
              onClick={() => setActiveTab("ads")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "ads"
                  ? "border-[#1565C0] text-[#1565C0]"
                  : "border-transparent text-[#616161] hover:text-[#212121]"
              }`}
            >
              <Target size={16} />
              Ad Management
            </button>
          </div>

          {/* Content */}
          {activeTab === "generator" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SocialPostGenerator onGenerate={handleGenerate} />
              {generatedPosts.length > 0 && (
                <div>
                  <GeneratedPostsPreview
                    posts={generatedPosts}
                    onSchedule={handleSchedule}
                    onEdit={handleEditPost}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <ContentCalendar
              scheduledPosts={scheduledPosts}
              onReschedule={handleReschedule}
              onEdit={handleEditScheduledPost}
              onDelete={handleDeleteScheduledPost}
              onAddPost={() => setActiveTab("generator")}
            />
          )}

          {activeTab === "ads" && (
            <AdManagementDashboard
              campaigns={adCampaigns}
              onCreateAd={handleCreateAd}
              onEditAd={handleEditAd}
              onPauseAd={handlePauseAd}
            />
          )}
        </div>
      </div>
    </>
  );
}
