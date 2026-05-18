import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../../components/layout/TopBar";
import { useEcommerce } from "../../../hooks/useEcommerce";
import type { EcomStore, StorePlatform } from "../../../hooks/useEcommerce";
import {
  Store, Plus, RefreshCw, Trash2, Settings, ExternalLink, CheckCircle2,
  AlertCircle, Clock, X, Eye, EyeOff, Copy, Info, Zap,
  Link as LinkIcon, ShoppingBag, Globe, ChevronRight, Power, Key,
  ArrowRight, Loader2, ShieldCheck
} from "lucide-react";

type ConnectFlow = "none" | "platform-pick" | "shopify" | "woocommerce";

const STATUS_META: Record<EcomStore["status"], { label: string; color: string; icon: React.ElementType }> = {
  connected:    { label: "Connected",    color: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]", icon: CheckCircle2 },
  syncing:      { label: "Syncing",      color: "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]", icon: Loader2 },
  error:        { label: "Error",        color: "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]", icon: AlertCircle },
  pending:      { label: "Pending",      color: "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]", icon: Clock },
  disconnected: { label: "Disconnected", color: "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]", icon: Power },
};

export function EcommerceConnections() {
  const navigate = useNavigate();
  const { stores, connectStore, disconnectStore, deleteStore, syncStore, updateStore } = useEcommerce();
  const [connectFlow, setConnectFlow] = useState<ConnectFlow>("none");
  const [settingsStoreId, setSettingsStoreId] = useState<string | null>(null);

  // Shopify form
  const [shopifyForm, setShopifyForm] = useState({
    storeName: "", storeUrl: "", accessToken: "",
    method: "token" as "token" | "oauth",
  });

  // WooCommerce form
  const [wooForm, setWooForm] = useState({
    storeName: "", storeUrl: "", consumerKey: "", consumerSecret: "",
  });

  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const settingsStore = settingsStoreId ? stores.find(s => s.id === settingsStoreId) : null;

  const handleShopifyConnect = () => {
    if (!shopifyForm.storeName || !shopifyForm.storeUrl) {
      alert("Please enter a store name and URL"); return;
    }
    if (shopifyForm.method === "token" && !shopifyForm.accessToken) {
      alert("Please enter an access token"); return;
    }
    if (shopifyForm.method === "oauth") {
      // In a real app: redirect to https://{storeUrl}/admin/oauth/authorize?...
      alert(`Real OAuth would redirect to: https://${shopifyForm.storeUrl}/admin/oauth/authorize`);
    }
    connectStore("shopify", { name: shopifyForm.storeName, storeUrl: shopifyForm.storeUrl, accessToken: shopifyForm.accessToken });
    setConnectFlow("none");
    setShopifyForm({ storeName: "", storeUrl: "", accessToken: "", method: "token" });
  };

  const handleWooConnect = () => {
    if (!wooForm.storeName || !wooForm.storeUrl || !wooForm.consumerKey || !wooForm.consumerSecret) {
      alert("All fields are required"); return;
    }
    connectStore("woocommerce", { name: wooForm.storeName, storeUrl: wooForm.storeUrl, consumerKey: wooForm.consumerKey, consumerSecret: wooForm.consumerSecret });
    setConnectFlow("none");
    setWooForm({ storeName: "", storeUrl: "", consumerKey: "", consumerSecret: "" });
  };

  const handleTestConnection = () => {
    setTesting(true); setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult("success");
      setTimeout(() => setTestResult(null), 3000);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "E-Commerce" }, { label: "Store Connections" }]} mode="customer" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <Store size={20} className="text-[#1565C0]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0F1B2D]">Store Connections</h2>
              </div>
              <p className="text-sm text-[#616161]">Connect your Shopify and WooCommerce stores to sync products, orders, and customers</p>
            </div>
            <button onClick={() => setConnectFlow("platform-pick")} className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
              <Plus size={16} /> Connect Store
            </button>
          </div>

          {/* Empty state */}
          {stores.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E0E0E0] rounded-lg p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E3F2FD] mx-auto mb-4 flex items-center justify-center">
                <Store size={28} className="text-[#1565C0]" />
              </div>
              <h3 className="font-semibold text-[#212121] mb-2">No stores connected yet</h3>
              <p className="text-sm text-[#616161] mb-5 max-w-md mx-auto">Connect your Shopify or WooCommerce store to start syncing products, orders, and customers into your CRM.</p>
              <button onClick={() => setConnectFlow("platform-pick")} className="inline-flex items-center gap-2 px-5 h-10 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
                <Plus size={16} /> Connect Your First Store
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {stores.map(store => {
                const statusMeta = STATUS_META[store.status];
                const StatusIcon = statusMeta.icon;
                const isShopify = store.platform === "shopify";
                return (
                  <div key={store.id} className="bg-white border border-[#E0E0E0] rounded-lg p-5 hover:border-[#1565C0] transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Platform logo */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isShopify ? "bg-[#95BF47]/20" : "bg-[#21759B]/20"}`}>
                        {isShopify ? <ShoppingBag size={24} className="text-[#5E8E3E]" /> : <Globe size={24} className="text-[#21759B]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-[#212121]">{store.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${statusMeta.color}`}>
                            <StatusIcon size={11} className={store.status === "syncing" ? "animate-spin" : ""} /> {statusMeta.label}
                          </span>
                          <span className="text-xs text-[#9E9E9E] capitalize">· {store.platform}</span>
                        </div>
                        <a href={`https://${store.storeUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1565C0] hover:underline inline-flex items-center gap-1">
                          {store.storeUrl} <ExternalLink size={11} />
                        </a>
                        {store.lastError && (
                          <div className="mt-2 inline-flex items-start gap-1.5 text-xs text-[#C62828] bg-[#FFEBEE] border border-[#FFCDD2] rounded-md px-2 py-1">
                            <AlertCircle size={12} className="mt-0.5 shrink-0" /> {store.lastError}
                          </div>
                        )}

                        {/* Inline stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t border-[#E0E0E0]">
                          <Stat label="Products" value={store.totalProducts.toLocaleString()} />
                          <Stat label="Orders" value={store.totalOrders.toLocaleString()} />
                          <Stat label="Customers" value={store.totalCustomers.toLocaleString()} />
                          <Stat label="Revenue" value={`${store.currency} ${(store.totalRevenue / 1000).toFixed(1)}K`} />
                          <Stat label="Last Sync" value={store.lastSyncAt ? new Date(store.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"} />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => syncStore(store.id)} disabled={store.status === "syncing"} title="Sync now" className="p-2 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] disabled:opacity-50">
                          <RefreshCw size={14} className={store.status === "syncing" ? "animate-spin" : ""} />
                        </button>
                        <button onClick={() => setSettingsStoreId(store.id)} title="Settings" className="p-2 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5]"><Settings size={14} /></button>
                        <button onClick={() => navigate(`/tenant/ecommerce/orders?storeId=${store.id}`)} className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-[#E0E0E0] bg-white text-[#1565C0] text-sm hover:bg-[#F5F5F5]">
                          View <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Help / Docs */}
          <div className="mt-6 bg-[#E3F2FD] border border-[#90CAF9] rounded-lg p-4 flex items-start gap-3">
            <Info size={18} className="text-[#1565C0] mt-0.5 shrink-0" />
            <div className="text-sm text-[#1565C0]">
              <p className="font-medium mb-1">Need help connecting?</p>
              <p className="text-xs leading-relaxed">
                For Shopify, create a custom app at Settings → Apps → Develop apps and generate an Admin API access token.{" "}
                For WooCommerce, go to WordPress admin → WooCommerce → Settings → Advanced → REST API and generate API keys with read/write permissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Platform picker */}
      {connectFlow === "platform-pick" && (
        <Modal onClose={() => setConnectFlow("none")} title="Connect a Store" maxWidth="max-w-2xl">
          <div className="p-6">
            <p className="text-sm text-[#616161] mb-5">Choose the platform you want to connect:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button onClick={() => setConnectFlow("shopify")} className="border border-[#E0E0E0] rounded-lg p-5 text-left hover:border-[#5E8E3E] hover:bg-[#F1F8E9] transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-[#95BF47]/20 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-[#5E8E3E]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#212121]">Shopify</div>
                    <div className="text-xs text-[#616161]">Hosted commerce platform</div>
                  </div>
                </div>
                <ul className="text-xs text-[#616161] space-y-1 mb-3">
                  <li>✓ Products, orders, customers, inventory</li>
                  <li>✓ Real-time webhook events</li>
                  <li>✓ OAuth or Admin API token</li>
                </ul>
                <div className="text-xs text-[#5E8E3E] font-medium inline-flex items-center gap-1">Connect Shopify <ArrowRight size={12} /></div>
              </button>

              <button onClick={() => setConnectFlow("woocommerce")} className="border border-[#E0E0E0] rounded-lg p-5 text-left hover:border-[#21759B] hover:bg-[#E1F5FE] transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-[#21759B]/20 flex items-center justify-center">
                    <Globe size={24} className="text-[#21759B]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#212121]">WooCommerce</div>
                    <div className="text-xs text-[#616161]">Self-hosted WordPress store</div>
                  </div>
                </div>
                <ul className="text-xs text-[#616161] space-y-1 mb-3">
                  <li>✓ Products, orders, customers</li>
                  <li>✓ Consumer Key + Secret auth</li>
                  <li>✓ Webhook support</li>
                </ul>
                <div className="text-xs text-[#21759B] font-medium inline-flex items-center gap-1">Connect WooCommerce <ArrowRight size={12} /></div>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Step 2a: Shopify connection form */}
      {connectFlow === "shopify" && (
        <Modal onClose={() => setConnectFlow("none")} title="Connect Shopify Store" maxWidth="max-w-xl">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E0E0E0]">
              <div className="w-10 h-10 rounded-lg bg-[#95BF47]/20 flex items-center justify-center"><ShoppingBag size={20} className="text-[#5E8E3E]" /></div>
              <div>
                <div className="font-semibold text-[#212121]">Shopify Store</div>
                <button onClick={() => setConnectFlow("platform-pick")} className="text-xs text-[#1565C0] hover:underline">← Change platform</button>
              </div>
            </div>

            {/* Method tabs */}
            <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md p-1">
              <button onClick={() => setShopifyForm({ ...shopifyForm, method: "token" })} className={`flex-1 py-1.5 text-xs font-medium rounded ${shopifyForm.method === "token" ? "bg-white shadow-sm text-[#1565C0]" : "text-[#616161]"}`}>Admin API Token</button>
              <button onClick={() => setShopifyForm({ ...shopifyForm, method: "oauth" })} className={`flex-1 py-1.5 text-xs font-medium rounded ${shopifyForm.method === "oauth" ? "bg-white shadow-sm text-[#1565C0]" : "text-[#616161]"}`}>OAuth (recommended)</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1">Display Name *</label>
              <input type="text" value={shopifyForm.storeName} onChange={(e) => setShopifyForm({ ...shopifyForm, storeName: e.target.value })} placeholder="e.g. My Online Store" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1">Store URL *</label>
              <div className="flex items-center">
                <span className="h-10 px-3 inline-flex items-center bg-[#F5F5F5] border border-r-0 border-[#E0E0E0] rounded-l-md text-sm text-[#616161]">https://</span>
                <input type="text" value={shopifyForm.storeUrl} onChange={(e) => setShopifyForm({ ...shopifyForm, storeUrl: e.target.value })} placeholder="mystore.myshopify.com" className="flex-1 h-10 border border-[#E0E0E0] rounded-r-md px-3 text-sm" />
              </div>
            </div>

            {shopifyForm.method === "token" ? (
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Admin API Access Token *</label>
                <div className="relative">
                  <input type={showSecret.shopifyToken ? "text" : "password"} value={shopifyForm.accessToken} onChange={(e) => setShopifyForm({ ...shopifyForm, accessToken: e.target.value })} placeholder="shpat_••••••••••••••••" className="w-full h-10 border border-[#E0E0E0] rounded-md pl-3 pr-10 text-sm font-mono" />
                  <button type="button" onClick={() => setShowSecret({ ...showSecret, shopifyToken: !showSecret.shopifyToken })} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#9E9E9E] hover:text-[#212121]">
                    {showSecret.shopifyToken ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-[#616161] mt-1">Create in Shopify Admin → Settings → Apps → Develop apps → Create app → Configure Admin API access scopes</p>
              </div>
            ) : (
              <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-md p-3 text-xs text-[#1565C0]">
                <div className="font-medium mb-1 inline-flex items-center gap-1"><ShieldCheck size={12} /> OAuth Flow</div>
                <p>Clicking "Connect" will redirect you to Shopify to authorize this app. You'll grant access to: read_products, read_orders, read_customers, write_orders.</p>
              </div>
            )}

            <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-md p-3">
              <p className="text-xs font-medium text-[#212121] mb-1">Permissions requested:</p>
              <div className="flex flex-wrap gap-1.5">
                {["read_products", "read_orders", "read_customers", "write_orders", "read_inventory"].map(s => (
                  <span key={s} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-[#E0E0E0] text-[#616161]">{s}</span>
                ))}
              </div>
            </div>

            {testResult === "success" && <div className="flex items-center gap-2 text-sm text-[#2E7D32] bg-[#E8F5E9] px-3 py-2 rounded-md"><CheckCircle2 size={14} /> Connection test successful</div>}
            {testResult === "error"   && <div className="flex items-center gap-2 text-sm text-[#C62828] bg-[#FFEBEE] px-3 py-2 rounded-md"><AlertCircle size={14} /> Connection failed. Check your credentials.</div>}
          </div>
          <div className="flex items-center justify-between gap-3 p-5 border-t border-[#E0E0E0] bg-[#FAFAFA]">
            <button onClick={handleTestConnection} disabled={testing} className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-[#E0E0E0] text-[#212121] text-sm hover:bg-white disabled:opacity-50">
              {testing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} {testing ? "Testing..." : "Test Connection"}
            </button>
            <div className="flex gap-3">
              <button onClick={() => setConnectFlow("none")} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-white">Cancel</button>
              <button onClick={handleShopifyConnect} className="h-10 px-5 rounded-md bg-[#5E8E3E] text-white text-sm hover:bg-[#4F7833] inline-flex items-center gap-2">
                <LinkIcon size={14} /> Connect Shopify
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Step 2b: WooCommerce connection form */}
      {connectFlow === "woocommerce" && (
        <Modal onClose={() => setConnectFlow("none")} title="Connect WooCommerce Store" maxWidth="max-w-xl">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E0E0E0]">
              <div className="w-10 h-10 rounded-lg bg-[#21759B]/20 flex items-center justify-center"><Globe size={20} className="text-[#21759B]" /></div>
              <div>
                <div className="font-semibold text-[#212121]">WooCommerce Store</div>
                <button onClick={() => setConnectFlow("platform-pick")} className="text-xs text-[#1565C0] hover:underline">← Change platform</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1">Display Name *</label>
              <input type="text" value={wooForm.storeName} onChange={(e) => setWooForm({ ...wooForm, storeName: e.target.value })} placeholder="e.g. My WordPress Shop" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-1">Site URL *</label>
              <div className="flex items-center">
                <span className="h-10 px-3 inline-flex items-center bg-[#F5F5F5] border border-r-0 border-[#E0E0E0] rounded-l-md text-sm text-[#616161]">https://</span>
                <input type="text" value={wooForm.storeUrl} onChange={(e) => setWooForm({ ...wooForm, storeUrl: e.target.value })} placeholder="shop.example.com" className="flex-1 h-10 border border-[#E0E0E0] rounded-r-md px-3 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Consumer Key *</label>
                <div className="relative">
                  <input type={showSecret.wooKey ? "text" : "password"} value={wooForm.consumerKey} onChange={(e) => setWooForm({ ...wooForm, consumerKey: e.target.value })} placeholder="ck_••••••••••••••••" className="w-full h-10 border border-[#E0E0E0] rounded-md pl-3 pr-10 text-sm font-mono" />
                  <button type="button" onClick={() => setShowSecret({ ...showSecret, wooKey: !showSecret.wooKey })} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#9E9E9E]">
                    {showSecret.wooKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Consumer Secret *</label>
                <div className="relative">
                  <input type={showSecret.wooSecret ? "text" : "password"} value={wooForm.consumerSecret} onChange={(e) => setWooForm({ ...wooForm, consumerSecret: e.target.value })} placeholder="cs_••••••••••••••••" className="w-full h-10 border border-[#E0E0E0] rounded-md pl-3 pr-10 text-sm font-mono" />
                  <button type="button" onClick={() => setShowSecret({ ...showSecret, wooSecret: !showSecret.wooSecret })} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#9E9E9E]">
                    {showSecret.wooSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-[#616161] mt-1">Generate in WP Admin → WooCommerce → Settings → Advanced → REST API → Add key (with Read/Write permission)</p>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-md p-3">
              <p className="text-xs font-medium text-[#212121] mb-2">Steps to generate keys:</p>
              <ol className="text-xs text-[#616161] space-y-1 list-decimal list-inside">
                <li>WordPress admin → WooCommerce → Settings</li>
                <li>Advanced tab → REST API → Add key</li>
                <li>Description: "Everest CRM" · Permissions: Read/Write</li>
                <li>Copy the Consumer Key and Consumer Secret shown</li>
              </ol>
            </div>

            {testResult === "success" && <div className="flex items-center gap-2 text-sm text-[#2E7D32] bg-[#E8F5E9] px-3 py-2 rounded-md"><CheckCircle2 size={14} /> Connection test successful</div>}
          </div>
          <div className="flex items-center justify-between gap-3 p-5 border-t border-[#E0E0E0] bg-[#FAFAFA]">
            <button onClick={handleTestConnection} disabled={testing} className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-[#E0E0E0] text-[#212121] text-sm hover:bg-white disabled:opacity-50">
              {testing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} {testing ? "Testing..." : "Test Connection"}
            </button>
            <div className="flex gap-3">
              <button onClick={() => setConnectFlow("none")} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-white">Cancel</button>
              <button onClick={handleWooConnect} className="h-10 px-5 rounded-md bg-[#21759B] text-white text-sm hover:bg-[#1B5E7F] inline-flex items-center gap-2">
                <LinkIcon size={14} /> Connect WooCommerce
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Per-store settings */}
      {settingsStore && (
        <Modal onClose={() => setSettingsStoreId(null)} title={`${settingsStore.name} — Settings`} maxWidth="max-w-2xl">
          <div className="p-6 space-y-5">
            <SettingsSection title="Sync Frequency">
              <select value={settingsStore.syncFrequency} onChange={(e) => updateStore(settingsStore.id, { syncFrequency: e.target.value as any })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                <option value="realtime">Real-time (webhooks)</option>
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="hourly">Every hour</option>
                <option value="daily">Daily</option>
                <option value="manual">Manual only</option>
              </select>
            </SettingsSection>

            <SettingsSection title="What to sync">
              <div className="space-y-2">
                <ToggleRow label="Products" checked={settingsStore.syncSettings.syncProducts} onChange={(v) => updateStore(settingsStore.id, { syncSettings: { ...settingsStore.syncSettings, syncProducts: v } })} />
                <ToggleRow label="Orders" checked={settingsStore.syncSettings.syncOrders} onChange={(v) => updateStore(settingsStore.id, { syncSettings: { ...settingsStore.syncSettings, syncOrders: v } })} />
                <ToggleRow label="Customers" checked={settingsStore.syncSettings.syncCustomers} onChange={(v) => updateStore(settingsStore.id, { syncSettings: { ...settingsStore.syncSettings, syncCustomers: v } })} />
                <ToggleRow label="Inventory levels" checked={settingsStore.syncSettings.syncInventory} onChange={(v) => updateStore(settingsStore.id, { syncSettings: { ...settingsStore.syncSettings, syncInventory: v } })} />
              </div>
            </SettingsSection>

            <SettingsSection title="CRM automation">
              <div className="space-y-2">
                <ToggleRow label="Auto-create CRM contacts from buyers" checked={settingsStore.syncSettings.createCRMContacts} onChange={(v) => updateStore(settingsStore.id, { syncSettings: { ...settingsStore.syncSettings, createCRMContacts: v } })} />
                <ToggleRow label="Auto-create deals from high-value orders" checked={settingsStore.syncSettings.createCRMDeals} onChange={(v) => updateStore(settingsStore.id, { syncSettings: { ...settingsStore.syncSettings, createCRMDeals: v } })} />
                {settingsStore.syncSettings.createCRMDeals && (
                  <div className="pl-7">
                    <label className="block text-xs text-[#616161] mb-1">Threshold ({settingsStore.currency})</label>
                    <input type="number" value={settingsStore.syncSettings.dealThreshold || 0} onChange={(e) => updateStore(settingsStore.id, { syncSettings: { ...settingsStore.syncSettings, dealThreshold: parseInt(e.target.value) || 0 } })} className="w-full max-w-xs h-9 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                  </div>
                )}
              </div>
            </SettingsSection>

            <SettingsSection title="Webhook URL (incoming)">
              <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E0E0E0] rounded-md p-2">
                <code className="flex-1 text-xs font-mono text-[#212121] truncate">{settingsStore.webhookUrl}</code>
                <button onClick={() => copyToClipboard(settingsStore.webhookUrl || "")} className="p-1.5 rounded hover:bg-white text-[#616161]"><Copy size={14} /></button>
              </div>
              <p className="text-xs text-[#616161] mt-1">Configure this URL in your {settingsStore.platform === "shopify" ? "Shopify" : "WooCommerce"} webhook settings for real-time events.</p>
            </SettingsSection>

            <div className="border-t border-[#E0E0E0] pt-4">
              <h4 className="text-sm font-semibold text-[#C62828] mb-2">Danger zone</h4>
              <div className="flex gap-3">
                <button onClick={() => { if (confirm("Disconnect this store? You can reconnect later.")) { disconnectStore(settingsStore.id); setSettingsStoreId(null); } }} className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-[#FFCDD2] text-[#C62828] text-sm hover:bg-[#FFEBEE]"><Power size={14} /> Disconnect</button>
                <button onClick={() => { if (confirm(`Permanently remove "${settingsStore.name}"? This deletes all synced data.`)) { deleteStore(settingsStore.id); setSettingsStoreId(null); } }} className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-[#FFEBEE] text-[#C62828] text-sm hover:bg-[#FFCDD2] border border-[#FFCDD2]"><Trash2 size={14} /> Remove Store</button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 p-5 border-t border-[#E0E0E0]">
            <button onClick={() => setSettingsStoreId(null)} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">Done</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ============= Helper components =============

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[#9E9E9E] uppercase tracking-wide">{label}</div>
      <div className="text-sm font-semibold text-[#212121] mt-0.5">{value}</div>
    </div>
  );
}

function Modal({ children, onClose, title, maxWidth = "max-w-xl" }: { children: React.ReactNode; onClose: () => void; title: string; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-[#212121]">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[#212121] mb-2">{title}</h4>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm text-[#212121] cursor-pointer">
      <button onClick={() => onChange(!checked)} type="button" className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-[#1565C0]" : "bg-[#E0E0E0]"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
      <span>{label}</span>
    </label>
  );
}
