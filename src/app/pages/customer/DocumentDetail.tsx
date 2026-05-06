import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDocuments } from "../../hooks/useDocuments";
import { useDeals } from "../../hooks/useDeals";
import {
  FileText,
  Send,
  Download,
  Edit,
  Trash2,
  Mail,
  MessageSquare,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Copy,
  PenTool,
  X,
} from "lucide-react";

export function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, deleteDocument, sendDocument, replaceMergeFields, markAsSigned } = useDocuments();
  const { deals, leads } = useDeals();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signature, setSignature] = useState("");

  const document = documents.find(d => d.id === id);

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document not found</h2>
          <button
            onClick={() => navigate("/tenant/documents")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  const deal = document.dealId ? deals.find(d => d.id === document.dealId) : undefined;
  const lead = document.leadId ? leads.find(l => l.id === document.leadId) : undefined;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="w-5 h-5 text-gray-600" />;
      case "sent":
        return <Send className="w-5 h-5 text-blue-600" />;
      case "viewed":
        return <Eye className="w-5 h-5 text-purple-600" />;
      case "signed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "sent":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "viewed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "signed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(id!);
      navigate("/tenant/documents");
    }
  };

  const handleSend = (channel: "email" | "whatsapp") => {
    sendDocument(id!, channel);
    setShowSendModal(false);
    alert(`Document sent via ${channel}!`);
  };

  const handleDownload = () => {
    alert("Downloading document as PDF...");
  };

  const handleDuplicate = () => {
    navigate(`/tenant/documents/create?template=${document.templateId}`);
  };

  const handleSign = () => {
    if (!signature.trim()) {
      alert("Please enter your name to sign");
      return;
    }
    markAsSigned(id!);
    setShowSignModal(false);
    alert("Document signed successfully!");
  };

  const renderDocumentContent = () => {
    let content = "";

    document.content.forEach(section => {
      if (section.type === "text") {
        content += `<div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">${section.title}</h3>
          <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">${replaceMergeFields(section.content || "", document.mergeData || {})}</div>
        </div>`;
      } else if (section.type === "table" && section.columns && section.rows) {
        content += `<div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">${section.title}</h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  ${section.columns.map(col => `<th class="border border-gray-300 px-4 py-3 text-left font-semibold">${col}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${section.rows.map(row => `<tr>${row.map(cell => `<td class="border border-gray-300 px-4 py-3">${replaceMergeFields(cell, document.mergeData || {})}</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>`;
      } else if (section.type === "lineItems") {
        const lineItemsData = document.mergeData?.["deal.lineItems"];
        if (lineItemsData) {
          try {
            const items = JSON.parse(lineItemsData);
            let subtotal = 0;
            content += `<div class="mb-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-3">${section.title}</h3>
              <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Product</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Quantity</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Unit Price</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Discount</th>
                      <th class="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${items.map((item: any) => {
                      const itemSubtotal = item.quantity * item.unitPrice;
                      const discountAmount = item.discountType === "percentage"
                        ? itemSubtotal * (item.discount / 100)
                        : item.discount;
                      const itemTotal = itemSubtotal - discountAmount + (item.tax || 0);
                      subtotal += itemTotal;
                      return `<tr>
                        <td class="border border-gray-300 px-4 py-3">${item.productName}</td>
                        <td class="border border-gray-300 px-4 py-3 text-right">${item.quantity}</td>
                        <td class="border border-gray-300 px-4 py-3 text-right">$${item.unitPrice.toFixed(2)}</td>
                        <td class="border border-gray-300 px-4 py-3 text-right">${item.discountType === "percentage" ? `${item.discount}%` : `$${item.discount.toFixed(2)}`}</td>
                        <td class="border border-gray-300 px-4 py-3 text-right">$${itemTotal.toFixed(2)}</td>
                      </tr>`;
                    }).join("")}
                  </tbody>
                  <tfoot>
                    <tr class="font-semibold bg-gray-50">
                      <td colspan="4" class="border border-gray-300 px-4 py-3 text-right">Subtotal:</td>
                      <td class="border border-gray-300 px-4 py-3 text-right">$${subtotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>`;
          } catch (e) {
            content += `<div class="mb-6 text-gray-500 italic">No line items available</div>`;
          }
        }
      } else if (section.type === "signature") {
        content += `<div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">${section.title}</h3>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8">
            ${document.status === "signed"
              ? `<div class="text-center">
                   <CheckCircle2 class="w-12 h-12 text-green-600 mx-auto mb-2" />
                   <p class="text-gray-900 font-semibold">Signed</p>
                   <p class="text-sm text-gray-600">${new Date(document.signedAt || "").toLocaleDateString()}</p>
                 </div>`
              : `<div class="text-center text-gray-500">
                   <PenTool class="w-8 h-8 mx-auto mb-2" />
                   <p>Awaiting signature</p>
                 </div>`
            }
          </div>
        </div>`;
      } else if (section.type === "terms") {
        content += `<div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">${section.title}</h3>
          <div class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">${replaceMergeFields(section.content || "", document.mergeData || {})}</div>
        </div>`;
      }
    });

    return content;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/tenant/documents")}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{document.name}</h1>
                <span className={`px-3 py-1 rounded-md border text-sm font-medium flex items-center gap-2 ${getStatusColor(document.status)}`}>
                  {getStatusIcon(document.status)}
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
                {deal && <span>• Deal: {deal.name}</span>}
                {lead && <span>• Contact: {lead.name}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            {document.status === "draft" && (
              <>
                <button
                  onClick={() => navigate(`/tenant/documents/${id}/edit`)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowSendModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </>
            )}
            {document.status !== "draft" && document.status !== "signed" && (
              <button
                onClick={() => setShowSignModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <PenTool className="w-4 h-4" />
                Sign Document
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - Document Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{document.name}</h2>
                    <p className="text-sm text-gray-600">
                      Document #{document.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  {deal && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Associated Deal</p>
                      <p className="font-semibold text-gray-900">{deal.name}</p>
                    </div>
                  )}
                </div>
                {lead && (
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Contact Name</p>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                      </div>
                      {lead.email && (
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{lead.email}</p>
                        </div>
                      )}
                      {lead.company && (
                        <div>
                          <p className="text-gray-600">Company</p>
                          <p className="font-medium text-gray-900">{lead.company}</p>
                        </div>
                      )}
                      {lead.phone && (
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-medium text-gray-900">{lead.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: renderDocumentContent() }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Activity Timeline */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {document.activityLog && document.activityLog.length > 0 ? (
                document.activityLog.map((activity, index) => (
                  <div key={`activity-${document.id}-${index}`} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.action === "created" && <FileText className="w-4 h-4 text-blue-600" />}
                      {activity.action === "sent" && <Send className="w-4 h-4 text-blue-600" />}
                      {activity.action === "viewed" && <Eye className="w-4 h-4 text-purple-600" />}
                      {activity.action === "signed" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {activity.action === "downloaded" && <Download className="w-4 h-4 text-gray-600" />}
                      {activity.action === "edited" && <Edit className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                      {activity.performedBy && (
                        <p className="text-xs text-gray-500">by {activity.performedBy}</p>
                      )}
                      {activity.details && (
                        <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No activity recorded</p>
              )}
            </div>

            {/* Delivery Status */}
            {document.sentVia && document.sentVia.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Sent Via</h4>
                <div className="space-y-2">
                  {document.sentVia.map((channel, idx) => (
                    <div key={`channel-${idx}`} className="flex items-center gap-2 text-sm">
                      {channel === "email" ? (
                        <>
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">Email</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">WhatsApp</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Document</h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Send this document to {lead?.name || "the contact"}:
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleSend("email")}
                className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{lead?.email || "No email available"}</p>
                </div>
              </button>
              <button
                onClick={() => handleSend("whatsapp")}
                className="w-full px-4 py-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">{lead?.phone || "No phone available"}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sign Document</h3>
              <button
                onClick={() => setShowSignModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              By signing this document, you agree to the terms and conditions outlined above.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (Signature)
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSign}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Sign Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
