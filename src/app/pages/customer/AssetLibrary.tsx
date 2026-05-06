import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { FileUploader } from "../../components/ui/FileUploader";
import { StorageQuota } from "../../components/ui/StorageQuota";
import { 
  FolderOpen, Image as ImageIcon, Search, Upload, Grid, List, 
  Download, Trash2, MoreVertical, X, Tag, Eye, Share2, Copy
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: "logo" | "creative" | "marketing" | "banner" | "packaging";
  url: string;
  size: number; // in KB
  uploadedAt: Date;
  tags: string[];
  campaign?: string;
  dimensions?: string;
}

const mockAssets: Asset[] = [
  { id: "1", name: "Primary_Logo.png", type: "logo", url: "", size: 156, uploadedAt: new Date("2026-03-20"), tags: ["Logo", "Primary"], dimensions: "1200x400" },
  { id: "2", name: "Product_Banner_Hero.jpg", type: "banner", url: "", size: 890, uploadedAt: new Date("2026-03-18"), tags: ["Banner", "Homepage"], campaign: "Q1 Launch", dimensions: "1920x600" },
  { id: "3", name: "Social_Post_Template.png", type: "marketing", url: "", size: 445, uploadedAt: new Date("2026-03-15"), tags: ["Social", "Template"], campaign: "Social Campaign", dimensions: "1080x1080" },
  { id: "4", name: "Email_Header.jpg", type: "creative", url: "", size: 234, uploadedAt: new Date("2026-03-12"), tags: ["Email", "Header"], campaign: "Newsletter", dimensions: "600x200" },
  { id: "5", name: "Product_Packaging_Mockup.png", type: "packaging", url: "", size: 1234, uploadedAt: new Date("2026-03-10"), tags: ["Packaging", "Product"], dimensions: "2000x2000" },
  { id: "6", name: "Brand_Color_Palette.png", type: "creative", url: "", size: 89, uploadedAt: new Date("2026-03-08"), tags: ["Brand", "Colors"], dimensions: "800x600" },
];

const assetTypes = [
  { value: "all", label: "All Assets", count: mockAssets.length },
  { value: "logo", label: "Product Logos", count: mockAssets.filter(a => a.type === "logo").length },
  { value: "creative", label: "Brand Creatives", count: mockAssets.filter(a => a.type === "creative").length },
  { value: "marketing", label: "Marketing Images", count: mockAssets.filter(a => a.type === "marketing").length },
  { value: "banner", label: "Campaign Banners", count: mockAssets.filter(a => a.type === "banner").length },
  { value: "packaging", label: "Product Packaging", count: mockAssets.filter(a => a.type === "packaging").length },
];

export function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(new Set(assets.flatMap(a => a.tags)));
  const campaigns = Array.from(new Set(assets.filter(a => a.campaign).map(a => a.campaign!)));

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || asset.type === selectedType;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => asset.tags.includes(tag));
    return matchesSearch && matchesType && matchesTags;
  });

  const handleUpload = (uploadedFiles: File[]) => {
    console.log("Uploading assets:", uploadedFiles);
    setShowUploadModal(false);
  };

  const formatFileSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Asset Library" }]} 
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
              <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Asset Library</h1>
              <p className="text-sm text-[#616161]">Manage your brand assets, creatives, and marketing materials</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 h-10 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] transition-colors flex items-center gap-2 max-md:w-full max-md:justify-center"
            >
              <Upload size={18} />
              Upload Assets
            </button>
          </div>

          {/* Storage Quota */}
          <div className="mb-6 max-md:mb-4 bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3">
            <StorageQuota used={2156} total={10240} size="md" showDetails={true} />
          </div>

          {/* Asset Type Tabs */}
          <div className="mb-6 max-md:mb-4 bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {assetTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 h-9 rounded-md border flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedType === type.value
                      ? 'border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]'
                      : 'border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {type.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    selectedType === type.value ? 'bg-[#1565C0] text-white' : 'bg-[#F5F5F5] text-[#616161]'
                  }`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters & Search */}
          <div className="mb-6 max-md:mb-4 bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3">
            <div className="flex items-center gap-3 max-md:flex-col">
              {/* Search */}
              <div className="flex-1 relative max-md:w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets by name or tags..."
                  className="w-full h-10 pl-10 pr-4 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 border border-[#E0E0E0] rounded-md p-1 max-md:w-full max-md:justify-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 h-8 rounded text-sm flex items-center gap-2 transition-colors ${
                    viewMode === "grid" ? 'bg-[#1565C0] text-white' : 'text-[#616161] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <Grid size={16} /> Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 h-8 rounded text-sm flex items-center gap-2 transition-colors ${
                    viewMode === "list" ? 'bg-[#1565C0] text-white' : 'text-[#616161] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <List size={16} /> List
                </button>
              </div>
            </div>

            {/* Tag Filters */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-[#616161] py-1">Tags:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-[#1565C0] text-white'
                      : 'bg-[#F5F5F5] text-[#616161] hover:bg-[#E0E0E0]'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFEBEE] text-[#C62828] hover:bg-[#EF5350] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Assets Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image Preview */}
                  <div className="aspect-video bg-gradient-to-br from-[#E3F2FD] to-[#90CAF9] flex items-center justify-center relative">
                    <ImageIcon className="text-[#1565C0]" size={48} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#616161] hover:text-[#1565C0]">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-4 max-md:p-3">
                    <h4 className="text-sm font-semibold text-[#212121] mb-2 truncate" title={asset.name}>
                      {asset.name}
                    </h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {asset.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                      {asset.tags.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px] font-medium">
                          +{asset.tags.length - 2}
                        </span>
                      )}
                    </div>
                    {asset.campaign && (
                      <div className="mb-2 flex items-center gap-1 text-xs text-[#9E9E9E]">
                        <FolderOpen size={12} />
                        <span>{asset.campaign}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-[#9E9E9E]">
                      <span>{asset.dimensions}</span>
                      <span>{formatFileSize(asset.size)}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-3 pt-3 border-t border-[#EEEEEE] flex items-center gap-2">
                      <button className="flex-1 h-8 rounded-md bg-[#F5F5F5] text-[#616161] text-xs font-medium hover:bg-[#E0E0E0] flex items-center justify-center gap-1">
                        <Download size={14} /> Download
                      </button>
                      <button className="w-8 h-8 rounded-md bg-[#F5F5F5] text-[#616161] hover:bg-[#E0E0E0] flex items-center justify-center">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Preview</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase max-md:hidden">Campaign</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase max-md:hidden">Dimensions</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase max-md:hidden">Size</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map(asset => (
                    <tr key={asset.id} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                      <td className="py-3 px-4">
                        <div className="w-16 h-12 rounded bg-gradient-to-br from-[#E3F2FD] to-[#90CAF9] flex items-center justify-center">
                          <ImageIcon className="text-[#1565C0]" size={20} />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-[#212121] font-medium">{asset.name}</div>
                        <div className="flex gap-1 mt-1">
                          {asset.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#616161] max-md:hidden">
                        {asset.campaign || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#616161] max-md:hidden">{asset.dimensions}</td>
                      <td className="py-3 px-4 text-sm text-[#616161] max-md:hidden">{formatFileSize(asset.size)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="text-[#616161] hover:text-[#1565C0]" title="View">
                            <Eye size={18} />
                          </button>
                          <button className="text-[#616161] hover:text-[#1565C0]" title="Download">
                            <Download size={18} />
                          </button>
                          <button className="text-[#616161] hover:text-[#C62828]" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
              <h3 className="text-lg font-semibold text-[#212121]">Upload Assets</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#9E9E9E] hover:text-[#616161]">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <FileUploader 
                onUpload={handleUpload}
                acceptedTypes={["png", "jpg", "jpeg", "gif", "svg"]}
                maxSizeMB={5}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
