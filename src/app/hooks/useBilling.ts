import { useState, useCallback } from "react";

export interface CreditBalance {
  tenantId: string;
  tenantName: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  currency: string;
  lastUpdated: string;
  status: "active" | "low" | "depleted" | "suspended";
  alerts: {
    lowBalanceThreshold: number;
    alertsEnabled: boolean;
  };
}

export interface UsageRecord {
  id: string;
  tenantId: string;
  timestamp: string;
  eventType: "call_started" | "call_connected" | "call_ended" | "ai_processing" | "handoff";
  campaignId?: string;
  campaignName?: string;
  agentId?: string;
  agentName?: string;
  phoneNumber: string;
  direction: "inbound" | "outbound";
  region: string;
  duration: number; // seconds
  creditsUsed: number;
  cost: number;
  metadata: {
    callId?: string;
    aiProcessingTime?: number;
    handoffTime?: number;
  };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  status: "draft" | "issued" | "paid" | "overdue" | "cancelled";
  totalMinutes: number;
  totalCredits: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  breakdown: {
    byNumber: { phoneNumber: string; minutes: number; cost: number }[];
    byCampaign: { campaignId: string; campaignName: string; minutes: number; cost: number }[];
    byCallType: { type: "inbound" | "outbound"; minutes: number; cost: number }[];
  };
  paymentInfo?: {
    method: "stripe" | "razorpay" | "manual";
    transactionId?: string;
    paidAt?: string;
    gateway?: string;
  };
  dueDate: string;
  issuedAt: string;
  paidAt?: string;
  notes?: string;
  downloadUrl?: string;
}

export interface CreditTransaction {
  id: string;
  tenantId: string;
  type: "purchase" | "deduction" | "refund" | "adjustment" | "bonus";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  reference?: string; // invoice ID, payment ID, etc.
  createdBy: string;
  createdAt: string;
  metadata?: {
    invoiceId?: string;
    paymentId?: string;
    adminReason?: string;
    campaignId?: string;
  };
}

export interface BillingAlert {
  id: string;
  tenantId: string;
  type: "low_balance" | "high_usage" | "invoice_generated" | "payment_failed" | "credit_depleted";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
}

export interface BillingRule {
  id: string;
  name: string;
  type: "credit_pricing" | "tax_rate" | "alert_threshold" | "enforcement";
  config: {
    creditPerMinute?: number;
    regionalPricing?: { region: string; rateMultiplier: number }[];
    taxRate?: number;
    lowBalanceThreshold?: number;
    highUsageThreshold?: number;
    gracePeriodDays?: number;
    autoPauseOnDepletion?: boolean;
  };
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGatewayConfig {
  id: string;
  provider: "stripe" | "razorpay";
  enabled: boolean;
  credentials: {
    publicKey: string;
    secretKey?: string; // Only shown in admin
    webhookSecret?: string;
  };
  settings: {
    currency: string;
    testMode: boolean;
    autoCapture: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PlatformRevenue {
  totalRevenue: number;
  monthlyRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalCreditsIssued: number;
  totalCreditsUsed: number;
  revenueByMonth: { month: string; revenue: number; invoices: number }[];
  topTenants: { tenantId: string; tenantName: string; revenue: number; credits: number }[];
}

const mockCreditBalances: CreditBalance[] = [
  {
    tenantId: "tenant-1",
    tenantName: "Everest Digital Solutions",
    totalCredits: 10000,
    usedCredits: 7234,
    remainingCredits: 2766,
    currency: "USD",
    lastUpdated: new Date().toISOString(),
    status: "low",
    alerts: {
      lowBalanceThreshold: 3000,
      alertsEnabled: true,
    },
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2026-04-001",
    tenantId: "tenant-1",
    tenantName: "Everest Digital Solutions",
    billingPeriodStart: "2026-04-01T00:00:00Z",
    billingPeriodEnd: "2026-04-30T23:59:59Z",
    status: "issued",
    totalMinutes: 4820,
    totalCredits: 4820,
    subtotal: 482.00,
    tax: 86.76,
    taxRate: 18,
    total: 568.76,
    currency: "USD",
    breakdown: {
      byNumber: [
        { phoneNumber: "+1-555-0101", minutes: 1234, cost: 123.40 },
        { phoneNumber: "+1-555-0102", minutes: 2345, cost: 234.50 },
        { phoneNumber: "+1-555-0103", minutes: 1241, cost: 124.10 },
      ],
      byCampaign: [
        { campaignId: "camp-1", campaignName: "Summer Product Launch", minutes: 2456, cost: 245.60 },
        { campaignId: "camp-2", campaignName: "Customer Onboarding", minutes: 2364, cost: 236.40 },
      ],
      byCallType: [
        { type: "outbound", minutes: 3234, cost: 323.40 },
        { type: "inbound", minutes: 1586, cost: 158.60 },
      ],
    },
    dueDate: "2026-05-15T00:00:00Z",
    issuedAt: "2026-05-01T00:00:00Z",
    notes: "Monthly billing for AI calling services",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2026-03-001",
    tenantId: "tenant-1",
    tenantName: "Everest Digital Solutions",
    billingPeriodStart: "2026-03-01T00:00:00Z",
    billingPeriodEnd: "2026-03-31T23:59:59Z",
    status: "paid",
    totalMinutes: 3567,
    totalCredits: 3567,
    subtotal: 356.70,
    tax: 64.21,
    taxRate: 18,
    total: 420.91,
    currency: "USD",
    breakdown: {
      byNumber: [
        { phoneNumber: "+1-555-0101", minutes: 1823, cost: 182.30 },
        { phoneNumber: "+1-555-0102", minutes: 1744, cost: 174.40 },
      ],
      byCampaign: [
        { campaignId: "camp-1", campaignName: "Q1 Launch", minutes: 3567, cost: 356.70 },
      ],
      byCallType: [
        { type: "outbound", minutes: 2345, cost: 234.50 },
        { type: "inbound", minutes: 1222, cost: 122.20 },
      ],
    },
    dueDate: "2026-04-15T00:00:00Z",
    issuedAt: "2026-04-01T00:00:00Z",
    paidAt: "2026-04-10T14:23:00Z",
    paymentInfo: {
      method: "stripe",
      transactionId: "pi_3MtwBwLkdIwHu7ix0B4Z9dKJ",
      paidAt: "2026-04-10T14:23:00Z",
      gateway: "stripe",
    },
  },
];

const mockUsageRecords: UsageRecord[] = [
  {
    id: "usage-001",
    tenantId: "tenant-1",
    timestamp: "2026-04-22T14:23:45Z",
    eventType: "call_ended",
    campaignId: "camp-1",
    campaignName: "Summer Product Launch",
    agentId: "agent-1",
    agentName: "Sales AI Agent",
    phoneNumber: "+1-555-0123",
    direction: "outbound",
    region: "US",
    duration: 234,
    creditsUsed: 4,
    cost: 0.40,
    metadata: {
      callId: "call-12345",
      aiProcessingTime: 234,
    },
  },
];

const mockTransactions: CreditTransaction[] = [
  {
    id: "txn-001",
    tenantId: "tenant-1",
    type: "purchase",
    amount: 5000,
    balanceBefore: 5000,
    balanceAfter: 10000,
    description: "Credit purchase - $500",
    reference: "pay_abc123",
    createdBy: "system",
    createdAt: "2026-04-01T10:00:00Z",
    metadata: {
      paymentId: "pay_abc123",
    },
  },
  {
    id: "txn-002",
    tenantId: "tenant-1",
    type: "deduction",
    amount: -234,
    balanceBefore: 10000,
    balanceAfter: 9766,
    description: "AI call usage - Campaign: Summer Launch",
    createdBy: "system",
    createdAt: "2026-04-22T14:23:45Z",
    metadata: {
      campaignId: "camp-1",
    },
  },
];

const mockAlerts: BillingAlert[] = [
  {
    id: "alert-001",
    tenantId: "tenant-1",
    type: "low_balance",
    severity: "warning",
    title: "Low Credit Balance",
    message: "Your credit balance is below the threshold. Current balance: 2,766 credits (27.66%).",
    timestamp: "2026-04-22T10:00:00Z",
    read: false,
    actionRequired: true,
    actionUrl: "/tenant/billing/purchase",
  },
];

export function useBilling() {
  const [balances, setBalances] = useState<CreditBalance[]>(mockCreditBalances);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>(mockUsageRecords);
  const [transactions, setTransactions] = useState<CreditTransaction[]>(mockTransactions);
  const [alerts, setAlerts] = useState<BillingAlert[]>(mockAlerts);

  const getBalanceByTenant = useCallback((tenantId: string) => {
    return balances.find(b => b.tenantId === tenantId);
  }, [balances]);

  const getInvoiceById = useCallback((invoiceId: string) => {
    return invoices.find(inv => inv.id === invoiceId);
  }, [invoices]);

  const getInvoicesByTenant = useCallback((tenantId: string) => {
    return invoices.filter(inv => inv.tenantId === tenantId);
  }, [invoices]);

  const getUsageByTenant = useCallback((tenantId: string, startDate?: string, endDate?: string) => {
    let filtered = usageRecords.filter(u => u.tenantId === tenantId);

    if (startDate) {
      filtered = filtered.filter(u => new Date(u.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(u => new Date(u.timestamp) <= new Date(endDate));
    }

    return filtered;
  }, [usageRecords]);

  const getTransactionsByTenant = useCallback((tenantId: string) => {
    return transactions.filter(t => t.tenantId === tenantId);
  }, [transactions]);

  const getAlertsByTenant = useCallback((tenantId: string) => {
    return alerts.filter(a => a.tenantId === tenantId);
  }, [alerts]);

  const adjustCredits = useCallback((tenantId: string, amount: number, reason: string, adminUserId: string) => {
    const balance = balances.find(b => b.tenantId === tenantId);
    if (!balance) return;

    const newTransaction: CreditTransaction = {
      id: `txn-${Date.now()}`,
      tenantId,
      type: amount > 0 ? "adjustment" : "adjustment",
      amount,
      balanceBefore: balance.remainingCredits,
      balanceAfter: balance.remainingCredits + amount,
      description: reason,
      createdBy: adminUserId,
      createdAt: new Date().toISOString(),
      metadata: {
        adminReason: reason,
      },
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalances(prev => prev.map(b =>
      b.tenantId === tenantId
        ? { ...b, remainingCredits: b.remainingCredits + amount, lastUpdated: new Date().toISOString() }
        : b
    ));
  }, [balances]);

  const createInvoice = useCallback((invoiceData: Partial<Invoice>) => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      ...invoiceData,
    } as Invoice;

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  }, [invoices]);

  const updateInvoice = useCallback((invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, ...updates } : inv
    ));
  }, []);

  const markInvoicePaid = useCallback((invoiceId: string, paymentInfo: Invoice['paymentInfo']) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId
        ? { ...inv, status: "paid" as const, paidAt: new Date().toISOString(), paymentInfo }
        : inv
    ));
  }, []);

  const purchaseCredits = useCallback((tenantId: string, amount: number, paymentId: string) => {
    const balance = balances.find(b => b.tenantId === tenantId);
    if (!balance) return;

    const newTransaction: CreditTransaction = {
      id: `txn-${Date.now()}`,
      tenantId,
      type: "purchase",
      amount,
      balanceBefore: balance.remainingCredits,
      balanceAfter: balance.remainingCredits + amount,
      description: `Credit purchase - $${(amount / 100).toFixed(2)}`,
      reference: paymentId,
      createdBy: "customer",
      createdAt: new Date().toISOString(),
      metadata: {
        paymentId,
      },
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalances(prev => prev.map(b =>
      b.tenantId === tenantId
        ? {
            ...b,
            totalCredits: b.totalCredits + amount,
            remainingCredits: b.remainingCredits + amount,
            lastUpdated: new Date().toISOString(),
            status: "active" as const
          }
        : b
    ));
  }, [balances]);

  const markAlertRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, read: true } : a
    ));
  }, []);

  const getPlatformRevenue = useCallback((): PlatformRevenue => {
    const totalRevenue = invoices
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = invoices
      .filter(inv => inv.status === "paid" && inv.paidAt?.startsWith(currentMonth))
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRevenue,
      monthlyRevenue,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(inv => inv.status === "paid").length,
      overdueInvoices: invoices.filter(inv => inv.status === "overdue").length,
      totalCreditsIssued: balances.reduce((sum, b) => sum + b.totalCredits, 0),
      totalCreditsUsed: balances.reduce((sum, b) => sum + b.usedCredits, 0),
      revenueByMonth: [
        { month: "2026-01", revenue: 2345.67, invoices: 12 },
        { month: "2026-02", revenue: 3456.78, invoices: 15 },
        { month: "2026-03", revenue: 4567.89, invoices: 18 },
        { month: "2026-04", revenue: 5678.90, invoices: 21 },
      ],
      topTenants: [
        { tenantId: "tenant-1", tenantName: "Everest Digital Solutions", revenue: 2345.67, credits: 10000 },
        { tenantId: "tenant-2", tenantName: "Tech Innovations Inc", revenue: 1234.56, credits: 8000 },
      ],
    };
  }, [invoices, balances]);

  return {
    // Data
    balances,
    invoices,
    usageRecords,
    transactions,
    alerts,

    // Getters
    getBalanceByTenant,
    getInvoiceById,
    getInvoicesByTenant,
    getUsageByTenant,
    getTransactionsByTenant,
    getAlertsByTenant,
    getPlatformRevenue,

    // Actions
    adjustCredits,
    createInvoice,
    updateInvoice,
    markInvoicePaid,
    purchaseCredits,
    markAlertRead,
  };
}
