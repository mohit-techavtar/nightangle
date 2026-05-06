import React, { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { FileUploader } from "../../components/ui/FileUploader";
import { StorageQuota } from "../../components/ui/StorageQuota";
import { 
  FolderOpen, File, FileText, Image, FileSpreadsheet, Search, 
  Plus, Filter, Grid, List, Download, Trash2, Tag, Calendar,
  MoreVertical, Eye, Edit2, Share2, Upload, X
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  name: string;
  type: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "csv" | "png" | "jpg" | "jpeg" | "gif";
  size: number; // in KB
  uploadedAt: Date;
  tags: string[];
  folder?: string;
  description?: string;
}

const mockFiles: KnowledgeItem[] = [
  { id: "1", name: "Product_Catalog_2026.pdf", type: "pdf", size: 2340, uploadedAt: new Date("2026-03-20"), tags: ["Products", "Sales"], folder: "Sales Materials" },
  { id: "2", name: "Market_Research_Nepal.xlsx", type: "xlsx", size: 1580, uploadedAt: new Date("2026-03-18"), tags: ["Research", "Market Analysis"], folder: "Research" },
  { id: "3", name: "Competitor_Analysis.docx", type: "docx", size: 890, uploadedAt: new Date("2026-03-15"), tags: ["Research", "Competitors"], folder: "Research" },
  { id: "4", name: "Company_Logo_Primary.png", type: "png", size: 156, uploadedAt: new Date("2026-03-12"), tags: ["Branding", "Logo"], folder: "Brand Assets" },
  { id: "5", name: "Customer_Data_Q1.csv", type: "csv", size: 445, uploadedAt: new Date("2026-03-10"), tags: ["Data", "Customers"], folder: "Datasets" },
  { id: "6", name: "Pricing_Strategy.pdf", type: "pdf", size: 1200, uploadedAt: new Date("2026-03-08"), tags: ["Pricing", "Strategy"], folder: "Strategy" },
];

const folders = ["Sales Materials", "Research", "Brand Assets", "Datasets", "Strategy", "Marketing"];

const fileIcons: Record<string, any> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  png: Image,
  jpg: Image,
  jpeg: Image,
  gif: Image,
};

export function KnowledgeBase() {
  const [files, setFiles] = useState<KnowledgeItem[]>(mockFiles);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(new Set(files.flatMap(f => f.tags)));

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = !selectedFolder || file.folder === selectedFolder;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => file.tags.includes(tag));
    return matchesSearch && matchesFolder && matchesTags;
  });

  const handleUpload = (uploadedFiles: File[]) => {
    // Handle file upload logic
    console.log("Uploading files:", uploadedFiles);
    setShowUploadModal(false);
  };

  const formatFileSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    return fileIcons[type] || File;
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[{ label: "Knowledge Base" }]} 
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
              <h1 className="text-2xl max-md:text-xl font-bold text-[#212121] mb-2">Knowledge Base</h1>
              <p className="text-sm text-[#616161]">Upload and manage your documents, datasets, and research materials</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 h-10 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] transition-colors flex items-center gap-2 max-md:w-full max-md:justify-center"
            >
              <Upload size={18} />
              Upload Files
            </button>
          </div>

          {/* Storage Quota */}
          <div className="mb-6 max-md:mb-4 bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3">
            <StorageQuota used={3840} total={10240} size="md" showDetails={true} />
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
                  placeholder="Search files by name or tags..."
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

          {/* Folders */}
          <div className="mb-6 max-md:mb-4">
            <h3 className="text-sm font-semibold text-[#212121] mb-3">Folders</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`px-4 h-9 rounded-md border flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  !selectedFolder
                    ? 'border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]'
                    : 'border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5]'
                }`}
              >
                <FolderOpen size={16} /> All Files
              </button>
              {folders.map(folder => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`px-4 h-9 rounded-md border flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedFolder === folder
                      ? 'border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]'
                      : 'border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <FolderOpen size={16} /> {folder}
                </button>
              ))}
            </div>
          </div>

          {/* Files Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-3">
              {filteredFiles.map(file => {
                const Icon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    className="bg-white rounded-lg border border-[#E0E0E0] p-4 max-md:p-3 hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                        <Icon className="text-[#1565C0]" size={24} />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9E9E9E] hover:text-[#212121]">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-[#212121] mb-2 truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {file.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-[10px] font-medium">
                          +{file.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#9E9E9E]">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase max-md:hidden">Tags</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase max-md:hidden">Size</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase max-md:hidden">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(file => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <tr key={file.id} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 max-md:w-8 max-md:h-8 rounded-lg bg-[#E3F2FD] flex items-center justify-center shrink-0">
                              <Icon className="text-[#1565C0]" size={20} />
                            </div>
                            <span className="text-sm text-[#212121] font-medium truncate">{file.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-md:hidden">
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#616161] text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#616161] max-md:hidden">{formatFileSize(file.size)}</td>
                        <td className="py-3 px-4 text-sm text-[#616161] max-md:hidden">{file.uploadedAt.toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="text-[#616161] hover:text-[#1565C0] transition-colors" title="View">
                              <Eye size={18} />
                            </button>
                            <button className="text-[#616161] hover:text-[#1565C0] transition-colors" title="Download">
                              <Download size={18} />
                            </button>
                            <button className="text-[#616161] hover:text-[#C62828] transition-colors" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
              <h3 className="text-lg font-semibold text-[#212121]">Upload Files</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#9E9E9E] hover:text-[#616161]">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <FileUploader onUpload={handleUpload} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
