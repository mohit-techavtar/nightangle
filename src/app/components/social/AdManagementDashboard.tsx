import React, { useState } from "react";
import { TrendingUp, DollarSign, Users, MousePointer, BarChart3, Target, Eye, AlertCircle } from "lucide-react";

interface AdCampaign {
  id: string;
  name: string;
  platform: string;
  platformIcon: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  startDate: Date;
  endDate: Date;
}

interface AdManagementDashboardProps {
  campaigns: AdCampaign[];
  onCreateAd: () => void;
  onEditAd: (campaignId: string) => void;
  onPauseAd: (campaignId: string) => void;
}

export function AdManagementDashboard({ campaigns, onCreateAd, onEditAd, onPauseAd }: AdManagementDashboardProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const filteredCampaigns = selectedPlatform === "all"
    ? campaigns
    : campaigns.filter(c => c.platform === selectedPlatform);

  const totalStats = campaigns.reduce((acc, campaign) => ({
    budget: acc.budget + campaign.budget,
    spent: acc.spent + campaign.spent,
    impressions: acc.impressions + campaign.impressions,
    clicks: acc.clicks + campaign.clicks,
    conversions: acc.conversions + campaign.conversions,
  }), { budget: 0, spent: 0, impressions: 0, clicks: 0, conversions: 0 });

  const avgCTR = totalStats.clicks / totalStats.impressions * 100 || 0;
  const avgCPC = totalStats.spent / totalStats.clicks || 0;
  const avgROAS = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-[#E8F5E9] text-[#2E7D32] border-[#66BB6A]";
      case "paused": return "bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]";
      case "completed": return "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]";
      default: return "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]";
    }
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
              <DollarSign className="text-[#1565C0]" size={20} />
            </div>
            <div>
              <div className="text-xs text-[#616161] uppercase font-semibold">Total Spent</div>
              <div className="text-xl font-bold text-[#212121]">{formatCurrency(totalStats.spent)}</div>
            </div>
          </div>
          <div className="text-xs text-[#616161]">
            of {formatCurrency(totalStats.budget)} budget
            <div className="w-full h-1 bg-[#E0E0E0] rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#1565C0] rounded-full"
                style={{ width: `${Math.min((totalStats.spent / totalStats.budget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex items-center justify-center">
              <Eye className="text-[#6A1B9A]" size={20} />
            </div>
            <div>
              <div className="text-xs text-[#616161] uppercase font-semibold">Impressions</div>
              <div className="text-xl font-bold text-[#212121]">{formatNumber(totalStats.impressions)}</div>
            </div>
          </div>
          <div className="text-xs text-[#4CAF50]">+12.5% vs last period</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
              <MousePointer className="text-[#4CAF50]" size={20} />
            </div>
            <div>
              <div className="text-xs text-[#616161] uppercase font-semibold">Clicks</div>
              <div className="text-xl font-bold text-[#212121]">{formatNumber(totalStats.clicks)}</div>
            </div>
          </div>
          <div className="text-xs text-[#616161]">CTR: {avgCTR.toFixed(2)}%</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8E1] flex items-center justify-center">
              <TrendingUp className="text-[#F57F17]" size={20} />
            </div>
            <div>
              <div className="text-xs text-[#616161] uppercase font-semibold">ROAS</div>
              <div className="text-xl font-bold text-[#212121]">{avgROAS.toFixed(2)}x</div>
            </div>
          </div>
          <div className="text-xs text-[#4CAF50]">+8.3% vs last period</div>
        </div>
      </div>

      {/* Campaign Management */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E0E0E0] bg-[#F5F5F5]">
          <div className="flex items-center justify-between mb-3 max-md:flex-col max-md:gap-3 max-md:items-start">
            <div>
              <h3 className="text-lg font-semibold text-[#212121]">Ad Campaigns</h3>
              <p className="text-sm text-[#616161]">{campaigns.length} active campaigns across platforms</p>
            </div>
            <button
              onClick={onCreateAd}
              className="px-4 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1] flex items-center gap-2"
            >
              <Target size={16} />
              Create Campaign
            </button>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {["all", "instagram", "facebook", "linkedin", "google"].map(platform => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-all ${
                  selectedPlatform === platform
                    ? "bg-[#1565C0] text-white"
                    : "bg-white text-[#616161] hover:bg-[#E0E0E0]"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Campaign</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Budget</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Performance</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Metrics</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">ROAS</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#616161] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map(campaign => {
                const budgetUsed = (campaign.spent / campaign.budget) * 100;
                const daysLeft = Math.ceil((campaign.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <tr key={campaign.id} className="border-b border-[#EEEEEE] last:border-0 hover:bg-[#FAFAFA]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{campaign.platformIcon}</div>
                        <div>
                          <div className="text-sm font-semibold text-[#212121]">{campaign.name}</div>
                          <div className="text-xs text-[#616161] capitalize">{campaign.platform}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-semibold text-[#212121]">{formatCurrency(campaign.spent)}</div>
                      <div className="text-xs text-[#616161]">of {formatCurrency(campaign.budget)}</div>
                      <div className="w-20 h-1 bg-[#E0E0E0] rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${budgetUsed > 90 ? 'bg-[#C62828]' : budgetUsed > 70 ? 'bg-[#F57F17]' : 'bg-[#4CAF50]'}`}
                          style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-[#616161]">
                        <div>{formatNumber(campaign.impressions)} impressions</div>
                        <div>{formatNumber(campaign.clicks)} clicks</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="text-xs text-[#616161]">
                          CTR: <span className="font-semibold text-[#212121]">{campaign.ctr.toFixed(2)}%</span>
                        </div>
                        <div className="text-xs text-[#616161]">
                          CPC: <span className="font-semibold text-[#212121]">{formatCurrency(campaign.cpc)}</span>
                        </div>
                        <div className="text-xs text-[#616161]">
                          Conv: <span className="font-semibold text-[#212121]">{campaign.conversions}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-lg font-bold text-[#4CAF50]">{campaign.roas.toFixed(2)}x</div>
                      <div className="text-xs text-[#616161]">{daysLeft} days left</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditAd(campaign.id)}
                          className="px-3 h-7 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onPauseAd(campaign.id)}
                          className="px-3 h-7 rounded-md border border-[#E0E0E0] bg-white text-[#616161] hover:bg-[#F5F5F5] text-xs font-medium"
                        >
                          {campaign.status === "active" ? "Pause" : "Resume"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="py-12 text-center text-[#9E9E9E]">
            <BarChart3 size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No campaigns found</p>
            <button
              onClick={onCreateAd}
              className="mt-4 px-4 h-9 rounded-md bg-[#1565C0] text-white text-sm font-semibold hover:bg-[#0D47A1]"
            >
              Create Your First Campaign
            </button>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-br from-[#E3F2FD] to-[#E8F5E9] rounded-lg border border-[#90CAF9] p-4">
        <h4 className="text-sm font-semibold text-[#1565C0] mb-3 flex items-center gap-2">
          <AlertCircle size={16} />
          Performance Insights & Recommendations
        </h4>
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
          <div className="bg-white rounded-lg p-3 border border-[#E0E0E0]">
            <div className="text-xs font-semibold text-[#616161] mb-1">🎯 Top Performer</div>
            <div className="text-sm font-semibold text-[#212121]">Instagram Product Launch</div>
            <div className="text-xs text-[#4CAF50]">ROAS: 4.2x • Consider increasing budget</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#E0E0E0]">
            <div className="text-xs font-semibold text-[#616161] mb-1">⚠️ Needs Attention</div>
            <div className="text-sm font-semibold text-[#212121]">Facebook Retargeting</div>
            <div className="text-xs text-[#F57F17]">Low CTR (0.8%) • Review ad creative</div>
          </div>
        </div>
      </div>
    </div>
  );
}
