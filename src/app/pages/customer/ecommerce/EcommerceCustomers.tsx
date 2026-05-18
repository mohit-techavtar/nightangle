import React, { useState, useMemo } from "react";
import { TopBar } from "../../../components/layout/TopBar";
import { useEcommerce } from "../../../hooks/useEcommerce";
import {
  Users, Search, ShoppingBag, Globe, Mail, Phone, ArrowRight, CheckCircle2
} from "lucide-react";

export function EcommerceCustomers() {
  const { customers, stores } = useEcommerce();
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState<string>("all");

  const filtered = useMemo(() => customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      && (storeFilter === "all" || c.storeId === storeFilter);
  }), [customers, searchQuery, storeFilter]);

  const stats = {
    total: customers.length,
    inCRM: customers.filter(c => c.crmContactId).length,
    totalLTV: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "E-Commerce" }, { label: "Customers" }]} mode="customer" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <Users size={20} className="text-[#1565C0]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0F1B2D]">E-Commerce Customers</h2>
              </div>
              <p className="text-sm text-[#616161]">Buyers from your Shopify and WooCommerce stores</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Total Customers</div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.total}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Synced to CRM</div>
              <div className="text-2xl font-semibold text-[#2E7D32]">{stats.inCRM}</div>
              <div className="text-xs text-[#616161] mt-0.5">{stats.total > 0 ? Math.round((stats.inCRM / stats.total) * 100) : 0}% conversion rate</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Total LTV</div>
              <div className="text-2xl font-semibold text-[#212121]">${(stats.totalLTV / 1000).toFixed(1)}K</div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Name or email..." className="w-full pl-9 pr-3 h-10 border border-[#E0E0E0] rounded-md text-sm" />
            </div>
            <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)} className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
              <option value="all">All Stores</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Store</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Orders</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Total Spent</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">AOV</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Last Order</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {filtered.map(c => {
                  const isShopify = c.platform === "shopify";
                  return (
                    <tr key={c.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#212121]">{c.name}</div>
                        <a href={`mailto:${c.email}`} className="text-xs text-[#1565C0] hover:underline">{c.email}</a>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded ${isShopify ? "bg-[#95BF47]/20" : "bg-[#21759B]/20"} flex items-center justify-center`}>
                            {isShopify ? <ShoppingBag size={11} className="text-[#5E8E3E]" /> : <Globe size={11} className="text-[#21759B]" />}
                          </div>
                          <span className="text-sm text-[#212121]">{c.storeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-[#212121]">{c.totalOrders}</td>
                      <td className="px-4 py-3 text-right font-medium text-[#212121]">${c.totalSpent.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-[#616161]">${c.averageOrderValue.toFixed(0)}</td>
                      <td className="px-4 py-3 text-[#616161] text-xs">{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3">
                        {c.crmContactId ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#2E7D32] font-medium"><CheckCircle2 size={11} /> Synced</span>
                        ) : (
                          <button className="text-xs text-[#1565C0] hover:underline inline-flex items-center gap-1">Add to CRM <ArrowRight size={10} /></button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center"><Users size={36} className="mx-auto text-[#E0E0E0] mb-3" /><p className="text-sm text-[#616161]">No customers found</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
