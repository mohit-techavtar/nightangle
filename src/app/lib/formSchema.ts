// ============================================================
// OmniCRM — Configurable Form Schema Engine
// A single schema model powers user-configurable Contact and
// Lead forms (Salesforce-style page layouts). Used by the Form
// Builder (admin) and the Dynamic Form renderer (end users).
// ============================================================

export type FormFieldType =
  | "text" | "textarea" | "number" | "currency" | "email" | "phone"
  | "url" | "date" | "datetime" | "select" | "multiselect"
  | "checkbox" | "radio" | "lookup" | "user" | "branch";

export interface FormField {
  id: string;
  apiName: string;          // stable key used on the record
  label: string;
  type: FormFieldType;
  required: boolean;
  unique?: boolean;
  readOnly?: boolean;
  isSystem?: boolean;       // shipped fields cannot be deleted, only hidden
  hidden?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string;
  options?: string[];       // for select/multiselect/radio
  lookupObject?: "account" | "contact" | "user";
  width?: "full" | "half";  // layout hint
  colSpan?: 1 | 2;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  collapsible?: boolean;
  fields: FormField[];
}

export interface FormSchema {
  object: "contact" | "lead" | "account";
  version: number;
  sections: FormSection[];
  updatedAt: string;
}

const f = (p: Partial<FormField> & Pick<FormField, "apiName" | "label" | "type">): FormField => ({
  id: `fld-${p.apiName}`,
  required: false,
  width: "half",
  colSpan: 1,
  ...p,
});

// ─── Default Contact form (Salesforce-like) ──────────────────
export const defaultContactSchema: FormSchema = {
  object: "contact",
  version: 1,
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "sec-c-info", title: "Contact Information",
      fields: [
        f({ apiName: "salutation", label: "Salutation", type: "select", options: ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."] }),
        f({ apiName: "firstName", label: "First Name", type: "text", required: true, isSystem: true }),
        f({ apiName: "lastName", label: "Last Name", type: "text", required: true, isSystem: true }),
        f({ apiName: "title", label: "Job Title", type: "text" }),
        f({ apiName: "email", label: "Email", type: "email", required: true, unique: true, isSystem: true }),
        f({ apiName: "phone", label: "Phone", type: "phone" }),
        f({ apiName: "mobile", label: "Mobile", type: "phone" }),
        f({ apiName: "accountId", label: "Account", type: "lookup", lookupObject: "account", isSystem: true }),
      ],
    },
    {
      id: "sec-c-address", title: "Address",
      collapsible: true,
      fields: [
        f({ apiName: "street", label: "Street", type: "textarea", colSpan: 2, width: "full" }),
        f({ apiName: "city", label: "City", type: "text" }),
        f({ apiName: "state", label: "State / Province", type: "text" }),
        f({ apiName: "country", label: "Country", type: "text", defaultValue: "India" }),
        f({ apiName: "postalCode", label: "Postal Code", type: "text" }),
      ],
    },
    {
      id: "sec-c-segmentation", title: "Segmentation & Ownership",
      collapsible: true,
      fields: [
        f({ apiName: "department", label: "Department", type: "text" }),
        f({ apiName: "leadSource", label: "Contact Source", type: "select", options: ["Web", "Referral", "Event", "Cold Call", "Partner", "Import"] }),
        f({ apiName: "branchId", label: "Branch", type: "branch", isSystem: true }),
        f({ apiName: "ownerId", label: "Owner", type: "user", isSystem: true }),
        f({ apiName: "doNotCall", label: "Do Not Call", type: "checkbox" }),
        f({ apiName: "emailOptOut", label: "Email Opt-Out", type: "checkbox" }),
        f({ apiName: "description", label: "Description", type: "textarea", colSpan: 2, width: "full" }),
      ],
    },
  ],
};

// ─── Default Lead form (Salesforce-like) ─────────────────────
export const defaultLeadSchema: FormSchema = {
  object: "lead",
  version: 1,
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "sec-l-info", title: "Lead Information",
      fields: [
        f({ apiName: "salutation", label: "Salutation", type: "select", options: ["Mr.", "Ms.", "Mrs.", "Dr."] }),
        f({ apiName: "firstName", label: "First Name", type: "text", required: true, isSystem: true }),
        f({ apiName: "lastName", label: "Last Name", type: "text", required: true, isSystem: true }),
        f({ apiName: "company", label: "Company", type: "text", required: true, isSystem: true }),
        f({ apiName: "title", label: "Title", type: "text" }),
        f({ apiName: "email", label: "Email", type: "email", required: true, isSystem: true }),
        f({ apiName: "phone", label: "Phone", type: "phone" }),
        f({ apiName: "website", label: "Website", type: "url" }),
      ],
    },
    {
      id: "sec-l-qual", title: "Qualification",
      fields: [
        f({ apiName: "status", label: "Lead Status", type: "select", required: true, isSystem: true, options: ["New", "Contacted", "Qualified", "Unqualified", "Converted"] }),
        f({ apiName: "rating", label: "Rating", type: "select", options: ["Hot", "Warm", "Cold"] }),
        f({ apiName: "leadSource", label: "Lead Source", type: "select", isSystem: true, options: ["Web Form", "WhatsApp", "SMS", "AI Call", "Meta Ads", "Google Ads", "IndiaMART", "Referral", "Import"] }),
        f({ apiName: "industry", label: "Industry", type: "select", options: ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Real Estate"] }),
        f({ apiName: "annualRevenue", label: "Annual Revenue", type: "currency" }),
        f({ apiName: "numberOfEmployees", label: "No. of Employees", type: "number" }),
        f({ apiName: "budget", label: "Budget", type: "currency" }),
        f({ apiName: "timeline", label: "Purchase Timeline", type: "select", options: ["Immediate", "This Quarter", "Next Quarter", "6+ Months"] }),
      ],
    },
    {
      id: "sec-l-address", title: "Address",
      collapsible: true,
      fields: [
        f({ apiName: "city", label: "City", type: "text" }),
        f({ apiName: "state", label: "State / Province", type: "text" }),
        f({ apiName: "country", label: "Country", type: "text", defaultValue: "India" }),
        f({ apiName: "postalCode", label: "Postal Code", type: "text" }),
      ],
    },
    {
      id: "sec-l-ownership", title: "Assignment",
      collapsible: true,
      fields: [
        f({ apiName: "branchId", label: "Branch", type: "branch", required: true, isSystem: true }),
        f({ apiName: "ownerId", label: "Owner", type: "user", isSystem: true }),
        f({ apiName: "autoAssign", label: "Auto-assign via branch rules", type: "checkbox", defaultValue: "true" }),
        f({ apiName: "description", label: "Description", type: "textarea", colSpan: 2, width: "full" }),
      ],
    },
  ],
};

export function getDefaultSchema(object: FormSchema["object"]): FormSchema {
  if (object === "lead") return structuredClone(defaultLeadSchema);
  if (object === "contact") return structuredClone(defaultContactSchema);
  return structuredClone(defaultContactSchema);
}

export function allFields(schema: FormSchema): FormField[] {
  return schema.sections.flatMap((s) => s.fields);
}

/** Validate a record against a schema; returns map of apiName -> error. */
export function validateAgainstSchema(schema: FormSchema, values: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of allFields(schema)) {
    if (field.hidden) continue;
    const v = values[field.apiName];
    if (field.required && (v === undefined || v === null || String(v).trim() === "")) {
      errors[field.apiName] = `${field.label} is required`;
      continue;
    }
    if (v && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) {
      errors[field.apiName] = "Invalid email";
    }
    if (v && field.type === "url" && !/^https?:\/\//.test(String(v))) {
      errors[field.apiName] = "URL must start with http(s)://";
    }
  }
  return errors;
}
