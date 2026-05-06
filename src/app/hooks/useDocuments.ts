import { useState } from "react";

export type DocumentType = "invoice" | "proposal" | "contract" | "agreement" | "quotation" | "nda" | "terms";
export type DocumentStatus = "draft" | "sent" | "viewed" | "signed" | "archived";

export interface MergeField {
  key: string;
  label: string;
  category: "deal" | "lead" | "company" | "user" | "custom";
  defaultValue?: string;
}

export interface DocumentSection {
  id: string;
  type: "text" | "table" | "image" | "signature" | "terms" | "lineItems";
  content: string;
  order: number;
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
    margin?: string;
    padding?: string;
  };
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  category: "sales" | "legal" | "finance" | "general";
  sections: DocumentSection[];
  header?: string;
  footer?: string;
  styles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    pageSize: "A4" | "Letter";
  };
  mergeFields: string[];
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  templateId: string;
  templateName: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  dealId?: string;
  dealName?: string;
  leadId?: string;
  leadName?: string;
  companyId?: string;
  companyName?: string;
  content: DocumentSection[];
  mergeData: Record<string, string>;
  generatedHtml?: string;
  generatedPdf?: string;
  sentVia?: ("email" | "whatsapp")[];
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  signedBy?: string;
  version: number;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentActivity {
  id: string;
  documentId: string;
  type: "created" | "sent" | "viewed" | "signed" | "downloaded" | "edited";
  channel?: "email" | "whatsapp";
  recipient?: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Available merge fields
export const availableMergeFields: MergeField[] = [
  // Deal fields
  { key: "deal.name", label: "Deal Name", category: "deal" },
  { key: "deal.value", label: "Deal Value", category: "deal" },
  { key: "deal.closeDate", label: "Expected Close Date", category: "deal" },
  { key: "deal.stage", label: "Deal Stage", category: "deal" },

  // Lead fields
  { key: "lead.name", label: "Lead Name", category: "lead" },
  { key: "lead.email", label: "Lead Email", category: "lead" },
  { key: "lead.phone", label: "Lead Phone", category: "lead" },
  { key: "lead.title", label: "Lead Title", category: "lead" },

  // Company fields
  { key: "company.name", label: "Company Name", category: "company" },
  { key: "company.address", label: "Company Address", category: "company" },
  { key: "company.phone", label: "Company Phone", category: "company" },
  { key: "company.website", label: "Company Website", category: "company" },

  // User fields
  { key: "user.name", label: "Your Name", category: "user" },
  { key: "user.email", label: "Your Email", category: "user" },
  { key: "user.phone", label: "Your Phone", category: "user" },
  { key: "user.title", label: "Your Title", category: "user" },

  // Custom fields
  { key: "date.today", label: "Today's Date", category: "custom" },
  { key: "date.validUntil", label: "Valid Until Date", category: "custom" },
];

// Mock data
const mockTemplates: DocumentTemplate[] = [
  {
    id: "template-1",
    name: "Standard Proposal",
    description: "Standard business proposal template",
    type: "proposal",
    category: "sales",
    sections: [
      {
        id: "sec-1",
        type: "text",
        content: "<h1>Business Proposal</h1><p>Date: {{date.today}}</p><p>To: {{lead.name}}, {{company.name}}</p>",
        order: 1,
      },
      {
        id: "sec-2",
        type: "text",
        content: "<h2>Executive Summary</h2><p>We are pleased to present this proposal for {{deal.name}}.</p>",
        order: 2,
      },
      {
        id: "sec-3",
        type: "lineItems",
        content: "Products and Services",
        order: 3,
      },
      {
        id: "sec-4",
        type: "text",
        content: "<h2>Total Investment</h2><p><strong>Total Value: {{deal.value}}</strong></p>",
        order: 4,
      },
      {
        id: "sec-5",
        type: "signature",
        content: "Authorized Signature",
        order: 5,
      },
    ],
    header: "<div style='text-align: center;'><strong>Your Company Name</strong></div>",
    footer: "<div style='text-align: center; font-size: 12px;'>Page {{page}} of {{totalPages}}</div>",
    styles: {
      primaryColor: "#3b82f6",
      secondaryColor: "#6b7280",
      fontFamily: "Arial, sans-serif",
      pageSize: "A4",
    },
    mergeFields: ["deal.name", "deal.value", "lead.name", "company.name", "date.today"],
    isDefault: true,
    isActive: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "template-2",
    name: "Invoice Template",
    description: "Professional invoice template",
    type: "invoice",
    category: "finance",
    sections: [
      {
        id: "sec-1",
        type: "text",
        content: "<h1>INVOICE</h1><p>Invoice Date: {{date.today}}</p><p>Bill To: {{lead.name}}<br/>{{company.name}}<br/>{{company.address}}</p>",
        order: 1,
      },
      {
        id: "sec-2",
        type: "lineItems",
        content: "Invoice Items",
        order: 2,
      },
      {
        id: "sec-3",
        type: "text",
        content: "<h3>Total Amount: {{deal.value}}</h3><p>Payment Terms: Net 30 days</p>",
        order: 3,
      },
    ],
    header: "<div style='text-align: center;'><strong>INVOICE</strong></div>",
    footer: "<div style='text-align: center; font-size: 12px;'>Thank you for your business!</div>",
    styles: {
      primaryColor: "#10b981",
      secondaryColor: "#6b7280",
      fontFamily: "Arial, sans-serif",
      pageSize: "A4",
    },
    mergeFields: ["deal.name", "deal.value", "lead.name", "company.name", "company.address", "date.today"],
    isDefault: true,
    isActive: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "template-3",
    name: "Service Agreement",
    description: "Standard service agreement template",
    type: "agreement",
    category: "legal",
    sections: [
      {
        id: "sec-1",
        type: "text",
        content: "<h1>SERVICE AGREEMENT</h1><p>This Agreement is entered into as of {{date.today}} between:</p><p><strong>Provider:</strong> {{user.name}}<br/><strong>Client:</strong> {{lead.name}}, {{company.name}}</p>",
        order: 1,
      },
      {
        id: "sec-2",
        type: "text",
        content: "<h2>1. Services</h2><p>The Provider agrees to provide the services as outlined in {{deal.name}}.</p>",
        order: 2,
      },
      {
        id: "sec-3",
        type: "text",
        content: "<h2>2. Compensation</h2><p>The total compensation for services shall be {{deal.value}}.</p>",
        order: 3,
      },
      {
        id: "sec-4",
        type: "terms",
        content: "<h2>3. Terms and Conditions</h2><ul><li>Payment terms: Net 30 days</li><li>Confidentiality agreement applies</li><li>Either party may terminate with 30 days notice</li></ul>",
        order: 4,
      },
      {
        id: "sec-5",
        type: "signature",
        content: "Signatures",
        order: 5,
      },
    ],
    header: "",
    footer: "<div style='text-align: center; font-size: 10px;'>Page {{page}} of {{totalPages}}</div>",
    styles: {
      primaryColor: "#6366f1",
      secondaryColor: "#6b7280",
      fontFamily: "Times New Roman, serif",
      pageSize: "A4",
    },
    mergeFields: ["deal.name", "deal.value", "lead.name", "company.name", "user.name", "date.today"],
    isDefault: true,
    isActive: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "template-4",
    name: "Quotation Template",
    description: "Price quotation template",
    type: "quotation",
    category: "sales",
    sections: [
      {
        id: "sec-1",
        type: "text",
        content: "<h1>QUOTATION</h1><p>Date: {{date.today}}<br/>Valid Until: {{date.validUntil}}</p><p>To: {{lead.name}}<br/>{{company.name}}</p>",
        order: 1,
      },
      {
        id: "sec-2",
        type: "text",
        content: "<p>Dear {{lead.name}},</p><p>We are pleased to provide you with the following quotation for {{deal.name}}:</p>",
        order: 2,
      },
      {
        id: "sec-3",
        type: "lineItems",
        content: "Quotation Items",
        order: 3,
      },
      {
        id: "sec-4",
        type: "text",
        content: "<h3>Grand Total: {{deal.value}}</h3><p>This quotation is valid until {{date.validUntil}}.</p>",
        order: 4,
      },
    ],
    header: "",
    footer: "<div style='text-align: center; font-size: 12px;'>Contact: {{user.email}} | {{user.phone}}</div>",
    styles: {
      primaryColor: "#f59e0b",
      secondaryColor: "#6b7280",
      fontFamily: "Arial, sans-serif",
      pageSize: "A4",
    },
    mergeFields: ["deal.name", "deal.value", "lead.name", "company.name", "user.email", "user.phone", "date.today", "date.validUntil"],
    isDefault: true,
    isActive: true,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const generateMockDocuments = (): Document[] => {
  const documents: Document[] = [];

  for (let i = 1; i <= 20; i++) {
    const template = mockTemplates[Math.floor(Math.random() * mockTemplates.length)];
    const status: DocumentStatus = ["draft", "sent", "viewed", "signed"][Math.floor(Math.random() * 4)] as DocumentStatus;

    documents.push({
      id: `doc-${i}`,
      templateId: template.id,
      templateName: template.name,
      name: `${template.type.charAt(0).toUpperCase() + template.type.slice(1)} ${i}`,
      type: template.type,
      status,
      dealId: `deal-${i}`,
      dealName: `Deal ${i}`,
      leadId: `lead-${i}`,
      leadName: `Contact ${i}`,
      companyId: `company-${i}`,
      companyName: `Company ${i}`,
      content: template.sections,
      mergeData: {
        "deal.name": `Deal ${i}`,
        "deal.value": `$${(Math.random() * 50000 + 5000).toFixed(2)}`,
        "deal.closeDate": new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "lead.name": `Contact ${i}`,
        "lead.email": `contact${i}@example.com`,
        "lead.phone": `+1-555-000-${String(i).padStart(4, '0')}`,
        "company.name": `Company ${i}`,
        "company.address": `${i} Business St, City, State 12345`,
        "user.name": "Current User",
        "user.email": "user@company.com",
        "user.phone": "+1-555-999-0000",
        "date.today": new Date().toISOString().split('T')[0],
        "date.validUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      sentVia: status !== "draft" ? ["email"] : undefined,
      sentAt: status !== "draft" ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      viewedAt: ["viewed", "signed"].includes(status) ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      signedAt: status === "signed" ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      signedBy: status === "signed" ? `Contact ${i}` : undefined,
      version: 1,
      notes: "",
      createdBy: "user-1",
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return documents;
};

export function useDocuments() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(mockTemplates);
  const [documents, setDocuments] = useState<Document[]>(generateMockDocuments());
  const [activities, setActivities] = useState<DocumentActivity[]>([]);

  // Template CRUD
  const createTemplate = (template: Omit<DocumentTemplate, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    const newTemplate: DocumentTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = (templateId: string, updates: Partial<DocumentTemplate>) => {
    setTemplates(templates.map(t =>
      t.id === templateId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    ));
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  const getTemplateById = (templateId: string) => {
    return templates.find(t => t.id === templateId);
  };

  // Document CRUD
  const createDocument = (document: Omit<Document, "id" | "createdAt" | "updatedAt" | "createdBy" | "version">) => {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      version: 1,
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDocuments([newDocument, ...documents]);

    logActivity(newDocument.id, "created", undefined, "current-user", "Current User");
    return newDocument;
  };

  const updateDocument = (documentId: string, updates: Partial<Document>) => {
    setDocuments(documents.map(d =>
      d.id === documentId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
    ));

    logActivity(documentId, "edited", undefined, "current-user", "Current User");
  };

  const deleteDocument = (documentId: string) => {
    setDocuments(documents.filter(d => d.id !== documentId));
  };

  const getDocumentById = (documentId: string) => {
    return documents.find(d => d.id === documentId);
  };

  const getDocumentsByDeal = (dealId: string) => {
    return documents.filter(d => d.dealId === dealId);
  };

  // Document actions
  const sendDocument = (documentId: string, channel: "email" | "whatsapp", recipient: string) => {
    const document = documents.find(d => d.id === documentId);
    if (!document) return;

    const sentVia = document.sentVia || [];
    if (!sentVia.includes(channel)) {
      sentVia.push(channel);
    }

    updateDocument(documentId, {
      status: "sent",
      sentVia,
      sentAt: new Date().toISOString(),
    });

    logActivity(documentId, "sent", channel, "current-user", "Current User", { recipient });
  };

  const markAsViewed = (documentId: string) => {
    updateDocument(documentId, {
      status: "viewed",
      viewedAt: new Date().toISOString(),
    });

    logActivity(documentId, "viewed");
  };

  const markAsSigned = (documentId: string, signedBy: string) => {
    updateDocument(documentId, {
      status: "signed",
      signedAt: new Date().toISOString(),
      signedBy,
    });

    logActivity(documentId, "signed", undefined, undefined, signedBy);
  };

  const generateFromTemplate = (templateId: string, mergeData: Record<string, string>, dealId?: string, leadId?: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    const newDocument: Omit<Document, "id" | "createdAt" | "updatedAt" | "createdBy" | "version"> = {
      templateId: template.id,
      templateName: template.name,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      type: template.type,
      status: "draft",
      dealId,
      dealName: mergeData["deal.name"],
      leadId,
      leadName: mergeData["lead.name"],
      companyId: undefined,
      companyName: mergeData["company.name"],
      content: template.sections,
      mergeData,
      notes: "",
    };

    return createDocument(newDocument);
  };

  // Merge field replacement
  const replaceMergeFields = (content: string, mergeData: Record<string, string>) => {
    let result = content;
    Object.keys(mergeData).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, mergeData[key] || "");
    });
    return result;
  };

  // Activity logging
  const logActivity = (
    documentId: string,
    type: DocumentActivity["type"],
    channel?: "email" | "whatsapp",
    userId?: string,
    userName?: string,
    metadata?: Record<string, any>
  ) => {
    const activity: DocumentActivity = {
      id: `activity-${Date.now()}`,
      documentId,
      type,
      channel,
      recipient: metadata?.recipient,
      userId,
      userName,
      timestamp: new Date().toISOString(),
      metadata,
    };
    setActivities([activity, ...activities]);
  };

  const getActivitiesByDocument = (documentId: string) => {
    return activities.filter(a => a.documentId === documentId).sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  return {
    templates,
    documents,
    availableMergeFields,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    getDocumentsByDeal,
    sendDocument,
    markAsViewed,
    markAsSigned,
    generateFromTemplate,
    replaceMergeFields,
    getActivitiesByDocument,
  };
}
