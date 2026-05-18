import React, { useState, useMemo } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { useEcommerce } from "../../../hooks/useEcommerce";
import {
  Package, Search, ShoppingBag, Globe, AlertTriangle, CheckCircle2,
  XCircle, ExternalLink, TrendingUp, RefreshCw
} from "lucide-react";

export function EcommerceProducts() {
  const { products, stores } = useEcommerce();
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStore = storeFilter === "all" || p.storeId === storeFilter;
    const matchStock = stockFilter === "all" || p.inventoryStatus === stockFilter;
    return matchSearch && matchStore && matchStock;
  }), [products, searchQuery, storeFilter, stockFilter]);

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inventoryStatus === "in_stock").length,
    lowStock: products.filter(p => p.inventoryStatus === "low_stock").length,
    outOfStock: products.filter(p => p.inventoryStatus === "out_of_stock").length,
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "E-Commerce" }, { label: "Products" }]} mode="customer" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <Package size={20} className="text-[#1565C0]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0F1B2D]">Products</h2>
              </div>
              <p className="text-sm text-[#616161]">Products synced from your Shopify and WooCommerce stores</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">
              <RefreshCw size={14} /> Re-sync All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Total Products</div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.total}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">In Stock</div>
              <div className="text-2xl font-semibold text-[#2E7D32]">{stats.inStock}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Low Stock</div>
              <div className="text-2xl font-semibold text-[#F57F17]">{stats.lowStock}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Out of Stock</div>
              <div className="text-2xl font-semibold text-[#C62828]">{stats.outOfStock}</div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Product name or SKU..." className="w-full pl-9 pr-3 h-10 border border-[#E0E0E0] rounded-md text-sm" />
            </div>
            <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)} className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
              <option value="all">All Stores</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Store</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Price</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Inventory</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Sold</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Revenue</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {filteredProducts.map(p => {
                  const isShopify = p.platform === "shopify";
                  const stockColor = p.inventoryStatus === "in_stock" ? "text-[#2E7D32]" : p.inventoryStatus === "low_stock" ? "text-[#F57F17]" : "text-[#C62828]";
                  const stockIcon = p.inventoryStatus === "in_stock" ? CheckCircle2 : p.inventoryStatus === "low_stock" ? AlertTriangle : XCircle;
                  const StockIcon = stockIcon;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#212121]">{p.name}</div>
                        {p.sku && <div className="text-xs text-[#9E9E9E]">SKU: {p.sku}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded ${isShopify ? "bg-[#95BF47]/20" : "bg-[#21759B]/20"} flex items-center justify-center`}>
                            {isShopify ? <ShoppingBag size={11} className="text-[#5E8E3E]" /> : <Globe size={11} className="text-[#21759B]" />}
                          </div>
                          <span className="text-sm text-[#212121]">{p.storeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#212121]">{p.currency} {p.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm ${stockColor}`}>
                          <StockIcon size={12} />
                          {p.inventoryQty.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#616161]">{p.totalSold.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-[#212121]">{p.currency} {(p.totalRevenue / 1000).toFixed(1)}K</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${p.status === "active" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#F5F5F5] text-[#616161]"}`}>{p.status}</span>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center"><Package size={36} className="mx-auto text-[#E0E0E0] mb-3" /><p className="text-sm text-[#616161]">No products found</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
