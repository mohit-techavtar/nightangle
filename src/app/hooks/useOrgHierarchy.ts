import { useMemo, useState } from "react";

// ============================================================
// OmniCRM — Organisation Hierarchy
// Adds a multi-level reporting structure (reportsTo / managerId)
// on top of the existing multi-branch system, plus branch
// scoping for users. Pure mock state, backend-swap ready.
// ============================================================

export type OrgRole =
  | "Branch Head"
  | "Regional Manager"
  | "Team Lead"
  | "Sales Manager"
  | "Sales Executive"
  | "Support Agent"
  | "Tenant Admin";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  avatar: string;       // initials
  title: OrgRole;
  branchId: string;     // company/branch id from useCompanies
  reportsTo: string | null; // manager userId (multi-level)
  status: "active" | "inactive";
  capacity: number;     // max open leads this user can hold (for distribution)
  openLeads: number;    // current open lead count (for load balancing)
}

// Mirrors the branch ids used in useCompanies (comp-1 .. comp-5)
const seedOrgUsers: OrgUser[] = [
  { id: "u-1", name: "Rajesh Sharma", email: "rajesh@everestdigital.com", avatar: "RS", title: "Tenant Admin", branchId: "comp-1", reportsTo: null, status: "active", capacity: 0, openLeads: 0 },
  { id: "u-2", name: "Priya Iyer", email: "priya@everestdigital.com", avatar: "PI", title: "Branch Head", branchId: "comp-2", reportsTo: "u-1", status: "active", capacity: 0, openLeads: 0 },
  { id: "u-3", name: "Arjun Mehta", email: "arjun@everestdigital.com", avatar: "AM", title: "Branch Head", branchId: "comp-3", reportsTo: "u-1", status: "active", capacity: 0, openLeads: 0 },
  { id: "u-6", name: "Kavya Nair", email: "kavya@everestdigital.com", avatar: "KN", title: "Sales Manager", branchId: "comp-2", reportsTo: "u-2", status: "active", capacity: 0, openLeads: 0 },
  { id: "u-7", name: "Rohit Verma", email: "rohit@everestdigital.com", avatar: "RV", title: "Team Lead", branchId: "comp-2", reportsTo: "u-6", status: "active", capacity: 0, openLeads: 0 },
  { id: "u-8", name: "Sneha Kumar", email: "sneha@everestdigital.com", avatar: "SK", title: "Sales Executive", branchId: "comp-2", reportsTo: "u-7", status: "active", capacity: 60, openLeads: 23 },
  { id: "u-9", name: "Aditya Rao", email: "aditya@everestdigital.com", avatar: "AR", title: "Sales Executive", branchId: "comp-2", reportsTo: "u-7", status: "active", capacity: 60, openLeads: 41 },
  { id: "u-10", name: "Meera Joshi", email: "meera@everestdigital.com", avatar: "MJ", title: "Sales Executive", branchId: "comp-2", reportsTo: "u-7", status: "active", capacity: 50, openLeads: 12 },
  { id: "u-11", name: "Suresh Patel", email: "suresh@everestdigital.com", avatar: "SP", title: "Sales Manager", branchId: "comp-3", reportsTo: "u-3", status: "active", capacity: 0, openLeads: 0 },
  { id: "u-12", name: "Anjali Singh", email: "anjali@everestdigital.com", avatar: "AS", title: "Sales Executive", branchId: "comp-3", reportsTo: "u-11", status: "active", capacity: 55, openLeads: 30 },
  { id: "u-13", name: "Bikash Thapa", email: "bikash@everestdigital.com", avatar: "BT", title: "Branch Head", branchId: "comp-1", reportsTo: "u-1", status: "active", capacity: 0, openLeads: 0 },
  { id: "u-14", name: "Sita Gurung", email: "sita@everestdigital.com", avatar: "SG", title: "Sales Executive", branchId: "comp-1", reportsTo: "u-13", status: "active", capacity: 50, openLeads: 18 },
];

export interface OrgNode {
  user: OrgUser;
  children: OrgNode[];
  depth: number;
}

export function useOrgHierarchy() {
  const [users, setUsers] = useState<OrgUser[]>(seedOrgUsers);

  const addUser = (u: Omit<OrgUser, "id">) =>
    setUsers((prev) => [...prev, { ...u, id: `u-${Date.now()}` }]);

  const updateUser = (id: string, patch: Partial<OrgUser>) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  /** Build the reporting tree for a branch (or whole org if branchId omitted). */
  const buildTree = (branchId?: string): OrgNode[] => {
    const scope = branchId ? users.filter((u) => u.branchId === branchId) : users;
    const byManager = (managerId: string | null, depth: number): OrgNode[] =>
      scope
        .filter((u) => u.reportsTo === managerId)
        .map((u) => ({ user: u, depth, children: byManager(u.id, depth + 1) }));
    // roots = users whose manager is outside the scope (or null)
    const scopeIds = new Set(scope.map((u) => u.id));
    const roots = scope.filter((u) => !u.reportsTo || !scopeIds.has(u.reportsTo));
    return roots.map((u) => ({ user: u, depth: 0, children: byManager(u.id, 1) }));
  };

  /** All descendant userIds reporting (directly or transitively) to a manager. */
  const getDescendants = (managerId: string): string[] => {
    const out: string[] = [];
    const walk = (id: string) => {
      users.filter((u) => u.reportsTo === id).forEach((u) => { out.push(u.id); walk(u.id); });
    };
    walk(managerId);
    return out;
  };

  /** Management chain upward (manager, manager's manager, ...). */
  const getManagerChain = (userId: string): OrgUser[] => {
    const chain: OrgUser[] = [];
    let cur = users.find((u) => u.id === userId);
    while (cur?.reportsTo) {
      const mgr = users.find((u) => u.id === cur!.reportsTo);
      if (!mgr) break;
      chain.push(mgr);
      cur = mgr;
    }
    return chain;
  };

  const usersByBranch = (branchId: string) => users.filter((u) => u.branchId === branchId);

  /** A manager's "team" = themselves + everyone beneath them. Used for data-visibility scoping. */
  const getTeam = (managerId: string) => {
    const ids = new Set([managerId, ...getDescendants(managerId)]);
    return users.filter((u) => ids.has(u.id));
  };

  const getUser = (id: string) => users.find((u) => u.id === id) || null;

  const managers = useMemo(
    () => users.filter((u) => users.some((c) => c.reportsTo === u.id)),
    [users]
  );

  return {
    users,
    managers,
    addUser,
    updateUser,
    getUser,
    buildTree,
    getDescendants,
    getManagerChain,
    getTeam,
    usersByBranch,
  };
}
