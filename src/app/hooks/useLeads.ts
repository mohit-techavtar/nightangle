import { useState, useCallback } from "react";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: "WhatsApp" | "Web" | "Phone" | "Referral" | "Manual";
  stage: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  score: number; // 0-100
  tags: string[];
  customFields: Record<string, string>;
  timeline: TimelineEntry[];
  firstTouchTimestamp: string;
  lastActivityTimestamp: string;
  assignedTo?: string;
  dealValue?: number;
  dealPipeline?: string;
  qualification: QualificationData;
  metadata: LeadMetadata;
}

export interface TimelineEntry {
  id: string;
  type: "message" | "call" | "email" | "note" | "stage_change" | "tag_added" | "field_updated" | "ai_qualification";
  content: string;
  timestamp: string;
  actor: string; // "user", "ai", "system"
  metadata?: Record<string, any>;
}

export interface QualificationData {
  status: "unqualified" | "qualifying" | "qualified" | "disqualified";
  budget?: string;
  timeline?: string;
  authority?: string;
  need?: string;
  aiScore?: number;
  qualifiedBy?: string;
  qualifiedAt?: string;
  disqualificationReason?: string;
}

export interface LeadMetadata {
  whatsappContactId?: string;
  initialMessage?: string;
  messageCount: number;
  lastMessageAt?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AIQualificationQuestion {
  id: string;
  question: string;
  field: string;
  type: "text" | "choice" | "number" | "boolean";
  options?: string[];
  required: boolean;
  order: number;
}

export interface ConversationUpdate {
  field: string;
  value: string;
  extractedBy: "user" | "ai";
  confidence?: number;
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead_1",
      name: "Sarah Chen",
      phone: "+1 (555) 123-4567",
      email: "sarah.chen@example.com",
      company: "TechCorp Inc",
      source: "WhatsApp",
      stage: "qualified",
      score: 85,
      tags: ["Enterprise", "High Priority", "Q2 2026"],
      customFields: {
        industry: "Technology",
        employees: "500-1000",
        region: "North America"
      },
      timeline: [
        {
          id: "t1",
          type: "message",
          content: "Initial inquiry about enterprise plan",
          timestamp: "2026-04-20T14:25:00Z",
          actor: "user"
        },
        {
          id: "t2",
          type: "ai_qualification",
          content: "AI qualified lead: Budget confirmed ($50k+), Timeline: Q2 2026, Authority: Decision maker",
          timestamp: "2026-04-20T14:30:00Z",
          actor: "ai",
          metadata: { aiScore: 85 }
        },
        {
          id: "t3",
          type: "stage_change",
          content: "Stage changed from 'contacted' to 'qualified'",
          timestamp: "2026-04-20T14:31:00Z",
          actor: "system"
        }
      ],
      firstTouchTimestamp: "2026-04-20T14:25:00Z",
      lastActivityTimestamp: "2026-04-20T14:31:00Z",
      assignedTo: "John Smith",
      dealValue: 50000,
      dealPipeline: "Enterprise Sales",
      qualification: {
        status: "qualified",
        budget: "$50,000+",
        timeline: "Q2 2026",
        authority: "Decision Maker",
        need: "CRM + AI Calling Platform",
        aiScore: 85,
        qualifiedBy: "AI Assistant",
        qualifiedAt: "2026-04-20T14:30:00Z"
      },
      metadata: {
        whatsappContactId: "1",
        initialMessage: "Hi! I have a question about your services",
        messageCount: 12,
        lastMessageAt: "2026-04-20T14:31:00Z",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "enterprise-q2"
      }
    }
  ]);

  const [aiQualificationQuestions] = useState<AIQualificationQuestion[]>([
    { id: "q1", question: "What's your budget range for this solution?", field: "budget", type: "choice", options: ["< $10k", "$10k - $50k", "$50k+", "Not sure"], required: true, order: 1 },
    { id: "q2", question: "When are you looking to implement?", field: "timeline", type: "choice", options: ["Immediately", "Within 1 month", "1-3 months", "3+ months"], required: true, order: 2 },
    { id: "q3", question: "Are you the decision maker?", field: "authority", type: "choice", options: ["Yes, I make the final decision", "I'm part of the decision team", "I'm gathering information", "Other"], required: true, order: 3 },
    { id: "q4", question: "What's your primary need?", field: "need", type: "text", required: true, order: 4 },
    { id: "q5", question: "Company size (number of employees)?", field: "company_size", type: "choice", options: ["1-10", "11-50", "51-200", "201-500", "500+"], required: false, order: 5 }
  ]);

  // Create lead from WhatsApp message
  const createLeadFromWhatsApp = useCallback((phone: string, name: string, initialMessage: string, whatsappContactId: string) => {
    const existingLead = leads.find(l => l.phone === phone);
    if (existingLead) {
      return existingLead;
    }

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: name || "Unknown",
      phone,
      source: "WhatsApp",
      stage: "new",
      score: 0,
      tags: ["WhatsApp Lead"],
      customFields: {},
      timeline: [
        {
          id: `t_${Date.now()}`,
          type: "message",
          content: initialMessage,
          timestamp: new Date().toISOString(),
          actor: "user"
        }
      ],
      firstTouchTimestamp: new Date().toISOString(),
      lastActivityTimestamp: new Date().toISOString(),
      qualification: {
        status: "unqualified"
      },
      metadata: {
        whatsappContactId,
        initialMessage,
        messageCount: 1,
        lastMessageAt: new Date().toISOString()
      }
    };

    setLeads(prev => [...prev, newLead]);
    return newLead;
  }, [leads]);

  // Find lead by phone
  const findLeadByPhone = useCallback((phone: string) => {
    return leads.find(l => l.phone === phone);
  }, [leads]);

  // Update lead stage
  const updateLeadStage = useCallback((leadId: string, newStage: Lead["stage"], actor: string = "user") => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      const timelineEntry: TimelineEntry = {
        id: `t_${Date.now()}`,
        type: "stage_change",
        content: `Stage changed from '${lead.stage}' to '${newStage}'`,
        timestamp: new Date().toISOString(),
        actor
      };

      return {
        ...lead,
        stage: newStage,
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Update lead score
  const updateLeadScore = useCallback((leadId: string, scoreChange: number, reason?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      const newScore = Math.max(0, Math.min(100, lead.score + scoreChange));
      const timelineEntry: TimelineEntry = {
        id: `t_${Date.now()}`,
        type: "note",
        content: reason || `Score ${scoreChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(scoreChange)} points`,
        timestamp: new Date().toISOString(),
        actor: "system",
        metadata: { oldScore: lead.score, newScore }
      };

      return {
        ...lead,
        score: newScore,
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Add tag to lead
  const addLeadTag = useCallback((leadId: string, tag: string, actor: string = "user") => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId || lead.tags.includes(tag)) return lead;

      const timelineEntry: TimelineEntry = {
        id: `t_${Date.now()}`,
        type: "tag_added",
        content: `Tag added: ${tag}`,
        timestamp: new Date().toISOString(),
        actor
      };

      return {
        ...lead,
        tags: [...lead.tags, tag],
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Remove tag from lead
  const removeLeadTag = useCallback((leadId: string, tag: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      return {
        ...lead,
        tags: lead.tags.filter(t => t !== tag),
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Update lead field
  const updateLeadField = useCallback((leadId: string, field: string, value: string, actor: string = "user") => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      const timelineEntry: TimelineEntry = {
        id: `t_${Date.now()}`,
        type: "field_updated",
        content: `${field} updated to: ${value}`,
        timestamp: new Date().toISOString(),
        actor,
        metadata: { field, value }
      };

      // Handle standard fields
      const updates: Partial<Lead> = {};
      if (field === "email") updates.email = value;
      else if (field === "company") updates.company = value;
      else if (field === "name") updates.name = value;
      else {
        // Custom field
        updates.customFields = { ...lead.customFields, [field]: value };
      }

      return {
        ...lead,
        ...updates,
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // AI Qualification
  const qualifyLeadWithAI = useCallback((leadId: string, answers: Record<string, string>) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      // Calculate AI score based on answers
      let aiScore = 0;
      if (answers.budget === "$50k+") aiScore += 30;
      else if (answers.budget === "$10k - $50k") aiScore += 20;
      else if (answers.budget === "< $10k") aiScore += 10;

      if (answers.timeline === "Immediately") aiScore += 25;
      else if (answers.timeline === "Within 1 month") aiScore += 20;
      else if (answers.timeline === "1-3 months") aiScore += 15;

      if (answers.authority === "Yes, I make the final decision") aiScore += 25;
      else if (answers.authority === "I'm part of the decision team") aiScore += 15;

      if (answers.need) aiScore += 20;

      const qualificationStatus = aiScore >= 70 ? "qualified" : aiScore >= 40 ? "qualifying" : "disqualified";

      const timelineEntry: TimelineEntry = {
        id: `t_${Date.now()}`,
        type: "ai_qualification",
        content: `AI qualified lead: ${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join(", ")}`,
        timestamp: new Date().toISOString(),
        actor: "ai",
        metadata: { aiScore, answers }
      };

      return {
        ...lead,
        score: Math.max(lead.score, aiScore),
        qualification: {
          ...lead.qualification,
          status: qualificationStatus,
          budget: answers.budget,
          timeline: answers.timeline,
          authority: answers.authority,
          need: answers.need,
          aiScore,
          qualifiedBy: "AI Assistant",
          qualifiedAt: new Date().toISOString()
        },
        stage: qualificationStatus === "qualified" ? "qualified" : lead.stage,
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Add timeline entry
  const addTimelineEntry = useCallback((leadId: string, entry: Omit<TimelineEntry, "id" | "timestamp">) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      const timelineEntry: TimelineEntry = {
        ...entry,
        id: `t_${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      return {
        ...lead,
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Update deal information
  const updateLeadDeal = useCallback((leadId: string, dealValue?: number, dealPipeline?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      const timelineEntry: TimelineEntry = {
        id: `t_${Date.now()}`,
        type: "note",
        content: `Deal updated: ${dealValue ? `Value: $${dealValue}` : ''} ${dealPipeline ? `Pipeline: ${dealPipeline}` : ''}`,
        timestamp: new Date().toISOString(),
        actor: "user"
      };

      return {
        ...lead,
        dealValue,
        dealPipeline,
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Assign lead to user
  const assignLead = useCallback((leadId: string, userId: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      const timelineEntry: TimelineEntry = {
        id: `t_${Date.now()}`,
        type: "note",
        content: `Lead assigned to ${userId}`,
        timestamp: new Date().toISOString(),
        actor: "system"
      };

      return {
        ...lead,
        assignedTo: userId,
        timeline: [...lead.timeline, timelineEntry],
        lastActivityTimestamp: new Date().toISOString()
      };
    }));
  }, []);

  // Process conversation update (AI-extracted or user-provided)
  const processConversationUpdate = useCallback((leadId: string, updates: ConversationUpdate[]) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;

      let updatedLead = { ...lead };

      updates.forEach(update => {
        // Update the field
        if (update.field === "email") updatedLead.email = update.value;
        else if (update.field === "company") updatedLead.company = update.value;
        else if (update.field === "name") updatedLead.name = update.value;
        else {
          updatedLead.customFields = { ...updatedLead.customFields, [update.field]: update.value };
        }

        // Add timeline entry
        const timelineEntry: TimelineEntry = {
          id: `t_${Date.now()}_${update.field}`,
          type: "field_updated",
          content: `${update.field} ${update.extractedBy === 'ai' ? 'auto-detected' : 'updated'}: ${update.value}`,
          timestamp: new Date().toISOString(),
          actor: update.extractedBy,
          metadata: { field: update.field, value: update.value, confidence: update.confidence }
        };

        updatedLead.timeline = [...updatedLead.timeline, timelineEntry];
      });

      updatedLead.lastActivityTimestamp = new Date().toISOString();
      return updatedLead;
    }));
  }, []);

  return {
    // State
    leads,
    aiQualificationQuestions,

    // Actions
    createLeadFromWhatsApp,
    findLeadByPhone,
    updateLeadStage,
    updateLeadScore,
    addLeadTag,
    removeLeadTag,
    updateLeadField,
    qualifyLeadWithAI,
    addTimelineEntry,
    updateLeadDeal,
    assignLead,
    processConversationUpdate
  };
}
