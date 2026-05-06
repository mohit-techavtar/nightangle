# WhatsApp CRM & Messaging Engine - Complete Redesign

## Overview
Complete redesign based on PRD requirements for a conversion engine with audit ability, AI governance, and role-based control.

## Module Structure

### 1. **Account Setup & Settings** ✅ IMPLEMENTED
**File**: `src/app/pages/customer/WhatsAppSetup.tsx`
**Route**: `/tenant/whatsapp/setup`

**Features**:
- 5-step setup wizard
- Meta Business Account connection
- WhatsApp Business Number registration
- API credentials configuration
- Webhook setup with auto-generated URLs
- Connection status verification
- Helpful resources and documentation links

**Flow**:
1. Meta Business Account → 2. Phone Number → 3. API Config → 4. Webhooks → 5. Verification

---

### 2. **WhatsApp Dashboard** (NEEDS UPDATE)
**File**: `src/app/pages/customer/WhatsAppDashboard.tsx`
**Route**: `/tenant/whatsapp`

**Required Metrics** (from PRD):
- Message Delivery Status
- Read Rates
- Response Rates
- Conversion Events
- AI vs Human Performance
- Campaign Effectiveness
- Lead Velocity Metrics
- Revenue Attribution (CRM Mode)

**Key Widgets**:
- Total Conversations (with trend)
- Delivery Rate %
- AI Resolution Rate %
- Leads Auto-Created
- 24h Message Volume Chart
- Conversation Status Distribution
- Active Campaigns Table
- Recent Conversations Feed
- Quick Actions (New Campaign, Settings, Test Message)

---

### 3. **Inbox with AI/Human Handoff** (NEEDS ENHANCEMENT)
**File**: `src/app/pages/customer/WhatsAppInbox.tsx`
**Route**: `/tenant/whatsapp/inbox`

**Required Features**:
- ✅ Auto-create leads from messages
- ✅ Lead profile sidebar
- ✅ AI qualification modal
- ❌ AI/Human/Hybrid ownership toggle
- ❌ Escalation controls
- ❌ AI confidence score display
- ❌ 24-hour session window indicator
- ❌ SLA timer
- ❌ Quick replies
- ❌ Template message selector
- ❌ Media upload (image, video, document, audio)
- ❌ Interactive buttons builder
- ❌ List messages
- ❌ CTA buttons

**Ownership Modes**:
- AI-Owned: AI handles automatically
- Human-Owned: Agent controls
- Hybrid Assist: AI suggests, human approves

**Escalation Triggers**:
- Customer request ("speak to human")
- AI low-confidence score (< 70%)
- Negative sentiment detection
- Compliance-sensitive query
- Manual agent takeover

---

### 4. **Leads Management** ✅ PARTIALLY IMPLEMENTED
**File**: `src/app/pages/customer/LeadsWhatsApp.tsx`
**Route**: `/tenant/whatsapp/leads`

**Current Features**:
- Lead table with filtering
- Stage management
- AI qualification
- Lead profile sidebar
- Tag management
- Deal tracking

**Missing Features**:
- Timeline sync to CRM (CRM mode)
- Stage change automation triggers
- Lead scoring visualization
- Bulk operations
- Export functionality

---

### 5. **Campaign Engine** (NEEDS COMPLETE REBUILD)
**Files Needed**:
- `src/app/pages/customer/WhatsAppCampaigns.tsx` (list)
- `src/app/pages/customer/CreateBroadcastCampaign.tsx`
- `src/app/pages/customer/CreateDripCampaign.tsx`
- `src/app/pages/customer/CreateEventCampaign.tsx`
- `src/app/pages/customer/CreateAIFollowupCampaign.tsx`
- `src/app/pages/customer/CreateCallToWhatsAppCampaign.tsx`

**Campaign Types Required**:

#### 5.1 Broadcast Campaign
- Verified broadcast list
- Template selection (approved only)
- Audience segmentation
- Opt-in verification
- Daily send cap configuration
- Time window restrictions
- Budget guardrails
- Schedule (now or later)

#### 5.2 Drip Sequence
- Multi-message flow
- Time delays between messages
- Trigger conditions
- Exit rules
- A/B testing support

#### 5.3 Event-Based Trigger
- Event selection (lead created, stage changed, etc.)
- Condition builder
- Template mapping
- Throttling rules

#### 5.4 AI Follow-up Campaign
- AI qualification integration
- Smart follow-up timing
- Personalization variables
- Success criteria
- Auto-pause rules

#### 5.5 Call-to-WhatsApp
- Click-to-chat links
- QR code generation
- UTM tracking
- Landing page integration
- Pre-filled messages

**Campaign Outcomes Must Update**:
- Standalone: Lead Stage, Lead Score, Timeline
- CRM Mode: CRM Lead Stage, CRM Score, CRM Deal Object

---

### 6. **Template Management** (NEEDS ENHANCEMENT)
**File**: `src/app/pages/customer/WhatsAppTemplates.tsx`
**Route**: `/tenant/whatsapp/templates`

**Current**: Basic template list
**Needed**: Full lifecycle management

**Template Lifecycle**:
1. Draft → 2. Submitted → 3. Approved/Rejected → 4. Archived

**Features Required**:
- Category selection (Marketing, Utility, Authentication)
- Language selection
- Variable management with preview
- CTA buttons builder
- Header/Footer configuration
- Interactive buttons
- List message builder
- Template versioning
- Usage analytics per template
- Meta approval status tracking
- Rejection reason display
- Re-submission workflow

**Template Attributes**:
- Language
- Category (Marketing/Utility/Authentication)
- Variables (dynamic content)
- CTA buttons
- Header (text/image/video/document)
- Footer (text only)
- Quick reply buttons
- Version number

---

### 7. **Automation & Workflows** ✅ PARTIALLY IMPLEMENTED
**File**: `src/app/pages/customer/CreateWhatsAppAutomation.tsx`
**Route**: `/tenant/whatsapp/automation/create`

**Current**: Node-based visual builder
**Needed Enhancements**:
- Additional trigger types
- More action nodes
- Conditional branching
- Loop detection
- AI throttling controls
- Testing/simulation mode
- Version control
- Analytics per automation

**Trigger Types Needed**:
- Lead Stage Change
- Task Creation
- Callback Scheduling
- AI Call Initiation
- Campaign Enrollment
- SLA Escalation
- Time-based schedules
- Webhook events

---

### 8. **Consent & Compliance** (NEW PAGE NEEDED)
**File**: `src/app/pages/customer/WhatsAppConsent.tsx`
**Route**: `/tenant/whatsapp/consent`

**Features Required**:
- Opt-in contacts list
- Opt-out requests tracking
- Consent timestamp logging
- Export consent records
- GDPR deletion requests
- Retention policy configuration
- Blocked numbers management
- Audit log

**Consent Status**:
- Opted In (with timestamp)
- Opted Out (with reason)
- Pending Verification
- Blocked

---

### 9. **Analytics & Reporting** (NEW PAGE NEEDED)
**File**: `src/app/pages/customer/WhatsAppAnalytics.tsx`
**Route**: `/tenant/whatsapp/analytics`

**Metrics from PRD**:
- Message Delivery Status
- Read Rates
- Response Rates
- Conversion Events
- AI vs Human Performance
- Campaign Effectiveness
- Lead Velocity Metrics
- Revenue Attribution (CRM Mode)

**Reports Needed**:
- Daily/Weekly/Monthly aggregates
- Campaign performance comparison
- Template usage analytics
- Agent performance (AI vs Human)
- Lead conversion funnel
- Revenue attribution
- Cost per conversation
- Response time SLA compliance

**Visualizations**:
- Message volume trends
- Delivery rate over time
- Campaign ROI
- Lead source breakdown
- Conversion funnel
- AI escalation rates

---

### 10. **API & Webhooks** (NEW PAGE NEEDED)
**File**: `src/app/pages/customer/WhatsAppAPI.tsx`
**Route**: `/tenant/whatsapp/api`

**Features Required**:
- API key generation
- Webhook configuration
- Event subscriptions
- API documentation
- Rate limiting configuration
- Usage analytics
- OAuth/API Key auth
- Versioned endpoints

**Events Exposed** (from PRD):
- New Lead
- New Message
- Campaign Sent
- Stage Updated
- Opt-In Changed
- SLA Breach

**Integration Support**:
- Third-party CRM sync
- ERP systems
- Marketing automation tools
- Custom analytics

---

### 11. **Settings** (NEEDS SPLIT)
**Current**: `src/app/pages/customer/WhatsAppSettings.tsx`
**Needs**: Split into multiple tabs

**Settings Categories**:

#### 11.1 Account Settings
- Business profile
- Display name
- Category
- Description
- Profile photo
- Business hours

#### 11.2 Messaging Settings
- Quick replies library
- Greeting message
- Away message
- Business hours message
- Default template

#### 11.3 AI Configuration
- AI enable/disable toggle
- Confidence threshold
- Escalation rules
- Auto-response delay
- Context injection sources
- Compliance rules
- Infinite loop detection

#### 11.4 Cost Controls
- Daily spending cap
- Campaign budget limits
- AI message throttling
- Rate limiting per phone
- Warning thresholds

#### 11.5 Team & Permissions
- User assignments
- Role-based permissions
- Agent routing rules
- SLA configuration

#### 11.6 Compliance
- Retention policy
- Data deletion settings
- Consent requirements
- Audit log retention

---

## Navigation Structure

```
WhatsApp
├── Dashboard (/)
├── Inbox (/inbox)
│   ├── All Conversations
│   ├── AI Handled
│   ├── Human Handled
│   ├── Escalated
│   └── Unread
├── Leads (/leads)
│   ├── All Leads
│   ├── Qualified
│   ├── New
│   └── Converted
├── Campaigns (/campaigns)
│   ├── All Campaigns
│   ├── Create New
│   │   ├── Broadcast
│   │   ├── Drip Sequence
│   │   ├── Event-Based
│   │   ├── AI Follow-up
│   │   └── Call-to-WhatsApp
│   └── Campaign Details
├── Templates (/templates)
│   ├── All Templates
│   ├── Create Template
│   ├── Draft
│   ├── Pending Approval
│   ├── Approved
│   └── Rejected
├── Automation (/automation)
│   ├── All Automations
│   ├── Create Automation
│   └── Automation Analytics
├── Analytics (/analytics)
│   ├── Overview
│   ├── Campaigns
│   ├── Messages
│   ├── AI Performance
│   └── Revenue Attribution
├── Consent (/consent)
│   ├── Opted In
│   ├── Opted Out
│   ├── Blocked Numbers
│   └── Audit Log
├── API & Webhooks (/api)
│   ├── API Keys
│   ├── Webhooks
│   ├── Documentation
│   └── Usage Analytics
└── Settings (/settings)
    ├── Account
    ├── Messaging
    ├── AI Configuration
    ├── Cost Controls
    ├── Team & Permissions
    └── Compliance
```

---

## Data Models

### WhatsAppAccount
```typescript
{
  id: string;
  tenantId: string;
  businessName: string;
  phoneNumber: string;
  phoneNumberId: string;
  displayName: string;
  category: string;
  businessAccountId: string;
  appId: string;
  appSecret: string (encrypted);
  accessToken: string (encrypted);
  webhookUrl: string;
  verifyToken: string;
  status: "active" | "pending" | "suspended";
  connectionStatus: {
    metaConnected: boolean;
    phoneVerified: boolean;
    webhookConfigured: boolean;
  };
  createdAt: string;
  lastVerifiedAt: string;
}
```

### WhatsAppMessage (Enhanced)
```typescript
{
  id: string;
  conversationId: string;
  leadId: string;
  tenantId: string;
  campaignId?: string;
  from: string;
  to: string;
  type: "text" | "image" | "video" | "audio" | "document" | "location" | "interactive" | "template";
  content: string;
  mediaUrl?: string;
  direction: "inbound" | "outbound";
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  ownership: "ai" | "human" | "hybrid";
  aiConfidence?: number;
  isEscalated: boolean;
  templateId?: string;
  interactive?: {
    type: "button" | "list" | "cta";
    data: any;
  };
  metadata: {
    cost?: number;
    sessionWindowOpen: boolean;
    sessionExpiresAt?: string;
  };
}
```

### WhatsAppConversation
```typescript
{
  id: string;
  leadId: string;
  tenantId: string;
  phoneNumber: string;
  status: "active" | "resolved" | "escalated";
  ownership: "ai" | "human" | "hybrid";
  assignedTo?: string; // user ID
  lastMessageAt: string;
  unreadCount: number;
  sessionWindowOpen: boolean;
  sessionExpiresAt?: string;
  tags: string[];
  slaBreached: boolean;
  metadata: {
    firstContactAt: string;
    totalMessages: number;
    aiMessages: number;
    humanMessages: number;
    escalationCount: number;
  };
}
```

### WhatsAppCampaign (Enhanced)
```typescript
{
  id: string;
  tenantId: string;
  name: string;
  type: "broadcast" | "drip" | "event_based" | "ai_followup" | "call_to_whatsapp";
  status: "draft" | "scheduled" | "running" | "paused" | "completed";
  templateId: string;
  templateName: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  converted: number;
  rules: {
    dailyCap: number;
    timeWindowStart: string;
    timeWindowEnd: string;
    budgetLimit: number;
    optInRequired: boolean;
  };
  schedule: {
    type: "immediate" | "scheduled" | "recurring";
    scheduledAt?: string;
    timezone?: string;
    recurring?: {
      frequency: "daily" | "weekly" | "monthly";
      interval: number;
    };
  };
  outcomes: {
    leadStageChanges: number;
    leadScoreImpact: number;
    dealsCreated: number;
    revenue: number;
  };
  createdAt: string;
  lastRunAt?: string;
}
```

### WhatsAppTemplate (Enhanced)
```typescript
{
  id: string;
  tenantId: string;
  name: string;
  category: "marketing" | "utility" | "authentication";
  language: string;
  status: "draft" | "submitted" | "approved" | "rejected" | "archived";
  content: {
    header?: {
      type: "text" | "image" | "video" | "document";
      content: string;
    };
    body: string;
    footer?: string;
  };
  variables: string[];
  buttons?: {
    type: "quick_reply" | "call_to_action" | "url";
    text: string;
    value: string;
  }[];
  version: number;
  approvalDetails: {
    submittedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    metaTemplateId?: string;
  };
  usage: {
    totalSent: number;
    campaigns: number;
    lastUsedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### ConsentRecord
```typescript
{
  id: string;
  tenantId: string;
  phoneNumber: string;
  leadId?: string;
  status: "opted_in" | "opted_out" | "blocked";
  consentedAt?: string;
  optedOutAt?: string;
  optOutReason?: string;
  source: "whatsapp" | "manual" | "campaign" | "api";
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    campaignId?: string;
  };
  auditLog: {
    timestamp: string;
    action: string;
    performedBy: string;
  }[];
}
```

---

## Implementation Priority

### Phase 1: Core Infrastructure ✅
1. ✅ WhatsApp Setup page
2. ✅ Lead capture & binding (useLeads hook)
3. ✅ Basic inbox with lead creation

### Phase 2: Compliance & Governance
1. ❌ Consent management page
2. ❌ Opt-in/opt-out enforcement
3. ❌ Session window tracking
4. ❌ Cost control guards

### Phase 3: Messaging Capabilities
1. ❌ Enhanced inbox with AI/Human handoff
2. ❌ Interactive message types
3. ❌ Template message selector in chat
4. ❌ Media upload
5. ❌ Quick replies

### Phase 4: Campaign Engine
1. ❌ Broadcast campaign
2. ❌ Drip sequence
3. ❌ Event-based triggers
4. ❌ AI follow-up
5. ❌ Call-to-WhatsApp

### Phase 5: Analytics & API
1. ❌ Analytics dashboard
2. ❌ API key management
3. ❌ Webhook configuration
4. ❌ Usage reporting

---

## Next Steps

1. **Update existing WhatsApp Dashboard** with PRD metrics
2. **Enhance Inbox** with AI/Human handoff controls
3. **Create Consent Management** page (critical for compliance)
4. **Build Campaign creation** pages for all 5 types
5. **Create Analytics** dashboard
6. **Add API & Webhooks** management
7. **Split Settings** into tabbed interface
8. **Update all routes** and navigation

---

## Files Status

### ✅ Completed
- `src/app/pages/customer/WhatsAppSetup.tsx` - Account setup
- `src/app/pages/customer/LeadsWhatsApp.tsx` - Lead management
- `src/app/pages/customer/WhatsAppInbox.tsx` - Basic inbox with lead capture
- `src/app/pages/customer/CreateWhatsAppAutomation.tsx` - Node-based automation
- `src/app/hooks/useLeads.ts` - Lead management hook
- `src/app/components/whatsapp/LeadProfileSidebar.tsx` - Lead sidebar
- `src/app/components/whatsapp/AIQualificationModal.tsx` - AI qualification

### ❌ Needs Creation
- Consent management page
- Enhanced analytics dashboard
- API & Webhooks page
- 5 campaign type pages
- Enhanced settings (tabbed)

### ⚠️ Needs Enhancement
- WhatsAppDashboard.tsx - Add PRD metrics
- WhatsAppInbox.tsx - AI/Human handoff
- WhatsAppTemplates.tsx - Full lifecycle
- WhatsAppCampaigns.tsx - Campaign types

---

## Compliance Checklist

From PRD Section 14.2:

- [ ] Track consent timestamp
- [ ] Enforce opt-out immediately
- [ ] Block messaging to non-consented users
- [ ] Respect retention policy per tenant
- [ ] Support data deletion request
- [ ] 24-hour session window enforcement
- [ ] Template-only campaign initiation
- [ ] Rate limiting per tenant
- [ ] Daily send caps
- [ ] AI throttling
- [ ] Infinite loop detection
- [ ] Audit logs (12 months minimum)
- [ ] Encryption in transit & at rest
- [ ] Multi-tenant isolation
