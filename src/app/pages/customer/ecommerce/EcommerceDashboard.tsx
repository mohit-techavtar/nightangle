import React from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../../components/layout/TopBar";
import { useEcommerce } from "../../../hooks/useEcommerce";
import {
  Store, ShoppingBag, Globe, DollarSign, Package, Users, TrendingUp,
  ArrowRight, AlertCircle, Plus, ChevronRight, Activity, ShoppingCart,
  CheckCircle2, Clock, AlertTriangle
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const REVENUE_TREND = [
  { day: "Mon", revenue: 4200 }, { day: "Tue", revenue: 5800 }, { day: "Wed", revenue: 4900 },
  { day: "Thu", revenue: 7200 }, { day: "Fri", revenue: 8100 }, { day: "Sat", revenue: 6400 },
  { day: "Sun", revenue: 5500 },
];

const TOP_PRODUCTS_CHART = [
  { name: "Pro CRM", sales: 287 }, { name: "AI Calling", sales: 42 },
  { name: "Marketing", sales: 124 }, { name: "WhatsApp", sales: 89 },
  { name: "Starter", sales: 156 },
];

export function EcommerceDashboard() {
  const navigate = useNavigate();
  const { stores, orders, products, stats } = useEcommerce();

  const recentOrders = [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)).slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);

  return (
    <>
      <TopBar breadcrumbs={[{ label: "E-Commerce" }, { label: "Dashboard" }]} mode="customer" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <Store size={20} className="text-[#1565C0]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0F1B2D]">E-Commerce Dashboard</h2>
              </div>
              <p className="text-sm text-[#616161]">Unified view across your Shopify and WooCommerce stores</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate("/tenant/ecommerce/connections")} className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-[#E0E0E0] bg-white text-[#212121] text-sm hover:bg-[#FAFAFA]">
                <Store size={14} /> Manage Stores
              </button>
              <button onClick={() => navigate("/tenant/ecommerce/connections")} className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
                <Plus size={14} /> Connect Store
              </button>
            </div>
          </div>

          {/* Error banner */}
          {stats.errorStores > 0 && (
            <div className="mb-6 bg-[#FFEBEE] border border-[#FFCDD2] rounded-lg p-4 flex items-center gap-3">
              <AlertCircle size={18} className="text-[#C62828] shrink-0" />
              <div className="flex-1 text-sm">
                <span className="font-medium text-[#C62828]">{stats.errorStores} store{stats.errorStores > 1 ? "s have" : " has"} a connection issue.</span>
                <span className="text-[#616161]"> Sync may not be working correctly.</span>
              </div>
              <button onClick={() => navigate("/tenant/ecommerce/connections")} className="text-sm text-[#C62828] font-medium hover:underline inline-flex items-center gap-1">
                Resolve <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPI label="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`} sub={`${stats.totalOrders} orders`} icon={DollarSign} color="text-[#2E7D32]" bg="bg-[#E8F5E9]" />
            <KPI label="Connected Stores" value={`${stats.connectedStores}`} sub={`of ${stats.totalStores} total`} icon={Store} color="text-[#1565C0]" bg="bg-[#E3F2FD]" />
            <KPI label="Products Synced" value={stats.totalProducts.toLocaleString()} sub={`${stats.lowStockProducts} need attention`} icon={Package} color="text-[#F57F17]" bg="bg-[#FFF8E1]" warn={stats.lowStockProducts > 0} />
            <KPI label="Customers" value={stats.totalCustomers.toLocaleString()} sub="across all stores" icon={Users} color="text-[#7B1FA2]" bg="bg-[#F3E5F5]" />
          </div>

          {/* Today's snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#616161] uppercase tracking-wide">Orders Today</span>
                <ShoppingCart size={14} className="text-[#9E9E9E]" />
              </div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.ordersToday}</div>
              <div className="text-xs text-[#616161] mt-1">Last 24 hours</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#616161] uppercase tracking-wide">Revenue Today</span>
                <TrendingUp size={14} className="text-[#9E9E9E]" />
              </div>
              <div className="text-2xl font-semibold text-[#2E7D32]">${stats.revenueToday.toFixed(0)}</div>
              <div className="text-xs text-[#2E7D32] mt-1">+12% vs yesterday</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#616161] uppercase tracking-wide">Pending Orders</span>
                <Clock size={14} className="text-[#F57F17]" />
              </div>
              <div className="text-2xl font-semibold text-[#F57F17]">{stats.pendingOrders}</div>
              <button onClick={() => navigate("/tenant/ecommerce/orders?status=pending")} className="text-xs text-[#1565C0] mt-1 hover:underline">View all →</button>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 bg-white border border-[#E0E0E0] rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#212121]">Revenue · Last 7 days</h3>
                <span className="text-xs text-[#616161]">All stores combined</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={REVENUE_TREND}>
                  <defs>
                    <linearGradient id="revColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1565C0" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#1565C0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="day" stroke="#9E9E9E" fontSize={11} />
                  <YAxis stroke="#9E9E9E" fontSize={11} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #E0E0E0" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1565C0" fill="url(#revColor)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <h3 className="font-semibold text-[#212121] mb-4">Top Products</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={TOP_PRODUCTS_CHART} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis type="number" stroke="#9E9E9E" fontSize={10} />
                  <YAxis type="category" dataKey="name" stroke="#9E9E9E" fontSize={10} width={60} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #E0E0E0" }} />
                  <Bar dataKey="sales" fill="#1565C0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Connected stores quick view */}
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#212121]">Your Stores</h3>
              <button onClick={() => navigate("/tenant/ecommerce/connections")} className="text-sm text-[#1565C0] hover:underline inline-flex items-center gap-1">Manage all <ChevronRight size={14} /></button>
            </div>
            {stores.length === 0 ? (
              <div className="text-center py-8">
                <Store size={36} className="mx-auto text-[#E0E0E0] mb-3" />
                <p className="text-sm text-[#616161] mb-3">No stores connected yet</p>
                <button onClick={() => navigate("/tenant/ecommerce/connections")} className="inline-flex items-center gap-2 px-4 h-9 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]"><Plus size={14} /> Connect Store</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stores.slice(0, 6).map(s => {
                  const isShopify = s.platform === "shopify";
                  return (
                    <div key={s.id} className="border border-[#E0E0E0] rounded-md p-3 hover:border-[#1565C0] hover:bg-[#FAFAFA] cursor-pointer transition-colors" onClick={() => navigate("/tenant/ecommerce/connections")}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded ${isShopify ? "bg-[#95BF47]/20" : "bg-[#21759B]/20"} flex items-center justify-center`}>
                          {isShopify ? <ShoppingBag size={14} className="text-[#5E8E3E]" /> : <Globe size={14} className="text-[#21759B]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#212121] truncate">{s.name}</div>
                          <div className="text-xs text-[#9E9E9E] truncate">{s.storeUrl}</div>
                        </div>
                        {s.status === "connected" && <CheckCircle2 size={14} className="text-[#2E7D32] shrink-0" />}
                        {s.status === "error" && <AlertCircle size={14} className="text-[#C62828] shrink-0" />}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><div className="text-[#9E9E9E]">Orders</div><div className="font-medium text-[#212121]">{s.totalOrders}</div></div>
                        <div><div className="text-[#9E9E9E]">Products</div><div className="font-medium text-[#212121]">{s.totalProducts}</div></div>
                        <div><div className="text-[#9E9E9E]">Revenue</div><div className="font-medium text-[#212121]">{s.currency} {(s.totalRevenue / 1000).toFixed(1)}K</div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent orders + top products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#212121]">Recent Orders</h3>
                <button onClick={() => navigate("/tenant/ecommerce/orders")} className="text-sm text-[#1565C0] hover:underline inline-flex items-center gap-1">View all <ChevronRight size={14} /></button>
              </div>
              <div className="divide-y divide-[#E0E0E0]">
                {recentOrders.map(o => (
                  <div key={o.id} className="py-3 flex items-center gap-3 hover:bg-[#FAFAFA] -mx-2 px-2 rounded cursor-pointer" onClick={() => navigate("/tenant/ecommerce/orders")}>
                    <div className={`w-8 h-8 rounded ${o.platform === "shopify" ? "bg-[#95BF47]/20" : "bg-[#21759B]/20"} flex items-center justify-center shrink-0`}>
                      {o.platform === "shopify" ? <ShoppingBag size={14} className="text-[#5E8E3E]" /> : <Globe size={14} className="text-[#21759B]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#212121]">{o.orderNumber} · {o.customer.name}</div>
                      <div className="text-xs text-[#616161] truncate">{o.storeName} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-[#212121]">{o.currency} {o.total.toFixed(0)}</div>
                      <OrderStatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#212121]">Top Selling Products</h3>
                <button onClick={() => navigate("/tenant/ecommerce/products")} className="text-sm text-[#1565C0] hover:underline inline-flex items-center gap-1">View all <ChevronRight size={14} /></button>
              </div>
              <div className="divide-y divide-[#E0E0E0]">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FAFAFA] flex items-center justify-center text-xs font-semibold text-[#616161]">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#212121] truncate">{p.name}</div>
                      <div className="text-xs text-[#616161]">{p.storeName} · {p.totalSold} sold</div>
                    </div>
                    <div className="text-sm font-semibold text-[#212121] shrink-0">{p.currency} {(p.totalRevenue / 1000).toFixed(1)}K</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function KPI({ label, value, sub, icon: Icon, color, bg, warn }: { label: string; value: string; sub: string; icon: React.ElementType; color: string; bg: string; warn?: boolean }) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon size={16} className={color} />
        </div>
        {warn && <AlertTriangle size={14} className="text-[#F57F17]" />}
      </div>
      <div className="text-xs text-[#616161] uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold text-[#212121] mt-0.5">{value}</div>
      <div className="text-xs text-[#9E9E9E] mt-0.5">{sub}</div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending:    "text-[#F57F17]",
    processing: "text-[#1565C0]",
    shipped:    "text-[#0277BD]",
    delivered:  "text-[#2E7D32]",
    cancelled:  "text-[#C62828]",
    refunded:   "text-[#C62828]",
  };
  return <div className={`text-xs capitalize ${colors[status] || "text-[#616161]"}`}>{status}</div>;
}
