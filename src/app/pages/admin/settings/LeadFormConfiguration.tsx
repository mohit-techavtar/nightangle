import React, { useState } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { Plus, Trash2, GripVertical, Save, RotateCcw, Eye, AlertCircle, Check } from "lucide-react";

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

const defaultFields: FormField[] = [
  { id: "1", label: "Full Name", fieldName: "name", type: "text", required: true, placeholder: "Enter full name", order: 1 },
  { id: "2", label: "Email Address", fieldName: "email", type: "email", required: true, placeholder: "email@example.com", order: 2 },
  { id: "3", label: "Phone Number", fieldName: "phone", type: "phone", required: true, placeholder: "+977 98XXXXXXXX", order: 3 },
  { id: "4", label: "Company Name", fieldName: "company", type: "text", required: false, placeholder: "Company name", order: 4 },
  { id: "5", label: "Lead Source", fieldName: "source", type: "select", required: true, options: ["Website", "Referral", "Cold Call", "Social Media", "Event", "Partner"], order: 5 },
  { id: "6", label: "Lead Status", fieldName: "stage", type: "select", required: true, options: ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"], order: 6 },
  { id: "7", label: "Estimated Value", fieldName: "value", type: "currency", required: false, placeholder: "NPR 0", order: 7 },
];

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "currency", label: "Currency" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "textarea", label: "Text Area" },
  { value: "url", label: "URL" },
];

export function LeadFormConfiguration() {
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const addNewField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: "New Field",
      fieldName: "new_field",
      type: "text",
      required: false,
      placeholder: "",
      order: fields.length + 1,
    };
    setFields([...fields, newField]);
    setEditingField(newField.id);
    setHasChanges(true);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    setHasChanges(true);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    setHasChanges(true);
  };

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex(f => f.id === id);
    if ((direction === "up" && index > 0) || (direction === "down" && index < fields.length - 1)) {
      const newFields = [...fields];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
      setFields(newFields.map((f, i) => ({ ...f, order: i + 1 })));
      setHasChanges(true);
    }
  };

  const resetToDefaults = () => {
    if (confirm("Reset to default fields? All custom changes will be lost.")) {
      setFields(defaultFields);
      setHasChanges(false);
    }
  };

  const saveConfiguration = () => {
    // In a real app, this would save to backend
    console.log("Saving configuration:", fields);
    setHasChanges(false);
    alert("Lead form configuration saved successfully!");
  };

  return (
    <>
      <TopBar 
        breadcrumbs={[
          { label: "Settings" }, 
          { label: "Lead Form Configuration" }
        ]} 
        mode="admin" 
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="mb-2">Lead Form Configuration</h2>
            <p className="text-sm text-[#616161]">
              Configure the lead form fields that will be used when adding new leads. Drag to reorder, click to edit.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={addNewField}
                className="h-10 px-4 bg-[#1565C0] text-white rounded-md hover:bg-[#0D47A1] flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Field
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="h-10 px-4 border border-[#E0E0E0] text-[#616161] rounded-md hover:bg-[#F5F5F5] flex items-center gap-2 text-sm"
              >
                <Eye size={16} />
                {showPreview ? "Hide Preview" : "Preview Form"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetToDefaults}
                className="h-10 px-4 text-[#616161] hover:bg-[#F5F5F5] rounded-md flex items-center gap-2 text-sm"
              >
                <RotateCcw size={16} />
                Reset to Defaults
              </button>
              <button
                onClick={saveConfiguration}
                disabled={!hasChanges}
                className="h-10 px-4 bg-[#2E7D32] text-white rounded-md hover:bg-[#1B5E20] flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                Save Configuration
              </button>
            </div>
          </div>

          {hasChanges && (
            <div className="mb-4 p-3 bg-[#FFF8E1] border border-[#FFE082] rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-[#F57F17]" />
              <span className="text-[#616161]">You have unsaved changes. Click <strong>Save Configuration</strong> to apply them.</span>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Field List */}
            <div className="col-span-7 space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    editingField === field.id 
                      ? "border-[#1565C0] shadow-lg" 
                      : "border-[#E0E0E0]"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Drag Handle */}
                      <div className="flex flex-col gap-1 mt-2">
                        <button
                          onClick={() => moveField(field.id, "up")}
                          disabled={index === 0}
                          className="text-[#9E9E9E] hover:text-[#616161] disabled:opacity-30"
                        >
                          <GripVertical size={16} />
                        </button>
                      </div>

                      {/* Field Content */}
                      <div className="flex-1">
                        {editingField === field.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block mb-1 text-xs font-medium text-[#616161]">Field Label</label>
                                <input
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                                  className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm"
                                  placeholder="Field label"
                                />
                              </div>
                              <div>
                                <label className="block mb-1 text-xs font-medium text-[#616161]">Field Name (ID)</label>
                                <input
                                  value={field.fieldName}
                                  onChange={(e) => updateField(field.id, { fieldName: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
                                  className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm font-mono"
                                  placeholder="field_name"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block mb-1 text-xs font-medium text-[#616161]">Field Type</label>
                                <select
                                  value={field.type}
                                  onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                  className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white"
                                >
                                  {fieldTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block mb-1 text-xs font-medium text-[#616161]">Placeholder Text</label>
                                <input
                                  value={field.placeholder || ""}
                                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                  className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm"
                                  placeholder="Placeholder..."
                                />
                              </div>
                            </div>

                            {(field.type === "select" || field.type === "multiselect") && (
                              <div>
                                <label className="block mb-1 text-xs font-medium text-[#616161]">Options (comma-separated)</label>
                                <input
                                  value={field.options?.join(", ") || ""}
                                  onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                  className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm"
                                  placeholder="Option 1, Option 2, Option 3"
                                />
                              </div>
                            )}

                            <div>
                              <label className="block mb-1 text-xs font-medium text-[#616161]">Help Text</label>
                              <input
                                value={field.helpText || ""}
                                onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                                className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm"
                                placeholder="Optional help text..."
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE]">
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                  className="w-4 h-4 text-[#1565C0] border-[#E0E0E0] rounded"
                                />
                                <span className="text-[#616161]">Required field</span>
                              </label>
                              <button
                                onClick={() => setEditingField(null)}
                                className="h-8 px-3 bg-[#1565C0] text-white rounded-md text-xs hover:bg-[#0D47A1]"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div onClick={() => setEditingField(field.id)} className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium">{field.label}</h4>
                              {field.required && (
                                <span className="text-[10px] bg-[#C62828] text-white px-1.5 py-0.5 rounded">Required</span>
                              )}
                              <span className="text-xs text-[#9E9E9E] font-mono">({field.fieldName})</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#616161]">
                              <span className="px-2 py-0.5 bg-[#F5F5F5] rounded">
                                {fieldTypes.find(t => t.value === field.type)?.label}
                              </span>
                              {field.placeholder && (
                                <span className="text-[#9E9E9E]">"{field.placeholder}"</span>
                              )}
                            </div>
                            {field.helpText && (
                              <p className="text-xs text-[#9E9E9E] mt-1 italic">{field.helpText}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => deleteField(field.id)}
                          className="w-8 h-8 rounded-md text-[#C62828] hover:bg-[#FFEBEE] flex items-center justify-center"
                          title="Delete field"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="bg-[#F5F5F5] rounded-lg border-2 border-dashed border-[#E0E0E0] p-8 text-center">
                  <p className="text-[#9E9E9E] mb-4">No fields configured. Add your first field to get started.</p>
                  <button
                    onClick={addNewField}
                    className="h-10 px-4 bg-[#1565C0] text-white rounded-md hover:bg-[#0D47A1] inline-flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} />
                    Add Field
                  </button>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="col-span-5">
              <div className="sticky top-6">
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EEEEEE]">
                    <h4 className="text-sm font-medium">Form Preview</h4>
                    <span className="text-xs text-[#9E9E9E]">{fields.length} fields</span>
                  </div>

                  <div className="space-y-4">
                    {fields.map(field => (
                      <div key={field.id}>
                        <label className="block mb-1 text-xs font-medium text-[#212121]">
                          {field.label}
                          {field.required && <span className="text-[#C62828] ml-1">*</span>}
                        </label>
                        
                        {field.type === "textarea" ? (
                          <textarea
                            placeholder={field.placeholder}
                            className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
                            rows={3}
                            disabled
                          />
                        ) : field.type === "select" ? (
                          <select className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white" disabled>
                            <option value="">Select {field.label}</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === "multiselect" ? (
                          <div className="border border-[#E0E0E0] rounded-md p-2 bg-[#F9F9F9]">
                            {field.options?.slice(0, 3).map(opt => (
                              <div key={opt} className="flex items-center gap-2 py-1 text-xs text-[#9E9E9E]">
                                <input type="checkbox" disabled className="w-3 h-3" />
                                {opt}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            className="w-full h-9 border border-[#E0E0E0] rounded-md px-3 text-sm"
                            disabled
                          />
                        )}
                        
                        {field.helpText && (
                          <p className="text-xs text-[#9E9E9E] mt-1">{field.helpText}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {fields.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#EEEEEE]">
                      <button className="w-full h-9 bg-[#1565C0] text-white rounded-md text-sm flex items-center justify-center gap-2" disabled>
                        <Check size={14} />
                        Add Lead
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 bg-[#F5F5F5] rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#212121]">{fields.length}</div>
                      <div className="text-xs text-[#616161]">Total Fields</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#212121]">{fields.filter(f => f.required).length}</div>
                      <div className="text-xs text-[#616161]">Required</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
