import React, { useState } from "react";
import { Check, ChevronRight, ChevronLeft, Sparkles, Save, Download } from "lucide-react";

interface BuilderStep {
  id: string;
  title: string;
  description: string;
  fields: BuilderField[];
}

interface BuilderField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "number" | "date" | "range";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  aiSuggestion?: boolean;
}

interface StrategyBuilderProps {
  templateId: string;
  templateTitle: string;
  steps: BuilderStep[];
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function StrategyBuilder({ templateId, templateTitle, steps, onComplete, onCancel }: StrategyBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [aiGenerating, setAiGenerating] = useState(false);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleAISuggestion = async (fieldId: string) => {
    setAiGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestions: Record<string, string> = {
      "campaign-objective": "Increase brand awareness by 40% and generate 500+ qualified leads within 3 months through integrated digital marketing campaigns.",
      "target-audience": "Young professionals aged 25-35, urban dwellers in Kathmandu Valley, tech-savvy, HHI 50K-150K NPR/month, interested in innovation and quality products.",
      "budget-breakdown": "Social Media Ads: 40%, Google Ads: 25%, Content Creation: 20%, Influencer Marketing: 10%, Analytics Tools: 5%",
      "platforms": "Facebook, Instagram, LinkedIn, Google Ads, YouTube",
    };
    
    handleFieldChange(fieldId, suggestions[fieldId] || "AI-generated suggestion for " + fieldId);
    setAiGenerating(false);
  };

  const validateStep = () => {
    const requiredFields = currentStepData.fields.filter(f => f.required);
    return requiredFields.every(f => formData[f.id] && formData[f.id].toString().trim() !== "");
  };

  const handleNext = () => {
    if (validateStep()) {
      if (isLastStep) {
        onComplete(formData);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderField = (field: BuilderField) => {
    const value = formData[field.id] || "";

    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return (
          <div key={field.id} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-[#212121]">
                {field.label}
                {field.required && <span className="text-[#C62828] ml-1">*</span>}
              </label>
              {field.aiSuggestion && (
                <button
                  onClick={() => handleAISuggestion(field.id)}
                  disabled={aiGenerating}
                  className="text-xs text-[#1565C0] hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles size={12} />
                  {aiGenerating ? "Generating..." : "AI Suggest"}
                </button>
              )}
            </div>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-[#212121]">
                {field.label}
                {field.required && <span className="text-[#C62828] ml-1">*</span>}
              </label>
              {field.aiSuggestion && (
                <button
                  onClick={() => handleAISuggestion(field.id)}
                  disabled={aiGenerating}
                  className="text-xs text-[#1565C0] hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles size={12} />
                  {aiGenerating ? "Generating..." : "AI Suggest"}
                </button>
              )}
            </div>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20 resize-none"
            />
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              {field.label}
              {field.required && <span className="text-[#C62828] ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            >
              <option value="">Select...</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case "multiselect":
        return (
          <div key={field.id} className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              {field.label}
              {field.required && <span className="text-[#C62828] ml-1">*</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {field.options?.map(option => {
                const selected = Array.isArray(value) && value.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const current = Array.isArray(value) ? value : [];
                      const updated = selected
                        ? current.filter((v: string) => v !== option)
                        : [...current, option];
                      handleFieldChange(field.id, updated);
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selected
                        ? "bg-[#1565C0] text-white"
                        : "bg-[#F5F5F5] text-[#616161] hover:bg-[#E0E0E0]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "range":
        return (
          <div key={field.id} className="mb-4">
            <label className="text-sm font-semibold text-[#212121] mb-2 block">
              {field.label}
              {field.required && <span className="text-[#C62828] ml-1">*</span>}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={value || 50}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#616161] mt-1">
              <span>0</span>
              <span className="font-semibold text-[#1565C0]">{value || 50}</span>
              <span>100</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E0E0E0] bg-[#F5F5F5]">
        <h3 className="text-lg font-semibold text-[#212121] mb-2">{templateTitle}</h3>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 shrink-0 ${index <= currentStep ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  index < currentStep 
                    ? 'bg-[#4CAF50] text-white' 
                    : index === currentStep 
                    ? 'bg-[#1565C0] text-white' 
                    : 'bg-[#E0E0E0] text-[#9E9E9E]'
                }`}>
                  {index < currentStep ? <Check size={14} /> : index + 1}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${
                  index === currentStep ? 'text-[#1565C0]' : 'text-[#616161]'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight size={14} className="text-[#E0E0E0] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-[#212121] mb-1">{currentStepData.title}</h4>
          <p className="text-sm text-[#616161]">{currentStepData.description}</p>
        </div>

        <div className="space-y-4">
          {currentStepData.fields.map(field => renderField(field))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-[#E0E0E0] bg-[#F5F5F5] flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <button
              onClick={handlePrevious}
              className="px-4 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-sm font-medium flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!validateStep()}
            className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isLastStep ? (
              <>
                <Save size={16} />
                Generate Plan
              </>
            ) : (
              <>
                Next
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
