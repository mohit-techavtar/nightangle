import React, { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  fieldName: string;
  type: "text" | "email" | "phone" | "number" | "date" | "select" | "multiselect" | "textarea" | "url" | "currency";
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
  validation?: string;
  order: number;
}

// Default form configuration (same as in LeadFormConfiguration)
const defaultFields: FormField[] = [
  { id: "1", label: "Full Name", fieldName: "name", type: "text", required: true, placeholder: "Enter full name", order: 1 },
  { id: "2", label: "Email Address", fieldName: "email", type: "email", required: true, placeholder: "email@example.com", order: 2 },
  { id: "3", label: "Phone Number", fieldName: "phone", type: "phone", required: true, placeholder: "+977 98XXXXXXXX", order: 3 },
  { id: "4", label: "Company Name", fieldName: "company", type: "text", required: false, placeholder: "Company name", order: 4 },
  { id: "5", label: "Lead Source", fieldName: "source", type: "select", required: true, options: ["Website", "Referral", "Cold Call", "Social Media", "Event", "Partner"], order: 5 },
  { id: "6", label: "Lead Status", fieldName: "stage", type: "select", required: true, options: ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"], order: 6 },
  { id: "7", label: "Estimated Value", fieldName: "value", type: "currency", required: false, placeholder: "NPR 0", order: 7 },
  { id: "8", label: "Location", fieldName: "location", type: "text", required: false, placeholder: "City, Country", order: 8 },
];

interface DynamicLeadFormModalProps {
  onCreateLead: (leadData: any) => void;
  onClose: () => void;
  formFields?: FormField[];
}

export function DynamicLeadFormModal({ onCreateLead, onClose, formFields = defaultFields }: DynamicLeadFormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedFields = [...formFields].sort((a, b) => a.order - b.order);

  const updateField = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    sortedFields.forEach(field => {
      if (field.required && !formData[field.fieldName]) {
        newErrors[field.fieldName] = `${field.label} is required`;
      }

      // Email validation
      if (field.type === "email" && formData[field.fieldName]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.fieldName])) {
          newErrors[field.fieldName] = "Invalid email format";
        }
      }

      // Phone validation (basic)
      if (field.type === "phone" && formData[field.fieldName]) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(formData[field.fieldName])) {
          newErrors[field.fieldName] = "Invalid phone format";
        }
      }

      // URL validation
      if (field.type === "url" && formData[field.fieldName]) {
        try {
          new URL(formData[field.fieldName]);
        } catch {
          newErrors[field.fieldName] = "Invalid URL format";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onCreateLead(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.fieldName] || "";
    const error = errors[field.fieldName];

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition-all ${
              error 
                ? "border-[#C62828] focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                : "border-[#E0E0E0] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            }`}
            rows={3}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
            className={`w-full h-10 border rounded-md px-3 text-sm bg-white outline-none transition-all ${
              error
                ? "border-[#C62828] focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                : "border-[#E0E0E0] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            }`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className={`border rounded-md p-3 space-y-2 ${
            error ? "border-[#C62828]" : "border-[#E0E0E0]"
          }`}>
            {field.options?.map(option => {
              const selectedOptions = formData[field.fieldName] || [];
              const isSelected = selectedOptions.includes(option);
              
              return (
                <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[#F5F5F5] px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentValues = formData[field.fieldName] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      updateField(field.fieldName, newValues);
                    }}
                    className="w-4 h-4 text-[#1565C0] border-[#E0E0E0] rounded"
                  />
                  <span className="text-[#212121]">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
            className={`w-full h-10 border rounded-md px-3 text-sm outline-none transition-all ${
              error
                ? "border-[#C62828] focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                : "border-[#E0E0E0] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            }`}
          />
        );

      case "number":
      case "currency":
        return (
          <div className="relative">
            {field.type === "currency" && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161] text-sm">NPR</span>
            )}
            <input
              type="number"
              value={value}
              onChange={(e) => updateField(field.fieldName, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full h-10 border rounded-md px-3 text-sm outline-none transition-all ${
                field.type === "currency" ? "pl-12" : ""
              } ${
                error
                  ? "border-[#C62828] focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                  : "border-[#E0E0E0] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
              }`}
            />
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full h-10 border rounded-md px-3 text-sm outline-none transition-all ${
              error
                ? "border-[#C62828] focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20"
                : "border-[#E0E0E0] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
            }`}
          />
        );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
          <h3 className="text-lg font-semibold text-[#212121]">Add New Lead</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#616161] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {sortedFields.map(field => (
              <div key={field.id}>
                <label className="block mb-1.5 text-sm font-medium text-[#212121]">
                  {field.label}
                  {field.required && <span className="text-[#C62828] ml-1">*</span>}
                </label>
                
                {renderField(field)}
                
                {errors[field.fieldName] && (
                  <p className="text-xs text-[#C62828] mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#C62828]"></span>
                    {errors[field.fieldName]}
                  </p>
                )}
                
                {field.helpText && !errors[field.fieldName] && (
                  <p className="text-xs text-[#9E9E9E] mt-1 italic">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E0E0E0] flex items-center justify-end gap-3 bg-[#F9F9F9]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm font-medium hover:bg-[#0D47A1] flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Add Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}