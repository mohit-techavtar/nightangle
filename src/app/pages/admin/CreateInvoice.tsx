import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Check, Plus, X, Search, Calendar, Building,
  Phone, Mail, CreditCard, FileText, Save, Send
} from "lucide-react";

const steps = [
  { id: 1, name: "Tenant Selection", description: "Select billing tenant" },
  { id: 2, name: "Line Items", description: "Add billable services" },
  { id: 3, name: "Calculations", description: "Review amounts" },
  { id: 4, name: "Review & Send", description: "Finalize invoice" },
];

const tenants = [
  { id: "TEN-001", name: "Everest Digital Solutions", email: "billing@everestdigital.com", gst: "09AABCU9603R1ZM" },
  { id: "TEN-002", name: "TechVision Enterprises", email: "billing@techvision.com", gst: "09AABCU9604R1ZN" },
  { id: "TEN-003", name: "CloudScale Solutions", email: "billing@cloudscale.com", gst: "09AABCU9605R1ZO" },
  { id: "TEN-004", name: "DataFlow Systems", email: "billing@dataflow.com", gst: "09AABCU9606R1ZP" },
  { id: "TEN-005", name: "InnovateCorp", email: "billing@innovatecorp.com", gst: "09AABCU9607R1ZQ" },
];

const serviceTemplates = [
  { id: 1, name: "AI Calling Minutes", unit: "minutes", defaultRate: 2.50 },
  { id: 2, name: "WhatsApp Messages", unit: "messages", defaultRate: 0.45 },
  { id: 3, name: "SMS Credits", unit: "SMS", defaultRate: 0.35 },
  { id: 4, name: "Email Campaigns", unit: "emails", defaultRate: 0.15 },
  { id: 5, name: "Cloud Storage", unit: "GB", defaultRate: 20.00 },
  { id: 6, name: "Enterprise License", unit: "month", defaultRate: 2433.00 },
];

interface LineItem {
  id: string;
  service: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export function CreateInvoice() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [searchTenant, setSearchTenant] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("Payment is due within 15 days. Late payments may incur additional charges.");

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTenant.toLowerCase()) ||
    tenant.id.toLowerCase().includes(searchTenant.toLowerCase())
  );

  const addLineItem = (template?: any) => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      service: template?.name || "",
      description: "",
      quantity: 0,
      unit: template?.unit || "",
      rate: template?.defaultRate || 0,
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax - discount;

  const handleNext = () => {
    if (currentStep === 1 && !selectedTenant) {
      alert("Please select a tenant");
      return;
    }
    if (currentStep === 2 && lineItems.length === 0) {
      alert("Please add at least one line item");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndSend = () => {
    alert("Invoice created and sent to " + selectedTenant?.email);
    navigate("/admin/billing/invoices");
  };

  const handleSaveDraft = () => {
    alert("Invoice saved as draft");
    navigate("/admin/billing/invoices");
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing", onClick: () => navigate("/admin/billing") },
          { label: "Invoices", onClick: () => navigate("/admin/billing/invoices") },
          { label: "Create Invoice" }
        ]}
        companyName="OmniCRM Platform"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/billing/invoices")}
              className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#0F1B2D] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Invoices
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save as Draft
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      currentStep > step.id
                        ? 'bg-[#10B981] text-white'
                        : currentStep === step.id
                        ? 'bg-[#1565C0] text-white'
                        : 'bg-[#E5E7EB] text-[#6B7280]'
                    }`}>
                      {currentStep > step.id ? <Check size={20} /> : step.id}
                    </div>
                    <p className={`text-sm font-medium mt-2 ${
                      currentStep >= step.id ? 'text-[#0F1B2D]' : 'text-[#6B7280]'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-4 transition-all ${
                      currentStep > step.id ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            {/* Step 1: Tenant Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F1B2D] mb-4">Select Tenant</h2>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search by tenant name or ID..."
                      value={searchTenant}
                      onChange={(e) => setSearchTenant(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      onClick={() => setSelectedTenant(tenant)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTenant?.id === tenant.id
                          ? 'border-[#1565C0] bg-[#E3F2FD]'
                          : 'border-[#E5E7EB] hover:border-[#1565C0]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#F3F4F6] rounded-lg">
                          <Building size={20} className="text-[#6B7280]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#0F1B2D]">{tenant.name}</p>
                          <p className="text-sm text-[#6B7280] mt-1">{tenant.id}</p>
                          <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-2">
                            <Mail size={12} />
                            {tenant.email}
                          </div>
                          <p className="text-xs text-[#6B7280] mt-1">GST: {tenant.gst}</p>
                        </div>
                        {selectedTenant?.id === tenant.id && (
                          <Check className="w-5 h-5 text-[#1565C0]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Line Items */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#0F1B2D]">Add Line Items</h2>
                  <button
                    onClick={() => addLineItem()}
                    className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Custom Item
                  </button>
                </div>

                {/* Service Templates */}
                <div>
                  <p className="text-sm font-medium text-[#6B7280] mb-3">Quick Add from Templates</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => addLineItem(template)}
                        className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-[#E3F2FD] hover:border-[#1565C0] transition-colors"
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Items Table */}
                {lineItems.length > 0 && (
                  <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Service</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Rate</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Amount</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {lineItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={item.service}
                                onChange={(e) => updateLineItem(item.id, 'service', e.target.value)}
                                placeholder="Service name"
                                className="w-full px-2 py-1 border border-[#E5E7EB] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1565C0]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                placeholder="Description"
                                className="w-full px-2 py-1 border border-[#E5E7EB] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1565C0]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-[#E5E7EB] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1565C0]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                className="w-24 px-2 py-1 border border-[#E5E7EB] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1565C0]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-[#0F1B2D]">₹{item.amount.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeLineItem(item.id)}
                                className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {lineItems.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-[#E5E7EB] rounded-lg">
                    <FileText className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
                    <p className="text-sm text-[#6B7280]">No line items added yet</p>
                    <p className="text-xs text-[#6B7280] mt-1">Add items using templates or custom entries</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Calculations */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#0F1B2D]">Invoice Calculations</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                    />
                  </div>
                </div>

                <div className="p-6 bg-[#F9FAFB] rounded-lg space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-semibold text-[#0F1B2D]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#6B7280]">Tax Rate</span>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-[#E5E7EB] rounded text-sm"
                      />
                      <span className="text-sm text-[#6B7280]">%</span>
                    </div>
                    <span className="font-semibold text-[#0F1B2D]">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Discount</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#6B7280]">₹</span>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-[#E5E7EB] rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-[#E5E7EB] flex justify-between">
                    <span className="font-semibold text-[#0F1B2D]">Total Amount</span>
                    <span className="text-xl font-bold text-[#1565C0]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Add any notes for the client..."
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Send */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[#0F1B2D]">Review Invoice</h2>

                <div className="p-6 bg-[#F9FAFB] rounded-lg space-y-4">
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] mb-1">Billing To</p>
                    <p className="font-semibold text-[#0F1B2D]">{selectedTenant?.name}</p>
                    <p className="text-sm text-[#6B7280]">{selectedTenant?.email}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E5E7EB]">
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] mb-1">Issue Date</p>
                      <p className="text-sm font-semibold text-[#0F1B2D]">{issueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] mb-1">Due Date</p>
                      <p className="text-sm font-semibold text-[#0F1B2D]">{dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] mb-1">Total Amount</p>
                      <p className="text-sm font-semibold text-[#1565C0]">₹{total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-xs font-medium text-[#6B7280] mb-2">Line Items ({lineItems.length})</p>
                    <div className="space-y-2">
                      {lineItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-[#374151]">{item.service}</span>
                          <span className="font-semibold text-[#0F1B2D]">₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#E3F2FD] border border-[#1565C0] rounded-lg p-4">
                  <p className="text-sm font-medium text-[#0F1B2D] mb-2">Ready to send?</p>
                  <p className="text-xs text-[#6B7280]">
                    This invoice will be sent to {selectedTenant?.email} and marked as pending payment.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div className="flex gap-3">
              {currentStep === 4 ? (
                <button
                  onClick={handleSaveAndSend}
                  className="px-6 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  Create & Send Invoice
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
