import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  FormSchema, FormField, validateAgainstSchema, allFields,
} from "../../lib/formSchema";
import { MitiDateField } from "../common/MitiDateField";

// ============================================================
// DynamicForm — renders any FormSchema (contact/lead/account)
// into a live, validated form. Lookup/user/branch options are
// injected by the parent so this stays data-source agnostic.
// ============================================================

export interface OptionItem { value: string; label: string; }

interface DynamicFormProps {
  schema: FormSchema;
  initialValues?: Record<string, unknown>;
  optionSources?: Record<string, OptionItem[]>; // keyed by apiName for lookup/user/branch
  nepali?: boolean;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function DynamicForm({
  schema, initialValues = {}, optionSources = {}, nepali, onSubmit, onCancel, submitLabel = "Save",
}: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const seed: Record<string, unknown> = { ...initialValues };
    allFields(schema).forEach((fl) => {
      if (seed[fl.apiName] === undefined && fl.defaultValue !== undefined) seed[fl.apiName] = fl.defaultValue;
    });
    return seed;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const set = (k: string, v: unknown) => setValues((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    const errs = validateAgainstSchema(schema, values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(values);
  };

  const inputCls = (err?: boolean) =>
    `w-full h-11 px-3 border rounded-lg text-sm outline-none transition-colors ${
      err ? "border-[#C62828] focus:ring-2 focus:ring-[#C62828]/20" : "border-[#E0E0E0] focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
    }`;

  const renderField = (fl: FormField) => {
    if (fl.hidden) return null;
    const val = (values[fl.apiName] ?? "") as string;
    const err = errors[fl.apiName];
    const opts = fl.options?.map((o) => ({ value: o, label: o })) ?? optionSources[fl.apiName] ?? [];

    let control: React.ReactNode;
    switch (fl.type) {
      case "textarea":
        control = <textarea rows={3} value={val} disabled={fl.readOnly} placeholder={fl.placeholder}
          onChange={(e) => set(fl.apiName, e.target.value)}
          className={inputCls(!!err).replace("h-11", "min-h-[80px] py-2")} />;
        break;
      case "select":
      case "lookup":
      case "user":
      case "branch":
        control = (
          <select value={val} disabled={fl.readOnly} onChange={(e) => set(fl.apiName, e.target.value)} className={inputCls(!!err)}>
            <option value="">{fl.placeholder || "Select…"}</option>
            {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        );
        break;
      case "multiselect":
        control = (
          <div className="flex flex-wrap gap-2">
            {opts.map((o) => {
              const arr = Array.isArray(values[fl.apiName]) ? (values[fl.apiName] as string[]) : [];
              const active = arr.includes(o.value);
              return (
                <button type="button" key={o.value}
                  onClick={() => set(fl.apiName, active ? arr.filter((x) => x !== o.value) : [...arr, o.value])}
                  className={`px-3 h-9 rounded-full text-sm border transition-colors ${active ? "bg-[#E3F2FD] border-[#1565C0] text-[#1565C0]" : "border-[#E0E0E0] text-[#616161] hover:bg-[#F5F5F5]"}`}>
                  {o.label}
                </button>
              );
            })}
          </div>
        );
        break;
      case "checkbox":
        control = (
          <label className="flex items-center gap-2 h-11 cursor-pointer">
            <input type="checkbox" checked={val === true || val === "true"} disabled={fl.readOnly}
              onChange={(e) => set(fl.apiName, e.target.checked)} className="w-4 h-4 accent-[#1565C0]" />
            <span className="text-sm text-[#616161]">{fl.helpText || "Yes"}</span>
          </label>
        );
        break;
      case "date":
      case "datetime":
        control = <MitiDateField value={val} onChange={(iso) => set(fl.apiName, iso)} nepali={nepali} required={fl.required} />;
        break;
      case "currency":
        control = (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] text-sm">₹</span>
            <input type="number" value={val} disabled={fl.readOnly} placeholder={fl.placeholder}
              onChange={(e) => set(fl.apiName, e.target.value)} className={inputCls(!!err).replace("px-3", "pl-7 pr-3")} />
          </div>
        );
        break;
      default:
        control = <input
          type={fl.type === "number" ? "number" : fl.type === "email" ? "email" : fl.type === "phone" ? "tel" : "text"}
          value={val} disabled={fl.readOnly} placeholder={fl.placeholder}
          onChange={(e) => set(fl.apiName, e.target.value)} className={inputCls(!!err)} />;
    }

    return (
      <div key={fl.id} className={fl.colSpan === 2 || fl.width === "full" ? "md:col-span-2" : ""}>
        {fl.type !== "checkbox" && (
          <label className="block text-sm font-medium text-[#212121] mb-1.5">
            {fl.label} {fl.required && <span className="text-[#C62828]">*</span>}
            {fl.isSystem && <span className="ml-2 text-[10px] px-1 py-0.5 rounded bg-[#F5F5F5] text-[#9E9E9E] uppercase">system</span>}
          </label>
        )}
        {control}
        {fl.helpText && fl.type !== "checkbox" && <p className="text-xs text-[#9E9E9E] mt-1">{fl.helpText}</p>}
        {err && <p className="text-xs text-[#C62828] mt-1">{err}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {schema.sections.map((sec) => {
        const isCollapsed = collapsed.has(sec.id);
        return (
          <div key={sec.id} className="border border-[#E0E0E0] rounded-xl overflow-hidden bg-white">
            <button type="button"
              onClick={() => sec.collapsible && setCollapsed((p) => { const n = new Set(p); n.has(sec.id) ? n.delete(sec.id) : n.add(sec.id); return n; })}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#FAFAFA] border-b border-[#E0E0E0]">
              <div className="text-left">
                <h3 className="text-sm font-semibold text-[#212121]">{sec.title}</h3>
                {sec.description && <p className="text-xs text-[#9E9E9E]">{sec.description}</p>}
              </div>
              {sec.collapsible && <ChevronDown size={18} className={`text-[#9E9E9E] transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />}
            </button>
            {!isCollapsed && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {sec.fields.map(renderField)}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-5 h-11 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">
            Cancel
          </button>
        )}
        <button type="button" onClick={handleSubmit}
          className="px-6 h-11 rounded-lg bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] transition-colors">
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
