import { useState } from "react";

// Deal Types
export type DealType = "new-business" | "renewal" | "upsell" | "cross-sell";
export type DealStatus = "open" | "won" | "lost";

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  name: string;
  probability: number;
  order: number;
  color: string;
  entryRules?: string[];
  exitRules?: string[];
  requiredFields?: string[];
  allowedActions?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  currency: string;
  isActive: boolean;
}

export interface DealLineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: "percentage" | "absolute";
  tax: number;
  subtotal: number;
  total: number;
}

export interface Deal {
  id: string;
  name: string;
  leadId: string;
  leadName: string;
  companyId?: string;
  companyName?: string;
  pipelineId: string;
  pipelineName: string;
  stageId: string;
  stageName: string;
  owner: string;
  ownerName: string;
  status: DealStatus;
  dealType: DealType;
  currency: string;
  estimatedValue: number;
  actualValue?: number;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  lineItems: DealLineItem[];
  sourceCampaign?: string;
  attribution: {
    leadSource?: string;
    campaigns?: string[];
    aiCalls?: string[];
    channels?: string[];
  };
  tags: string[];
  notes: string;
  closeReason?: string;
  aiInsights?: {
    winProbability: number;
    riskSignals: string[];
    nextBestAction: string;
    stalledDays?: number;
  };
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  closedAt?: string;
  /** Extended Zoho-style fields (address, shipping, charges, guidelines, misc). */
  extended?: Record<string, any>;
}

export interface DealActivity {
  id: string;
  dealId: string;
  type: "stage-change" | "note" | "proposal-sent" | "pricing-change" | "approval" | "closure" | "value-change";
  description: string;
  oldValue?: any;
  newValue?: any;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface ForecastData {
  period: string;
  committed: number;
  bestCase: number;
  pipeline: number;
  closed: number;
  target?: number;
}

export interface WinLossReason {
  id: string;
  type: "won" | "lost";
  reason: string;
  category: string;
}

// Mock Data
const mockPipelines: Pipeline[] = [
  {
    id: "pipe-1",
    name: "New Business",
    description: "Standard sales pipeline for new customers",
    isDefault: true,
    stages: [
      { id: "stage-1", name: "Qualification", probability: 10, order: 1, color: "#3b82f6", requiredFields: ["expectedCloseDate", "estimatedValue"] },
      { id: "stage-2", name: "Discovery", probability: 20, order: 2, color: "#8b5cf6" },
      { id: "stage-3", name: "Proposal Sent", probability: 40, order: 3, color: "#f59e0b" },
      { id: "stage-4", name: "Negotiation", probability: 60, order: 4, color: "#10b981" },
      { id: "stage-5", name: "Verbal Commit", probability: 80, order: 5, color: "#06b6d4" },
      { id: "stage-6", name: "Won", probability: 100, order: 6, color: "#22c55e" },
      { id: "stage-7", name: "Lost", probability: 0, order: 7, color: "#ef4444" },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "pipe-2",
    name: "Renewals",
    description: "Customer renewal pipeline",
    isDefault: false,
    stages: [
      { id: "stage-8", name: "Renewal Alert", probability: 20, order: 1, color: "#3b82f6" },
      { id: "stage-9", name: "Engagement", probability: 40, order: 2, color: "#8b5cf6" },
      { id: "stage-10", name: "Pricing Sent", probability: 60, order: 3, color: "#f59e0b" },
      { id: "stage-11", name: "Negotiation", probability: 80, order: 4, color: "#10b981" },
      { id: "stage-12", name: "Renewed", probability: 100, order: 5, color: "#22c55e" },
      { id: "stage-13", name: "Churned", probability: 0, order: 6, color: "#ef4444" },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "pipe-3",
    name: "Enterprise Sales",
    description: "Complex enterprise deals",
    isDefault: false,
    stages: [
      { id: "stage-14", name: "Initial Contact", probability: 5, order: 1, color: "#3b82f6" },
      { id: "stage-15", name: "Discovery & Scoping", probability: 15, order: 2, color: "#8b5cf6" },
      { id: "stage-16", name: "Technical Evaluation", probability: 30, order: 3, color: "#f59e0b" },
      { id: "stage-17", name: "Proposal", probability: 50, order: 4, color: "#10b981" },
      { id: "stage-18", name: "Legal Review", probability: 70, order: 5, color: "#06b6d4" },
      { id: "stage-19", name: "Final Negotiation", probability: 85, order: 6, color: "#14b8a6" },
      { id: "stage-20", name: "Closed Won", probability: 100, order: 7, color: "#22c55e" },
      { id: "stage-21", name: "Closed Lost", probability: 0, order: 8, color: "#ef4444" },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockProducts: Product[] = [
  { id: "prod-1", name: "CRM Professional", description: "Professional CRM package", category: "Software", basePrice: 99, currency: "USD", isActive: true },
  { id: "prod-2", name: "CRM Enterprise", description: "Enterprise CRM package", category: "Software", basePrice: 299, currency: "USD", isActive: true },
  { id: "prod-3", name: "AI Calling Add-on", description: "AI-powered calling module", category: "Add-on", basePrice: 149, currency: "USD", isActive: true },
  { id: "prod-4", name: "Implementation Services", description: "Setup and onboarding", category: "Services", basePrice: 2500, currency: "USD", isActive: true },
  { id: "prod-5", name: "Training Package", description: "Team training sessions", category: "Services", basePrice: 1000, currency: "USD", isActive: true },
];

const mockWinLossReasons: WinLossReason[] = [
  { id: "wl-1", type: "won", reason: "Best Value", category: "pricing" },
  { id: "wl-2", type: "won", reason: "Superior Features", category: "product" },
  { id: "wl-3", type: "won", reason: "Excellent Support", category: "service" },
  { id: "wl-4", type: "lost", reason: "Price Too High", category: "pricing" },
  { id: "wl-5", type: "lost", reason: "Lost to Competitor", category: "competition" },
  { id: "wl-6", type: "lost", reason: "No Budget", category: "budget" },
  { id: "wl-7", type: "lost", reason: "Poor Timing", category: "timing" },
  { id: "wl-8", type: "lost", reason: "Internal Decision", category: "internal" },
];

const generateMockDeals = (): Deal[] => {
  const deals: Deal[] = [];
  const pipeline = mockPipelines[0];

  for (let i = 1; i <= 50; i++) {
    const stageIndex = Math.floor(Math.random() * (pipeline.stages.length - 2));
    const stage = pipeline.stages[stageIndex];
    const isWon = Math.random() > 0.7 && stageIndex >= 4;
    const isLost = Math.random() > 0.8 && stageIndex >= 2;

    let status: DealStatus = "open";
    let actualStage = stage;

    if (isWon) {
      status = "won";
      actualStage = pipeline.stages.find(s => s.name === "Won")!;
    } else if (isLost) {
      status = "lost";
      actualStage = pipeline.stages.find(s => s.name === "Lost")!;
    }

    const baseValue = Math.floor(Math.random() * 50000) + 5000;

    deals.push({
      id: `deal-${i}`,
      name: `${["Enterprise", "SMB", "Startup", "Agency", "Corporation"][Math.floor(Math.random() * 5)]} Deal ${i}`,
      leadId: `lead-${i}`,
      leadName: `Contact ${i}`,
      companyId: `company-${i}`,
      companyName: `Company ${i}`,
      pipelineId: pipeline.id,
      pipelineName: pipeline.name,
      stageId: actualStage.id,
      stageName: actualStage.name,
      owner: `user-${Math.floor(Math.random() * 5) + 1}`,
      ownerName: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Tom Brown"][Math.floor(Math.random() * 5)],
      status,
      dealType: ["new-business", "renewal", "upsell", "cross-sell"][Math.floor(Math.random() * 4)] as DealType,
      currency: "USD",
      estimatedValue: baseValue,
      actualValue: status === "won" ? baseValue * (0.9 + Math.random() * 0.2) : undefined,
      probability: actualStage.probability,
      expectedCloseDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      actualCloseDate: status !== "open" ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      lineItems: [
        {
          id: `li-${i}-1`,
          productId: mockProducts[0].id,
          productName: mockProducts[0].name,
          quantity: Math.floor(Math.random() * 10) + 1,
          unitPrice: mockProducts[0].basePrice,
          discount: Math.random() > 0.5 ? 10 : 0,
          discountType: "percentage",
          tax: 0,
          subtotal: baseValue * 0.7,
          total: baseValue * 0.7,
        },
        {
          id: `li-${i}-2`,
          productId: mockProducts[2].id,
          productName: mockProducts[2].name,
          quantity: 1,
          unitPrice: mockProducts[2].basePrice,
          discount: 0,
          discountType: "percentage",
          tax: 0,
          subtotal: baseValue * 0.3,
          total: baseValue * 0.3,
        },
      ],
      sourceCampaign: `campaign-${Math.floor(Math.random() * 10) + 1}`,
      attribution: {
        leadSource: ["Website", "Referral", "Cold Call", "Event", "Partner"][Math.floor(Math.random() * 5)],
        campaigns: [`campaign-${Math.floor(Math.random() * 10) + 1}`],
        aiCalls: Math.random() > 0.5 ? [`call-${Math.floor(Math.random() * 100) + 1}`] : [],
        channels: ["email", "ai-calling", "whatsapp"].filter(() => Math.random() > 0.5),
      },
      tags: ["Q1", "High Priority"].filter(() => Math.random() > 0.5),
      notes: `Deal notes for opportunity ${i}`,
      closeReason: status !== "open" ? (status === "won" ? "Best Value" : "Price Too High") : undefined,
      aiInsights: status === "open" ? {
        winProbability: actualStage.probability + Math.random() * 10 - 5,
        riskSignals: ["No recent activity", "Competitor mentioned"].filter(() => Math.random() > 0.7),
        nextBestAction: "Schedule follow-up call",
        stalledDays: Math.random() > 0.7 ? Math.floor(Math.random() * 14) : undefined,
      } : undefined,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "user-1",
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      closedAt: status !== "open" ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    });
  }

  return deals;
};

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>(generateMockDeals());
  const [pipelines, setPipelines] = useState<Pipeline[]>(mockPipelines);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activities, setActivities] = useState<DealActivity[]>([]);
  const [winLossReasons] = useState<WinLossReason[]>(mockWinLossReasons);

  // CRUD Operations
  const createDeal = (deal: Omit<Deal, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "current-user",
    };
    setDeals([newDeal, ...deals]);

    logActivity(newDeal.id, "note", "Deal created", "", newDeal.name);
    return newDeal;
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals(deals.map(deal => {
      if (deal.id === dealId) {
        const oldDeal = { ...deal };
        const updatedDeal = { ...deal, ...updates, updatedAt: new Date().toISOString() };

        // Log stage changes
        if (updates.stageId && updates.stageId !== oldDeal.stageId) {
          logActivity(dealId, "stage-change", `Stage changed from ${oldDeal.stageName} to ${updates.stageName}`, oldDeal.stageId, updates.stageId);
        }

        // Log value changes
        if (updates.estimatedValue && updates.estimatedValue !== oldDeal.estimatedValue) {
          logActivity(dealId, "value-change", `Value changed from $${oldDeal.estimatedValue} to $${updates.estimatedValue}`, oldDeal.estimatedValue, updates.estimatedValue);
        }

        return updatedDeal;
      }
      return deal;
    }));
  };

  const deleteDeal = (dealId: string) => {
    setDeals(deals.filter(deal => deal.id !== dealId));
  };

  const getDealById = (dealId: string) => {
    return deals.find(deal => deal.id === dealId);
  };

  const moveDealToStage = (dealId: string, stageId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const pipeline = pipelines.find(p => p.id === deal.pipelineId);
    if (!pipeline) return;

    const stage = pipeline.stages.find(s => s.id === stageId);
    if (!stage) return;

    updateDeal(dealId, {
      stageId: stage.id,
      stageName: stage.name,
      probability: stage.probability,
    });
  };

  const closeDeal = (dealId: string, status: "won" | "lost", closeReason: string, actualValue?: number) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const pipeline = pipelines.find(p => p.id === deal.pipelineId);
    if (!pipeline) return;

    const targetStage = pipeline.stages.find(s => s.name.toLowerCase() === status);
    if (!targetStage) return;

    updateDeal(dealId, {
      status,
      stageId: targetStage.id,
      stageName: targetStage.name,
      probability: targetStage.probability,
      closeReason,
      actualValue: actualValue || deal.estimatedValue,
      actualCloseDate: new Date().toISOString().split('T')[0],
      closedAt: new Date().toISOString(),
    });

    logActivity(dealId, "closure", `Deal ${status}. Reason: ${closeReason}`, "", status);
  };

  // Pipeline Management
  const createPipeline = (pipeline: Omit<Pipeline, "id" | "createdAt" | "updatedAt">) => {
    const newPipeline: Pipeline = {
      ...pipeline,
      id: `pipe-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPipelines([...pipelines, newPipeline]);
    return newPipeline;
  };

  const updatePipeline = (pipelineId: string, updates: Partial<Pipeline>) => {
    setPipelines(pipelines.map(p => p.id === pipelineId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deletePipeline = (pipelineId: string) => {
    setPipelines(pipelines.filter(p => p.id !== pipelineId));
  };

  // Product Management
  const createProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  // Activity Logging
  const logActivity = (dealId: string, type: DealActivity["type"], description: string, oldValue?: any, newValue?: any) => {
    const activity: DealActivity = {
      id: `activity-${Date.now()}`,
      dealId,
      type,
      description,
      oldValue,
      newValue,
      userId: "current-user",
      userName: "Current User",
      timestamp: new Date().toISOString(),
    };
    setActivities([activity, ...activities]);
  };

  const getActivitiesByDeal = (dealId: string) => {
    return activities.filter(a => a.dealId === dealId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Analytics & Forecasting
  const getForecastData = (pipelineId?: string, ownerId?: string): ForecastData[] => {
    let filteredDeals = deals.filter(d => d.status === "open");

    if (pipelineId) {
      filteredDeals = filteredDeals.filter(d => d.pipelineId === pipelineId);
    }

    if (ownerId) {
      filteredDeals = filteredDeals.filter(d => d.owner === ownerId);
    }

    // Group by month
    const monthlyData: { [key: string]: ForecastData } = {};

    filteredDeals.forEach(deal => {
      const month = deal.expectedCloseDate.substring(0, 7); // YYYY-MM

      if (!monthlyData[month]) {
        monthlyData[month] = {
          period: month,
          committed: 0,
          bestCase: 0,
          pipeline: 0,
          closed: 0,
        };
      }

      const weightedValue = deal.estimatedValue * (deal.probability / 100);
      monthlyData[month].pipeline += deal.estimatedValue;

      if (deal.probability >= 80) {
        monthlyData[month].committed += weightedValue;
      }
      monthlyData[month].bestCase += weightedValue;
    });

    // Add closed won deals
    deals.filter(d => d.status === "won").forEach(deal => {
      const month = deal.actualCloseDate?.substring(0, 7);
      if (month && monthlyData[month]) {
        monthlyData[month].closed += deal.actualValue || deal.estimatedValue;
      }
    });

    return Object.values(monthlyData).sort((a, b) => a.period.localeCompare(b.period));
  };

  const getWinLossAnalysis = (pipelineId?: string, startDate?: string, endDate?: string) => {
    let closedDeals = deals.filter(d => d.status !== "open");

    if (pipelineId) {
      closedDeals = closedDeals.filter(d => d.pipelineId === pipelineId);
    }

    if (startDate) {
      closedDeals = closedDeals.filter(d => d.closedAt && d.closedAt >= startDate);
    }

    if (endDate) {
      closedDeals = closedDeals.filter(d => d.closedAt && d.closedAt <= endDate);
    }

    const wonDeals = closedDeals.filter(d => d.status === "won");
    const lostDeals = closedDeals.filter(d => d.status === "lost");

    const wonReasons: { [key: string]: number } = {};
    const lostReasons: { [key: string]: number } = {};

    wonDeals.forEach(deal => {
      if (deal.closeReason) {
        wonReasons[deal.closeReason] = (wonReasons[deal.closeReason] || 0) + 1;
      }
    });

    lostDeals.forEach(deal => {
      if (deal.closeReason) {
        lostReasons[deal.closeReason] = (lostReasons[deal.closeReason] || 0) + 1;
      }
    });

    return {
      totalWon: wonDeals.length,
      totalLost: lostDeals.length,
      winRate: closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0,
      totalWonValue: wonDeals.reduce((sum, d) => sum + (d.actualValue || d.estimatedValue), 0),
      totalLostValue: lostDeals.reduce((sum, d) => sum + d.estimatedValue, 0),
      wonReasons,
      lostReasons,
    };
  };

  const getDealVelocity = (pipelineId?: string) => {
    let relevantDeals = deals.filter(d => d.status === "won");

    if (pipelineId) {
      relevantDeals = relevantDeals.filter(d => d.pipelineId === pipelineId);
    }

    const velocities = relevantDeals.map(deal => {
      const created = new Date(deal.createdAt).getTime();
      const closed = new Date(deal.closedAt!).getTime();
      return (closed - created) / (1000 * 60 * 60 * 24); // days
    });

    const avgVelocity = velocities.length > 0 ? velocities.reduce((a, b) => a + b, 0) / velocities.length : 0;

    return {
      averageDays: Math.round(avgVelocity),
      totalDeals: relevantDeals.length,
      velocities,
    };
  };

  return {
    deals,
    pipelines,
    products,
    winLossReasons,
    createDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    moveDealToStage,
    closeDeal,
    createPipeline,
    updatePipeline,
    deletePipeline,
    createProduct,
    updateProduct,
    deleteProduct,
    logActivity,
    getActivitiesByDeal,
    getForecastData,
    getWinLossAnalysis,
    getDealVelocity,
  };
}
