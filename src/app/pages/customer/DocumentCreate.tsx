import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDocuments } from "../../hooks/useDocuments";
import { useDeals } from "../../hooks/useDeals";
import { useLeads } from "../../hooks/useLeads";
import {
  FileText,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Table,
  Image as ImageIcon,
  PenTool,
  List,
  DollarSign,
  ChevronDown,
  X,
  ArrowLeft,
} from "lucide-react";
import type { DocumentSection } from "../../hooks/useDocuments";

export function DocumentCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("id");
  const templateId = searchParams.get("template");

  const {
    documents,
    templates,
    createDocument,
    updateDocument,
    generateFromTemplate,
    replaceMergeFields,
    sendDocument,
  } = useDocuments();

  const { deals } = useDeals();
  const { leads } = useLeads();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId || "");
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<string>("proposal");
  const [selectedDealId, setSelectedDealId] = useState<string>("");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [mergeData, setMergeData] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Load existing document or template
  useEffect(() => {
    if (documentId) {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        setDocumentName(doc.name);
        setDocumentType(doc.type);
        setSelectedDealId(doc.dealId || "");
        setSelectedLeadId(doc.leadId || "");
        setSections(doc.content);
        setMergeData(doc.mergeData || {});
        setSelectedTemplateId(doc.templateId);
      }
    } else if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        setDocumentType(template.type);
        setSections(template.sections);
        setDocumentName(`New ${template.name}`);
      }
    }
  }, [documentId, selectedTemplateId, documents, templates]);

  // Auto-populate merge data when deal/lead selected
  useEffect(() => {
    if (selectedDealId) {
      const deal = deals.find(d => d.id === selectedDealId);
      if (deal) {
        const lead = leads.find(l => l.id === deal.leadId);
        setSelectedLeadId(deal.leadId);

        const newMergeData: Record<string, string> = {
          "deal.name": deal.name,
          "deal.value": `$${deal.estimatedValue.toLocaleString()}`,
          "deal.closeDate": new Date(deal.expectedCloseDate).toLocaleDateString(),
          "deal.owner": deal.owner,
        };

        if (lead) {
          newMergeData["lead.name"] = lead.name;
          newMergeData["lead.email"] = lead.email || "";
          newMergeData["lead.phone"] = lead.phone || "";
          newMergeData["company.name"] = lead.company || "";
        }

        // Add line items data
        if (deal.lineItems && deal.lineItems.length > 0) {
          newMergeData["deal.lineItems"] = JSON.stringify(deal.lineItems);
        }

        setMergeData(prev => ({ ...prev, ...newMergeData }));
      }
    }
  }, [selectedDealId, deals, leads]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplateId(templateId);
      setDocumentType(template.type);
      setSections(template.sections);
      setDocumentName(`New ${template.name}`);
    }
  };

  const addSection = (type: DocumentSection["type"]) => {
    const newSection: DocumentSection = {
      id: `section-${Date.now()}`,
      type,
      title: type === "text" ? "New Section" : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: type === "text" ? "Enter your content here..." : "",
      order: sections.length,
    };

    if (type === "table") {
      newSection.columns = ["Column 1", "Column 2"];
      newSection.rows = [["Data 1", "Data 2"]];
    }

    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<DocumentSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (activeSection === id) {
      setActiveSection(null);
    }
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;

    const newSections = [...sections];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];

    newSections.forEach((s, i) => s.order = i);
    setSections(newSections);
  };

  const handleSave = () => {
    if (!documentName.trim()) {
      alert("Please enter a document name");
      return;
    }

    if (!selectedTemplateId) {
      alert("Please select a template");
      return;
    }

    if (documentId) {
      updateDocument(documentId, {
        name: documentName,
        content: sections,
        mergeData,
      });
      alert("Document updated successfully!");
    } else {
      createDocument({
        templateId: selectedTemplateId,
        name: documentName,
        type: documentType as any,
        dealId: selectedDealId || undefined,
        leadId: selectedLeadId || undefined,
        content: sections,
        mergeData,
        status: "draft",
      });
      alert("Document created successfully!");
      navigate("/tenant/documents");
    }
  };

  const handleSend = (channel: "email" | "whatsapp") => {
    if (!documentId) {
      alert("Please save the document first");
      return;
    }

    sendDocument(documentId, channel);
    setShowSendModal(false);
    alert(`Document sent via ${channel}!`);
  };

  const renderPreview = () => {
    let previewContent = "";

    sections.forEach(section => {
      if (section.type === "text") {
        previewContent += `<div class="mb-4">
          <h3 class="font-semibold text-lg mb-2">${section.title}</h3>
          <p class="text-gray-700">${replaceMergeFields(section.content || "", mergeData)}</p>
        </div>`;
      } else if (section.type === "table" && section.columns && section.rows) {
        previewContent += `<div class="mb-4">
          <h3 class="font-semibold text-lg mb-2">${section.title}</h3>
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                ${section.columns.map(col => `<th class="border border-gray-300 px-4 py-2">${col}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${section.rows.map(row => `<tr>${row.map(cell => `<td class="border border-gray-300 px-4 py-2">${replaceMergeFields(cell, mergeData)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>`;
      } else if (section.type === "lineItems") {
        const lineItemsData = mergeData["deal.lineItems"];
        if (lineItemsData) {
          try {
            const items = JSON.parse(lineItemsData);
            let total = 0;
            previewContent += `<div class="mb-4">
              <h3 class="font-semibold text-lg mb-2">${section.title}</h3>
              <table class="w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2 text-left">Product</th>
                    <th class="border border-gray-300 px-4 py-2 text-right">Quantity</th>
                    <th class="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                    <th class="border border-gray-300 px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item: any) => {
                    const itemTotal = item.quantity * item.unitPrice;
                    total += itemTotal;
                    return `<tr>
                      <td class="border border-gray-300 px-4 py-2">${item.productName}</td>
                      <td class="border border-gray-300 px-4 py-2 text-right">${item.quantity}</td>
                      <td class="border border-gray-300 px-4 py-2 text-right">$${item.unitPrice.toFixed(2)}</td>
                      <td class="border border-gray-300 px-4 py-2 text-right">$${itemTotal.toFixed(2)}</td>
                    </tr>`;
                  }).join("")}
                  <tr class="font-semibold bg-gray-50">
                    <td colspan="3" class="border border-gray-300 px-4 py-2 text-right">Total:</td>
                    <td class="border border-gray-300 px-4 py-2 text-right">$${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>`;
          } catch (e) {
            previewContent += `<div class="mb-4 text-gray-500">No line items available</div>`;
          }
        }
      }
    });

    return previewContent;
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const selectedDeal = deals.find(d => d.id === selectedDealId);
  const selectedLead = leads.find(l => l.id === selectedLeadId);

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
              <h1 className="text-2xl font-semibold text-gray-900">
                {documentId ? "Edit Document" : "Create Document"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {documentId ? "Update your document" : "Build a new document from template"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            {documentId && (
              <button
                onClick={() => setShowSendModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            )}
          </div>
        </div>
      </div>

      {showPreview ? (
        // Preview Mode
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{documentName}</h2>
              {selectedDeal && (
                <p className="text-sm text-gray-600">Deal: {selectedDeal.name}</p>
              )}
              {selectedLead && (
                <p className="text-sm text-gray-600">Contact: {selectedLead.name}</p>
              )}
            </div>
            <div dangerouslySetInnerHTML={{ __html: renderPreview() }} />
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Settings */}
          <div className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template</option>
                  {templates.filter(t => t.isActive).map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deal Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Deal
                </label>
                <select
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No deal</option>
                  {deals.map(deal => (
                    <option key={deal.id} value={deal.id}>
                      {deal.name} - ${deal.estimatedValue.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!selectedDealId}
                >
                  <option value="">No contact</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Section Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Section
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addSection("text")}
                    className="p-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Type className="w-4 h-4" />
                    Text
                  </button>
                  <button
                    onClick={() => addSection("table")}
                    className="p-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Table className="w-4 h-4" />
                    Table
                  </button>
                  <button
                    onClick={() => addSection("lineItems")}
                    className="p-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Line Items
                  </button>
                  <button
                    onClick={() => addSection("signature")}
                    className="p-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    Signature
                  </button>
                </div>
              </div>

              {/* Merge Fields Reference */}
              {selectedTemplate && selectedTemplate.mergeFields.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Merge Fields
                  </label>
                  <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg max-h-48 overflow-y-auto">
                    {selectedTemplate.mergeFields.map(field => (
                      <div key={field} className="font-mono">
                        {`{{${field}}}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Document Editor */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`bg-white rounded-lg border p-4 ${
                    activeSection === section.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        className="font-semibold text-gray-900 border-none focus:outline-none focus:ring-0 bg-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveSection(section.id, "up")}
                        disabled={index === 0}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveSection(section.id, "down")}
                        disabled={index === sections.length - 1}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {section.type === "text" && (
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter content... Use {{merge.field}} for dynamic data"
                    />
                  )}

                  {section.type === "table" && section.columns && section.rows && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            {section.columns.map((col, colIndex) => (
                              <th key={`col-${section.id}-${colIndex}`} className="border border-gray-300 px-3 py-2">
                                <input
                                  type="text"
                                  value={col}
                                  onChange={(e) => {
                                    const newColumns = [...section.columns!];
                                    newColumns[colIndex] = e.target.value;
                                    updateSection(section.id, { columns: newColumns });
                                  }}
                                  className="w-full font-semibold bg-transparent border-none focus:outline-none"
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.map((row, rowIndex) => (
                            <tr key={`row-${section.id}-${rowIndex}`}>
                              {row.map((cell, cellIndex) => (
                                <td key={`cell-${section.id}-${rowIndex}-${cellIndex}`} className="border border-gray-300 px-3 py-2">
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const newRows = [...section.rows!];
                                      newRows[rowIndex][cellIndex] = e.target.value;
                                      updateSection(section.id, { rows: newRows });
                                    }}
                                    className="w-full bg-transparent border-none focus:outline-none"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.type === "lineItems" && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      Line items will be automatically populated from the selected deal.
                      {!selectedDealId && (
                        <p className="text-yellow-700 mt-2">Please select a deal to display line items.</p>
                      )}
                    </div>
                  )}

                  {section.type === "signature" && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                      <PenTool className="w-8 h-8 mx-auto mb-2" />
                      <p>Signature field - will be filled by recipient</p>
                    </div>
                  )}
                </div>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2">No sections added yet</p>
                  <p className="text-sm">Use the buttons on the left to add sections to your document</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
            <p className="text-sm text-gray-600 mb-6">Choose how to send this document:</p>
            <div className="space-y-3">
              <button
                onClick={() => handleSend("email")}
                className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">Send via email to contact</p>
                </div>
              </button>
              <button
                onClick={() => handleSend("whatsapp")}
                className="w-full px-4 py-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Send via WhatsApp message</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
