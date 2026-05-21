import React, { useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import {
  adToBs, bsToAd, formatMiti, NEPALI_MONTHS, isNepaliLocale, type BsDate,
} from "../../lib/nepaliDate";

// ============================================================
// MitiDateField — dual AD/BS date input.
// When `nepali` (or locale country = Nepal) is true, the picker
// edits in Bikram Sambat and stores an ISO (AD) value.
// ============================================================

interface MitiDateFieldProps {
  label?: string;
  value: string;                 // ISO date string (AD)
  onChange: (iso: string) => void;
  nepali?: boolean;
  country?: string;
  required?: boolean;
  numerals?: "latin" | "devanagari";
}

export function MitiDateField({
  label, value, onChange, nepali, country, required, numerals = "latin",
}: MitiDateFieldProps) {
  const useBs = nepali ?? isNepaliLocale(country);
  const bs = useMemo<BsDate | null>(() => (value ? adToBs(value) : null), [value]);
  const [open, setOpen] = useState(false);

  const setBsPart = (part: Partial<BsDate>) => {
    const base = bs ?? adToBs(new Date());
    const next = { ...base, ...part };
    onChange(bsToAd(next).toISOString());
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#212121] mb-1.5">
          {label} {required && <span className="text-[#C62828]">*</span>}
        </label>
      )}

      {!useBs ? (
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" size={16} />
          <input
            type="date"
            value={value ? value.slice(0, 10) : ""}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
            className="w-full h-11 pl-10 pr-3 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/20"
          />
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm text-left flex items-center justify-between hover:border-[#1565C0] transition-colors"
          >
            <span className={value ? "text-[#212121]" : "text-[#9E9E9E]"}>
              {value ? formatMiti(value, { numerals }) : "Select Miti (BS)"}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#FFF3E0] text-[#E65100] font-semibold">BS</span>
              <Calendar size={16} className="text-[#9E9E9E]" />
            </span>
          </button>

          {open && (
            <div className="mt-2 p-3 border border-[#E0E0E0] rounded-lg bg-white shadow-sm grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] uppercase text-[#9E9E9E] font-semibold">Year</span>
                <input
                  type="number"
                  value={bs?.year ?? ""}
                  onChange={(e) => setBsPart({ year: Number(e.target.value) })}
                  className="w-full h-9 px-2 border border-[#E0E0E0] rounded text-sm outline-none focus:border-[#1565C0]"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E9E9E] font-semibold">Month</span>
                <select
                  value={bs?.month ?? 1}
                  onChange={(e) => setBsPart({ month: Number(e.target.value) })}
                  className="w-full h-9 px-2 border border-[#E0E0E0] rounded text-sm outline-none focus:border-[#1565C0]"
                >
                  {NEPALI_MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E9E9E] font-semibold">Day</span>
                <input
                  type="number" min={1} max={32}
                  value={bs?.day ?? ""}
                  onChange={(e) => setBsPart({ day: Number(e.target.value) })}
                  className="w-full h-9 px-2 border border-[#E0E0E0] rounded text-sm outline-none focus:border-[#1565C0]"
                />
              </div>
              <div className="col-span-3 flex items-center justify-between pt-1 border-t border-[#F0F0F0]">
                <span className="text-xs text-[#616161]">
                  AD: {value ? new Date(value).toLocaleDateString("en-GB") : "—"}
                </span>
                <button type="button" onClick={() => setOpen(false)} className="text-xs font-semibold text-[#1565C0]">Done</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Inline label showing both AD and Miti — used in tables/detail views. */
export function DualDateLabel({ iso, country, nepali, numerals = "latin" }: { iso: string; country?: string; nepali?: boolean; numerals?: "latin" | "devanagari" }) {
  const useBs = nepali ?? isNepaliLocale(country);
  if (!iso) return <span className="text-[#9E9E9E]">—</span>;
  const ad = new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  if (!useBs) return <span>{ad}</span>;
  return (
    <span className="inline-flex flex-col leading-tight">
      <span className="text-[#212121]">{formatMiti(iso, { numerals })}</span>
      <span className="text-[11px] text-[#9E9E9E]">{ad}</span>
    </span>
  );
}
