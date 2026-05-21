import type { OrgUser } from "../hooks/useOrgHierarchy";

// ============================================================
// OmniCRM — Branch-level Lead & Data Distribution
// Decides which user (within a branch) a newly captured lead /
// record should be assigned to. Three strategies, matching
// common Salesforce "Lead Assignment Rules" behaviour.
// ============================================================

export type DistributionStrategy = "round_robin" | "load_balanced" | "territory" | "manual";

export interface DistributionRule {
  id: string;
  name: string;
  branchId: string;          // branch this rule applies to
  strategy: DistributionStrategy;
  enabled: boolean;
  // territory rule: match incoming record fields to a user pool
  territory?: { field: string; values: string[] };
  fallbackUserId?: string;   // if no eligible assignee
  priority: number;          // lower runs first
}

export const seedDistributionRules: DistributionRule[] = [
  { id: "dr-1", name: "Bangalore — Load Balanced", branchId: "comp-2", strategy: "load_balanced", enabled: true, priority: 1 },
  { id: "dr-2", name: "Mumbai — Round Robin", branchId: "comp-3", strategy: "round_robin", enabled: true, priority: 1 },
  { id: "dr-3", name: "Kathmandu HQ — Territory (Province)", branchId: "comp-1", strategy: "territory", enabled: true, priority: 1, territory: { field: "state", values: ["Bagmati", "Gandaki"] } },
];

export interface DistributionContext {
  branchId: string;
  /** Eligible assignees in the branch (active sales roles). */
  pool: OrgUser[];
  /** Incoming record (lead/contact) used for territory matching. */
  record?: Record<string, unknown>;
  /** Mutable round-robin cursor keyed by branch. */
  rrCursor?: Record<string, number>;
}

export interface DistributionResult {
  assigneeId: string | null;
  reason: string;
  strategy: DistributionStrategy;
}

/** Eligible = active, has capacity headroom, is an individual contributor / manager that can own leads. */
export function eligibleAssignees(pool: OrgUser[]): OrgUser[] {
  return pool.filter(
    (u) =>
      u.status === "active" &&
      (u.capacity === 0 || u.openLeads < u.capacity) &&
      ["Sales Executive", "Sales Manager", "Team Lead", "Support Agent"].includes(u.title)
  );
}

export function distribute(rule: DistributionRule, ctx: DistributionContext): DistributionResult {
  const pool = eligibleAssignees(ctx.pool);
  if (pool.length === 0) {
    return { assigneeId: rule.fallbackUserId ?? null, reason: "No eligible assignee — used fallback", strategy: rule.strategy };
  }

  switch (rule.strategy) {
    case "load_balanced": {
      // Pick the user with the lowest utilisation ratio.
      const sorted = [...pool].sort((a, b) => {
        const ra = a.capacity ? a.openLeads / a.capacity : a.openLeads;
        const rb = b.capacity ? b.openLeads / b.capacity : b.openLeads;
        return ra - rb;
      });
      return { assigneeId: sorted[0].id, reason: `Lowest current load (${sorted[0].openLeads}/${sorted[0].capacity || "∞"})`, strategy: rule.strategy };
    }
    case "round_robin": {
      const cursor = ctx.rrCursor?.[ctx.branchId] ?? 0;
      const pick = pool[cursor % pool.length];
      if (ctx.rrCursor) ctx.rrCursor[ctx.branchId] = (cursor + 1) % pool.length;
      return { assigneeId: pick.id, reason: `Round-robin position ${(cursor % pool.length) + 1}/${pool.length}`, strategy: rule.strategy };
    }
    case "territory": {
      const field = rule.territory?.field;
      const recVal = field ? String(ctx.record?.[field] ?? "") : "";
      const inTerritory = rule.territory?.values.some((v) => recVal.toLowerCase().includes(v.toLowerCase()));
      if (inTerritory) {
        // route to least loaded within branch territory pool
        const sorted = [...pool].sort((a, b) => a.openLeads - b.openLeads);
        return { assigneeId: sorted[0].id, reason: `Territory match on ${field}="${recVal}"`, strategy: rule.strategy };
      }
      return { assigneeId: rule.fallbackUserId ?? pool[0].id, reason: `No territory match — assigned to branch default`, strategy: rule.strategy };
    }
    default:
      return { assigneeId: null, reason: "Manual assignment required", strategy: "manual" };
  }
}

/** Simulate distributing a batch of records — used by the demo / import preview. */
export function simulateDistribution(
  rule: DistributionRule,
  records: Record<string, unknown>[],
  pool: OrgUser[]
): { record: Record<string, unknown>; result: DistributionResult }[] {
  const rrCursor: Record<string, number> = {};
  // mutable copy so load-balancing reflects sequential assignment
  const livePool = pool.map((u) => ({ ...u }));
  return records.map((record) => {
    const result = distribute(rule, { branchId: rule.branchId, pool: livePool, record, rrCursor });
    if (result.assigneeId) {
      const a = livePool.find((u) => u.id === result.assigneeId);
      if (a) a.openLeads += 1;
    }
    return { record, result };
  });
}
