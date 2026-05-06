import React, { useState } from "react";
import { X, Copy, Download, Send, Edit, CheckCircle, Mail, MessageSquare, FileText } from "lucide-react";

interface GeneratedContent {
  id: string;
  type: string;
  category: string;
  content: string;
  metadata?: {
    subject?: string;
    wordCount?: number;
    readTime?: string;
    variants?: string[];
  };
}

interface ContentPreviewProps {
  content: GeneratedContent;
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onSend?: () => void;
  onEdit?: () => void;
}

export function ContentPreview({ content, onClose, onCopy, onDownload, onSend, onEdit }: ContentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy();
  };

  const getIcon = () => {
    switch (content.category) {
      case "text": return Mail;
      case "marketing": return FileText;
      case "creative": return MessageSquare;
      default: return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#1565C0] to-[#0D47A1]">
          <div className="flex items-start justify-between mb-3 max-md:flex-col max-md:gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{content.type} Content</h3>
                <p className="text-sm text-white/80">AI-generated and ready to use</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Metadata */}
          {content.metadata && (
            <div className="flex items-center gap-4 text-sm text-white/80 flex-wrap">
              {content.metadata.wordCount && (
                <div>{content.metadata.wordCount} words</div>
              )}
              {content.metadata.readTime && (
                <>
                  <span>•</span>
                  <div>{content.metadata.readTime} read time</div>
                </>
              )}
              {content.metadata.subject && (
                <>
                  <span>•</span>
                  <div>Subject: {content.metadata.subject}</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Variants Selector */}
        {content.metadata?.variants && content.metadata.variants.length > 1 && (
          <div className="px-6 py-3 bg-[#F5F5F5] border-b border-[#E0E0E0]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#616161]">Variants:</span>
              {content.metadata.variants.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(index)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedVariant === index
                      ? "bg-[#1565C0] text-white"
                      : "bg-white text-[#616161] hover:bg-[#E0E0E0]"
                  }`}
                >
                  Variant {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Display */}
        <div className="p-6 max-h-[calc(90vh-280px)] overflow-y-auto">
          {/* Email Template */}
          {content.category === "text" && content.type.toLowerCase().includes("email") && (
            <div className="mb-6">
              {content.metadata?.subject && (
                <div className="mb-4 p-4 bg-[#F5F5F5] rounded-lg border border-[#E0E0E0]">
                  <span className="text-xs font-semibold text-[#616161] uppercase">Subject Line</span>
                  <div className="mt-1 text-sm font-medium text-[#212121]">{content.metadata.subject}</div>
                </div>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-[#212121] leading-relaxed">
              {content.metadata?.variants?.[selectedVariant] || content.content}
            </div>
          </div>

          {/* Content Statistics */}
          <div className="mt-6 grid grid-cols-3 max-md:grid-cols-1 gap-3">
            <div className="bg-[#E3F2FD] rounded-lg p-3 border border-[#90CAF9]">
              <div className="text-xs text-[#1565C0] font-semibold mb-1">Readability</div>
              <div className="text-lg font-bold text-[#1565C0]">Good</div>
            </div>
            <div className="bg-[#E8F5E9] rounded-lg p-3 border border-[#66BB6A]">
              <div className="text-xs text-[#2E7D32] font-semibold mb-1">Tone Match</div>
              <div className="text-lg font-bold text-[#2E7D32]">95%</div>
            </div>
            <div className="bg-[#FFF8E1] rounded-lg p-3 border border-[#FFB300]">
              <div className="text-xs text-[#F57F17] font-semibold mb-1">SEO Score</div>
              <div className="text-lg font-bold text-[#F57F17]">87/100</div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="mt-6 p-4 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
            <h4 className="text-sm font-semibold text-[#1565C0] mb-2 flex items-center gap-2">
              <CheckCircle size={16} />
              AI Recommendations
            </h4>
            <ul className="space-y-1 text-sm text-[#1565C0]">
              <li>• Content is well-structured and engaging</li>
              <li>• Consider adding more specific call-to-actions</li>
              <li>• Tone matches your target audience perfectly</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between max-md:flex-col max-md:gap-3">
          <div className="flex items-center gap-2 max-md:w-full">
            <button
              onClick={handleCopy}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1"
            >
              {copied ? (
                <>
                  <CheckCircle size={16} className="text-[#4CAF50]" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onDownload}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1"
            >
              <Download size={16} />
              Download
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2 max-md:flex-1"
              >
                <Edit size={16} />
                Edit
              </button>
            )}
          </div>
          {onSend && (
            <button
              onClick={onSend}
              className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2 max-md:w-full max-md:justify-center"
            >
              <Send size={16} />
              Send/Deploy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sample content for demonstration
export const sampleEmailContent: GeneratedContent = {
  id: "content-001",
  type: "Email Campaign",
  category: "text",
  content: `Hi [First Name],

I hope this email finds you well!

I wanted to reach out because we've recently launched our new Smart Electric Kettle that I think would be perfect for your home or business.

Here's why our customers love it:

✓ Fast Boiling - Boils water in just 3 minutes
✓ Auto Shut-off - Safe and energy efficient
✓ LED Temperature Display - Know exactly when it's ready
✓ 1.7L Capacity - Perfect for families or offices

For a limited time, we're offering 20% off for our valued customers like you. That's only NPR 2,800 instead of the regular NPR 3,500.

Would you like to learn more? Simply reply to this email or click the link below to order yours today.

[Order Now Button]

Looking forward to hearing from you!

Best regards,
[Your Name]
[Company Name]

P.S. - This offer expires in 7 days, so don't miss out!`,
  metadata: {
    subject: "Introducing Our New Smart Electric Kettle - 20% Off Launch Special! ⚡",
    wordCount: 145,
    readTime: "45 sec",
    variants: [
      `Hi [First Name],

I hope this email finds you well!

I wanted to reach out because we've recently launched our new Smart Electric Kettle that I think would be perfect for your home or business...`,
      `Hello [First Name],

Quick question - do you enjoy a good cup of tea or coffee in the morning?

If so, I have something exciting to share with you...`,
      `Dear [First Name],

Are you still using an old kettle that takes forever to boil water?

Let me tell you about our game-changing Smart Electric Kettle...`,
    ],
  },
};
