import React from "react";
import { Mail, MessageSquare, RefreshCw, FileText, Search, Globe, BookOpen, Image, Zap, Share2, Video, Film, Play, Phone, PhoneCall, Radio } from "lucide-react";

interface ContentTemplate {
  id: string;
  title: string;
  icon: any;
  description: string;
  category: "text" | "marketing" | "creative" | "video" | "voice";
  type: string;
  credits: number;
  estimatedTime: string;
  features: string[];
}

export const contentTemplates: ContentTemplate[] = [
  // Text Content
  {
    id: "email-campaign",
    title: "Email Campaign",
    icon: Mail,
    description: "Professional email campaigns for lead nurturing and customer engagement",
    category: "text",
    type: "Email",
    credits: 1,
    estimatedTime: "2-5 min",
    features: ["Subject line optimization", "Personalization", "CTA generation", "A/B variants"],
  },
  {
    id: "whatsapp-message",
    title: "WhatsApp Messages",
    icon: MessageSquare,
    description: "Engaging WhatsApp messages for customer communication and promotions",
    category: "text",
    type: "WhatsApp",
    credits: 1,
    estimatedTime: "1-3 min",
    features: ["Character limit aware", "Emoji suggestions", "Link optimization", "Call-to-action"],
  },
  {
    id: "follow-up-sequence",
    title: "Follow-up Sequence",
    icon: RefreshCw,
    description: "Multi-touch follow-up sequences for sales and customer success",
    category: "text",
    type: "Follow-up",
    credits: 2,
    estimatedTime: "5-8 min",
    features: ["5-7 message series", "Timing recommendations", "Escalation path", "Response templates"],
  },
  {
    id: "sales-script",
    title: "Sales Script",
    icon: FileText,
    description: "Persuasive sales scripts for calls, demos, and presentations",
    category: "text",
    type: "Sales",
    credits: 1,
    estimatedTime: "3-5 min",
    features: ["Objection handling", "Discovery questions", "Closing techniques", "Tone guidance"],
  },

  // Marketing Content
  {
    id: "seo-article",
    title: "SEO Article",
    icon: Search,
    description: "Search-optimized long-form articles for organic traffic",
    category: "marketing",
    type: "SEO",
    credits: 3,
    estimatedTime: "10-15 min",
    features: ["Keyword optimization", "1500-2000 words", "Meta descriptions", "H1-H3 structure"],
  },
  {
    id: "website-copy",
    title: "Website Copy",
    icon: Globe,
    description: "Compelling website copy for landing pages and product pages",
    category: "marketing",
    type: "Website",
    credits: 2,
    estimatedTime: "5-8 min",
    features: ["Hero sections", "Features & benefits", "Social proof", "CTAs"],
  },
  {
    id: "blog-post",
    title: "Blog Post",
    icon: BookOpen,
    description: "Engaging blog posts for thought leadership and brand awareness",
    category: "marketing",
    type: "Blog",
    credits: 2,
    estimatedTime: "8-12 min",
    features: ["800-1200 words", "Engaging intro", "Actionable tips", "Conclusion CTA"],
  },

  // Creative Content
  {
    id: "image-prompt",
    title: "Image Generation",
    icon: Image,
    description: "AI-generated images for marketing and social media",
    category: "creative",
    type: "Image",
    credits: 2,
    estimatedTime: "3-5 min",
    features: ["Custom prompts", "Style selection", "Aspect ratios", "Multiple variants"],
  },
  {
    id: "ad-creative",
    title: "Ad Creatives",
    icon: Zap,
    description: "High-converting ad copy and creative concepts for digital ads",
    category: "creative",
    type: "Ad",
    credits: 2,
    estimatedTime: "5-8 min",
    features: ["Headlines & body", "Visual concepts", "Platform optimization", "A/B variants"],
  },
  {
    id: "social-post",
    title: "Social Media Posts",
    icon: Share2,
    description: "Engaging social media posts for all major platforms",
    category: "creative",
    type: "Social",
    credits: 1,
    estimatedTime: "2-4 min",
    features: ["Platform-specific", "Hashtag suggestions", "Visual recommendations", "Best posting times"],
  },

  // Video Content
  {
    id: "reels-script",
    title: "Reels Script",
    icon: Video,
    description: "Viral-ready scripts for Instagram Reels and TikTok videos",
    category: "video",
    type: "Reels",
    credits: 2,
    estimatedTime: "4-6 min",
    features: ["Hook formula", "15-60 sec timing", "Trending audio", "CTA placement"],
  },
  {
    id: "promo-video",
    title: "Promo Video Script",
    icon: Film,
    description: "Professional promotional video scripts and storyboards",
    category: "video",
    type: "Promo",
    credits: 3,
    estimatedTime: "8-12 min",
    features: ["30-90 sec scripts", "Scene breakdown", "Voiceover text", "Visual directions"],
  },
  {
    id: "product-explainer",
    title: "Product Explainer",
    icon: Play,
    description: "Clear product explainer video scripts and narratives",
    category: "video",
    type: "Explainer",
    credits: 2,
    estimatedTime: "6-10 min",
    features: ["Problem-solution flow", "Feature highlights", "Demo sequence", "Call-to-action"],
  },

  // Voice & Calling
  {
    id: "ai-calling-script",
    title: "AI Calling Script",
    icon: Phone,
    description: "Natural conversation scripts for AI-powered calls",
    category: "voice",
    type: "AI Call",
    credits: 2,
    estimatedTime: "5-8 min",
    features: ["Natural dialogue", "Branch logic", "Objection paths", "Recording notes"],
  },
  {
    id: "bulk-call-script",
    title: "Bulk Call Scripts",
    icon: PhoneCall,
    description: "Scalable call scripts for outbound campaigns",
    category: "voice",
    type: "Bulk Call",
    credits: 2,
    estimatedTime: "5-8 min",
    features: ["Opening hooks", "Qualification questions", "Appointment setting", "Voicemail scripts"],
  },
  {
    id: "ivr-flow",
    title: "IVR Flow Design",
    icon: Radio,
    description: "Interactive voice response flows and menu structures",
    category: "voice",
    type: "IVR",
    credits: 3,
    estimatedTime: "10-15 min",
    features: ["Menu hierarchy", "Voice prompts", "Routing logic", "Fallback handling"],
  },
];

interface ContentTemplatesProps {
  onSelectTemplate: (template: ContentTemplate) => void;
}

export function ContentTemplates({ onSelectTemplate }: ContentTemplatesProps) {
  const categories = [
    { key: "text", label: "Text Content", color: "bg-[#E3F2FD] text-[#1565C0]", icon: Mail },
    { key: "marketing", label: "Marketing Content", color: "bg-[#F3E5F5] text-[#6A1B9A]", icon: Search },
    { key: "creative", label: "Creative Content", color: "bg-[#FFF8E1] text-[#F57F17]", icon: Image },
    { key: "video", label: "Video Content", color: "bg-[#E8F5E9] text-[#2E7D32]", icon: Video },
    { key: "voice", label: "Voice & Calling", color: "bg-[#FFEBEE] text-[#C62828]", icon: Phone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#212121] mb-2">AI Content Creation Templates</h3>
        <p className="text-sm text-[#616161]">Select a template to generate professional content with AI assistance.</p>
      </div>

      {categories.map(category => {
        const templates = contentTemplates.filter(t => t.category === category.key);
        if (templates.length === 0) return null;

        const CategoryIcon = category.icon;

        return (
          <div key={category.key}>
            <div className="flex items-center gap-2 mb-3">
              <CategoryIcon size={16} className="text-[#616161]" />
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                {category.label}
              </span>
              <span className="text-xs text-[#9E9E9E]">{templates.length} templates</span>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              {templates.map(template => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="bg-white rounded-lg border border-[#E0E0E0] p-4 text-left hover:shadow-lg hover:border-[#1565C0] transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] group-hover:bg-[#E3F2FD] flex items-center justify-center transition-colors shrink-0">
                        <Icon className="text-[#616161] group-hover:text-[#1565C0]" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#212121] mb-1">{template.title}</h4>
                        <p className="text-xs text-[#616161] line-clamp-2">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-[#616161] mb-1 block">Features:</span>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 2).map((feature, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px]">
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 2 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px]">
                            +{template.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                      <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                        <span>{template.credits} Credit{template.credits > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{template.estimatedTime}</span>
                      </div>
                      <span className="text-xs text-[#1565C0] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Create →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
