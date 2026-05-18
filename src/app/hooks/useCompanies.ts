import { useState } from "react";

export type CompanyType = "headquarters" | "branch" | "subsidiary" | "franchise";
export type CompanyStatus = "active" | "inactive" | "pending";

export interface Company {
  id: string;
  name: string;
  code: string;
  type: CompanyType;
  status: CompanyStatus;
  parentId?: string; // null for HQ; otherwise points to parent company
  legalName?: string;
  taxId?: string;
  registrationNumber?: string;
  industry?: string;
  size?: "small" | "medium" | "large" | "enterprise";
  // Address
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  // Contact
  email?: string;
  phone?: string;
  website?: string;
  // Localization
  currency: string;
  timezone: string;
  language: string;
  // Operational
  managerId?: string;
  managerName?: string;
  employeeCount?: number;
  // Tracking
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface BranchHierarchy {
  company: Company;
  children: BranchHierarchy[];
  depth: number;
}

const mockCompanies: Company[] = [
  {
    id: "comp-1", name: "Everest Digital Solutions", code: "EDS-HQ",
    type: "headquarters", status: "active",
    legalName: "Everest Digital Solutions Pvt. Ltd.",
    taxId: "AABCE1234F", registrationNumber: "U72200KA2018PTC112233",
    industry: "Technology", size: "medium",
    address: { line1: "Durbar Marg, Ward 10", city: "Kathmandu", country: "Nepal", postalCode: "44600" },
    email: "hq@everestdigital.com", phone: "+977-1-4001234", website: "https://everestdigital.com",
    currency: "NPR", timezone: "Asia/Kathmandu", language: "en",
    managerId: "u-1", managerName: "Rajesh Sharma", employeeCount: 145,
    createdAt: "2024-01-15T00:00:00Z", updatedAt: "2025-12-01T00:00:00Z", createdBy: "system",
  },
  {
    id: "comp-2", name: "Bangalore Branch", code: "EDS-BLR",
    type: "branch", status: "active", parentId: "comp-1",
    legalName: "Everest Digital Solutions Pvt. Ltd. (India)",
    industry: "Technology", size: "medium",
    address: { line1: "Whitefield", city: "Bangalore", state: "Karnataka", country: "India", postalCode: "560066" },
    email: "bangalore@everestdigital.com", phone: "+91-80-12345678",
    currency: "INR", timezone: "Asia/Kolkata", language: "en",
    managerId: "u-2", managerName: "Priya Iyer", employeeCount: 62,
    createdAt: "2024-06-20T00:00:00Z", updatedAt: "2025-11-15T00:00:00Z", createdBy: "system",
  },
  {
    id: "comp-3", name: "Mumbai Branch", code: "EDS-BOM",
    type: "branch", status: "active", parentId: "comp-1",
    industry: "Technology", size: "small",
    address: { line1: "Bandra Kurla Complex", city: "Mumbai", state: "Maharashtra", country: "India", postalCode: "400051" },
    email: "mumbai@everestdigital.com", phone: "+91-22-23456789",
    currency: "INR", timezone: "Asia/Kolkata", language: "en",
    managerId: "u-3", managerName: "Arjun Mehta", employeeCount: 28,
    createdAt: "2025-02-10T00:00:00Z", updatedAt: "2025-12-05T00:00:00Z", createdBy: "system",
  },
  {
    id: "comp-4", name: "Hoskote Office", code: "EDS-BLR-HSK",
    type: "branch", status: "active", parentId: "comp-2",
    address: { line1: "Industrial Area", city: "Hoskote", state: "Karnataka", country: "India", postalCode: "562114" },
    email: "hoskote@everestdigital.com", phone: "+91-80-22334455",
    currency: "INR", timezone: "Asia/Kolkata", language: "en",
    managerId: "u-4", managerName: "Sneha Kumar", employeeCount: 18,
    createdAt: "2025-08-12T00:00:00Z", updatedAt: "2025-11-20T00:00:00Z", createdBy: "system",
  },
  {
    id: "comp-5", name: "Dubai Subsidiary", code: "EDS-DXB",
    type: "subsidiary", status: "active", parentId: "comp-1",
    legalName: "Everest Digital FZE",
    industry: "Technology", size: "small",
    address: { line1: "Dubai Internet City", city: "Dubai", country: "UAE", postalCode: "500001" },
    email: "dubai@everestdigital.com", phone: "+971-4-1234567",
    currency: "AED", timezone: "Asia/Dubai", language: "en",
    managerId: "u-5", managerName: "Ahmad Al-Rashid", employeeCount: 12,
    createdAt: "2025-03-15T00:00:00Z", updatedAt: "2025-10-25T00:00:00Z", createdBy: "system",
  },
];

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [activeCompanyId, setActiveCompanyId] = useState<string>(mockCompanies[0].id);

  const createCompany = (company: Omit<Company, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    const newCompany: Company = {
      ...company,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current-user",
    };
    setCompanies(prev => [...prev, newCompany]);
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const deleteCompany = (id: string) => {
    // Cascade: also delete branches that reference this as parent
    const toDelete = new Set([id]);
    const findChildren = (parentId: string) => {
      companies.forEach(c => {
        if (c.parentId === parentId) {
          toDelete.add(c.id);
          findChildren(c.id);
        }
      });
    };
    findChildren(id);
    setCompanies(prev => prev.filter(c => !toDelete.has(c.id)));
  };

  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  const getChildren = (parentId: string) => companies.filter(c => c.parentId === parentId);

  const getHierarchy = (): BranchHierarchy[] => {
    const buildTree = (parentId: string | undefined, depth: number): BranchHierarchy[] =>
      companies
        .filter(c => c.parentId === parentId)
        .map(c => ({ company: c, depth, children: buildTree(c.id, depth + 1) }));
    return buildTree(undefined, 0);
  };

  const getAncestors = (id: string): Company[] => {
    const result: Company[] = [];
    let current = companies.find(c => c.id === id);
    while (current?.parentId) {
      const parent = companies.find(c => c.id === current!.parentId);
      if (!parent) break;
      result.unshift(parent);
      current = parent;
    }
    return result;
  };

  const getActiveCompany = () => companies.find(c => c.id === activeCompanyId) || companies[0];

  // Stats
  const stats = {
    total: companies.length,
    active: companies.filter(c => c.status === "active").length,
    headquarters: companies.filter(c => c.type === "headquarters").length,
    branches: companies.filter(c => c.type === "branch").length,
    subsidiaries: companies.filter(c => c.type === "subsidiary").length,
    totalEmployees: companies.reduce((sum, c) => sum + (c.employeeCount || 0), 0),
  };

  return {
    companies,
    activeCompanyId,
    setActiveCompanyId,
    getActiveCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    getChildren,
    getHierarchy,
    getAncestors,
    stats,
  };
}
