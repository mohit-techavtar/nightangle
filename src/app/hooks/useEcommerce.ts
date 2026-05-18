import { useState } from "react";

export type StorePlatform = "shopify" | "woocommerce";
export type StoreStatus = "connected" | "disconnected" | "error" | "syncing" | "pending";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "on-hold";
export type SyncFrequency = "realtime" | "5min" | "15min" | "hourly" | "daily" | "manual";

export interface EcomStore {
  id: string;
  platform: StorePlatform;
  name: string;
  storeUrl: string; // e.g. mystore.myshopify.com or example.com
  status: StoreStatus;
  // Credentials (in real app these would be encrypted server-side)
  credentials: {
    // Shopify
    accessToken?: string;
    apiKey?: string;
    apiSecret?: string;
    // WooCommerce
    consumerKey?: string;
    consumerSecret?: string;
    webhookSecret?: string;
  };
  scopes?: string[]; // OAuth scopes granted
  syncFrequency: SyncFrequency;
  syncSettings: {
    syncProducts: boolean;
    syncOrders: boolean;
    syncCustomers: boolean;
    syncInventory: boolean;
    createCRMContacts: boolean; // auto-create contacts from buyers
    createCRMDeals: boolean;    // auto-create deals from orders > threshold
    dealThreshold?: number;
  };
  // Sync stats
  lastSyncAt?: string;
  lastError?: string;
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  currency: string;
  // Meta
  connectedAt: string;
  connectedBy: string;
  webhookUrl?: string;
}

export interface EcomOrder {
  id: string;
  storeId: string;
  storeName: string;
  platform: StorePlatform;
  externalOrderId: string; // ID in the external platform
  orderNumber: string;
  status: OrderStatus;
  financialStatus: "pending" | "paid" | "refunded" | "partially_refunded" | "voided";
  fulfillmentStatus: "unfulfilled" | "partial" | "fulfilled";
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  placedAt: string;
  updatedAt: string;
  notes?: string;
  tags?: string[];
}

export interface EcomProduct {
  id: string;
  storeId: string;
  storeName: string;
  platform: StorePlatform;
  externalProductId: string;
  name: string;
  sku?: string;
  description?: string;
  type: string;
  vendor?: string;
  price: number;
  comparePrice?: number;
  currency: string;
  inventoryQty: number;
  inventoryStatus: "in_stock" | "low_stock" | "out_of_stock";
  imageUrl?: string;
  status: "active" | "draft" | "archived";
  totalSold: number;
  totalRevenue: number;
  syncedAt: string;
}

export interface EcomCustomer {
  id: string;
  storeId: string;
  storeName: string;
  platform: StorePlatform;
  externalCustomerId: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderAt?: string;
  lastOrderAt?: string;
  crmContactId?: string; // if synced to CRM contacts
  tags?: string[];
}

// ============= Mock data =============

const mockStores: EcomStore[] = [
  {
    id: "store-1", platform: "shopify", name: "TechFlow Store",
    storeUrl: "techflow.myshopify.com", status: "connected",
    credentials: { accessToken: "shpat_••••••••••••0a9f", apiKey: "ak_•••••" },
    scopes: ["read_products", "read_orders", "read_customers", "write_orders"],
    syncFrequency: "15min",
    syncSettings: { syncProducts: true, syncOrders: true, syncCustomers: true, syncInventory: true, createCRMContacts: true, createCRMDeals: false },
    lastSyncAt: "2026-05-18T08:45:00Z",
    totalProducts: 142, totalOrders: 1840, totalCustomers: 962, totalRevenue: 284500,
    currency: "USD",
    connectedAt: "2025-11-12T00:00:00Z", connectedBy: "Rajesh Sharma",
    webhookUrl: "https://api.everestcrm.com/webhooks/store-1",
  },
  {
    id: "store-2", platform: "woocommerce", name: "Everest India Shop",
    storeUrl: "shop.everestdigital.in", status: "connected",
    credentials: { consumerKey: "ck_••••••••••••a3b2", consumerSecret: "cs_••••••••••••f74e" },
    syncFrequency: "hourly",
    syncSettings: { syncProducts: true, syncOrders: true, syncCustomers: true, syncInventory: true, createCRMContacts: true, createCRMDeals: true, dealThreshold: 50000 },
    lastSyncAt: "2026-05-18T08:00:00Z",
    totalProducts: 86, totalOrders: 412, totalCustomers: 287, totalRevenue: 2840000,
    currency: "INR",
    connectedAt: "2025-09-05T00:00:00Z", connectedBy: "Priya Iyer",
    webhookUrl: "https://api.everestcrm.com/webhooks/store-2",
  },
  {
    id: "store-3", platform: "shopify", name: "Dubai Outlet",
    storeUrl: "dubai-everest.myshopify.com", status: "error",
    credentials: { accessToken: "shpat_••••••••••••8c1d" },
    syncFrequency: "hourly",
    syncSettings: { syncProducts: true, syncOrders: true, syncCustomers: false, syncInventory: true, createCRMContacts: false, createCRMDeals: false },
    lastSyncAt: "2026-05-17T22:15:00Z",
    lastError: "Token expired — please reconnect",
    totalProducts: 54, totalOrders: 89, totalCustomers: 67, totalRevenue: 145200,
    currency: "AED",
    connectedAt: "2026-02-18T00:00:00Z", connectedBy: "Ahmad Al-Rashid",
  },
];

const mockOrders: EcomOrder[] = [
  {
    id: "o-1", storeId: "store-1", storeName: "TechFlow Store", platform: "shopify",
    externalOrderId: "5847291", orderNumber: "#TF-1247",
    status: "processing", financialStatus: "paid", fulfillmentStatus: "unfulfilled",
    customer: { id: "c-1", name: "Emma Wilson", email: "emma.w@gmail.com", phone: "+1 555-0188" },
    items: [{ productId: "p-1", productName: "Pro CRM Annual License", sku: "CRM-PRO-001", quantity: 2, unitPrice: 599, total: 1198 }],
    subtotal: 1198, shippingCost: 0, tax: 99.83, discount: 0, total: 1297.83, currency: "USD",
    shippingAddress: { line1: "245 Mission St", city: "San Francisco", state: "CA", country: "USA", postalCode: "94105" },
    placedAt: "2026-05-18T07:32:00Z", updatedAt: "2026-05-18T07:45:00Z",
  },
  {
    id: "o-2", storeId: "store-2", storeName: "Everest India Shop", platform: "woocommerce",
    externalOrderId: "WC-12847", orderNumber: "#EI-0892",
    status: "shipped", financialStatus: "paid", fulfillmentStatus: "fulfilled",
    customer: { id: "c-2", name: "Arjun Mehta", email: "arjun@example.in", phone: "+91 98765-43210" },
    items: [
      { productId: "p-3", productName: "AI Calling Add-on", quantity: 1, unitPrice: 35000, total: 35000 },
      { productId: "p-4", productName: "WhatsApp Integration", quantity: 1, unitPrice: 12000, total: 12000 },
    ],
    subtotal: 47000, shippingCost: 0, tax: 8460, discount: 2000, total: 53460, currency: "INR",
    shippingAddress: { line1: "Bandra Kurla Complex", city: "Mumbai", state: "Maharashtra", country: "India", postalCode: "400051" },
    placedAt: "2026-05-17T14:20:00Z", updatedAt: "2026-05-18T06:00:00Z",
  },
  {
    id: "o-3", storeId: "store-1", storeName: "TechFlow Store", platform: "shopify",
    externalOrderId: "5847265", orderNumber: "#TF-1246",
    status: "delivered", financialStatus: "paid", fulfillmentStatus: "fulfilled",
    customer: { id: "c-3", name: "Marcus Chen", email: "m.chen@startup.co" },
    items: [{ productId: "p-2", productName: "Marketing Automation Platform", quantity: 1, unitPrice: 1200, total: 1200 }],
    subtotal: 1200, shippingCost: 0, tax: 99, discount: 120, total: 1179, currency: "USD",
    placedAt: "2026-05-16T11:14:00Z", updatedAt: "2026-05-17T18:30:00Z",
  },
  {
    id: "o-4", storeId: "store-2", storeName: "Everest India Shop", platform: "woocommerce",
    externalOrderId: "WC-12846", orderNumber: "#EI-0891",
    status: "pending", financialStatus: "pending", fulfillmentStatus: "unfulfilled",
    customer: { id: "c-4", name: "Sneha Kumar", email: "sneha@startup.in", phone: "+91 99887-66554" },
    items: [{ productId: "p-5", productName: "CRM Starter Plan", quantity: 5, unitPrice: 8000, total: 40000 }],
    subtotal: 40000, shippingCost: 0, tax: 7200, discount: 0, total: 47200, currency: "INR",
    placedAt: "2026-05-18T09:05:00Z", updatedAt: "2026-05-18T09:05:00Z",
  },
  {
    id: "o-5", storeId: "store-1", storeName: "TechFlow Store", platform: "shopify",
    externalOrderId: "5847212", orderNumber: "#TF-1245",
    status: "cancelled", financialStatus: "refunded", fulfillmentStatus: "unfulfilled",
    customer: { id: "c-5", name: "Lisa Park", email: "lisa.p@enterprise.com" },
    items: [{ productId: "p-1", productName: "Pro CRM Annual License", quantity: 1, unitPrice: 599, total: 599 }],
    subtotal: 599, shippingCost: 0, tax: 49.92, discount: 0, total: 648.92, currency: "USD",
    placedAt: "2026-05-15T16:42:00Z", updatedAt: "2026-05-16T10:15:00Z",
    notes: "Customer requested cancellation - duplicate order",
  },
];

const mockProducts: EcomProduct[] = [
  { id: "p-1", storeId: "store-1", storeName: "TechFlow Store", platform: "shopify", externalProductId: "shp-7740", name: "Pro CRM Annual License", sku: "CRM-PRO-001", type: "Software", vendor: "TechFlow", price: 599, currency: "USD", inventoryQty: 9999, inventoryStatus: "in_stock", status: "active", totalSold: 287, totalRevenue: 171913, syncedAt: "2026-05-18T08:45:00Z" },
  { id: "p-2", storeId: "store-1", storeName: "TechFlow Store", platform: "shopify", externalProductId: "shp-7741", name: "Marketing Automation Platform", sku: "MAP-001", type: "Software", price: 1200, currency: "USD", inventoryQty: 9999, inventoryStatus: "in_stock", status: "active", totalSold: 124, totalRevenue: 148800, syncedAt: "2026-05-18T08:45:00Z" },
  { id: "p-3", storeId: "store-2", storeName: "Everest India Shop", platform: "woocommerce", externalProductId: "wc-2840", name: "AI Calling Add-on", price: 35000, currency: "INR", inventoryQty: 50, inventoryStatus: "in_stock", status: "active", type: "Add-on", totalSold: 42, totalRevenue: 1470000, syncedAt: "2026-05-18T08:00:00Z" },
  { id: "p-4", storeId: "store-2", storeName: "Everest India Shop", platform: "woocommerce", externalProductId: "wc-2841", name: "WhatsApp Integration", price: 12000, currency: "INR", inventoryQty: 5, inventoryStatus: "low_stock", status: "active", type: "Add-on", totalSold: 89, totalRevenue: 1068000, syncedAt: "2026-05-18T08:00:00Z" },
  { id: "p-5", storeId: "store-2", storeName: "Everest India Shop", platform: "woocommerce", externalProductId: "wc-2842", name: "CRM Starter Plan", price: 8000, currency: "INR", inventoryQty: 0, inventoryStatus: "out_of_stock", status: "active", type: "Subscription", totalSold: 156, totalRevenue: 1248000, syncedAt: "2026-05-18T08:00:00Z" },
];

const mockCustomers: EcomCustomer[] = [
  { id: "c-1", storeId: "store-1", storeName: "TechFlow Store", platform: "shopify", externalCustomerId: "shp-cust-1098", name: "Emma Wilson", email: "emma.w@gmail.com", phone: "+1 555-0188", totalOrders: 4, totalSpent: 4790, averageOrderValue: 1197.5, firstOrderAt: "2025-12-01T00:00:00Z", lastOrderAt: "2026-05-18T07:32:00Z", crmContactId: "ctc-1" },
  { id: "c-2", storeId: "store-2", storeName: "Everest India Shop", platform: "woocommerce", externalCustomerId: "wc-cust-2401", name: "Arjun Mehta", email: "arjun@example.in", phone: "+91 98765-43210", totalOrders: 8, totalSpent: 425000, averageOrderValue: 53125, firstOrderAt: "2025-10-15T00:00:00Z", lastOrderAt: "2026-05-17T14:20:00Z", crmContactId: "ctc-2" },
  { id: "c-3", storeId: "store-1", storeName: "TechFlow Store", platform: "shopify", externalCustomerId: "shp-cust-1099", name: "Marcus Chen", email: "m.chen@startup.co", totalOrders: 2, totalSpent: 1899, averageOrderValue: 949.5, firstOrderAt: "2026-02-10T00:00:00Z", lastOrderAt: "2026-05-16T11:14:00Z" },
];

export function useEcommerce() {
  const [stores, setStores] = useState<EcomStore[]>(mockStores);
  const [orders, setOrders] = useState<EcomOrder[]>(mockOrders);
  const [products, setProducts] = useState<EcomProduct[]>(mockProducts);
  const [customers] = useState<EcomCustomer[]>(mockCustomers);

  const connectStore = (
    platform: StorePlatform,
    payload: {
      name: string; storeUrl: string;
      accessToken?: string; consumerKey?: string; consumerSecret?: string;
      apiKey?: string; apiSecret?: string;
    }
  ) => {
    const newStore: EcomStore = {
      id: `store-${Date.now()}`, platform,
      name: payload.name, storeUrl: payload.storeUrl,
      status: "syncing",
      credentials: {
        accessToken: payload.accessToken, apiKey: payload.apiKey, apiSecret: payload.apiSecret,
        consumerKey: payload.consumerKey, consumerSecret: payload.consumerSecret,
      },
      scopes: platform === "shopify" ? ["read_products", "read_orders", "read_customers", "write_orders"] : undefined,
      syncFrequency: "hourly",
      syncSettings: { syncProducts: true, syncOrders: true, syncCustomers: true, syncInventory: true, createCRMContacts: true, createCRMDeals: false },
      totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0,
      currency: platform === "woocommerce" ? "INR" : "USD",
      connectedAt: new Date().toISOString(), connectedBy: "current-user",
      webhookUrl: `https://api.everestcrm.com/webhooks/store-${Date.now()}`,
    };
    setStores(prev => [...prev, newStore]);
    // Simulate post-connect sync transition
    setTimeout(() => setStores(prev => prev.map(s => s.id === newStore.id ? { ...s, status: "connected", lastSyncAt: new Date().toISOString() } : s)), 1500);
    return newStore;
  };

  const updateStore = (id: string, updates: Partial<EcomStore>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const disconnectStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: "disconnected" } : s));
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    setOrders(prev => prev.filter(o => o.storeId !== id));
    setProducts(prev => prev.filter(p => p.storeId !== id));
  };

  const syncStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: "syncing" } : s));
    setTimeout(() => {
      setStores(prev => prev.map(s => s.id === id ? { ...s, status: "connected", lastSyncAt: new Date().toISOString(), lastError: undefined } : s));
    }, 1500);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  };

  // Aggregate stats across all connected stores
  const stats = {
    totalStores: stores.length,
    connectedStores: stores.filter(s => s.status === "connected").length,
    errorStores: stores.filter(s => s.status === "error").length,
    totalRevenue: stores.reduce((sum, s) => sum + s.totalRevenue, 0),
    totalOrders: stores.reduce((sum, s) => sum + s.totalOrders, 0),
    totalProducts: stores.reduce((sum, s) => sum + s.totalProducts, 0),
    totalCustomers: stores.reduce((sum, s) => sum + s.totalCustomers, 0),
    ordersToday: orders.filter(o => new Date(o.placedAt).toDateString() === new Date().toDateString()).length,
    revenueToday: orders
      .filter(o => new Date(o.placedAt).toDateString() === new Date().toDateString() && o.financialStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === "pending" || o.status === "processing").length,
    lowStockProducts: products.filter(p => p.inventoryStatus === "low_stock" || p.inventoryStatus === "out_of_stock").length,
  };

  return {
    stores, orders, products, customers, stats,
    connectStore, updateStore, disconnectStore, deleteStore, syncStore,
    updateOrderStatus,
  };
}
