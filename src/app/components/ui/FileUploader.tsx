import React, { useState, useRef } from "react";
import { Upload, X, File, FileText, Image, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  showPreview?: boolean;
}

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
  default: File,
};

export function FileUploader({ 
  onUpload, 
  acceptedTypes = ["pdf", "doc", "docx", "xls", "xlsx", "csv", "png", "jpg", "jpeg", "gif"],
  maxSizeMB = 10,
  multiple = true,
  showPreview = true
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension && !acceptedTypes.includes(extension)) {
      return `${file.name}: File type not supported`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `${file.name}: File size exceeds ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        newFiles.push(file);
      }
    });

    setErrors(newErrors);
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      onUpload(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const Icon = fileIcons[extension] || fileIcons.default;
    return Icon;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 max-md:p-6 text-center cursor-pointer transition-all ${
          isDragging 
            ? "border-[#1565C0] bg-[#E3F2FD]" 
            : "border-[#E0E0E0] hover:border-[#90CAF9] hover:bg-[#FAFAFA]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.map(t => `.${t}`).join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="mx-auto mb-4 text-[#1565C0]" size={48} />
        <p className="text-base max-md:text-sm font-semibold text-[#212121] mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm max-md:text-xs text-[#616161]">
          Supported: {acceptedTypes.join(", ").toUpperCase()} • Max {maxSizeMB}MB per file
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-[#FFEBEE] border border-[#EF5350]">
          {errors.map((error, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[#C62828] mb-1 last:mb-0">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-[#212121]">
            Uploaded Files ({uploadedFiles.length})
          </p>
          {uploadedFiles.map((file, index) => {
            const Icon = getFileIcon(file.name);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F5F5] border border-[#E0E0E0]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <Icon className="text-[#1565C0]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#212121] truncate">{file.name}</p>
                  <p className="text-xs text-[#616161]">{formatFileSize(file.size)}</p>
                </div>
                <CheckCircle2 className="text-[#4CAF50]" size={20} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-[#9E9E9E] hover:text-[#C62828] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
