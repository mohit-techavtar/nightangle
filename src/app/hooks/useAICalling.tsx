import { useState, useCallback } from 'react';

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft' | 'scheduled';
  progress: { current: number; total: number };
  metrics: {
    connectRate?: number;
    interested?: number;
    avgDuration?: string;
    recoveryRate?: number;
    recovered?: string;
  };
  agent: string;
  agentId: string;
  schedule?: string;
  startDate?: string;
  budget?: { spent: number; total: number };
  pauseReason?: string;
  scheduledDate?: string;
  leftBorderColor: string;
  leads?: number;
  callHours?: string;
  createdAt: string;
}

export interface AIAgent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  campaigns: number;
  calls: number;
  rating: number;
  voice: string;
  language: string;
  personality: string;
  createdAt: string;
}

export interface Call {
  id: string;
  agentName: string;
  leadName: string;
  company?: string;
  phone: string;
  campaign: string;
  duration: number;
  status: 'active' | 'completed' | 'failed' | 'ringing';
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: string;
  recording?: string;
  transcript?: string;
  timestamp: string;
}

// Initialize with mock data
const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Jewellery Software Q2',
    status: 'active',
    progress: { current: 456, total: 600 },
    metrics: { connectRate: 68, interested: 34, avgDuration: '3m 42s' },
    agent: 'Priya (Sales)',
    agentId: '1',
    schedule: 'Mon-Sat, 10AM-6PM IST',
    startDate: 'Mar 15',
    budget: { spent: 8200, total: 15000 },
    leftBorderColor: '#10B981',
    leads: 600,
    callHours: 'Mon-Sat 10AM-6PM',
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Trading Platform Outreach',
    status: 'active',
    progress: { current: 312, total: 500 },
    metrics: { connectRate: 62, interested: 28, avgDuration: '4m 12s' },
    agent: 'Amit (Support)',
    agentId: '2',
    schedule: 'Mon-Fri, 9AM-5PM IST',
    startDate: 'Mar 10',
    budget: { spent: 6500, total: 12000 },
    leftBorderColor: '#10B981',
    leads: 500,
    callHours: 'Mon-Fri 9AM-5PM',
    createdAt: '2026-03-10T09:00:00Z'
  }
];

const initialAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Priya (Sales)',
    type: 'Sales',
    status: 'active',
    campaigns: 2,
    calls: 145,
    rating: 4.2,
    voice: 'Female - Professional',
    language: 'English, Hindi',
    personality: 'Friendly & Persuasive',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Amit (Support)',
    type: 'Support',
    status: 'active',
    campaigns: 1,
    calls: 98,
    rating: 4.5,
    voice: 'Male - Calm',
    language: 'English, Hindi',
    personality: 'Patient & Helpful',
    createdAt: '2026-01-20T10:00:00Z'
  }
];

export function useAICalling() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [calls, setCalls] = useState<Call[]>([]);

  // Campaign operations
  const createCampaign = useCallback((campaign: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    return newCampaign;
  }, []);

  const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }, []);

  const startCampaign = useCallback((id: string) => {
    updateCampaign(id, { status: 'active' });
  }, [updateCampaign]);

  const pauseCampaign = useCallback((id: string, reason?: string) => {
    updateCampaign(id, { status: 'paused', pauseReason: reason });
  }, [updateCampaign]);

  const completeCampaign = useCallback((id: string) => {
    updateCampaign(id, { status: 'completed' });
  }, [updateCampaign]);

  // Agent operations
  const createAgent = useCallback((agent: Omit<AIAgent, 'id' | 'createdAt'>) => {
    const newAgent: AIAgent = {
      ...agent,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAgents(prev => [newAgent, ...prev]);
    return newAgent;
  }, []);

  const updateAgent = useCallback((id: string, updates: Partial<AIAgent>) => {
    setAgents(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const deleteAgent = useCallback((id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  }, []);

  const activateAgent = useCallback((id: string) => {
    updateAgent(id, { status: 'active' });
  }, [updateAgent]);

  const deactivateAgent = useCallback((id: string) => {
    updateAgent(id, { status: 'inactive' });
  }, [updateAgent]);

  // Call operations
  const addCall = useCallback((call: Omit<Call, 'id'>) => {
    const newCall: Call = {
      ...call,
      id: Date.now().toString()
    };
    setCalls(prev => [newCall, ...prev]);
    return newCall;
  }, []);

  const updateCall = useCallback((id: string, updates: Partial<Call>) => {
    setCalls(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  return {
    // State
    campaigns,
    agents,
    calls,
    
    // Campaign operations
    createCampaign,
    updateCampaign,
    deleteCampaign,
    startCampaign,
    pauseCampaign,
    completeCampaign,
    
    // Agent operations
    createAgent,
    updateAgent,
    deleteAgent,
    activateAgent,
    deactivateAgent,
    
    // Call operations
    addCall,
    updateCall
  };
}
