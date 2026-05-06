// ============================================================
// OmniCRM — India-Primary Seed Data
// INR, IST, en-IN, +91 prefix, Indian states
// ============================================================
import type {
  Tenant, User, Lead, Deal, AIAgent, AICall, Campaign, Invoice, AuditLog,
  WhatsAppTemplate, SMSDLTTemplate, CustomObject, License, ApprovalRequest,
  Role, UserSession, PermissionSet
} from './types';

// ─── Tenants (12) ────────────────────────────────────────────
export const seedTenants: Tenant[] = [
  {
    id: 'TNT-001', name: 'TechAvtar India Pvt Ltd', slug: 'techavtar',
    status: 'Active', plan: 'Growth', gstin: '27AABCT1332L1ZV', pan: 'AABCT1332L',
    email: 'admin@techavtar.in', phone: '+919876543210', currency: 'INR',
    address: '4th Floor, Platina, Bandra Kurla Complex', city: 'Mumbai',
    state: 'Maharashtra', pin: '400051', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 18500, creditLimit: 50000, usedCredits: 31500,
    licenseId: 'LIC-001', createdAt: '2024-04-01T09:00:00Z', updatedAt: '2025-01-15T10:30:00Z',
    kycStatus: 'Verified', hardStopActive: false
  },
  {
    id: 'TNT-002', name: 'Everest Digital Solutions', slug: 'everest',
    status: 'Active', plan: 'Enterprise', gstin: '07AADCE2207R1Z5', pan: 'AADCE2207R',
    email: 'ops@everestdigital.co.in', phone: '+919811234567', currency: 'INR',
    address: 'Tower B, Cyber Hub, DLF Phase 2', city: 'Gurugram',
    state: 'Haryana', pin: '122002', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 75200, creditLimit: 200000, usedCredits: 124800,
    licenseId: 'LIC-002', createdAt: '2024-02-15T10:00:00Z', updatedAt: '2025-02-01T08:00:00Z',
    kycStatus: 'Verified', hardStopActive: false
  },
  {
    id: 'TNT-003', name: 'Sunrise Realty Ltd', slug: 'sunrise',
    status: 'Active', plan: 'Starter', gstin: '36AAACS0324K1ZC', pan: 'AAACS0324K',
    email: 'crm@sunriserealty.com', phone: '+914066789012', currency: 'INR',
    address: 'Plot 45, Hitech City, Madhapur', city: 'Hyderabad',
    state: 'Telangana', pin: '500081', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 3200, creditLimit: 10000, usedCredits: 6800,
    licenseId: 'LIC-003', createdAt: '2024-06-10T11:00:00Z', updatedAt: '2025-01-20T09:15:00Z',
    kycStatus: 'Verified', hardStopActive: false
  },
  {
    id: 'TNT-004', name: 'Global Fintech Services', slug: 'globalfintech',
    status: 'Provisioning', plan: 'Growth', gstin: '33AABCG9182M1ZQ', pan: 'AABCG9182M',
    email: 'it@globalfintech.in', phone: '+914422345678', currency: 'INR',
    address: 'No 8, Rajiv Gandhi Salai', city: 'Chennai',
    state: 'Tamil Nadu', pin: '600096', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 0, creditLimit: 25000, usedCredits: 0,
    licenseId: null, createdAt: '2025-03-28T14:00:00Z', updatedAt: '2025-04-10T10:00:00Z',
    kycStatus: 'Pending', hardStopActive: false
  },
  {
    id: 'TNT-005', name: 'Bharat EduTech Pvt Ltd', slug: 'bharatedutech',
    status: 'Active', plan: 'Growth', gstin: '09AABCB9876E1Z2', pan: 'AABCB9876E',
    email: 'admin@bharatedutech.com', phone: '+919555012345', currency: 'INR',
    address: 'Sec 135, Noida', city: 'Noida',
    state: 'Uttar Pradesh', pin: '201304', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 9800, creditLimit: 30000, usedCredits: 20200,
    licenseId: 'LIC-004', createdAt: '2024-08-20T09:30:00Z', updatedAt: '2025-01-05T11:00:00Z',
    kycStatus: 'Verified', hardStopActive: false
  },
  {
    id: 'TNT-006', name: 'Nexus Healthcare India', slug: 'nexushealthcare',
    status: 'Suspended', plan: 'Starter', gstin: '24AAACN7654P1Z1', pan: 'AAACN7654P',
    email: 'crm@nexushealth.in', phone: '+912798765432', currency: 'INR',
    address: 'Sg Highway, Ahmedabad', city: 'Ahmedabad',
    state: 'Gujarat', pin: '380054', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 0, creditLimit: 10000, usedCredits: 10000,
    licenseId: 'LIC-005', createdAt: '2024-03-12T08:00:00Z', updatedAt: '2025-02-14T16:00:00Z',
    kycStatus: 'Verified', hardStopActive: true
  },
  {
    id: 'TNT-007', name: 'Indus Agri Solutions', slug: 'indusagri',
    status: 'Active', plan: 'Enterprise', gstin: '08AABCI4567L1ZX', pan: 'AABCI4567L',
    email: 'ops@indusagri.com', phone: '+916012334567', currency: 'INR',
    address: 'Bhawani Singh Road', city: 'Jaipur',
    state: 'Rajasthan', pin: '302001', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 42000, creditLimit: 100000, usedCredits: 58000,
    licenseId: 'LIC-006', createdAt: '2023-12-01T10:00:00Z', updatedAt: '2025-03-10T12:00:00Z',
    kycStatus: 'Verified', hardStopActive: false
  },
  {
    id: 'TNT-008', name: 'CloudStack Technologies', slug: 'cloudstack',
    status: 'Trial', plan: 'Trial', gstin: '', pan: 'AABCC8901K',
    email: 'hello@cloudstack.io', phone: '+919900112233', currency: 'INR',
    address: 'IndiQube, Koramangala', city: 'Bengaluru',
    state: 'Karnataka', pin: '560034', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 500, creditLimit: 500, usedCredits: 0,
    licenseId: null, createdAt: '2025-04-01T09:00:00Z', updatedAt: '2025-04-10T09:00:00Z',
    kycStatus: 'Pending', hardStopActive: false
  },
  {
    id: 'TNT-009', name: 'Vedanta Logistics Pvt Ltd', slug: 'vedanta',
    status: 'Active', plan: 'Growth', gstin: '21AABCV5432T1ZR', pan: 'AABCV5432T',
    email: 'admin@vedantalog.in', phone: '+916751234567', currency: 'INR',
    address: 'Infocity Area', city: 'Bhubaneswar',
    state: 'Odisha', pin: '751024', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 14600, creditLimit: 40000, usedCredits: 25400,
    licenseId: 'LIC-007', createdAt: '2024-05-18T11:00:00Z', updatedAt: '2025-01-30T14:00:00Z',
    kycStatus: 'Verified', hardStopActive: false
  },
  {
    id: 'TNT-010', name: 'Metro Insurance Brokers', slug: 'metro',
    status: 'Active', plan: 'Starter', gstin: '27AABCM3456N1ZP', pan: 'AABCM3456N',
    email: 'crm@metroinsure.co.in', phone: '+912234567890', currency: 'INR',
    address: 'Nariman Point', city: 'Mumbai',
    state: 'Maharashtra', pin: '400021', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 5400, creditLimit: 15000, usedCredits: 9600,
    licenseId: 'LIC-008', createdAt: '2024-07-07T08:30:00Z', updatedAt: '2025-02-25T11:00:00Z',
    kycStatus: 'Verified', hardStopActive: false
  },
  {
    id: 'TNT-011', name: 'Pinnacle Manufacturing', slug: 'pinnacle',
    status: 'Locked', plan: 'Growth', gstin: '23AABCP7654Q1Z9', pan: 'AABCP7654Q',
    email: 'it@pinnaclemnfg.com', phone: '+917312345678', currency: 'INR',
    address: 'Industrial Estate, Sector 4', city: 'Bhopal',
    state: 'Madhya Pradesh', pin: '462023', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 0, creditLimit: 25000, usedCredits: 25000,
    licenseId: 'LIC-009', createdAt: '2024-01-10T09:00:00Z', updatedAt: '2025-03-01T16:00:00Z',
    kycStatus: 'Verified', hardStopActive: true
  },
  {
    id: 'TNT-012', name: 'Alpha Pharma Distributors', slug: 'alphapharma',
    status: 'Active', plan: 'Enterprise', gstin: '29AABCA1234Z1ZB', pan: 'AABCA1234Z',
    email: 'ops@alphapharma.in', phone: '+918012345678', currency: 'INR',
    address: '100 Feet Road, Indiranagar', city: 'Bengaluru',
    state: 'Karnataka', pin: '560038', country: 'India',
    timezone: 'Asia/Kolkata', locale: 'en-IN',
    creditBalance: 88000, creditLimit: 200000, usedCredits: 112000,
    licenseId: 'LIC-010', createdAt: '2023-10-01T10:00:00Z', updatedAt: '2025-04-01T09:00:00Z',
    kycStatus: 'Verified', hardStopActive: false
  }
];

// ─── Users (for TNT-001) ─────────────────────────────────────
export const seedUsers: User[] = [
  {
    id: 'USR-001', tenantId: 'TNT-001', name: 'Rajesh Sharma', email: 'rajesh@techavtar.in',
    phone: '+919876543210', role: 'Tenant Admin', roleIds: ['ROLE-ADMIN'],
    status: 'Active', avatar: 'RS', twoFAEnabled: true,
    lastLogin: '2025-04-27T08:15:00Z', createdAt: '2024-04-01T09:00:00Z', department: 'Management'
  },
  {
    id: 'USR-002', tenantId: 'TNT-001', name: 'Priya Mehta', email: 'priya@techavtar.in',
    phone: '+919800123456', role: 'Manager', roleIds: ['ROLE-MANAGER'],
    status: 'Active', avatar: 'PM', twoFAEnabled: true,
    lastLogin: '2025-04-27T09:00:00Z', createdAt: '2024-04-02T10:00:00Z', department: 'Sales'
  },
  {
    id: 'USR-003', tenantId: 'TNT-001', name: 'Amit Kumar', email: 'amit@techavtar.in',
    phone: '+919711234567', role: 'Sales Agent', roleIds: ['ROLE-SALES'],
    status: 'Active', avatar: 'AK', twoFAEnabled: false,
    lastLogin: '2025-04-26T17:00:00Z', createdAt: '2024-04-05T11:00:00Z', department: 'Sales'
  },
  {
    id: 'USR-004', tenantId: 'TNT-001', name: 'Sneha Reddy', email: 'sneha@techavtar.in',
    phone: '+919822345678', role: 'Sales Agent', roleIds: ['ROLE-SALES'],
    status: 'Active', avatar: 'SR', twoFAEnabled: false,
    lastLogin: '2025-04-27T10:30:00Z', createdAt: '2024-04-05T11:00:00Z', department: 'Sales'
  },
  {
    id: 'USR-005', tenantId: 'TNT-001', name: 'Vikram Joshi', email: 'vikram@techavtar.in',
    phone: '+919933456789', role: 'Support Agent', roleIds: ['ROLE-SUPPORT'],
    status: 'Active', avatar: 'VJ', twoFAEnabled: false,
    lastLogin: '2025-04-25T14:00:00Z', createdAt: '2024-05-01T09:00:00Z', department: 'Support'
  },
  {
    id: 'USR-006', tenantId: 'TNT-001', name: 'Anita Desai', email: 'anita@techavtar.in',
    phone: '+919944567890', role: 'Auditor', roleIds: ['ROLE-AUDITOR'],
    status: 'Active', avatar: 'AD', twoFAEnabled: true,
    lastLogin: '2025-04-20T11:00:00Z', createdAt: '2024-04-10T09:00:00Z', department: 'Compliance'
  },
  {
    id: 'USR-007', tenantId: 'TNT-001', name: 'Rohit Gupta', email: 'rohit@techavtar.in',
    phone: '+919955678901', role: 'Sales Agent', roleIds: ['ROLE-SALES'],
    status: 'Inactive', avatar: 'RG', twoFAEnabled: false,
    lastLogin: '2025-03-01T09:00:00Z', createdAt: '2024-06-01T09:00:00Z', department: 'Sales'
  }
];

// ─── Leads (50 seed for TNT-001) ─────────────────────────────
const leadStatuses = ['New', 'Contacted', 'Qualified', 'Unqualified'] as const;
const leadSources = ['Meta Ads', 'Web Form', 'CSV Import', 'WhatsApp', 'IndiaMART', 'LinkedIn', 'AI Call'] as const;
const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Real Estate', 'Education'];
const indianCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Noida'];
const indianStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Rajasthan', 'Haryana'];
const companyNames = [
  'Reliance Industries', 'Tata Consultancy', 'Infosys Ltd', 'HDFC Bank', 'Wipro Technologies',
  'Mahindra & Mahindra', 'Sun Pharma', 'HCL Tech', 'Bharti Airtel', 'ICICI Bank',
  'L&T Limited', 'Asian Paints', 'Maruti Suzuki', 'ITC Ltd', 'Bajaj Auto',
  'Dr Reddys Labs', 'Britannia Industries', 'Pidilite Industries', 'Havells India', 'Dabur India',
  'Godrej Consumer', 'Lupin Limited', 'Bosch India', 'Voltas Ltd', 'Marico Ltd'
];
const firstNames = ['Arjun', 'Kavya', 'Ravi', 'Pooja', 'Suresh', 'Meera', 'Kiran', 'Deepa', 'Sanjay', 'Nita',
  'Rahul', 'Smita', 'Venkat', 'Lakshmi', 'Ganesh', 'Preethi', 'Manoj', 'Geeta', 'Arvind', 'Sunita',
  'Dinesh', 'Rekha', 'Vijay', 'Ananya', 'Sunil', 'Rashmi', 'Naveen', 'Shilpa', 'Prakash', 'Divya'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Rao', 'Gupta', 'Mehta', 'Joshi', 'Nair', 'Reddy',
  'Chauhan', 'Verma', 'Shah', 'Pillai', 'Iyer', 'Desai', 'Mishra', 'Kapoor', 'Bose', 'Agarwal'];

export const seedLeads: Lead[] = Array.from({ length: 50 }, (_, i) => {
  const idx = i;
  const fname = firstNames[idx % firstNames.length];
  const lname = lastNames[(idx * 3) % lastNames.length];
  const city = indianCities[idx % indianCities.length];
  const state = indianStates[idx % indianStates.length];
  const company = companyNames[idx % companyNames.length];
  const score = Math.floor(Math.random() * 100);
  const status = leadStatuses[idx % leadStatuses.length];
  const source = leadSources[idx % leadSources.length];

  return {
    id: `LD-${String(idx + 1).padStart(4, '0')}`,
    tenantId: 'TNT-001',
    ownerId: `USR-00${(idx % 4) + 2}`,
    fullName: `${fname} ${lname}`,
    primaryPhone: `+919${String(800000000 + idx * 1234567).slice(0, 9)}`,
    email: `${fname.toLowerCase()}.${lname.toLowerCase()}${idx}@${company.toLowerCase().replace(/\s+/g, '')}.in`,
    company,
    status,
    source,
    leadScore: score,
    aiScore: Math.floor(score * 0.9),
    industry: industries[idx % industries.length],
    annualRevenue: (idx + 1) * 500000,
    city,
    state,
    tags: idx % 3 === 0 ? ['Hot Lead', 'Enterprise'] : idx % 3 === 1 ? ['Follow Up'] : [],
    customFields: {},
    relatedDealIds: idx < 15 ? [`DL-${String(idx + 1).padStart(4, '0')}`] : [],
    relatedCampaignIds: idx < 20 ? ['CMP-001'] : [],
    relatedCallIds: idx < 25 ? [`CALL-${String(idx + 1).padStart(4, '0')}`] : [],
    timeline: [
      {
        id: `TL-${idx}-1`,
        type: 'stage_change',
        actorType: 'system',
        actorId: 'system',
        actorName: 'System',
        title: 'Lead Created',
        body: `Lead created from ${source}`,
        timestamp: new Date(Date.now() - (50 - idx) * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    isDuplicate: idx === 5 || idx === 15,
    createdAt: new Date(Date.now() - (50 - idx) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - idx * 60 * 60 * 1000).toISOString()
  };
});

// ─── Deals (25 seed for TNT-001) ─────────────────────────────
const dealStages = ['Qualification', 'Needs Analysis', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'] as const;
const pipelines = ['Sales Pipeline', 'Enterprise Pipeline', 'Renewal Pipeline'];

export const seedDeals: Deal[] = Array.from({ length: 25 }, (_, i) => {
  const stage = dealStages[i % dealStages.length];
  const amount = (i + 1) * 85000;
  const isWon = stage === 'Won';
  const isLost = stage === 'Lost';
  const closeDate = new Date(Date.now() + (30 - i * 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    id: `DL-${String(i + 1).padStart(4, '0')}`,
    tenantId: 'TNT-001',
    name: `${companyNames[i % companyNames.length]} Deal Q2`,
    leadId: i < 15 ? `LD-${String(i + 1).padStart(4, '0')}` : null,
    ownerId: `USR-00${(i % 3) + 2}`,
    stage,
    status: isWon ? 'Won' : isLost ? 'Lost' : i % 7 === 0 ? 'PendingApproval' : 'Open',
    amount,
    currency: 'INR',
    probability: isWon ? 100 : isLost ? 0 : [20, 40, 60, 80][i % 4],
    closeDate,
    pipeline: pipelines[i % pipelines.length],
    lineItems: [
      { id: `LI-${i}-1`, name: 'CRM License', quantity: 10, unitPrice: amount * 0.06, discount: 5, total: amount * 0.06 * 10 * 0.95 },
      { id: `LI-${i}-2`, name: 'Implementation', quantity: 1, unitPrice: amount * 0.2, discount: 0, total: amount * 0.2 }
    ],
    discountPercent: i % 7 === 0 ? 25 : i % 4 === 0 ? 15 : 5,
    requiresApproval: i % 7 === 0,
    closeReason: isWon ? 'Reference customer' : isLost ? 'Budget constraint' : null,
    relatedCampaignIds: i < 10 ? ['CMP-001'] : [],
    relatedCallIds: i < 15 ? [`CALL-${String(i + 1).padStart(4, '0')}`] : [],
    createdAt: new Date(Date.now() - (25 - i) * 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - i * 4 * 60 * 60 * 1000).toISOString(),
    wonAt: isWon ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    lostAt: isLost ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() : undefined
  };
});

// ─── AI Agents (5 seed for TNT-001) ──────────────────────────
export const seedAIAgents: AIAgent[] = [
  { id: 'AGT-001', tenantId: 'TNT-001', name: 'Sarah-Sales', type: 'Sales', voice: 'Hindi Female', languages: ['Hindi', 'English'], status: 'Active', callCount: 1234, successRate: 67.5, createdAt: '2024-04-01T09:00:00Z' },
  { id: 'AGT-002', tenantId: 'TNT-001', name: 'Ravi-Support', type: 'Support', voice: 'Hindi Male', languages: ['Hindi', 'English', 'Marathi'], status: 'Active', callCount: 892, successRate: 71.2, createdAt: '2024-04-05T09:00:00Z' },
  { id: 'AGT-003', tenantId: 'TNT-001', name: 'Ananya-Collections', type: 'Collections', voice: 'English Female', languages: ['English', 'Tamil'], status: 'Active', callCount: 567, successRate: 58.9, createdAt: '2024-05-01T09:00:00Z' },
  { id: 'AGT-004', tenantId: 'TNT-001', name: 'Vikash-Survey', type: 'Survey', voice: 'Hindi Male', languages: ['Hindi', 'Bengali'], status: 'Inactive', callCount: 234, successRate: 82.1, createdAt: '2024-06-01T09:00:00Z' },
  { id: 'AGT-005', tenantId: 'TNT-001', name: 'Meena-Renewal', type: 'Renewal', voice: 'English Female', languages: ['English', 'Kannada'], status: 'Active', callCount: 445, successRate: 74.6, createdAt: '2024-07-01T09:00:00Z' }
];

// ─── AI Calls ─────────────────────────────────────────────────
const callStatuses = ['Completed', 'Completed', 'Completed', 'NoAnswer', 'Failed', 'Transferred'] as const;
const callOutcomes = ['Qualified', 'NotInterested', 'Callback', 'NoAnswer', 'Transferred'] as const;

export const seedAICalls: AICall[] = Array.from({ length: 30 }, (_, i) => {
  const status = callStatuses[i % callStatuses.length];
  const isCompleted = status === 'Completed' || status === 'Transferred';
  const duration = isCompleted ? 60 + i * 15 : 0;

  return {
    id: `CALL-${String(i + 1).padStart(4, '0')}`,
    tenantId: 'TNT-001',
    agentId: seedAIAgents[i % seedAIAgents.length].id,
    campaignId: i < 20 ? 'CMP-001' : null,
    leadId: i < 25 ? `LD-${String(i + 1).padStart(4, '0')}` : null,
    phone: `+919${String(800000000 + i * 987654).slice(0, 9)}`,
    status,
    outcome: isCompleted ? callOutcomes[i % callOutcomes.length] : null,
    duration,
    cost: duration * 0.5,
    consentCaptured: isCompleted && i % 5 !== 0,
    recordingUrl: isCompleted ? `https://mock-recordings/call-${i + 1}.mp3` : null,
    transcriptPreview: isCompleted ? `AI: Namaste! Main OmniCRM ki taraf se ${firstNames[i % firstNames.length]} ji se baat kar raha hun...` : '',
    startedAt: new Date(Date.now() - (30 - i) * 60 * 60 * 1000).toISOString(),
    endedAt: isCompleted ? new Date(Date.now() - (30 - i) * 60 * 60 * 1000 + duration * 1000).toISOString() : null,
    createdAt: new Date(Date.now() - (30 - i) * 60 * 60 * 1000).toISOString()
  };
});

// ─── Campaigns ────────────────────────────────────────────────
export const seedCampaigns: Campaign[] = [
  {
    id: 'CMP-001', tenantId: 'TNT-001', name: 'Q2 Enterprise Outreach', type: 'Omni',
    status: 'Active', audience: 1200, sent: 890, delivered: 847, opened: 412, replied: 98, converted: 34,
    budget: 150000, spent: 89000, startDate: '2025-04-01', endDate: '2025-06-30',
    createdAt: '2025-03-25T10:00:00Z', updatedAt: '2025-04-27T09:00:00Z'
  },
  {
    id: 'CMP-002', tenantId: 'TNT-001', name: 'New Year Offer - SMS', type: 'SMS',
    status: 'Completed', audience: 5000, sent: 4897, delivered: 4756, opened: 4756, replied: 234, converted: 67,
    budget: 25000, spent: 24500, startDate: '2025-01-01', endDate: '2025-01-15',
    createdAt: '2024-12-28T10:00:00Z', updatedAt: '2025-01-16T09:00:00Z'
  },
  {
    id: 'CMP-003', tenantId: 'TNT-001', name: 'Welcome Email Drip', type: 'Email',
    status: 'Active', audience: 340, sent: 340, delivered: 325, opened: 189, replied: 42, converted: 15,
    budget: 5000, spent: 1200, startDate: '2025-03-15', endDate: null,
    createdAt: '2025-03-10T09:00:00Z', updatedAt: '2025-04-27T08:00:00Z'
  },
  {
    id: 'CMP-004', tenantId: 'TNT-001', name: 'AI Call - Lead Qualify', type: 'AI Call',
    status: 'Paused', audience: 200, sent: 145, delivered: 145, opened: 145, replied: 89, converted: 28,
    budget: 45000, spent: 32000, startDate: '2025-04-10', endDate: null,
    createdAt: '2025-04-08T11:00:00Z', updatedAt: '2025-04-24T15:00:00Z'
  },
  {
    id: 'CMP-005', tenantId: 'TNT-001', name: 'WhatsApp Flash Sale', type: 'WhatsApp',
    status: 'Scheduled', audience: 2500, sent: 0, delivered: 0, opened: 0, replied: 0, converted: 0,
    budget: 30000, spent: 0, startDate: '2025-05-01', endDate: '2025-05-07',
    createdAt: '2025-04-20T14:00:00Z', updatedAt: '2025-04-20T14:00:00Z'
  }
];

// ─── Invoices ─────────────────────────────────────────────────
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const invoiceStatuses: Array<'Paid' | 'Pending' | 'Overdue'> = ['Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Pending', 'Overdue'];

export const seedInvoices: Invoice[] = Array.from({ length: 12 }, (_, i) => {
  const amount = 25000 + i * 3000;
  const igst = amount * 0.18; // inter-state IGST
  return {
    id: `INV-${String(i + 1).padStart(6, '0')}`,
    tenantId: 'TNT-001',
    invoiceNumber: `INV-2024-${String(i + 1).padStart(6, '0')}`,
    status: invoiceStatuses[i],
    amount,
    gstin: '27AABCT1332L1ZV',
    hsnCode: '998314',
    cgst: 0,
    sgst: 0,
    igst,
    totalAmount: amount + igst,
    isInterState: true,
    issueDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-01`,
    dueDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
    paidAt: invoiceStatuses[i] === 'Paid' ? `2024-${String((i % 12) + 1).padStart(2, '0')}-10` : null,
    createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-01T09:00:00Z`
  };
});

// ─── WhatsApp Templates ───────────────────────────────────────
export const seedWhatsAppTemplates: WhatsAppTemplate[] = [
  { id: 'WA-001', tenantId: 'TNT-001', name: 'welcome_new_lead', category: 'Marketing', status: 'Approved', body: 'Namaste {{1}}! 🙏 Welcome to our platform. Reply YES to get started.', createdAt: '2024-04-01T09:00:00Z' },
  { id: 'WA-002', tenantId: 'TNT-001', name: 'appointment_reminder', category: 'Utility', status: 'Approved', body: 'Dear {{1}}, your appointment is scheduled for {{2}} at {{3}}. Reply CONFIRM to confirm.', createdAt: '2024-04-05T09:00:00Z' },
  { id: 'WA-003', tenantId: 'TNT-001', name: 'payment_confirmation', category: 'Utility', status: 'Approved', body: 'Payment of ₹{{1}} received for Invoice {{2}}. Thank you for your business!', createdAt: '2024-04-10T09:00:00Z' },
  { id: 'WA-004', tenantId: 'TNT-001', name: 'flash_sale_offer', category: 'Marketing', status: 'Approved', body: '🎉 Exclusive offer for you! Get {{1}}% off on all products. Valid till {{2}}. Shop now!', createdAt: '2024-05-01T09:00:00Z' },
  { id: 'WA-005', tenantId: 'TNT-001', name: 'order_confirmation', category: 'Utility', status: 'Approved', body: 'Your order #{{1}} has been confirmed! Expected delivery: {{2}}. Track at {{3}}', createdAt: '2024-05-15T09:00:00Z' },
  { id: 'WA-006', tenantId: 'TNT-001', name: 'feedback_request', category: 'Utility', status: 'Approved', body: 'Hi {{1}}, how was your experience with us? Rate us 1-5 by replying with the number.', createdAt: '2024-06-01T09:00:00Z' },
  { id: 'WA-007', tenantId: 'TNT-001', name: 'reengagement_offer', category: 'Marketing', status: 'Submitted', body: 'We miss you, {{1}}! Here\'s a special offer just for you. Reply CLAIM to avail.', createdAt: '2024-06-15T09:00:00Z' },
  { id: 'WA-008', tenantId: 'TNT-001', name: 'demo_invitation', category: 'Marketing', status: 'Submitted', body: 'Hi {{1}}, interested in a free demo of our solution? Reply YES to book your slot!', createdAt: '2024-07-01T09:00:00Z' },
  { id: 'WA-009', tenantId: 'TNT-001', name: 'otp_verification', category: 'Authentication', status: 'Rejected', body: 'Your OTP is {{1}}. Valid for 10 minutes. Do not share with anyone.', metaReason: 'Template contains OTP which requires special approval', createdAt: '2024-07-05T09:00:00Z' },
  { id: 'WA-010', tenantId: 'TNT-001', name: 'renewal_reminder', category: 'Utility', status: 'Rejected', body: 'Your subscription expires on {{1}}. Renew now at special price ₹{{2}}.', metaReason: 'Template body does not match submitted category', createdAt: '2024-07-10T09:00:00Z' }
];

// ─── SMS DLT Templates ────────────────────────────────────────
export const seedSMSTemplates: SMSDLTTemplate[] = [
  { id: 'SMS-001', tenantId: 'TNT-001', name: 'OTP Verification', dltTemplateId: 'DLT-TR-001', dltEntityId: 'ENT-1234567890', category: 'Transactional', status: 'Approved', body: 'Your OTP is {#var#}. Valid for 10 mins. Do not share. - TechAvtar', createdAt: '2024-04-01T09:00:00Z' },
  { id: 'SMS-002', tenantId: 'TNT-001', name: 'Payment Receipt', dltTemplateId: 'DLT-TR-002', dltEntityId: 'ENT-1234567890', category: 'Transactional', status: 'Approved', body: 'Payment of Rs.{#var#} received for Invoice {#var#}. Ref: {#var#}. - TechAvtar', createdAt: '2024-04-05T09:00:00Z' },
  { id: 'SMS-003', tenantId: 'TNT-001', name: 'Appointment Reminder', dltTemplateId: 'DLT-SV-001', dltEntityId: 'ENT-1234567890', category: 'Service-Implicit', status: 'Approved', body: 'Dear {#var#}, your appointment on {#var#} at {#var#} is confirmed. - TechAvtar', createdAt: '2024-04-10T09:00:00Z' },
  { id: 'SMS-004', tenantId: 'TNT-001', name: 'Flash Sale Alert', dltTemplateId: 'DLT-PR-001', dltEntityId: 'ENT-1234567890', category: 'Promotional', status: 'Approved', body: 'Exclusive {#var#}% off on all products! Valid {#var#}. Shop now at {#var#}. Reply STOP to unsub. - TechAvtar', createdAt: '2024-05-01T09:00:00Z' },
  { id: 'SMS-005', tenantId: 'TNT-001', name: 'New Year Offer', dltTemplateId: 'DLT-PR-002', dltEntityId: 'ENT-1234567890', category: 'Promotional', status: 'Approved', body: 'Happy New Year! Celebrate with {#var#}% off. Offer ends {#var#}. T&C apply. Reply STOP to unsub. - TechAvtar', createdAt: '2024-12-01T09:00:00Z' },
  { id: 'SMS-006', tenantId: 'TNT-001', name: 'Feedback Request', dltTemplateId: undefined, dltEntityId: undefined, category: 'Service-Implicit', status: 'Pending', body: 'Rate your experience with us! Reply 1-5. {#var#} - TechAvtar', createdAt: '2025-03-01T09:00:00Z' },
  { id: 'SMS-007', tenantId: 'TNT-001', name: 'Account Alert', dltTemplateId: undefined, dltEntityId: undefined, category: 'Transactional', status: 'Pending', body: 'Alert: {#var#} on your account {#var#} on {#var#}. Call us at {#var#}. - TechAvtar', createdAt: '2025-04-01T09:00:00Z' },
  { id: 'SMS-008', tenantId: 'TNT-001', name: 'Order Status', dltTemplateId: undefined, dltEntityId: undefined, category: 'Transactional', status: 'Pending', body: 'Order #{#var#} status: {#var#}. Track at {#var#}. - TechAvtar', createdAt: '2025-04-10T09:00:00Z' }
];

// ─── Approval Requests ────────────────────────────────────────
export const seedApprovalRequests: ApprovalRequest[] = [
  {
    id: 'APR-001', type: 'license_assign', status: 'Pending',
    makerId: 'USR-001', makerName: 'Rajesh Sharma',
    entityId: 'LIC-NEW-001', entityType: 'License',
    reason: 'New license for TechAvtar India',
    metadata: { tenantId: 'TNT-001', plan: 'Enterprise' },
    createdAt: '2025-04-25T10:00:00Z'
  },
  {
    id: 'APR-002', type: 'discount_approval', status: 'Pending',
    makerId: 'USR-003', makerName: 'Amit Kumar',
    entityId: 'DL-0007', entityType: 'Deal',
    reason: 'Customer negotiated 25% discount for annual commit',
    metadata: { dealId: 'DL-0007', discountPercent: 25, amount: 595000 },
    createdAt: '2025-04-26T14:00:00Z'
  },
  {
    id: 'APR-003', type: 'credit_adjustment', status: 'Approved',
    makerId: 'USR-001', makerName: 'Rajesh Sharma',
    checkerId: 'USR-002', checkerName: 'Priya Mehta',
    entityId: 'TNT-001', entityType: 'Tenant',
    reason: 'Goodwill credit for service disruption',
    metadata: { amount: 5000, direction: 'credit' },
    createdAt: '2025-04-20T09:00:00Z',
    resolvedAt: '2025-04-21T11:00:00Z'
  }
];

// ─── Audit Logs (sample) ─────────────────────────────────────
export const seedAuditLogs: AuditLog[] = [
  {
    id: 'AUD-001', tenantId: 'TNT-001', actor: 'Rajesh Sharma', actorId: 'USR-001', actorType: 'human',
    action: 'create', entity: 'Lead', entityId: 'LD-0001', before: undefined,
    after: { fullName: 'Arjun Sharma', status: 'New' }, reason: undefined,
    ipAddress: '103.21.56.78', timestamp: '2025-04-27T09:15:00Z'
  },
  {
    id: 'AUD-002', tenantId: 'TNT-001', actor: 'Sarah-Sales', actorId: 'AGT-001', actorType: 'ai',
    agentId: 'AGT-001', campaignId: 'CMP-001',
    action: 'qualify', entity: 'Lead', entityId: 'LD-0002', before: { status: 'New' },
    after: { status: 'Qualified', aiScore: 87 }, timestamp: '2025-04-27T08:30:00Z'
  },
  {
    id: 'AUD-003', tenantId: 'TNT-001', actor: 'Priya Mehta', actorId: 'USR-002', actorType: 'human',
    action: 'suspend', entity: 'User', entityId: 'USR-007',
    before: { status: 'Active' }, after: { status: 'Inactive' }, reason: 'Employee resignation',
    ipAddress: '103.21.56.79', timestamp: '2025-04-26T16:00:00Z'
  },
  {
    id: 'AUD-004', tenantId: null, actor: 'Super Admin', actorId: 'SA-001', actorType: 'human',
    action: 'impersonate', entity: 'Tenant', entityId: 'TNT-001',
    before: undefined, after: undefined, reason: 'Support ticket SUPP-1234 - configuration issue',
    ipAddress: '10.0.0.1', timestamp: '2025-04-24T14:00:00Z'
  },
  {
    id: 'AUD-005', tenantId: 'TNT-001', actor: 'System', actorId: 'system', actorType: 'system',
    action: 'credit_deduction', entity: 'Billing', entityId: 'TNT-001',
    before: { balance: 19000 }, after: { balance: 18500 }, reason: 'AI Call campaign CMP-004',
    timestamp: '2025-04-27T10:00:00Z'
  }
];

// ─── Custom Objects (M3 seed for TNT-001) ─────────────────────
export const seedCustomObjects: CustomObject[] = [
  {
    id: 'OBJ-LEAD', tenantId: 'TNT-001', label: 'Lead', pluralLabel: 'Leads',
    apiName: 'lead', description: 'Prospect before qualification', icon: 'Target', color: 'bg-blue-500',
    allowReports: true, allowActivities: true, isEnabled: true, isSystemObject: true,
    recordCount: 4782, layoutCount: 2,
    fields: [
      { id: 'FLD-L-001', objectId: 'OBJ-LEAD', label: 'Full Name', apiName: 'full_name', type: 'text', required: true, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Lead Information', sortOrder: 1, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-L-002', objectId: 'OBJ-LEAD', label: 'Primary Phone', apiName: 'primary_phone', type: 'phone', required: true, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Lead Information', sortOrder: 2, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-L-003', objectId: 'OBJ-LEAD', label: 'Email Address', apiName: 'email', type: 'email', required: false, unique: true, readOnly: false, isSystemField: true, isDeleted: false, section: 'Lead Information', sortOrder: 3, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-L-004', objectId: 'OBJ-LEAD', label: 'Company Name', apiName: 'company', type: 'text', required: false, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Company Details', sortOrder: 4, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-L-005', objectId: 'OBJ-LEAD', label: 'Lead Source', apiName: 'source', type: 'picklist', required: true, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Lead Information', sortOrder: 5, showInListView: true, showInDetailView: true, options: ['Web Form', 'CSV Import', 'WhatsApp', 'SMS', 'Manual', 'AI Call', 'Meta Ads', 'LinkedIn', 'IndiaMART'], createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-L-006', objectId: 'OBJ-LEAD', label: 'Lead Status', apiName: 'status', type: 'picklist', required: true, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Lead Information', sortOrder: 6, showInListView: true, showInDetailView: true, options: ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted', 'Lost'], createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-L-007', objectId: 'OBJ-LEAD', label: 'Lead Score', apiName: 'lead_score', type: 'number', required: false, unique: false, readOnly: true, isSystemField: true, isDeleted: false, section: 'Scoring', sortOrder: 7, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-L-008', objectId: 'OBJ-LEAD', label: 'GST Number', apiName: 'gst_number', type: 'text', required: false, unique: false, readOnly: false, isSystemField: false, isDeleted: false, section: 'Company Details', sortOrder: 8, showInListView: false, showInDetailView: true, helpText: 'Format: 22AAAAA0000A1Z5', createdAt: '2024-04-15T00:00:00Z' },
      { id: 'FLD-L-009', objectId: 'OBJ-LEAD', label: 'Annual Revenue', apiName: 'annual_revenue', type: 'currency', required: false, unique: false, readOnly: false, isSystemField: false, isDeleted: false, section: 'Company Details', sortOrder: 9, showInListView: false, showInDetailView: true, createdAt: '2024-04-15T00:00:00Z' }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'OBJ-DEAL', tenantId: 'TNT-001', label: 'Deal', pluralLabel: 'Deals',
    apiName: 'deal', description: 'Sales opportunity', icon: 'Briefcase', color: 'bg-purple-500',
    allowReports: true, allowActivities: true, isEnabled: true, isSystemObject: true,
    recordCount: 891, layoutCount: 1,
    fields: [
      { id: 'FLD-D-001', objectId: 'OBJ-DEAL', label: 'Deal Name', apiName: 'deal_name', type: 'text', required: true, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Deal Information', sortOrder: 1, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-D-002', objectId: 'OBJ-DEAL', label: 'Amount (₹)', apiName: 'amount', type: 'currency', required: false, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Deal Information', sortOrder: 2, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-D-003', objectId: 'OBJ-DEAL', label: 'Close Date', apiName: 'close_date', type: 'date', required: true, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Deal Information', sortOrder: 3, showInListView: true, showInDetailView: true, createdAt: '2024-01-01T00:00:00Z' },
      { id: 'FLD-D-004', objectId: 'OBJ-DEAL', label: 'Stage', apiName: 'stage', type: 'picklist', required: true, unique: false, readOnly: false, isSystemField: true, isDeleted: false, section: 'Deal Information', sortOrder: 4, showInListView: true, showInDetailView: true, options: ['Qualification', 'Needs Analysis', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'], createdAt: '2024-01-01T00:00:00Z' }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'OBJ-DIST', tenantId: 'TNT-001', label: 'Distributor', pluralLabel: 'Distributors',
    apiName: 'distributor', description: 'Distribution channel partners', icon: 'Building2', color: 'bg-orange-500',
    allowReports: true, allowActivities: true, isEnabled: true, isSystemObject: false,
    recordCount: 234, layoutCount: 2,
    fields: [
      { id: 'FLD-DS-001', objectId: 'OBJ-DIST', label: 'Distributor Name', apiName: 'dist_name', type: 'text', required: true, unique: false, readOnly: false, isSystemField: false, isDeleted: false, section: 'Distributor Info', sortOrder: 1, showInListView: true, showInDetailView: true, createdAt: '2024-06-01T00:00:00Z' },
      { id: 'FLD-DS-002', objectId: 'OBJ-DIST', label: 'GSTIN', apiName: 'gstin', type: 'text', required: true, unique: true, readOnly: false, isSystemField: false, isDeleted: false, section: 'Distributor Info', sortOrder: 2, showInListView: true, showInDetailView: true, helpText: 'Format: 22AAAAA0000A1Z5', createdAt: '2024-06-01T00:00:00Z' },
      { id: 'FLD-DS-003', objectId: 'OBJ-DIST', label: 'Credit Limit (₹)', apiName: 'credit_limit', type: 'currency', required: false, unique: false, readOnly: false, isSystemField: false, isDeleted: false, section: 'Finance', sortOrder: 3, showInListView: false, showInDetailView: true, createdAt: '2024-06-01T00:00:00Z' },
      { id: 'FLD-DS-004', objectId: 'OBJ-DIST', label: 'Account (Lookup)', apiName: 'account_id', type: 'lookup', required: false, unique: false, readOnly: false, isSystemField: false, isDeleted: false, section: 'Relationships', sortOrder: 4, showInListView: false, showInDetailView: true, lookupObject: 'account', createdAt: '2024-06-01T00:00:00Z' },
      { id: 'FLD-DS-005', objectId: 'OBJ-DIST', label: 'Days Since Last Order', apiName: 'days_since_last_order', type: 'formula', required: false, unique: false, readOnly: true, isSystemField: false, isDeleted: false, section: 'Activity', sortOrder: 5, showInListView: true, showInDetailView: true, formula: 'TODAY() - last_order_date', createdAt: '2024-06-01T00:00:00Z' }
    ],
    createdAt: '2024-06-01T00:00:00Z'
  }
];

// ─── Licenses ─────────────────────────────────────────────────
export const seedLicenses: License[] = [
  { id: 'LIC-001', tenantId: 'TNT-001', planId: 'PLN-GROWTH', planName: 'Growth', status: 'Active', startDate: '2024-04-01', endDate: '2025-03-31', maxUsers: 15, features: ['AI Calling', 'WhatsApp', 'SMS', 'Email', 'CRM', 'Analytics'], approvedBy: ['USR-SA-001', 'USR-SA-002'], makerId: 'USR-SA-001', checkerId: 'USR-SA-002', createdAt: '2024-04-01T09:00:00Z' },
  { id: 'LIC-002', tenantId: 'TNT-002', planId: 'PLN-ENT', planName: 'Enterprise', status: 'Active', startDate: '2024-02-15', endDate: '2025-02-14', maxUsers: 50, features: ['AI Calling', 'WhatsApp', 'SMS', 'Email', 'CRM', 'Analytics', 'Custom Objects', 'API Access'], approvedBy: ['USR-SA-001', 'USR-SA-002'], makerId: 'USR-SA-001', checkerId: 'USR-SA-002', createdAt: '2024-02-15T10:00:00Z' },
  { id: 'LIC-NEW-001', tenantId: 'TNT-004', planId: 'PLN-GROWTH', planName: 'Growth', status: 'PendingApproval', startDate: '2025-04-28', endDate: '2026-04-27', maxUsers: 15, features: ['AI Calling', 'WhatsApp', 'SMS', 'Email', 'CRM', 'Analytics'], approvedBy: [], makerId: 'USR-SA-003', checkerId: null, createdAt: '2025-04-25T10:00:00Z' }
];

// ─── Roles (Default System Roles per Module 2 spec) ──────────
export const seedRoles: Role[] = [
  {
    id: 'ROLE-SA-001',
    tenantId: 'system',
    name: 'Super Admin',
    description: 'Platform owner with full system access across all tenants',
    isSystem: true,
    permissions: {
      crm: { leads: ['view', 'create', 'edit', 'delete', 'export'], contacts: ['view', 'create', 'edit', 'delete', 'export'], companies: ['view', 'create', 'edit', 'delete', 'export'], deals: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
      aiCalling: { campaigns: ['view', 'create', 'edit', 'delete', 'execute'], agents: ['view', 'create', 'edit', 'delete', 'configure'], calls: ['view', 'delete', 'export'], analytics: ['view', 'export'] },
      campaigns: { email: ['view', 'create', 'edit', 'delete', 'execute'], sms: ['view', 'create', 'edit', 'delete', 'execute'], whatsapp: ['view', 'create', 'edit', 'delete', 'execute'], management: ['view', 'create', 'edit', 'delete', 'execute', 'approve'] },
      analytics: { dashboards: ['view', 'create', 'edit', 'delete', 'export'], reports: ['view', 'create', 'edit', 'delete', 'export'], customReports: ['view', 'create', 'edit', 'delete', 'export'] },
      billing: { invoices: ['view', 'create', 'edit', 'delete', 'export'], usage: ['view', 'export'], credits: ['view', 'create', 'edit'] },
      admin: { users: ['view', 'create', 'edit', 'delete'], roles: ['view', 'create', 'edit', 'delete'], settings: ['view', 'edit', 'configure'], audit: ['view', 'export'] }
    },
    userCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system',
    riskLevel: 'critical'
  },
  {
    id: 'ROLE-TA-001',
    tenantId: 'TNT-001',
    name: 'Tenant Admin',
    description: 'Full control within tenant boundary, cannot modify Super Admin',
    isSystem: true,
    permissions: {
      crm: { leads: ['view', 'create', 'edit', 'delete', 'export'], contacts: ['view', 'create', 'edit', 'delete', 'export'], companies: ['view', 'create', 'edit', 'delete', 'export'], deals: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
      aiCalling: { campaigns: ['view', 'create', 'edit', 'delete', 'execute'], agents: ['view', 'create', 'edit', 'delete', 'configure'], calls: ['view', 'delete', 'export'], analytics: ['view', 'export'] },
      campaigns: { email: ['view', 'create', 'edit', 'delete', 'execute'], sms: ['view', 'create', 'edit', 'delete', 'execute'], whatsapp: ['view', 'create', 'edit', 'delete', 'execute'], management: ['view', 'create', 'edit', 'delete', 'execute', 'approve'] },
      analytics: { dashboards: ['view', 'create', 'edit', 'delete', 'export'], reports: ['view', 'create', 'edit', 'delete', 'export'], customReports: ['view', 'create', 'edit', 'delete', 'export'] },
      billing: { invoices: ['view', 'export'], usage: ['view', 'export'], credits: ['view'] },
      admin: { users: ['view', 'create', 'edit', 'delete'], roles: ['view', 'create', 'edit', 'delete'], settings: ['view', 'edit', 'configure'], audit: ['view', 'export'] }
    },
    userCount: 2,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    createdBy: 'system',
    riskLevel: 'critical'
  },
  {
    id: 'ROLE-MGR-001',
    tenantId: 'TNT-001',
    name: 'Manager',
    description: 'Team oversight, approvals, and analytics access',
    isSystem: true,
    permissions: {
      crm: { leads: ['view', 'edit', 'export'], contacts: ['view', 'edit', 'export'], companies: ['view', 'edit', 'export'], deals: ['view', 'edit', 'approve', 'export'] },
      aiCalling: { campaigns: ['view', 'execute'], agents: ['view'], calls: ['view', 'export'], analytics: ['view', 'export'] },
      campaigns: { email: ['view', 'execute'], sms: ['view', 'execute'], whatsapp: ['view', 'execute'], management: ['view', 'approve'] },
      analytics: { dashboards: ['view', 'create', 'edit', 'export'], reports: ['view', 'export'], customReports: ['view', 'create', 'export'] },
      billing: { invoices: ['view'], usage: ['view'], credits: ['view'] },
      admin: { users: ['view'], roles: ['view'], settings: ['view'], audit: ['view'] }
    },
    userCount: 8,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
    createdBy: 'USR-001',
    riskLevel: 'high'
  },
  {
    id: 'ROLE-SA-002',
    tenantId: 'TNT-001',
    name: 'Sales Agent',
    description: 'CRM execution and AI calling capabilities',
    isSystem: true,
    permissions: {
      crm: { leads: ['view', 'create', 'edit'], contacts: ['view', 'create', 'edit'], companies: ['view', 'create', 'edit'], deals: ['view', 'create', 'edit'] },
      aiCalling: { campaigns: ['view', 'execute'], agents: ['view'], calls: ['view'], analytics: ['view'] },
      campaigns: { email: ['view', 'execute'], sms: ['view', 'execute'], whatsapp: ['view', 'execute'], management: ['view'] },
      analytics: { dashboards: ['view'], reports: ['view'], customReports: ['view'] },
      billing: { invoices: [], usage: [], credits: [] },
      admin: { users: [], roles: [], settings: [], audit: [] }
    },
    userCount: 45,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
    createdBy: 'USR-001',
    riskLevel: 'medium'
  },
  {
    id: 'ROLE-SUP-001',
    tenantId: 'TNT-001',
    name: 'Support Agent',
    description: 'Inbound support and customer service workflows',
    isSystem: true,
    permissions: {
      crm: { leads: ['view', 'edit'], contacts: ['view', 'edit'], companies: ['view'], deals: ['view'] },
      aiCalling: { campaigns: [], agents: [], calls: ['view'], analytics: [] },
      campaigns: { email: ['view'], sms: ['view'], whatsapp: ['view'], management: [] },
      analytics: { dashboards: ['view'], reports: ['view'], customReports: [] },
      billing: { invoices: [], usage: [], credits: [] },
      admin: { users: [], roles: [], settings: [], audit: [] }
    },
    userCount: 22,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
    createdBy: 'USR-001',
    riskLevel: 'low'
  },
  {
    id: 'ROLE-AUD-001',
    tenantId: 'TNT-001',
    name: 'Auditor',
    description: 'Read-only access across all modules for compliance',
    isSystem: true,
    permissions: {
      crm: { leads: ['view', 'export'], contacts: ['view', 'export'], companies: ['view', 'export'], deals: ['view', 'export'] },
      aiCalling: { campaigns: ['view'], agents: ['view'], calls: ['view', 'export'], analytics: ['view', 'export'] },
      campaigns: { email: ['view'], sms: ['view'], whatsapp: ['view'], management: ['view'] },
      analytics: { dashboards: ['view', 'export'], reports: ['view', 'export'], customReports: ['view', 'export'] },
      billing: { invoices: ['view', 'export'], usage: ['view', 'export'], credits: ['view'] },
      admin: { users: ['view'], roles: ['view'], settings: ['view'], audit: ['view', 'export'] }
    },
    userCount: 3,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
    createdBy: 'USR-001',
    riskLevel: 'low'
  }
];

// ─── User Sessions (max 5 concurrent per tenant) ─────────────
export const seedSessions: UserSession[] = [
  {
    id: 'SESS-001',
    userId: 'USR-001',
    tenantId: 'TNT-001',
    deviceInfo: 'Chrome 122 on MacOS 14.2',
    ipAddress: '103.21.45.67',
    loginTime: '2025-04-28T08:30:00Z',
    lastActivityTime: '2025-04-28T09:45:00Z',
    expiresAt: '2025-04-28T14:30:00Z'
  },
  {
    id: 'SESS-002',
    userId: 'USR-002',
    tenantId: 'TNT-001',
    deviceInfo: 'Safari 17 on iOS 17.3',
    ipAddress: '103.21.45.68',
    loginTime: '2025-04-28T07:15:00Z',
    lastActivityTime: '2025-04-28T09:50:00Z',
    expiresAt: '2025-04-28T13:15:00Z'
  },
  {
    id: 'SESS-003',
    userId: 'USR-003',
    tenantId: 'TNT-001',
    deviceInfo: 'Firefox 124 on Windows 11',
    ipAddress: '103.21.45.69',
    loginTime: '2025-04-28T09:00:00Z',
    lastActivityTime: '2025-04-28T09:52:00Z',
    expiresAt: '2025-04-28T15:00:00Z'
  },
  {
    id: 'SESS-004',
    userId: 'USR-004',
    tenantId: 'TNT-001',
    deviceInfo: 'Chrome 122 on Android 14',
    ipAddress: '103.21.45.70',
    loginTime: '2025-04-28T08:45:00Z',
    lastActivityTime: '2025-04-28T09:48:00Z',
    expiresAt: '2025-04-28T14:45:00Z'
  },
  {
    id: 'SESS-005',
    userId: 'USR-001',
    tenantId: 'TNT-001',
    deviceInfo: 'Chrome 122 on Windows 11',
    ipAddress: '103.21.45.71',
    loginTime: '2025-04-28T09:30:00Z',
    lastActivityTime: '2025-04-28T09:51:00Z',
    expiresAt: '2025-04-28T15:30:00Z'
  }
];
