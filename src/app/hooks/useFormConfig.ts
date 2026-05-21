import { useState, useCallback } from "react";
import {
  FormSchema, getDefaultSchema, FormField, FormSection,
} from "../lib/formSchema";

// ============================================================
// OmniCRM — Form Config Store
// Holds the live, user-editable schemas for contact / lead /
// account forms. Persists to localStorage so configuration
// survives reloads (swap for an API later).
// ============================================================

const LS_KEY = "omnicrm.formSchemas.v1";

type SchemaMap = Record<FormSchema["object"], FormSchema>;

function load(): SchemaMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    contact: getDefaultSchema("contact"),
    lead: getDefaultSchema("lead"),
    account: getDefaultSchema("account"),
  };
}

function persist(map: SchemaMap) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}

export function useFormConfig(object: FormSchema["object"]) {
  const [map, setMap] = useState<SchemaMap>(load);
  const schema = map[object];

  const save = useCallback((next: FormSchema) => {
    setMap((prev) => {
      const updated = { ...prev, [object]: { ...next, updatedAt: new Date().toISOString(), version: next.version + 1 } };
      persist(updated);
      return updated;
    });
  }, [object]);

  const resetToDefault = useCallback(() => {
    setMap((prev) => {
      const updated = { ...prev, [object]: getDefaultSchema(object) };
      persist(updated);
      return updated;
    });
  }, [object]);

  // ─── Section / field mutations (return new schema, do not auto-save) ──
  const addField = (sectionId: string, field: FormField): FormSchema => ({
    ...schema,
    sections: schema.sections.map((s) => s.id === sectionId ? { ...s, fields: [...s.fields, field] } : s),
  });

  const updateField = (apiName: string, patch: Partial<FormField>): FormSchema => ({
    ...schema,
    sections: schema.sections.map((s) => ({
      ...s,
      fields: s.fields.map((fl) => fl.apiName === apiName ? { ...fl, ...patch } : fl),
    })),
  });

  const removeField = (apiName: string): FormSchema => ({
    ...schema,
    sections: schema.sections.map((s) => ({
      ...s,
      fields: s.fields.filter((fl) => fl.apiName !== apiName || fl.isSystem),
    })),
  });

  const addSection = (section: FormSection): FormSchema => ({
    ...schema, sections: [...schema.sections, section],
  });

  const reorderField = (sectionId: string, from: number, to: number): FormSchema => ({
    ...schema,
    sections: schema.sections.map((s) => {
      if (s.id !== sectionId) return s;
      const fields = [...s.fields];
      const [moved] = fields.splice(from, 1);
      fields.splice(to, 0, moved);
      return { ...s, fields };
    }),
  });

  return { schema, save, resetToDefault, addField, updateField, removeField, addSection, reorderField };
}
