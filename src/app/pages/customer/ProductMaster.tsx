import React, { useState, useMemo } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { useDeals } from "../../hooks/useDeals";
import type { Product } from "../../hooks/useDeals";
import {
  Package, Plus, Search, Edit3, Trash2, X, DollarSign, CheckCircle2,
  Download, Upload, Layers, ToggleLeft, ToggleRight, Copy
} from "lucide-react";

interface ProductFormState {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  currency: string;
  isActive: boolean;
  sku?: string;
  unit?: string;
  taxRate?: number;
}

const DEFAULT_FORM: ProductFormState = {
  name: "", description: "", category: "Software", basePrice: 0,
  currency: "USD", isActive: true, sku: "", unit: "each", taxRate: 0,
};

const CATEGORIES = ["Software", "Hardware", "Services", "Add-on", "Subscription", "Training", "Other"];
const CURRENCIES = ["USD", "INR", "EUR", "GBP", "NPR", "AED"];
const UNITS = ["each", "hour", "day", "month", "year", "license", "user", "GB"];

export function ProductMaster() {
  const { products, createProduct, updateProduct, deleteProduct } = useDeals();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(DEFAULT_FORM);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "active" && p.isActive) ||
      (statusFilter === "inactive" && !p.isActive);
    return matchSearch && matchCat && matchStatus;
  }), [products, searchQuery, categoryFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.isActive).length,
    categories: new Set(products.map(p => p.category)).size,
    totalValue: products.reduce((sum, p) => sum + p.basePrice, 0),
  }), [products]);

  const openCreate = () => { setEditingProduct(null); setForm(DEFAULT_FORM); setShowForm(true); };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, description: product.description, category: product.category, basePrice: product.basePrice, currency: product.currency, isActive: product.isActive });
    setShowForm(true);
  };

  const handleDuplicate = (product: Product) => createProduct({ ...product, name: `${product.name} (Copy)` });

  const handleSubmit = () => {
    if (!form.name.trim()) { alert("Product name is required"); return; }
    if (form.basePrice < 0) { alert("Price cannot be negative"); return; }
    if (editingProduct) updateProduct(editingProduct.id, form);
    else createProduct(form);
    setShowForm(false); setEditingProduct(null); setForm(DEFAULT_FORM);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    deleteProduct(id);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleToggleActive = (product: Product) => updateProduct(product.id, { isActive: !product.isActive });

  const toggleSelect = (id: string) => setSelectedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProducts.map(p => p.id)));
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} product(s)?`)) return;
    selectedIds.forEach(id => deleteProduct(id));
    setSelectedIds(new Set());
  };

  return (
    <>
      <TopBar breadcrumbs={[{ label: "CRM Setup" }, { label: "Product Master" }]} mode="customer" />
      <div className="flex-1 overflow-auto bg-[#F5F5F5]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center"><Package size={20} className="text-[#1565C0]" /></div>
                <h2 className="text-2xl font-semibold text-[#0F1B2D]">Product Master</h2>
              </div>
              <p className="text-sm text-[#616161] ml-13">Manage product catalog, pricing, and SKUs for deals and quotes</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-3 h-10 rounded-md border border-[#E0E0E0] bg-white text-[#616161] text-sm hover:bg-[#F5F5F5]"><Upload size={16} /> Import</button>
              <button className="inline-flex items-center gap-2 px-3 h-10 rounded-md border border-[#E0E0E0] bg-white text-[#616161] text-sm hover:bg-[#F5F5F5]"><Download size={16} /> Export</button>
              <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]"><Plus size={16} /> New Product</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#616161] uppercase tracking-wide">Total Products</span><Package size={16} className="text-[#9E9E9E]" /></div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.total}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#616161] uppercase tracking-wide">Active</span><CheckCircle2 size={16} className="text-[#2E7D32]" /></div>
              <div className="text-2xl font-semibold text-[#2E7D32]">{stats.active}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#616161] uppercase tracking-wide">Categories</span><Layers size={16} className="text-[#9E9E9E]" /></div>
              <div className="text-2xl font-semibold text-[#212121]">{stats.categories}</div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-[#616161] uppercase tracking-wide">Catalog Value</span><DollarSign size={16} className="text-[#9E9E9E]" /></div>
              <div className="text-2xl font-semibold text-[#212121]">${stats.totalValue.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-3 h-10 border border-[#E0E0E0] rounded-md text-sm" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
              <option value="all">All Categories</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
              <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
            {selectedIds.size > 0 && (
              <button onClick={handleBulkDelete} className="inline-flex items-center gap-2 px-3 h-10 rounded-md bg-[#FFEBEE] text-[#C62828] text-sm border border-[#FFCDD2] hover:bg-[#FFCDD2]">
                <Trash2 size={14} /> Delete ({selectedIds.size})
              </button>
            )}
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
                <tr>
                  <th className="px-4 py-3 w-10"><input type="checkbox" onChange={toggleSelectAll} checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length} className="accent-[#1565C0]" /></th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Category</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Base Price</th>
                  <th className="text-left px-4 py-3 font-medium text-[#616161] text-xs uppercase">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-[#616161] text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelect(product.id)} className="accent-[#1565C0]" /></td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#212121]">{product.name}</div>
                      <div className="text-xs text-[#9E9E9E] mt-0.5 line-clamp-1">{product.description}</div>
                    </td>
                    <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]">{product.category}</span></td>
                    <td className="px-4 py-3 text-right font-medium text-[#212121]">{product.currency} {product.basePrice.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(product)} className="inline-flex items-center gap-1.5">
                        {product.isActive
                          ? <><ToggleRight size={20} className="text-[#2E7D32]" /><span className="text-xs font-medium text-[#2E7D32]">Active</span></>
                          : <><ToggleLeft size={20} className="text-[#9E9E9E]" /><span className="text-xs font-medium text-[#9E9E9E]">Inactive</span></>}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(product)} className="p-1.5 rounded hover:bg-[#E3F2FD] text-[#1565C0]"><Edit3 size={14} /></button>
                        <button onClick={() => handleDuplicate(product)} className="p-1.5 rounded hover:bg-[#F5F5F5] text-[#616161]"><Copy size={14} /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded hover:bg-[#FFEBEE] text-[#C62828]"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center"><Package size={36} className="mx-auto text-[#E0E0E0] mb-3" /><p className="text-sm text-[#616161]">No products found</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E0E0E0] sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-[#212121]">{editingProduct ? "Edit Product" : "Create New Product"}</h3>
              <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. CRM Enterprise" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm focus:border-[#1565C0] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">SKU</label>
                  <input type="text" value={form.sku || ""} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="CRM-ENT-001" className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Base Price *</label>
                  <input type="number" min="0" step="0.01" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: parseFloat(e.target.value) || 0 })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Currency</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-1">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full h-10 border border-[#E0E0E0] rounded-md px-3 text-sm bg-white">
                    {UNITS.map(u => <option key={u} value={u}>per {u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-1">Tax Rate (%)</label>
                <input type="number" min="0" max="100" step="0.01" value={form.taxRate || 0} onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })} className="w-full max-w-xs h-10 border border-[#E0E0E0] rounded-md px-3 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#212121] cursor-pointer pt-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#1565C0] w-4 h-4" />
                <span>Active</span><span className="text-xs text-[#616161]">(visible when adding to deals)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-[#E0E0E0] sticky bottom-0 bg-white">
              <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="h-10 px-4 rounded-md border border-[#E0E0E0] text-[#616161] text-sm hover:bg-[#F5F5F5]">Cancel</button>
              <button onClick={handleSubmit} className="h-10 px-5 rounded-md bg-[#1565C0] text-white text-sm hover:bg-[#0D47A1]">{editingProduct ? "Save Changes" : "Create Product"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
