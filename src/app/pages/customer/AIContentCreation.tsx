import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { ContentTemplates, contentTemplates } from "../../components/content/ContentTemplates";
import { ContentGenerationForm } from "../../components/content/ContentGenerationForm";
import { ContentPreview, sampleEmailContent } from "../../components/content/ContentPreview";
import { FolderOpen, Sparkles, TrendingUp, FileText, Zap } from "lucide-react";

interface ContentItem {
  id: string;
  type: string;
  category: string;
  title: string;
  preview: string;
  createdAt: Date;
  credits: number;
  status: "draft" | "published";
}

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

// Mock content library
const mockContentLibrary: ContentItem[] = [
  {
    id: "c-001",
    type: "Email Campaign",
    category: "text",
    title: "Product Launch Email - Electric Kettle",
    preview: "Hi [First Name], I hope this email finds you well! I wanted to reach out...",
    createdAt: new Date("2026-03-26"),
    credits: 1,
    status: "published",
  },
  {
    id: "c-002",
    type: "Blog Post",
    category: "marketing",
    title: "The Ultimate Guide to Electric Kettles in Nepal",
    preview: "When it comes to choosing the perfect electric kettle for your home...",
    createdAt: new Date("2026-03-25"),
    credits: 2,
    status: "draft",
  },
  {
    id: "c-003",
    type: "WhatsApp",
    category: "text",
    title: "Follow-up Message - Interested Leads",
    preview: "Hello! 👋 Thank you for your interest in our Smart Electric Kettle...",
    createdAt: new Date("2026-03-24"),
    credits: 1,
    status: "published",
  },
  {
    id: "c-004",
    type: "Social",
    category: "creative",
    title: "Instagram Post - Product Features",
    preview: "☕ Start your morning right with our Smart Electric Kettle! Features...",
    createdAt: new Date("2026-03-23"),
    credits: 1,
    status: "published",
  },
  {
    id: "c-005",
    type: "SEO",
    category: "marketing",
    title: "Best Electric Kettles in Nepal 2026",
    preview: "Looking for the best electric kettle in Nepal? In this comprehensive guide...",
    createdAt: new Date("2026-03-22"),
    credits: 3,
    status: "draft",
  },
];

export function AIContentCreation() {
  const [view, setView] = useState<"templates" | "form" | "preview" | "library">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [contentLibrary, setContentLibrary] = useState<ContentItem[]>(mockContentLibrary);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleSelectTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setView("form");
  };

  const handleGenerate = (inputs: Record<string, any>) => {
    console.log("Generating content with inputs:", inputs);
    // Simulate content generation
    setGeneratedContent(sampleEmailContent);
    setView("preview");
  };

  const handleCopy = () => {
    console.log("Content copied to clipboard");
  };

  const handleDownload = () => {
    console.log("Downloading content");
    alert("Content downloaded successfully!");
  };

  const handleSend = () => {
    console.log("Sending/deploying content");
    alert("Content sent successfully!");
  };

  const stats = {
    totalContent: contentLibrary.length,
    published: contentLibrary.filter(c => c.status === "published").length,
    drafts: contentLibrary.filter(c => c.status === "draft").length,
    creditsUsed: contentLibrary.reduce((sum, c) => sum + c.credits, 0),
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "text": return "bg-[#E3F2FD] text-[#1565C0]";
      case "marketing": return "bg-[#F3E5F5] text-[#6A1B9A]";
      case "creative": return "bg-[#FFF8E1] text-[#F57F17]";
      case "video": return "bg-[#E8F5E9] text-[#2E7D32]";
      case "voice": return "bg-[#FFEBEE] text-[#C62828]";
      default: return "bg-[#F5F5F5] text-[#616161]";
    }
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Business Playground" }, { label: "AI Content Creation" }]} 
        companyName="Everest Digital Solutions" 
        mode="customer" 
        userName="Rajesh Sharma" 
        userEmail="rajesh@everestdigital.com" 
        userInitials="RS" 
      />
      <div className="flex-1 overflow-auto p-6 max-md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 max-md:mb-4 max-md:flex-col max-md:gap-3">
            <div>
              <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">AI Content Creation Suite</h1>
              <p className="text-sm text-[#616161]">Generate professional content for outreach, marketing, and branding</p>
            </div>
            <div className="flex items-center gap-2">
              {view !== "templates" && (
                <button
                  onClick={() => setView("templates")}
                  className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Templates
                </button>
              )}
              {view !== "library" && contentLibrary.length > 0 && (
                <button
                  onClick={() => setView("library")}
                  className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-2"
                >
                  <FolderOpen size={16} />
                  Library ({contentLibrary.length})
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          {view === "templates" && (
            <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-6 max-md:mb-4">
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                    <FileText className="text-[#1565C0]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Total Content</div>
                    <div className="text-2xl font-bold text-[#212121]">{stats.totalContent}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
                    <Sparkles className="text-[#4CAF50]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Published</div>
                    <div className="text-2xl font-bold text-[#4CAF50]">{stats.published}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF8E1] flex items-center justify-center">
                    <FileText className="text-[#F57F17]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Drafts</div>
                    <div className="text-2xl font-bold text-[#F57F17]">{stats.drafts}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex items-center justify-center">
                    <Zap className="text-[#6A1B9A]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#616161] uppercase font-semibold">Credits Used</div>
                    <div className="text-2xl font-bold text-[#6A1B9A]">{stats.creditsUsed}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {view === "templates" && (
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 max-md:p-4">
              <ContentTemplates onSelectTemplate={handleSelectTemplate} />
            </div>
          )}

          {view === "library" && (
            <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E0E0E0] bg-[#F5F5F5]">
                <h3 className="text-lg font-semibold text-[#212121]">Content Library</h3>
                <p className="text-sm text-[#616161]">{contentLibrary.length} content pieces created</p>
              </div>
              <div className="p-6 max-md:p-4">
                <div className="grid grid-cols-1 gap-3">
                  {contentLibrary.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border border-[#E0E0E0] p-4 hover:shadow-lg hover:border-[#1565C0] transition-all"
                    >
                      <div className="flex items-start justify-between mb-3 max-md:flex-col max-md:gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                              {item.type}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === "published" 
                                ? "bg-[#E8F5E9] text-[#2E7D32]" 
                                : "bg-[#FFF8E1] text-[#F57F17]"
                            }`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-[#212121] mb-2">{item.title}</h4>
                          <p className="text-xs text-[#616161] line-clamp-2">{item.preview}</p>
                        </div>
                        <button
                          onClick={() => {
                            setGeneratedContent({
                              ...sampleEmailContent,
                              type: item.type,
                              category: item.category,
                            });
                            setView("preview");
                          }}
                          className="text-sm text-[#1565C0] hover:underline font-medium whitespace-nowrap"
                        >
                          View →
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                        <div className="text-xs text-[#9E9E9E]">
                          {item.createdAt.toLocaleDateString()} • {item.credits} credit{item.credits > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {view === "form" && selectedTemplate && (
        <ContentGenerationForm
          template={selectedTemplate}
          onGenerate={handleGenerate}
          onCancel={() => setView("templates")}
        />
      )}

      {view === "preview" && generatedContent && (
        <ContentPreview
          content={generatedContent}
          onClose={() => setView("library")}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onSend={handleSend}
        />
      )}
    </>
  );
}
