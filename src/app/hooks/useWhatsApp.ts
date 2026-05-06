import { useState, useCallback } from "react";

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  profilePic?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "online" | "offline";
  tags: string[];
  leadId?: string; // Linked lead ID
}

export interface WhatsAppMessage {
  id: string;
  contactId: string;
  content: string;
  type: "text" | "image" | "video" | "document" | "audio";
  direction: "incoming" | "outgoing";
  timestamp: string;
  status: "sent" | "delivered" | "read" | "failed";
  mediaUrl?: string;
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "running" | "paused" | "completed";
  templateId: string;
  templateName: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  scheduledAt?: string;
  createdAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "marketing" | "utility" | "authentication";
  language: string;
  status: "approved" | "pending" | "rejected" | "draft";
  content: string;
  variables: string[];
  createdAt: string;
  approvedAt?: string;
}

export interface WhatsAppAutomation {
  id: string;
  name: string;
  trigger: "keyword" | "new_contact" | "specific_message" | "time_based";
  triggerValue: string;
  actions: AutomationAction[];
  status: "active" | "inactive";
  executionCount: number;
}

export interface AutomationAction {
  type: "send_message" | "add_tag" | "assign_user" | "send_notification";
  value: string;
}

export function useWhatsApp() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([
    {
      id: "1",
      name: "Sarah Chen",
      phone: "+1 (555) 123-4567",
      profilePic: undefined,
      lastMessage: "Thanks for the information!",
      lastMessageTime: "2 min ago",
      unreadCount: 2,
      status: "online",
      tags: ["Customer", "VIP"]
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      phone: "+1 (555) 234-5678",
      lastMessage: "When can we schedule a call?",
      lastMessageTime: "15 min ago",
      unreadCount: 0,
      status: "offline",
      tags: ["Lead"]
    },
    {
      id: "3",
      name: "Emily Thompson",
      phone: "+1 (555) 345-6789",
      lastMessage: "I'm interested in the premium plan",
      lastMessageTime: "1 hour ago",
      unreadCount: 1,
      status: "online",
      tags: ["Hot Lead", "Enterprise"]
    }
  ]);

  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      contactId: "1",
      content: "Hi! I have a question about your services",
      type: "text",
      direction: "incoming",
      timestamp: "2024-03-15T14:25:00",
      status: "read"
    },
    {
      id: "2",
      contactId: "1",
      content: "Of course! How can I help you today?",
      type: "text",
      direction: "outgoing",
      timestamp: "2024-03-15T14:26:00",
      status: "read"
    },
    {
      id: "3",
      contactId: "1",
      content: "What are your pricing options?",
      type: "text",
      direction: "incoming",
      timestamp: "2024-03-15T14:27:00",
      status: "read"
    },
    {
      id: "4",
      contactId: "1",
      content: "We have three plans: Starter ($29/mo), Professional ($79/mo), and Enterprise (custom pricing). Which would you like to know more about?",
      type: "text",
      direction: "outgoing",
      timestamp: "2024-03-15T14:28:00",
      status: "read"
    },
    {
      id: "5",
      contactId: "1",
      content: "Thanks for the information!",
      type: "text",
      direction: "incoming",
      timestamp: "2024-03-15T14:30:00",
      status: "delivered"
    }
  ]);

  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([
    {
      id: "1",
      name: "Spring Sale Announcement",
      status: "running",
      templateId: "template_1",
      templateName: "Spring Sale 2024",
      audienceSize: 5420,
      sent: 4231,
      delivered: 4156,
      read: 3847,
      replied: 892,
      scheduledAt: "2024-03-15T09:00:00",
      createdAt: "2024-03-14T10:00:00"
    },
    {
      id: "2",
      name: "Product Launch Notification",
      status: "scheduled",
      templateId: "template_2",
      templateName: "New Product Launch",
      audienceSize: 8200,
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      scheduledAt: "2024-03-20T10:00:00",
      createdAt: "2024-03-15T14:00:00"
    }
  ]);

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: "template_1",
      name: "Spring Sale 2024",
      category: "marketing",
      language: "en",
      status: "approved",
      content: "Hi {{1}}! 🌸 Spring Sale is here! Get {{2}}% off all products. Use code: {{3}}. Shop now: {{4}}",
      variables: ["name", "discount", "code", "url"],
      createdAt: "2024-03-10T10:00:00",
      approvedAt: "2024-03-11T15:30:00"
    },
    {
      id: "template_2",
      name: "New Product Launch",
      category: "marketing",
      language: "en",
      status: "approved",
      content: "Hello {{1}}! We're excited to announce our new product: {{2}}. Learn more: {{3}}",
      variables: ["name", "product", "url"],
      createdAt: "2024-03-12T10:00:00",
      approvedAt: "2024-03-13T12:00:00"
    },
    {
      id: "template_3",
      name: "Order Confirmation",
      category: "utility",
      language: "en",
      status: "pending",
      content: "Hi {{1}}, your order #{{2}} has been confirmed. Total: ${{3}}. Expected delivery: {{4}}",
      variables: ["name", "order_id", "total", "delivery_date"],
      createdAt: "2024-03-15T09:00:00"
    }
  ]);

  const [automations, setAutomations] = useState<WhatsAppAutomation[]>([
    {
      id: "1",
      name: "Welcome New Contacts",
      trigger: "new_contact",
      triggerValue: "",
      actions: [
        { type: "send_message", value: "Welcome! Thanks for reaching out. How can we help you today?" },
        { type: "add_tag", value: "New Contact" }
      ],
      status: "active",
      executionCount: 234
    },
    {
      id: "2",
      name: "Pricing Inquiry Auto-Response",
      trigger: "keyword",
      triggerValue: "pricing|price|cost",
      actions: [
        { type: "send_message", value: "Thanks for your interest! Our pricing starts at $29/mo. Would you like to schedule a demo?" },
        { type: "add_tag", value: "Pricing Inquiry" }
      ],
      status: "active",
      executionCount: 156
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // Contact actions
  const markAsRead = useCallback((contactId: string) => {
    setContacts(prev => prev.map(c =>
      c.id === contactId ? { ...c, unreadCount: 0 } : c
    ));
  }, []);

  const addTag = useCallback((contactId: string, tag: string) => {
    setContacts(prev => prev.map(c =>
      c.id === contactId ? { ...c, tags: [...c.tags, tag] } : c
    ));
  }, []);

  const removeTag = useCallback((contactId: string, tag: string) => {
    setContacts(prev => prev.map(c =>
      c.id === contactId ? { ...c, tags: c.tags.filter(t => t !== tag) } : c
    ));
  }, []);

  // Message actions
  const sendMessage = useCallback((contactId: string, content: string, type: "text" | "image" | "document" = "text") => {
    const newMessage: WhatsAppMessage = {
      id: Date.now().toString(),
      contactId,
      content,
      type,
      direction: "outgoing",
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    setMessages(prev => [...prev, newMessage]);

    // Update contact's last message
    setContacts(prev => prev.map(c =>
      c.id === contactId ? { ...c, lastMessage: content, lastMessageTime: "Just now" } : c
    ));
  }, []);

  const getContactMessages = useCallback((contactId: string) => {
    return messages.filter(m => m.contactId === contactId);
  }, [messages]);

  // Campaign actions
  const createCampaign = useCallback((campaign: Omit<WhatsAppCampaign, "id" | "createdAt" | "sent" | "delivered" | "read" | "replied">) => {
    const newCampaign: WhatsAppCampaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0
    };
    setCampaigns(prev => [...prev, newCampaign]);
    return newCampaign;
  }, []);

  const updateCampaignStatus = useCallback((campaignId: string, status: WhatsAppCampaign["status"]) => {
    setCampaigns(prev => prev.map(c =>
      c.id === campaignId ? { ...c, status } : c
    ));
  }, []);

  const deleteCampaign = useCallback((campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  }, []);

  // Template actions
  const createTemplate = useCallback((template: Omit<WhatsAppTemplate, "id" | "createdAt" | "status">) => {
    const newTemplate: WhatsAppTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "draft"
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const submitTemplateForApproval = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(t =>
      t.id === templateId ? { ...t, status: "pending" } : t
    ));
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  }, []);

  // Automation actions
  const createAutomation = useCallback((automation: Omit<WhatsAppAutomation, "id" | "executionCount">) => {
    const newAutomation: WhatsAppAutomation = {
      ...automation,
      id: Date.now().toString(),
      executionCount: 0
    };
    setAutomations(prev => [...prev, newAutomation]);
    return newAutomation;
  }, []);

  const toggleAutomation = useCallback((automationId: string) => {
    setAutomations(prev => prev.map(a =>
      a.id === automationId ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a
    ));
  }, []);

  const deleteAutomation = useCallback((automationId: string) => {
    setAutomations(prev => prev.filter(a => a.id !== automationId));
  }, []);

  // Simulate incoming message (for demo/testing - auto-creates lead)
  const simulateIncomingMessage = useCallback((phone: string, name: string, messageContent: string) => {
    // Check if contact exists
    let existingContact = contacts.find(c => c.phone === phone);
    let contactId: string;

    if (!existingContact) {
      // Create new contact
      contactId = Date.now().toString();
      const newContact: WhatsAppContact = {
        id: contactId,
        name,
        phone,
        lastMessage: messageContent,
        lastMessageTime: "Just now",
        unreadCount: 1,
        status: "online",
        tags: ["New Contact"]
      };
      setContacts(prev => [...prev, newContact]);
    } else {
      contactId = existingContact.id;
      // Update existing contact
      setContacts(prev => prev.map(c =>
        c.id === contactId
          ? { ...c, lastMessage: messageContent, lastMessageTime: "Just now", unreadCount: c.unreadCount + 1 }
          : c
      ));
    }

    // Add message
    const newMessage: WhatsAppMessage = {
      id: Date.now().toString(),
      contactId,
      content: messageContent,
      type: "text",
      direction: "incoming",
      timestamp: new Date().toISOString(),
      status: "delivered"
    };
    setMessages(prev => [...prev, newMessage]);

    return { contactId, messageId: newMessage.id };
  }, [contacts]);

  // Link contact to lead
  const linkContactToLead = useCallback((contactId: string, leadId: string) => {
    setContacts(prev => prev.map(c =>
      c.id === contactId ? { ...c, leadId } : c
    ));
  }, []);

  return {
    // State
    contacts,
    messages,
    campaigns,
    templates,
    automations,
    selectedContact,

    // Contact actions
    setSelectedContact,
    markAsRead,
    addTag,
    removeTag,

    // Message actions
    sendMessage,
    getContactMessages,

    // Campaign actions
    createCampaign,
    updateCampaignStatus,
    deleteCampaign,

    // Template actions
    createTemplate,
    submitTemplateForApproval,
    deleteTemplate,

    // Automation actions
    createAutomation,
    toggleAutomation,
    deleteAutomation,

    // Lead binding
    simulateIncomingMessage,
    linkContactToLead,
  };
}
