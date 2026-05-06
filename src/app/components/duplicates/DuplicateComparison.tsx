import React, { useState, useEffect } from "react";
import { GitMerge, Link2, XCircle, SkipForward, AlertCircle } from "lucide-react";

export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: string;
  location: string;
  industry: string;
  score: number;
  stage: string;
  owner: string;
  tags: string[];
  notes: string;
  createdAt: string;
  lastActivity: string;
}

interface DuplicateComparisonProps {
  leadA: LeadData;
  leadB: LeadData;
  confidence: number;
  matchedFields: string[];
  onMerge: (mergedData: Partial<LeadData>) => void;
  onLink: () => void;
  onNotDuplicate: () => void;
  onSkip: () => void;
}

type FieldSelection = "left" | "right" | "custom";

interface FieldConfig {
  key: keyof LeadData;
  label: string;
  type: "text" | "number" | "date" | "tags";
}

const fields: FieldConfig[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "source", label: "Source", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "industry", label: "Industry", type: "text" },
  { key: "score", label: "Score", type: "number" },
  { key: "stage", label: "Stage", type: "text" },
  { key: "owner", label: "Owner", type: "text" },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "notes", label: "Notes", type: "text" },
  { key: "createdAt", label: "Created At", type: "date" },
  { key: "lastActivity", label: "Last Activity", type: "date" },
];

export function DuplicateComparison({
  leadA,
  leadB,
  confidence,
  matchedFields,
  onMerge,
  onLink,
  onNotDuplicate,
  onSkip,
}: DuplicateComparisonProps) {
  const [selections, setSelections] = useState<Record<string, FieldSelection>>({});
  const [customValues, setCustomValues] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(false);

  // Initialize selections with left values by default
  useEffect(() => {
    const initialSelections: Record<string, FieldSelection> = {};
    fields.forEach((field) => {
      initialSelections[field.key] = "left";
    });
    setSelections(initialSelections);
  }, [leadA.id, leadB.id]);

  const handleSelectionChange = (fieldKey: string, selection: FieldSelection) => {
    setSelections((prev) => ({ ...prev, [fieldKey]: selection }));
  };

  const handleCustomValueChange = (fieldKey: string, value: any) => {
    setCustomValues((prev) => ({ ...prev, [fieldKey]: value }));
    setSelections((prev) => ({ ...prev, [fieldKey]: "custom" }));
  };

  const isFieldMatched = (fieldKey: string) => {
    return matchedFields.includes(fieldKey);
  };

  const valuesMatch = (valueA: any, valueB: any) => {
    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      return JSON.stringify(valueA.sort()) === JSON.stringify(valueB.sort());
    }
    return valueA === valueB;
  };

  const getMergedData = (): Partial<LeadData> => {
    const merged: any = { id: leadA.id }; // Keep leadA's ID as primary
    fields.forEach((field) => {
      const selection = selections[field.key];
      if (selection === "left") {
        merged[field.key] = leadA[field.key];
      } else if (selection === "right") {
        merged[field.key] = leadB[field.key];
      } else if (selection === "custom") {
        merged[field.key] = customValues[field.key];
      }
    });
    return merged;
  };

  const renderValue = (value: any, type: string) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-[#9E9E9E] italic">Empty</span>;
    }
    if (type === "tags" && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-full bg-[#E3F2FD] text-[#1565C0] text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-[#212121]">{String(value)}</span>;
  };

  const handleMerge = () => {
    const merged = getMergedData();
    onMerge(merged);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Action Header */}
      <div className="border-b border-[#E0E0E0] p-4 bg-[#FAFAFA]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-[#212121] mb-1">Compare & Merge</h2>
            <p className="text-xs text-[#9E9E9E]">
              Match confidence: <span className="font-bold text-[#D32F2F]">{confidence}%</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSkip}
              className="px-3 py-2 text-sm text-[#616161] hover:text-[#1565C0] transition-colors"
            >
              Skip
            </button>
            <button
              onClick={onNotDuplicate}
              className="px-4 py-2 rounded-md border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:border-[#616161] hover:bg-[#F5F5F5] transition-all"
            >
              <XCircle size={16} className="inline mr-1.5" />
              Not a Duplicate
            </button>
            <button
              onClick={onLink}
              className="px-4 py-2 rounded-md border border-[#1565C0] text-sm font-medium text-[#1565C0] hover:bg-[#E3F2FD] transition-all"
            >
              <Link2 size={16} className="inline mr-1.5" />
              Link as Related
            </button>
            <button
              onClick={handleMerge}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-[#1565C0] to-[#0D47A1] text-white text-sm font-semibold hover:shadow-lg transition-shadow"
            >
              <GitMerge size={16} className="inline mr-1.5" />
              Merge Leads
            </button>
          </div>
        </div>

        {/* Toggle Preview */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs text-[#1565C0] hover:underline"
        >
          {showPreview ? "Hide" : "Show"} Merged Preview
        </button>
      </div>

      {/* Comparison Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-[#F5F5F5] sticky top-0 z-10">
            <tr>
              <th className="w-48 px-4 py-3 text-left text-xs font-semibold text-[#616161] border-b border-[#E0E0E0]">
                Field
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#616161] border-b border-l border-[#E0E0E0]">
                Lead A
              </th>
              <th className="w-24 px-4 py-3 text-center text-xs font-semibold text-[#616161] border-b border-l border-[#E0E0E0]">
                Keep
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#616161] border-b border-l border-[#E0E0E0]">
                Lead B
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const valueA = leadA[field.key];
              const valueB = leadB[field.key];
              const matched = valuesMatch(valueA, valueB);
              const isHighlighted = isFieldMatched(field.key);
              const selection = selections[field.key] || "left";

              return (
                <tr
                  key={field.key}
                  className={`border-b border-[#E0E0E0] ${
                    isHighlighted ? "bg-[#FFF9C4]/50" : index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                  }`}
                >
                  {/* Field Label */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#424242]">{field.label}</span>
                      {isHighlighted && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-[#FFF9C4] text-[#616161] border border-[#F57F17]/20">
                          Match
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Lead A Value */}
                  <td
                    className={`px-4 py-3 text-sm border-l border-[#E0E0E0] ${
                      selection === "left" ? "bg-[#E3F2FD]/30" : ""
                    }`}
                  >
                    {renderValue(valueA, field.type)}
                  </td>

                  {/* Radio Buttons */}
                  <td className="px-4 py-3 border-l border-[#E0E0E0]">
                    <div className="flex items-center justify-center gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name={`field-${field.key}`}
                          checked={selection === "left"}
                          onChange={() => handleSelectionChange(field.key, "left")}
                          className="w-4 h-4 text-[#1565C0] focus:ring-[#1565C0]"
                        />
                      </label>
                      <span className="text-[#E0E0E0]">|</span>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name={`field-${field.key}`}
                          checked={selection === "right"}
                          onChange={() => handleSelectionChange(field.key, "right")}
                          className="w-4 h-4 text-[#1565C0] focus:ring-[#1565C0]"
                        />
                      </label>
                    </div>
                  </td>

                  {/* Lead B Value */}
                  <td
                    className={`px-4 py-3 text-sm border-l border-[#E0E0E0] ${
                      selection === "right" ? "bg-[#E3F2FD]/30" : ""
                    }`}
                  >
                    {renderValue(valueB, field.type)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Merged Preview */}
      {showPreview && (
        <div className="border-t-2 border-[#1565C0] bg-[#FAFAFA] p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-[#1565C0]" />
            <h3 className="text-sm font-semibold text-[#212121]">Merged Preview</h3>
          </div>
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
            <div className="grid grid-cols-3 gap-4">
              {fields.slice(0, 9).map((field) => {
                const mergedData = getMergedData();
                const value = mergedData[field.key];
                return (
                  <div key={field.key}>
                    <p className="text-xs text-[#9E9E9E] mb-1">{field.label}</p>
                    <div className="text-sm font-medium">
                      {renderValue(value, field.type)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
