import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/layout/TopBar";
import {
  ArrowLeft, Download, Send, Edit, Trash2, CheckCircle, AlertCircle,
  Building, Mail, Phone, MapPin, Calendar, Clock, CreditCard,
  FileText, Printer, Copy, MoreVertical
} from "lucide-react";

const invoiceData = {
  id: "INV-2026-1847",
  status: "paid",
  issueDate: "2026-04-01",
  dueDate: "2026-04-15",
  paidDate: "2026-04-12",
  paymentMethod: "Bank Transfer",
  transactionId: "TXN-2026-8934567",
  
  // Tenant Info
  tenant: {
    id: "TEN-001",
    name: "Everest Digital Solutions",
    email: "billing@everestdigital.com",
    phone: "+91 98765 43210",
    address: "Plot 45, Sector 62, Noida, Uttar Pradesh - 201301, India",
    gst: "09AABCU9603R1ZM",
  },
  
  // Platform Info
  platform: {
    name: "OmniCRM Platform",
    address: "Tower B, DLF Cyber City, Gurugram, Haryana - 122002, India",
    email: "billing@omnicrm.com",
    phone: "+91 11 4567 8900",
    gst: "06AABCO1234A1ZT",
    website: "www.omnicrm.com"
  },
  
  // Line Items
  items: [
    {
      id: 1,
      service: "AI Calling Minutes",
      description: "12,340 minutes @ ₹2.50/min",
      quantity: 12340,
      unit: "minutes",
      rate: 2.50,
      amount: 30850
    },
    {
      id: 2,
      service: "WhatsApp Messages",
      description: "8,500 messages @ ₹0.45/msg",
      quantity: 8500,
      unit: "messages",
      rate: 0.45,
      amount: 3825
    },
    {
      id: 3,
      service: "SMS Credits",
      description: "5,200 SMS @ ₹0.35/SMS",
      quantity: 5200,
      unit: "SMS",
      rate: 0.35,
      amount: 1820
    },
    {
      id: 4,
      service: "Email Campaigns",
      description: "25,000 emails @ ₹0.15/email",
      quantity: 25000,
      unit: "emails",
      rate: 0.15,
      amount: 3750
    },
    {
      id: 5,
      service: "Cloud Storage",
      description: "150 GB @ ₹20/GB",
      quantity: 150,
      unit: "GB",
      rate: 20,
      amount: 3000
    },
    {
      id: 6,
      service: "Enterprise License",
      description: "Monthly subscription - 50 users",
      quantity: 1,
      unit: "month",
      rate: 2433,
      amount: 2433
    },
  ],
  
  // Calculations
  subtotal: 45678,
  tax: 8222,
  taxRate: 18,
  discount: 0,
  total: 53900,
  
  // Payment History
  paymentHistory: [
    {
      id: 1,
      date: "2026-04-12",
      amount: 53900,
      method: "Bank Transfer",
      status: "success",
      transactionId: "TXN-2026-8934567",
      note: "Payment received in full"
    }
  ],
  
  notes: "Thank you for your business. Please process payment within 15 days of invoice date to avoid service interruption.",
  terms: "Payment is due within 15 days. Late payments may incur additional charges and service suspension."
};

export function InvoiceDetail() {
  const navigate = useNavigate();
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    alert("Invoice PDF download started");
  };

  const handleSendEmail = () => {
    alert("Invoice email sent to " + invoiceData.tenant.email);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(invoiceData.id);
    alert("Invoice ID copied to clipboard");
  };

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Finance" },
          { label: "Billing", onClick: () => navigate("/admin/billing") },
          { label: "Invoices", onClick: () => navigate("/admin/billing/invoices") },
          { label: invoiceData.id }
        ]}
        companyName="OmniCRM Platform"
        mode="admin"
        userName="Super Admin"
      />

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <div className="p-6 space-y-6">
          {/* Header Actions */}
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
                onClick={handlePrint}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-sm font-medium hover:bg-[#0D47A1] transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                Send to Client
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="p-2 bg-white border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {showActionsMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                      <Edit size={14} />
                      Edit Invoice
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-2">
                      <Copy size={14} />
                      Duplicate
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-[#DC2626] hover:bg-[#FEE2E2] flex items-center gap-2">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Status Banner */}
          {invoiceData.status === "paid" && (
            <div className="bg-[#D1FAE5] border border-[#10B981] rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#065F46]" />
              <div>
                <p className="text-sm font-semibold text-[#065F46]">Payment Received</p>
                <p className="text-xs text-[#065F46] mt-0.5">
                  Paid on {invoiceData.paidDate} via {invoiceData.paymentMethod}
                </p>
              </div>
            </div>
          )}

          {invoiceData.status === "overdue" && (
            <div className="bg-[#FEE2E2] border border-[#DC2626] rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#991B1B]" />
              <div>
                <p className="text-sm font-semibold text-[#991B1B]">Payment Overdue</p>
                <p className="text-xs text-[#991B1B] mt-0.5">
                  This invoice was due on {invoiceData.dueDate}
                </p>
              </div>
              <button className="ml-auto px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-[#B91C1C] transition-colors">
                Send Reminder
              </button>
            </div>
          )}

          {/* Invoice Document */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#0F1B2D] mb-2">INVOICE</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#6B7280]">Invoice ID:</span>
                    <span className="text-sm font-semibold text-[#1565C0]">{invoiceData.id}</span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 text-[#6B7280] hover:text-[#1565C0] transition-colors"
                      title="Copy Invoice ID"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  invoiceData.status === 'paid' 
                    ? 'bg-[#D1FAE5] text-[#065F46]' 
                    : 'bg-[#FEF3C7] text-[#92400E]'
                }`}>
                  {invoiceData.status.toUpperCase()}
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">From</h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-[#0F1B2D]">{invoiceData.platform.name}</p>
                    <p className="text-sm text-[#6B7280]">{invoiceData.platform.address}</p>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Mail size={14} />
                      {invoiceData.platform.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Phone size={14} />
                      {invoiceData.platform.phone}
                    </div>
                    <p className="text-sm text-[#6B7280]">GST: {invoiceData.platform.gst}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Bill To</h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-[#0F1B2D]">{invoiceData.tenant.name}</p>
                    <p className="text-sm text-[#6B7280]">{invoiceData.tenant.address}</p>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Mail size={14} />
                      {invoiceData.tenant.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Phone size={14} />
                      {invoiceData.tenant.phone}
                    </div>
                    <p className="text-sm text-[#6B7280]">GST: {invoiceData.tenant.gst}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-3 gap-6 p-4 bg-[#F9FAFB] rounded-lg">
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-1">Issue Date</p>
                  <p className="text-sm font-semibold text-[#0F1B2D]">{invoiceData.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-[#0F1B2D]">{invoiceData.dueDate}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-1">Amount Due</p>
                  <p className="text-sm font-semibold text-[#1565C0]">₹{invoiceData.total.toLocaleString()}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <table className="w-full">
                  <thead className="border-b-2 border-[#E5E7EB]">
                    <tr>
                      <th className="text-left py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Service
                      </th>
                      <th className="text-right py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="text-right py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="text-right py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {invoiceData.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4">
                          <p className="font-medium text-[#0F1B2D]">{item.service}</p>
                          <p className="text-sm text-[#6B7280] mt-1">{item.description}</p>
                        </td>
                        <td className="py-4 text-right text-sm text-[#6B7280]">
                          {item.quantity.toLocaleString()} {item.unit}
                        </td>
                        <td className="py-4 text-right text-sm text-[#6B7280]">
                          ₹{item.rate.toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-semibold text-[#0F1B2D]">
                          ₹{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Subtotal</span>
                    <span className="font-semibold text-[#0F1B2D]">₹{invoiceData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">GST ({invoiceData.taxRate}%)</span>
                    <span className="font-semibold text-[#0F1B2D]">₹{invoiceData.tax.toLocaleString()}</span>
                  </div>
                  {invoiceData.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Discount</span>
                      <span className="font-semibold text-[#10B981]">-₹{invoiceData.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-[#E5E7EB] flex justify-between">
                    <span className="font-semibold text-[#0F1B2D]">Total Amount</span>
                    <span className="text-xl font-bold text-[#1565C0]">₹{invoiceData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-6 border-t border-[#E5E7EB] space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#0F1B2D] mb-2">Notes</h4>
                  <p className="text-sm text-[#6B7280]">{invoiceData.notes}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0F1B2D] mb-2">Terms & Conditions</h4>
                  <p className="text-sm text-[#6B7280]">{invoiceData.terms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {invoiceData.paymentHistory.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#0F1B2D] mb-4">Payment History</h3>
              <div className="space-y-3">
                {invoiceData.paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#D1FAE5] rounded-lg">
                        <CheckCircle className="w-5 h-5 text-[#065F46]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F1B2D]">
                          ₹{payment.amount.toLocaleString()} via {payment.method}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{payment.note}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#0F1B2D]">{payment.date}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{payment.transactionId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
