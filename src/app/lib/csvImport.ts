// ============================================================
// OmniCRM — Delimited Import Parser (CSV / Excel-paste / TSV)
// Pure, dependency-free parser used by the Contacts import
// wizard. Handles quoted fields, embedded commas/newlines, and
// auto-maps columns to schema fields via fuzzy header matching.
// ============================================================

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

/** Robust CSV parser supporting quotes, escaped quotes, CRLF, and TSV (auto-detect delimiter). */
export function parseDelimited(text: string): ParsedTable {
  const sample = text.slice(0, 2000);
  const commas = (sample.match(/,/g) || []).length;
  const tabs = (sample.match(/\t/g) || []).length;
  const delim = tabs > commas ? "\t" : ",";

  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === delim) { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (ch === "\r") { /* skip */ }
      else field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }

  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ""));
  const headers = (nonEmpty.shift() || []).map((h) => h.trim());
  return { headers, rows: nonEmpty };
}

/** Normalise a header for fuzzy matching. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const SYNONYMS: Record<string, string[]> = {
  firstName: ["firstname", "fname", "givenname", "first"],
  lastName: ["lastname", "lname", "surname", "familyname", "last"],
  email: ["email", "emailaddress", "mail", "workemail"],
  phone: ["phone", "phonenumber", "telephone", "tel", "contactnumber"],
  mobile: ["mobile", "mobilenumber", "cell", "cellphone"],
  title: ["title", "jobtitle", "designation", "role"],
  accountId: ["account", "company", "organisation", "organization", "accountname"],
  city: ["city", "town"],
  state: ["state", "province", "region"],
  country: ["country"],
  postalCode: ["postalcode", "zip", "zipcode", "pincode", "pin"],
  leadSource: ["source", "leadsource", "contactsource", "channel"],
  department: ["department", "dept"],
  street: ["street", "address", "addressline1", "addr"],
};

export interface ColumnMapping {
  header: string;
  targetField: string | null; // apiName or null = ignore
  confidence: "exact" | "fuzzy" | "none";
}

/** Auto-map import headers to known schema field apiNames. */
export function autoMapColumns(headers: string[], fieldApiNames: string[]): ColumnMapping[] {
  return headers.map((header) => {
    const h = norm(header);
    // exact apiName match
    const exact = fieldApiNames.find((fn) => norm(fn) === h);
    if (exact) return { header, targetField: exact, confidence: "exact" };
    // synonym match
    for (const [field, syns] of Object.entries(SYNONYMS)) {
      if (fieldApiNames.includes(field) && syns.includes(h)) {
        return { header, targetField: field, confidence: "fuzzy" };
      }
    }
    // contains match
    const partial = fieldApiNames.find((fn) => norm(fn).includes(h) || h.includes(norm(fn)));
    if (partial && h.length > 2) return { header, targetField: partial, confidence: "fuzzy" };
    return { header, targetField: null, confidence: "none" };
  });
}

/** Apply mapping to produce record objects keyed by target apiName. */
export function mapRowsToRecords(
  table: ParsedTable,
  mapping: ColumnMapping[]
): Record<string, string>[] {
  return table.rows.map((row) => {
    const rec: Record<string, string> = {};
    mapping.forEach((m, idx) => {
      if (m.targetField) rec[m.targetField] = (row[idx] ?? "").trim();
    });
    return rec;
  });
}

export interface ImportValidationIssue {
  rowIndex: number;
  field: string;
  message: string;
}

/** Lightweight validation + duplicate detection (by email). */
export function validateImport(
  records: Record<string, string>[],
  opts: { requiredFields: string[]; existingEmails?: Set<string> }
): { issues: ImportValidationIssue[]; duplicates: number } {
  const issues: ImportValidationIssue[] = [];
  const seen = new Set<string>();
  let duplicates = 0;

  records.forEach((rec, i) => {
    for (const rf of opts.requiredFields) {
      if (!rec[rf] || rec[rf].trim() === "") {
        issues.push({ rowIndex: i, field: rf, message: `Missing ${rf}` });
      }
    }
    if (rec.email) {
      const e = rec.email.toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
        issues.push({ rowIndex: i, field: "email", message: "Invalid email format" });
      }
      if (seen.has(e) || opts.existingEmails?.has(e)) duplicates++;
      seen.add(e);
    }
  });
  return { issues, duplicates };
}

export const SAMPLE_CONTACT_CSV =
  `First Name,Last Name,Email,Phone,Company,Job Title,City,State,Source
Aarav,Shrestha,aarav@himaltech.com,+97798010001,Himal Tech,CTO,Kathmandu,Bagmati,Referral
Sara,Khan,sara.khan@novacorp.in,+919812000111,Nova Corp,VP Sales,Mumbai,Maharashtra,Web
Diego,Lopez,diego@brightlabs.io,+14155550133,Bright Labs,Founder,Austin,Texas,Event`;
