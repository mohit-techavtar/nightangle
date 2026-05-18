import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { TopBar } from "../../../components/layout/TopBar";
import { useEcommerce } from "../../../hooks/useEcommerce";
import type { OrderStatus } from "../../../hooks/useEcommerce";
import {
  ShoppingCart, Search, Filter, Download, Eye, Edit3, X, ShoppingBag, Globe,
  ChevronRight, Mail, Phone, MapPin, Calendar, CreditCard, Package, User,
  CheckCircle2, Clock, Truck, XCircle, RotateCcw, AlertCircle
} from "lucide-react";

const STATUS_META: Record<OrderStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  pending:    { label: "Pending",    bg: "bg-[#FFF8E1]", text: "text-[#F57F17]", icon: Clock },
  processing: { label: "Processing", bg: "bg-[#E3F2FD]", text: "text-[#1565C0]", icon: Package },
  shipped:    { label: "Shipped",    bg: "bg-[#E1F5FE]", text: "text-[#0277BD]", icon: Truck },
  delivered:  { label: "Delivered",  bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", icon: CheckCircle2 },
  cancelled:  { label: "Cancelled",  bg: "bg-[#FFEBEE]", text: "text-[#C62828]", icon: XCircle },
  refunded:   { label: "Refunded",   bg: "bg-[#FFEBEE]", text: "text-[#C62828]", icon: RotateCcw },
  "on-hold":  { label: "On Hold",    bg: "bg-[#F5F5F5]", text: "text-[#616161]", icon: AlertCircle },
};

export function EcommerceOrders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orders, stores, updateOrderStatus } = useEcommerce();
  const initialStoreId = searchParams.get("storeId") || "all";
  const initialStatus = searchParams.get("status") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState<string>(initialStoreId);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q);
    const matchStore = storeFilter === "all" || o.storeId === storeFilter;
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStore && matchStatus;
  }), [orders, searchQuery, storeFilter, statusFilter]);

  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;

  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === "pending").length,
    processing: filteredOrders.filter(o => o.status === "processing").length,
    revenue: filteredOrders.filter(o => o.financialStatus === "paid").reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "E-Commerce" }, { label: "Orders" }]} mode="customer" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                  <ShoppingCart size={20} className="text-[#1565C0]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0F1B2D]">Orders</h2>
              </div>
              <p className="text-sm text-[#616161]">All orders synced from your connected stores</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-[#E0E0E0] bg-white text-[#212121] text-sm hover:bg-[#FAFAFA]">
              <Download size={14} /> Export
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Total Orders</div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.total}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Pending</div>
              <div className="text-2xl font-semibold text-[#F57F17]">{stats.pending}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Processing</div>
              <div className="text-2xl font-semibold text-[#1565C0]">{stats.processing}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="text-xs text-[#616161] uppercase tracking-wide mb-1">Revenue (Paid)</div>
              <div className="text-2xl font-semibold text-[#2E7D32]">${stats.revenue.toFixed(0)}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Order #, customer name, email..." className="w-full pl-9 pr-3 h-10 border border-[#E0E0E0] rounded-md text-sm" />
            </div>
            <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)} className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
              <option value="all">All Stores</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
              <option value="all">All Status</option>
              {(Object.keys(STATUS_META) as OrderStatus[]).map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </select>
          </div>

          {/* Orders table */}
          <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Store</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {filteredOrders.map(order => {
                  const meta = STATUS_META[order.status];
                  const StatusIcon = meta.icon;
                  const isShopify = order.platform === "shopify";
                  return (
                    <tr key={order.id} className="hover:bg-[#FAFAFA] cursor-pointer" onClick={() => setSelectedOrderId(order.id)}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1565C0]">{order.orderNumber}</div>
                        <div className="text-xs text-[#9E9E9E]">{order.items.length} item{order.items.length > 1 ? "s" : ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#212121]">{order.customer.name}</div>
                        <div className="text-xs text-[#9E9E9E]">{order.customer.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded ${isShopify ? "bg-[#95BF47]/20" : "bg-[#21759B]/20"} flex items-center justify-center`}>
                            {isShopify ? <ShoppingBag size={11} className="text-[#5E8E3E]" /> : <Globe size={11} className="text-[#21759B]" />}
                          </div>
                          <span className="text-[#212121]">{order.storeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#616161]">{new Date(order.placedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</td>
                      <td className="px-4 py-3 text-right font-semibold text-[#212121]">{order.currency} {order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${meta.bg} ${meta.text}`}>
                          <StatusIcon size={11} /> {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedOrderId(order.id); }} className="p-1.5 rounded hover:bg-[#E3F2FD] text-[#1565C0]"><Eye size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center"><ShoppingCart size={36} className="mx-auto text-[#E0E0E0] mb-3" /><p className="text-sm text-[#616161]">No orders match your filters</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-[#E0E0E0] p-5 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-semibold text-[#212121]">{selectedOrder.orderNumber}</h3>
                <div className="text-xs text-[#616161] mt-0.5">External ID: {selectedOrder.externalOrderId}</div>
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="p-2 rounded hover:bg-[#F5F5F5] text-[#616161]"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${STATUS_META[selectedOrder.status].bg} ${STATUS_META[selectedOrder.status].text}`}>
                  {STATUS_META[selectedOrder.status].label}
                </span>
                <select value={selectedOrder.status} onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)} className="h-8 border border-[#E0E0E0] rounded-md px-2 text-xs bg-white">
                  {(Object.keys(STATUS_META) as OrderStatus[]).map(s => <option key={s} value={s}>Change to: {STATUS_META[s].label}</option>)}
                </select>
                <div className="ml-auto text-xs text-[#616161]">
                  <span className="capitalize">{selectedOrder.financialStatus}</span> · <span className="capitalize">{selectedOrder.fulfillmentStatus}</span>
                </div>
              </div>

              {/* Customer */}
              <Section icon={User} title="Customer">
                <div className="space-y-1 text-sm">
                  <div className="font-medium text-[#212121]">{selectedOrder.customer.name}</div>
                  <a href={`mailto:${selectedOrder.customer.email}`} className="text-[#1565C0] hover:underline flex items-center gap-1"><Mail size={12} /> {selectedOrder.customer.email}</a>
                  {selectedOrder.customer.phone && <a href={`tel:${selectedOrder.customer.phone}`} className="text-[#1565C0] hover:underline flex items-center gap-1"><Phone size={12} /> {selectedOrder.customer.phone}</a>}
                </div>
              </Section>

              {/* Items */}
              <Section icon={Package} title={`Line Items (${selectedOrder.items.length})`}>
                <div className="border border-[#E0E0E0] rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs font-medium text-[#616161] uppercase">Product</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-[#616161] uppercase">Qty</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-[#616161] uppercase">Price</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-[#616161] uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E0E0]">
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2">
                            <div className="font-medium text-[#212121]">{item.productName}</div>
                            {item.sku && <div className="text-xs text-[#9E9E9E]">SKU: {item.sku}</div>}
                          </td>
                          <td className="px-3 py-2 text-right text-[#616161]">{item.quantity}</td>
                          <td className="px-3 py-2 text-right text-[#616161]">{selectedOrder.currency} {item.unitPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-medium text-[#212121]">{selectedOrder.currency} {item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-3 space-y-1 text-sm border-t border-[#E0E0E0] pt-3 max-w-xs ml-auto">
                  <div className="flex justify-between text-[#616161]"><span>Subtotal</span><span>{selectedOrder.currency} {selectedOrder.subtotal.toFixed(2)}</span></div>
                  {selectedOrder.discount > 0 && <div className="flex justify-between text-[#2E7D32]"><span>Discount</span><span>-{selectedOrder.currency} {selectedOrder.discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-[#616161]"><span>Shipping</span><span>{selectedOrder.currency} {selectedOrder.shippingCost.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[#616161]"><span>Tax</span><span>{selectedOrder.currency} {selectedOrder.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold text-[#212121] pt-1 border-t border-[#E0E0E0]"><span>Total</span><span>{selectedOrder.currency} {selectedOrder.total.toFixed(2)}</span></div>
                </div>
              </Section>

              {/* Shipping */}
              {selectedOrder.shippingAddress && (
                <Section icon={MapPin} title="Shipping Address">
                  <div className="text-sm text-[#212121] leading-relaxed">
                    {selectedOrder.shippingAddress.line1}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                    <span className="text-[#616161]">{selectedOrder.shippingAddress.country}</span>
                  </div>
                </Section>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <Section icon={AlertCircle} title="Notes">
                  <p className="text-sm text-[#616161] leading-relaxed">{selectedOrder.notes}</p>
                </Section>
              )}

              {/* Source */}
              <Section icon={ShoppingBag} title="Source">
                <div className="text-sm space-y-1">
                  <div><span className="text-[#9E9E9E]">Store:</span> <span className="text-[#212121]">{selectedOrder.storeName}</span></div>
                  <div><span className="text-[#9E9E9E]">Platform:</span> <span className="text-[#212121] capitalize">{selectedOrder.platform}</span></div>
                  <div><span className="text-[#9E9E9E]">Placed:</span> <span className="text-[#212121]">{new Date(selectedOrder.placedAt).toLocaleString()}</span></div>
                  <div><span className="text-[#9E9E9E]">Updated:</span> <span className="text-[#212121]">{new Date(selectedOrder.updatedAt).toLocaleString()}</span></div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[#212121] mb-2 inline-flex items-center gap-2"><Icon size={14} className="text-[#1565C0]" /> {title}</h4>
      {children}
    </div>
  );
}
