import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import { useDeals, type DealLineItem } from "../../hooks/useDeals";
import { useOrgHierarchy } from "../../hooks/useOrgHierarchy";
import {
  ArrowLeft, Plus, Trash2, Info, Settings2, ChevronUp, IndianRupee,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Task 2 — Deal creation revamped to mirror the Zoho CRM
// "Create Deal" layout: Deal Information, Address, Product
// Information (line items), Inquiry Info, Shipping/Logistic,
// Shipping & Other Charges, Financial Charges, Guidelines,
// MISC, Description. Persists via useDeals (core + extended).
// ============================================================

type Vals = Record<string, any>;

const SECTION = "text-[15px] font-semibold text-[#212121] mb-4 pb-2 border-b border-[#E0E0E0]";
const LABEL = "text-sm text-[#616161] text-right pr-4 pt-2.5 col-span-1";
const inputCls = "w-full h-10 px-3 border border-[#E0E0E0] rounded-md text-sm outline-none focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/15";

function Row({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-start gap-1 mb-3">
      <label className={LABEL}>{required && <span className="text-[#C62828] mr-0.5">*</span>}{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}
function Field({ v, set, name, type = "text", placeholder }: { v: Vals; set: (k: string, val: any) => void; name: string; type?: string; placeholder?: string }) {
  return <input type={type} value={v[name] ?? ""} placeholder={placeholder} onChange={(e) => set(name, e.target.value)} className={inputCls} />;
}
function Pick({ v, set, name, options, placeholder = "-None-" }: { v: Vals; set: (k: string, val: any) => void; name: string; options: string[]; placeholder?: string }) {
  return (
    <select value={v[name] ?? ""} onChange={(e) => set(name, e.target.value)} className={inputCls}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function Money({ v, set, name }: { v: Vals; set: (k: string, val: any) => void; name: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] text-sm">$</span>
      <input type="number" value={v[name] ?? ""} onChange={(e) => set(name, e.target.value)} className={`${inputCls} pl-7`} />
    </div>
  );
}

const FINANCIAL_ROWS = ["Insurance", "Local Transport", "Local Clearing", "Ware Housing", "Packing", "Load and Unload", "Currency Exchange", "Other", "Container Weight", "Shipping Instruction"];

export function CreateDealEnhanced() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");
  const { createDeal, updateDeal, getDealById, pipelines, products } = useDeals();
  const { users } = useOrgHierarchy();

  const existing = editId ? getDealById(editId) : null;
  const [v, setV] = useState<Vals>(() => ({
    dealOwner: existing?.ownerName || "sanjay",
    name: existing?.name || "",
    pipeline: existing?.pipelineName || pipelines[0]?.name || "",
    stage: existing?.stageName || pipelines[0]?.stages[0]?.name || "Qualification",
    currency: existing?.currency || "USD",
    probability: existing?.probability ?? 10,
    estimatedValue: existing?.estimatedValue ?? "",
    country: "Nepal",
    ...(existing?.extended || {}),
  }));
  const [lineItems, setLineItems] = useState<Partial<DealLineItem>[]>(existing?.lineItems?.length ? existing.lineItems : [{ productName: "", quantity: 1 }]);
  const [financial, setFinancial] = useState<Record<string, { currency: string; rate: string; qty: string }>>({});

  const set = (k: string, val: any) => setV((p) => ({ ...p, [k]: val }));
  const pipelineObj = pipelines.find((p) => p.name === v.pipeline) || pipelines[0];
  const stageNames = useMemo(() => pipelineObj?.stages.map((s) => s.name) ?? [], [pipelineObj]);

  const addRow = () => setLineItems((p) => [...p, { productName: "", quantity: 1 }]);
  const rmRow = (i: number) => setLineItems((p) => p.filter((_, idx) => idx !== i));
  const setRow = (i: number, k: string, val: any) => setLineItems((p) => p.map((r, idx) => (idx === i ? { ...r, [k]: val } : r)));

  const save = () => {
    if (!v.name?.trim()) { toast.error("Deal Name is required"); return; }
    const stage = pipelineObj?.stages.find((s) => s.name === v.stage);
    const core = {
      name: v.name, leadId: "", leadName: v.contactName || "", companyName: v.accountName || "",
      pipelineId: pipelineObj?.id || "", pipelineName: pipelineObj?.name || "",
      stageId: stage?.id || "", stageName: stage?.name || v.stage,
      owner: "current-user", ownerName: v.dealOwner, status: "open" as const, dealType: "new-business" as const,
      currency: v.currency, estimatedValue: Number(v.estimatedValue) || 0, probability: Number(v.probability) || 0,
      expectedCloseDate: v.closingDate || new Date().toISOString(),
      lineItems: lineItems.filter((l) => l.productName).map((l, i) => ({
        id: `li-${i}`, productId: "", productName: l.productName!, quantity: Number(l.quantity) || 1,
        unitPrice: Number((l as any).unitPrice) || 0, discount: 0, discountType: "percentage" as const,
        tax: 0, total: (Number((l as any).unitPrice) || 0) * (Number(l.quantity) || 1),
      })),
      attribution: {}, tags: [], notes: v.description || "",
      extended: { ...v, financial },
    };
    if (existing) { updateDeal(existing.id, core as any); toast.success("Deal updated"); }
    else { const d = createDeal(core as any); toast.success(`Deal ${d.name} created`); }
    navigate("/tenant/deals/list");
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F6F8]">
      <TopBar breadcrumbs={[{ label: "CRM" }, { label: "Deals", path: "/tenant/deals/list" }, { label: existing ? "Edit Deal" : "Create Deal" }]} companyName="Everest Digital Solutions" mode="customer" userName="Rajesh Sharma" userEmail="rajesh@everestdigital.com" userInitials="RS" />

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E0E0E0] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-[#F5F5F5] text-[#616161]"><ArrowLeft size={18} /></button>
          <h1 className="text-lg font-semibold text-[#212121]">{existing ? "Edit Deal" : "Create Deal"}</h1>
          <button onClick={() => navigate("/tenant/crm-customization")} className="text-sm text-[#1565C0] flex items-center gap-1 hover:underline"><Settings2 size={14} /> Edit Page Layout</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="px-4 h-9 rounded-md border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">Cancel</button>
          <button onClick={save} className="px-4 h-9 rounded-md border border-[#E0E0E0] text-sm font-medium text-[#1565C0] hover:bg-[#E3F2FD]">Save and New</button>
          <button onClick={save} className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]">Save</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Deal Information */}
          <Card>
            <h3 className={SECTION}>Deal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              <div>
                <Row label="Deal Owner"><Pick v={v} set={set} name="dealOwner" options={users.map((u) => u.name)} placeholder="Select owner" /></Row>
                <Row label="Deal Name" required><Field v={v} set={set} name="name" /></Row>
                <Row label="Inquiry Type"><Pick v={v} set={set} name="inquiryType" options={["Product", "Service", "Quote", "Partnership"]} /></Row>
                <Row label="Agent"><Field v={v} set={set} name="agent" /></Row>
                <Row label="Account Name"><Field v={v} set={set} name="accountName" /></Row>
                <Row label="Contact Name" required><Field v={v} set={set} name="contactName" /></Row>
                <Row label="Email Id"><Field v={v} set={set} name="email" type="email" /></Row>
                <Row label="Mobile No."><Field v={v} set={set} name="mobile" /></Row>
                <Row label="Social Lead ID"><Field v={v} set={set} name="socialLeadId" /></Row>
                <Row label="Industry"><Pick v={v} set={set} name="industry" options={["Technology", "Finance", "Healthcare", "Retail", "Manufacturing"]} /></Row>
                <Row label="ISD Code"><Pick v={v} set={set} name="isdCode" options={["+977 Nepal", "+91 India", "+1 USA", "+971 UAE"]} /></Row>
                <Row label="Currency"><Pick v={v} set={set} name="currency" options={["USD", "NPR", "INR", "AED"]} placeholder="USD" /></Row>
                <Row label="Exchange_Rate"><Money v={v} set={set} name="exchangeRateField" /></Row>
              </div>
              <div>
                <Row label="Case Code"><Field v={v} set={set} name="caseCode" /></Row>
                <Row label="Amount"><Money v={v} set={set} name="estimatedValue" /></Row>
                <Row label="Closing Date" required><Field v={v} set={set} name="closingDate" type="date" /></Row>
                <Row label="Pipeline" required><Pick v={v} set={set} name="pipeline" options={pipelines.map((p) => p.name)} placeholder="Select pipeline" /></Row>
                <Row label="Stage" required><Pick v={v} set={set} name="stage" options={stageNames} placeholder="Qualification" /></Row>
                <Row label="Inquiry For"><Pick v={v} set={set} name="inquiryFor" options={["Self", "Client", "Reseller"]} /></Row>
                <Row label="Probability (%)"><Field v={v} set={set} name="probability" type="number" /></Row>
                <Row label="Expected Revenue"><Money v={v} set={set} name="expectedRevenue" /></Row>
                <Row label="Due Date"><Field v={v} set={set} name="dueDate" type="date" /></Row>
                <Row label="Exchange Rate"><Field v={v} set={set} name="exchangeRate" placeholder="1" /></Row>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card>
            <h3 className={SECTION}>Address Information</h3>
            <div className="border border-[#E0E0E0] rounded-lg p-4 max-w-2xl">
              <div className="text-xs font-semibold text-[#9E9E9E] uppercase mb-3">Address</div>
              <Row label="Country / Region"><Pick v={v} set={set} name="country" options={["Nepal", "India", "USA", "UAE", "Singapore"]} placeholder="Nepal" /></Row>
              <Row label="Flat / House No./ Building / Apartment Name"><Field v={v} set={set} name="flat" /></Row>
              <Row label="Street Address"><Field v={v} set={set} name="street" /></Row>
              <Row label="City"><Field v={v} set={set} name="city" /></Row>
              <Row label="State / Province"><Pick v={v} set={set} name="state" options={["Bagmati", "Gandaki", "Maharashtra", "Karnataka"]} /></Row>
              <Row label="Zip / Postal Code"><Field v={v} set={set} name="zip" /></Row>
              <Row label="Coordinates">
                <div className="flex gap-2">
                  <input value={v.lat ?? ""} onChange={(e) => set("lat", e.target.value)} placeholder="Latitude" className={inputCls} />
                  <input value={v.lng ?? ""} onChange={(e) => set("lng", e.target.value)} placeholder="Longitude" className={inputCls} />
                </div>
              </Row>
            </div>
          </Card>

          {/* Product Information — line items */}
          <Card>
            <h3 className={SECTION}>Product Information</h3>
            <div className="overflow-x-auto border border-[#E0E0E0] rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFA] text-left text-[#616161]">
                  <tr>
                    <th className="px-3 py-2 font-medium"><span className="text-[#C62828]">*</span> Product Name</th>
                    <th className="px-3 py-2 font-medium">Description</th>
                    <th className="px-3 py-2 font-medium">Alt Quantity</th>
                    <th className="px-3 py-2 font-medium">Alt UOM</th>
                    <th className="px-3 py-2 font-medium"><span className="text-[#C62828]">*</span> Quantity</th>
                    <th className="px-3 py-2 font-medium">Unit Price</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((li, i) => (
                    <tr key={i} className="border-t border-[#F0F0F0]">
                      <td className="px-2 py-1.5"><input list="prod-list" value={li.productName ?? ""} onChange={(e) => setRow(i, "productName", e.target.value)} className={`${inputCls} h-9`} /></td>
                      <td className="px-2 py-1.5"><input value={(li as any).description ?? ""} onChange={(e) => setRow(i, "description", e.target.value)} className={`${inputCls} h-9`} /></td>
                      <td className="px-2 py-1.5"><input value={(li as any).altQty ?? ""} onChange={(e) => setRow(i, "altQty", e.target.value)} className={`${inputCls} h-9 w-24`} /></td>
                      <td className="px-2 py-1.5"><input value={(li as any).altUom ?? ""} onChange={(e) => setRow(i, "altUom", e.target.value)} className={`${inputCls} h-9 w-24`} /></td>
                      <td className="px-2 py-1.5"><input type="number" value={li.quantity ?? 1} onChange={(e) => setRow(i, "quantity", e.target.value)} className={`${inputCls} h-9 w-24`} /></td>
                      <td className="px-2 py-1.5"><input type="number" value={(li as any).unitPrice ?? ""} onChange={(e) => setRow(i, "unitPrice", e.target.value)} className={`${inputCls} h-9 w-28`} /></td>
                      <td className="px-2 py-1.5">{lineItems.length > 1 && <button onClick={() => rmRow(i)} className="p-1.5 text-[#C62828] hover:bg-[#FFEBEE] rounded"><Trash2 size={15} /></button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <datalist id="prod-list">{products.map((p) => <option key={p.id} value={p.name} />)}</datalist>
            </div>
            <button onClick={addRow} className="mt-3 px-3 h-9 rounded-md border border-[#1565C0] text-[#1565C0] text-sm font-medium flex items-center gap-1.5 hover:bg-[#E3F2FD]"><Plus size={15} /> Add row</button>
          </Card>

          {/* Inquiry Info */}
          <Card>
            <h3 className={SECTION}>Inquiry Info</h3>
            <TwoCol v={v} set={set} left={[["Product description", "prodDesc"], ["Quantity", "inqQty"], ["Current Price", "currentPrice"], ["Company", "inqCompany"], ["Role", "role"]]} right={[["Product Category", "prodCat"], ["Frequency", "freq"], ["Target Price", "targetPrice"], ["City & Country", "cityCountry"], ["Preferred Call Time", "callTime"]]} />
          </Card>

          {/* Shipping / Logistic */}
          <Card>
            <h3 className={SECTION}>Shipping / Logistic</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              <div>
                <Row label="Transport Type"><Pick v={v} set={set} name="transportType" options={["Air", "Sea", "Road", "Rail"]} /></Row>
                <Row label="Size"><Pick v={v} set={set} name="size" options={["20ft", "40ft", "LCL"]} /></Row>
                <Row label="CBM"><Field v={v} set={set} name="cbm" /></Row>
                <Row label="Source Port"><Field v={v} set={set} name="sourcePort" /></Row>
                <Row label="Destination Port"><Field v={v} set={set} name="destPort" /></Row>
              </div>
              <div>
                <Row label="Container type"><Pick v={v} set={set} name="containerType" options={["Standard", "Refrigerated", "Open Top"]} /></Row>
                <Row label="Weight"><Field v={v} set={set} name="weight" /></Row>
                <Row label="Packages"><Field v={v} set={set} name="packages" /></Row>
                <Row label="In Transit Port"><Field v={v} set={set} name="transitPort" /></Row>
              </div>
            </div>
          </Card>

          {/* Shipping & Other Charges */}
          <Card>
            <h3 className={SECTION}>Shipping &amp; Other Charges</h3>
            <div className="max-w-xl">
              <Row label="Shipping Rate"><Field v={v} set={set} name="shippingRate" /></Row>
              <Row label="Service Rate"><Field v={v} set={set} name="serviceRate" /></Row>
              <Row label="QC Rate"><Field v={v} set={set} name="qcRate" /></Row>
            </div>
          </Card>

          {/* Financial Charges table */}
          <Card>
            <h3 className={SECTION}>Financial Charges</h3>
            <div className="overflow-x-auto border border-[#E0E0E0] rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFA] text-left text-[#616161]">
                  <tr><th className="px-3 py-2 font-medium">Charges</th><th className="px-3 py-2 font-medium">Charges Currency</th><th className="px-3 py-2 font-medium">Rate($)</th><th className="px-3 py-2 font-medium">Quantity</th><th className="px-3 py-2 font-medium">Amount</th></tr>
                </thead>
                <tbody>
                  {FINANCIAL_ROWS.map((charge) => {
                    const row = financial[charge] || { currency: "", rate: "", qty: "" };
                    const amount = (Number(row.rate) || 0) * (Number(row.qty) || 0);
                    const upd = (k: string, val: string) => setFinancial((p) => ({ ...p, [charge]: { ...row, [k]: val } }));
                    return (
                      <tr key={charge} className="border-t border-[#F0F0F0]">
                        <td className="px-3 py-1.5"><div className="px-3 h-9 flex items-center rounded-md bg-[#F5F5F5] text-[#212121]">{charge}</div></td>
                        <td className="px-2 py-1.5"><select value={row.currency} onChange={(e) => upd("currency", e.target.value)} className={`${inputCls} h-9`}><option value="">-None-</option>{["USD", "NPR", "INR"].map((c) => <option key={c}>{c}</option>)}</select></td>
                        <td className="px-2 py-1.5"><input value={row.rate} onChange={(e) => upd("rate", e.target.value)} className={`${inputCls} h-9 w-28`} /></td>
                        <td className="px-2 py-1.5"><input value={row.qty} onChange={(e) => upd("qty", e.target.value)} className={`${inputCls} h-9 w-28`} /></td>
                        <td className="px-2 py-1.5"><div className="px-3 h-9 flex items-center rounded-md bg-[#FAFAFA] text-[#616161] w-32">{amount ? amount.toLocaleString() : "—"}</div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Guidelines */}
          <Card>
            <h3 className={SECTION}>Guidelines</h3>
            <TwoCol v={v} set={set}
              left={[["Brand", "brand"], ["BarCode", "barcode"], ["QC Guideline", "qcGuideline"], ["Shipping Guidelines", "shipGuide"], ["Sampling guideline", "sampleGuide"]]}
              right={[["Branding guideline", "brandingGuide"], ["Clearing", "clearing"], ["Tag/s", "tags"], ["Packing Guideline", "packGuide"]]} />
          </Card>

          {/* MISC */}
          <Card>
            <h3 className={SECTION}>MISC</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              <div>
                <Row label="Advance Amount"><Money v={v} set={set} name="advanceAmount" /></Row>
                <Row label="Transaction ID"><Field v={v} set={set} name="txnId" /></Row>
                <Row label="Expected Shipment Date"><Field v={v} set={set} name="expShipDate" type="date" /></Row>
                <Row label="Quality Inspection Review"><Field v={v} set={set} name="qcReview" /></Row>
                <Row label="Final Payment Mode"><Pick v={v} set={set} name="finalPayMode" options={["Wire", "LC", "Cash", "Cheque"]} /></Row>
              </div>
              <div>
                <Row label="Advance Payment Mode"><Pick v={v} set={set} name="advancePayMode" options={["Wire", "LC", "Cash"]} /></Row>
                <Row label="Production Quantity"><Field v={v} set={set} name="prodQty" /></Row>
                <Row label="Actual Shipped Date"><Field v={v} set={set} name="actualShipDate" type="date" /></Row>
                <Row label="Inspection Status"><Pick v={v} set={set} name="inspStatus" options={["Pending", "Passed", "Failed"]} /></Row>
                <Row label="Final Payment Txn ID"><Field v={v} set={set} name="finalTxnId" /></Row>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h3 className={SECTION}>Description Information</h3>
            <Row label="Description"><textarea rows={3} value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} className={`${inputCls} h-auto py-2`} /></Row>
            <Row label="Finalised Quote"><Field v={v} set={set} name="finalQuote" /></Row>
          </Card>

          <div className="flex items-center justify-between pb-10">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-sm text-[#1565C0] flex items-center gap-1 hover:underline"><ChevronUp size={15} /> Go to top</button>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="px-4 h-9 rounded-md border border-[#E0E0E0] text-sm font-medium text-[#616161] hover:bg-[#F5F5F5]">Cancel</button>
              <button onClick={save} className="px-5 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-[#E0E0E0] rounded-xl p-6">{children}</div>;
}
function TwoCol({ v, set, left, right }: { v: Vals; set: (k: string, val: any) => void; left: [string, string][]; right: [string, string][] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
      <div>{left.map(([label, name]) => <Row key={name} label={label}><Field v={v} set={set} name={name} /></Row>)}</div>
      <div>{right.map(([label, name]) => <Row key={name} label={label}><Field v={v} set={set} name={name} /></Row>)}</div>
    </div>
  );
}
