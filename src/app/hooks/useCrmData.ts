import { useState, useCallback } from "react";

// ============================================================
// OmniCRM — Contacts & Accounts data layer
// Accounts are the company/organisation records that group many
// Contacts and are associated with Deals (Salesforce model).
// ============================================================

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  salutation?: string;
  email: string;
  phone?: string;
  mobile?: string;
  title?: string;
  accountId?: string | null;
  department?: string;
  leadSource?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  branchId?: string;
  ownerId?: string;
  doNotCall?: boolean;
  emailOptOut?: boolean;
  description?: string;
  tags?: string[];
  status?: "Active" | "Inactive" | "Lead";
  isPrimary?: boolean;     // primary contact on its account
  createdAt: string;
  updatedAt: string;
  custom?: Record<string, unknown>;
}

export type AccountType = "Customer" | "Prospect" | "Partner" | "Vendor" | "Competitor";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  industry?: string;
  website?: string;
  phone?: string;
  annualRevenue?: number;
  employeeCount?: number;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  branchId?: string;
  ownerId?: string;
  parentAccountId?: string | null; // account hierarchy
  rating?: "Hot" | "Warm" | "Cold";
  description?: string;
  relatedDealIds: string[];
  createdAt: string;
  updatedAt: string;
}

const now = () => new Date().toISOString();

const seedAccounts: Account[] = [
  { id: "acc-1", name: "Himal Tech Pvt. Ltd.", type: "Customer", industry: "Technology", website: "https://himaltech.com", phone: "+977-1-4002211", annualRevenue: 45000000, employeeCount: 120, billingCity: "Kathmandu", billingState: "Bagmati", billingCountry: "Nepal", branchId: "comp-1", ownerId: "u-14", rating: "Hot", relatedDealIds: ["deal-1"], parentAccountId: null, createdAt: now(), updatedAt: now() },
  { id: "acc-2", name: "Nova Corp", type: "Customer", industry: "Finance", website: "https://novacorp.in", phone: "+91-22-23456789", annualRevenue: 180000000, employeeCount: 540, billingCity: "Mumbai", billingState: "Maharashtra", billingCountry: "India", branchId: "comp-3", ownerId: "u-12", rating: "Warm", relatedDealIds: ["deal-2", "deal-3"], parentAccountId: null, createdAt: now(), updatedAt: now() },
  { id: "acc-3", name: "Bright Labs", type: "Prospect", industry: "Technology", website: "https://brightlabs.io", phone: "+1-415-555-0133", annualRevenue: 9000000, employeeCount: 35, billingCity: "Austin", billingState: "Texas", billingCountry: "USA", branchId: "comp-2", ownerId: "u-8", rating: "Cold", relatedDealIds: [], parentAccountId: null, createdAt: now(), updatedAt: now() },
  { id: "acc-4", name: "Nova Corp — Bengaluru Unit", type: "Customer", industry: "Finance", website: "https://novacorp.in", phone: "+91-80-40404040", annualRevenue: 60000000, employeeCount: 160, billingCity: "Bengaluru", billingState: "Karnataka", billingCountry: "India", branchId: "comp-2", ownerId: "u-9", rating: "Warm", relatedDealIds: [], parentAccountId: "acc-2", createdAt: now(), updatedAt: now() },
];

const seedContacts: Contact[] = [
  { id: "c-1", firstName: "Aarav", lastName: "Shrestha", salutation: "Mr.", email: "aarav@himaltech.com", phone: "+977-9801-00001", title: "CTO", accountId: "acc-1", city: "Kathmandu", state: "Bagmati", country: "Nepal", branchId: "comp-1", ownerId: "u-14", leadSource: "Referral", status: "Active", isPrimary: true, tags: ["Decision Maker"], createdAt: now(), updatedAt: now() },
  { id: "c-2", firstName: "Sunita", lastName: "Rai", salutation: "Ms.", email: "sunita.rai@himaltech.com", phone: "+977-9801-00002", title: "Procurement Lead", accountId: "acc-1", city: "Kathmandu", state: "Bagmati", country: "Nepal", branchId: "comp-1", ownerId: "u-14", leadSource: "Referral", status: "Active", isPrimary: false, tags: ["Influencer"], createdAt: now(), updatedAt: now() },
  { id: "c-3", firstName: "Sara", lastName: "Khan", salutation: "Ms.", email: "sara.khan@novacorp.in", phone: "+91-98120-00111", title: "VP Sales", accountId: "acc-2", city: "Mumbai", state: "Maharashtra", country: "India", branchId: "comp-3", ownerId: "u-12", leadSource: "Web", status: "Active", isPrimary: true, tags: ["Decision Maker", "Enterprise"], createdAt: now(), updatedAt: now() },
  { id: "c-4", firstName: "Rohan", lastName: "Pillai", email: "rohan.p@novacorp.in", phone: "+91-98765-22222", title: "Finance Director", accountId: "acc-2", city: "Mumbai", state: "Maharashtra", country: "India", branchId: "comp-3", ownerId: "u-12", leadSource: "Event", status: "Active", isPrimary: false, tags: ["Economic Buyer"], createdAt: now(), updatedAt: now() },
  { id: "c-5", firstName: "Diego", lastName: "Lopez", email: "diego@brightlabs.io", phone: "+1-415-555-0133", title: "Founder", accountId: "acc-3", city: "Austin", state: "Texas", country: "USA", branchId: "comp-2", ownerId: "u-8", leadSource: "Event", status: "Lead", isPrimary: true, tags: ["Founder"], createdAt: now(), updatedAt: now() },
  { id: "c-6", firstName: "Meena", lastName: "Iyer", email: "meena.iyer@novacorp.in", phone: "+91-80-40404041", title: "IT Manager", accountId: "acc-4", city: "Bengaluru", state: "Karnataka", country: "India", branchId: "comp-2", ownerId: "u-9", leadSource: "Partner", status: "Active", isPrimary: true, tags: ["Technical Buyer"], createdAt: now(), updatedAt: now() },
];

export function useCrmData() {
  const [contacts, setContacts] = useState<Contact[]>(seedContacts);
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);

  // ─── Contacts ──────────────────────────────────────────────
  const createContact = useCallback((data: Partial<Contact>) => {
    const c: Contact = {
      id: `c-${Date.now()}`, firstName: "", lastName: "", email: "",
      status: "Active", relatedDealIds: [] as any, tags: [],
      createdAt: now(), updatedAt: now(), ...data,
    } as Contact;
    setContacts((prev) => [c, ...prev]);
    return c;
  }, []);

  const bulkCreateContacts = useCallback((rows: Partial<Contact>[]) => {
    const created = rows.map((data, i) => ({
      id: `c-${Date.now()}-${i}`, firstName: "", lastName: "", email: "",
      status: "Active" as const, tags: [], createdAt: now(), updatedAt: now(), ...data,
    })) as Contact[];
    setContacts((prev) => [...created, ...prev]);
    return created;
  }, []);

  const updateContact = useCallback((id: string, patch: Partial<Contact>) =>
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: now() } : c))), []);

  const deleteContact = useCallback((id: string) =>
    setContacts((prev) => prev.filter((c) => c.id !== id)), []);

  const contactsForAccount = useCallback((accountId: string) =>
    contacts.filter((c) => c.accountId === accountId), [contacts]);

  // ─── Accounts ──────────────────────────────────────────────
  const createAccount = useCallback((data: Partial<Account>) => {
    const a: Account = {
      id: `acc-${Date.now()}`, name: "", type: "Prospect",
      relatedDealIds: [], parentAccountId: null, createdAt: now(), updatedAt: now(), ...data,
    } as Account;
    setAccounts((prev) => [a, ...prev]);
    return a;
  }, []);

  const updateAccount = useCallback((id: string, patch: Partial<Account>) =>
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: now() } : a))), []);

  const deleteAccount = useCallback((id: string) =>
    setAccounts((prev) => prev.filter((a) => a.id !== id)), []);

  const getAccount = useCallback((id?: string | null) => accounts.find((a) => a.id === id) || null, [accounts]);

  const linkContactToAccount = useCallback((contactId: string, accountId: string) =>
    setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, accountId, updatedAt: now() } : c))), []);

  const childAccounts = useCallback((accountId: string) =>
    accounts.filter((a) => a.parentAccountId === accountId), [accounts]);

  return {
    contacts, accounts,
    createContact, bulkCreateContacts, updateContact, deleteContact, contactsForAccount,
    createAccount, updateAccount, deleteAccount, getAccount, linkContactToAccount, childAccounts,
  };
}
