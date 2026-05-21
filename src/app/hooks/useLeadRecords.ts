import { useState, useCallback, useEffect } from "react";

// ============================================================
// useLeadRecords — generic CRUD store for Lead records created
// via the configurable Create Lead form. Persists to
// localStorage (swap for an API later). Separate from the
// WhatsApp-centric useLeads() so both can coexist.
// ============================================================

export interface LeadRecord {
  id: string;
  values: Record<string, unknown>; // keyed by form-schema apiName
  createdAt: string;
  updatedAt: string;
}

const LS_KEY = "leadchain.leadRecords.v1";

function seed(): LeadRecord[] {
  return [
    {
      id: "LD-1001",
      values: {
        salutation: "Mr.", firstName: "Rajesh", lastName: "Kumar", company: "Tech Innovations Pvt Ltd",
        title: "CTO", email: "rajesh@techinnov.in", phone: "+91 98765 43210", status: "New",
        rating: "Hot", leadSource: "Web Form", industry: "Technology", annualRevenue: "25000000",
        city: "Bengaluru", state: "Karnataka", country: "India", ownerId: "u-8",
      },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "LD-1002",
      values: {
        salutation: "Ms.", firstName: "Priya", lastName: "Sharma", company: "Digital Solutions Inc",
        title: "Head of Ops", email: "priya@digisol.in", phone: "+91 98765 43211", status: "Contacted",
        rating: "Warm", leadSource: "WhatsApp", industry: "Finance",
        city: "Mumbai", state: "Maharashtra", country: "India", ownerId: "u-12",
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

function load(): LeadRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return seed();
}

export function useLeadRecords() {
  const [records, setRecords] = useState<LeadRecord[]>(load);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(records)); } catch { /* ignore */ }
  }, [records]);

  const createLead = useCallback((values: Record<string, unknown>) => {
    const rec: LeadRecord = {
      id: `LD-${Date.now().toString().slice(-6)}`,
      values,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecords((prev) => [rec, ...prev]);
    return rec;
  }, []);

  const updateLead = useCallback((id: string, values: Record<string, unknown>) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, values, updatedAt: new Date().toISOString() } : r)));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getLead = useCallback((id?: string | null) => records.find((r) => r.id === id) || null, [records]);

  return { records, createLead, updateLead, deleteLead, getLead };
}
