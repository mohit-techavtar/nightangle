import React, { useMemo, useState } from "react";
import {
  Upload, FileSpreadsheet, ChevronRight, ChevronLeft, Check, AlertTriangle,
  X, Download, ArrowRight, Copy,
} from "lucide-react";
import {
  parseDelimited, autoMapColumns, mapRowsToRecords, validateImport,
  SAMPLE_CONTACT_CSV, type ParsedTable, type ColumnMapping,
} from "../../lib/csvImport";

// ============================================================
// ContactImportWizard — 4-step CSV/Excel import:
// Upload → Map columns → Validate/Preview → Confirm.
// ============================================================

interface Props {
  fieldOptions: { apiName: string; label: string }[];
  existingEmails: Set<string>;
  onImport: (records: Record<string, string>[]) => void;
  onClose: () => void;
}

export function ContactImportWizard({ fieldOptions, existingEmails, onImport, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [rawText, setRawText] = useState("");
  const [table, setTable] = useState<ParsedTable | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping[]>([]);

  const fieldApiNames = fieldOptions.map((f) => f.apiName);

  const parseAndAdvance = (text: string) => {
    const parsed = parseDelimited(text);
    setTable(parsed);
    setMapping(autoMapColumns(parsed.headers, fieldApiNames));
    setStep(2);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { const txt = String(e.target?.result || ""); setRawText(txt); parseAndAdvance(txt); };
    reader.readAsText(file);
  };

  const records = useMemo(() => (table ? mapRowsToRecords(table, mapping) : []), [table, mapping]);
  const requiredFields = fieldOptions.filter((f) => ["firstName", "lastName", "email"].includes(f.apiName)).map((f) => f.apiName);
  const validation = useMemo(
    () => validateImport(records, { requiredFields, existingEmails }),
    [records]
  );

  const steps = ["Upload", "Map Columns", "Review", "Done"];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header + stepper */}
        <div className="px-6 py-4 border-b border-[#E0E0E0]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#212121] flex items-center gap-2"><FileSpreadsheet size={20} className="text-[#2E7D32]" /> Import Contacts</h2>
            <button onClick={onClose} className="p-1.5 text-[#9E9E9E] hover:text-[#212121]"><X size={20} /></button>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= i + 1 ? "text-[#1565C0]" : "text-[#BDBDBD]"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step > i + 1 ? "bg-[#2E7D32] text-white" : step === i + 1 ? "bg-[#1565C0] text-white" : "bg-[#EEEEEE] text-[#9E9E9E]"}`}>
                    {step > i + 1 ? <Check size={12} /> : i + 1}
                  </span>
                  {s}
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-[#E0E0E0]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {step === 1 && (
            <div>
              <label className="block border-2 border-dashed border-[#BDBDBD] rounded-xl p-8 text-center cursor-pointer hover:border-[#1565C0] hover:bg-[#F3F8FF] transition-colors">
                <Upload size={32} className="mx-auto text-[#9E9E9E] mb-2" />
                <p className="text-sm font-medium text-[#212121]">Click to upload a CSV or Excel-exported file</p>
                <p className="text-xs text-[#9E9E9E] mt-1">.csv, .tsv, or tab-separated text</p>
                <input type="file" accept=".csv,.tsv,.txt,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
              <div className="text-center my-3 text-xs text-[#9E9E9E]">— or paste from Excel / Google Sheets —</div>
              <textarea rows={5} value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste rows here (first row = headers)…"
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm font-mono outline-none focus:border-[#1565C0]" />
              <div className="flex items-center justify-between mt-3">
                <button onClick={() => { setRawText(SAMPLE_CONTACT_CSV); }} className="text-sm text-[#1565C0] font-medium flex items-center gap-1.5 hover:underline">
                  <Copy size={14} /> Use sample data
                </button>
                <button onClick={() => parseAndAdvance(rawText)} disabled={!rawText.trim()}
                  className={`px-5 h-10 rounded-lg text-white text-sm font-semibold flex items-center gap-1.5 ${rawText.trim() ? "bg-[#1565C0] hover:bg-[#0D47A1]" : "bg-[#BDBDBD] cursor-not-allowed"}`}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && table && (
            <div>
              <p className="text-sm text-[#616161] mb-3">We auto-matched <span className="font-medium text-[#212121]">{mapping.filter((m) => m.targetField).length}</span> of {mapping.length} columns. Adjust any mapping below.</p>
              <div className="space-y-2">
                {mapping.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#212121] truncate">{m.header}</div>
                      <div className="text-xs text-[#9E9E9E] truncate">e.g. {table.rows[0]?.[idx] || "—"}</div>
                    </div>
                    <ArrowRight size={16} className="text-[#BDBDBD] shrink-0" />
                    <select value={m.targetField ?? ""} onChange={(e) => setMapping((p) => p.map((x, i) => i === idx ? { ...x, targetField: e.target.value || null } : x))}
                      className="w-44 h-9 px-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0]">
                      <option value="">— Ignore —</option>
                      {fieldOptions.map((f) => <option key={f.apiName} value={f.apiName}>{f.label}</option>)}
                    </select>
                    {m.confidence === "exact" && <Check size={16} className="text-[#2E7D32] shrink-0" />}
                    {m.confidence === "fuzzy" && <span className="text-[10px] text-[#F57F17] shrink-0">auto</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#E8F5E9] rounded-xl p-3"><div className="text-2xl font-semibold text-[#2E7D32]">{records.length}</div><div className="text-xs text-[#616161]">Rows ready</div></div>
                <div className="bg-[#FFF3E0] rounded-xl p-3"><div className="text-2xl font-semibold text-[#E65100]">{validation.duplicates}</div><div className="text-xs text-[#616161]">Potential duplicates</div></div>
                <div className="bg-[#FFEBEE] rounded-xl p-3"><div className="text-2xl font-semibold text-[#C62828]">{validation.issues.length}</div><div className="text-xs text-[#616161]">Validation issues</div></div>
              </div>
              {validation.issues.length > 0 && (
                <div className="mb-4 border border-[#FFCDD2] rounded-lg p-3 bg-[#FFF5F5] max-h-32 overflow-auto">
                  {validation.issues.slice(0, 8).map((iss, i) => (
                    <div key={i} className="text-xs text-[#C62828] flex items-center gap-1.5"><AlertTriangle size={12} /> Row {iss.rowIndex + 1}: {iss.message}</div>
                  ))}
                  {validation.issues.length > 8 && <div className="text-xs text-[#9E9E9E] mt-1">+{validation.issues.length - 8} more…</div>}
                </div>
              )}
              <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA] sticky top-0">
                      <tr>{mapping.filter((m) => m.targetField).map((m) => <th key={m.header} className="text-left px-3 py-2 font-medium text-[#616161] whitespace-nowrap">{fieldOptions.find((f) => f.apiName === m.targetField)?.label}</th>)}</tr>
                    </thead>
                    <tbody>
                      {records.slice(0, 20).map((r, i) => (
                        <tr key={i} className="border-t border-[#F0F0F0]">
                          {mapping.filter((m) => m.targetField).map((m) => <td key={m.targetField} className="px-3 py-2 text-[#212121] whitespace-nowrap">{r[m.targetField!] || "—"}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-[#2E7D32]" /></div>
              <h3 className="text-lg font-semibold text-[#212121]">{records.length} contacts imported</h3>
              <p className="text-sm text-[#616161] mt-1">Branch distribution rules will assign owners automatically.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 4 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E0E0E0]">
            <button onClick={() => (step > 1 ? setStep(step - 1) : onClose())} className="px-4 h-10 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-1.5">
              <ChevronLeft size={16} /> {step === 1 ? "Cancel" : "Back"}
            </button>
            {step === 2 && <button onClick={() => setStep(3)} className="px-5 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold flex items-center gap-1.5">Review <ChevronRight size={16} /></button>}
            {step === 3 && (
              <button onClick={() => { onImport(records); setStep(4); }} className="px-5 h-10 rounded-lg bg-[#2E7D32] text-white text-sm font-semibold flex items-center gap-1.5">
                <Download size={16} /> Import {records.length} Contacts
              </button>
            )}
          </div>
        )}
        {step === 4 && (
          <div className="flex items-center justify-end px-6 py-4 border-t border-[#E0E0E0]">
            <button onClick={onClose} className="px-6 h-10 rounded-lg bg-[#1565C0] text-white text-sm font-semibold">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
