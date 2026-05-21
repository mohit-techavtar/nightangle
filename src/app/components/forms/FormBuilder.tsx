import React, { useState } from "react";
import {
  Plus, Trash2, GripVertical, Eye, EyeOff, Settings2, ChevronUp, ChevronDown,
  Lock, Save, RotateCcw, X,
} from "lucide-react";
import { FormSchema, FormField, FormFieldType, FormSection } from "../../lib/formSchema";

// ============================================================
// FormBuilder — configure a FormSchema (fields, sections, order,
// required/hidden, options). Used for Contact and Lead form
// configuration. Live preview is provided by the parent page.
// ============================================================

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Text" }, { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" }, { value: "currency", label: "Currency" },
  { value: "email", label: "Email" }, { value: "phone", label: "Phone" },
  { value: "url", label: "URL" }, { value: "date", label: "Date" },
  { value: "select", label: "Picklist" }, { value: "multiselect", label: "Multi-Picklist" },
  { value: "checkbox", label: "Checkbox" }, { value: "radio", label: "Radio" },
  { value: "lookup", label: "Lookup" }, { value: "user", label: "User" },
];

interface FormBuilderProps {
  schema: FormSchema;
  onChange: (schema: FormSchema) => void;
  onSave: () => void;
  onReset: () => void;
}

export function FormBuilder({ schema, onChange, onSave, onReset }: FormBuilderProps) {
  const [editingField, setEditingField] = useState<{ sectionId: string; field: FormField } | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const update = (next: FormSchema) => onChange(next);

  const moveField = (sectionId: string, idx: number, dir: -1 | 1) => {
    const sec = schema.sections.find((s) => s.id === sectionId)!;
    const to = idx + dir;
    if (to < 0 || to >= sec.fields.length) return;
    const fields = [...sec.fields];
    [fields[idx], fields[to]] = [fields[to], fields[idx]];
    update({ ...schema, sections: schema.sections.map((s) => s.id === sectionId ? { ...s, fields } : s) });
  };

  const toggleHidden = (apiName: string) =>
    update({ ...schema, sections: schema.sections.map((s) => ({ ...s, fields: s.fields.map((f) => f.apiName === apiName ? { ...f, hidden: !f.hidden } : f) })) });

  const toggleRequired = (apiName: string) =>
    update({ ...schema, sections: schema.sections.map((s) => ({ ...s, fields: s.fields.map((f) => f.apiName === apiName ? { ...f, required: !f.required } : f) })) });

  const removeField = (sectionId: string, apiName: string) =>
    update({ ...schema, sections: schema.sections.map((s) => s.id === sectionId ? { ...s, fields: s.fields.filter((f) => f.apiName !== apiName) } : s) });

  const saveEdited = (field: FormField) => {
    if (!editingField) return;
    update({ ...schema, sections: schema.sections.map((s) => ({ ...s, fields: s.fields.map((f) => f.apiName === field.apiName ? field : f) })) });
    setEditingField(null);
  };

  const addField = (sectionId: string, field: FormField) => {
    update({ ...schema, sections: schema.sections.map((s) => s.id === sectionId ? { ...s, fields: [...s.fields, field] } : s) });
    setAddingTo(null);
  };

  const addSection = () => {
    const sec: FormSection = { id: `sec-${Date.now()}`, title: "New Section", collapsible: true, fields: [] };
    update({ ...schema, sections: [...schema.sections, sec] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#616161]">
          Drag-free reordering, show/hide, mark required, and add custom fields. <span className="font-medium text-[#212121]">{schema.object}</span> layout · v{schema.version}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="px-3 h-10 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-1.5">
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={onSave} className="px-4 h-10 rounded-lg bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] flex items-center gap-1.5">
            <Save size={15} /> Save Layout
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {schema.sections.map((sec) => (
          <div key={sec.id} className="border border-[#E0E0E0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E0E0E0]">
              <input
                value={sec.title}
                onChange={(e) => update({ ...schema, sections: schema.sections.map((s) => s.id === sec.id ? { ...s, title: e.target.value } : s) })}
                className="bg-transparent text-sm font-semibold text-[#212121] outline-none border-b border-transparent focus:border-[#1565C0]"
              />
              <button onClick={() => setAddingTo(sec.id)} className="text-sm font-medium text-[#1565C0] flex items-center gap-1 hover:underline">
                <Plus size={15} /> Add Field
              </button>
            </div>

            <div className="divide-y divide-[#F0F0F0]">
              {sec.fields.map((fl, idx) => (
                <div key={fl.id} className={`flex items-center gap-3 px-4 py-2.5 ${fl.hidden ? "opacity-50" : ""}`}>
                  <div className="flex flex-col">
                    <button onClick={() => moveField(sec.id, idx, -1)} className="text-[#BDBDBD] hover:text-[#616161]"><ChevronUp size={14} /></button>
                    <button onClick={() => moveField(sec.id, idx, 1)} className="text-[#BDBDBD] hover:text-[#616161]"><ChevronDown size={14} /></button>
                  </div>
                  <GripVertical size={16} className="text-[#E0E0E0]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#212121] truncate">{fl.label}</span>
                      {fl.isSystem && <Lock size={12} className="text-[#9E9E9E]" />}
                      {fl.required && <span className="text-[10px] px-1 py-0.5 rounded bg-[#FFEBEE] text-[#C62828] font-semibold">REQ</span>}
                    </div>
                    <span className="text-xs text-[#9E9E9E]">{fl.apiName} · {fl.type}</span>
                  </div>
                  <button onClick={() => toggleRequired(fl.apiName)} title="Toggle required"
                    className={`text-xs px-2 h-7 rounded border ${fl.required ? "border-[#C62828] text-[#C62828]" : "border-[#E0E0E0] text-[#9E9E9E]"}`}>Req</button>
                  <button onClick={() => toggleHidden(fl.apiName)} title="Show/Hide" className="p-1.5 text-[#616161] hover:bg-[#F5F5F5] rounded">
                    {fl.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => setEditingField({ sectionId: sec.id, field: { ...fl } })} className="p-1.5 text-[#616161] hover:bg-[#F5F5F5] rounded"><Settings2 size={16} /></button>
                  {!fl.isSystem && (
                    <button onClick={() => removeField(sec.id, fl.apiName)} className="p-1.5 text-[#C62828] hover:bg-[#FFEBEE] rounded"><Trash2 size={16} /></button>
                  )}
                </div>
              ))}
              {sec.fields.length === 0 && <div className="px-4 py-6 text-center text-sm text-[#9E9E9E]">No fields. Add one to get started.</div>}
            </div>

            {addingTo === sec.id && <AddFieldRow onAdd={(f) => addField(sec.id, f)} onCancel={() => setAddingTo(null)} />}
          </div>
        ))}
      </div>

      <button onClick={addSection} className="mt-4 px-4 h-10 rounded-lg border border-dashed border-[#BDBDBD] text-sm font-medium text-[#616161] hover:border-[#1565C0] hover:text-[#1565C0] flex items-center gap-1.5">
        <Plus size={16} /> Add Section
      </button>

      {editingField && <FieldEditor field={editingField.field} onSave={saveEdited} onCancel={() => setEditingField(null)} />}
    </div>
  );
}

function AddFieldRow({ onAdd, onCancel }: { onAdd: (f: FormField) => void; onCancel: () => void }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FormFieldType>("text");
  const [required, setRequired] = useState(false);

  const create = () => {
    if (!label.trim()) return;
    const apiName = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") + "_c";
    onAdd({ id: `fld-${Date.now()}`, apiName, label: label.trim(), type, required, width: "half", colSpan: type === "textarea" ? 2 : 1 });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-[#F3F8FF] border-t border-[#E0E0E0]">
      <input autoFocus value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Field label"
        className="flex-1 h-10 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]" />
      <select value={type} onChange={(e) => setType(e.target.value as FormFieldType)} className="h-10 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]">
        {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      <label className="flex items-center gap-1.5 text-sm text-[#616161]">
        <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="w-4 h-4 accent-[#1565C0]" /> Req
      </label>
      <button onClick={create} className="px-4 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold">Add</button>
      <button onClick={onCancel} className="p-2 text-[#9E9E9E] hover:text-[#212121]"><X size={18} /></button>
    </div>
  );
}

function FieldEditor({ field, onSave, onCancel }: { field: FormField; onSave: (f: FormField) => void; onCancel: () => void }) {
  const [f, setF] = useState<FormField>(field);
  const set = (patch: Partial<FormField>) => setF((p) => ({ ...p, ...patch }));
  const hasOptions = ["select", "multiselect", "radio"].includes(f.type);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E0E0]">
          <h3 className="text-base font-semibold text-[#212121]">Edit Field</h3>
          <button onClick={onCancel} className="p-1.5 text-[#9E9E9E] hover:text-[#212121]"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Label</label>
            <input value={f.label} onChange={(e) => set({ label: e.target.value })} className="w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Help Text</label>
            <input value={f.helpText || ""} onChange={(e) => set({ helpText: e.target.value })} className="w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#212121] mb-1.5">Placeholder</label>
            <input value={f.placeholder || ""} onChange={(e) => set({ placeholder: e.target.value })} className="w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]" />
          </div>
          {hasOptions && (
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1.5">Options (one per line)</label>
              <textarea rows={4} value={(f.options || []).join("\n")} onChange={(e) => set({ options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]" />
            </div>
          )}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#616161]">
              <input type="checkbox" checked={f.required} onChange={(e) => set({ required: e.target.checked })} className="w-4 h-4 accent-[#1565C0]" /> Required
            </label>
            <label className="flex items-center gap-2 text-sm text-[#616161]">
              <input type="checkbox" checked={f.colSpan === 2} onChange={(e) => set({ colSpan: e.target.checked ? 2 : 1, width: e.target.checked ? "full" : "half" })} className="w-4 h-4 accent-[#1565C0]" /> Full width
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E0E0E0]">
          <button onClick={onCancel} className="px-5 h-11 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">Cancel</button>
          <button onClick={() => onSave(f)} className="px-6 h-11 rounded-lg bg-[#1565C0] text-white text-sm font-semibold">Save Field</button>
        </div>
      </div>
    </div>
  );
}
