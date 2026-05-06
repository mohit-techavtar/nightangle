import { useNavigate, useParams } from "react-router";
import { useBilling } from "../../hooks/useBilling";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Printer,
} from "lucide-react";

export function InvoiceDetail() {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { getInvoiceById, getBalanceByTenant } = useBilling();

  const invoice = getInvoiceById(invoiceId || "");
  const balance = getBalanceByTenant(invoice?.tenantId || "");

  if (!invoice) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/tenant/billing/invoices")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "failed":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDownload = () => {
    alert(`Downloading invoice ${invoice.invoiceNumber} as PDF`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/billing/invoices")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{invoice.invoiceNumber}</h1>
              <p className="text-sm text-gray-500 mt-1">Invoice Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Invoice Card */}
          <div className="bg-white rounded-lg border shadow-sm">
            {/* Header Section */}
            <div className="p-8 border-b">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
                  <p className="text-gray-600">{invoice.invoiceNumber}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-semibold flex items-center gap-2 ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  {invoice.status.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* From Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">From</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">AI Calling Platform Inc.</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div>123 Business Street</div>
                        <div>San Francisco, CA 94105</div>
                        <div>United States</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      billing@aicallingplatform.com
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      +1 (555) 123-4567
                    </div>
                  </div>
                </div>

                {/* Bill To Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{invoice.tenantId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      customer@example.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="p-8 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Invoice Date</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(invoice.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Due Date</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                {invoice.paidDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Paid Date</p>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {new Date(invoice.paidDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="p-8 border-b">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Unit Price</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-4 text-gray-900">{item.description}</td>
                      <td className="py-4 text-right text-gray-900">{item.quantity.toLocaleString()}</td>
                      <td className="py-4 text-right text-gray-900">${item.unitPrice.toFixed(4)}</td>
                      <td className="py-4 text-right text-gray-900 font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-8">
              <div className="max-w-sm ml-auto space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${invoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">${invoice.total.toFixed(2)} {invoice.currency}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {invoice.status === "paid" && invoice.paymentId && (
              <div className="p-8 bg-green-50 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {invoice.metadata?.paymentMethod || "Credit Card"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-medium text-gray-900 font-mono text-sm">{invoice.paymentId}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="p-8 border-t bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">
                Thank you for your business! Credits have been added to your account and are ready to use.
                If you have any questions about this invoice, please contact our billing team.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 print:hidden">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Need more credits?</h3>
                  <p className="text-sm text-blue-700">Purchase additional credits to keep your campaigns running.</p>
                </div>
                <button
                  onClick={() => navigate("/tenant/billing/purchase")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Purchase Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
